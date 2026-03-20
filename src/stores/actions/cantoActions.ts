import type { Position } from '../../core/types';
import { posKey } from '../../core/types';
import type { GameState, GameActions } from '../gameStoreTypes';
import { IDLE_RESET } from '../helpers/constants';
import { allPlayersDone } from '../helpers/mapHelpers';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

/**
 * Confirm canto movement after combat for a unit with the Canto skill.
 * Moves the unit to the selected position within cantoRange, then marks hasActed.
 */
export function confirmCantoMove(get: Get, set: Set, pos: Position) {
  const { selectedUnitId, cantoRange, units, gameMap } = get();
  if (!selectedUnitId) return;

  const key = posKey(pos);
  if (!cantoRange.has(key)) return;

  const unit = units.get(selectedUnitId);
  if (!unit) return;

  const newUnits = new Map(units);
  newUnits.set(selectedUnitId, { ...unit, position: { ...pos }, hasActed: true });

  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));
  if (unit.position.x !== pos.x || unit.position.y !== pos.y) {
    newTiles[unit.position.y][unit.position.x].occupantId = null;
  }
  newTiles[pos.y][pos.x].occupantId = selectedUnitId;

  set({
    ...IDLE_RESET,
    units: newUnits,
    gameMap: { ...gameMap, tiles: newTiles },
    cantoRange: new Set(),
    cantoRemainingMov: 0,
  });

  if (allPlayersDone(get().units)) {
    get().endPlayerTurn();
  }
}
