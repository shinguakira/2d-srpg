import type { Unit, GameMap, Tile, ChapterData } from '../../core/types';
import type { CombatResult } from '../../core/combat';
import type { GameState } from '../gameStoreTypes';

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

  // Remove dead units + check for death quotes/lord death
  if (combatResult.defenderDied) {
    if (defender.faction === 'player' && defender.deathQuote) {
      deathQuote = { unitName: defender.name, quote: defender.deathQuote };
    }
    if (defender.faction === 'player' && defender.isLord) {
      lordDied = true;
    }
    newUnits.delete(defenderId);
    newTiles[defender.position.y][defender.position.x].occupantId = null;
  }
  if (combatResult.attackerDied) {
    if (attacker.faction === 'player' && attacker.deathQuote) {
      deathQuote = { unitName: attacker.name, quote: attacker.deathQuote };
    }
    if (attacker.faction === 'player' && attacker.isLord) {
      lordDied = true;
    }
    newUnits.delete(attackerId);
    newTiles[attacker.position.y][attacker.position.x].occupantId = null;
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
