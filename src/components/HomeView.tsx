import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Key,
  ChevronRight,
  Package,
  BookOpen,
  Cloud,
  ArrowRight,
  LogIn,
  QrCode,
  Layers,
  Award,
  Calendar,
  Coins,
  Ticket,
  Tv,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateLevelInfo } from '../utils/xpLevels';
import { PixelSprite } from './PixelSprites';

interface HomeViewProps {
  onOpenScanner: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenScanner }) => {
  const {
    user,
    ibardexEntries,
    setActiveTab,
    redeemSecretCode,
    loginWithGoogle,
    isSyncing,
    lastSyncedAt,
  } = useApp();

  const [inputCode, setInputCode] = useState('');
  const [codeFeedback, setCodeFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [authMsg, setAuthMsg] = useState<string | null>(null);

  const levelInfo = calculateLevelInfo(user.xp);

  // Card Collection metrics
  const totalCards = ibardexEntries.length;
  const unlockedCards = user.unlockedEntries.length;
  const completionPercentage = Math.round((unlockedCards / totalCards) * 100);

  const squadEntries = ibardexEntries.filter(e => e.category === 'plantilla');
  const squadUnlocked = squadEntries.filter(e => user.unlockedEntries.includes(e.id)).length;

  const staffEntries = ibardexEntries.filter(e => e.category === 'cuerpo_tecnico');
  const staffUnlocked = staffEntries.filter(e => user.unlockedEntries.includes(e.id)).length;

  const rivalEntries = ibardexEntries.filter(e => e.category === 'rivales');
  const rivalUnlocked = rivalEntries.filter(e => user.unlockedEntries.includes(e.id)).length;

  const itemEntries = ibardexEntries.filter(e => e.category === 'objetos');
  const itemUnlocked = itemEntries.filter(e => user.unlockedEntries.includes(e.id)).length;

  // Latest unlocked entry
  const latestUnlockedEntryId = user.unlockedEntries[user.unlockedEntries.length - 1];
  const latestUnlockedEntry = ibardexEntries.find(e => e.id === latestUnlockedEntryId);

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = redeemSecretCode(inputCode);
    setCodeFeedback({
      success: res.success,
      message: res.message,
    });
    if (res.success) {
      setInputCode('');
    }
  };

  const handleGoogleLoginClick = async () => {
    try {
      setAuthMsg(null);
      await loginWithGoogle();
    } catch (err: any) {
      setAuthMsg(err.message || 'Error al iniciar sesión con Google');
    }
  };

  return (
    <div className="space-y-4 pb-24 pt-1">
      {/* GOOGLE CLOUD SYNC STATUS BANNER */}
      {user.isLoggedInWithGoogle ? (
        <div className="bg-zinc-900/90 border border-green-700/60 rounded-2xl p-2.5 px-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[11px] text-zinc-200 font-medium">
              Sincronizado con Google <strong className="text-green-400">({user.email || user.name})</strong>
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">
            {isSyncing ? 'Guardando...' : `Guardado ${lastSyncedAt || 'en la nube'}`}
          </span>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-red-950 via-zinc-900 to-zinc-900 border-2 border-yellow-500/70 rounded-2xl p-3 flex items-center justify-between shadow-[3px_3px_0px_0px_#000000]">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <Cloud className="w-5 h-5 text-yellow-400 shrink-0" />
            <div>
              <p className="text-xs text-white font-bold tracking-wide">
                Guarda tu colección en la nube
              </p>
              <p className="text-[10px] text-zinc-300 truncate">
                Inicia sesión con Google para conservar tus cartas y sobres
              </p>
            </div>
          </div>
          <button
            onClick={handleGoogleLoginClick}
            className="py-1.5 px-3 bg-yellow-400 hover:bg-yellow-300 text-black font-tech text-xs uppercase font-bold rounded-xl border border-black flex items-center gap-1 shrink-0 shadow active:translate-y-0.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Conectar</span>
          </button>
        </div>
      )}

      {authMsg && (
        <p className="text-xs text-red-300 bg-red-950 p-2 rounded-xl border border-red-700 font-medium">
          {authMsg}
        </p>
      )}

      {/* 1. HERO TRAINER CARD / AVATAR */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-950 via-zinc-900 to-zinc-950 border-2 border-red-600 rounded-3xl p-4 shadow-[4px_4px_0px_0px_#000000]">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-red-600/20 rounded-full filter blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3.5">
          {/* Avatar Sprite Frame */}
          <div className="relative p-2 bg-[#121212] border-2 border-red-500 rounded-2xl pixel-box shadow-[2px_2px_0px_0px_#000000] shrink-0">
            <PixelSprite
              name={user.avatarSprite || 'ibarbash'}
              size={56}
              className="animate-pulse"
            />
            <div className="absolute -bottom-2 -right-2 bg-red-600 text-white font-pixel text-[8px] px-1.5 py-0.5 rounded-full border-2 border-black font-bold shadow">
              LV.{user.level}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-silkscreen text-[10px] text-yellow-400 uppercase tracking-wider font-bold">
                {levelInfo.title}
              </span>
              {user.isClubMember && (
                <span className="font-pixel text-[8px] bg-red-950 text-red-300 border border-red-700 px-1.5 py-0.5 rounded font-bold">
                  {user.memberNumber || 'SOCIO'}
                </span>
              )}
            </div>
            <h2 className="font-tech text-2xl font-bold text-white truncate tracking-wide">
              {user.name}
            </h2>
            <p className="text-xs text-zinc-300 font-mono flex items-center gap-1">
              <span className="text-red-500 font-bold">IG:</span> {user.instagram}
            </p>
          </div>
        </div>

        {/* XP PROGRESS BAR */}
        <div className="mt-3.5 pt-3 border-t border-zinc-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span className="font-pixel text-[10px] text-yellow-300 font-bold">
                {user.xp} / {levelInfo.currentTierMax} XP
              </span>
            </div>
            <span className="text-[10px] text-zinc-300 font-mono font-medium">
              {levelInfo.xpNeededForNext > 0
                ? `Faltan ${levelInfo.xpNeededForNext} XP para Nivel ${user.level + 1}`
                : '¡Nivel Máximo de Coleccionista!'}
            </span>
          </div>

          <div className="w-full h-3 bg-black rounded-full border-2 border-zinc-700 overflow-hidden p-0.5 shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelInfo.progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/25 animate-pulse" />
            </motion.div>
          </div>
        </div>

        {/* Quick Indicators Bar for Card Collector */}
        <div className="grid grid-cols-4 gap-2 mt-3 pt-2 text-center border-t border-zinc-800">
          <div
            onClick={() => setActiveTab('jugadores')}
            className="cursor-pointer hover:bg-zinc-800/80 p-1.5 rounded-xl border border-zinc-800 hover:border-red-500 transition-all bg-zinc-950/60"
          >
            <span className="font-silkscreen text-[8px] text-zinc-400 block uppercase font-bold">Cartas</span>
            <span className="font-tech text-base font-bold text-white">{unlockedCards}/{totalCards}</span>
          </div>
          <div
            onClick={() => setActiveTab('jugadores')}
            className="cursor-pointer hover:bg-zinc-800/80 p-1.5 rounded-xl border border-zinc-800 hover:border-emerald-500 transition-all bg-zinc-950/60"
          >
            <span className="font-silkscreen text-[8px] text-zinc-400 block uppercase font-bold">Álbum</span>
            <span className="font-tech text-base font-bold text-emerald-400">{completionPercentage}%</span>
          </div>
          <div
            onClick={() => setActiveTab('sobres')}
            className="cursor-pointer hover:bg-zinc-800/80 p-1.5 rounded-xl border border-zinc-800 hover:border-yellow-500 transition-all bg-zinc-950/60"
          >
            <span className="font-silkscreen text-[8px] text-zinc-400 block uppercase font-bold">Sobres</span>
            <span className="font-tech text-base font-bold text-yellow-400">{user.playerPacks}</span>
          </div>
          <div
            onClick={() => setActiveTab('sobres')}
            className="cursor-pointer hover:bg-zinc-800/80 p-1.5 rounded-xl border border-zinc-800 hover:border-yellow-500 transition-all bg-zinc-950/60"
          >
            <span className="font-silkscreen text-[8px] text-zinc-400 block uppercase font-bold">Monedas</span>
            <span className="font-tech text-base font-bold text-yellow-400">{user.managerCoins || 0} 🪙</span>
          </div>
        </div>
      </div>

      {/* 2. TU ÁLBUM DE CROMOS OFICIAL */}
      <div className="bg-gradient-to-br from-red-950 via-zinc-900 to-zinc-950 border-2 border-red-500 rounded-3xl p-4 shadow-[4px_4px_0px_0px_#000000] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-red-400" />
            <span className="font-pixel text-[9px] text-red-400 font-bold uppercase">
              ÁLBUM Y COLECCIÓN OFICIAL
            </span>
          </div>
          <span className="font-silkscreen text-[8px] bg-red-600 text-white px-2 py-0.5 rounded font-bold border border-black">
            {unlockedCards} DE {totalCards} CROMOS
          </span>
        </div>

        {/* Album Category Progress Breakdown */}
        <div className="grid grid-cols-2 gap-2 bg-black/70 rounded-2xl border border-zinc-800 p-3">
          <div className="flex items-center justify-between p-2 bg-zinc-900/80 rounded-xl border border-zinc-800">
            <div>
              <span className="font-silkscreen text-[8px] text-zinc-400 block">PLANTILLA</span>
              <span className="font-tech text-sm font-bold text-white">{squadUnlocked} / {squadEntries.length}</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 font-bold">
              {squadEntries.length > 0 ? Math.round((squadUnlocked / squadEntries.length) * 100) : 0}%
            </div>
          </div>

          <div className="flex items-center justify-between p-2 bg-zinc-900/80 rounded-xl border border-zinc-800">
            <div>
              <span className="font-silkscreen text-[8px] text-zinc-400 block">STAFF & AFICIÓN</span>
              <span className="font-tech text-sm font-bold text-white">{staffUnlocked} / {staffEntries.length}</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 font-bold">
              {staffEntries.length > 0 ? Math.round((staffUnlocked / staffEntries.length) * 100) : 0}%
            </div>
          </div>

          <div className="flex items-center justify-between p-2 bg-zinc-900/80 rounded-xl border border-zinc-800">
            <div>
              <span className="font-silkscreen text-[8px] text-zinc-400 block">RIVALES</span>
              <span className="font-tech text-sm font-bold text-white">{rivalUnlocked} / {rivalEntries.length}</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 font-bold">
              {rivalEntries.length > 0 ? Math.round((rivalUnlocked / rivalEntries.length) * 100) : 0}%
            </div>
          </div>

          <div className="flex items-center justify-between p-2 bg-zinc-900/80 rounded-xl border border-zinc-800">
            <div>
              <span className="font-silkscreen text-[8px] text-zinc-400 block">OBJETOS & MERCH</span>
              <span className="font-tech text-sm font-bold text-white">{itemUnlocked} / {itemEntries.length}</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 font-bold">
              {itemEntries.length > 0 ? Math.round((itemUnlocked / itemEntries.length) * 100) : 0}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setActiveTab('jugadores')}
            className="py-3 px-2 bg-red-600 hover:bg-red-500 text-white font-pixel text-xs rounded-xl pixel-button border-2 border-black font-bold flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>VER ÁLBUM</span>
          </button>

          <button
            onClick={onOpenScanner}
            className="py-3 px-2 bg-zinc-800 hover:bg-zinc-700 text-yellow-400 font-pixel text-xs rounded-xl border-2 border-zinc-700 font-bold flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5"
          >
            <QrCode className="w-4 h-4" />
            <span>ESCANEAR QR</span>
          </button>
        </div>
      </div>

      {/* 2.5 PARTIDOS Y CANJE DE MONEDAS BANNER */}
      <div className="bg-gradient-to-r from-red-950 via-zinc-900 to-zinc-900 border-2 border-red-600 rounded-3xl p-4 shadow-[4px_4px_0px_0px_#000000] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-red-400" />
            <span className="font-pixel text-[9px] text-red-400 font-bold uppercase">
              CALENDARIO DE PARTIDOS Y CANJE
            </span>
          </div>
          <span className="font-silkscreen text-[8px] bg-yellow-400 text-black px-2 py-0.5 rounded font-bold border border-black">
            +MONEDAS 🪙
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="font-tech text-lg font-bold text-white uppercase leading-tight">
              Canjea Partidos del Soto
            </h3>
            <p className="text-[11px] text-zinc-300">
              En persona en el campo (+200 🪙 & sobre) o en directo por stream (+80 🪙)
            </p>
          </div>

          <button
            onClick={() => setActiveTab('partidos')}
            className="py-2.5 px-3.5 bg-red-600 hover:bg-red-500 text-white font-pixel text-[9.5px] font-bold rounded-xl border-2 border-black shrink-0 shadow active:translate-y-0.5 flex items-center gap-1"
          >
            <span>PARTIDOS</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. UNOPENED PLAYER PACKS CALLOUT */}
      <div className="bg-gradient-to-r from-yellow-950/70 via-zinc-900 to-zinc-900 border-2 border-yellow-400 rounded-3xl p-4 shadow-[4px_4px_0px_0px_#000000] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-black/80 rounded-2xl border-2 border-yellow-400 shrink-0">
            <Package className="w-7 h-7 text-yellow-400 animate-bounce" />
          </div>
          <div>
            <span className="font-pixel text-[9px] text-yellow-300 font-bold uppercase">
              {user.playerPacks > 0 ? '¡TIENES SOBRES PENDIENTES!' : 'SALA DE SOBRES'}
            </span>
            <h3 className="font-tech text-lg font-bold text-white uppercase leading-tight">
              {user.playerPacks} {user.playerPacks === 1 ? 'Sobre Disponible' : 'Sobres Disponibles'}
            </h3>
            <p className="text-[11px] text-zinc-300">
              Abre sobres para desbloquear cartas y cromos legendarios
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('sobres')}
          className="py-2.5 px-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-pixel text-[9.5px] font-bold rounded-xl border-2 border-black shrink-0 shadow active:translate-y-0.5"
        >
          {user.playerPacks > 0 ? 'ABRIR' : 'TIENDA'}
        </button>
      </div>

      {/* 4. QUICK REDEEM SECRET CODE BOX */}
      <div className="bg-zinc-900 border-2 border-zinc-800 hover:border-zinc-700 rounded-3xl p-4 shadow-[3px_3px_0px_0px_#000000] transition-colors">
        <div className="flex items-center gap-2 mb-2">
          <Key className="w-4 h-4 text-yellow-400" />
          <span className="font-silkscreen text-[11px] text-white uppercase tracking-wider font-bold">
            Canjear Código Secreto de Aficionado
          </span>
        </div>
        <form onSubmit={handleRedeem} className="flex gap-2">
          <input
            type="text"
            placeholder="Ej: SOTO2025, GOLAZO, IBARBASH"
            value={inputCode}
            onChange={e => {
              setInputCode(e.target.value);
              setCodeFeedback(null);
            }}
            className="flex-1 px-3.5 py-2 bg-zinc-950 border-2 border-zinc-700 rounded-xl text-xs text-white uppercase tracking-wider placeholder:text-zinc-500 focus:outline-none focus:border-red-500 font-mono shadow-inner"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-pixel text-[10px] rounded-xl pixel-button border-2 border-black font-bold shrink-0"
          >
            CANJEAR
          </button>
        </form>

        {codeFeedback && (
          <p
            className={`mt-2.5 text-xs px-2.5 py-1.5 rounded-xl border-2 font-medium ${
              codeFeedback.success
                ? 'bg-green-950/80 border-green-600 text-green-300'
                : 'bg-red-950/80 border-red-600 text-red-300'
            }`}
          >
            {codeFeedback.message}
          </p>
        )}
      </div>

      {/* 5. ÚLTIMO CROMO DESBLOQUEADO */}
      {latestUnlockedEntry && (
        <div className="bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-4 shadow-[3px_3px_0px_0px_#000000]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-silkscreen text-[10px] text-zinc-400 uppercase tracking-wider font-bold">
              Último Cromo Guardado en el Álbum
            </span>
            <span className="font-silkscreen text-[9px] text-red-400 font-bold">
              {latestUnlockedEntry.id} {latestUnlockedEntry.dorsal ? `#${latestUnlockedEntry.dorsal}` : ''}
            </span>
          </div>

          <div className="flex items-center gap-3 bg-zinc-950 border-2 border-zinc-800 rounded-2xl p-3">
            <div className="p-1.5 bg-zinc-900 border border-zinc-700 rounded-xl shrink-0">
              <PixelSprite name={latestUnlockedEntry.spriteKey} size={44} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-tech text-base font-bold text-white truncate">
                {latestUnlockedEntry.name}
              </h4>
              <p className="text-[11px] text-yellow-400 font-mono">
                {latestUnlockedEntry.position || latestUnlockedEntry.category} {latestUnlockedEntry.posCode ? `(${latestUnlockedEntry.posCode})` : ''}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('jugadores')}
              className="p-2 bg-red-950 text-red-200 hover:text-white rounded-xl border-2 border-red-700 transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000000]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
