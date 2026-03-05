import { describe, it, expect } from 'vitest';
import { decideAction } from '../../src/core/ai';
import type { Unit, GameMap, Tile, TerrainType, Position, AIBehavior, Weapon, WeaponType } from '../../src/core/types';

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
    stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 3 },
    currentHp: 20,
    level: 1,
    exp: 0,
    equippedWeapon: makeWeapon('axe'),
    inventory: [],
    items: [],
    hasActed: false,
    sprite: '',
    ...overrides,
  };
}

describe('AI behavior: stationary', () => {
  it('does not move even when target is in movement range', () => {
    // 7x1 row: enemy at x=3, player at x=5
    const map = makeMap([
      ['plain', 'plain', 'plain', 'plain', 'plain', 'plain', 'plain'],
    ]);

    const enemy = makeUnit('enemy1', { x: 3, y: 0 }, {
      aiBehavior: { type: 'stationary' },
      stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 5 },
    });
    const player = makeUnit('player1', { x: 5, y: 0 }, {
      faction: 'player',
      equippedWeapon: makeWeapon('sword'),
    });

    const allUnits = new Map([['enemy1', enemy], ['player1', player]]);
    const action = decideAction(enemy, map, allUnits);

    // Stationary unit should stay at its position
    expect(action.moveTo).toEqual({ x: 3, y: 0 });
    // Player is 2 tiles away, melee weapon range 1, so no attack
    expect(action.attackTargetId).toBeNull();
  });

  it('attacks target within weapon range without moving', () => {
    // Enemy at x=3, player at x=4 (adjacent, within melee range)
    const map = makeMap([
      ['plain', 'plain', 'plain', 'plain', 'plain'],
    ]);

    const enemy = makeUnit('enemy1', { x: 3, y: 0 }, {
      aiBehavior: { type: 'stationary' },
    });
    const player = makeUnit('player1', { x: 4, y: 0 }, {
      faction: 'player',
      equippedWeapon: makeWeapon('sword'),
    });

    const allUnits = new Map([['enemy1', enemy], ['player1', player]]);
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

    const enemy = makeUnit('guard1', { x: 2, y: 0 }, {
      aiBehavior: { type: 'guard', radius: 2 },
      startPosition: { x: 2, y: 0 },
      stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 5 },
    });
    const player = makeUnit('player1', { x: 7, y: 0 }, {
      faction: 'player',
      equippedWeapon: makeWeapon('sword'),
    });

    const allUnits = new Map([['guard1', enemy], ['player1', player]]);
    const action = decideAction(enemy, map, allUnits);

    // Guard cannot reach player (player at x=7, guard radius is 2 from x=2 → max x=4)
    // Guard should stay in place (or move within radius but not attack)
    const distFromStart = Math.abs(action.moveTo.x - 2) + Math.abs(action.moveTo.y - 0);
    expect(distFromStart).toBeLessThanOrEqual(2);
    expect(action.attackTargetId).toBeNull();
  });

  it('attacks target that enters guard radius', () => {
    // 7x1 row: enemy at x=2 (guard radius 2), player at x=4 (within guard zone)
    const map = makeMap([
      ['plain', 'plain', 'plain', 'plain', 'plain', 'plain', 'plain'],
    ]);

    const enemy = makeUnit('guard1', { x: 2, y: 0 }, {
      aiBehavior: { type: 'guard', radius: 2 },
      startPosition: { x: 2, y: 0 },
      stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 5 },
    });
    const player = makeUnit('player1', { x: 4, y: 0 }, {
      faction: 'player',
      equippedWeapon: makeWeapon('sword'),
    });

    const allUnits = new Map([['guard1', enemy], ['player1', player]]);
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

    const boss = makeUnit('boss1', { x: 2, y: 1 }, {
      aiBehavior: { type: 'boss' },
      stats: { hp: 30, str: 12, mag: 0, def: 8, res: 3, spd: 5, skl: 6, lck: 2, mov: 5 },
    });
    const player = makeUnit('player1', { x: 4, y: 1 }, {
      faction: 'player',
      equippedWeapon: makeWeapon('sword'),
    });

    const allUnits = new Map([['boss1', boss], ['player1', player]]);
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

    const boss = makeUnit('boss1', { x: 2, y: 1 }, {
      aiBehavior: { type: 'boss' },
    });
    const player = makeUnit('player1', { x: 3, y: 1 }, {
      faction: 'player',
      equippedWeapon: makeWeapon('sword'),
    });

    const allUnits = new Map([['boss1', boss], ['player1', player]]);
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

    const boss = makeUnit('boss1', { x: 1, y: 1 }, {
      aiBehavior: { type: 'boss' },
      stats: { hp: 30, str: 10, mag: 0, def: 8, res: 3, spd: 5, skl: 6, lck: 2, mov: 5 },
    });
    const lord = makeUnit('lord1', { x: 2, y: 1 }, {
      faction: 'player',
      isLord: true,
      equippedWeapon: makeWeapon('sword'),
      stats: { hp: 24, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 5 },
    });
    const regular = makeUnit('regular1', { x: 0, y: 1 }, {
      faction: 'player',
      equippedWeapon: makeWeapon('sword'),
      stats: { hp: 24, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 5 },
    });

    const allUnits = new Map([['boss1', boss], ['lord1', lord], ['regular1', regular]]);
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

    const enemy = makeUnit('enemy1', { x: 0, y: 0 }, {
      aiBehavior: { type: 'aggressive' },
    });
    const player = makeUnit('player1', { x: 8, y: 0 }, {
      faction: 'player',
      equippedWeapon: makeWeapon('sword'),
    });

    const allUnits = new Map([['enemy1', enemy], ['player1', player]]);
    const action = decideAction(enemy, map, allUnits);

    // Should move toward player (closer to x=8)
    expect(action.moveTo.x).toBeGreaterThan(0);
    expect(action.attackTargetId).toBeNull();
  });

  it('undefined behavior defaults to aggressive', () => {
    const map = makeMap([
      ['plain', 'plain', 'plain', 'plain', 'plain', 'plain', 'plain', 'plain', 'plain'],
    ]);

    const enemy = makeUnit('enemy1', { x: 0, y: 0 }, {
      // no aiBehavior set — should default to aggressive
    });
    const player = makeUnit('player1', { x: 8, y: 0 }, {
      faction: 'player',
      equippedWeapon: makeWeapon('sword'),
    });

    const allUnits = new Map([['enemy1', enemy], ['player1', player]]);
    const action = decideAction(enemy, map, allUnits);

    // Should move toward player like aggressive
    expect(action.moveTo.x).toBeGreaterThan(0);
  });
});
