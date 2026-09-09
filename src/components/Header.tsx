import React from 'react';
import { useRelic } from '../context/RelicContext';
import { Sparkles, Volume2, VolumeX, Plus, Shield, Layers, Compass } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface HeaderProps {
  currentTab: 'dashboard' | 'collection' | 'categories';
  onSelectTab: (tab: 'dashboard' | 'collection' | 'categories') => void;
  onOpenLogModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenLogModal,
}) => {
  const { relics, soundEnabled, setSoundEnabled } = useRelic();

  const handleTabClick = (tab: 'dashboard' | 'collection' | 'categories') => {
    playClickSound();
    onSelectTab(tab);
  };

  const toggleAudio = () => {
    setSoundEnabled(!soundEnabled);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <button
          id="brand-logo-btn"
          onClick={() => handleTabClick('dashboard')}
          className="flex items-center gap-2.5 text-left group transition-transform focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 to-purple-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:border-amber-400/80 transition-colors shadow-[0_0_12px_rgba(245,158,11,0.15)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-['Cinzel'] tracking-wider text-lg font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
              RELICLOG
            </span>
            <span className="hidden sm:block text-[10px] uppercase tracking-widest text-slate-400 font-medium font-sans">
              Real-World RPG
            </span>
          </div>
        </button>

        {/* 3 Core Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/90 shadow-inner">
          <button
            id="nav-tab-dashboard"
            onClick={() => handleTabClick('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'dashboard'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            id="nav-tab-collection"
            onClick={() => handleTabClick('collection')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'collection'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Collection</span>
            <span className="ml-0.5 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
              {relics.length}
            </span>
          </button>

          <button
            id="nav-tab-categories"
            onClick={() => handleTabClick('categories')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'categories'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categories</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={toggleAudio}
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Primary Quick Log Activity Button */}
          <button
            id="header-log-activity-btn"
            onClick={() => {
              playClickSound();
              onOpenLogModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs sm:text-sm shadow-md shadow-amber-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">+ Log Activity</span>
            <span className="sm:hidden">Log</span>
          </button>
        </div>
      </div>
    </header>
  );
};
