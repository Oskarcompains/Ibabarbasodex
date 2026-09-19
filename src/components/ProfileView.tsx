import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Edit3, Award, Shield, Calendar, QrCode, Share2, Sparkles, Check, X, LogIn, LogOut, Cloud, Package, CheckCircle2, Trash2, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateLevelInfo } from '../utils/xpLevels';
import { PixelSprite, PixelBadge } from './PixelSprites';
import { soundEffects } from '../utils/audio';

export const ProfileView: React.FC = () => {
  const {
    user,
    updateUserProfile,
    badges,
    gyms,
    ibardexEntries,
    loginWithGoogle,
    logoutUser,
    isSyncing,
    lastSyncedAt,
    setActiveTab,
    resetAllDatabase,
  } = useApp();

  const levelInfo = calculateLevelInfo(user.xp);

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [igInput, setIgInput] = useState(user.instagram);
  const [avatarInput, setAvatarInput] = useState(user.avatarSprite || 'ibarbash');
  const [copied, setCopied] = useState(false);
  const [authMsg, setAuthMsg] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const availableAvatars = [
    { id: 'ibarbash', label: 'Ibarbash' },
    { id: 'capitan_aitor', label: 'Capitán Aitor' },
    { id: 'coach_patxi', label: 'Míster Patxi' },
    { id: 'presi_joseba', label: 'Presi Joseba' },
    { id: 'team_r_grunt', label: 'Recluta Team R' },
    { id: 'mitxitzel', label: 'Mitxitzel' },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    updateUserProfile(nameInput.trim(), igInput.trim(), avatarInput);
    setIsEditing(false);
  };

  const handleGoogleAuth = async () => {
    try {
      setAuthMsg(null);
      if (user.isLoggedInWithGoogle) {
        await logoutUser();
      } else {
        await loginWithGoogle();
      }
    } catch (err: any) {
      setAuthMsg(err.message || 'Error con Google Auth');
    }
  };

  const handleShareReferral = () => {
    soundEffects.playClick();
    const shareText = `¡Únete a la IBARDEX del CD Soto Ibarbaso con mi código de aficionado ${user.instagram}!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4 pb-24 pt-1">
      {/* GOOGLE CLOUD ACCOUNT SECTION */}
      <div className="bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-4 shadow-[4px_4px_0px_0px_#000000] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-yellow-400" />
            <h3 className="font-tech text-base font-bold text-white uppercase tracking-wide">
              Cuenta de Google & Guardado en la Nube
            </h3>
          </div>
          {user.isLoggedInWithGoogle && (
            <span className="font-pixel text-[8px] bg-green-950 text-green-300 border border-green-700 px-2 py-0.5 rounded-full font-bold">
              SINCRONIZADO
            </span>
          )}
        </div>

        {user.isLoggedInWithGoogle ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
              <div className="flex items-center gap-2.5 min-w-0">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full border-2 border-red-500 shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center font-bold text-white text-sm">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-zinc-400 font-mono truncate">{user.email}</p>
                </div>
              </div>

              <button
                onClick={handleGoogleAuth}
                className="py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-tech text-xs rounded-xl border border-zinc-700 flex items-center gap-1 shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar</span>
              </button>
            </div>

            <p className="text-[11px] text-zinc-400 flex items-center gap-1.5 px-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
              <span>
                {isSyncing ? 'Guardando cambios en Firestore...' : `Última copia guardada: ${lastSyncedAt || 'Reciente'}`}
              </span>
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-zinc-300">
              Conecta tu cuenta de Google para guardar tus cromos de jugadores, medallas y nivel de grada de forma permanente en cualquier dispositivo.
            </p>
            <button
              onClick={handleGoogleAuth}
              className="w-full py-3 bg-white hover:bg-zinc-100 active:bg-zinc-200 text-zinc-900 font-tech text-sm font-bold uppercase rounded-2xl border-2 border-black flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#000000]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Iniciar sesión con Google</span>
            </button>
          </div>
        )}

        {authMsg && (
          <p className="text-xs text-red-300 bg-red-950 p-2 rounded-xl border border-red-700 font-medium">
            {authMsg}
          </p>
        )}
      </div>

      {/* RETRO TRAINER CARD / CARNET DE AFICIONADO */}
      <div className="relative overflow-hidden bg-gradient-to-b from-red-950 via-zinc-900 to-zinc-950 border-4 border-red-600 rounded-3xl p-5 shadow-[6px_6px_0px_0px_#000000] pixel-box-red">
        {/* CRT Scanline */}
        <div className="absolute inset-0 crt-scanlines opacity-40 pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-red-800">
          <div>
            <span className="font-pixel text-[9px] text-yellow-400 block tracking-wider uppercase drop-shadow font-bold">
              CLUB DEPORTIVO SOTO IBARBASO
            </span>
            <h2 className="font-tech text-xl font-bold text-white uppercase tracking-wider">
              CARNET OFICIAL DE AFICIONADO
            </h2>
          </div>
          <button
            onClick={() => {
              soundEffects.playClick();
              setNameInput(user.name);
              setIgInput(user.instagram);
              setAvatarInput(user.avatarSprite);
              setIsEditing(true);
            }}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl border-2 border-zinc-700 hover:border-red-500 transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000000]"
            title="Editar Perfil"
          >
            <Edit3 className="w-4 h-4 text-red-400" />
          </button>
        </div>

        {/* Card Body */}
        <div className="flex items-center gap-4 my-4">
          {/* Avatar Photo Frame */}
          <div className="relative p-2 bg-zinc-950 border-2 border-red-500 rounded-2xl pixel-box shrink-0 shadow-[2px_2px_0px_0px_#000000]">
            <PixelSprite name={user.avatarSprite || 'ibarbash'} size={68} />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-600 text-white font-pixel text-[8px] px-2 py-0.5 rounded-full border-2 border-black whitespace-nowrap shadow font-bold">
              {user.memberNumber || 'SOCIO'}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-tech text-2xl font-bold text-white truncate tracking-wide">
              {user.name}
            </h3>
            <p className="font-mono text-xs text-red-400 font-bold truncate">
              {user.instagram}
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-950 border-2 border-red-700 rounded-full font-silkscreen text-[10px] text-yellow-300 font-bold">
              <span>{levelInfo.badge}</span>
              <span>{levelInfo.title}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid on Trainer Card */}
        <div className="grid grid-cols-2 gap-2 bg-zinc-950 border-2 border-zinc-800 rounded-2xl p-3.5 text-xs shadow-inner">
          <div>
            <span className="font-silkscreen text-[9px] text-zinc-400 block uppercase font-bold">
              Nivel de Grada
            </span>
            <span className="font-tech text-lg font-bold text-white">
              NIVEL {user.level}
            </span>
          </div>

          <div>
            <span className="font-silkscreen text-[9px] text-zinc-400 block uppercase font-bold">
              Experiencia Total
            </span>
            <span className="font-tech text-lg font-bold text-yellow-400">
              {user.xp} XP
            </span>
          </div>

          <div>
            <span className="font-silkscreen text-[9px] text-zinc-400 block uppercase font-bold">
              Cromos en Álbum
            </span>
            <span className="font-tech text-lg font-bold text-red-400">
              {user.unlockedEntries.length} / {ibardexEntries.length}
            </span>
          </div>

          <div>
            <span className="font-silkscreen text-[9px] text-zinc-400 block uppercase font-bold">
              Álbum Completado
            </span>
            <span className="font-tech text-lg font-bold text-emerald-400">
              {Math.round((user.unlockedEntries.length / (ibardexEntries.length || 1)) * 100)}%
            </span>
          </div>
        </div>

        {/* Registration Date */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-red-900 font-mono font-medium">
          <span>Fecha de Registro: {user.registeredAt}</span>
          <span className="text-zinc-400">ID: {user.id.slice(0, 8)}...</span>
        </div>
      </div>

      {/* DETAILED STATS BREAKDOWN */}
      <div className="bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-4 shadow-[4px_4px_0px_0px_#000000] space-y-3">
        <h3 className="font-silkscreen text-xs text-zinc-200 uppercase font-bold">
          Resumen de tu Colección
        </h3>

        <div className="space-y-2 text-xs">
          <div
            onClick={() => setActiveTab('sobres')}
            className="cursor-pointer flex items-center justify-between p-3 bg-zinc-950 hover:bg-zinc-850 rounded-2xl border-2 border-zinc-800 hover:border-yellow-500 transition-all shadow-sm"
          >
            <div className="flex items-center gap-2 text-zinc-200 font-medium">
              <Package className="w-4 h-4 text-yellow-400" />
              <span>Sobres de Cartas Disponibles</span>
            </div>
            <span className="font-tech text-base font-bold text-yellow-400">
              {user.playerPacks} sobres
            </span>
          </div>

          <div
            onClick={() => setActiveTab('jugadores')}
            className="cursor-pointer flex items-center justify-between p-3 bg-zinc-950 hover:bg-zinc-850 rounded-2xl border-2 border-zinc-800 hover:border-red-500 transition-all shadow-sm"
          >
            <div className="flex items-center gap-2 text-zinc-200 font-medium">
              <Award className="w-4 h-4 text-red-400" />
              <span>Cromos Guardados en el Álbum</span>
            </div>
            <span className="font-tech text-base font-bold text-white">
              {user.unlockedEntries.length} / {ibardexEntries.length}
            </span>
          </div>

          <div
            onClick={() => setActiveTab('sobres')}
            className="cursor-pointer flex items-center justify-between p-3 bg-zinc-950 hover:bg-zinc-850 rounded-2xl border-2 border-zinc-800 hover:border-yellow-500 transition-all shadow-sm"
          >
            <div className="flex items-center gap-2 text-zinc-200 font-medium">
              <span className="text-base">🪙</span>
              <span>Monedas del Club / Colección</span>
            </div>
            <span className="font-tech text-base font-bold text-yellow-400">
              {user.managerCoins || 0} monedas
            </span>
          </div>
        </div>
      </div>

      {/* REFERRAL & SHARING */}
      <div className="bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-4 shadow-[4px_4px_0px_0px_#000000]">
        <div className="flex items-center gap-2 mb-2">
          <Share2 className="w-4 h-4 text-yellow-400" />
          <h3 className="font-silkscreen text-xs text-white uppercase font-bold">
            Invitar Aficionados del Soto
          </h3>
        </div>
        <p className="text-xs text-zinc-300 mb-3 leading-relaxed">
          Comparte tu código de aficionado para sumar a más hinchas al CD Soto Ibarbaso y competir juntos en el ranking.
        </p>

        <button
          onClick={handleShareReferral}
          className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl border-2 border-zinc-700 flex items-center justify-center gap-2 transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000000]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-green-400">¡Texto de invitación copiado!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-red-400" />
              <span>Copiar Enlace de Aficionado</span>
            </>
          )}
        </button>
      </div>

      {/* DATABASE & PROGRESS RESET SECTION */}
      <div className="bg-zinc-900 border-2 border-red-950/80 rounded-3xl p-4 shadow-[4px_4px_0px_0px_#000000] space-y-3">
        <div className="flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-red-500" />
          <h3 className="font-silkscreen text-xs text-red-400 uppercase font-bold">
            Zona de Mantenimiento & Base de Datos
          </h3>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Permite borrar todos los objetos, jugadores desbloqueados, plantilla y estadísticas almacenadas para empezar desde cero con la base de datos limpia.
        </p>

        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="w-full py-2.5 bg-zinc-950 hover:bg-red-950/50 text-red-400 hover:text-red-300 font-silkscreen text-[10px] rounded-xl border-2 border-red-900/60 flex items-center justify-center gap-2 transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000000]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Resetear Base de Datos (Borrar Todo)</span>
          </button>
        ) : (
          <div className="p-3 bg-red-950/90 border-2 border-red-700 rounded-2xl space-y-2.5 text-center">
            <p className="text-[11px] font-silkscreen text-white font-bold">
              ⚠️ ¿Confirmas el borrado completo?
            </p>
            <p className="text-[10px] text-zinc-300 leading-normal">
              Esta acción borrará todos tus jugadores desbloqueados, objetos, monedas, sobres y alineaciones, restaurando la base de datos a cero.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={async () => {
                  await resetAllDatabase();
                  setConfirmReset(false);
                  setResetSuccess(true);
                  setTimeout(() => setResetSuccess(false), 3500);
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-silkscreen text-[10px] rounded-xl border-2 border-black font-bold shadow-[2px_2px_0px_0px_#000000]"
              >
                Sí, Borrar Todo
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-silkscreen text-[10px] rounded-xl border border-zinc-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {resetSuccess && (
          <p className="text-center text-xs text-green-400 font-silkscreen font-bold">
            ✓ ¡Base de datos reseteada y limpiada por completo!
          </p>
        )}
      </div>

      {/* EDIT PROFILE MODAL */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-zinc-900 border-4 border-red-600 rounded-3xl p-5 shadow-[6px_6px_0px_0px_#000000]"
            >
              <button
                onClick={() => setIsEditing(false)}
                className="absolute top-3 right-3 p-1.5 text-zinc-400 hover:text-white bg-zinc-800 border-2 border-zinc-700 rounded-xl transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000000]"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-tech text-lg font-bold text-white uppercase mb-3">
                Editar Carnet de Aficionado
              </h3>

              <form onSubmit={handleSaveProfile} className="space-y-3.5">
                <div>
                  <label className="font-silkscreen text-[10px] text-zinc-300 block uppercase mb-1 font-bold">
                    Nombre o Apodo
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border-2 border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 shadow-inner"
                    required
                  />
                </div>

                <div>
                  <label className="font-silkscreen text-[10px] text-zinc-300 block uppercase mb-1 font-bold">
                    Usuario de Instagram
                  </label>
                  <input
                    type="text"
                    value={igInput}
                    onChange={e => setIgInput(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border-2 border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 font-mono shadow-inner"
                    required
                  />
                </div>

                <div>
                  <label className="font-silkscreen text-[10px] text-zinc-300 block uppercase mb-1.5 font-bold">
                    Elige tu Sprite / Avatar
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableAvatars.map(av => (
                      <button
                        type="button"
                        key={av.id}
                        onClick={() => setAvatarInput(av.id)}
                        className={`p-2 rounded-xl border-2 flex flex-col items-center gap-1 transition-all shadow-[2px_2px_0px_0px_#000000] ${
                          avatarInput === av.id
                            ? 'bg-red-950 border-red-500 ring-2 ring-red-500'
                            : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <PixelSprite name={av.id} size={36} />
                        <span className="text-[9px] text-zinc-300 font-bold truncate w-full text-center">
                          {av.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-pixel text-xs rounded-xl pixel-button border-2 border-black shadow mt-2 font-bold"
                >
                  GUARDAR CAMBIOS
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
