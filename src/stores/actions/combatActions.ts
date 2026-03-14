import type { GamePhase } from '../../core/types';
import { posKey } from '../../core/types';
import { getManhattanDistance } from '../../core/pathfinding';
import { calculateCombatForecast, resolveCombat } from '../../core/combat';
import { calculateExpGain, checkLevelUp, rollLevelUp, applyStatGains } from '../../core/experience';
import type { StatGains } from '../../core/experience';
import { CLASSES } from '../../data/classes';
import type { GameState, GameActions } from '../gameStoreTypes';
import { EMPTY_SET, IDLE_RESET } from '../helpers/constants';
import { applyCombatResult } from '../helpers/combatResolution';
import { allPlayersDone } from '../helpers/mapHelpers';
import { refreshDangerZone } from '../helpers/dangerZoneHelpers';
import { deriveFacing } from '../helpers/facingHelpers';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function startAttackTargeting(get: Get, set: Set) {
  const { selectedUnitId, pendingPosition, pendingAttackTiles, units } = get();
  if (!selectedUnitId || !pendingPosition) return;

  // Check if there are any enemies in attack range
  let hasTarget = false;
  for (const unit of units.values()) {
    if (unit.faction !== 'player' && pendingAttackTiles.has(posKey(unit.position))) {
      hasTarget = true;
      break;
    }
  }

  if (!hasTarget) return; // No targets available

  set({
    playerAction: 'attack_target',
    attackTargetId: null,
    combatForecast: null,
  });
}

export function selectAttackTarget(get: Get, set: Set, targetId: string) {
  const { selectedUnitId, pendingPosition, units, gameMap, selectedWeaponIndex } = get();
  if (!selectedUnitId || !pendingPosition) return;

  const attacker = units.get(selectedUnitId);
  const defender = units.get(targetId);
  if (!attacker || !defender) return;

  const weapon = attacker.inventory[selectedWeaponIndex] ?? attacker.equippedWeapon;
  const attackerTerrain = gameMap.tiles[pendingPosition.y][pendingPosition.x].terrain;
  const defenderTerrain = gameMap.tiles[defender.position.y][defender.position.x].terrain;
  const distance = getManhattanDistance(pendingPosition, defender.position);

  const atkAtPending = { ...attacker, position: { ...pendingPosition }, equippedWeapon: weapon };
  const forecast = calculateCombatForecast(atkAtPending, defender, attackerTerrain, defenderTerrain, distance);

  set({
    attackTargetId: targetId,
    combatForecast: forecast,
  });

  // Auto-confirm: skip the preview modal, go straight to combat
  get().confirmAttack();
}

export function confirmAttack(get: Get, set: Set) {
  const { selectedUnitId, attackTargetId, pendingPosition, combatForecast, units, gameMap, rng, selectedWeaponIndex } = get();
  if (!selectedUnitId || !attackTargetId || !pendingPosition || !combatForecast) return;

  // First, move the unit to pending position and equip selected weapon
  const newUnits = new Map(units);
  const attacker = units.get(selectedUnitId)!;
  const weapon = attacker.inventory[selectedWeaponIndex] ?? attacker.equippedWeapon;
  const defender = units.get(attackTargetId)!;
  const facing = deriveFacing(pendingPosition, defender.position);
  const movedAttacker = { ...attacker, position: { ...pendingPosition }, equippedWeapon: weapon, facing };
  newUnits.set(selectedUnitId, movedAttacker);

  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));
  newTiles[attacker.position.y][attacker.position.x].occupantId = null;
  newTiles[pendingPosition.y][pendingPosition.x].occupantId = selectedUnitId;

  // Resolve combat
  const result = resolveCombat(combatForecast, rng);

  set({
    units: newUnits,
    gameMap: { ...gameMap, tiles: newTiles },
    currentPhase: 'combat_animation',
    combatResult: result,
    combatAnimationStep: 0,
    movementRange: EMPTY_SET,
    attackRange: EMPTY_SET,
    movePath: [],
  });
}

export function advanceCombatAnimation(get: Get, set: Set) {
  const { combatResult, combatAnimationStep, selectedUnitId, units } = get();
  if (!combatResult) return;

  const nextStep = combatAnimationStep + 1;
  if (nextStep >= combatResult.hits.length) {
    // Animation complete — determine which finish function to call
    const attacker = selectedUnitId ? units.get(selectedUnitId) : null;
    const { isAutoBattle } = get();
    if (isAutoBattle && attacker && attacker.faction === 'player') {
      get().finishAutoCombat();
    } else if (attacker && attacker.faction === 'enemy') {
      get().finishEnemyCombat();
    } else {
      get().finishCombat();
    }
  } else {
    set({ combatAnimationStep: nextStep });
  }
}

export function finishCombat(get: Get, set: Set) {
  const { selectedUnitId, attackTargetId, combatResult, units, gameMap, rng } = get();
  if (!selectedUnitId || !attackTargetId || !combatResult) return;

  const attacker = units.get(selectedUnitId)!;
  const defender = units.get(attackTargetId)!;
  const { chapterData } = get();

  // Apply shared combat resolution (HP, deaths, floats, victory check)
  const resolution = applyCombatResult(units, gameMap, selectedUnitId, attackTargetId, combatResult, chapterData);

  if (resolution.lordDied) {
    set({
      ...IDLE_RESET,
      units: resolution.newUnits,
      gameMap: { ...gameMap, tiles: resolution.newTiles },
      currentPhase: 'game_over',
      deathQuote: resolution.deathQuote,
    });
    return;
  }

  // Calculate EXP for player attacker (only if attacker survived)
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
        });
        levelUpUnit = selectedUnitId;
      }
    } else {
      resolution.newUnits.set(selectedUnitId, { ...updated, exp: levelCheck.newExp });
    }

    // Always show EXP bar after player combat
    expBarData = {
      unitId: selectedUnitId,
      unitName: attacker.name,
      expBefore,
      expGain,
      leveled: levelCheck.leveled,
    };
  }

  const nextPhase: GamePhase = resolution.victoryResult ? 'game_over' : 'player_phase';

  set({
    ...IDLE_RESET,
    units: resolution.newUnits,
    gameMap: { ...gameMap, tiles: resolution.newTiles },
    currentPhase: nextPhase,
    // Defer level-up display until after EXP bar — store gains but don't show popup yet
    levelUpGains: gains,
    levelUpUnitId: levelUpUnit,
    deathQuote: resolution.deathQuote,
    floatingNumbers: resolution.floatingNumbers,
    expBarData,
  });

  refreshDangerZone(get, set);

  // Only auto-end turn if no EXP bar to show
  if (nextPhase === 'player_phase' && !expBarData && !gains && !resolution.deathQuote && allPlayersDone(get().units)) {
    get().endPlayerTurn();
  }
}
