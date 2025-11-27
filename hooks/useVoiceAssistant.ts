
import { useState, useRef, useCallback } from 'react';
import { getAIClient } from '../services/gemini';
import { LiveServerMessage, Modality } from '@google/genai';
import { createBlob, decode, decodeAudioData } from '../utils/audio';

export const useVoiceAssistant = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Ready to chat');
  const [volume, setVolume] = useState(0);
  
  // Refs for audio context and processing to maintain state across renders without triggering re-renders
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (inputContextRef.current && inputContextRef.current.state !== 'closed') {
       inputContextRef.current.close();
    }
    if (outputContextRef.current && outputContextRef.current.state !== 'closed') {
       outputContextRef.current.close();
    }
    
    setIsActive(false);
    setStatus('Disconnected');
    setVolume(0);
  }, []);

  const startSession = useCallback(async () => {
    try {
      setStatus('Connecting...');
      const ai = getAIClient();
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 16000});
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      
      inputContextRef.current = inputAudioContext;
      outputContextRef.current = outputAudioContext;
      nextStartTimeRef.current = 0;

      // Connect Live API
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setStatus('Listening...');
            setIsActive(true);

            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              // Calculate volume for visualizer
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
              setVolume(Math.sqrt(sum / inputData.length));

              const pcmBlob = createBlob(inputData);
              // Send audio data to the active session
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            
            if (base64Audio) {
               setStatus('Garden AI is speaking...');
               const audioCtx = outputContextRef.current!;
               
               // Ensure we don't schedule audio in the past
               nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtx.currentTime);
               
               const buffer = await decodeAudioData(
                 decode(base64Audio),
                 audioCtx,
                 24000,
                 1
               );
               
               const source = audioCtx.createBufferSource();
               source.buffer = buffer;
               source.connect(audioCtx.destination);
               source.start(nextStartTimeRef.current);
               nextStartTimeRef.current += buffer.duration;
            }

            if (message.serverContent?.turnComplete) {
                setStatus('Listening...');
            }
          },
          onclose: () => {
            setStatus('Connection closed');
            setIsActive(false);
          },
          onerror: (e) => {
            console.error(e);
            setStatus('Error occurred');
            setIsActive(false);
          }
        },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
            },
            systemInstruction: "You are a helpful, friendly, and knowledgeable expert gardener. Answer questions about plants, garden design, and care concisely. If the user asks about features of this app, explain we have a generator, editor, and plant library."
        }
      });
      
    } catch (err) {
      console.error(err);
      setStatus('Failed to access microphone');
      cleanup();
    }
  }, [cleanup]);

  return {
    isActive,
    status,
    volume,
    startSession,
    disconnect: cleanup
  };
};
