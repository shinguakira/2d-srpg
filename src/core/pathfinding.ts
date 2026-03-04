import type { Position, GameMap, Unit, Weapon } from './types';
import { posKey } from './types';
import { getMovementCost, isPassable } from './terrain';

const DIRECTIONS: Position[] = [
  { x: 0, y: -1 }, // up
  { x: 1, y: 0 },  // right
  { x: 0, y: 1 },  // down
  { x: -1, y: 0 }, // left
];

/**
 * BFS to find all tiles a unit can move to.
 * - Respects terrain movement costs
 * - Cannot pass through enemy units
 * - Can pass through allied units but cannot stop on them
 * Returns a Map of posKey -> remaining movement at that tile.
 */
export function getMovementRange(
  unit: Unit,
  map: GameMap,
  allUnits: Map<string, Unit>,
): Set<string> {
  const startKey = posKey(unit.position);
  const mov = unit.stats.mov;

  // occupant lookup
  const occupantFaction = new Map<string, string>();
  for (const u of allUnits.values()) {
    if (u.id !== unit.id) {
      occupantFaction.set(posKey(u.position), u.faction);
    }
  }

  // BFS: queue of [position, remainingMov]
  const best = new Map<string, number>(); // posKey -> best remaining mov reaching that tile
  best.set(startKey, mov);

  const queue: [Position, number][] = [[unit.position, mov]];

  while (queue.length > 0) {
    const [pos, remaining] = queue.shift()!;

    for (const dir of DIRECTIONS) {
      const next: Position = { x: pos.x + dir.x, y: pos.y + dir.y };

      // bounds check
      if (next.x < 0 || next.x >= map.width || next.y < 0 || next.y >= map.height) continue;

      const terrain = map.tiles[next.y][next.x].terrain;
      if (!isPassable(terrain)) continue;

      const cost = getMovementCost(terrain);
      const nextRemaining = remaining - cost;
      if (nextRemaining < 0) continue;

      const nextKey = posKey(next);

      // Cannot pass through enemy units
      const occupant = occupantFaction.get(nextKey);
      if (occupant && occupant !== unit.faction) continue;

      // Only enqueue if this is a better path
      if (best.has(nextKey) && best.get(nextKey)! >= nextRemaining) continue;
      best.set(nextKey, nextRemaining);
      queue.push([next, nextRemaining]);
    }
  }

  // Build result: all reachable tiles except those occupied by allies
  const result = new Set<string>();
  for (const [key] of best) {
    if (key === startKey) {
      result.add(key); // can stay in place
      continue;
    }
    const occupant = occupantFaction.get(key);
    // Can't stop on a tile occupied by an ally
    if (occupant && occupant === unit.faction) continue;
    result.add(key);
  }

  return result;
}

/**
 * BFS shortest path from `from` to `to`, respecting movement costs and obstacles.
 * Returns the path as an array of positions (including `from` and `to`).
 * Returns empty array if unreachable.
 */
export function getPath(
  from: Position,
  to: Position,
  unit: Unit,
  map: GameMap,
  allUnits: Map<string, Unit>,
): Position[] {
  const startKey = posKey(from);
  const endKey = posKey(to);
  if (startKey === endKey) return [from];

  const mov = unit.stats.mov;

  const occupantFaction = new Map<string, string>();
  for (const u of allUnits.values()) {
    if (u.id !== unit.id) {
      occupantFaction.set(posKey(u.position), u.faction);
    }
  }

  // BFS with parent tracking
  const best = new Map<string, number>();
  const parent = new Map<string, string>();
  best.set(startKey, mov);

  const queue: [Position, number][] = [[from, mov]];

  while (queue.length > 0) {
    const [pos, remaining] = queue.shift()!;
    const posK = posKey(pos);

    if (posK === endKey) break;

    for (const dir of DIRECTIONS) {
      const next: Position = { x: pos.x + dir.x, y: pos.y + dir.y };
      if (next.x < 0 || next.x >= map.width || next.y < 0 || next.y >= map.height) continue;

      const terrain = map.tiles[next.y][next.x].terrain;
      if (!isPassable(terrain)) continue;

      const cost = getMovementCost(terrain);
      const nextRemaining = remaining - cost;
      if (nextRemaining < 0) continue;

      const nextKey = posKey(next);
      const occupant = occupantFaction.get(nextKey);
      if (occupant && occupant !== unit.faction) continue;

      if (best.has(nextKey) && best.get(nextKey)! >= nextRemaining) continue;
      best.set(nextKey, nextRemaining);
      parent.set(nextKey, posK);
      queue.push([next, nextRemaining]);
    }
  }

  // Reconstruct path
  if (!parent.has(endKey) && startKey !== endKey) return [];

  const path: Position[] = [];
  let current = endKey;
  while (current !== startKey) {
    const [x, y] = current.split(',').map(Number);
    path.unshift({ x, y });
    const p = parent.get(current);
    if (!p) return []; // unreachable
    current = p;
  }
  path.unshift(from);
  return path;
}

/**
 * Get all tiles attackable from a given position with a given weapon.
 * Uses Manhattan distance (diamond shape).
 */
export function getAttackTilesFrom(
  pos: Position,
  weapon: Weapon,
  map: GameMap,
): Set<string> {
  const result = new Set<string>();
  for (let dx = -weapon.maxRange; dx <= weapon.maxRange; dx++) {
    for (let dy = -weapon.maxRange; dy <= weapon.maxRange; dy++) {
      const dist = Math.abs(dx) + Math.abs(dy);
      if (dist < weapon.minRange || dist > weapon.maxRange) continue;
      const tx = pos.x + dx;
      const ty = pos.y + dy;
      if (tx < 0 || tx >= map.width || ty < 0 || ty >= map.height) continue;
      result.add(posKey({ x: tx, y: ty }));
    }
  }
  return result;
}

/**
 * Get the full attack range for a unit: all tiles it could attack
 * from any reachable position (movement range + attack range).
 * Excludes tiles that are already in the movement range.
 */
export function getFullAttackRange(
  unit: Unit,
  movementRange: Set<string>,
  map: GameMap,
): Set<string> {
  const attackOnly = new Set<string>();
  for (const moveKey of movementRange) {
    const [x, y] = moveKey.split(',').map(Number);
    const attackTiles = getAttackTilesFrom({ x, y }, unit.equippedWeapon, map);
    for (const atkKey of attackTiles) {
      if (!movementRange.has(atkKey)) {
        attackOnly.add(atkKey);
      }
    }
  }
  return attackOnly;
}
