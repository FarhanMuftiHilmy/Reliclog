import React, { useState } from 'react';
import { useRelic } from '../context/RelicContext';
import { Relic, RelicRarity, RARITY_CONFIG } from '../types';
import { RelicArtwork } from '../components/RelicArtwork';
import { RelicDetailModal } from '../components/RelicDetailModal';
import { Search, Shield, Filter, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export const CollectionView: React.FC = () => {
  const { relics, categories } = useRelic();
  const [selectedRelic, setSelectedRelic] = useState<Relic | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const rarities: RelicRarity[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

  // Filter relics
  const filteredRelics = relics.filter((relic) => {
    if (selectedCategory !== 'all' && relic.categoryId !== selectedCategory) {
      return false;
    }
    if (selectedRarity !== 'all' && relic.rarity !== selectedRarity) {
      return false;
    }
    if (
      searchQuery.trim() &&
      !relic.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !relic.type.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !relic.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Collection Header & Inventory Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs uppercase font-bold tracking-widest">
            <Shield className="w-4 h-4" />
            <span>RPG Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Cinzel'] text-slate-100 mt-1">
            Relic Collection
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Every collectible artifact forged through your real-world progress and level-ups.
          </p>
        </div>

        {/* Inventory Total Counter */}
        <div className="flex items-center gap-3 self-start md:self-auto bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 shadow-inner">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
              Total Artifacts
            </span>
            <span className="text-xl font-bold font-mono text-amber-400">
              {relics.length}
            </span>
          </div>
          <Sparkles className="w-5 h-5 text-amber-400/80" />
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search relics by name, type, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Category Filter Select */}
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rarity Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
          <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3 text-slate-500" />
            <span>Rarity:</span>
          </span>
          <button
            onClick={() => setSelectedRarity('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              selectedRarity === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            All ({relics.length})
          </button>
          {rarities.map((r) => {
            const count = relics.filter((item) => item.rarity === r).length;
            const config = RARITY_CONFIG[r];
            const isSelected = selectedRarity === r;
            return (
              <button
                key={r}
                onClick={() => setSelectedRarity(r)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 border transition-all ${
                  isSelected
                    ? `${config.bgBadge} ${config.borderBadge} font-bold shadow-sm`
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {r} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Relics Cards Grid (Section 7 Collectible Card Format) */}
      {filteredRelics.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400 space-y-2">
          <p className="text-sm font-semibold text-slate-300">No Relics found</p>
          <p className="text-xs max-w-sm mx-auto">
            Try adjusting your search or rarity filter, or level up a category to forge a new Relic!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredRelics.map((relic) => {
            const rarityConfig = RARITY_CONFIG[relic.rarity] || RARITY_CONFIG.Common;

            return (
              <div
                key={relic.id}
                id={`relic-card-${relic.id}`}
                onClick={() => {
                  playClickSound();
                  setSelectedRelic(relic);
                }}
                className={`group relative rounded-2xl bg-slate-900/90 border cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between ${rarityConfig.cardBorder}`}
              >
                {/* Upper Area: Relic Artwork Frame */}
                <div className="p-4 sm:p-5 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950/90 via-slate-900/60 to-transparent border-b border-slate-800/60 relative">
                  <RelicArtwork
                    type={relic.type}
                    iconSymbol={relic.iconSymbol}
                    rarity={relic.rarity}
                    colorTheme={relic.colorTheme}
                    size="md"
                    className="group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Level & Rarity floating pills */}
                  <div className="w-full flex items-center justify-between mt-3 px-1 text-[11px]">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] border ${rarityConfig.bgBadge} ${rarityConfig.borderBadge}`}
                    >
                      {relic.rarity}
                    </span>
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <span>{relic.categoryEmoji}</span>
                      <span>Lv. {relic.levelObtained}</span>
                    </span>
                  </div>
                </div>

                {/* Card Body Information */}
                <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-100 font-['Cinzel'] tracking-wide text-sm group-hover:text-amber-300 transition-colors line-clamp-1">
                      {relic.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {relic.description}
                    </p>
                  </div>

                  {/* RPG Stats Badges */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                    {relic.stats.map((st, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-bold text-amber-300 font-mono"
                      >
                        +{st.value} {st.stat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Relic Detail Inspection Modal */}
      <RelicDetailModal
        relic={selectedRelic}
        onClose={() => setSelectedRelic(null)}
      />
    </div>
  );
};
