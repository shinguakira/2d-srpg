import { describe, it, expect } from 'vitest';
import { validateTeamAssignment } from '../../src/stores/actions/splitPartyActions';

describe('Split Party System', () => {
  describe('no-healer team edge case', () => {
    it('validates a team with no healer (both teams functional)', () => {
      // Team A has no healer, only melee units — should still be valid
      const result = validateTeamAssignment(['ren', 'kael', 'voss'], ['senna', 'lira']);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('validates two teams neither having healers', () => {
      const result = validateTeamAssignment(['ren', 'kael'], ['voss', 'nira']);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateTeamAssignment', () => {
    it('accepts valid assignment with Ren on team A', () => {
      const result = validateTeamAssignment(['ren', 'kael', 'nira'], ['voss', 'coda', 'echo']);
      expect(result.valid).toBe(true);
    });

    it('accepts valid assignment with Ren on team B', () => {
      const result = validateTeamAssignment(['kael', 'nira', 'voss'], ['ren', 'coda', 'echo']);
      expect(result.valid).toBe(true);
    });

    it('rejects when team A has fewer than 2 units', () => {
      const result = validateTeamAssignment(['ren'], ['kael', 'nira', 'voss']);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Team A');
    });

    it('rejects when team B has fewer than 2 units', () => {
      const result = validateTeamAssignment(['ren', 'kael', 'nira'], ['voss']);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Team B');
    });

    it('rejects when Ren is on neither team', () => {
      const result = validateTeamAssignment(['kael', 'nira'], ['voss', 'coda']);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Ren');
    });

    it('rejects when Ren is on both teams', () => {
      const result = validateTeamAssignment(['ren', 'kael'], ['ren', 'voss']);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('both');
    });
  });
});
