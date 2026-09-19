import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Lock, Sparkles, X, Package, Shield, Zap, Heart, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { IbardexEntry, EntryCategory } from '../types';
import { PixelSprite } from './PixelSprites';
import { soundEffects } from '../utils/audio';

export const IbardexView: React.FC = () => {
  const { ibardexEntries, user, setActiveTab, setIsScannerOpen } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'guardadas' | 'faltantes'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<IbardexEntry | null>(null);

  const categories = [
    { id: 'todos', label: 'TODOS' },
    { id: 'plantilla', label: 'PLANTILLA' },
    { id: 'rivales', label: 'RIVALES' },
    { id: 'cuerpo_tecnico', label: 'STAFF & AFICIÓN' },
    { id: 'objetos', label: 'OBJETOS' },
  ];

  const filteredEntries = ibardexEntries.filter(entry => {
    const isUnlocked = user.unlockedEntries.includes(entry.id);
    const matchesStatus =
      statusFilter === 'todos' ||
      (statusFilter === 'guardadas' && isUnlocked) ||
      (statusFilter === 'faltantes' && !isUnlocked);
    const matchesCategory =
      selectedCategory === 'todos' || entry.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      (isUnlocked && entry.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      entry.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.position && entry.position.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const unlockedCount = ibardexEntries.filter(e =>
    user.unlockedEntries.includes(e.id)
  ).length;

  const handleSelectEntry = (entry: IbardexEntry) => {
    soundEffects.playClick();
    setSelectedEntry(entry);
  };

  const getRarityStyle = (rarity?: string) => {
    switch (rarity) {
      case 'Legendario':
        return 'border-yellow-400 bg-yellow-950/60 text-yellow-300';
      case 'Épico':
        return 'border-purple-500 bg-purple-950/60 text-purple-300';
      case 'Raro':
        return 'border-blue-500 bg-blue-950/60 text-blue-300';
      default:
        return 'border-zinc-700 bg-zinc-800/60 text-zinc-300';
    }
  };

  return (
    <div className="space-y-4 pb-24 pt-1">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-zinc-900 to-zinc-900 border-2 border-red-600 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000000]">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[10px] text-red-500 font-bold uppercase drop-shadow">
                ÁLBUM DIGITAL OFICIAL
              </span>
            </div>
            <h2 className="font-tech text-2xl font-bold text-white tracking-wide uppercase">
              PLANTILLA E IBARDEX
            </h2>
            <p className="text-xs text-zinc-300 mt-0.5 font-medium">
              Colección completa de jugadores, rivales, leyendas y objetos
            </p>
          </div>

          <div className="text-right bg-zinc-950 border-2 border-red-700 p-2.5 rounded-xl shadow-[2px_2px_0px_0px_#000000] shrink-0">
            <span className="font-silkscreen text-[9px] text-zinc-400 block uppercase font-bold">
              DESBLOQUEADOS
            </span>
            <span className="font-tech text-xl font-bold text-yellow-400">
              {unlockedCount} <span className="text-xs text-zinc-500 font-normal">/ {ibardexEntries.length}</span>
            </span>
          </div>
        </div>

        {/* Quick Booster Packs Link Banner */}
        <div className="mt-3.5 pt-3 border-t border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Package className="w-4 h-4 text-yellow-400" />
            <span className="text-zinc-200">Tienes <strong className="text-yellow-400">{user.playerPacks}</strong> sobres sin abrir</span>
          </div>
          <button
            onClick={() => setActiveTab('sobres')}
            className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-pixel text-[9px] rounded-xl pixel-button border-2 border-black font-bold shadow"
          >
            ABRIR SOBRES
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por jugador, posición o número..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-950 border-2 border-zinc-700 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500 shadow-inner"
          />
        </div>

        {/* Status Filter Tabs (Colección / Faltantes) */}
        <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2 border-t border-zinc-800">
          <button
            onClick={() => {
              soundEffects.playClick();
              setStatusFilter('todos');
            }}
            className={`py-1.5 px-2 rounded-xl font-silkscreen text-[9px] uppercase transition-all ${
              statusFilter === 'todos'
                ? 'bg-zinc-100 text-black font-bold shadow-[2px_2px_0px_0px_#000000]'
                : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
            }`}
          >
            TODAS ({ibardexEntries.length})
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setStatusFilter('guardadas');
            }}
            className={`py-1.5 px-2 rounded-xl font-silkscreen text-[9px] uppercase transition-all ${
              statusFilter === 'guardadas'
                ? 'bg-emerald-500 text-black font-bold shadow-[2px_2px_0px_0px_#000000]'
                : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
            }`}
          >
            EN ÁLBUM ({unlockedCount})
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setStatusFilter('faltantes');
            }}
            className={`py-1.5 px-2 rounded-xl font-silkscreen text-[9px] uppercase transition-all ${
              statusFilter === 'faltantes'
                ? 'bg-red-500 text-white font-bold shadow-[2px_2px_0px_0px_#000000]'
                : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
            }`}
          >
            FALTAN ({ibardexEntries.length - unlockedCount})
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 mt-2.5 scrollbar-none">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1 rounded-xl font-silkscreen text-[10px] uppercase whitespace-nowrap transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-red-600 text-white font-bold border-2 border-red-400 shadow-[2px_2px_0px_0px_#000000]'
                    : 'bg-zinc-800 text-zinc-300 hover:text-white border-2 border-zinc-700 hover:border-zinc-600'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Numbered Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {filteredEntries.map(entry => {
          const isUnlocked = user.unlockedEntries.includes(entry.id);

          return (
            <motion.div
              key={entry.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelectEntry(entry)}
              className={`relative cursor-pointer p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center select-none shadow-[3px_3px_0px_0px_#000000] ${
                isUnlocked
                  ? 'bg-gradient-to-b from-zinc-900 to-zinc-950 border-red-600 hover:border-red-400'
                  : 'bg-zinc-950 border-zinc-800 opacity-60 hover:opacity-80'
              }`}
            >
              {/* Card Top Row */}
              <div className="w-full flex items-center justify-between mb-1.5">
                <span className="font-silkscreen text-[9px] text-zinc-400 font-bold">
                  {entry.id} {entry.dorsal ? `#${entry.dorsal}` : ''}
                </span>
                {isUnlocked ? (
                  <span
                    className={`font-pixel text-[7.5px] px-1.5 py-0.5 rounded border font-bold ${getRarityStyle(
                      entry.rarity
                    )}`}
                  >
                    {entry.rarity || 'Común'}
                  </span>
                ) : (
                  <Lock className="w-3.5 h-3.5 text-zinc-600" />
                )}
              </div>

              {/* Sprite or Locked Silhouette */}
              <div className="my-2 p-2 bg-zinc-900/90 rounded-xl border-2 border-zinc-800 w-20 h-20 flex items-center justify-center shadow-inner">
                <PixelSprite
                  name={entry.spriteKey}
                  size={52}
                  silhouette={!isUnlocked}
                />
              </div>

              {/* Name & Status */}
              <h3 className="font-tech text-sm font-bold text-white truncate w-full tracking-wide">
                {isUnlocked ? entry.name : '??? BLOQUEADO'}
              </h3>
              <div className="flex items-center justify-center gap-1.5 mt-0.5 truncate w-full">
                <span className="text-[10px] text-zinc-400 font-medium capitalize truncate">
                  {isUnlocked ? entry.position || entry.category : 'Desconocido'}
                </span>
                {isUnlocked && entry.posCode && (
                  <span className="font-silkscreen text-[8px] bg-red-950 text-red-300 border border-red-800 px-1 rounded">
                    {entry.posCode}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Modal for Selected Ibardex Entry */}
      <AnimatePresence>
        {selectedEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-sm overflow-hidden bg-zinc-900 border-4 border-red-600 rounded-3xl p-5 shadow-[6px_6px_0px_0px_#000000]"
            >
              <div className="absolute inset-0 crt-scanlines opacity-40 pointer-events-none" />

              <button
                onClick={() => setSelectedEntry(null)}
                className="absolute top-3 right-3 p-1.5 text-zinc-400 hover:text-white bg-zinc-800 border-2 border-zinc-700 rounded-xl transition-all active:translate-y-0.5 shadow-[2px_2px_0px_0px_#000000]"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="font-silkscreen text-xs text-red-500 font-bold tracking-wider">
                  REGISTRO {selectedEntry.id} {selectedEntry.dorsal ? `• DORSAL #${selectedEntry.dorsal}` : ''}
                </span>
                {selectedEntry.rarity && (
                  <span
                    className={`font-pixel text-[8px] px-2 py-0.5 rounded border uppercase font-bold ${getRarityStyle(
                      selectedEntry.rarity
                    )}`}
                  >
                    {selectedEntry.rarity}
                  </span>
                )}
              </div>

              {/* Center Showcase */}
              {user.unlockedEntries.includes(selectedEntry.id) ? (
                <>
                  <div className="flex items-center justify-center p-4 bg-zinc-950 border-2 border-red-600 rounded-2xl mb-3 pixel-box shadow-[3px_3px_0px_0px_#000000]">
                    <PixelSprite name={selectedEntry.spriteKey} size={80} />
                  </div>

                  <h3 className="font-tech text-2xl font-bold text-white text-center tracking-wide mb-0.5">
                    {selectedEntry.name}
                  </h3>

                  <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2">
                    <span className="text-xs text-yellow-400 font-silkscreen font-bold">
                      {selectedEntry.position || selectedEntry.category.toUpperCase()}
                      {selectedEntry.posCode ? ` (${selectedEntry.posCode})` : ''}
                    </span>
                    {selectedEntry.team && (
                      <span className="text-[10px] text-zinc-400 font-tech">
                        • {selectedEntry.team}
                      </span>
                    )}
                  </div>

                  {/* Secondary positions badge list if available */}
                  {selectedEntry.otherPositions && selectedEntry.otherPositions.length > 0 && (
                    <div className="flex items-center justify-center gap-1 mb-2.5 flex-wrap">
                      <span className="text-[9px] text-zinc-400 font-silkscreen">Otras posiciones:</span>
                      {selectedEntry.otherPositions.map(pos => (
                        <span
                          key={pos}
                          className="font-silkscreen text-[8px] px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 text-zinc-200 rounded font-bold"
                        >
                          {pos}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-zinc-300 text-center leading-relaxed mb-3">
                    {selectedEntry.description}
                  </p>

                  {/* Special Move */}
                  {selectedEntry.specialMove && (
                    <div className="p-2.5 bg-red-950 border-2 border-red-700 rounded-xl mb-3 text-xs">
                      <span className="font-silkscreen text-[9px] text-yellow-300 block uppercase font-bold">
                        ⚡ Jugada / Habilidad Especial:
                      </span>
                      <p className="text-white font-tech text-sm font-bold mt-0.5">
                        {selectedEntry.specialMove}
                      </p>
                    </div>
                  )}

                  {/* Lore Box */}
                  <div className="p-3 bg-zinc-950 border-2 border-zinc-800 rounded-xl mb-3 shadow-inner">
                    <span className="font-silkscreen text-[9px] text-yellow-400 block uppercase mb-1 font-bold">
                      📜 Archivo Histórico del Soto:
                    </span>
                    <p className="text-xs text-zinc-300 italic">
                      "{selectedEntry.lore}"
                    </p>
                  </div>

                  {/* Stats if available */}
                  {selectedEntry.stats && (
                    <div className="grid grid-cols-2 gap-2 mb-3 bg-zinc-950 p-2.5 rounded-xl border-2 border-zinc-800 text-xs">
                      <div>
                        <div className="flex justify-between text-[10px] text-zinc-400 mb-0.5">
                          <span className="font-medium">Fuerza</span>
                          <span className="font-mono text-white font-bold">{selectedEntry.stats.fuerza}</span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
                          <div
                            className="h-full bg-red-500 rounded-full"
                            style={{ width: `${selectedEntry.stats.fuerza}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-zinc-400 mb-0.5">
                          <span className="font-medium">Pasión</span>
                          <span className="font-mono text-white font-bold">{selectedEntry.stats.pasion}</span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${selectedEntry.stats.pasion}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-zinc-400 mb-0.5">
                          <span className="font-medium">Defensa</span>
                          <span className="font-mono text-white font-bold">{selectedEntry.stats.defensa}</span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${selectedEntry.stats.defensa}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-zinc-400 mb-0.5">
                          <span className="font-medium">Velocidad</span>
                          <span className="font-mono text-white font-bold">{selectedEntry.stats.velocidad}</span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${selectedEntry.stats.velocidad}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-zinc-300 pt-2 border-t border-zinc-800 font-medium">
                    <span>Valor: +{selectedEntry.xpReward} XP</span>
                    <span className="text-green-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> En tu Colección
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="flex items-center justify-center p-5 bg-zinc-950 border-2 border-zinc-800 rounded-2xl mb-4 w-32 h-32 mx-auto">
                    <PixelSprite
                      name={selectedEntry.spriteKey}
                      size={72}
                      silhouette={true}
                    />
                  </div>

                  <h3 className="font-tech text-xl font-bold text-zinc-300 tracking-wide mb-2">
                    ??? ENTRADA BLOQUEADA
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto mb-4">
                    Este cromo aún no está en tu álbum. Puedes desbloquearlo canjeando su <strong>Código QR Oficial</strong> en el campo o abriendo sobres de cromos.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setSelectedEntry(null);
                        setIsScannerOpen(true);
                      }}
                      className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-pixel text-[9px] rounded-xl pixel-button border-2 border-black font-bold shadow flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>CANJEAR CÓDIGO QR</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedEntry(null);
                        setActiveTab('sobres');
                      }}
                      className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-pixel text-[9px] rounded-xl border-2 border-zinc-700 font-bold shadow flex items-center justify-center gap-1.5"
                    >
                      <Package className="w-3.5 h-3.5 text-yellow-400" />
                      <span>ABRIR SOBRES</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
