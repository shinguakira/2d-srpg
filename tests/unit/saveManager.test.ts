import { describe, it, expect, beforeEach } from 'vitest';
import { writeSave, readSave, deleteSave, hasSave, hasAnySave, getSlotSummary } from '../../src/core/saveManager';
import type { SaveData } from '../../src/core/types';

const SAMPLE_SAVE: SaveData = {
  version: 4,
  timestamp: 1700000000000,
  currentChapterId: 'ch2',
  completedChapters: ['ch1'],
  unitProgress: {
    ren: { level: 3, exp: 45, stats: { hp: 22, str: 7, mag: 1, def: 6, res: 2, spd: 8, skl: 6, lck: 8, mov: 5, cha: 0, wil: 0 }, weaponIds: [], itemIds: [] },
  },
  roster: ['ren', 'kael'],
  deadUnitIds: [],
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

  it('migrates v1 save to current version on read', () => {
    const v1Save = {
      version: 1,
      timestamp: 1700000000000,
      currentChapterId: 'ch2',
      completedChapters: ['ch1'],
      unitProgress: {
        ren: { level: 3, exp: 45, stats: { hp: 22, str: 7, mag: 1, def: 6, res: 2, spd: 8, skl: 6, lck: 8, mov: 5, cha: 0, wil: 0 } },
      },
    };
    localStorage.setItem('srpg_save_slot_0', JSON.stringify(v1Save));
    const loaded = readSave(0);
    expect(loaded).not.toBeNull();
    expect(loaded!.version).toBe(4);
    expect(loaded!.roster).toEqual(['ren']);
    expect(loaded!.deadUnitIds).toEqual([]);
    expect(loaded!.currentChapterId).toBe('ch2');
  });

  it('migrates v2 save to v4 on read', () => {
    const v2Save = {
      version: 2,
      timestamp: 1700000000000,
      currentChapterId: 'ch2',
      completedChapters: ['ch1'],
      unitProgress: {
        ren: { level: 3, exp: 45, stats: { hp: 22, str: 7, mag: 1, def: 6, res: 2, spd: 8, skl: 6, lck: 8, mov: 5, cha: 0, wil: 0 } },
      },
      roster: ['ren'],
      deadUnitIds: [],
    };
    localStorage.setItem('srpg_save_slot_0', JSON.stringify(v2Save));
    const loaded = readSave(0);
    expect(loaded).not.toBeNull();
    expect(loaded!.version).toBe(4);
    // v2→v3 adds skillIds/learnedSkillIds, v3→v4 adds metaStats/crpLowChapters
    const renProgress = loaded!.unitProgress.ren;
    expect(renProgress.skillIds).toEqual([]);
    expect(renProgress.learnedSkillIds).toEqual([]);
    expect(renProgress.crpLowChapters).toBe(0);
  });

  it('migrates v3 save to v4 on read', () => {
    const v3Save = {
      version: 3,
      timestamp: 1700000000000,
      currentChapterId: 'ch2',
      completedChapters: ['ch1'],
      unitProgress: {
        ren: {
          level: 3, exp: 45,
          stats: { hp: 22, str: 7, mag: 1, def: 6, res: 2, spd: 8, skl: 6, lck: 8, mov: 5, cha: 0, wil: 0 },
          weaponIds: [], itemIds: [], skillIds: [], learnedSkillIds: [],
        },
      },
      roster: ['ren'],
      deadUnitIds: [],
    };
    localStorage.setItem('srpg_save_slot_0', JSON.stringify(v3Save));
    const loaded = readSave(0);
    expect(loaded).not.toBeNull();
    expect(loaded!.version).toBe(4);
    const renProgress = loaded!.unitProgress.ren;
    expect(renProgress.crpLowChapters).toBe(0);
    expect(renProgress.metaStats).toBeUndefined();
  });
});
