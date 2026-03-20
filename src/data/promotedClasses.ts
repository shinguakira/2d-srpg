import type { UnitClass, UnitStats } from '../core/types';
import { CLASSES } from './classes';

// ===== Promoted Classes (24) =====

const PROMOTED_CLASSES: Record<string, UnitClass> = {
  // --- From Lord ---
  great_lord: {
    id: 'great_lord', name: 'Great Lord', tier: 'promoted', promotesFrom: 'lord',
    baseStats: { hp: 23, str: 8, mag: 0, def: 6, res: 1, spd: 8, skl: 6, lck: 7, mov: 6, cha: 0, wil: 0 },
    growthRates: { hp: 80, str: 45, mag: 10, def: 30, res: 20, spd: 50, skl: 45, lck: 60, cha: 0, wil: 0 },
    weaponTypes: ['sword', 'lance'],
    promotesTo: ['overlord'],
  },
  conqueror: {
    id: 'conqueror', name: 'Conqueror', tier: 'promoted', promotesFrom: 'lord',
    baseStats: { hp: 22, str: 9, mag: 0, def: 7, res: 1, spd: 7, skl: 5, lck: 7, mov: 6, cha: 1, wil: 0 },
    growthRates: { hp: 80, str: 50, mag: 10, def: 35, res: 20, spd: 45, skl: 45, lck: 60, cha: 5, wil: 0 },
    weaponTypes: ['sword', 'axe'],
    promotesTo: ['overlord'],
  },

  // --- From Cavalier ---
  paladin: {
    id: 'paladin', name: 'Paladin', tier: 'promoted', promotesFrom: 'cavalier',
    baseStats: { hp: 25, str: 9, mag: 0, def: 8, res: 2, spd: 6, skl: 5, lck: 4, mov: 8, cha: 0, wil: 0 },
    growthRates: { hp: 85, str: 50, mag: 5, def: 35, res: 20, spd: 40, skl: 40, lck: 40, cha: 0, wil: 0 },
    weaponTypes: ['sword', 'lance'],
    innateSkills: ['canto'],
    mounted: true,
    promotesTo: ['marshal'],
  },
  great_knight: {
    id: 'great_knight', name: 'Great Knight', tier: 'promoted', promotesFrom: 'cavalier',
    baseStats: { hp: 26, str: 10, mag: 0, def: 9, res: 0, spd: 5, skl: 5, lck: 4, mov: 7, cha: 0, wil: 0 },
    growthRates: { hp: 90, str: 55, mag: 5, def: 40, res: 15, spd: 35, skl: 40, lck: 40, cha: 0, wil: 0 },
    weaponTypes: ['sword', 'lance', 'axe'],
    innateSkills: ['canto'],
    mounted: true, armored: true,
  },

  // --- From Mage ---
  sage: {
    id: 'sage', name: 'Sage', tier: 'promoted', promotesFrom: 'mage',
    baseStats: { hp: 18, str: 1, mag: 9, def: 3, res: 7, spd: 6, skl: 4, lck: 5, mov: 6, cha: 0, wil: 0 },
    growthRates: { hp: 50, str: 10, mag: 60, def: 15, res: 50, spd: 45, skl: 40, lck: 40, cha: 0, wil: 0 },
    weaponTypes: ['fire', 'thunder', 'wind', 'staff'],
    promotesTo: ['archsage'],
  },
  mage_knight: {
    id: 'mage_knight', name: 'Mage Knight', tier: 'promoted', promotesFrom: 'mage',
    baseStats: { hp: 19, str: 1, mag: 7, def: 5, res: 5, spd: 7, skl: 4, lck: 5, mov: 7, cha: 0, wil: 0 },
    growthRates: { hp: 55, str: 10, mag: 50, def: 20, res: 40, spd: 45, skl: 35, lck: 40, cha: 0, wil: 0 },
    weaponTypes: ['fire', 'thunder', 'wind', 'sword'],
    mounted: true,
  },

  // --- From Fighter ---
  warrior: {
    id: 'warrior', name: 'Warrior', tier: 'promoted', promotesFrom: 'fighter',
    baseStats: { hp: 28, str: 11, mag: 0, def: 5, res: 0, spd: 5, skl: 5, lck: 3, mov: 6, cha: 0, wil: 0 },
    growthRates: { hp: 90, str: 55, mag: 5, def: 25, res: 10, spd: 35, skl: 40, lck: 30, cha: 0, wil: 0 },
    weaponTypes: ['axe', 'bow'],
    promotesTo: ['reaver'],
  },
  berserker: {
    id: 'berserker', name: 'Berserker', tier: 'promoted', promotesFrom: 'fighter',
    baseStats: { hp: 27, str: 12, mag: 0, def: 4, res: 0, spd: 5, skl: 4, lck: 3, mov: 6, cha: 0, wil: 0 },
    growthRates: { hp: 90, str: 60, mag: 5, def: 20, res: 10, spd: 40, skl: 35, lck: 30, cha: 0, wil: 0 },
    weaponTypes: ['axe'],
    bonusCrit: 15,
    promotesTo: ['reaver'],
  },

  // --- From Cleric ---
  bishop: {
    id: 'bishop', name: 'Bishop', tier: 'promoted', promotesFrom: 'cleric',
    baseStats: { hp: 20, str: 1, mag: 7, def: 2, res: 9, spd: 5, skl: 3, lck: 6, mov: 6, cha: 0, wil: 0 },
    growthRates: { hp: 50, str: 5, mag: 60, def: 15, res: 60, spd: 40, skl: 35, lck: 55, cha: 0, wil: 0 },
    weaponTypes: ['staff', 'light'],
    promotesTo: ['oracle'],
  },
  valkyrie_cleric: {
    id: 'valkyrie_cleric', name: 'Valkyrie', tier: 'promoted', promotesFrom: 'cleric',
    baseStats: { hp: 20, str: 1, mag: 6, def: 2, res: 7, spd: 7, skl: 3, lck: 5, mov: 7, cha: 0, wil: 0 },
    growthRates: { hp: 50, str: 5, mag: 55, def: 15, res: 55, spd: 45, skl: 30, lck: 50, cha: 0, wil: 0 },
    weaponTypes: ['staff', 'light'],
    mounted: true,
    promotesTo: ['seraph'],
  },

  // --- From Soldier ---
  general_soldier: {
    id: 'general_soldier', name: 'General', tier: 'promoted', promotesFrom: 'soldier',
    baseStats: { hp: 24, str: 8, mag: 0, def: 9, res: 2, spd: 5, skl: 5, lck: 3, mov: 5, cha: 0, wil: 0 },
    growthRates: { hp: 80, str: 45, mag: 5, def: 45, res: 20, spd: 30, skl: 40, lck: 30, cha: 0, wil: 0 },
    weaponTypes: ['lance', 'sword'],
    armored: true,
    promotesTo: ['marshal'],
  },
  halberdier: {
    id: 'halberdier', name: 'Halberdier', tier: 'promoted', promotesFrom: 'soldier',
    baseStats: { hp: 22, str: 9, mag: 0, def: 6, res: 0, spd: 7, skl: 7, lck: 3, mov: 6, cha: 0, wil: 0 },
    growthRates: { hp: 75, str: 45, mag: 5, def: 35, res: 15, spd: 45, skl: 50, lck: 30, cha: 0, wil: 0 },
    weaponTypes: ['lance'],
  },

  // --- From Archer ---
  sniper: {
    id: 'sniper', name: 'Sniper', tier: 'promoted', promotesFrom: 'archer',
    baseStats: { hp: 22, str: 5, mag: 0, def: 4, res: 1, spd: 8, skl: 10, lck: 4, mov: 6, cha: 0, wil: 0 },
    growthRates: { hp: 70, str: 40, mag: 5, def: 20, res: 15, spd: 50, skl: 55, lck: 35, cha: 0, wil: 0 },
    weaponTypes: ['bow'],
    bonusCrit: 15,
  },
  nomad_trooper: {
    id: 'nomad_trooper', name: 'Nomad Trooper', tier: 'promoted', promotesFrom: 'archer',
    baseStats: { hp: 23, str: 7, mag: 0, def: 5, res: 1, spd: 8, skl: 7, lck: 4, mov: 7, cha: 0, wil: 0 },
    growthRates: { hp: 75, str: 45, mag: 5, def: 25, res: 15, spd: 50, skl: 50, lck: 35, cha: 0, wil: 0 },
    weaponTypes: ['bow', 'sword'],
    mounted: true,
  },

  // --- From Thief ---
  assassin: {
    id: 'assassin', name: 'Assassin', tier: 'promoted', promotesFrom: 'thief',
    baseStats: { hp: 20, str: 6, mag: 0, def: 3, res: 1, spd: 11, skl: 6, lck: 5, mov: 6, cha: 0, wil: 0 },
    growthRates: { hp: 55, str: 35, mag: 5, def: 15, res: 10, spd: 60, skl: 55, lck: 45, cha: 0, wil: 0 },
    weaponTypes: ['knife'],
    promotesTo: ['phantom'],
  },
  rogue: {
    id: 'rogue', name: 'Rogue', tier: 'promoted', promotesFrom: 'thief',
    baseStats: { hp: 20, str: 5, mag: 0, def: 3, res: 1, spd: 10, skl: 6, lck: 7, mov: 7, cha: 0, wil: 0 },
    growthRates: { hp: 55, str: 30, mag: 5, def: 15, res: 10, spd: 55, skl: 50, lck: 50, cha: 0, wil: 0 },
    weaponTypes: ['knife', 'sword'],
  },

  // --- From Pegasus Knight ---
  falcon_knight: {
    id: 'falcon_knight', name: 'Falcon Knight', tier: 'promoted', promotesFrom: 'pegasus_knight',
    baseStats: { hp: 20, str: 7, mag: 2, def: 4, res: 7, spd: 10, skl: 6, lck: 6, mov: 8, cha: 0, wil: 0 },
    growthRates: { hp: 55, str: 40, mag: 15, def: 20, res: 45, spd: 55, skl: 50, lck: 45, cha: 0, wil: 0 },
    weaponTypes: ['lance', 'sword'],
    flying: true,
    promotesTo: ['seraph'],
  },
  dark_flier: {
    id: 'dark_flier', name: 'Dark Flier', tier: 'promoted', promotesFrom: 'pegasus_knight',
    baseStats: { hp: 20, str: 5, mag: 5, def: 4, res: 6, spd: 9, skl: 6, lck: 6, mov: 7, cha: 0, wil: 0 },
    growthRates: { hp: 55, str: 30, mag: 40, def: 20, res: 40, spd: 50, skl: 45, lck: 45, cha: 0, wil: 0 },
    weaponTypes: ['lance', 'dark'],
    flying: true,
  },

  // --- From Wyvern Rider ---
  wyvern_lord: {
    id: 'wyvern_lord', name: 'Wyvern Lord', tier: 'promoted', promotesFrom: 'wyvern_rider',
    baseStats: { hp: 26, str: 11, mag: 0, def: 10, res: 0, spd: 6, skl: 5, lck: 3, mov: 8, cha: 0, wil: 0 },
    growthRates: { hp: 85, str: 55, mag: 5, def: 45, res: 10, spd: 40, skl: 40, lck: 25, cha: 0, wil: 0 },
    weaponTypes: ['axe', 'lance'],
    flying: true,
    promotesTo: ['dragon_lord'],
  },
  malig_knight: {
    id: 'malig_knight', name: 'Malig Knight', tier: 'promoted', promotesFrom: 'wyvern_rider',
    baseStats: { hp: 24, str: 8, mag: 3, def: 9, res: 2, spd: 5, skl: 5, lck: 3, mov: 7, cha: 0, wil: 0 },
    growthRates: { hp: 80, str: 45, mag: 30, def: 40, res: 20, spd: 35, skl: 35, lck: 25, cha: 0, wil: 0 },
    weaponTypes: ['axe', 'dark'],
    flying: true,
    promotesTo: ['dragon_lord'],
  },

  // --- From Troubadour ---
  valkyrie_troubadour: {
    id: 'valkyrie_troubadour', name: 'Valkyrie', tier: 'promoted', promotesFrom: 'troubadour',
    baseStats: { hp: 18, str: 1, mag: 8, def: 2, res: 7, spd: 7, skl: 3, lck: 6, mov: 8, cha: 0, wil: 0 },
    growthRates: { hp: 45, str: 5, mag: 55, def: 10, res: 50, spd: 45, skl: 30, lck: 50, cha: 0, wil: 0 },
    weaponTypes: ['staff', 'light'],
    innateSkills: ['canto'],
    mounted: true,
    promotesTo: ['seraph'],
  },
  maid: {
    id: 'maid', name: 'Maid', tier: 'promoted', promotesFrom: 'troubadour',
    baseStats: { hp: 18, str: 1, mag: 6, def: 2, res: 5, spd: 9, skl: 3, lck: 8, mov: 7, cha: 0, wil: 0 },
    growthRates: { hp: 45, str: 5, mag: 45, def: 10, res: 40, spd: 55, skl: 35, lck: 55, cha: 0, wil: 0 },
    weaponTypes: ['staff', 'knife'],
    innateSkills: ['canto'],
    mounted: true,
  },

  // --- From Mercenary ---
  hero: {
    id: 'hero', name: 'Hero', tier: 'promoted', promotesFrom: 'mercenary',
    baseStats: { hp: 23, str: 8, mag: 0, def: 7, res: 1, spd: 9, skl: 6, lck: 4, mov: 6, cha: 0, wil: 0 },
    growthRates: { hp: 80, str: 45, mag: 5, def: 35, res: 15, spd: 50, skl: 45, lck: 35, cha: 0, wil: 0 },
    weaponTypes: ['sword', 'axe'],
    promotesTo: ['reaver'],
  },
  swordmaster: {
    id: 'swordmaster', name: 'Swordmaster', tier: 'promoted', promotesFrom: 'mercenary',
    baseStats: { hp: 22, str: 8, mag: 0, def: 5, res: 1, spd: 10, skl: 6, lck: 4, mov: 6, cha: 0, wil: 0 },
    growthRates: { hp: 75, str: 40, mag: 5, def: 25, res: 15, spd: 55, skl: 50, lck: 35, cha: 0, wil: 0 },
    weaponTypes: ['sword'],
    bonusCrit: 20,
    promotesTo: ['phantom'],
  },

  // --- From Shaman ---
  druid: {
    id: 'druid', name: 'Druid', tier: 'promoted', promotesFrom: 'shaman',
    baseStats: { hp: 19, str: 0, mag: 10, def: 3, res: 6, spd: 5, skl: 4, lck: 3, mov: 6, cha: 0, wil: 1 },
    growthRates: { hp: 50, str: 5, mag: 60, def: 20, res: 40, spd: 35, skl: 35, lck: 25, cha: 0, wil: 5 },
    weaponTypes: ['dark', 'staff'],
    promotesTo: ['archsage'],
  },
  summoner: {
    id: 'summoner', name: 'Summoner', tier: 'promoted', promotesFrom: 'shaman',
    baseStats: { hp: 19, str: 0, mag: 9, def: 4, res: 4, spd: 6, skl: 4, lck: 3, mov: 6, cha: 0, wil: 0 },
    growthRates: { hp: 50, str: 5, mag: 55, def: 20, res: 35, spd: 40, skl: 35, lck: 25, cha: 0, wil: 0 },
    weaponTypes: ['dark'],
  },

  // --- From Monk ---
  war_monk: {
    id: 'war_monk', name: 'War Monk', tier: 'promoted', promotesFrom: 'monk',
    baseStats: { hp: 21, str: 3, mag: 7, def: 3, res: 6, spd: 5, skl: 4, lck: 4, mov: 6, cha: 0, wil: 0 },
    growthRates: { hp: 55, str: 15, mag: 50, def: 20, res: 50, spd: 40, skl: 35, lck: 40, cha: 0, wil: 0 },
    weaponTypes: ['light', 'staff', 'axe'],
    promotesTo: ['oracle'],
  },
  saint: {
    id: 'saint', name: 'Saint', tier: 'promoted', promotesFrom: 'monk',
    baseStats: { hp: 20, str: 1, mag: 8, def: 2, res: 9, spd: 5, skl: 4, lck: 6, mov: 6, cha: 0, wil: 0 },
    growthRates: { hp: 50, str: 5, mag: 55, def: 15, res: 55, spd: 40, skl: 35, lck: 45, cha: 0, wil: 0 },
    weaponTypes: ['light', 'staff'],
    promotesTo: ['archsage', 'oracle'],
  },

  // --- From Armor Knight ---
  general_knight: {
    id: 'general_knight', name: 'General', tier: 'promoted', promotesFrom: 'knight',
    baseStats: { hp: 28, str: 9, mag: 0, def: 12, res: 2, spd: 3, skl: 4, lck: 2, mov: 5, cha: 0, wil: 0 },
    growthRates: { hp: 90, str: 45, mag: 5, def: 60, res: 15, spd: 20, skl: 30, lck: 25, cha: 0, wil: 0 },
    weaponTypes: ['lance', 'sword'],
    armored: true,
    promotesTo: ['marshal'],
  },
  great_knight_armor: {
    id: 'great_knight_armor', name: 'Great Knight', tier: 'promoted', promotesFrom: 'knight',
    baseStats: { hp: 27, str: 10, mag: 0, def: 11, res: 0, spd: 4, skl: 4, lck: 2, mov: 6, cha: 0, wil: 0 },
    growthRates: { hp: 90, str: 50, mag: 5, def: 50, res: 10, spd: 25, skl: 30, lck: 25, cha: 0, wil: 0 },
    weaponTypes: ['lance', 'axe'],
    mounted: true, armored: true,
  },
};

// ===== Master Classes (8) =====

const MASTER_CLASSES: Record<string, UnitClass> = {
  overlord: {
    id: 'overlord', name: 'Overlord', tier: 'master',
    promotesFrom: 'great_lord', // also from conqueror
    baseStats: { hp: 26, str: 10, mag: 1, def: 8, res: 3, spd: 9, skl: 7, lck: 8, mov: 7, cha: 1, wil: 1 },
    growthRates: { hp: 85, str: 50, mag: 10, def: 35, res: 25, spd: 50, skl: 50, lck: 60, cha: 5, wil: 5 },
    weaponTypes: ['sword', 'lance', 'axe'],
    innateSkills: ['cycle_authority'],
  },
  archsage: {
    id: 'archsage', name: 'Archsage', tier: 'master',
    promotesFrom: 'sage', // also from druid, saint
    baseStats: { hp: 21, str: 1, mag: 12, def: 4, res: 10, spd: 7, skl: 5, lck: 6, mov: 6, cha: 0, wil: 1 },
    growthRates: { hp: 55, str: 10, mag: 65, def: 15, res: 55, spd: 45, skl: 40, lck: 45, cha: 0, wil: 5 },
    weaponTypes: ['fire', 'thunder', 'wind', 'dark', 'light', 'staff'],
    innateSkills: ['tri_magic'],
  },
  marshal: {
    id: 'marshal', name: 'Marshal', tier: 'master',
    promotesFrom: 'general_soldier', // also from general_knight, paladin
    baseStats: { hp: 30, str: 11, mag: 0, def: 14, res: 4, spd: 5, skl: 6, lck: 4, mov: 6, cha: 0, wil: 1 },
    growthRates: { hp: 90, str: 50, mag: 5, def: 55, res: 25, spd: 30, skl: 45, lck: 35, cha: 0, wil: 5 },
    weaponTypes: ['sword', 'lance', 'axe'],
    statCaps: { def: 40 },
    innateSkills: ['ironwall'],
    armored: true,
  },
  reaver: {
    id: 'reaver', name: 'Reaver', tier: 'master',
    promotesFrom: 'warrior', // also from berserker, hero
    baseStats: { hp: 32, str: 14, mag: 0, def: 6, res: 1, spd: 7, skl: 6, lck: 4, mov: 6, cha: 0, wil: 0 },
    growthRates: { hp: 95, str: 60, mag: 5, def: 30, res: 10, spd: 40, skl: 40, lck: 30, cha: 0, wil: 0 },
    weaponTypes: ['sword', 'axe', 'bow'],
    statCaps: { str: 40 },
    innateSkills: ['bloodlust'],
  },
  seraph: {
    id: 'seraph', name: 'Seraph', tier: 'master',
    promotesFrom: 'falcon_knight', // also from valkyrie
    baseStats: { hp: 22, str: 8, mag: 4, def: 5, res: 9, spd: 11, skl: 7, lck: 7, mov: 9, cha: 0, wil: 0 },
    growthRates: { hp: 60, str: 45, mag: 20, def: 25, res: 50, spd: 60, skl: 50, lck: 50, cha: 0, wil: 0 },
    weaponTypes: ['lance', 'light', 'staff'],
    innateSkills: ['divine_wings'],
    flying: true,
  },
  dragon_lord: {
    id: 'dragon_lord', name: 'Dragon Lord', tier: 'master',
    promotesFrom: 'wyvern_lord', // also from malig_knight
    baseStats: { hp: 30, str: 13, mag: 2, def: 12, res: 2, spd: 7, skl: 6, lck: 4, mov: 9, cha: 0, wil: 1 },
    growthRates: { hp: 90, str: 60, mag: 10, def: 50, res: 15, spd: 40, skl: 40, lck: 25, cha: 0, wil: 5 },
    weaponTypes: ['axe', 'lance', 'dark'],
    statCaps: { def: 40 },
    innateSkills: ['terror_aura'],
    flying: true,
  },
  phantom: {
    id: 'phantom', name: 'Phantom', tier: 'master',
    promotesFrom: 'assassin', // also from swordmaster
    baseStats: { hp: 22, str: 8, mag: 0, def: 4, res: 2, spd: 13, skl: 8, lck: 6, mov: 7, cha: 0, wil: 0 },
    growthRates: { hp: 60, str: 40, mag: 5, def: 15, res: 15, spd: 65, skl: 55, lck: 50, cha: 0, wil: 0 },
    weaponTypes: ['sword', 'knife'],
    statCaps: { spd: 40 },
    innateSkills: ['vanish'],
  },
  oracle: {
    id: 'oracle', name: 'Oracle', tier: 'master',
    promotesFrom: 'bishop', // also from saint, war_monk
    baseStats: { hp: 22, str: 2, mag: 11, def: 3, res: 11, spd: 6, skl: 5, lck: 7, mov: 6, cha: 0, wil: 2 },
    growthRates: { hp: 55, str: 5, mag: 60, def: 15, res: 60, spd: 40, skl: 40, lck: 50, cha: 0, wil: 10 },
    weaponTypes: ['light', 'dark', 'staff'],
    innateSkills: ['balance'],
  },
};

// ===== Promotion Stat Bonuses =====
// Exact stat deltas applied when promoting (from spec)

export const PROMOTION_BONUSES: Record<string, Partial<UnitStats>> = {
  // From Lord
  great_lord:    { hp: 3, str: 2, spd: 1, def: 1, skl: 1, mov: 1 },
  conqueror:     { hp: 2, str: 3, def: 2, cha: 1, mov: 1 },
  // From Cavalier (mounted — no MOV bonus)
  paladin:       { hp: 3, str: 2, def: 2, res: 2 },
  great_knight:  { hp: 4, str: 3, def: 3, spd: -1 },
  // From Mage
  sage:          { hp: 2, mag: 3, res: 2, spd: 1, mov: 1 },
  mage_knight:   { hp: 3, mag: 1, spd: 2, def: 2 }, // becomes mounted
  // From Fighter
  warrior:       { hp: 4, str: 3, skl: 1, def: 1, mov: 1 },
  berserker:     { hp: 3, str: 4, mov: 1 },
  // From Cleric
  bishop:        { hp: 2, mag: 3, res: 3, lck: 1, mov: 1 },
  valkyrie_cleric: { hp: 2, mag: 2, spd: 2, res: 1 }, // becomes mounted
  // From Soldier
  general_soldier: { hp: 4, str: 2, def: 3, res: 2 },
  halberdier:    { hp: 2, str: 3, spd: 2, skl: 2, mov: 1 },
  // From Archer
  sniper:        { hp: 2, skl: 3, spd: 2, mov: 1 },
  nomad_trooper: { hp: 3, str: 2, spd: 2, def: 1 }, // becomes mounted
  // From Thief
  assassin:      { hp: 2, str: 2, spd: 3 }, // no +MOV (already 6)
  rogue:         { hp: 2, str: 1, spd: 2, lck: 2, mov: 1 },
  // From Pegasus Knight (flying — no MOV bonus)
  falcon_knight: { hp: 2, str: 2, spd: 2, res: 2 },
  dark_flier:    { hp: 2, mag: 3, spd: 1, res: 1 },
  // From Wyvern Rider (flying — no MOV bonus)
  wyvern_lord:   { hp: 4, str: 3, def: 3, spd: 1 },
  malig_knight:  { hp: 2, mag: 3, def: 2, res: 2 },
  // From Troubadour (mounted — no MOV bonus)
  valkyrie_troubadour: { hp: 2, mag: 3, res: 2, spd: 1 },
  maid:          { hp: 2, mag: 1, spd: 3, lck: 2 },
  // From Mercenary
  hero:          { hp: 3, str: 2, spd: 2, def: 2, mov: 1 },
  swordmaster:   { hp: 2, str: 2, spd: 3, mov: 1 },
  // From Shaman
  druid:         { hp: 2, mag: 3, res: 2, wil: 1, mov: 1 },
  summoner:      { hp: 2, mag: 2, spd: 1, def: 1, mov: 1 },
  // From Monk
  war_monk:      { hp: 3, str: 2, mag: 2, def: 1, mov: 1 },
  saint:         { hp: 2, mag: 3, res: 3, lck: 2, mov: 1 },
  // From Armor Knight (armored — no MOV bonus for general, +MOV for great knight becomes mounted)
  general_knight: { hp: 4, str: 2, def: 3, res: 2 },
  great_knight_armor: { hp: 3, str: 3, def: 2, spd: 1, mov: 2 }, // gains mounted mobility

  // Master class bonuses (smaller, +unique skill)
  overlord:     { hp: 3, str: 2, def: 1, spd: 1, mov: 1 },
  archsage:     { hp: 3, mag: 3, res: 1 },
  marshal:      { hp: 3, def: 2, str: 1, mov: 1 },
  reaver:       { hp: 3, str: 3, spd: 1 },
  seraph:       { hp: 2, spd: 1, res: 2 },
  dragon_lord:  { hp: 3, str: 2, def: 2 },
  phantom:      { hp: 2, spd: 2, skl: 1 },
  oracle:       { hp: 2, mag: 2, res: 2, wil: 1 },
};

// ===== Merged ALL_CLASSES export =====

export const ALL_CLASSES: Record<string, UnitClass> = {
  ...CLASSES,
  ...PROMOTED_CLASSES,
  ...MASTER_CLASSES,
};
