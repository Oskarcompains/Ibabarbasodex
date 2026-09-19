import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Calendar,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Users,
  Eye,
  Printer,
  Search,
  ShieldCheck,
  LogOut,
  Lock,
  Unlock,
  Database,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundEffects } from '../utils/audio';
import { PixelSprite } from './PixelSprites';
import { QrCodeDisplayModal } from './QrCodeDisplayModal';
import { UserProfile } from '../types';
import { fetchAllUsersForAdmin, adminDeleteUserDoc } from '../lib/firebase';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const {
    isAdmin,
    adminLoginWithKey,
    adminLogout,
    adminSetUserStats,
    adminUnlockOrLockEntry,
    adminResetData,
    resetAllPlayers,
    loginWithGoogle,
    user,
    gyms,
    ibardexEntries,
  } = useApp();

  const [tab, setTab] = useState<'qr_jugadores' | 'qr_partidos' | 'qr_items' | 'datos_club' | 'firestore_users'>('qr_jugadores');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'todos' | 'Portero' | 'Defensa' | 'Centrocampista' | 'Delantero' | 'Cuerpo Técnico'>('todos');
  const [resetPlayersDone, setResetPlayersDone] = useState(false);

  // Admin login input state
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [adminKeyError, setAdminKeyError] = useState<string | null>(null);

  // Manual Adjustments
  const [editXp, setEditXp] = useState<number>(user.xp);
  const [editCoins, setEditCoins] = useState<number>(user.managerCoins);
  const [editPacks, setEditPacks] = useState<number>(user.playerPacks);
  const [editLevel, setEditLevel] = useState<number>(user.level);
  const [statsSavedMsg, setStatsSavedMsg] = useState<string | null>(null);

  // Copy state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  // Firestore users list
  const [cloudUsers, setCloudUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Active QR Modal viewer
  const [activeQrModal, setActiveQrModal] = useState<{
    type: 'player' | 'match' | 'item' | 'generic';
    id: string;
    title: string;
    subtitle: string;
    code: string;
    dorsal?: number;
    posCode?: string;
    xpReward: number;
  } | null>(null);

  useEffect(() => {
    setEditXp(user.xp);
    setEditCoins(user.managerCoins);
    setEditPacks(user.playerPacks);
    setEditLevel(user.level);
  }, [user]);

  if (!isOpen) return null;

  const handleCopyCode = (id: string, code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedId(id);
      soundEffects.playSuccess();
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleAdminKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKeyInput.trim()) return;
    const ok = adminLoginWithKey(adminKeyInput);
    if (ok) {
      setAdminKeyError(null);
      setAdminKeyInput('');
    } else {
      setAdminKeyError('Clave incorrecta. Usa la clave oficial o inicia sesión con 14krokodilo14@gmail.com.');
    }
  };

  const handleLoadCloudUsers = async () => {
    setLoadingUsers(true);
    try {
      const usersList = await fetchAllUsersForAdmin();
      setCloudUsers(usersList);
      soundEffects.playSuccess();
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Filter player entries
  const squadPlayers = ibardexEntries.filter(e => e.category === 'plantilla' || e.category === 'cuerpo_tecnico');
  const filteredPlayers = squadPlayers.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.qrCode && p.qrCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.dorsal && p.dorsal.toString().includes(searchQuery)) ||
      (p.posCode && p.posCode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'todos' || p.position === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Items entries
  const itemEntries = ibardexEntries.filter(e => e.category === 'objetos');

  const printAllQrs = (type: 'players' | 'matches') => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let itemsHtml = '';
    if (type === 'players') {
      squadPlayers.forEach(p => {
        const qrCode = p.qrCode || `IBAR-JUGADOR-${p.dorsal || p.number}-${p.name.toUpperCase().replace(/\s+/g, '-')}`;
        itemsHtml += `
          <div class="qr-card">
            <div class="header">C.D. SOTO IBARBASO</div>
            <div class="title">${p.name} ${p.dorsal ? '#' + p.dorsal : ''}</div>
            <div class="pos">${p.position || p.category} • ${p.posCode || ''}</div>
            <div class="qr-placeholder">QR: ${qrCode}</div>
            <div class="code">${qrCode}</div>
            <div class="footer">Escanea con la App Oficial para desbloquear (+${p.xpReward || 25} XP)</div>
          </div>
        `;
      });
    } else {
      gyms.forEach(g => {
        const rival = g.rivalName || g.rival || 'Rival';
        const qrPresencial = g.qrCodePresencial || g.qrCode || `IBAR-PARTIDO-J0${g.number}-PRESENCIAL`;
        const qrStream = g.qrCodeStream || `IBAR-PARTIDO-J0${g.number}-STREAM`;

        itemsHtml += `
          <div class="qr-card">
            <div class="header">C.D. SOTO IBARBASO • ESTADIO (PRESENCIAL)</div>
            <div class="title">Jornada #${g.number}: Soto vs ${rival}</div>
            <div class="pos">📍 ${g.stadium} • ${g.matchDate}</div>
            <div class="qr-placeholder">QR ESTADIO: ${qrPresencial}</div>
            <div class="code">${qrPresencial}</div>
            <div class="footer">¡+200 Monedas 🪙, +100 XP y 1 Sobre Oficial!</div>
          </div>
          <div class="qr-card" style="border-color: #9333ea;">
            <div class="header" style="color: #9333ea;">C.D. SOTO IBARBASO • STREAM OFICIAL</div>
            <div class="title">Jornada #${g.number}: Soto vs ${rival}</div>
            <div class="pos">📺 Directo Twitch / YouTube • ${g.matchDate}</div>
            <div class="qr-placeholder">QR STREAM: ${qrStream}</div>
            <div class="code">${qrStream}</div>
            <div class="footer">¡+80 Monedas 🪙 y +40 XP de Directo!</div>
          </div>
        `;
      });
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>CÓDIGOS QR OFICIALES C.D. SOTO IBARBASO</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
            .qr-card { border: 2px solid #dc2626; border-radius: 12px; padding: 12px; text-align: center; break-inside: avoid; }
            .header { font-size: 9px; font-weight: bold; color: #dc2626; letter-spacing: 1px; }
            .title { font-size: 13px; font-weight: bold; margin: 4px 0; }
            .pos { font-size: 10px; color: #52525b; margin-bottom: 8px; }
            .qr-placeholder { background: #f4f4f5; padding: 16px; border: 1px dashed #71717a; border-radius: 8px; font-family: monospace; font-size: 11px; margin-bottom: 8px; font-weight: bold; }
            .code { font-family: monospace; font-size: 9px; font-weight: bold; }
            .footer { font-size: 8px; color: #71717a; margin-top: 6px; }
          </style>
        </head>
        <body>
          <h2 style="text-align: center; color: #dc2626;">HOJA OFICIAL DE CÓDIGOS QR - CD SOTO IBARBASO</h2>
          <div class="grid">${itemsHtml}</div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-full max-w-2xl bg-zinc-900 border-4 border-red-600 rounded-3xl p-5 shadow-[8px_8px_0px_0px_#000000] pixel-box-red my-auto max-h-[92vh] flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white bg-zinc-800 border-2 border-zinc-700 rounded-xl transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000000]"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-3 border-b-2 border-zinc-800 pb-3">
            <div className="p-2 bg-red-600 text-white rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-tech text-xl font-bold text-white uppercase tracking-wider">
                  Panel de Administración
                </h2>
                {isAdmin ? (
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/40 rounded-md text-[9px] font-pixel font-bold">
                    ADMIN ACTIVO
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/40 rounded-md text-[9px] font-pixel font-bold">
                    BLOQUEADO
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-300 font-medium">
                Gestión oficial de códigos QR físicos, plantilla y base de datos
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={adminLogout}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-red-400 text-[10px] font-pixel rounded-xl border border-zinc-700 flex items-center gap-1.5 transition-all shadow-sm"
                title="Cerrar sesión de administrador"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Salir</span>
              </button>
            )}
          </div>

          {/* GATE: IF NOT ADMIN, REQUIRE AUTHENTICATION */}
          {!isAdmin ? (
            <div className="py-6 px-4 text-center space-y-5 my-auto">
              <div className="w-16 h-16 bg-red-950/60 border-2 border-red-600 rounded-2xl flex items-center justify-center mx-auto text-red-400 shadow-inner">
                <Lock className="w-8 h-8" />
              </div>

              <div className="max-w-md mx-auto space-y-1">
                <h3 className="font-tech text-lg font-bold text-white uppercase">
                  Acceso Restringido para Administradores
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Para gestionar los códigos QR oficiales físicos y los datos del club, accede con tu cuenta autorizada (<span className="text-yellow-400 font-mono">14krokodilo14@gmail.com</span>) o introduce tu clave maestra.
                </p>
              </div>

              {/* Login with Google option */}
              <div className="max-w-sm mx-auto space-y-3">
                <button
                  onClick={async () => {
                    try {
                      await loginWithGoogle();
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs rounded-xl border-2 border-zinc-700 flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_#000000] active:translate-y-0.5 transition-all"
                >
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                  <span>Iniciar con Google (14krokodilo14@gmail.com)</span>
                </button>

                <div className="flex items-center gap-2 text-zinc-500 text-[10px]">
                  <div className="flex-1 h-px bg-zinc-800" />
                  <span>O CON CLAVE MAESTRA</span>
                  <div className="flex-1 h-px bg-zinc-800" />
                </div>

                {/* Master PIN form */}
                <form onSubmit={handleAdminKeySubmit} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="Introduce clave de admin..."
                      value={adminKeyInput}
                      onChange={e => setAdminKeyInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-zinc-950 border-2 border-zinc-700 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500 shadow-inner font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-pixel text-[10px] rounded-xl border-2 border-black font-bold shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5"
                    >
                      ENTRAR
                    </button>
                  </div>
                  {adminKeyError && (
                    <p className="text-[10px] text-red-400 font-medium text-left">
                      {adminKeyError}
                    </p>
                  )}
                  <p className="text-[9px] text-zinc-300 text-center font-mono">
                    Clave predeterminada: <span className="text-yellow-400 font-bold">SOTO2025</span> o <span className="text-yellow-400 font-bold">14krokodilo14</span>
                  </p>
                </form>
              </div>
            </div>
          ) : (
            <>
              {/* Tabs Navigation */}
              <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 shrink-0">
                <button
                  onClick={() => setTab('qr_jugadores')}
                  className={`px-3 py-2 rounded-xl font-silkscreen text-[10px] uppercase font-bold border-2 transition-all flex items-center gap-1.5 whitespace-nowrap shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5 ${
                    tab === 'qr_jugadores'
                      ? 'bg-red-600 border-black text-white'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>QRs Jugadores</span>
                </button>

                <button
                  onClick={() => setTab('qr_partidos')}
                  className={`px-3 py-2 rounded-xl font-silkscreen text-[10px] uppercase font-bold border-2 transition-all flex items-center gap-1.5 whitespace-nowrap shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5 ${
                    tab === 'qr_partidos'
                      ? 'bg-red-600 border-black text-white'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>QRs Partidos</span>
                </button>

                <button
                  onClick={() => setTab('qr_items')}
                  className={`px-3 py-2 rounded-xl font-silkscreen text-[10px] uppercase font-bold border-2 transition-all flex items-center gap-1.5 whitespace-nowrap shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5 ${
                    tab === 'qr_items'
                      ? 'bg-red-600 border-black text-white'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>QRs Merchandising</span>
                </button>

                <button
                  onClick={() => setTab('datos_club')}
                  className={`px-3 py-2 rounded-xl font-silkscreen text-[10px] uppercase font-bold border-2 transition-all flex items-center gap-1.5 whitespace-nowrap shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5 ${
                    tab === 'datos_club'
                      ? 'bg-red-600 border-black text-white'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <Database className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Gestión de Datos</span>
                </button>

                <button
                  onClick={() => {
                    setTab('firestore_users');
                    if (cloudUsers.length === 0) handleLoadCloudUsers();
                  }}
                  className={`px-3 py-2 rounded-xl font-silkscreen text-[10px] uppercase font-bold border-2 transition-all flex items-center gap-1.5 whitespace-nowrap shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5 ${
                    tab === 'firestore_users'
                      ? 'bg-red-600 border-black text-white'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>Usuarios Firestore</span>
                </button>
              </div>

              {/* TAB CONTENT SCROLLABLE */}
              <div className="flex-1 overflow-y-auto pr-1">
                {/* TAB 1: QRS JUGADORES */}
                {tab === 'qr_jugadores' && (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          type="text"
                          placeholder="Buscar por nombre, dorsal o código..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 bg-zinc-950 border-2 border-zinc-700 rounded-xl text-xs text-white placeholder:text-zinc-500 shadow-inner"
                        />
                      </div>

                      <select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value as any)}
                        className="px-2.5 py-1.5 bg-zinc-950 border-2 border-zinc-700 rounded-xl text-xs text-white"
                      >
                        <option value="todos">Todas las Posiciones</option>
                        <option value="Portero">Porteros</option>
                        <option value="Defensa">Defensas</option>
                        <option value="Centrocampista">Centrocampistas</option>
                        <option value="Delantero">Delanteros</option>
                        <option value="Cuerpo Técnico">Cuerpo Técnico</option>
                      </select>

                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={async () => {
                            if (window.confirm('¿Seguro que deseas resetear y bloquear todos los jugadores del álbum?')) {
                              await resetAllPlayers();
                              setResetPlayersDone(true);
                              setTimeout(() => setResetPlayersDone(false), 3000);
                            }
                          }}
                          className={`px-3 py-1.5 font-silkscreen text-[9px] rounded-xl border flex items-center justify-center gap-1 shrink-0 transition-all ${
                            resetPlayersDone
                              ? 'bg-emerald-600 border-emerald-400 text-white'
                              : 'bg-red-950/80 hover:bg-red-900 border-red-800 text-red-300 hover:text-white'
                          }`}
                          title="Resetear todos los jugadores desbloqueados a bloqueado"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${resetPlayersDone ? 'animate-spin' : ''}`} />
                          <span>{resetPlayersDone ? '¡Álbum Reseteado!' : 'Resetear Jugadores'}</span>
                        </button>

                        <button
                          onClick={() => printAllQrs('players')}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-silkscreen text-[9px] rounded-xl border border-zinc-600 flex items-center justify-center gap-1 shrink-0"
                        >
                          <Printer className="w-3.5 h-3.5 text-yellow-400" />
                          <span>Imprimir Todos</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {filteredPlayers.map(player => {
                        const qrCode =
                          player.qrCode ||
                          `IBAR-JUGADOR-${player.dorsal || player.number}-${player.name.toUpperCase().replace(/\s+/g, '-')}`;
                        const isUnlocked = user.unlockedEntries.includes(player.id);

                        return (
                          <div
                            key={player.id}
                            className="p-2.5 bg-zinc-950 border-2 border-zinc-800 rounded-xl flex items-center justify-between gap-3 shadow-sm hover:border-zinc-700 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-9 h-9 bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center p-0.5 shrink-0">
                                <PixelSprite name={player.spriteKey} size={28} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-tech text-sm font-bold text-white truncate">
                                    {player.name}
                                  </span>
                                  {player.dorsal && (
                                    <span className="font-pixel text-[8px] text-red-400 font-bold bg-zinc-900 px-1 py-0.2 rounded border border-zinc-800">
                                      #{player.dorsal}
                                    </span>
                                  )}
                                  <span
                                    className={`text-[8px] font-pixel px-1 py-0.2 rounded border ${
                                      isUnlocked
                                        ? 'bg-green-950 text-green-400 border-green-800'
                                        : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                                    }`}
                                  >
                                    {isUnlocked ? 'DESBLOQUEADO' : 'BLOQUEADO'}
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-zinc-400 block truncate">
                                  {qrCode}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleCopyCode(player.id, qrCode)}
                                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700 transition-all active:translate-y-0.5"
                                title="Copiar código QR"
                              >
                                {copiedId === player.id ? (
                                  <Check className="w-3.5 h-3.5 text-green-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() =>
                                  setActiveQrModal({
                                    type: 'player',
                                    id: player.id,
                                    title: `${player.name} ${player.dorsal ? `#${player.dorsal}` : ''}`,
                                    subtitle: `${player.position || player.category} • ${player.posCode || ''}`,
                                    code: qrCode,
                                    dorsal: player.dorsal,
                                    posCode: player.posCode,
                                    xpReward: player.xpReward,
                                  })
                                }
                                className="px-2.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-silkscreen text-[9px] rounded-lg border border-black flex items-center gap-1 shadow-sm font-bold transition-all active:translate-y-0.5"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Ver QR</span>
                              </button>

                              {/* Toggle lock / unlock manually for admin testing */}
                              <button
                                onClick={() => adminUnlockOrLockEntry(player.id, !isUnlocked)}
                                className={`p-1.5 rounded-lg border transition-all ${
                                  isUnlocked
                                    ? 'bg-zinc-900 text-red-400 border-zinc-700 hover:bg-red-950'
                                    : 'bg-zinc-900 text-green-400 border-zinc-700 hover:bg-green-950'
                                }`}
                                title={isUnlocked ? 'Bloquear jugador' : 'Desbloquear como admin'}
                              >
                                {isUnlocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 2: QRS PARTIDOS */}
                {tab === 'qr_partidos' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-silkscreen text-[10px] text-zinc-400 uppercase font-bold">
                        Carteles QR de Estadio y Stream
                      </span>
                      <button
                        onClick={() => printAllQrs('matches')}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-silkscreen text-[9px] rounded-xl border border-zinc-600 flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5 text-yellow-400" />
                        <span>Imprimir Todos los Partidos</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {gyms.map(g => {
                        const rival = g.rivalName || g.rival || 'Rival';
                        const qrPresencial = g.qrCodePresencial || g.qrCode || `IBAR-PARTIDO-J0${g.number}-PRESENCIAL`;
                        const qrStream = g.qrCodeStream || `IBAR-PARTIDO-J0${g.number}-STREAM`;
                        const matchStatus = user.attendedMatches?.find(m => m.gymId === g.id);
                        const isAttended = user.unlockedGyms.includes(g.id) || !!matchStatus;

                        return (
                          <div
                            key={g.id}
                            className="p-3 bg-zinc-950 border-2 border-zinc-800 rounded-xl space-y-2.5 shadow-sm hover:border-zinc-700"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-pixel text-[8px] text-red-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 font-bold">
                                  JORNADA #{g.number}
                                </span>
                                <h4 className="font-tech text-sm font-bold text-white truncate">
                                  Soto Ibarbaso vs {rival}
                                </h4>
                              </div>
                              <span
                                className={`text-[8px] font-pixel px-1.5 py-0.5 rounded border font-bold ${
                                  matchStatus?.mode === 'ambos' || matchStatus?.mode === 'presencial'
                                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                    : matchStatus?.mode === 'stream'
                                    ? 'bg-purple-950 text-purple-300 border-purple-800'
                                    : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                                }`}
                              >
                                {matchStatus?.mode === 'ambos' || matchStatus?.mode === 'presencial'
                                  ? '✓ EN PERSONA'
                                  : matchStatus?.mode === 'stream'
                                  ? '✓ EN STREAM'
                                  : 'PENDIENTE'}
                              </span>
                            </div>

                            <span className="text-[10px] text-zinc-400 block">
                              📍 {g.stadium} • {g.matchDate}
                            </span>

                            {/* Dual QR Options */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-zinc-900">
                              {/* Presencial QR Box */}
                              <div className="p-2 bg-zinc-900/90 border border-emerald-900/60 rounded-lg flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                  <span className="text-[9px] font-silkscreen text-emerald-400 font-bold block">
                                    🏟️ QR ESTADIO (+200 🪙)
                                  </span>
                                  <span className="text-[9px] font-mono text-zinc-300 block truncate">
                                    {qrPresencial}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => handleCopyCode(`presencial-${g.id}`, qrPresencial)}
                                    className="p-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700"
                                    title="Copiar QR Presencial"
                                  >
                                    {copiedId === `presencial-${g.id}` ? (
                                      <Check className="w-3 h-3 text-green-400" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() =>
                                      setActiveQrModal({
                                        type: 'match',
                                        id: `presencial-${g.id}`,
                                        title: `Soto vs ${rival} (Estadio)`,
                                        subtitle: `Jornada #${g.number} • ${g.stadium} (+200 🪙 y +1 Sobre)`,
                                        code: qrPresencial,
                                        xpReward: 100,
                                      })
                                    }
                                    className="p-1 px-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-silkscreen text-[8px] rounded border border-black font-bold flex items-center gap-0.5"
                                  >
                                    <Eye className="w-2.5 h-2.5" />
                                    <span>Ver</span>
                                  </button>
                                </div>
                              </div>

                              {/* Stream QR Box */}
                              <div className="p-2 bg-zinc-900/90 border border-purple-900/60 rounded-lg flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                  <span className="text-[9px] font-silkscreen text-purple-400 font-bold block">
                                    📺 QR STREAM (+80 🪙)
                                  </span>
                                  <span className="text-[9px] font-mono text-zinc-300 block truncate">
                                    {qrStream}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => handleCopyCode(`stream-${g.id}`, qrStream)}
                                    className="p-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700"
                                    title="Copiar QR Stream"
                                  >
                                    {copiedId === `stream-${g.id}` ? (
                                      <Check className="w-3 h-3 text-green-400" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() =>
                                      setActiveQrModal({
                                        type: 'match',
                                        id: `stream-${g.id}`,
                                        title: `Soto vs ${rival} (Stream)`,
                                        subtitle: `Jornada #${g.number} • Directo (+80 🪙 y +40 XP)`,
                                        code: qrStream,
                                        xpReward: 40,
                                      })
                                    }
                                    className="p-1 px-1.5 bg-purple-700 hover:bg-purple-600 text-white font-silkscreen text-[8px] rounded border border-black font-bold flex items-center gap-0.5"
                                  >
                                    <Eye className="w-2.5 h-2.5" />
                                    <span>Ver</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 3: QRS OBJETOS Y MERCHANDISING */}
                {tab === 'qr_items' && (
                  <div className="space-y-3">
                    <span className="font-silkscreen text-[10px] text-zinc-400 uppercase font-bold block">
                      Códigos QR para Bufandas, Camisetas y Objetos Oficiales
                    </span>

                    <div className="space-y-1.5">
                      {itemEntries.map(item => {
                        const qrCode =
                          item.qrCode ||
                          `IBAR-ITEM-${item.id.replace('#', '')}-${item.name.toUpperCase().replace(/\s+/g, '-')}`;
                        const isUnlocked = user.unlockedEntries.includes(item.id);

                        return (
                          <div
                            key={item.id}
                            className="p-3 bg-zinc-950 border-2 border-zinc-800 rounded-xl flex items-center justify-between gap-3 shadow-sm hover:border-zinc-700"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-9 h-9 bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center p-0.5 shrink-0">
                                <PixelSprite name={item.spriteKey} size={28} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-tech text-sm font-bold text-white truncate">
                                    {item.name}
                                  </span>
                                  <span
                                    className={`text-[8px] font-pixel px-1 py-0.2 rounded border ${
                                      isUnlocked
                                        ? 'bg-green-950 text-green-400 border-green-800'
                                        : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                                    }`}
                                  >
                                    {isUnlocked ? 'EN INVENTARIO' : 'NO DESBLOQUEADO'}
                                  </span>
                                </div>
                                <span className="text-[10px] text-zinc-400 block truncate">
                                  {item.description}
                                </span>
                                <span className="text-[9px] font-mono text-zinc-500 block truncate">
                                  {qrCode}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleCopyCode(item.id, qrCode)}
                                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700"
                                title="Copiar código QR"
                              >
                                {copiedId === item.id ? (
                                  <Check className="w-3.5 h-3.5 text-green-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() =>
                                  setActiveQrModal({
                                    type: 'item',
                                    id: item.id,
                                    title: item.name,
                                    subtitle: 'Objeto de Grada Soto Ibarbaso',
                                    code: qrCode,
                                    xpReward: item.xpReward,
                                  })
                                }
                                className="px-2.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-silkscreen text-[9px] rounded-lg border border-black flex items-center gap-1 font-bold shadow-sm"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Ver QR</span>
                              </button>
                              <button
                                onClick={() => adminUnlockOrLockEntry(item.id, !isUnlocked)}
                                className={`p-1.5 rounded-lg border transition-all ${
                                  isUnlocked
                                    ? 'bg-zinc-900 text-red-400 border-zinc-700 hover:bg-red-950'
                                    : 'bg-zinc-900 text-green-400 border-zinc-700 hover:bg-green-950'
                                }`}
                                title={isUnlocked ? 'Bloquear objeto' : 'Desbloquear objeto'}
                              >
                                {isUnlocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 4: GESTIÓN DE DATOS Y ESTADO DEL CLUB */}
                {tab === 'datos_club' && (
                  <div className="space-y-4 text-xs">
                    {/* Direct Stats Editor */}
                    <div className="p-4 bg-zinc-950 border-2 border-zinc-800 rounded-2xl shadow-[3px_3px_0px_0px_#000000] space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-silkscreen text-xs text-yellow-400 uppercase font-bold">
                          ⚡ Control de Saldos y Nivel del Aficionado
                        </h3>
                        <span className="font-mono text-[10px] text-zinc-400">
                          Usuario: {user.name} ({user.instagram})
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-1">XP Total:</label>
                          <input
                            type="number"
                            value={editXp}
                            onChange={e => setEditXp(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-1">Nivel:</label>
                          <input
                            type="number"
                            value={editLevel}
                            onChange={e => setEditLevel(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-1">Monedas Mánager (🪙):</label>
                          <input
                            type="number"
                            value={editCoins}
                            onChange={e => setEditCoins(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-1">Sobres Disponibles (📦):</label>
                          <input
                            type="number"
                            value={editPacks}
                            onChange={e => setEditPacks(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => {
                            adminSetUserStats({
                              xp: editXp,
                              level: editLevel,
                              coins: editCoins,
                              packs: editPacks,
                            });
                            setStatsSavedMsg('¡Saldos actualizados con éxito!');
                            setTimeout(() => setStatsSavedMsg(null), 2500);
                          }}
                          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-pixel text-[10px] rounded-xl border-2 border-black font-bold shadow-[2px_2px_0px_0px_#000000] active:translate-y-0.5"
                        >
                          GUARDAR SALDOS
                        </button>
                        {statsSavedMsg && (
                          <span className="text-green-400 font-pixel text-[10px] font-bold">
                            ✓ {statsSavedMsg}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Total Reset Club Database */}
                    <div className="p-4 bg-zinc-950 border-2 border-zinc-800 rounded-2xl shadow-[3px_3px_0px_0px_#000000]">
                      <h3 className="font-silkscreen text-xs text-red-400 uppercase font-bold mb-1">
                        ⚠️ Reinicio Total de la Base de Datos
                      </h3>
                      <p className="text-[11px] text-zinc-300 leading-relaxed mb-3">
                        Borra todos los cromos desbloqueados, partidos asistidos, monedas y alineación tanto en local como en la nube.
                      </p>

                      {!confirmReset ? (
                        <button
                          onClick={() => setConfirmReset(true)}
                          className="py-2 px-4 bg-zinc-800 hover:bg-red-950 text-red-400 hover:text-red-300 font-silkscreen text-[10px] rounded-xl border-2 border-zinc-700 flex items-center gap-2 transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000000]"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Restablecer Todo a Estado Inicial</span>
                        </button>
                      ) : (
                        <div className="p-3 bg-red-950/80 border-2 border-red-700 rounded-xl space-y-2 text-center">
                          <p className="text-[11px] font-silkscreen text-white">
                            ¿Estás seguro de que quieres borrar todos los datos del club?
                          </p>
                          <div className="flex gap-2 justify-center pt-1">
                            <button
                              onClick={() => {
                                adminResetData();
                                setConfirmReset(false);
                                setResetDone(true);
                                setTimeout(() => setResetDone(false), 3000);
                              }}
                              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-silkscreen text-[10px] rounded-lg border border-red-400 font-bold"
                            >
                              Sí, Borrar Todo
                            </button>
                            <button
                              onClick={() => setConfirmReset(false)}
                              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-silkscreen text-[10px] rounded-lg border border-zinc-600"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                      {resetDone && (
                        <p className="text-green-400 font-silkscreen text-[10px] mt-2">
                          ✓ Todos los datos han sido reseteados a valores de fábrica.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 5: USUARIOS EN CLOUD FIRESTORE */}
                {tab === 'firestore_users' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-silkscreen text-[10px] text-zinc-400 uppercase font-bold">
                        Colección 'users' en Firestore ({cloudUsers.length} registros)
                      </span>
                      <button
                        onClick={handleLoadCloudUsers}
                        disabled={loadingUsers}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-silkscreen text-[9px] rounded-xl border border-zinc-600 flex items-center gap-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${loadingUsers ? 'animate-spin' : ''}`} />
                        <span>{loadingUsers ? 'Cargando...' : 'Recargar'}</span>
                      </button>
                    </div>

                    {cloudUsers.length === 0 && !loadingUsers ? (
                      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl text-center text-zinc-400 text-xs">
                        No hay usuarios sincronizados en la nube aún o pulsa "Recargar".
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {cloudUsers.map(u => (
                          <div
                            key={u.id}
                            className="p-3 bg-zinc-950 border-2 border-zinc-800 rounded-xl flex items-center justify-between gap-3"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-tech text-sm font-bold text-white">
                                  {u.name || 'Sin Nombre'}
                                </span>
                                <span className="text-[10px] text-zinc-400 font-mono">
                                  {u.instagram || u.email || `@${u.id.slice(0, 6)}`}
                                </span>
                                {u.email?.toLowerCase() === '14krokodilo14@gmail.com' && (
                                  <span className="bg-red-950 text-red-400 text-[8px] font-pixel px-1.5 py-0.2 rounded border border-red-800">
                                    ADMIN
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-zinc-400 block mt-0.5 font-mono">
                                Nivel {u.level || 1} • {u.xp || 0} XP • {u.unlockedEntries?.length || 0} cromos • {u.managerCoins || 0} 🪙
                              </span>
                            </div>

                            <button
                              onClick={async () => {
                                if (window.confirm(`¿Eliminar de Firestore el perfil de ${u.name}?`)) {
                                  await adminDeleteUserDoc(u.id);
                                  handleLoadCloudUsers();
                                }
                              }}
                              className="p-2 bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-300 rounded-lg border border-zinc-700 transition-colors"
                              title="Eliminar registro de Firestore"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* QR Code Real Generator & Viewer Modal */}
      <QrCodeDisplayModal
        isOpen={!!activeQrModal}
        onClose={() => setActiveQrModal(null)}
        item={activeQrModal}
      />
    </>
  );
};
