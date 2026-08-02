import type { Unit, GameMap, Position, TerrainType, WeatherType } from './types';
import { posKey } from './types';
import {
  getMovementRange,
  getAttackTilesFrom,
  getManhattanDistance,
  getPathfindingDistance,
  getDistanceMap,
} from './pathfinding';
import {
  calculateCombatForecast,
  getWeaponTriangle,
  isWeaponProficient,
  getEffectiveWeaponRange,
} from './combat';
import type { CombatForecast } from './combat';
import { getTerrainData } from './terrain';
import type { ClassFlags } from './terrain';
import { isNearRen } from './metaStats';

export type AIAction = {
  unitId: string;
  moveTo: Position;
  attackTargetId: string | null;
  forecast: CombatForecast | null;
  useItemIndex?: number;
  healTargetId?: string;
  interactType?: 'chest' | 'village';
  reveal?: boolean;
  weaponIndex?: number;
};

// ===== Context passed to AI for map-level knowledge =====

export type AIContext = {
  visitedVillages?: ReadonlySet<string>;
  openedChests?: ReadonlySet<string>;
  weather?: WeatherType;
  weatherMods?: { movPenalty?: number; terrainCostMod?: number };
};

// ===== Main Decision Function =====

/**
 * Decide the best action for an AI-controlled unit.
 * Dispatches on AI behavior type.
 */
export function decideAction(
  unit: Unit,
  gameMap: GameMap,
  allUnits: Map<string, Unit>,
  classFlags?: ClassFlags,
  ctx?: AIContext,
): AIAction {
  const behavior = unit.aiBehavior?.type ?? 'aggressive';

  const wm = ctx?.weatherMods;
  const wt = ctx?.weather;

  switch (behavior) {
    case 'stationary':
    case 'boss':
      return decideStationaryOrBoss(unit, gameMap, allUnits, behavior, wm, wt);
    case 'guard':
      return decideGuard(unit, gameMap, allUnits, classFlags, wm, wt);
    case 'survival':
      return decideSurvival(unit, gameMap, allUnits, classFlags, wm, wt);
    case 'thief':
      return decideThief(unit, gameMap, allUnits, classFlags, ctx, wm, wt);
    case 'healer':
      return decideHealer(unit, gameMap, allUnits, classFlags, wm, wt);
    case 'escort':
      return decideEscort(unit, gameMap, allUnits, classFlags, wm, wt);
    case 'coordinated':
      return decideCoordinated(unit, gameMap, allUnits, classFlags, wm, wt);
    case 'ambush':
      return decideAmbush(unit, gameMap, allUnits, classFlags, wm, wt);
    default:
      return decideAggressive(unit, gameMap, allUnits, classFlags, wm, wt);
  }
}

// ===== Scoring =====

/**
 * Score a potential attack target.
 * Higher score = better target.
 */
export function scoreTarget(
  forecast: CombatForecast,
  target: Unit,
  attacker?: Unit,
  defenderTerrain?: TerrainType,
): number {
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

  // Weapon triangle awareness (only if proficient)
  if (attacker && isWeaponProficient(attacker, attacker.equippedWeapon)) {
    const tri = getWeaponTriangle(attacker.equippedWeapon.type, target.equippedWeapon.type);
    if (tri.dmgMod > 0) score += 10; // advantage
    if (tri.dmgMod < 0) score -= 10; // disadvantage
  }

  // Terrain awareness — penalize attacking targets on defensive terrain
  if (defenderTerrain) {
    const terrainDef = getTerrainData(defenderTerrain).defenseBonus;
    score -= terrainDef * 3;
  }

  return score;
}

// ===== Helpers =====

/** Collect all attack options from a set of movable positions.
 *  Evaluates all weapons in unit.inventory per (position, target) pair
 *  and picks the one with highest expected value (damage × hitRate / 100). */
function collectAttackOptions(
  unit: Unit,
  movablePositions: Position[],
  gameMap: GameMap,
  allUnits: Map<string, Unit>,
  weather: WeatherType | undefined,
  behavior: string,
): Array<{
  moveTo: Position;
  targetId: string;
  forecast: CombatForecast;
  score: number;
  weaponIndex?: number;
}> {
  const options: Array<{
    moveTo: Position;
    targetId: string;
    forecast: CombatForecast;
    score: number;
    weaponIndex?: number;
  }> = [];

  // Build list of attack-capable weapons (skip staves)
  const weapons = unit.inventory.filter((w) => w.type !== 'staff');
  // Fallback: if inventory has no attack weapons, use equippedWeapon
  if (weapons.length === 0) weapons.push(unit.equippedWeapon);

  for (const pos of movablePositions) {
    const attackerTerrain = gameMap.tiles[pos.y][pos.x].terrain;
    const attackerNearRen = unit.id !== 'ren' && isNearRen(pos, allUnits);

    for (const target of allUnits.values()) {
      if (target.faction === unit.faction) continue;
      if (target.faction === 'neutral') continue;

      const defenderTerrain = gameMap.tiles[target.position.y][target.position.x].terrain;
      const distance = getManhattanDistance(pos, target.position);
      const defenderNearRen = target.id !== 'ren' && isNearRen(target.position, allUnits);

      // Evaluate each weapon, keep best by expected value
      let bestEv = -1;
      let bestOption: { forecast: CombatForecast; score: number; weaponIndex: number } | null =
        null;

      for (let wi = 0; wi < weapons.length; wi++) {
        const weapon = weapons[wi];
        const range = getEffectiveWeaponRange(unit, weapon);
        const atkTiles = getAttackTilesFrom(pos, weapon, gameMap, range);
        if (!atkTiles.has(posKey(target.position))) continue;

        const unitWithWeapon = { ...unit, position: pos, equippedWeapon: weapon };
        const forecast = calculateCombatForecast(
          unitWithWeapon,
          target,
          attackerTerrain,
          defenderTerrain,
          distance,
          { attackerNearRen, defenderNearRen, weather },
        );
        const ev = (forecast.attackerDamage * forecast.attackerHit) / 100;

        if (ev > bestEv) {
          bestEv = ev;
          const score = scoreTarget(forecast, target, unitWithWeapon, defenderTerrain);
          const inventoryIndex = unit.inventory.indexOf(weapon);
          bestOption = { forecast, score, weaponIndex: inventoryIndex >= 0 ? inventoryIndex : 0 };
        }
      }

      if (bestOption) {
        let { score } = bestOption;
        // Boss AI: bonus for attacking the Lord
        if (behavior === 'boss' && target.isLord) {
          score += 50;
        }
        options.push({
          moveTo: pos,
          targetId: target.id,
          forecast: bestOption.forecast,
          score,
          weaponIndex: bestOption.weaponIndex,
        });
      }
    }
  }

  options.sort((a, b) => b.score - a.score);
  return options;
}

/** Get full movement range as Position[] */
function getMovablePositions(
  unit: Unit,
  gameMap: GameMap,
  allUnits: Map<string, Unit>,
  classFlags?: ClassFlags,
  weatherMods?: { movPenalty?: number; terrainCostMod?: number },
): Position[] {
  const moveRange = getMovementRange(unit, gameMap, allUnits, classFlags, undefined, weatherMods);
  return Array.from(moveRange).map((key) => {
    const [x, y] = key.split(',').map(Number);
    return { x, y } as Position;
  });
}

/** Move toward nearest hostile unit (player + ally factions) */
function findMoveTowardNearestPlayer(
  unit: Unit,
  movablePositions: Position[],
  allUnits: Map<string, Unit>,
  gameMap: GameMap,
  classFlags?: ClassFlags,
): Position {
  const hostiles: Unit[] = [];
  for (const u of allUnits.values()) {
    if (u.faction !== unit.faction && u.faction !== 'neutral') hostiles.push(u);
  }
  if (hostiles.length === 0) return unit.position;

  // Find nearest hostile by BFS distance, fallback to Manhattan if all unreachable
  let nearestTarget = hostiles[0];
  let nearestDist = Infinity;
  for (const h of hostiles) {
    const dist = getPathfindingDistance(unit.position, h.position, gameMap, classFlags);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearestTarget = h;
    }
  }
  if (nearestDist === Infinity) {
    // All hostiles unreachable by terrain — fallback to Manhattan
    nearestDist = Infinity;
    for (const h of hostiles) {
      const dist = getManhattanDistance(unit.position, h.position);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestTarget = h;
      }
    }
  }

  // Find movable position closest to target by BFS distance
  const targetDistMap = getDistanceMap(nearestTarget.position, gameMap, classFlags);
  let bestPos = unit.position;
  let bestDist = targetDistMap.get(posKey(unit.position)) ?? Infinity;
  for (const pos of movablePositions) {
    const dist = targetDistMap.get(posKey(pos)) ?? Infinity;
    if (dist < bestDist) {
      bestDist = dist;
      bestPos = pos;
    }
  }
  return bestPos;
}

/** Move away from all hostile units (maximize min distance) */
function findMoveAwayFromHostiles(
  unit: Unit,
  movablePositions: Position[],
  allUnits: Map<string, Unit>,
  gameMap: GameMap,
  classFlags?: ClassFlags,
): Position {
  const hostiles: Unit[] = [];
  for (const u of allUnits.values()) {
    if (u.faction !== unit.faction && u.faction !== 'neutral') hostiles.push(u);
  }
  if (hostiles.length === 0 || movablePositions.length === 0) return unit.position;

  // Pre-compute distance maps from each hostile position
  const hostileDistMaps = hostiles.map((h) => getDistanceMap(h.position, gameMap, classFlags));

  let bestPos = movablePositions[0];
  let bestMinDist = -1;
  for (const pos of movablePositions) {
    const pk = posKey(pos);
    let minDist = Infinity;
    for (const distMap of hostileDistMaps) {
      const d = distMap.get(pk) ?? Infinity;
      if (d < minDist) minDist = d;
    }
    if (minDist > bestMinDist) {
      bestMinDist = minDist;
      bestPos = pos;
    }
  }
  return bestPos;
}

/** Find the movable position closest to any fort/throne tile */
function findNearestFortPosition(
  movablePositions: Position[],
  gameMap: GameMap,
  classFlags?: ClassFlags,
): Position | null {
  const forts: Position[] = [];
  for (let y = 0; y < gameMap.height; y++) {
    for (let x = 0; x < gameMap.width; x++) {
      const t = gameMap.tiles[y][x].terrain;
      if (t === 'fort' || t === 'throne') {
        forts.push({ x, y });
      }
    }
  }
  if (forts.length === 0) return null;

  // Pre-compute distance maps from each fort
  const fortDistMaps = forts.map((f) => getDistanceMap(f, gameMap, classFlags));

  let bestPos: Position | null = null;
  let bestDist = Infinity;
  for (const pos of movablePositions) {
    const pk = posKey(pos);
    for (const distMap of fortDistMaps) {
      const d = distMap.get(pk) ?? Infinity;
      if (d < bestDist) {
        bestDist = d;
        bestPos = pos;
      }
    }
  }
  return bestPos;
}

/** Find the index of the first healing item in unit.items */
function findHealItemIndex(unit: Unit): number {
  return unit.items.findIndex((item) => item.effect.kind === 'heal');
}

/** Create a wait action (no attack, just move) */
function waitAction(unitId: string, pos: Position): AIAction {
  return { unitId, moveTo: pos, attackTargetId: null, forecast: null };
}

// ===== Behavior Implementations =====

function decideStationaryOrBoss(
  unit: Unit,
  gameMap: GameMap,
  allUnits: Map<string, Unit>,
  behavior: string,
  _wm?: { movPenalty?: number; terrainCostMod?: number },
  wt?: WeatherType,
): AIAction {
  const movablePositions = [{ ...unit.position }];
  const options = collectAttackOptions(unit, movablePositions, gameMap, allUnits, wt, behavior);

  if (options.length > 0) {
    const best = options[0];
    return {
      unitId: unit.id,
      moveTo: best.moveTo,
      attackTargetId: best.targetId,
      forecast: best.forecast,
      weaponIndex: best.weaponIndex,
    };
  }
  return waitAction(unit.id, unit.position);
}

function decideGuard(
  unit: Unit,
  gameMap: GameMap,
  allUnits: Map<string, Unit>,
  classFlags?: ClassFlags,
  wm?: { movPenalty?: number; terrainCostMod?: number },
  wt?: WeatherType,
): AIAction {
  let movablePositions = getMovablePositions(unit, gameMap, allUnits, classFlags, wm);

  if (unit.aiBehavior?.type === 'guard' && unit.startPosition) {
    const { radius } = unit.aiBehavior;
    const start = unit.startPosition;
    movablePositions = movablePositions.filter((pos) => getManhattanDistance(pos, start) <= radius);
  }

  const options = collectAttackOptions(unit, movablePositions, gameMap, allUnits, wt, 'guard');
  if (options.length > 0) {
    const best = options[0];
    return {
      unitId: unit.id,
      moveTo: best.moveTo,
      attackTargetId: best.targetId,
      forecast: best.forecast,
      weaponIndex: best.weaponIndex,
    };
  }

  // Patrol path: move toward next waypoint when idle
  if (
    unit.aiBehavior?.type === 'guard' &&
    unit.aiBehavior.patrolPath &&
    unit.aiBehavior.patrolPath.length > 0
  ) {
    const path = unit.aiBehavior.patrolPath;
    // Find the closest waypoint we're not already on, preferring the next one in sequence
    let targetWaypoint: Position | null = null;
    let closestIdx = 0;
    let closestDist = Infinity;
    for (let i = 0; i < path.length; i++) {
      const d = getPathfindingDistance(unit.position, path[i], gameMap, classFlags);
      if (d < closestDist) {
        closestDist = d;
        closestIdx = i;
      }
    }
    // Move toward next waypoint in sequence (wrap around)
    const nextIdx = closestDist === 0 ? (closestIdx + 1) % path.length : closestIdx;
    targetWaypoint = path[nextIdx];

    // Find reachable position closest to the target waypoint
    const wpDistMap = getDistanceMap(targetWaypoint, gameMap, classFlags);
    let bestPos = unit.position;
    let bestDist = wpDistMap.get(posKey(unit.position)) ?? Infinity;
    for (const pos of movablePositions) {
      const d = wpDistMap.get(posKey(pos)) ?? Infinity;
      if (d < bestDist) {
        bestDist = d;
        bestPos = pos;
      }
    }
    if (bestPos.x !== unit.position.x || bestPos.y !== unit.position.y) {
      return waitAction(unit.id, bestPos);
    }
  }

  // No patrol path: return to start position if not there
  if (unit.startPosition) {
    const start = unit.startPosition;
    if (unit.position.x !== start.x || unit.position.y !== start.y) {
      const startDistMap = getDistanceMap(start, gameMap, classFlags);
      let bestPos = unit.position;
      let bestDist = startDistMap.get(posKey(unit.position)) ?? Infinity;
      for (const pos of movablePositions) {
        const d = startDistMap.get(posKey(pos)) ?? Infinity;
        if (d < bestDist) {
          bestDist = d;
          bestPos = pos;
        }
      }
      return waitAction(unit.id, bestPos);
    }
  }

  return waitAction(unit.id, unit.position);
}

function decideAggressive(
  unit: Unit,
  gameMap: GameMap,
  allUnits: Map<string, Unit>,
  classFlags?: ClassFlags,
  wm?: { movPenalty?: number; terrainCostMod?: number },
  wt?: WeatherType,
): AIAction {
  const movablePositions = getMovablePositions(unit, gameMap, allUnits, classFlags, wm);
  const options = collectAttackOptions(unit, movablePositions, gameMap, allUnits, wt, 'aggressive');

  if (options.length > 0) {
    const best = options[0];
    return {
      unitId: unit.id,
      moveTo: best.moveTo,
      attackTargetId: best.targetId,
      forecast: best.forecast,
      weaponIndex: best.weaponIndex,
    };
  }

  // No target reachable — move toward nearest hostile
  const moveToward = findMoveTowardNearestPlayer(
    unit,
    movablePositions,
    allUnits,
    gameMap,
    classFlags,
  );
  return waitAction(unit.id, moveToward);
}

function decideSurvival(
  unit: Unit,
  gameMap: GameMap,
  allUnits: Map<string, Unit>,
  classFlags?: ClassFlags,
  wm?: { movPenalty?: number; terrainCostMod?: number },
  wt?: WeatherType,
): AIAction {
  const hpPct = unit.currentHp / unit.stats.hp;
  const movablePositions = getMovablePositions(unit, gameMap, allUnits, classFlags, wm);

  // HP > 50%: aggressive mode
  if (hpPct > 0.5) {
    return decideAggressive(unit, gameMap, allUnits, classFlags, wm, wt);
  }

  // HP <= 30%: retreat mode
  if (hpPct <= 0.3) {
    // Use healing item if available
    const itemIdx = findHealItemIndex(unit);
    if (itemIdx >= 0) {
      // Move toward fort (or away from enemies) and use item
      const fortPos = findNearestFortPosition(movablePositions, gameMap, classFlags);
      const movePos =
        fortPos ?? findMoveAwayFromHostiles(unit, movablePositions, allUnits, gameMap, classFlags);
      return { ...waitAction(unit.id, movePos), useItemIndex: itemIdx };
    }

    // No item — just flee toward fort or away from enemies
    const fortPos = findNearestFortPosition(movablePositions, gameMap, classFlags);
    const movePos =
      fortPos ?? findMoveAwayFromHostiles(unit, movablePositions, allUnits, gameMap, classFlags);
    return waitAction(unit.id, movePos);
  }

  // HP 30-50%: cautious mode — only attack if safe and score > 80
  const options = collectAttackOptions(unit, movablePositions, gameMap, allUnits, wt, 'survival');
  const safeOptions = options.filter((opt) => {
    if (!opt.forecast.defenderCanCounter) return true;
    const counterDmg = opt.forecast.defenderDamage * (opt.forecast.defenderCanDouble ? 2 : 1);
    return counterDmg < unit.currentHp * 0.5;
  });

  const viableOptions = safeOptions.filter((opt) => opt.score > 80);
  if (viableOptions.length > 0) {
    const best = viableOptions[0];
    return {
      unitId: unit.id,
      moveTo: best.moveTo,
      attackTargetId: best.targetId,
      forecast: best.forecast,
      weaponIndex: best.weaponIndex,
    };
  }

  // No safe attack — use healing item if available, else hold position or move toward fort
  const itemIdx = findHealItemIndex(unit);
  if (itemIdx >= 0) {
    const fortPos = findNearestFortPosition(movablePositions, gameMap, classFlags);
    const movePos =
      fortPos ?? findMoveAwayFromHostiles(unit, movablePositions, allUnits, gameMap, classFlags);
    return { ...waitAction(unit.id, movePos), useItemIndex: itemIdx };
  }
  const fortPos = findNearestFortPosition(movablePositions, gameMap, classFlags);
  return waitAction(unit.id, fortPos ?? unit.position);
}

function decideThief(
  unit: Unit,
  gameMap: GameMap,
  allUnits: Map<string, Unit>,
  classFlags?: ClassFlags,
  ctx?: AIContext,
  wm?: { movPenalty?: number; terrainCostMod?: number },
  wt?: WeatherType,
): AIAction {
  const movablePositions = getMovablePositions(unit, gameMap, allUnits, classFlags, wm);

  // Find loot targets: chest and village tiles
  const targets: Position[] = [];
  for (let y = 0; y < gameMap.height; y++) {
    for (let x = 0; x < gameMap.width; x++) {
      const terrain = gameMap.tiles[y][x].terrain;
      const key = posKey({ x, y });
      if (terrain === 'chest' && !ctx?.openedChests?.has(key)) {
        targets.push({ x, y });
      }
      if (terrain === 'village' && !ctx?.visitedVillages?.has(key)) {
        targets.push({ x, y });
      }
    }
  }

  // If unit has a specific target position, prefer that
  if (unit.aiBehavior?.type === 'thief' && unit.aiBehavior.targetPosition) {
    targets.unshift(unit.aiBehavior.targetPosition);
  }

  // Check if standing on a target tile
  const currentKey = posKey(unit.position);
  for (const target of targets) {
    if (posKey(target) === currentKey) {
      const terrain = gameMap.tiles[target.y][target.x].terrain;
      if (terrain === 'chest') {
        return { ...waitAction(unit.id, unit.position), interactType: 'chest' };
      }
      if (terrain === 'village') {
        return { ...waitAction(unit.id, unit.position), interactType: 'village' };
      }
    }
  }

  // Check if any movable position is on a target
  for (const pos of movablePositions) {
    const pk = posKey(pos);
    for (const target of targets) {
      if (posKey(target) === pk) {
        const terrain = gameMap.tiles[target.y][target.x].terrain;
        if (terrain === 'chest') {
          return { ...waitAction(unit.id, pos), interactType: 'chest' };
        }
        if (terrain === 'village') {
          return { ...waitAction(unit.id, pos), interactType: 'village' };
        }
      }
    }
  }

  // Move toward nearest target
  if (targets.length > 0) {
    let nearestTarget = targets[0];
    let nearestDist = Infinity;
    for (const t of targets) {
      const d = getPathfindingDistance(unit.position, t, gameMap, classFlags);
      if (d < nearestDist) {
        nearestDist = d;
        nearestTarget = t;
      }
    }
    // Fallback to Manhattan if all targets unreachable
    if (nearestDist === Infinity) {
      for (const t of targets) {
        const d = getManhattanDistance(unit.position, t);
        if (d < nearestDist) {
          nearestDist = d;
          nearestTarget = t;
        }
      }
    }

    const targetDistMap = getDistanceMap(nearestTarget, gameMap, classFlags);
    let bestPos = unit.position;
    let bestDist = targetDistMap.get(posKey(unit.position)) ?? Infinity;
    for (const pos of movablePositions) {
      const d = targetDistMap.get(posKey(pos)) ?? Infinity;
      if (d < bestDist) {
        bestDist = d;
        bestPos = pos;
      }
    }
    return waitAction(unit.id, bestPos);
  }

  // No loot targets remain — fall back to aggressive
  return decideAggressive(unit, gameMap, allUnits, classFlags, wm, wt);
}

function decideHealer(
  unit: Unit,
  gameMap: GameMap,
  allUnits: Map<string, Unit>,
  classFlags?: ClassFlags,
  wm?: { movPenalty?: number; terrainCostMod?: number },
  _wt?: WeatherType,
): AIAction {
  const movablePositions = getMovablePositions(unit, gameMap, allUnits, classFlags, wm);
  const hpPct = unit.currentHp / unit.stats.hp;

  // If HP < 50%, flee (maximize distance from hostiles)
  if (hpPct < 0.5) {
    const safePos = findMoveAwayFromHostiles(unit, movablePositions, allUnits, gameMap, classFlags);
    return waitAction(unit.id, safePos);
  }

  // Find staff weapon
  const staff =
    unit.inventory.find((w) => w.type === 'staff') ??
    (unit.equippedWeapon.type === 'staff' ? unit.equippedWeapon : null);
  if (!staff) {
    // No staff — just stay away
    const safePos = findMoveAwayFromHostiles(unit, movablePositions, allUnits, gameMap, classFlags);
    return waitAction(unit.id, safePos);
  }

  // Find damaged allies (same faction, HP < 80%)
  const damagedAllies: Unit[] = [];
  for (const u of allUnits.values()) {
    if (u.faction === unit.faction && u.id !== unit.id && u.currentHp < u.stats.hp * 0.8) {
      damagedAllies.push(u);
    }
  }

  // Score each heal option: (movable position, ally)
  type HealOption = { moveTo: Position; targetId: string; score: number };
  const healOptions: HealOption[] = [];

  for (const pos of movablePositions) {
    const healTiles = getAttackTilesFrom(pos, staff, gameMap);
    for (const ally of damagedAllies) {
      if (!healTiles.has(posKey(ally.position))) continue;
      let score = (1 - ally.currentHp / ally.stats.hp) * 100;
      if (ally.currentHp / ally.stats.hp <= 0.3) score += 80;

      // Prefer positions 2+ tiles from hostiles
      let minHostileDist = Infinity;
      for (const u of allUnits.values()) {
        if (u.faction !== unit.faction && u.faction !== 'neutral') {
          const d = getManhattanDistance(pos, u.position);
          if (d < minHostileDist) minHostileDist = d;
        }
      }
      if (minHostileDist >= 2) score += 20;

      healOptions.push({ moveTo: pos, targetId: ally.id, score });
    }
  }

  if (healOptions.length > 0) {
    healOptions.sort((a, b) => b.score - a.score);
    const best = healOptions[0];
    return {
      unitId: unit.id,
      moveTo: best.moveTo,
      attackTargetId: null,
      forecast: null,
      healTargetId: best.targetId,
    };
  }

  // No heal targets — move away from enemies
  const safePos = findMoveAwayFromHostiles(unit, movablePositions, allUnits, gameMap, classFlags);
  return waitAction(unit.id, safePos);
}

function decideEscort(
  unit: Unit,
  gameMap: GameMap,
  allUnits: Map<string, Unit>,
  classFlags?: ClassFlags,
  wm?: { movPenalty?: number; terrainCostMod?: number },
  wt?: WeatherType,
): AIAction {
  if (unit.aiBehavior?.type !== 'escort')
    return decideAggressive(unit, gameMap, allUnits, classFlags, wm, wt);

  const targetUnit = allUnits.get(unit.aiBehavior.targetUnitId);
  if (!targetUnit) {
    // Target dead — fall back to aggressive
    return decideAggressive(unit, gameMap, allUnits, classFlags, wm, wt);
  }

  const movablePositions = getMovablePositions(unit, gameMap, allUnits, classFlags, wm);

  // Filter to positions within 2 tiles of escort target
  const nearTargetPositions = movablePositions.filter(
    (pos) => getManhattanDistance(pos, targetUnit.position) <= 2,
  );
  const candidatePositions =
    nearTargetPositions.length > 0 ? nearTargetPositions : movablePositions;

  // Check if any enemy threatens the target (within 2 tiles)
  const threats: Unit[] = [];
  for (const u of allUnits.values()) {
    if (u.faction !== unit.faction && u.faction !== 'neutral') {
      if (getManhattanDistance(u.position, targetUnit.position) <= 2) {
        threats.push(u);
      }
    }
  }

  // If threats exist, try to attack the closest one
  if (threats.length > 0) {
    const options = collectAttackOptions(unit, candidatePositions, gameMap, allUnits, wt, 'escort');
    // Prioritize threats to the escort target
    const threatIds = new Set(threats.map((t) => t.id));
    const threatOptions = options.filter((o) => threatIds.has(o.targetId));
    const bestOptions = threatOptions.length > 0 ? threatOptions : options;

    if (bestOptions.length > 0) {
      const best = bestOptions[0];
      return {
        unitId: unit.id,
        moveTo: best.moveTo,
        attackTargetId: best.targetId,
        forecast: best.forecast,
        weaponIndex: best.weaponIndex,
      };
    }
  }

  // No threats or can't attack — position between target and nearest enemy
  const hostiles: Unit[] = [];
  for (const u of allUnits.values()) {
    if (u.faction !== unit.faction && u.faction !== 'neutral') hostiles.push(u);
  }

  if (hostiles.length > 0 && candidatePositions.length > 0) {
    let nearestHostile = hostiles[0];
    let nearestDist = Infinity;
    for (const h of hostiles) {
      const d = getManhattanDistance(targetUnit.position, h.position);
      if (d < nearestDist) {
        nearestDist = d;
        nearestHostile = h;
      }
    }

    // Pick position closest to the line between target and nearest hostile
    let bestPos = candidatePositions[0];
    let bestScore = -Infinity;
    for (const pos of candidatePositions) {
      // Prefer being closer to the enemy than the target is (shielding)
      const distToEnemy = getManhattanDistance(pos, nearestHostile.position);
      const distToTarget = getManhattanDistance(pos, targetUnit.position);
      const score = -distToEnemy - distToTarget; // closer to both is better
      if (score > bestScore) {
        bestScore = score;
        bestPos = pos;
      }
    }
    return waitAction(unit.id, bestPos);
  }

  // No enemies at all — stay near target
  if (candidatePositions.length > 0) {
    let bestPos = candidatePositions[0];
    let bestDist = Infinity;
    for (const pos of candidatePositions) {
      const d = getManhattanDistance(pos, targetUnit.position);
      if (d < bestDist) {
        bestDist = d;
        bestPos = pos;
      }
    }
    return waitAction(unit.id, bestPos);
  }

  return waitAction(unit.id, unit.position);
}

function decideCoordinated(
  unit: Unit,
  gameMap: GameMap,
  allUnits: Map<string, Unit>,
  classFlags?: ClassFlags,
  wm?: { movPenalty?: number; terrainCostMod?: number },
  wt?: WeatherType,
): AIAction {
  if (unit.aiBehavior?.type !== 'coordinated')
    return decideAggressive(unit, gameMap, allUnits, classFlags, wm, wt);

  const groupId = unit.aiBehavior.groupId;

  // Count same-group units still alive
  let groupCount = 0;
  for (const u of allUnits.values()) {
    if (u.aiBehavior?.type === 'coordinated' && u.aiBehavior.groupId === groupId) {
      groupCount++;
    }
  }

  // If fewer than 3 coordinated units remain, fall back to aggressive
  if (groupCount < 3) {
    return decideAggressive(unit, gameMap, allUnits, classFlags, wm, wt);
  }

  // Find the highest-priority target across all player units
  const movablePositions = getMovablePositions(unit, gameMap, allUnits, classFlags, wm);
  const allOptions = collectAttackOptions(
    unit,
    movablePositions,
    gameMap,
    allUnits,
    wt,
    'coordinated',
  );

  // Score all hostiles to find focus target
  let bestTargetId: string | null = null;
  let bestTargetScore = -Infinity;

  for (const opt of allOptions) {
    if (opt.score > bestTargetScore) {
      bestTargetScore = opt.score;
      bestTargetId = opt.targetId;
    }
  }

  // Apply +200 bonus to the focus target
  if (bestTargetId) {
    const focusOptions = allOptions.filter((o) => o.targetId === bestTargetId);
    for (const o of focusOptions) o.score += 200;
    allOptions.sort((a, b) => b.score - a.score);
  }

  if (allOptions.length > 0) {
    const best = allOptions[0];
    return {
      unitId: unit.id,
      moveTo: best.moveTo,
      attackTargetId: best.targetId,
      forecast: best.forecast,
      weaponIndex: best.weaponIndex,
    };
  }

  // Can't reach anyone — move toward nearest hostile
  const moveToward = findMoveTowardNearestPlayer(
    unit,
    movablePositions,
    allUnits,
    gameMap,
    classFlags,
  );
  return waitAction(unit.id, moveToward);
}

function decideAmbush(
  unit: Unit,
  gameMap: GameMap,
  allUnits: Map<string, Unit>,
  classFlags?: ClassFlags,
  wm?: { movPenalty?: number; terrainCostMod?: number },
  wt?: WeatherType,
): AIAction {
  if (unit.aiBehavior?.type !== 'ambush')
    return decideAggressive(unit, gameMap, allUnits, classFlags, wm, wt);

  const triggerRadius = unit.aiBehavior.triggerRadius;

  // If already revealed, behave like aggressive
  if (!unit.isHidden) {
    return decideAggressive(unit, gameMap, allUnits, classFlags, wm, wt);
  }

  // Check if any hostile unit is within trigger radius
  let triggered = false;
  for (const u of allUnits.values()) {
    if (u.faction !== unit.faction && u.faction !== 'neutral') {
      if (getManhattanDistance(unit.position, u.position) <= triggerRadius) {
        triggered = true;
        break;
      }
    }
  }

  if (!triggered) {
    // Stay hidden, do nothing
    return waitAction(unit.id, unit.position);
  }

  // Triggered — reveal and attack
  const movablePositions = getMovablePositions(unit, gameMap, allUnits, classFlags, wm);
  const options = collectAttackOptions(unit, movablePositions, gameMap, allUnits, wt, 'ambush');

  if (options.length > 0) {
    const best = options[0];
    return {
      unitId: unit.id,
      moveTo: best.moveTo,
      attackTargetId: best.targetId,
      forecast: best.forecast,
      reveal: true,
      weaponIndex: best.weaponIndex,
    };
  }

  // Can attack nobody — move toward nearest hostile, still reveal
  const moveToward = findMoveTowardNearestPlayer(
    unit,
    movablePositions,
    allUnits,
    gameMap,
    classFlags,
  );
  return { ...waitAction(unit.id, moveToward), reveal: true };
}
