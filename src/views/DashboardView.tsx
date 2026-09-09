import React from 'react';
import { useRelic } from '../context/RelicContext';
import { getCategoryProgress } from '../types';
import { Plus, Flame, Sparkles, Layers, Trophy, Shield, ArrowUpRight, Clock } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface DashboardViewProps {
  onOpenLogModal: (categoryId?: string) => void;
  onNavigateToCollection: () => void;
  onNavigateToCategories: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenLogModal,
  onNavigateToCollection,
  onNavigateToCategories,
}) => {
  const { categories, relics, activities } = useRelic();

  // Aggregate stats as requested in Section 8:
  // Total XP, Categories, Levels, Relics
  const totalXP = categories.reduce((sum, c) => sum + c.xp, 0);
  const totalCategories = categories.length;
  const totalLevels = categories.reduce((sum, c) => sum + c.level, 0);
  const totalRelics = relics.length;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Hero / Progress Banner */}
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800/80 p-6 sm:p-8 overflow-hidden shadow-xl">
        {/* Background glow flares */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-bold tracking-[0.25em] text-amber-400 uppercase font-sans flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Your Progress</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-black font-['Cinzel'] tracking-wide text-slate-100 mt-1">
              RELICLOG
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-md leading-relaxed font-sans">
              Turn your daily learning and self-improvement into RPG progression and collectible artifacts.
            </p>
          </div>

          {/* Prominent "+ Log Activity" Button */}
          <div>
            <button
              id="dashboard-log-activity-hero-btn"
              onClick={() => {
                playClickSound();
                onOpenLogModal();
              }}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-950/40 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>+ Log Activity</span>
            </button>
          </div>
        </div>

        {/* 4 Core Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Total XP</span>
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300 mt-1">
              {totalXP.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Categories</span>
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-slate-100 mt-1">
              {totalCategories}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-purple-400" />
              <span>Levels</span>
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-purple-300 mt-1">
              {totalLevels}
            </span>
          </div>

          <div
            onClick={onNavigateToCollection}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col cursor-pointer hover:border-amber-500/40 transition-colors group"
          >
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Relics</span>
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 transition-colors" />
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400 mt-1">
              {totalRelics}
            </span>
          </div>
        </div>
      </div>

      {/* Categories Progress Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-['Cinzel'] tracking-wide text-slate-100">
              Category Progression
            </h2>
            <p className="text-xs text-slate-400">
              Level up categories by earning XP to trigger AI Relic forging
            </p>
          </div>
          <button
            onClick={onNavigateToCategories}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
          >
            <span>Manage All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const prog = getCategoryProgress(cat.xp);
            const catRelics = relics.filter((r) => r.categoryId === cat.id);

            return (
              <div
                key={cat.id}
                className="relative rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/90 transition-all p-5 shadow-md flex flex-col justify-between group"
              >
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
                        {cat.emoji}
                      </span>
                      <div>
                        <h3 className="font-bold text-slate-100 text-base font-['Cinzel'] tracking-wide">
                          {cat.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span className="font-semibold text-amber-400 font-mono">
                            Level {prog.currentLevel}
                          </span>
                          <span>·</span>
                          <span>{catRelics.length} {catRelics.length === 1 ? 'Relic' : 'Relics'}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      id={`log-quick-${cat.id}`}
                      onClick={() => {
                        playClickSound();
                        onOpenLogModal(cat.id);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/40 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Log</span>
                    </button>
                  </div>

                  {/* XP Numbers Display (e.g. 1,240 / 1,500 XP) */}
                  <div className="flex items-baseline justify-between text-xs mb-1.5 font-mono">
                    <span className="text-slate-400">
                      XP: <strong className="text-slate-200">{cat.xp.toLocaleString()}</strong> / {prog.nextLevelXP.toLocaleString()}
                    </span>
                    <span className="text-amber-400 font-semibold">{prog.percent}%</span>
                  </div>

                  {/* Progress Bar with RPG glow */}
                  <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden p-0.5 shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)] transition-all duration-500 ease-out"
                      style={{ width: `${Math.max(4, prog.percent)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                    <span>Lv. {prog.currentLevel}</span>
                    <span>
                      {prog.xpNeededForNext > 0 ? (
                        <span>+{prog.xpNeededForNext} XP to Lv. {prog.currentLevel + 1}</span>
                      ) : (
                        <span className="text-amber-400 font-semibold">Max Cap Reached</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Latest Relic badge snippet if any */}
                {catRelics.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="truncate text-slate-400 text-[11px]">
                      Latest: <span className="text-amber-300/90 font-medium">"{catRelics[0].name}"</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">
                      {catRelics[0].rarity}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-['Cinzel'] tracking-wide text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Recent Activities</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {activities.length} Recorded
          </span>
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-8 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-slate-400 text-xs">
            No activities logged yet. Click "+ Log Activity" above to record your first quest!
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 divide-y divide-slate-800/80 overflow-hidden shadow-md">
            {activities.slice(0, 7).map((act) => (
              <div
                key={act.id}
                className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-850/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                    {act.categoryEmoji}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-100 truncate">
                      {act.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{act.categoryName}</span>
                      <span>·</span>
                      <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {act.newLevelsReached && act.newLevelsReached.length > 0 && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                          LEVELED UP!
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs sm:text-sm font-bold font-mono text-amber-400 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    +{act.xp} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
