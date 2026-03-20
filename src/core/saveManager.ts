import type { SaveData } from './types';

const SAVE_KEY_PREFIX = 'srpg_save_slot_';
const CURRENT_VERSION = 2;

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
  const version = data.version as number;

  if (version === 1) {
    // v1 → v2: infer roster from unitProgress keys, deadUnitIds = []
    const progress = (data.unitProgress ?? {}) as Record<string, unknown>;
    return {
      version: 2,
      timestamp: data.timestamp as number,
      currentChapterId: data.currentChapterId as string,
      completedChapters: data.completedChapters as string[],
      unitProgress: data.unitProgress as SaveData['unitProgress'],
      roster: Object.keys(progress),
      deadUnitIds: [],
    };
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
