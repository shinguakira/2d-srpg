import { describe, it, expect } from 'vitest';
import { calculateCombatForecast, resolveCombat } from '../../src/core/combat';
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
    classId: 'lord',
    faction: 'player',
    position: { x: 0, y: 0 },
    stats: {
      hp: 20,
      str: 8,
      mag: 4,
      def: 5,
      res: 3,
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
    ...overrides,
  };
}

describe('Combat + Meta-Stats Integration', () => {
  describe('Memory Blade', () => {
    it('scales damage with LOOP', () => {
      // Memory Blade: might = 1 + floor(LOOP / 30)
      // LOOP 347 → might = 1 + floor(347/30) = 1 + 11 = 12
      const attacker = makeUnit('shigeru', {
        equippedWeapon: makeWeapon('sword', { id: 'memory_blade', name: 'Memory Blade', might: 1 }),
        metaStats: { awr: 0, loop: 347, sync: 70, loy: 50, crp: 0, sta: 0 },
      });
      const defender = makeUnit('enemy', {
        faction: 'enemy',
        position: { x: 1, y: 0 },
      });

      const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);
      // Damage = str(8) + memoryBladeMight(12) - def(5) = 15
      expect(forecast.attackerDamage).toBe(15);
    });

    it('has low damage with 0 LOOP', () => {
      // LOOP 0 → might = 1 + floor(0/30) = 1
      const attacker = makeUnit('shigeru', {
        equippedWeapon: makeWeapon('sword', { id: 'memory_blade', name: 'Memory Blade', might: 1 }),
        metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
      });
      const defender = makeUnit('enemy', {
        faction: 'enemy',
        position: { x: 1, y: 0 },
      });

      const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);
      // Damage = str(8) + memoryBladeMight(1) - def(5) = 4
      expect(forecast.attackerDamage).toBe(4);
    });

    it('handles defender with Memory Blade', () => {
      const attacker = makeUnit('player1', {
        position: { x: 0, y: 0 },
      });
      const defender = makeUnit('shigeru', {
        faction: 'enemy',
        position: { x: 1, y: 0 },
        equippedWeapon: makeWeapon('sword', { id: 'memory_blade', name: 'Memory Blade', might: 1 }),
        metaStats: { awr: 0, loop: 120, sync: 70, loy: 50, crp: 0, sta: 0 },
      });

      const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);
      // Defender damage = str(8) + memoryBladeMight(1 + floor(120/30) = 5) - def(5) = 8
      expect(forecast.defenderDamage).toBe(8);
    });
  });

  describe('Light magic bonus', () => {
    it('deals +50% damage against units with CRP > 0', () => {
      const attacker = makeUnit('mage', {
        classId: 'monk',
        stats: {
          hp: 20,
          str: 0,
          mag: 10,
          def: 3,
          res: 5,
          spd: 6,
          skl: 8,
          lck: 4,
          mov: 5,
          cha: 0,
          wil: 0,
        },
        equippedWeapon: makeWeapon('light', { might: 6 }),
      });
      const defender = makeUnit('enemy', {
        faction: 'enemy',
        position: { x: 1, y: 0 },
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 4,
          spd: 5,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
        metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 30, sta: 0 },
      });

      const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);
      // Base damage = mag(10) + might(6) - res(4) = 12
      // With light bonus: floor(12 * 1.5) = 18
      expect(forecast.attackerDamage).toBe(18);
    });

    it('no bonus when defender CRP is 0', () => {
      const attacker = makeUnit('mage', {
        classId: 'monk',
        stats: {
          hp: 20,
          str: 0,
          mag: 10,
          def: 3,
          res: 5,
          spd: 6,
          skl: 8,
          lck: 4,
          mov: 5,
          cha: 0,
          wil: 0,
        },
        equippedWeapon: makeWeapon('light', { might: 6 }),
      });
      const defender = makeUnit('enemy', {
        faction: 'enemy',
        position: { x: 1, y: 0 },
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 4,
          spd: 5,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
        metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
      });

      const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);
      // Base damage = mag(10) + might(6) - res(4) = 12
      expect(forecast.attackerDamage).toBe(12);
    });
  });

  describe('STA penalties in combat', () => {
    it('reduces SPD at STA >= 30, preventing doubles', () => {
      // Attacker SPD 7, defender SPD 4 → normally doubles (diff >= 4)
      const attacker = makeUnit('player1', {
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 3,
          spd: 7,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
        metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 30 },
      });
      const defender = makeUnit('enemy', {
        faction: 'enemy',
        position: { x: 1, y: 0 },
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 3,
          spd: 4,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
      });

      const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);
      // Effective SPD = 7 - 1 = 6, diff 6-4=2 < 4, no double
      expect(forecast.attackerCanDouble).toBe(false);
    });

    it('reduces damage via lower SKL at STA >= 45', () => {
      // STA 45 → -2 SPD, -1 SKL
      const attacker = makeUnit('player1', {
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 3,
          spd: 10,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
        metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 45 },
      });
      const noStaAttacker = makeUnit('player2', {
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 3,
          spd: 10,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
        metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
      });
      const defender = makeUnit('enemy', {
        faction: 'enemy',
        position: { x: 1, y: 0 },
      });

      const forecastTired = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);
      const forecastFresh = calculateCombatForecast(noStaAttacker, defender, 'plain', 'plain', 1);

      // SKL drops by 1, so hit should be lower by 2 (SKL contributes 2× to accuracy)
      expect(forecastTired.attackerHit).toBe(forecastFresh.attackerHit - 2);
    });
  });

  describe('CRP drain in combat', () => {
    it('reduces combat stats at CRP >= 60', () => {
      const corruptedAttacker = makeUnit('corrupted', {
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 3,
          spd: 7,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
        metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 60, sta: 0 },
      });
      const cleanAttacker = makeUnit('clean', {
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 3,
          spd: 7,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
      });
      const defender = makeUnit('enemy', {
        faction: 'enemy',
        position: { x: 1, y: 0 },
      });

      const forecastCorrupted = calculateCombatForecast(
        corruptedAttacker,
        defender,
        'plain',
        'plain',
        1,
      );
      const forecastClean = calculateCombatForecast(cleanAttacker, defender, 'plain', 'plain', 1);

      // CRP 60: -1 str → -1 damage
      expect(forecastCorrupted.attackerDamage).toBe(forecastClean.attackerDamage - 1);
    });

    it('reduces combat stats more at CRP >= 80', () => {
      const corrupted80 = makeUnit('corrupted80', {
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 3,
          spd: 7,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
        metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 80, sta: 0 },
      });
      const cleanAttacker = makeUnit('clean', {
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 3,
          spd: 7,
          skl: 5,
          lck: 5,
          mov: 5,
          cha: 0,
          wil: 0,
        },
      });
      const defender = makeUnit('enemy', {
        faction: 'enemy',
        position: { x: 1, y: 0 },
      });

      const forecastCorrupted = calculateCombatForecast(corrupted80, defender, 'plain', 'plain', 1);
      const forecastClean = calculateCombatForecast(cleanAttacker, defender, 'plain', 'plain', 1);

      // CRP 80: -2 str → -2 damage
      expect(forecastCorrupted.attackerDamage).toBe(forecastClean.attackerDamage - 2);
    });
  });

  describe('SYNC hit bonus', () => {
    it('adds +5 hit when SYNC > 80', () => {
      const highSync = makeUnit('synced', {
        metaStats: { awr: 0, loop: 0, sync: 81, loy: 50, crp: 0, sta: 0 },
      });
      const normalSync = makeUnit('normal', {
        metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
      });
      const defender = makeUnit('enemy', {
        faction: 'enemy',
        position: { x: 1, y: 0 },
      });

      const forecastHigh = calculateCombatForecast(highSync, defender, 'plain', 'plain', 1);
      const forecastNormal = calculateCombatForecast(normalSync, defender, 'plain', 'plain', 1);

      expect(forecastHigh.attackerHit).toBe(forecastNormal.attackerHit + 5);
    });

    it('no bonus at SYNC = 80', () => {
      const sync80 = makeUnit('sync80', {
        metaStats: { awr: 0, loop: 0, sync: 80, loy: 50, crp: 0, sta: 0 },
      });
      const normalSync = makeUnit('normal', {
        metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
      });
      const defender = makeUnit('enemy', {
        faction: 'enemy',
        position: { x: 1, y: 0 },
      });

      const forecastSync80 = calculateCombatForecast(sync80, defender, 'plain', 'plain', 1);
      const forecastNormal = calculateCombatForecast(normalSync, defender, 'plain', 'plain', 1);

      expect(forecastSync80.attackerHit).toBe(forecastNormal.attackerHit);
    });
  });

  describe('LOY bonus in combat', () => {
    it('grants +1 all stats when LOY >= 80 and near Shigeru', () => {
      const attacker = makeUnit('ally', {
        stats: {
          hp: 20,
          str: 8,
          mag: 4,
          def: 5,
          res: 3,
          spd: 7,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
        metaStats: { awr: 0, loop: 0, sync: 70, loy: 80, crp: 0, sta: 0 },
      });
      const defender = makeUnit('enemy', {
        faction: 'enemy',
        position: { x: 1, y: 0 },
      });

      // Without nearRen
      const forecastFar = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1, {
        attackerNearLord: false,
      });
      // With nearRen
      const forecastNear = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1, {
        attackerNearLord: true,
      });

      // LOY 80 + nearRen: +1 str → +1 damage
      expect(forecastNear.attackerDamage).toBe(forecastFar.attackerDamage + 1);
    });

    it('no bonus when LOY < 80', () => {
      const attacker = makeUnit('ally', {
        metaStats: { awr: 0, loop: 0, sync: 70, loy: 79, crp: 0, sta: 0 },
      });
      const defender = makeUnit('enemy', {
        faction: 'enemy',
        position: { x: 1, y: 0 },
      });

      const forecastFar = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1, {
        attackerNearLord: false,
      });
      const forecastNear = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1, {
        attackerNearLord: true,
      });

      expect(forecastNear.attackerDamage).toBe(forecastFar.attackerDamage);
    });
  });

  describe('SYNC <30 variance in combat resolution', () => {
    it('applies damage variance when attacker SYNC < 30', () => {
      // Run many combats to verify variance appears
      const attacker = makeUnit('unstable', {
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 3,
          spd: 7,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
        equippedWeapon: makeWeapon('sword', { hit: 100, crit: 0, might: 5 }),
        metaStats: { awr: 0, loop: 0, sync: 20, loy: 50, crp: 0, sta: 0 },
      });
      const defender = makeUnit('enemy', {
        faction: 'enemy',
        position: { x: 1, y: 0 },
        stats: {
          hp: 50,
          str: 8,
          mag: 0,
          def: 5,
          res: 3,
          spd: 3,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
        equippedWeapon: makeWeapon('sword', { hit: 0, might: 5 }), // never hits back
      });

      const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);
      const baseDamage = forecast.attackerDamage;

      const damages = new Set<number>();
      for (let seed = 0; seed < 50; seed++) {
        const rng = new SeededRandom(seed);
        const result = resolveCombat(forecast, rng, attacker, defender);
        const hit = result.hits.find((h) => h.attackerIsInitiator && h.hit);
        if (hit) damages.add(hit.damage);
      }

      // Should see more than one damage value due to ±2 variance
      expect(damages.size).toBeGreaterThan(1);
      // All damage values should be within ±2 of base
      for (const d of damages) {
        expect(d).toBeGreaterThanOrEqual(baseDamage - 2);
        expect(d).toBeLessThanOrEqual(baseDamage + 2);
      }
    });

    it('no variance when SYNC >= 30', () => {
      const attacker = makeUnit('stable', {
        equippedWeapon: makeWeapon('sword', { hit: 100, crit: 0, might: 5 }),
        metaStats: { awr: 0, loop: 0, sync: 30, loy: 50, crp: 0, sta: 0 },
      });
      const defender = makeUnit('enemy', {
        faction: 'enemy',
        position: { x: 1, y: 0 },
        stats: {
          hp: 50,
          str: 8,
          mag: 0,
          def: 5,
          res: 3,
          spd: 3,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
        equippedWeapon: makeWeapon('sword', { hit: 0, might: 5 }),
      });

      const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);
      const baseDamage = forecast.attackerDamage;

      const damages = new Set<number>();
      for (let seed = 0; seed < 50; seed++) {
        const rng = new SeededRandom(seed);
        const result = resolveCombat(forecast, rng, attacker, defender);
        const hit = result.hits.find((h) => h.attackerIsInitiator && h.hit);
        if (hit) damages.add(hit.damage);
      }

      // All damage values should be exactly the base (no variance)
      expect(damages.size).toBe(1);
      expect([...damages][0]).toBe(baseDamage);
    });
  });

  describe('resolve combat with meta-stat modifiers', () => {
    it('Memory Blade damage applies to actual hits', () => {
      const rng = new SeededRandom(42);
      const attacker = makeUnit('shigeru', {
        equippedWeapon: makeWeapon('sword', {
          id: 'memory_blade',
          name: 'Memory Blade',
          might: 1,
          hit: 100,
        }),
        metaStats: { awr: 0, loop: 300, sync: 70, loy: 50, crp: 0, sta: 0 },
      });
      const defender = makeUnit('enemy', {
        faction: 'enemy',
        position: { x: 1, y: 0 },
        stats: {
          hp: 30,
          str: 8,
          mag: 0,
          def: 5,
          res: 3,
          spd: 5,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
      });

      const forecast = calculateCombatForecast(attacker, defender, 'plain', 'plain', 1);
      // Memory Blade might = 1 + floor(300/30) = 11
      // Damage = str(8) + might(11) - def(5) = 14
      expect(forecast.attackerDamage).toBe(14);

      const result = resolveCombat(forecast, rng, attacker, defender);
      // At least the first hit should deal the forecast damage (if it hits)
      const firstHit = result.hits.find((h) => h.attackerIsInitiator && h.hit);
      if (firstHit) {
        expect(firstHit.damage).toBeGreaterThan(0);
      }
    });
  });
});
