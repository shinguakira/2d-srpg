import type { Weapon } from './types';

// ===== Forge Bonuses =====

const MAX_FORGE_LEVEL = 3;

export function getForgeBonus(level: number): { mightBonus: number; hitBonus: number } {
  const clamped = Math.max(0, Math.min(MAX_FORGE_LEVEL, level));
  return { mightBonus: clamped * 2, hitBonus: clamped * 5 };
}

// ===== Forge Gold Costs =====

const FORGE_GOLD_COSTS = [500, 1000, 2000]; // cost for levels 1, 2, 3

/** Get the gold cost for the next forge level. */
export function getForgeGoldCost(weapon: Weapon): number {
  const currentLevel = weapon.forgeLevel ?? 0;
  if (currentLevel >= MAX_FORGE_LEVEL) return 0;
  return FORGE_GOLD_COSTS[currentLevel];
}

// ===== Forge Requirements =====

/**
 * Check if a weapon can be forged.
 * Levels 1-2 require Adamant Ore. Level 3 requires Mithril.
 * Also requires sufficient gold.
 */
export function canForge(weapon: Weapon, materials: string[], gold: number = Infinity): boolean {
  const currentLevel = weapon.forgeLevel ?? 0;
  if (currentLevel >= MAX_FORGE_LEVEL) return false;
  if (gold < getForgeGoldCost(weapon)) return false;
  const nextLevel = currentLevel + 1;
  if (nextLevel <= 2) {
    return materials.includes('adamant_ore');
  }
  // Level 3 requires Mithril
  return materials.includes('mithril');
}

/** Get the material ID required for the next forge level. */
export function getRequiredMaterial(weapon: Weapon): string | null {
  const currentLevel = weapon.forgeLevel ?? 0;
  if (currentLevel >= MAX_FORGE_LEVEL) return null;
  const nextLevel = currentLevel + 1;
  return nextLevel <= 2 ? 'adamant_ore' : 'mithril';
}

// ===== Apply Forge =====

/** Apply one forge level to a weapon. Returns the forged weapon (new object). */
export function applyForge(weapon: Weapon): Weapon {
  const currentLevel = weapon.forgeLevel ?? 0;
  if (currentLevel >= MAX_FORGE_LEVEL) return weapon;
  const newLevel = currentLevel + 1;
  const bonus = getForgeBonus(newLevel);
  const prevBonus = getForgeBonus(currentLevel);
  const mightDelta = bonus.mightBonus - prevBonus.mightBonus;
  const hitDelta = bonus.hitBonus - prevBonus.hitBonus;

  // Add "Forged " prefix on first forge only
  const name = currentLevel === 0 ? `Forged ${weapon.name}` : weapon.name;

  return {
    ...weapon,
    name,
    might: weapon.might + mightDelta,
    hit: weapon.hit + hitDelta,
    forgeLevel: newLevel,
  };
}

/** Preview the stats of a weapon after forging (without applying). */
export function previewForge(
  weapon: Weapon,
): { name: string; might: number; hit: number; forgeLevel: number } | null {
  const currentLevel = weapon.forgeLevel ?? 0;
  if (currentLevel >= MAX_FORGE_LEVEL) return null;
  const forged = applyForge(weapon);
  return {
    name: forged.name,
    might: forged.might,
    hit: forged.hit,
    forgeLevel: forged.forgeLevel ?? 0,
  };
}
