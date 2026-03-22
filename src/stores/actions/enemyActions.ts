import { posKey } from '../../core/types';
import { useCampaignStore } from '../campaignStore';
import { getManhattanDistance, getPath, clearDistanceMapCache } from '../../core/pathfinding';
import { calculateCombatForecast, resolveCombat, resolveHealing } from '../../core/combat';
import { decideAction } from '../../core/ai';
import type { AIAction, AIContext } from '../../core/ai';
import { getWeatherMovPenalty, getWeatherTerrainCostMod } from '../../core/weather';
import type { GameState, GameActions } from '../gameStoreTypes';
import { IDLE_RESET } from '../helpers/constants';
import { applyCombatResult } from '../helpers/combatResolution';
import { checkVictory, getClassFlags } from '../helpers/mapHelpers';
import { deriveFacing } from '../helpers/facingHelpers';
import { checkAndFireEvents } from './eventActions';
import { isNearRen } from '../../core/metaStats';
import { getTotalSupportBonuses } from '../../core/support';
import { checkMergeCondition, switchActiveTeam, mergeMaps } from './splitPartyActions';

/** Check if walk animation should be skipped (for E2E tests) */
function shouldSkipWalkAnim(): boolean {
  if (typeof window === 'undefined') return true;
  return new URLSearchParams(window.location.search).has('skipWalkAnim');
}

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function computeEnemyActions(get: Get, set: Set) {
  clearDistanceMapCache();
  const { units, gameMap, visitedVillages, openedChests, weather } = get();
  const actions: AIAction[] = [];

  const ctx: AIContext = { visitedVillages, openedChests, weather };

  // Use a mutable copy of units so each enemy sees previous enemies' planned positions
  const simUnits = new Map(units);
  for (const [id, u] of simUnits) {
    simUnits.set(id, { ...u });
  }

  for (const unit of units.values()) {
    if (unit.faction === 'enemy' && !unit.hasActed) {
      const flags = getClassFlags(unit);
      const weatherMods = weather !== 'clear' ? {
        movPenalty: getWeatherMovPenalty(weather, flags),
        terrainCostMod: getWeatherTerrainCostMod(weather, flags),
      } : undefined;
      const action = decideAction(simUnits.get(unit.id)!, gameMap, simUnits, flags, { ...ctx, weatherMods });
      actions.push(action);

      // Simulate the move so the next enemy sees the updated position
      const simUnit = simUnits.get(unit.id)!;
      simUnits.set(unit.id, { ...simUnit, position: { ...action.moveTo } });
    }
  }

  set({ enemyActions: actions, enemyActionIndex: 0 });
}

export function executeNextEnemyAction(get: Get, set: Set) {
  const { enemyActions, enemyActionIndex, units, gameMap } = get();

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

  // Check destination isn't already occupied
  let destination = action.moveTo;
  const destOccupant = gameMap.tiles[destination.y]?.[destination.x]?.occupantId;
  if (destOccupant && destOccupant !== unit.id) {
    destination = unit.position;
  }

  const needsMove = posKey(unit.position) !== posKey(destination);

  // Start walk animation if the unit actually moves
  if (needsMove && !shouldSkipWalkAnim()) {
    const path = getPath(unit.position, destination, unit, gameMap, units, getClassFlags(unit));
    if (path.length > 1) {
      set({
        movingUnit: { unitId: unit.id, path, stepIndex: 0, onComplete: 'enemy_action' },
      });
      return; // useGameLoop will wait for movingUnit to be null, then re-trigger
    }
  }

  // Walk done or no walk needed — finalize move + combat
  finalizeEnemyAction(get, set, action, unit, destination);
}

/** Finalize enemy action after walk animation completes (or was skipped) */
function finalizeEnemyAction(
  get: Get, set: Set, action: AIAction, unit: ReturnType<Get>['units'] extends Map<string, infer U> ? U : never, destination: { x: number; y: number }
) {
  const { units, gameMap, rng, enemyActionIndex } = get();

  const newUnits = new Map(units);
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));

  if (posKey(unit.position) !== posKey(destination)) {
    newTiles[unit.position.y][unit.position.x].occupantId = null;
    newTiles[destination.y][destination.x].occupantId = unit.id;
  }
  const moveFacing = deriveFacing(unit.position, destination);
  let movedUnit = { ...unit, position: { ...destination }, facing: moveFacing };

  // Handle ambush reveal
  if (action.reveal && movedUnit.isHidden) {
    movedUnit = { ...movedUnit, isHidden: false };
  }

  newUnits.set(unit.id, movedUnit);

  // Handle healer AI staff healing
  if (action.healTargetId) {
    const healTarget = newUnits.get(action.healTargetId);
    if (healTarget) {
      const result = resolveHealing(movedUnit, healTarget);
      newUnits.set(action.healTargetId, { ...healTarget, currentHp: result.targetHpAfter });
    }
    newUnits.set(unit.id, { ...movedUnit, hasActed: true });
    set({
      units: newUnits,
      gameMap: { ...gameMap, tiles: newTiles },
      enemyActionIndex: enemyActionIndex + 1,
    });
    return;
  }

  // Handle AI item usage (survival AI self-heal)
  if (action.useItemIndex != null && action.useItemIndex >= 0) {
    const item = movedUnit.items[action.useItemIndex];
    if (item && item.effect.kind === 'heal') {
      const healAmount = Math.min(item.effect.amount, movedUnit.stats.hp - movedUnit.currentHp);
      const newItems = [...movedUnit.items];
      newItems[action.useItemIndex] = { ...item, uses: item.uses - 1 };
      if (newItems[action.useItemIndex].uses <= 0) newItems.splice(action.useItemIndex, 1);
      newUnits.set(unit.id, { ...movedUnit, currentHp: movedUnit.currentHp + healAmount, items: newItems, hasActed: true });
    } else {
      newUnits.set(unit.id, { ...movedUnit, hasActed: true });
    }
    set({
      units: newUnits,
      gameMap: { ...gameMap, tiles: newTiles },
      enemyActionIndex: enemyActionIndex + 1,
    });
    return;
  }

  // Handle thief AI interactions (chest/village)
  if (action.interactType) {
    if (action.interactType === 'chest') {
      const chestKey = posKey(destination);
      const newOpenedChests = new Set(get().openedChests);
      newOpenedChests.add(chestKey);
      newUnits.set(unit.id, { ...movedUnit, hasActed: true });
      set({
        units: newUnits,
        gameMap: { ...gameMap, tiles: newTiles },
        enemyActionIndex: enemyActionIndex + 1,
        openedChests: newOpenedChests,
      });
    } else if (action.interactType === 'village') {
      const villageKey = posKey(destination);
      const newVisited = new Set(get().visitedVillages);
      newVisited.add(villageKey);
      newUnits.set(unit.id, { ...movedUnit, hasActed: true });
      set({
        units: newUnits,
        gameMap: { ...gameMap, tiles: newTiles },
        enemyActionIndex: enemyActionIndex + 1,
        visitedVillages: newVisited,
      });
    }
    return;
  }

  if (action.attackTargetId && action.forecast) {
    const target = newUnits.get(action.attackTargetId);
    if (!target) {
      newUnits.set(unit.id, { ...movedUnit, hasActed: true });
      set({
        units: newUnits,
        gameMap: { ...gameMap, tiles: newTiles },
        enemyActionIndex: enemyActionIndex + 1,
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
        enemyActionIndex: enemyActionIndex + 1,
      });
      return;
    }

    const attackFacing = deriveFacing(destination, target.position);
    const combatUnit = { ...movedUnit, facing: attackFacing };
    newUnits.set(unit.id, combatUnit);

    const attackerNearRen = combatUnit.id !== 'ren' && isNearRen(destination, newUnits);
    const defenderNearRen = target.id !== 'ren' && isNearRen(target.position, newUnits);
    const { weather: w, supportPairs } = get();
    const defenderSupport = target.faction === 'player' ? getTotalSupportBonuses(target.id, target.position, newUnits, supportPairs) : undefined;
    const forecast = calculateCombatForecast(combatUnit, target, attackerTerrain, defenderTerrain, distance, { attackerNearRen, defenderNearRen, weather: w, defenderSupport });
    const { cycleAuthorityUsed, vanishUsed } = get();
    const combinedUsedSkills = new Set([...cycleAuthorityUsed, ...vanishUsed]);
    const result = resolveCombat(forecast, rng, combatUnit, target, combinedUsedSkills);

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
      enemyActionIndex: enemyActionIndex + 1,
    });
  }
}

export function finishEnemyCombat(get: Get, set: Set) {
  const { selectedUnitId, attackTargetId, combatResult, units, gameMap, enemyActionIndex } = get();
  if (!selectedUnitId || !attackTargetId || !combatResult) return;

  const { chapterData } = get();
  const difficulty = useCampaignStore.getState().difficulty;
  const resolution = applyCombatResult(units, gameMap, selectedUnitId, attackTargetId, combatResult, chapterData, difficulty);

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

  // Track once-per-chapter skill activations
  if (combatResult.activatedSkillKeys) {
    const newCycleAuthority = new Set(get().cycleAuthorityUsed);
    const newVanish = new Set(get().vanishUsed);
    for (const key of combatResult.activatedSkillKeys) {
      if (key.endsWith(':cycle_authority')) newCycleAuthority.add(key);
      if (key.endsWith(':vanish')) newVanish.add(key);
    }
    set({ cycleAuthorityUsed: newCycleAuthority, vanishUsed: newVanish });
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

  // Fire events after enemy combat (e.g., unit_killed)
  checkAndFireEvents(get, set, {
    lastKilledUnitId: combatResult.defenderDied ? attackTargetId : (combatResult.attackerDied ? selectedUnitId : undefined),
  });
}

export function endEnemyTurn(get: Get, set: Set) {
  // Check win/lose before transitioning
  const { units, chapterData, mapBossState } = get();
  const endResult = checkVictory(units, chapterData, mapBossState);

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

  // Check if there are ally units — if so, start ally phase
  let hasAlly = false;
  for (const u of newUnits.values()) {
    if (u.faction === 'ally') { hasAlly = true; break; }
  }

  if (hasAlly) {
    set({
      units: newUnits,
      currentPhase: 'ally_phase',
      enemyActions: [],
      enemyActionIndex: -1,
    });
    get().computeAllyActions();
  } else {
    set({
      units: newUnits,
      currentPhase: 'player_phase',
      currentTurn: get().currentTurn + 1,
      playerAction: 'idle',
      enemyActions: [],
      enemyActionIndex: -1,
      phaseBanner: 'player_phase',
    });

    // Split party: check merge or switch teams
    handleSplitPartyTurnEnd(get, set);
  }
}

function handleSplitPartyTurnEnd(get: Get, set: Set): void {
  const { splitParty } = get();
  if (!splitParty || splitParty.merged) return;

  if (checkMergeCondition(get)) {
    mergeMaps(get, set);
  } else {
    switchActiveTeam(get, set);
  }
}
