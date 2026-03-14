import { posKey } from '../../core/types';
import { getManhattanDistance } from '../../core/pathfinding';
import { calculateCombatForecast, resolveCombat } from '../../core/combat';
import { calculateExpGain, checkLevelUp, rollLevelUp, applyStatGains } from '../../core/experience';
import type { StatGains } from '../../core/experience';
import { CLASSES } from '../../data/classes';
import { decideAction } from '../../core/ai';
import type { AIAction } from '../../core/ai';
import type { GameState, GameActions } from '../gameStoreTypes';
import { IDLE_RESET, EMPTY_SET } from '../helpers/constants';
import { applyCombatResult } from '../helpers/combatResolution';
import { allPlayersDone } from '../helpers/mapHelpers';
import { refreshDangerZone } from '../helpers/dangerZoneHelpers';
import { deriveFacing } from '../helpers/facingHelpers';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

/**
 * Start auto-battle: compute AI actions for all un-acted player units,
 * treating them as aggressive AI.
 */
export function startAutoBattle(get: Get, set: Set) {
  const { currentPhase, units, gameMap } = get();
  if (currentPhase !== 'player_phase') return;

  const actions: AIAction[] = [];
  const simUnits = new Map(units);
  for (const [id, u] of simUnits) {
    simUnits.set(id, { ...u });
  }

  for (const unit of units.values()) {
    if (unit.faction === 'player' && !unit.hasActed) {
      // Use aggressive AI for player units (temporarily set faction-aware targeting)
      const fakeEnemy = { ...simUnits.get(unit.id)!, faction: 'enemy' as const };
      simUnits.set(unit.id, fakeEnemy);
      const action = decideAction(fakeEnemy, gameMap, simUnits);
      // Restore faction
      simUnits.set(unit.id, { ...simUnits.get(unit.id)!, faction: 'player', position: { ...action.moveTo } });
      actions.push(action);
    }
  }

  set({
    isAutoBattle: true,
    autoBattleActions: actions,
    autoBattleIndex: 0,
    ...IDLE_RESET,
  });
}

export function executeNextAutoAction(get: Get, set: Set) {
  const { autoBattleActions, autoBattleIndex, units, gameMap, rng, isAutoBattle } = get();
  if (!isAutoBattle) return;

  if (autoBattleIndex < 0 || autoBattleIndex >= autoBattleActions.length) {
    // All done — end auto-battle, then end turn
    set({ isAutoBattle: false, autoBattleActions: [], autoBattleIndex: -1 });
    // Mark remaining player units as acted and end turn
    const newUnits = new Map(units);
    for (const [id, u] of newUnits) {
      if (u.faction === 'player' && !u.hasActed) {
        newUnits.set(id, { ...u, hasActed: true });
      }
    }
    set({ units: newUnits });
    get().endPlayerTurn();
    return;
  }

  const action = autoBattleActions[autoBattleIndex];
  const unit = units.get(action.unitId);
  if (!unit || unit.hasActed) {
    set({ autoBattleIndex: autoBattleIndex + 1 });
    return;
  }

  const newUnits = new Map(units);
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));

  let destination = action.moveTo;
  const destOccupant = newTiles[destination.y]?.[destination.x]?.occupantId;
  if (destOccupant && destOccupant !== unit.id) {
    destination = unit.position;
  }

  if (posKey(unit.position) !== posKey(destination)) {
    newTiles[unit.position.y][unit.position.x].occupantId = null;
    newTiles[destination.y][destination.x].occupantId = unit.id;
  }

  const moveFacing = deriveFacing(unit.position, destination);
  const movedUnit = { ...unit, position: { ...destination }, facing: moveFacing };
  newUnits.set(unit.id, movedUnit);

  if (action.attackTargetId) {
    const target = newUnits.get(action.attackTargetId);
    if (!target) {
      newUnits.set(unit.id, { ...movedUnit, hasActed: true });
      set({ units: newUnits, gameMap: { ...gameMap, tiles: newTiles }, autoBattleIndex: autoBattleIndex + 1 });
      return;
    }

    const attackerTerrain = newTiles[destination.y][destination.x].terrain;
    const defenderTerrain = newTiles[target.position.y][target.position.x].terrain;
    const distance = getManhattanDistance(destination, target.position);

    if (distance < unit.equippedWeapon.minRange || distance > unit.equippedWeapon.maxRange) {
      newUnits.set(unit.id, { ...movedUnit, hasActed: true });
      set({ units: newUnits, gameMap: { ...gameMap, tiles: newTiles }, autoBattleIndex: autoBattleIndex + 1 });
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
    set({ units: newUnits, gameMap: { ...gameMap, tiles: newTiles }, autoBattleIndex: autoBattleIndex + 1 });
  }
}

export function finishAutoCombat(get: Get, set: Set) {
  const { selectedUnitId, attackTargetId, combatResult, units, gameMap, rng, autoBattleIndex } = get();
  if (!selectedUnitId || !attackTargetId || !combatResult) return;

  const attacker = units.get(selectedUnitId)!;
  const defender = units.get(attackTargetId)!;
  const { chapterData } = get();

  const resolution = applyCombatResult(units, gameMap, selectedUnitId, attackTargetId, combatResult, chapterData);

  if (resolution.lordDied) {
    set({
      ...IDLE_RESET,
      units: resolution.newUnits,
      gameMap: { ...gameMap, tiles: resolution.newTiles },
      currentPhase: 'game_over',
      deathQuote: resolution.deathQuote,
      isAutoBattle: false,
      autoBattleActions: [],
      autoBattleIndex: -1,
    });
    return;
  }

  // EXP + level-up for player attacker
  let gains: StatGains | null = null;
  let levelUpUnit: string | null = null;
  let expBarData: GameState['expBarData'] = null;

  if (!combatResult.attackerDied && attacker.faction === 'player') {
    const expGain = calculateExpGain(attacker, defender, combatResult.defenderDied);
    const expBefore = attacker.exp;
    const levelCheck = checkLevelUp(attacker.exp, expGain);
    const updated = resolution.newUnits.get(selectedUnitId)!;

    if (levelCheck.leveled) {
      const cls = CLASSES[attacker.classId];
      if (cls) {
        gains = rollLevelUp(cls.growthRates, rng);
        const newStats = applyStatGains(updated.stats, gains);
        resolution.newUnits.set(selectedUnitId, {
          ...updated,
          exp: levelCheck.newExp,
          level: updated.level + 1,
          stats: newStats,
          currentHp: updated.currentHp + gains.hp,
          hasActed: true,
        });
        levelUpUnit = selectedUnitId;
      }
    } else {
      resolution.newUnits.set(selectedUnitId, { ...updated, exp: levelCheck.newExp, hasActed: true });
    }

    expBarData = {
      unitId: selectedUnitId,
      unitName: attacker.name,
      expBefore,
      expGain,
      leveled: levelCheck.leveled,
    };
  } else {
    // Mark attacker as acted even if died
    const u = resolution.newUnits.get(selectedUnitId);
    if (u) resolution.newUnits.set(selectedUnitId, { ...u, hasActed: true });
  }

  const nextPhase = resolution.victoryResult ? 'game_over' as const : 'player_phase' as const;

  set({
    ...IDLE_RESET,
    units: resolution.newUnits,
    gameMap: { ...gameMap, tiles: resolution.newTiles },
    currentPhase: nextPhase,
    levelUpGains: gains,
    levelUpUnitId: levelUpUnit,
    deathQuote: resolution.deathQuote,
    floatingNumbers: resolution.floatingNumbers,
    expBarData,
    autoBattleIndex: nextPhase === 'game_over' ? -1 : autoBattleIndex + 1,
    isAutoBattle: nextPhase !== 'game_over',
    autoBattleActions: nextPhase === 'game_over' ? [] : get().autoBattleActions,
  });

  refreshDangerZone(get, set);
}
