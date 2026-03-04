import { describe, it, expect } from 'vitest';
import { getMovementRange, getPath, getAttackTilesFrom, getFullAttackRange } from '../../src/core/pathfinding';
import type { Unit, GameMap, Tile, TerrainType, Position } from '../../src/core/types';
import { posKey } from '../../src/core/types';

// Helper to build a simple map from a terrain grid
function makeMap(terrain: TerrainType[][]): GameMap {
  const height = terrain.length;
  const width = terrain[0].length;
  const tiles: Tile[][] = terrain.map((row, y) =>
    row.map((t, x) => ({ position: { x, y }, terrain: t, occupantId: null }))
  );
  return { width, height, tiles };
}

// Helper to make a minimal unit at a position
function makeUnit(id: string, pos: Position, mov: number, faction: 'player' | 'enemy' = 'player'): Unit {
  return {
    id,
    name: id,
    classId: 'test',
    faction,
    position: pos,
    stats: { hp: 20, str: 5, mag: 0, def: 5, res: 0, spd: 5, skl: 5, lck: 5, mov },
    currentHp: 20,
    level: 1,
    exp: 0,
    equippedWeapon: { id: 'sword', name: 'Sword', type: 'sword', might: 5, hit: 90, crit: 0, weight: 5, minRange: 1, maxRange: 1 },
    inventory: [],
    hasActed: false,
    sprite: '',
  };
}

describe('getMovementRange', () => {
  it('returns correct range on flat plain', () => {
    // 5x5 all-plain map, unit at center with MOV 2
    const map = makeMap([
      ['plain', 'plain', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
    ]);
    const unit = makeUnit('hero', { x: 2, y: 2 }, 2);
    const units = new Map([['hero', unit]]);

    const range = getMovementRange(unit, map, units);

    // With MOV 2 on plain (cost 1), should reach diamond of radius 2
    expect(range.has('2,2')).toBe(true); // center
    expect(range.has('2,0')).toBe(true); // 2 up
    expect(range.has('2,4')).toBe(true); // 2 down
    expect(range.has('0,2')).toBe(true); // 2 left
    expect(range.has('4,2')).toBe(true); // 2 right
    expect(range.has('1,1')).toBe(true); // diagonal
    expect(range.has('3,3')).toBe(true); // diagonal

    // Should NOT reach 3 tiles away
    expect(range.has('2,5')).toBe(false); // out of bounds anyway
    expect(range.has('0,0')).toBe(false); // 4 manhattan distance
  });

  it('respects terrain movement costs', () => {
    const map = makeMap([
      ['plain', 'plain', 'plain'],
      ['plain', 'forest', 'plain'],
      ['plain', 'plain', 'plain'],
    ]);
    const unit = makeUnit('hero', { x: 0, y: 1 }, 2);
    const units = new Map([['hero', unit]]);

    const range = getMovementRange(unit, map, units);

    // Forest costs 2, so with MOV 2 can enter forest but not go further
    expect(range.has('1,1')).toBe(true);  // forest tile (cost 2)
    expect(range.has('2,1')).toBe(false); // past forest, would need MOV 3
  });

  it('blocks movement through water/walls', () => {
    // Surround unit so water/wall fully blocks
    const map = makeMap([
      ['plain', 'water', 'plain'],
      ['water', 'water', 'plain'],
      ['plain', 'wall', 'plain'],
    ]);
    const unit = makeUnit('hero', { x: 0, y: 0 }, 5);
    const units = new Map([['hero', unit]]);

    const range = getMovementRange(unit, map, units);

    expect(range.has('0,0')).toBe(true);  // start position
    expect(range.has('1,0')).toBe(false); // water
    expect(range.has('0,1')).toBe(false); // water
    expect(range.has('1,1')).toBe(false); // water
    expect(range.has('2,0')).toBe(false); // unreachable behind water
    expect(range.has('1,2')).toBe(false); // wall
  });

  it('cannot pass through enemy units', () => {
    const map = makeMap([
      ['plain', 'plain', 'plain', 'plain', 'plain'],
    ]);
    const hero = makeUnit('hero', { x: 0, y: 0 }, 4);
    const enemy = makeUnit('enemy1', { x: 2, y: 0 }, 3, 'enemy');
    const units = new Map([['hero', hero], ['enemy1', enemy]]);

    const range = getMovementRange(hero, map, units);

    expect(range.has('1,0')).toBe(true);  // before enemy
    expect(range.has('2,0')).toBe(false); // enemy tile
    expect(range.has('3,0')).toBe(false); // past enemy (blocked)
  });

  it('can pass through allied units but not stop on them', () => {
    const map = makeMap([
      ['plain', 'plain', 'plain', 'plain', 'plain'],
    ]);
    const hero = makeUnit('hero', { x: 0, y: 0 }, 4);
    const ally = makeUnit('ally1', { x: 2, y: 0 }, 3, 'player');
    const units = new Map([['hero', hero], ['ally1', ally]]);

    const range = getMovementRange(hero, map, units);

    expect(range.has('1,0')).toBe(true);  // before ally
    expect(range.has('2,0')).toBe(false); // can't stop on ally
    expect(range.has('3,0')).toBe(true);  // past ally (can pass through)
    expect(range.has('4,0')).toBe(true);  // further past ally
  });
});

describe('getPath', () => {
  it('returns direct path on flat map', () => {
    const map = makeMap([
      ['plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain'],
    ]);
    const unit = makeUnit('hero', { x: 0, y: 0 }, 5);
    const units = new Map([['hero', unit]]);

    const path = getPath({ x: 0, y: 0 }, { x: 2, y: 0 }, unit, map, units);

    expect(path.length).toBe(3);
    expect(posKey(path[0])).toBe('0,0');
    expect(posKey(path[path.length - 1])).toBe('2,0');
  });

  it('returns empty path for unreachable destination', () => {
    const map = makeMap([
      ['plain', 'water', 'plain'],
    ]);
    const unit = makeUnit('hero', { x: 0, y: 0 }, 5);
    const units = new Map([['hero', unit]]);

    const path = getPath({ x: 0, y: 0 }, { x: 2, y: 0 }, unit, map, units);
    expect(path.length).toBe(0);
  });

  it('routes around obstacles', () => {
    const map = makeMap([
      ['plain', 'wall', 'plain'],
      ['plain', 'plain', 'plain'],
    ]);
    const unit = makeUnit('hero', { x: 0, y: 0 }, 5);
    const units = new Map([['hero', unit]]);

    const path = getPath({ x: 0, y: 0 }, { x: 2, y: 0 }, unit, map, units);

    expect(path.length).toBeGreaterThan(0);
    expect(posKey(path[path.length - 1])).toBe('2,0');
    // Should not go through the wall
    expect(path.some((p) => posKey(p) === '1,0')).toBe(false);
  });
});

describe('getAttackTilesFrom', () => {
  it('returns manhattan distance diamond for melee weapon', () => {
    const map = makeMap([
      ['plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain'],
    ]);
    const weapon = { id: 'sw', name: 'Sword', type: 'sword' as const, might: 5, hit: 90, crit: 0, weight: 5, minRange: 1, maxRange: 1 };

    const tiles = getAttackTilesFrom({ x: 1, y: 1 }, weapon, map);

    expect(tiles.size).toBe(4); // 4 adjacent tiles
    expect(tiles.has('0,1')).toBe(true);
    expect(tiles.has('2,1')).toBe(true);
    expect(tiles.has('1,0')).toBe(true);
    expect(tiles.has('1,2')).toBe(true);
    expect(tiles.has('1,1')).toBe(false); // not self
  });

  it('returns correct range for 1-2 range weapon', () => {
    const map = makeMap([
      ['plain', 'plain', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
    ]);
    const weapon = { id: 'fire', name: 'Fire', type: 'fire' as const, might: 5, hit: 90, crit: 0, weight: 4, minRange: 1, maxRange: 2 };

    const tiles = getAttackTilesFrom({ x: 2, y: 2 }, weapon, map);

    // Range 1 (4 tiles) + Range 2 (8 tiles) = 12
    expect(tiles.size).toBe(12);
    expect(tiles.has('2,0')).toBe(true);  // 2 up
    expect(tiles.has('0,2')).toBe(true);  // 2 left
    expect(tiles.has('1,1')).toBe(true);  // diagonal at range 2
    expect(tiles.has('2,2')).toBe(false); // not self
  });
});

describe('getFullAttackRange', () => {
  it('returns attack tiles outside movement range', () => {
    const map = makeMap([
      ['plain', 'plain', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
      ['plain', 'plain', 'plain', 'plain', 'plain'],
    ]);
    const unit = makeUnit('hero', { x: 0, y: 1 }, 1);
    const units = new Map([['hero', unit]]);
    const moveRange = getMovementRange(unit, map, units);

    const atkRange = getFullAttackRange(unit, moveRange, map);

    // Attack range should contain tiles reachable by weapon but not by movement
    for (const key of atkRange) {
      expect(moveRange.has(key)).toBe(false);
    }
    expect(atkRange.size).toBeGreaterThan(0);
  });
});
