import { describe, it, expect } from 'vitest';
import {
  getVisionRange,
  calculateVisibleTiles,
  updateFogMap,
  isUnitVisibleInFog,
  initializeFogMap,
} from '../../src/core/fogOfWar';
import type { Unit, GameMap, Tile, FogState, MetaStats } from '../../src/core/types';

const BASE_META: MetaStats = { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 };

function makeUnit(id: string, pos: { x: number; y: number }, opts?: Partial<Unit>): Unit {
  return {
    id,
    name: id,
    classId: 'lord',
    faction: 'player',
    position: pos,
    stats: {
      hp: 20,
      str: 8,
      mag: 4,
      def: 5,
      res: 3,
      spd: 7,
      skl: 6,
      lck: 4,
      mov: 5,
      cha: 0,
      wil: 0,
    },
    currentHp: 20,
    level: 1,
    exp: 0,
    equippedWeapon: {
      id: 'iron_sword',
      name: 'Iron Sword',
      type: 'sword',
      might: 5,
      hit: 90,
      crit: 0,
      weight: 5,
      minRange: 1,
      maxRange: 1,
    },
    inventory: [],
    items: [],
    hasActed: false,
    facing: 'down',
    sprite: '',
    skills: [],
    learnedSkills: [],
    metaStats: { ...BASE_META },
    ...opts,
  };
}

function makeMap(width: number, height: number): GameMap {
  const tiles: Tile[][] = [];
  for (let y = 0; y < height; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < width; x++) {
      row.push({ terrain: 'plain', position: { x, y }, occupantId: null });
    }
    tiles.push(row);
  }
  return { tiles, width, height };
}

describe('getVisionRange', () => {
  it('default vision is 3 for non-thief', () => {
    const unit = makeUnit('ren', { x: 0, y: 0 });
    expect(getVisionRange(unit)).toBe(3);
  });

  it('thief gets vision 5', () => {
    const unit = makeUnit('coda', { x: 0, y: 0 }, { classId: 'thief' });
    expect(getVisionRange(unit)).toBe(5);
  });

  it('assassin gets vision 5', () => {
    const unit = makeUnit('coda', { x: 0, y: 0 }, { classId: 'assassin' });
    expect(getVisionRange(unit)).toBe(5);
  });

  it('rogue gets vision 5', () => {
    const unit = makeUnit('coda', { x: 0, y: 0 }, { classId: 'rogue' });
    expect(getVisionRange(unit)).toBe(5);
  });

  it('AWR >= 61 adds +1', () => {
    const unit = makeUnit(
      'ren',
      { x: 0, y: 0 },
      {
        metaStats: { ...BASE_META, awr: 61 },
      },
    );
    expect(getVisionRange(unit)).toBe(4);
  });

  it('AWR 60 does not add bonus', () => {
    const unit = makeUnit(
      'ren',
      { x: 0, y: 0 },
      {
        metaStats: { ...BASE_META, awr: 60 },
      },
    );
    expect(getVisionRange(unit)).toBe(3);
  });

  it('thief + AWR 61 = 6', () => {
    const unit = makeUnit(
      'coda',
      { x: 0, y: 0 },
      {
        classId: 'thief',
        metaStats: { ...BASE_META, awr: 61 },
      },
    );
    expect(getVisionRange(unit)).toBe(6);
  });

  it('custom visionRange overrides default', () => {
    const unit = makeUnit('ren', { x: 0, y: 0 }, { visionRange: 4 });
    expect(getVisionRange(unit)).toBe(4);
  });
});

describe('calculateVisibleTiles', () => {
  it('calculates visible tiles within Manhattan distance', () => {
    const map = makeMap(7, 7);
    const unit = makeUnit('ren', { x: 3, y: 3 });
    const visible = calculateVisibleTiles([unit], map);

    // Center tile should be visible
    expect(visible.has('3,3')).toBe(true);
    // Distance 1
    expect(visible.has('3,2')).toBe(true);
    expect(visible.has('4,3')).toBe(true);
    // Distance 3
    expect(visible.has('3,0')).toBe(true);
    expect(visible.has('6,3')).toBe(true);
    expect(visible.has('0,3')).toBe(true);
    // Distance 4 — outside range
    expect(visible.has('3,7')).toBe(false); // out of bounds
    expect(visible.has('0,0')).toBe(false); // distance 6
  });

  it('union of multiple units vision', () => {
    const map = makeMap(10, 1);
    const unitA = makeUnit('a', { x: 0, y: 0 });
    const unitB = makeUnit('b', { x: 9, y: 0 });
    const visible = calculateVisibleTiles([unitA, unitB], map);

    // A sees 0-3, B sees 6-9
    expect(visible.has('0,0')).toBe(true);
    expect(visible.has('3,0')).toBe(true);
    expect(visible.has('6,0')).toBe(true);
    expect(visible.has('9,0')).toBe(true);
    // Middle might not be visible depending on range
    expect(visible.has('5,0')).toBe(false); // distance 5 from A, 4 from B
  });

  it('torch adds +5 vision', () => {
    const map = makeMap(10, 1);
    const unit = makeUnit('ren', { x: 0, y: 0 });
    const torchEffects = new Map([['ren', 2]]);
    const visible = calculateVisibleTiles([unit], map, torchEffects);

    // Normal range 3, torch adds 5 = range 8
    expect(visible.has('8,0')).toBe(true);
    expect(visible.has('9,0')).toBe(false); // distance 9
  });

  it('ignores carried units', () => {
    const map = makeMap(7, 7);
    const unit = makeUnit('ren', { x: 3, y: 3 }, { isCarried: true });
    const visible = calculateVisibleTiles([unit], map);
    expect(visible.size).toBe(0);
  });

  it('ignores non-player units', () => {
    const map = makeMap(7, 7);
    const unit = makeUnit('enemy1', { x: 3, y: 3 }, { faction: 'enemy' });
    const visible = calculateVisibleTiles([unit], map);
    expect(visible.size).toBe(0);
  });

  it('clips to map bounds', () => {
    const map = makeMap(5, 5);
    const unit = makeUnit('ren', { x: 0, y: 0 });
    const visible = calculateVisibleTiles([unit], map);

    // Should not include negative positions
    expect(visible.has('-1,0')).toBe(false);
    expect(visible.has('0,-1')).toBe(false);
    // Corner + range 3
    expect(visible.has('3,0')).toBe(true);
    expect(visible.has('0,3')).toBe(true);
    expect(visible.has('2,1')).toBe(true);
  });
});

describe('updateFogMap', () => {
  it('newly visible tiles become visible', () => {
    const map = makeMap(3, 1);
    const prev = new Map<string, FogState>([
      ['0,0', 'hidden'],
      ['1,0', 'hidden'],
      ['2,0', 'hidden'],
    ]);
    const visible = new Set(['1,0']);
    const result = updateFogMap(prev, visible, map);
    expect(result.get('1,0')).toBe('visible');
    expect(result.get('0,0')).toBe('hidden');
    expect(result.get('2,0')).toBe('hidden');
  });

  it('previously visible tiles become revealed when out of range', () => {
    const map = makeMap(3, 1);
    const prev = new Map<string, FogState>([
      ['0,0', 'visible'],
      ['1,0', 'visible'],
      ['2,0', 'hidden'],
    ]);
    const visible = new Set(['1,0']); // only 1,0 still visible
    const result = updateFogMap(prev, visible, map);
    expect(result.get('0,0')).toBe('revealed');
    expect(result.get('1,0')).toBe('visible');
    expect(result.get('2,0')).toBe('hidden');
  });

  it('revealed tiles stay revealed', () => {
    const map = makeMap(3, 1);
    const prev = new Map<string, FogState>([
      ['0,0', 'revealed'],
      ['1,0', 'hidden'],
      ['2,0', 'hidden'],
    ]);
    const visible = new Set<string>(); // nothing visible
    const result = updateFogMap(prev, visible, map);
    expect(result.get('0,0')).toBe('revealed');
    expect(result.get('1,0')).toBe('hidden');
  });
});

describe('isUnitVisibleInFog', () => {
  it('returns true if unit position is in visible set', () => {
    const visible = new Set(['3,3', '4,3']);
    expect(isUnitVisibleInFog({ x: 3, y: 3 }, visible)).toBe(true);
  });

  it('returns false if unit position is not visible', () => {
    const visible = new Set(['3,3']);
    expect(isUnitVisibleInFog({ x: 5, y: 5 }, visible)).toBe(false);
  });
});

describe('initializeFogMap', () => {
  it('starts all hidden then reveals around player units', () => {
    const map = makeMap(7, 7);
    const unit = makeUnit('ren', { x: 3, y: 3 });
    const { fogMap, visibleTiles } = initializeFogMap(map, [unit]);

    // Center should be visible
    expect(fogMap.get('3,3')).toBe('visible');
    // Far corner should be hidden
    expect(fogMap.get('0,0')).toBe('hidden');
    // All tiles accounted for
    expect(fogMap.size).toBe(49);
    expect(visibleTiles.has('3,3')).toBe(true);
  });

  it('empty player list means all hidden', () => {
    const map = makeMap(3, 3);
    const { fogMap } = initializeFogMap(map, []);
    for (const state of fogMap.values()) {
      expect(state).toBe('hidden');
    }
  });
});
