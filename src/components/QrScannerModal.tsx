import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { X, QrCode, Camera, Check, AlertCircle, Upload, Scan, HelpCircle } from 'lucide-react';
import jsQR from 'jsqr';
import { useApp } from '../context/AppContext';
import { soundEffects } from '../utils/audio';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ isOpen, onClose }) => {
  const { scanQrCode } = useApp();
  const [manualCode, setManualCode] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const isScanningActive = useRef<boolean>(false);

  const stopCamera = useCallback(() => {
    isScanningActive.current = false;
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  const handleScan = useCallback((rawCode: string) => {
    if (!rawCode || !rawCode.trim()) return;

    let cleanCode = rawCode.trim();
    // Support QR codes formatted as URLs (e.g., https://...?code=IBAR-...)
    if (cleanCode.includes('code=')) {
      const match = cleanCode.match(/[?&]code=([^&]+)/);
      if (match) cleanCode = decodeURIComponent(match[1]);
    } else if (cleanCode.includes('qr=')) {
      const match = cleanCode.match(/[?&]qr=([^&]+)/);
      if (match) cleanCode = decodeURIComponent(match[1]);
    }

    const res = scanQrCode(cleanCode);
    setFeedback({
      success: res.success,
      message: res.message,
    });

    if (res.success) {
      stopCamera();
      soundEffects.playSuccess();
      setTimeout(() => {
        onClose();
      }, 1800);
    } else {
      soundEffects.playError();
      // Allow re-scanning after 2 seconds on error
      setTimeout(() => {
        isScanningActive.current = true;
      }, 2000);
    }
  }, [scanQrCode, stopCamera, onClose]);

  // Real-time video frame QR scanning loop
  const scanVideoFrame = useCallback(() => {
    if (!isScanningActive.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          try {
            const qrResult = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert',
            });

            if (qrResult && qrResult.data) {
              isScanningActive.current = false;
              handleScan(qrResult.data);
              return;
            }
          } catch (err) {
            console.error('QR decode error:', err);
          }
        }
      }
    }

    if (isScanningActive.current) {
      animationFrameId.current = requestAnimationFrame(scanVideoFrame);
    }
  }, [handleScan]);

  // Start Camera
  const startCamera = async () => {
    try {
      setCameraError(null);
      stopCamera();

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
      } catch (e) {
        // Fallback for laptops/desktops with simple webcam
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }

      setCameraActive(true);
      isScanningActive.current = true;
      animationFrameId.current = requestAnimationFrame(scanVideoFrame);
    } catch (err: any) {
      console.warn('Camera error:', err);
      setCameraError(
        'No se pudo acceder a la cámara. Concede permisos de cámara en tu navegador o sube una foto del código QR abajo.'
      );
      setCameraActive(false);
      isScanningActive.current = false;
    }
  };

  // Decode QR from uploaded image file
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    setFeedback(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessingImage(false);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrResult = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });

        setIsProcessingImage(false);
        if (qrResult && qrResult.data) {
          handleScan(qrResult.data);
        } else {
          setFeedback({
            success: false,
            message: 'No se detectó ningún código QR en la foto. Asegúrate de enfocar bien el QR oficial.',
          });
          soundEffects.playError();
        }
      };
      img.onerror = () => {
        setIsProcessingImage(false);
        setFeedback({
          success: false,
          message: 'Error al procesar la imagen.',
        });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setFeedback(null);
      setManualCode('');
    } else {
      // Auto-start camera when modal opens
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, stopCamera]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-sm overflow-hidden bg-zinc-900 border-4 border-red-600 rounded-3xl p-5 shadow-[6px_6px_0px_0px_#000000] pixel-box-red"
      >
        {/* Hidden Canvas for Frame Processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Hidden File Input for Image Upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageUpload}
          className="hidden"
        />

        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 text-zinc-400 hover:text-white bg-zinc-800 border-2 border-zinc-700 rounded-xl transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000000]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2 bg-red-600 text-white rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-tech text-lg font-bold text-white uppercase tracking-wider">
              Escáner de QR Oficial
            </h3>
            <p className="text-[11px] text-zinc-300 font-medium">
              Apunta al QR físico para desbloquear
            </p>
          </div>
        </div>

        {/* Camera Viewport / Live Scanner */}
        <div className="relative aspect-square w-full bg-zinc-950 rounded-2xl overflow-hidden border-2 border-dashed border-red-500 flex flex-col items-center justify-center my-3 shadow-inner">
          {cameraActive ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
                autoPlay
              />

              {/* Target Scan Reticle Overlay */}
              <div className="absolute inset-8 border-2 border-red-500 rounded-2xl pointer-events-none flex items-center justify-center">
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-yellow-400 rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-yellow-400 rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-yellow-400 rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-yellow-400 rounded-br-lg" />

                {/* Laser Scanning Line */}
                <div className="w-full h-0.5 bg-red-500 shadow-[0_0_12px_#ef4444] animate-pulse" />
              </div>

              <div className="absolute bottom-2 inset-x-2 text-center pointer-events-none">
                <span className="bg-black/80 text-zinc-200 text-[10px] font-mono px-2.5 py-1 rounded-full border border-zinc-700 backdrop-blur-sm">
                  Detectando código QR en vivo...
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center">
              <QrCode className="w-16 h-16 text-zinc-600 mx-auto mb-2" />
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl border-2 border-zinc-600 flex items-center gap-2 mx-auto transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000000]"
              >
                <Camera className="w-4 h-4 text-red-400" />
                Reactivar Cámara
              </button>
              {cameraError && (
                <p className="text-[10px] text-amber-400 mt-2 px-2 leading-tight font-medium">
                  {cameraError}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 mb-3 rounded-xl text-xs flex items-center gap-2 border-2 shadow-[2px_2px_0px_0px_#000000] font-medium ${
              feedback.success
                ? 'bg-green-950 border-green-500 text-green-300'
                : 'bg-red-950 border-red-500 text-red-300'
            }`}
          >
            {feedback.success ? (
              <Check className="w-4 h-4 shrink-0 font-bold" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 font-bold" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Action: Scan from Image / Photo */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingImage}
            className="py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-bold rounded-xl border-2 border-zinc-700 flex items-center justify-center gap-1.5 transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000000]"
          >
            <Upload className="w-3.5 h-3.5 text-yellow-400" />
            <span>{isProcessingImage ? 'Leyendo...' : 'Subir Foto QR'}</span>
          </button>

          <button
            onClick={startCamera}
            className="py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-bold rounded-xl border-2 border-zinc-700 flex items-center justify-center gap-1.5 transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000000]"
          >
            <Scan className="w-3.5 h-3.5 text-red-400" />
            <span>Reenfocar</span>
          </button>
        </div>

        {/* Manual Code Input (Official code printed on cards) */}
        <div className="pt-2 border-t-2 border-zinc-800">
          <label className="text-[10px] text-zinc-400 block mb-1 font-medium">
            ¿Código impreso en el reverso del cromo o entrada?
          </label>
          <div className="flex gap-1.5">
            <input
              type="text"
              placeholder="Ej: IBAR-JUGADOR-19-ESTENAGA"
              value={manualCode}
              onChange={e => setManualCode(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleScan(manualCode);
              }}
              className="flex-1 px-3 py-2 bg-zinc-950 border-2 border-zinc-700 rounded-xl text-xs text-white uppercase placeholder:text-zinc-600 focus:outline-none focus:border-red-500 shadow-inner font-mono"
            />
            <button
              onClick={() => handleScan(manualCode)}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-pixel text-[10px] rounded-xl border-2 border-black font-bold shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5"
            >
              CANJEAR
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

