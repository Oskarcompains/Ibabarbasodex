import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UnlockEvent } from '../types';
import { PixelSprite, PixelBadge } from './PixelSprites';
import { X, Sparkles } from 'lucide-react';

interface UnlockModalProps {
  unlock: UnlockEvent | null;
  onClose: () => void;
}

export const UnlockModal: React.FC<UnlockModalProps> = ({ unlock, onClose }) => {
  if (!unlock) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 18, stiffness: 200 }}
          className="relative w-full max-w-sm overflow-hidden bg-zinc-900 border-4 border-red-600 rounded-3xl shadow-[6px_6px_0px_0px_#000000] p-6 text-center pixel-box-red"
        >
          {/* Scanline texture */}
          <div className="absolute inset-0 crt-scanlines opacity-40 pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 text-zinc-400 hover:text-white bg-zinc-800 border-2 border-zinc-700 rounded-xl transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000000]"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Banner */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 bg-red-950 border-2 border-red-500 rounded-full shadow-sm">
            <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" />
            <span className="font-pixel text-[10px] tracking-wider text-red-400 uppercase font-bold">
              {unlock.title}
            </span>
          </div>

          {/* Visual Sprite / Badge Showcase */}
          <div className="relative my-4 flex items-center justify-center">
            {/* Background glowing circle */}
            <div className="absolute w-32 h-32 bg-red-600/30 rounded-full filter blur-xl animate-pulse" />

            <div className="relative z-10 p-5 bg-zinc-950 border-2 border-red-600 rounded-2xl pixel-box shadow-[4px_4px_0px_0px_#000000]">
              {unlock.type === 'badge' ? (
                <PixelBadge
                  size={84}
                  color={unlock.badgeColor || '#dc2626'}
                  iconName={unlock.badgeIcon || 'soto'}
                  earned={true}
                  className="animate-bounce"
                />
              ) : unlock.spriteKey ? (
                <PixelSprite
                  name={unlock.spriteKey}
                  size={84}
                  className="animate-pulse"
                />
              ) : (
                <div className="font-pixel text-4xl text-yellow-400 py-2">
                  ⭐
                </div>
              )}
            </div>
          </div>

          {/* Entry ID & Title */}
          {unlock.number && (
            <span className="font-silkscreen text-xs text-red-400 font-bold tracking-widest block mb-1">
              REGISTRO {unlock.number}
            </span>
          )}
          <h3 className="font-tech text-2xl font-bold text-white tracking-wide mb-2 uppercase">
            {unlock.name}
          </h3>

          {/* Subtitle / Description */}
          <p className="text-xs text-zinc-300 leading-relaxed mb-4 px-2 font-medium">
            {unlock.description || unlock.subtitle}
          </p>

          {/* XP Reward pill */}
          {unlock.xpEarned > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 bg-gradient-to-r from-red-600 to-amber-600 rounded-xl border-2 border-yellow-400 shadow-[3px_3px_0px_0px_#000000]">
              <span className="font-pixel text-xs text-yellow-200 font-bold">
                +{unlock.xpEarned} XP GANADOS
              </span>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-pixel text-xs rounded-xl pixel-button border-2 border-black shadow-[3px_3px_0px_0px_#000000] tracking-wider uppercase font-bold"
          >
            ¡CONTINUAR!
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
