export type RelicRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

export interface RelicStat {
  stat: string;
  value: number;
}

export interface Relic {
  id: string;
  name: string;
  type: string;
  rarity: RelicRarity;
  categoryId: string;
  categoryName: string;
  categoryEmoji: string;
  levelObtained: number;
  description: string;
  lore: string;
  stats: RelicStat[];
  imagePrompt: string;
  iconSymbol: string;
  colorTheme: string;
  createdAt: number;
}

export interface Activity {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryEmoji: string;
  title: string;
  xp: number;
  timestamp: number;
  newLevelsReached?: number[];
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  xp: number;
  level: number;
  createdAt: number;
}

/**
 * Level Formula as specified in the Product Requirements:
 * Level 1: 0–99 XP (needs 100 XP to reach Lv 2)
 * Level 2: 100–499 XP (needs 500 XP to reach Lv 3, span 400 XP)
 * Level 3: 500–999 XP (needs 1000 XP to reach Lv 4, span 500 XP)
 * Level 4: 1000–1499 XP (needs 1500 XP to reach Lv 5, span 500 XP)
 * Level 5: 1500–1999 XP (needs 2000 XP to reach Lv 6, span 500 XP)
 * After Level 2, each additional level requires another 500 XP.
 */
export function getLevelForXP(xp: number): number {
  if (xp < 100) return 1;
  if (xp < 500) return 2;
  return 3 + Math.floor((xp - 500) / 500);
}

export interface LevelThresholds {
  minXP: number;
  nextLevelXP: number;
  spanXP: number;
}

export function getLevelThresholds(level: number): LevelThresholds {
  if (level <= 1) {
    return { minXP: 0, nextLevelXP: 100, spanXP: 100 };
  }
  if (level === 2) {
    return { minXP: 100, nextLevelXP: 500, spanXP: 400 };
  }
  const minXP = 500 + (level - 3) * 500;
  const nextLevelXP = 500 + (level - 2) * 500;
  return { minXP, nextLevelXP, spanXP: 500 };
}

export function getCategoryProgress(xp: number) {
  const currentLevel = getLevelForXP(xp);
  const { minXP, nextLevelXP, spanXP } = getLevelThresholds(currentLevel);
  const progressXP = Math.max(0, xp - minXP);
  const percent = Math.min(100, Math.max(0, Math.round((progressXP / spanXP) * 100)));
  const xpNeededForNext = Math.max(0, nextLevelXP - xp);

  return {
    currentLevel,
    minXP,
    nextLevelXP,
    progressXP,
    spanXP,
    percent,
    xpNeededForNext,
  };
}

export const RARITY_CONFIG: Record<
  RelicRarity,
  {
    color: string;
    bgBadge: string;
    borderBadge: string;
    glow: string;
    cardBorder: string;
    cardBgGradients: string;
    accentHex: string;
  }
> = {
  Common: {
    color: 'text-slate-300',
    bgBadge: 'bg-slate-800/80 text-slate-300 border-slate-700',
    borderBadge: 'border-slate-600',
    glow: 'rgba(148, 163, 184, 0.25)',
    cardBorder: 'border-slate-700/80 hover:border-slate-500',
    cardBgGradients: 'from-slate-900 via-slate-900 to-slate-950',
    accentHex: '#94a3b8',
  },
  Uncommon: {
    color: 'text-emerald-400',
    bgBadge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
    borderBadge: 'border-emerald-700',
    glow: 'rgba(16, 185, 129, 0.35)',
    cardBorder: 'border-emerald-700/60 hover:border-emerald-500',
    cardBgGradients: 'from-emerald-950/40 via-slate-900 to-slate-950',
    accentHex: '#10b981',
  },
  Rare: {
    color: 'text-sky-400',
    bgBadge: 'bg-sky-950/80 text-sky-300 border-sky-800/60',
    borderBadge: 'border-sky-700',
    glow: 'rgba(56, 189, 248, 0.4)',
    cardBorder: 'border-sky-700/60 hover:border-sky-400',
    cardBgGradients: 'from-sky-950/40 via-slate-900 to-slate-950',
    accentHex: '#38bdf8',
  },
  Epic: {
    color: 'text-purple-400',
    bgBadge: 'bg-purple-950/80 text-purple-300 border-purple-800/60',
    borderBadge: 'border-purple-700',
    glow: 'rgba(192, 132, 252, 0.45)',
    cardBorder: 'border-purple-600/70 hover:border-purple-400',
    cardBgGradients: 'from-purple-950/50 via-slate-900 to-slate-950',
    accentHex: '#c084fc',
  },
  Legendary: {
    color: 'text-amber-300',
    bgBadge: 'bg-amber-950/80 text-amber-300 border-amber-600/80',
    borderBadge: 'border-amber-500',
    glow: 'rgba(245, 158, 11, 0.55)',
    cardBorder: 'border-amber-500/70 hover:border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.25)]',
    cardBgGradients: 'from-amber-950/50 via-slate-900 to-slate-950',
    accentHex: '#f59e0b',
  },
};
