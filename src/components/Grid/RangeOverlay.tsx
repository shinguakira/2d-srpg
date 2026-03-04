import { memo } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useUIStore } from '../../stores/uiStore';
import { parsePos, posKey } from '../../core/types';

export const RangeOverlay = memo(function RangeOverlay() {
  const movementRange = useGameStore((s) => s.movementRange);
  const attackRange = useGameStore((s) => s.attackRange);
  const movePath = useGameStore((s) => s.movePath);
  const playerAction = useGameStore((s) => s.playerAction);
  const pendingAttackTiles = useGameStore((s) => s.pendingAttackTiles);
  const units = useGameStore((s) => s.units);
  const tileSize = useUIStore((s) => s.tileSize);

  const showMoveRange = playerAction === 'move_target' || playerAction === 'action_menu';
  const showAttackTargets = playerAction === 'attack_target' || playerAction === 'confirm';

  if (!showMoveRange && !showAttackTargets) return null;

  return (
    <div className="range-overlay" data-testid="range-overlay" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
      {showMoveRange && (
        <>
          {/* Attack range (red, rendered first = behind) */}
          {Array.from(attackRange).map((key) => {
            const pos = parsePos(key);
            return (
              <div
                key={`atk-${key}`}
                className="range-overlay__attack"
                data-testid={`attack-range-${pos.x}-${pos.y}`}
                style={{
                  position: 'absolute',
                  left: pos.x * tileSize,
                  top: pos.y * tileSize,
                  width: tileSize,
                  height: tileSize,
                  backgroundColor: 'rgba(239, 68, 68, 0.3)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  boxSizing: 'border-box',
                }}
              />
            );
          })}

          {/* Movement range (blue) */}
          {Array.from(movementRange).map((key) => {
            const pos = parsePos(key);
            return (
              <div
                key={`mov-${key}`}
                className="range-overlay__move"
                data-testid={`move-range-${pos.x}-${pos.y}`}
                style={{
                  position: 'absolute',
                  left: pos.x * tileSize,
                  top: pos.y * tileSize,
                  width: tileSize,
                  height: tileSize,
                  backgroundColor: 'rgba(59, 130, 246, 0.3)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  boxSizing: 'border-box',
                }}
              />
            );
          })}

          {/* Path preview (brighter blue dots along the path) */}
          {movePath.length > 1 && movePath.map((pos, i) => {
            if (i === 0) return null; // skip start position
            return (
              <div
                key={`path-${i}`}
                className="range-overlay__path"
                data-testid={`path-${pos.x}-${pos.y}`}
                style={{
                  position: 'absolute',
                  left: pos.x * tileSize + tileSize * 0.35,
                  top: pos.y * tileSize + tileSize * 0.35,
                  width: tileSize * 0.3,
                  height: tileSize * 0.3,
                  backgroundColor: 'rgba(59, 130, 246, 0.7)',
                  borderRadius: '50%',
                }}
              />
            );
          })}
        </>
      )}

      {showAttackTargets && (
        <>
          {/* Highlight attack target tiles with enemy units */}
          {Array.from(pendingAttackTiles).map((key) => {
            const pos = parsePos(key);
            // Check if there's an enemy on this tile
            let hasEnemy = false;
            for (const unit of units.values()) {
              if (unit.faction !== 'player' && posKey(unit.position) === key) {
                hasEnemy = true;
                break;
              }
            }
            return (
              <div
                key={`target-${key}`}
                className={`range-overlay__target ${hasEnemy ? 'range-overlay__target--enemy' : ''}`}
                data-testid={`attack-target-${pos.x}-${pos.y}`}
                style={{
                  position: 'absolute',
                  left: pos.x * tileSize,
                  top: pos.y * tileSize,
                  width: tileSize,
                  height: tileSize,
                  backgroundColor: hasEnemy ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.2)',
                  border: hasEnemy ? '2px solid rgba(239, 68, 68, 0.8)' : '1px solid rgba(239, 68, 68, 0.3)',
                  boxSizing: 'border-box',
                  pointerEvents: 'none',
                }}
              />
            );
          })}
        </>
      )}
    </div>
  );
});
