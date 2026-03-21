import { describe, it, expect } from 'vitest';
import {
  checkPhaseTransition,
  applyPhaseTransition,
  getBossImmunity,
  getBossSelfHeal,
  advanceWeaponCycle,
  checkCorruptionLayerStrip,
  stripCorruptionLayer,
  applyBossImmunity,
} from '../../src/core/bossPhase';
import type { Unit, BossPhase, Weapon } from '../../src/core/types';

function makeBoss(overrides: Partial<Unit> = {}): Unit {
  return {
    id: 'boss1', name: 'Boss', classId: 'lord', faction: 'enemy',
    position: { x: 5, y: 5 },
    stats: { hp: 120, str: 20, mag: 10, def: 15, res: 10, spd: 12, skl: 14, lck: 8, mov: 3, cha: 0, wil: 0 },
    currentHp: 120, level: 20, exp: 0,
    equippedWeapon: { id: 'iron_sword', name: 'Iron Sword', type: 'sword', might: 8, hit: 90, crit: 5, weight: 7, minRange: 1, maxRange: 1 },
    inventory: [
      { id: 'iron_sword', name: 'Iron Sword', type: 'sword', might: 8, hit: 90, crit: 5, weight: 7, minRange: 1, maxRange: 1 },
      { id: 'iron_lance', name: 'Iron Lance', type: 'lance', might: 7, hit: 85, crit: 0, weight: 8, minRange: 1, maxRange: 1 },
      { id: 'iron_axe', name: 'Iron Axe', type: 'axe', might: 9, hit: 75, crit: 5, weight: 10, minRange: 1, maxRange: 1 },
    ],
    items: [], hasActed: false, skills: [], learnedSkills: [],
    facing: 'down', sprite: '',
    aiBehavior: { type: 'boss' },
    metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
    ...overrides,
  };
}

const THREE_PHASES: BossPhase[] = [
  { hpThreshold: 120, selfHeal: 0 },
  { hpThreshold: 80, statChanges: { str: 25 }, weaponId: 'iron_lance', selfHeal: 5, immunity: 'physical' },
  { hpThreshold: 40, statChanges: { str: 30, spd: 18 }, selfHeal: 10 },
];

describe('Multi-Phase Boss System', () => {
  describe('checkPhaseTransition', () => {
    it('returns next phase when HP crosses threshold', () => {
      const boss = makeBoss({ bossPhases: THREE_PHASES, currentBossPhase: 0 });
      const result = checkPhaseTransition(boss, 75); // below 80 threshold
      expect(result).not.toBeNull();
      expect(result!.hpThreshold).toBe(80);
    });

    it('returns null when HP above next threshold', () => {
      const boss = makeBoss({ bossPhases: THREE_PHASES, currentBossPhase: 0 });
      expect(checkPhaseTransition(boss, 90)).toBeNull();
    });

    it('returns null when already on last phase', () => {
      const boss = makeBoss({ bossPhases: THREE_PHASES, currentBossPhase: 2 });
      expect(checkPhaseTransition(boss, 10)).toBeNull();
    });

    it('returns null for boss without phases', () => {
      const boss = makeBoss();
      expect(checkPhaseTransition(boss, 50)).toBeNull();
    });
  });

  describe('applyPhaseTransition', () => {
    it('heals boss to threshold HP', () => {
      const boss = makeBoss({ bossPhases: THREE_PHASES, currentBossPhase: 0, currentHp: 60 });
      const result = applyPhaseTransition(boss, THREE_PHASES[1], 1);
      expect(result.currentHp).toBe(80);
      expect(result.currentBossPhase).toBe(1);
    });

    it('applies stat changes', () => {
      const boss = makeBoss({ bossPhases: THREE_PHASES, currentBossPhase: 0 });
      const result = applyPhaseTransition(boss, THREE_PHASES[1], 1);
      expect(result.stats.str).toBe(25);
    });

    it('applies AI override', () => {
      const phase: BossPhase = { hpThreshold: 50, aiOverride: { type: 'aggressive' } };
      const boss = makeBoss({ aiBehavior: { type: 'boss' } });
      const result = applyPhaseTransition(boss, phase, 1);
      expect(result.aiBehavior?.type).toBe('aggressive');
    });
  });

  describe('getBossImmunity', () => {
    it('returns phase immunity', () => {
      const boss = makeBoss({ bossPhases: THREE_PHASES, currentBossPhase: 1 });
      expect(getBossImmunity(boss)).toBe('physical');
    });

    it('returns null for no immunity', () => {
      const boss = makeBoss({ bossPhases: THREE_PHASES, currentBossPhase: 0 });
      expect(getBossImmunity(boss)).toBeNull();
    });

    it('returns null for non-phase boss', () => {
      const boss = makeBoss();
      expect(getBossImmunity(boss)).toBeNull();
    });
  });

  describe('getBossSelfHeal', () => {
    it('returns heal amount for current phase', () => {
      const boss = makeBoss({ bossPhases: THREE_PHASES, currentBossPhase: 1 });
      expect(getBossSelfHeal(boss)).toBe(5);
    });

    it('returns 0 for phase without self-heal', () => {
      const boss = makeBoss({ bossPhases: THREE_PHASES, currentBossPhase: 0 });
      expect(getBossSelfHeal(boss)).toBe(0);
    });
  });

  describe('advanceWeaponCycle', () => {
    it('cycles to next weapon', () => {
      const boss = makeBoss({
        weaponCycleOrder: ['sword', 'lance', 'axe'],
        weaponCycleIndex: 0,
      });
      const result = advanceWeaponCycle(boss);
      expect(result.weaponCycleIndex).toBe(1);
      expect(result.equippedWeapon.type).toBe('lance');
    });

    it('wraps around to first weapon', () => {
      const boss = makeBoss({
        weaponCycleOrder: ['sword', 'lance', 'axe'],
        weaponCycleIndex: 2,
      });
      const result = advanceWeaponCycle(boss);
      expect(result.weaponCycleIndex).toBe(0);
      expect(result.equippedWeapon.type).toBe('sword');
    });

    it('returns unchanged boss without cycle order', () => {
      const boss = makeBoss();
      const result = advanceWeaponCycle(boss);
      expect(result).toBe(boss);
    });
  });

  describe('checkCorruptionLayerStrip', () => {
    it('returns true when attacker has weapon advantage', () => {
      const sword: Weapon = { id: 's', name: 'Sword', type: 'sword', might: 5, hit: 90, crit: 0, weight: 5, minRange: 1, maxRange: 1 };
      const axe: Weapon = { id: 'a', name: 'Axe', type: 'axe', might: 5, hit: 90, crit: 0, weight: 5, minRange: 1, maxRange: 1 };
      expect(checkCorruptionLayerStrip(sword, axe)).toBe(true); // sword > axe
    });

    it('returns false when no advantage', () => {
      const sword: Weapon = { id: 's', name: 'Sword', type: 'sword', might: 5, hit: 90, crit: 0, weight: 5, minRange: 1, maxRange: 1 };
      const lance: Weapon = { id: 'l', name: 'Lance', type: 'lance', might: 5, hit: 90, crit: 0, weight: 5, minRange: 1, maxRange: 1 };
      expect(checkCorruptionLayerStrip(sword, lance)).toBe(false); // sword < lance
    });
  });

  describe('stripCorruptionLayer', () => {
    it('decrements layers', () => {
      const boss = makeBoss({ corruptionLayers: 3 });
      const result = stripCorruptionLayer(boss);
      expect(result.corruptionLayers).toBe(2);
    });

    it('does not go below 0', () => {
      const boss = makeBoss({ corruptionLayers: 0 });
      const result = stripCorruptionLayer(boss);
      expect(result.corruptionLayers).toBe(0);
    });
  });

  describe('applyBossImmunity', () => {
    it('blocks physical damage when physical immunity', () => {
      expect(applyBossImmunity(15, 'sword', 'physical')).toBe(0);
      expect(applyBossImmunity(15, 'bow', 'physical')).toBe(0);
    });

    it('allows magical damage through physical immunity', () => {
      expect(applyBossImmunity(15, 'fire', 'physical')).toBe(15);
    });

    it('blocks magical damage when magical immunity', () => {
      expect(applyBossImmunity(15, 'fire', 'magical')).toBe(0);
      expect(applyBossImmunity(15, 'thunder', 'magical')).toBe(0);
    });

    it('allows physical damage through magical immunity', () => {
      expect(applyBossImmunity(15, 'sword', 'magical')).toBe(15);
    });

    it('no change with no immunity', () => {
      expect(applyBossImmunity(15, 'sword', null)).toBe(15);
    });
  });
});
