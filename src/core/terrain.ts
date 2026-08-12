import type { TerrainType, TerrainData } from './types';

export const TERRAIN: Record<TerrainType, TerrainData> = {
  plain: { name: 'Plain', movementCost: 1, defenseBonus: 0, avoidBonus: 0 },
  forest: { name: 'Forest', movementCost: 2, defenseBonus: 1, avoidBonus: 20 },
  mountain: { name: 'Mountain', movementCost: 3, defenseBonus: 2, avoidBonus: 30 },
  water: { name: 'Water', movementCost: 99, defenseBonus: 0, avoidBonus: 0 },
  wall: { name: 'Wall', movementCost: 99, defenseBonus: 0, avoidBonus: 0 },
  fort: { name: 'Fort', movementCost: 1, defenseBonus: 3, avoidBonus: 20 },
  village: { name: 'Village', movementCost: 1, defenseBonus: 0, avoidBonus: 10 },
  throne: { name: 'Throne', movementCost: 1, defenseBonus: 5, avoidBonus: 30 },

  // ===== Phase 0 — New terrain types =====

  sand: { name: 'Sand', movementCost: 2, defenseBonus: 0, avoidBonus: -10 },
  ice: { name: 'Ice', movementCost: 1, defenseBonus: 0, avoidBonus: -10 },
  lava: { name: 'Lava', movementCost: 99, defenseBonus: 0, avoidBonus: 0 },
  ruins: { name: 'Ruins', movementCost: 1, defenseBonus: 1, avoidBonus: 10 },
  indoor: { name: 'Indoor', movementCost: 1, defenseBonus: 0, avoidBonus: 0 },
  door: { name: 'Door', movementCost: 99, defenseBonus: 0, avoidBonus: 0 },
  chest: { name: 'Chest', movementCost: 1, defenseBonus: 0, avoidBonus: 0 },
  armory: { name: 'Armory', movementCost: 1, defenseBonus: 0, avoidBonus: 0 },
  bridge: { name: 'Bridge', movementCost: 1, defenseBonus: 0, avoidBonus: 0 },
  glitched: { name: 'Blighted', movementCost: 1, defenseBonus: 0, avoidBonus: 0 },
  data_void: { name: 'Abyssal Rift', movementCost: 99, defenseBonus: -2, avoidBonus: -20 },
  memory: { name: 'Hallowed Ground', movementCost: 1, defenseBonus: 1, avoidBonus: 10 },
  corrupted_fort: { name: 'Defiled Fort', movementCost: 1, defenseBonus: 3, avoidBonus: 20 },
  broken_throne: { name: 'Broken Throne', movementCost: 1, defenseBonus: 2, avoidBonus: 10 },

  // ===== Phase 5 — Destructible terrain result =====

  rubble: { name: 'Rubble', movementCost: 2, defenseBonus: 0, avoidBonus: 0 },
};

export function getTerrainData(terrain: TerrainType): TerrainData {
  return TERRAIN[terrain];
}

export function getMovementCost(terrain: TerrainType): number {
  return TERRAIN[terrain].movementCost;
}

export function isPassable(terrain: TerrainType): boolean {
  return TERRAIN[terrain].movementCost < 99;
}

// ===== Class-aware movement =====

export type ClassFlags = {
  flying?: boolean;
  mounted?: boolean;
  armored?: boolean;
};

/** Movement cost adjusted for class flags. Flying units pay 1 for everything except walls. */
export function getClassMovementCost(terrain: TerrainType, flags: ClassFlags): number {
  const base = TERRAIN[terrain].movementCost;

  // Wall and door are always impassable (even for flying)
  if (terrain === 'wall' || terrain === 'door') return 99;

  // Flying: everything costs 1 (except wall/door handled above)
  if (flags.flying) return 1;

  // Data void is impassable for non-flying
  if (terrain === 'data_void') return 99;

  // Armored: mountain impassable, forest +1
  if (flags.armored) {
    if (terrain === 'mountain') return 99;
    if (terrain === 'forest') return base + 1;
  }

  // Mounted: forest/sand +1
  if (flags.mounted) {
    if (terrain === 'forest' || terrain === 'sand') return base + 1;
  }

  return base;
}

/** Whether a terrain tile is passable for a unit with given class flags. */
export function isPassableForClass(terrain: TerrainType, flags: ClassFlags): boolean {
  return getClassMovementCost(terrain, flags) < 99;
}
