import type { Unit, ConsumableItem, GameMap, Position } from './types';
import { posKey } from './types';

type UseItemContext = {
  gameMap: GameMap;
  position: Position;
  openedChests?: Set<string>;
  fogOfWar?: boolean;
};

/** Check if a unit can use a given item */
export function canUseItem(unit: Unit, item: ConsumableItem, context?: UseItemContext): boolean {
  if (item.uses <= 0) return false;
  if (item.effect.kind === 'heal') {
    return unit.currentHp < unit.stats.hp;
  }
  if (item.effect.kind === 'promote') {
    // Promotion items handled separately by PromotionScreen flow
    return false;
  }
  if (item.effect.kind === 'unlock') {
    if (!context) return false;
    const { gameMap, position, openedChests } = context;
    const dirs = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];
    for (const d of dirs) {
      const adj = { x: position.x + d.x, y: position.y + d.y };
      if (adj.x < 0 || adj.y < 0 || adj.x >= gameMap.width || adj.y >= gameMap.height) continue;
      const tile = gameMap.tiles[adj.y][adj.x];
      if (item.effect.targetTerrain === 'door' && tile.terrain === 'door') return true;
      if (
        item.effect.targetTerrain === 'chest' &&
        tile.terrain === 'chest' &&
        !openedChests?.has(posKey(adj))
      )
        return true;
    }
    return false;
  }
  if (item.effect.kind === 'torch') {
    return !!context?.fogOfWar;
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

/** Return a warning color for low durability, or undefined for normal. */
export function getDurabilityColor(durability: number): string | undefined {
  if (durability <= 5) return '#ef4444';
  if (durability <= 10) return '#eab308';
  return undefined;
}
