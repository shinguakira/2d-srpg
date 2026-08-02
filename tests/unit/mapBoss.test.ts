import { describe, it, expect } from 'vitest';
import {
  getMapBossEnemyHealRate,
  getMapBossSpawnRate,
} from '../../src/stores/actions/mapBossActions';
import { checkVictory } from '../../src/stores/helpers/mapHelpers';
import type { MapBossState, Unit, ChapterData } from '../../src/core/types';

function makeMapBossState(overrides: Partial<MapBossState> = {}): MapBossState {
  return {
    maxHp: 300,
    currentHp: 300,
    currentPhase: 0,
    checkpointPositions: [
      { x: 5, y: 5 },
      { x: 10, y: 10 },
      { x: 15, y: 15 },
    ],
    phases: [
      { hpThreshold: 300, terrainChanges: [], enemyHealRate: 5, spawnRate: 1 },
      { hpThreshold: 200, terrainChanges: [], enemyHealRate: 10, spawnRate: 2 },
      { hpThreshold: 100, terrainChanges: [], enemyHealRate: 15, spawnRate: 3 },
    ],
    ...overrides,
  };
}

describe('Map-as-Boss System', () => {
  describe('getMapBossEnemyHealRate', () => {
    it('returns heal rate for phase 0', () => {
      const state = makeMapBossState();
      expect(getMapBossEnemyHealRate(state)).toBe(5);
    });

    it('returns higher heal rate for later phases', () => {
      const state = makeMapBossState({ currentPhase: 1 });
      expect(getMapBossEnemyHealRate(state)).toBe(10);
    });

    it('returns highest heal rate at final phase', () => {
      const state = makeMapBossState({ currentPhase: 2 });
      expect(getMapBossEnemyHealRate(state)).toBe(15);
    });
  });

  describe('getMapBossSpawnRate', () => {
    it('returns spawn rate for current phase', () => {
      const state = makeMapBossState();
      expect(getMapBossSpawnRate(state)).toBe(1);
    });

    it('returns higher spawn rate at later phases', () => {
      const state = makeMapBossState({ currentPhase: 2 });
      expect(getMapBossSpawnRate(state)).toBe(3);
    });
  });

  describe('MapBossState structure', () => {
    it('has correct initial values', () => {
      const state = makeMapBossState();
      expect(state.maxHp).toBe(300);
      expect(state.currentHp).toBe(300);
      expect(state.currentPhase).toBe(0);
      expect(state.checkpointPositions).toHaveLength(3);
      expect(state.phases).toHaveLength(3);
    });

    it('checkpoint HP reduction calculation', () => {
      const state = makeMapBossState();
      const hpPerCheckpoint = Math.floor(state.maxHp / state.checkpointPositions.length);
      expect(hpPerCheckpoint).toBe(100);
      const newHp = state.currentHp - hpPerCheckpoint;
      expect(newHp).toBe(200);
    });
  });

  describe('spawn rate scales with map boss phase', () => {
    it('phase 0 has full spawn rate', () => {
      const state = makeMapBossState({ currentPhase: 0 });
      expect(getMapBossSpawnRate(state)).toBe(1);
    });

    it('later phases can have lower spawn rates', () => {
      // Demonstrate that spawn rate is configurable per phase
      const state = makeMapBossState({
        currentPhase: 2,
        phases: [
          { hpThreshold: 300, terrainChanges: [], enemyHealRate: 5, spawnRate: 1 },
          { hpThreshold: 200, terrainChanges: [], enemyHealRate: 3, spawnRate: 0.5 },
          { hpThreshold: 100, terrainChanges: [], enemyHealRate: 0, spawnRate: 0 },
        ],
      });
      expect(getMapBossSpawnRate(state)).toBe(0); // No spawns in final phase
    });
  });

  describe('edge case: all units dead in survive chapter', () => {
    function makeUnit(id: string, faction: 'player' | 'enemy', overrides?: Partial<Unit>): Unit {
      return {
        id,
        name: id,
        classId: 'lord',
        level: 1,
        exp: 0,
        faction,
        stats: {
          hp: 20,
          str: 5,
          mag: 0,
          def: 5,
          res: 0,
          spd: 5,
          skl: 5,
          lck: 5,
          mov: 5,
          cha: 0,
          wil: 0,
        },
        currentHp: 20,
        position: { x: 0, y: 0 },
        startPosition: { x: 0, y: 0 },
        equippedWeapon: {
          id: 'iron_sword',
          name: 'Iron Sword',
          type: 'sword',
          might: 5,
          hit: 90,
          crit: 0,
          range: [1],
          weight: 5,
          rank: 'E',
          uses: 40,
          maxUses: 40,
        },
        inventory: [],
        items: [],
        skills: [],
        learnedSkills: [],
        traumaSkills: [],
        hasActed: false,
        facing: 'right' as const,
        growthRates: {
          hp: 0,
          str: 0,
          mag: 0,
          def: 0,
          res: 0,
          spd: 0,
          skl: 0,
          lck: 0,
          cha: 0,
          wil: 0,
        },
        metaStats: { awr: 0, loop: 347, sync: 80, loy: 50, crp: 0, sta: 0 },
        ...overrides,
      } as Unit;
    }

    it('returns defeat when no player units remain in survive chapter', () => {
      const units = new Map<string, Unit>();
      // Only enemies remain — all players dead
      units.set('enemy1', makeUnit('enemy1', 'enemy'));
      const chapterData = { objective: { type: 'survive', turns: 10 } } as ChapterData;
      expect(checkVictory(units, chapterData)).toBe('defeat');
    });

    it('returns null (no result) when players still alive in survive chapter', () => {
      const units = new Map<string, Unit>();
      units.set('ren', makeUnit('ren', 'player', { isLord: true }));
      units.set('enemy1', makeUnit('enemy1', 'enemy'));
      const chapterData = { objective: { type: 'survive', turns: 10 } } as ChapterData;
      // Not defeated yet, and not victory (survive is turn-based)
      expect(checkVictory(units, chapterData)).toBeNull();
    });
  });
});
