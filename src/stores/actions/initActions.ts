import type { ChapterData, UnitProgress } from '../../core/types';
import { SeededRandom } from '../../core/rng';
import type { GameState, GameActions } from '../gameStoreTypes';
import { EMPTY_SET } from '../helpers/constants';
import { buildMap, placeUnits } from '../helpers/mapHelpers';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function initChapter(_get: Get, set: Set, chapter: ChapterData, seed: number = 12345, unitProgress?: Record<string, UnitProgress>, deployedUnitIds?: string[]) {
  const map = buildMap(chapter);
  const units = placeUnits(chapter, map, unitProgress, deployedUnitIds);

  // Reset STA to 0 for all player units at chapter start + apply CRP passive decay
  for (const [id, unit] of units) {
    if (unit.faction === 'player') {
      let meta = { ...unit.metaStats, sta: 0 };
      // CRP passive decay: -1 if crpLowChapters >= 3
      const progress = unitProgress?.[id];
      if (progress?.crpLowChapters && progress.crpLowChapters >= 3 && meta.crp > 0) {
        meta = { ...meta, crp: meta.crp - 1 };
      }
      units.set(id, { ...unit, metaStats: meta });
    }
  }

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
    healAnimationData: null,
    reinforcementMessage: null,
    floatingNumbers: [],
    chapterEvents: chapter.events ?? [],
    firedEventIds: new Set<string>(),
    eventFlags: new Map<string, string>(),
    pendingEffects: [],
    eventDialogue: null,
    eventDialogueLineIndex: 0,
    spawningUnitIds: new Set<string>(),
    removingUnitIds: new Set<string>(),
    terrainChangePositions: new Set<string>(),
    escapedUnitIds: new Set<string>(),
    allyActions: [],
    allyActionIndex: -1,
  });
}
