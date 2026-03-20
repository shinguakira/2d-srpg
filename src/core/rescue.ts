import type { Unit } from './types';
import { ALL_CLASSES } from '../data/promotedClasses';

/** Can rescuer pick up target? Requires STR ≥ target's class base MOV (proxy for weight) */
export function canRescueUnit(rescuer: Unit, target: Unit): boolean {
  const targetWeight = ALL_CLASSES[target.classId]?.baseStats.mov ?? 5;
  return rescuer.stats.str >= targetWeight;
}

/** Penalized stat values while carrying a unit: STR/SPD halved (floor), MOV -2 (min 1) */
export function getRescuePenalizedStats(unit: Unit): { str: number; spd: number; mov: number } {
  return {
    str: Math.floor(unit.stats.str / 2),
    spd: Math.floor(unit.stats.spd / 2),
    mov: Math.max(1, unit.stats.mov - 2),
  };
}
