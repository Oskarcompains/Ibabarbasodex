import React from 'react';
import { Volume2, VolumeX, QrCode, Sliders, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateLevelInfo } from '../utils/xpLevels';

interface NavbarProps {
  onOpenScanner: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenScanner, onOpenAdmin }) => {
  const { user, soundEnabled, toggleSound } = useApp();
  const levelInfo = calculateLevelInfo(user.xp);

  return (
    <header className="sticky top-0 z-40 bg-[#121212]/95 backdrop-blur-md border-b-2 border-red-600 px-4 py-2.5 flex items-center justify-between shadow-lg">
      {/* Brand & Crest */}
      <div className="flex items-center gap-2.5">
        <div className="relative w-8 h-8 bg-gradient-to-br from-red-600 via-red-700 to-black rounded-lg border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
          <span className="font-pixel text-[11px] text-white font-bold tracking-tighter">
            SI
          </span>
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-black" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-pixel text-sm text-red-500 tracking-wider font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              IBARDEX
            </span>
            <span className="text-[9px] bg-red-950 text-red-300 font-mono px-1.5 py-0.5 rounded border border-red-700 font-bold">
              CD SOTO
            </span>
          </div>
          <p className="text-[10px] text-zinc-400 tracking-tight font-medium">
            Temporada 2025/26
          </p>
        </div>
      </div>

      {/* Right Action Icons & Level Chip */}
      <div className="flex items-center gap-1.5">
        {/* User Level Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border-2 border-zinc-800 rounded-xl shadow-[2px_2px_0px_0px_#000000]">
          <span className="font-pixel text-[10px] text-yellow-400">
            {levelInfo.badge}
          </span>
          <span className="font-tech text-xs font-bold text-white uppercase">
            LV.{user.level}
          </span>
          <span className="text-[10px] text-zinc-400 font-mono font-semibold">
            {user.xp}XP
          </span>
        </div>

        {/* QR Scan Button */}
        <button
          onClick={onOpenScanner}
          title="Escanear QR de Partido"
          className="p-2 bg-zinc-900 hover:bg-zinc-800 text-red-400 hover:text-red-300 border-2 border-zinc-800 hover:border-red-600 rounded-xl transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000000]"
        >
          <QrCode className="w-4 h-4" />
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? 'Silenciar Efectos 8-bit' : 'Activar Efectos 8-bit'}
          className={`p-2 rounded-xl border-2 transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000000] ${
            soundEnabled
              ? 'bg-zinc-900 text-yellow-400 border-zinc-800 hover:bg-zinc-800'
              : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-400'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Admin Button */}
        <button
          onClick={onOpenAdmin}
          title="Panel de Administración del Club"
          className="p-2 bg-red-950 hover:bg-red-900 text-red-200 border-2 border-red-700 rounded-xl transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000000]"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
