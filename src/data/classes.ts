import type { UnitClass } from '../core/types';

export const CLASSES: Record<string, UnitClass> = {
  lord: {
    id: 'lord',
    name: 'Lord',
    baseStats: { hp: 20, str: 6, mag: 0, def: 5, res: 1, spd: 7, skl: 5, lck: 7, mov: 5, cha: 0, wil: 0 },
    growthRates: { hp: 80, str: 45, mag: 10, def: 30, res: 20, spd: 50, skl: 45, lck: 60, cha: 0, wil: 0 },
  },
  cavalier: {
    id: 'cavalier',
    name: 'Cavalier',
    baseStats: { hp: 22, str: 7, mag: 0, def: 6, res: 0, spd: 6, skl: 5, lck: 4, mov: 7, cha: 0, wil: 0 },
    growthRates: { hp: 85, str: 50, mag: 5, def: 35, res: 15, spd: 40, skl: 40, lck: 40, cha: 0, wil: 0 },
  },
  mage: {
    id: 'mage',
    name: 'Mage',
    baseStats: { hp: 16, str: 1, mag: 6, def: 3, res: 5, spd: 5, skl: 4, lck: 5, mov: 5, cha: 0, wil: 0 },
    growthRates: { hp: 50, str: 10, mag: 55, def: 15, res: 45, spd: 40, skl: 35, lck: 40, cha: 0, wil: 0 },
  },
  fighter: {
    id: 'fighter',
    name: 'Fighter',
    baseStats: { hp: 24, str: 8, mag: 0, def: 4, res: 0, spd: 5, skl: 4, lck: 3, mov: 5, cha: 0, wil: 0 },
    growthRates: { hp: 90, str: 55, mag: 5, def: 25, res: 10, spd: 35, skl: 35, lck: 30, cha: 0, wil: 0 },
  },
  soldier: {
    id: 'soldier',
    name: 'Soldier',
    baseStats: { hp: 20, str: 6, mag: 0, def: 6, res: 0, spd: 5, skl: 5, lck: 3, mov: 5, cha: 0, wil: 0 },
    growthRates: { hp: 75, str: 40, mag: 5, def: 40, res: 15, spd: 35, skl: 40, lck: 30, cha: 0, wil: 0 },
  },
  cleric: {
    id: 'cleric',
    name: 'Cleric',
    baseStats: { hp: 18, str: 1, mag: 4, def: 2, res: 6, spd: 5, skl: 3, lck: 5, mov: 5, cha: 0, wil: 0 },
    growthRates: { hp: 50, str: 5, mag: 55, def: 15, res: 55, spd: 40, skl: 30, lck: 50, cha: 0, wil: 0 },
  },

  // ===== Phase 0 — New base classes =====

  archer: {
    id: 'archer',
    name: 'Archer',
    baseStats: { hp: 20, str: 5, mag: 0, def: 4, res: 1, spd: 6, skl: 7, lck: 4, mov: 5, cha: 0, wil: 0 },
    growthRates: { hp: 70, str: 40, mag: 5, def: 20, res: 15, spd: 45, skl: 50, lck: 35, cha: 0, wil: 0 },
  },
  thief: {
    id: 'thief',
    name: 'Thief',
    baseStats: { hp: 18, str: 4, mag: 0, def: 3, res: 1, spd: 8, skl: 6, lck: 5, mov: 6, cha: 0, wil: 0 },
    growthRates: { hp: 55, str: 30, mag: 5, def: 15, res: 10, spd: 55, skl: 50, lck: 45, cha: 0, wil: 0 },
  },
  pegasus_knight: {
    id: 'pegasus_knight',
    name: 'Pegasus Knight',
    baseStats: { hp: 18, str: 5, mag: 2, def: 4, res: 5, spd: 8, skl: 6, lck: 6, mov: 7, cha: 0, wil: 0 },
    growthRates: { hp: 55, str: 35, mag: 15, def: 20, res: 40, spd: 55, skl: 45, lck: 45, cha: 0, wil: 0 },
    flying: true,
  },
  wyvern_rider: {
    id: 'wyvern_rider',
    name: 'Wyvern Rider',
    baseStats: { hp: 22, str: 8, mag: 0, def: 7, res: 0, spd: 5, skl: 5, lck: 3, mov: 7, cha: 0, wil: 0 },
    growthRates: { hp: 80, str: 50, mag: 5, def: 40, res: 10, spd: 35, skl: 35, lck: 25, cha: 0, wil: 0 },
    flying: true,
  },
  troubadour: {
    id: 'troubadour',
    name: 'Troubadour',
    baseStats: { hp: 16, str: 1, mag: 5, def: 2, res: 5, spd: 6, skl: 3, lck: 6, mov: 7, cha: 0, wil: 0 },
    growthRates: { hp: 45, str: 5, mag: 50, def: 10, res: 45, spd: 45, skl: 30, lck: 50, cha: 0, wil: 0 },
    mounted: true,
  },
  mercenary: {
    id: 'mercenary',
    name: 'Mercenary',
    baseStats: { hp: 20, str: 6, mag: 0, def: 5, res: 1, spd: 7, skl: 6, lck: 4, mov: 5, cha: 0, wil: 0 },
    growthRates: { hp: 75, str: 40, mag: 5, def: 30, res: 15, spd: 45, skl: 45, lck: 35, cha: 0, wil: 0 },
  },
  shaman: {
    id: 'shaman',
    name: 'Shaman',
    baseStats: { hp: 17, str: 0, mag: 7, def: 3, res: 4, spd: 5, skl: 4, lck: 3, mov: 5, cha: 0, wil: 0 },
    growthRates: { hp: 50, str: 5, mag: 55, def: 20, res: 35, spd: 35, skl: 35, lck: 25, cha: 0, wil: 0 },
  },
  monk: {
    id: 'monk',
    name: 'Monk',
    baseStats: { hp: 18, str: 1, mag: 5, def: 2, res: 6, spd: 5, skl: 4, lck: 4, mov: 5, cha: 0, wil: 0 },
    growthRates: { hp: 50, str: 5, mag: 50, def: 15, res: 50, spd: 40, skl: 35, lck: 40, cha: 0, wil: 0 },
  },
  knight: {
    id: 'knight',
    name: 'Knight',
    baseStats: { hp: 24, str: 7, mag: 0, def: 9, res: 0, spd: 3, skl: 4, lck: 2, mov: 4, cha: 0, wil: 0 },
    growthRates: { hp: 90, str: 40, mag: 5, def: 55, res: 10, spd: 20, skl: 30, lck: 25, cha: 0, wil: 0 },
    armored: true,
  },
  dancer: {
    id: 'dancer',
    name: 'Dancer',
    baseStats: { hp: 16, str: 3, mag: 1, def: 2, res: 3, spd: 8, skl: 3, lck: 8, mov: 5, cha: 0, wil: 0 },
    growthRates: { hp: 45, str: 20, mag: 10, def: 10, res: 20, spd: 55, skl: 25, lck: 60, cha: 0, wil: 0 },
  },
};
