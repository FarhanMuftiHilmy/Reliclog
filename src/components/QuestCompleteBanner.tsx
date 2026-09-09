import React, { useEffect } from 'react';
import { useRelic } from '../context/RelicContext';
import { Sparkles, CheckCircle, X } from 'lucide-react';

export const QuestCompleteBanner: React.FC = () => {
  const { questBanner, dismissQuestBanner } = useRelic();

  useEffect(() => {
    if (!questBanner) return;
    const timer = setTimeout(() => {
      dismissQuestBanner();
    }, 4500);
    return () => clearTimeout(timer);
  }, [questBanner, dismissQuestBanner]);

  if (!questBanner) return null;

  return (
    <div
      id="quest-complete-banner"
      className="fixed bottom-6 right-6 z-40 max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in duration-300"
    >
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/80 shadow-[0_10px_35px_rgba(245,158,11,0.25)] p-4 overflow-hidden text-slate-100">
        {/* Glow Shimmer */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/60 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <CheckCircle className="w-5 h-5 text-amber-400" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 font-['Cinzel'] tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>QUEST COMPLETE</span>
            </div>
            <p className="text-sm font-semibold text-slate-100 truncate mt-0.5">
              {questBanner.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <span>{questBanner.categoryEmoji}</span>
                <span>{questBanner.categoryName}</span>
              </span>
              <span className="text-xs font-bold text-amber-300 font-mono px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40">
                +{questBanner.xp} XP
              </span>
            </div>
          </div>

          <button
            onClick={dismissQuestBanner}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
