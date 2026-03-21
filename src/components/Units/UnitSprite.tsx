import { memo } from 'react';
import type { Unit, WeaponType } from '../../core/types';
import { FACTION_COLORS, renderClassSprite } from '../sprites/classSprites';
import '../../styles/ui/boss.css';

const BOSS_PHASE_COLORS = [
  'drop-shadow(0 0 3px rgba(251,191,36,0.6))',                    // Phase 0: gold
  'drop-shadow(0 0 4px rgba(239,68,68,0.7)) hue-rotate(10deg)',   // Phase 1: red
  'drop-shadow(0 0 5px rgba(168,85,247,0.8)) hue-rotate(40deg)',  // Phase 2+: purple
];

function getBossPhaseFilter(unit: Unit): string {
  if (!unit.bossPhases || unit.bossPhases.length === 0) {
    return 'drop-shadow(0 0 3px rgba(251,191,36,0.6))';
  }
  // Find current phase index based on HP thresholds
  let phaseIdx = 0;
  for (let i = unit.bossPhases.length - 1; i >= 0; i--) {
    if (unit.currentHp <= unit.bossPhases[i].hpThreshold) {
      phaseIdx = i + 1;
      break;
    }
  }
  return BOSS_PHASE_COLORS[Math.min(phaseIdx, BOSS_PHASE_COLORS.length - 1)];
}

const WEAPON_ICONS: Record<string, string> = {
  sword: '\u2694', lance: '\u{1F531}', axe: '\u{1FA93}',
  fire: '\u{1F525}', thunder: '\u26A1', wind: '\u{1F32C}',
  bow: '\u{1F3F9}', staff: '\u{1FA84}', light: '\u2728', dark: '\u{1F311}', knife: '\u{1F5E1}',
};

type UnitSpriteProps = {
  unit: Unit;
  tileSize: number;
  isSelected?: boolean;
  isSpawning?: boolean;
  isRemoving?: boolean;
  isRefreshed?: boolean;
  hasActiveSupport?: boolean;
};

export const UnitSprite = memo(function UnitSprite({ unit, tileSize, isSelected, isSpawning, isRemoving, isRefreshed, hasActiveSupport }: UnitSpriteProps) {
  const hpPercent = Math.max(0, (unit.currentHp / unit.stats.hp) * 100);
  const hpColor = hpPercent > 50 ? '#22c55e' : hpPercent > 25 ? '#eab308' : '#ef4444';
  const c = FACTION_COLORS[unit.faction];
  const crp = unit.metaStats.crp;
  const sta = unit.metaStats.sta;
  const crpClass = crp >= 80 ? 'unit-sprite--crp-heavy' : crp >= 60 ? 'unit-sprite--crp-medium' : crp >= 30 ? 'unit-sprite--crp-flicker' : '';
  const staClass = sta >= 30 && sta < 45 ? 'unit-sprite--sta-dim' : '';
  const animClass = isSpawning ? 'unit-sprite--spawning'
    : isRemoving ? 'unit-sprite--removing'
    : isRefreshed ? 'unit-sprite--refreshed'
    : isSelected ? 'unit-sprite--selected'
    : !unit.hasActed ? 'unit-sprite--idle' : '';

  return (
    <div
      className={`unit-sprite ${animClass} ${crpClass} ${staClass}`}
      data-testid={`unit-${unit.id}`}
      data-unit-id={unit.id}
      data-faction={unit.faction}
      data-hp={unit.currentHp}
      data-max-hp={unit.stats.hp}
      data-acted={unit.hasActed || undefined}
      style={{
        width: tileSize,
        height: tileSize,
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        pointerEvents: 'none',
        opacity: unit.hasActed ? 0.5 : 1,
        filter: unit.hasActed ? 'grayscale(0.6)' : 'none',
      }}
    >
      <svg
        width={tileSize * 0.75}
        height={tileSize * 0.8}
        viewBox="0 0 32 36"
        style={{
          imageRendering: 'auto',
          filter: unit.aiBehavior?.type === 'boss' ? getBossPhaseFilter(unit) : undefined,
          transform: unit.facing === 'left' ? 'scaleX(-1)' : undefined,
        }}
      >
        {renderClassSprite(unit.classId, c, unit.facing === 'up' ? 'back' : 'front')}
        {unit.aiBehavior?.type === 'boss' && (
          <g transform="translate(13, -2)">
            <polygon points="3,0 0,5 1.5,3 3,6 4.5,3 6,5" fill="#fbbf24" stroke="#d97706" strokeWidth="0.4" />
          </g>
        )}
      </svg>

      {/* Weapon cycle indicator above boss */}
      {unit.weaponCycleOrder && unit.weaponCycleOrder.length > 0 && (
        <div className="weapon-cycle-indicator" data-testid={`weapon-cycle-${unit.id}`}>
          {WEAPON_ICONS[unit.weaponCycleOrder[unit.weaponCycleIndex ?? 0]] ?? unit.weaponCycleOrder[unit.weaponCycleIndex ?? 0]}
        </div>
      )}

      {/* Corruption layer dots */}
      {unit.corruptionLayers != null && unit.corruptionLayers > 0 && (
        <div className="corruption-layers" data-testid={`corruption-${unit.id}`}>
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className={`corruption-layers__dot ${i >= unit.corruptionLayers! ? 'corruption-layers__dot--stripped' : ''}`}
            />
          ))}
        </div>
      )}

      {/* HP bar */}
      <div
        className="unit-sprite__hp-bar"
        style={{
          width: '70%',
          height: 3,
          backgroundColor: '#222',
          borderRadius: 1,
          marginTop: -2,
          marginBottom: 1,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${hpPercent}%`,
            height: '100%',
            backgroundColor: hpColor,
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* CRP warning overlay at 80+ */}
      {crp >= 80 && (
        <div className="unit-sprite__crp-warning" />
      )}

      {/* STA sweat-drop at 45+ */}
      {sta >= 45 && (
        <svg className="unit-sprite__sta-sweat" viewBox="0 0 8 10" width="8" height="10">
          <path d="M4 0 Q6 4 4 8 Q2 4 4 0Z" fill="#60a5fa" opacity="0.8" />
        </svg>
      )}

      {/* Support heart — shown when ranked support partner within 3 tiles */}
      {hasActiveSupport && unit.faction === 'player' && (
        <svg
          className="unit-sprite__support-heart"
          viewBox="0 0 10 10"
          data-testid={`support-heart-${unit.id}`}
        >
          <path d="M5 8 C2 5.5 0.5 3.5 2 2 C3 1 4.5 1.5 5 3 C5.5 1.5 7 1 8 2 C9.5 3.5 8 5.5 5 8Z" fill="#f472b6" stroke="#be185d" strokeWidth="0.5" />
        </svg>
      )}

      {/* Carry badge — small person icon when rescuing */}
      {unit.carriedUnitId && (
        <svg
          className="unit-sprite__carry-badge"
          viewBox="0 0 10 10"
          data-testid={`carry-badge-${unit.id}`}
        >
          <circle cx="5" cy="2.5" r="1.8" fill="#60a5fa" stroke="#1e3a5f" strokeWidth="0.5" />
          <path d="M5 4.5 L5 7.5 M3 5.5 L7 5.5 M3.5 10 L5 7.5 L6.5 10" stroke="#60a5fa" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
});
