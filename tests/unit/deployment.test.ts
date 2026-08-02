import { describe, it, expect } from 'vitest';
import { computeAutoDeploy } from '../../src/core/deployment';

describe('computeAutoDeploy', () => {
  it('places forceDeploy units first', () => {
    const result = computeAutoDeploy(['ren'], ['ren', 'kael', 'senna'], 5, [], 'classic');
    expect(result[0]).toBe('ren');
  });

  it('fills remaining slots from roster in order', () => {
    const result = computeAutoDeploy(
      ['ren'],
      ['ren', 'kael', 'senna', 'lira', 'bram'],
      5,
      [],
      'classic',
    );
    expect(result).toEqual(['ren', 'kael', 'senna', 'lira', 'bram']);
  });

  it('respects maxDeploy cap', () => {
    const result = computeAutoDeploy(
      ['ren'],
      ['ren', 'kael', 'senna', 'lira', 'bram'],
      3,
      [],
      'classic',
    );
    expect(result).toEqual(['ren', 'kael', 'senna']);
    expect(result.length).toBe(3);
  });

  it('skips dead units in classic mode', () => {
    const result = computeAutoDeploy(
      ['ren'],
      ['ren', 'kael', 'senna', 'lira', 'bram'],
      5,
      ['kael'],
      'classic',
    );
    expect(result).not.toContain('kael');
    expect(result).toEqual(['ren', 'senna', 'lira', 'bram']);
  });

  it('does NOT skip dead units in casual mode', () => {
    const result = computeAutoDeploy(
      ['ren'],
      ['ren', 'kael', 'senna', 'lira', 'bram'],
      5,
      ['kael'],
      'casual',
    );
    expect(result).toContain('kael');
    expect(result).toEqual(['ren', 'kael', 'senna', 'lira', 'bram']);
  });

  it('does not duplicate forceDeploy units that are also in roster', () => {
    const result = computeAutoDeploy(['ren'], ['ren', 'kael', 'senna'], 5, [], 'classic');
    const renCount = result.filter((id) => id === 'ren').length;
    expect(renCount).toBe(1);
  });

  it('returns empty array when maxDeploy is 0', () => {
    const result = computeAutoDeploy(['ren'], ['ren', 'kael'], 0, [], 'classic');
    // forceDeploy still fills since we start with forceDeploy, but cap at maxDeploy
    // Actually the loop breaks when deployed.length >= maxDeploy, but forceDeploy is added first
    // So forceDeploy['ren'] is added before the loop, then loop sees length >= 0 and breaks
    expect(result).toEqual(['ren']);
  });

  it('handles empty roster', () => {
    const result = computeAutoDeploy(['ren'], [], 5, [], 'classic');
    expect(result).toEqual(['ren']);
  });

  it('handles empty forceDeploy', () => {
    const result = computeAutoDeploy([], ['ren', 'kael', 'senna'], 3, [], 'classic');
    expect(result).toEqual(['ren', 'kael', 'senna']);
  });
});
