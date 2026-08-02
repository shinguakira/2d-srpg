import { describe, it, expect } from 'vitest';
import {
  canPromote,
  getPromotionOptions,
  getMatchingPromotionItem,
  applyPromotion,
  calculateSkillSlots,
  getDefaultStatCaps,
  getStatCaps,
  clampStats,
} from '../../src/core/promotion';
import { applyStatGains, type StatGains } from '../../src/core/experience';
import type { Unit, Weapon, ConsumableItem, UnitStats } from '../../src/core/types';

function makeWeapon(): Weapon {
  return {
    id: 'sword',
    name: 'Iron Sword',
    type: 'sword',
    might: 5,
    hit: 90,
    crit: 0,
    weight: 5,
    minRange: 1,
    maxRange: 1,
  };
}

function makeUnit(classId: string, level: number, overrides: Partial<Unit> = {}): Unit {
  return {
    id: 'test',
    name: 'Test',
    classId,
    faction: 'player',
    position: { x: 0, y: 0 },
    stats: {
      hp: 25,
      str: 10,
      mag: 2,
      def: 8,
      res: 3,
      spd: 9,
      skl: 7,
      lck: 5,
      mov: 5,
      cha: 0,
      wil: 0,
    },
    currentHp: 25,
    level,
    exp: 0,
    equippedWeapon: makeWeapon(),
    inventory: [],
    items: [],
    hasActed: false,
    skills: [],
    learnedSkills: [],
    sprite: '',
    metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
    ...overrides,
  };
}

function makePromotionItem(id: string, eligibleClasses: string[]): ConsumableItem {
  return {
    id,
    name: id,
    type: 'consumable',
    uses: 1,
    maxUses: 1,
    effect: { kind: 'promote', eligibleClasses },
  };
}

// ===== canPromote =====

describe('canPromote', () => {
  it('returns false for level 14 base class', () => {
    expect(canPromote(makeUnit('lord', 14))).toBe(false);
  });

  it('returns true for level 15 base class with promotesTo', () => {
    expect(canPromote(makeUnit('lord', 15))).toBe(true);
  });

  it('returns true for level 20 base class', () => {
    expect(canPromote(makeUnit('cavalier', 20))).toBe(true);
  });

  it('returns false for dancer (no promotesTo)', () => {
    expect(canPromote(makeUnit('dancer', 20))).toBe(false);
  });

  it('returns false for already promoted class below level 30', () => {
    expect(canPromote(makeUnit('paladin', 20))).toBe(false);
  });

  it('returns true for promoted class at level 30 (master promotion)', () => {
    expect(canPromote(makeUnit('paladin', 30))).toBe(true);
  });

  it('returns false for master class (no further promotion)', () => {
    expect(canPromote(makeUnit('overlord', 40))).toBe(false);
  });

  it('returns false for unknown classId', () => {
    expect(canPromote(makeUnit('nonexistent', 15))).toBe(false);
  });
});

// ===== getPromotionOptions =====

describe('getPromotionOptions', () => {
  it('returns two options for lord', () => {
    const options = getPromotionOptions(makeUnit('lord', 15));
    expect(options).toHaveLength(2);
    expect(options.map((o) => o.id)).toEqual(['great_lord', 'conqueror']);
  });

  it('returns two options for cavalier', () => {
    const options = getPromotionOptions(makeUnit('cavalier', 15));
    expect(options).toHaveLength(2);
    expect(options.map((o) => o.id)).toEqual(['paladin', 'great_knight']);
  });

  it('returns empty for dancer', () => {
    expect(getPromotionOptions(makeUnit('dancer', 20))).toEqual([]);
  });

  it('returns master options for promoted class', () => {
    const options = getPromotionOptions(makeUnit('great_lord', 30));
    expect(options.length).toBeGreaterThan(0);
    expect(options.every((o) => o.tier === 'master')).toBe(true);
  });
});

// ===== getMatchingPromotionItem =====

describe('getMatchingPromotionItem', () => {
  it('returns index of matching class-specific item', () => {
    const unit = makeUnit('lord', 15, {
      items: [makePromotionItem('hero_crest', ['lord', 'mercenary', 'fighter'])],
    });
    expect(getMatchingPromotionItem(unit)).toBe(0);
  });

  it('returns index of universal master_seal', () => {
    const unit = makeUnit('mage', 15, {
      items: [makePromotionItem('master_seal', [])],
    });
    expect(getMatchingPromotionItem(unit)).toBe(0);
  });

  it('returns -1 when no matching item', () => {
    const unit = makeUnit('lord', 15, {
      items: [makePromotionItem('knight_crest', ['cavalier', 'soldier', 'knight'])],
    });
    expect(getMatchingPromotionItem(unit)).toBe(-1);
  });

  it('returns -1 when no items at all', () => {
    expect(getMatchingPromotionItem(makeUnit('lord', 15))).toBe(-1);
  });

  it('returns first matching when multiple items', () => {
    const unit = makeUnit('lord', 15, {
      items: [
        makePromotionItem('knight_crest', ['cavalier']),
        makePromotionItem('hero_crest', ['lord', 'mercenary']),
      ],
    });
    expect(getMatchingPromotionItem(unit)).toBe(1);
  });
});

// ===== applyPromotion =====

describe('applyPromotion', () => {
  it('applies stat bonuses correctly for great_lord', () => {
    const unit = makeUnit('lord', 15);
    const promoted = applyPromotion(unit, 'great_lord');

    expect(promoted.classId).toBe('great_lord');
    // great_lord bonuses: hp: 3, str: 2, spd: 1, def: 1, skl: 1, mov: 1
    expect(promoted.stats.hp).toBe(25 + 3);
    expect(promoted.stats.str).toBe(10 + 2);
    expect(promoted.stats.spd).toBe(9 + 1);
    expect(promoted.stats.def).toBe(8 + 1);
    expect(promoted.stats.skl).toBe(7 + 1);
    expect(promoted.stats.mov).toBe(5 + 1);
  });

  it('preserves level (no reset)', () => {
    const unit = makeUnit('lord', 18);
    const promoted = applyPromotion(unit, 'great_lord');
    expect(promoted.level).toBe(18);
  });

  it('increases currentHp by HP bonus', () => {
    const unit = makeUnit('lord', 15, { currentHp: 20 });
    const promoted = applyPromotion(unit, 'great_lord');
    // HP bonus is 3 → currentHp goes from 20 to 23
    expect(promoted.currentHp).toBe(23);
  });

  it('clamps stats to new tier caps', () => {
    // Give unit unreasonably high stats, then promote
    const unit = makeUnit('lord', 15, {
      stats: {
        hp: 78,
        str: 29,
        mag: 29,
        def: 29,
        res: 29,
        spd: 29,
        skl: 29,
        lck: 39,
        mov: 5,
        cha: 0,
        wil: 0,
      },
      currentHp: 78,
    });
    const promoted = applyPromotion(unit, 'great_lord');
    // Promoted caps: str/mag/def/res/spd/skl = 30, lck = 40, hp = 80
    expect(promoted.stats.str).toBe(30); // 29+2 = 31, clamped to 30
    expect(promoted.stats.hp).toBe(80); // 78+3 = 81, clamped to 80
    expect(promoted.stats.lck).toBe(39); // 39+0 = 39, under cap 40
  });

  it('returns unit unchanged for unknown targetClassId', () => {
    const unit = makeUnit('lord', 15);
    const result = applyPromotion(unit, 'nonexistent');
    expect(result).toBe(unit);
  });

  it('mounted classes do NOT get extra MOV (already in bonuses)', () => {
    // Paladin promotion bonus has no MOV (mounted — already high)
    const unit = makeUnit('cavalier', 15, {
      stats: {
        hp: 30,
        str: 12,
        mag: 0,
        def: 10,
        res: 2,
        spd: 10,
        skl: 8,
        lck: 6,
        mov: 7,
        cha: 0,
        wil: 0,
      },
    });
    const promoted = applyPromotion(unit, 'paladin');
    // paladin bonuses: hp:3, str:2, def:2, res:2 — no MOV
    expect(promoted.stats.mov).toBe(7);
  });

  it('handles negative bonuses (great_knight SPD -1)', () => {
    const unit = makeUnit('cavalier', 15, {
      stats: {
        hp: 30,
        str: 12,
        mag: 0,
        def: 10,
        res: 2,
        spd: 10,
        skl: 8,
        lck: 6,
        mov: 7,
        cha: 0,
        wil: 0,
      },
    });
    const promoted = applyPromotion(unit, 'great_knight');
    // great_knight bonuses: hp:4, str:3, def:3, spd:-1
    expect(promoted.stats.spd).toBe(9); // 10 + (-1)
    expect(promoted.stats.str).toBe(15); // 12 + 3
  });
});

// ===== calculateSkillSlots =====

describe('calculateSkillSlots', () => {
  it('level 1 → 2 slots', () => {
    expect(calculateSkillSlots(1)).toBe(2);
  });

  it('level 4 → 3 slots', () => {
    expect(calculateSkillSlots(4)).toBe(3);
  });

  it('level 7 → 4 slots', () => {
    expect(calculateSkillSlots(7)).toBe(4);
  });

  it('level 10 → 5 slots', () => {
    expect(calculateSkillSlots(10)).toBe(5);
  });

  it('level 16 → 7 slots', () => {
    expect(calculateSkillSlots(16)).toBe(7);
  });

  it('level 25+ → 10 slots (capped)', () => {
    expect(calculateSkillSlots(25)).toBe(10);
    expect(calculateSkillSlots(30)).toBe(10);
    expect(calculateSkillSlots(40)).toBe(10);
  });
});

// ===== getDefaultStatCaps =====

describe('getDefaultStatCaps', () => {
  it('base tier caps', () => {
    const caps = getDefaultStatCaps('base');
    expect(caps.hp).toBe(60);
    expect(caps.str).toBe(20);
    expect(caps.lck).toBe(30);
  });

  it('promoted tier caps', () => {
    const caps = getDefaultStatCaps('promoted');
    expect(caps.hp).toBe(80);
    expect(caps.str).toBe(30);
    expect(caps.lck).toBe(40);
  });

  it('master tier caps', () => {
    const caps = getDefaultStatCaps('master');
    expect(caps.hp).toBe(99);
    expect(caps.str).toBe(35);
    expect(caps.lck).toBe(45);
  });
});

// ===== getStatCaps with overrides =====

describe('getStatCaps', () => {
  it('returns default promoted caps for class without overrides', () => {
    const caps = getStatCaps('paladin');
    expect(caps.str).toBe(30);
    expect(caps.hp).toBe(80);
  });

  it('applies per-class stat cap overrides', () => {
    // marshal has statCaps: { def: 40 }
    const caps = getStatCaps('marshal');
    expect(caps.def).toBe(40); // overridden
    expect(caps.str).toBe(35); // default master
  });

  it('returns base caps for unknown class', () => {
    const caps = getStatCaps('nonexistent');
    expect(caps.str).toBe(20);
  });
});

// ===== clampStats =====

describe('clampStats', () => {
  it('clamps stats above caps', () => {
    const stats: UnitStats = {
      hp: 90,
      str: 35,
      mag: 25,
      def: 30,
      res: 30,
      spd: 30,
      skl: 30,
      lck: 50,
      mov: 7,
      cha: 0,
      wil: 0,
    };
    const caps: UnitStats = {
      hp: 80,
      str: 30,
      mag: 30,
      def: 30,
      res: 30,
      spd: 30,
      skl: 30,
      lck: 40,
      mov: 15,
      cha: 30,
      wil: 30,
    };
    const clamped = clampStats(stats, caps);
    expect(clamped.hp).toBe(80);
    expect(clamped.str).toBe(30);
    expect(clamped.lck).toBe(40);
    expect(clamped.mag).toBe(25); // below cap, unchanged
  });
});

// ===== applyStatGains with caps =====

describe('applyStatGains with caps', () => {
  it('clamps stats at cap during level up', () => {
    const stats: UnitStats = {
      hp: 19,
      str: 19,
      mag: 0,
      def: 5,
      res: 0,
      spd: 7,
      skl: 5,
      lck: 3,
      mov: 5,
      cha: 0,
      wil: 0,
    };
    const gains: StatGains = {
      hp: 1,
      str: 1,
      mag: 0,
      def: 1,
      res: 0,
      spd: 0,
      skl: 1,
      lck: 0,
      cha: 0,
      wil: 0,
    };
    const caps = { hp: 60, str: 20 }; // only cap str at 20
    const result = applyStatGains(stats, gains, caps);
    expect(result.str).toBe(20); // 19+1 = 20, at cap
    expect(result.hp).toBe(20); // 19+1 = 20, under hp cap 60
    expect(result.def).toBe(6); // no cap specified → uncapped
  });

  it('works without caps (backwards compatible)', () => {
    const stats: UnitStats = {
      hp: 19,
      str: 19,
      mag: 0,
      def: 5,
      res: 0,
      spd: 7,
      skl: 5,
      lck: 3,
      mov: 5,
      cha: 0,
      wil: 0,
    };
    const gains: StatGains = {
      hp: 1,
      str: 1,
      mag: 0,
      def: 0,
      res: 0,
      spd: 0,
      skl: 0,
      lck: 0,
      cha: 0,
      wil: 0,
    };
    const result = applyStatGains(stats, gains);
    expect(result.str).toBe(20); // no cap → goes to 20
    expect(result.hp).toBe(20);
  });
});
