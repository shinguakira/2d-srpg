import type { GameState, GameActions } from '../gameStoreTypes';
import type { StatGains } from '../../core/experience';
import { posKey } from '../../core/types';
import { getManhattanDistance } from '../../core/pathfinding';
import { resolveHealing } from '../../core/combat';
import { rollLevelUp, applyStatGains } from '../../core/experience';
import { CLASSES } from '../../data/classes';
import { IDLE_RESET } from '../helpers/constants';
import { allPlayersDone } from '../helpers/mapHelpers';
import { deriveFacing } from '../helpers/facingHelpers';
import { addSupportPoints } from './supportActions';
import { applyHealSta } from './metaStatActions';
import { clampMetaStats } from '../../core/metaStats';
import { hasSkill } from '../../core/skills';
import { canHealWithStaff } from '../../core/combat';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function startHealTargeting(get: Get, set: Set) {
  const { selectedUnitId, pendingPosition, units } = get();
  if (!selectedUnitId || !pendingPosition) return;

  const unit = units.get(selectedUnitId);
  if (!unit) return;

  // Only proficient staff users can heal
  if (!canHealWithStaff(unit)) return;

  // Find staff in inventory
  const staff = unit.inventory.find((w) => w.type === 'staff');
  if (!staff) return;
  const healable = new Set<string>();
  for (const ally of units.values()) {
    if (ally.id === selectedUnitId) continue;
    if (ally.faction !== 'player') continue;
    if (ally.currentHp >= ally.stats.hp) continue; // full HP
    const dist = getManhattanDistance(pendingPosition, ally.position);
    if (dist >= staff.minRange && dist <= staff.maxRange) {
      healable.add(posKey(ally.position));
    }
  }

  if (healable.size === 0) return;

  set({
    playerAction: 'heal_target',
    healableTiles: healable,
  });
}

export function confirmHeal(get: Get, set: Set, targetId: string) {
  const { selectedUnitId, pendingPosition, units, gameMap, rng } = get();
  if (!selectedUnitId || !pendingPosition) return;

  const healer = units.get(selectedUnitId);
  const target = units.get(targetId);
  if (!healer || !target) return;

  // Equip the staff for healing
  const staff = healer.inventory.find((w) => w.type === 'staff');
  if (!staff) return;
  const healerWithStaff = { ...healer, equippedWeapon: staff };

  const result = resolveHealing(healerWithStaff, target);

  // Apply healing and move healer to pending position
  const newUnits = new Map(units);
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));

  // Move healer
  newTiles[healer.position.y][healer.position.x].occupantId = null;
  newTiles[pendingPosition.y][pendingPosition.x].occupantId = selectedUnitId;

  // Grant EXP for healing (20 flat)
  const healerExp = healer.exp + 20;
  let gains: StatGains | null = null;
  let levelUpUnit: string | null = null;
  let newLevel = healer.level;
  let newStats = { ...healer.stats };
  let finalExp = healerExp;

  if (healerExp >= 100) {
    const cls = CLASSES[healer.classId];
    if (cls) {
      gains = rollLevelUp(cls.growthRates, rng);
      newStats = applyStatGains(healer.stats, gains);
      newLevel = healer.level + 1;
      finalExp = healerExp - 100;
      levelUpUnit = selectedUnitId;
    }
  }

  const healFacing = deriveFacing(pendingPosition, target.position);
  newUnits.set(selectedUnitId, {
    ...healer,
    position: { ...pendingPosition },
    hasActed: true,
    facing: healFacing,
    exp: finalExp,
    level: newLevel,
    stats: newStats,
    currentHp: gains ? healer.currentHp + gains.hp : healer.currentHp,
  });

  newUnits.set(targetId, {
    ...target,
    currentHp: result.targetHpAfter,
  });

  // Light magic / purify staff: reduce target CRP
  if (staff.type === 'light' || staff.type === 'staff') {
    const targetUnit = newUnits.get(targetId)!;
    if (targetUnit.metaStats.crp > 0) {
      const crpReduction = Math.min(
        targetUnit.metaStats.crp,
        Math.max(1, Math.floor(result.targetHpAfter - result.targetHpBefore)),
      );
      const newMeta = clampMetaStats({
        ...targetUnit.metaStats,
        crp: targetUnit.metaStats.crp - crpReduction,
      });
      newUnits.set(targetId, { ...targetUnit, metaStats: newMeta });
    }
  }

  // Transition to heal animation phase
  set({
    ...IDLE_RESET,
    units: newUnits,
    gameMap: { ...gameMap, tiles: newTiles },
    currentPhase: 'heal_animation',
    healAnimationData: {
      healerName: healer.name,
      healerClassId: healer.classId,
      healerUnitId: healer.id,
      targetName: target.name,
      targetClassId: target.classId,
      targetUnitId: target.id,
      targetFaction: target.faction,
      healAmount: result.targetHpAfter - result.targetHpBefore,
      targetHpBefore: result.targetHpBefore,
      targetHpAfter: result.targetHpAfter,
      targetMaxHp: target.stats.hp,
      healerMaxHp: healer.stats.hp,
      healerHp: gains ? healer.currentHp + gains.hp : healer.currentHp,
      staffName: staff.name,
    },
    levelUpGains: gains,
    levelUpUnitId: levelUpUnit,
  });

  // Award support points for healing
  addSupportPoints(get, set, selectedUnitId, targetId, 'heal');
}

export function finishHealAnimation(get: Get, set: Set) {
  const { levelUpGains, selectedUnitId } = get();

  set({
    currentPhase: 'player_phase',
    healAnimationData: null,
    healResult: null,
  });

  // STA +2 for the healer
  if (selectedUnitId) {
    applyHealSta(get, set, selectedUnitId);
  }

  // Auto end turn if all player units have acted (and no level-up pending)
  if (!levelUpGains && allPlayersDone(get().units)) {
    get().endPlayerTurn();
  }
}

/**
 * Balance (Fortify): heal all allies within 5 tiles by MAG amount.
 * Oracle innate skill. Once-per-turn action (consumes unit's action).
 */
export function useBalance(get: Get, set: Set): void {
  const { selectedUnitId, pendingPosition, units, gameMap } = get();
  if (!selectedUnitId || !pendingPosition) return;

  const healer = units.get(selectedUnitId);
  if (!healer || !hasSkill(healer, 'balance')) return;

  const healAmount = healer.stats.mag;
  if (healAmount <= 0) return;

  // Move healer to pending position first
  const newUnits = new Map(units);
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));
  newTiles[healer.position.y][healer.position.x].occupantId = null;
  newTiles[pendingPosition.y][pendingPosition.x].occupantId = selectedUnitId;

  const movedHealer = { ...healer, position: { ...pendingPosition }, hasActed: true };
  newUnits.set(selectedUnitId, movedHealer);

  // Heal all allies within 5 tiles
  const floatingNumbers: GameState['floatingNumbers'] = [];
  let floatId = Date.now();
  for (const [uid, ally] of newUnits) {
    if (uid === selectedUnitId) continue;
    if (ally.faction !== healer.faction || ally.currentHp <= 0) continue;
    if (getManhattanDistance(pendingPosition, ally.position) > 5) continue;
    if (ally.currentHp >= ally.stats.hp) continue;

    const newHp = Math.min(ally.stats.hp, ally.currentHp + healAmount);
    const healed = newHp - ally.currentHp;
    if (healed > 0) {
      newUnits.set(uid, { ...ally, currentHp: newHp });
      floatingNumbers.push({
        id: floatId++,
        x: ally.position.x,
        y: ally.position.y,
        text: `+${healed}`,
        color: '#22c55e',
      });
    }
  }

  set({
    ...IDLE_RESET,
    units: newUnits,
    gameMap: { ...gameMap, tiles: newTiles },
    floatingNumbers,
  });

  if (allPlayersDone(get().units)) {
    get().endPlayerTurn();
  }
}
