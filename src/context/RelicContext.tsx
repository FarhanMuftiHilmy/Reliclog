import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Category, Relic, Activity, getLevelForXP } from '../types';
import { INITIAL_CATEGORIES, INITIAL_RELICS, INITIAL_ACTIVITIES } from '../data/seed';
import {
  playQuestCompleteSound,
  playLevelUpSound,
  playRelicRevealSound,
  getSoundEnabled,
  toggleSound,
} from '../utils/audio';

interface LevelUpEvent {
  category: Category;
  newLevel: number;
  oldLevel: number;
  recentActivities: { title: string; xp: number }[];
}

interface QuestCompleteEvent {
  title: string;
  categoryName: string;
  categoryEmoji: string;
  xp: number;
}

interface RelicContextType {
  categories: Category[];
  relics: Relic[];
  activities: Activity[];
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  questBanner: QuestCompleteEvent | null;
  dismissQuestBanner: () => void;
  activeLevelUp: LevelUpEvent | null;
  levelUpRelic: Relic | null;
  isGeneratingRelic: boolean;
  relicRevealStep: 'level_announcement' | 'generating' | 'relic_reveal' | 'acquired';
  proceedFromAnnouncement: () => void;
  closeLevelUpModal: () => void;
  logActivity: (categoryId: string, title: string, xp: number) => Promise<void>;
  createCategory: (name: string, emoji: string) => void;
  updateCategory: (id: string, name: string, emoji: string) => void;
  deleteCategory: (id: string) => void;
  resetAllData: () => void;
}

const RelicContext = createContext<RelicContextType | undefined>(undefined);

const STORAGE_KEY_CATEGORIES = 'reliclog_categories_v1';
const STORAGE_KEY_RELICS = 'reliclog_relics_v1';
const STORAGE_KEY_ACTIVITIES = 'reliclog_activities_v1';

export const RelicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CATEGORIES;
  });

  const [relics, setRelics] = useState<Relic[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RELICS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_RELICS;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ACTIVITIES;
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(getSoundEnabled);
  const [questBanner, setQuestBanner] = useState<QuestCompleteEvent | null>(null);

  // Level-up sequence state
  const [levelUpQueue, setLevelUpQueue] = useState<LevelUpEvent[]>([]);
  const [activeLevelUp, setActiveLevelUp] = useState<LevelUpEvent | null>(null);
  const [levelUpRelic, setLevelUpRelic] = useState<Relic | null>(null);
  const [isGeneratingRelic, setIsGeneratingRelic] = useState<boolean>(false);
  const [relicRevealStep, setRelicRevealStep] = useState<
    'level_announcement' | 'generating' | 'relic_reveal' | 'acquired'
  >('level_announcement');

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RELICS, JSON.stringify(relics));
    } catch (e) {
      console.error('Failed to save relics', e);
    }
  }, [relics]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(activities));
    } catch (e) {
      console.error('Failed to save activities', e);
    }
  }, [activities]);

  const setSoundEnabled = (val: boolean) => {
    toggleSound(val);
    setSoundEnabledState(val);
  };

  const dismissQuestBanner = () => {
    setQuestBanner(null);
  };

  // Process next level up from queue if active is empty
  useEffect(() => {
    if (!activeLevelUp && levelUpQueue.length > 0) {
      const next = levelUpQueue[0];
      setLevelUpQueue((prev) => prev.slice(1));
      setActiveLevelUp(next);
      setRelicRevealStep('level_announcement');
      setLevelUpRelic(null);
      playLevelUpSound();
    }
  }, [activeLevelUp, levelUpQueue]);

  // Generate Relic helper
  const generateRelic = useCallback(
    async (event: LevelUpEvent) => {
      setIsGeneratingRelic(true);
      setRelicRevealStep('generating');

      try {
        const payload = {
          categoryName: event.category.name,
          categoryEmoji: event.category.emoji,
          newLevel: event.newLevel,
          recentActivities: event.recentActivities,
          totalCategoryXP: event.category.xp,
          existingRelicNames: relics.map((r) => r.name),
        };

        const res = await fetch('/api/generate-relic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        const relicData = data.relic;

        const newRelic: Relic = {
          id: `relic-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: relicData.name || 'Crown of Ascendance',
          type: relicData.type || 'Artifact',
          rarity: relicData.rarity || 'Rare',
          categoryId: event.category.id,
          categoryName: event.category.name,
          categoryEmoji: event.category.emoji,
          levelObtained: event.newLevel,
          description: relicData.description || 'A sacred relic bestowed by persistent effort.',
          lore: relicData.lore || 'Forged through focus and perseverance.',
          stats: Array.isArray(relicData.stats) ? relicData.stats : [{ stat: 'Mastery', value: 10 }],
          imagePrompt: relicData.imagePrompt || '',
          iconSymbol: relicData.iconSymbol || 'gem',
          colorTheme: relicData.colorTheme || 'amber',
          createdAt: Date.now(),
        };

        // Add to collection
        setRelics((prev) => [newRelic, ...prev]);
        setLevelUpRelic(newRelic);
        setIsGeneratingRelic(false);
        setRelicRevealStep('relic_reveal');
        playRelicRevealSound();
      } catch (err) {
        console.error('Relic generation call failed', err);
        // Fallback relic in case of network issue
        const fallbackRelic: Relic = {
          id: `relic-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: `The ${event.category.name} Sovereign Crest`,
          type: 'Amulet',
          rarity: event.newLevel >= 4 ? 'Epic' : 'Rare',
          categoryId: event.category.id,
          categoryName: event.category.name,
          categoryEmoji: event.category.emoji,
          levelObtained: event.newLevel,
          description: `Forged upon conquering Level ${event.newLevel} in ${event.category.name}.`,
          lore: `A radiant testament to deliberate focus and everyday devotion.`,
          stats: [
            { stat: 'Discipline', value: 5 + event.newLevel * 3 },
            { stat: 'Focus', value: 3 + event.newLevel * 2 },
          ],
          imagePrompt: `A glowing celestial crest celebrating Level ${event.newLevel} mastery in ${event.category.name}.`,
          iconSymbol: 'gem',
          colorTheme: 'amber',
          createdAt: Date.now(),
        };
        setRelics((prev) => [fallbackRelic, ...prev]);
        setLevelUpRelic(fallbackRelic);
        setIsGeneratingRelic(false);
        setRelicRevealStep('relic_reveal');
        playRelicRevealSound();
      }
    },
    [relics]
  );

  // Transition from Step 1 announcement to Step 2 & 3 Relic generation
  const proceedFromAnnouncement = useCallback(() => {
    if (activeLevelUp) {
      generateRelic(activeLevelUp);
    }
  }, [activeLevelUp, generateRelic]);

  const closeLevelUpModal = useCallback(() => {
    setActiveLevelUp(null);
    setLevelUpRelic(null);
    setRelicRevealStep('level_announcement');
  }, []);

  // Main Activity Logging method
  const logActivity = async (categoryId: string, title: string, xp: number) => {
    const cleanTitle = title.trim();
    const cleanXP = Math.max(1, Math.round(Number(xp) || 10));

    const targetCategory = categories.find((c) => c.id === categoryId);
    if (!targetCategory) return;

    const oldXP = targetCategory.xp;
    const newXP = oldXP + cleanXP;
    const oldLevel = getLevelForXP(oldXP);
    const newLevel = getLevelForXP(newXP);

    const updatedCategory: Category = {
      ...targetCategory,
      xp: newXP,
      level: newLevel,
    };

    // Update categories immediately
    setCategories((prev) => prev.map((c) => (c.id === categoryId ? updatedCategory : c)));

    // Record activity
    const newActivity: Activity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      categoryId,
      categoryName: targetCategory.name,
      categoryEmoji: targetCategory.emoji,
      title: cleanTitle,
      xp: cleanXP,
      timestamp: Date.now(),
      newLevelsReached: newLevel > oldLevel ? Array.from({ length: newLevel - oldLevel }, (_, i) => oldLevel + 1 + i) : undefined,
    };

    setActivities((prev) => [newActivity, ...prev]);

    // Play Quest Complete audio & show Quest Complete banner
    playQuestCompleteSound();
    setQuestBanner({
      title: cleanTitle,
      categoryName: targetCategory.name,
      categoryEmoji: targetCategory.emoji,
      xp: cleanXP,
    });

    // If level threshold crossed, queue each level-up step
    if (newLevel > oldLevel) {
      const recentForRelic = [
        { title: cleanTitle, xp: cleanXP },
        ...activities
          .filter((a) => a.categoryId === categoryId)
          .slice(0, 3)
          .map((a) => ({ title: a.title, xp: a.xp })),
      ];

      const newEvents: LevelUpEvent[] = [];
      for (let lvl = oldLevel + 1; lvl <= newLevel; lvl++) {
        newEvents.push({
          category: updatedCategory,
          newLevel: lvl,
          oldLevel: lvl - 1,
          recentActivities: recentForRelic,
        });
      }

      setLevelUpQueue((prev) => [...prev, ...newEvents]);
    }
  };

  const createCategory = (name: string, emoji: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const newCat: Category = {
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed,
      emoji: emoji.trim() || '✨',
      xp: 0,
      level: 1,
      createdAt: Date.now(),
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const updateCategory = (id: string, name: string, emoji: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              name: trimmed,
              emoji: emoji.trim() || c.emoji,
            }
          : c
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const resetAllData = () => {
    setCategories(INITIAL_CATEGORIES);
    setRelics(INITIAL_RELICS);
    setActivities(INITIAL_ACTIVITIES);
    localStorage.removeItem(STORAGE_KEY_CATEGORIES);
    localStorage.removeItem(STORAGE_KEY_RELICS);
    localStorage.removeItem(STORAGE_KEY_ACTIVITIES);
  };

  return (
    <RelicContext.Provider
      value={{
        categories,
        relics,
        activities,
        soundEnabled,
        setSoundEnabled,
        questBanner,
        dismissQuestBanner,
        activeLevelUp,
        levelUpRelic,
        isGeneratingRelic,
        relicRevealStep,
        proceedFromAnnouncement,
        closeLevelUpModal,
        logActivity,
        createCategory,
        updateCategory,
        deleteCategory,
        resetAllData,
      }}
    >
      {children}
    </RelicContext.Provider>
  );
};

export const useRelic = () => {
  const context = useContext(RelicContext);
  if (!context) {
    throw new Error('useRelic must be used within a RelicProvider');
  }
  return context;
};
