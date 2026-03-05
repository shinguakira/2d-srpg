import type { Faction } from '../../core/types';

const COLORS: Record<Faction, { primary: string; dark: string; light: string; outline: string }> = {
  player: { primary: '#3b82f6', dark: '#1e40af', light: '#93c5fd', outline: '#1d4ed8' },
  enemy:  { primary: '#ef4444', dark: '#991b1b', light: '#fca5a5', outline: '#b91c1c' },
  ally:   { primary: '#22c55e', dark: '#166534', light: '#86efac', outline: '#15803d' },
};

type Palette = { primary: string; dark: string; light: string; outline: string };

type BattleSpriteProps = {
  classId: string;
  faction: Faction;
  mirrored?: boolean;
};

export function BattleSprite({ classId, faction, mirrored }: BattleSpriteProps) {
  const c = COLORS[faction];
  return (
    <svg
      width={64}
      height={72}
      viewBox="0 0 32 36"
      style={{
        imageRendering: 'auto',
        transform: mirrored ? 'scaleX(-1)' : undefined,
      }}
    >
      {renderBattleSprite(classId, c)}
    </svg>
  );
}

function renderBattleSprite(classId: string, c: Palette) {
  switch (classId) {
    case 'lord':
      return <LordSprite c={c} />;
    case 'cavalier':
      return <CavalierSprite c={c} />;
    case 'mage':
      return <MageSprite c={c} />;
    case 'fighter':
      return <FighterSprite c={c} />;
    case 'soldier':
      return <SoldierSprite c={c} />;
    case 'cleric':
      return <ClericSprite c={c} />;
    default:
      return <GenericSprite c={c} />;
  }
}

function LordSprite({ c }: { c: Palette }) {
  return (
    <g>
      <polygon points="10,14 6,34 16,30" fill={c.dark} opacity="0.6" />
      <rect x="11" y="16" width="10" height="12" rx="2" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      <circle cx="16" cy="10" r="6" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      <ellipse cx="16" cy="7" rx="6" ry="3.5" fill={c.dark} />
      <rect x="13" y="9" width="2" height="2" rx="0.5" fill="#333" />
      <rect x="17" y="9" width="2" height="2" rx="0.5" fill="#333" />
      <polygon points="11,6 13,2 16,5 19,2 21,6" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
      <rect x="22" y="8" width="2" height="18" rx="0.5" fill="#c0c0c0" stroke="#888" strokeWidth="0.4" />
      <rect x="20" y="14" width="6" height="2" rx="0.5" fill="#d4a574" />
      <rect x="12" y="28" width="4" height="6" rx="1" fill={c.dark} />
      <rect x="17" y="28" width="4" height="6" rx="1" fill={c.dark} />
      <rect x="12" y="32" width="4" height="3" rx="1" fill="#5c3a1e" />
      <rect x="17" y="32" width="4" height="3" rx="1" fill="#5c3a1e" />
    </g>
  );
}

function CavalierSprite({ c }: { c: Palette }) {
  return (
    <g>
      <ellipse cx="16" cy="28" rx="12" ry="6" fill="#8B6914" stroke="#6b5010" strokeWidth="0.8" />
      <rect x="6" y="32" width="3" height="4" rx="0.5" fill="#7a5c12" />
      <rect x="11" y="33" width="3" height="3" rx="0.5" fill="#7a5c12" />
      <rect x="18" y="33" width="3" height="3" rx="0.5" fill="#7a5c12" />
      <rect x="23" y="32" width="3" height="4" rx="0.5" fill="#7a5c12" />
      <ellipse cx="26" cy="22" rx="4" ry="5" fill="#8B6914" stroke="#6b5010" strokeWidth="0.8" />
      <circle cx="27" cy="20" r="1" fill="#333" />
      <rect x="12" y="14" width="8" height="10" rx="2" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      <circle cx="16" cy="9" r="5" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      <path d="M11,8 Q16,2 21,8" fill={c.dark} />
      <rect x="14" y="8" width="1.5" height="1.5" rx="0.3" fill="#333" />
      <rect x="17" y="8" width="1.5" height="1.5" rx="0.3" fill="#333" />
      <line x1="8" y1="2" x2="8" y2="28" stroke="#c0c0c0" strokeWidth="1.5" />
      <polygon points="8,0 5,5 11,5" fill="#c0c0c0" />
    </g>
  );
}

function MageSprite({ c }: { c: Palette }) {
  return (
    <g>
      <polygon points="10,16 6,34 26,34 22,16" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      <ellipse cx="16" cy="14" rx="7" ry="3" fill={c.dark} />
      <circle cx="16" cy="10" r="5.5" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      <polygon points="9,10 16,0 23,10" fill={c.dark} stroke={c.outline} strokeWidth="0.5" />
      <circle cx="16" cy="0" r="1.5" fill="#fbbf24" />
      <rect x="13" y="9" width="2" height="1.5" rx="0.3" fill="#333" />
      <rect x="17" y="9" width="2" height="1.5" rx="0.3" fill="#333" />
      <rect x="4" y="20" width="6" height="8" rx="1" fill="#8B4513" stroke="#5c2e0a" strokeWidth="0.5" />
      <line x1="7" y1="20" x2="7" y2="28" stroke="#d4a574" strokeWidth="0.5" />
      <circle cx="24" cy="22" r="3" fill="rgba(147,197,253,0.6)" />
      <circle cx="24" cy="22" r="1.5" fill="white" opacity="0.8" />
      <rect x="10" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
      <rect x="17" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
    </g>
  );
}

function FighterSprite({ c }: { c: Palette }) {
  return (
    <g>
      <rect x="9" y="14" width="14" height="14" rx="2" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      <rect x="9" y="24" width="14" height="2" fill="#5c3a1e" />
      <circle cx="16" cy="9" r="6" fill="#e8c090" stroke={c.outline} strokeWidth="0.8" />
      <line x1="12" y1="7" x2="15" y2="8" stroke="#333" strokeWidth="1.2" />
      <line x1="20" y1="7" x2="17" y2="8" stroke="#333" strokeWidth="1.2" />
      <rect x="13" y="8.5" width="2" height="2" rx="0.3" fill="#333" />
      <rect x="17" y="8.5" width="2" height="2" rx="0.3" fill="#333" />
      <rect x="10" y="5" width="12" height="2.5" rx="1" fill={c.dark} />
      <rect x="24" y="6" width="2" height="20" rx="0.5" fill="#8B6914" />
      <path d="M26,8 L32,6 L32,14 L26,12 Z" fill="#c0c0c0" stroke="#888" strokeWidth="0.5" />
      <rect x="5" y="16" width="4" height="8" rx="2" fill="#e8c090" />
      <rect x="23" y="16" width="4" height="8" rx="2" fill="#e8c090" />
      <rect x="10" y="28" width="5" height="6" rx="1" fill={c.dark} />
      <rect x="17" y="28" width="5" height="6" rx="1" fill={c.dark} />
      <rect x="10" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
      <rect x="17" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
    </g>
  );
}

function SoldierSprite({ c }: { c: Palette }) {
  return (
    <g>
      <rect x="10" y="14" width="12" height="14" rx="2" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      <rect x="12" y="16" width="8" height="6" rx="1" fill={c.light} opacity="0.4" />
      <circle cx="16" cy="9" r="5.5" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      <path d="M10,9 Q10,2 16,2 Q22,2 22,9" fill={c.dark} stroke={c.outline} strokeWidth="0.5" />
      <rect x="15" y="5" width="2" height="5" rx="0.5" fill={c.dark} />
      <rect x="12.5" y="8" width="2" height="1.5" rx="0.3" fill="#333" />
      <rect x="17.5" y="8" width="2" height="1.5" rx="0.3" fill="#333" />
      <ellipse cx="7" cy="22" rx="5" ry="7" fill={c.dark} stroke={c.outline} strokeWidth="0.8" />
      <line x1="7" y1="16" x2="7" y2="28" stroke={c.light} strokeWidth="0.5" opacity="0.5" />
      <line x1="3" y1="22" x2="11" y2="22" stroke={c.light} strokeWidth="0.5" opacity="0.5" />
      <line x1="26" y1="0" x2="26" y2="32" stroke="#8B6914" strokeWidth="1.5" />
      <polygon points="26,0 23,5 29,5" fill="#c0c0c0" />
      <rect x="11" y="28" width="4" height="6" rx="1" fill={c.dark} />
      <rect x="17" y="28" width="4" height="6" rx="1" fill={c.dark} />
      <rect x="11" y="32" width="4" height="3" rx="1" fill="#5c3a1e" />
      <rect x="17" y="32" width="4" height="3" rx="1" fill="#5c3a1e" />
    </g>
  );
}

function ClericSprite({ c }: { c: Palette }) {
  return (
    <g>
      <polygon points="10,16 7,34 25,34 22,16" fill="#f0e6d0" stroke={c.outline} strokeWidth="0.8" />
      <rect x="13" y="20" width="6" height="2" rx="0.5" fill={c.primary} />
      <circle cx="16" cy="10" r="5.5" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      <path d="M10,12 Q10,3 16,3 Q22,3 22,12" fill="#e8dcc8" stroke={c.outline} strokeWidth="0.5" />
      <rect x="13" y="9" width="2" height="1.5" rx="0.3" fill="#333" />
      <rect x="17" y="9" width="2" height="1.5" rx="0.3" fill="#333" />
      <line x1="25" y1="4" x2="25" y2="32" stroke="#8b6914" strokeWidth="1.5" />
      <circle cx="25" cy="4" r="2.5" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
      <circle cx="25" cy="4" r="1" fill="white" opacity="0.6" />
      <rect x="4" y="20" width="5" height="7" rx="1" fill="#8B4513" stroke="#5c2e0a" strokeWidth="0.5" />
      <line x1="6.5" y1="20" x2="6.5" y2="27" stroke="#d4a574" strokeWidth="0.5" />
      <rect x="10" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
      <rect x="17" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
    </g>
  );
}

function GenericSprite({ c }: { c: Palette }) {
  return (
    <g>
      <rect x="10" y="14" width="12" height="14" rx="2" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      <circle cx="16" cy="9" r="5.5" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      <rect x="13" y="8" width="2" height="2" rx="0.3" fill="#333" />
      <rect x="17" y="8" width="2" height="2" rx="0.3" fill="#333" />
      <rect x="11" y="28" width="4" height="6" rx="1" fill={c.dark} />
      <rect x="17" y="28" width="4" height="6" rx="1" fill={c.dark} />
    </g>
  );
}
