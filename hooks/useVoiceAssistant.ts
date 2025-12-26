
import { useState, useRef, useCallback, useEffect } from 'react';
import { getAIClient } from '../services/gemini';
import { LiveServerMessage, Modality, LiveSession } from '@google/genai';
import { createBlob, decode, decodeAudioData } from '../utils/audio';
import { createLogger } from '../utils/logger';
import { AI_MODELS } from '../data/constants';

const logger = createLogger('VoiceAssistant');
const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;

/**
 * Production-grade hook for real-time voice interaction.
 * Manages complex state including multiple AudioContexts, PCM streams, 
 * and model interruption logic.
 */
export const useVoiceAssistant = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Ready to chat');
  const [volume, setVolume] = useState(0);
  
  const isMountedRef = useRef(true);
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<Promise<LiveSession> | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  /**
   * Comprehensive cleanup of all audio and network resources.
   */
  const cleanup = useCallback(async () => {
    logger.debug('Cleaning up Voice Assistant resources');
    
    if (sessionRef.current) {
        try {
          const session = await sessionRef.current;
          session.close();
        } catch (e) {
          logger.error('Failed to close session gracefully', e);
        }
        sessionRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();
    
    if (inputContextRef.current?.state !== 'closed') {
      try { await inputContextRef.current?.close(); } catch(e) {}
    }
    if (outputContextRef.current?.state !== 'closed') {
      try { await outputContextRef.current?.close(); } catch(e) {}
    }

    inputContextRef.current = null;
    outputContextRef.current = null;
    
    if (isMountedRef.current) {
      setIsActive(false);
      setStatus('Ready to chat');
      setVolume(0);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { 
      isMountedRef.current = false;
      cleanup(); 
    };
  }, [cleanup]);

  /**
   * Initiates the Live API session and audio hardware.
   */
  const startSession = useCallback(async () => {
    try {
      setStatus('Connecting to Gemini Live...');
      const ai = getAIClient();
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!isMountedRef.current) return;
      streamRef.current = stream;

      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      const outputCtx = new AudioContextClass({ sampleRate: 24000 });
      inputContextRef.current = inputCtx;
      outputContextRef.current = outputCtx;
      nextStartTimeRef.current = 0;

      const sessionPromise = ai.live.connect({
        model: AI_MODELS.VOICE,
        callbacks: {
          onopen: () => {
            if (!inputCtx || !isMountedRef.current) return;
            setIsActive(true);
            setStatus('I\'m listening...');

            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;
            
            processor.onaudioprocess = (e) => {
              if (!isMountedRef.current) return;
              const data = e.inputBuffer.getChannelData(0);
              
              let sum = 0;
              for(let i=0; i<data.length; i++) sum += data[i] * data[i];
              setVolume(Math.min(1, Math.sqrt(sum / data.length) * 10));

              const blob = createBlob(data);
              sessionPromise.then(s => {
                if (isMountedRef.current) s.sendRealtimeInput({ media: blob });
              });
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (!isMountedRef.current) return;
            
            const audioData = msg.serverContent?.modelTurn?.parts?.find(p => p.inlineData)?.inlineData?.data;
            if (audioData && outputContextRef.current) {
               setStatus('Gemini is speaking...');
               const audioCtx = outputContextRef.current;
               nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtx.currentTime);
               
               const buffer = await decodeAudioData(decode(audioData), audioCtx, 24000, 1);
               const source = audioCtx.createBufferSource();
               source.buffer = buffer;
               source.connect(audioCtx.destination);
               
               source.onended = () => sourcesRef.current.delete(source);
               sourcesRef.current.add(source);
               
               source.start(nextStartTimeRef.current);
               nextStartTimeRef.current += buffer.duration;
            }

            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch(e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setStatus('Interrupted');
            }

            if (msg.serverContent?.turnComplete) {
              setStatus('Listening...');
            }
          },
          onerror: (e) => {
            logger.error('Session error', e);
            if (isMountedRef.current) {
              setStatus('Connection error. Restarting...');
              cleanup();
            }
          },
          onclose: (e) => {
            logger.info('Session closed', e);
            if (isMountedRef.current) cleanup();
          }
        },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { 
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } 
            },
            systemInstruction: "You are a friendly, expert landscape architect. Help the user design their dream garden. Be concise but inspiring."
        }
      });

      sessionRef.current = sessionPromise;
      
    } catch (err) {
      logger.error('Failed to start voice session', err);
      if (isMountedRef.current) {
        setStatus('Microphone access denied.');
        cleanup();
      }
    }
  }, [cleanup]);

  return { isActive, status, volume, startSession, disconnect: cleanup };
};
