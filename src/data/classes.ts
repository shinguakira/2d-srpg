import type { UnitClass } from '../core/types';

export const CLASSES: Record<string, UnitClass> = {
  lord: {
    id: 'lord',
    name: 'Lord',
    baseStats: { hp: 20, str: 6, mag: 0, def: 5, res: 1, spd: 7, skl: 5, lck: 7, mov: 5 },
    growthRates: { hp: 80, str: 45, mag: 10, def: 30, res: 20, spd: 50, skl: 45, lck: 60 },
  },
  cavalier: {
    id: 'cavalier',
    name: 'Cavalier',
    baseStats: { hp: 22, str: 7, mag: 0, def: 6, res: 0, spd: 6, skl: 5, lck: 4, mov: 7 },
    growthRates: { hp: 85, str: 50, mag: 5, def: 35, res: 15, spd: 40, skl: 40, lck: 40 },
  },
  mage: {
    id: 'mage',
    name: 'Mage',
    baseStats: { hp: 16, str: 1, mag: 6, def: 3, res: 5, spd: 5, skl: 4, lck: 5, mov: 5 },
    growthRates: { hp: 50, str: 10, mag: 55, def: 15, res: 45, spd: 40, skl: 35, lck: 40 },
  },
  fighter: {
    id: 'fighter',
    name: 'Fighter',
    baseStats: { hp: 24, str: 8, mag: 0, def: 4, res: 0, spd: 5, skl: 4, lck: 3, mov: 5 },
    growthRates: { hp: 90, str: 55, mag: 5, def: 25, res: 10, spd: 35, skl: 35, lck: 30 },
  },
  soldier: {
    id: 'soldier',
    name: 'Soldier',
    baseStats: { hp: 20, str: 6, mag: 0, def: 6, res: 0, spd: 5, skl: 5, lck: 3, mov: 5 },
    growthRates: { hp: 75, str: 40, mag: 5, def: 40, res: 15, spd: 35, skl: 40, lck: 30 },
  },
  cleric: {
    id: 'cleric',
    name: 'Cleric',
    baseStats: { hp: 18, str: 1, mag: 4, def: 2, res: 6, spd: 5, skl: 3, lck: 5, mov: 5 },
    growthRates: { hp: 50, str: 5, mag: 55, def: 15, res: 55, spd: 40, skl: 30, lck: 50 },
  },
};
