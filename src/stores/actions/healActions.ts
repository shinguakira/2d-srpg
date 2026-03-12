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

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function startHealTargeting(get: Get, set: Set) {
  const { selectedUnitId, pendingPosition, units } = get();
  if (!selectedUnitId || !pendingPosition) return;

  const unit = units.get(selectedUnitId);
  if (!unit) return;

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

  set({
    ...IDLE_RESET,
    units: newUnits,
    gameMap: { ...gameMap, tiles: newTiles },
    healResult: {
      healerName: healer.name,
      targetName: target.name,
      hpBefore: result.targetHpBefore,
      hpAfter: result.targetHpAfter,
    },
    levelUpGains: gains,
    levelUpUnitId: levelUpUnit,
  });

  // Auto end turn if all player units have acted
  if (!gains && allPlayersDone(newUnits)) {
    get().endPlayerTurn();
  }
}
