import type { Unit, GameMap, Position } from './types';
import { posKey } from './types';
import { getMovementRange, getPath, getAttackTilesFrom } from './pathfinding';
import { calculateCombatForecast } from './combat';
import type { CombatForecast } from './combat';

export type AIAction = {
  unitId: string;
  moveTo: Position;
  attackTargetId: string | null;
  forecast: CombatForecast | null;
};

/**
 * Decide the best action for an enemy unit.
 * Strategy:
 *  1. Find all reachable positions (BFS movement range)
 *  2. For each reachable position, find attackable player units
 *  3. Score each (position, target) pair
 *  4. If no target reachable, move toward nearest player unit
 */
export function decideAction(
  unit: Unit,
  gameMap: GameMap,
  allUnits: Map<string, Unit>,
): AIAction {
  const moveRange = getMovementRange(unit, gameMap, allUnits);
  const movablePositions = Array.from(moveRange).map((key) => {
    const [x, y] = key.split(',').map(Number);
    return { x, y } as Position;
  });

  // Collect all (position, target, forecast) combinations
  type ScoredOption = {
    moveTo: Position;
    targetId: string;
    forecast: CombatForecast;
    score: number;
  };

  const options: ScoredOption[] = [];

  for (const pos of movablePositions) {
    const atkTiles = getAttackTilesFrom(pos, unit.equippedWeapon, gameMap);

    for (const target of allUnits.values()) {
      if (target.faction === 'enemy') continue; // don't attack allies
      if (!atkTiles.has(posKey(target.position))) continue;

      const attackerTerrain = gameMap.tiles[pos.y][pos.x].terrain;
      const defenderTerrain = gameMap.tiles[target.position.y][target.position.x].terrain;
      const distance = Math.abs(pos.x - target.position.x) + Math.abs(pos.y - target.position.y);

      const unitAtPos = { ...unit, position: pos };
      const forecast = calculateCombatForecast(unitAtPos, target, attackerTerrain, defenderTerrain, distance);

      const score = scoreTarget(forecast, target);
      options.push({ moveTo: pos, targetId: target.id, forecast, score });
    }
  }

  // Pick the best option
  if (options.length > 0) {
    options.sort((a, b) => b.score - a.score);
    const best = options[0];
    return {
      unitId: unit.id,
      moveTo: best.moveTo,
      attackTargetId: best.targetId,
      forecast: best.forecast,
    };
  }

  // No target reachable — move toward nearest player unit
  const moveToward = findMoveTowardNearestPlayer(unit, movablePositions, allUnits);
  return {
    unitId: unit.id,
    moveTo: moveToward,
    attackTargetId: null,
    forecast: null,
  };
}

/**
 * Score a potential attack target.
 * Higher score = better target.
 */
function scoreTarget(forecast: CombatForecast, target: Unit): number {
  let score = 0;

  // Prioritize kills
  const canKill = forecast.attackerDamage >= target.currentHp;
  if (canKill) score += 100;

  // Prefer high damage
  score += forecast.attackerDamage * 2;

  // Prefer high hit chance
  score += forecast.attackerHit * 0.5;

  // Prefer targets with low HP
  score += (1 - target.currentHp / target.stats.hp) * 30;

  // Penalize low survival chance (if defender can counter)
  if (forecast.defenderCanCounter) {
    const dangerDamage = forecast.defenderDamage * (forecast.defenderCanDouble ? 2 : 1);
    if (dangerDamage >= forecast.attacker.currentHp) {
      score -= 50; // risky — might die
    }
  }

  return score;
}

/**
 * If no targets are reachable, move toward the nearest player unit.
 */
function findMoveTowardNearestPlayer(
  unit: Unit,
  movablePositions: Position[],
  allUnits: Map<string, Unit>,
): Position {
  // Find all player units
  const playerUnits: Unit[] = [];
  for (const u of allUnits.values()) {
    if (u.faction === 'player') playerUnits.push(u);
  }

  if (playerUnits.length === 0) return unit.position;

  // Find the nearest player unit (manhattan distance from current position)
  let nearestPlayer = playerUnits[0];
  let nearestDist = Infinity;
  for (const pu of playerUnits) {
    const dist = Math.abs(unit.position.x - pu.position.x) + Math.abs(unit.position.y - pu.position.y);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearestPlayer = pu;
    }
  }

  // Among movable positions, find the one closest to that player unit
  let bestPos = unit.position;
  let bestDist = Infinity;
  for (const pos of movablePositions) {
    const dist = Math.abs(pos.x - nearestPlayer.position.x) + Math.abs(pos.y - nearestPlayer.position.y);
    if (dist < bestDist) {
      bestDist = dist;
      bestPos = pos;
    }
  }

  return bestPos;
}
