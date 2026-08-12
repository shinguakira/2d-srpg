import type { MetaStats, UnitStats, Unit, TerrainType } from './types';
import type { SeededRandom } from './rng';

// ===== Default Meta-Stats =====

export function defaultMetaStats(unitId: string): MetaStats {
  if (unitId === 'shigeru') {
    return { awr: 0, loop: 347, sync: 80, loy: 50, crp: 0, sta: 0 };
  }
  return { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 };
}

// ===== Terrain → Meta-Stat Effects =====

export function getTerrainCrpGain(terrain: TerrainType): number {
  switch (terrain) {
    case 'glitched':
      return 2;
    case 'data_void':
      return 3;
    case 'corrupted_fort':
      return 1;
    case 'broken_throne':
      return 1;
    default:
      return 0;
  }
}

export function getTerrainSyncChange(terrain: TerrainType): number {
  switch (terrain) {
    case 'glitched':
      return -1;
    case 'data_void':
      return -3;
    case 'fort':
      return 2;
    case 'memory':
      return 5;
    default:
      return 0;
  }
}

export function getTerrainStaRecovery(terrain: TerrainType): number {
  switch (terrain) {
    case 'fort':
      return -3;
    case 'throne':
      return -5;
    default:
      return 0;
  }
}

// ===== Stat Modifiers =====

/** Apply STA fatigue penalties. STA≥30: -1 SPD; STA≥45: -2 SPD, -1 SKL */
export function applyStaPenalties(stats: UnitStats, sta: number): UnitStats {
  if (sta < 30) return stats;
  if (sta >= 45) {
    return { ...stats, spd: Math.max(0, stats.spd - 2), skl: Math.max(0, stats.skl - 1) };
  }
  // sta >= 30
  return { ...stats, spd: Math.max(0, stats.spd - 1) };
}

/** Apply CRP corruption drain. CRP≥60: -1 all combat stats; CRP≥80: -2 all */
export function applyCrpDrain(stats: UnitStats, crp: number): UnitStats {
  if (crp < 60) return stats;
  const penalty = crp >= 80 ? 2 : 1;
  return {
    ...stats,
    str: Math.max(0, stats.str - penalty),
    mag: Math.max(0, stats.mag - penalty),
    def: Math.max(0, stats.def - penalty),
    res: Math.max(0, stats.res - penalty),
    spd: Math.max(0, stats.spd - penalty),
    skl: Math.max(0, stats.skl - penalty),
    lck: Math.max(0, stats.lck - penalty),
  };
}

/** Apply LOY loyalty bonus. LOY≥80 + near Shigeru: +1 all combat stats */
export function applyLoyBonus(stats: UnitStats, loy: number, nearRen: boolean): UnitStats {
  if (loy < 80 || !nearRen) return stats;
  return {
    ...stats,
    str: stats.str + 1,
    mag: stats.mag + 1,
    def: stats.def + 1,
    res: stats.res + 1,
    spd: stats.spd + 1,
    skl: stats.skl + 1,
    lck: stats.lck + 1,
  };
}

/** SYNC hit rate bonus. SYNC>80: +5 hit */
export function applySyncHitBonus(sync: number): number {
  return sync > 80 ? 5 : 0;
}

/** SYNC <30 stat variance: random ±2 to each combat stat */
export function applySyncVariance(stats: UnitStats, sync: number, rng: SeededRandom): UnitStats {
  if (sync >= 30) return stats;
  const vary = (base: number) => Math.max(0, base + (rng.nextInt(0, 4) - 2));
  return {
    ...stats,
    str: vary(stats.str),
    mag: vary(stats.mag),
    def: vary(stats.def),
    res: vary(stats.res),
    spd: vary(stats.spd),
    skl: vary(stats.skl),
  };
}

/** Get effective stats with all meta-stat modifiers applied */
export function getEffectiveStats(unit: Unit, nearRen: boolean, rng?: SeededRandom): UnitStats {
  let stats = { ...unit.stats };
  stats = applyStaPenalties(stats, unit.metaStats.sta);
  stats = applyCrpDrain(stats, unit.metaStats.crp);
  stats = applyLoyBonus(stats, unit.metaStats.loy, nearRen);
  if (rng) {
    stats = applySyncVariance(stats, unit.metaStats.sync, rng);
  }
  return stats;
}

// ===== Threshold Checks =====

/** Unit is exhausted (STA > 45): cannot act, only wait */
export function isExhausted(unit: Unit): boolean {
  return unit.metaStats.sta > 45;
}

/** Get STA warning text and color for display */
export function getStaWarning(sta: number): { text: string; color: string } | null {
  if (sta >= 45) return { text: 'Exhausted: Cannot act!', color: '#ef4444' };
  if (sta >= 30) return { text: 'Fatigued: -1 SPD', color: '#f97316' };
  if (sta >= 25) return { text: 'Fatigue at 30', color: '#eab308' };
  return null;
}

/** Get STA combat penalty description for forecast */
export function getStaCombatNote(sta: number): string | null {
  if (sta >= 45) return `STA ${sta}: SPD -2, SKL -1`;
  if (sta >= 30) return `STA ${sta}: SPD -1`;
  return null;
}

// ===== LOOP / Memory Blade =====

/** Memory Blade might based on LOOP: 1 + floor(LOOP / 30) */
export function getMemoryBladeMight(loop: number): number {
  return 1 + Math.floor(loop / 30);
}

// ===== Light/Dark Magic =====

/** Light magic damage multiplier vs corrupted units */
export function getLightMagicBonus(defenderCrp: number): number {
  return defenderCrp > 0 ? 1.5 : 1.0;
}

// ===== Clamping =====

/** Clamp all meta-stats to valid ranges */
export function clampMetaStats(ms: MetaStats): MetaStats {
  return {
    awr: Math.max(0, Math.min(100, ms.awr)),
    loop: Math.max(0, ms.loop),
    sync: Math.max(0, Math.min(100, ms.sync)),
    loy: Math.max(0, Math.min(100, ms.loy)),
    crp: Math.max(0, Math.min(100, ms.crp)),
    sta: Math.max(0, ms.sta), // no upper clamp — overflow >45 triggers exhaustion
  };
}

// ===== LOY Disobedience =====

/** LOY < 30: 5% chance to disobey */
export function shouldDisobey(loy: number, rng: SeededRandom): boolean {
  if (loy >= 30) return false;
  return rng.nextInt(0, 99) < 5;
}

// ===== Proximity Helpers =====

/** Check if a position is within 3 tiles of Shigeru. */
export function isNearLord(
  position: { x: number; y: number },
  units: Map<string, { id: string; faction: string; position: { x: number; y: number } }>,
): boolean {
  for (const u of units.values()) {
    if (u.id === 'shigeru' && u.faction === 'player') {
      const dist = Math.abs(u.position.x - position.x) + Math.abs(u.position.y - position.y);
      return dist <= 3;
    }
  }
  return false;
}

// ===== AWR Helpers =====

/** AWR ≥ 80: can see enemy unit meta-stats */
export function canSeeEnemyMetaStats(
  units: Iterable<{ faction: string; metaStats: MetaStats }>,
): boolean {
  for (const u of units) {
    if (u.faction === 'player' && u.metaStats.awr >= 80) return true;
  }
  return false;
}

/** AWR ≥ 30: unit may comment on adjacent anomalies */
export function shouldCommentOnAnomaly(awr: number): boolean {
  return awr >= 30;
}

// ===== Recruitment =====

/** Check if recruiter's LOY meets the threshold for conditional recruitment */
export function canRecruit(recruiterLoy: number, threshold: number): boolean {
  return recruiterLoy >= threshold;
}
