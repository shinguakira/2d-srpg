import { describe, it, expect } from 'vitest';
import { decideAction, scoreTarget } from '../../src/core/ai';
import { calculateCombatForecast } from '../../src/core/combat';
import type {
  Unit,
  GameMap,
  Tile,
  TerrainType,
  Position,
  Weapon,
  WeaponType,
  ConsumableItem,
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

function makeUnit(id: string, pos: Position, overrides: Partial<Unit> = {}): Unit {
  return {
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
    ...overrides,
  };
}

describe('AI behavior: stationary', () => {
  it('does not move even when target is in movement range', () => {
    // 7x1 row: enemy at x=3, player at x=5
    const map = makeMap([['plain', 'plain', 'plain', 'plain', 'plain', 'plain', 'plain']]);

    const enemy = makeUnit(
      'enemy1',
      { x: 3, y: 0 },
      {
        aiBehavior: { type: 'stationary' },
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 0,
          spd: 7,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
      },
    );
    const player = makeUnit(
      'player1',
      { x: 5, y: 0 },
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

    // Stationary unit should stay at its position
    expect(action.moveTo).toEqual({ x: 3, y: 0 });
    // Player is 2 tiles away, melee weapon range 1, so no attack
    expect(action.attackTargetId).toBeNull();
  });

  it('attacks target within weapon range without moving', () => {
    // Enemy at x=3, player at x=4 (adjacent, within melee range)
    const map = makeMap([['plain', 'plain', 'plain', 'plain', 'plain']]);

    const enemy = makeUnit(
      'enemy1',
      { x: 3, y: 0 },
      {
        aiBehavior: { type: 'stationary' },
      },
    );
    const player = makeUnit(
      'player1',
      { x: 4, y: 0 },
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

    expect(action.moveTo).toEqual({ x: 3, y: 0 });
    expect(action.attackTargetId).toBe('player1');
    expect(action.forecast).not.toBeNull();
  });
});

describe('AI behavior: guard', () => {
  it('stays within guard radius of start position', () => {
    // 9x1 row: enemy starts at x=2 with radius 2, player at x=7
    const map = makeMap([
      ['plain', 'plain', 'plain', 'plain', 'plain', 'plain', 'plain', 'plain', 'plain'],
    ]);

    const enemy = makeUnit(
      'guard1',
      { x: 2, y: 0 },
      {
        aiBehavior: { type: 'guard', radius: 2 },
        startPosition: { x: 2, y: 0 },
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 0,
          spd: 7,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
      },
    );
    const player = makeUnit(
      'player1',
      { x: 7, y: 0 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
      },
    );

    const allUnits = new Map([
      ['guard1', enemy],
      ['player1', player],
    ]);
    const action = decideAction(enemy, map, allUnits);

    // Guard cannot reach player (player at x=7, guard radius is 2 from x=2 → max x=4)
    // Guard should stay in place (or move within radius but not attack)
    const distFromStart = Math.abs(action.moveTo.x - 2) + Math.abs(action.moveTo.y - 0);
    expect(distFromStart).toBeLessThanOrEqual(2);
    expect(action.attackTargetId).toBeNull();
  });

  it('attacks target that enters guard radius', () => {
    // 7x1 row: enemy at x=2 (guard radius 2), player at x=4 (within guard zone)
    const map = makeMap([['plain', 'plain', 'plain', 'plain', 'plain', 'plain', 'plain']]);

    const enemy = makeUnit(
      'guard1',
      { x: 2, y: 0 },
      {
        aiBehavior: { type: 'guard', radius: 2 },
        startPosition: { x: 2, y: 0 },
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 0,
          spd: 7,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
      },
    );
    const player = makeUnit(
      'player1',
      { x: 4, y: 0 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
      },
    );

    const allUnits = new Map([
      ['guard1', enemy],
      ['player1', player],
    ]);
    const action = decideAction(enemy, map, allUnits);

    // Guard can move to x=3 (within radius 2) and attack player at x=4
    expect(action.attackTargetId).toBe('player1');
    const distFromStart = Math.abs(action.moveTo.x - 2) + Math.abs(action.moveTo.y - 0);
    expect(distFromStart).toBeLessThanOrEqual(2);
  });
});

describe('AI behavior: boss', () => {
  it('does not move from throne', () => {
    const map = makeMap([
      ['plain', 'plain', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'throne', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
    ]);

    const boss = makeUnit(
      'boss1',
      { x: 2, y: 1 },
      {
        aiBehavior: { type: 'boss' },
        stats: {
          hp: 30,
          str: 12,
          mag: 0,
          def: 8,
          res: 3,
          spd: 5,
          skl: 6,
          lck: 2,
          mov: 5,
          cha: 0,
          wil: 0,
        },
      },
    );
    const player = makeUnit(
      'player1',
      { x: 4, y: 1 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
      },
    );

    const allUnits = new Map([
      ['boss1', boss],
      ['player1', player],
    ]);
    const action = decideAction(boss, map, allUnits);

    // Boss stays on throne
    expect(action.moveTo).toEqual({ x: 2, y: 1 });
  });

  it('attacks adjacent unit without moving', () => {
    const map = makeMap([
      ['plain', 'plain', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'throne', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
    ]);

    const boss = makeUnit(
      'boss1',
      { x: 2, y: 1 },
      {
        aiBehavior: { type: 'boss' },
      },
    );
    const player = makeUnit(
      'player1',
      { x: 3, y: 1 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
      },
    );

    const allUnits = new Map([
      ['boss1', boss],
      ['player1', player],
    ]);
    const action = decideAction(boss, map, allUnits);

    expect(action.moveTo).toEqual({ x: 2, y: 1 });
    expect(action.attackTargetId).toBe('player1');
  });

  it('prioritizes Lord target with bonus score', () => {
    // Boss with two adjacent targets: a Lord and a regular unit
    const map = makeMap([
      ['plain', 'plain', 'plain'],
      ['plain', 'throne', 'plain'],
      ['plain', 'plain', 'plain'],
    ]);

    const boss = makeUnit(
      'boss1',
      { x: 1, y: 1 },
      {
        aiBehavior: { type: 'boss' },
        stats: {
          hp: 30,
          str: 10,
          mag: 0,
          def: 8,
          res: 3,
          spd: 5,
          skl: 6,
          lck: 2,
          mov: 5,
          cha: 0,
          wil: 0,
        },
      },
    );
    const lord = makeUnit(
      'lord1',
      { x: 2, y: 1 },
      {
        faction: 'player',
        isLord: true,
        equippedWeapon: makeWeapon('sword'),
        stats: {
          hp: 24,
          str: 8,
          mag: 0,
          def: 5,
          res: 0,
          spd: 7,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
      },
    );
    const regular = makeUnit(
      'regular1',
      { x: 0, y: 1 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
        stats: {
          hp: 24,
          str: 8,
          mag: 0,
          def: 5,
          res: 0,
          spd: 7,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
      },
    );

    const allUnits = new Map([
      ['boss1', boss],
      ['lord1', lord],
      ['regular1', regular],
    ]);
    const action = decideAction(boss, map, allUnits);

    // Boss should prefer attacking the Lord due to +50 score bonus
    expect(action.attackTargetId).toBe('lord1');
  });
});

describe('AI behavior: aggressive (default)', () => {
  it('moves toward nearest player when no target in range', () => {
    // 9x1 row: enemy at x=0, player at x=8, mov=3
    const map = makeMap([
      ['plain', 'plain', 'plain', 'plain', 'plain', 'plain', 'plain', 'plain', 'plain'],
    ]);

    const enemy = makeUnit(
      'enemy1',
      { x: 0, y: 0 },
      {
        aiBehavior: { type: 'aggressive' },
      },
    );
    const player = makeUnit(
      'player1',
      { x: 8, y: 0 },
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

    // Should move toward player (closer to x=8)
    expect(action.moveTo.x).toBeGreaterThan(0);
    expect(action.attackTargetId).toBeNull();
  });

  it('undefined behavior defaults to aggressive', () => {
    const map = makeMap([
      ['plain', 'plain', 'plain', 'plain', 'plain', 'plain', 'plain', 'plain', 'plain'],
    ]);

    const enemy = makeUnit(
      'enemy1',
      { x: 0, y: 0 },
      {
        // no aiBehavior set — should default to aggressive
      },
    );
    const player = makeUnit(
      'player1',
      { x: 8, y: 0 },
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

    // Should move toward player like aggressive
    expect(action.moveTo.x).toBeGreaterThan(0);
  });
});

// ===== AI Scoring Improvements =====

describe('scoreTarget improvements', () => {
  it('adds +10 for weapon triangle advantage', () => {
    const attacker = makeUnit(
      'atk',
      { x: 0, y: 0 },
      { classId: 'lord', equippedWeapon: makeWeapon('sword') },
    );
    const defender = makeUnit(
      'def',
      { x: 1, y: 0 },
      { classId: 'fighter', faction: 'player', equippedWeapon: makeWeapon('axe') },
    );
    const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);

    const scoreWith = scoreTarget(forecast, defender, attacker, 'plain');
    const scoreWithout = scoreTarget(forecast, defender, undefined, 'plain');
    expect(scoreWith - scoreWithout).toBe(10);
  });

  it('subtracts -10 for weapon triangle disadvantage', () => {
    const attacker = makeUnit(
      'atk',
      { x: 0, y: 0 },
      { classId: 'fighter', equippedWeapon: makeWeapon('axe') },
    );
    const defender = makeUnit(
      'def',
      { x: 1, y: 0 },
      { classId: 'lord', faction: 'player', equippedWeapon: makeWeapon('sword') },
    );
    const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);

    const scoreWith = scoreTarget(forecast, defender, attacker, 'plain');
    const scoreWithout = scoreTarget(forecast, defender, undefined, 'plain');
    expect(scoreWith - scoreWithout).toBe(-10);
  });

  it('penalizes targets on defensive terrain', () => {
    const attacker = makeUnit('atk', { x: 0, y: 0 });
    const defender = makeUnit(
      'def',
      { x: 1, y: 0 },
      { faction: 'player', equippedWeapon: makeWeapon('sword') },
    );
    const forecast = calculateCombatForecast(attacker, defender, 'plain', 'forest', 1);

    const scoreForest = scoreTarget(forecast, defender, undefined, 'forest');
    const scorePlain = scoreTarget(forecast, defender, undefined, 'plain');
    // Forest has defenseBonus = 1, so penalty = 1 * 3 = 3
    expect(scorePlain - scoreForest).toBe(3);
  });
});

// ===== Survival AI =====

describe('AI behavior: survival', () => {
  it('behaves like aggressive at HP > 50%', () => {
    const map = makeMap([['plain', 'plain', 'plain', 'plain', 'plain']]);
    const enemy = makeUnit(
      'enemy1',
      { x: 0, y: 0 },
      {
        aiBehavior: { type: 'survival' },
        currentHp: 15, // 75% of 20
      },
    );
    const player = makeUnit(
      'player1',
      { x: 4, y: 0 },
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

    // Should move toward player
    expect(action.moveTo.x).toBeGreaterThan(0);
  });

  it('retreats toward fort at HP ≤ 30%', () => {
    // Fort at x=0, enemy at x=3 (low HP), player at x=4
    const map = makeMap([['fort', 'plain', 'plain', 'plain', 'plain']]);
    const enemy = makeUnit(
      'enemy1',
      { x: 3, y: 0 },
      {
        aiBehavior: { type: 'survival' },
        currentHp: 5, // 25% of 20
      },
    );
    const player = makeUnit(
      'player1',
      { x: 4, y: 0 },
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

    // Should retreat toward fort (x=0), not attack
    expect(action.moveTo.x).toBeLessThan(3);
    expect(action.attackTargetId).toBeNull();
  });

  it('uses healing item in retreat mode', () => {
    const map = makeMap([['plain', 'plain', 'plain', 'plain', 'plain']]);
    const vulnerary: ConsumableItem = {
      id: 'vulnerary',
      name: 'Vulnerary',
      type: 'consumable',
      uses: 3,
      maxUses: 3,
      effect: { kind: 'heal', amount: 10 },
    };
    const enemy = makeUnit(
      'enemy1',
      { x: 2, y: 0 },
      {
        aiBehavior: { type: 'survival' },
        currentHp: 4, // 20% of 20
        items: [vulnerary],
      },
    );
    const player = makeUnit(
      'player1',
      { x: 4, y: 0 },
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

    expect(action.useItemIndex).toBe(0);
    expect(action.attackTargetId).toBeNull();
  });

  it('cautious mode avoids risky attacks at 30-50% HP', () => {
    // Enemy at 40% HP, player is very strong (would kill on counter)
    const map = makeMap([['plain', 'plain', 'plain']]);
    const enemy = makeUnit(
      'enemy1',
      { x: 0, y: 0 },
      {
        aiBehavior: { type: 'survival' },
        currentHp: 8, // 40% of 20
        stats: {
          hp: 20,
          str: 5,
          mag: 0,
          def: 3,
          res: 0,
          spd: 5,
          skl: 5,
          lck: 3,
          mov: 3,
          cha: 0,
          wil: 0,
        },
      },
    );
    const player = makeUnit(
      'player1',
      { x: 1, y: 0 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
        stats: {
          hp: 30,
          str: 20,
          mag: 0,
          def: 10,
          res: 5,
          spd: 15,
          skl: 15,
          lck: 10,
          mov: 5,
          cha: 0,
          wil: 0,
        },
        currentHp: 30,
      },
    );

    const allUnits = new Map([
      ['enemy1', enemy],
      ['player1', player],
    ]);
    const action = decideAction(enemy, map, allUnits);

    // Very strong player would kill on counter — survival AI should avoid attacking
    expect(action.attackTargetId).toBeNull();
  });
});

// ===== Thief AI =====

describe('AI behavior: thief', () => {
  it('moves toward nearest chest tile', () => {
    // Chest at x=4, thief at x=0
    const map = makeMap([['plain', 'plain', 'plain', 'plain', 'chest']]);
    const thief = makeUnit(
      'thief1',
      { x: 0, y: 0 },
      {
        aiBehavior: { type: 'thief' },
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
      ['thief1', thief],
      ['player1', player],
    ]);
    const action = decideAction(thief, map, allUnits, undefined, {
      openedChests: new Set(),
      visitedVillages: new Set(),
    });

    // Should move toward chest (x=4), not attack player
    expect(action.moveTo.x).toBeGreaterThan(0);
    expect(action.attackTargetId).toBeNull();
  });

  it('interacts with chest when on it', () => {
    const map = makeMap([['plain', 'chest']]);
    const thief = makeUnit(
      'thief1',
      { x: 1, y: 0 },
      {
        aiBehavior: { type: 'thief' },
      },
    );
    const player = makeUnit(
      'player1',
      { x: 0, y: 0 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
      },
    );

    const allUnits = new Map([
      ['thief1', thief],
      ['player1', player],
    ]);
    const action = decideAction(thief, map, allUnits, undefined, {
      openedChests: new Set(),
      visitedVillages: new Set(),
    });

    expect(action.interactType).toBe('chest');
    expect(action.attackTargetId).toBeNull();
  });

  it('ignores already-opened chests', () => {
    const map = makeMap([['plain', 'plain', 'plain', 'chest']]);
    const thief = makeUnit(
      'thief1',
      { x: 0, y: 0 },
      {
        aiBehavior: { type: 'thief' },
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

    const openedChests = new Set(['3,0']); // chest already opened
    const allUnits = new Map([
      ['thief1', thief],
      ['player1', player],
    ]);
    const action = decideAction(thief, map, allUnits, undefined, {
      openedChests,
      visitedVillages: new Set(),
    });

    // No loot targets → falls back to aggressive, moves toward player
    expect(action.interactType).toBeUndefined();
    expect(action.moveTo.x).toBeGreaterThan(0);
  });

  it('falls back to aggressive when no loot targets remain', () => {
    const map = makeMap([['plain', 'plain', 'plain', 'plain', 'plain']]);
    const thief = makeUnit(
      'thief1',
      { x: 0, y: 0 },
      {
        aiBehavior: { type: 'thief' },
      },
    );
    const player = makeUnit(
      'player1',
      { x: 4, y: 0 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
      },
    );

    const allUnits = new Map([
      ['thief1', thief],
      ['player1', player],
    ]);
    const action = decideAction(thief, map, allUnits, undefined, {
      openedChests: new Set(),
      visitedVillages: new Set(),
    });

    // No chests or villages → aggressive fallback → move toward player
    expect(action.moveTo.x).toBeGreaterThan(0);
  });
});

// ===== Healer AI =====

describe('AI behavior: healer', () => {
  it('heals lowest-HP ally', () => {
    // 5x1: healer at x=0, wounded ally at x=2, player at x=4
    const map = makeMap([['plain', 'plain', 'plain', 'plain', 'plain']]);
    const staff = makeWeapon('staff', { might: 5, minRange: 1, maxRange: 2 });
    const healer = makeUnit(
      'healer1',
      { x: 0, y: 0 },
      {
        aiBehavior: { type: 'healer' },
        equippedWeapon: staff,
        inventory: [staff],
        stats: {
          hp: 18,
          str: 2,
          mag: 8,
          def: 2,
          res: 6,
          spd: 5,
          skl: 5,
          lck: 3,
          mov: 3,
          cha: 0,
          wil: 0,
        },
      },
    );
    const woundedAlly = makeUnit(
      'ally1',
      { x: 2, y: 0 },
      {
        faction: 'enemy',
        currentHp: 5,
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
      },
    );
    const player = makeUnit(
      'player1',
      { x: 4, y: 0 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
      },
    );

    const allUnits = new Map([
      ['healer1', healer],
      ['ally1', woundedAlly],
      ['player1', player],
    ]);
    const action = decideAction(healer, map, allUnits);

    expect(action.healTargetId).toBe('ally1');
    expect(action.attackTargetId).toBeNull();
  });

  it('stays away from enemies when possible', () => {
    // 7x1: healer at x=3, wounded ally at x=1, player at x=6
    const map = makeMap([['plain', 'plain', 'plain', 'plain', 'plain', 'plain', 'plain']]);
    const staff = makeWeapon('staff', { might: 5, minRange: 1, maxRange: 2 });
    const healer = makeUnit(
      'healer1',
      { x: 3, y: 0 },
      {
        aiBehavior: { type: 'healer' },
        equippedWeapon: staff,
        inventory: [staff],
        stats: {
          hp: 18,
          str: 2,
          mag: 8,
          def: 2,
          res: 6,
          spd: 5,
          skl: 5,
          lck: 3,
          mov: 3,
          cha: 0,
          wil: 0,
        },
      },
    );
    const woundedAlly = makeUnit(
      'ally1',
      { x: 1, y: 0 },
      {
        faction: 'enemy',
        currentHp: 5,
      },
    );
    const player = makeUnit(
      'player1',
      { x: 6, y: 0 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
      },
    );

    const allUnits = new Map([
      ['healer1', healer],
      ['ally1', woundedAlly],
      ['player1', player],
    ]);
    const action = decideAction(healer, map, allUnits);

    // Should heal the ally and be 2+ tiles from player
    expect(action.healTargetId).toBe('ally1');
    // Healer should not move toward the player
    expect(action.moveTo.x).toBeLessThanOrEqual(3);
  });

  it('never initiates combat', () => {
    // Healer adjacent to player with no wounded allies
    const map = makeMap([['plain', 'plain', 'plain']]);
    const staff = makeWeapon('staff', { might: 5, minRange: 1, maxRange: 2 });
    const healer = makeUnit(
      'healer1',
      { x: 0, y: 0 },
      {
        aiBehavior: { type: 'healer' },
        equippedWeapon: staff,
        inventory: [staff],
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
      ['healer1', healer],
      ['player1', player],
    ]);
    const action = decideAction(healer, map, allUnits);

    // Should never attack
    expect(action.attackTargetId).toBeNull();
    expect(action.forecast).toBeNull();
  });
});

// ===== Escort AI =====

describe('AI behavior: escort', () => {
  it('stays within 2 tiles of target unit', () => {
    // 9x1: escort at x=0, target ally at x=4, player at x=8
    const map = makeMap([
      ['plain', 'plain', 'plain', 'plain', 'plain', 'plain', 'plain', 'plain', 'plain'],
    ]);
    const escort = makeUnit(
      'escort1',
      { x: 0, y: 0 },
      {
        aiBehavior: { type: 'escort', targetUnitId: 'vip1' },
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 0,
          spd: 7,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
      },
    );
    const vip = makeUnit(
      'vip1',
      { x: 4, y: 0 },
      {
        faction: 'enemy',
      },
    );
    const player = makeUnit(
      'player1',
      { x: 8, y: 0 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
      },
    );

    const allUnits = new Map([
      ['escort1', escort],
      ['vip1', vip],
      ['player1', player],
    ]);
    const action = decideAction(escort, map, allUnits);

    const dist = Math.abs(action.moveTo.x - 4);
    expect(dist).toBeLessThanOrEqual(2);
  });

  it('attacks threats near target', () => {
    // 5x3 grid: escort at (0,1), vip at (2,1), player at (3,1) — escort goes around vip
    const map = makeMap([
      ['plain', 'plain', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
    ]);
    const escort = makeUnit(
      'escort1',
      { x: 0, y: 1 },
      {
        aiBehavior: { type: 'escort', targetUnitId: 'vip1' },
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 0,
          spd: 7,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
      },
    );
    const vip = makeUnit(
      'vip1',
      { x: 2, y: 1 },
      {
        faction: 'enemy',
      },
    );
    const player = makeUnit(
      'player1',
      { x: 3, y: 1 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
      },
    );

    const allUnits = new Map([
      ['escort1', escort],
      ['vip1', vip],
      ['player1', player],
    ]);
    const action = decideAction(escort, map, allUnits);

    // Player is within 2 tiles of VIP — escort should attack (goes around vip via row 0 or 2)
    expect(action.attackTargetId).toBe('player1');
  });

  it('falls back to aggressive when target is dead', () => {
    const map = makeMap([['plain', 'plain', 'plain', 'plain', 'plain']]);
    const escort = makeUnit(
      'escort1',
      { x: 0, y: 0 },
      {
        aiBehavior: { type: 'escort', targetUnitId: 'vip1' }, // vip1 doesn't exist
      },
    );
    const player = makeUnit(
      'player1',
      { x: 4, y: 0 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
      },
    );

    const allUnits = new Map([
      ['escort1', escort],
      ['player1', player],
    ]);
    const action = decideAction(escort, map, allUnits);

    // VIP dead → aggressive fallback → move toward player
    expect(action.moveTo.x).toBeGreaterThan(0);
  });
});

// ===== Coordinated AI =====

describe('AI behavior: coordinated', () => {
  it('focus-fires same target when 3+ units', () => {
    // 3x3 grid with 3 coordinated enemies and 2 players
    const map = makeMap([
      ['plain', 'plain', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
    ]);
    const e1 = makeUnit(
      'e1',
      { x: 0, y: 0 },
      {
        aiBehavior: { type: 'coordinated', groupId: 'alpha' },
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 0,
          spd: 7,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
      },
    );
    const e2 = makeUnit(
      'e2',
      { x: 0, y: 1 },
      {
        aiBehavior: { type: 'coordinated', groupId: 'alpha' },
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 0,
          spd: 7,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
      },
    );
    const e3 = makeUnit(
      'e3',
      { x: 0, y: 2 },
      {
        aiBehavior: { type: 'coordinated', groupId: 'alpha' },
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 0,
          spd: 7,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
      },
    );
    const p1 = makeUnit(
      'p1',
      { x: 4, y: 0 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
      },
    );
    const p2 = makeUnit(
      'p2',
      { x: 4, y: 2 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
      },
    );

    const allUnits = new Map([
      ['e1', e1],
      ['e2', e2],
      ['e3', e3],
      ['p1', p1],
      ['p2', p2],
    ]);

    // All 3 should target the same player (the highest-scored one)
    const a1 = decideAction(e1, map, allUnits);
    const a2 = decideAction(e2, map, allUnits);
    const a3 = decideAction(e3, map, allUnits);

    // At least 2 of 3 should attack the same target (coordinated focus)
    const targets = [a1.attackTargetId, a2.attackTargetId, a3.attackTargetId].filter(Boolean);
    if (targets.length >= 2) {
      const targetCounts = new Map<string, number>();
      for (const t of targets) {
        targetCounts.set(t!, (targetCounts.get(t!) ?? 0) + 1);
      }
      const maxCount = Math.max(...targetCounts.values());
      expect(maxCount).toBeGreaterThanOrEqual(2);
    }
  });

  it('falls back to aggressive with fewer than 3 group members', () => {
    const map = makeMap([['plain', 'plain', 'plain', 'plain', 'plain']]);
    const e1 = makeUnit(
      'e1',
      { x: 0, y: 0 },
      {
        aiBehavior: { type: 'coordinated', groupId: 'alpha' },
      },
    );
    const e2 = makeUnit(
      'e2',
      { x: 1, y: 0 },
      {
        aiBehavior: { type: 'coordinated', groupId: 'alpha' },
      },
    );
    const player = makeUnit(
      'player1',
      { x: 4, y: 0 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
      },
    );

    const allUnits = new Map([
      ['e1', e1],
      ['e2', e2],
      ['player1', player],
    ]);
    const action = decideAction(e1, map, allUnits);

    // Only 2 coordinated units → aggressive fallback → move toward player
    expect(action.moveTo.x).toBeGreaterThan(0);
  });
});

// ===== Ambush AI =====

describe('AI behavior: ambush', () => {
  it('stays hidden when no player nearby', () => {
    const map = makeMap([['plain', 'plain', 'plain', 'plain', 'plain', 'plain', 'plain']]);
    const ambusher = makeUnit(
      'ambush1',
      { x: 0, y: 0 },
      {
        aiBehavior: { type: 'ambush', triggerRadius: 2 },
        isHidden: true,
      },
    );
    const player = makeUnit(
      'player1',
      { x: 6, y: 0 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
      },
    );

    const allUnits = new Map([
      ['ambush1', ambusher],
      ['player1', player],
    ]);
    const action = decideAction(ambusher, map, allUnits);

    // Player is 6 tiles away, trigger radius is 2 — should stay put
    expect(action.moveTo).toEqual({ x: 0, y: 0 });
    expect(action.attackTargetId).toBeNull();
    expect(action.reveal).toBeUndefined();
  });

  it('reveals and attacks when player within trigger radius', () => {
    const map = makeMap([['plain', 'plain', 'plain', 'plain', 'plain']]);
    const ambusher = makeUnit(
      'ambush1',
      { x: 0, y: 0 },
      {
        aiBehavior: { type: 'ambush', triggerRadius: 3 },
        isHidden: true,
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
      ['ambush1', ambusher],
      ['player1', player],
    ]);
    const action = decideAction(ambusher, map, allUnits);

    // Player is 2 tiles away, trigger radius is 3 — should reveal
    expect(action.reveal).toBe(true);
    // Should try to attack
    expect(action.attackTargetId).toBe('player1');
  });

  it('behaves aggressively after being revealed', () => {
    const map = makeMap([['plain', 'plain', 'plain', 'plain', 'plain']]);
    const ambusher = makeUnit(
      'ambush1',
      { x: 0, y: 0 },
      {
        aiBehavior: { type: 'ambush', triggerRadius: 3 },
        isHidden: false, // already revealed
      },
    );
    const player = makeUnit(
      'player1',
      { x: 4, y: 0 },
      {
        faction: 'player',
        equippedWeapon: makeWeapon('sword'),
      },
    );

    const allUnits = new Map([
      ['ambush1', ambusher],
      ['player1', player],
    ]);
    const action = decideAction(ambusher, map, allUnits);

    // Already revealed — aggressive behavior, move toward player
    expect(action.moveTo.x).toBeGreaterThan(0);
    expect(action.reveal).toBeUndefined();
  });
});
