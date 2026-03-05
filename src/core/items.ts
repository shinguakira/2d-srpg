import type { Unit, ConsumableItem } from './types';

/** Check if a unit can use a given item */
export function canUseItem(unit: Unit, item: ConsumableItem): boolean {
  if (item.uses <= 0) return false;
  if (item.effect.kind === 'heal') {
    return unit.currentHp < unit.stats.hp;
  }
  return false;
}

/** Apply an item's effect to a unit. Returns updated unit and item (null if depleted). */
export function useItem(
  unit: Unit,
  item: ConsumableItem,
): { unit: Unit; item: ConsumableItem | null } {
  if (item.effect.kind === 'heal') {
    const healAmount = Math.min(item.effect.amount, unit.stats.hp - unit.currentHp);
    const updatedUnit: Unit = {
      ...unit,
      currentHp: unit.currentHp + healAmount,
    };
    const remaining = item.uses - 1;
    const updatedItem = remaining > 0 ? { ...item, uses: remaining } : null;
    return { unit: updatedUnit, item: updatedItem };
  }
  return { unit, item };
}
