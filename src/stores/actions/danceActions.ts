import { posKey } from '../../core/types';
import { getManhattanDistance } from '../../core/pathfinding';
import { rollLevelUp, applyStatGains } from '../../core/experience';
import { hasSkill } from '../../core/skills';
import { CLASSES } from '../../data/classes';
import { ALL_CLASSES } from '../../data/promotedClasses';
import { IDLE_RESET } from '../helpers/constants';
import { allPlayersDone } from '../helpers/mapHelpers';
import { deriveFacing } from '../helpers/facingHelpers';
import type { StatGains } from '../../core/experience';
import type { GameState, GameActions } from '../gameStoreTypes';
import { addSupportPoints } from './supportActions';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function startDanceTargeting(get: Get, set: Set) {
  const { selectedUnitId, pendingPosition, units } = get();
  if (!selectedUnitId || !pendingPosition) return;

  const unit = units.get(selectedUnitId);
  if (!unit || !hasSkill(unit, 'dance')) return;

  const danceable = new Set<string>();
  for (const ally of units.values()) {
    if (ally.id === selectedUnitId) continue;
    if (ally.faction !== 'player') continue;
    if (!ally.hasActed) continue; // can only dance allies who already acted
    const dist = getManhattanDistance(pendingPosition, ally.position);
    if (dist === 1) {
      danceable.add(posKey(ally.position));
    }
  }

  if (danceable.size === 0) return;

  set({
    playerAction: 'dance_target',
    danceableTiles: danceable,
  });
}

export function confirmDance(get: Get, set: Set, targetId: string) {
  const { selectedUnitId, pendingPosition, units, gameMap, rng } = get();
  if (!selectedUnitId || !pendingPosition) return;

  const dancer = units.get(selectedUnitId);
  const target = units.get(targetId);
  if (!dancer || !target) return;

  const newUnits = new Map(units);
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));

  // Move dancer to pending position
  newTiles[dancer.position.y][dancer.position.x].occupantId = null;
  newTiles[pendingPosition.y][pendingPosition.x].occupantId = selectedUnitId;

  // Grant 20 EXP to dancer
  const dancerExp = dancer.exp + 20;
  let gains: StatGains | null = null;
  let levelUpUnit: string | null = null;
  let newLevel = dancer.level;
  let newStats = { ...dancer.stats };
  let finalExp = dancerExp;

  if (dancerExp >= 100) {
    const cls = ALL_CLASSES[dancer.classId] ?? CLASSES[dancer.classId];
    if (cls) {
      gains = rollLevelUp(cls.growthRates, rng);
      newStats = applyStatGains(dancer.stats, gains);
      newLevel = dancer.level + 1;
      finalExp = dancerExp - 100;
      levelUpUnit = selectedUnitId;
    }
  }

  const danceFacing = deriveFacing(pendingPosition, target.position);
  newUnits.set(selectedUnitId, {
    ...dancer,
    position: { ...pendingPosition },
    hasActed: true,
    facing: danceFacing,
    exp: finalExp,
    level: newLevel,
    stats: newStats,
    currentHp: gains ? dancer.currentHp + gains.hp : dancer.currentHp,
  });

  // Refresh target — they can act again
  newUnits.set(targetId, {
    ...target,
    hasActed: false,
  });

  set({
    ...IDLE_RESET,
    units: newUnits,
    gameMap: { ...gameMap, tiles: newTiles },
    levelUpGains: gains,
    levelUpUnitId: levelUpUnit,
    refreshedUnitIds: new Set([targetId]),
  });

  // Support points: +3 for dance
  addSupportPoints(get, set, selectedUnitId, targetId, 'dance');

  // Clear sparkle effect after animation completes
  setTimeout(() => {
    const current = get();
    if (current.refreshedUnitIds.has(targetId)) {
      set({ refreshedUnitIds: new Set() });
    }
  }, 1200);

  // Auto end turn if all player units have acted (and no level-up pending)
  if (!gains && allPlayersDone(newUnits)) {
    get().endPlayerTurn();
  }
}
