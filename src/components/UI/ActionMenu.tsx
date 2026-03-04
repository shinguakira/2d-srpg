import { useGameStore } from '../../stores/gameStore';
import { useUIStore } from '../../stores/uiStore';
import { posKey } from '../../core/types';

export function ActionMenu() {
  const playerAction = useGameStore((s) => s.playerAction);
  const confirmMove = useGameStore((s) => s.confirmMove);
  const cancelAction = useGameStore((s) => s.cancelAction);
  const startAttackTargeting = useGameStore((s) => s.startAttackTargeting);
  const pendingAttackTiles = useGameStore((s) => s.pendingAttackTiles);
  const pendingPosition = useGameStore((s) => s.pendingPosition);
  const selectedUnitId = useGameStore((s) => s.selectedUnitId);
  const units = useGameStore((s) => s.units);
  const selectedWeaponIndex = useGameStore((s) => s.selectedWeaponIndex);
  const selectWeapon = useGameStore((s) => s.selectWeapon);
  const visitVillage = useGameStore((s) => s.visitVillage);
  const visitedVillages = useGameStore((s) => s.visitedVillages);
  const chapterVillages = useGameStore((s) => s.chapterVillages);
  const cameraOffset = useUIStore((s) => s.cameraOffset);
  const tileSize = useUIStore((s) => s.tileSize);

  if (playerAction !== 'action_menu' || !pendingPosition) return null;

  const selectedUnit = selectedUnitId ? units.get(selectedUnitId) : null;

  // Check if there are any enemies in attack range
  let hasEnemyInRange = false;
  for (const unit of units.values()) {
    if (unit.faction !== 'player' && pendingAttackTiles.has(posKey(unit.position))) {
      hasEnemyInRange = true;
      break;
    }
  }

  // Check if standing on an unvisited village
  const pendingKey = posKey(pendingPosition);
  const isUnvisitedVillage =
    !visitedVillages.has(pendingKey) &&
    chapterVillages.some((v) => posKey(v.position) === pendingKey);

  // Position menu next to the pending tile
  const menuX = (pendingPosition.x + 1) * tileSize + cameraOffset.x + 4;
  const menuY = pendingPosition.y * tileSize + cameraOffset.y;

  const showWeaponSelector = selectedUnit && selectedUnit.inventory.length > 1;

  return (
    <div
      className="action-menu"
      data-testid="action-menu"
      style={{ left: menuX, top: menuY }}
    >
      {showWeaponSelector && (
        <div className="action-menu__weapons" data-testid="weapon-selector">
          {selectedUnit.inventory.map((weapon, i) => (
            <button
              key={weapon.id}
              className={`action-menu__weapon-btn ${i === selectedWeaponIndex ? 'action-menu__weapon-btn--active' : ''}`}
              data-testid={`weapon-${i}`}
              onClick={() => selectWeapon(i)}
            >
              {weapon.name}
            </button>
          ))}
        </div>
      )}
      <div className="action-menu__actions">
        {hasEnemyInRange && (
          <button
            className="action-menu__btn action-menu__btn--attack"
            data-testid="action-attack"
            onClick={startAttackTargeting}
          >
            Attack
          </button>
        )}
        {isUnvisitedVillage && (
          <button
            className="action-menu__btn action-menu__btn--visit"
            data-testid="action-visit"
            onClick={visitVillage}
          >
            Visit
          </button>
        )}
        <button
          className="action-menu__btn"
          data-testid="action-wait"
          onClick={confirmMove}
        >
          Wait
        </button>
        <button
          className="action-menu__btn action-menu__btn--cancel"
          data-testid="action-cancel"
          onClick={cancelAction}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
