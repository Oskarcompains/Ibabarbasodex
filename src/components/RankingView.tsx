import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Award, Sparkles, Medal, Crown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PixelSprite } from './PixelSprites';

export const RankingView: React.FC = () => {
  const { ranking, user } = useApp();

  const top3 = ranking.slice(0, 3);
  const restOfRanking = ranking.slice(3);

  const currentUserInRanking = ranking.find(r => r.id === user.id || r.isCurrentUser);

  return (
    <div className="space-y-4 pb-24 pt-1">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-yellow-950 via-zinc-900 to-zinc-900 border-2 border-yellow-500 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000000]">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-pixel text-xs text-yellow-400 font-bold uppercase drop-shadow">
              TABLA DE CLASIFICACIÓN
            </span>
            <h2 className="font-tech text-2xl font-bold text-white tracking-wide uppercase">
              RANKING DE AFICIONADOS
            </h2>
            <p className="text-xs text-zinc-300 mt-0.5 font-medium">
              Los seguidores más activos del CD Soto Ibarbaso
            </p>
          </div>

          <div className="bg-zinc-950 p-2.5 rounded-xl border-2 border-yellow-500 text-right shadow-[2px_2px_0px_0px_#000000]">
            <span className="font-silkscreen text-[9px] text-zinc-400 uppercase block font-bold">
              TU PUESTO
            </span>
            <span className="font-tech text-xl font-bold text-yellow-400">
              #{currentUserInRanking?.rank || '-'}
            </span>
          </div>
        </div>
      </div>

      {/* TOP 3 RETRO PODIUM */}
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-yellow-600 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000000]">
        <span className="font-silkscreen text-[10px] text-yellow-400 uppercase text-center block mb-3 font-bold">
          👑 PODIUM DE HONOR DE IBARBASO 👑
        </span>

        <div className="grid grid-cols-3 gap-2 items-end pt-4 pb-2 text-center">
          {/* #2 Silver (Left) */}
          {top3[1] && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-1">
                <div className="p-1.5 bg-zinc-900 border-2 border-slate-400 rounded-xl pixel-box shadow-md">
                  <PixelSprite name={top3[1].avatarSprite || 'ibarbash'} size={36} />
                </div>
                <div className="absolute -top-2 -right-2 bg-slate-300 text-zinc-900 font-pixel text-[8px] px-1 py-0.2 rounded-full font-bold border border-white">
                  2º
                </div>
              </div>
              <span className="font-tech text-xs font-bold text-white truncate max-w-full">
                {top3[1].name.split(' ')[0]}
              </span>
              <span className="font-pixel text-[9px] text-slate-300 font-bold">
                {top3[1].xp} XP
              </span>
              <div className="w-full h-16 bg-gradient-to-t from-slate-700 to-slate-500 rounded-t-xl mt-2 border-t-4 border-slate-300 flex items-center justify-center font-pixel text-xs text-white font-bold shadow-[2px_2px_0px_0px_#000000]">
                2
              </div>
            </motion.div>
          )}

          {/* #1 Gold Champion (Center, Tallest) */}
          {top3[0] && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-1">
                <Crown className="w-5 h-5 text-yellow-400 mx-auto -mb-1 animate-bounce" />
                <div className="p-2 bg-zinc-900 border-2 border-yellow-400 rounded-xl pixel-box-gold shadow-lg ring-2 ring-yellow-400/40">
                  <PixelSprite name={top3[0].avatarSprite || 'capitan_aitor'} size={44} />
                </div>
                <div className="absolute -top-1 -right-2 bg-yellow-400 text-black font-pixel text-[9px] px-1.5 py-0.5 rounded-full font-bold border-2 border-black shadow">
                  1º
                </div>
              </div>
              <span className="font-tech text-sm font-bold text-yellow-300 truncate max-w-full">
                {top3[0].name.split(' ')[0]}
              </span>
              <span className="font-pixel text-[10px] text-yellow-400 font-bold">
                {top3[0].xp} XP
              </span>
              <div className="w-full h-24 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-xl mt-2 border-t-4 border-yellow-200 flex items-center justify-center font-pixel text-sm text-black font-bold shadow-[3px_3px_0px_0px_#000000]">
                1
              </div>
            </motion.div>
          )}

          {/* #3 Bronze (Right) */}
          {top3[2] && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-1">
                <div className="p-1.5 bg-zinc-900 border-2 border-amber-700 rounded-xl pixel-box shadow-md">
                  <PixelSprite name={top3[2].avatarSprite || 'coach_patxi'} size={36} />
                </div>
                <div className="absolute -top-2 -right-2 bg-amber-600 text-white font-pixel text-[8px] px-1 py-0.2 rounded-full font-bold border border-amber-400">
                  3º
                </div>
              </div>
              <span className="font-tech text-xs font-bold text-white truncate max-w-full">
                {top3[2].name.split(' ')[0]}
              </span>
              <span className="font-pixel text-[9px] text-amber-400 font-bold">
                {top3[2].xp} XP
              </span>
              <div className="w-full h-12 bg-gradient-to-t from-amber-900 to-amber-700 rounded-t-xl mt-2 border-t-4 border-amber-500 flex items-center justify-center font-pixel text-xs text-white font-bold shadow-[2px_2px_0px_0px_#000000]">
                3
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* FULL RANKING LIST */}
      <div className="space-y-2">
        <span className="font-silkscreen text-[10px] text-zinc-400 uppercase block px-1 font-bold">
          Todos los Aficionados:
        </span>

        {ranking.map(fan => {
          const isMe = fan.id === user.id || fan.isCurrentUser;

          return (
            <div
              key={fan.id}
              className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all shadow-[3px_3px_0px_0px_#000000] ${
                isMe
                  ? 'bg-red-950 border-red-500 ring-2 ring-red-500'
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {/* Rank Position & Avatar */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-pixel text-xs font-bold border-2 ${
                    fan.rank === 1
                      ? 'bg-yellow-500 text-black border-yellow-300'
                      : fan.rank === 2
                      ? 'bg-slate-300 text-zinc-900 border-white'
                      : fan.rank === 3
                      ? 'bg-amber-700 text-white border-amber-500'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  #{fan.rank}
                </div>

                <div className="p-1 bg-zinc-950 rounded-xl border-2 border-zinc-800 shrink-0">
                  <PixelSprite name={fan.avatarSprite || 'ibarbash'} size={32} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-tech text-sm font-bold text-white truncate">
                      {fan.name}
                    </h4>
                    {isMe && (
                      <span className="font-pixel text-[7px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold border border-red-400">
                        TÚ
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    {fan.instagram} • <span className="text-zinc-300 font-semibold">Nivel {fan.level}</span>
                  </p>
                </div>
              </div>

              {/* Badges & XP Score */}
              <div className="text-right shrink-0">
                <div className="font-pixel text-xs text-yellow-400 font-bold">
                  {fan.xp} XP
                </div>
                <div className="text-[10px] text-zinc-400 flex items-center justify-end gap-1 mt-0.5 font-medium">
                  <Award className="w-3.5 h-3.5 text-red-400" />
                  <span>{fan.badgesCount} medallas</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* STICKY USER POSITION INDICATOR (if outside Top 3) */}
      {currentUserInRanking && (
        <div className="fixed bottom-14 left-4 right-4 max-w-sm mx-auto z-30 pointer-events-none">
          <div className="bg-red-600 text-white border-2 border-black rounded-2xl px-4 py-2.5 flex items-center justify-between shadow-[4px_4px_0px_0px_#000000] pointer-events-auto">
            <div className="flex items-center gap-2">
              <span className="font-pixel text-xs bg-black text-yellow-400 px-2 py-0.5 rounded-lg border-2 border-yellow-400 font-bold">
                #{currentUserInRanking.rank}
              </span>
              <span className="font-tech text-sm font-bold truncate">
                Tu Posición en el Ranking
              </span>
            </div>
            <div className="font-pixel text-xs text-yellow-200 font-bold">
              {currentUserInRanking.xp} XP
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
