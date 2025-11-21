
import React, { useRef, useEffect, useState } from 'react';
import { X, Camera, AlertCircle } from 'lucide-react';

interface CameraModalProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError('Could not access camera. Please ensure permissions are granted and you are using a supported device/browser.');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        // Convert to JPEG with reasonable quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(dataUrl);
        onClose();
      }
    }
  };

  // Cleanup stream on unmount is handled by useEffect return, 
  // but we also want to ensure we stop it if close is clicked manually before capture
  const handleClose = () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center p-4 animate-fade-in">
      <button 
        onClick={handleClose} 
        className="absolute top-6 right-6 text-white/80 hover:text-white p-2 bg-white/10 rounded-full backdrop-blur-sm transition-colors"
      >
        <X size={24} />
      </button>
      
      {error ? (
        <div className="text-white text-center p-8 bg-red-900/20 border border-red-500/50 rounded-2xl max-w-md">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
          <p className="text-lg font-medium mb-2">Camera Error</p>
          <p className="text-stone-300 text-sm">{error}</p>
          <button 
            onClick={handleClose} 
            className="mt-6 px-6 py-2 bg-white text-red-900 font-bold rounded-lg hover:bg-stone-100 transition-colors"
          >
            Close
          </button>
        </div>
      ) : (
        <div className="w-full max-w-2xl relative flex flex-col items-center">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-stone-800 bg-black aspect-[3/4] md:aspect-[4/3]">
             <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
          </div>
          
          <div className="absolute bottom-8 flex justify-center w-full pointer-events-none">
            <button 
              onClick={handleCapture}
              className="pointer-events-auto bg-white text-stone-900 rounded-full p-5 shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-stone-300 group"
              title="Take Photo"
            >
              <Camera size={32} className="group-hover:text-primary-600 transition-colors" />
            </button>
          </div>
          
          <p className="mt-4 text-stone-400 text-sm">Ensure your subject is well-lit</p>
        </div>
      )}
    </div>
  );
};
