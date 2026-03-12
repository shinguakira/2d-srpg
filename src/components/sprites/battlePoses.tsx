import type { Palette } from './classSprites';

/**
 * Battle-scene sprites rendered at side-facing angle (looking right by default).
 * Used in CombatAnimation — larger than grid sprites (viewBox 0 0 32 36).
 * Returns idle or attack pose JSX elements.
 */

export function renderBattlePose(
  classId: string,
  c: Palette,
  pose: 'idle' | 'attack'
) {
  switch (classId) {
    case 'lord':
      return pose === 'attack' ? <LordAttack c={c} /> : <LordIdle c={c} />;
    case 'cavalier':
      return pose === 'attack' ? <CavalierAttack c={c} /> : <CavalierIdle c={c} />;
    case 'mage':
      return pose === 'attack' ? <MageAttack c={c} /> : <MageIdle c={c} />;
    case 'fighter':
      return pose === 'attack' ? <FighterAttack c={c} /> : <FighterIdle c={c} />;
    case 'soldier':
      return pose === 'attack' ? <SoldierAttack c={c} /> : <SoldierIdle c={c} />;
    case 'cleric':
      return pose === 'attack' ? <ClericAttack c={c} /> : <ClericIdle c={c} />;
    default:
      return pose === 'attack' ? <GenericAttack c={c} /> : <GenericIdle c={c} />;
  }
}

type P = { c: Palette };

/* ===== LORD ===== */
function LordIdle({ c }: P) {
  return (
    <g>
      {/* Body */}
      <rect x="10" y="14" width="12" height="14" rx="2" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      {/* Head */}
      <circle cx="16" cy="9" r="6" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      <ellipse cx="16" cy="6.5" rx="6" ry="3.5" fill={c.dark} />
      {/* Crown */}
      <polygon points="11,6 13,2 16,5 19,2 21,6" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
      {/* Eye (side-facing — one eye visible) */}
      <rect x="18" y="9" width="2.5" height="2" rx="0.5" fill="#333" />
      {/* Sword held at side */}
      <g className="battle-weapon-arm">
        <rect x="23" y="8" width="2" height="18" rx="0.5" fill="#c0c0c0" stroke="#888" strokeWidth="0.4" />
        <rect x="21" y="14" width="6" height="2" rx="0.5" fill="#d4a574" />
      </g>
      {/* Legs */}
      <rect x="11" y="28" width="5" height="6" rx="1" fill={c.dark} />
      <rect x="16" y="28" width="5" height="6" rx="1" fill={c.dark} />
      <rect x="11" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
      <rect x="16" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
    </g>
  );
}

function LordAttack({ c }: P) {
  return (
    <g>
      {/* Body leaning forward */}
      <rect x="12" y="14" width="12" height="14" rx="2" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      {/* Head */}
      <circle cx="18" cy="9" r="6" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      <ellipse cx="18" cy="6.5" rx="6" ry="3.5" fill={c.dark} />
      <polygon points="13,6 15,2 18,5 21,2 23,6" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
      <rect x="20" y="9" width="2.5" height="2" rx="0.5" fill="#333" />
      {/* Sword extended forward */}
      <g className="battle-weapon-arm">
        <rect x="24" y="10" width="8" height="2" rx="0.5" fill="#c0c0c0" stroke="#888" strokeWidth="0.4" />
        <rect x="22" y="12" width="4" height="4" rx="0.5" fill="#d4a574" />
      </g>
      {/* Legs in lunge */}
      <rect x="8" y="28" width="5" height="6" rx="1" fill={c.dark} />
      <rect x="17" y="26" width="5" height="8" rx="1" fill={c.dark} />
      <rect x="8" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
      <rect x="17" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
    </g>
  );
}

/* ===== CAVALIER ===== */
function CavalierIdle({ c }: P) {
  return (
    <g>
      {/* Horse body */}
      <ellipse cx="16" cy="28" rx="12" ry="6" fill="#8B6914" stroke="#6b5010" strokeWidth="0.8" />
      <rect x="6" y="32" width="3" height="4" rx="0.5" fill="#7a5c12" />
      <rect x="23" y="32" width="3" height="4" rx="0.5" fill="#7a5c12" />
      {/* Horse head */}
      <ellipse cx="26" cy="22" rx="4" ry="5" fill="#8B6914" stroke="#6b5010" strokeWidth="0.8" />
      <circle cx="27" cy="20" r="1" fill="#333" />
      {/* Rider body */}
      <rect x="12" y="14" width="8" height="10" rx="2" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      {/* Rider head */}
      <circle cx="16" cy="9" r="5" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      <path d="M11,8 Q16,2 21,8" fill={c.dark} />
      <rect x="17" y="8" width="1.5" height="1.5" rx="0.3" fill="#333" />
      {/* Lance at side */}
      <g className="battle-weapon-arm">
        <line x1="22" y1="2" x2="22" y2="24" stroke="#c0c0c0" strokeWidth="1.5" />
        <polygon points="22,0 19,5 25,5" fill="#c0c0c0" />
      </g>
    </g>
  );
}

function CavalierAttack({ c }: P) {
  return (
    <g>
      {/* Horse body — leaning forward */}
      <ellipse cx="18" cy="28" rx="12" ry="6" fill="#8B6914" stroke="#6b5010" strokeWidth="0.8" />
      <rect x="8" y="32" width="3" height="4" rx="0.5" fill="#7a5c12" />
      <rect x="25" y="32" width="3" height="4" rx="0.5" fill="#7a5c12" />
      {/* Horse head extended */}
      <ellipse cx="29" cy="21" rx="4" ry="5" fill="#8B6914" stroke="#6b5010" strokeWidth="0.8" />
      <circle cx="30" cy="19" r="1" fill="#333" />
      {/* Rider */}
      <rect x="14" y="14" width="8" height="10" rx="2" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      <circle cx="18" cy="9" r="5" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      <path d="M13,8 Q18,2 23,8" fill={c.dark} />
      <rect x="19" y="8" width="1.5" height="1.5" rx="0.3" fill="#333" />
      {/* Lance thrust forward */}
      <g className="battle-weapon-arm">
        <line x1="22" y1="16" x2="32" y2="16" stroke="#c0c0c0" strokeWidth="1.5" />
        <polygon points="32,13 36,16 32,19" fill="#c0c0c0" />
      </g>
    </g>
  );
}

/* ===== MAGE ===== */
function MageIdle({ c }: P) {
  return (
    <g>
      {/* Robe */}
      <polygon points="10,16 6,34 26,34 22,16" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      {/* Head */}
      <circle cx="16" cy="10" r="5.5" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      {/* Hat */}
      <polygon points="9,10 16,0 23,10" fill={c.dark} stroke={c.outline} strokeWidth="0.5" />
      <circle cx="16" cy="0" r="1.5" fill="#fbbf24" />
      <rect x="17" y="9" width="2" height="1.5" rx="0.3" fill="#333" />
      {/* Book */}
      <rect x="4" y="20" width="6" height="8" rx="1" fill="#8B4513" stroke="#5c2e0a" strokeWidth="0.5" />
      {/* Casting hand at rest */}
      <g className="battle-weapon-arm">
        <circle cx="24" cy="20" r="2.5" fill="#fcd5a0" />
      </g>
      {/* Shoes */}
      <rect x="10" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
      <rect x="17" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
    </g>
  );
}

function MageAttack({ c }: P) {
  return (
    <g>
      {/* Robe — slight lean */}
      <polygon points="10,16 6,34 26,34 22,16" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      {/* Head */}
      <circle cx="16" cy="10" r="5.5" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      <polygon points="9,10 16,0 23,10" fill={c.dark} stroke={c.outline} strokeWidth="0.5" />
      <circle cx="16" cy="0" r="1.5" fill="#fbbf24" />
      <rect x="17" y="9" width="2" height="1.5" rx="0.3" fill="#333" />
      {/* Book open */}
      <rect x="4" y="18" width="7" height="9" rx="1" fill="#8B4513" stroke="#5c2e0a" strokeWidth="0.5" />
      <line x1="7.5" y1="18" x2="7.5" y2="27" stroke="#d4a574" strokeWidth="0.5" />
      {/* Casting hand raised with magic glow */}
      <g className="battle-weapon-arm">
        <circle cx="26" cy="12" r="2.5" fill="#fcd5a0" />
        <circle cx="26" cy="12" r="5" fill="rgba(147,197,253,0.4)" className="battle-pose__magic-glow" />
        <circle cx="26" cy="12" r="2" fill="rgba(255,255,255,0.6)" className="battle-pose__magic-core" />
      </g>
      <rect x="10" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
      <rect x="17" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
    </g>
  );
}

/* ===== FIGHTER ===== */
function FighterIdle({ c }: P) {
  return (
    <g>
      {/* Body */}
      <rect x="9" y="14" width="14" height="14" rx="2" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      <rect x="9" y="24" width="14" height="2" fill="#5c3a1e" />
      {/* Head */}
      <circle cx="16" cy="9" r="6" fill="#e8c090" stroke={c.outline} strokeWidth="0.8" />
      <line x1="20" y1="7" x2="17" y2="8" stroke="#333" strokeWidth="1.2" />
      <rect x="17" y="8.5" width="2" height="2" rx="0.3" fill="#333" />
      <rect x="10" y="5" width="12" height="2.5" rx="1" fill={c.dark} />
      {/* Axe at rest on shoulder */}
      <g className="battle-weapon-arm">
        <rect x="24" y="6" width="2" height="16" rx="0.5" fill="#8B6914" />
        <path d="M26,8 L32,6 L32,14 L26,12 Z" fill="#c0c0c0" stroke="#888" strokeWidth="0.5" />
      </g>
      {/* Arms */}
      <rect x="5" y="16" width="4" height="8" rx="2" fill="#e8c090" />
      {/* Legs */}
      <rect x="10" y="28" width="5" height="6" rx="1" fill={c.dark} />
      <rect x="17" y="28" width="5" height="6" rx="1" fill={c.dark} />
      <rect x="10" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
      <rect x="17" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
    </g>
  );
}

function FighterAttack({ c }: P) {
  return (
    <g>
      {/* Body — leaning forward */}
      <rect x="11" y="14" width="14" height="14" rx="2" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      <rect x="11" y="24" width="14" height="2" fill="#5c3a1e" />
      {/* Head */}
      <circle cx="18" cy="9" r="6" fill="#e8c090" stroke={c.outline} strokeWidth="0.8" />
      <line x1="22" y1="7" x2="19" y2="8" stroke="#333" strokeWidth="1.2" />
      <rect x="19" y="8.5" width="2" height="2" rx="0.3" fill="#333" />
      <rect x="12" y="5" width="12" height="2.5" rx="1" fill={c.dark} />
      {/* Axe swinging down */}
      <g className="battle-weapon-arm">
        <rect x="26" y="4" width="2" height="14" rx="0.5" fill="#8B6914" transform="rotate(30, 27, 11)" />
        <path d="M28,4 L34,2 L34,10 L28,8 Z" fill="#c0c0c0" stroke="#888" strokeWidth="0.5" transform="rotate(30, 27, 7)" />
      </g>
      {/* Arms */}
      <rect x="24" y="14" width="4" height="6" rx="2" fill="#e8c090" />
      {/* Legs in lunge */}
      <rect x="7" y="28" width="5" height="6" rx="1" fill={c.dark} />
      <rect x="18" y="26" width="5" height="8" rx="1" fill={c.dark} />
      <rect x="7" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
      <rect x="18" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
    </g>
  );
}

/* ===== SOLDIER ===== */
function SoldierIdle({ c }: P) {
  return (
    <g>
      {/* Body */}
      <rect x="10" y="14" width="12" height="14" rx="2" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      <rect x="12" y="16" width="8" height="6" rx="1" fill={c.light} opacity="0.4" />
      {/* Head */}
      <circle cx="16" cy="9" r="5.5" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      <path d="M10,9 Q10,2 16,2 Q22,2 22,9" fill={c.dark} stroke={c.outline} strokeWidth="0.5" />
      <rect x="15" y="5" width="2" height="5" rx="0.5" fill={c.dark} />
      <rect x="17.5" y="8" width="2" height="1.5" rx="0.3" fill="#333" />
      {/* Shield on left */}
      <ellipse cx="7" cy="22" rx="5" ry="7" fill={c.dark} stroke={c.outline} strokeWidth="0.8" />
      {/* Spear held upright */}
      <g className="battle-weapon-arm">
        <line x1="26" y1="0" x2="26" y2="32" stroke="#8B6914" strokeWidth="1.5" />
        <polygon points="26,0 23,5 29,5" fill="#c0c0c0" />
      </g>
      {/* Legs */}
      <rect x="11" y="28" width="4" height="6" rx="1" fill={c.dark} />
      <rect x="17" y="28" width="4" height="6" rx="1" fill={c.dark} />
      <rect x="11" y="32" width="4" height="3" rx="1" fill="#5c3a1e" />
      <rect x="17" y="32" width="4" height="3" rx="1" fill="#5c3a1e" />
    </g>
  );
}

function SoldierAttack({ c }: P) {
  return (
    <g>
      {/* Body — forward lean */}
      <rect x="12" y="14" width="12" height="14" rx="2" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      <rect x="14" y="16" width="8" height="6" rx="1" fill={c.light} opacity="0.4" />
      {/* Head */}
      <circle cx="18" cy="9" r="5.5" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      <path d="M12,9 Q12,2 18,2 Q24,2 24,9" fill={c.dark} stroke={c.outline} strokeWidth="0.5" />
      <rect x="17" y="5" width="2" height="5" rx="0.5" fill={c.dark} />
      <rect x="19.5" y="8" width="2" height="1.5" rx="0.3" fill="#333" />
      {/* Shield forward */}
      <ellipse cx="9" cy="20" rx="5" ry="7" fill={c.dark} stroke={c.outline} strokeWidth="0.8" />
      {/* Spear thrusting forward */}
      <g className="battle-weapon-arm">
        <line x1="22" y1="16" x2="34" y2="16" stroke="#8B6914" strokeWidth="1.5" />
        <polygon points="34,13 38,16 34,19" fill="#c0c0c0" />
      </g>
      {/* Legs in stride */}
      <rect x="8" y="28" width="4" height="6" rx="1" fill={c.dark} />
      <rect x="18" y="26" width="4" height="8" rx="1" fill={c.dark} />
      <rect x="8" y="32" width="4" height="3" rx="1" fill="#5c3a1e" />
      <rect x="18" y="32" width="4" height="3" rx="1" fill="#5c3a1e" />
    </g>
  );
}

/* ===== CLERIC ===== */
function ClericIdle({ c }: P) {
  return (
    <g>
      {/* Robe */}
      <polygon points="10,16 7,34 25,34 22,16" fill="#f0e6d0" stroke={c.outline} strokeWidth="0.8" />
      <rect x="13" y="20" width="6" height="2" rx="0.5" fill={c.primary} />
      {/* Head */}
      <circle cx="16" cy="10" r="5.5" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      <path d="M10,12 Q10,3 16,3 Q22,3 22,12" fill="#e8dcc8" stroke={c.outline} strokeWidth="0.5" />
      <rect x="17" y="9" width="2" height="1.5" rx="0.3" fill="#333" />
      {/* Staff at side */}
      <g className="battle-weapon-arm">
        <line x1="25" y1="4" x2="25" y2="32" stroke="#8b6914" strokeWidth="1.5" />
        <circle cx="25" cy="4" r="2.5" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
        <circle cx="25" cy="4" r="1" fill="white" opacity="0.6" />
      </g>
      {/* Book */}
      <rect x="4" y="20" width="5" height="7" rx="1" fill="#8B4513" stroke="#5c2e0a" strokeWidth="0.5" />
      <rect x="10" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
      <rect x="17" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
    </g>
  );
}

function ClericAttack({ c }: P) {
  return (
    <g>
      {/* Robe */}
      <polygon points="10,16 7,34 25,34 22,16" fill="#f0e6d0" stroke={c.outline} strokeWidth="0.8" />
      <rect x="13" y="20" width="6" height="2" rx="0.5" fill={c.primary} />
      {/* Head */}
      <circle cx="16" cy="10" r="5.5" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      <path d="M10,12 Q10,3 16,3 Q22,3 22,12" fill="#e8dcc8" stroke={c.outline} strokeWidth="0.5" />
      <rect x="17" y="9" width="2" height="1.5" rx="0.3" fill="#333" />
      {/* Staff raised with glow */}
      <g className="battle-weapon-arm">
        <line x1="25" y1="0" x2="25" y2="28" stroke="#8b6914" strokeWidth="1.5" />
        <circle cx="25" cy="0" r="3.5" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
        <circle cx="25" cy="0" r="5" fill="rgba(251,191,36,0.3)" className="battle-pose__magic-glow" />
        <circle cx="25" cy="0" r="1.5" fill="white" opacity="0.8" />
      </g>
      {/* Book open */}
      <rect x="4" y="18" width="6" height="8" rx="1" fill="#8B4513" stroke="#5c2e0a" strokeWidth="0.5" />
      <line x1="7" y1="18" x2="7" y2="26" stroke="#d4a574" strokeWidth="0.5" />
      <rect x="10" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
      <rect x="17" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
    </g>
  );
}

/* ===== GENERIC ===== */
function GenericIdle({ c }: P) {
  return (
    <g>
      <rect x="10" y="14" width="12" height="14" rx="2" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      <circle cx="16" cy="9" r="5.5" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      <rect x="17" y="8" width="2" height="2" rx="0.3" fill="#333" />
      <g className="battle-weapon-arm">
        <rect x="23" y="14" width="2" height="12" rx="0.5" fill="#c0c0c0" />
      </g>
      <rect x="11" y="28" width="4" height="6" rx="1" fill={c.dark} />
      <rect x="17" y="28" width="4" height="6" rx="1" fill={c.dark} />
    </g>
  );
}

function GenericAttack({ c }: P) {
  return (
    <g>
      <rect x="12" y="14" width="12" height="14" rx="2" fill={c.primary} stroke={c.outline} strokeWidth="0.8" />
      <circle cx="18" cy="9" r="5.5" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      <rect x="19" y="8" width="2" height="2" rx="0.3" fill="#333" />
      <g className="battle-weapon-arm">
        <rect x="24" y="10" width="8" height="2" rx="0.5" fill="#c0c0c0" />
      </g>
      <rect x="8" y="28" width="4" height="6" rx="1" fill={c.dark} />
      <rect x="18" y="26" width="4" height="8" rx="1" fill={c.dark} />
    </g>
  );
}
