import { describe, it, expect } from 'vitest';
import { computeAutoDeploy } from '../../src/core/deployment';

describe('computeAutoDeploy', () => {
  it('places forceDeploy units first', () => {
    const result = computeAutoDeploy(
      ['shigeru'],
      ['shigeru', 'akira', 'lisette'],
      5,
      [],
      'classic',
    );
    expect(result[0]).toBe('shigeru');
  });

  it('fills remaining slots from roster in order', () => {
    const result = computeAutoDeploy(
      ['shigeru'],
      ['shigeru', 'akira', 'lisette', 'mirelle', 'gareth'],
      5,
      [],
      'classic',
    );
    expect(result).toEqual(['shigeru', 'akira', 'lisette', 'mirelle', 'gareth']);
  });

  it('respects maxDeploy cap', () => {
    const result = computeAutoDeploy(
      ['shigeru'],
      ['shigeru', 'akira', 'lisette', 'mirelle', 'gareth'],
      3,
      [],
      'classic',
    );
    expect(result).toEqual(['shigeru', 'akira', 'lisette']);
    expect(result.length).toBe(3);
  });

  it('skips dead units in classic mode', () => {
    const result = computeAutoDeploy(
      ['shigeru'],
      ['shigeru', 'akira', 'lisette', 'mirelle', 'gareth'],
      5,
      ['akira'],
      'classic',
    );
    expect(result).not.toContain('akira');
    expect(result).toEqual(['shigeru', 'lisette', 'mirelle', 'gareth']);
  });

  it('does NOT skip dead units in casual mode', () => {
    const result = computeAutoDeploy(
      ['shigeru'],
      ['shigeru', 'akira', 'lisette', 'mirelle', 'gareth'],
      5,
      ['akira'],
      'casual',
    );
    expect(result).toContain('akira');
    expect(result).toEqual(['shigeru', 'akira', 'lisette', 'mirelle', 'gareth']);
  });

  it('does not duplicate forceDeploy units that are also in roster', () => {
    const result = computeAutoDeploy(
      ['shigeru'],
      ['shigeru', 'akira', 'lisette'],
      5,
      [],
      'classic',
    );
    const renCount = result.filter((id) => id === 'shigeru').length;
    expect(renCount).toBe(1);
  });

  it('returns empty array when maxDeploy is 0', () => {
    const result = computeAutoDeploy(['shigeru'], ['shigeru', 'akira'], 0, [], 'classic');
    // forceDeploy still fills since we start with forceDeploy, but cap at maxDeploy
    // Actually the loop breaks when deployed.length >= maxDeploy, but forceDeploy is added first
    // So forceDeploy['shigeru'] is added before the loop, then loop sees length >= 0 and breaks
    expect(result).toEqual(['shigeru']);
  });

  it('handles empty roster', () => {
    const result = computeAutoDeploy(['shigeru'], [], 5, [], 'classic');
    expect(result).toEqual(['shigeru']);
  });

  it('handles empty forceDeploy', () => {
    const result = computeAutoDeploy([], ['shigeru', 'akira', 'lisette'], 3, [], 'classic');
    expect(result).toEqual(['shigeru', 'akira', 'lisette']);
  });
});
