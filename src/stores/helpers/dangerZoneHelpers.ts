import type { Unit } from '../../core/types';
import { getDangerZone } from '../../core/pathfinding';
import type { GameState, GameActions } from '../gameStoreTypes';
import { EMPTY_SET } from './constants';

/** Recompute danger zone if it's currently shown */
export function refreshDangerZone(get: () => GameState & GameActions, set: (s: Partial<GameState>) => void) {
  if (!get().showDangerZone) return;
  const { units, gameMap } = get();
  const enemies: Unit[] = [];
  for (const u of units.values()) {
    if (u.faction === 'enemy') enemies.push(u);
  }
  if (enemies.length === 0) {
    set({ dangerZone: EMPTY_SET, showDangerZone: false });
  } else {
    set({ dangerZone: getDangerZone(enemies, gameMap, units) });
  }
}
