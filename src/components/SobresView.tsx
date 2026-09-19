import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  Shield,
  Award,
  Flame,
  Star,
  Users,
  Coins,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PixelSprite } from './PixelSprites';
import { soundEffects } from '../utils/audio';
import { IbardexEntry } from '../types';

export const SobresView: React.FC = () => {
  const {
    user,
    openPlayerPack,
    buyPackWithXp,
    buyPackWithCoins,
    ibardexEntries,
    setActiveTab,
  } = useApp();

  const [isOpening, setIsOpening] = useState(false);
  const [openingPackType, setOpeningPackType] = useState<'bronce' | 'plata' | 'oro' | 'especial'>('oro');
  const [revealedCards, setRevealedCards] = useState<IbardexEntry[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Statistics
  const unlockedCount = user.unlockedEntries.length;
  const totalCount = ibardexEntries.length;

  const handleOpenPack = (packType: 'bronce' | 'plata' | 'oro' | 'especial' = 'oro') => {
    if (user.playerPacks <= 0) {
      soundEffects.playError();
      setFeedback('No tienes sobres disponibles. ¡Compra uno con monedas o canjea XP!');
      return;
    }

    soundEffects.playClick();
    setIsOpening(true);
    setOpeningPackType(packType);
    setRevealedCards([]);
    setFeedback(null);

    setTimeout(() => {
      const res = openPlayerPack(packType);
      setIsOpening(false);
      if (res.success && res.unlocked.length > 0) {
        setRevealedCards(res.unlocked);
      }
    }, 1400);
  };

  const handleBuyWithCoins = (cost: number, type: 'bronce' | 'plata' | 'oro' | 'especial') => {
    const res = buyPackWithCoins(cost, type);
    setFeedback(res.message);
    if (res.success) {
      handleOpenPack(type);
    }
  };

  const handleBuyWithXp = () => {
    const res = buyPackWithXp(50);
    setFeedback(res.message);
    if (res.success) {
      handleOpenPack('oro');
    }
  };

  const getRarityBadge = (rarity?: string) => {
    switch (rarity) {
      case 'Legendario':
        return 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold border-yellow-300';
      case 'Épico':
        return 'bg-purple-900 text-purple-200 border-purple-500';
      case 'Raro':
        return 'bg-blue-900 text-blue-200 border-blue-500';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-600';
    }
  };

  return (
    <div className="space-y-4 pb-24 pt-1">
      {/* Header Banner: Packs & Manager Coins */}
      <div className="bg-gradient-to-r from-red-950 via-zinc-900 to-zinc-900 border-2 border-red-600 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000000]">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-pixel text-[10px] text-red-500 font-bold uppercase drop-shadow">
              ÁLBUM DE CROMOS OFICIAL
            </span>
            <h2 className="font-tech text-2xl font-bold text-white tracking-wide uppercase">
              SALA DE SOBRES
            </h2>
            <p className="text-xs text-zinc-300 mt-0.5 font-medium">
              Abre sobres para descubrir futbolistas, leyendas y objetos para completar tu álbum.
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <div className="bg-zinc-950 px-3 py-1.5 rounded-xl border-2 border-red-700 text-center shadow-[2px_2px_0px_0px_#000000]">
              <span className="font-silkscreen text-[8px] text-zinc-400 uppercase block font-bold">
                SOBRES LISTOS
              </span>
              <span className="font-tech text-2xl font-bold text-yellow-400">
                {user.playerPacks}
              </span>
            </div>
            <div className="bg-black/90 px-2.5 py-0.5 rounded-lg border border-yellow-500/50 text-[10px] font-tech text-yellow-400 font-bold">
              {user.managerCoins || 0} 🪙
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3.5 pt-3 border-t border-zinc-800">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-zinc-300 font-medium">Álbum y Plantilla desbloqueada:</span>
            <span className="font-tech text-yellow-400 font-bold">
              {unlockedCount} / {totalCount} ({Math.round((unlockedCount / totalCount) * 100)}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-black rounded-full border border-zinc-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 transition-all duration-500"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* THE BOOSTER PACK HERO STAGE */}
      <div className="relative bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-5 shadow-[5px_5px_0px_0px_#000000] text-center overflow-hidden">
        <div className="absolute inset-0 crt-scanlines opacity-30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-600/20 rounded-full filter blur-3xl pointer-events-none" />

        {/* 3D Animated Foil Pack Graphic */}
        <motion.div
          animate={isOpening ? { rotate: [0, -8, 8, -12, 12, 0], scale: [1, 1.1, 0.95, 1.15, 0.9] } : { y: [0, -6, 0] }}
          transition={isOpening ? { duration: 1.3, ease: 'easeInOut' } : { repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="relative inline-block my-2"
        >
          <div className={`w-44 h-60 bg-gradient-to-br rounded-2xl shadow-[6px_6px_0px_0px_#000000] p-3 flex flex-col justify-between items-center relative overflow-hidden border-4 ${
            openingPackType === 'oro'
              ? 'from-amber-600 via-red-900 to-black border-yellow-400'
              : openingPackType === 'plata'
              ? 'from-slate-500 via-zinc-800 to-black border-zinc-300'
              : 'from-amber-900 via-zinc-900 to-black border-amber-700'
          }`}>
            <div className="w-full bg-yellow-400 text-black font-pixel text-[8px] font-bold py-0.5 rounded uppercase tracking-wider text-center border border-black shadow">
              ★ EDICIÓN 2025/26 ★
            </div>

            <div className="my-auto text-center">
              <div className="w-16 h-16 mx-auto bg-black/60 rounded-xl border-2 border-red-400 flex items-center justify-center p-1 shadow-inner">
                <PixelSprite name="ibarbash" size={48} />
              </div>
              <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider mt-1.5 drop-shadow">
                CD SOTO IBARBASO
              </h3>
              <p className="font-silkscreen text-[8px] text-yellow-300 font-bold">
                3 CROMOS + MONEDAS
              </p>
            </div>

            <div className="w-full bg-black/80 border border-red-600 rounded px-2 py-1 flex items-center justify-between text-[8px] font-mono text-zinc-300">
              <span>SOTO PACK</span>
              <span className="text-yellow-400 font-bold font-pixel">XP + OVR</span>
            </div>

            <div className="absolute -top-12 -left-12 w-20 h-72 bg-white/20 rotate-45 pointer-events-none transform -skew-x-12" />
          </div>
        </motion.div>

        {/* Quick Open Ready Pack */}
        {user.playerPacks > 0 && (
          <div className="mt-4 max-w-xs mx-auto">
            <button
              disabled={isOpening}
              onClick={() => handleOpenPack('oro')}
              className="w-full py-3.5 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-pixel text-xs rounded-2xl pixel-button border-2 border-black flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_#000000] font-bold animate-pulse"
            >
              <Package className="w-4 h-4 text-yellow-300" />
              <span>{isOpening ? 'ABRIENDO SOBRE...' : `ABRIR SOBRE (${user.playerPacks} LISTOS)`}</span>
            </button>
          </div>
        )}

        {feedback && (
          <p className="mt-3 text-xs text-yellow-300 bg-zinc-950 p-2 rounded-xl border border-zinc-700 font-medium">
            {feedback}
          </p>
        )}
      </div>

      {/* REVEALED CARDS WALKOUT MODAL */}
      <AnimatePresence>
        {revealedCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-zinc-900 border-4 border-yellow-400 rounded-3xl p-5 shadow-[6px_6px_0px_0px_#000000] space-y-4 pixel-box"
          >
            <div className="flex items-center justify-between pb-2 border-b-2 border-zinc-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400 animate-spin" />
                <h3 className="font-tech text-lg font-bold text-white uppercase">
                  ¡NUEVOS FUTBOLISTAS PARA TU PLANTILLA!
                </h3>
              </div>
              <button
                onClick={() => setRevealedCards([])}
                className="text-xs text-zinc-400 hover:text-white font-bold px-2.5 py-1 bg-zinc-800 rounded-lg border border-zinc-700"
              >
                Cerrar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {revealedCards.map(card => (
                <div
                  key={card.id}
                  className="bg-zinc-950 border-2 border-red-600 rounded-2xl p-3.5 shadow-[3px_3px_0px_0px_#000000] flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-silkscreen text-[9px] text-red-400 font-bold">
                      {card.id} {card.dorsal ? `#${card.dorsal}` : ''}
                    </span>
                    <span
                      className={`font-pixel text-[8px] px-2 py-0.5 rounded-full border ${getRarityBadge(
                        card.rarity
                      )}`}
                    >
                      {card.rarity || 'Común'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 my-2">
                    <div className="p-2 bg-zinc-900 border-2 border-red-500 rounded-xl shrink-0">
                      <PixelSprite name={card.spriteKey} size={44} />
                    </div>
                    <div>
                      <h4 className="font-tech text-base font-bold text-white leading-tight">
                        {card.name} {card.dorsal ? `#${card.dorsal}` : ''}
                      </h4>
                      <p className="text-[11px] text-yellow-400 font-mono font-bold">
                        {card.position || card.category}
                        {card.posCode ? ` (${card.posCode})` : ''}
                      </p>
                      <span className="font-tech text-emerald-400 text-sm font-bold block">
                        OVR: {card.stats?.media || 72}
                      </span>
                    </div>
                  </div>

                  {card.stats && (
                    <div className="grid grid-cols-4 gap-1 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800 text-[8px] text-center my-1">
                      <div>
                        <span className="text-zinc-400 block font-bold">FUE</span>
                        <span className="font-bold text-red-400">{card.stats.fuerza}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block font-bold">DEF</span>
                        <span className="font-bold text-blue-400">{card.stats.defensa}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block font-bold">VEL</span>
                        <span className="font-bold text-yellow-400">{card.stats.velocidad}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block font-bold">PAS</span>
                        <span className="font-bold text-green-400">{card.stats.pasion}</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-2 pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> En tu Club
                    </span>
                    <span className="font-pixel text-[9px] text-yellow-400">+{card.xpReward} XP</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  setRevealedCards([]);
                  setActiveTab('manager');
                }}
                className="py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-pixel text-xs rounded-xl border border-black font-bold shadow flex items-center justify-center gap-1.5"
              >
                <Users className="w-4 h-4 text-yellow-300" />
                <span>ALINEAR EN MÁNAGER</span>
              </button>

              <button
                onClick={() => {
                  setRevealedCards([]);
                  setActiveTab('jugadores');
                }}
                className="py-2.5 bg-zinc-800 text-zinc-300 font-pixel text-xs rounded-xl border border-zinc-700 font-bold"
              >
                VER EN ÁLBUM
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FIFA PACK MARKET / PACK STORE */}
      <div className="bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000000] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-pixel text-[9px] text-yellow-400 font-bold uppercase">
              TIENDA DE SOBRES FIFA
            </span>
            <h3 className="font-tech text-lg font-bold text-white uppercase">
              ADQUIRIR SOBRES ADICIONALES
            </h3>
          </div>
          <span className="font-silkscreen text-[9px] text-zinc-400">
            TU SALDO: <strong className="text-yellow-400 font-bold">{user.managerCoins || 0} 🪙</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Bronze Pack */}
          <div className="bg-zinc-950 border-2 border-amber-800 rounded-2xl p-3 flex flex-col justify-between text-center space-y-2">
            <div>
              <span className="bg-amber-900 text-amber-200 text-[8px] font-pixel px-2 py-0.5 rounded uppercase font-bold">
                SOBRE BRONCE
              </span>
              <h4 className="font-tech text-base font-bold text-white mt-1">Soto Inicial</h4>
              <p className="text-[11px] text-zinc-400">3 futbolistas de la cantera y afición.</p>
            </div>
            <button
              onClick={() => handleBuyWithCoins(100, 'bronce')}
              disabled={user.managerCoins < 100}
              className="w-full py-2 bg-amber-700 hover:bg-amber-600 disabled:opacity-40 text-white font-pixel text-[9px] rounded-xl border border-black font-bold shadow"
            >
              COMPRAR (100 🪙)
            </button>
          </div>

          {/* Silver Pack */}
          <div className="bg-zinc-950 border-2 border-zinc-600 rounded-2xl p-3 flex flex-col justify-between text-center space-y-2">
            <div>
              <span className="bg-zinc-700 text-zinc-200 text-[8px] font-pixel px-2 py-0.5 rounded uppercase font-bold">
                SOBRE PLATA
              </span>
              <h4 className="font-tech text-base font-bold text-white mt-1">Soto Destacado</h4>
              <p className="text-[11px] text-zinc-400">Mayor probabilidad de cartas Raras.</p>
            </div>
            <button
              onClick={() => handleBuyWithCoins(200, 'plata')}
              disabled={user.managerCoins < 200}
              className="w-full py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 text-white font-pixel text-[9px] rounded-xl border border-black font-bold shadow"
            >
              COMPRAR (200 🪙)
            </button>
          </div>

          {/* Gold Pack */}
          <div className="bg-zinc-950 border-2 border-yellow-400 rounded-2xl p-3 flex flex-col justify-between text-center space-y-2">
            <div>
              <span className="bg-yellow-400 text-black text-[8px] font-pixel px-2 py-0.5 rounded uppercase font-bold">
                SOBRE ORO ÉLITE
              </span>
              <h4 className="font-tech text-base font-bold text-white mt-1">Soto Leyendas</h4>
              <p className="text-[11px] text-zinc-400">Alta probabilidad de Épicos y Legendarios.</p>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleBuyWithCoins(350, 'oro')}
                disabled={user.managerCoins < 350}
                className="w-full py-1.5 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 text-black font-pixel text-[9px] rounded-xl border border-black font-bold shadow"
              >
                COMPRAR (350 🪙)
              </button>
              <button
                onClick={handleBuyWithXp}
                disabled={user.xp < 50}
                className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-yellow-400 font-pixel text-[8px] rounded-xl border border-zinc-700 font-bold"
              >
                O CANJEAR CON 50 XP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
