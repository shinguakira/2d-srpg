import type { Unit, Position, GameMap, TerrainType } from './types';
import { posKey } from './types';

// ===== Destructible Terrain Config =====

export type DestructibleConfig = {
  hp: number;
  destroyedTerrain: TerrainType;
};

/** Get the destructible config for a terrain type, or null if not destructible. */
export function getDestructibleConfig(terrain: TerrainType): DestructibleConfig | null {
  switch (terrain) {
    case 'wall':
      return { hp: 30, destroyedTerrain: 'rubble' };
    case 'bridge':
      return { hp: 20, destroyedTerrain: 'water' };
    case 'door':
      return { hp: 15, destroyedTerrain: 'indoor' };
    case 'forest':
      return { hp: 20, destroyedTerrain: 'plain' }; // fire magic only
    default:
      return null;
  }
}

// ===== Damage Calculation =====

/** Calculate damage a unit deals to terrain. STR + weapon might. Axes get +5 bonus. */
export function calcTerrainDamage(unit: Unit): number {
  const str = unit.stats.str;
  const might = unit.equippedWeapon.might;
  const axeBonus = unit.equippedWeapon.type === 'axe' ? 5 : 0;
  return str + might + axeBonus;
}

/** Check if a unit can attack a given terrain tile. */
export function canAttackTerrain(unit: Unit, terrain: TerrainType): boolean {
  const config = getDestructibleConfig(terrain);
  if (!config) return false;
  // Forest can only be burned by fire magic
  if (terrain === 'forest' && unit.equippedWeapon.type !== 'fire') return false;
  return true;
}

// ===== Bridge Collapse =====

export type CollapseResult = {
  unitId: string;
  damage: number;
  displacedTo: Position | null; // null = unit fell into water (dies or is stuck)
};

/**
 * Resolve bridge collapse: units on the destroyed bridge tile take 10 damage
 * and are displaced to nearest adjacent land tile. Flying units are safe.
 */
export function resolveBridgeCollapse(
  pos: Position,
  map: GameMap,
  units: Map<string, Unit>,
  classFlags: (unit: Unit) => { flying?: boolean },
): CollapseResult[] {
  const results: CollapseResult[] = [];
  const key = posKey(pos);

  for (const [id, unit] of units) {
    if (posKey(unit.position) !== key) continue;

    const flags = classFlags(unit);
    if (flags.flying) continue; // flying units are safe

    // Find nearest adjacent land tile
    const adjacent: Position[] = [
      { x: pos.x, y: pos.y - 1 },
      { x: pos.x + 1, y: pos.y },
      { x: pos.x, y: pos.y + 1 },
      { x: pos.x - 1, y: pos.y },
    ];

    let displaced: Position | null = null;
    for (const adj of adjacent) {
      if (adj.x < 0 || adj.x >= map.width || adj.y < 0 || adj.y >= map.height) continue;
      const terrain = map.tiles[adj.y][adj.x].terrain;
      // Must be passable land (not water/wall/lava)
      if (
        terrain !== 'water' &&
        terrain !== 'wall' &&
        terrain !== 'lava' &&
        terrain !== 'data_void'
      ) {
        // Must not be occupied
        if (!map.tiles[adj.y][adj.x].occupantId) {
          displaced = adj;
          break;
        }
      }
    }

    results.push({ unitId: id, damage: 10, displacedTo: displaced });
  }

  return results;
}
