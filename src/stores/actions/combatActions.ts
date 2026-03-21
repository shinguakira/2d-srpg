import type { GamePhase } from '../../core/types';
import { posKey } from '../../core/types';
import { useCampaignStore } from '../campaignStore';
import { getManhattanDistance } from '../../core/pathfinding';
import { calculateCombatForecast, resolveCombat } from '../../core/combat';
import { calculateExpGain, checkLevelUp, rollLevelUp, applyStatGains } from '../../core/experience';
import type { StatGains } from '../../core/experience';
import { ALL_CLASSES } from '../../data/promotedClasses';
import { getStatCaps, clampStats } from '../../core/promotion';
import type { GameState, GameActions } from '../gameStoreTypes';
import { getTotalSupportBonuses } from '../../core/support';
import { EMPTY_SET, IDLE_RESET } from '../helpers/constants';
import { applyCombatResult } from '../helpers/combatResolution';
import { allPlayersDone } from '../helpers/mapHelpers';
import { refreshDangerZone } from '../helpers/dangerZoneHelpers';
import { deriveFacing } from '../helpers/facingHelpers';
import { checkAndFireEvents } from './eventActions';
import { applyCombatSta, applySkillSta } from './metaStatActions';
import { clampMetaStats, shouldDisobey, isNearRen } from '../../core/metaStats';
import { addSupportPoints } from './supportActions';
import { hasSkill } from '../../core/skills';
import { checkPhaseTransition, applyPhaseTransition } from '../../core/bossPhase';

function hasAdjacentIronwallAlly(pos: { x: number; y: number }, unitFaction: string, unitId: string, units: Map<string, import('../../core/types').Unit>): boolean {
  for (const u of units.values()) {
    if (u.id === unitId || u.faction !== unitFaction || u.currentHp <= 0) continue;
    if (Math.abs(u.position.x - pos.x) + Math.abs(u.position.y - pos.y) === 1) {
      if (hasSkill(u, 'ironwall')) return true;
    }
  }
  return false;
}

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function startAttackTargeting(get: Get, set: Set) {
  const { selectedUnitId, pendingPosition, pendingAttackTiles, units, fogOfWar, visibleTiles } = get();
  if (!selectedUnitId || !pendingPosition) return;

  // Check if there are any enemies in attack range (fog: only visible enemies)
  let hasTarget = false;
  for (const unit of units.values()) {
    if (unit.faction === 'enemy' && pendingAttackTiles.has(posKey(unit.position))) {
      if (fogOfWar && !visibleTiles.has(posKey(unit.position))) continue;
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
  const { selectedUnitId, pendingPosition, units, gameMap, selectedWeaponIndex, weather, supportPairs } = get();
  if (!selectedUnitId || !pendingPosition) return;

  const attacker = units.get(selectedUnitId);
  const defender = units.get(targetId);
  if (!attacker || !defender) return;

  const weapon = attacker.inventory[selectedWeaponIndex] ?? attacker.equippedWeapon;
  const attackerTerrain = gameMap.tiles[pendingPosition.y][pendingPosition.x].terrain;
  const defenderTerrain = gameMap.tiles[defender.position.y][defender.position.x].terrain;
  const distance = getManhattanDistance(pendingPosition, defender.position);

  const atkAtPending = { ...attacker, position: { ...pendingPosition }, equippedWeapon: weapon };
  const attackerNearRen = attacker.id !== 'ren' && isNearRen(pendingPosition, units);
  const defenderNearRen = defender.id !== 'ren' && isNearRen(defender.position, units);
  const attackerSupport = getTotalSupportBonuses(attacker.id, pendingPosition, units, supportPairs);
  const defenderSupport = getTotalSupportBonuses(defender.id, defender.position, units, supportPairs);
  const attackerHasIronwallAlly = hasAdjacentIronwallAlly(pendingPosition, attacker.faction, attacker.id, units);
  const defenderHasIronwallAlly = hasAdjacentIronwallAlly(defender.position, defender.faction, defender.id, units);
  const forecast = calculateCombatForecast(atkAtPending, defender, attackerTerrain, defenderTerrain, distance, { attackerNearRen, defenderNearRen, weather, attackerSupport, defenderSupport, attackerHasIronwallAlly, defenderHasIronwallAlly });

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

  // LOY disobedience: low loyalty units may refuse to attack
  const attacker = units.get(selectedUnitId)!;
  if (attacker.faction === 'player' && attacker.id !== 'ren' && shouldDisobey(attacker.metaStats.loy, rng)) {
    // Move to pending position but refuse to attack
    const newUnits = new Map(units);
    const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));
    newTiles[attacker.position.y][attacker.position.x].occupantId = null;
    newTiles[pendingPosition.y][pendingPosition.x].occupantId = selectedUnitId;
    newUnits.set(selectedUnitId, { ...attacker, position: { ...pendingPosition }, hasActed: true });
    set({
      ...IDLE_RESET,
      units: newUnits,
      gameMap: { ...gameMap, tiles: newTiles },
      floatingNumbers: [...get().floatingNumbers, {
        id: Date.now(),
        x: pendingPosition.x,
        y: pendingPosition.y,
        text: 'Refuses!',
        color: '#ef4444',
      }],
    });
    if (allPlayersDone(get().units)) {
      get().endPlayerTurn();
    }
    return;
  }

  // First, move the unit to pending position and equip selected weapon
  const newUnits = new Map(units);
  const weapon = attacker.inventory[selectedWeaponIndex] ?? attacker.equippedWeapon;
  const defender = units.get(attackTargetId)!;
  const facing = deriveFacing(pendingPosition, defender.position);
  const movedAttacker = { ...attacker, position: { ...pendingPosition }, equippedWeapon: weapon, facing };
  newUnits.set(selectedUnitId, movedAttacker);

  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));
  newTiles[attacker.position.y][attacker.position.x].occupantId = null;
  newTiles[pendingPosition.y][pendingPosition.x].occupantId = selectedUnitId;

  // Resolve combat (pass units so skills activate)
  const { cycleAuthorityUsed, vanishUsed } = get();
  const combinedUsedSkills = new Set([...cycleAuthorityUsed, ...vanishUsed]);
  const result = resolveCombat(combatForecast, rng, movedAttacker, defender, combinedUsedSkills);

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
  const difficulty = useCampaignStore.getState().difficulty;
  const resolution = applyCombatResult(units, gameMap, selectedUnitId, attackTargetId, combatResult, chapterData, difficulty);

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
      const cls = ALL_CLASSES[attacker.classId];
      if (cls) {
        gains = rollLevelUp(cls.growthRates, rng);
        const caps = getStatCaps(attacker.classId);
        const newStats = clampStats(applyStatGains(updated.stats, gains), caps);
        resolution.newUnits.set(selectedUnitId, {
          ...updated,
          exp: levelCheck.newExp,
          level: updated.level + 1,
          stats: newStats,
          currentHp: Math.min(updated.currentHp + gains.hp, newStats.hp),
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

  if (expBarData) {
    // Preserve selectedUnitId and pendingPosition through EXP/level-up flow
    // so Canto can be checked in dismissExpBar/dismissLevelUp
    set({
      units: resolution.newUnits,
      gameMap: { ...gameMap, tiles: resolution.newTiles },
      currentPhase: nextPhase,
      playerAction: 'idle',
      movementRange: EMPTY_SET,
      attackRange: EMPTY_SET,
      movePath: [],
      pendingAttackTiles: EMPTY_SET,
      combatForecast: null,
      combatResult: null,
      combatAnimationStep: -1,
      attackTargetId: null,
      selectedWeaponIndex: 0,
      healableTiles: EMPTY_SET,
      movingUnit: null,
      cantoRange: EMPTY_SET,
      cantoRemainingMov: 0,
      danceableTiles: EMPTY_SET,
      stealableTiles: EMPTY_SET,
      rescuableTiles: EMPTY_SET,
      droppableTiles: EMPTY_SET,
      tradableTiles: EMPTY_SET,
      tradePartnerId: null,
      levelUpGains: gains,
      levelUpUnitId: levelUpUnit,
      deathQuote: resolution.deathQuote,
      floatingNumbers: resolution.floatingNumbers,
      expBarData,
    });
  } else {
    set({
      ...IDLE_RESET,
      units: resolution.newUnits,
      gameMap: { ...gameMap, tiles: resolution.newTiles },
      currentPhase: nextPhase,
      deathQuote: resolution.deathQuote,
      floatingNumbers: resolution.floatingNumbers,
    });
  }

  // STA +3 for the player attacker
  if (!combatResult.attackerDied && attacker.faction === 'player') {
    applyCombatSta(get, set, selectedUnitId);

    // STA +5 per skill activation during combat
    const attackerSkillActivations = combatResult.hits.filter(
      (h) => h.attackerIsInitiator && h.activatedSkill,
    );
    if (attackerSkillActivations.length > 0) {
      applySkillSta(get, set, selectedUnitId);
    }
  }

  // CRP from dark magic hits
  if (!combatResult.defenderDied && attacker.equippedWeapon.crpGain) {
    const hitLanded = combatResult.hits.some((h) => h.attackerIsInitiator && h.damage > 0);
    if (hitLanded) {
      const defUnit = get().units.get(attackTargetId);
      if (defUnit) {
        const newMeta = clampMetaStats({ ...defUnit.metaStats, crp: defUnit.metaStats.crp + attacker.equippedWeapon.crpGain });
        const newUnits = new Map(get().units);
        newUnits.set(attackTargetId, { ...defUnit, metaStats: newMeta });
        set({ units: newUnits });
      }
    }
  }
  // CRP from defender's dark magic counter-attacks
  if (!combatResult.attackerDied && defender.equippedWeapon?.crpGain) {
    const counterHit = combatResult.hits.some((h) => !h.attackerIsInitiator && h.damage > 0);
    if (counterHit) {
      const atkUnit = get().units.get(selectedUnitId);
      if (atkUnit) {
        const newMeta = clampMetaStats({ ...atkUnit.metaStats, crp: atkUnit.metaStats.crp + defender.equippedWeapon.crpGain });
        const newUnits = new Map(get().units);
        newUnits.set(selectedUnitId, { ...atkUnit, metaStats: newMeta });
        set({ units: newUnits });
      }
    }
  }

  // Support points: +3 to adjacent allies who share the enemy target
  if (!combatResult.attackerDied && attacker.faction === 'player') {
    const pos = get().units.get(selectedUnitId)?.position;
    if (pos) {
      for (const ally of get().units.values()) {
        if (ally.id === selectedUnitId) continue;
        if (ally.faction !== 'player') continue;
        if (getManhattanDistance(pos, ally.position) <= 3) {
          addSupportPoints(get, set, selectedUnitId, ally.id, 'same_enemy');
        }
      }
    }
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

  // Boss phase transition check
  if (!combatResult.defenderDied && defender.bossPhases && defender.bossPhases.length > 0) {
    const phase = checkPhaseTransition(defender, combatResult.defenderHpAfter);
    if (phase) {
      const phaseIndex = (defender.currentBossPhase ?? 0) + 1;
      const transitioned = applyPhaseTransition(defender, phase, phaseIndex);
      const bossUnits = new Map(get().units);
      bossUnits.set(attackTargetId, transitioned);
      set({ units: bossUnits });
      if (phase.dialogue) {
        set({ bossPhaseTransition: { bossId: attackTargetId, dialogue: phase.dialogue, phaseIndex } });
      }
    }
  }

  // Galeforce (Divine Wings): grant extra turn if attacker killed defender
  if (combatResult.galeforceTriggered && !combatResult.attackerDied) {
    const galeUnit = get().units.get(selectedUnitId);
    if (galeUnit) {
      const gu = new Map(get().units);
      gu.set(selectedUnitId, { ...galeUnit, hasActed: false });
      set({ units: gu });
    }
  }

  refreshDangerZone(get, set);

  // Fire events after combat (e.g., unit_killed triggers)
  if (nextPhase !== 'game_over') {
    checkAndFireEvents(get, set, {
      lastKilledUnitId: combatResult.defenderDied ? attackTargetId : (combatResult.attackerDied ? selectedUnitId : undefined),
    });
  }

  // Auto-end turn only when no EXP bar (Canto + auto-end deferred to dismissExpBar/dismissLevelUp)
  if (!expBarData && nextPhase === 'player_phase' && !resolution.deathQuote && !get().eventDialogue && allPlayersDone(get().units)) {
    get().endPlayerTurn();
  }
}
