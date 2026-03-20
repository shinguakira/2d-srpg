import { getManhattanDistance } from '../../core/pathfinding';
import type { GameState, GameActions } from '../gameStoreTypes';
import { IDLE_RESET } from '../helpers/constants';
import { allPlayersDone } from '../helpers/mapHelpers';
import { refreshDangerZone } from '../helpers/dangerZoneHelpers';
import { deriveFacing } from '../helpers/facingHelpers';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

/**
 * Find the adjacent recruitable unit for the selected player unit.
 * Returns the unit ID or null if none found.
 */
function findRecruitTarget(get: Get): string | null {
  const { selectedUnitId, pendingPosition, units } = get();
  if (!selectedUnitId || !pendingPosition) return null;

  for (const unit of units.values()) {
    if (unit.recruitableBy === selectedUnitId && getManhattanDistance(pendingPosition, unit.position) === 1) {
      return unit.id;
    }
  }
  return null;
}

/**
 * Check if Talk action is available for the current unit at pending position.
 */
export function canTalk(get: Get): boolean {
  return findRecruitTarget(get) !== null;
}

/**
 * Start Talk action — find target and initiate recruitment.
 */
export function startTalk(get: Get, set: Set) {
  const { selectedUnitId, pendingPosition, units, gameMap } = get();
  if (!selectedUnitId || !pendingPosition) return;

  const targetId = findRecruitTarget(get);
  if (!targetId) return;

  const unit = units.get(selectedUnitId)!;
  const target = units.get(targetId)!;

  // Move unit to pending position first
  const newUnits = new Map(units);
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));

  if (unit.position.x !== pendingPosition.x || unit.position.y !== pendingPosition.y) {
    newTiles[unit.position.y][unit.position.x].occupantId = null;
  }
  newTiles[pendingPosition.y][pendingPosition.x].occupantId = selectedUnitId;

  const facing = deriveFacing(pendingPosition, target.position);
  const movedUnit = { ...unit, position: { ...pendingPosition }, hasActed: true, facing };
  newUnits.set(selectedUnitId, movedUnit);

  // Recruit the target: swap faction to player
  const recruitedUnit = {
    ...target,
    faction: 'player' as const,
    hasActed: true,
    aiBehavior: undefined,
    recruitableBy: undefined,
    recruitCondition: undefined,
  };
  newUnits.set(targetId, recruitedUnit);

  set({
    ...IDLE_RESET,
    units: newUnits,
    gameMap: { ...gameMap, tiles: newTiles },
  });

  refreshDangerZone(get, set);

  if (allPlayersDone(get().units)) {
    get().endPlayerTurn();
  }
}
