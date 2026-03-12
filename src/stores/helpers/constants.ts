import type { GameMap } from '../../core/types';
import type { GameState } from '../gameStoreTypes';

export const EMPTY_SET = new Set<string>();
export const EMPTY_MAP: GameMap = { width: 0, height: 0, tiles: [] };

/** Common state reset when returning to idle — spread into set() calls */
export const IDLE_RESET: Partial<GameState> = {
  selectedUnitId: null,
  playerAction: 'idle' as const,
  movementRange: EMPTY_SET,
  attackRange: EMPTY_SET,
  movePath: [],
  pendingPosition: null,
  pendingAttackTiles: EMPTY_SET,
  combatForecast: null,
  combatResult: null,
  combatAnimationStep: -1,
  attackTargetId: null,
  selectedWeaponIndex: 0,
  healableTiles: EMPTY_SET,
  movingUnit: null,
};
