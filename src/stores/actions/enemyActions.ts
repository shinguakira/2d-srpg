import { posKey } from '../../core/types';
import { getManhattanDistance } from '../../core/pathfinding';
import { calculateCombatForecast, resolveCombat } from '../../core/combat';
import { decideAction } from '../../core/ai';
import type { AIAction } from '../../core/ai';
import type { GameState, GameActions } from '../gameStoreTypes';
import { IDLE_RESET } from '../helpers/constants';
import { applyCombatResult } from '../helpers/combatResolution';
import { checkVictory } from '../helpers/mapHelpers';
import { deriveFacing } from '../helpers/facingHelpers';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function computeEnemyActions(get: Get, set: Set) {
  const { units, gameMap } = get();
  const actions: AIAction[] = [];

  // Use a mutable copy of units so each enemy sees previous enemies' planned positions
  const simUnits = new Map(units);
  for (const [id, u] of simUnits) {
    simUnits.set(id, { ...u });
  }

  for (const unit of units.values()) {
    if (unit.faction === 'enemy' && !unit.hasActed) {
      const action = decideAction(simUnits.get(unit.id)!, gameMap, simUnits);
      actions.push(action);

      // Simulate the move so the next enemy sees the updated position
      const simUnit = simUnits.get(unit.id)!;
      simUnits.set(unit.id, { ...simUnit, position: { ...action.moveTo } });
    }
  }

  set({ enemyActions: actions, enemyActionIndex: 0 });
}

export function executeNextEnemyAction(get: Get, set: Set) {
  const { enemyActions, enemyActionIndex, units, gameMap, rng } = get();

  if (enemyActionIndex < 0 || enemyActionIndex >= enemyActions.length) {
    // All enemies done — end enemy turn
    get().endEnemyTurn();
    return;
  }

  const action = enemyActions[enemyActionIndex];
  const unit = units.get(action.unitId);
  if (!unit) {
    // Unit died during earlier combat, skip
    set({ enemyActionIndex: enemyActionIndex + 1 });
    return;
  }

  // Move the unit — check destination isn't already occupied
  const newUnits = new Map(units);
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));

  let destination = action.moveTo;
  const destOccupant = newTiles[destination.y][destination.x].occupantId;
  if (destOccupant && destOccupant !== unit.id) {
    // Destination occupied — stay in place
    destination = unit.position;
  }

  if (posKey(unit.position) !== posKey(destination)) {
    newTiles[unit.position.y][unit.position.x].occupantId = null;
    newTiles[destination.y][destination.x].occupantId = unit.id;
  }
  const moveFacing = deriveFacing(unit.position, destination);
  const movedUnit = { ...unit, position: { ...destination }, facing: moveFacing };
  newUnits.set(unit.id, movedUnit);

  if (action.attackTargetId && action.forecast) {
    const target = newUnits.get(action.attackTargetId);
    if (!target) {
      // Target already dead, just move and mark acted
      newUnits.set(unit.id, { ...movedUnit, hasActed: true });
      set({
        units: newUnits,
        gameMap: { ...gameMap, tiles: newTiles },
        enemyActionIndex: enemyActionIndex + 1,
      });
      return;
    }

    // Recalculate forecast with actual current HP and real destination
    const attackerTerrain = newTiles[destination.y][destination.x].terrain;
    const defenderTerrain = newTiles[target.position.y][target.position.x].terrain;
    const distance = getManhattanDistance(destination, target.position);

    // If enemy couldn't move to attack range, skip combat
    if (distance < unit.equippedWeapon.minRange || distance > unit.equippedWeapon.maxRange) {
      newUnits.set(unit.id, { ...movedUnit, hasActed: true });
      set({
        units: newUnits,
        gameMap: { ...gameMap, tiles: newTiles },
        enemyActionIndex: enemyActionIndex + 1,
      });
      return;
    }

    // Face toward attack target
    const attackFacing = deriveFacing(destination, target.position);
    const combatUnit = { ...movedUnit, facing: attackFacing };
    newUnits.set(unit.id, combatUnit);

    const forecast = calculateCombatForecast(combatUnit, target, attackerTerrain, defenderTerrain, distance);
    const result = resolveCombat(forecast, rng);

    set({
      units: newUnits,
      gameMap: { ...gameMap, tiles: newTiles },
      currentPhase: 'combat_animation',
      selectedUnitId: unit.id,
      attackTargetId: action.attackTargetId,
      combatForecast: forecast,
      combatResult: result,
      combatAnimationStep: 0,
    });
  } else {
    // No attack — just move and mark acted
    newUnits.set(unit.id, { ...movedUnit, hasActed: true });
    set({
      units: newUnits,
      gameMap: { ...gameMap, tiles: newTiles },
      enemyActionIndex: enemyActionIndex + 1,
    });
  }
}

export function finishEnemyCombat(get: Get, set: Set) {
  const { selectedUnitId, attackTargetId, combatResult, units, gameMap, enemyActionIndex } = get();
  if (!selectedUnitId || !attackTargetId || !combatResult) return;

  const { chapterData } = get();
  const resolution = applyCombatResult(units, gameMap, selectedUnitId, attackTargetId, combatResult, chapterData);

  if (resolution.lordDied || resolution.victoryResult) {
    set({
      ...IDLE_RESET,
      units: resolution.newUnits,
      gameMap: { ...gameMap, tiles: resolution.newTiles },
      currentPhase: 'game_over',
      deathQuote: resolution.deathQuote,
      floatingNumbers: resolution.floatingNumbers,
    });
    return;
  }

  set({
    units: resolution.newUnits,
    gameMap: { ...gameMap, tiles: resolution.newTiles },
    currentPhase: 'enemy_phase',
    combatForecast: null,
    combatResult: null,
    combatAnimationStep: -1,
    selectedUnitId: null,
    attackTargetId: null,
    enemyActionIndex: enemyActionIndex + 1,
    deathQuote: resolution.deathQuote,
    floatingNumbers: resolution.floatingNumbers,
  });
}

export function endEnemyTurn(get: Get, set: Set) {
  // Check win/lose before transitioning
  const { units, chapterData } = get();
  const endResult = checkVictory(units, chapterData);

  if (endResult) {
    set({ currentPhase: 'game_over', enemyActions: [], enemyActionIndex: -1 });
    return;
  }

  // Reset all enemy hasActed
  const newUnits = new Map(units);
  for (const [id, unit] of newUnits) {
    if (unit.faction === 'enemy' && unit.hasActed) {
      newUnits.set(id, { ...unit, hasActed: false });
    }
  }

  set({
    units: newUnits,
    currentPhase: 'player_phase',
    currentTurn: get().currentTurn + 1,
    playerAction: 'idle',
    enemyActions: [],
    enemyActionIndex: -1,
    phaseBanner: 'player_phase',
  });
}
