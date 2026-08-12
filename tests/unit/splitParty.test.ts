import { describe, it, expect } from 'vitest';
import { validateTeamAssignment } from '../../src/stores/actions/splitPartyActions';

describe('Split Party System', () => {
  describe('no-healer team edge case', () => {
    it('validates a team with no healer (both teams functional)', () => {
      // Team A has no healer, only melee units — should still be valid
      const result = validateTeamAssignment(['shigeru', 'akira', 'genzo'], ['kanna', 'hina']);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('validates two teams neither having healers', () => {
      const result = validateTeamAssignment(['shigeru', 'akira'], ['genzo', 'sayo']);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateTeamAssignment', () => {
    it('accepts valid assignment with Shigeru on team A', () => {
      const result = validateTeamAssignment(['shigeru', 'akira', 'sayo'], ['genzo', 'hachi', 'echo']);
      expect(result.valid).toBe(true);
    });

    it('accepts valid assignment with Shigeru on team B', () => {
      const result = validateTeamAssignment(['akira', 'sayo', 'genzo'], ['shigeru', 'hachi', 'echo']);
      expect(result.valid).toBe(true);
    });

    it('rejects when team A has fewer than 2 units', () => {
      const result = validateTeamAssignment(['shigeru'], ['akira', 'sayo', 'genzo']);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Team A');
    });

    it('rejects when team B has fewer than 2 units', () => {
      const result = validateTeamAssignment(['shigeru', 'akira', 'sayo'], ['genzo']);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Team B');
    });

    it('rejects when Shigeru is on neither team', () => {
      const result = validateTeamAssignment(['akira', 'sayo'], ['genzo', 'hachi']);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Shigeru');
    });

    it('rejects when Shigeru is on both teams', () => {
      const result = validateTeamAssignment(['shigeru', 'akira'], ['shigeru', 'genzo']);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('both');
    });
  });
});
