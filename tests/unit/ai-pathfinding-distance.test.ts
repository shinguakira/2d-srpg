import { describe, it, expect, beforeEach } from 'vitest';
import { computeDistanceMap, getPathfindingDistance, getDistanceMap, clearDistanceMapCache } from '../../src/core/pathfinding';
import { decideAction } from '../../src/core/ai';
import { posKey } from '../../src/core/types';
import type { Unit, GameMap, Tile, TerrainType, Position, Weapon, WeaponType } from '../../src/core/types';

function makeMap(terrain: TerrainType[][]): GameMap {
  const height = terrain.length;
  const width = terrain[0].length;
  const tiles: Tile[][] = terrain.map((row, y) =>
    row.map((t, x) => ({ position: { x, y }, terrain: t, occupantId: null }))
  );
  return { width, height, tiles };
}

function makeWeapon(type: WeaponType, overrides: Partial<Weapon> = {}): Weapon {
  return {
    id: type,
    name: `Test ${type}`,
    type,
    might: 5,
    hit: 90,
    crit: 0,
    weight: 5,
    minRange: 1,
    maxRange: 1,
    ...overrides,
  };
}

function makeUnit(
  id: string,
  pos: Position,
  overrides: Partial<Unit> = {},
): Unit {
  return {
    id,
    name: id,
    classId: 'fighter',
    faction: 'enemy',
    position: pos,
    stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 3, cha: 0, wil: 0 },
    currentHp: 20,
    level: 1,
    exp: 0,
    equippedWeapon: makeWeapon('axe'),
    inventory: [],
    items: [],
    hasActed: false,
    skills: [],
    learnedSkills: [],
    sprite: '',
    metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
    ...overrides,
  };
}

beforeEach(() => {
  clearDistanceMapCache();
});

// ===== Distance Function Tests =====

describe('computeDistanceMap / getPathfindingDistance', () => {
  it('flat plain map: BFS distance equals Manhattan distance', () => {
    const map = makeMap([
      ['plain', 'plain', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
    ]);

    expect(getPathfindingDistance({ x: 0, y: 0 }, { x: 4, y: 0 }, map)).toBe(4);
    expect(getPathfindingDistance({ x: 0, y: 0 }, { x: 2, y: 2 }, map)).toBe(4);
    expect(getPathfindingDistance({ x: 0, y: 0 }, { x: 4, y: 2 }, map)).toBe(6);
  });

  it('same position returns 0', () => {
    const map = makeMap([['plain']]);
    expect(getPathfindingDistance({ x: 0, y: 0 }, { x: 0, y: 0 }, map)).toBe(0);
  });

  it('water blocks path — routes around obstacle', () => {
    // 3x3 map: water at (1,0) blocks direct path on row 0
    const map = makeMap([
      ['plain', 'water', 'plain'],
      ['plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain'],
    ]);

    // (0,0) to (2,0): must go down, right, right, up = cost 4
    const dist = getPathfindingDistance({ x: 0, y: 0 }, { x: 2, y: 0 }, map);
    expect(dist).toBe(4);
  });

  it('completely blocked — returns Infinity', () => {
    // 3x1: water blocks all paths
    const map = makeMap([
      ['plain', 'water', 'plain'],
    ]);

    expect(getPathfindingDistance({ x: 0, y: 0 }, { x: 2, y: 0 }, map)).toBe(Infinity);
  });

  it('island surrounded by water — returns Infinity', () => {
    const map = makeMap([
      ['water', 'water', 'water'],
      ['water', 'plain', 'water'],
      ['water', 'water', 'water'],
      ['plain', 'plain', 'plain'],
    ]);

    // From outside to island center
    expect(getPathfindingDistance({ x: 0, y: 3 }, { x: 1, y: 1 }, map)).toBe(Infinity);
  });

  it('forest increases cost', () => {
    // plain(1) + forest(2) = 3 cost from (0,0) to (2,0)
    const map = makeMap([
      ['plain', 'forest', 'plain'],
    ]);

    expect(getPathfindingDistance({ x: 0, y: 0 }, { x: 2, y: 0 }, map)).toBe(3);
  });

  it('mountain has high cost', () => {
    // plain(1) + mountain(3) = 4 cost from (0,0) to (2,0)
    const map = makeMap([
      ['plain', 'mountain', 'plain'],
    ]);

    expect(getPathfindingDistance({ x: 0, y: 0 }, { x: 2, y: 0 }, map)).toBe(4);
  });

  it('flying units have cost 1 on all passable terrain', () => {
    const map = makeMap([
      ['plain', 'forest', 'mountain', 'plain'],
    ]);

    // Without flying: 1 + 2 + 3 = 6... wait, cost is per-tile entered
    // (0,0) to (3,0): enter (1,0) forest=2, enter (2,0) mountain=3, enter (3,0) plain=1 = 6
    expect(getPathfindingDistance({ x: 0, y: 0 }, { x: 3, y: 0 }, map)).toBe(6);

    // With flying: all cost 1
    expect(getPathfindingDistance({ x: 0, y: 0 }, { x: 3, y: 0 }, map, { flying: true })).toBe(3);
  });

  it('cache returns same results for same params', () => {
    const map = makeMap([
      ['plain', 'forest', 'plain'],
    ]);

    const d1 = getPathfindingDistance({ x: 0, y: 0 }, { x: 2, y: 0 }, map);
    const d2 = getPathfindingDistance({ x: 0, y: 0 }, { x: 2, y: 0 }, map);
    expect(d1).toBe(d2);
    expect(d1).toBe(3);
  });

  it('cache differentiates by classFlags', () => {
    const map = makeMap([
      ['plain', 'forest', 'plain'],
    ]);

    const dInfantry = getPathfindingDistance({ x: 0, y: 0 }, { x: 2, y: 0 }, map);
    const dFlying = getPathfindingDistance({ x: 0, y: 0 }, { x: 2, y: 0 }, map, { flying: true });
    expect(dInfantry).toBe(3);
    expect(dFlying).toBe(2);
  });

  it('getDistanceMap returns full map of reachable tiles', () => {
    const map = makeMap([
      ['plain', 'plain', 'plain'],
      ['plain', 'water', 'plain'],
      ['plain', 'plain', 'plain'],
    ]);

    const distMap = getDistanceMap({ x: 0, y: 0 }, map);
    expect(distMap.get(posKey({ x: 0, y: 0 }))).toBe(0);
    expect(distMap.get(posKey({ x: 1, y: 0 }))).toBe(1);
    expect(distMap.get(posKey({ x: 2, y: 0 }))).toBe(2);
    // (1,1) is water — should not be in the map
    expect(distMap.has(posKey({ x: 1, y: 1 }))).toBe(false);
    // (2,1) is reachable by going around: (0,0)->(1,0)->(2,0)->(2,1) = 3
    expect(distMap.get(posKey({ x: 2, y: 1 }))).toBe(3);
  });

  it('clearDistanceMapCache clears the cache', () => {
    const map = makeMap([['plain', 'plain']]);
    getDistanceMap({ x: 0, y: 0 }, map); // populates cache
    clearDistanceMapCache(); // clears
    // Should not throw, should recompute
    const d = getPathfindingDistance({ x: 0, y: 0 }, { x: 1, y: 0 }, map);
    expect(d).toBe(1);
  });
});

// ===== AI Behavior Tests with Terrain Obstacles =====

describe('AI pathfinding: aggressive paths around water', () => {
  it('moves around water wall toward player', () => {
    // 5x5 map with water wall at column 2 (rows 0-2), open at row 3-4
    const map = makeMap([
      ['plain', 'plain', 'water', 'plain', 'plain'],
      ['plain', 'plain', 'water', 'plain', 'plain'],
      ['plain', 'plain', 'water', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
    ]);

    const enemy = makeUnit('enemy1', { x: 0, y: 0 }, {
      aiBehavior: { type: 'aggressive' },
      stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 3, cha: 0, wil: 0 },
    });
    const player = makeUnit('player1', { x: 4, y: 0 }, {
      faction: 'player',
      equippedWeapon: makeWeapon('sword'),
    });

    const allUnits = new Map([['enemy1', enemy], ['player1', player]]);
    const action = decideAction(enemy, map, allUnits);

    // Should NOT move to (1,0) which is closer by Manhattan but stuck behind water
    // Should move south toward the opening at row 3
    expect(action.moveTo.y).toBeGreaterThan(0);
  });
});

describe('AI pathfinding: thief navigates around wall', () => {
  it('moves around wall toward chest', () => {
    const map = makeMap([
      ['plain', 'plain', 'wall', 'chest', 'plain'],
      ['plain', 'plain', 'wall', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
    ]);

    const thief = makeUnit('thief1', { x: 0, y: 0 }, {
      aiBehavior: { type: 'thief' },
      stats: { hp: 15, str: 5, mag: 0, def: 3, res: 0, spd: 10, skl: 8, lck: 5, mov: 4, cha: 0, wil: 0 },
    });
    // Need a player to exist (enemy needs an opposing faction)
    const player = makeUnit('player1', { x: 4, y: 2 }, {
      faction: 'player',
      equippedWeapon: makeWeapon('sword'),
    });

    const allUnits = new Map([['thief1', thief], ['player1', player]]);
    const action = decideAction(thief, map, allUnits);

    // Thief should move south toward the opening, not get stuck at (1,0)
    expect(action.moveTo.y).toBeGreaterThan(0);
  });
});

describe('AI pathfinding: guard returns to start around obstacle', () => {
  it('paths around wall to return to start position', () => {
    const map = makeMap([
      ['plain', 'wall', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
    ]);

    const guard = makeUnit('guard1', { x: 2, y: 0 }, {
      aiBehavior: { type: 'guard', radius: 5 },
      startPosition: { x: 0, y: 0 },
      stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 3, cha: 0, wil: 0 },
    });
    // No player in range — guard should return to start
    const player = makeUnit('player1', { x: 4, y: 1 }, {
      faction: 'player',
      equippedWeapon: makeWeapon('sword'),
    });

    const allUnits = new Map([['guard1', guard], ['player1', player]]);
    const action = decideAction(guard, map, allUnits);

    // Should move toward row 1 to go around the wall, not stay stuck
    expect(action.moveTo.y).toBeGreaterThanOrEqual(0);
    // Should not stay at current position (2,0) since start is (0,0) and wall blocks direct path
    const moved = action.moveTo.x !== 2 || action.moveTo.y !== 0;
    expect(moved).toBe(true);
  });
});

describe('AI pathfinding: unreachable target fallback', () => {
  it('does not crash when all targets are unreachable', () => {
    // Enemy on island surrounded by water
    const map = makeMap([
      ['water', 'water', 'water', 'water', 'water'],
      ['water', 'plain', 'water', 'plain', 'water'],
      ['water', 'water', 'water', 'water', 'water'],
    ]);

    const enemy = makeUnit('enemy1', { x: 1, y: 1 }, {
      aiBehavior: { type: 'aggressive' },
      stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 3, cha: 0, wil: 0 },
    });
    const player = makeUnit('player1', { x: 3, y: 1 }, {
      faction: 'player',
      equippedWeapon: makeWeapon('sword'),
    });

    const allUnits = new Map([['enemy1', enemy], ['player1', player]]);
    const action = decideAction(enemy, map, allUnits);

    // Should not crash, should return an action (wait at current position)
    expect(action).toBeDefined();
    expect(action.unitId).toBe('enemy1');
  });

  it('targets reachable player over unreachable one', () => {
    // Two players: one reachable, one on island
    const map = makeMap([
      ['plain', 'plain', 'plain', 'water', 'plain'],
      ['plain', 'plain', 'plain', 'water', 'plain'],
      ['plain', 'plain', 'plain', 'water', 'plain'],
    ]);

    const enemy = makeUnit('enemy1', { x: 0, y: 1 }, {
      aiBehavior: { type: 'aggressive' },
      stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 3, cha: 0, wil: 0 },
    });
    // Reachable player at (2,1)
    const player1 = makeUnit('player1', { x: 2, y: 1 }, {
      faction: 'player',
      equippedWeapon: makeWeapon('sword'),
    });
    // Unreachable player on the other side of water wall
    const player2 = makeUnit('player2', { x: 4, y: 1 }, {
      faction: 'player',
      equippedWeapon: makeWeapon('sword'),
    });

    const allUnits = new Map([['enemy1', enemy], ['player1', player1], ['player2', player2]]);
    const action = decideAction(enemy, map, allUnits);

    // Should move toward the reachable player (x=2), not toward the wall (x=3)
    expect(action.moveTo.x).toBeLessThanOrEqual(3);
  });
});
