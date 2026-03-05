import { describe, it, expect } from 'vitest';
import { getDangerZone } from '../../src/core/pathfinding';
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
    classId: 'test',
    faction: 'enemy',
    position: pos,
    stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 2 },
    currentHp: 20,
    level: 1,
    exp: 0,
    equippedWeapon: makeWeapon('sword'),
    inventory: [],
    items: [],
    hasActed: false,
    sprite: '',
    ...overrides,
  };
}

describe('getDangerZone', () => {
  it('includes movement range + attack range of enemy', () => {
    // 5x5 map, enemy at center (2,2) with MOV 1, melee weapon
    const map = makeMap([
      ['plain', 'plain', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
    ]);

    const enemy = makeUnit('enemy1', { x: 2, y: 2 }, {
      stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 1 },
    });
    const allUnits = new Map([['enemy1', enemy]]);
    const dangerZone = getDangerZone([enemy], map, allUnits);

    // MOV 1: can reach (2,2), (1,2), (3,2), (2,1), (2,3) — 5 tiles
    // From each, attack tiles add 1 more ring
    // Center (2,2) is in danger zone
    expect(dangerZone.has('2,2')).toBe(true);
    // 1 tile away from center — in movement range
    expect(dangerZone.has('1,2')).toBe(true);
    expect(dangerZone.has('3,2')).toBe(true);
    // 2 tiles away from center — in attack range from movement range edge
    expect(dangerZone.has('0,2')).toBe(true);
    expect(dangerZone.has('4,2')).toBe(true);
    // 3 tiles away — should NOT be in danger zone for MOV 1 + range 1
    expect(dangerZone.has('2,2')).toBe(true); // center always in zone
  });

  it('handles multiple enemies', () => {
    const map = makeMap([
      ['plain', 'plain', 'plain', 'plain', 'plain', 'plain', 'plain'],
    ]);

    const enemy1 = makeUnit('enemy1', { x: 0, y: 0 }, {
      stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 1 },
    });
    const enemy2 = makeUnit('enemy2', { x: 6, y: 0 }, {
      stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 1 },
    });
    const allUnits = new Map([['enemy1', enemy1], ['enemy2', enemy2]]);
    const dangerZone = getDangerZone([enemy1, enemy2], map, allUnits);

    // Enemy1 at x=0 with MOV 1 + range 1 covers x=0,1,2
    expect(dangerZone.has('0,0')).toBe(true);
    expect(dangerZone.has('2,0')).toBe(true);

    // Enemy2 at x=6 with MOV 1 + range 1 covers x=4,5,6
    expect(dangerZone.has('6,0')).toBe(true);
    expect(dangerZone.has('4,0')).toBe(true);

    // Middle tile x=3 should NOT be covered by either
    expect(dangerZone.has('3,0')).toBe(false);
  });

  it('ranged weapons extend danger zone further', () => {
    const map = makeMap([
      ['plain', 'plain', 'plain', 'plain', 'plain', 'plain', 'plain'],
    ]);

    const rangedEnemy = makeUnit('archer', { x: 0, y: 0 }, {
      stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 1 },
      equippedWeapon: makeWeapon('fire', { minRange: 1, maxRange: 2 }),
    });
    const allUnits = new Map([['archer', rangedEnemy]]);
    const dangerZone = getDangerZone([rangedEnemy], map, allUnits);

    // MOV 1 + range 2 = can threaten up to 3 tiles away
    expect(dangerZone.has('3,0')).toBe(true);
    // 4 tiles away should be safe
    expect(dangerZone.has('4,0')).toBe(false);
  });

  it('returns empty set for no enemies', () => {
    const map = makeMap([
      ['plain', 'plain', 'plain'],
    ]);

    const dangerZone = getDangerZone([], map, new Map());
    expect(dangerZone.size).toBe(0);
  });
});
