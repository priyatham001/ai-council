import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle, Sparkles, Upload, FileImage, ShieldAlert } from 'lucide-react';
import { generateCropSampleImage, CROP_TEST_PRESETS } from '../../data/cropSampleImages';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [activeSampleGrade, setActiveSampleGrade] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedPreview(null);
      setActiveSampleGrade(null);
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
        setErrorMessage('Direct camera capture is not supported in this window. You can upload a photo or choose a realistic test sample below.');
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
          ? 'Camera access permission was denied or restricted. You can upload an image file or test with sample harvest photos below.'
          : 'Live camera stream is unavailable in this environment. Please choose a sample produce photo or upload your harvest picture.'
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

  const handleSelectSample = (grade: 'A' | 'B' | 'C' | 'REJECT') => {
    const dataUrl = generateCropSampleImage(cropName, grade);
    setCapturedPreview(dataUrl);
    setActiveSampleGrade(grade);
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCapturedPreview(dataUrl);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setCapturedPreview(null);
    setActiveSampleGrade(null);
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
      <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-stone-200 animate-fadeIn">
        {/* Header */}
        <div className="bg-stone-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm sm:text-base text-white">
                  AI Crop Vision Scanner: {cropName}
                </h4>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Agmark certified visual defect, purity, and rot inspection
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1.5 rounded-xl hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Preview */}
        <div className="p-5 space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {capturedPreview ? (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md aspect-video bg-black flex items-center justify-center">
                <img
                  src={capturedPreview}
                  alt="Captured crop"
                  className="w-full h-full object-contain"
                />
                {activeSampleGrade && (
                  <div className="absolute top-3 left-3 bg-stone-900/90 text-white text-xs font-bold px-3 py-1 rounded-full border border-stone-700 flex items-center gap-1.5">
                    <span>Selected Test Sample:</span>
                    <span className={activeSampleGrade === 'REJECT' ? 'text-red-400' : 'text-emerald-400 font-extrabold'}>
                      {activeSampleGrade === 'REJECT' ? 'Rotten / Mold Spoilage' : `Grade ${activeSampleGrade}`}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="flex-1 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retake / Change Sample
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Scan & Analyze Crop with AI</span>
                </button>
              </div>
            </div>
          ) : hasCamera ? (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border-2 border-stone-900 aspect-video bg-black flex items-center justify-center shadow-inner">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Laser scan line */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-scan-laser pointer-events-none" />

                {/* Framing corner reticle */}
                <div className="absolute inset-6 border-2 border-emerald-400/70 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
                  <div className="flex justify-between text-[10px] text-emerald-300 font-bold bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs w-fit">
                    AI Quality Assayer Target
                  </div>
                  <div className="text-center">
                    <span className="bg-black/60 text-white text-[11px] px-3 py-1 rounded-full font-medium backdrop-blur-xs border border-white/20">
                      Center {cropName} harvest inside reticle
                    </span>
                  </div>
                  <div className="flex justify-end text-[10px] text-stone-300 font-mono bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs w-fit self-end">
                    640x480 RAW
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                <span>💡 Hold produce steady in clear natural lighting</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload File
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleTakeSnapshot}
                  className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <Camera className="w-4 h-4 text-emerald-200" />
                  <span>Capture Crop Photo</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="py-5 px-4 text-center bg-stone-50 rounded-2xl border border-stone-200">
                <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-stone-900 mb-1">Direct Camera Stream Inactive</p>
                <p className="text-xs text-stone-600 max-w-sm mx-auto mb-3">
                  {errorMessage || 'Camera is not enabled or available in this browser window.'}
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Choose File from Computer / Phone
                </button>
              </div>
            </div>
          )}

          {/* Quick Realistic Test Harvest Samples */}
          <div className="pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <FileImage className="w-3.5 h-3.5 text-emerald-600" />
                Instant Test Produce Samples ({cropName}):
              </span>
              <span className="text-[10px] text-stone-500 font-medium">
                Click to test AI Vision
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleSelectSample('A')}
                className="p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/60 hover:bg-emerald-100/80 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold text-emerald-900">Grade A</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <p className="text-[10px] text-emerald-800 line-clamp-2 leading-tight">
                  Pristine, uniform, zero defects
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleSelectSample('B')}
                className="p-2.5 rounded-xl border border-blue-300 bg-blue-50/60 hover:bg-blue-100/80 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold text-blue-900">Grade B</span>
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <p className="text-[10px] text-blue-800 line-clamp-2 leading-tight">
                  Standard FAQ mandi quality
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleSelectSample('C')}
                className="p-2.5 rounded-xl border border-amber-300 bg-amber-50/60 hover:bg-amber-100/80 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold text-amber-900">Grade C</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
                <p className="text-[10px] text-amber-800 line-clamp-2 leading-tight">
                  Irregular size, minor blemishes
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleSelectSample('REJECT')}
                className="p-2.5 rounded-xl border border-red-300 bg-red-50/60 hover:bg-red-100/80 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold text-red-900 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-red-600" />
                    Rot / Mold
                  </span>
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                </div>
                <p className="text-[10px] text-red-800 line-clamp-2 leading-tight">
                  Fungal decay, disqualified
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

