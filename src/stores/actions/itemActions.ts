import type { GameState, GameActions } from '../gameStoreTypes';
import { IDLE_RESET } from '../helpers/constants';
import { allPlayersDone } from '../helpers/mapHelpers';
import { deriveFacing } from '../helpers/facingHelpers';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function useItem(get: Get, set: Set, itemIndex: number) {
  const { selectedUnitId, pendingPosition, units, gameMap } = get();
  if (!selectedUnitId || !pendingPosition) return;

  const newUnits = new Map(units);
  const unit = units.get(selectedUnitId)!;
  const item = unit.items[itemIndex];
  if (!item) return;

  // Apply item effect
  const facing = deriveFacing(unit.position, pendingPosition);
  let updatedUnit = { ...unit, position: { ...pendingPosition }, hasActed: true, facing };
  if (item.effect.kind === 'heal') {
    const healAmount = Math.min(item.effect.amount, unit.stats.hp - unit.currentHp);
    updatedUnit = { ...updatedUnit, currentHp: unit.currentHp + healAmount };
  }

  // Update items (decrement uses, remove if depleted)
  const remaining = item.uses - 1;
  const newItems = remaining > 0
    ? unit.items.map((it, i) => i === itemIndex ? { ...it, uses: remaining } : it)
    : unit.items.filter((_, i) => i !== itemIndex);
  updatedUnit = { ...updatedUnit, items: newItems };

  // Move unit to pending position
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));
  newTiles[unit.position.y][unit.position.x].occupantId = null;
  newTiles[pendingPosition.y][pendingPosition.x].occupantId = selectedUnitId;

  newUnits.set(selectedUnitId, updatedUnit);

  set({
    ...IDLE_RESET,
    units: newUnits,
    gameMap: { ...gameMap, tiles: newTiles },
  });

  // Auto end turn if all player units have acted
  if (allPlayersDone(newUnits)) {
    get().endPlayerTurn();
  }
}
