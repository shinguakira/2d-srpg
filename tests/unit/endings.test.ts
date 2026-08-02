import { describe, it, expect } from 'vitest';
import { evaluateEnding, getEndingText, getCreditsRoster } from '../../src/core/endings';
import type { EndingFlags } from '../../src/core/endings';

function makeFlags(overrides: Partial<EndingFlags> = {}): EndingFlags {
  return {
    totalDeaths: 0,
    zaelRecruited: true,
    ghaelRecruited: true,
    echoSaved: true,
    systemNegotiated: false,
    finalSaveCrystalUsed: true,
    systemDefeated: true,
    ...overrides,
  };
}

describe('Endings', () => {
  describe('evaluateEnding', () => {
    it('returns perfect when all conditions met', () => {
      const flags = makeFlags();
      expect(evaluateEnding(flags)).toBe('perfect');
    });

    it('returns tragic when 5+ deaths', () => {
      const flags = makeFlags({ totalDeaths: 5 });
      expect(evaluateEnding(flags)).toBe('tragic');
    });

    it('returns tragic even with crystal and everything else', () => {
      const flags = makeFlags({ totalDeaths: 7 });
      expect(evaluateEnding(flags)).toBe('tragic');
    });

    it('returns true when crystal used + system defeated but not all recruited', () => {
      const flags = makeFlags({ zaelRecruited: false });
      expect(evaluateEnding(flags)).toBe('true');
    });

    it('returns true when crystal used + system defeated but deaths > 0', () => {
      const flags = makeFlags({ totalDeaths: 2 });
      expect(evaluateEnding(flags)).toBe('true');
    });

    it('returns true when crystal used but echo not saved', () => {
      const flags = makeFlags({ echoSaved: false });
      expect(evaluateEnding(flags)).toBe('true');
    });

    it('returns bittersweet when system defeated without crystal', () => {
      const flags = makeFlags({ finalSaveCrystalUsed: false });
      expect(evaluateEnding(flags)).toBe('bittersweet');
    });

    it('returns bittersweet as default when system defeated', () => {
      const flags = makeFlags({
        finalSaveCrystalUsed: false,
        zaelRecruited: false,
        ghaelRecruited: false,
        echoSaved: false,
      });
      expect(evaluateEnding(flags)).toBe('bittersweet');
    });
  });

  describe('getEndingText', () => {
    it('returns text for each ending type', () => {
      for (const type of ['perfect', 'true', 'bittersweet', 'tragic'] as const) {
        const text = getEndingText(type);
        expect(text.title).toBeTruthy();
        expect(text.description).toBeTruthy();
      }
    });

    it('perfect ending has appropriate title', () => {
      const text = getEndingText('perfect');
      expect(text.title).toContain('Perfect');
    });
  });

  describe('getCreditsRoster', () => {
    it('marks dead units correctly', () => {
      const roster = getCreditsRoster(['ren', 'kael', 'nira', 'voss'], ['kael']);
      expect(roster).toHaveLength(4);
      expect(roster[0]).toEqual({ id: 'ren', alive: true });
      expect(roster[1]).toEqual({ id: 'kael', alive: false });
      expect(roster[2]).toEqual({ id: 'nira', alive: true });
    });

    it('handles empty dead list', () => {
      const roster = getCreditsRoster(['ren', 'nira'], []);
      expect(roster.every((r) => r.alive)).toBe(true);
    });
  });
});
