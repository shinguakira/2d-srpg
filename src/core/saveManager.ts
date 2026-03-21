import type { SaveData } from './types';

const SAVE_KEY_PREFIX = 'srpg_save_slot_';
const CURRENT_VERSION = 4;

export function writeSave(slot: number, data: SaveData): void {
  localStorage.setItem(SAVE_KEY_PREFIX + slot, JSON.stringify(data));
}

export function readSave(slot: number): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY_PREFIX + slot);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return migrateSave(parsed);
  } catch {
    return null;
  }
}

function migrateSave(data: Record<string, unknown>): SaveData | null {
  if (!data || typeof data !== 'object') return null;
  let version = data.version as number;

  // v1 → v2: infer roster from unitProgress keys, deadUnitIds = []
  if (version === 1) {
    const progress = (data.unitProgress ?? {}) as Record<string, unknown>;
    data = {
      ...data,
      version: 2,
      roster: Object.keys(progress),
      deadUnitIds: [],
    };
    version = 2;
  }

  // v2 → v3: add classId, skillIds, learnedSkillIds to each unitProgress entry
  if (version === 2) {
    const progress = (data.unitProgress ?? {}) as Record<string, Record<string, unknown>>;
    const migratedProgress: Record<string, unknown> = {};
    for (const [uid, p] of Object.entries(progress)) {
      migratedProgress[uid] = {
        ...p,
        classId: (p as Record<string, unknown>).classId ?? undefined,
        skillIds: (p as Record<string, unknown>).skillIds ?? [],
        learnedSkillIds: (p as Record<string, unknown>).learnedSkillIds ?? [],
      };
    }
    data = {
      ...data,
      version: 3,
      unitProgress: migratedProgress,
    };
    version = 3;
  }

  // v3 → v4: add metaStats and crpLowChapters to each unitProgress entry
  if (version === 3) {
    const progress = (data.unitProgress ?? {}) as Record<string, Record<string, unknown>>;
    const migratedProgress: Record<string, unknown> = {};
    for (const [uid, p] of Object.entries(progress)) {
      migratedProgress[uid] = {
        ...p,
        metaStats: (p as Record<string, unknown>).metaStats ?? undefined,
        crpLowChapters: (p as Record<string, unknown>).crpLowChapters ?? 0,
      };
    }
    data = {
      ...data,
      version: 4,
      unitProgress: migratedProgress,
    };
    version = 4;
  }

  if (version === CURRENT_VERSION) return data as SaveData;
  return null;
}

export function deleteSave(slot: number): void {
  localStorage.removeItem(SAVE_KEY_PREFIX + slot);
}

export function hasSave(slot: number): boolean {
  return localStorage.getItem(SAVE_KEY_PREFIX + slot) !== null;
}

export function hasAnySave(): boolean {
  return hasSave(0) || hasSave(1) || hasSave(2);
}

export function getSlotSummary(slot: number): { timestamp: number; chapterId: string } | null {
  const data = readSave(slot);
  if (!data) return null;
  return { timestamp: data.timestamp, chapterId: data.currentChapterId };
}
