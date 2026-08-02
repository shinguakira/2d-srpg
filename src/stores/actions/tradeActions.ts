import { posKey } from '../../core/types';
import { getManhattanDistance } from '../../core/pathfinding';
import type { GameState, GameActions } from '../gameStoreTypes';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function startTradeTargeting(get: Get, set: Set) {
  const { selectedUnitId, pendingPosition, units } = get();
  if (!selectedUnitId || !pendingPosition) return;

  const unit = units.get(selectedUnitId);
  if (!unit) return;

  const tradable = new Set<string>();
  for (const ally of units.values()) {
    if (ally.id === selectedUnitId) continue;
    if (ally.faction !== 'player') continue;
    if (ally.isCarried) continue;
    const dist = getManhattanDistance(pendingPosition, ally.position);
    if (dist === 1) {
      tradable.add(posKey(ally.position));
    }
  }

  if (tradable.size === 0) return;

  set({
    playerAction: 'trade_target',
    tradableTiles: tradable,
  });
}

export function confirmTrade(
  get: Get,
  set: Set,
  targetId: string,
  swaps: Array<{ from: 'a' | 'b'; index: number }>,
) {
  const { selectedUnitId, units } = get();
  if (!selectedUnitId) return;

  const unitA = units.get(selectedUnitId);
  const unitB = units.get(targetId);
  if (!unitA || !unitB) return;

  // Build new item lists by applying swaps in order
  const newItemsA = [...unitA.items];
  const newItemsB = [...unitB.items];

  for (const swap of swaps) {
    if (swap.from === 'a') {
      // Transfer item from A to B
      const item = newItemsA[swap.index];
      if (item) {
        newItemsA.splice(swap.index, 1);
        newItemsB.push(item);
      }
    } else {
      // Transfer item from B to A
      const item = newItemsB[swap.index];
      if (item) {
        newItemsB.splice(swap.index, 1);
        newItemsA.push(item);
      }
    }
  }

  const newUnits = new Map(units);
  newUnits.set(selectedUnitId, { ...unitA, items: newItemsA });
  newUnits.set(targetId, { ...unitB, items: newItemsB });

  // Trade does NOT consume the turn — return to action menu
  set({
    units: newUnits,
    playerAction: 'action_menu',
    tradableTiles: new Set(),
    tradePartnerId: null,
  });
}
