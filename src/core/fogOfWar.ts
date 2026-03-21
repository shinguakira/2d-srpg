import type { Unit, GameMap, Position, FogState, WeatherType } from './types';
import { posKey } from './types';
import { getWeatherVisionCap } from './weather';

const DEFAULT_VISION = 3;
const THIEF_VISION = 5;
const TORCH_BONUS = 5;

/** Thief-line classes that get extended vision */
const THIEF_CLASSES = new Set(['thief', 'assassin', 'rogue']);

/** Get a unit's base vision range (before torch). Default 3, thief-line 5, AWR ≥ 61 adds +1. */
export function getVisionRange(unit: Unit): number {
  let range = THIEF_CLASSES.has(unit.classId) ? THIEF_VISION : DEFAULT_VISION;
  if (unit.visionRange != null) range = unit.visionRange;
  if (unit.metaStats.awr >= 61) range += 1;
  return range;
}

/**
 * Calculate the set of currently visible tiles for all player units.
 * Vision uses Manhattan distance (not line-of-sight).
 * torchEffects maps unitId -> turns remaining (adds +5 to that unit's range).
 */
export function calculateVisibleTiles(
  playerUnits: Unit[],
  map: GameMap,
  torchEffects?: Map<string, number>,
  weather?: WeatherType,
): Set<string> {
  const visible = new Set<string>();
  const visionCap = weather ? getWeatherVisionCap(weather) : null;

  for (const unit of playerUnits) {
    if (unit.faction !== 'player') continue;
    if (unit.isCarried) continue;

    let range = getVisionRange(unit);
    if (torchEffects?.has(unit.id)) {
      range += TORCH_BONUS;
    }
    // Weather vision cap (thief-line units are not affected)
    if (visionCap != null && !THIEF_CLASSES.has(unit.classId)) {
      range = Math.min(range, visionCap);
    }

    addTilesInRange(unit.position, range, map, visible);
  }

  return visible;
}

/** Add all tiles within Manhattan distance `range` of `center` to the set. */
function addTilesInRange(center: Position, range: number, map: GameMap, out: Set<string>): void {
  for (let dy = -range; dy <= range; dy++) {
    const absY = Math.abs(dy);
    for (let dx = -(range - absY); dx <= range - absY; dx++) {
      const x = center.x + dx;
      const y = center.y + dy;
      if (x >= 0 && y >= 0 && x < map.width && y < map.height) {
        out.add(posKey({ x, y }));
      }
    }
  }
}

/**
 * Update the fog map after visibility changes.
 * - Tiles in `visibleTiles` become 'visible'
 * - Previously 'visible' tiles not in set become 'revealed'
 * - 'hidden' tiles not in set stay 'hidden'
 */
export function updateFogMap(
  previousFog: Map<string, FogState>,
  visibleTiles: Set<string>,
  map: GameMap,
): Map<string, FogState> {
  const newFog = new Map<string, FogState>();

  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const key = posKey({ x, y });
      if (visibleTiles.has(key)) {
        newFog.set(key, 'visible');
      } else {
        const prev = previousFog.get(key);
        if (prev === 'visible' || prev === 'revealed') {
          newFog.set(key, 'revealed');
        } else {
          newFog.set(key, 'hidden');
        }
      }
    }
  }

  return newFog;
}

/** Check if a position is currently visible to the player. */
export function isUnitVisibleInFog(unitPos: Position, visibleTiles: Set<string>): boolean {
  return visibleTiles.has(posKey(unitPos));
}

/**
 * Initialize a fully hidden fog map for a given map size.
 * Then immediately apply initial visibility from player units.
 */
export function initializeFogMap(
  map: GameMap,
  playerUnits: Unit[],
  torchEffects?: Map<string, number>,
  weather?: WeatherType,
): { fogMap: Map<string, FogState>; visibleTiles: Set<string> } {
  const emptyFog = new Map<string, FogState>();
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      emptyFog.set(posKey({ x, y }), 'hidden');
    }
  }
  const visibleTiles = calculateVisibleTiles(playerUnits, map, torchEffects, weather);
  const fogMap = updateFogMap(emptyFog, visibleTiles, map);
  return { fogMap, visibleTiles };
}
