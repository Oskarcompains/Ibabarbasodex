import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, QrCode, Copy, Check, Download, Printer, Play, Shield, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';
import { useApp } from '../context/AppContext';
import { soundEffects } from '../utils/audio';

interface QrItem {
  type: 'player' | 'match' | 'item' | 'generic';
  id: string;
  title: string;
  subtitle: string;
  code: string;
  dorsal?: number;
  posCode?: string;
  badgeName?: string;
  stadium?: string;
  matchDate?: string;
  xpReward: number;
}

interface QrCodeDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: QrItem | null;
}

export const QrCodeDisplayModal: React.FC<QrCodeDisplayModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (item && item.code) {
      QRCode.toDataURL(item.code, {
        width: 320,
        margin: 2,
        color: {
          dark: '#18181b', // Zinc 900
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      })
        .then(url => setDataUrl(url))
        .catch(err => console.error('Error generating QR', err));
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleCopy = () => {
    if (navigator.clipboard && item.code) {
      navigator.clipboard.writeText(item.code);
      setCopied(true);
      soundEffects.playSuccess();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `QR_${item.type}_${item.code}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>C.D. Soto Ibarbaso - Código QR ${item.title}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background-color: #f4f4f5;
            }
            .card {
              width: 320px;
              padding: 24px;
              border: 3px solid #dc2626;
              border-radius: 20px;
              background: #ffffff;
              text-align: center;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .club {
              font-size: 11px;
              font-weight: 800;
              color: #dc2626;
              letter-spacing: 2px;
              text-transform: uppercase;
              margin-bottom: 4px;
            }
            .title {
              font-size: 18px;
              font-weight: 900;
              color: #18181b;
              margin: 4px 0 2px 0;
            }
            .subtitle {
              font-size: 12px;
              color: #71717a;
              font-weight: 600;
              margin-bottom: 16px;
            }
            .qr-img {
              width: 220px;
              height: 220px;
              margin: 0 auto 12px auto;
              display: block;
              border: 2px solid #e4e4e7;
              border-radius: 12px;
            }
            .code-box {
              font-family: monospace;
              font-size: 11px;
              font-weight: bold;
              background: #f4f4f5;
              padding: 6px 10px;
              border-radius: 8px;
              color: #27272a;
              margin-bottom: 12px;
              word-break: break-all;
            }
            .footer {
              font-size: 10px;
              color: #a1a1aa;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="club">C.D. SOTO IBARBASO</div>
            <div class="title">${item.title}</div>
            <div class="subtitle">${item.subtitle}</div>
            <img src="${dataUrl}" class="qr-img" />
            <div class="code-box">${item.code}</div>
            <div class="footer">Escanea en la App Oficial Ibardex para desbloquear (+${item.xpReward} XP)</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-sm bg-zinc-900 border-4 border-red-600 rounded-3xl p-5 shadow-[6px_6px_0px_0px_#000000] pixel-box-red my-auto text-zinc-100"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white bg-zinc-800 border-2 border-zinc-700 rounded-xl transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000000]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-3">
          <span className="font-silkscreen text-[10px] text-red-400 uppercase font-bold tracking-widest block">
            C.D. SOTO IBARBASO • QR OFICIAL
          </span>
          <h3 className="font-tech text-xl font-bold text-white uppercase mt-0.5">
            {item.title}
          </h3>
          <p className="text-xs text-zinc-300 font-medium">
            {item.subtitle}
          </p>
        </div>

        {/* QR Code Container */}
        <div
          ref={printRef}
          className="p-4 bg-white rounded-2xl border-4 border-zinc-950 flex flex-col items-center justify-center shadow-inner my-2"
        >
          {dataUrl ? (
            <img
              src={dataUrl}
              alt={`QR Code ${item.code}`}
              className="w-56 h-56 rounded-xl aspect-square object-contain"
            />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-zinc-400 font-silkscreen text-xs">
              Generando QR...
            </div>
          )}

          <div className="mt-2 text-center w-full">
            <span className="font-mono text-xs font-bold text-zinc-900 bg-zinc-100 px-2 py-1 rounded-md border border-zinc-300 block truncate">
              {item.code}
            </span>
          </div>
        </div>

        <p className="text-center text-[10px] text-zinc-400 my-2 px-1">
          Código QR físico oficial del club. Para desbloquearlo en tu Ibardex o alineación, apunta la cámara de tu móvil hacia este código usando el escáner.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          <button
            onClick={handleCopy}
            className="px-2.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-silkscreen text-[10px] rounded-xl border-2 border-zinc-700 flex flex-col items-center justify-center gap-1 transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000000]"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            <span className="truncate">{copied ? '¡Copiado!' : 'Copiar'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-2.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-silkscreen text-[10px] rounded-xl border-2 border-zinc-700 flex flex-col items-center justify-center gap-1 transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000000]"
          >
            <Download className="w-4 h-4 text-yellow-400" />
            <span className="truncate">Descargar</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-2.5 py-2 bg-red-600 hover:bg-red-500 text-white font-silkscreen text-[10px] rounded-xl border-2 border-black flex flex-col items-center justify-center gap-1 transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000000] font-bold"
          >
            <Printer className="w-4 h-4 text-white" />
            <span className="truncate">Imprimir</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
