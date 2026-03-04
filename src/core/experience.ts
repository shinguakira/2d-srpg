import type { Unit, GrowthRates, UnitStats } from './types';
import type { SeededRandom } from './rng';

export type StatGains = {
  hp: number;
  str: number;
  mag: number;
  def: number;
  res: number;
  spd: number;
  skl: number;
  lck: number;
};

const EMPTY_GAINS: StatGains = { hp: 0, str: 0, mag: 0, def: 0, res: 0, spd: 0, skl: 0, lck: 0 };

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
  };
}

/**
 * Apply stat gains to a unit's stats.
 */
export function applyStatGains(stats: UnitStats, gains: StatGains): UnitStats {
  return {
    hp: stats.hp + gains.hp,
    str: stats.str + gains.str,
    mag: stats.mag + gains.mag,
    def: stats.def + gains.def,
    res: stats.res + gains.res,
    spd: stats.spd + gains.spd,
    skl: stats.skl + gains.skl,
    lck: stats.lck + gains.lck,
    mov: stats.mov, // MOV doesn't grow on level up
  };
}

/**
 * Check if gained enough EXP to level up.
 * Returns whether a level up happened.
 */
export function checkLevelUp(currentExp: number, expGain: number): { newExp: number; newLevel: number; leveled: boolean } {
  const totalExp = currentExp + expGain;
  if (totalExp >= 100) {
    return { newExp: totalExp - 100, newLevel: 1, leveled: true };
  }
  return { newExp: totalExp, newLevel: 0, leveled: false };
}

export { EMPTY_GAINS };
