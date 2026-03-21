import { posKey } from '../../core/types';
import { calcTerrainDamage, canAttackTerrain, resolveBridgeCollapse } from '../../core/destructibleTerrain';
import type { GameState, GameActions } from '../gameStoreTypes';
import { IDLE_RESET } from '../helpers/constants';
import { getClassFlags, allPlayersDone } from '../helpers/mapHelpers';
import { recalculateFog } from './fogActions';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

/**
 * Attack an adjacent destructible terrain tile.
 * Consumes the unit's action (hasActed = true).
 */
export function attackTerrain(get: Get, set: Set) {
  const { selectedUnitId, pendingPosition, units, gameMap, terrainHpMap } = get();
  if (!selectedUnitId || !pendingPosition) return;

  const unit = units.get(selectedUnitId);
  if (!unit) return;

  // Find adjacent destructible tile
  const adjacent = [
    { x: pendingPosition.x, y: pendingPosition.y - 1 },
    { x: pendingPosition.x + 1, y: pendingPosition.y },
    { x: pendingPosition.x, y: pendingPosition.y + 1 },
    { x: pendingPosition.x - 1, y: pendingPosition.y },
  ];

  let targetPos: { x: number; y: number } | null = null;
  for (const pos of adjacent) {
    if (pos.x < 0 || pos.x >= gameMap.width || pos.y < 0 || pos.y >= gameMap.height) continue;
    const terrain = gameMap.tiles[pos.y][pos.x].terrain;
    const key = posKey(pos);
    if (terrainHpMap.has(key) && canAttackTerrain(unit, terrain)) {
      targetPos = pos;
      break;
    }
  }

  if (!targetPos) return;

  const targetKey = posKey(targetPos);
  const terrainEntry = terrainHpMap.get(targetKey);
  if (!terrainEntry) return;

  const damage = calcTerrainDamage(unit);
  const newHp = Math.max(0, terrainEntry.hp - damage);

  // Move unit to pending position first
  const newUnits = new Map(units);
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));
  newTiles[unit.position.y][unit.position.x].occupantId = null;
  newTiles[pendingPosition.y][pendingPosition.x].occupantId = selectedUnitId;
  newUnits.set(selectedUnitId, { ...unit, position: { ...pendingPosition }, hasActed: true });

  const newTerrainHpMap = new Map(terrainHpMap);
  const floats = [...get().floatingNumbers];

  if (newHp <= 0) {
    // Terrain destroyed
    newTerrainHpMap.delete(targetKey);
    const oldTerrain = newTiles[targetPos.y][targetPos.x].terrain;

    // Get the destroyed-to terrain from the chapter config or default
    const chapter = get().chapterData;
    let destroyedTerrain: string = 'rubble';
    if (chapter?.destructibleTerrain) {
      for (const dt of chapter.destructibleTerrain) {
        if (dt.position.x === targetPos.x && dt.position.y === targetPos.y) {
          destroyedTerrain = dt.destroyedTerrain;
          break;
        }
      }
    }
    // Fallback: use config defaults
    if (destroyedTerrain === 'rubble') {
      if (oldTerrain === 'bridge') destroyedTerrain = 'water';
      else if (oldTerrain === 'door') destroyedTerrain = 'indoor';
      else if (oldTerrain === 'forest') destroyedTerrain = 'plain';
    }

    newTiles[targetPos.y][targetPos.x] = { ...newTiles[targetPos.y][targetPos.x], terrain: destroyedTerrain as any };

    floats.push({
      id: Date.now(),
      x: targetPos.x,
      y: targetPos.y,
      text: 'Destroyed!',
      color: '#ef4444',
    });

    // Handle bridge collapse
    if (oldTerrain === 'bridge') {
      const collapseResults = resolveBridgeCollapse(targetPos, { ...gameMap, tiles: newTiles }, newUnits, (u) => getClassFlags(u));
      for (const cr of collapseResults) {
        const collapseUnit = newUnits.get(cr.unitId);
        if (!collapseUnit) continue;
        const newHpAfter = Math.max(0, collapseUnit.currentHp - cr.damage);
        if (cr.displacedTo) {
          newTiles[collapseUnit.position.y][collapseUnit.position.x].occupantId = null;
          newTiles[cr.displacedTo.y][cr.displacedTo.x].occupantId = cr.unitId;
          newUnits.set(cr.unitId, { ...collapseUnit, currentHp: newHpAfter, position: { ...cr.displacedTo } });
        } else {
          // No displacement available — unit stays and takes damage
          newUnits.set(cr.unitId, { ...collapseUnit, currentHp: newHpAfter });
        }
        floats.push({
          id: Date.now() + 1,
          x: collapseUnit.position.x,
          y: collapseUnit.position.y,
          text: `-${cr.damage}`,
          color: '#ef4444',
        });
      }
    }

    // Track terrain destroy for animation
    const newDestroyPositions = new Set(get().terrainDestroyPositions);
    newDestroyPositions.add(targetKey);

    set({
      ...IDLE_RESET,
      units: newUnits,
      gameMap: { ...gameMap, tiles: newTiles },
      terrainHpMap: newTerrainHpMap,
      floatingNumbers: floats,
      terrainDestroyPositions: newDestroyPositions,
    });

    // Clear animation after delay
    setTimeout(() => {
      set({ terrainDestroyPositions: new Set<string>() });
    }, 800);
  } else {
    // Terrain damaged but not destroyed
    newTerrainHpMap.set(targetKey, { ...terrainEntry, hp: newHp });

    floats.push({
      id: Date.now(),
      x: targetPos.x,
      y: targetPos.y,
      text: `-${damage}`,
      color: '#fbbf24',
    });

    set({
      ...IDLE_RESET,
      units: newUnits,
      gameMap: { ...gameMap, tiles: newTiles },
      terrainHpMap: newTerrainHpMap,
      floatingNumbers: floats,
    });
  }

  // Recalculate fog if needed
  recalculateFog(get, set);

  // Auto-end turn if all done
  if (allPlayersDone(get().units)) {
    get().endPlayerTurn();
  }
}
