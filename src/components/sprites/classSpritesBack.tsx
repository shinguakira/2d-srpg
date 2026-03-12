import type { Palette } from './classSprites';

/** Back-facing sprites — no facial features, back of head/helmet/cape visible */
export function renderClassSpriteBack(classId: string, c: Palette) {
  switch (classId) {
    case 'lord': return <LordBack c={c} />;
    case 'cavalier': return <CavalierBack c={c} />;
    case 'mage': return <MageBack c={c} />;
    case 'fighter': return <FighterBack c={c} />;
    case 'soldier': return <SoldierBack c={c} />;
    case 'cleric': return <ClericBack c={c} />;
    default: return <GenericBack c={c} />;
  }
}

function LordBack({ c }: { c: Palette }) {
  return (
    <g>
      {/* Cape flowing behind */}
      <polygon points="11,16 6,34 26,34 21,16" fill={c.dark} opacity="0.5" />
      {/* Body/armor */}
      <rect x="11" y="16" width="10" height="12" rx="2" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      {/* Back of head — hair visible, no face */}
      <circle cx="16" cy="10" r="6" fill="#d4a060" stroke={c.outline} strokeWidth="0.8" />
      <ellipse cx="16" cy="8" rx="6" ry="4" fill={c.dark} />
      {/* Crown from behind */}
      <polygon points="11,6 13,2 16,5 19,2 21,6" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
      {/* Sword on back */}
      <rect x="22" y="10" width="2" height="16" rx="0.5" fill="#c0c0c0" stroke="#888" strokeWidth="0.4" />
      <rect x="20" y="14" width="6" height="2" rx="0.5" fill="#d4a574" />
      {/* Legs */}
      <rect x="12" y="28" width="4" height="6" rx="1" fill={c.dark} />
      <rect x="17" y="28" width="4" height="6" rx="1" fill={c.dark} />
      <rect x="12" y="32" width="4" height="3" rx="1" fill="#5c3a1e" />
      <rect x="17" y="32" width="4" height="3" rx="1" fill="#5c3a1e" />
    </g>
  );
}

function CavalierBack({ c }: { c: Palette }) {
  return (
    <g>
      {/* Horse body from behind */}
      <ellipse cx="16" cy="28" rx="12" ry="6" fill="#8B6914" stroke="#6b5010" strokeWidth="0.8" />
      {/* Horse tail */}
      <path d="M4,26 Q1,30 3,34" stroke="#5c3a1e" strokeWidth="2" fill="none" />
      {/* Horse legs */}
      <rect x="6" y="32" width="3" height="4" rx="0.5" fill="#7a5c12" />
      <rect x="11" y="33" width="3" height="3" rx="0.5" fill="#7a5c12" />
      <rect x="18" y="33" width="3" height="3" rx="0.5" fill="#7a5c12" />
      <rect x="23" y="32" width="3" height="4" rx="0.5" fill="#7a5c12" />
      {/* Rider body */}
      <rect x="12" y="14" width="8" height="10" rx="2" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      {/* Back of head — hair */}
      <circle cx="16" cy="9" r="5" fill="#d4a060" stroke={c.outline} strokeWidth="0.8" />
      <path d="M11,8 Q16,4 21,8" fill={c.dark} />
      {/* Lance on back */}
      <line x1="22" y1="2" x2="22" y2="28" stroke="#c0c0c0" strokeWidth="1.5" />
      <polygon points="22,0 19,5 25,5" fill="#c0c0c0" />
    </g>
  );
}

function MageBack({ c }: { c: Palette }) {
  return (
    <g>
      {/* Robe from behind */}
      <polygon points="10,16 6,34 26,34 22,16" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      {/* Robe detail — back seam */}
      <line x1="16" y1="16" x2="16" y2="34" stroke={c.dark} strokeWidth="0.5" opacity="0.5" />
      {/* Back of pointed hat */}
      <polygon points="9,12 16,0 23,12" fill={c.dark} stroke={c.outline} strokeWidth="0.5" />
      <circle cx="16" cy="0" r="1.5" fill="#fbbf24" />
      {/* Back of head under hat */}
      <circle cx="16" cy="10" r="5.5" fill="#d4a060" stroke={c.outline} strokeWidth="0.8" />
      <ellipse cx="16" cy="14" rx="7" ry="3" fill={c.dark} />
      {/* Book strapped to back */}
      <rect x="18" y="18" width="5" height="7" rx="1" fill="#8B4513" stroke="#5c2e0a" strokeWidth="0.5" />
      <line x1="20.5" y1="18" x2="20.5" y2="25" stroke="#d4a574" strokeWidth="0.5" />
      {/* Feet */}
      <rect x="10" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
      <rect x="17" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
    </g>
  );
}

function FighterBack({ c }: { c: Palette }) {
  return (
    <g>
      {/* Broad back/torso */}
      <rect x="9" y="14" width="14" height="14" rx="2" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      {/* Belt */}
      <rect x="9" y="24" width="14" height="2" fill="#5c3a1e" />
      {/* Back of head — headband visible */}
      <circle cx="16" cy="9" r="6" fill="#c8a878" stroke={c.outline} strokeWidth="0.8" />
      <rect x="10" y="5" width="12" height="2.5" rx="1" fill={c.dark} />
      {/* Axe strapped across back */}
      <rect x="20" y="8" width="2" height="18" rx="0.5" fill="#8B6914" />
      <path d="M22,10 L28,8 L28,16 L22,14 Z" fill="#c0c0c0" stroke="#888" strokeWidth="0.5" />
      {/* Arms from behind */}
      <rect x="5" y="16" width="4" height="8" rx="2" fill="#c8a878" />
      <rect x="23" y="16" width="4" height="8" rx="2" fill="#c8a878" />
      {/* Legs */}
      <rect x="10" y="28" width="5" height="6" rx="1" fill={c.dark} />
      <rect x="17" y="28" width="5" height="6" rx="1" fill={c.dark} />
      <rect x="10" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
      <rect x="17" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
    </g>
  );
}

function SoldierBack({ c }: { c: Palette }) {
  return (
    <g>
      {/* Body armor from behind */}
      <rect x="10" y="14" width="12" height="14" rx="2" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      {/* Back armor plate detail */}
      <rect x="12" y="16" width="8" height="6" rx="1" fill={c.light} opacity="0.3" />
      {/* Back of helmet */}
      <circle cx="16" cy="9" r="5.5" fill={c.dark} stroke={c.outline} strokeWidth="0.8" />
      <path d="M10,9 Q10,2 16,2 Q22,2 22,9" fill={c.dark} stroke={c.outline} strokeWidth="0.5" />
      {/* Helmet crest from behind */}
      <rect x="15" y="2" width="2" height="8" rx="0.5" fill={c.dark} />
      {/* Shield on back */}
      <ellipse cx="16" cy="20" rx="5" ry="6" fill={c.dark} stroke={c.outline} strokeWidth="0.8" />
      <line x1="16" y1="15" x2="16" y2="25" stroke={c.light} strokeWidth="0.5" opacity="0.5" />
      <line x1="11" y1="20" x2="21" y2="20" stroke={c.light} strokeWidth="0.5" opacity="0.5" />
      {/* Spear on right side */}
      <line x1="26" y1="0" x2="26" y2="32" stroke="#8B6914" strokeWidth="1.5" />
      <polygon points="26,0 23,5 29,5" fill="#c0c0c0" />
      {/* Legs */}
      <rect x="11" y="28" width="4" height="6" rx="1" fill={c.dark} />
      <rect x="17" y="28" width="4" height="6" rx="1" fill={c.dark} />
      <rect x="11" y="32" width="4" height="3" rx="1" fill="#5c3a1e" />
      <rect x="17" y="32" width="4" height="3" rx="1" fill="#5c3a1e" />
    </g>
  );
}

function ClericBack({ c }: { c: Palette }) {
  return (
    <g>
      {/* Robe from behind */}
      <polygon points="10,16 7,34 25,34 22,16" fill="#f0e6d0" stroke={c.outline} strokeWidth="0.8" />
      {/* Back seam */}
      <line x1="16" y1="16" x2="16" y2="34" stroke={c.dark} strokeWidth="0.3" opacity="0.3" />
      {/* Sash */}
      <rect x="13" y="20" width="6" height="2" rx="0.5" fill={c.primary} />
      {/* Back of head — veil/hood */}
      <circle cx="16" cy="10" r="5.5" fill="#d4a060" stroke={c.outline} strokeWidth="0.8" />
      <path d="M10,12 Q10,3 16,3 Q22,3 22,12" fill="#e8dcc8" stroke={c.outline} strokeWidth="0.5" />
      {/* Staff on back */}
      <line x1="25" y1="4" x2="25" y2="32" stroke="#8b6914" strokeWidth="1.5" />
      <circle cx="25" cy="4" r="2.5" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
      <circle cx="25" cy="4" r="1" fill="white" opacity="0.6" />
      {/* Feet */}
      <rect x="10" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
      <rect x="17" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
    </g>
  );
}

function GenericBack({ c }: { c: Palette }) {
  return (
    <g>
      <rect x="10" y="14" width="12" height="14" rx="2" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      <circle cx="16" cy="9" r="5.5" fill="#d4a060" stroke={c.outline} strokeWidth="0.8" />
      <rect x="11" y="28" width="4" height="6" rx="1" fill={c.dark} />
      <rect x="17" y="28" width="4" height="6" rx="1" fill={c.dark} />
    </g>
  );
}
