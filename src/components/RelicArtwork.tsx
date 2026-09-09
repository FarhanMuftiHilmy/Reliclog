import React from 'react';
import { RelicRarity, RARITY_CONFIG } from '../types';

interface RelicArtworkProps {
  type: string;
  iconSymbol: string;
  rarity: RelicRarity;
  colorTheme?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const RelicArtwork: React.FC<RelicArtworkProps> = ({
  type,
  iconSymbol,
  rarity,
  colorTheme = 'amber',
  className = '',
  size = 'md',
}) => {
  const rarityConfig = RARITY_CONFIG[rarity] || RARITY_CONFIG.Common;
  const symbol = (iconSymbol || type || 'gem').toLowerCase();

  // Determine size classes
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-48 h-48',
    hero: 'w-64 h-64 sm:w-80 sm:h-80',
  }[size];

  // Colors based on theme & rarity
  const glowColor = rarityConfig.accentHex;

  return (
    <div
      className={`relative flex items-center justify-center rounded-xl overflow-hidden bg-slate-950/90 border ${
        rarity === 'Legendary'
          ? 'border-amber-500/60 shadow-[0_0_35px_rgba(245,158,11,0.3)]'
          : rarity === 'Epic'
          ? 'border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.25)]'
          : rarity === 'Rare'
          ? 'border-sky-500/40 shadow-[0_0_20px_rgba(56,189,248,0.2)]'
          : rarity === 'Uncommon'
          ? 'border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
          : 'border-slate-700/60 shadow-[0_0_10px_rgba(148,163,184,0.1)]'
      } ${sizeClasses} ${className}`}
    >
      {/* Background ambient radial aura */}
      <div
        className="absolute inset-0 opacity-40 blur-xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Runic orbital ring */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-25 animate-[spin_60s_linear_infinite]"
      >
        <circle
          cx="100"
          cy="100"
          r="86"
          fill="none"
          stroke={glowColor}
          strokeWidth="1"
          strokeDasharray="4 6 12 6"
        />
        <circle
          cx="100"
          cy="100"
          r="72"
          fill="none"
          stroke={glowColor}
          strokeWidth="0.75"
          strokeDasharray="2 10"
        />
        <circle cx="100" cy="14" r="2" fill={glowColor} />
        <circle cx="186" cy="100" r="2" fill={glowColor} />
        <circle cx="100" cy="186" r="2" fill={glowColor} />
        <circle cx="14" cy="100" r="2" fill={glowColor} />
      </svg>

      {/* Internal Artifact Vector Representation */}
      <div className="relative z-10 w-4/5 h-4/5 flex items-center justify-center p-2">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] filter transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <linearGradient id={`grad-primary-${rarity}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="40%" stopColor={glowColor} stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id={`grad-metal-${rarity}`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor={glowColor} />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {renderArtifactSvg(symbol, glowColor, rarity)}
        </svg>
      </div>

      {/* Rarity Corner Gem Indicator */}
      <div
        className="absolute top-2 right-2 w-2 h-2 rounded-full border border-white/50 shadow-sm"
        style={{ backgroundColor: glowColor }}
      />
    </div>
  );
};

function renderArtifactSvg(symbol: string, glow: string, rarity: RelicRarity) {
  if (symbol.includes('blade') || symbol.includes('sword')) {
    return (
      <g>
        {/* Magic aura */}
        <line x1="50" y1="12" x2="50" y2="70" stroke={glow} strokeWidth="6" strokeLinecap="round" opacity="0.3" />
        {/* Blade */}
        <polygon points="50,10 57,32 55,70 50,73 45,70 43,32" fill={`url(#grad-primary-${rarity})`} stroke={glow} strokeWidth="1" />
        {/* Fuller runic channel */}
        <line x1="50" y1="20" x2="50" y2="66" stroke="#ffffff" strokeWidth="1.2" opacity="0.8" />
        <circle cx="50" cy="30" r="1.5" fill="#ffffff" />
        <circle cx="50" cy="45" r="1.5" fill="#ffffff" />
        {/* Guard */}
        <path d="M 30,73 Q 50,70 70,73 Q 73,76 68,78 Q 50,75 32,78 Z" fill="#334155" stroke={glow} strokeWidth="1" />
        {/* Center guard gem */}
        <circle cx="50" cy="74" r="3" fill={glow} stroke="#ffffff" strokeWidth="0.8" />
        {/* Hilt */}
        <rect x="47.5" y="78" width="5" height="12" rx="1.5" fill="#1e293b" stroke={glow} strokeWidth="0.8" />
        <line x1="47.5" y1="81" x2="52.5" y2="81" stroke={glow} strokeWidth="0.6" />
        <line x1="47.5" y1="84" x2="52.5" y2="84" stroke={glow} strokeWidth="0.6" />
        <line x1="47.5" y1="87" x2="52.5" y2="87" stroke={glow} strokeWidth="0.6" />
        {/* Pommel */}
        <circle cx="50" cy="93" r="3.5" fill={glow} stroke="#ffffff" strokeWidth="1" />
      </g>
    );
  }

  if (symbol.includes('helmet') || symbol.includes('helm')) {
    return (
      <g>
        {/* Crown crest plumes */}
        <path d="M 50,14 C 42,20 38,28 36,36 C 45,30 55,30 64,36 C 62,28 58,20 50,14 Z" fill={glow} opacity="0.6" />
        {/* Helmet dome */}
        <path d="M 28,52 C 28,28 72,28 72,52 L 74,70 C 74,78 66,82 50,82 C 34,82 26,78 26,70 Z" fill="#1e293b" stroke={glow} strokeWidth="1.5" />
        {/* Visor brow band */}
        <path d="M 27,52 Q 50,56 73,52 L 72,60 Q 50,64 28,60 Z" fill={glow} opacity="0.8" />
        {/* Glowing eye slit */}
        <polygon points="34,57 47,58 46,61 35,60" fill="#ffffff" filter="url(#glow-filter)" />
        <polygon points="66,57 53,58 54,61 65,60" fill="#ffffff" filter="url(#glow-filter)" />
        {/* Nasal / Cheek guards */}
        <polygon points="48,56 52,56 51,76 49,76" fill={glow} />
        {/* Face vent slits */}
        <line x1="38" y1="70" x2="43" y2="70" stroke={glow} strokeWidth="1" />
        <line x1="39" y1="73" x2="44" y2="73" stroke={glow} strokeWidth="1" />
        <line x1="57" y1="70" x2="62" y2="70" stroke={glow} strokeWidth="1" />
        <line x1="56" y1="73" x2="61" y2="73" stroke={glow} strokeWidth="1" />
      </g>
    );
  }

  if (symbol.includes('scroll') || symbol.includes('tome') || symbol.includes('book')) {
    return (
      <g>
        {/* Magic aura particles */}
        <circle cx="28" cy="24" r="1.5" fill={glow} opacity="0.7" />
        <circle cx="72" cy="22" r="1.5" fill={glow} opacity="0.7" />
        {/* Book cover & pages */}
        <path d="M 24,24 L 76,24 Q 78,60 76,78 L 24,78 Q 22,50 24,24 Z" fill="#0f172a" stroke={glow} strokeWidth="1.8" />
        <path d="M 28,26 L 72,26 L 72,74 L 28,74 Z" fill="#1e293b" />
        {/* Inner book pages spread */}
        <path d="M 31,30 L 48,31 L 48,70 L 31,69 Z" fill="#334155" opacity="0.7" />
        <path d="M 52,31 L 69,30 L 69,69 L 52,70 Z" fill="#334155" opacity="0.7" />
        {/* Spine */}
        <line x1="50" y1="26" x2="50" y2="74" stroke={glow} strokeWidth="1.5" />
        {/* Central mystic seal */}
        <circle cx="50" cy="50" r="10" fill="none" stroke={glow} strokeWidth="1.2" />
        <polygon points="50,42 57,54 43,54" fill="none" stroke="#ffffff" strokeWidth="0.8" />
        <polygon points="50,58 57,46 43,46" fill="none" stroke="#ffffff" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="2.5" fill={glow} />
        {/* Corner brass protectors */}
        <polygon points="25,25 33,25 25,33" fill={glow} />
        <polygon points="75,25 67,25 75,33" fill={glow} />
        <polygon points="25,77 33,77 25,69" fill={glow} />
        <polygon points="75,77 67,77 75,69" fill={glow} />
      </g>
    );
  }

  if (symbol.includes('gauntlet') || symbol.includes('glove')) {
    return (
      <g>
        {/* Forearm bracer */}
        <polygon points="32,84 68,84 64,56 36,56" fill="#1e293b" stroke={glow} strokeWidth="1.5" />
        <circle cx="50" cy="70" r="5" fill={glow} opacity="0.8" />
        {/* Hand knuckle plate */}
        <polygon points="34,54 66,54 64,36 36,36" fill="#334155" stroke={glow} strokeWidth="1.2" />
        {/* 4 Knuckle power nodes */}
        <circle cx="40" cy="40" r="2" fill="#ffffff" />
        <circle cx="46.5" cy="38" r="2" fill="#ffffff" />
        <circle cx="53.5" cy="38" r="2" fill="#ffffff" />
        <circle cx="60" cy="40" r="2" fill="#ffffff" />
        {/* Fingers */}
        <rect x="36" y="20" width="5" height="15" rx="2" fill="#1e293b" stroke={glow} strokeWidth="0.8" />
        <rect x="43" y="16" width="5.5" height="19" rx="2" fill="#334155" stroke={glow} strokeWidth="0.8" />
        <rect x="50.5" y="16" width="5.5" height="19" rx="2" fill="#334155" stroke={glow} strokeWidth="0.8" />
        <rect x="58" y="20" width="5" height="15" rx="2" fill="#1e293b" stroke={glow} strokeWidth="0.8" />
        {/* Thumb */}
        <polygon points="34,44 26,38 28,32 35,38" fill="#1e293b" stroke={glow} strokeWidth="0.8" />
      </g>
    );
  }

  if (symbol.includes('orb') || symbol.includes('core')) {
    return (
      <g>
        {/* Floating energy arcs */}
        <circle cx="50" cy="50" r="38" fill="none" stroke={glow} strokeWidth="0.8" strokeDasharray="3 6" opacity="0.6" />
        <ellipse cx="50" cy="50" rx="42" ry="14" fill="none" stroke={glow} strokeWidth="1.2" transform="rotate(-25 50 50)" opacity="0.8" />
        {/* Outer sphere glass */}
        <circle cx="50" cy="50" r="26" fill="#0f172a" stroke={glow} strokeWidth="2" opacity="0.9" />
        {/* Inner core */}
        <circle cx="50" cy="50" r="18" fill={`url(#grad-primary-${rarity})`} opacity="0.95" />
        {/* Center singularity */}
        <circle cx="46" cy="44" r="5" fill="#ffffff" opacity="0.9" filter="url(#glow-filter)" />
        {/* Floating ring orbiters */}
        <circle cx="20" cy="62" r="2" fill={glow} />
        <circle cx="80" cy="38" r="2" fill={glow} />
      </g>
    );
  }

  if (symbol.includes('amulet') || symbol.includes('pendant') || symbol.includes('necklace')) {
    return (
      <g>
        {/* Chain */}
        <path d="M 28,14 Q 50,42 72,14" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2" />
        {/* Medallion outer setting */}
        <polygon points="50,34 68,50 62,74 38,74 32,50" fill="#1e293b" stroke={glow} strokeWidth="1.8" />
        {/* Filigree frame */}
        <polygon points="50,40 62,51 58,68 42,68 38,51" fill="#0f172a" stroke={glow} strokeWidth="1" />
        {/* Central Faceted Jewel */}
        <polygon points="50,44 58,54 50,65 42,54" fill={`url(#grad-primary-${rarity})`} stroke="#ffffff" strokeWidth="0.8" />
        <circle cx="48" cy="50" r="1.5" fill="#ffffff" />
      </g>
    );
  }

  if (symbol.includes('greaves') || symbol.includes('boot')) {
    return (
      <g>
        {/* Speed trail */}
        <path d="M 32,84 L 24,78 M 36,87 L 26,82" stroke={glow} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        {/* Greave plate */}
        <path d="M 40,16 L 64,16 L 68,52 L 76,78 L 36,78 L 34,50 Z" fill="#1e293b" stroke={glow} strokeWidth="1.6" />
        {/* Knee Cop */}
        <circle cx="52" cy="26" r="8" fill="#334155" stroke={glow} strokeWidth="1.2" />
        <polygon points="52,20 58,26 52,32 46,26" fill={glow} />
        {/* Shin rib reinforcement */}
        <line x1="52" y1="36" x2="52" y2="70" stroke={glow} strokeWidth="2" strokeLinecap="round" />
        {/* Wing emblem on side */}
        <path d="M 68,36 C 78,32 82,24 82,18 C 76,26 70,30 68,36 Z" fill={glow} />
      </g>
    );
  }

  if (symbol.includes('crown') || symbol.includes('diadem') || symbol.includes('circlet')) {
    return (
      <g>
        {/* Radiant star burst */}
        <circle cx="50" cy="30" r="24" fill="none" stroke={glow} strokeWidth="0.5" opacity="0.4" />
        {/* Crown base band */}
        <path d="M 22,64 Q 50,70 78,64 L 78,72 Q 50,78 22,72 Z" fill="#1e293b" stroke={glow} strokeWidth="1.5" />
        {/* Crown pinnacles */}
        <polygon points="22,64 26,38 36,54 50,26 64,54 74,38 78,64" fill={`url(#grad-metal-${rarity})`} stroke={glow} strokeWidth="1.5" />
        {/* Gems on pinnacles */}
        <circle cx="50" cy="26" r="3.5" fill={glow} stroke="#ffffff" strokeWidth="1" />
        <circle cx="26" cy="38" r="2.5" fill={glow} stroke="#ffffff" strokeWidth="0.8" />
        <circle cx="74" cy="38" r="2.5" fill={glow} stroke="#ffffff" strokeWidth="0.8" />
        {/* Band jewels */}
        <circle cx="36" cy="68" r="2" fill="#ffffff" />
        <circle cx="50" cy="71" r="2.5" fill={glow} />
        <circle cx="64" cy="68" r="2" fill="#ffffff" />
      </g>
    );
  }

  // Default: Enchanted Gem / Artifact
  return (
    <g>
      {/* Outer aura ring */}
      <circle cx="50" cy="50" r="34" fill="none" stroke={glow} strokeWidth="0.8" strokeDasharray="4 8" opacity="0.5" />
      {/* Faceted Grand Prism */}
      <polygon points="50,14 78,34 78,66 50,86 22,66 22,34" fill="#0f172a" stroke={glow} strokeWidth="1.8" />
      <polygon points="50,14 78,34 50,50 22,34" fill={`url(#grad-primary-${rarity})`} opacity="0.9" />
      <polygon points="78,34 78,66 50,50" fill="#334155" opacity="0.75" />
      <polygon points="78,66 50,86 50,50" fill="#1e293b" opacity="0.9" />
      <polygon points="50,86 22,66 50,50" fill="#0f172a" opacity="0.8" />
      <polygon points="22,66 22,34 50,50" fill={glow} opacity="0.5" />
      {/* Center radiant shine */}
      <circle cx="48" cy="46" r="4" fill="#ffffff" opacity="0.9" filter="url(#glow-filter)" />
      <circle cx="50" cy="50" r="1.5" fill="#ffffff" />
    </g>
  );
}
