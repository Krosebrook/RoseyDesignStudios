
import { useState, useRef, useCallback, useEffect } from 'react';
import { getAIClient } from '../services/gemini';
import { LiveServerMessage, Modality, LiveSession } from '@google/genai';
import { createBlob, decode, decodeAudioData } from '../utils/audio';
import { createLogger } from '../utils/logger';

const logger = createLogger('VoiceAssistant');
const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;

export const useVoiceAssistant = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Ready to chat');
  const [volume, setVolume] = useState(0);
  
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<Promise<LiveSession> | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const cleanup = useCallback(async () => {
    logger.debug('Terminating voice assistant session');
    
    if (sessionRef.current) {
        const session = await sessionRef.current;
        session.close();
        sessionRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();
    
    if (inputContextRef.current?.state !== 'closed') inputContextRef.current?.close();
    if (outputContextRef.current?.state !== 'closed') outputContextRef.current?.close();
    
    setIsActive(false);
    setStatus('Disconnected');
    setVolume(0);
  }, []);

  useEffect(() => {
    return () => { cleanup(); };
  }, [cleanup]);

  const startSession = useCallback(async () => {
    try {
      setStatus('Connecting to Gemini 2.5 Live...');
      const ai = getAIClient();
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      const outputCtx = new AudioContextClass({ sampleRate: 24000 });
      inputContextRef.current = inputCtx;
      outputContextRef.current = outputCtx;
      nextStartTimeRef.current = 0;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus('Listening...');

            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              const data = e.inputBuffer.getChannelData(0);
              
              // Calculate volume for UI
              let sum = 0;
              for(let i=0; i<data.length; i++) sum += data[i] * data[i];
              setVolume(Math.sqrt(sum / data.length));

              const blob = createBlob(data);
              // Crucial: Use promise to prevent race condition sending data
              sessionPromise.then(s => s.sendRealtimeInput({ media: blob }));
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            // 1. Handle model audio output
            const audioData = msg.serverContent?.modelTurn?.parts?.find(p => p.inlineData)?.inlineData?.data;
            if (audioData && outputContextRef.current) {
               setStatus('Gemini is speaking...');
               const audioCtx = outputContextRef.current;
               
               // Schedule next chunk for gapless playback
               nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtx.currentTime);
               
               // Use manual PCM decoding as per guidelines
               const buffer = await decodeAudioData(decode(audioData), audioCtx, 24000, 1);
               const source = audioCtx.createBufferSource();
               source.buffer = buffer;
               source.connect(audioCtx.destination);
               
               source.onended = () => sourcesRef.current.delete(source);
               sourcesRef.current.add(source);
               
               source.start(nextStartTimeRef.current);
               nextStartTimeRef.current += buffer.duration;
            }

            // 2. Handle interruption
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch(e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setStatus('Interrupted');
            }

            if (msg.serverContent?.turnComplete) setStatus('Listening...');
          },
          onerror: (e) => {
            logger.error('Session error', e);
            setStatus('Service Error');
            cleanup();
          },
          onclose: () => cleanup()
        },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { 
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } 
            },
            systemInstruction: "You are a professional landscape architect advisor. Help users with garden design, plant care, and seasonal planning. Keep your spoken responses concise and helpful."
        }
      });

      sessionRef.current = sessionPromise;
      
    } catch (err) {
      logger.error('Session initiation failed', err);
      setStatus('Microphone access denied or connection failed');
      cleanup();
    }
  }, [cleanup]);

  return { isActive, status, volume, startSession, disconnect: cleanup };
};
