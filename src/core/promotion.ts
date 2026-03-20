import type { Unit, UnitClass, UnitStats, ClassTier } from './types';
import { ALL_CLASSES, PROMOTION_BONUSES } from '../data/promotedClasses';

// ===== Stat Caps =====

const BASE_CAPS: UnitStats =     { hp: 60, str: 20, mag: 20, def: 20, res: 20, spd: 20, skl: 20, lck: 30, mov: 15, cha: 20, wil: 20 };
const PROMOTED_CAPS: UnitStats = { hp: 80, str: 30, mag: 30, def: 30, res: 30, spd: 30, skl: 30, lck: 40, mov: 15, cha: 30, wil: 30 };
const MASTER_CAPS: UnitStats =   { hp: 99, str: 35, mag: 35, def: 35, res: 35, spd: 35, skl: 35, lck: 45, mov: 15, cha: 35, wil: 35 };

export function getDefaultStatCaps(tier: ClassTier): UnitStats {
  if (tier === 'master') return { ...MASTER_CAPS };
  if (tier === 'promoted') return { ...PROMOTED_CAPS };
  return { ...BASE_CAPS };
}

/**
 * Get effective stat caps for a unit's class, applying per-class overrides.
 */
export function getStatCaps(classId: string): UnitStats {
  const cls = ALL_CLASSES[classId];
  if (!cls) return { ...BASE_CAPS };
  const defaults = getDefaultStatCaps(cls.tier);
  if (!cls.statCaps) return defaults;
  return { ...defaults, ...cls.statCaps };
}

/**
 * Clamp each stat to its cap.
 */
export function clampStats(stats: UnitStats, caps: UnitStats): UnitStats {
  return {
    hp: Math.min(stats.hp, caps.hp),
    str: Math.min(stats.str, caps.str),
    mag: Math.min(stats.mag, caps.mag),
    def: Math.min(stats.def, caps.def),
    res: Math.min(stats.res, caps.res),
    spd: Math.min(stats.spd, caps.spd),
    skl: Math.min(stats.skl, caps.skl),
    lck: Math.min(stats.lck, caps.lck),
    mov: Math.min(stats.mov, caps.mov),
    cha: Math.min(stats.cha, caps.cha),
    wil: Math.min(stats.wil, caps.wil),
  };
}

// ===== Promotion Eligibility =====

/**
 * Check if a unit is eligible to promote.
 * Requirements: level >= 15, current class has promotesTo, tier is base (or promoted for master).
 */
export function canPromote(unit: Unit): boolean {
  const cls = ALL_CLASSES[unit.classId];
  if (!cls) return false;
  if (!cls.promotesTo || cls.promotesTo.length === 0) return false;

  if (cls.tier === 'base') return unit.level >= 15;
  if (cls.tier === 'promoted') return unit.level >= 30;
  return false; // master can't promote further
}

/**
 * Returns the available promotion target classes for a unit.
 */
export function getPromotionOptions(unit: Unit): UnitClass[] {
  const cls = ALL_CLASSES[unit.classId];
  if (!cls?.promotesTo) return [];
  return cls.promotesTo
    .map(id => ALL_CLASSES[id])
    .filter((c): c is UnitClass => c != null);
}

/**
 * Returns the index of the first matching promotion item in unit.items, or -1 if none.
 */
export function getMatchingPromotionItem(unit: Unit): number {
  const cls = ALL_CLASSES[unit.classId];
  if (!cls) return -1;

  return unit.items.findIndex(item => {
    if (item.effect.kind !== 'promote') return false;
    const eligible = item.effect.eligibleClasses;
    // Empty array = universal (master_seal / master_crown)
    return eligible.length === 0 || eligible.includes(unit.classId);
  });
}

/**
 * Apply promotion to a unit. Returns a new Unit with:
 * - Updated classId
 * - Stats increased by promotion bonuses
 * - Stats clamped to new caps
 * - Level preserved (no reset)
 * - currentHp increased by HP bonus
 */
export function applyPromotion(unit: Unit, targetClassId: string): Unit {
  const targetClass = ALL_CLASSES[targetClassId];
  if (!targetClass) return unit;

  const bonuses = PROMOTION_BONUSES[targetClassId] ?? {};
  const newStats = { ...unit.stats };

  // Apply promotion stat bonuses
  for (const key of Object.keys(bonuses) as (keyof UnitStats)[]) {
    newStats[key] = (newStats[key] ?? 0) + (bonuses[key] ?? 0);
  }

  // Clamp to new tier caps
  const caps = getStatCaps(targetClassId);
  const clampedStats = clampStats(newStats, caps);

  // HP bonus: increase currentHp by the HP gain
  const hpGain = clampedStats.hp - unit.stats.hp;
  const newCurrentHp = Math.min(unit.currentHp + Math.max(0, hpGain), clampedStats.hp);

  return {
    ...unit,
    classId: targetClassId,
    stats: clampedStats,
    currentHp: newCurrentHp,
  };
}

// ===== Skill Slots =====

/**
 * Calculate skill slot count by level.
 * Starts at 2, gains 1 every 3 levels, max 10.
 */
export function calculateSkillSlots(level: number): number {
  return Math.min(10, 2 + Math.floor((level - 1) / 3));
}
