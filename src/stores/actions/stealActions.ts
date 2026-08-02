import { posKey } from '../../core/types';
import { getManhattanDistance } from '../../core/pathfinding';
import { rollLevelUp, applyStatGains } from '../../core/experience';
import { hasSkill } from '../../core/skills';
import { CLASSES } from '../../data/classes';
import { ALL_CLASSES } from '../../data/promotedClasses';
import { deriveFacing } from '../helpers/facingHelpers';
import type { StatGains } from '../../core/experience';
import type { GameState, GameActions } from '../gameStoreTypes';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function startStealTargeting(get: Get, set: Set) {
  const { selectedUnitId, pendingPosition, units } = get();
  if (!selectedUnitId || !pendingPosition) return;

  const unit = units.get(selectedUnitId);
  if (!unit || !hasSkill(unit, 'steal')) return;

  const stealable = new Set<string>();
  for (const enemy of units.values()) {
    if (enemy.faction !== 'enemy') continue;
    if (enemy.items.length === 0) continue;
    if (unit.stats.spd <= enemy.stats.spd) continue; // must be faster
    const dist = getManhattanDistance(pendingPosition, enemy.position);
    if (dist === 1) {
      stealable.add(posKey(enemy.position));
    }
  }

  if (stealable.size === 0) return;

  set({
    playerAction: 'steal_target',
    stealableTiles: stealable,
  });
}

export function confirmSteal(get: Get, set: Set, targetId: string) {
  const { selectedUnitId, pendingPosition, units, gameMap, rng } = get();
  if (!selectedUnitId || !pendingPosition) return;

  const thief = units.get(selectedUnitId);
  const target = units.get(targetId);
  if (!thief || !target || target.items.length === 0) return;

  const newUnits = new Map(units);
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));

  // Move thief to pending position
  newTiles[thief.position.y][thief.position.x].occupantId = null;
  newTiles[pendingPosition.y][pendingPosition.x].occupantId = selectedUnitId;

  // Transfer first item from enemy
  const stolenItem = target.items[0];
  const newEnemyItems = target.items.slice(1);
  const newThiefItems = [...thief.items, stolenItem];

  // Grant 15 EXP to thief
  const thiefExp = thief.exp + 15;
  let gains: StatGains | null = null;
  let levelUpUnit: string | null = null;
  let newLevel = thief.level;
  let newStats = { ...thief.stats };
  let finalExp = thiefExp;

  if (thiefExp >= 100) {
    const cls = ALL_CLASSES[thief.classId] ?? CLASSES[thief.classId];
    if (cls) {
      gains = rollLevelUp(cls.growthRates, rng);
      newStats = applyStatGains(thief.stats, gains);
      newLevel = thief.level + 1;
      finalExp = thiefExp - 100;
      levelUpUnit = selectedUnitId;
    }
  }

  const stealFacing = deriveFacing(pendingPosition, target.position);
  newUnits.set(selectedUnitId, {
    ...thief,
    position: { ...pendingPosition },
    hasActed: false, // steal does not end the unit's turn
    facing: stealFacing,
    items: newThiefItems,
    exp: finalExp,
    level: newLevel,
    stats: newStats,
    currentHp: gains ? thief.currentHp + gains.hp : thief.currentHp,
  });

  newUnits.set(targetId, {
    ...target,
    items: newEnemyItems,
  });

  // Steal returns to action menu — thief can still act (wait, attack, etc.)
  const floatId = Date.now();
  set({
    units: newUnits,
    gameMap: { ...gameMap, tiles: newTiles },
    playerAction: 'action_menu',
    stealableTiles: new Set(),
    levelUpGains: gains,
    levelUpUnitId: levelUpUnit,
    floatingNumbers: [
      ...get().floatingNumbers,
      {
        id: floatId,
        x: target.position.x,
        y: target.position.y,
        text: `Stole ${stolenItem.name}!`,
        color: '#fbbf24',
      },
    ],
  });
}
