import { describe, it, expect } from 'vitest';
import { hasSkill, resolvePerHitSkills, resolveDefenseSkills } from '../../src/core/skills';
import { SKILLS } from '../../src/data/skills';
import { ALL_CLASSES } from '../../src/data/promotedClasses';
import {
  canPromote,
  getStatCaps,
  applyPromotion,
  getPromotionOptions,
} from '../../src/core/promotion';
import type { Unit } from '../../src/core/types';

function makeUnit(overrides: Partial<Unit> = {}): Unit {
  return {
    id: 'test',
    name: 'Test',
    classId: 'lord',
    faction: 'player',
    position: { x: 0, y: 0 },
    stats: {
      hp: 30,
      str: 12,
      mag: 8,
      def: 8,
      res: 5,
      spd: 10,
      skl: 15,
      lck: 8,
      mov: 5,
      cha: 0,
      wil: 0,
    },
    currentHp: 30,
    level: 10,
    exp: 0,
    equippedWeapon: {
      id: 'iron_sword',
      name: 'Iron Sword',
      type: 'sword',
      might: 5,
      hit: 90,
      crit: 0,
      weight: 5,
      minRange: 1,
      maxRange: 1,
    },
    inventory: [],
    items: [],
    hasActed: false,
    skills: [],
    learnedSkills: [],
    facing: 'down',
    sprite: '',
    metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
    ...overrides,
  };
}

const alwaysRoll = { roll: () => true };
const neverRoll = { roll: () => false };

describe('Master Class Skills', () => {
  it('all 8 master skill definitions exist', () => {
    const ids = [
      'cycle_authority',
      'tri_magic',
      'bloodlust',
      'divine_wings',
      'ironwall',
      'vanish',
      'balance',
      'terror_aura',
    ];
    for (const id of ids) {
      expect(SKILLS[id]).toBeDefined();
      expect(SKILLS[id].isInnate).toBe(true);
    }
  });

  it('hasSkill detects trauma skills', () => {
    const unit = makeUnit({ traumaSkills: ['survivors_guilt'] });
    expect(hasSkill(unit, 'survivors_guilt')).toBe(true);
    expect(hasSkill(unit, 'vengeance_trauma')).toBe(false);
  });

  describe('bloodlust (Aether = Sol+Luna)', () => {
    it('activates at SKL% and combines heal + halved DEF bonus', () => {
      const attacker = makeUnit({ skills: ['bloodlust'] });
      const defender = makeUnit({ stats: { ...makeUnit().stats, def: 10 } });
      const result = resolvePerHitSkills(attacker, defender, 8, alwaysRoll);
      expect(result.skillId).toBe('bloodlust');
      // Luna bonus: floor(10/2) = 5
      expect(result.modifiedDamage).toBe(8 + 5);
      expect(result.healAmount).toBe(8 + 5); // Sol heal = modified damage
      expect(result.instantKill).toBe(false);
    });

    it('does not activate when roll fails', () => {
      const attacker = makeUnit({ skills: ['bloodlust'] });
      const defender = makeUnit();
      const result = resolvePerHitSkills(attacker, defender, 8, neverRoll);
      expect(result.skillId).toBeNull();
    });
  });

  describe('terror_aura (Lethality+)', () => {
    it('instant kills at SKL/2%', () => {
      const attacker = makeUnit({ skills: ['terror_aura'] });
      const defender = makeUnit();
      const result = resolvePerHitSkills(attacker, defender, 10, alwaysRoll);
      expect(result.skillId).toBe('terror_aura');
      expect(result.instantKill).toBe(true);
    });

    it('works even against bosses (unlike regular lethality)', () => {
      const attacker = makeUnit({ skills: ['terror_aura'] });
      const defender = makeUnit();
      // isBoss = true, but terror_aura doesn't check for boss
      const result = resolvePerHitSkills(attacker, defender, 10, alwaysRoll, true);
      expect(result.skillId).toBe('terror_aura');
      expect(result.instantKill).toBe(true);
    });
  });

  describe('cycle_authority (negate lethal hit)', () => {
    it('survives a lethal hit at 1 HP', () => {
      const defender = makeUnit({ currentHp: 5, skills: ['cycle_authority'] });
      const result = resolveDefenseSkills(defender, 10, false, neverRoll);
      expect(result.skillId).toBe('cycle_authority');
      expect(result.reducedDamage).toBe(4); // currentHp(5) - 1
      expect(result.miracleSaved).toBe(true);
    });

    it('does not activate on non-lethal damage', () => {
      const defender = makeUnit({ currentHp: 20, skills: ['cycle_authority'] });
      const result = resolveDefenseSkills(defender, 5, false, neverRoll);
      expect(result.skillId).toBeNull();
    });
  });
});

describe('Trauma Skill definitions', () => {
  it('all 5 trauma skill definitions exist', () => {
    const ids = ['survivors_guilt', 'vengeance_trauma', 'numb', 'last_stand', 'grief'];
    for (const id of ids) {
      expect(SKILLS[id]).toBeDefined();
    }
  });
});

describe('Master Class Definitions', () => {
  const masterIds = [
    'overlord',
    'archsage',
    'marshal',
    'reaver',
    'seraph',
    'dragon_lord',
    'phantom',
    'oracle',
  ];

  it('all 8 master classes exist with tier master', () => {
    for (const id of masterIds) {
      const cls = ALL_CLASSES[id];
      expect(cls).toBeDefined();
      expect(cls.tier).toBe('master');
    }
  });

  it('all master classes have an innate skill', () => {
    const expected: Record<string, string> = {
      overlord: 'cycle_authority',
      archsage: 'tri_magic',
      marshal: 'ironwall',
      reaver: 'bloodlust',
      seraph: 'divine_wings',
      dragon_lord: 'terror_aura',
      phantom: 'vanish',
      oracle: 'balance',
    };
    for (const [id, skillId] of Object.entries(expected)) {
      expect(ALL_CLASSES[id].innateSkills).toContain(skillId);
    }
  });

  it('all master classes have a key stat cap of 40', () => {
    const keyCaps: Record<string, string> = {
      overlord: 'str',
      archsage: 'mag',
      marshal: 'def',
      reaver: 'str',
      seraph: 'spd',
      dragon_lord: 'def',
      phantom: 'spd',
      oracle: 'mag',
    };
    for (const [id, stat] of Object.entries(keyCaps)) {
      const caps = getStatCaps(id);
      expect(caps[stat as keyof typeof caps]).toBe(40);
    }
  });

  it('master default caps are HP 99, others 35', () => {
    const caps = getStatCaps('overlord');
    expect(caps.hp).toBe(99);
    expect(caps.def).toBe(35); // non-key stat
    expect(caps.lck).toBe(45);
  });

  it('canPromote requires level 30 for promoted → master', () => {
    const unit29 = makeUnit({ classId: 'great_lord', level: 29 });
    const unit30 = makeUnit({ classId: 'great_lord', level: 30 });
    expect(canPromote(unit29)).toBe(false);
    expect(canPromote(unit30)).toBe(true);
  });

  it('getPromotionOptions returns master class for promoted class', () => {
    const unit = makeUnit({ classId: 'sage', level: 30 });
    const options = getPromotionOptions(unit);
    expect(options.length).toBeGreaterThan(0);
    expect(options[0].id).toBe('archsage');
    expect(options[0].tier).toBe('master');
  });

  it('applyPromotion applies bonuses and clamps to master caps', () => {
    const unit = makeUnit({
      classId: 'sage',
      level: 30,
      stats: {
        hp: 40,
        str: 5,
        mag: 28,
        def: 10,
        res: 20,
        spd: 18,
        skl: 15,
        lck: 12,
        mov: 6,
        cha: 5,
        wil: 5,
      },
      currentHp: 40,
    });
    const promoted = applyPromotion(unit, 'archsage');
    expect(promoted.classId).toBe('archsage');
    expect(promoted.stats.hp).toBe(43); // 40 + 3 bonus
    expect(promoted.stats.mag).toBe(31); // 28 + 3 bonus
    expect(promoted.currentHp).toBe(43); // hp increased by bonus
  });

  it('master classes cannot promote further', () => {
    const masterUnit = makeUnit({ classId: 'overlord', level: 40 });
    expect(canPromote(masterUnit)).toBe(false);
  });
});
