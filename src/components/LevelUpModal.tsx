import React, { useEffect } from 'react';
import { useRelic } from '../context/RelicContext';
import { RelicArtwork } from './RelicArtwork';
import { RARITY_CONFIG } from '../types';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowRight, ShieldCheck, Eye, Compass, Wand2 } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface LevelUpModalProps {
  onNavigateToCollection: () => void;
  onNavigateToDashboard: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  onNavigateToCollection,
  onNavigateToDashboard,
}) => {
  const {
    activeLevelUp,
    levelUpRelic,
    relicRevealStep,
    proceedFromAnnouncement,
    closeLevelUpModal,
  } = useRelic();

  // Trigger confetti burst on level announcement
  useEffect(() => {
    if (activeLevelUp && relicRevealStep === 'level_announcement') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#a855f7', '#38bdf8', '#10b981'],
        });
      } catch {}
    }
  }, [activeLevelUp, relicRevealStep]);

  if (!activeLevelUp) return null;

  const { category, newLevel, oldLevel, recentActivities } = activeLevelUp;
  const relic = levelUpRelic;
  const rarityConfig = relic ? RARITY_CONFIG[relic.rarity] : RARITY_CONFIG.Common;

  return (
    <div
      id="level-up-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-xl my-8 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/60 shadow-[0_0_50px_rgba(245,158,11,0.25)] p-6 sm:p-8 text-slate-100 overflow-hidden text-center">
        {/* Background Ambient Flare */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* STEP 1: LEVEL UP ANNOUNCEMENT */}
        {relicRevealStep === 'level_announcement' && (
          <div className="space-y-6 py-4 animate-in zoom-in-95 duration-300">
            <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-lg shadow-amber-500/10">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-[0.3em] font-bold text-amber-400 font-sans">
                Achievement Unlocked
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-['Cinzel'] tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 mt-1">
                LEVEL UP!
              </h2>
            </div>

            {/* Category & Level transition display */}
            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner max-w-sm mx-auto">
              <div className="text-2xl mb-1">{category.emoji}</div>
              <div className="text-lg font-bold text-slate-100 uppercase tracking-wide font-['Cinzel']">
                {category.name}
              </div>
              <div className="flex items-center justify-center gap-3 mt-3">
                <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono text-sm font-semibold border border-slate-700">
                  Level {oldLevel}
                </span>
                <ArrowRight className="w-5 h-5 text-amber-400 stroke-[2.5]" />
                <span className="px-3.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono text-base font-bold border border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  Level {newLevel}
                </span>
              </div>
            </div>

            {/* Recent deeds summary */}
            {recentActivities.length > 0 && (
              <div className="text-xs text-slate-400 max-w-md mx-auto">
                <span className="text-slate-500 block mb-1">Forged by recent efforts:</span>
                <span className="text-slate-300 italic">
                  "{recentActivities[0].title}" (+{recentActivities[0].xp} XP)
                </span>
              </div>
            )}

            {/* Proceed to Forge Relic */}
            <div>
              <button
                id="forge-relic-btn"
                onClick={() => {
                  playClickSound();
                  proceedFromAnnouncement();
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-extrabold text-sm sm:text-base font-['Cinzel'] tracking-wider shadow-xl shadow-amber-950/50 flex items-center justify-center gap-2 mx-auto transition-all active:scale-[0.98]"
              >
                <Wand2 className="w-5 h-5" />
                <span>Forge Relic</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: GENERATING RELIC... */}
        {relicRevealStep === 'generating' && (
          <div className="py-12 space-y-6 animate-in fade-in duration-300">
            {/* Pulsing Mystic Rune Circle */}
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" />
              <div className="absolute inset-3 rounded-full border border-purple-500/40 border-b-purple-400 animate-[spin_3s_linear_infinite_reverse]" />
              <div className="w-16 h-16 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-400 animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-amber-300 font-['Cinzel'] tracking-widest animate-pulse">
                GENERATING RELIC...
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 font-sans">
                The Ancient Grandmaster is inspecting your real-world achievements to forge a unique, collectible RPG artifact...
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Channeling Gemini AI Forge</span>
            </div>
          </div>
        )}

        {/* STEP 3 & 4: RELIC REVEAL & ACQUIRED */}
        {(relicRevealStep === 'relic_reveal' || relicRevealStep === 'acquired') && relic && (
          <div className="space-y-6 py-2 animate-in zoom-in-95 duration-400">
            {/* Acquired Header */}
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>RELIC ACQUIRED · ADDED TO COLLECTION</span>
            </div>

            {/* Large Artwork */}
            <div className="flex justify-center">
              <RelicArtwork
                type={relic.type}
                iconSymbol={relic.iconSymbol}
                rarity={relic.rarity}
                colorTheme={relic.colorTheme}
                size="hero"
              />
            </div>

            {/* Relic Title & Badges */}
            <div>
              <div className="flex items-center justify-center gap-2 mb-1.5 flex-wrap">
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest border ${rarityConfig.bgBadge} ${rarityConfig.borderBadge}`}
                >
                  {relic.rarity}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {relic.type}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {relic.categoryEmoji} {relic.categoryName} Lv. {relic.levelObtained}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-['Cinzel'] tracking-wide">
                {relic.name}
              </h2>
            </div>

            {/* RPG Stats */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {relic.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-bold text-amber-300 flex items-center gap-1.5 shadow-sm"
                >
                  <span className="text-emerald-400">+{stat.value}</span>
                  <span className="text-slate-300">{stat.stat}</span>
                </div>
              ))}
            </div>

            {/* Description & Lore */}
            <div className="space-y-2 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-left max-w-lg mx-auto">
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {relic.description}
              </p>
              <div className="border-t border-slate-800/60 pt-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
                  Lore:
                </span>
                <p className="text-xs text-amber-200/90 italic font-serif leading-relaxed">
                  "{relic.lore}"
                </p>
              </div>
            </div>

            {/* AI Art Prompt preview */}
            {relic.imagePrompt && (
              <details className="text-left max-w-lg mx-auto bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60 text-xs text-slate-400">
                <summary className="cursor-pointer text-slate-400 hover:text-amber-300 font-mono text-[11px] select-none flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>AI Art Prompt</span>
                </summary>
                <p className="mt-2 text-[11px] font-mono text-slate-300 bg-slate-900 p-2 rounded border border-slate-800 leading-relaxed break-words">
                  {relic.imagePrompt}
                </p>
              </details>
            )}

            {/* Actions: Return to Dashboard or Inspect Collection */}
            <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
              <button
                id="return-to-dashboard-btn"
                onClick={() => {
                  playClickSound();
                  closeLevelUpModal();
                  onNavigateToDashboard();
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span>Return to Dashboard</span>
              </button>

              <button
                id="view-in-collection-btn"
                onClick={() => {
                  playClickSound();
                  closeLevelUpModal();
                  onNavigateToCollection();
                }}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-950/40 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4" />
                <span>View in Collection</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
