import type { Unit, GameMap, Tile, ChapterData, DifficultyMode } from '../../core/types';
import type { CombatResult } from '../../core/combat';
import type { GameState } from '../gameStoreTypes';
import { clampMetaStats } from '../../core/metaStats';
import { getManhattanDistance } from '../../core/pathfinding';
import { isPermadeath } from '../../core/difficulty';
import { assignTraumaSkill } from '../../core/traumaSkills';
import { useCampaignStore } from '../campaignStore';

export type CombatResolutionResult = {
  newUnits: Map<string, Unit>;
  newTiles: Tile[][];
  deathQuote: { unitName: string; quote: string } | null;
  floatingNumbers: GameState['floatingNumbers'];
  lordDied: boolean;
  victoryResult: 'victory' | 'defeat' | null;
};

/**
 * Apply resolved combat results: update HP, remove dead units, generate floating numbers,
 * check death quotes & victory. Shared between player and enemy combat resolution.
 */
export function applyCombatResult(
  units: Map<string, Unit>,
  gameMap: GameMap,
  attackerId: string,
  defenderId: string,
  combatResult: CombatResult,
  chapterData: ChapterData | null,
  difficulty?: DifficultyMode,
): CombatResolutionResult {
  const newUnits = new Map(units);
  const attacker = newUnits.get(attackerId)!;
  const defender = newUnits.get(defenderId)!;
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));

  // Apply HP changes
  newUnits.set(attackerId, { ...attacker, currentHp: combatResult.attackerHpAfter, hasActed: true });
  newUnits.set(defenderId, { ...defender, currentHp: combatResult.defenderHpAfter });

  let deathQuote: CombatResolutionResult['deathQuote'] = null;
  let lordDied = false;

  const casualMode = difficulty ? !isPermadeath(difficulty) : false;

  // Remove dead units + check for death quotes/lord death
  if (combatResult.defenderDied) {
    if (defender.faction === 'player' && defender.deathQuote) {
      deathQuote = { unitName: defender.name, quote: defender.deathQuote };
    }
    if (defender.faction === 'player' && defender.isLord) {
      lordDied = true;
    }
    if (casualMode && defender.faction === 'player' && !defender.isLord) {
      // Casual mode: unit retreats instead of dying permanently
      newUnits.set(defenderId, { ...defender, currentHp: 1, retreated: true, hasActed: true });
    } else {
      newUnits.delete(defenderId);
    }
    newTiles[defender.position.y][defender.position.x].occupantId = null;
    // Carrier death: carried unit also dies
    if (defender.carriedUnitId) {
      const carried = newUnits.get(defender.carriedUnitId);
      if (carried) {
        if (carried.faction === 'player' && carried.deathQuote && !deathQuote) {
          deathQuote = { unitName: carried.name, quote: carried.deathQuote };
        }
        if (carried.faction === 'player' && carried.isLord) lordDied = true;
        if (casualMode && carried.faction === 'player' && !carried.isLord) {
          newUnits.set(defender.carriedUnitId, { ...carried, currentHp: 1, retreated: true });
        } else {
          newUnits.delete(defender.carriedUnitId);
        }
      }
    }
  }
  if (combatResult.attackerDied) {
    if (attacker.faction === 'player' && attacker.deathQuote) {
      deathQuote = { unitName: attacker.name, quote: attacker.deathQuote };
    }
    if (attacker.faction === 'player' && attacker.isLord) {
      lordDied = true;
    }
    if (casualMode && attacker.faction === 'player' && !attacker.isLord) {
      newUnits.set(attackerId, { ...attacker, currentHp: 1, retreated: true, hasActed: true });
    } else {
      newUnits.delete(attackerId);
    }
    newTiles[attacker.position.y][attacker.position.x].occupantId = null;
    // Carrier death: carried unit also dies
    if (attacker.carriedUnitId) {
      const carried = newUnits.get(attacker.carriedUnitId);
      if (carried) {
        if (carried.faction === 'player' && carried.deathQuote && !deathQuote) {
          deathQuote = { unitName: carried.name, quote: carried.deathQuote };
        }
        if (carried.faction === 'player' && carried.isLord) lordDied = true;
        if (casualMode && carried.faction === 'player' && !carried.isLord) {
          newUnits.set(attacker.carriedUnitId, { ...carried, currentHp: 1, retreated: true });
        } else {
          newUnits.delete(attacker.carriedUnitId);
        }
      }
    }
  }

  // Trauma skill assignment on permadeath
  const permadeath = difficulty ? isPermadeath(difficulty) : true;
  if (permadeath) {
    let runningDeaths = ((useCampaignStore.getState().campaignFlags.total_deaths as number) ?? 0);
    if (combatResult.defenderDied && defender.faction === 'player' && !defender.isLord) {
      runningDeaths += 1;
      useCampaignStore.setState({
        campaignFlags: { ...useCampaignStore.getState().campaignFlags, total_deaths: runningDeaths },
      });
      const assignment = assignTraumaSkill(runningDeaths, defenderId, newUnits, defender.position);
      if (assignment) {
        const target = newUnits.get(assignment.targetUnitId);
        if (target) {
          const trauma = [...(target.traumaSkills ?? [])];
          if (!trauma.includes(assignment.skillId)) trauma.push(assignment.skillId);
          newUnits.set(assignment.targetUnitId, { ...target, traumaSkills: trauma });
        }
      }
    }
    if (combatResult.attackerDied && attacker.faction === 'player' && !attacker.isLord) {
      runningDeaths += 1;
      useCampaignStore.setState({
        campaignFlags: { ...useCampaignStore.getState().campaignFlags, total_deaths: runningDeaths },
      });
      const assignment = assignTraumaSkill(runningDeaths, attackerId, newUnits, attacker.position);
      if (assignment) {
        const target = newUnits.get(assignment.targetUnitId);
        if (target) {
          const trauma = [...(target.traumaSkills ?? [])];
          if (!trauma.includes(assignment.skillId)) trauma.push(assignment.skillId);
          newUnits.set(assignment.targetUnitId, { ...target, traumaSkills: trauma });
        }
      }
    }
  }

  // Generate floating damage numbers
  const floatingNumbers: GameState['floatingNumbers'] = [];
  let floatId = Date.now();
  const dmgToDefender = defender.currentHp - combatResult.defenderHpAfter;
  const dmgToAttacker = attacker.currentHp - combatResult.attackerHpAfter;
  if (dmgToDefender > 0 && !combatResult.defenderDied) {
    floatingNumbers.push({ id: floatId++, x: defender.position.x, y: defender.position.y, text: `-${dmgToDefender}`, color: '#ef4444' });
  }
  if (dmgToAttacker > 0 && !combatResult.attackerDied) {
    floatingNumbers.push({ id: floatId++, x: attacker.position.x, y: attacker.position.y, text: `-${dmgToAttacker}`, color: '#ef4444' });
  }

  // LOY -5 for adjacent player allies when Ren takes damage
  const renDamaged =
    (attackerId === 'ren' && combatResult.attackerHpAfter < attacker.currentHp && !combatResult.attackerDied) ||
    (defenderId === 'ren' && combatResult.defenderHpAfter < defender.currentHp && !combatResult.defenderDied);
  if (renDamaged) {
    const ren = newUnits.get('ren');
    if (ren) {
      for (const [uid, u] of newUnits) {
        if (uid === 'ren' || u.faction !== 'player') continue;
        if (getManhattanDistance(u.position, ren.position) <= 1) {
          const newMeta = clampMetaStats({ ...u.metaStats, loy: u.metaStats.loy - 5 });
          newUnits.set(uid, { ...u, metaStats: newMeta });
          floatingNumbers.push({ id: floatId++, x: u.position.x, y: u.position.y, text: 'LOY -5', color: '#eab308' });
        }
      }
    }
  }

  // Check victory/defeat
  const victoryResult = checkVictorySimple(newUnits, chapterData);

  return { newUnits, newTiles, deathQuote, floatingNumbers, lordDied, victoryResult };
}

/** Check if the game should end based on objective and current state */
function checkVictorySimple(units: Map<string, Unit>, chapterData: ChapterData | null): 'victory' | 'defeat' | null {
  let hasPlayer = false;
  let hasEnemy = false;
  for (const u of units.values()) {
    if (u.faction === 'player') hasPlayer = true;
    if (u.faction === 'enemy') hasEnemy = true;
  }

  if (!hasPlayer) return 'defeat';

  if (!chapterData || chapterData.objective.type === 'rout') {
    if (!hasEnemy) return 'victory';
  }

  if (chapterData?.objective.type === 'seize' && !hasEnemy) {
    return 'victory';
  }

  return null;
}
