import type { Unit, BossPhase, Weapon, WeaponType } from './types';
import { getWeaponTriangle } from './combat';
import { WEAPONS } from '../data/weapons';

/**
 * Check if a boss has crossed a phase HP threshold.
 * Returns the next BossPhase to transition into, or null.
 */
export function checkPhaseTransition(boss: Unit, newHp: number): BossPhase | null {
  const phases = boss.bossPhases;
  if (!phases || phases.length === 0) return null;
  const currentPhase = boss.currentBossPhase ?? 0;
  const nextPhaseIndex = currentPhase + 1;
  if (nextPhaseIndex >= phases.length) return null;

  const nextPhase = phases[nextPhaseIndex];
  if (newHp <= nextPhase.hpThreshold) {
    return nextPhase;
  }
  return null;
}

/**
 * Apply a boss phase transition: heal to threshold, swap stats/weapon/AI.
 */
export function applyPhaseTransition(boss: Unit, phase: BossPhase, phaseIndex: number): Unit {
  let updated: Unit = { ...boss, currentBossPhase: phaseIndex };

  // Heal to threshold HP (no overkill between phases)
  updated.currentHp = phase.hpThreshold;

  // Apply stat changes
  if (phase.statChanges) {
    const newStats = { ...updated.stats };
    for (const [key, val] of Object.entries(phase.statChanges)) {
      if (val !== undefined && key in newStats) {
        (newStats as Record<string, number>)[key] = val;
      }
    }
    updated = { ...updated, stats: newStats };
  }

  // Swap weapon
  if (phase.weaponId) {
    const weapon = WEAPONS[phase.weaponId];
    if (weapon) {
      updated = { ...updated, equippedWeapon: weapon };
    }
  }

  // Override AI
  if (phase.aiOverride) {
    updated = { ...updated, aiBehavior: phase.aiOverride };
  }

  return updated;
}

/**
 * Get the boss's current phase immunity type, or null.
 */
export function getBossImmunity(boss: Unit): 'physical' | 'magical' | null {
  const phases = boss.bossPhases;
  if (!phases) return null;
  const currentPhase = boss.currentBossPhase ?? 0;
  if (currentPhase >= phases.length) return null;
  return phases[currentPhase].immunity ?? null;
}

/**
 * Get the boss's per-turn self-heal for the current phase.
 */
export function getBossSelfHeal(boss: Unit): number {
  const phases = boss.bossPhases;
  if (!phases) return 0;
  const currentPhase = boss.currentBossPhase ?? 0;
  if (currentPhase >= phases.length) return 0;
  return phases[currentPhase].selfHeal ?? 0;
}

/**
 * Advance a weapon-cycling boss to the next weapon in rotation.
 */
export function advanceWeaponCycle(boss: Unit): Unit {
  const cycle = boss.weaponCycleOrder;
  if (!cycle || cycle.length === 0) return boss;
  const currentIndex = boss.weaponCycleIndex ?? 0;
  const nextIndex = (currentIndex + 1) % cycle.length;
  const nextWeaponType = cycle[nextIndex];

  // Find matching weapon in inventory or use a fallback
  const matchingWeapon = boss.inventory.find(w => w.type === nextWeaponType);
  if (matchingWeapon) {
    return { ...boss, equippedWeapon: matchingWeapon, weaponCycleIndex: nextIndex };
  }
  return { ...boss, weaponCycleIndex: nextIndex };
}

/**
 * Check if attacking a weapon-cycling boss with the right triangle advantage
 * strips a corruption layer.
 */
export function checkCorruptionLayerStrip(attackerWeapon: Weapon, bossWeapon: Weapon): boolean {
  const triangle = getWeaponTriangle(attackerWeapon.type, bossWeapon.type);
  return triangle.dmgMod > 0; // attacker has weapon advantage
}

/**
 * Strip one corruption layer from a boss.
 */
export function stripCorruptionLayer(boss: Unit): Unit {
  const layers = boss.corruptionLayers ?? 0;
  if (layers <= 0) return boss;
  return { ...boss, corruptionLayers: layers - 1 };
}

/**
 * Check if a weapon type is physical (for boss immunity).
 */
export function isPhysicalWeaponType(type: WeaponType): boolean {
  return ['sword', 'axe', 'lance', 'bow', 'knife'].includes(type);
}

/**
 * Get damage after applying boss immunity. Returns 0 if immune.
 */
export function applyBossImmunity(damage: number, weaponType: WeaponType, immunity: 'physical' | 'magical' | null): number {
  if (!immunity) return damage;
  if (immunity === 'physical' && isPhysicalWeaponType(weaponType)) return 0;
  if (immunity === 'magical' && !isPhysicalWeaponType(weaponType)) return 0;
  return damage;
}
