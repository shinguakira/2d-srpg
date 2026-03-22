import { describe, it, expect } from 'vitest';
import { getEffectiveWeaponRange, isMagicWeapon, isWeaponProficient } from '../../src/core/combat';
import type { Unit, Weapon, WeaponType } from '../../src/core/types';

function makeWeapon(type: WeaponType, overrides: Partial<Weapon> = {}): Weapon {
  return {
    id: type,
    name: type,
    type,
    might: 5,
    hit: 90,
    crit: 0,
    weight: 5,
    minRange: type === 'fire' || type === 'thunder' || type === 'wind' || type === 'dark' || type === 'light' ? 1 : 1,
    maxRange: type === 'fire' || type === 'thunder' || type === 'wind' || type === 'dark' || type === 'light' ? 2 : 1,
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
    stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 5, cha: 0, wil: 0 },
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
    ...overrides,
  } as Unit;
}

describe('isMagicWeapon', () => {
  it('identifies fire/thunder/wind/dark/light as magic', () => {
    expect(isMagicWeapon(makeWeapon('fire'))).toBe(true);
    expect(isMagicWeapon(makeWeapon('thunder'))).toBe(true);
    expect(isMagicWeapon(makeWeapon('wind'))).toBe(true);
    expect(isMagicWeapon(makeWeapon('dark'))).toBe(true);
    expect(isMagicWeapon(makeWeapon('light'))).toBe(true);
  });

  it('does not identify sword/lance/axe/bow/staff/knife as magic', () => {
    expect(isMagicWeapon(makeWeapon('sword'))).toBe(false);
    expect(isMagicWeapon(makeWeapon('lance'))).toBe(false);
    expect(isMagicWeapon(makeWeapon('axe'))).toBe(false);
    expect(isMagicWeapon(makeWeapon('bow'))).toBe(false);
    expect(isMagicWeapon(makeWeapon('staff'))).toBe(false);
    expect(isMagicWeapon(makeWeapon('knife'))).toBe(false);
  });
});

describe('getEffectiveWeaponRange', () => {
  it('returns native range for proficient mage with fire tome', () => {
    const fireTome = makeWeapon('fire', { minRange: 1, maxRange: 2 });
    const mage = makeUnit('mage', { classId: 'mage', equippedWeapon: fireTome });
    const range = getEffectiveWeaponRange(mage, fireTome);
    expect(range).toEqual({ minRange: 1, maxRange: 2 });
  });

  it('returns range 1 for non-proficient fighter with fire tome', () => {
    const fireTome = makeWeapon('fire', { minRange: 1, maxRange: 2 });
    const fighter = makeUnit('fighter', { classId: 'fighter', equippedWeapon: fireTome });
    const range = getEffectiveWeaponRange(fighter, fireTome);
    expect(range).toEqual({ minRange: 1, maxRange: 1 });
  });

  it('returns range 1 for non-proficient unit with staff', () => {
    const staff = makeWeapon('staff', { minRange: 1, maxRange: 1 });
    const fighter = makeUnit('fighter', { classId: 'fighter', equippedWeapon: staff });
    const range = getEffectiveWeaponRange(fighter, staff);
    expect(range).toEqual({ minRange: 1, maxRange: 1 });
  });

  it('returns native range for proficient cleric with staff', () => {
    const staff = makeWeapon('staff', { minRange: 1, maxRange: 2 });
    const cleric = makeUnit('cleric', { classId: 'cleric', equippedWeapon: staff });
    const range = getEffectiveWeaponRange(cleric, staff);
    expect(range).toEqual({ minRange: 1, maxRange: 2 });
  });

  it('returns native range for proficient lord with sword', () => {
    const sword = makeWeapon('sword', { minRange: 1, maxRange: 1 });
    const lord = makeUnit('lord', { classId: 'lord', equippedWeapon: sword });
    const range = getEffectiveWeaponRange(lord, sword);
    expect(range).toEqual({ minRange: 1, maxRange: 1 });
  });

  it('returns native range for non-proficient unit with physical weapon (penalty is on damage, not range)', () => {
    const sword = makeWeapon('sword', { minRange: 1, maxRange: 1 });
    const mage = makeUnit('mage', { classId: 'mage', equippedWeapon: sword });
    const range = getEffectiveWeaponRange(mage, sword);
    expect(range).toEqual({ minRange: 1, maxRange: 1 });
  });

  it('returns range 1 for non-proficient unit with dark magic', () => {
    const darkTome = makeWeapon('dark', { minRange: 1, maxRange: 2 });
    const lord = makeUnit('lord', { classId: 'lord', equippedWeapon: darkTome });
    const range = getEffectiveWeaponRange(lord, darkTome);
    expect(range).toEqual({ minRange: 1, maxRange: 1 });
  });

  it('returns range 1 for non-proficient unit with light magic', () => {
    const lightTome = makeWeapon('light', { minRange: 1, maxRange: 2 });
    const fighter = makeUnit('fighter', { classId: 'fighter', equippedWeapon: lightTome });
    const range = getEffectiveWeaponRange(fighter, lightTome);
    expect(range).toEqual({ minRange: 1, maxRange: 1 });
  });
});

describe('isWeaponProficient', () => {
  it('lord is proficient with sword', () => {
    const sword = makeWeapon('sword');
    const lord = makeUnit('lord', { classId: 'lord' });
    expect(isWeaponProficient(lord, sword)).toBe(true);
  });

  it('lord is not proficient with fire magic', () => {
    const fire = makeWeapon('fire');
    const lord = makeUnit('lord', { classId: 'lord' });
    expect(isWeaponProficient(lord, fire)).toBe(false);
  });

  it('mage is proficient with fire magic', () => {
    const fire = makeWeapon('fire');
    const mage = makeUnit('mage', { classId: 'mage' });
    expect(isWeaponProficient(mage, fire)).toBe(true);
  });

  it('cleric is proficient with staff', () => {
    const staff = makeWeapon('staff');
    const cleric = makeUnit('cleric', { classId: 'cleric' });
    expect(isWeaponProficient(cleric, staff)).toBe(true);
  });

  it('fighter is not proficient with staff', () => {
    const staff = makeWeapon('staff');
    const fighter = makeUnit('fighter', { classId: 'fighter' });
    expect(isWeaponProficient(fighter, staff)).toBe(false);
  });
});
