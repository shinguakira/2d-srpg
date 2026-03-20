import type { Unit } from './types';
import { SKILLS } from '../data/skills';
import { ALL_CLASSES } from '../data/promotedClasses';

// ===== Skill Queries =====

/**
 * Check if unit has a skill (equipped or class innate).
 */
export function hasSkill(unit: Unit, skillId: string): boolean {
  if (unit.skills.includes(skillId)) return true;
  const cls = ALL_CLASSES[unit.classId];
  return cls?.innateSkills?.includes(skillId) ?? false;
}

/**
 * Check if unit has the Nihil skill.
 */
export function unitHasNihil(unit: Unit): boolean {
  return hasSkill(unit, 'nihil');
}

// ===== Activation Rolls =====

type RNG = { roll: (chance: number) => boolean };

/**
 * Generic skill activation check.
 */
export function checkSkillActivation(unit: Unit, skillId: string, rng: RNG): boolean {
  if (!hasSkill(unit, skillId)) return false;
  const skill = SKILLS[skillId];
  if (!skill) return false;

  const act = skill.activation;
  switch (act.type) {
    case 'passive': return true;
    case 'skl_pct': return rng.roll(unit.stats.skl);
    case 'spd_pct': return rng.roll(unit.stats.spd);
    case 'lck_pct': return rng.roll(unit.stats.lck);
    case 'skl_half_pct': return rng.roll(Math.floor(unit.stats.skl / 2));
    case 'skl_quarter_pct': return rng.roll(Math.floor(unit.stats.skl / 4));
    case 'hp_threshold': {
      const hpPct = (unit.currentHp / unit.stats.hp) * 100;
      return hpPct <= act.threshold;
    }
    default: return false;
  }
}

// ===== Combat Skill Functions =====

/**
 * Check if Vantage should activate.
 * Requires: Vantage skill + HP ≤ 50%.
 */
export function shouldVantage(defender: Unit, rng: RNG): boolean {
  if (!hasSkill(defender, 'vantage')) return false;
  if ((defender.currentHp / defender.stats.hp) * 100 > 50) return false;
  return rng.roll(defender.stats.skl);
}

// ===== Per-Hit Skills =====
// Mutually exclusive: Astra → Lethality → Sol → Luna → Adept (first to activate wins)

export type SkillHitResult = {
  skillId: string | null;
  modifiedDamage: number;
  bonusHits: number;
  healAmount: number;
  instantKill: boolean;
};

const EMPTY_HIT_RESULT: SkillHitResult = {
  skillId: null,
  modifiedDamage: 0,
  bonusHits: 0,
  healAmount: 0,
  instantKill: false,
};

/**
 * Resolve per-hit skill activations for the attacker.
 * Priority: Astra → Lethality → Sol → Luna → Adept
 */
export function resolvePerHitSkills(
  attacker: Unit,
  defender: Unit,
  baseDamage: number,
  rng: RNG,
  isBoss = false,
): SkillHitResult {
  // Astra: 5 hits at 50% damage
  if (hasSkill(attacker, 'astra') && rng.roll(Math.floor(attacker.stats.skl / 2))) {
    return {
      skillId: 'astra',
      modifiedDamage: Math.max(1, Math.floor(baseDamage / 2)),
      bonusHits: 4, // 4 extra hits (5 total including original)
      healAmount: 0,
      instantKill: false,
    };
  }

  // Lethality: instant kill (SKL/4 %, fails vs boss)
  if (!isBoss && hasSkill(attacker, 'lethality') && rng.roll(Math.floor(attacker.stats.skl / 4))) {
    return {
      skillId: 'lethality',
      modifiedDamage: baseDamage,
      bonusHits: 0,
      healAmount: 0,
      instantKill: true,
    };
  }

  // Sol: heal = damage dealt
  if (hasSkill(attacker, 'sol') && rng.roll(attacker.stats.skl)) {
    return {
      skillId: 'sol',
      modifiedDamage: baseDamage,
      bonusHits: 0,
      healAmount: baseDamage,
      instantKill: false,
    };
  }

  // Luna: halve DEF/RES
  if (hasSkill(attacker, 'luna') && rng.roll(attacker.stats.skl)) {
    // Recalculate damage with halved defense
    // We approximate: damage increases by half the defender's relevant def stat
    const isMagic = ['fire', 'thunder', 'wind', 'dark', 'light'].includes(attacker.equippedWeapon.type);
    const defStat = isMagic ? defender.stats.res : defender.stats.def;
    const lunaBonus = Math.floor(defStat / 2);
    return {
      skillId: 'luna',
      modifiedDamage: baseDamage + lunaBonus,
      bonusHits: 0,
      healAmount: 0,
      instantKill: false,
    };
  }

  // Adept: bonus attack
  if (hasSkill(attacker, 'adept') && rng.roll(attacker.stats.spd)) {
    return {
      skillId: 'adept',
      modifiedDamage: baseDamage,
      bonusHits: 1,
      healAmount: 0,
      instantKill: false,
    };
  }

  return { ...EMPTY_HIT_RESULT, modifiedDamage: baseDamage };
}

// ===== Defense Skills =====

export type DefenseResult = {
  reducedDamage: number;
  miracleSaved: boolean;
  skillId: string | null;
};

/**
 * Resolve defense skills for the defender.
 * Aegis (magic), Pavise (physical), Miracle (lethal hit).
 */
export function resolveDefenseSkills(
  defender: Unit,
  damage: number,
  isMagic: boolean,
  rng: RNG,
): DefenseResult {
  // Aegis: halve magic damage
  if (isMagic && hasSkill(defender, 'aegis') && rng.roll(defender.stats.skl)) {
    return {
      reducedDamage: Math.max(1, Math.floor(damage / 2)),
      miracleSaved: false,
      skillId: 'aegis',
    };
  }

  // Pavise: halve physical damage
  if (!isMagic && hasSkill(defender, 'pavise') && rng.roll(defender.stats.skl)) {
    return {
      reducedDamage: Math.max(1, Math.floor(damage / 2)),
      miracleSaved: false,
      skillId: 'pavise',
    };
  }

  // Miracle: survive lethal hit at 1 HP
  if (damage >= defender.currentHp && hasSkill(defender, 'miracle') && rng.roll(defender.stats.lck)) {
    return {
      reducedDamage: defender.currentHp - 1,
      miracleSaved: true,
      skillId: 'miracle',
    };
  }

  return { reducedDamage: damage, miracleSaved: false, skillId: null };
}

// ===== Passive Combat Modifiers =====

/**
 * Get the effective doubling speed threshold.
 * Default 5, with Pursuit skill: 3.
 */
export function getEffectiveDoublingThreshold(attacker: Unit): number {
  return hasSkill(attacker, 'pursuit') ? 3 : 5;
}

/**
 * Check if unit has Quick Riposte active (skill + HP ≥ 70%).
 */
export function hasQuickRiposte(unit: Unit): boolean {
  if (!hasSkill(unit, 'quick_riposte')) return false;
  return (unit.currentHp / unit.stats.hp) * 100 >= 70;
}

/**
 * Get modified crit rate including Wrath and class bonus crit.
 */
export function getModifiedCrit(unit: Unit, baseCrit: number): number {
  let crit = baseCrit;

  // Wrath: +20 crit at HP ≤ 50%
  if (hasSkill(unit, 'wrath') && (unit.currentHp / unit.stats.hp) * 100 <= 50) {
    crit += 20;
  }

  // Class bonus crit
  const cls = ALL_CLASSES[unit.classId];
  if (cls?.bonusCrit) {
    crit += cls.bonusCrit;
  }

  return Math.min(100, crit);
}

/**
 * Get Renewal heal amount (10% max HP, 0 if no skill).
 */
export function getRenewalHeal(unit: Unit): number {
  if (!hasSkill(unit, 'renewal')) return 0;
  return Math.max(1, Math.floor(unit.stats.hp * 0.1));
}
