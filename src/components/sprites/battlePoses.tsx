import type { Palette } from './classSprites';

/**
 * Battle-scene sprites rendered at side-facing angle (looking right by default).
 * Used in CombatAnimation — larger than grid sprites (viewBox 0 0 32 36).
 * Returns idle or attack pose JSX elements.
 *
 * Frame-based animation:
 *   idle  → 4 frames (breathing cycle): 0=neutral, 1=inhale, 2=peak, 3=exhale
 *   attack → 3 frames: 0=windup, 1=charge, 2=strike
 */

export function renderBattlePose(
  classId: string,
  c: Palette,
  pose: 'idle' | 'attack',
  weaponId?: string,
  frame?: number,
) {
  switch (classId) {
    case 'lord':
      return pose === 'attack' ? (
        <LordAttack c={c} weaponId={weaponId} frame={frame} />
      ) : (
        <LordIdle c={c} weaponId={weaponId} frame={frame} />
      );
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

type P = { c: Palette; weaponId?: string; frame?: number };

/* ===== Weapon-specific sword rendering for Lord ===== */
function LordSwordIdle({ weaponId }: { weaponId?: string }) {
  switch (weaponId) {
    case 'rapier':
      return (
        <g className="battle-weapon-arm">
          {/* Rapier — thin elegant blade + cup guard */}
          <rect
            x="23.2"
            y="4"
            width="1.2"
            height="20"
            rx="0.2"
            fill="#d8d8e8"
            stroke="#aaa"
            strokeWidth="0.3"
          />
          <line
            x1="23.5"
            y1="5"
            x2="23.5"
            y2="23"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.3"
          />
          <ellipse
            cx="23.8"
            cy="14"
            rx="3"
            ry="1.8"
            fill="#c0c0c0"
            stroke="#888"
            strokeWidth="0.3"
          />
          <path d="M21,14 Q22,16 23,14.5" fill="none" stroke="#fbbf24" strokeWidth="0.4" />
          <circle cx="23.8" cy="25" r="1.2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.3" />
        </g>
      );
    case 'memory_blade':
      return (
        <g className="battle-weapon-arm">
          {/* Memory Blade — ethereal glowing blue */}
          <rect
            x="22.5"
            y="6"
            width="2"
            height="18"
            rx="0.3"
            fill="rgba(147,197,253,0.6)"
            stroke="#60a5fa"
            strokeWidth="0.6"
            className="memory-blade-glow"
          />
          <rect x="22.8" y="7" width="1.4" height="16" rx="0.2" fill="rgba(255,255,255,0.3)" />
          <rect
            x="20"
            y="14"
            width="7"
            height="2.5"
            rx="0.8"
            fill="#3b82f6"
            stroke="#1d4ed8"
            strokeWidth="0.3"
          />
          {/* Floating particles */}
          <circle
            cx="22"
            cy="10"
            r="0.6"
            fill="#93c5fd"
            opacity="0.5"
            className="memory-blade-particle"
          />
          <circle
            cx="25.5"
            cy="18"
            r="0.5"
            fill="#93c5fd"
            opacity="0.4"
            className="memory-blade-particle"
          />
          <circle
            cx="21.5"
            cy="22"
            r="0.4"
            fill="#bfdbfe"
            opacity="0.3"
            className="memory-blade-particle"
          />
        </g>
      );
    default: // iron_sword, slim_sword, steel_sword, etc.
      return (
        <g className="battle-weapon-arm">
          <rect
            x="22.5"
            y="6"
            width="2"
            height="18"
            rx="0.3"
            fill="#b8b8c0"
            stroke="#888"
            strokeWidth="0.4"
          />
          <line x1="23" y1="7" x2="23" y2="23" stroke="#e0e0e0" strokeWidth="0.4" opacity="0.5" />
          <rect
            x="20"
            y="14"
            width="7"
            height="2.5"
            rx="0.8"
            fill="#d4a574"
            stroke="#a07850"
            strokeWidth="0.3"
          />
          <circle cx="23.5" cy="25" r="1" fill="#d4a574" stroke="#a07850" strokeWidth="0.3" />
        </g>
      );
  }
}

function LordSwordAttack({ weaponId }: { weaponId?: string }) {
  switch (weaponId) {
    case 'rapier':
      return (
        <g className="battle-weapon-arm">
          {/* Rapier thrust — straight horizontal pierce */}
          <rect
            x="24"
            y="10.4"
            width="10"
            height="1.2"
            rx="0.2"
            fill="#d8d8e8"
            stroke="#aaa"
            strokeWidth="0.3"
          />
          <line x1="25" y1="11" x2="34" y2="11" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
          <ellipse
            cx="24"
            cy="12.5"
            rx="2.5"
            ry="1.5"
            fill="#c0c0c0"
            stroke="#888"
            strokeWidth="0.3"
          />
          <path d="M22,13 Q23,15 24,12.8" fill="none" stroke="#fbbf24" strokeWidth="0.4" />
        </g>
      );
    case 'memory_blade':
      return (
        <g className="battle-weapon-arm">
          {/* Memory Blade — diagonal forward with afterimage trails */}
          <rect
            x="24"
            y="2"
            width="2"
            height="14"
            rx="0.3"
            fill="rgba(96,165,250,0.3)"
            stroke="rgba(96,165,250,0.2)"
            strokeWidth="0.4"
            transform="rotate(-30, 25, 9)"
          />
          <rect
            x="24"
            y="1"
            width="2"
            height="14"
            rx="0.3"
            fill="rgba(147,197,253,0.4)"
            stroke="rgba(96,165,250,0.3)"
            strokeWidth="0.4"
            transform="rotate(-25, 25, 8)"
          />
          <rect
            x="24"
            y="0"
            width="2"
            height="14"
            rx="0.3"
            fill="rgba(147,197,253,0.7)"
            stroke="#60a5fa"
            strokeWidth="0.6"
            transform="rotate(-20, 25, 7)"
            className="memory-blade-glow"
          />
          <rect
            x="22"
            y="12"
            width="5"
            height="3"
            rx="0.8"
            fill="#3b82f6"
            stroke="#1d4ed8"
            strokeWidth="0.3"
          />
          <circle
            cx="26"
            cy="4"
            r="0.5"
            fill="#93c5fd"
            opacity="0.6"
            className="memory-blade-particle"
          />
          <circle
            cx="28"
            cy="8"
            r="0.4"
            fill="#bfdbfe"
            opacity="0.4"
            className="memory-blade-particle"
          />
        </g>
      );
    default:
      return (
        <g className="battle-weapon-arm">
          {/* Sword extended diagonally forward-up */}
          <rect
            x="24"
            y="2"
            width="2"
            height="14"
            rx="0.3"
            fill="#b8b8c0"
            stroke="#888"
            strokeWidth="0.4"
            transform="rotate(-25, 25, 9)"
          />
          <line
            x1="24.5"
            y1="3"
            x2="24.5"
            y2="15"
            stroke="#e0e0e0"
            strokeWidth="0.4"
            opacity="0.5"
            transform="rotate(-25, 25, 9)"
          />
          <rect
            x="22"
            y="12"
            width="5"
            height="3"
            rx="0.8"
            fill="#d4a574"
            stroke="#a07850"
            strokeWidth="0.3"
          />
        </g>
      );
  }
}

/* ===== LORD — FRAME-BASED ANIMATION ===== */

/**
 * Lord idle: 4 breathing frames.
 * Upper body group shifts vertically (breathing), cape flutters, hair sways.
 * Legs stay grounded for stability.
 */
function LordIdle({ c, weaponId, frame = 0 }: P) {
  const f = (frame ?? 0) % 4;
  // Per-frame offsets
  const bodyY = [0, -0.7, -1.0, -0.3][f]; // breathing rise/fall
  const capeX = [0, 0.4, 0.8, 0.2][f]; // cape flutter X
  const capeY = [0, -0.2, -0.4, -0.1][f]; // cape flutter Y
  const hairX = [0, 0.2, 0.4, 0.1][f]; // subtle hair sway
  const armRot = [0, -1, -1.5, -0.5][f]; // weapon arm tilt

  return (
    <g>
      {/* Cape with per-frame flutter */}
      <g transform={`translate(${capeX}, ${capeY})`}>
        <path d="M8,16 Q6,26 7,34 L14,32 Q12,24 10,16" fill={c.dark} opacity="0.5" />
        <path d="M9,17 Q7,25 8,31 L12,30" fill={c.light} opacity="0.08" />
      </g>

      {/* Upper body — breathing group */}
      <g transform={`translate(0, ${bodyY})`}>
        {/* Shoulder pauldrons */}
        <ellipse
          cx="10"
          cy="16"
          rx="2.5"
          ry="1.8"
          fill={c.dark}
          stroke={c.outline}
          strokeWidth="0.4"
        />
        <ellipse
          cx="22"
          cy="16"
          rx="2.5"
          ry="1.8"
          fill={c.dark}
          stroke={c.outline}
          strokeWidth="0.4"
        />
        <path d="M7.5,16 Q10,14.5 12.5,16" fill="none" stroke="#fbbf24" strokeWidth="0.3" />
        {/* Torso */}
        <rect
          x="10"
          y="14"
          width="12"
          height="14"
          rx="2"
          fill={c.primary}
          stroke={c.outline}
          strokeWidth="0.8"
        />
        <path d="M12,16 L16,15 L20,16 L20,20 L16,21 L12,20 Z" fill={c.light} opacity="0.2" />
        <line x1="11" y1="15" x2="21" y2="15" stroke="#fbbf24" strokeWidth="0.5" />
        {/* Gold belt */}
        <rect x="10" y="25" width="12" height="2" rx="0.5" fill="#d97706" />
        <rect x="14.5" y="25" width="3" height="2" rx="0.3" fill="#fbbf24" />
        {/* Arm + gauntlet holding sword */}
        <g transform={`rotate(${armRot}, 22, 18)`}>
          <rect x="21" y="16" width="3" height="5" rx="1" fill="#fcd5a0" />
          <rect x="21" y="19" width="3" height="4" rx="0.5" fill={c.dark} />
        </g>

        {/* Head group with hair sway */}
        <g transform={`translate(${hairX}, 0)`}>
          <circle cx="16" cy="9" r="6" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
          {/* Hair — swept with profile bangs */}
          <path
            d="M10,10 Q10,3 14,2 L16,4 L18,2 Q22,4 22,8 L21,10 L20,7 Q17,5 13,7 L11,10 Z"
            fill={c.dark}
          />
          {/* Crown — 3 peaks */}
          <polygon
            points="10.5,5.5 12.5,1 14.5,4 16,0.5 17.5,4 19.5,1 21.5,5.5"
            fill="#fbbf24"
            stroke="#b45309"
            strokeWidth="0.5"
          />
          <circle cx="16" cy="3" r="0.7" fill="#ef4444" />
          {/* Eye with highlight */}
          <rect x="18" y="9" width="2.5" height="2" rx="0.5" fill="#333" />
          <rect x="18.3" y="9" width="0.8" height="0.8" rx="0.2" fill="#fff" opacity="0.6" />
          {/* Eyebrow */}
          <line x1="18" y1="8" x2="20.5" y2="7.5" stroke="#333" strokeWidth="0.6" />
          {/* Jaw line */}
          <line x1="19" y1="12" x2="20" y2="10" stroke="#e0b888" strokeWidth="0.3" />
        </g>

        {/* Weapon — conditional */}
        <LordSwordIdle weaponId={weaponId} />
      </g>

      {/* Legs + boots — grounded, static */}
      <rect x="11" y="28" width="5" height="6" rx="1" fill={c.dark} />
      <rect x="16" y="28" width="5" height="6" rx="1" fill={c.dark} />
      <rect x="11" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
      <rect x="16" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
      <line x1="11" y1="32" x2="16" y2="32" stroke="#7a5230" strokeWidth="0.4" />
      <line x1="16" y1="32" x2="21" y2="32" stroke="#7a5230" strokeWidth="0.4" />
    </g>
  );
}

/**
 * Lord attack: 3 sub-frames.
 *   0 = windup  (crouch, weapon pulled back)
 *   1 = charge  (running forward, weapon at ready)
 *   2 = strike  (full lunge, weapon extended)
 */
function LordAttack({ c, weaponId, frame = 2 }: P) {
  const f = Math.min(frame ?? 2, 2);
  if (f === 0) return <LordWindup c={c} weaponId={weaponId} />;
  if (f === 1) return <LordCharge c={c} weaponId={weaponId} />;
  return <LordStrike c={c} weaponId={weaponId} />;
}

/** Attack frame 0 — anticipation: crouched back, weapon raised behind head */
function LordWindup({ c, weaponId }: P) {
  return (
    <g>
      {/* Cape — hanging, character hasn't moved yet */}
      <path d="M7,17 Q5,27 6,35 L13,33 Q11,25 9,17" fill={c.dark} opacity="0.5" />
      {/* Pauldrons */}
      <ellipse
        cx="10"
        cy="17"
        rx="2.5"
        ry="1.8"
        fill={c.dark}
        stroke={c.outline}
        strokeWidth="0.4"
      />
      <ellipse
        cx="21"
        cy="17"
        rx="2.5"
        ry="1.8"
        fill={c.dark}
        stroke={c.outline}
        strokeWidth="0.4"
      />
      {/* Body — crouched slightly */}
      <rect
        x="10"
        y="15"
        width="12"
        height="14"
        rx="2"
        fill={c.primary}
        stroke={c.outline}
        strokeWidth="0.8"
      />
      <path d="M12,17 L16,16 L20,17 L20,21 L16,22 L12,21 Z" fill={c.light} opacity="0.2" />
      <line x1="11" y1="16" x2="21" y2="16" stroke="#fbbf24" strokeWidth="0.5" />
      {/* Belt */}
      <rect x="10" y="26" width="12" height="2" rx="0.5" fill="#d97706" />
      <rect x="14.5" y="26" width="3" height="2" rx="0.3" fill="#fbbf24" />
      {/* Arm pulled back holding weapon high */}
      <rect x="8" y="12" width="3" height="5" rx="1" fill="#fcd5a0" />
      <rect x="8" y="15" width="3" height="3" rx="0.5" fill={c.dark} />
      {/* Head — intense forward look */}
      <circle cx="15" cy="10" r="6" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      <path
        d="M9,10 Q9,3 13,2 L15,4 L17,2 Q21,4 21,8 L20,10 L19,7 Q16,5 12,7 L10,10 Z"
        fill={c.dark}
      />
      <polygon
        points="9.5,5.5 11.5,1 13.5,4 15,0.5 16.5,4 18.5,1 20.5,5.5"
        fill="#fbbf24"
        stroke="#b45309"
        strokeWidth="0.5"
      />
      <circle cx="15" cy="3" r="0.7" fill="#ef4444" />
      <rect x="17" y="9" width="2.5" height="2" rx="0.5" fill="#333" />
      <rect x="17.3" y="9" width="0.8" height="0.8" rx="0.2" fill="#fff" opacity="0.6" />
      {/* Furrowed brow */}
      <line x1="17" y1="7.8" x2="19.8" y2="7" stroke="#333" strokeWidth="0.7" />
      <line x1="18" y1="12" x2="19" y2="10" stroke="#e0b888" strokeWidth="0.3" />
      {/* Weapon behind — pulled back over shoulder */}
      <g transform="translate(-14, -3) rotate(40, 22, 14)">
        <LordSwordIdle weaponId={weaponId} />
      </g>
      {/* Legs — crouching, knees bent */}
      <rect x="11" y="29" width="5" height="5" rx="1" fill={c.dark} />
      <rect x="16" y="28" width="5" height="6" rx="1" fill={c.dark} />
      <rect x="11" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
      <rect x="16" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
    </g>
  );
}

/** Attack frame 1 — charging forward: running stride, weapon at ready */
function LordCharge({ c, weaponId }: P) {
  return (
    <g>
      {/* Cape — streaming behind from speed */}
      <path d="M2,15 Q-1,25 1,35 L10,32 Q7,23 4,15" fill={c.dark} opacity="0.55" />
      <path d="M3,16 Q1,24 3,32 L8,30" fill={c.primary} opacity="0.08" />
      {/* Pauldrons */}
      <ellipse
        cx="12"
        cy="16"
        rx="2.5"
        ry="1.8"
        fill={c.dark}
        stroke={c.outline}
        strokeWidth="0.4"
      />
      <ellipse
        cx="23"
        cy="16"
        rx="2.5"
        ry="1.8"
        fill={c.dark}
        stroke={c.outline}
        strokeWidth="0.4"
      />
      {/* Body — leaning forward in run */}
      <rect
        x="12"
        y="14"
        width="12"
        height="14"
        rx="2"
        fill={c.primary}
        stroke={c.outline}
        strokeWidth="0.8"
      />
      <path d="M14,16 L18,15 L22,16 L22,20 L18,21 L14,20 Z" fill={c.light} opacity="0.2" />
      <line x1="13" y1="15" x2="23" y2="15" stroke="#fbbf24" strokeWidth="0.5" />
      {/* Belt */}
      <rect x="12" y="25" width="12" height="2" rx="0.5" fill="#d97706" />
      {/* Arm forward with gauntlet */}
      <rect x="23" y="14" width="3" height="5" rx="1" fill="#fcd5a0" />
      <rect x="23" y="17" width="3" height="3" rx="0.5" fill={c.dark} />
      {/* Head — forward lean, determined */}
      <circle cx="17" cy="9" r="6" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      <path
        d="M11,10 Q11,3 15,2 L17,4 L19,2 Q23,4 23,8 L22,10 L21,7 Q18,5 14,7 L12,10 Z"
        fill={c.dark}
      />
      <polygon
        points="11.5,5.5 13.5,1 15.5,4 17,0.5 18.5,4 20.5,1 22.5,5.5"
        fill="#fbbf24"
        stroke="#b45309"
        strokeWidth="0.5"
      />
      <circle cx="17" cy="3" r="0.7" fill="#ef4444" />
      <rect x="19" y="9" width="2.5" height="2" rx="0.5" fill="#333" />
      <rect x="19.3" y="9" width="0.8" height="0.8" rx="0.2" fill="#fff" opacity="0.6" />
      <line x1="19" y1="8" x2="21.5" y2="7.5" stroke="#333" strokeWidth="0.6" />
      {/* Weapon at side — angled forward, ready to swing */}
      <g transform="translate(0, 2) rotate(-15, 24, 14)">
        <LordSwordIdle weaponId={weaponId} />
      </g>
      {/* Legs — running stride */}
      <rect
        x="8"
        y="27"
        width="4"
        height="8"
        rx="1"
        fill={c.dark}
        transform="rotate(-12, 10, 31)"
      />
      <rect
        x="20"
        y="24"
        width="4"
        height="10"
        rx="1"
        fill={c.dark}
        transform="rotate(5, 22, 29)"
      />
      <rect x="7" y="33" width="5" height="3" rx="1" fill="#5c3a1e" />
      <rect x="20" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
      {/* Motion lines */}
      <line x1="0" y1="20" x2="4" y2="20" stroke="#fff" strokeWidth="0.4" opacity="0.2" />
      <line x1="-1" y1="24" x2="3" y2="24" stroke="#fff" strokeWidth="0.3" opacity="0.15" />
    </g>
  );
}

/** Attack frame 2 — full strike: deep lunge, weapon extended, speed lines */
function LordStrike({ c, weaponId }: P) {
  return (
    <g>
      {/* Cape flaring behind from impact */}
      <path d="M4,14 Q1,24 3,35 L12,31 Q10,22 7,14" fill={c.dark} opacity="0.55" />
      {/* Pauldrons */}
      <ellipse
        cx="12"
        cy="16"
        rx="2.5"
        ry="1.8"
        fill={c.dark}
        stroke={c.outline}
        strokeWidth="0.4"
      />
      <ellipse
        cx="24"
        cy="16"
        rx="2.5"
        ry="1.8"
        fill={c.dark}
        stroke={c.outline}
        strokeWidth="0.4"
      />
      {/* Body leaning forward */}
      <rect
        x="12"
        y="14"
        width="12"
        height="14"
        rx="2"
        fill={c.primary}
        stroke={c.outline}
        strokeWidth="0.8"
      />
      <path d="M14,16 L18,15 L22,16 L22,20 L18,21 L14,20 Z" fill={c.light} opacity="0.2" />
      <line x1="13" y1="15" x2="23" y2="15" stroke="#fbbf24" strokeWidth="0.5" />
      {/* Gold belt */}
      <rect x="12" y="25" width="12" height="2" rx="0.5" fill="#d97706" />
      {/* Arm extended with gauntlet */}
      <rect x="23" y="12" width="3" height="5" rx="1" fill="#fcd5a0" />
      <rect x="23" y="14" width="3" height="3" rx="0.5" fill={c.dark} />
      {/* Head — forward lean */}
      <circle cx="18" cy="9" r="6" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      <path
        d="M12,10 Q12,3 16,2 L18,4 L20,2 Q24,4 24,8 L23,10 L22,7 Q19,5 15,7 L13,10 Z"
        fill={c.dark}
      />
      <polygon
        points="12.5,5.5 14.5,1 16.5,4 18,0.5 19.5,4 21.5,1 23.5,5.5"
        fill="#fbbf24"
        stroke="#b45309"
        strokeWidth="0.5"
      />
      <circle cx="18" cy="3" r="0.7" fill="#ef4444" />
      <rect x="20" y="9" width="2.5" height="2" rx="0.5" fill="#333" />
      <rect x="20.3" y="9" width="0.8" height="0.8" rx="0.2" fill="#fff" opacity="0.6" />
      <line x1="20" y1="8" x2="22.5" y2="7.5" stroke="#333" strokeWidth="0.6" />
      {/* Speed lines */}
      <line x1="28" y1="8" x2="32" y2="6" stroke="#fff" strokeWidth="0.5" opacity="0.3" />
      <line x1="29" y1="12" x2="32" y2="11" stroke="#fff" strokeWidth="0.4" opacity="0.2" />
      <line x1="28" y1="16" x2="31" y2="15" stroke="#fff" strokeWidth="0.3" opacity="0.15" />
      {/* Weapon — conditional, full extension */}
      <LordSwordAttack weaponId={weaponId} />
      {/* Legs in deep lunge */}
      <rect x="6" y="28" width="5" height="7" rx="1" fill={c.dark} />
      <rect x="18" y="24" width="5" height="10" rx="1" fill={c.dark} />
      <rect x="6" y="33" width="5" height="3" rx="1" fill="#5c3a1e" />
      <rect x="18" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
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
      <rect
        x="12"
        y="14"
        width="8"
        height="10"
        rx="2"
        fill={c.primary}
        stroke={c.outline}
        strokeWidth="0.8"
      />
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
      <rect
        x="14"
        y="14"
        width="8"
        height="10"
        rx="2"
        fill={c.primary}
        stroke={c.outline}
        strokeWidth="0.8"
      />
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
      <polygon
        points="10,16 6,34 26,34 22,16"
        fill={c.primary}
        stroke={c.outline}
        strokeWidth="0.8"
      />
      {/* Head */}
      <circle cx="16" cy="10" r="5.5" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      {/* Hat */}
      <polygon points="9,10 16,0 23,10" fill={c.dark} stroke={c.outline} strokeWidth="0.5" />
      <circle cx="16" cy="0" r="1.5" fill="#fbbf24" />
      <rect x="17" y="9" width="2" height="1.5" rx="0.3" fill="#333" />
      {/* Book */}
      <rect
        x="4"
        y="20"
        width="6"
        height="8"
        rx="1"
        fill="#8B4513"
        stroke="#5c2e0a"
        strokeWidth="0.5"
      />
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
      <polygon
        points="10,16 6,34 26,34 22,16"
        fill={c.primary}
        stroke={c.outline}
        strokeWidth="0.8"
      />
      {/* Head */}
      <circle cx="16" cy="10" r="5.5" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      <polygon points="9,10 16,0 23,10" fill={c.dark} stroke={c.outline} strokeWidth="0.5" />
      <circle cx="16" cy="0" r="1.5" fill="#fbbf24" />
      <rect x="17" y="9" width="2" height="1.5" rx="0.3" fill="#333" />
      {/* Book open */}
      <rect
        x="4"
        y="18"
        width="7"
        height="9"
        rx="1"
        fill="#8B4513"
        stroke="#5c2e0a"
        strokeWidth="0.5"
      />
      <line x1="7.5" y1="18" x2="7.5" y2="27" stroke="#d4a574" strokeWidth="0.5" />
      {/* Casting hand raised with magic glow */}
      <g className="battle-weapon-arm">
        <circle cx="26" cy="12" r="2.5" fill="#fcd5a0" />
        <circle
          cx="26"
          cy="12"
          r="5"
          fill="rgba(147,197,253,0.4)"
          className="battle-pose__magic-glow"
        />
        <circle
          cx="26"
          cy="12"
          r="2"
          fill="rgba(255,255,255,0.6)"
          className="battle-pose__magic-core"
        />
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
      <rect
        x="9"
        y="14"
        width="14"
        height="14"
        rx="2"
        fill={c.primary}
        stroke={c.outline}
        strokeWidth="0.8"
      />
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
      <rect
        x="11"
        y="14"
        width="14"
        height="14"
        rx="2"
        fill={c.primary}
        stroke={c.outline}
        strokeWidth="0.8"
      />
      <rect x="11" y="24" width="14" height="2" fill="#5c3a1e" />
      {/* Head */}
      <circle cx="18" cy="9" r="6" fill="#e8c090" stroke={c.outline} strokeWidth="0.8" />
      <line x1="22" y1="7" x2="19" y2="8" stroke="#333" strokeWidth="1.2" />
      <rect x="19" y="8.5" width="2" height="2" rx="0.3" fill="#333" />
      <rect x="12" y="5" width="12" height="2.5" rx="1" fill={c.dark} />
      {/* Axe swinging down */}
      <g className="battle-weapon-arm">
        <rect
          x="26"
          y="4"
          width="2"
          height="14"
          rx="0.5"
          fill="#8B6914"
          transform="rotate(30, 27, 11)"
        />
        <path
          d="M28,4 L34,2 L34,10 L28,8 Z"
          fill="#c0c0c0"
          stroke="#888"
          strokeWidth="0.5"
          transform="rotate(30, 27, 7)"
        />
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
      <rect
        x="10"
        y="14"
        width="12"
        height="14"
        rx="2"
        fill={c.primary}
        stroke={c.outline}
        strokeWidth="0.8"
      />
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
      <rect
        x="12"
        y="14"
        width="12"
        height="14"
        rx="2"
        fill={c.primary}
        stroke={c.outline}
        strokeWidth="0.8"
      />
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
      <polygon
        points="10,16 7,34 25,34 22,16"
        fill="#f0e6d0"
        stroke={c.outline}
        strokeWidth="0.8"
      />
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
      <rect
        x="4"
        y="20"
        width="5"
        height="7"
        rx="1"
        fill="#8B4513"
        stroke="#5c2e0a"
        strokeWidth="0.5"
      />
      <rect x="10" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
      <rect x="17" y="32" width="5" height="3" rx="1" fill="#5c3a1e" />
    </g>
  );
}

function ClericAttack({ c }: P) {
  return (
    <g>
      {/* Robe */}
      <polygon
        points="10,16 7,34 25,34 22,16"
        fill="#f0e6d0"
        stroke={c.outline}
        strokeWidth="0.8"
      />
      <rect x="13" y="20" width="6" height="2" rx="0.5" fill={c.primary} />
      {/* Head */}
      <circle cx="16" cy="10" r="5.5" fill="#fcd5a0" stroke={c.outline} strokeWidth="0.8" />
      <path d="M10,12 Q10,3 16,3 Q22,3 22,12" fill="#e8dcc8" stroke={c.outline} strokeWidth="0.5" />
      <rect x="17" y="9" width="2" height="1.5" rx="0.3" fill="#333" />
      {/* Staff raised with glow */}
      <g className="battle-weapon-arm">
        <line x1="25" y1="0" x2="25" y2="28" stroke="#8b6914" strokeWidth="1.5" />
        <circle cx="25" cy="0" r="3.5" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
        <circle
          cx="25"
          cy="0"
          r="5"
          fill="rgba(251,191,36,0.3)"
          className="battle-pose__magic-glow"
        />
        <circle cx="25" cy="0" r="1.5" fill="white" opacity="0.8" />
      </g>
      {/* Book open */}
      <rect
        x="4"
        y="18"
        width="6"
        height="8"
        rx="1"
        fill="#8B4513"
        stroke="#5c2e0a"
        strokeWidth="0.5"
      />
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
      <rect
        x="10"
        y="14"
        width="12"
        height="14"
        rx="2"
        fill={c.primary}
        stroke={c.outline}
        strokeWidth="0.8"
      />
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
      <rect
        x="12"
        y="14"
        width="12"
        height="14"
        rx="2"
        fill={c.primary}
        stroke={c.outline}
        strokeWidth="0.8"
      />
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
