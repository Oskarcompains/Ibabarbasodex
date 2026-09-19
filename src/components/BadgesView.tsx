import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Lock, Sparkles, X, Check, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge } from '../types';
import { PixelBadge } from './PixelSprites';
import { soundEffects } from '../utils/audio';

export const BadgesView: React.FC = () => {
  const { badges, user } = useApp();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const earnedCount = badges.filter(b => user.earnedBadges.includes(b.id)).length;

  const handleSelectBadge = (badge: Badge) => {
    soundEffects.playClick();
    setSelectedBadge(badge);
  };

  return (
    <div className="space-y-4 pb-20 pt-1">
      {/* Header Case */}
      <div className="bg-gradient-to-r from-red-950 via-zinc-900 to-zinc-900 border-2 border-red-600 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000000]">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-pixel text-xs text-yellow-400 font-bold uppercase drop-shadow">
              ESTUCHE DE MEDALLAS
            </span>
            <h2 className="font-tech text-2xl font-bold text-white tracking-wide uppercase">
              MEDALLERO DE IBARBASO
            </h2>
            <p className="text-xs text-zinc-300 mt-0.5 font-medium">
              Trofeos conseguidos en los derbis y hitos del club
            </p>
          </div>

          <div className="bg-zinc-950 p-2.5 rounded-xl border-2 border-yellow-600 text-right shadow-[2px_2px_0px_0px_#000000]">
            <span className="font-silkscreen text-[9px] text-zinc-400 uppercase block font-bold">
              CONSEGUIDAS
            </span>
            <span className="font-tech text-xl font-bold text-yellow-400">
              {earnedCount}/{badges.length}
            </span>
          </div>
        </div>
      </div>

      {/* Velvet Game Boy Badge Case Grid */}
      <div className="p-5 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 border-4 border-amber-600 rounded-2xl shadow-[6px_6px_0px_0px_#000000] pixel-box-gold">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {badges.map(badge => {
            const isEarned = user.earnedBadges.includes(badge.id);

            return (
              <motion.div
                key={badge.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectBadge(badge)}
                className={`relative cursor-pointer p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all shadow-[3px_3px_0px_0px_#000000] ${
                  isEarned
                    ? 'bg-zinc-900 border-yellow-500 hover:border-yellow-300'
                    : 'bg-zinc-950 border-zinc-800 opacity-60 hover:opacity-80'
                }`}
              >
                <div className="my-1">
                  <PixelBadge
                    size={64}
                    color={badge.color}
                    iconName={badge.iconName}
                    earned={isEarned}
                    className={isEarned ? 'animate-pulse' : ''}
                  />
                </div>

                <span className="font-tech text-sm font-bold text-white mt-2 truncate w-full">
                  {isEarned ? badge.name : '??? Bloqueada'}
                </span>

                <span className="font-pixel text-[8px] text-yellow-400 mt-1 font-bold">
                  +{badge.xpReward} XP
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Badge Inspection Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-sm overflow-hidden bg-zinc-900 border-4 border-yellow-500 rounded-2xl p-5 shadow-[6px_6px_0px_0px_#000000] text-center"
            >
              <div className="absolute inset-0 crt-scanlines opacity-40 pointer-events-none" />

              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-3 right-3 p-1.5 text-zinc-400 hover:text-white bg-zinc-800 border-2 border-zinc-700 rounded-xl transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000000]"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Showcase Badge */}
              <div className="flex items-center justify-center my-4">
                <PixelBadge
                  size={90}
                  color={selectedBadge.color}
                  iconName={selectedBadge.iconName}
                  earned={user.earnedBadges.includes(selectedBadge.id)}
                />
              </div>

              <h3 className="font-tech text-2xl font-bold text-white tracking-wide uppercase mb-1">
                {selectedBadge.name}
              </h3>

              <div className="inline-block px-3 py-1 bg-yellow-950 border-2 border-yellow-700 rounded-full font-pixel text-[9px] text-yellow-300 mb-3 font-bold">
                +{selectedBadge.xpReward} XP DE RECOMPENSA
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed mb-3 px-2">
                {selectedBadge.description}
              </p>

              {/* How to get */}
              <div className="bg-zinc-950 border-2 border-zinc-800 rounded-xl p-3 text-left mb-4 text-xs shadow-inner">
                <span className="font-silkscreen text-[10px] text-yellow-400 uppercase block mb-1 font-bold">
                  🎯 ¿Cómo se consigue?
                </span>
                <p className="text-zinc-300">{selectedBadge.howToGet}</p>
                {user.earnedBadges.includes(selectedBadge.id) && (
                  <div className="mt-2 pt-2 border-t border-zinc-800 flex items-center justify-between text-green-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Check className="w-4 h-4" /> ¡Medalla en tu estuche!
                    </span>
                    <span className="text-zinc-400 text-[10px] font-mono">
                      {selectedBadge.earnedAt || '2026-08-16'}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-pixel text-xs rounded-xl pixel-button pixel-button-yellow border-2 border-black shadow font-bold"
              >
                CERRAR
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
