import { describe, it, expect } from 'vitest';
import {
  defaultMetaStats,
  getTerrainCrpGain,
  getTerrainSyncChange,
  getTerrainStaRecovery,
  applyStaPenalties,
  applyCrpDrain,
  applyLoyBonus,
  applySyncHitBonus,
  applySyncVariance,
  getEffectiveStats,
  isExhausted,
  getMemoryBladeMight,
  getLightMagicBonus,
  clampMetaStats,
  shouldDisobey,
  canSeeEnemyMetaStats,
  shouldCommentOnAnomaly,
  canRecruit,
} from '../../src/core/metaStats';
import type { Unit, UnitStats, Weapon, MetaStats } from '../../src/core/types';
import { SeededRandom } from '../../src/core/rng';

const BASE_STATS: UnitStats = {
  hp: 20,
  str: 8,
  mag: 4,
  def: 5,
  res: 3,
  spd: 7,
  skl: 6,
  lck: 4,
  mov: 5,
  cha: 0,
  wil: 0,
};

function makeWeapon(): Weapon {
  return {
    id: 'iron_sword',
    name: 'Iron Sword',
    type: 'sword',
    might: 5,
    hit: 90,
    crit: 0,
    weight: 5,
    minRange: 1,
    maxRange: 1,
  };
}

function makeUnit(meta: Partial<MetaStats> = {}): Unit {
  return {
    id: 'test',
    name: 'Test',
    classId: 'lord',
    faction: 'player',
    position: { x: 0, y: 0 },
    stats: { ...BASE_STATS },
    currentHp: 20,
    level: 1,
    exp: 0,
    equippedWeapon: makeWeapon(),
    inventory: [makeWeapon()],
    items: [],
    hasActed: false,
    facing: 'down',
    sprite: '',
    skills: [],
    learnedSkills: [],
    metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0, ...meta },
  };
}

describe('defaultMetaStats', () => {
  it('gives Shigeru LOOP=347 and higher SYNC', () => {
    const ms = defaultMetaStats('shigeru');
    expect(ms.loop).toBe(347);
    expect(ms.sync).toBe(80);
    expect(ms.loy).toBe(50);
    expect(ms.crp).toBe(0);
    expect(ms.sta).toBe(0);
  });

  it('gives non-Shigeru units LOOP=0 and standard SYNC', () => {
    const ms = defaultMetaStats('akira');
    expect(ms.loop).toBe(0);
    expect(ms.sync).toBe(70);
    expect(ms.loy).toBe(50);
  });
});

describe('getTerrainCrpGain', () => {
  it('glitched = +2', () => expect(getTerrainCrpGain('glitched')).toBe(2));
  it('data_void = +3', () => expect(getTerrainCrpGain('data_void')).toBe(3));
  it('corrupted_fort = +1', () => expect(getTerrainCrpGain('corrupted_fort')).toBe(1));
  it('broken_throne = +1', () => expect(getTerrainCrpGain('broken_throne')).toBe(1));
  it('plain = 0', () => expect(getTerrainCrpGain('plain')).toBe(0));
  it('fort = 0', () => expect(getTerrainCrpGain('fort')).toBe(0));
});

describe('getTerrainSyncChange', () => {
  it('glitched = -1', () => expect(getTerrainSyncChange('glitched')).toBe(-1));
  it('data_void = -3', () => expect(getTerrainSyncChange('data_void')).toBe(-3));
  it('fort = +2', () => expect(getTerrainSyncChange('fort')).toBe(2));
  it('memory = +5', () => expect(getTerrainSyncChange('memory')).toBe(5));
  it('plain = 0', () => expect(getTerrainSyncChange('plain')).toBe(0));
});

describe('getTerrainStaRecovery', () => {
  it('fort = -3', () => expect(getTerrainStaRecovery('fort')).toBe(-3));
  it('throne = -5', () => expect(getTerrainStaRecovery('throne')).toBe(-5));
  it('plain = 0', () => expect(getTerrainStaRecovery('plain')).toBe(0));
});

describe('applyStaPenalties', () => {
  it('no penalty below 30', () => {
    const result = applyStaPenalties(BASE_STATS, 29);
    expect(result.spd).toBe(7);
    expect(result.skl).toBe(6);
  });

  it('STA 30: -1 SPD', () => {
    const result = applyStaPenalties(BASE_STATS, 30);
    expect(result.spd).toBe(6);
    expect(result.skl).toBe(6);
  });

  it('STA 45: -2 SPD, -1 SKL', () => {
    const result = applyStaPenalties(BASE_STATS, 45);
    expect(result.spd).toBe(5);
    expect(result.skl).toBe(5);
  });

  it('does not go below 0', () => {
    const low = { ...BASE_STATS, spd: 1, skl: 0 };
    const result = applyStaPenalties(low, 45);
    expect(result.spd).toBe(0);
    expect(result.skl).toBe(0);
  });
});

describe('applyCrpDrain', () => {
  it('no drain below 60', () => {
    const result = applyCrpDrain(BASE_STATS, 59);
    expect(result.str).toBe(8);
  });

  it('CRP 60: -1 all combat stats', () => {
    const result = applyCrpDrain(BASE_STATS, 60);
    expect(result.str).toBe(7);
    expect(result.mag).toBe(3);
    expect(result.def).toBe(4);
    expect(result.res).toBe(2);
    expect(result.spd).toBe(6);
    expect(result.skl).toBe(5);
    expect(result.lck).toBe(3);
  });

  it('CRP 80: -2 all combat stats', () => {
    const result = applyCrpDrain(BASE_STATS, 80);
    expect(result.str).toBe(6);
    expect(result.def).toBe(3);
  });
});

describe('applyLoyBonus', () => {
  it('no bonus if LOY < 80', () => {
    const result = applyLoyBonus(BASE_STATS, 79, true);
    expect(result.str).toBe(8);
  });

  it('no bonus if not near Shigeru', () => {
    const result = applyLoyBonus(BASE_STATS, 80, false);
    expect(result.str).toBe(8);
  });

  it('LOY 80 + near Shigeru: +1 all combat stats', () => {
    const result = applyLoyBonus(BASE_STATS, 80, true);
    expect(result.str).toBe(9);
    expect(result.mag).toBe(5);
    expect(result.def).toBe(6);
    expect(result.spd).toBe(8);
  });
});

describe('applySyncHitBonus', () => {
  it('SYNC > 80: +5 hit', () => expect(applySyncHitBonus(81)).toBe(5));
  it('SYNC 80: no bonus', () => expect(applySyncHitBonus(80)).toBe(0));
  it('SYNC 50: no bonus', () => expect(applySyncHitBonus(50)).toBe(0));
});

describe('applySyncVariance', () => {
  it('no variance if SYNC >= 30', () => {
    const rng = new SeededRandom(42);
    const result = applySyncVariance(BASE_STATS, 30, rng);
    expect(result).toBe(BASE_STATS); // reference equality — no change
  });

  it('applies variance if SYNC < 30', () => {
    const rng = new SeededRandom(42);
    const result = applySyncVariance(BASE_STATS, 29, rng);
    // Stats should differ by at most ±2
    expect(Math.abs(result.str - BASE_STATS.str)).toBeLessThanOrEqual(2);
    expect(Math.abs(result.spd - BASE_STATS.spd)).toBeLessThanOrEqual(2);
  });
});

describe('getEffectiveStats', () => {
  it('combines STA + CRP + LOY modifiers', () => {
    const unit = makeUnit({ sta: 45, crp: 60, loy: 80 });
    const result = getEffectiveStats(unit, true); // near Shigeru
    // STA 45: -2 SPD, -1 SKL; CRP 60: -1 all; LOY 80 near Shigeru: +1 all
    // SPD: 7 - 2 (sta) - 1 (crp) + 1 (loy) = 5
    expect(result.spd).toBe(5);
    // SKL: 6 - 1 (sta) - 1 (crp) + 1 (loy) = 5
    expect(result.skl).toBe(5);
    // STR: 8 - 1 (crp) + 1 (loy) = 8
    expect(result.str).toBe(8);
  });

  it('no modifiers when all meta-stats are neutral', () => {
    const unit = makeUnit();
    const result = getEffectiveStats(unit, false);
    expect(result.str).toBe(8);
    expect(result.spd).toBe(7);
  });
});

describe('isExhausted', () => {
  it('exhausted when STA > 45', () => {
    expect(isExhausted(makeUnit({ sta: 46 }))).toBe(true);
  });

  it('not exhausted at STA 45', () => {
    expect(isExhausted(makeUnit({ sta: 45 }))).toBe(false);
  });
});

describe('getMemoryBladeMight', () => {
  it('LOOP 347 → might 12', () => expect(getMemoryBladeMight(347)).toBe(12));
  it('LOOP 30 → might 2', () => expect(getMemoryBladeMight(30)).toBe(2));
  it('LOOP 0 → might 1', () => expect(getMemoryBladeMight(0)).toBe(1));
  it('LOOP 59 → might 2', () => expect(getMemoryBladeMight(59)).toBe(2));
  it('LOOP 60 → might 3', () => expect(getMemoryBladeMight(60)).toBe(3));
});

describe('getLightMagicBonus', () => {
  it('CRP > 0: 1.5x', () => expect(getLightMagicBonus(1)).toBe(1.5));
  it('CRP 50: 1.5x', () => expect(getLightMagicBonus(50)).toBe(1.5));
  it('CRP 0: 1.0x', () => expect(getLightMagicBonus(0)).toBe(1.0));
});

describe('clampMetaStats', () => {
  it('clamps to valid ranges', () => {
    const result = clampMetaStats({ awr: 150, loop: -5, sync: -10, loy: 200, crp: 105, sta: -3 });
    expect(result.awr).toBe(100);
    expect(result.loop).toBe(0);
    expect(result.sync).toBe(0);
    expect(result.loy).toBe(100);
    expect(result.crp).toBe(100);
    expect(result.sta).toBe(0);
  });

  it('passes through valid values unchanged', () => {
    const ms = { awr: 50, loop: 347, sync: 70, loy: 50, crp: 0, sta: 30 };
    expect(clampMetaStats(ms)).toEqual(ms);
  });

  it('allows STA above 45 (exhaustion check, not hard cap)', () => {
    const result = clampMetaStats({ awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 50 });
    expect(result.sta).toBe(50);
  });
});

describe('shouldDisobey', () => {
  it('never disobeys at LOY >= 30', () => {
    const rng = new SeededRandom(42);
    for (let i = 0; i < 100; i++) {
      expect(shouldDisobey(30, rng)).toBe(false);
    }
  });

  it('can disobey at LOY < 30 (5% chance)', () => {
    // Run many trials to statistically verify ~5% rate
    const rng = new SeededRandom(12345);
    let disobeyCount = 0;
    for (let i = 0; i < 1000; i++) {
      if (shouldDisobey(0, rng)) disobeyCount++;
    }
    // Should be around 50 ± some tolerance
    expect(disobeyCount).toBeGreaterThan(20);
    expect(disobeyCount).toBeLessThan(100);
  });
});

describe('canSeeEnemyMetaStats', () => {
  it('returns true if any player unit has AWR >= 80', () => {
    const units = [
      { faction: 'player', metaStats: { awr: 80, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 } },
      { faction: 'player', metaStats: { awr: 10, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 } },
    ];
    expect(canSeeEnemyMetaStats(units)).toBe(true);
  });

  it('returns false if no player unit has AWR >= 80', () => {
    const units = [
      { faction: 'player', metaStats: { awr: 79, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 } },
      { faction: 'enemy', metaStats: { awr: 95, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 } },
    ];
    expect(canSeeEnemyMetaStats(units)).toBe(false);
  });

  it('returns false with empty units', () => {
    expect(canSeeEnemyMetaStats([])).toBe(false);
  });
});

describe('shouldCommentOnAnomaly', () => {
  it('returns true when AWR >= 30', () => {
    expect(shouldCommentOnAnomaly(30)).toBe(true);
    expect(shouldCommentOnAnomaly(100)).toBe(true);
  });

  it('returns false when AWR < 30', () => {
    expect(shouldCommentOnAnomaly(29)).toBe(false);
    expect(shouldCommentOnAnomaly(0)).toBe(false);
  });
});

describe('canRecruit', () => {
  it('succeeds when LOY meets threshold', () => {
    expect(canRecruit(60, 60)).toBe(true);
    expect(canRecruit(80, 60)).toBe(true);
  });

  it('fails when LOY below threshold', () => {
    expect(canRecruit(59, 60)).toBe(false);
    expect(canRecruit(0, 50)).toBe(false);
  });
});
