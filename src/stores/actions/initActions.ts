import type { ChapterData, UnitProgress } from '../../core/types';
import { SeededRandom } from '../../core/rng';
import type { GameState, GameActions } from '../gameStoreTypes';
import { EMPTY_SET } from '../helpers/constants';
import { buildMap, placeUnits } from '../helpers/mapHelpers';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function initChapter(_get: Get, set: Set, chapter: ChapterData, seed: number = 12345, unitProgress?: Record<string, UnitProgress>) {
  const map = buildMap(chapter);
  const units = placeUnits(chapter, map, unitProgress);
  set({
    gameMap: map,
    units,
    currentPhase: 'player_phase',
    currentTurn: 1,
    playerAction: 'idle',
    rng: new SeededRandom(seed),
    selectedUnitId: null,
    hoveredTile: null,
    movementRange: EMPTY_SET,
    attackRange: EMPTY_SET,
    movePath: [],
    pendingPosition: null,
    pendingAttackTiles: EMPTY_SET,
    combatForecast: null,
    combatResult: null,
    combatAnimationStep: -1,
    attackTargetId: null,
    levelUpGains: null,
    levelUpUnitId: null,
    phaseBanner: null,
    enemyActions: [],
    enemyActionIndex: -1,
    chapterName: chapter.name,
    objectiveDescription: chapter.objective.description,
    selectedWeaponIndex: 0,
    visitedVillages: new Set<string>(),
    villageReward: null,
    chapterVillages: chapter.villages ?? [],
    chapterData: chapter,
    dangerZone: EMPTY_SET,
    showDangerZone: false,
    deathQuote: null,
    healableTiles: EMPTY_SET,
    healResult: null,
    reinforcementMessage: null,
    floatingNumbers: [],
  });
}
