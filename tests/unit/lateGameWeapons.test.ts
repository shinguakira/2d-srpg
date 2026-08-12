import { describe, it, expect } from 'vitest';
import { calculateCombatForecast } from '../../src/core/combat';
import { WEAPONS } from '../../src/data/weapons';
import type { Unit } from '../../src/core/types';

function makeUnit(overrides: Partial<Unit> = {}): Unit {
  return {
    id: 'player1',
    name: 'Player',
    classId: 'lord',
    faction: 'player',
    position: { x: 0, y: 0 },
    stats: {
      hp: 30,
      str: 12,
      mag: 15,
      def: 8,
      res: 8,
      spd: 12,
      skl: 14,
      lck: 8,
      mov: 5,
      cha: 0,
      wil: 0,
    },
    currentHp: 30,
    level: 15,
    exp: 0,
    equippedWeapon: { ...WEAPONS.iron_sword },
    inventory: [{ ...WEAPONS.iron_sword }],
    items: [],
    hasActed: false,
    skills: [],
    learnedSkills: [],
    facing: 'down',
    sprite: '',
    metaStats: { awr: 50, loop: 347, sync: 70, loy: 50, crp: 0, sta: 0 },
    ...overrides,
  };
}

describe('Late-Game Weapons', () => {
  describe('Memory Blade', () => {
    it('has dynamic might based on LOOP stat', () => {
      const attacker = makeUnit({
        equippedWeapon: { ...WEAPONS.memory_blade },
        metaStats: { awr: 50, loop: 347, sync: 70, loy: 50, crp: 0, sta: 0 },
      });
      const defender = makeUnit({
        id: 'enemy',
        faction: 'enemy',
        equippedWeapon: { ...WEAPONS.iron_lance },
      });
      const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);
      // Memory Blade dynamic might = 1 + floor(347 / 30) = 1 + 11 = 12
      // Damage = str(12) + might(12) - def(8) + triangle(sword vs lance = -1) = 15
      expect(forecast.attackerDamage).toBe(15);
    });
  });

  describe('Cycle Breaker Bow', () => {
    it('exists with correct stats', () => {
      const weapon = WEAPONS.cycle_breaker_bow;
      expect(weapon).toBeDefined();
      expect(weapon.type).toBe('bow');
      expect(weapon.might).toBe(14);
      expect(weapon.minRange).toBe(2);
      expect(weapon.maxRange).toBe(3);
      expect(weapon.prf).toBe('bryn');
    });

    it('deals effective damage vs system_construct', () => {
      const attacker = makeUnit({
        equippedWeapon: { ...WEAPONS.cycle_breaker_bow },
      });
      const construct = makeUnit({
        id: 'enemy',
        faction: 'enemy',
        equippedWeapon: { ...WEAPONS.iron_sword },
        tags: ['system_construct'],
      });
      const normalEnemy = makeUnit({
        id: 'enemy2',
        faction: 'enemy',
        equippedWeapon: { ...WEAPONS.iron_sword },
      });
      const forecastVsConstruct = calculateCombatForecast(attacker, construct, 'plain', 'plain', 2);
      const forecastVsNormal = calculateCombatForecast(attacker, normalEnemy, 'plain', 'plain', 2);
      // Effective: +2x weapon might bonus = +28 extra
      expect(forecastVsConstruct.attackerDamage).toBeGreaterThan(forecastVsNormal.attackerDamage);
      expect(forecastVsConstruct.attackerDamage - forecastVsNormal.attackerDamage).toBe(28);
    });
  });

  describe("Echo's Interface", () => {
    it('exists with correct stats', () => {
      const weapon = WEAPONS.echos_interface;
      expect(weapon).toBeDefined();
      expect(weapon.type).toBe('light');
      expect(weapon.might).toBe(0);
      expect(weapon.prf).toBe('echo');
    });

    it('uses target CRP as might', () => {
      const attacker = makeUnit({
        equippedWeapon: { ...WEAPONS.echos_interface },
      });
      const corruptedEnemy = makeUnit({
        id: 'enemy',
        faction: 'enemy',
        equippedWeapon: { ...WEAPONS.iron_sword },
        metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 40, sta: 0 },
      });
      const cleanEnemy = makeUnit({
        id: 'enemy2',
        faction: 'enemy',
        equippedWeapon: { ...WEAPONS.iron_sword },
        metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
      });

      const forecastCorrupt = calculateCombatForecast(
        attacker,
        corruptedEnemy,
        'plain',
        'plain',
        1,
      );
      const forecastClean = calculateCombatForecast(attacker, cleanEnemy, 'plain', 'plain', 1);

      // vs corrupted: mag(15) + might(40) - res(8) = 47, + light magic bonus on top
      // vs clean: mag(15) + might(1) - res(8) = 8 (minimum 1 might)
      expect(forecastCorrupt.attackerDamage).toBeGreaterThan(forecastClean.attackerDamage);
    });
  });

  describe('Rapier effective damage', () => {
    it('deals effective damage vs armored', () => {
      const attacker = makeUnit({
        equippedWeapon: { ...WEAPONS.rapier },
      });
      const armored = makeUnit({
        id: 'enemy',
        faction: 'enemy',
        classId: 'knight',
        equippedWeapon: { ...WEAPONS.iron_lance },
      });
      const normal = makeUnit({
        id: 'enemy2',
        faction: 'enemy',
        classId: 'soldier',
        equippedWeapon: { ...WEAPONS.iron_lance },
      });
      const forecastArmored = calculateCombatForecast(attacker, armored, 'plain', 'plain', 1);
      const forecastNormal = calculateCombatForecast(attacker, normal, 'plain', 'plain', 1);
      // Effective bonus = +14 (2x rapier might of 7)
      expect(forecastArmored.attackerDamage - forecastNormal.attackerDamage).toBe(14);
    });
  });
});
