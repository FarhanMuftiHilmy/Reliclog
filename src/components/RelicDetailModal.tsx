import React, { useState } from 'react';
import { Relic, RARITY_CONFIG } from '../types';
import { RelicArtwork } from './RelicArtwork';
import { X, Copy, Check, Sparkles, Calendar, Layers } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface RelicDetailModalProps {
  relic: Relic | null;
  onClose: () => void;
}

export const RelicDetailModal: React.FC<RelicDetailModalProps> = ({ relic, onClose }) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  if (!relic) return null;

  const rarityConfig = RARITY_CONFIG[relic.rarity] || RARITY_CONFIG.Common;

  const copyPrompt = () => {
    playClickSound();
    if (relic.imagePrompt) {
      navigator.clipboard.writeText(relic.imagePrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  return (
    <div
      id="relic-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-7 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow backdrop */}
        <div
          className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: rarityConfig.accentHex }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Large Centerpiece Artwork */}
          <RelicArtwork
            type={relic.type}
            iconSymbol={relic.iconSymbol}
            rarity={relic.rarity}
            colorTheme={relic.colorTheme}
            size="lg"
          />

          {/* Rarity & Type Tags */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest border ${rarityConfig.bgBadge} ${rarityConfig.borderBadge}`}
            >
              {relic.rarity}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              {relic.type}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
              <span>{relic.categoryEmoji}</span>
              <span>{relic.categoryName} Lv. {relic.levelObtained}</span>
            </span>
          </div>

          {/* Relic Title */}
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold font-['Cinzel'] tracking-wide text-slate-100">
              {relic.name}
            </h3>
            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>{new Date(relic.createdAt).toLocaleDateString()}</span>
              </span>
              <span className="flex items-center gap-1">
                <Layers className="w-3 h-3 text-slate-500" />
                <span>Level {relic.levelObtained} Milestone</span>
              </span>
            </div>
          </div>

          {/* RPG Stats Badges */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {relic.stats.map((st, i) => (
              <div
                key={i}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-amber-300 flex items-center gap-1.5 shadow-sm"
              >
                <span className="text-emerald-400">+{st.value}</span>
                <span className="text-slate-300">{st.stat}</span>
              </div>
            ))}
          </div>

          {/* Description & Lore */}
          <div className="w-full text-left space-y-2 p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <p className="text-slate-300 leading-relaxed font-sans">{relic.description}</p>
            <div className="border-t border-slate-800/80 pt-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-0.5">
                Lore:
              </span>
              <p className="text-amber-200/90 italic font-serif leading-relaxed">
                "{relic.lore}"
              </p>
            </div>
          </div>

          {/* AI Image Generation Prompt Box */}
          {relic.imagePrompt && (
            <div className="w-full text-left bg-slate-950/40 p-3 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Art Prompt</span>
                </span>
                <button
                  onClick={copyPrompt}
                  className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] font-mono text-slate-400 bg-slate-900/80 p-2 rounded border border-slate-800/80 leading-relaxed break-words">
                {relic.imagePrompt}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
