import { memo } from 'react';
import type { Unit } from '../../core/types';
import { FACTION_COLORS, renderClassSprite } from '../sprites/classSprites';

type UnitSpriteProps = {
  unit: Unit;
  tileSize: number;
  isSelected?: boolean;
};

export const UnitSprite = memo(function UnitSprite({ unit, tileSize, isSelected }: UnitSpriteProps) {
  const hpPercent = Math.max(0, (unit.currentHp / unit.stats.hp) * 100);
  const hpColor = hpPercent > 50 ? '#22c55e' : hpPercent > 25 ? '#eab308' : '#ef4444';
  const c = FACTION_COLORS[unit.faction];
  const animClass = isSelected ? 'unit-sprite--selected' : !unit.hasActed ? 'unit-sprite--idle' : '';

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
          filter: unit.aiBehavior?.type === 'boss' ? 'drop-shadow(0 0 3px rgba(251,191,36,0.6))' : undefined,
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
    </div>
  );
});
