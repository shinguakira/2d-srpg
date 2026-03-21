import { getManhattanDistance } from '../../core/pathfinding';
import { getSupportRank, getSupportPointGain, canFormSupport, hasMaxSRank, type SupportEvent } from '../../core/support';
import type { GameState, GameActions } from '../gameStoreTypes';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

/**
 * Add support points between two units for a given event.
 * Creates the pair if it doesn't exist yet.
 */
export function addSupportPoints(get: Get, set: Set, unitAId: string, unitBId: string, event: SupportEvent) {
  const { supportPairs } = get();

  // Normalize order
  const [idA, idB] = unitAId < unitBId ? [unitAId, unitBId] : [unitBId, unitAId];

  // Check if pair can form
  if (!canFormSupport(idA, idB, supportPairs)) return;

  const points = getSupportPointGain(event);
  const newPairs = [...supportPairs];
  let pairIdx = newPairs.findIndex((p) => p.unitA === idA && p.unitB === idB);

  if (pairIdx === -1) {
    // Create new pair
    newPairs.push({ unitA: idA, unitB: idB, points, rank: null });
    pairIdx = newPairs.length - 1;
  } else {
    newPairs[pairIdx] = { ...newPairs[pairIdx], points: newPairs[pairIdx].points + points };
  }

  // Check rank-up
  const pair = newPairs[pairIdx];
  const newRank = getSupportRank(pair.points);

  if (newRank && newRank !== pair.rank) {
    // Check S-rank limit
    if (newRank === 'S' && (hasMaxSRank(idA, newPairs) || hasMaxSRank(idB, newPairs))) {
      // Can't rank up to S — cap at A
      newPairs[pairIdx] = { ...pair, rank: pair.rank };
    } else {
      newPairs[pairIdx] = { ...pair, rank: newRank };
      // Show rank-up notification
      set({ supportRankUp: { unitA: idA, unitB: idB, rank: newRank } });
    }
  }

  set({ supportPairs: newPairs });
}

/**
 * Process end-of-player-turn support point gains.
 * Adjacent player pairs get +2 each.
 */
export function processTurnEndSupports(get: Get, set: Set) {
  const { units } = get();

  const playerUnits = Array.from(units.values()).filter((u) => u.faction === 'player' && !u.isCarried);

  // Check all player unit pairs for adjacency
  for (let i = 0; i < playerUnits.length; i++) {
    for (let j = i + 1; j < playerUnits.length; j++) {
      const a = playerUnits[i];
      const b = playerUnits[j];
      if (getManhattanDistance(a.position, b.position) === 1) {
        addSupportPoints(get, set, a.id, b.id, 'adjacent');
      }
    }
  }
}

/**
 * Dismiss the support rank-up notification.
 */
export function dismissSupportRankUp(_get: Get, set: Set) {
  set({ supportRankUp: null });
}
