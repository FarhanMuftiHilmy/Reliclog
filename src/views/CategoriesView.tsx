import React, { useState } from 'react';
import { useRelic } from '../context/RelicContext';
import { getCategoryProgress } from '../types';
import { Plus, Trash2, Edit2, Check, X, Layers, History, Shield, Flame } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface CategoriesViewProps {
  onOpenLogModal: (categoryId: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({ onOpenLogModal }) => {
  const { categories, relics, activities, createCategory, updateCategory, deleteCategory } = useRelic();

  const [isCreating, setIsCreating] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatEmoji, setNewCatEmoji] = useState('📚');

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmoji, setEditEmoji] = useState('');

  // Expanded history accordion for specific category
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

  const emojiPalette = [
    '📚', '🧠', '💻', '🏃', '🇨🇳', '🎸', '✍️', '🎨', '🧘', '🍳', '💼', '🔬', '♟️', '🌿', '🎯', '🛠️', '🗣️', '🎹', '🏋️', '🏊',
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    playClickSound();
    createCategory(newCatName, newCatEmoji);
    setNewCatName('');
    setIsCreating(false);
  };

  const handleStartEdit = (cat: { id: string; name: string; emoji: string }) => {
    playClickSound();
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditEmoji(cat.emoji);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    playClickSound();
    updateCategory(id, editName, editEmoji);
    setEditingId(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the category "${name}"? Existing logged progress will be removed.`)) {
      playClickSound();
      deleteCategory(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs uppercase font-bold tracking-widest">
            <Layers className="w-4 h-4" />
            <span>Progression Disciplines</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Cinzel'] text-slate-100 mt-1">
            Life Categories
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Each category maintains independent XP, levels, and collectible Relic milestones.
          </p>
        </div>

        <button
          id="open-create-category-btn"
          onClick={() => {
            playClickSound();
            setIsCreating(true);
          }}
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-sky-950/40 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Category</span>
        </button>
      </div>

      {/* Creation Card */}
      {isCreating && (
        <form
          onSubmit={handleCreateSubmit}
          className="p-5 rounded-2xl bg-slate-900 border-2 border-sky-500/50 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-sky-400">
              Create New Category
            </h2>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3">
              <label className="block text-xs text-slate-300 font-semibold mb-1">
                Category Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Japanese, Marathon Training, Chess, Piano"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-sky-400"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 font-semibold mb-1">
                Selected Emoji
              </label>
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center text-xl shrink-0">
                  {newCatEmoji}
                </span>
                <input
                  type="text"
                  maxLength={4}
                  value={newCatEmoji}
                  onChange={(e) => setNewCatEmoji(e.target.value)}
                  className="w-16 px-2 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-center text-sm"
                />
              </div>
            </div>
          </div>

          {/* Quick Emoji Selection Palette */}
          <div>
            <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
              Pick an Icon:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {emojiPalette.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setNewCatEmoji(em)}
                  className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all ${
                    newCatEmoji === em
                      ? 'bg-sky-500/20 border-2 border-sky-400 scale-110'
                      : 'bg-slate-950 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-md"
            >
              Create Category
            </button>
          </div>
        </form>
      )}

      {/* Category List */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const prog = getCategoryProgress(cat.xp);
          const catRelics = relics.filter((r) => r.categoryId === cat.id);
          const catActivities = activities.filter((a) => a.categoryId === cat.id);
          const isEditing = editingId === cat.id;
          const isHistoryExpanded = expandedHistoryId === cat.id;

          return (
            <div
              key={cat.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-lg space-y-4"
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      maxLength={4}
                      value={editEmoji}
                      onChange={(e) => setEditEmoji(e.target.value)}
                      className="w-10 h-10 text-center text-xl rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                    />
                    <button
                      onClick={() => handleSaveEdit(cat.id)}
                      className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
                      {cat.emoji}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold font-['Cinzel'] tracking-wide text-slate-100 flex items-center gap-2">
                        <span>{cat.name}</span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 font-mono text-xs border border-amber-500/30">
                          Level {prog.currentLevel}
                        </span>
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1 font-mono text-amber-300">
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                          <span>{cat.xp.toLocaleString()} Total XP</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Shield className="w-3.5 h-3.5 text-slate-400" />
                          <span>{catRelics.length} Relics</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Controls */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      playClickSound();
                      onOpenLogModal(cat.id);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Activity</span>
                  </button>

                  <button
                    onClick={() => handleStartEdit(cat)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar & Level Thresholds (Section 1 Example Display) */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="flex items-baseline justify-between text-xs font-mono">
                  <span className="text-slate-400">
                    Progress: <strong className="text-slate-100">{cat.xp.toLocaleString()}</strong> / {prog.nextLevelXP.toLocaleString()} XP
                  </span>
                  <span className="text-amber-400 font-bold">{prog.percent}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.4)] transition-all duration-500"
                    style={{ width: `${Math.max(3, prog.percent)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                  <span>Level {prog.currentLevel} (Min: {prog.minXP} XP)</span>
                  <span>+{prog.xpNeededForNext} XP to Level {prog.currentLevel + 1}</span>
                </div>
              </div>

              {/* Collapsible Category-Specific Activity History */}
              <div className="border-t border-slate-800/80 pt-3">
                <button
                  onClick={() => setExpandedHistoryId(isHistoryExpanded ? null : cat.id)}
                  className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <History className="w-3.5 h-3.5 text-slate-500" />
                    <span>Activity History ({catActivities.length})</span>
                  </span>
                  <span className="text-amber-400 text-[11px] font-mono">
                    {isHistoryExpanded ? 'Collapse ▲' : 'Expand ▼'}
                  </span>
                </button>

                {isHistoryExpanded && (
                  <div className="mt-3 space-y-2 animate-in fade-in duration-200">
                    {catActivities.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-2">
                        No activities recorded for this category yet.
                      </p>
                    ) : (
                      <div className="divide-y divide-slate-800/60 rounded-xl bg-slate-950/60 border border-slate-800/80 overflow-hidden">
                        {catActivities.map((act) => (
                          <div
                            key={act.id}
                            className="p-3 flex items-center justify-between text-xs gap-2"
                          >
                            <span className="text-slate-200 font-medium truncate">
                              {act.title}
                            </span>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-slate-400 font-mono text-[11px]">
                                {new Date(act.timestamp).toLocaleDateString()}
                              </span>
                              <span className="text-amber-400 font-bold font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                                +{act.xp} XP
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
