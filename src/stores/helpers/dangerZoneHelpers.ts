import type { Unit, GameMap } from '../../core/types';
import { posKey } from '../../core/types';
import { getDangerZone } from '../../core/pathfinding';
import type { GameState, GameActions } from '../gameStoreTypes';
import { EMPTY_SET } from './constants';
import { getClassFlags } from './mapHelpers';

/** Build per-tile attribution: which enemies threaten each tile */
export function buildDangerZoneAttribution(
  enemies: Unit[],
  gameMap: GameMap,
  units: Map<string, Unit>,
): Map<string, string[]> {
  const attribution = new Map<string, string[]>();
  for (const enemy of enemies) {
    const enemyZone = getDangerZone([enemy], gameMap, units, getClassFlags);
    for (const tileKey of enemyZone) {
      const existing = attribution.get(tileKey);
      if (existing) {
        existing.push(enemy.id);
      } else {
        attribution.set(tileKey, [enemy.id]);
      }
    }
  }
  return attribution;
}

/** Recompute danger zone if it's currently shown */
export function refreshDangerZone(get: () => GameState & GameActions, set: (s: Partial<GameState>) => void) {
  if (!get().showDangerZone) return;
  const { units, gameMap, fogOfWar, visibleTiles } = get();
  const enemies: Unit[] = [];
  for (const u of units.values()) {
    if (u.faction === 'enemy' && !u.isHidden) {
      // In fog of war, only include visible enemies
      if (fogOfWar && !visibleTiles.has(posKey(u.position))) continue;
      enemies.push(u);
    }
  }
  if (enemies.length === 0) {
    set({ dangerZone: EMPTY_SET, dangerZoneAttribution: new Map(), showDangerZone: false });
  } else {
    const fullZone = getDangerZone(enemies, gameMap, units, getClassFlags);
    const attribution = buildDangerZoneAttribution(enemies, gameMap, units);
    set({ dangerZone: fullZone, dangerZoneAttribution: attribution });
  }
}
