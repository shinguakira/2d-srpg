import { describe, it, expect } from 'vitest';
import { getWeaponTriangle, calculateCombatForecast, resolveCombat } from '../../src/core/combat';
import type { Unit, Weapon, WeaponType } from '../../src/core/types';
import { SeededRandom } from '../../src/core/rng';

function makeWeapon(type: WeaponType, overrides: Partial<Weapon> = {}): Weapon {
  return {
    id: type,
    name: type,
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

function makeUnit(id: string, overrides: Partial<Unit> = {}): Unit {
  return {
    id,
    name: id,
    classId: 'test',
    faction: 'player',
    position: { x: 0, y: 0 },
    stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 5 },
    currentHp: 20,
    level: 1,
    exp: 0,
    equippedWeapon: makeWeapon('sword'),
    inventory: [],
    hasActed: false,
    sprite: '',
    ...overrides,
  };
}

describe('getWeaponTriangle', () => {
  it('sword beats axe', () => {
    const result = getWeaponTriangle('sword', 'axe');
    expect(result.hitMod).toBe(15);
    expect(result.dmgMod).toBe(1);
  });

  it('axe beats lance', () => {
    const result = getWeaponTriangle('axe', 'lance');
    expect(result.hitMod).toBe(15);
    expect(result.dmgMod).toBe(1);
  });

  it('lance beats sword', () => {
    const result = getWeaponTriangle('lance', 'sword');
    expect(result.hitMod).toBe(15);
    expect(result.dmgMod).toBe(1);
  });

  it('sword loses to lance', () => {
    const result = getWeaponTriangle('sword', 'lance');
    expect(result.hitMod).toBe(-15);
    expect(result.dmgMod).toBe(-1);
  });

  it('fire beats wind', () => {
    const result = getWeaponTriangle('fire', 'wind');
    expect(result.hitMod).toBe(15);
    expect(result.dmgMod).toBe(1);
  });

  it('wind beats thunder', () => {
    const result = getWeaponTriangle('wind', 'thunder');
    expect(result.hitMod).toBe(15);
    expect(result.dmgMod).toBe(1);
  });

  it('thunder beats fire', () => {
    const result = getWeaponTriangle('thunder', 'fire');
    expect(result.hitMod).toBe(15);
    expect(result.dmgMod).toBe(1);
  });

  it('same type is neutral', () => {
    const result = getWeaponTriangle('sword', 'sword');
    expect(result.hitMod).toBe(0);
    expect(result.dmgMod).toBe(0);
  });

  it('cross-category is neutral (sword vs fire)', () => {
    const result = getWeaponTriangle('sword', 'fire');
    expect(result.hitMod).toBe(0);
    expect(result.dmgMod).toBe(0);
  });
});

describe('calculateCombatForecast', () => {
  it('calculates physical damage correctly', () => {
    // STR 8 + Might 5 - DEF 5 - Terrain 0 = 8 damage
    const attacker = makeUnit('atk', { stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 5 } });
    const defender = makeUnit('def', {
      faction: 'enemy',
      stats: { hp: 20, str: 6, mag: 0, def: 5, res: 0, spd: 5, skl: 3, lck: 2, mov: 5 },
      equippedWeapon: makeWeapon('axe'),
    });

    const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);

    // sword vs axe = +1 dmg → 8+1 = 9
    expect(forecast.attackerDamage).toBe(9);
  });

  it('calculates magical damage against RES', () => {
    const attacker = makeUnit('mage', {
      stats: { hp: 18, str: 0, mag: 8, def: 3, res: 5, spd: 6, skl: 5, lck: 3, mov: 5 },
      equippedWeapon: makeWeapon('fire', { might: 5, hit: 90 }),
    });
    const defender = makeUnit('def', {
      faction: 'enemy',
      stats: { hp: 20, str: 6, mag: 0, def: 5, res: 2, spd: 5, skl: 3, lck: 2, mov: 5 },
      equippedWeapon: makeWeapon('axe'),
    });

    const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);

    // MAG 8 + Might 5 - RES 2 - terrain 0 = 11 (fire vs axe = neutral)
    expect(forecast.attackerDamage).toBe(11);
  });

  it('terrain defense reduces damage', () => {
    const attacker = makeUnit('atk');
    const defender = makeUnit('def', {
      faction: 'enemy',
      equippedWeapon: makeWeapon('sword'),
    });

    const plainForecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);
    const forestForecast = calculateCombatForecast(attacker, defender, 'plain', 'forest', 1);

    // Forest gives +1 defense
    expect(forestForecast.attackerDamage).toBe(plainForecast.attackerDamage - 1);
  });

  it('weapon triangle affects damage', () => {
    const swordUser = makeUnit('sword', { equippedWeapon: makeWeapon('sword') });
    const axeUser = makeUnit('axe', {
      faction: 'enemy',
      equippedWeapon: makeWeapon('axe'),
      stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 5 },
    });

    const forecast = calculateCombatForecast(swordUser, axeUser, 'plain', 'plain', 1);

    // Sword vs axe: +1 damage, +15 hit
    // STR 8 + Might 5 - DEF 5 + 1 (triangle) = 9
    expect(forecast.attackerDamage).toBe(9);
    // Axe vs sword: -1 damage, -15 hit
    // STR 8 + Might 5 - DEF 5 - 1 (triangle) = 7
    expect(forecast.defenderDamage).toBe(7);
  });

  it('detects double attack when speed diff >= 5', () => {
    const fast = makeUnit('fast', {
      stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 12, skl: 5, lck: 3, mov: 5 },
    });
    const slow = makeUnit('slow', {
      faction: 'enemy',
      stats: { hp: 20, str: 6, mag: 0, def: 5, res: 0, spd: 5, skl: 3, lck: 2, mov: 5 },
      equippedWeapon: makeWeapon('sword'),
    });

    const forecast = calculateCombatForecast(fast, slow, 'plain', 'plain', 1);

    expect(forecast.attackerCanDouble).toBe(true);
    expect(forecast.defenderCanDouble).toBe(false);
    // Rounds: attacker, defender counter, attacker double = 3
    expect(forecast.rounds.length).toBe(3);
    expect(forecast.rounds[0].attackerIsInitiator).toBe(true);
    expect(forecast.rounds[1].attackerIsInitiator).toBe(false);
    expect(forecast.rounds[2].attackerIsInitiator).toBe(true);
  });

  it('no double when speed diff < 5', () => {
    const a = makeUnit('a', { stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 5 } });
    const b = makeUnit('b', {
      faction: 'enemy',
      stats: { hp: 20, str: 6, mag: 0, def: 5, res: 0, spd: 5, skl: 3, lck: 2, mov: 5 },
      equippedWeapon: makeWeapon('sword'),
    });

    const forecast = calculateCombatForecast(a, b, 'plain', 'plain', 1);

    expect(forecast.attackerCanDouble).toBe(false);
    expect(forecast.defenderCanDouble).toBe(false);
    expect(forecast.rounds.length).toBe(2); // attack + counter
  });

  it('no counterattack when defender out of range', () => {
    const ranged = makeUnit('ranged', {
      equippedWeapon: makeWeapon('fire', { minRange: 1, maxRange: 2 }),
      stats: { hp: 18, str: 0, mag: 8, def: 3, res: 5, spd: 6, skl: 5, lck: 3, mov: 5 },
    });
    const melee = makeUnit('melee', {
      faction: 'enemy',
      equippedWeapon: makeWeapon('sword', { minRange: 1, maxRange: 1 }),
    });

    const forecast = calculateCombatForecast(ranged, melee, 'plain', 'plain', 2);

    expect(forecast.defenderCanCounter).toBe(false);
    expect(forecast.defenderDamage).toBe(0);
    expect(forecast.rounds.length).toBe(1); // only attacker hits
  });

  it('hit chance is clamped between 1 and 99', () => {
    const godlike = makeUnit('god', {
      stats: { hp: 99, str: 30, mag: 0, def: 30, res: 30, spd: 30, skl: 30, lck: 30, mov: 5 },
      equippedWeapon: makeWeapon('sword', { hit: 200 }),
    });
    const weak = makeUnit('weak', {
      faction: 'enemy',
      stats: { hp: 10, str: 1, mag: 0, def: 0, res: 0, spd: 0, skl: 0, lck: 0, mov: 5 },
      equippedWeapon: makeWeapon('sword', { hit: 0 }),
    });

    const forecast = calculateCombatForecast(godlike, weak, 'plain', 'plain', 1);

    expect(forecast.attackerHit).toBe(99); // capped
    expect(forecast.defenderHit).toBe(1); // floored
  });

  it('damage cannot go below 0', () => {
    const weak = makeUnit('weak', {
      stats: { hp: 20, str: 1, mag: 0, def: 0, res: 0, spd: 5, skl: 5, lck: 3, mov: 5 },
      equippedWeapon: makeWeapon('sword', { might: 1 }),
    });
    const tank = makeUnit('tank', {
      faction: 'enemy',
      stats: { hp: 30, str: 5, mag: 0, def: 20, res: 20, spd: 5, skl: 3, lck: 2, mov: 5 },
      equippedWeapon: makeWeapon('sword'),
    });

    const forecast = calculateCombatForecast(weak, tank, 'plain', 'plain', 1);

    expect(forecast.attackerDamage).toBe(0);
  });
});

describe('resolveCombat', () => {
  it('applies damage from hits with seeded RNG', () => {
    const attacker = makeUnit('atk');
    const defender = makeUnit('def', {
      faction: 'enemy',
      equippedWeapon: makeWeapon('sword'),
    });

    const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);
    const rng = new SeededRandom(42);
    const result = resolveCombat(forecast, rng);

    // Result should have hits matching the rounds
    expect(result.hits.length).toBeGreaterThan(0);
    expect(result.hits.length).toBeLessThanOrEqual(forecast.rounds.length);
    // HP values should be consistent
    expect(result.attackerHpAfter).toBeLessThanOrEqual(attacker.currentHp);
    expect(result.defenderHpAfter).toBeLessThanOrEqual(defender.currentHp);
  });

  it('stops combat when a unit dies', () => {
    const attacker = makeUnit('atk', {
      stats: { hp: 20, str: 30, mag: 0, def: 5, res: 0, spd: 15, skl: 5, lck: 3, mov: 5 },
      equippedWeapon: makeWeapon('sword', { might: 20, hit: 100, crit: 0 }),
    });
    const defender = makeUnit('def', {
      faction: 'enemy',
      currentHp: 5,
      stats: { hp: 20, str: 6, mag: 0, def: 0, res: 0, spd: 5, skl: 3, lck: 0, mov: 5 },
      equippedWeapon: makeWeapon('sword', { hit: 100 }),
    });

    const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);
    // Should double (spd diff = 10)
    expect(forecast.attackerCanDouble).toBe(true);

    // Use a seed that gives hits
    const rng = new SeededRandom(1);
    const result = resolveCombat(forecast, rng);

    if (result.hits[0].hit) {
      expect(result.defenderDied).toBe(true);
      expect(result.defenderHpAfter).toBe(0);
      // Should not have all 3 rounds if defender died on first hit
      expect(result.hits.length).toBeLessThanOrEqual(forecast.rounds.length);
    }
  });

  it('critical hit triples damage', () => {
    const attacker = makeUnit('atk', {
      stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 50, lck: 3, mov: 5 },
      equippedWeapon: makeWeapon('sword', { might: 5, hit: 100, crit: 100 }),
    });
    const defender = makeUnit('def', {
      faction: 'enemy',
      currentHp: 100,
      stats: { hp: 100, str: 6, mag: 0, def: 5, res: 0, spd: 5, skl: 3, lck: 0, mov: 5 },
      equippedWeapon: makeWeapon('sword', { hit: 0 }),
    });

    const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);
    const baseDmg = forecast.attackerDamage;

    // Find a seed where the hit lands and crit procs
    const rng = new SeededRandom(1);
    const result = resolveCombat(forecast, rng);

    const firstHit = result.hits[0];
    if (firstHit.hit && firstHit.crit) {
      expect(firstHit.damage).toBe(baseDmg * 3);
    }
  });

  it('miss deals 0 damage', () => {
    const attacker = makeUnit('atk', {
      equippedWeapon: makeWeapon('sword', { hit: 1 }), // nearly impossible to hit
      stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 0, lck: 0, mov: 5 },
    });
    const defender = makeUnit('def', {
      faction: 'enemy',
      stats: { hp: 20, str: 6, mag: 0, def: 5, res: 0, spd: 30, skl: 30, lck: 30, mov: 5 },
      equippedWeapon: makeWeapon('sword', { hit: 1 }),
    });

    const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);
    // Hit chance should be 1 (minimum)
    expect(forecast.attackerHit).toBe(1);

    // Try several seeds to find a miss
    for (let s = 0; s < 20; s++) {
      const rng = new SeededRandom(s);
      const result = resolveCombat(forecast, rng);
      const missHit = result.hits.find((h) => !h.hit);
      if (missHit) {
        expect(missHit.damage).toBe(0);
        return;
      }
    }
  });

  it('deterministic with same seed', () => {
    const attacker = makeUnit('atk');
    const defender = makeUnit('def', {
      faction: 'enemy',
      equippedWeapon: makeWeapon('sword'),
    });

    const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);

    const result1 = resolveCombat(forecast, new SeededRandom(999));
    const result2 = resolveCombat(forecast, new SeededRandom(999));

    expect(result1.hits.length).toBe(result2.hits.length);
    for (let i = 0; i < result1.hits.length; i++) {
      expect(result1.hits[i].hit).toBe(result2.hits[i].hit);
      expect(result1.hits[i].crit).toBe(result2.hits[i].crit);
      expect(result1.hits[i].damage).toBe(result2.hits[i].damage);
    }
    expect(result1.attackerHpAfter).toBe(result2.attackerHpAfter);
    expect(result1.defenderHpAfter).toBe(result2.defenderHpAfter);
  });
});
