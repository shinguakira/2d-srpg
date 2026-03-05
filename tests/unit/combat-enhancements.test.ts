import { describe, it, expect } from 'vitest';
import {
  getWeaponTriangle,
  calculateCombatForecast,
  resolveHealing,
} from '../../src/core/combat';
import type { Unit, Weapon, WeaponType } from '../../src/core/types';

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

function makeUnit(id: string, overrides: Partial<Unit> = {}): Unit {
  return {
    id,
    name: id,
    classId: 'lord',
    faction: 'player',
    position: { x: 0, y: 0 },
    stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 5 },
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

// ===== Combat Forecast Enhancements =====

describe('CombatForecast metadata', () => {
  it('includes classId, weaponName, weaponType for attacker', () => {
    const attacker = makeUnit('eirik', {
      classId: 'lord',
      equippedWeapon: makeWeapon('sword', { name: 'Slim Sword' }),
    });
    const defender = makeUnit('bandit', {
      faction: 'enemy',
      classId: 'fighter',
      equippedWeapon: makeWeapon('axe', { name: 'Iron Axe' }),
    });

    const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);

    expect(forecast.attacker.classId).toBe('lord');
    expect(forecast.attacker.weaponName).toBe('Slim Sword');
    expect(forecast.attacker.weaponType).toBe('sword');
  });

  it('includes classId, weaponName, weaponType for defender', () => {
    const attacker = makeUnit('eirik', {
      equippedWeapon: makeWeapon('sword', { name: 'Iron Sword' }),
    });
    const defender = makeUnit('soldier', {
      faction: 'enemy',
      classId: 'soldier',
      equippedWeapon: makeWeapon('lance', { name: 'Steel Lance' }),
    });

    const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);

    expect(forecast.defender.classId).toBe('soldier');
    expect(forecast.defender.weaponName).toBe('Steel Lance');
    expect(forecast.defender.weaponType).toBe('lance');
  });

  it('includes unitId, name, currentHp, maxHp, faction', () => {
    const attacker = makeUnit('eirik', { currentHp: 15, stats: { hp: 24, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 5 } });
    const defender = makeUnit('bandit', { faction: 'enemy', currentHp: 18, stats: { hp: 20, str: 6, mag: 0, def: 4, res: 0, spd: 5, skl: 3, lck: 2, mov: 5 }, equippedWeapon: makeWeapon('axe') });

    const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);

    expect(forecast.attacker.unitId).toBe('eirik');
    expect(forecast.attacker.name).toBe('eirik');
    expect(forecast.attacker.currentHp).toBe(15);
    expect(forecast.attacker.maxHp).toBe(24);
    expect(forecast.attacker.faction).toBe('player');

    expect(forecast.defender.unitId).toBe('bandit');
    expect(forecast.defender.name).toBe('bandit');
    expect(forecast.defender.currentHp).toBe(18);
    expect(forecast.defender.maxHp).toBe(20);
    expect(forecast.defender.faction).toBe('enemy');
  });
});

// ===== Weapon Triangle with Staff =====

describe('Weapon triangle with staff type', () => {
  it('staff vs sword is neutral', () => {
    const result = getWeaponTriangle('staff', 'sword');
    expect(result.hitMod).toBe(0);
    expect(result.dmgMod).toBe(0);
  });

  it('staff vs axe is neutral', () => {
    const result = getWeaponTriangle('staff', 'axe');
    expect(result.hitMod).toBe(0);
    expect(result.dmgMod).toBe(0);
  });

  it('staff vs lance is neutral', () => {
    const result = getWeaponTriangle('staff', 'lance');
    expect(result.hitMod).toBe(0);
    expect(result.dmgMod).toBe(0);
  });

  it('staff vs fire is neutral', () => {
    const result = getWeaponTriangle('staff', 'fire');
    expect(result.hitMod).toBe(0);
    expect(result.dmgMod).toBe(0);
  });

  it('sword vs staff is neutral', () => {
    const result = getWeaponTriangle('sword', 'staff');
    expect(result.hitMod).toBe(0);
    expect(result.dmgMod).toBe(0);
  });
});

// ===== Healing =====

describe('resolveHealing', () => {
  it('heals for mag + weapon might', () => {
    const healer = makeUnit('natasha', {
      stats: { hp: 18, str: 1, mag: 6, def: 2, res: 6, spd: 5, skl: 3, lck: 5, mov: 5 },
      equippedWeapon: makeWeapon('staff', { name: 'Heal', might: 10, hit: 100, crit: 0 }),
    });
    const target = makeUnit('seth', {
      currentHp: 10,
      stats: { hp: 30, str: 12, mag: 2, def: 9, res: 5, spd: 10, skl: 13, lck: 8, mov: 7 },
    });

    const result = resolveHealing(healer, target);

    // Heal = mag 6 + might 10 = 16
    expect(result.healAmount).toBe(16);
    expect(result.targetHpBefore).toBe(10);
    expect(result.targetHpAfter).toBe(26);
  });

  it('caps healing at max HP', () => {
    const healer = makeUnit('natasha', {
      stats: { hp: 18, str: 1, mag: 6, def: 2, res: 6, spd: 5, skl: 3, lck: 5, mov: 5 },
      equippedWeapon: makeWeapon('staff', { name: 'Heal', might: 10 }),
    });
    const target = makeUnit('seth', {
      currentHp: 28,
      stats: { hp: 30, str: 12, mag: 2, def: 9, res: 5, spd: 10, skl: 13, lck: 8, mov: 7 },
    });

    const result = resolveHealing(healer, target);

    // Heal would be 16 but target only missing 2 HP
    expect(result.healAmount).toBe(2);
    expect(result.targetHpAfter).toBe(30);
  });

  it('heals 0 when target is at full HP', () => {
    const healer = makeUnit('natasha', {
      stats: { hp: 18, str: 1, mag: 6, def: 2, res: 6, spd: 5, skl: 3, lck: 5, mov: 5 },
      equippedWeapon: makeWeapon('staff', { name: 'Heal', might: 10 }),
    });
    const target = makeUnit('seth', {
      currentHp: 30,
      stats: { hp: 30, str: 12, mag: 2, def: 9, res: 5, spd: 10, skl: 13, lck: 8, mov: 7 },
    });

    const result = resolveHealing(healer, target);

    expect(result.healAmount).toBe(0);
    expect(result.targetHpAfter).toBe(30);
  });

  it('healer with high mag heals more', () => {
    const weakHealer = makeUnit('novice', {
      stats: { hp: 18, str: 1, mag: 2, def: 2, res: 4, spd: 5, skl: 3, lck: 5, mov: 5 },
      equippedWeapon: makeWeapon('staff', { might: 10 }),
    });
    const strongHealer = makeUnit('bishop', {
      stats: { hp: 18, str: 1, mag: 12, def: 2, res: 10, spd: 5, skl: 3, lck: 5, mov: 5 },
      equippedWeapon: makeWeapon('staff', { might: 10 }),
    });
    const target = makeUnit('wounded', {
      currentHp: 5,
      stats: { hp: 40, str: 10, mag: 0, def: 8, res: 3, spd: 7, skl: 5, lck: 3, mov: 5 },
    });

    const weakResult = resolveHealing(weakHealer, target);
    const strongResult = resolveHealing(strongHealer, target);

    // Weak: 2+10=12, Strong: 12+10=22
    expect(weakResult.healAmount).toBe(12);
    expect(strongResult.healAmount).toBe(22);
    expect(strongResult.healAmount).toBeGreaterThan(weakResult.healAmount);
  });
});

// ===== Terrain defense in forecast =====

describe('CombatForecast terrain interactions', () => {
  it('fort gives +3 defense bonus', () => {
    const attacker = makeUnit('atk', {
      stats: { hp: 20, str: 10, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 5 },
      equippedWeapon: makeWeapon('sword', { might: 5 }),
    });
    const defender = makeUnit('def', {
      faction: 'enemy',
      stats: { hp: 20, str: 6, mag: 0, def: 5, res: 0, spd: 5, skl: 3, lck: 2, mov: 5 },
      equippedWeapon: makeWeapon('sword'),
    });

    const plainForecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);
    const fortForecast = calculateCombatForecast(attacker, defender, 'plain', 'fort', 1);

    // Fort defense bonus is 3
    expect(fortForecast.attackerDamage).toBe(plainForecast.attackerDamage - 3);
  });

  it('throne gives +5 defense bonus', () => {
    const attacker = makeUnit('atk', {
      stats: { hp: 20, str: 15, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 5 },
      equippedWeapon: makeWeapon('sword', { might: 5 }),
    });
    const defender = makeUnit('boss', {
      faction: 'enemy',
      stats: { hp: 30, str: 10, mag: 0, def: 8, res: 3, spd: 5, skl: 3, lck: 2, mov: 5 },
      equippedWeapon: makeWeapon('axe'),
    });

    const plainForecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);
    const throneForecast = calculateCombatForecast(attacker, defender, 'plain', 'throne', 1);

    // Throne defense bonus is 5
    expect(throneForecast.attackerDamage).toBe(plainForecast.attackerDamage - 5);
  });
});
