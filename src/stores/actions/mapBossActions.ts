import type { MapBossState, Position } from '../../core/types';
import { posKey } from '../../core/types';
import type { GameState, GameActions } from '../gameStoreTypes';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

/**
 * Check if a unit (Ren) has reached a checkpoint position.
 * If so, reduce map boss HP and trigger phase transitions.
 */
export function checkMapBossCheckpoint(
  get: Get,
  set: Set,
  unitId: string,
  position: Position,
): boolean {
  const { mapBossState, units } = get();
  if (!mapBossState) return false;

  const unit = units.get(unitId);
  if (!unit || !unit.isLord) return false;

  const key = posKey(position);
  const isCheckpoint = mapBossState.checkpointPositions.some((cp) => posKey(cp) === key);
  if (!isCheckpoint) return false;

  // Reduce HP by portion (total HP / number of checkpoints)
  const hpPerCheckpoint = Math.floor(
    mapBossState.maxHp / Math.max(1, mapBossState.checkpointPositions.length),
  );
  const newHp = Math.max(0, mapBossState.currentHp - hpPerCheckpoint);

  // Remove this checkpoint so it can't be triggered again
  const remainingCheckpoints = mapBossState.checkpointPositions.filter((cp) => posKey(cp) !== key);

  // Check phase transition
  let newPhase = mapBossState.currentPhase;
  for (let i = mapBossState.phases.length - 1; i > newPhase; i--) {
    if (newHp <= mapBossState.phases[i].hpThreshold) {
      newPhase = i;
      break;
    }
  }

  set({
    mapBossState: {
      ...mapBossState,
      currentHp: newHp,
      currentPhase: newPhase,
      checkpointPositions: remainingCheckpoints,
    },
  });

  return true;
}

/**
 * Apply map boss phase transition: change terrain layout per phase.
 */
export function applyMapBossPhaseTransition(get: Get, set: Set): void {
  const { mapBossState, gameMap } = get();
  if (!mapBossState) return;

  const phase = mapBossState.phases[mapBossState.currentPhase];
  if (!phase) return;

  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));

  // Apply specific terrain changes
  if (phase.terrainChanges) {
    for (const change of phase.terrainChanges) {
      if (newTiles[change.position.y]?.[change.position.x]) {
        newTiles[change.position.y][change.position.x].terrain = change.terrain;
      }
    }
  }

  // Final phase: clear all walls/mountains → plain (only throne remains)
  if (phase.clearWalls) {
    const wallTerrains = new Set(['wall', 'mountain', 'pillar', 'breakable_wall']);
    for (let y = 0; y < newTiles.length; y++) {
      for (let x = 0; x < newTiles[y].length; x++) {
        if (wallTerrains.has(newTiles[y][x].terrain)) {
          newTiles[y][x].terrain = 'plain';
        }
      }
    }
  }

  set({ gameMap: { ...gameMap, tiles: newTiles } });
}

/**
 * Get enemy heal rate based on current map boss HP.
 */
export function getMapBossEnemyHealRate(state: MapBossState): number {
  const phase = state.phases[state.currentPhase];
  return phase?.enemyHealRate ?? 0;
}

/**
 * Get enemy spawn rate based on current map boss phase.
 */
export function getMapBossSpawnRate(state: MapBossState): number {
  const phase = state.phases[state.currentPhase];
  return phase?.spawnRate ?? 0;
}
