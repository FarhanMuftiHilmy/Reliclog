import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy Gemini client helper
let genAiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAiClient) {
    genAiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAiClient;
}

// Procedural fallback generator for reliable offline / keyless testing
function generateProceduralRelic(params: {
  categoryName: string;
  categoryEmoji: string;
  newLevel: number;
  recentActivities: { title: string; xp: number }[];
}) {
  const { categoryName, newLevel, recentActivities } = params;

  let rarity = 'Common';
  if (newLevel >= 5) rarity = 'Legendary';
  else if (newLevel === 4) rarity = 'Epic';
  else if (newLevel === 3) rarity = 'Rare';
  else if (newLevel === 2) rarity = 'Uncommon';

  const catLower = categoryName.toLowerCase();

  interface Archetype {
    items: { name: string; type: string; icon: string }[];
    stats: string[];
    loreTemplates: string[];
    colorTheme: string;
  }

  const archetypes: Record<string, Archetype> = {
    reading: {
      items: [
        { name: "The Archivist's Blade", type: 'Blade', icon: 'blade' },
        { name: 'Helm of the Unshaken Mind', type: 'Helmet', icon: 'helmet' },
        { name: 'Tome of Boundless Wisdom', type: 'Tome', icon: 'tome' },
        { name: 'Monocle of Ancient Glyphs', type: 'Amulet', icon: 'amulet' },
      ],
      stats: ['Wisdom', 'Focus', 'Discipline', 'Comprehension'],
      loreTemplates: [
        'Forged in the quiet halls of silent contemplation, infused with every sentence absorbed.',
        'Worn by scholars who seek eternal truths through the discipline of the written word.',
      ],
      colorTheme: 'purple',
    },
    learning: {
      items: [
        { name: 'Orb of Understanding', type: 'Orb', icon: 'orb' },
        { name: 'Crown of Synaptic Radiance', type: 'Crown', icon: 'crown' },
        { name: 'Prism of Cognition', type: 'Amulet', icon: 'gem' },
        { name: 'Chalice of Deep Thought', type: 'Chalice', icon: 'chalice' },
      ],
      stats: ['Intelligence', 'Insight', 'Curiosity', 'Clarity'],
      loreTemplates: [
        'A glowing crystal core that vibrates with newfound knowledge and synaptic connections.',
        'Imbued with the tireless curiosity of a mind reaching past known horizons.',
      ],
      colorTheme: 'sky',
    },
    programming: {
      items: [
        { name: 'The Codeforged Gauntlet', type: 'Gauntlet', icon: 'gauntlet' },
        { name: 'Silicon Core of Logic', type: 'Orb', icon: 'orb' },
        { name: 'Bracer of Algorithmic Precision', type: 'Gauntlet', icon: 'shield' },
        { name: 'Runed Key of the Root Architect', type: 'Blade', icon: 'blade' },
      ],
      stats: ['Logic', 'Problem Solving', 'Efficiency', 'Architecture'],
      loreTemplates: [
        'Woven from threads of pure binary light, granting clarity amidst labyrinthine logic.',
        'Constructed keystroke by keystroke, compiling sheer will into infallible form.',
      ],
      colorTheme: 'emerald',
    },
    exercise: {
      items: [
        { name: 'Greaves of Endurance', type: 'Greaves', icon: 'greaves' },
        { name: 'Belt of the Titan', type: 'Amulet', icon: 'shield' },
        { name: 'Band of the Iron Pulse', type: 'Ring', icon: 'ring' },
        { name: 'Crest of Relentless Vigor', type: 'Crown', icon: 'crown' },
      ],
      stats: ['Endurance', 'Vitality', 'Strength', 'Resilience'],
      loreTemplates: [
        'Hardened by sweat and breath, unyielding to fatigue and forged through sheer repetition.',
        'Carries the kinetic memory of miles conquered and limits shattered.',
      ],
      colorTheme: 'amber',
    },
    chinese: {
      items: [
        { name: 'Jade Scroll of Tongues', type: 'Scroll', icon: 'scroll' },
        { name: 'Amulet of the Azure Dragon', type: 'Amulet', icon: 'amulet' },
        { name: 'Brush of Ten Thousand Characters', type: 'Quill', icon: 'quill' },
        { name: 'Bell of Harmonious Pitch', type: 'Chalice', icon: 'chalice' },
      ],
      stats: ['Fluency', 'Tonal Memory', 'Cultural Depth', 'Rhythm'],
      loreTemplates: [
        'Carved from celadon jade, whispering idioms and ancient tones to those who listen.',
        'A testament to character memorization and the melodious resonance of spoken tones.',
      ],
      colorTheme: 'emerald',
    },
  };

  // Find matching archetype or fallback
  let matchKey = Object.keys(archetypes).find((k) => catLower.includes(k));
  const fallbackArchetype: Archetype = {
    items: [
      { name: `Relic of ${categoryName} Mastery`, type: 'Artifact', icon: 'gem' },
      { name: `The Vanguard's Token of ${categoryName}`, type: 'Amulet', icon: 'amulet' },
      { name: `Crown of Ascension`, type: 'Crown', icon: 'crown' },
    ],
    stats: ['Dedication', 'Mastery', 'Discipline', 'Resolve'],
    loreTemplates: [
      `Manifested through consistent effort in ${categoryName}, commemorating the rise to Level ${newLevel}.`,
      `Resonates with the steady rhythm of deliberate practice and acquired skill.`,
    ],
    colorTheme: 'amber',
  };

  const chosen = matchKey ? archetypes[matchKey] : fallbackArchetype;
  const item = chosen.items[(newLevel - 1) % chosen.items.length];
  const stat1 = chosen.stats[0];
  const stat2 = chosen.stats[1];

  const statMult = Math.max(1, newLevel * 4);
  const recentSummary = recentActivities.length > 0
    ? `Inspired by recent deeds: "${recentActivities.map((a) => a.title).join(', ')}".`
    : '';

  return {
    name: item.name,
    type: item.type,
    rarity,
    stats: [
      { stat: stat1, value: 5 + statMult },
      { stat: stat2, value: 3 + Math.round(statMult * 0.6) },
    ],
    description: `A ${rarity.toLowerCase()} ${item.type.toLowerCase()} forged upon reaching Level ${newLevel} in ${categoryName}.`,
    lore: `${chosen.loreTemplates[(newLevel - 1) % chosen.loreTemplates.length]} ${recentSummary}`,
    imagePrompt: `A high fantasy RPG collectible ${item.type.toLowerCase()} called '${item.name}', glowing with mystical ${chosen.colorTheme} energy, isolated on a dark obsidian stone pedestal, intricate craftsmanship, ancient runes, dramatic rim lighting, cinematic 8k masterpiece.`,
    iconSymbol: item.icon,
    colorTheme: chosen.colorTheme,
  };
}

// Relic Generation API Endpoint
app.post('/api/generate-relic', async (req, res) => {
  try {
    const {
      categoryName,
      categoryEmoji,
      newLevel,
      recentActivities = [],
      totalCategoryXP = 0,
      existingRelicNames = [],
    } = req.body;

    if (!categoryName || typeof newLevel !== 'number') {
      return res.status(400).json({ error: 'categoryName and newLevel are required' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      console.log('Gemini API key not configured, using procedural relic generation');
      const procedural = generateProceduralRelic({
        categoryName,
        categoryEmoji: categoryEmoji || '✨',
        newLevel,
        recentActivities,
      });
      return res.json({ relic: procedural, source: 'procedural' });
    }

    // Call Gemini 3.8 Flash with structured schema
    const prompt = `You are the Ancient Grandmaster of Reliclog.
When an adventurer levels up through real-life dedication and self-improvement, you forge a single, unique, collectible RPG Relic.

Category: "${categoryEmoji || ''} ${categoryName}"
New Level Reached: Level ${newLevel}
Total XP: ${totalCategoryXP}
Recent Real-World Activities:
${recentActivities.length > 0 ? recentActivities.map((a: any) => `- ${a.title} (+${a.xp} XP)`).join('\n') : '- Consistent deliberate practice'}

Existing Relics in user's collection (Do NOT duplicate):
${existingRelicNames.length > 0 ? existingRelicNames.join(', ') : 'None yet'}

Guidelines:
1. Name: Imaginative, authentic RPG relic title (e.g., "The Helm of the Unshaken Mind", "The Archivist's Blade", "Orb of Understanding", "Jade Scroll of Tongues", "Greaves of Endurance"). Connect thematically to the specific activities they just completed!
2. Type: Weapon, Armor, Accessory, or Artifact type (e.g., Blade, Helmet, Gauntlet, Scroll, Orb, Amulet, Tome, Greaves, Ring, Shield, Chalice, Crown, Quill).
3. Rarity: Choose based on achievement level:
   - Level 2: Common or Uncommon
   - Level 3: Uncommon or Rare
   - Level 4: Rare or Epic
   - Level 5+: Epic or Legendary
4. Stats: Exactly 2 or 3 RPG attributes with positive numbers, scaled to level (e.g. "+15 Wisdom", "+8 Discipline").
5. Description: 1 sentence summarizing what the item is and what milestone it commemorates.
6. Lore: 2-3 evocative, atmospheric sentences of fantasy flavor text that poeticize the user's real-world effort into high-fantasy mythos.
7. ImagePrompt: A vivid visual description suitable for concept art (e.g., "A mystical glowing tome with gold filigree and floating celestial runes, set against dark polished obsidian, dramatic rim lighting, highly detailed RPG item asset").
8. IconSymbol: Choose one from ["blade", "helmet", "gauntlet", "scroll", "orb", "amulet", "tome", "greaves", "ring", "shield", "chalice", "crown", "quill", "gem"].
9. ColorTheme: Choose one from ["amber", "emerald", "purple", "sky", "rose", "indigo", "gold"].`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: 'Unique RPG relic name' },
            type: { type: Type.STRING, description: 'Item type (Blade, Helmet, Scroll, etc.)' },
            rarity: {
              type: Type.STRING,
              enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
              description: 'Item rarity grade',
            },
            stats: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stat: { type: Type.STRING, description: 'Stat name like Wisdom, Focus' },
                  value: { type: Type.NUMBER, description: 'Positive number like 15' },
                },
                required: ['stat', 'value'],
              },
            },
            description: { type: Type.STRING, description: 'One sentence summary' },
            lore: { type: Type.STRING, description: 'Atmospheric lore connecting real effort to mythos' },
            imagePrompt: { type: Type.STRING, description: 'Art concept prompt' },
            iconSymbol: {
              type: Type.STRING,
              description: 'Standard icon symbol for visual rendering',
            },
            colorTheme: {
              type: Type.STRING,
              description: 'Color theme like amber, emerald, purple, sky',
            },
          },
          required: [
            'name',
            'type',
            'rarity',
            'stats',
            'description',
            'lore',
            'imagePrompt',
            'iconSymbol',
            'colorTheme',
          ],
        },
      },
    });

    const text = response.text?.trim();
    if (!text) {
      throw new Error('Empty response from AI model');
    }

    const relicData = JSON.parse(text);
    return res.json({ relic: relicData, source: 'gemini' });
  } catch (err: any) {
    console.error('Relic generation error:', err);
    // Fallback gracefully so the user never sees a broken game loop
    const fallback = generateProceduralRelic({
      categoryName: req.body?.categoryName || 'General',
      categoryEmoji: req.body?.categoryEmoji || '⭐',
      newLevel: req.body?.newLevel || 2,
      recentActivities: req.body?.recentActivities || [],
    });
    return res.json({ relic: fallback, source: 'procedural-fallback', error: err.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Reliclog server running on http://localhost:${PORT}`);
  });
}

startServer();
