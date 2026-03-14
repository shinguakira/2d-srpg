import type { GameMap, Unit, Tile, ChapterData, UnitProgress, Weapon, ConsumableItem } from '../../core/types';
import { PLAYER_UNITS, ENEMY_UNITS } from '../../data/units';
import { WEAPONS } from '../../data/weapons';
import { ITEMS } from '../../data/items';

export function buildMap(chapter: ChapterData): GameMap {
  const tiles: Tile[][] = [];
  for (let y = 0; y < chapter.mapHeight; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < chapter.mapWidth; x++) {
      row.push({
        position: { x, y },
        terrain: chapter.terrain[y][x],
        occupantId: null,
      });
    }
    tiles.push(row);
  }
  return { width: chapter.mapWidth, height: chapter.mapHeight, tiles };
}

export function placeUnits(chapter: ChapterData, map: GameMap, unitProgress?: Record<string, UnitProgress>): Map<string, Unit> {
  const units = new Map<string, Unit>();

  for (const placement of chapter.playerUnits) {
    const template = PLAYER_UNITS[placement.unitId];
    if (!template) continue;
    const progress = unitProgress?.[placement.unitId];
    // Restore inventory from progress if available
    let inventory: Weapon[];
    let items: ConsumableItem[];
    if (progress?.weaponIds && progress.weaponIds.length > 0) {
      inventory = progress.weaponIds.map((wid) => ({ ...WEAPONS[wid] })).filter(Boolean);
    } else {
      inventory = template.inventory.map((w) => ({ ...w }));
    }
    if (progress?.itemIds && progress.itemIds.length > 0) {
      items = progress.itemIds.map((iid) => ({ ...ITEMS[iid] })).filter(Boolean);
    } else {
      items = template.items.map((i) => ({ ...i, effect: { ...i.effect } }));
    }

    const unit: Unit = {
      ...template,
      position: { ...placement.position },
      stats: progress ? { ...progress.stats } : { ...template.stats },
      currentHp: progress ? progress.stats.hp : template.currentHp,
      level: progress ? progress.level : template.level,
      exp: progress ? progress.exp : template.exp,
      equippedWeapon: inventory.length > 0 ? { ...inventory[0] } : { ...template.equippedWeapon },
      inventory,
      items,
    };
    units.set(unit.id, unit);
    map.tiles[placement.position.y][placement.position.x].occupantId = unit.id;
  }

  for (const placement of chapter.enemyUnits) {
    const template = ENEMY_UNITS[placement.unitId];
    if (!template) continue;
    const unit: Unit = {
      ...template,
      position: { ...placement.position },
      startPosition: { ...placement.position },
      stats: { ...template.stats },
      equippedWeapon: { ...template.equippedWeapon },
      inventory: template.inventory.map((w) => ({ ...w })),
      items: template.items.map((i) => ({ ...i, effect: { ...i.effect } })),
    };
    units.set(unit.id, unit);
    map.tiles[placement.position.y][placement.position.x].occupantId = unit.id;
  }

  return units;
}

export function allPlayersDone(units: Map<string, Unit>): boolean {
  for (const u of units.values()) {
    if (u.faction === 'player' && !u.hasActed) return false;
  }
  return true;
}

/** Check if seize objective boss is defeated (no enemy with boss AI remains) */
export function isBossDefeated(units: Map<string, Unit>): boolean {
  for (const u of units.values()) {
    if (u.faction === 'enemy' && u.aiBehavior?.type === 'boss') return false;
  }
  return true;
}

/** Check if the game should end based on objective and current state */
export function checkVictory(units: Map<string, Unit>, chapterData: ChapterData | null): 'victory' | 'defeat' | null {
  let hasPlayer = false;
  let hasEnemy = false;
  for (const u of units.values()) {
    if (u.faction === 'player') hasPlayer = true;
    if (u.faction === 'enemy') hasEnemy = true;
  }

  if (!hasPlayer) return 'defeat';

  // For rout objective, win when all enemies dead
  if (!chapterData || chapterData.objective.type === 'rout') {
    if (!hasEnemy) return 'victory';
  }

  // For seize, victory is triggered by the seize action, not by kills
  // But rout still triggers if all enemies die even in seize maps
  if (chapterData?.objective.type === 'seize' && !hasEnemy) {
    return 'victory';
  }

  return null;
}
