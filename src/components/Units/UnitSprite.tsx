import { memo } from 'react';
import type { Unit } from '../../core/types';
import { sortAndTruncateEffects, renderStatusIcon } from '../sprites/statusEffectIcons';
import { getSheet, spriteBox, framePosition } from '../sprites/spriteSheetConfig';
import { useClipFrame, phaseOf } from '../sprites/useClipFrame';
import '../../styles/ui/boss.css';

const BOSS_PHASE_COLORS = [
  'drop-shadow(0 0 3px rgba(251,191,36,0.6))', // Phase 0: gold
  'drop-shadow(0 0 4px rgba(239,68,68,0.7)) hue-rotate(10deg)', // Phase 1: red
  'drop-shadow(0 0 5px rgba(168,85,247,0.8)) hue-rotate(40deg)', // Phase 2+: purple
];

function getBossPhaseFilter(unit: Unit): string {
  if (!unit.bossPhases || unit.bossPhases.length === 0) {
    return 'drop-shadow(0 0 3px rgba(251,191,36,0.6))';
  }
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
  sword: '⚔',
  lance: '\u{1F531}',
  axe: '\u{1FA93}',
  fire: '\u{1F525}',
  thunder: '⚡',
  wind: '\u{1F32C}',
  bow: '\u{1F3F9}',
  staff: '\u{1FA84}',
  light: '✨',
  dark: '\u{1F311}',
  knife: '\u{1F5E1}',
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

/** Character height as a fraction of the tile. */
const CONTENT_RATIO = 0.72;
/** Where the character's feet sit, as a fraction of the tile height. */
const FOOT_RATIO = 0.9;

export const UnitSprite = memo(function UnitSprite({
  unit,
  tileSize,
  isSelected,
  isSpawning,
  isRemoving,
  isRefreshed,
  hasActiveSupport,
}: UnitSpriteProps) {
  const hpPercent = Math.max(0, (unit.currentHp / unit.stats.hp) * 100);
  const hpColor = hpPercent > 50 ? '#22c55e' : hpPercent > 25 ? '#eab308' : '#ef4444';
  const sheet = getSheet(unit.classId, unit.id);
  const crp = unit.metaStats.crp;
  const sta = unit.metaStats.sta;
  const crpClass =
    crp >= 80
      ? 'unit-sprite--crp-heavy'
      : crp >= 60
        ? 'unit-sprite--crp-medium'
        : crp >= 30
          ? 'unit-sprite--crp-flicker'
          : '';
  const animClass = isSpawning
    ? 'unit-sprite--spawning'
    : isRemoving
      ? 'unit-sprite--removing'
      : isRefreshed
        ? 'unit-sprite--refreshed'
        : isSelected
          ? 'unit-sprite--selected'
          : !unit.hasActed
            ? 'unit-sprite--idle'
            : '';

  const frame = useClipFrame(sheet.clips.idle, undefined, phaseOf(unit.id));
  const box = spriteBox(sheet, tileSize * CONTENT_RATIO);
  const pos = framePosition(sheet, box, frame);

  /* Every filter is composed here rather than split between inline styles and
     CSS classes. Two classes both setting `filter` silently drop one of them,
     which is how the STA dim used to disappear. */
  const artFilters: string[] = [];
  if (unit.aiBehavior?.type === 'boss') artFilters.push(getBossPhaseFilter(unit));
  if (unit.hasActed) artFilters.push('grayscale(0.6)');
  if (sta >= 30 && sta < 45) artFilters.push('brightness(0.85)');

  return (
    <div
      className={`unit-sprite ${animClass}`}
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
        overflow: 'visible',
        pointerEvents: 'none',
        opacity: unit.hasActed ? 0.5 : 1,
      }}
    >
      {/* Anchored so the character's feet land on the tile regardless of how
          the source art is framed. Absolute, so no flex parent can squash it.
          The CRP class sits on this wrapper and the computed filters on the
          child, so a keyframed `filter` composes with them instead of
          replacing them. */}
      <div
        className={`unit-sprite__anchor ${crpClass}`}
        style={{
          position: 'absolute',
          left: tileSize / 2 - box.anchorX,
          top: tileSize * FOOT_RATIO - box.anchorY,
          width: box.w,
          height: box.h,
        }}
      >
        <div
          className="unit-sprite__art"
          data-testid={`unit-art-${unit.id}`}
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${sheet.url})`,
            backgroundPosition: `${pos.x}px ${pos.y}px`,
            backgroundSize: `${box.bgW}px ${box.bgH}px`,
            backgroundRepeat: 'no-repeat',
            imageRendering: (sheet.pixelArt
              ? 'pixelated'
              : 'auto') as React.CSSProperties['imageRendering'],
            transform: unit.facing === 'left' ? 'scaleX(-1)' : undefined,
            filter: artFilters.length > 0 ? artFilters.join(' ') : undefined,
          }}
        />
      </div>

      {unit.aiBehavior?.type === 'boss' && (
        <svg
          width={12}
          height={10}
          viewBox="0 0 6 6"
          style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}
        >
          <polygon
            points="3,0 0,5 1.5,3 3,6 4.5,3 6,5"
            fill="#fbbf24"
            stroke="#d97706"
            strokeWidth="0.4"
          />
        </svg>
      )}

      {/* Weapon cycle indicator above boss */}
      {unit.weaponCycleOrder && unit.weaponCycleOrder.length > 0 && (
        <div className="weapon-cycle-indicator" data-testid={`weapon-cycle-${unit.id}`}>
          {WEAPON_ICONS[unit.weaponCycleOrder[unit.weaponCycleIndex ?? 0]] ??
            unit.weaponCycleOrder[unit.weaponCycleIndex ?? 0]}
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

      {/* Bottom-anchored UI stack — kept out of the sprite's layout entirely */}
      <div className="unit-sprite__ui">
        <div className="unit-sprite__hp-bar">
          <div
            style={{
              width: `${hpPercent}%`,
              height: '100%',
              backgroundColor: hpColor,
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {unit.statusEffects && unit.statusEffects.length > 0 && (
          <div className="unit-sprite__status-icons">
            {sortAndTruncateEffects(unit.statusEffects).map((effect) => (
              <svg
                key={effect.type}
                className="unit-sprite__status-icon"
                viewBox="0 0 8 8"
                width={8}
                height={8}
                data-testid={`status-icon-${effect.type}`}
              >
                {renderStatusIcon(effect.type)}
              </svg>
            ))}
            {unit.statusEffects.length > 3 && (
              <span className="unit-sprite__status-overflow">...</span>
            )}
          </div>
        )}
      </div>

      {/* CRP warning overlay at 80+ */}
      {crp >= 80 && <div className="unit-sprite__crp-warning" />}

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
          <path
            d="M5 8 C2 5.5 0.5 3.5 2 2 C3 1 4.5 1.5 5 3 C5.5 1.5 7 1 8 2 C9.5 3.5 8 5.5 5 8Z"
            fill="#f472b6"
            stroke="#be185d"
            strokeWidth="0.5"
          />
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
          <path
            d="M5 4.5 L5 7.5 M3 5.5 L7 5.5 M3.5 10 L5 7.5 L6.5 10"
            stroke="#60a5fa"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
});
