import { describe, it, expect } from 'vitest';
import {
  getEnemyStatMultiplier,
  scaleEnemyStats,
  getReinforcementTurnOffset,
  getBossArcBonus,
  isPermadeath,
  isHardLocked,
} from '../../src/core/difficulty';
import type { UnitStats, EndingType } from '../../src/core/types';

const BASE_STATS: UnitStats = {
  hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 5, skl: 5, lck: 5, mov: 5, cha: 0, wil: 0,
};

describe('Difficulty system', () => {
  describe('getEnemyStatMultiplier', () => {
    it('returns 1.0 for classic', () => {
      expect(getEnemyStatMultiplier('classic')).toBe(1.0);
    });
    it('returns 1.0 for casual', () => {
      expect(getEnemyStatMultiplier('casual')).toBe(1.0);
    });
    it('returns 1.1 for hard', () => {
      expect(getEnemyStatMultiplier('hard')).toBe(1.1);
    });
  });

  describe('scaleEnemyStats', () => {
    it('returns unchanged stats for classic', () => {
      expect(scaleEnemyStats(BASE_STATS, 'classic')).toBe(BASE_STATS);
    });
    it('returns unchanged stats for casual', () => {
      expect(scaleEnemyStats(BASE_STATS, 'casual')).toBe(BASE_STATS);
    });
    it('scales combat stats by 1.1 for hard, MOV unchanged', () => {
      const scaled = scaleEnemyStats(BASE_STATS, 'hard');
      expect(scaled.hp).toBe(22);   // floor(20 * 1.1)
      expect(scaled.str).toBe(8);   // floor(8 * 1.1)
      expect(scaled.def).toBe(5);   // floor(5 * 1.1)
      expect(scaled.spd).toBe(5);   // floor(5 * 1.1)
      expect(scaled.mov).toBe(5);   // unchanged
    });
  });

  describe('getReinforcementTurnOffset', () => {
    it('returns 0 for classic', () => {
      expect(getReinforcementTurnOffset('classic')).toBe(0);
    });
    it('returns 0 for casual', () => {
      expect(getReinforcementTurnOffset('casual')).toBe(0);
    });
    it('returns -1 for hard', () => {
      expect(getReinforcementTurnOffset('hard')).toBe(-1);
    });
  });

  describe('getBossArcBonus', () => {
    it('returns 0 for classic', () => {
      expect(getBossArcBonus('classic', 3)).toBe(0);
    });
    it('returns +2 per arc for hard', () => {
      expect(getBossArcBonus('hard', 1)).toBe(2);
      expect(getBossArcBonus('hard', 3)).toBe(6);
      expect(getBossArcBonus('hard', 5)).toBe(10);
    });
  });

  describe('isPermadeath', () => {
    it('classic has permadeath', () => {
      expect(isPermadeath('classic')).toBe(true);
    });
    it('casual does not have permadeath', () => {
      expect(isPermadeath('casual')).toBe(false);
    });
    it('hard has permadeath', () => {
      expect(isPermadeath('hard')).toBe(true);
    });
  });

  describe('isHardLocked', () => {
    it('locked when no endings seen', () => {
      expect(isHardLocked([])).toBe(true);
    });
    it('unlocked after any ending', () => {
      const endings: EndingType[] = ['bittersweet'];
      expect(isHardLocked(endings)).toBe(false);
    });
    it('unlocked with multiple endings', () => {
      const endings: EndingType[] = ['true', 'perfect'];
      expect(isHardLocked(endings)).toBe(false);
    });
  });
});
