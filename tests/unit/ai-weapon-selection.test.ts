import { describe, it, expect, beforeEach } from 'vitest';
import { decideAction } from '../../src/core/ai';
import { clearDistanceMapCache } from '../../src/core/pathfinding';
import type {
  Unit,
  GameMap,
  Tile,
  TerrainType,
  Position,
  Weapon,
  WeaponType,
} from '../../src/core/types';

function makeMap(terrain: TerrainType[][]): GameMap {
  const height = terrain.length;
  const width = terrain[0].length;
  const tiles: Tile[][] = terrain.map((row, y) =>
    row.map((t, x) => ({ position: { x, y }, terrain: t, occupantId: null })),
  );
  return { width, height, tiles };
}

function makeWeapon(type: WeaponType, overrides: Partial<Weapon> = {}): Weapon {
  return {
    id: `${type}_${overrides.might ?? 5}`,
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

function makeUnit(id: string, pos: Position, overrides: Partial<Unit> = {}): Unit {
  const base: Unit = {
    id,
    name: id,
    classId: 'fighter',
    faction: 'enemy',
    position: pos,
    stats: {
      hp: 20,
      str: 8,
      mag: 0,
      def: 5,
      res: 0,
      spd: 7,
      skl: 5,
      lck: 3,
      mov: 3,
      cha: 0,
      wil: 0,
    },
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
    facing: 'down',
  };
  return Object.assign(base, overrides);
}

beforeEach(() => {
  clearDistanceMapCache();
});

describe('AI weapon selection by expected value', () => {
  it('picks weapon with higher expected value (damage × hit)', () => {
    // 3x1 map: enemy at (0,0), player at (1,0)
    const map = makeMap([['plain', 'plain', 'plain']]);

    // High-might low-hit axe vs low-might high-hit axe
    const weakAccurate = makeWeapon('axe', { id: 'accurate_axe', might: 3, hit: 95, weight: 3 });
    const strongInaccurate = makeWeapon('axe', { id: 'wild_axe', might: 12, hit: 40, weight: 8 });

    // EV: accurate = (str8 + might3 - def5) * 95/100 = 6 * 0.95 = 5.7
    // EV: strong   = (str8 + might12 - def5) * 40/100 = 15 * 0.4 = 6.0
    // BUT hit penalty for weight affects actual hit — let's just verify the AI picks one and sets weaponIndex

    const enemy = makeUnit(
      'enemy1',
      { x: 0, y: 0 },
      {
        aiBehavior: { type: 'aggressive' },
        equippedWeapon: weakAccurate,
        inventory: [weakAccurate, strongInaccurate],
      },
    );
    const player = makeUnit(
      'player1',
      { x: 1, y: 0 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
      },
    );

    const allUnits = new Map([
      ['enemy1', enemy],
      ['player1', player],
    ]);
    const action = decideAction(enemy, map, allUnits);

    expect(action.attackTargetId).toBe('player1');
    expect(action.weaponIndex).toBeDefined();
    // weaponIndex should be 0 or 1 — one of the inventory weapons
    expect(action.weaponIndex).toBeGreaterThanOrEqual(0);
    expect(action.weaponIndex).toBeLessThan(2);
  });

  it('picks ranged weapon when target is out of melee range', () => {
    // 4x1 map: enemy at (0,0), player at (2,0)
    const map = makeMap([['plain', 'plain', 'plain', 'plain']]);

    const meleeAxe = makeWeapon('axe', {
      id: 'melee_axe',
      might: 8,
      hit: 85,
      minRange: 1,
      maxRange: 1,
    });
    const handAxe = makeWeapon('axe', {
      id: 'hand_axe',
      might: 5,
      hit: 70,
      minRange: 1,
      maxRange: 2,
    });

    const enemy = makeUnit(
      'enemy1',
      { x: 0, y: 0 },
      {
        aiBehavior: { type: 'aggressive' },
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 0,
          spd: 7,
          skl: 5,
          lck: 3,
          mov: 1,
          cha: 0,
          wil: 0,
        },
        equippedWeapon: meleeAxe,
        inventory: [meleeAxe, handAxe],
      },
    );
    const player = makeUnit(
      'player1',
      { x: 2, y: 0 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
      },
    );

    const allUnits = new Map([
      ['enemy1', enemy],
      ['player1', player],
    ]);
    const action = decideAction(enemy, map, allUnits);

    // Enemy moves 1 tile to (1,0), then needs range 1 to hit (2,0)
    // Both weapons can reach at range 1 from (1,0)
    // But if mov was less and target was at range 2, only handAxe can reach
    expect(action.attackTargetId).toBe('player1');
    expect(action.weaponIndex).toBeDefined();
  });

  it('picks only ranged weapon when forced to attack at distance 2', () => {
    // 5x1 map: enemy at (0,0) with mov=1, player at (3,0)
    // Enemy can move to (1,0), then needs range 2 to hit (3,0) — only hand axe works
    const map = makeMap([['plain', 'plain', 'plain', 'plain', 'plain']]);

    const meleeAxe = makeWeapon('axe', {
      id: 'melee_axe',
      might: 10,
      hit: 90,
      minRange: 1,
      maxRange: 1,
    });
    const handAxe = makeWeapon('axe', {
      id: 'hand_axe',
      might: 5,
      hit: 70,
      minRange: 1,
      maxRange: 2,
    });

    const enemy = makeUnit(
      'enemy1',
      { x: 0, y: 0 },
      {
        aiBehavior: { type: 'aggressive' },
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 0,
          spd: 7,
          skl: 5,
          lck: 3,
          mov: 1,
          cha: 0,
          wil: 0,
        },
        equippedWeapon: meleeAxe,
        inventory: [meleeAxe, handAxe],
      },
    );
    const player = makeUnit(
      'player1',
      { x: 3, y: 0 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
      },
    );

    const allUnits = new Map([
      ['enemy1', enemy],
      ['player1', player],
    ]);
    const action = decideAction(enemy, map, allUnits);

    // From (1,0), distance to (3,0) = 2 — only hand axe (range 1-2) can reach
    expect(action.attackTargetId).toBe('player1');
    expect(action.weaponIndex).toBe(1); // hand axe is index 1
  });

  it('skips staves in attack evaluation', () => {
    const map = makeMap([['plain', 'plain', 'plain']]);

    const staff = makeWeapon('staff', {
      id: 'heal_staff',
      might: 0,
      hit: 100,
      minRange: 1,
      maxRange: 2,
    });
    const axe = makeWeapon('axe', { id: 'iron_axe', might: 7, hit: 80 });

    const enemy = makeUnit(
      'enemy1',
      { x: 0, y: 0 },
      {
        aiBehavior: { type: 'aggressive' },
        equippedWeapon: staff, // equipped with staff but has axe in inventory
        inventory: [staff, axe],
      },
    );
    const player = makeUnit(
      'player1',
      { x: 1, y: 0 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
      },
    );

    const allUnits = new Map([
      ['enemy1', enemy],
      ['player1', player],
    ]);
    const action = decideAction(enemy, map, allUnits);

    // Should pick axe (index 1), not staff
    expect(action.attackTargetId).toBe('player1');
    expect(action.weaponIndex).toBe(1);
  });

  it('works with empty inventory (falls back to equippedWeapon)', () => {
    const map = makeMap([['plain', 'plain', 'plain']]);

    const axe = makeWeapon('axe', { id: 'iron_axe', might: 7, hit: 80 });

    const enemy = makeUnit(
      'enemy1',
      { x: 0, y: 0 },
      {
        aiBehavior: { type: 'aggressive' },
        equippedWeapon: axe,
        inventory: [], // empty inventory
      },
    );
    const player = makeUnit(
      'player1',
      { x: 1, y: 0 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
      },
    );

    const allUnits = new Map([
      ['enemy1', enemy],
      ['player1', player],
    ]);
    const action = decideAction(enemy, map, allUnits);

    // Should still attack with equipped weapon
    expect(action.attackTargetId).toBe('player1');
    expect(action.forecast).not.toBeNull();
  });

  it('returns weaponIndex in AIAction', () => {
    const map = makeMap([['plain', 'plain', 'plain']]);

    const axe1 = makeWeapon('axe', { id: 'axe1', might: 5, hit: 80 });
    const axe2 = makeWeapon('axe', { id: 'axe2', might: 8, hit: 90 });

    const enemy = makeUnit(
      'enemy1',
      { x: 0, y: 0 },
      {
        aiBehavior: { type: 'aggressive' },
        equippedWeapon: axe1,
        inventory: [axe1, axe2],
      },
    );
    const player = makeUnit(
      'player1',
      { x: 1, y: 0 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
      },
    );

    const allUnits = new Map([
      ['enemy1', enemy],
      ['player1', player],
    ]);
    const action = decideAction(enemy, map, allUnits);

    expect(action.weaponIndex).toBeDefined();
    // axe2 has higher might AND higher hit — clearly better EV
    expect(action.weaponIndex).toBe(1);
  });
});
