import { posKey } from '../../core/types';
import { getManhattanDistance, getPath } from '../../core/pathfinding';
import { calculateCombatForecast, resolveCombat } from '../../core/combat';
import { decideAction } from '../../core/ai';
import type { AIAction } from '../../core/ai';
import type { GameState, GameActions } from '../gameStoreTypes';
import { IDLE_RESET } from '../helpers/constants';
import { applyCombatResult } from '../helpers/combatResolution';
import { checkVictory, getClassFlags } from '../helpers/mapHelpers';
import { deriveFacing } from '../helpers/facingHelpers';

/** Check if walk animation should be skipped (for E2E tests) */
function shouldSkipWalkAnim(): boolean {
  if (typeof window === 'undefined') return true;
  return new URLSearchParams(window.location.search).has('skipWalkAnim');
}

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

/**
 * Compute AI actions for ally units.
 * Ally units target enemies using aggressive AI.
 */
export function computeAllyActions(get: Get, set: Set) {
  const { units, gameMap } = get();
  const actions: AIAction[] = [];

  const simUnits = new Map(units);
  for (const [id, u] of simUnits) {
    simUnits.set(id, { ...u });
  }

  for (const unit of units.values()) {
    if (unit.faction === 'ally' && !unit.hasActed) {
      // Ally units use aggressive AI by default, targeting enemies
      const allyUnit = { ...unit, aiBehavior: unit.aiBehavior ?? { type: 'aggressive' as const } };
      const action = decideAction(allyUnit, gameMap, simUnits, getClassFlags(unit));
      actions.push(action);

      const simUnit = simUnits.get(unit.id)!;
      simUnits.set(unit.id, { ...simUnit, position: { ...action.moveTo } });
    }
  }

  if (actions.length === 0) {
    // No ally units to act — skip ally phase
    endAllyTurn(get, set);
    return;
  }

  set({ allyActions: actions, allyActionIndex: 0 });
}

export function executeNextAllyAction(get: Get, set: Set) {
  const { allyActions, allyActionIndex, units, gameMap } = get();

  if (allyActionIndex < 0 || allyActionIndex >= allyActions.length) {
    endAllyTurn(get, set);
    return;
  }

  const action = allyActions[allyActionIndex];
  const unit = units.get(action.unitId);
  if (!unit) {
    set({ allyActionIndex: allyActionIndex + 1 });
    return;
  }

  let destination = action.moveTo;
  const destOccupant = gameMap.tiles[destination.y]?.[destination.x]?.occupantId;
  if (destOccupant && destOccupant !== unit.id) {
    destination = unit.position;
  }

  const needsMove = posKey(unit.position) !== posKey(destination);

  if (needsMove && !shouldSkipWalkAnim()) {
    const path = getPath(unit.position, destination, unit, gameMap, units, getClassFlags(unit));
    if (path.length > 1) {
      set({
        movingUnit: { unitId: unit.id, path, stepIndex: 0, onComplete: 'enemy_action' },
      });
      return;
    }
  }

  finalizeAllyAction(get, set, action, unit, destination);
}

function finalizeAllyAction(
  get: Get, set: Set, action: AIAction, unit: ReturnType<Get>['units'] extends Map<string, infer U> ? U : never, destination: { x: number; y: number }
) {
  const { units, gameMap, rng, allyActionIndex } = get();

  const newUnits = new Map(units);
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));

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
      newUnits.set(unit.id, { ...movedUnit, hasActed: true });
      set({
        units: newUnits,
        gameMap: { ...gameMap, tiles: newTiles },
        allyActionIndex: allyActionIndex + 1,
      });
      return;
    }

    const attackerTerrain = newTiles[destination.y][destination.x].terrain;
    const defenderTerrain = newTiles[target.position.y][target.position.x].terrain;
    const distance = getManhattanDistance(destination, target.position);

    if (distance < unit.equippedWeapon.minRange || distance > unit.equippedWeapon.maxRange) {
      newUnits.set(unit.id, { ...movedUnit, hasActed: true });
      set({
        units: newUnits,
        gameMap: { ...gameMap, tiles: newTiles },
        allyActionIndex: allyActionIndex + 1,
      });
      return;
    }

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
    newUnits.set(unit.id, { ...movedUnit, hasActed: true });
    set({
      units: newUnits,
      gameMap: { ...gameMap, tiles: newTiles },
      allyActionIndex: allyActionIndex + 1,
    });
  }
}

export function finishAllyCombat(get: Get, set: Set) {
  const { selectedUnitId, attackTargetId, combatResult, units, gameMap, allyActionIndex } = get();
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
    currentPhase: 'ally_phase',
    combatForecast: null,
    combatResult: null,
    combatAnimationStep: -1,
    selectedUnitId: null,
    attackTargetId: null,
    allyActionIndex: allyActionIndex + 1,
    deathQuote: resolution.deathQuote,
    floatingNumbers: resolution.floatingNumbers,
  });
}

export function endAllyTurn(get: Get, set: Set) {
  const { units, chapterData } = get();
  const endResult = checkVictory(units, chapterData);

  if (endResult) {
    set({ currentPhase: 'game_over', allyActions: [], allyActionIndex: -1 });
    return;
  }

  // Reset ally hasActed
  const newUnits = new Map(units);
  for (const [id, unit] of newUnits) {
    if (unit.faction === 'ally' && unit.hasActed) {
      newUnits.set(id, { ...unit, hasActed: false });
    }
  }

  // Transition to player phase
  set({
    units: newUnits,
    currentPhase: 'player_phase',
    currentTurn: get().currentTurn + 1,
    playerAction: 'idle',
    allyActions: [],
    allyActionIndex: -1,
    phaseBanner: 'player_phase',
  });
}
