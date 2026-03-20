import type { GameState, GameActions } from '../gameStoreTypes';
import { hasSkill } from '../../core/skills';
import { IDLE_RESET } from '../helpers/constants';
import { allPlayersDone } from '../helpers/mapHelpers';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

/** Get adjacent positions in 4 cardinal directions */
function getAdjacentPositions(pos: { x: number; y: number }) {
  return [
    { x: pos.x, y: pos.y - 1 },
    { x: pos.x, y: pos.y + 1 },
    { x: pos.x - 1, y: pos.y },
    { x: pos.x + 1, y: pos.y },
  ];
}

/** Check if a tile is in bounds and passable (no occupant) */
function isTileEmpty(gameMap: GameState['gameMap'], pos: { x: number; y: number }): boolean {
  if (pos.x < 0 || pos.y < 0 || pos.x >= gameMap.width || pos.y >= gameMap.height) return false;
  const tile = gameMap.tiles[pos.y]?.[pos.x];
  if (!tile || tile.occupantId) return false;
  if (tile.terrain === 'wall' || tile.terrain === 'water') return false;
  return true;
}

/** Get the position on the opposite side of `from` relative to `center` */
function getOppositePos(center: { x: number; y: number }, from: { x: number; y: number }) {
  return {
    x: center.x + (center.x - from.x),
    y: center.y + (center.y - from.y),
  };
}

/**
 * Shove: push an adjacent ally 1 tile away from the unit.
 * Consumes action (marks hasActed).
 */
export function executeShove(get: Get, set: Set) {
  const { selectedUnitId, pendingPosition, units, gameMap } = get();
  if (!selectedUnitId || !pendingPosition) return;
  const unit = units.get(selectedUnitId);
  if (!unit || !hasSkill(unit, 'shove')) return;

  // Find first adjacent ally that can be shoved
  const adjacent = getAdjacentPositions(pendingPosition);
  for (const adjPos of adjacent) {
    const tile = gameMap.tiles[adjPos.y]?.[adjPos.x];
    if (!tile?.occupantId) continue;
    const ally = units.get(tile.occupantId);
    if (!ally || ally.faction !== 'player' || ally.id === selectedUnitId) continue;

    // Target tile: opposite of unit relative to ally (push away from unit)
    const targetPos = getOppositePos(adjPos, pendingPosition);
    if (!isTileEmpty(gameMap, targetPos)) continue;

    // Execute shove
    const newUnits = new Map(units);
    newUnits.set(ally.id, { ...ally, position: { ...targetPos } });
    // Move unit to pending position and mark as acted
    newUnits.set(selectedUnitId, { ...unit, position: { ...pendingPosition }, hasActed: true });

    const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));
    // Update unit tile occupancy
    newTiles[unit.position.y][unit.position.x].occupantId = null;
    newTiles[pendingPosition.y][pendingPosition.x].occupantId = selectedUnitId;
    // Update ally tile occupancy
    newTiles[adjPos.y][adjPos.x].occupantId = null;
    newTiles[targetPos.y][targetPos.x].occupantId = ally.id;

    set({
      ...IDLE_RESET,
      units: newUnits,
      gameMap: { ...gameMap, tiles: newTiles },
    });

    if (allPlayersDone(get().units)) get().endPlayerTurn();
    return;
  }
}

/**
 * Swap: swap positions with an adjacent ally.
 * Consumes action (marks hasActed).
 */
export function executeSwap(get: Get, set: Set) {
  const { selectedUnitId, pendingPosition, units, gameMap } = get();
  if (!selectedUnitId || !pendingPosition) return;
  const unit = units.get(selectedUnitId);
  if (!unit || !hasSkill(unit, 'swap')) return;

  const adjacent = getAdjacentPositions(pendingPosition);
  for (const adjPos of adjacent) {
    const tile = gameMap.tiles[adjPos.y]?.[adjPos.x];
    if (!tile?.occupantId) continue;
    const ally = units.get(tile.occupantId);
    if (!ally || ally.faction !== 'player' || ally.id === selectedUnitId) continue;

    // Execute swap
    const newUnits = new Map(units);
    newUnits.set(unit.id, { ...unit, position: { ...adjPos }, hasActed: true });
    newUnits.set(ally.id, { ...ally, position: { ...pendingPosition } });

    const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));
    newTiles[pendingPosition.y][pendingPosition.x].occupantId = ally.id;
    newTiles[adjPos.y][adjPos.x].occupantId = unit.id;

    set({
      ...IDLE_RESET,
      units: newUnits,
      gameMap: { ...gameMap, tiles: newTiles },
    });

    if (allPlayersDone(get().units)) get().endPlayerTurn();
    return;
  }
}

/**
 * Reposition: move an adjacent ally to the tile on the opposite side of the unit.
 * Consumes action (marks hasActed).
 */
export function executeReposition(get: Get, set: Set) {
  const { selectedUnitId, pendingPosition, units, gameMap } = get();
  if (!selectedUnitId || !pendingPosition) return;
  const unit = units.get(selectedUnitId);
  if (!unit || !hasSkill(unit, 'reposition')) return;

  const adjacent = getAdjacentPositions(pendingPosition);
  for (const adjPos of adjacent) {
    const tile = gameMap.tiles[adjPos.y]?.[adjPos.x];
    if (!tile?.occupantId) continue;
    const ally = units.get(tile.occupantId);
    if (!ally || ally.faction !== 'player' || ally.id === selectedUnitId) continue;

    // Target tile: opposite of ally relative to unit (pull behind unit)
    const targetPos = getOppositePos(pendingPosition, adjPos);
    if (!isTileEmpty(gameMap, targetPos)) continue;

    // Execute reposition
    const newUnits = new Map(units);
    newUnits.set(ally.id, { ...ally, position: { ...targetPos } });
    // Move unit to pending position and mark as acted
    newUnits.set(selectedUnitId, { ...unit, position: { ...pendingPosition }, hasActed: true });

    const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));
    // Update unit tile occupancy
    newTiles[unit.position.y][unit.position.x].occupantId = null;
    newTiles[pendingPosition.y][pendingPosition.x].occupantId = selectedUnitId;
    // Update ally tile occupancy
    newTiles[adjPos.y][adjPos.x].occupantId = null;
    newTiles[targetPos.y][targetPos.x].occupantId = ally.id;

    set({
      ...IDLE_RESET,
      units: newUnits,
      gameMap: { ...gameMap, tiles: newTiles },
    });

    if (allPlayersDone(get().units)) get().endPlayerTurn();
    return;
  }
}
