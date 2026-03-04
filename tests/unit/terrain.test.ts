import { describe, it, expect } from 'vitest';
import { TERRAIN, getTerrainData, getMovementCost, isPassable } from '../../src/core/terrain';
import type { TerrainType } from '../../src/core/types';

describe('terrain', () => {
  it('has data for all terrain types', () => {
    const types: TerrainType[] = ['plain', 'forest', 'mountain', 'water', 'wall', 'fort', 'village'];
    for (const t of types) {
      expect(TERRAIN[t]).toBeDefined();
      expect(TERRAIN[t].name).toBeTruthy();
    }
  });

  it('plain has movement cost 1 and no bonuses', () => {
    const data = getTerrainData('plain');
    expect(data.movementCost).toBe(1);
    expect(data.defenseBonus).toBe(0);
    expect(data.avoidBonus).toBe(0);
  });

  it('forest grants defense and avoid bonuses', () => {
    const data = getTerrainData('forest');
    expect(data.defenseBonus).toBeGreaterThan(0);
    expect(data.avoidBonus).toBeGreaterThan(0);
    expect(data.movementCost).toBeGreaterThan(1);
  });

  it('mountain has high movement cost and bonuses', () => {
    const data = getTerrainData('mountain');
    expect(data.movementCost).toBeGreaterThanOrEqual(3);
    expect(data.defenseBonus).toBeGreaterThan(0);
    expect(data.avoidBonus).toBeGreaterThan(0);
  });

  it('water and wall are impassable', () => {
    expect(isPassable('water')).toBe(false);
    expect(isPassable('wall')).toBe(false);
    expect(getMovementCost('water')).toBe(99);
    expect(getMovementCost('wall')).toBe(99);
  });

  it('fort has low movement cost and high defense', () => {
    const data = getTerrainData('fort');
    expect(data.movementCost).toBe(1);
    expect(data.defenseBonus).toBe(3);
  });

  it('passable terrains return true', () => {
    expect(isPassable('plain')).toBe(true);
    expect(isPassable('forest')).toBe(true);
    expect(isPassable('fort')).toBe(true);
    expect(isPassable('village')).toBe(true);
  });
});
