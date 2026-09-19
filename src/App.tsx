import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { IbardexView } from './components/IbardexView';
import { SobresView } from './components/SobresView';
import { GymsView } from './components/GymsView';
import { RankingView } from './components/RankingView';
import { ProfileView } from './components/ProfileView';
import { UnlockModal } from './components/UnlockModal';
import { QrScannerModal } from './components/QrScannerModal';
import { AdminPanel } from './components/AdminPanel';

const AppContent: React.FC = () => {
  const {
    activeTab,
    currentUnlock,
    dismissCurrentUnlock,
    isScannerOpen,
    setIsScannerOpen,
    isAdminOpen,
    setIsAdminOpen,
  } = useApp();

  return (
    <div className="min-h-screen bg-[#121212] text-zinc-100 flex justify-center selection:bg-red-600 selection:text-white font-sans">
      {/* Mobile-first frame container with Vibrant Palette styling */}
      <div className="w-full max-w-md min-h-screen bg-[#18181b] flex flex-col relative border-x-2 border-zinc-900 shadow-2xl">
        {/* Top Navbar */}
        <Navbar
          onOpenScanner={() => setIsScannerOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 px-3.5 pt-3 overflow-y-auto">
          {activeTab === 'inicio' && (
            <HomeView onOpenScanner={() => setIsScannerOpen(true)} />
          )}

          {activeTab === 'jugadores' && (
            <IbardexView />
          )}

          {activeTab === 'partidos' && (
            <GymsView onOpenScanner={() => setIsScannerOpen(true)} />
          )}

          {activeTab === 'sobres' && (
            <SobresView />
          )}

          {activeTab === 'ranking' && (
            <RankingView />
          )}

          {activeTab === 'perfil' && (
            <ProfileView />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav />

        {/* Celebratory Unlock Modal */}
        <UnlockModal
          unlock={currentUnlock}
          onClose={dismissCurrentUnlock}
        />

        {/* QR Scanner / Match Check-in Modal */}
        <QrScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
        />

        {/* Club Administration Panel */}
        <AdminPanel
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
