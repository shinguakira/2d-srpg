import type { Unit, ConsumableItem, AIBehavior } from '../core/types';
import { WEAPONS } from './weapons';
import { CLASSES } from './classes';
import { ITEMS } from './items';

/** Unit template — position is a placeholder, overridden by chapter placement */
function createUnit(
  id: string,
  name: string,
  classId: string,
  faction: 'player' | 'enemy' | 'ally',
  weaponIds: string[],
  level: number = 1,
  sprite: string = '',
  itemIds: string[] = [],
  opts?: {
    isLord?: boolean;
    deathQuote?: string;
    aiBehavior?: AIBehavior;
  },
): Unit {
  const cls = CLASSES[classId];
  const weapons = weaponIds.map((wid) => ({ ...WEAPONS[wid] }));
  const items: ConsumableItem[] = itemIds.map((iid) => ({ ...ITEMS[iid] }));
  return {
    id,
    name,
    classId,
    faction,
    position: { x: 0, y: 0 },
    stats: { ...cls.baseStats },
    currentHp: cls.baseStats.hp,
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
  };
}

// Player units
export const PLAYER_UNITS: Record<string, Unit> = {
  eirik: createUnit('eirik', 'Eirik', 'lord', 'player', ['iron_sword', 'slim_sword'], 1, '', ['vulnerary'], {
    isLord: true,
    deathQuote: "No... I must not fall here...",
  }),
  seth: createUnit('seth', 'Seth', 'cavalier', 'player', ['iron_lance', 'iron_sword'], 3, '', ['vulnerary'], {
    deathQuote: "Princess... forgive me...",
  }),
  lute: createUnit('lute', 'Lute', 'mage', 'player', ['fire', 'thunder'], 1, '', [], {
    deathQuote: "This is... unexpected...",
  }),
  natasha: createUnit('natasha', 'Natasha', 'cleric', 'player', ['heal_staff'], 1, '', ['vulnerary'], {
    deathQuote: "May the light... guide you...",
  }),
};

// Enemy templates
export const ENEMY_UNITS: Record<string, Unit> = {
  // Chapter 1 enemies — tutorial difficulty (easy)
  fighter_1: createUnit('fighter_1', 'Brigand', 'fighter', 'enemy', ['iron_axe'], 1),
  fighter_2: createUnit('fighter_2', 'Brigand', 'fighter', 'enemy', ['iron_axe'], 1),
  fighter_3: createUnit('fighter_3', 'Brigand', 'fighter', 'enemy', ['iron_axe'], 1),
  soldier_1: createUnit('soldier_1', 'Soldier', 'soldier', 'enemy', ['iron_lance'], 1),
  soldier_2: createUnit('soldier_2', 'Soldier', 'soldier', 'enemy', ['iron_lance'], 1, '', [], {
    aiBehavior: { type: 'guard', radius: 3 },
  }),
  // Ch1 Boss — weaker for tutorial
  bone: createUnit('bone', 'Bone', 'fighter', 'enemy', ['iron_axe', 'hand_axe'], 3, '', [], {
    aiBehavior: { type: 'boss' },
  }),

  // Chapter 2 enemies — still introductory (easy-medium)
  ch2_fighter_1: createUnit('ch2_fighter_1', 'Brigand', 'fighter', 'enemy', ['iron_axe'], 1),
  ch2_fighter_2: createUnit('ch2_fighter_2', 'Brigand', 'fighter', 'enemy', ['iron_axe'], 2),
  ch2_soldier_1: createUnit('ch2_soldier_1', 'Soldier', 'soldier', 'enemy', ['iron_lance'], 1),
  ch2_guard_1: createUnit('ch2_guard_1', 'Soldier', 'soldier', 'enemy', ['iron_lance'], 2, '', [], {
    aiBehavior: { type: 'guard', radius: 3 },
  }),
  ch2_guard_2: createUnit('ch2_guard_2', 'Fighter', 'fighter', 'enemy', ['iron_axe'], 2, '', [], {
    aiBehavior: { type: 'guard', radius: 3 },
  }),
  zonta: createUnit('zonta', 'Zonta', 'soldier', 'enemy', ['steel_lance', 'javelin'], 4, '', [], {
    aiBehavior: { type: 'boss' },
  }),
  // Ch2 reinforcements — delayed and weaker
  ch2_reinforce_1: createUnit('ch2_reinforce_1', 'Brigand', 'fighter', 'enemy', ['iron_axe'], 2),
  ch2_reinforce_2: createUnit('ch2_reinforce_2', 'Soldier', 'soldier', 'enemy', ['iron_lance'], 2),

  // Chapter 3 enemies — Bandits of Borgo (hard — difficulty ramp)
  ch3_fighter_1: createUnit('ch3_fighter_1', 'Brigand', 'fighter', 'enemy', ['iron_axe'], 4),
  ch3_fighter_2: createUnit('ch3_fighter_2', 'Brigand', 'fighter', 'enemy', ['steel_axe'], 4),
  ch3_fighter_3: createUnit('ch3_fighter_3', 'Brigand', 'fighter', 'enemy', ['hand_axe'], 5),
  ch3_soldier_1: createUnit('ch3_soldier_1', 'Bandit', 'soldier', 'enemy', ['steel_lance'], 4, '', [], {
    aiBehavior: { type: 'guard', radius: 3 },
  }),
  ch3_soldier_2: createUnit('ch3_soldier_2', 'Bandit', 'soldier', 'enemy', ['iron_lance'], 4, '', [], {
    aiBehavior: { type: 'guard', radius: 4 },
  }),
  ch3_mage_1: createUnit('ch3_mage_1', 'Shaman', 'mage', 'enemy', ['fire'], 4, '', [], {
    aiBehavior: { type: 'guard', radius: 4 },
  }),
  ch3_mage_2: createUnit('ch3_mage_2', 'Shaman', 'mage', 'enemy', ['thunder'], 4, '', [], {
    aiBehavior: { type: 'guard', radius: 4 },
  }),
  ch3_guard_1: createUnit('ch3_guard_1', 'Bandit', 'fighter', 'enemy', ['steel_axe'], 5, '', [], {
    aiBehavior: { type: 'guard', radius: 2 },
  }),
  ch3_boss: createUnit('ch3_boss', 'Bazba', 'fighter', 'enemy', ['steel_axe', 'hand_axe'], 7, '', [], {
    aiBehavior: { type: 'boss' },
  }),
  ch3_reinforce_1: createUnit('ch3_reinforce_1', 'Brigand', 'fighter', 'enemy', ['steel_axe'], 4),
  ch3_reinforce_2: createUnit('ch3_reinforce_2', 'Brigand', 'fighter', 'enemy', ['hand_axe'], 5),

  // Chapter 4 enemies — Ancient Horrors (very hard — final chapter)
  ch4_soldier_1: createUnit('ch4_soldier_1', 'Revenant', 'soldier', 'enemy', ['steel_lance'], 6),
  ch4_soldier_2: createUnit('ch4_soldier_2', 'Revenant', 'soldier', 'enemy', ['steel_lance'], 6),
  ch4_soldier_3: createUnit('ch4_soldier_3', 'Revenant', 'soldier', 'enemy', ['iron_lance'], 5),
  ch4_fighter_1: createUnit('ch4_fighter_1', 'Bonewalker', 'fighter', 'enemy', ['steel_axe'], 6),
  ch4_fighter_2: createUnit('ch4_fighter_2', 'Bonewalker', 'fighter', 'enemy', ['steel_axe'], 7),
  ch4_fighter_3: createUnit('ch4_fighter_3', 'Bonewalker', 'fighter', 'enemy', ['hand_axe'], 6),
  ch4_mage_1: createUnit('ch4_mage_1', 'Mogall', 'mage', 'enemy', ['fire'], 7, '', [], {
    aiBehavior: { type: 'guard', radius: 4 },
  }),
  ch4_mage_2: createUnit('ch4_mage_2', 'Mogall', 'mage', 'enemy', ['thunder'], 6, '', [], {
    aiBehavior: { type: 'guard', radius: 4 },
  }),
  ch4_guard_1: createUnit('ch4_guard_1', 'Entombed', 'fighter', 'enemy', ['steel_axe'], 8, '', [], {
    aiBehavior: { type: 'guard', radius: 2 },
  }),
  ch4_guard_2: createUnit('ch4_guard_2', 'Deathgoyle', 'soldier', 'enemy', ['steel_lance'], 7, '', [], {
    aiBehavior: { type: 'guard', radius: 3 },
  }),
  ch4_boss: createUnit('ch4_boss', 'Naxos', 'soldier', 'enemy', ['steel_lance', 'javelin'], 9, '', [], {
    aiBehavior: { type: 'boss' },
  }),
  ch4_reinforce_1: createUnit('ch4_reinforce_1', 'Bonewalker', 'fighter', 'enemy', ['steel_axe'], 6),
  ch4_reinforce_2: createUnit('ch4_reinforce_2', 'Revenant', 'soldier', 'enemy', ['steel_lance'], 6),
  ch4_reinforce_3: createUnit('ch4_reinforce_3', 'Mogall', 'mage', 'enemy', ['fire'], 6),
};
