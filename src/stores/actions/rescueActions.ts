import { posKey } from '../../core/types';
import type { Position } from '../../core/types';
import { getManhattanDistance } from '../../core/pathfinding';
import { canRescueUnit, getRescuePenalizedStats } from '../../core/rescue';
import { isPassableForClass } from '../../core/terrain';
import { IDLE_RESET } from '../helpers/constants';
import { allPlayersDone, getClassFlags } from '../helpers/mapHelpers';
import { deriveFacing } from '../helpers/facingHelpers';
import type { GameState, GameActions } from '../gameStoreTypes';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function startRescueTargeting(get: Get, set: Set) {
  const { selectedUnitId, pendingPosition, units } = get();
  if (!selectedUnitId || !pendingPosition) return;

  const unit = units.get(selectedUnitId);
  if (!unit || unit.carriedUnitId) return; // already carrying

  const rescuable = new Set<string>();
  for (const ally of units.values()) {
    if (ally.id === selectedUnitId) continue;
    if (ally.faction !== 'player') continue;
    if (ally.isCarried) continue;
    const dist = getManhattanDistance(pendingPosition, ally.position);
    if (dist === 1 && canRescueUnit(unit, ally)) {
      rescuable.add(posKey(ally.position));
    }
  }

  if (rescuable.size === 0) return;

  set({
    playerAction: 'rescue_target',
    rescuableTiles: rescuable,
  });
}

export function confirmRescue(get: Get, set: Set, targetId: string) {
  const { selectedUnitId, pendingPosition, units, gameMap } = get();
  if (!selectedUnitId || !pendingPosition) return;

  const rescuer = units.get(selectedUnitId);
  const target = units.get(targetId);
  if (!rescuer || !target) return;

  const newUnits = new Map(units);
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));

  // Move rescuer to pending position
  newTiles[rescuer.position.y][rescuer.position.x].occupantId = null;
  newTiles[pendingPosition.y][pendingPosition.x].occupantId = selectedUnitId;

  // Remove target from map
  newTiles[target.position.y][target.position.x].occupantId = null;

  // Apply stat penalties to rescuer (STR/SPD halved, MOV -2)
  const penalized = getRescuePenalizedStats(rescuer);
  const penalizedStats = {
    ...rescuer.stats,
    str: penalized.str,
    spd: penalized.spd,
    mov: penalized.mov,
  };

  const rescueFacing = deriveFacing(pendingPosition, target.position);
  newUnits.set(selectedUnitId, {
    ...rescuer,
    position: { ...pendingPosition },
    hasActed: true,
    facing: rescueFacing,
    stats: penalizedStats,
    originalStats: { ...rescuer.stats },
    carriedUnitId: targetId,
  });

  newUnits.set(targetId, {
    ...target,
    isCarried: true,
  });

  const rescueFloatId = Date.now();
  set({
    ...IDLE_RESET,
    units: newUnits,
    gameMap: { ...gameMap, tiles: newTiles },
    floatingNumbers: [...get().floatingNumbers, {
      id: rescueFloatId,
      x: pendingPosition.x,
      y: pendingPosition.y,
      text: 'Rescue!',
      color: '#60a5fa',
    }],
  });

  if (allPlayersDone(newUnits)) {
    get().endPlayerTurn();
  }
}

export function startDropTargeting(get: Get, set: Set) {
  const { selectedUnitId, pendingPosition, units, gameMap } = get();
  if (!selectedUnitId || !pendingPosition) return;

  const unit = units.get(selectedUnitId);
  if (!unit || !unit.carriedUnitId) return;

  const droppable = new Set<string>();
  const dirs: Position[] = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
  const flags = getClassFlags(unit);

  for (const d of dirs) {
    const adj = { x: pendingPosition.x + d.x, y: pendingPosition.y + d.y };
    if (adj.x < 0 || adj.y < 0 || adj.x >= gameMap.width || adj.y >= gameMap.height) continue;
    const tile = gameMap.tiles[adj.y][adj.x];
    if (tile.occupantId) continue;
    if (!isPassableForClass(tile.terrain, flags)) continue;
    droppable.add(posKey(adj));
  }

  if (droppable.size === 0) return;

  set({
    playerAction: 'drop_target',
    droppableTiles: droppable,
  });
}

export function confirmDrop(get: Get, set: Set, pos: Position) {
  const { selectedUnitId, pendingPosition, units, gameMap } = get();
  if (!selectedUnitId || !pendingPosition) return;

  const rescuer = units.get(selectedUnitId);
  if (!rescuer || !rescuer.carriedUnitId) return;

  const carried = units.get(rescuer.carriedUnitId);
  if (!carried) return;

  const newUnits = new Map(units);
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));

  // Move rescuer to pending position
  newTiles[rescuer.position.y][rescuer.position.x].occupantId = null;
  newTiles[pendingPosition.y][pendingPosition.x].occupantId = selectedUnitId;

  // Place carried unit at drop position
  newTiles[pos.y][pos.x].occupantId = rescuer.carriedUnitId;

  // Restore rescuer's original stats
  const restoredStats = rescuer.originalStats ?? rescuer.stats;

  const dropFacing = deriveFacing(pendingPosition, pos);
  newUnits.set(selectedUnitId, {
    ...rescuer,
    position: { ...pendingPosition },
    hasActed: true,
    facing: dropFacing,
    stats: restoredStats,
    originalStats: undefined,
    carriedUnitId: undefined,
  });

  newUnits.set(rescuer.carriedUnitId, {
    ...carried,
    position: { ...pos },
    isCarried: false,
    hasActed: true, // dropped unit can't act this turn
  });

  const dropFloatId = Date.now();
  set({
    ...IDLE_RESET,
    units: newUnits,
    gameMap: { ...gameMap, tiles: newTiles },
    floatingNumbers: [...get().floatingNumbers, {
      id: dropFloatId,
      x: pos.x,
      y: pos.y,
      text: 'Drop!',
      color: '#60a5fa',
    }],
  });

  if (allPlayersDone(newUnits)) {
    get().endPlayerTurn();
  }
}
