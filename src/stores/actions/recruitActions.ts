import { getManhattanDistance } from '../../core/pathfinding';
import { canRecruit } from '../../core/metaStats';
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
    if (
      unit.recruitableBy === selectedUnitId &&
      getManhattanDistance(pendingPosition, unit.position) === 1
    ) {
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

  // LOY gate: if target has a LOY threshold and recruiter doesn't meet it, fail
  if (
    target.recruitLoyThreshold != null &&
    !canRecruit(unit.metaStats.loy, target.recruitLoyThreshold)
  ) {
    // Move to pending position but fail recruitment
    const newUnits = new Map(units);
    const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));
    if (unit.position.x !== pendingPosition.x || unit.position.y !== pendingPosition.y) {
      newTiles[unit.position.y][unit.position.x].occupantId = null;
    }
    newTiles[pendingPosition.y][pendingPosition.x].occupantId = selectedUnitId;
    const facing = deriveFacing(pendingPosition, target.position);
    newUnits.set(selectedUnitId, {
      ...unit,
      position: { ...pendingPosition },
      hasActed: true,
      facing,
    });
    set({
      ...IDLE_RESET,
      units: newUnits,
      gameMap: { ...gameMap, tiles: newTiles },
      eventDialogue: {
        lines: [{ speaker: target.name, text: `I don't trust you enough to join...` }],
      },
      eventDialogueLineIndex: 0,
    });
    if (allPlayersDone(get().units)) get().endPlayerTurn();
    return;
  }

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
