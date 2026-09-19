import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  MapPin,
  Calendar,
  Award,
  ArrowLeft,
  Check,
  ChevronRight,
  QrCode,
  Coins,
  Tv,
  CheckCircle2,
  Ticket,
  KeyRound,
  X,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Gym } from '../types';
import { PixelBadge } from './PixelSprites';
import { soundEffects } from '../utils/audio';

interface GymsViewProps {
  onOpenScanner: () => void;
}

export const GymsView: React.FC<GymsViewProps> = ({ onOpenScanner }) => {
  const { gyms, user, badges, selectedGymId, setSelectedGymId, scanQrCode } = useApp();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'played'>('all');
  
  // Code entry modal state
  const [activeCodeModal, setActiveCodeModal] = useState<{
    gym: Gym;
    mode: 'presencial' | 'stream';
  } | null>(null);
  const [modalCodeInput, setModalCodeInput] = useState('');
  const [modalFeedback, setModalFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Global quick code state
  const [quickCodeInput, setQuickCodeInput] = useState('');
  const [quickCodeFeedback, setQuickCodeFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const currentSelectedGym = gyms.find(g => g.id === selectedGymId) || null;

  const handleSelectGym = (gym: Gym) => {
    soundEffects.playClick();
    setSelectedGymId(gym.id);
  };

  const handleOpenCodeModal = (gym: Gym, mode: 'presencial' | 'stream') => {
    soundEffects.playClick();
    setActiveCodeModal({ gym, mode });
    setModalCodeInput('');
    setModalFeedback(null);
  };

  const handleCloseModal = () => {
    setActiveCodeModal(null);
    setModalCodeInput('');
    setModalFeedback(null);
  };

  const handleModalCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCodeModal) return;

    const trimmed = modalCodeInput.trim().toUpperCase();
    if (!trimmed) {
      soundEffects.playError();
      setModalFeedback({
        success: false,
        message: 'Por favor introduce el código secreto del partido.',
      });
      return;
    }

    const res = scanQrCode(trimmed);
    setModalFeedback({
      success: res.success,
      message: res.message,
    });

    if (res.success) {
      setTimeout(() => {
        handleCloseModal();
      }, 1600);
    }
  };

  const handleQuickCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCodeInput.trim()) return;
    const res = scanQrCode(quickCodeInput);
    setQuickCodeFeedback({
      success: res.success,
      message: res.message,
    });
    if (res.success) {
      setQuickCodeInput('');
    }
  };

  // Helper to determine match attendance state for current user
  const getMatchAttendanceStatus = (gymId: string) => {
    const record = user.attendedMatches?.find(m => m.gymId === gymId);
    if (!record) {
      if (user.unlockedGyms?.includes(gymId)) {
        return { isAttended: true, mode: 'presencial', coins: 200 };
      }
      return { isAttended: false, mode: null, coins: 0 };
    }
    return {
      isAttended: true,
      mode: record.mode || 'presencial',
      coins: record.coinsEarned ?? (record.mode === 'stream' ? 80 : 200),
    };
  };

  const filteredGyms = gyms.filter(gym => {
    if (filter === 'upcoming') return gym.status === 'upcoming';
    if (filter === 'played') return gym.status === 'played';
    return true;
  });

  return (
    <div className="space-y-4 pb-28 pt-1">
      {/* ----------------- MODAL INTRODUCIR CÓDIGO ----------------- */}
      <AnimatePresence>
        {activeCodeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-sm rounded-3xl p-5 border-2 shadow-[4px_4px_0px_0px_#000000] bg-zinc-900 ${
                activeCodeModal.mode === 'presencial' ? 'border-red-600' : 'border-purple-600'
              }`}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-xl border ${
                    activeCodeModal.mode === 'presencial'
                      ? 'bg-red-950 text-red-400 border-red-700'
                      : 'bg-purple-950 text-purple-400 border-purple-700'
                  }`}>
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-silkscreen text-[9px] text-zinc-400 uppercase font-bold block">
                      JORNADA #{activeCodeModal.gym.number}
                    </span>
                    <h3 className="font-tech text-base font-bold text-white uppercase leading-tight">
                      {activeCodeModal.mode === 'presencial'
                        ? 'Código de Grada / Estadio'
                        : 'Código del Stream en Directo'}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Match info pill */}
              <div className="my-3 p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1">
                <div className="text-xs font-tech font-bold text-white uppercase">
                  Soto Ibarbaso vs {activeCodeModal.gym.rivalName}
                </div>
                <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>{activeCodeModal.gym.stadium}</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-zinc-400">Recompensa:</span>
                  <span className="font-silkscreen font-bold text-yellow-400">
                    {activeCodeModal.mode === 'presencial' ? '+200 Monedas 🪙' : '+80 Monedas 🪙'}
                  </span>
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleModalCodeSubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-silkscreen text-zinc-300 uppercase mb-1 font-bold">
                    Introduce la clave secreta:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      autoFocus
                      value={modalCodeInput}
                      onChange={e => setModalCodeInput(e.target.value)}
                      placeholder={
                        activeCodeModal.mode === 'presencial'
                          ? `Ej: ${activeCodeModal.gym.presencialCode || 'SOTO-ROTXAPEA'}`
                          : `Ej: ${activeCodeModal.gym.streamCode || 'STREAM-ROTXAPEA'}`
                      }
                      className="w-full bg-zinc-950 border-2 border-zinc-700 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono uppercase tracking-wider focus:outline-none placeholder-zinc-600 shadow-inner"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-yellow-400 shrink-0" />
                    <span>
                      {activeCodeModal.mode === 'presencial'
                        ? 'Encuentra el código en el cartel del estadio o pídelo en cantina.'
                        : 'El código aparece durante la retransmisión de Twitch/YouTube.'}
                    </span>
                  </p>
                </div>

                {modalFeedback && (
                  <div
                    className={`p-2.5 rounded-xl border text-xs font-semibold ${
                      modalFeedback.success
                        ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                        : 'bg-red-950 border-red-600 text-red-300'
                    }`}
                  >
                    {modalFeedback.message}
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-tech text-xs uppercase font-bold rounded-xl border border-zinc-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-2.5 text-black font-tech text-xs uppercase font-bold rounded-xl shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5 transition-all ${
                      activeCodeModal.mode === 'presencial'
                        ? 'bg-yellow-400 hover:bg-yellow-300'
                        : 'bg-purple-400 hover:bg-purple-300'
                    }`}
                  >
                    Validar Código
                  </button>
                </div>

                {/* Or camera button */}
                <div className="pt-2 border-t border-zinc-800/80 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      handleCloseModal();
                      onOpenScanner();
                    }}
                    className="text-[10px] font-silkscreen text-zinc-400 hover:text-white inline-flex items-center gap-1"
                  >
                    <QrCode className="w-3 h-3 text-red-400" />
                    <span>¿Prefieres escanear el QR con la cámara?</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ----------------- IF MATCH SELECTED (DETALLE PARTIDO) ----------------- */}
      {currentSelectedGym ? (
        <div className="space-y-4">
          {/* Back Button */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setSelectedGymId(null);
            }}
            className="flex items-center gap-1.5 text-xs text-zinc-200 hover:text-white bg-zinc-900 border-2 border-zinc-700 hover:border-red-600 px-3.5 py-2 rounded-xl transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000000] font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-red-500" />
            <span>Volver a la Lista de Partidos</span>
          </button>

          {/* Individual Match Card */}
          <div className="bg-zinc-900 border-2 border-red-600 rounded-3xl p-5 shadow-[4px_4px_0px_0px_#000000] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Shield className="w-48 h-48 text-red-500" />
            </div>

            {/* Header */}
            {(() => {
              const status = getMatchAttendanceStatus(currentSelectedGym.id);
              return (
                <div className="flex items-center justify-between mb-3">
                  <span className="font-silkscreen text-[11px] text-red-400 font-bold tracking-wider">
                    JORNADA #{currentSelectedGym.number} • CALENDARIO OFICIAL
                  </span>
                  <span
                    className={`font-pixel text-[9px] px-3 py-1 rounded-full border-2 font-bold ${
                      status.mode === 'presencial' || status.mode === 'ambos'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                        : status.mode === 'stream'
                        ? 'bg-purple-950 text-purple-300 border-purple-600'
                        : 'bg-yellow-950 text-yellow-300 border-yellow-700'
                    }`}
                  >
                    {status.mode === 'presencial' || status.mode === 'ambos'
                      ? '✓ EN PERSONA (+200 🪙)'
                      : status.mode === 'stream'
                      ? '✓ EN STREAM (+80 🪙)'
                      : 'PENDIENTE DE CÓDIGO'}
                  </span>
                </div>
              );
            })()}

            <h2 className="font-tech text-3xl font-bold text-white tracking-wide uppercase mb-0.5">
              CD SOTO IBARBASO vs {currentSelectedGym.rivalName}
            </h2>
            <p className="font-silkscreen text-xs text-yellow-400 mb-4 font-bold">
              "{currentSelectedGym.nickname}"
            </p>

            {/* Stadium & Time Box */}
            <div className="bg-zinc-950 border-2 border-zinc-800 rounded-2xl p-4 space-y-2 mb-4 text-xs shadow-inner">
              <div className="flex items-center gap-2 text-zinc-200">
                <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                <span>
                  <strong className="text-white">Estadio:</strong> {currentSelectedGym.stadium} ({currentSelectedGym.location})
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-200">
                <Calendar className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>
                  <strong className="text-white">Fecha:</strong> {currentSelectedGym.matchDate}{' '}
                  {currentSelectedGym.matchTime ? `a las ${currentSelectedGym.matchTime}h` : ''}
                </span>
              </div>
              {currentSelectedGym.score && (
                <div className="p-2.5 bg-red-950/80 border-2 border-red-700 rounded-xl text-center font-tech text-base font-bold text-yellow-300 mt-2 flex items-center justify-center gap-2">
                  <span className="font-silkscreen text-[10px] text-red-300 uppercase">Resultado:</span>
                  <span>{currentSelectedGym.score}</span>
                </div>
              )}
            </div>

            {/* Scouting & Details */}
            <div className="grid grid-cols-2 gap-2.5 mb-4 text-xs">
              <div className="bg-zinc-950 p-3 rounded-xl border-2 border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase font-silkscreen block mb-1 font-bold">
                  Míster Rival
                </span>
                <span className="font-semibold text-white">{currentSelectedGym.rivalCoach}</span>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border-2 border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase font-silkscreen block mb-1 font-bold">
                  Jugador Clave
                </span>
                <span className="font-semibold text-white">{currentSelectedGym.rivalStarPlayer}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-zinc-300 mb-4 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800 leading-relaxed">
              {currentSelectedGym.description}
            </p>

            {/* Match Rewards Card */}
            {(() => {
              const status = getMatchAttendanceStatus(currentSelectedGym.id);

              return (
                <div className="bg-zinc-950 border-2 border-red-800/80 rounded-2xl p-4 mb-4 shadow-[2px_2px_0px_0px_#000000]">
                  <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
                    <span className="font-silkscreen text-[10px] text-yellow-400 uppercase font-bold flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" /> Canje con Código Secreto
                    </span>
                    <span className="font-silkscreen text-[9px] text-zinc-400">
                      Tus monedas: <strong className="text-yellow-400">{user.managerCoins} 🪙</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Presencial Perk */}
                    <div className={`p-3 rounded-xl border-2 transition-all ${
                      status.mode === 'presencial' || status.mode === 'ambos'
                        ? 'bg-emerald-950/40 border-emerald-600'
                        : 'bg-zinc-900 border-zinc-800'
                    }`}>
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-tech text-sm uppercase mb-1">
                        <Ticket className="w-4 h-4 shrink-0" />
                        <span>En Persona (Estadio)</span>
                      </div>
                      <div className="space-y-0.5 text-[11px] text-zinc-300">
                        <div className="text-yellow-400 font-bold font-silkscreen text-xs flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5" /> +200 Monedas
                        </div>
                        <div className="text-zinc-400">+100 XP & +1 Sobre</div>
                        <div className="text-zinc-400 font-mono text-[10px] mt-1 text-emerald-400/90">
                          Código de Grada
                        </div>
                      </div>
                      {status.mode === 'presencial' || status.mode === 'ambos' ? (
                        <span className="inline-block mt-2 font-silkscreen text-[8.5px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
                          ✓ YA CONSEGUIDO
                        </span>
                      ) : null}
                    </div>

                    {/* Stream Perk */}
                    <div className={`p-3 rounded-xl border-2 transition-all ${
                      status.mode === 'stream'
                        ? 'bg-purple-950/40 border-purple-600'
                        : 'bg-zinc-900 border-zinc-800'
                    }`}>
                      <div className="flex items-center gap-1.5 text-purple-400 font-bold font-tech text-sm uppercase mb-1">
                        <Tv className="w-4 h-4 shrink-0" />
                        <span>Viendo el Stream</span>
                      </div>
                      <div className="space-y-0.5 text-[11px] text-zinc-300">
                        <div className="text-yellow-400 font-bold font-silkscreen text-xs flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5" /> +80 Monedas
                        </div>
                        <div className="text-zinc-400">+40 XP de Directo</div>
                        <div className="text-zinc-400 font-mono text-[10px] mt-1 text-purple-400/90">
                          Código en Pantalla
                        </div>
                      </div>
                      {status.mode === 'stream' ? (
                        <span className="inline-block mt-2 font-silkscreen text-[8.5px] text-purple-300 font-bold bg-purple-950 px-2 py-0.5 rounded border border-purple-700">
                          ✓ CANJEADO
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Attendance Action Buttons (Require Code) */}
            {(() => {
              const status = getMatchAttendanceStatus(currentSelectedGym.id);
              const isFullPresencial = status.mode === 'presencial' || status.mode === 'ambos';
              const isStreamOnly = status.mode === 'stream';

              return (
                <div className="space-y-2.5">
                  {isFullPresencial ? (
                    <div className="p-3.5 bg-emerald-950/90 border-2 border-emerald-600 rounded-2xl text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#000000]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>¡Código presencial validado con éxito! (+200 🪙 ganadas)</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Introducir Código En Persona */}
                      <button
                        onClick={() => handleOpenCodeModal(currentSelectedGym, 'presencial')}
                        className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-tech text-base uppercase font-bold rounded-2xl border-2 border-black flex items-center justify-between shadow-[3px_3px_0px_0px_#000000] active:translate-y-0.5 transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1 bg-black/40 rounded-lg">
                            <KeyRound className="w-4 h-4 text-yellow-400" />
                          </div>
                          <div className="text-left">
                            <div className="leading-none">
                              {isStreamOnly ? 'Introducir Código de Grada' : 'Introducir Código de Estadio'}
                            </div>
                            <div className="text-[10px] text-red-200 font-sans font-normal mt-0.5">
                              {isStreamOnly ? 'Bono restante: +120 🪙 y +1 Sobre' : 'En el campo: +200 🪙, +100 XP y +1 Sobre'}
                            </div>
                          </div>
                        </div>
                        <span className="font-silkscreen text-xs text-yellow-300 font-bold bg-black/50 px-2.5 py-1 rounded-xl border border-yellow-500/50">
                          {isStreamOnly ? '+120 🪙' : '+200 🪙'}
                        </span>
                      </button>

                      {/* Introducir Código Viendo Stream */}
                      {!isStreamOnly && (
                        <button
                          onClick={() => handleOpenCodeModal(currentSelectedGym, 'stream')}
                          className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-purple-300 hover:text-white font-tech text-base uppercase font-bold rounded-2xl border-2 border-purple-700 flex items-center justify-between shadow-[3px_3px_0px_0px_#000000] active:translate-y-0.5 transition-all"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1 bg-purple-950 rounded-lg border border-purple-600">
                              <KeyRound className="w-4 h-4 text-purple-400" />
                            </div>
                            <div className="text-left">
                              <div className="leading-none">Introducir Código de Stream</div>
                              <div className="text-[10px] text-zinc-400 font-sans font-normal mt-0.5">
                                Clave dada en el directo de Twitch / YouTube (+80 🪙)
                              </div>
                            </div>
                          </div>
                          <span className="font-silkscreen text-xs text-yellow-400 font-bold bg-purple-950 px-2.5 py-1 rounded-xl border border-purple-500">
                            +80 🪙
                          </span>
                        </button>
                      )}

                      {/* Scan Physical Match QR button */}
                      <button
                        onClick={onOpenScanner}
                        className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 font-silkscreen text-[10px] uppercase font-bold rounded-xl border border-zinc-700 flex items-center justify-center gap-2 transition-all shadow-[2px_2px_0px_0px_#000000]"
                      >
                        <QrCode className="w-3.5 h-3.5 text-red-400" />
                        <span>O Escanear QR del Cartel / Pantalla</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      ) : (
        /* ----------------- LISTA DE TODOS LOS PARTIDOS ----------------- */
        <div className="space-y-4">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-red-950 via-zinc-900 to-zinc-900 border-2 border-red-600 rounded-3xl p-4 shadow-[4px_4px_0px_0px_#000000]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-pixel text-xs text-red-500 font-bold uppercase drop-shadow">
                  SISTEMA DE CÓDIGOS OFICIAL
                </span>
                <h2 className="font-tech text-2xl font-bold text-white tracking-wide uppercase">
                  PARTIDOS Y CANJES
                </h2>
              </div>

              {/* Match coins badge */}
              <div className="bg-zinc-950 px-3 py-2 rounded-2xl border-2 border-yellow-500/80 text-right shadow-[2px_2px_0px_0px_#000000] shrink-0">
                <span className="font-silkscreen text-[8.5px] text-zinc-400 uppercase block font-bold">
                  TUS MONEDAS
                </span>
                <span className="font-tech text-xl font-bold text-yellow-400 flex items-center justify-end gap-1">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  {user.managerCoins}
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 font-medium leading-relaxed mb-3">
              Introduce el código secreto del partido para validar tu asistencia y conseguir monedas:
            </p>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-zinc-950/80 border border-emerald-700/60 p-2.5 rounded-xl flex items-center gap-2">
                <div className="p-1 bg-emerald-950 rounded-lg text-emerald-400 shrink-0">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-silkscreen block font-bold">
                    Código Grada
                  </span>
                  <span className="font-tech text-sm font-bold text-emerald-300">
                    +200 🪙 & +1 Sobre
                  </span>
                </div>
              </div>

              <div className="bg-zinc-950/80 border border-purple-700/60 p-2.5 rounded-xl flex items-center gap-2">
                <div className="p-1 bg-purple-950 rounded-lg text-purple-400 shrink-0">
                  <Tv className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-silkscreen block font-bold">
                    Código Stream
                  </span>
                  <span className="font-tech text-sm font-bold text-purple-300">
                    +80 🪙 & +40 XP
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Code Redemption Input */}
          <form
            onSubmit={handleQuickCodeSubmit}
            className="bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-3 shadow-[2px_2px_0px_0px_#000000] flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Escribe aquí el código (ej: SOTO-ROTXAPEA o STREAM-ROTXAPEA)..."
                value={quickCodeInput}
                onChange={e => setQuickCodeInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="flex gap-1.5">
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-black font-tech text-xs uppercase font-bold rounded-xl shadow transition-all shrink-0 flex items-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5 text-black" />
                <span>Validar</span>
              </button>
              <button
                type="button"
                onClick={onOpenScanner}
                className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-silkscreen text-[9px] rounded-xl border border-zinc-600 flex items-center gap-1 shrink-0"
                title="Escanear con cámara"
              >
                <QrCode className="w-3.5 h-3.5 text-red-400" />
                <span>QR</span>
              </button>
            </div>
          </form>

          {quickCodeFeedback && (
            <div
              className={`p-2.5 rounded-xl border text-xs font-semibold ${
                quickCodeFeedback.success
                  ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                  : 'bg-red-950 border-red-600 text-red-300'
              }`}
            >
              {quickCodeFeedback.message}
            </div>
          )}

          {/* Filter Bar */}
          <div className="flex items-center gap-1.5 bg-zinc-950 p-1.5 rounded-2xl border-2 border-zinc-800 shadow-inner">
            <button
              onClick={() => {
                soundEffects.playClick();
                setFilter('all');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-tech uppercase font-bold transition-all ${
                filter === 'all'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Todos ({gyms.length})
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                setFilter('upcoming');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-tech uppercase font-bold transition-all ${
                filter === 'upcoming'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Próximos
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                setFilter('played');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-tech uppercase font-bold transition-all ${
                filter === 'played'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Jugados
            </button>
          </div>

          {/* Matches List */}
          <div className="space-y-3">
            {filteredGyms.map(gym => {
              const status = getMatchAttendanceStatus(gym.id);
              const isBadgeEarned = user.earnedBadges.includes(gym.badgeId);
              const isFullPresencial = status.mode === 'presencial' || status.mode === 'ambos';
              const isStreamOnly = status.mode === 'stream';

              return (
                <motion.div
                  key={gym.id}
                  whileTap={{ scale: 0.99 }}
                  className={`p-4 rounded-3xl border-2 transition-all shadow-[3px_3px_0px_0px_#000000] ${
                    isFullPresencial
                      ? 'bg-zinc-900 border-emerald-700/80 hover:border-emerald-500'
                      : isStreamOnly
                      ? 'bg-zinc-900 border-purple-700/80 hover:border-purple-500'
                      : 'bg-zinc-900 border-zinc-800 hover:border-red-600'
                  }`}
                >
                  {/* Match Top Bar */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-silkscreen text-[10px] text-red-400 font-bold">
                        JORNADA #{gym.number}
                      </span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-[11px] text-zinc-300 font-mono font-medium">
                        {gym.matchDate}
                      </span>
                    </div>

                    <span
                      className={`font-pixel text-[8px] px-2.5 py-0.5 rounded-full border font-bold ${
                        isFullPresencial
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                          : isStreamOnly
                          ? 'bg-purple-950 text-purple-300 border-purple-700'
                          : 'bg-yellow-950 text-yellow-300 border-yellow-700'
                      }`}
                    >
                      {isFullPresencial
                        ? '✓ EN PERSONA (+200 🪙)'
                        : isStreamOnly
                        ? '✓ STREAM (+80 🪙)'
                        : 'CANJE POR CÓDIGO'}
                    </span>
                  </div>

                  {/* Team vs Team Header */}
                  <div className="flex items-center gap-3.5 my-2">
                    <div className="shrink-0 p-1.5 bg-zinc-950 rounded-2xl border-2 border-zinc-800">
                      <PixelBadge
                        size={48}
                        color={isBadgeEarned ? '#dc2626' : '#52525b'}
                        earned={isBadgeEarned}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-tech text-lg font-bold text-white tracking-wide truncate">
                        CD Soto Ibarbaso vs {gym.rivalName}
                      </h3>
                      <p className="text-xs text-yellow-400 font-silkscreen font-bold">
                        "{gym.nickname}"
                      </p>
                      <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span className="truncate">{gym.stadium}</span>
                      </p>
                    </div>
                  </div>

                  {/* Code Buttons */}
                  <div className="mt-3 pt-3 border-t border-zinc-800 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {/* Persona Button (Opens Code Input Modal) */}
                      <button
                        onClick={() => handleOpenCodeModal(gym, 'presencial')}
                        disabled={isFullPresencial}
                        className={`py-2 px-2.5 rounded-xl font-tech text-xs uppercase font-bold flex items-center justify-center gap-1.5 transition-all shadow ${
                          isFullPresencial
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700 cursor-default'
                            : 'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white border border-red-400'
                        }`}
                      >
                        <KeyRound className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                          {isFullPresencial
                            ? 'En Persona ✓'
                            : isStreamOnly
                            ? 'Bono Campo (+120 🪙)'
                            : 'Código Estadio (+200 🪙)'}
                        </span>
                      </button>

                      {/* Stream Button (Opens Code Input Modal) */}
                      <button
                        onClick={() => handleOpenCodeModal(gym, 'stream')}
                        disabled={isStreamOnly || isFullPresencial}
                        className={`py-2 px-2.5 rounded-xl font-tech text-xs uppercase font-bold flex items-center justify-center gap-1.5 transition-all shadow ${
                          isFullPresencial
                            ? 'bg-zinc-950 text-zinc-500 border border-zinc-800 cursor-default'
                            : isStreamOnly
                            ? 'bg-purple-950 text-purple-300 border border-purple-700 cursor-default'
                            : 'bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-purple-300 hover:text-white border border-purple-700'
                        }`}
                      >
                        <KeyRound className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                          {isFullPresencial || isStreamOnly ? 'Stream ✓' : 'Código Stream (+80 🪙)'}
                        </span>
                      </button>
                    </div>

                    {/* View full details button */}
                    <button
                      onClick={() => handleSelectGym(gym)}
                      className="w-full py-1.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white text-[11px] font-semibold rounded-xl border border-zinc-800 flex items-center justify-center gap-1 transition-all"
                    >
                      <span>Ver detalles y ficha del rival</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
