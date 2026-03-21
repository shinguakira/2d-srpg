import type { Unit, SupportRank, SupportPair, Position } from './types';
import { getManhattanDistance } from './pathfinding';

// ===== Thresholds =====

export const SUPPORT_THRESHOLDS: Record<SupportRank, number> = {
  C: 20,
  B: 50,
  A: 100,
  S: 150,
};

const RANK_ORDER: SupportRank[] = ['C', 'B', 'A', 'S'];

/** Get the highest achieved support rank for a given point total. */
export function getSupportRank(points: number): SupportRank | null {
  for (let i = RANK_ORDER.length - 1; i >= 0; i--) {
    if (points >= SUPPORT_THRESHOLDS[RANK_ORDER[i]]) return RANK_ORDER[i];
  }
  return null;
}

// ===== Combat Bonuses =====

export type SupportCombatBonuses = {
  hit: number;
  avoid: number;
  crit: number;
  dmg: number;
};

const RANK_BONUSES: Record<SupportRank, SupportCombatBonuses> = {
  C: { hit: 5, avoid: 5, crit: 0, dmg: 0 },
  B: { hit: 10, avoid: 10, crit: 5, dmg: 0 },
  A: { hit: 15, avoid: 15, crit: 10, dmg: 1 },
  S: { hit: 20, avoid: 20, crit: 15, dmg: 2 },
};

const EMPTY_BONUSES: SupportCombatBonuses = { hit: 0, avoid: 0, crit: 0, dmg: 0 };

export function getSupportCombatBonuses(rank: SupportRank | null): SupportCombatBonuses {
  if (!rank) return EMPTY_BONUSES;
  return RANK_BONUSES[rank];
}

// ===== Partner Limits =====

const MAX_PARTNERS = 5;
const MAX_S_RANKS = 1;

/**
 * Check if two units can form a support pair.
 * - 5-partner limit per unit (Ren is unlimited)
 * - Only 1 S-rank per unit (Ren is unlimited)
 */
export function canFormSupport(
  unitId: string,
  partnerId: string,
  existingPairs: SupportPair[],
): boolean {
  // Can't support yourself
  if (unitId === partnerId) return false;

  // Already paired
  for (const p of existingPairs) {
    if ((p.unitA === unitId && p.unitB === partnerId) || (p.unitA === partnerId && p.unitB === unitId)) {
      return true; // already paired, can continue building points
    }
  }

  // Check partner limits (Ren is unlimited)
  if (unitId !== 'ren') {
    let count = 0;
    for (const p of existingPairs) {
      if (p.unitA === unitId || p.unitB === unitId) count++;
    }
    if (count >= MAX_PARTNERS) return false;
  }

  if (partnerId !== 'ren') {
    let count = 0;
    for (const p of existingPairs) {
      if (p.unitA === partnerId || p.unitB === partnerId) count++;
    }
    if (count >= MAX_PARTNERS) return false;
  }

  return true;
}

/** Check if a unit has reached S-rank limit. */
export function hasMaxSRank(unitId: string, pairs: SupportPair[]): boolean {
  if (unitId === 'ren') return false;
  let sCount = 0;
  for (const p of pairs) {
    if ((p.unitA === unitId || p.unitB === unitId) && p.rank === 'S') sCount++;
  }
  return sCount >= MAX_S_RANKS;
}

// ===== Active Supports =====

export type ActiveSupport = {
  partnerId: string;
  rank: SupportRank;
  bonuses: SupportCombatBonuses;
};

/** Get all active supports for a unit (partners within 3 tiles with a rank). */
export function getActiveSupports(
  unitId: string,
  unitPos: Position,
  allUnits: Map<string, Unit>,
  pairs: SupportPair[],
): ActiveSupport[] {
  const result: ActiveSupport[] = [];

  for (const pair of pairs) {
    if (!pair.rank) continue;
    let partnerId: string | null = null;
    if (pair.unitA === unitId) partnerId = pair.unitB;
    else if (pair.unitB === unitId) partnerId = pair.unitA;
    if (!partnerId) continue;

    const partner = allUnits.get(partnerId);
    if (!partner) continue;
    if (partner.faction !== 'player') continue;
    if (getManhattanDistance(unitPos, partner.position) > 3) continue;

    result.push({
      partnerId,
      rank: pair.rank,
      bonuses: getSupportCombatBonuses(pair.rank),
    });
  }

  return result;
}

// ===== Point Gains =====

export type SupportEvent = 'adjacent' | 'same_enemy' | 'heal' | 'dance' | 'rescue';

const POINT_GAINS: Record<SupportEvent, number> = {
  adjacent: 2,
  same_enemy: 3,
  heal: 2,
  dance: 3,
  rescue: 4,
};

export function getSupportPointGain(event: SupportEvent): number {
  return POINT_GAINS[event];
}

/**
 * Sum up all active support combat bonuses for a unit.
 * Returns aggregated hit/avoid/crit/dmg bonuses.
 */
export function getTotalSupportBonuses(
  unitId: string,
  unitPos: Position,
  allUnits: Map<string, Unit>,
  pairs: SupportPair[],
): SupportCombatBonuses {
  const actives = getActiveSupports(unitId, unitPos, allUnits, pairs);
  const total: SupportCombatBonuses = { hit: 0, avoid: 0, crit: 0, dmg: 0 };
  for (const a of actives) {
    total.hit += a.bonuses.hit;
    total.avoid += a.bonuses.avoid;
    total.crit += a.bonuses.crit;
    total.dmg += a.bonuses.dmg;
  }
  return total;
}
