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
  fighter_1: createUnit('fighter_1', 'Brigand', 'fighter', 'enemy', ['iron_axe'], 1),
  fighter_2: createUnit('fighter_2', 'Brigand', 'fighter', 'enemy', ['iron_axe'], 1),
  fighter_3: createUnit('fighter_3', 'Brigand', 'fighter', 'enemy', ['hand_axe'], 2),
  soldier_1: createUnit('soldier_1', 'Soldier', 'soldier', 'enemy', ['iron_lance'], 1),
  soldier_2: createUnit('soldier_2', 'Soldier', 'soldier', 'enemy', ['iron_lance'], 2, '', [], {
    aiBehavior: { type: 'guard', radius: 3 },
  }),
  // Ch1 Boss
  bone: createUnit('bone', 'Bone', 'fighter', 'enemy', ['steel_axe', 'hand_axe'], 4, '', [], {
    aiBehavior: { type: 'boss' },
  }),

  // Chapter 2 enemies
  ch2_fighter_1: createUnit('ch2_fighter_1', 'Brigand', 'fighter', 'enemy', ['iron_axe'], 2),
  ch2_fighter_2: createUnit('ch2_fighter_2', 'Brigand', 'fighter', 'enemy', ['hand_axe'], 2),
  ch2_soldier_1: createUnit('ch2_soldier_1', 'Soldier', 'soldier', 'enemy', ['iron_lance'], 2),
  ch2_guard_1: createUnit('ch2_guard_1', 'Soldier', 'soldier', 'enemy', ['iron_lance'], 3, '', [], {
    aiBehavior: { type: 'guard', radius: 3 },
  }),
  ch2_guard_2: createUnit('ch2_guard_2', 'Fighter', 'fighter', 'enemy', ['iron_axe'], 3, '', [], {
    aiBehavior: { type: 'guard', radius: 3 },
  }),
  zonta: createUnit('zonta', 'Zonta', 'soldier', 'enemy', ['steel_lance', 'javelin'], 5, '', [], {
    aiBehavior: { type: 'boss' },
  }),
  // Ch2 reinforcements
  ch2_reinforce_1: createUnit('ch2_reinforce_1', 'Brigand', 'fighter', 'enemy', ['iron_axe'], 3),
  ch2_reinforce_2: createUnit('ch2_reinforce_2', 'Soldier', 'soldier', 'enemy', ['iron_lance'], 3),
};
