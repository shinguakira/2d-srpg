import { describe, it, expect, beforeEach } from 'vitest';
import { writeSave, readSave, deleteSave, hasSave, hasAnySave, getSlotSummary } from '../../src/core/saveManager';
import type { SaveData } from '../../src/core/types';

const SAMPLE_SAVE: SaveData = {
  version: 1,
  timestamp: 1700000000000,
  currentChapterId: 'ch2',
  completedChapters: ['ch1'],
  unitProgress: {
    eirik: { level: 3, exp: 45, stats: { hp: 22, str: 7, mag: 1, def: 6, res: 2, spd: 8, skl: 6, lck: 8, mov: 5 } },
  },
};

describe('saveManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('write and read round-trip', () => {
    writeSave(0, SAMPLE_SAVE);
    const loaded = readSave(0);
    expect(loaded).toEqual(SAMPLE_SAVE);
  });

  it('empty slot returns null', () => {
    expect(readSave(0)).toBeNull();
  });

  it('corrupted JSON returns null', () => {
    localStorage.setItem('srpg_save_slot_0', '{broken json!!!');
    expect(readSave(0)).toBeNull();
  });

  it('wrong version returns null', () => {
    const bad = { ...SAMPLE_SAVE, version: 99 };
    localStorage.setItem('srpg_save_slot_0', JSON.stringify(bad));
    expect(readSave(0)).toBeNull();
  });

  it('delete removes save', () => {
    writeSave(1, SAMPLE_SAVE);
    expect(hasSave(1)).toBe(true);
    deleteSave(1);
    expect(hasSave(1)).toBe(false);
  });

  it('hasSave returns false for empty slot', () => {
    expect(hasSave(0)).toBe(false);
  });

  it('hasAnySave detects saves across slots', () => {
    expect(hasAnySave()).toBe(false);
    writeSave(2, SAMPLE_SAVE);
    expect(hasAnySave()).toBe(true);
  });

  it('getSlotSummary returns summary for filled slot', () => {
    writeSave(0, SAMPLE_SAVE);
    const summary = getSlotSummary(0);
    expect(summary).toEqual({ timestamp: 1700000000000, chapterId: 'ch2' });
  });

  it('getSlotSummary returns null for empty slot', () => {
    expect(getSlotSummary(0)).toBeNull();
  });
});
