import type { SaveData } from './types';

const SAVE_KEY_PREFIX = 'srpg_save_slot_';
const CURRENT_VERSION = 1;

export function writeSave(slot: number, data: SaveData): void {
  localStorage.setItem(SAVE_KEY_PREFIX + slot, JSON.stringify(data));
}

export function readSave(slot: number): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY_PREFIX + slot);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SaveData;
    if (parsed.version !== CURRENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
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
