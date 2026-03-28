import type { Faction } from '../../core/types';
import { renderClassSpriteBack } from './classSpritesBack';

export type Palette = { primary: string; dark: string; light: string; outline: string };

export const FACTION_COLORS: Record<Faction, Palette> = {
  player:  { primary: '#3b82f6', dark: '#1e40af', light: '#93c5fd', outline: '#1d4ed8' },
  enemy:   { primary: '#ef4444', dark: '#991b1b', light: '#fca5a5', outline: '#b91c1c' },
  ally:    { primary: '#22c55e', dark: '#166534', light: '#86efac', outline: '#15803d' },
  neutral: { primary: '#a78bfa', dark: '#5b21b6', light: '#c4b5fd', outline: '#7c3aed' },
};

export function renderClassSprite(classId: string, c: Palette, facing: 'front' | 'back' = 'front') {
  if (facing === 'back') return renderClassSpriteBack(classId, c);
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
    // Promoted classes → reuse base class sprites
    case 'great_lord': case 'conqueror':
      return <LordSprite c={c} />;
    case 'paladin': case 'great_knight': case 'mage_knight': case 'nomad_trooper':
    case 'valkyrie_cleric': case 'valkyrie_troubadour': case 'maid': case 'great_knight_armor':
      return <CavalierSprite c={c} />;
    case 'sage': case 'dark_flier': case 'druid': case 'summoner':
      return <MageSprite c={c} />;
    case 'warrior': case 'berserker': case 'hero': case 'war_monk':
      return <FighterSprite c={c} />;
    case 'general_soldier': case 'halberdier': case 'general_knight':
      return <SoldierSprite c={c} />;
    case 'bishop': case 'saint':
      return <ClericSprite c={c} />;
    case 'sniper': case 'assassin': case 'rogue': case 'swordmaster':
      return <GenericSprite c={c} />;
    case 'falcon_knight': case 'wyvern_lord': case 'malig_knight':
      return <GenericSprite c={c} />;
    // Master classes — enhanced sprites with glow accents
    case 'overlord':
      return <MasterSprite c={c} base="lord" glow="#fbbf24" />;
    case 'archsage':
      return <MasterSprite c={c} base="mage" glow="#a78bfa" />;
    case 'reaver':
      return <MasterSprite c={c} base="fighter" glow="#ef4444" />;
    case 'seraph':
      return <MasterSprite c={c} base="generic" glow="#f0f9ff" />;
    case 'marshal':
      return <MasterSprite c={c} base="cavalier" glow="#60a5fa" />;
    case 'phantom':
      return <MasterSprite c={c} base="generic" glow="#6366f1" />;
    case 'oracle':
      return <MasterSprite c={c} base="cleric" glow="#34d399" />;
    case 'dragon_lord':
      return <MasterSprite c={c} base="generic" glow="#dc2626" />;
    default:
      return <GenericSprite c={c} />;
  }
}

function LordSprite({ c }: { c: Palette }) {
  return (
    <g>
      {/* Cape — flowing, two layers — with flutter animation */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0; 0.5 -0.3; 0 0; -0.3 0.2; 0 0" dur="2.5s" repeatCount="indefinite" />
        <polygon points="10,16 5,35 8,32 16,36 12,30" fill={c.dark} opacity="0.55" />
        <polygon points="11,17 7,33 14,34" fill={c.light} opacity="0.15" />
      </g>

      {/* Upper body — breathing animation group */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0; 0 -0.4; 0 0" dur="2s" repeatCount="indefinite" />

        {/* Shoulder pauldrons */}
        <ellipse cx="11" cy="17" rx="3" ry="2" fill={c.dark} stroke={c.outline} strokeWidth="0.5" />
        <ellipse cx="21" cy="17" rx="3" ry="2" fill={c.dark} stroke={c.outline} strokeWidth="0.5" />
        <path d="M8,17 Q11,15 14,17" fill="none" stroke="#fbbf24" strokeWidth="0.4" />
        {/* Body — armor with detail */}
        <rect x="11" y="16" width="10" height="12" rx="2" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
        <rect x="12" y="17" width="8" height="4" rx="1" fill={c.light} opacity="0.2" />
        <line x1="16" y1="17" x2="16" y2="27" stroke={c.dark} strokeWidth="0.5" opacity="0.3" />
        {/* Gold belt + buckle */}
        <rect x="11" y="25" width="10" height="2" rx="0.5" fill="#d97706" />
        <rect x="14.5" y="25" width="3" height="2" rx="0.3" fill="#fbbf24" stroke="#d97706" strokeWidth="0.3" />
        {/* Head */}
        <circle cx="16" cy="10" r="6" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
        {/* Hair — swept asymmetric with bangs */}
        <path d="M10,10 Q10,4 13,3 L15,5 L17,3 Q20,4 22,6 Q22,10 21,11 L20,8 Q16,6 12,8 L11,11 Z" fill={c.dark} />
        {/* Eyes with highlights */}
        <rect x="13" y="9" width="2" height="2.2" rx="0.5" fill="#333" />
        <rect x="17" y="9" width="2" height="2.2" rx="0.5" fill="#333" />
        <rect x="13.3" y="9" width="0.8" height="0.8" rx="0.2" fill="#fff" opacity="0.6" />
        <rect x="17.3" y="9" width="0.8" height="0.8" rx="0.2" fill="#fff" opacity="0.6" />
        {/* Mouth hint */}
        <line x1="14.5" y1="12.5" x2="17.5" y2="12.5" stroke="#c4956a" strokeWidth="0.5" />
        {/* Crown — 3 peaks with gem */}
        <polygon points="10.5,5.5 12.5,1 14.5,4 16,0.5 17.5,4 19.5,1 21.5,5.5" fill="#fbbf24" stroke="#b45309" strokeWidth="0.5" />
        <circle cx="16" cy="3" r="0.8" fill="#ef4444">
          <animate attributeName="opacity" values="1;0.6;1" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Sword with detail */}
        <rect x="22.5" y="6" width="2" height="16" rx="0.3" fill="#c0c0c0" stroke="#888" strokeWidth="0.4" />
        <line x1="23" y1="7" x2="23" y2="21" stroke="#e8e8e8" strokeWidth="0.4" opacity="0.5" />
        <rect x="20" y="14" width="7" height="2.5" rx="0.8" fill="#d4a574" stroke="#a07850" strokeWidth="0.3" />
        <circle cx="23.5" cy="23" r="1" fill="#d4a574" stroke="#a07850" strokeWidth="0.3" />
      </g>

      {/* Legs — grounded, no breathing */}
      <rect x="12" y="27" width="4" height="6" rx="1" fill={c.dark} />
      <rect x="17" y="27" width="4" height="6" rx="1" fill={c.dark} />
      {/* Boots with cuffs */}
      <rect x="11.5" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
      <rect x="16.5" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
      <line x1="12" y1="32" x2="16" y2="32" stroke="#7a5230" strokeWidth="0.5" />
      <line x1="17" y1="32" x2="21" y2="32" stroke="#7a5230" strokeWidth="0.5" />
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

/** Master class sprite: base sprite wrapped with a glow aura ring. */
function MasterSprite({ c, base, glow }: { c: Palette; base: string; glow: string }) {
  const baseSprite = (() => {
    switch (base) {
      case 'lord': return <LordSprite c={c} />;
      case 'cavalier': return <CavalierSprite c={c} />;
      case 'mage': return <MageSprite c={c} />;
      case 'fighter': return <FighterSprite c={c} />;
      case 'soldier': return <SoldierSprite c={c} />;
      case 'cleric': return <ClericSprite c={c} />;
      default: return <GenericSprite c={c} />;
    }
  })();

  return (
    <g>
      {/* Glow aura behind the sprite */}
      <circle cx="16" cy="18" r="14" fill="none" stroke={glow} strokeWidth="1.5" opacity="0.4">
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="16" cy="18" r="12" fill={glow} opacity="0.08" />
      {baseSprite}
      {/* Crown/star accent for master tier */}
      <polygon points="16,0 17.2,3 20,3 17.8,5 18.6,8 16,6.5 13.4,8 14.2,5 12,3 14.8,3" fill={glow} opacity="0.7" />
    </g>
  );
}
