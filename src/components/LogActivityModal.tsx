import React, { useState, useEffect } from 'react';
import { useRelic } from '../context/RelicContext';
import { X, Flame, Zap, ArrowRight } from 'lucide-react';
import { getLevelForXP, getLevelThresholds } from '../types';
import { playClickSound } from '../utils/audio';

interface LogActivityModalProps {
  isOpen: boolean;
  initialCategoryId?: string;
  onClose: () => void;
}

export const LogActivityModal: React.FC<LogActivityModalProps> = ({
  isOpen,
  initialCategoryId,
  onClose,
}) => {
  const { categories, logActivity } = useRelic();

  const [categoryId, setCategoryId] = useState<string>('');
  const [activityTitle, setActivityTitle] = useState<string>('');
  const [xpAmount, setXpAmount] = useState<string>('20');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sync category selection
  useEffect(() => {
    if (initialCategoryId && categories.some((c) => c.id === initialCategoryId)) {
      setCategoryId(initialCategoryId);
    } else if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [initialCategoryId, categories, categoryId]);

  if (!isOpen) return null;

  const currentCategory = categories.find((c) => c.id === categoryId) || categories[0];
  const parsedXP = Math.max(1, parseInt(xpAmount) || 0);

  // Level preview calculations
  const oldXP = currentCategory ? currentCategory.xp : 0;
  const newXP = oldXP + parsedXP;
  const oldLevel = currentCategory ? currentCategory.level : 1;
  const newLevel = getLevelForXP(newXP);
  const willLevelUp = newLevel > oldLevel;
  const thresholds = getLevelThresholds(oldLevel);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !activityTitle.trim() || parsedXP <= 0) return;

    playClickSound();
    setIsSubmitting(true);
    try {
      await logActivity(categoryId, activityTitle, parsedXP);
      setActivityTitle('');
      setXpAmount('20');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const xpPresets = [10, 20, 50, 100, 300];

  return (
    <div
      id="log-activity-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden p-6 sm:p-7 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-amber-500/10 blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-['Cinzel'] tracking-wide">
                Log Activity
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Record your real-world effort to earn XP
              </p>
            </div>
          </div>
          <button
            id="close-log-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Category
            </label>
            <select
              id="activity-category-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-amber-400 transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.name} (Lv. {cat.level} · {cat.xp} XP)
                </option>
              ))}
            </select>
          </div>

          {/* Activity Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Activity
            </label>
            <input
              id="activity-title-input"
              type="text"
              required
              placeholder="e.g., Read 20 pages, Finished a chapter, Ran 5km"
              value={activityTitle}
              onChange={(e) => setActivityTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* XP Input & Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                XP Earned
              </label>
              <span className="text-xs text-amber-400 font-mono font-medium">
                +{parsedXP} XP
              </span>
            </div>
            <input
              id="activity-xp-input"
              type="number"
              min="1"
              max="9999"
              required
              value={xpAmount}
              onChange={(e) => setXpAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />

            {/* Quick XP Chips */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 mr-1">Presets:</span>
              {xpPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setXpAmount(preset.toString())}
                  className={`px-2 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                    parsedXP === preset
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  +{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Realtime Progression Impact Preview */}
          {currentCategory && (
            <div
              className={`p-3.5 rounded-xl border transition-colors ${
                willLevelUp
                  ? 'bg-gradient-to-r from-amber-950/50 to-purple-950/50 border-amber-500/50 shadow-inner'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 flex items-center gap-1">
                  <span>{currentCategory.emoji}</span>
                  <span className="font-medium text-slate-200">{currentCategory.name}</span>
                </span>
                <span className="font-mono text-slate-300">
                  {newXP} / {thresholds.nextLevelXP} XP
                </span>
              </div>

              {willLevelUp ? (
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>
                    LEVEL UP TRIGGER! Lv. {oldLevel} → Lv. {newLevel} (Will forge a Relic!)
                  </span>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <span>Progress towards Lv. {oldLevel + 1}:</span>
                  <span className="text-slate-300 font-mono">
                    {Math.max(0, thresholds.nextLevelXP - newXP)} XP needed
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            id="complete-activity-submit-btn"
            type="submit"
            disabled={isSubmitting || !activityTitle.trim()}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.99]"
          >
            <span>Complete Activity</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
};
