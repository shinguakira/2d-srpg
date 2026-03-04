import type { TerrainType, TerrainData, GameMap, Position } from './types';

export const TERRAIN: Record<TerrainType, TerrainData> = {
  plain:    { name: 'Plain',    movementCost: 1,  defenseBonus: 0, avoidBonus: 0 },
  forest:   { name: 'Forest',   movementCost: 2,  defenseBonus: 1, avoidBonus: 20 },
  mountain: { name: 'Mountain', movementCost: 3,  defenseBonus: 2, avoidBonus: 30 },
  water:    { name: 'Water',    movementCost: 99, defenseBonus: 0, avoidBonus: 0 },
  wall:     { name: 'Wall',     movementCost: 99, defenseBonus: 0, avoidBonus: 0 },
  fort:     { name: 'Fort',     movementCost: 1,  defenseBonus: 3, avoidBonus: 20 },
  village:  { name: 'Village',  movementCost: 1,  defenseBonus: 0, avoidBonus: 10 },
};

export function getTerrainData(terrain: TerrainType): TerrainData {
  return TERRAIN[terrain];
}

export function getTerrainAt(map: GameMap, pos: Position): TerrainType {
  if (pos.x < 0 || pos.x >= map.width || pos.y < 0 || pos.y >= map.height) {
    return 'wall'; // out of bounds = impassable
  }
  return map.tiles[pos.y][pos.x].terrain;
}

export function getMovementCost(terrain: TerrainType): number {
  return TERRAIN[terrain].movementCost;
}

export function isPassable(terrain: TerrainType): boolean {
  return TERRAIN[terrain].movementCost < 99;
}
