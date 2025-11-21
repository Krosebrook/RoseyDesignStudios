import React, { useState, useRef } from 'react';
import { getAIClient } from '../services/gemini';
import { LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, Volume2, Activity } from 'lucide-react';
import { createBlob, decode, decodeAudioData } from '../utils/audio';

export const VoiceChat: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Ready to chat');
  const [volume, setVolume] = useState(0);
  
  // Refs for audio context and processing
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (inputContextRef.current) inputContextRef.current.close();
    if (outputContextRef.current) outputContextRef.current.close();
    // We can't explicitly close the session object in the same way as a websocket, 
    // but we can stop sending data.
    setIsActive(false);
    setStatus('Disconnected');
  };

  const startSession = async () => {
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
              
              // Visualizer volume
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
              setVolume(Math.sqrt(sum / inputData.length));

              const pcmBlob = createBlob(inputData);
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
      
      sessionRef.current = sessionPromise;

    } catch (err) {
      console.error(err);
      setStatus('Failed to access microphone');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
       <div className="bg-white rounded-3xl shadow-xl border border-stone-200 p-8 md:p-12">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${isActive ? 'bg-red-50 shadow-red-100 shadow-lg' : 'bg-primary-50'}`}>
              {isActive ? (
                 <div className="relative w-full h-full flex items-center justify-center">
                    <Mic size={40} className="text-red-500 relative z-10" />
                    {/* Visualizer Ring */}
                    <div 
                        className="absolute inset-0 rounded-full border-4 border-red-200 opacity-50"
                        style={{ transform: `scale(${1 + volume * 5})` }}
                    ></div>
                 </div>
              ) : (
                 <Volume2 size={40} className="text-primary-600" />
              )}
          </div>

          <h2 className="text-3xl font-bold text-stone-800 mb-2">Garden Assistant</h2>
          <p className="text-stone-500 mb-8 min-h-[24px] font-medium">{status}</p>

          {!isActive ? (
            <button 
                onClick={startSession}
                className="bg-stone-900 hover:bg-black text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-3 mx-auto shadow-lg transition-transform hover:scale-105"
            >
                <Mic size={20} /> Start Conversation
            </button>
          ) : (
            <button 
                onClick={cleanup}
                className="bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-3 mx-auto transition-colors"
            >
                <MicOff size={20} /> End Chat
            </button>
          )}
          
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-stone-400">
            <Activity size={14} />
            Powered by Gemini 2.5 Live API
          </div>
       </div>

       <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-stone-100 p-4 rounded-xl text-sm text-stone-600">
            "What grows well in shade?"
          </div>
          <div className="bg-stone-100 p-4 rounded-xl text-sm text-stone-600">
            "How often should I water hydrangeas?"
          </div>
       </div>
    </div>
  );
};