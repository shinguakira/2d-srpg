import type { Unit, ConsumableItem, AIBehavior, Faction } from '../core/types';
import { WEAPONS } from './weapons';
import { CLASSES } from './classes';
import { ALL_CLASSES } from './promotedClasses';
import { ITEMS } from './items';
import { defaultMetaStats } from '../core/metaStats';

/** Unit template — position is a placeholder, overridden by chapter placement */
function createUnit(
  id: string,
  name: string,
  classId: string,
  faction: Faction,
  weaponIds: string[],
  level: number = 1,
  sprite: string = '',
  itemIds: string[] = [],
  opts?: {
    isLord?: boolean;
    deathQuote?: string;
    aiBehavior?: AIBehavior;
    statOverrides?: Partial<Unit['stats']>;
  },
): Unit {
  const cls = CLASSES[classId] ?? ALL_CLASSES[classId];
  const weapons = weaponIds.map((wid) => ({ ...WEAPONS[wid] }));
  const items: ConsumableItem[] = itemIds.map((iid) => ({ ...ITEMS[iid] }));
  const stats = { ...cls.baseStats, ...opts?.statOverrides };
  return {
    id,
    name,
    classId,
    faction,
    position: { x: 0, y: 0 },
    stats,
    currentHp: stats.hp,
    level,
    exp: 0,
    equippedWeapon: { ...weapons[0] },
    inventory: weapons,
    items,
    hasActed: false,
    facing: 'down',
    sprite,
    isLord: opts?.isLord,
    deathQuote: opts?.deathQuote,
    aiBehavior: opts?.aiBehavior,
    skills: [],
    learnedSkills: [],
    metaStats: defaultMetaStats(id),
  };
}

// Player units
export const PLAYER_UNITS: Record<string, Unit> = {
  shigeru: createUnit(
    'shigeru',
    'Shigeru',
    'lord',
    'player',
    ['iron_sword', 'slim_sword', 'memory_blade'],
    1,
    '',
    ['vulnerary'],
    {
      isLord: true,
      deathQuote: 'Not again... not this time...',
    },
  ),
  akira: createUnit(
    'akira',
    'Akira',
    'cavalier',
    'player',
    ['iron_lance', 'iron_sword'],
    3,
    '',
    ['vulnerary'],
    {
      deathQuote: "I... I don't understand what's happening...",
    },
  ),
  lisette: createUnit('lisette', 'Lisette', 'mage', 'player', ['fire', 'thunder'], 1, '', [], {
    deathQuote: "The data... it's fading...",
  }),
  mirelle: createUnit(
    'mirelle',
    'Mirelle',
    'cleric',
    'player',
    ['heal_staff'],
    1,
    '',
    ['vulnerary'],
    {
      deathQuote: "This isn't... how the story ends...",
    },
  ),

  // ===== Phase 0 — New player units =====

  gareth: createUnit('gareth', 'Gareth', 'fighter', 'player', ['iron_axe'], 1, '', ['vulnerary'], {
    deathQuote: "Should've... hit harder...",
    statOverrides: { hp: 26, str: 9, def: 5 },
  }),
  halvar: createUnit(
    'halvar',
    'Halvar',
    'soldier',
    'player',
    ['iron_lance', 'garrison_lance'],
    2,
    '',
    ['vulnerary'],
    {
      deathQuote: 'The garrison... will hold... without me...',
      statOverrides: { hp: 22, def: 8, spd: 4 },
    },
  ),
  bryn: createUnit('bryn', 'Bryn', 'archer', 'player', ['iron_bow', 'sightbow'], 1, '', [], {
    deathQuote: 'I missed... the one shot that mattered...',
    statOverrides: { skl: 8, spd: 7 },
  }),
  fenn: createUnit('fenn', 'Fenn', 'thief', 'player', ['iron_knife', 'data_knife'], 1, '', [], {
    deathQuote: 'No more secrets... to find...',
    statOverrides: { spd: 9, skl: 7, lck: 6 },
  }),
  elin: createUnit(
    'elin',
    'Elin',
    'pegasus_knight',
    'player',
    ['iron_lance'],
    3,
    '',
    ['vulnerary'],
    {
      deathQuote: 'The sky... is falling...',
      statOverrides: { spd: 10, skl: 7, res: 6 },
    },
  ),

  // ===== Arc 2 — New player units =====

  corwin: createUnit(
    'corwin',
    'Corwin',
    'mercenary',
    'player',
    ['iron_sword', 'steel_sword'],
    5,
    '',
    ['vulnerary'],
    {
      deathQuote: 'Paid in full... one last time...',
      statOverrides: { hp: 22, str: 8, spd: 8, skl: 7, def: 6 },
    },
  ),
  nadine: createUnit(
    'nadine',
    'Nadine',
    'troubadour',
    'player',
    ['heal_staff', 'mend'],
    4,
    '',
    ['vulnerary'],
    {
      deathQuote: 'I should have... stayed hidden...',
      statOverrides: { mag: 7, spd: 8, res: 6 },
    },
  ),
  viviane: createUnit('viviane', 'Viviane', 'dancer', 'player', [], 5, '', ['vulnerary'], {
    deathQuote: 'The music... stops...',
    statOverrides: { spd: 10, lck: 9 },
  }),

  // Halvar NPC clone — ch8 turns Halvar into an ally NPC holding the south corridor
  halvar_npc: createUnit(
    'halvar_npc',
    'Halvar',
    'soldier',
    'ally',
    ['iron_lance', 'garrison_lance'],
    8,
    '',
    ['vulnerary'],
    {
      aiBehavior: { type: 'aggressive' },
      deathQuote: 'Eleven years... on a wall... and I chose this one...',
      statOverrides: { hp: 28, str: 10, def: 8, spd: 8, skl: 8, lck: 6 },
    },
  ),

  // Elder Ilse — ch10 protect target NPC
  elder_ilse: createUnit('elder_ilse', 'Elder Ilse', 'cleric', 'ally', ['heal_staff'], 1, '', [], {
    aiBehavior: { type: 'stationary' },
    statOverrides: { hp: 14, def: 2, res: 4, mag: 3 },
  }),
};

// Enemy templates
export const ENEMY_UNITS: Record<string, Unit> = {
  // Chapter 1 enemies — tutorial difficulty (very easy, halved attack)
  fighter_1: createUnit('fighter_1', 'Brigand', 'fighter', 'enemy', ['iron_axe'], 1, '', [], {
    statOverrides: { str: 4, skl: 2 },
  }),
  fighter_3: createUnit('fighter_3', 'Brigand', 'fighter', 'enemy', ['iron_axe'], 1, '', [], {
    statOverrides: { str: 4, skl: 2 },
  }),
  soldier_1: createUnit('soldier_1', 'Soldier', 'soldier', 'enemy', ['iron_lance'], 1, '', [], {
    statOverrides: { str: 3, skl: 3 },
  }),
  // Ch1 Boss — tutorial boss, remembers all 347 cycles
  hagen: createUnit('hagen', 'Hagen', 'fighter', 'enemy', ['iron_axe', 'hand_axe'], 2, '', [], {
    aiBehavior: { type: 'boss' },
    statOverrides: { str: 5, skl: 3 },
  }),

  // Chapter 2 enemies — still introductory (easy, halved attack)
  ch2_fighter_1: createUnit(
    'ch2_fighter_1',
    'Brigand',
    'fighter',
    'enemy',
    ['iron_axe'],
    1,
    '',
    [],
    {
      statOverrides: { str: 4, skl: 2 },
    },
  ),
  ch2_soldier_1: createUnit(
    'ch2_soldier_1',
    'Soldier',
    'soldier',
    'enemy',
    ['iron_lance'],
    1,
    '',
    [],
    {
      statOverrides: { str: 3, skl: 3 },
    },
  ),
  ch2_guard_1: createUnit('ch2_guard_1', 'Soldier', 'soldier', 'enemy', ['iron_lance'], 2, '', [], {
    aiBehavior: { type: 'guard', radius: 3 },
    statOverrides: { str: 4, skl: 3 },
  }),
  vidar: createUnit(
    'vidar',
    'Vidar',
    'cavalier',
    'enemy',
    ['iron_lance', 'steel_lance'],
    3,
    '',
    [],
    {
      aiBehavior: { type: 'boss' },
      statOverrides: { str: 5, skl: 3 },
    },
  ),
  // Ch2 reinforcements — delayed and weaker
  ch2_reinforce_1: createUnit(
    'ch2_reinforce_1',
    'Brigand',
    'fighter',
    'enemy',
    ['iron_axe'],
    1,
    '',
    [],
    {
      statOverrides: { str: 4, skl: 2 },
    },
  ),

  // Chapter 3 enemies — Bandits of Borgo (hard — difficulty ramp)
  ch3_fighter_1: createUnit('ch3_fighter_1', 'Brigand', 'fighter', 'enemy', ['iron_axe'], 4),
  ch3_fighter_2: createUnit('ch3_fighter_2', 'Brigand', 'fighter', 'enemy', ['steel_axe'], 4),
  ch3_fighter_3: createUnit('ch3_fighter_3', 'Brigand', 'fighter', 'enemy', ['hand_axe'], 5),
  ch3_soldier_1: createUnit(
    'ch3_soldier_1',
    'Bandit',
    'soldier',
    'enemy',
    ['steel_lance'],
    4,
    '',
    [],
    {
      aiBehavior: { type: 'guard', radius: 3 },
    },
  ),
  ch3_soldier_2: createUnit(
    'ch3_soldier_2',
    'Bandit',
    'soldier',
    'enemy',
    ['iron_lance'],
    4,
    '',
    [],
    {
      aiBehavior: { type: 'guard', radius: 4 },
    },
  ),
  ch3_mage_1: createUnit('ch3_mage_1', 'Shaman', 'mage', 'enemy', ['fire'], 4, '', [], {
    aiBehavior: { type: 'guard', radius: 4 },
  }),
  ch3_mage_2: createUnit('ch3_mage_2', 'Shaman', 'mage', 'enemy', ['thunder'], 4, '', [], {
    aiBehavior: { type: 'guard', radius: 4 },
  }),
  ch3_guard_1: createUnit('ch3_guard_1', 'Bandit', 'fighter', 'enemy', ['steel_axe'], 5, '', [], {
    aiBehavior: { type: 'guard', radius: 2 },
  }),
  ch3_boss: createUnit(
    'ch3_boss',
    'Olrik',
    'soldier',
    'enemy',
    ['steel_lance', 'javelin'],
    7,
    '',
    [],
    {
      aiBehavior: { type: 'boss' },
    },
  ),
  ch3_reinforce_1: createUnit('ch3_reinforce_1', 'Brigand', 'fighter', 'enemy', ['steel_axe'], 4),
  ch3_reinforce_2: createUnit('ch3_reinforce_2', 'Brigand', 'fighter', 'enemy', ['hand_axe'], 5),

  // Chapter 4 enemies — The Pickpocket (pirate stronghold)
  ch4_soldier_1: createUnit('ch4_soldier_1', 'Pirate', 'soldier', 'enemy', ['steel_lance'], 6),
  ch4_soldier_2: createUnit('ch4_soldier_2', 'Pirate', 'soldier', 'enemy', ['steel_lance'], 6),
  ch4_soldier_3: createUnit('ch4_soldier_3', 'Pirate', 'soldier', 'enemy', ['iron_lance'], 5),
  ch4_fighter_1: createUnit('ch4_fighter_1', 'Raider', 'fighter', 'enemy', ['steel_axe'], 6),
  ch4_fighter_2: createUnit('ch4_fighter_2', 'Raider', 'fighter', 'enemy', ['steel_axe'], 7),
  ch4_fighter_3: createUnit('ch4_fighter_3', 'Raider', 'fighter', 'enemy', ['hand_axe'], 6),
  ch4_mage_1: createUnit('ch4_mage_1', 'Corsair Mage', 'mage', 'enemy', ['fire'], 7, '', [], {
    aiBehavior: { type: 'guard', radius: 4 },
  }),
  ch4_mage_2: createUnit('ch4_mage_2', 'Corsair Mage', 'mage', 'enemy', ['thunder'], 6, '', [], {
    aiBehavior: { type: 'guard', radius: 4 },
  }),
  ch4_guard_1: createUnit(
    'ch4_guard_1',
    'Pirate Brute',
    'fighter',
    'enemy',
    ['steel_axe'],
    8,
    '',
    [],
    {
      aiBehavior: { type: 'guard', radius: 2 },
    },
  ),
  ch4_guard_2: createUnit(
    'ch4_guard_2',
    'Pirate Scout',
    'soldier',
    'enemy',
    ['steel_lance'],
    7,
    '',
    [],
    {
      aiBehavior: { type: 'guard', radius: 3 },
    },
  ),
  ch4_boss: createUnit(
    'ch4_boss',
    'Brask',
    'fighter',
    'enemy',
    ['steel_axe', 'hand_axe'],
    9,
    '',
    [],
    {
      aiBehavior: { type: 'aggressive' },
    },
  ),
  ch4_reinforce_1: createUnit('ch4_reinforce_1', 'Raider', 'fighter', 'enemy', ['steel_axe'], 6),
  ch4_reinforce_2: createUnit('ch4_reinforce_2', 'Pirate', 'soldier', 'enemy', ['steel_lance'], 6),
  ch4_reinforce_3: createUnit('ch4_reinforce_3', 'Corsair Mage', 'mage', 'enemy', ['fire'], 6),

  // Chapter 5 enemies — Mountain Fortress (Arc 1 climax)
  ch5_boss: createUnit(
    'ch5_boss',
    'General Roderic',
    'general_knight',
    'enemy',
    ['steel_lance', 'javelin'],
    12,
    '',
    [],
    {
      aiBehavior: { type: 'boss' },
      statOverrides: { hp: 50, str: 12, def: 16, skl: 8 },
    },
  ),
  ch5_knight_1: createUnit(
    'ch5_knight_1',
    'Knight',
    'knight',
    'enemy',
    ['iron_lance'],
    10,
    '',
    [],
    {
      aiBehavior: { type: 'escort', targetUnitId: 'ch5_boss' },
    },
  ),
  ch5_knight_2: createUnit(
    'ch5_knight_2',
    'Knight',
    'knight',
    'enemy',
    ['iron_lance'],
    10,
    '',
    [],
    {
      aiBehavior: { type: 'escort', targetUnitId: 'ch5_boss' },
    },
  ),
  ch5_soldier_1: createUnit(
    'ch5_soldier_1',
    'Soldier',
    'soldier',
    'enemy',
    ['iron_lance'],
    8,
    '',
    [],
    {
      aiBehavior: { type: 'guard', radius: 3 },
    },
  ),
  ch5_soldier_2: createUnit(
    'ch5_soldier_2',
    'Soldier',
    'soldier',
    'enemy',
    ['steel_lance'],
    8,
    '',
    [],
    {
      aiBehavior: { type: 'guard', radius: 3 },
    },
  ),
  ch5_archer_1: createUnit('ch5_archer_1', 'Archer', 'archer', 'enemy', ['iron_bow'], 7, '', [], {
    aiBehavior: { type: 'stationary' },
  }),
  ch5_archer_2: createUnit('ch5_archer_2', 'Archer', 'archer', 'enemy', ['iron_bow'], 7, '', [], {
    aiBehavior: { type: 'stationary' },
  }),
  ch5_cavalier_1: createUnit(
    'ch5_cavalier_1',
    'Cavalier',
    'cavalier',
    'enemy',
    ['iron_lance'],
    8,
    '',
    [],
    {
      aiBehavior: { type: 'guard', radius: 4 },
    },
  ),
  ch5_cavalier_2: createUnit(
    'ch5_cavalier_2',
    'Cavalier',
    'cavalier',
    'enemy',
    ['iron_lance'],
    8,
    '',
    [],
    {
      aiBehavior: { type: 'guard', radius: 4 },
    },
  ),
  ch5_mage_1: createUnit('ch5_mage_1', 'Mage', 'mage', 'enemy', ['fire'], 8, '', [], {
    aiBehavior: { type: 'guard', radius: 3 },
  }),
  ch5_brigand_1: createUnit('ch5_brigand_1', 'Brigand', 'fighter', 'enemy', ['iron_axe'], 6),
  ch5_brigand_2: createUnit('ch5_brigand_2', 'Brigand', 'fighter', 'enemy', ['iron_axe'], 6),
  ch5_reinforce_1: createUnit('ch5_reinforce_1', 'Soldier', 'soldier', 'enemy', ['iron_lance'], 7),
  ch5_reinforce_2: createUnit('ch5_reinforce_2', 'Soldier', 'soldier', 'enemy', ['iron_lance'], 7),
  ch5_reinforce_3: createUnit(
    'ch5_reinforce_3',
    'Cavalier',
    'cavalier',
    'enemy',
    ['iron_lance'],
    8,
  ),

  // ===== Chapter 6 enemies — Coastal Harbor (Arc 2 opener) =====

  ch6_boss: createUnit(
    'ch6_boss',
    'Captain Aeryn',
    'pegasus_knight',
    'enemy',
    ['steel_lance', 'javelin'],
    8,
    '',
    [],
    {
      aiBehavior: { type: 'aggressive' },
      statOverrides: { hp: 38, str: 9, spd: 12, skl: 10, def: 5, res: 7 },
    },
  ),
  ch6_soldier_1: createUnit(
    'ch6_soldier_1',
    'Soldier',
    'soldier',
    'enemy',
    ['iron_lance'],
    6,
    '',
    [],
    {
      aiBehavior: { type: 'guard', radius: 3 },
    },
  ),
  ch6_soldier_2: createUnit(
    'ch6_soldier_2',
    'Soldier',
    'soldier',
    'enemy',
    ['iron_lance'],
    6,
    '',
    [],
    {
      aiBehavior: { type: 'guard', radius: 3 },
    },
  ),
  ch6_soldier_3: createUnit(
    'ch6_soldier_3',
    'Soldier',
    'soldier',
    'enemy',
    ['steel_lance'],
    7,
    '',
    [],
    {
      aiBehavior: { type: 'guard', radius: 3 },
    },
  ),
  ch6_soldier_4: createUnit(
    'ch6_soldier_4',
    'Soldier',
    'soldier',
    'enemy',
    ['steel_lance'],
    7,
    '',
    [],
    {
      aiBehavior: { type: 'guard', radius: 4 },
    },
  ),
  ch6_archer_1: createUnit('ch6_archer_1', 'Archer', 'archer', 'enemy', ['iron_bow'], 6, '', [], {
    aiBehavior: { type: 'stationary' },
  }),
  ch6_archer_2: createUnit('ch6_archer_2', 'Archer', 'archer', 'enemy', ['iron_bow'], 6, '', [], {
    aiBehavior: { type: 'stationary' },
  }),
  ch6_fighter_1: createUnit('ch6_fighter_1', 'Brigand', 'fighter', 'enemy', ['steel_axe'], 6),
  ch6_fighter_2: createUnit('ch6_fighter_2', 'Brigand', 'fighter', 'enemy', ['steel_axe'], 6),
  ch6_fighter_3: createUnit('ch6_fighter_3', 'Brigand', 'fighter', 'enemy', ['hand_axe'], 6),
  ch6_cavalier_1: createUnit('ch6_cavalier_1', 'Cavalier', 'cavalier', 'enemy', ['iron_lance'], 7),
  ch6_cavalier_2: createUnit('ch6_cavalier_2', 'Cavalier', 'cavalier', 'enemy', ['iron_lance'], 7),
  // Ch6 reinforcements — Turn 8 heavy cavalry (4 units)
  ch6_reinforce_1: createUnit(
    'ch6_reinforce_1',
    'Heavy Cavalry',
    'cavalier',
    'enemy',
    ['steel_lance'],
    8,
  ),
  ch6_reinforce_2: createUnit(
    'ch6_reinforce_2',
    'Heavy Cavalry',
    'cavalier',
    'enemy',
    ['steel_lance'],
    8,
  ),
  ch6_reinforce_3: createUnit(
    'ch6_reinforce_3',
    'Heavy Cavalry',
    'cavalier',
    'enemy',
    ['steel_lance'],
    8,
  ),
  ch6_reinforce_4: createUnit(
    'ch6_reinforce_4',
    'Heavy Cavalry',
    'cavalier',
    'enemy',
    ['steel_lance'],
    8,
  ),
  // Ch6 reinforcements — Turn 12 overwhelming wave
  ch6_reinforce_5: createUnit(
    'ch6_reinforce_5',
    'Kurogane Soldier',
    'soldier',
    'enemy',
    ['steel_lance'],
    8,
  ),
  ch6_reinforce_6: createUnit(
    'ch6_reinforce_6',
    'Kurogane Soldier',
    'soldier',
    'enemy',
    ['steel_lance'],
    8,
  ),
  ch6_reinforce_7: createUnit(
    'ch6_reinforce_7',
    'Kurogane Fighter',
    'fighter',
    'enemy',
    ['steel_axe'],
    8,
  ),
  ch6_reinforce_8: createUnit(
    'ch6_reinforce_8',
    'Kurogane Fighter',
    'fighter',
    'enemy',
    ['steel_axe'],
    8,
  ),
  ch6_reinforce_9: createUnit(
    'ch6_reinforce_9',
    'Kurogane Cavalry',
    'cavalier',
    'enemy',
    ['steel_lance'],
    9,
  ),
  ch6_reinforce_10: createUnit(
    'ch6_reinforce_10',
    'Kurogane Cavalry',
    'cavalier',
    'enemy',
    ['steel_lance'],
    9,
  ),

  // ===== Chapter 7 enemies — Coastal Fortress (Lisette's crisis) =====

  ch7_boss: createUnit(
    'ch7_boss',
    'Admiral Varro',
    'general_soldier',
    'enemy',
    ['steel_lance'],
    9,
    '',
    [],
    {
      aiBehavior: { type: 'stationary' },
      statOverrides: { hp: 48, str: 12, def: 14, skl: 9, spd: 5 },
    },
  ),
  ch7_soldier_1: createUnit(
    'ch7_soldier_1',
    'Soldier',
    'soldier',
    'enemy',
    ['steel_lance'],
    7,
    '',
    [],
    {
      aiBehavior: { type: 'guard', radius: 3 },
    },
  ),
  ch7_soldier_2: createUnit(
    'ch7_soldier_2',
    'Soldier',
    'soldier',
    'enemy',
    ['iron_lance'],
    7,
    '',
    [],
    {
      aiBehavior: { type: 'guard', radius: 4 },
    },
  ),
  ch7_fighter_1: createUnit('ch7_fighter_1', 'Fighter', 'fighter', 'enemy', ['steel_axe'], 7),
  ch7_fighter_2: createUnit('ch7_fighter_2', 'Fighter', 'fighter', 'enemy', ['hand_axe'], 7),
  ch7_mage_1: createUnit('ch7_mage_1', 'Mage', 'mage', 'enemy', ['fire'], 7, '', [], {
    aiBehavior: { type: 'guard', radius: 4 },
  }),
  ch7_mage_2: createUnit('ch7_mage_2', 'Mage', 'mage', 'enemy', ['thunder'], 7, '', [], {
    aiBehavior: { type: 'guard', radius: 4 },
  }),
  // Ch7 corrupted spawns (shaman class, reinforcement waves)
  ch7_corrupted_1: createUnit('ch7_corrupted_1', 'Corrupted', 'shaman', 'enemy', ['fire'], 6),
  ch7_corrupted_2: createUnit('ch7_corrupted_2', 'Corrupted', 'shaman', 'enemy', ['thunder'], 6),
  ch7_corrupted_3: createUnit('ch7_corrupted_3', 'Corrupted', 'shaman', 'enemy', ['fire'], 6),
  ch7_corrupted_4: createUnit('ch7_corrupted_4', 'Corrupted', 'shaman', 'enemy', ['thunder'], 6),
  ch7_corrupted_5: createUnit('ch7_corrupted_5', 'Corrupted', 'shaman', 'enemy', ['nosferatu'], 7),
  ch7_corrupted_6: createUnit('ch7_corrupted_6', 'Corrupted', 'shaman', 'enemy', ['nosferatu'], 7),
  ch7_corrupted_7: createUnit('ch7_corrupted_7', 'Corrupted', 'shaman', 'enemy', ['fire'], 7),
  ch7_corrupted_8: createUnit('ch7_corrupted_8', 'Corrupted', 'shaman', 'enemy', ['thunder'], 7),

  // ===== Chapter 8 enemies — Mountain Fortress (Akira's death) =====

  ch8_boss: createUnit(
    'ch8_boss',
    'General Wulfram',
    'halberdier',
    'enemy',
    ['steel_lance', 'javelin'],
    12,
    '',
    [],
    {
      aiBehavior: { type: 'boss' },
      statOverrides: { hp: 55, str: 13, def: 14, skl: 10, spd: 7, res: 5 },
    },
  ),
  ch8_knight_1: createUnit('ch8_knight_1', 'Knight', 'knight', 'enemy', ['iron_lance'], 9, '', [], {
    aiBehavior: { type: 'guard', radius: 3 },
  }),
  ch8_knight_2: createUnit('ch8_knight_2', 'Knight', 'knight', 'enemy', ['iron_lance'], 9, '', [], {
    aiBehavior: { type: 'guard', radius: 3 },
  }),
  ch8_knight_3: createUnit(
    'ch8_knight_3',
    'Knight',
    'knight',
    'enemy',
    ['steel_lance'],
    8,
    '',
    [],
    {
      aiBehavior: { type: 'guard', radius: 2 },
    },
  ),
  ch8_knight_4: createUnit(
    'ch8_knight_4',
    'Knight',
    'knight',
    'enemy',
    ['steel_lance'],
    8,
    '',
    [],
    {
      aiBehavior: { type: 'guard', radius: 2 },
    },
  ),
  ch8_cavalier_1: createUnit('ch8_cavalier_1', 'Cavalier', 'cavalier', 'enemy', ['iron_lance'], 8),
  ch8_cavalier_2: createUnit('ch8_cavalier_2', 'Cavalier', 'cavalier', 'enemy', ['iron_lance'], 8),
  ch8_cavalier_3: createUnit('ch8_cavalier_3', 'Cavalier', 'cavalier', 'enemy', ['steel_lance'], 8),
  ch8_mage_1: createUnit('ch8_mage_1', 'Mage', 'mage', 'enemy', ['fire'], 8, '', [], {
    aiBehavior: { type: 'guard', radius: 4 },
  }),
  ch8_mage_2: createUnit('ch8_mage_2', 'Mage', 'mage', 'enemy', ['thunder'], 8, '', [], {
    aiBehavior: { type: 'guard', radius: 4 },
  }),
  // Ch8 south corridor reinforcements
  ch8_reinforce_1: createUnit('ch8_reinforce_1', 'Soldier', 'soldier', 'enemy', ['steel_lance'], 7),
  ch8_reinforce_2: createUnit('ch8_reinforce_2', 'Soldier', 'soldier', 'enemy', ['iron_lance'], 7),
  ch8_reinforce_3: createUnit('ch8_reinforce_3', 'Soldier', 'soldier', 'enemy', ['steel_lance'], 8),
  ch8_reinforce_4: createUnit(
    'ch8_reinforce_4',
    'Cavalier',
    'cavalier',
    'enemy',
    ['iron_lance'],
    8,
  ),
  ch8_reinforce_5: createUnit('ch8_reinforce_5', 'Soldier', 'soldier', 'enemy', ['steel_lance'], 8),
  ch8_reinforce_6: createUnit('ch8_reinforce_6', 'Soldier', 'soldier', 'enemy', ['iron_lance'], 8),
  ch8_reinforce_7: createUnit('ch8_reinforce_7', 'Soldier', 'soldier', 'enemy', ['steel_lance'], 8),

  // ===== Chapter 9 enemies — Forest Pass (grief chapter) =====

  ch9_raider_captain: createUnit(
    'ch9_raider_captain',
    'Raider Captain',
    'cavalier',
    'enemy',
    ['steel_lance'],
    9,
    '',
    [],
    {
      statOverrides: { hp: 32, str: 10, spd: 9, skl: 8 },
    },
  ),
  ch9_soldier_1: createUnit('ch9_soldier_1', 'Soldier', 'soldier', 'enemy', ['steel_lance'], 8),
  ch9_soldier_2: createUnit('ch9_soldier_2', 'Soldier', 'soldier', 'enemy', ['iron_lance'], 8),
  ch9_soldier_3: createUnit('ch9_soldier_3', 'Soldier', 'soldier', 'enemy', ['steel_lance'], 8),
  ch9_fighter_1: createUnit('ch9_fighter_1', 'Fighter', 'fighter', 'enemy', ['steel_axe'], 8),
  ch9_fighter_2: createUnit('ch9_fighter_2', 'Fighter', 'fighter', 'enemy', ['hand_axe'], 8),
  ch9_fighter_3: createUnit('ch9_fighter_3', 'Fighter', 'fighter', 'enemy', ['steel_axe'], 8),
  ch9_archer_1: createUnit('ch9_archer_1', 'Archer', 'archer', 'enemy', ['iron_bow'], 7, '', [], {
    aiBehavior: { type: 'guard', radius: 3 },
  }),
  ch9_archer_2: createUnit('ch9_archer_2', 'Archer', 'archer', 'enemy', ['iron_bow'], 7, '', [], {
    aiBehavior: { type: 'guard', radius: 3 },
  }),

  // ===== Chapter 10 enemies — Village + Hill (Arc 2 climax) =====

  ch10_boss: createUnit(
    'ch10_boss',
    'General Ezrin',
    'sage',
    'enemy',
    ['elfire', 'mend'],
    11,
    '',
    [],
    {
      aiBehavior: { type: 'boss' },
      statOverrides: { hp: 55, mag: 14, def: 8, res: 12, spd: 8, skl: 10 },
    },
  ),
  ch10_guard_1: createUnit(
    'ch10_guard_1',
    'Elite Guard',
    'soldier',
    'enemy',
    ['steel_lance'],
    9,
    '',
    [],
    {
      aiBehavior: { type: 'escort', targetUnitId: 'ch10_boss' },
    },
  ),
  ch10_guard_2: createUnit(
    'ch10_guard_2',
    'Elite Guard',
    'mercenary',
    'enemy',
    ['steel_sword'],
    9,
    '',
    [],
    {
      aiBehavior: { type: 'escort', targetUnitId: 'ch10_boss' },
    },
  ),
  ch10_guard_3: createUnit(
    'ch10_guard_3',
    'Elite Guard',
    'soldier',
    'enemy',
    ['steel_lance'],
    9,
    '',
    [],
    {
      aiBehavior: { type: 'escort', targetUnitId: 'ch10_boss' },
    },
  ),
  ch10_soldier_1: createUnit('ch10_soldier_1', 'Soldier', 'soldier', 'enemy', ['steel_lance'], 9),
  ch10_soldier_2: createUnit('ch10_soldier_2', 'Soldier', 'soldier', 'enemy', ['iron_lance'], 8),
  ch10_soldier_3: createUnit('ch10_soldier_3', 'Soldier', 'soldier', 'enemy', ['steel_lance'], 9),
  ch10_soldier_4: createUnit('ch10_soldier_4', 'Soldier', 'soldier', 'enemy', ['iron_lance'], 8),
  ch10_mage_1: createUnit('ch10_mage_1', 'Mage', 'mage', 'enemy', ['fire'], 8, '', [], {
    aiBehavior: { type: 'guard', radius: 4 },
  }),
  ch10_mage_2: createUnit('ch10_mage_2', 'Mage', 'mage', 'enemy', ['thunder'], 8, '', [], {
    aiBehavior: { type: 'guard', radius: 4 },
  }),
  ch10_fighter_1: createUnit('ch10_fighter_1', 'Raider', 'fighter', 'enemy', ['steel_axe'], 8),
  ch10_fighter_2: createUnit('ch10_fighter_2', 'Raider', 'fighter', 'enemy', ['hand_axe'], 8),
  // System Construct — ch10 Turn 6 spawn, special high-stat enemy
  ch10_construct: createUnit(
    'ch10_construct',
    'System Construct',
    'knight',
    'enemy',
    ['steel_lance'],
    15,
    '',
    [],
    {
      statOverrides: { hp: 50, str: 15, def: 14, res: 10, spd: 3, skl: 8 },
    },
  ),
};
