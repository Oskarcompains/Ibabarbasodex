import React from 'react';
import { Home, Package, BookOpen, Trophy, User, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavigationTab } from '../types';
import { soundEffects } from '../utils/audio';

interface TabItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, user } = useApp();

  const tabs: TabItem[] = [
    { id: 'inicio', label: 'INICIO', icon: Home },
    { id: 'jugadores', label: 'ÁLBUM', icon: BookOpen },
    { id: 'partidos', label: 'PARTIDOS', icon: Calendar },
    { id: 'sobres', label: 'SOBRES', icon: Package, badge: user.playerPacks },
    { id: 'ranking', label: 'RANKING', icon: Trophy },
    { id: 'perfil', label: 'PERFIL', icon: User },
  ];

  const handleTabClick = (id: NavigationTab) => {
    soundEffects.playClick();
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-[#121212]/95 backdrop-blur-lg border-t-2 border-red-600 px-1.5 py-1.5 shadow-[0_-4px_25px_rgba(0,0,0,0.8)]">
      <div className="grid grid-cols-6 gap-0.5 items-center">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'bg-red-600 text-white font-bold border-2 border-red-400 shadow-[2px_2px_0px_0px_#000000]'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 border-2 border-transparent'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'scale-110 text-white' : ''}`} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2.5 bg-yellow-400 text-black font-pixel text-[7.5px] px-1 rounded-full border border-black font-bold animate-bounce shadow">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span
                className={`text-[8px] font-silkscreen tracking-tight truncate max-w-full leading-none ${
                  isActive ? 'text-white font-bold' : 'text-zinc-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

