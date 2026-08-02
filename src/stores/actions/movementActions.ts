import type { GameState, GameActions } from '../gameStoreTypes';
import { IDLE_RESET } from '../helpers/constants';
import { allPlayersDone } from '../helpers/mapHelpers';
import { deriveFacing } from '../helpers/facingHelpers';
import { checkAndFireEvents } from './eventActions';
import { applyMovementSta } from './metaStatActions';
import { recalculateFog } from './fogActions';
import { checkMapBossCheckpoint, applyMapBossPhaseTransition } from './mapBossActions';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

/** Check if walk animation should be skipped (for E2E tests) */
function shouldSkipWalkAnim(): boolean {
  if (typeof window === 'undefined') return true;
  return new URLSearchParams(window.location.search).has('skipWalkAnim');
}

export function confirmMove(get: Get, set: Set) {
  const { selectedUnitId, pendingPosition, units, gameMap, movePath } = get();
  if (!selectedUnitId || !pendingPosition) return;

  const unit = units.get(selectedUnitId);
  if (!unit) return;

  // Build full path including start position
  const fullPath = [unit.position, ...movePath];

  // If same position or skip animation, teleport instantly
  if (fullPath.length <= 1 || shouldSkipWalkAnim()) {
    teleportUnit(get, set, selectedUnitId, unit, pendingPosition, gameMap, units);
    return;
  }

  // Start walk animation
  set({
    movingUnit: { unitId: selectedUnitId, path: fullPath, stepIndex: 0, onComplete: 'wait' },
    playerAction: 'idle',
    movementRange: IDLE_RESET.movementRange!,
    attackRange: IDLE_RESET.attackRange!,
    pendingAttackTiles: IDLE_RESET.pendingAttackTiles!,
  });
}

/** Advance one step along the walk path */
export function advanceMovement(get: Get, set: Set) {
  const { movingUnit, units, gameMap } = get();
  if (!movingUnit) return;

  const { unitId, path, stepIndex } = movingUnit;
  const unit = units.get(unitId);
  if (!unit) {
    set({ movingUnit: null });
    return;
  }

  const nextIndex = stepIndex + 1;

  if (nextIndex >= path.length) {
    // Walk complete — finalize
    const destination = path[path.length - 1];
    const { onComplete } = movingUnit;
    set({ movingUnit: null });

    // Enemy/auto-battle walk: just clear movingUnit, let the game loop proceed
    if (onComplete === 'enemy_action' || onComplete === 'auto_action') {
      return;
    }

    teleportUnit(get, set, unitId, unit, destination, gameMap, units);
    return;
  }

  // Step to next tile — update unit position + facing
  const nextPos = path[nextIndex];
  const facing = deriveFacing(path[stepIndex], nextPos);
  const newUnits = new Map(units);
  const steppedUnit = { ...unit, position: { ...nextPos }, facing };
  newUnits.set(unitId, steppedUnit);

  // Update tile occupants
  const prevPos = path[stepIndex];
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));
  newTiles[prevPos.y][prevPos.x].occupantId = null;
  newTiles[nextPos.y][nextPos.x].occupantId = unitId;

  set({
    units: newUnits,
    gameMap: { ...gameMap, tiles: newTiles },
    movingUnit: { ...movingUnit, stepIndex: nextIndex },
  });
}

/** Instant unit teleport (used when walk is skipped or walk completes) */
function teleportUnit(
  get: Get,
  set: Set,
  unitId: string,
  unit: GameState['units'] extends Map<string, infer U> ? U : never,
  destination: { x: number; y: number },
  gameMap: GameState['gameMap'],
  units: GameState['units'],
) {
  const newUnits = new Map(units);
  const facing = deriveFacing(unit.position, destination);
  const movedUnit = { ...unit, position: { ...destination }, hasActed: true, facing };
  newUnits.set(unitId, movedUnit);

  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));
  // Clear old position only if different
  if (unit.position.x !== destination.x || unit.position.y !== destination.y) {
    newTiles[unit.position.y][unit.position.x].occupantId = null;
  }
  newTiles[destination.y][destination.x].occupantId = unitId;

  set({
    ...IDLE_RESET,
    units: newUnits,
    gameMap: { ...gameMap, tiles: newTiles },
  });

  // STA gain from movement (+1 per tile moved)
  const tilesMoved =
    Math.abs(destination.x - unit.position.x) + Math.abs(destination.y - unit.position.y);
  if (tilesMoved > 0) {
    applyMovementSta(get, set, unitId, tilesMoved);
  }

  // Recalculate fog of war after movement
  recalculateFog(get, set);

  // Map boss: check if unit reached a checkpoint
  if (checkMapBossCheckpoint(get, set, unitId, destination)) {
    applyMapBossPhaseTransition(get, set);
    // Check if map boss is defeated
    const { mapBossState: mbState } = get();
    if (mbState && mbState.currentHp <= 0) {
      set({ currentPhase: 'game_over' });
      return;
    }
  }

  // Fire events for unit movement
  checkAndFireEvents(get, set, {
    lastMovedUnitId: unitId,
    lastMovedPosition: destination,
  });

  // Don't auto-end turn if event dialogue is showing
  if (get().eventDialogue) return;

  if (allPlayersDone(get().units)) {
    get().endPlayerTurn();
  }
}
