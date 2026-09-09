import React, { useState } from 'react';
import { RelicProvider, useRelic } from './context/RelicContext';
import { Header } from './components/Header';
import { LogActivityModal } from './components/LogActivityModal';
import { QuestCompleteBanner } from './components/QuestCompleteBanner';
import { LevelUpModal } from './components/LevelUpModal';
import { DashboardView } from './views/DashboardView';
import { CollectionView } from './views/CollectionView';
import { CategoriesView } from './views/CategoriesView';
import { Sparkles, RefreshCw } from 'lucide-react';
import { playClickSound } from './utils/audio';

function ReliclogContent() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'collection' | 'categories'>('dashboard');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [targetCategoryId, setTargetCategoryId] = useState<string | undefined>(undefined);
  const { resetAllData } = useRelic();

  const handleOpenLogModal = (categoryId?: string) => {
    setTargetCategoryId(categoryId);
    setIsLogModalOpen(true);
  };

  const handleCloseLogModal = () => {
    setIsLogModalOpen(false);
    setTargetCategoryId(undefined);
  };

  const handleResetData = () => {
    if (confirm('Reset Reliclog to default sample categories and relics?')) {
      playClickSound();
      resetAllData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenLogModal={() => handleOpenLogModal()}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            onOpenLogModal={handleOpenLogModal}
            onNavigateToCollection={() => setCurrentTab('collection')}
            onNavigateToCategories={() => setCurrentTab('categories')}
          />
        )}

        {currentTab === 'collection' && <CollectionView />}

        {currentTab === 'categories' && (
          <CategoriesView onOpenLogModal={handleOpenLogModal} />
        )}
      </main>

      {/* Global Quest Complete Banner Toast */}
      <QuestCompleteBanner />

      {/* Interactive Log Activity Modal */}
      <LogActivityModal
        isOpen={isLogModalOpen}
        initialCategoryId={targetCategoryId}
        onClose={handleCloseLogModal}
      />

      {/* 4-Step Level-Up Experience Modal */}
      <LevelUpModal
        onNavigateToCollection={() => setCurrentTab('collection')}
        onNavigateToDashboard={() => setCurrentTab('dashboard')}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-400 font-sans">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500/80" />
            <span className="font-['Cinzel'] tracking-wider text-slate-300 font-bold">
              RELICLOG
            </span>
            <span>—</span>
            <span>RPG Progression for Real-World Learning</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
              title="Reset data to initial state"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Sample Data</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <RelicProvider>
      <ReliclogContent />
    </RelicProvider>
  );
}
