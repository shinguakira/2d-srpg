import { describe, it, expect, beforeEach } from 'vitest';
import {
  writeSave,
  readSave,
  deleteSave,
  hasSave,
  hasAnySave,
  getSlotSummary,
} from '../../src/core/saveManager';
import type { SaveData } from '../../src/core/types';

const SAMPLE_SAVE: SaveData = {
  version: 7,
  timestamp: 1700000000000,
  currentChapterId: 'ch2',
  completedChapters: ['ch1'],
  unitProgress: {
    shigeru: {
      level: 3,
      exp: 45,
      stats: {
        hp: 22,
        str: 7,
        mag: 1,
        def: 6,
        res: 2,
        spd: 8,
        skl: 6,
        lck: 8,
        mov: 5,
        cha: 0,
        wil: 0,
      },
      weaponIds: [],
      itemIds: [],
    },
  },
  roster: ['shigeru', 'akira'],
  deadUnitIds: [],
  supportPairs: [],
  bonusExp: 0,
  forgeMaterials: [],
  difficulty: 'classic',
  campaignFlags: {},
  newGamePlusUnlocked: false,
  endingsSeen: [],
  storage: [],
  viewedSupports: [],
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
        shigeru: {
          level: 3,
          exp: 45,
          stats: {
            hp: 22,
            str: 7,
            mag: 1,
            def: 6,
            res: 2,
            spd: 8,
            skl: 6,
            lck: 8,
            mov: 5,
            cha: 0,
            wil: 0,
          },
        },
      },
    };
    localStorage.setItem('srpg_save_slot_0', JSON.stringify(v1Save));
    const loaded = readSave(0);
    expect(loaded).not.toBeNull();
    expect(loaded!.version).toBe(7);
    expect(loaded!.roster).toEqual(['shigeru']);
    expect(loaded!.deadUnitIds).toEqual([]);
    expect(loaded!.currentChapterId).toBe('ch2');
  });

  it('migrates v2 save to current version on read', () => {
    const v2Save = {
      version: 2,
      timestamp: 1700000000000,
      currentChapterId: 'ch2',
      completedChapters: ['ch1'],
      unitProgress: {
        shigeru: {
          level: 3,
          exp: 45,
          stats: {
            hp: 22,
            str: 7,
            mag: 1,
            def: 6,
            res: 2,
            spd: 8,
            skl: 6,
            lck: 8,
            mov: 5,
            cha: 0,
            wil: 0,
          },
        },
      },
      roster: ['shigeru'],
      deadUnitIds: [],
    };
    localStorage.setItem('srpg_save_slot_0', JSON.stringify(v2Save));
    const loaded = readSave(0);
    expect(loaded).not.toBeNull();
    expect(loaded!.version).toBe(7);
    // v2→v3 adds skillIds/learnedSkillIds, v3→v4 adds metaStats/crpLowChapters, v4→v5 adds support/forge
    const shigeruProgress = loaded!.unitProgress.shigeru;
    expect(shigeruProgress.skillIds).toEqual([]);
    expect(shigeruProgress.learnedSkillIds).toEqual([]);
    expect(shigeruProgress.crpLowChapters).toBe(0);
  });

  it('migrates v3 save to current version on read', () => {
    const v3Save = {
      version: 3,
      timestamp: 1700000000000,
      currentChapterId: 'ch2',
      completedChapters: ['ch1'],
      unitProgress: {
        shigeru: {
          level: 3,
          exp: 45,
          stats: {
            hp: 22,
            str: 7,
            mag: 1,
            def: 6,
            res: 2,
            spd: 8,
            skl: 6,
            lck: 8,
            mov: 5,
            cha: 0,
            wil: 0,
          },
          weaponIds: [],
          itemIds: [],
          skillIds: [],
          learnedSkillIds: [],
        },
      },
      roster: ['shigeru'],
      deadUnitIds: [],
    };
    localStorage.setItem('srpg_save_slot_0', JSON.stringify(v3Save));
    const loaded = readSave(0);
    expect(loaded).not.toBeNull();
    expect(loaded!.version).toBe(7);
    const shigeruProgress = loaded!.unitProgress.shigeru;
    expect(shigeruProgress.crpLowChapters).toBe(0);
    expect(shigeruProgress.metaStats).toBeUndefined();
  });

  it('migrates v4 save to current version on read', () => {
    const v4Save = {
      version: 4,
      timestamp: 1700000000000,
      currentChapterId: 'ch3',
      completedChapters: ['ch1', 'ch2'],
      unitProgress: {
        shigeru: {
          level: 5,
          exp: 20,
          stats: {
            hp: 24,
            str: 9,
            mag: 2,
            def: 7,
            res: 3,
            spd: 9,
            skl: 7,
            lck: 9,
            mov: 5,
            cha: 0,
            wil: 0,
          },
          weaponIds: ['iron_sword'],
          itemIds: [],
          skillIds: ['sol'],
          learnedSkillIds: ['sol'],
          metaStats: { awr: 10, loop: 347, sync: 80, loy: 50, crp: 0, sta: 0 },
          crpLowChapters: 2,
        },
      },
      roster: ['shigeru', 'kanna'],
      deadUnitIds: [],
    };
    localStorage.setItem('srpg_save_slot_0', JSON.stringify(v4Save));
    const loaded = readSave(0);
    expect(loaded).not.toBeNull();
    expect(loaded!.version).toBe(7);
    expect(loaded!.supportPairs).toEqual([]);
    expect(loaded!.bonusExp).toBe(0);
    expect(loaded!.forgeMaterials).toEqual([]);
    const shigeruProgress = loaded!.unitProgress.shigeru;
    expect(shigeruProgress.supportPartners).toEqual([]);
    // Existing fields preserved
    expect(shigeruProgress.metaStats).toEqual({
      awr: 10,
      loop: 347,
      sync: 80,
      loy: 50,
      crp: 0,
      sta: 0,
    });
    expect(shigeruProgress.crpLowChapters).toBe(2);
  });

  it('roster carries forward with correct units across save/load', () => {
    const save: SaveData = {
      ...SAMPLE_SAVE,
      roster: ['shigeru', 'akira', 'kanna', 'sayo', 'genzo'],
      deadUnitIds: ['akira'],
      unitProgress: {
        shigeru: {
          level: 15,
          exp: 0,
          stats: {
            hp: 30,
            str: 12,
            mag: 2,
            def: 8,
            res: 3,
            spd: 10,
            skl: 9,
            lck: 10,
            mov: 5,
            cha: 0,
            wil: 0,
          },
          weaponIds: ['iron_sword'],
          itemIds: [],
        },
        akira: {
          level: 10,
          exp: 50,
          stats: {
            hp: 28,
            str: 10,
            mag: 0,
            def: 12,
            res: 2,
            spd: 6,
            skl: 7,
            lck: 5,
            mov: 5,
            cha: 0,
            wil: 0,
          },
          weaponIds: ['iron_lance'],
          itemIds: [],
        },
        kanna: {
          level: 8,
          exp: 30,
          stats: {
            hp: 20,
            str: 3,
            mag: 10,
            def: 4,
            res: 8,
            spd: 7,
            skl: 5,
            lck: 6,
            mov: 5,
            cha: 0,
            wil: 0,
          },
          weaponIds: ['fire'],
          itemIds: [],
        },
        sayo: {
          level: 7,
          exp: 20,
          stats: {
            hp: 22,
            str: 8,
            mag: 0,
            def: 4,
            res: 2,
            spd: 10,
            skl: 12,
            lck: 4,
            mov: 5,
            cha: 0,
            wil: 0,
          },
          weaponIds: ['iron_bow'],
          itemIds: [],
        },
        genzo: {
          level: 6,
          exp: 10,
          stats: {
            hp: 26,
            str: 11,
            mag: 0,
            def: 6,
            res: 1,
            spd: 7,
            skl: 5,
            lck: 3,
            mov: 5,
            cha: 0,
            wil: 0,
          },
          weaponIds: ['iron_axe'],
          itemIds: [],
        },
      },
    };
    writeSave(0, save);
    const loaded = readSave(0);
    expect(loaded).not.toBeNull();
    // Roster preserved exactly
    expect(loaded!.roster).toEqual(['shigeru', 'akira', 'kanna', 'sayo', 'genzo']);
    // Dead units preserved
    expect(loaded!.deadUnitIds).toEqual(['akira']);
    // All unit progress preserved
    expect(Object.keys(loaded!.unitProgress)).toHaveLength(5);
    expect(loaded!.unitProgress.shigeru.level).toBe(15);
    expect(loaded!.unitProgress.akira.level).toBe(10);
    expect(loaded!.unitProgress.kanna.stats.mag).toBe(10);
  });

  it('migrates v5 save to current version on read', () => {
    const v5Save = {
      version: 5,
      timestamp: 1700000000000,
      currentChapterId: 'ch4',
      completedChapters: ['ch1', 'ch2', 'ch3'],
      unitProgress: {
        shigeru: {
          level: 8,
          exp: 30,
          stats: {
            hp: 28,
            str: 12,
            mag: 3,
            def: 9,
            res: 4,
            spd: 11,
            skl: 10,
            lck: 10,
            mov: 5,
            cha: 0,
            wil: 0,
          },
          weaponIds: ['iron_sword'],
          itemIds: [],
          skillIds: [],
          learnedSkillIds: [],
          metaStats: { awr: 15, loop: 347, sync: 75, loy: 55, crp: 5, sta: 0 },
          crpLowChapters: 0,
          supportPartners: ['akira'],
        },
      },
      roster: ['shigeru', 'akira', 'kanna'],
      deadUnitIds: [],
      supportPairs: [{ unitA: 'shigeru', unitB: 'akira', points: 25, rank: 'C' }],
      bonusExp: 50,
      forgeMaterials: ['adamant_ore'],
      gold: 1500,
    };
    localStorage.setItem('srpg_save_slot_0', JSON.stringify(v5Save));
    const loaded = readSave(0);
    expect(loaded).not.toBeNull();
    expect(loaded!.version).toBe(7);
    // New v6 fields added with defaults
    expect(loaded!.difficulty).toBe('classic');
    expect(loaded!.campaignFlags).toEqual({});
    expect(loaded!.newGamePlusUnlocked).toBe(false);
    expect(loaded!.endingsSeen).toEqual([]);
    // Existing fields preserved
    expect(loaded!.supportPairs).toEqual([
      { unitA: 'shigeru', unitB: 'akira', points: 25, rank: 'C' },
    ]);
    expect(loaded!.bonusExp).toBe(50);
    expect(loaded!.forgeMaterials).toEqual(['adamant_ore']);
    expect(loaded!.gold).toBe(1500);
    expect(loaded!.roster).toEqual(['shigeru', 'akira', 'kanna']);
  });

  it('migrates v6 save to v7 on read', () => {
    const v6Save = {
      version: 6,
      timestamp: 1700000000000,
      currentChapterId: 'ch5',
      completedChapters: ['ch1', 'ch2', 'ch3', 'ch4'],
      unitProgress: {
        shigeru: {
          level: 10,
          exp: 50,
          stats: {
            hp: 30,
            str: 14,
            mag: 4,
            def: 10,
            res: 5,
            spd: 12,
            skl: 11,
            lck: 11,
            mov: 5,
            cha: 0,
            wil: 0,
          },
          weaponIds: ['iron_sword'],
          itemIds: [],
          skillIds: [],
          learnedSkillIds: [],
          metaStats: { awr: 20, loop: 357, sync: 80, loy: 60, crp: 3, sta: 0 },
          crpLowChapters: 0,
          supportPartners: ['akira'],
        },
      },
      roster: ['shigeru', 'akira', 'kanna', 'hina'],
      deadUnitIds: [],
      supportPairs: [{ unitA: 'shigeru', unitB: 'akira', points: 50, rank: 'B' }],
      bonusExp: 100,
      forgeMaterials: ['adamant_ore'],
      gold: 2500,
      difficulty: 'classic',
      campaignFlags: { grief_chapters_remaining: 2 },
      newGamePlusUnlocked: false,
      endingsSeen: [],
    };
    localStorage.setItem('srpg_save_slot_0', JSON.stringify(v6Save));
    const loaded = readSave(0);
    expect(loaded).not.toBeNull();
    expect(loaded!.version).toBe(7);
    // New v7 fields added with defaults
    expect(loaded!.storage).toEqual([]);
    expect(loaded!.viewedSupports).toEqual([]);
    // Existing fields preserved
    expect(loaded!.difficulty).toBe('classic');
    expect(loaded!.campaignFlags).toEqual({ grief_chapters_remaining: 2 });
    expect(loaded!.gold).toBe(2500);
    expect(loaded!.roster).toEqual(['shigeru', 'akira', 'kanna', 'hina']);
  });
});
