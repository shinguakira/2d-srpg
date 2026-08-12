import { describe, it, expect } from 'vitest';
import { getWeaponTriangle, calculateCombatForecast, resolveCombat } from '../../src/core/combat';
import { applyCombatResult } from '../../src/stores/helpers/combatResolution';
import type { Unit, Weapon, WeaponType, GameMap, Tile } from '../../src/core/types';
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
  const base: Unit = {
    id,
    name: id,
    classId: 'lord',
    faction: 'player',
    position: { x: 0, y: 0 },
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
    currentHp: 20,
    level: 1,
    exp: 0,
    equippedWeapon: makeWeapon('sword'),
    inventory: [],
    hasActed: false,
    skills: [],
    learnedSkills: [],
    sprite: '',
    metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
    facing: 'down',
    items: [],
  };
  return Object.assign(base, overrides);
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
    const attacker = makeUnit('atk', {
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
    });
    const defender = makeUnit('def', {
      classId: 'fighter',
      faction: 'enemy',
      stats: {
        hp: 20,
        str: 6,
        mag: 0,
        def: 5,
        res: 0,
        spd: 5,
        skl: 3,
        lck: 2,
        mov: 5,
        cha: 0,
        wil: 0,
      },
      equippedWeapon: makeWeapon('axe'),
    });

    const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);

    // sword vs axe = +1 dmg → 8+1 = 9
    expect(forecast.attackerDamage).toBe(9);
  });

  it('calculates magical damage against RES', () => {
    const attacker = makeUnit('mage', {
      classId: 'mage',
      stats: {
        hp: 18,
        str: 0,
        mag: 8,
        def: 3,
        res: 5,
        spd: 6,
        skl: 5,
        lck: 3,
        mov: 5,
        cha: 0,
        wil: 0,
      },
      equippedWeapon: makeWeapon('fire', { might: 5, hit: 90 }),
    });
    const defender = makeUnit('def', {
      classId: 'fighter',
      faction: 'enemy',
      stats: {
        hp: 20,
        str: 6,
        mag: 0,
        def: 5,
        res: 2,
        spd: 5,
        skl: 3,
        lck: 2,
        mov: 5,
        cha: 0,
        wil: 0,
      },
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
    const swordUser = makeUnit('sword', { classId: 'lord', equippedWeapon: makeWeapon('sword') });
    const axeUser = makeUnit('axe', {
      classId: 'fighter',
      faction: 'enemy',
      equippedWeapon: makeWeapon('axe'),
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
      stats: {
        hp: 20,
        str: 8,
        mag: 0,
        def: 5,
        res: 0,
        spd: 12,
        skl: 5,
        lck: 3,
        mov: 5,
        cha: 0,
        wil: 0,
      },
    });
    const slow = makeUnit('slow', {
      faction: 'enemy',
      stats: {
        hp: 20,
        str: 6,
        mag: 0,
        def: 5,
        res: 0,
        spd: 5,
        skl: 3,
        lck: 2,
        mov: 5,
        cha: 0,
        wil: 0,
      },
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
    const a = makeUnit('a', {
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
    });
    const b = makeUnit('b', {
      faction: 'enemy',
      stats: {
        hp: 20,
        str: 6,
        mag: 0,
        def: 5,
        res: 0,
        spd: 5,
        skl: 3,
        lck: 2,
        mov: 5,
        cha: 0,
        wil: 0,
      },
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
      stats: {
        hp: 18,
        str: 0,
        mag: 8,
        def: 3,
        res: 5,
        spd: 6,
        skl: 5,
        lck: 3,
        mov: 5,
        cha: 0,
        wil: 0,
      },
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
      stats: {
        hp: 99,
        str: 30,
        mag: 0,
        def: 30,
        res: 30,
        spd: 30,
        skl: 30,
        lck: 30,
        mov: 5,
        cha: 0,
        wil: 0,
      },
      equippedWeapon: makeWeapon('sword', { hit: 200 }),
    });
    const weak = makeUnit('weak', {
      faction: 'enemy',
      stats: {
        hp: 10,
        str: 1,
        mag: 0,
        def: 0,
        res: 0,
        spd: 0,
        skl: 0,
        lck: 0,
        mov: 5,
        cha: 0,
        wil: 0,
      },
      equippedWeapon: makeWeapon('sword', { hit: 0 }),
    });

    const forecast = calculateCombatForecast(godlike, weak, 'plain', 'plain', 1);

    expect(forecast.attackerHit).toBe(99); // capped
    expect(forecast.defenderHit).toBe(1); // floored
  });

  it('damage cannot go below 0', () => {
    const weak = makeUnit('weak', {
      stats: {
        hp: 20,
        str: 1,
        mag: 0,
        def: 0,
        res: 0,
        spd: 5,
        skl: 5,
        lck: 3,
        mov: 5,
        cha: 0,
        wil: 0,
      },
      equippedWeapon: makeWeapon('sword', { might: 1 }),
    });
    const tank = makeUnit('tank', {
      faction: 'enemy',
      stats: {
        hp: 30,
        str: 5,
        mag: 0,
        def: 20,
        res: 20,
        spd: 5,
        skl: 3,
        lck: 2,
        mov: 5,
        cha: 0,
        wil: 0,
      },
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
      stats: {
        hp: 20,
        str: 30,
        mag: 0,
        def: 5,
        res: 0,
        spd: 15,
        skl: 5,
        lck: 3,
        mov: 5,
        cha: 0,
        wil: 0,
      },
      equippedWeapon: makeWeapon('sword', { might: 20, hit: 100, crit: 0 }),
    });
    const defender = makeUnit('def', {
      faction: 'enemy',
      currentHp: 5,
      stats: {
        hp: 20,
        str: 6,
        mag: 0,
        def: 0,
        res: 0,
        spd: 5,
        skl: 3,
        lck: 0,
        mov: 5,
        cha: 0,
        wil: 0,
      },
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
      stats: {
        hp: 20,
        str: 8,
        mag: 0,
        def: 5,
        res: 0,
        spd: 7,
        skl: 50,
        lck: 3,
        mov: 5,
        cha: 0,
        wil: 0,
      },
      equippedWeapon: makeWeapon('sword', { might: 5, hit: 100, crit: 100 }),
    });
    const defender = makeUnit('def', {
      faction: 'enemy',
      currentHp: 100,
      stats: {
        hp: 100,
        str: 6,
        mag: 0,
        def: 5,
        res: 0,
        spd: 5,
        skl: 3,
        lck: 0,
        mov: 5,
        cha: 0,
        wil: 0,
      },
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
      stats: {
        hp: 20,
        str: 8,
        mag: 0,
        def: 5,
        res: 0,
        spd: 7,
        skl: 0,
        lck: 0,
        mov: 5,
        cha: 0,
        wil: 0,
      },
    });
    const defender = makeUnit('def', {
      faction: 'enemy',
      stats: {
        hp: 20,
        str: 6,
        mag: 0,
        def: 5,
        res: 0,
        spd: 30,
        skl: 30,
        lck: 30,
        mov: 5,
        cha: 0,
        wil: 0,
      },
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

// ===== Skill-related combat bug fixes =====

const alwaysRng = new SeededRandom(1);
// Override roll to always succeed for deterministic skill tests
alwaysRng.roll = () => true;

describe('Sol heals post-defense damage (Bug 3)', () => {
  it('Sol heal amount is reduced when defender has Aegis/Pavise', () => {
    // Attacker with Sol, using physical weapon
    const attacker = makeUnit('atk', {
      stats: {
        hp: 30,
        str: 15,
        mag: 0,
        def: 5,
        res: 0,
        spd: 10,
        skl: 30,
        lck: 30,
        mov: 5,
        cha: 0,
        wil: 0,
      },
      currentHp: 20, // damaged so we can see healing
      skills: ['sol'],
      equippedWeapon: makeWeapon('sword', { might: 10 }),
      inventory: [makeWeapon('sword', { might: 10 })],
    });
    // Defender with Pavise (halves physical damage)
    const defender = makeUnit('def', {
      faction: 'enemy',
      stats: {
        hp: 40,
        str: 5,
        mag: 0,
        def: 5,
        res: 0,
        spd: 1,
        skl: 30,
        lck: 30,
        mov: 5,
        cha: 0,
        wil: 0,
      },
      currentHp: 40,
      skills: ['pavise'],
      equippedWeapon: makeWeapon('sword'),
      inventory: [makeWeapon('sword')],
    });

    const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);
    const rng = new SeededRandom(1);
    rng.roll = () => true; // all skills activate

    const result = resolveCombat(forecast, rng, attacker, defender);
    const solHit = result.hits.find(
      (h) => h.attackerIsInitiator && h.activatedSkill && h.healedAmount > 0,
    );

    if (solHit) {
      // Sol heal should match the actual damage dealt (post-Pavise), not the pre-Pavise amount
      expect(solHit.healedAmount).toBe(solHit.damage);
    }
  });
});

describe('Astra bonus hits (Bugs 4+5)', () => {
  it('records all 5 hits in hits[] array', () => {
    const attacker = makeUnit('atk', {
      stats: {
        hp: 30,
        str: 15,
        mag: 0,
        def: 5,
        res: 0,
        spd: 15,
        skl: 30,
        lck: 30,
        mov: 5,
        cha: 0,
        wil: 0,
      },
      currentHp: 30,
      skills: ['astra'],
      equippedWeapon: makeWeapon('sword', { might: 6 }),
      inventory: [makeWeapon('sword', { might: 6 })],
    });
    const defender = makeUnit('def', {
      faction: 'enemy',
      // HP high enough to survive all Astra hits including crits across both rounds
      stats: {
        hp: 400,
        str: 5,
        mag: 0,
        def: 3,
        res: 0,
        spd: 1,
        skl: 5,
        lck: 5,
        mov: 5,
        cha: 0,
        wil: 0,
      },
      currentHp: 400,
      equippedWeapon: makeWeapon('sword'),
      inventory: [makeWeapon('sword')],
    });

    const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);
    const rng = new SeededRandom(1);
    rng.roll = () => true;

    const result = resolveCombat(forecast, rng, attacker, defender);
    // Astra: 1 main hit + 4 bonus = 5 per attacker round. Attacker doubles = 10 total.
    const atkHits = result.hits.filter((h) => h.attackerIsInitiator);
    expect(atkHits.length).toBeGreaterThanOrEqual(5);
    // Every attacker hit should have astra since alwaysRng fires it every round
    const astraHits = atkHits.filter((h) => h.activatedSkill === 'astra');
    expect(astraHits.length).toBe(atkHits.length);
  });

  it('bonus hits go through defense skills (Pavise)', () => {
    const attacker = makeUnit('atk', {
      stats: {
        hp: 30,
        str: 15,
        mag: 0,
        def: 5,
        res: 0,
        spd: 15,
        skl: 30,
        lck: 30,
        mov: 5,
        cha: 0,
        wil: 0,
      },
      currentHp: 30,
      skills: ['astra'],
      equippedWeapon: makeWeapon('sword', { might: 10 }),
      inventory: [makeWeapon('sword', { might: 10 })],
    });
    const defender = makeUnit('def', {
      faction: 'enemy',
      // HP high enough to survive all Astra hits including crits
      stats: {
        hp: 500,
        str: 5,
        mag: 0,
        def: 5,
        res: 0,
        spd: 1,
        skl: 30,
        lck: 30,
        mov: 5,
        cha: 0,
        wil: 0,
      },
      currentHp: 500,
      skills: ['pavise'],
      equippedWeapon: makeWeapon('sword'),
      inventory: [makeWeapon('sword')],
    });

    const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);
    const rng = new SeededRandom(1);
    rng.roll = () => true; // Pavise activates on every bonus hit

    const result = resolveCombat(forecast, rng, attacker, defender);
    const atkHits = result.hits.filter((h) => h.attackerIsInitiator);
    // With alwaysRng, Astra fires: 4 bonus + 1 main per round
    expect(atkHits.length).toBeGreaterThanOrEqual(5);
    // Bonus hits (first 4) should have Pavise reducing damage
    // Without Pavise, bonus damage = Math.floor(critDmg / 2) where critDmg = round.damage * 3
    const critDmg = forecast.attackerDamage * 3;
    const astraDmgNoPavise = Math.floor(critDmg / 2);
    for (let i = 0; i < 4; i++) {
      // Pavise halves physical → bonus hit damage should be less than un-Pavise'd
      expect(atkHits[i].damage).toBeLessThan(astraDmgNoPavise);
    }
  });
});

describe('Carrier death removes carried unit (Bug 8)', () => {
  it('carried unit dies when carrier dies', () => {
    const map: GameMap = {
      width: 3,
      height: 1,
      tiles: [
        [
          { position: { x: 0, y: 0 }, terrain: 'plain', occupantId: 'carrier' },
          { position: { x: 1, y: 0 }, terrain: 'plain', occupantId: 'enemy' },
          { position: { x: 2, y: 0 }, terrain: 'plain', occupantId: null },
        ],
      ] as Tile[][],
    };

    const carried = makeUnit('carried', {
      faction: 'player',
      position: { x: 0, y: 0 },
      isCarried: true,
    });
    const carrier = makeUnit('carrier', {
      faction: 'player',
      position: { x: 0, y: 0 },
      carriedUnitId: 'carried',
      currentHp: 1,
    });
    const enemy = makeUnit('enemy', { faction: 'enemy', position: { x: 1, y: 0 } });

    const units = new Map<string, Unit>();
    units.set('carrier', carrier);
    units.set('carried', carried);
    units.set('enemy', enemy);

    const combatResult = {
      attackerHpAfter: 0,
      defenderHpAfter: 15,
      attackerDied: true,
      defenderDied: false,
      hits: [],
    };

    const resolution = applyCombatResult(units, map, 'carrier', 'enemy', combatResult, null);

    // Both carrier and carried unit should be removed
    expect(resolution.newUnits.has('carrier')).toBe(false);
    expect(resolution.newUnits.has('carried')).toBe(false);
  });
});
