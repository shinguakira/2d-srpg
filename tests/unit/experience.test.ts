import { describe, it, expect } from 'vitest';
import { calculateExpGain, checkLevelUp, rollLevelUp, applyStatGains } from '../../src/core/experience';
import type { Unit, GrowthRates, UnitStats } from '../../src/core/types';
import { SeededRandom } from '../../src/core/rng';

function makeUnit(level: number, faction: 'player' | 'enemy' = 'player'): Unit {
  return {
    id: 'test',
    name: 'Test',
    classId: 'lord',
    faction,
    position: { x: 0, y: 0 },
    stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 5 },
    currentHp: 20,
    level,
    exp: 0,
    equippedWeapon: { id: 'sw', name: 'Sword', type: 'sword', might: 5, hit: 90, crit: 0, weight: 5, minRange: 1, maxRange: 1 },
    inventory: [],
    hasActed: false,
    sprite: '',
  };
}

describe('calculateExpGain', () => {
  it('gives base 30 EXP for same-level combat without kill', () => {
    const attacker = makeUnit(1);
    const defender = makeUnit(1, 'enemy');
    expect(calculateExpGain(attacker, defender, false)).toBe(30);
  });

  it('gives +50 bonus for killing', () => {
    const attacker = makeUnit(1);
    const defender = makeUnit(1, 'enemy');
    expect(calculateExpGain(attacker, defender, true)).toBe(80);
  });

  it('gives more EXP for higher-level enemies', () => {
    const attacker = makeUnit(1);
    const strongEnemy = makeUnit(5, 'enemy');
    expect(calculateExpGain(attacker, strongEnemy, false)).toBe(50); // 30 + 4*5
  });

  it('gives less EXP for lower-level enemies (min 5)', () => {
    const attacker = makeUnit(10);
    const weakEnemy = makeUnit(1, 'enemy');
    // 30 + (1-10)*5 = 30 - 45 = clamped to 5
    expect(calculateExpGain(attacker, weakEnemy, false)).toBe(5);
  });

  it('caps total at 100', () => {
    const attacker = makeUnit(1);
    const bossEnemy = makeUnit(20, 'enemy');
    expect(calculateExpGain(attacker, bossEnemy, true)).toBeLessThanOrEqual(100);
  });
});

describe('checkLevelUp', () => {
  it('levels up when EXP reaches 100', () => {
    const result = checkLevelUp(70, 30);
    expect(result.leveled).toBe(true);
    expect(result.newExp).toBe(0);
    expect(result.newLevel).toBe(1);
  });

  it('carries over excess EXP', () => {
    const result = checkLevelUp(80, 50);
    expect(result.leveled).toBe(true);
    expect(result.newExp).toBe(30);
  });

  it('does not level up below 100', () => {
    const result = checkLevelUp(40, 30);
    expect(result.leveled).toBe(false);
    expect(result.newExp).toBe(70);
    expect(result.newLevel).toBe(0);
  });
});

describe('rollLevelUp', () => {
  it('returns deterministic gains with seeded RNG', () => {
    const growths: GrowthRates = { hp: 80, str: 45, mag: 10, def: 30, res: 20, spd: 50, skl: 45, lck: 60 };
    const gains1 = rollLevelUp(growths, new SeededRandom(42));
    const gains2 = rollLevelUp(growths, new SeededRandom(42));

    expect(gains1).toEqual(gains2);
  });

  it('all gains are 0 or 1', () => {
    const growths: GrowthRates = { hp: 80, str: 45, mag: 10, def: 30, res: 20, spd: 50, skl: 45, lck: 60 };
    const gains = rollLevelUp(growths, new SeededRandom(123));

    for (const val of Object.values(gains)) {
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(1);
    }
  });
});

describe('applyStatGains', () => {
  it('adds gains to stats correctly', () => {
    const stats: UnitStats = { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 5 };
    const gains = { hp: 1, str: 1, mag: 0, def: 0, res: 1, spd: 1, skl: 0, lck: 1 };
    const result = applyStatGains(stats, gains);

    expect(result.hp).toBe(21);
    expect(result.str).toBe(9);
    expect(result.mag).toBe(0);
    expect(result.def).toBe(5);
    expect(result.res).toBe(1);
    expect(result.spd).toBe(8);
    expect(result.skl).toBe(5);
    expect(result.lck).toBe(4);
    expect(result.mov).toBe(5); // MOV unchanged
  });
});
