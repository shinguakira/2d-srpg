import type { Unit, GrowthRates, UnitStats } from './types';
import { SeededRandom } from './rng';

export type StatGains = {
  hp: number;
  str: number;
  mag: number;
  def: number;
  res: number;
  spd: number;
  skl: number;
  lck: number;
  cha: number;
  wil: number;
};

/**
 * Calculate EXP gain from combat.
 * Base: 30 EXP for combat with equal-level enemy, scaled by level difference.
 * +50 bonus for killing the target.
 */
export function calculateExpGain(attacker: Unit, defender: Unit, killed: boolean): number {
  const levelDiff = defender.level - attacker.level;
  const base = Math.max(5, 30 + levelDiff * 5);
  const killBonus = killed ? 50 : 0;
  return Math.min(100, base + killBonus);
}

/**
 * Roll each stat against the unit's growth rates.
 * Returns the gains per stat (0 or 1).
 */
export function rollLevelUp(growthRates: GrowthRates, rng: SeededRandom): StatGains {
  return {
    hp: rng.roll(growthRates.hp) ? 1 : 0,
    str: rng.roll(growthRates.str) ? 1 : 0,
    mag: rng.roll(growthRates.mag) ? 1 : 0,
    def: rng.roll(growthRates.def) ? 1 : 0,
    res: rng.roll(growthRates.res) ? 1 : 0,
    spd: rng.roll(growthRates.spd) ? 1 : 0,
    skl: rng.roll(growthRates.skl) ? 1 : 0,
    lck: rng.roll(growthRates.lck) ? 1 : 0,
    cha: rng.roll(growthRates.cha) ? 1 : 0,
    wil: rng.roll(growthRates.wil) ? 1 : 0,
  };
}

/**
 * Apply stat gains to a unit's stats.
 */
export function applyStatGains(
  stats: UnitStats,
  gains: StatGains,
  caps?: Partial<UnitStats>,
): UnitStats {
  const clamp = (val: number, key: keyof UnitStats) =>
    caps?.[key] != null ? Math.min(val, caps[key]) : val;

  return {
    hp: clamp(stats.hp + gains.hp, 'hp'),
    str: clamp(stats.str + gains.str, 'str'),
    mag: clamp(stats.mag + gains.mag, 'mag'),
    def: clamp(stats.def + gains.def, 'def'),
    res: clamp(stats.res + gains.res, 'res'),
    spd: clamp(stats.spd + gains.spd, 'spd'),
    skl: clamp(stats.skl + gains.skl, 'skl'),
    lck: clamp(stats.lck + gains.lck, 'lck'),
    mov: stats.mov, // MOV doesn't grow on level up
    cha: clamp(stats.cha + gains.cha, 'cha'),
    wil: clamp(stats.wil + gains.wil, 'wil'),
  };
}

/**
 * Check if gained enough EXP to level up.
 * Returns whether a level up happened.
 */
export function checkLevelUp(
  currentExp: number,
  expGain: number,
): { newExp: number; newLevel: number; leveled: boolean } {
  const totalExp = currentExp + expGain;
  if (totalExp >= 100) {
    return { newExp: totalExp - 100, newLevel: 1, leveled: true };
  }
  return { newExp: totalExp, newLevel: 0, leveled: false };
}

/**
 * Preview the result of allocating bonus EXP to a unit.
 * Returns whether it would trigger a level-up and the projected stat gains.
 */
export function previewBonusExp(
  currentExp: number,
  amount: number,
  level: number,
  growthRates: GrowthRates,
): { wouldLevel: boolean; projectedGains: StatGains | null } {
  const newExp = currentExp + amount;
  if (newExp >= 100) {
    // Use same seed formula as campaignStore.allocateBonusExp
    const rng = new SeededRandom(level * 1000 + newExp);
    const gains = rollLevelUp(growthRates, rng);
    return { wouldLevel: true, projectedGains: gains };
  }
  return { wouldLevel: false, projectedGains: null };
}
