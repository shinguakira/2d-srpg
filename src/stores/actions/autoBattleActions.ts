import { posKey } from '../../core/types';
import { useCampaignStore } from '../campaignStore';
import { getManhattanDistance, getPath, clearDistanceMapCache } from '../../core/pathfinding';
import { calculateCombatForecast, resolveCombat } from '../../core/combat';
import { calculateExpGain, checkLevelUp, rollLevelUp, applyStatGains } from '../../core/experience';
import type { StatGains } from '../../core/experience';
import { CLASSES } from '../../data/classes';
import { decideAction } from '../../core/ai';
import type { AIAction } from '../../core/ai';
import type { GameState, GameActions } from '../gameStoreTypes';
import { IDLE_RESET } from '../helpers/constants';
import { getClassFlags } from '../helpers/mapHelpers';
import { applyCombatResult } from '../helpers/combatResolution';
import { refreshDangerZone } from '../helpers/dangerZoneHelpers';
import { deriveFacing } from '../helpers/facingHelpers';
import { isNearRen } from '../../core/metaStats';

/** Check if walk animation should be skipped (for E2E tests) */
function shouldSkipWalkAnim(): boolean {
  if (typeof window === 'undefined') return true;
  return new URLSearchParams(window.location.search).has('skipWalkAnim');
}

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

/**
 * Start auto-battle: compute AI actions for all un-acted player units,
 * treating them as aggressive AI.
 */
export function startAutoBattle(get: Get, set: Set) {
  clearDistanceMapCache();
  const { currentPhase, units, gameMap } = get();
  if (currentPhase !== 'player_phase') return;

  const actions: AIAction[] = [];
  const simUnits = new Map(units);
  for (const [id, u] of simUnits) {
    simUnits.set(id, { ...u });
  }

  for (const unit of units.values()) {
    if (unit.faction === 'player' && !unit.hasActed) {
      // Temporarily make ALL player units look like 'player_auto' faction,
      // and this unit as 'enemy', so the AI targets enemies only.
      // First, hide all other player units from being targeted by setting them as 'enemy' too
      // Actually: swap ALL factions: player→enemy, enemy→player, so the AI sees enemies as allies
      const swappedUnits = new Map(simUnits);
      for (const [id, u] of swappedUnits) {
        if (u.faction === 'player') {
          swappedUnits.set(id, { ...u, faction: 'enemy' as const });
        } else if (u.faction === 'enemy') {
          swappedUnits.set(id, { ...u, faction: 'player' as const });
        }
      }
      const fakeUnit = swappedUnits.get(unit.id)!;
      const action = decideAction(fakeUnit, gameMap, swappedUnits, getClassFlags(unit));
      // Update sim position for subsequent units
      simUnits.set(unit.id, { ...simUnits.get(unit.id)!, position: { ...action.moveTo } });
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
  const { autoBattleActions, autoBattleIndex, units, gameMap, isAutoBattle } = get();
  if (!isAutoBattle) return;

  if (autoBattleIndex < 0 || autoBattleIndex >= autoBattleActions.length) {
    // All done — end auto-battle, then end turn
    set({ isAutoBattle: false, autoBattleActions: [], autoBattleIndex: -1 });
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

  // Verify target is actually an enemy (safety check)
  if (action.attackTargetId) {
    const target = units.get(action.attackTargetId);
    if (target && target.faction === 'player') {
      // Bug safety: never attack allies — skip this action, just wait
      const newUnits = new Map(units);
      newUnits.set(unit.id, { ...unit, hasActed: true });
      set({ units: newUnits, autoBattleIndex: autoBattleIndex + 1 });
      return;
    }
  }

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
        movingUnit: { unitId: unit.id, path, stepIndex: 0, onComplete: 'auto_action' },
      });
      return; // useGameLoop will wait for movingUnit to be null, then re-trigger
    }
  }

  // Walk done or no walk needed — finalize
  finalizeAutoAction(get, set, action, unit, destination);
}

function finalizeAutoAction(
  get: Get,
  set: Set,
  action: AIAction,
  unit: ReturnType<Get>['units'] extends Map<string, infer U> ? U : never,
  destination: { x: number; y: number },
) {
  const { units, gameMap, rng, autoBattleIndex } = get();

  const newUnits = new Map(units);
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));

  if (posKey(unit.position) !== posKey(destination)) {
    newTiles[unit.position.y][unit.position.x].occupantId = null;
    newTiles[destination.y][destination.x].occupantId = unit.id;
  }

  const moveFacing = deriveFacing(unit.position, destination);
  let movedUnit = { ...unit, position: { ...destination }, facing: moveFacing };
  newUnits.set(unit.id, movedUnit);

  if (action.attackTargetId) {
    // Equip AI-chosen weapon before combat
    if (action.weaponIndex != null) {
      const chosenWeapon = movedUnit.inventory[action.weaponIndex];
      if (chosenWeapon) {
        movedUnit = { ...movedUnit, equippedWeapon: chosenWeapon };
        newUnits.set(unit.id, movedUnit);
      }
    }

    const target = newUnits.get(action.attackTargetId);
    if (!target || target.faction === 'player') {
      newUnits.set(unit.id, { ...movedUnit, hasActed: true });
      set({
        units: newUnits,
        gameMap: { ...gameMap, tiles: newTiles },
        autoBattleIndex: autoBattleIndex + 1,
      });
      return;
    }

    const attackerTerrain = newTiles[destination.y][destination.x].terrain;
    const defenderTerrain = newTiles[target.position.y][target.position.x].terrain;
    const distance = getManhattanDistance(destination, target.position);

    if (
      distance < movedUnit.equippedWeapon.minRange ||
      distance > movedUnit.equippedWeapon.maxRange
    ) {
      newUnits.set(unit.id, { ...movedUnit, hasActed: true });
      set({
        units: newUnits,
        gameMap: { ...gameMap, tiles: newTiles },
        autoBattleIndex: autoBattleIndex + 1,
      });
      return;
    }

    const attackFacing = deriveFacing(destination, target.position);
    const combatUnit = { ...movedUnit, facing: attackFacing };
    newUnits.set(unit.id, combatUnit);

    const attackerNearRen = combatUnit.id !== 'ren' && isNearRen(destination, newUnits);
    const defenderNearRen = target.id !== 'ren' && isNearRen(target.position, newUnits);
    const forecast = calculateCombatForecast(
      combatUnit,
      target,
      attackerTerrain,
      defenderTerrain,
      distance,
      { attackerNearRen, defenderNearRen },
    );
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
      autoBattleIndex: autoBattleIndex + 1,
    });
  }
}

export function finishAutoCombat(get: Get, set: Set) {
  const { selectedUnitId, attackTargetId, combatResult, units, gameMap, rng, autoBattleIndex } =
    get();
  if (!selectedUnitId || !attackTargetId || !combatResult) return;

  const attacker = units.get(selectedUnitId)!;
  const defender = units.get(attackTargetId)!;
  const { chapterData } = get();

  const difficulty = useCampaignStore.getState().difficulty;
  const resolution = applyCombatResult(
    units,
    gameMap,
    selectedUnitId,
    attackTargetId,
    combatResult,
    chapterData,
    difficulty,
  );

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
      resolution.newUnits.set(selectedUnitId, {
        ...updated,
        exp: levelCheck.newExp,
        hasActed: true,
      });
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

  const isVictory = !!resolution.victoryResult;
  const nextPhase =
    isVictory && expBarData
      ? ('player_phase' as const)
      : isVictory
        ? ('game_over' as const)
        : ('player_phase' as const);
  const effectiveGameOver = isVictory && !expBarData;

  set({
    ...IDLE_RESET,
    units: resolution.newUnits,
    gameMap: { ...gameMap, tiles: resolution.newTiles },
    currentPhase: nextPhase,
    pendingVictory: isVictory && !!expBarData,
    levelUpGains: gains,
    levelUpUnitId: levelUpUnit,
    deathQuote: resolution.deathQuote,
    floatingNumbers: resolution.floatingNumbers,
    expBarData,
    autoBattleIndex: effectiveGameOver ? -1 : autoBattleIndex + 1,
    isAutoBattle: !effectiveGameOver,
    autoBattleActions: effectiveGameOver ? [] : get().autoBattleActions,
  });

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

  refreshDangerZone(get, set);
}
