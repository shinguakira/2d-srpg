import { describe, it, expect } from 'vitest';
import {
  hasSkill,
  unitHasNihil,
  checkSkillActivation,
  shouldVantage,
  resolvePerHitSkills,
  resolveDefenseSkills,
  getEffectiveDoublingThreshold,
  hasQuickRiposte,
  getModifiedCrit,
  getRenewalHeal,
} from '../../src/core/skills';
import type { Unit, Weapon } from '../../src/core/types';

function makeWeapon(type: 'sword' | 'axe' | 'fire' = 'sword'): Weapon {
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
  };
}

function makeUnit(overrides: Partial<Unit> = {}): Unit {
  return {
    id: 'test',
    name: 'Test',
    classId: 'lord',
    faction: 'player',
    position: { x: 0, y: 0 },
    stats: {
      hp: 30,
      str: 10,
      mag: 2,
      def: 8,
      res: 4,
      spd: 10,
      skl: 10,
      lck: 10,
      mov: 5,
      cha: 0,
      wil: 0,
    },
    currentHp: 30,
    level: 1,
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

// Always-succeed and always-fail RNG for deterministic testing
const alwaysRng = { roll: () => true };
const neverRng = { roll: () => false };

// ===== hasSkill =====

describe('hasSkill', () => {
  it('finds equipped skill', () => {
    const unit = makeUnit({ skills: ['sol', 'luna'] });
    expect(hasSkill(unit, 'sol')).toBe(true);
    expect(hasSkill(unit, 'luna')).toBe(true);
  });

  it('does not find non-equipped skill', () => {
    const unit = makeUnit({ skills: ['sol'] });
    expect(hasSkill(unit, 'luna')).toBe(false);
  });

  it('finds innate class skill', () => {
    // Cavalier has innateSkills: ['canto']
    const unit = makeUnit({ classId: 'cavalier' });
    expect(hasSkill(unit, 'canto')).toBe(true);
  });

  it('does not find innate for class without it', () => {
    const unit = makeUnit({ classId: 'lord' });
    expect(hasSkill(unit, 'canto')).toBe(false);
  });
});

// ===== unitHasNihil =====

describe('unitHasNihil', () => {
  it('returns true when nihil equipped', () => {
    expect(unitHasNihil(makeUnit({ skills: ['nihil'] }))).toBe(true);
  });

  it('returns false without nihil', () => {
    expect(unitHasNihil(makeUnit())).toBe(false);
  });
});

// ===== checkSkillActivation =====

describe('checkSkillActivation', () => {
  it('passive skill always activates', () => {
    const unit = makeUnit({ skills: ['pursuit'] });
    expect(checkSkillActivation(unit, 'pursuit', neverRng)).toBe(true);
  });

  it('skl_pct activates on successful roll', () => {
    const unit = makeUnit({ skills: ['sol'] });
    expect(checkSkillActivation(unit, 'sol', alwaysRng)).toBe(true);
    expect(checkSkillActivation(unit, 'sol', neverRng)).toBe(false);
  });

  it('spd_pct activates on successful roll', () => {
    const unit = makeUnit({ skills: ['adept'] });
    expect(checkSkillActivation(unit, 'adept', alwaysRng)).toBe(true);
  });

  it('hp_threshold checks HP percentage', () => {
    // Vantage: HP ≤ 50% activates
    const lowHp = makeUnit({ skills: ['vantage'], currentHp: 15 }); // 50% of 30
    expect(checkSkillActivation(lowHp, 'vantage', neverRng)).toBe(true);

    const highHp = makeUnit({ skills: ['vantage'], currentHp: 20 }); // 67%
    expect(checkSkillActivation(highHp, 'vantage', neverRng)).toBe(false);
  });

  it('returns false for skill not on unit', () => {
    expect(checkSkillActivation(makeUnit(), 'sol', alwaysRng)).toBe(false);
  });
});

// ===== shouldVantage =====

describe('shouldVantage', () => {
  it('activates at HP ≤ 50%', () => {
    const unit = makeUnit({ skills: ['vantage'], currentHp: 10 }); // 33%
    expect(shouldVantage(unit, alwaysRng)).toBe(true);
  });

  it('fails at HP > 50%', () => {
    const unit = makeUnit({ skills: ['vantage'], currentHp: 25 }); // 83%
    expect(shouldVantage(unit, alwaysRng)).toBe(false);
  });

  it('fails without Vantage skill', () => {
    const unit = makeUnit({ currentHp: 10 });
    expect(shouldVantage(unit, alwaysRng)).toBe(false);
  });

  it('fails when HP ≤ 50% but SKL roll fails', () => {
    const unit = makeUnit({ skills: ['vantage'], currentHp: 10 }); // 33%
    expect(shouldVantage(unit, neverRng)).toBe(false);
  });
});

// ===== resolvePerHitSkills =====

describe('resolvePerHitSkills', () => {
  it('Astra: 5 hits at 50% damage (highest priority)', () => {
    const unit = makeUnit({ skills: ['astra', 'sol', 'luna', 'adept'] });
    const result = resolvePerHitSkills(unit, makeUnit(), 10, alwaysRng);
    expect(result.skillId).toBe('astra');
    expect(result.modifiedDamage).toBe(5); // 50% of 10
    expect(result.bonusHits).toBe(4); // 4 extra = 5 total
  });

  it('Lethality: instant kill (second priority after Astra)', () => {
    const unit = makeUnit({ skills: ['lethality', 'sol'] });
    const result = resolvePerHitSkills(unit, makeUnit(), 10, alwaysRng);
    expect(result.skillId).toBe('lethality');
    expect(result.instantKill).toBe(true);
  });

  it('Lethality fails vs boss', () => {
    const unit = makeUnit({ skills: ['lethality', 'sol'] });
    const result = resolvePerHitSkills(unit, makeUnit(), 10, alwaysRng, true);
    // Lethality skipped, Sol activates
    expect(result.skillId).toBe('sol');
    expect(result.instantKill).toBe(false);
  });

  it('Sol: heal = damage dealt', () => {
    const unit = makeUnit({ skills: ['sol'] });
    const result = resolvePerHitSkills(unit, makeUnit(), 12, alwaysRng);
    expect(result.skillId).toBe('sol');
    expect(result.healAmount).toBe(12);
    expect(result.modifiedDamage).toBe(12);
  });

  it('Luna: halves DEF', () => {
    const unit = makeUnit({ skills: ['luna'] });
    const defender = makeUnit({
      stats: {
        hp: 30,
        str: 10,
        mag: 2,
        def: 10,
        res: 4,
        spd: 10,
        skl: 10,
        lck: 10,
        mov: 5,
        cha: 0,
        wil: 0,
      },
    });
    const result = resolvePerHitSkills(unit, defender, 8, alwaysRng);
    expect(result.skillId).toBe('luna');
    // Luna adds floor(def/2) = 5 to damage
    expect(result.modifiedDamage).toBe(13);
  });

  it('Adept: bonus attack (lowest priority)', () => {
    const unit = makeUnit({ skills: ['adept'] });
    const result = resolvePerHitSkills(unit, makeUnit(), 10, alwaysRng);
    expect(result.skillId).toBe('adept');
    expect(result.bonusHits).toBe(1);
  });

  it('no skill activates when RNG fails', () => {
    const unit = makeUnit({ skills: ['astra', 'lethality', 'sol', 'luna', 'adept'] });
    const result = resolvePerHitSkills(unit, makeUnit(), 10, neverRng);
    expect(result.skillId).toBeNull();
    expect(result.modifiedDamage).toBe(10);
  });

  it('mutual exclusivity: first to activate wins', () => {
    // With alwaysRng, Astra (highest priority) wins over all others
    const unit = makeUnit({ skills: ['sol', 'luna', 'astra', 'adept'] });
    const result = resolvePerHitSkills(unit, makeUnit(), 10, alwaysRng);
    expect(result.skillId).toBe('astra');
  });
});

// ===== resolveDefenseSkills =====

describe('resolveDefenseSkills', () => {
  it('Aegis halves magic damage', () => {
    const unit = makeUnit({ skills: ['aegis'] });
    const result = resolveDefenseSkills(unit, 20, true, alwaysRng);
    expect(result.skillId).toBe('aegis');
    expect(result.reducedDamage).toBe(10);
  });

  it('Aegis does nothing against physical', () => {
    const unit = makeUnit({ skills: ['aegis'] });
    const result = resolveDefenseSkills(unit, 20, false, alwaysRng);
    expect(result.skillId).toBeNull(); // Aegis doesn't trigger for physical
    expect(result.reducedDamage).toBe(20);
  });

  it('Pavise halves physical damage', () => {
    const unit = makeUnit({ skills: ['pavise'] });
    const result = resolveDefenseSkills(unit, 20, false, alwaysRng);
    expect(result.skillId).toBe('pavise');
    expect(result.reducedDamage).toBe(10);
  });

  it('Pavise does nothing against magic', () => {
    const unit = makeUnit({ skills: ['pavise'] });
    const result = resolveDefenseSkills(unit, 20, true, alwaysRng);
    expect(result.skillId).toBeNull();
  });

  it('Miracle saves from lethal hit at 1 HP', () => {
    const unit = makeUnit({ skills: ['miracle'], currentHp: 15 });
    const result = resolveDefenseSkills(unit, 15, false, alwaysRng);
    expect(result.skillId).toBe('miracle');
    expect(result.miracleSaved).toBe(true);
    expect(result.reducedDamage).toBe(14); // currentHp - 1 = 14
  });

  it('Miracle does not trigger if damage < currentHp', () => {
    const unit = makeUnit({ skills: ['miracle'], currentHp: 15 });
    const result = resolveDefenseSkills(unit, 10, false, alwaysRng);
    expect(result.skillId).toBeNull();
    expect(result.miracleSaved).toBe(false);
  });

  it('no skills activate when RNG fails', () => {
    const unit = makeUnit({ skills: ['aegis', 'pavise', 'miracle'], currentHp: 15 });
    const result = resolveDefenseSkills(unit, 20, true, neverRng);
    expect(result.skillId).toBeNull();
    expect(result.reducedDamage).toBe(20);
  });
});

// ===== getEffectiveDoublingThreshold =====

describe('getEffectiveDoublingThreshold', () => {
  it('default is 5', () => {
    expect(getEffectiveDoublingThreshold(makeUnit())).toBe(5);
  });

  it('with Pursuit, threshold is 3', () => {
    expect(getEffectiveDoublingThreshold(makeUnit({ skills: ['pursuit'] }))).toBe(3);
  });
});

// ===== hasQuickRiposte =====

describe('hasQuickRiposte', () => {
  it('active at HP ≥ 70%', () => {
    const unit = makeUnit({ skills: ['quick_riposte'], currentHp: 21 }); // 70%
    expect(hasQuickRiposte(unit)).toBe(true);
  });

  it('inactive at HP < 70%', () => {
    const unit = makeUnit({ skills: ['quick_riposte'], currentHp: 20 }); // 67%
    expect(hasQuickRiposte(unit)).toBe(false);
  });

  it('inactive without skill', () => {
    const unit = makeUnit({ currentHp: 30 });
    expect(hasQuickRiposte(unit)).toBe(false);
  });
});

// ===== getModifiedCrit =====

describe('getModifiedCrit', () => {
  it('adds Wrath +20 at HP ≤ 50%', () => {
    const unit = makeUnit({ skills: ['wrath'], currentHp: 15 }); // 50%
    expect(getModifiedCrit(unit, 5)).toBe(25);
  });

  it('no Wrath bonus at HP > 50%', () => {
    const unit = makeUnit({ skills: ['wrath'], currentHp: 25 }); // 83%
    expect(getModifiedCrit(unit, 5)).toBe(5);
  });

  it('adds class bonus crit (berserker +15)', () => {
    const unit = makeUnit({ classId: 'berserker' });
    expect(getModifiedCrit(unit, 5)).toBe(20);
  });

  it('adds class bonus crit (swordmaster +20)', () => {
    const unit = makeUnit({ classId: 'swordmaster' });
    expect(getModifiedCrit(unit, 5)).toBe(25);
  });

  it('stacks Wrath + class bonus', () => {
    const unit = makeUnit({ classId: 'berserker', skills: ['wrath'], currentHp: 15 });
    // 5 + 20 (wrath) + 15 (berserker) = 40
    expect(getModifiedCrit(unit, 5)).toBe(40);
  });

  it('caps at 100', () => {
    const unit = makeUnit({ classId: 'swordmaster', skills: ['wrath'], currentHp: 15 });
    // 70 + 20 (wrath) + 20 (swordmaster) = 110 → 100
    expect(getModifiedCrit(unit, 70)).toBe(100);
  });
});

// ===== getRenewalHeal =====

describe('getRenewalHeal', () => {
  it('heals 10% max HP with Renewal', () => {
    const unit = makeUnit({ skills: ['renewal'] }); // hp: 30
    expect(getRenewalHeal(unit)).toBe(3); // floor(30 * 0.1)
  });

  it('returns 0 without Renewal', () => {
    expect(getRenewalHeal(makeUnit())).toBe(0);
  });

  it('minimum heal is 1', () => {
    const unit = makeUnit({
      skills: ['renewal'],
      stats: {
        hp: 5,
        str: 10,
        mag: 2,
        def: 8,
        res: 4,
        spd: 10,
        skl: 10,
        lck: 10,
        mov: 5,
        cha: 0,
        wil: 0,
      },
    });
    expect(getRenewalHeal(unit)).toBe(1); // floor(5 * 0.1) = 0, clamped to 1
  });
});
