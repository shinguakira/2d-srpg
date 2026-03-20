import { posKey } from '../../core/types';
import type { GameState, GameActions } from '../gameStoreTypes';
import { IDLE_RESET } from '../helpers/constants';
import { allPlayersDone } from '../helpers/mapHelpers';
import { deriveFacing } from '../helpers/facingHelpers';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function useItem(get: Get, set: Set, itemIndex: number) {
  const { selectedUnitId, pendingPosition, units, gameMap, chapterData, openedChests } = get();
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

  // Handle unlock effect (Door Key / Chest Key)
  let villageReward = null;
  let newOpenedChests = openedChests;
  if (item.effect.kind === 'unlock') {
    const dirs = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
    for (const d of dirs) {
      const adj = { x: pendingPosition.x + d.x, y: pendingPosition.y + d.y };
      if (adj.x < 0 || adj.y < 0 || adj.x >= gameMap.width || adj.y >= gameMap.height) continue;
      const tile = newTiles[adj.y][adj.x];

      if (item.effect.targetTerrain === 'door' && tile.terrain === 'door') {
        newTiles[adj.y][adj.x] = { ...tile, terrain: 'indoor' };
        break;
      }
      if (item.effect.targetTerrain === 'chest' && tile.terrain === 'chest' && !openedChests.has(posKey(adj))) {
        newOpenedChests = new Set(openedChests);
        newOpenedChests.add(posKey(adj));
        const chestData = chapterData?.chests?.find(
          (c) => c.position.x === adj.x && c.position.y === adj.y
        );
        villageReward = chestData?.reward ?? null;
        break;
      }
    }
  }

  set({
    ...IDLE_RESET,
    units: newUnits,
    gameMap: { ...gameMap, tiles: newTiles },
    openedChests: newOpenedChests,
    villageReward,
  });

  // Auto end turn if all player units have acted
  if (allPlayersDone(newUnits)) {
    get().endPlayerTurn();
  }
}
