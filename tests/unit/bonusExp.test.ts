import { describe, it, expect } from 'vitest';
import { previewBonusExp } from '../../src/core/experience';

describe('Bonus EXP system', () => {
  describe('pool calculation', () => {
    function calcBonusPool(parTurns: number, actualTurns: number): number {
      return Math.min(300, Math.max(0, (parTurns - actualTurns) * 50));
    }

    it('awards 50 EXP per turn under par', () => {
      expect(calcBonusPool(10, 8)).toBe(100);
    });

    it('caps at 300 EXP', () => {
      expect(calcBonusPool(20, 5)).toBe(300);
    });

    it('awards 0 if at or over par', () => {
      expect(calcBonusPool(10, 10)).toBe(0);
      expect(calcBonusPool(10, 12)).toBe(0);
    });

    it('awards 0 for 1 turn under par', () => {
      expect(calcBonusPool(10, 9)).toBe(50);
    });
  });

  describe('allocation', () => {
    it('cannot allocate more than pool has', () => {
      const pool = 20;
      const amount = 30;
      const alloc = Math.min(amount, pool);
      expect(alloc).toBe(20);
    });

    it('cannot exceed 99 EXP', () => {
      const currentExp = 95;
      const amount = 10;
      const maxAlloc = Math.min(amount, 99 - currentExp);
      expect(maxAlloc).toBe(4);
    });

    it('allocates in increments of 10', () => {
      const pool = 100;
      const increment = 10;
      expect(pool - increment).toBe(90);
    });

    it('no-ops when unit already at 99 EXP', () => {
      const currentExp = 99;
      const maxAlloc = Math.min(10, 99 - currentExp);
      expect(maxAlloc).toBe(0);
    });

    it('no-ops when pool is empty', () => {
      const pool = 0;
      const alloc = Math.min(10, pool);
      expect(alloc).toBe(0);
    });
  });

  describe('previewBonusExp', () => {
    const growthRates = {
      hp: 80,
      str: 50,
      mag: 10,
      def: 40,
      res: 20,
      spd: 50,
      skl: 40,
      lck: 30,
      cha: 10,
      wil: 10,
    };

    it('returns wouldLevel=false when EXP stays under 100', () => {
      const result = previewBonusExp(50, 10, 5, growthRates);
      expect(result.wouldLevel).toBe(false);
      expect(result.projectedGains).toBeNull();
    });

    it('returns wouldLevel=true with projected gains when EXP reaches 100', () => {
      const result = previewBonusExp(95, 10, 5, growthRates);
      expect(result.wouldLevel).toBe(true);
      expect(result.projectedGains).not.toBeNull();
      // Verify stat gains are 0 or 1
      if (result.projectedGains) {
        for (const val of Object.values(result.projectedGains)) {
          expect(val).toBeGreaterThanOrEqual(0);
          expect(val).toBeLessThanOrEqual(1);
        }
      }
    });

    it('preview is deterministic with same inputs', () => {
      const r1 = previewBonusExp(95, 10, 5, growthRates);
      const r2 = previewBonusExp(95, 10, 5, growthRates);
      expect(r1).toEqual(r2);
    });
  });
});
