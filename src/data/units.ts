import type { Unit } from '../core/types';
import { WEAPONS } from './weapons';
import { CLASSES } from './classes';

/** Unit template — position is a placeholder, overridden by chapter placement */
function createUnit(
  id: string,
  name: string,
  classId: string,
  faction: 'player' | 'enemy' | 'ally',
  weaponIds: string[],
  level: number = 1,
  sprite: string = '',
): Unit {
  const cls = CLASSES[classId];
  const weapons = weaponIds.map((wid) => ({ ...WEAPONS[wid] }));
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
    hasActed: false,
    sprite,
  };
}

// Player units
export const PLAYER_UNITS: Record<string, Unit> = {
  eirik: createUnit('eirik', 'Eirik', 'lord', 'player', ['iron_sword', 'slim_sword'], 1),
  seth: createUnit('seth', 'Seth', 'cavalier', 'player', ['iron_lance', 'iron_sword'], 3),
  lute: createUnit('lute', 'Lute', 'mage', 'player', ['fire', 'thunder'], 1),
};

// Enemy templates
export const ENEMY_UNITS: Record<string, Unit> = {
  fighter_1: createUnit('fighter_1', 'Brigand', 'fighter', 'enemy', ['iron_axe'], 1),
  fighter_2: createUnit('fighter_2', 'Brigand', 'fighter', 'enemy', ['iron_axe'], 1),
  fighter_3: createUnit('fighter_3', 'Brigand', 'fighter', 'enemy', ['iron_axe'], 2),
  soldier_1: createUnit('soldier_1', 'Soldier', 'soldier', 'enemy', ['iron_lance'], 1),
  soldier_2: createUnit('soldier_2', 'Soldier', 'soldier', 'enemy', ['iron_lance'], 2),
};
