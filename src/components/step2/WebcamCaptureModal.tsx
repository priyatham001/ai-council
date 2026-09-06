import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle } from 'lucide-react';

interface WebcamCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
  cropName: string;
}

export const WebcamCaptureModal: React.FC<WebcamCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  cropName,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedPreview(null);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setErrorMessage(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCamera(false);
        setErrorMessage('Direct camera capture is not supported by your browser. Please use the Upload Photo button.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setHasCamera(true);
    } catch (err: any) {
      console.warn('Could not access camera:', err);
      setHasCamera(false);
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Camera access permission was denied. Please allow camera permissions or upload an image file.'
          : 'Unable to start camera stream. Please use the Upload Photo option.'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleTakeSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedPreview(dataUrl);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedPreview(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (capturedPreview) {
      onCapture(capturedPreview);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-stone-200 animate-fadeIn">
        {/* Header */}
        <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-400" />
            <h4 className="font-bold text-sm">
              Live Camera: Inspect {cropName}
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Preview */}
        <div className="p-5">
          {errorMessage ? (
            <div className="py-8 px-4 text-center bg-stone-50 rounded-2xl border border-stone-200">
              <AlertCircle className="w-10 h-10 text-amber-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-stone-800 mb-1">Camera Notice</p>
              <p className="text-xs text-stone-600 max-w-sm mx-auto mb-4">{errorMessage}</p>
              <button
                type="button"
                onClick={onClose}
                className="bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Use File Upload Instead
              </button>
            </div>
          ) : capturedPreview ? (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-stone-300 aspect-video bg-black flex items-center justify-center">
                <img
                  src={capturedPreview}
                  alt="Captured crop"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retake Photo
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow"
                >
                  <Check className="w-4 h-4" />
                  Analyze This Photo
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-stone-900 aspect-video bg-black flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Viewfinder Overlay */}
                <div className="absolute inset-6 border-2 border-dashed border-white/60 rounded-xl pointer-events-none flex items-center justify-center">
                  <span className="bg-black/50 text-white text-[11px] px-3 py-1 rounded-full font-medium backdrop-blur-xs">
                    Center {cropName} harvest sample in frame
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-stone-500 text-center">
                Hold sample steadily in daylight or under good lamp lighting. Avoid heavy shadows.
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleTakeSnapshot}
                  className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 shadow cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  Capture Photo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
