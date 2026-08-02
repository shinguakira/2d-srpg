import { posKey } from '../../core/types';
import { hasSkill } from '../../core/skills';
import { IDLE_RESET } from '../helpers/constants';
import { allPlayersDone } from '../helpers/mapHelpers';
import type { GameState, GameActions } from '../gameStoreTypes';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function executeLockpick(get: Get, set: Set) {
  const { selectedUnitId, pendingPosition, units, gameMap, chapterData, openedChests } = get();
  if (!selectedUnitId || !pendingPosition) return;

  const unit = units.get(selectedUnitId);
  if (!unit || !hasSkill(unit, 'lockpick_skill')) return;

  const newUnits = new Map(units);
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));

  // Move unit to pending position
  newTiles[unit.position.y][unit.position.x].occupantId = null;
  newTiles[pendingPosition.y][pendingPosition.x].occupantId = selectedUnitId;

  newUnits.set(selectedUnitId, {
    ...unit,
    position: { ...pendingPosition },
    hasActed: true,
  });

  // Find adjacent chest or door
  const dirs = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ];
  let updated = false;

  for (const d of dirs) {
    const adj = { x: pendingPosition.x + d.x, y: pendingPosition.y + d.y };
    if (adj.x < 0 || adj.y < 0 || adj.x >= gameMap.width || adj.y >= gameMap.height) continue;
    const tile = newTiles[adj.y][adj.x];

    if (tile.terrain === 'chest' && !openedChests.has(posKey(adj))) {
      const newOpenedChests = new Set(openedChests);
      newOpenedChests.add(posKey(adj));

      // Check for chest reward in chapter data
      const chestData = chapterData?.chests?.find(
        (c) => c.position.x === adj.x && c.position.y === adj.y,
      );

      set({
        ...IDLE_RESET,
        units: newUnits,
        gameMap: { ...gameMap, tiles: newTiles },
        openedChests: newOpenedChests,
        villageReward: chestData?.reward ?? null,
      });
      updated = true;
      break;
    }

    if (tile.terrain === 'door') {
      newTiles[adj.y][adj.x] = { ...tile, terrain: 'indoor' };
      set({
        ...IDLE_RESET,
        units: newUnits,
        gameMap: { ...gameMap, tiles: newTiles },
      });
      updated = true;
      break;
    }
  }

  if (!updated) {
    set({
      ...IDLE_RESET,
      units: newUnits,
      gameMap: { ...gameMap, tiles: newTiles },
    });
  }

  if (allPlayersDone(newUnits)) {
    get().endPlayerTurn();
  }
}
