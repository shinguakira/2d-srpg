import type { DifficultyMode, EndingType, UnitStats } from './types';

/**
 * Enemy stat multiplier by difficulty.
 * Classic/Casual = 1.0, Hard = 1.1
 */
export function getEnemyStatMultiplier(difficulty: DifficultyMode): number {
  return difficulty === 'hard' ? 1.1 : 1.0;
}

/**
 * Scale enemy stats for a given difficulty.
 * Hard mode: all combat stats × 1.1 (rounded down), MOV unchanged.
 */
export function scaleEnemyStats(stats: UnitStats, difficulty: DifficultyMode): UnitStats {
  if (difficulty !== 'hard') return stats;
  const mult = getEnemyStatMultiplier(difficulty);
  return {
    hp: Math.floor(stats.hp * mult),
    str: Math.floor(stats.str * mult),
    mag: Math.floor(stats.mag * mult),
    def: Math.floor(stats.def * mult),
    res: Math.floor(stats.res * mult),
    spd: Math.floor(stats.spd * mult),
    skl: Math.floor(stats.skl * mult),
    lck: Math.floor(stats.lck * mult),
    mov: stats.mov, // MOV unchanged
    cha: stats.cha,
    wil: stats.wil,
  };
}

/**
 * Reinforcement turn offset. Hard = -1 (arrive 1 turn early), others = 0.
 */
export function getReinforcementTurnOffset(difficulty: DifficultyMode): number {
  return difficulty === 'hard' ? -1 : 0;
}

/**
 * Boss bonus stats per arc in hard mode. +2 per arc.
 */
export function getBossArcBonus(difficulty: DifficultyMode, arc: number): number {
  return difficulty === 'hard' ? 2 * arc : 0;
}

/**
 * Whether this difficulty mode uses permadeath.
 */
export function isPermadeath(difficulty: DifficultyMode): boolean {
  return difficulty !== 'casual';
}

/**
 * Hard mode is locked until the player has completed any ending.
 */
export function isHardLocked(endingsSeen: EndingType[]): boolean {
  return endingsSeen.length === 0;
}
