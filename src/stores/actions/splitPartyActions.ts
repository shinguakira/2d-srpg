import type { Unit } from '../../core/types';
import type { GameState, GameActions } from '../gameStoreTypes';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

/**
 * Switch active team: snapshot current team, restore saved team.
 */
export function switchActiveTeam(get: Get, set: Set): void {
  const { splitParty, units, gameMap } = get();
  if (!splitParty || splitParty.merged) return;

  const savedUnits = splitParty.savedState?.units ?? new Map<string, Unit>();
  const currentTeamIds = splitParty.activeTeam === 'A' ? splitParty.teamA : splitParty.teamB;
  const nextTeamIds = splitParty.activeTeam === 'A' ? splitParty.teamB : splitParty.teamA;

  // Save current team's unit state
  const snapshotUnits = new Map<string, Unit>();
  for (const id of currentTeamIds) {
    const unit = units.get(id);
    if (unit) snapshotUnits.set(id, unit);
  }

  // Build new units map: remove current team, add saved team
  const newUnits = new Map(units);
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));

  for (const id of currentTeamIds) {
    const unit = newUnits.get(id);
    if (unit) {
      newTiles[unit.position.y][unit.position.x].occupantId = null;
      newUnits.delete(id);
    }
  }

  for (const [id, unit] of savedUnits) {
    if (nextTeamIds.includes(id)) {
      newUnits.set(id, { ...unit, hasActed: false });
      newTiles[unit.position.y][unit.position.x].occupantId = id;
    }
  }

  set({
    units: newUnits,
    gameMap: { ...gameMap, tiles: newTiles },
    splitParty: {
      ...splitParty,
      activeTeam: splitParty.activeTeam === 'A' ? 'B' : 'A',
      savedState: { units: snapshotUnits },
    },
  });
}

/**
 * Check if merge condition is met: all boss-AI enemies on both teams
 * are below the configured HP threshold (e.g., 30%).
 */
export function checkMergeCondition(get: Get): boolean {
  const { splitParty, chapterData, units } = get();
  if (!splitParty || splitParty.merged) return false;

  const mergeConfig = chapterData?.splitParty?.mergeCondition;
  if (!mergeConfig) return false;

  const threshold = mergeConfig.bossHpPercent / 100;

  // Check bosses on the currently active map
  let foundActiveBoss = false;
  for (const u of units.values()) {
    if (u.faction === 'enemy' && u.aiBehavior?.type === 'boss') {
      foundActiveBoss = true;
      if (u.currentHp / u.stats.hp > threshold) return false;
    }
  }

  // Check bosses in the saved (inactive) team's state
  const savedUnits = splitParty.savedState?.units;
  let foundSavedBoss = false;
  if (savedUnits && savedUnits instanceof Map) {
    for (const u of (savedUnits as Map<string, Unit>).values()) {
      if (u.faction === 'enemy' && u.aiBehavior?.type === 'boss') {
        foundSavedBoss = true;
        if (u.currentHp / u.stats.hp > threshold) return false;
      }
    }
  }

  // Need at least one boss across both maps for the condition to be meaningful
  return foundActiveBoss || foundSavedBoss;
}

/**
 * Merge teams: restore all units to one map.
 */
export function mergeMaps(get: Get, set: Set): void {
  const { splitParty, units, gameMap } = get();
  if (!splitParty || splitParty.merged) return;

  const savedUnits = splitParty.savedState?.units ?? new Map<string, Unit>();
  const newUnits = new Map(units);
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));

  // Add saved team's units back to the map
  for (const [id, unit] of savedUnits) {
    newUnits.set(id, { ...unit, hasActed: false });
    // Place at their saved position if available
    if (unit.position && newTiles[unit.position.y]?.[unit.position.x]) {
      newTiles[unit.position.y][unit.position.x].occupantId = id;
    }
  }

  set({
    units: newUnits,
    gameMap: { ...gameMap, tiles: newTiles },
    splitParty: { ...splitParty, merged: true },
  });
}

/**
 * Validate team assignments: Ren on exactly one team, min 2 per team.
 */
export function validateTeamAssignment(
  teamA: string[],
  teamB: string[],
): { valid: boolean; error?: string } {
  if (teamA.length < 2) return { valid: false, error: 'Team A needs at least 2 units' };
  if (teamB.length < 2) return { valid: false, error: 'Team B needs at least 2 units' };

  const renInA = teamA.includes('ren');
  const renInB = teamB.includes('ren');
  if (!renInA && !renInB) return { valid: false, error: 'Ren must be on one team' };
  if (renInA && renInB) return { valid: false, error: 'Ren cannot be on both teams' };

  return { valid: true };
}
