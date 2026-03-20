import type { GameMap, Unit, Tile, ChapterData, UnitProgress, Weapon, ConsumableItem } from '../../core/types';
import type { ClassFlags } from '../../core/terrain';
import { PLAYER_UNITS, ENEMY_UNITS } from '../../data/units';
import { WEAPONS } from '../../data/weapons';
import { ITEMS } from '../../data/items';
import { ALL_CLASSES } from '../../data/promotedClasses';

/** Extract flying/mounted/armored flags from a unit's class. */
export function getClassFlags(unit: Unit): ClassFlags {
  const cls = ALL_CLASSES[unit.classId];
  if (!cls) return {};
  return { flying: cls.flying, mounted: cls.mounted, armored: cls.armored };
}

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

export function placeUnits(chapter: ChapterData, map: GameMap, unitProgress?: Record<string, UnitProgress>, deployedUnitIds?: string[]): Map<string, Unit> {
  const units = new Map<string, Unit>();

  // Determine player placements: roster deployment or chapter-defined
  const maxSpawnSlots = chapter.playerUnits.length;
  const placements = deployedUnitIds && deployedUnitIds.length > 0
    ? deployedUnitIds.slice(0, maxSpawnSlots).map((unitId, i) => ({
        unitId,
        position: chapter.playerUnits[i].position,
      }))
    : chapter.playerUnits;

  for (const placement of placements) {
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
      classId: progress?.classId ?? template.classId,
      stats: progress ? { ...progress.stats } : { ...template.stats },
      currentHp: progress ? progress.stats.hp : template.currentHp,
      level: progress ? progress.level : template.level,
      exp: progress ? progress.exp : template.exp,
      equippedWeapon: inventory.length > 0 ? { ...inventory[0] } : { ...template.equippedWeapon },
      inventory,
      items,
      skills: progress?.skillIds ?? template.skills ?? [],
      learnedSkills: progress?.learnedSkillIds ?? template.learnedSkills ?? [],
    };
    units.set(unit.id, unit);
    map.tiles[placement.position.y][placement.position.x].occupantId = unit.id;
  }

  for (const placement of chapter.enemyUnits) {
    // Look up from ENEMY_UNITS first, fall back to PLAYER_UNITS (for recruitable units placed as enemies)
    const template = ENEMY_UNITS[placement.unitId] ?? PLAYER_UNITS[placement.unitId];
    if (!template) continue;
    const unit: Unit = {
      ...template,
      position: { ...placement.position },
      startPosition: { ...placement.position },
      stats: { ...template.stats },
      equippedWeapon: { ...template.equippedWeapon },
      inventory: template.inventory.map((w) => ({ ...w })),
      items: template.items.map((i) => ({ ...i, effect: { ...i.effect } })),
      // Apply placement overrides (faction, AI behavior)
      ...(placement.faction ? { faction: placement.faction } : {}),
      ...(placement.aiBehavior ? { aiBehavior: placement.aiBehavior } : {}),
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
  let hasLord = false;
  for (const u of units.values()) {
    if (u.faction === 'player') {
      hasPlayer = true;
      if (u.isLord) hasLord = true;
    }
    if (u.faction === 'enemy') hasEnemy = true;
  }

  if (!hasPlayer) return 'defeat';

  const objType = chapterData?.objective.type ?? 'rout';

  // Lord death = defeat for most objectives
  if (!hasLord && objType !== 'rout') return 'defeat';

  // Protect: defeat if protected unit dies
  if (objType === 'protect' && chapterData?.objective.protectUnitId) {
    if (!units.has(chapterData.objective.protectUnitId)) return 'defeat';
  }

  // Rout: win when all enemies dead
  if (objType === 'rout' && !hasEnemy) return 'victory';

  // Boss kill: win when no boss AI enemy remains
  if (objType === 'boss_kill' && isBossDefeated(units)) return 'victory';

  // Seize: victory triggered by seize action, but rout also wins
  if (objType === 'seize' && !hasEnemy) return 'victory';

  // Survive/protect: turn-based victory checked in turnActions
  // Escape: victory triggered by escape action (Lord escaping triggers game_over directly)

  return null;
}
