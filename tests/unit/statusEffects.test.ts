import { describe, it, expect } from 'vitest';
import { sortAndTruncateEffects } from '../../src/components/sprites/statusEffectIcons';
import type { StatusEffect } from '../../src/core/types';

function effect(type: StatusEffect['type'], duration = 3): StatusEffect {
  return { type, duration };
}

describe('sortAndTruncateEffects', () => {
  it('returns empty array for empty input', () => {
    expect(sortAndTruncateEffects([])).toEqual([]);
  });

  it('returns a single poison effect unchanged', () => {
    const effects = [effect('poison')];
    const result = sortAndTruncateEffects(effects);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('poison');
  });

  it('sorts by priority: panic first, then poison, then dazed', () => {
    const effects = [effect('dazed'), effect('panic'), effect('poison')];
    const result = sortAndTruncateEffects(effects);
    expect(result.map((e) => e.type)).toEqual(['panic', 'poison', 'dazed']);
  });

  it('sorts break effects after dazed', () => {
    const effects = [effect('mov_break'), effect('dazed'), effect('atk_break')];
    const result = sortAndTruncateEffects(effects);
    expect(result.map((e) => e.type)).toEqual(['dazed', 'atk_break', 'mov_break']);
  });

  it('returns exactly 3 effects when given 3', () => {
    const effects = [effect('poison'), effect('panic'), effect('dazed')];
    const result = sortAndTruncateEffects(effects);
    expect(result).toHaveLength(3);
  });

  it('truncates to 3 when given 4+ effects, keeping highest priority', () => {
    const effects = [effect('spd_break'), effect('mov_break'), effect('dazed'), effect('panic')];
    const result = sortAndTruncateEffects(effects);
    expect(result).toHaveLength(3);
    expect(result.map((e) => e.type)).toEqual(['panic', 'dazed', 'spd_break']);
    // mov_break (lowest priority) should be dropped
  });

  it('truncates to 3 when given all 7 effects', () => {
    const effects = [
      effect('mov_break'),
      effect('def_break'),
      effect('spd_break'),
      effect('atk_break'),
      effect('dazed'),
      effect('poison'),
      effect('panic'),
    ];
    const result = sortAndTruncateEffects(effects);
    expect(result).toHaveLength(3);
    expect(result.map((e) => e.type)).toEqual(['panic', 'poison', 'dazed']);
  });

  it('does not mutate the original array', () => {
    const effects = [effect('dazed'), effect('panic')];
    const copy = [...effects];
    sortAndTruncateEffects(effects);
    expect(effects).toEqual(copy);
  });
});
