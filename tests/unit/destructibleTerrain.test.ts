import { describe, it, expect } from 'vitest';
import {
  getDestructibleConfig,
  calcTerrainDamage,
  canAttackTerrain,
  resolveBridgeCollapse,
} from '../../src/core/destructibleTerrain';
import type { Unit, GameMap } from '../../src/core/types';

function makeUnit(overrides: Partial<Unit> = {}): Unit {
  return {
    id: 'u1',
    name: 'Test',
    classId: 'fighter',
    faction: 'player',
    level: 1,
    exp: 0,
    position: { x: 0, y: 0 },
    startPosition: { x: 0, y: 0 },
    stats: { hp: 30, str: 10, mag: 0, skl: 5, spd: 5, lck: 5, def: 5, res: 5, mov: 5, con: 10 },
    currentHp: 30,
    hasActed: false,
    equippedWeapon: {
      id: 'iron_axe',
      name: 'Iron Axe',
      type: 'axe',
      might: 8,
      hit: 80,
      crit: 0,
      weight: 8,
      minRange: 1,
      maxRange: 1,
    },
    inventory: [],
    items: [],
    metaStats: { crp: 0, sta: 50, loy: 50, awr: 50, sync: 50, loop: 100 },
    ...overrides,
  } as Unit;
}

function makeMap(width: number, height: number, terrain: string = 'plain'): GameMap {
  const tiles = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({
      terrain: terrain as any,
      occupantId: null,
    })),
  );
  return { width, height, tiles } as GameMap;
}

describe('getDestructibleConfig', () => {
  it('wall → rubble with 30 HP', () => {
    const config = getDestructibleConfig('wall');
    expect(config).toEqual({ hp: 30, destroyedTerrain: 'rubble' });
  });

  it('bridge → water with 20 HP', () => {
    const config = getDestructibleConfig('bridge');
    expect(config).toEqual({ hp: 20, destroyedTerrain: 'water' });
  });

  it('door → indoor with 15 HP', () => {
    const config = getDestructibleConfig('door');
    expect(config).toEqual({ hp: 15, destroyedTerrain: 'indoor' });
  });

  it('forest → plain with 20 HP', () => {
    const config = getDestructibleConfig('forest');
    expect(config).toEqual({ hp: 20, destroyedTerrain: 'plain' });
  });

  it('plain is not destructible', () => {
    expect(getDestructibleConfig('plain')).toBeNull();
  });

  it('fort is not destructible', () => {
    expect(getDestructibleConfig('fort')).toBeNull();
  });
});

describe('calcTerrainDamage', () => {
  it('STR + weapon might', () => {
    const unit = makeUnit({
      equippedWeapon: {
        id: 'w',
        name: 'W',
        type: 'sword',
        might: 7,
        hit: 90,
        crit: 0,
        weight: 5,
        minRange: 1,
        maxRange: 1,
      },
    });
    expect(calcTerrainDamage(unit)).toBe(10 + 7); // STR 10 + might 7
  });

  it('axe gets +5 bonus', () => {
    const unit = makeUnit(); // default has axe with might 8
    expect(calcTerrainDamage(unit)).toBe(10 + 8 + 5); // STR 10 + might 8 + axe bonus 5
  });

  it('non-axe weapons get no bonus', () => {
    const unit = makeUnit({
      equippedWeapon: {
        id: 'w',
        name: 'W',
        type: 'lance',
        might: 7,
        hit: 90,
        crit: 0,
        weight: 5,
        minRange: 1,
        maxRange: 1,
      },
    });
    expect(calcTerrainDamage(unit)).toBe(10 + 7);
  });
});

describe('canAttackTerrain', () => {
  it('can attack wall', () => {
    const unit = makeUnit();
    expect(canAttackTerrain(unit, 'wall')).toBe(true);
  });

  it('can attack door', () => {
    const unit = makeUnit();
    expect(canAttackTerrain(unit, 'door')).toBe(true);
  });

  it('can attack bridge', () => {
    const unit = makeUnit();
    expect(canAttackTerrain(unit, 'bridge')).toBe(true);
  });

  it('forest requires fire magic', () => {
    const unit = makeUnit(); // has axe
    expect(canAttackTerrain(unit, 'forest')).toBe(false);
  });

  it('forest with fire magic is allowed', () => {
    const unit = makeUnit({
      equippedWeapon: {
        id: 'w',
        name: 'Fire',
        type: 'fire',
        might: 5,
        hit: 90,
        crit: 0,
        weight: 3,
        minRange: 1,
        maxRange: 2,
      },
    });
    expect(canAttackTerrain(unit, 'forest')).toBe(true);
  });

  it('cannot attack plain', () => {
    const unit = makeUnit();
    expect(canAttackTerrain(unit, 'plain')).toBe(false);
  });
});

describe('resolveBridgeCollapse', () => {
  it('unit on collapsed bridge takes 10 damage and is displaced', () => {
    const map = makeMap(3, 3);
    map.tiles[1][1] = { ...map.tiles[1][1], terrain: 'bridge' as any };
    map.tiles[1][1].occupantId = 'u1';
    const unit = makeUnit({ position: { x: 1, y: 1 } });
    const units = new Map([['u1', unit]]);

    const results = resolveBridgeCollapse({ x: 1, y: 1 }, map, units, () => ({}));

    expect(results).toHaveLength(1);
    expect(results[0].unitId).toBe('u1');
    expect(results[0].damage).toBe(10);
    expect(results[0].displacedTo).not.toBeNull();
  });

  it('flying unit is safe from bridge collapse', () => {
    const map = makeMap(3, 3);
    map.tiles[1][1] = { ...map.tiles[1][1], terrain: 'bridge' as any };
    map.tiles[1][1].occupantId = 'u1';
    const unit = makeUnit({ position: { x: 1, y: 1 } });
    const units = new Map([['u1', unit]]);

    const results = resolveBridgeCollapse({ x: 1, y: 1 }, map, units, () => ({ flying: true }));

    expect(results).toHaveLength(0);
  });

  it('displaced to adjacent land tile', () => {
    const map = makeMap(3, 3);
    // Surround bridge with water except one tile
    map.tiles[0][1] = { ...map.tiles[0][1], terrain: 'water' as any };
    map.tiles[1][0] = { ...map.tiles[1][0], terrain: 'water' as any };
    map.tiles[1][2] = { ...map.tiles[1][2], terrain: 'water' as any };
    map.tiles[1][1] = { ...map.tiles[1][1], terrain: 'bridge' as any };
    map.tiles[1][1].occupantId = 'u1';
    // tiles[2][1] is still plain — only escape

    const unit = makeUnit({ position: { x: 1, y: 1 } });
    const units = new Map([['u1', unit]]);

    const results = resolveBridgeCollapse({ x: 1, y: 1 }, map, units, () => ({}));

    expect(results[0].displacedTo).toEqual({ x: 1, y: 2 });
  });

  it('no adjacent land: displaced to null', () => {
    const map = makeMap(3, 3, 'water');
    map.tiles[1][1] = { ...map.tiles[1][1], terrain: 'bridge' as any };
    map.tiles[1][1].occupantId = 'u1';

    const unit = makeUnit({ position: { x: 1, y: 1 } });
    const units = new Map([['u1', unit]]);

    const results = resolveBridgeCollapse({ x: 1, y: 1 }, map, units, () => ({}));

    expect(results[0].displacedTo).toBeNull();
  });
});
