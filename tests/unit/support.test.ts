import { describe, it, expect } from 'vitest';
import {
  getSupportRank,
  getSupportCombatBonuses,
  canFormSupport,
  hasMaxSRank,
  getActiveSupports,
  getSupportPointGain,
  getTotalSupportBonuses,
} from '../../src/core/support';
import type { Unit, SupportPair } from '../../src/core/types';

function makeUnit(id: string, x: number, y: number, overrides: Partial<Unit> = {}): Unit {
  return {
    id,
    name: id,
    classId: 'soldier',
    faction: 'player',
    level: 1,
    exp: 0,
    position: { x, y },
    startPosition: { x, y },
    stats: { hp: 30, str: 10, mag: 0, skl: 5, spd: 5, lck: 5, def: 5, res: 5, mov: 5, con: 10 },
    currentHp: 30,
    hasActed: false,
    equippedWeapon: {
      id: 'w',
      name: 'W',
      type: 'sword',
      might: 5,
      hit: 90,
      crit: 0,
      weight: 5,
      minRange: 1,
      maxRange: 1,
    },
    inventory: [],
    items: [],
    metaStats: { crp: 0, sta: 50, loy: 50, awr: 50, sync: 50, loop: 100 },
    ...overrides,
  } as Unit;
}

describe('getSupportRank', () => {
  it('returns null below C threshold', () => {
    expect(getSupportRank(0)).toBeNull();
    expect(getSupportRank(19)).toBeNull();
  });

  it('C at 20 points', () => {
    expect(getSupportRank(20)).toBe('C');
    expect(getSupportRank(49)).toBe('C');
  });

  it('B at 50 points', () => {
    expect(getSupportRank(50)).toBe('B');
  });

  it('A at 100 points', () => {
    expect(getSupportRank(100)).toBe('A');
  });

  it('S at 150 points', () => {
    expect(getSupportRank(150)).toBe('S');
    expect(getSupportRank(200)).toBe('S');
  });
});

describe('getSupportCombatBonuses', () => {
  it('null rank returns zero bonuses', () => {
    const b = getSupportCombatBonuses(null);
    expect(b.hit).toBe(0);
    expect(b.avoid).toBe(0);
    expect(b.crit).toBe(0);
    expect(b.dmg).toBe(0);
  });

  it('C rank: +5/+5/0/0', () => {
    const b = getSupportCombatBonuses('C');
    expect(b).toEqual({ hit: 5, avoid: 5, crit: 0, dmg: 0 });
  });

  it('B rank: +10/+10/+5/0', () => {
    const b = getSupportCombatBonuses('B');
    expect(b).toEqual({ hit: 10, avoid: 10, crit: 5, dmg: 0 });
  });

  it('A rank: +15/+15/+10/+1', () => {
    const b = getSupportCombatBonuses('A');
    expect(b).toEqual({ hit: 15, avoid: 15, crit: 10, dmg: 1 });
  });

  it('S rank: +20/+20/+15/+2', () => {
    const b = getSupportCombatBonuses('S');
    expect(b).toEqual({ hit: 20, avoid: 20, crit: 15, dmg: 2 });
  });
});

describe('canFormSupport', () => {
  it('cannot support yourself', () => {
    expect(canFormSupport('a', 'a', [])).toBe(false);
  });

  it('allows new pair when under limit', () => {
    expect(canFormSupport('a', 'b', [])).toBe(true);
  });

  it('allows existing pair to continue', () => {
    const pairs: SupportPair[] = [{ unitA: 'a', unitB: 'b', points: 10, rank: null }];
    expect(canFormSupport('a', 'b', pairs)).toBe(true);
  });

  it('5-partner limit blocks new pair', () => {
    const pairs: SupportPair[] = [
      { unitA: 'a', unitB: 'p1', points: 10, rank: null },
      { unitA: 'a', unitB: 'p2', points: 10, rank: null },
      { unitA: 'a', unitB: 'p3', points: 10, rank: null },
      { unitA: 'a', unitB: 'p4', points: 10, rank: null },
      { unitA: 'a', unitB: 'p5', points: 10, rank: null },
    ];
    expect(canFormSupport('a', 'p6', pairs)).toBe(false);
  });

  it('Shigeru is unlimited partners', () => {
    const pairs: SupportPair[] = Array.from({ length: 10 }, (_, i) => ({
      unitA: 'shigeru',
      unitB: `p${i}`,
      points: 10,
      rank: null,
    }));
    expect(canFormSupport('shigeru', 'p99', pairs)).toBe(true);
  });
});

describe('hasMaxSRank', () => {
  it('no S ranks: false', () => {
    expect(hasMaxSRank('a', [])).toBe(false);
  });

  it('1 S rank: true', () => {
    const pairs: SupportPair[] = [{ unitA: 'a', unitB: 'b', points: 150, rank: 'S' }];
    expect(hasMaxSRank('a', pairs)).toBe(true);
  });

  it('Shigeru unlimited S ranks', () => {
    const pairs: SupportPair[] = [
      { unitA: 'shigeru', unitB: 'a', points: 150, rank: 'S' },
      { unitA: 'shigeru', unitB: 'b', points: 150, rank: 'S' },
    ];
    expect(hasMaxSRank('shigeru', pairs)).toBe(false);
  });
});

describe('getActiveSupports', () => {
  it('returns supports within 3 tiles', () => {
    const units = new Map([
      ['a', makeUnit('a', 0, 0)],
      ['b', makeUnit('b', 2, 0)],
    ]);
    const pairs: SupportPair[] = [{ unitA: 'a', unitB: 'b', points: 50, rank: 'B' }];

    const actives = getActiveSupports('a', { x: 0, y: 0 }, units, pairs);
    expect(actives).toHaveLength(1);
    expect(actives[0].partnerId).toBe('b');
    expect(actives[0].rank).toBe('B');
  });

  it('partner too far: not active', () => {
    const units = new Map([
      ['a', makeUnit('a', 0, 0)],
      ['b', makeUnit('b', 4, 0)],
    ]);
    const pairs: SupportPair[] = [{ unitA: 'a', unitB: 'b', points: 50, rank: 'B' }];

    const actives = getActiveSupports('a', { x: 0, y: 0 }, units, pairs);
    expect(actives).toHaveLength(0);
  });

  it('no rank: not active', () => {
    const units = new Map([
      ['a', makeUnit('a', 0, 0)],
      ['b', makeUnit('b', 1, 0)],
    ]);
    const pairs: SupportPair[] = [{ unitA: 'a', unitB: 'b', points: 10, rank: null }];

    const actives = getActiveSupports('a', { x: 0, y: 0 }, units, pairs);
    expect(actives).toHaveLength(0);
  });
});

describe('getSupportPointGain', () => {
  it('adjacent: 2', () => expect(getSupportPointGain('adjacent')).toBe(2));
  it('same_enemy: 3', () => expect(getSupportPointGain('same_enemy')).toBe(3));
  it('heal: 2', () => expect(getSupportPointGain('heal')).toBe(2));
  it('dance: 3', () => expect(getSupportPointGain('dance')).toBe(3));
  it('rescue: 4', () => expect(getSupportPointGain('rescue')).toBe(4));
});

describe('getTotalSupportBonuses', () => {
  it('sums bonuses from multiple active supports', () => {
    const units = new Map([
      ['a', makeUnit('a', 0, 0)],
      ['b', makeUnit('b', 1, 0)],
      ['c', makeUnit('c', 0, 1)],
    ]);
    const pairs: SupportPair[] = [
      { unitA: 'a', unitB: 'b', points: 50, rank: 'B' },
      { unitA: 'a', unitB: 'c', points: 20, rank: 'C' },
    ];

    const total = getTotalSupportBonuses('a', { x: 0, y: 0 }, units, pairs);
    // B: 10/10/5/0 + C: 5/5/0/0 = 15/15/5/0
    expect(total.hit).toBe(15);
    expect(total.avoid).toBe(15);
    expect(total.crit).toBe(5);
    expect(total.dmg).toBe(0);
  });
});
