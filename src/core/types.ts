// ===== Positions & Grid =====

export type Position = {
  readonly x: number;
  readonly y: number;
};

export function posKey(pos: Position): string {
  return `${pos.x},${pos.y}`;
}

export function parsePos(key: string): Position {
  const [x, y] = key.split(',').map(Number);
  return { x, y };
}

// ===== Terrain =====

export type TerrainType =
  | 'plain'
  | 'forest'
  | 'mountain'
  | 'water'
  | 'wall'
  | 'fort'
  | 'village';

export type TerrainData = {
  readonly name: string;
  readonly movementCost: number; // 1 = normal, 99 = impassable
  readonly defenseBonus: number;
  readonly avoidBonus: number;
};

// ===== Tiles & Map =====

export type Tile = {
  readonly position: Position;
  readonly terrain: TerrainType;
  occupantId: string | null;
};

export type GameMap = {
  readonly width: number;
  readonly height: number;
  readonly tiles: Tile[][];
};

// ===== Weapons =====

export type WeaponType = 'sword' | 'axe' | 'lance' | 'fire' | 'thunder' | 'wind';

export type Weapon = {
  readonly id: string;
  readonly name: string;
  readonly type: WeaponType;
  readonly might: number;
  readonly hit: number;
  readonly crit: number;
  readonly weight: number;
  readonly minRange: number;
  readonly maxRange: number;
};

// ===== Units =====

export type UnitStats = {
  hp: number;
  str: number;
  mag: number;
  def: number;
  res: number;
  spd: number;
  skl: number;
  lck: number;
  mov: number;
};

export type GrowthRates = {
  readonly hp: number;  // 0-100%
  readonly str: number;
  readonly mag: number;
  readonly def: number;
  readonly res: number;
  readonly spd: number;
  readonly skl: number;
  readonly lck: number;
};

export type UnitClass = {
  readonly id: string;
  readonly name: string;
  readonly baseStats: UnitStats;
  readonly growthRates: GrowthRates;
};

export type Faction = 'player' | 'enemy' | 'ally';

export type Unit = {
  readonly id: string;
  readonly name: string;
  readonly classId: string;
  readonly faction: Faction;
  position: Position;
  stats: UnitStats;
  currentHp: number;
  level: number;
  exp: number;
  equippedWeapon: Weapon;
  inventory: Weapon[];
  hasActed: boolean;
  sprite: string; // sprite image path
};

// ===== Game State =====

export type GamePhase = 'player_phase' | 'enemy_phase' | 'combat_animation' | 'game_over';

export type PlayerAction =
  | 'idle'
  | 'unit_selected'
  | 'move_target'
  | 'action_menu'
  | 'attack_target'
  | 'confirm'
  | 'village_visit';

// ===== Chapter =====

export type ObjectiveType = 'rout' | 'seize' | 'survive';

export type ChapterObjective = {
  readonly type: ObjectiveType;
  readonly turns?: number; // for survive
  readonly description: string;
};

export type UnitPlacement = {
  readonly unitId: string;
  readonly position: Position;
};

export type VillageReward = {
  readonly type: 'weapon';
  readonly weaponId: string;
  readonly dialogue: string;
  readonly speaker: string;
};

export type VillageData = {
  readonly position: Position;
  readonly reward: VillageReward;
};

export type ChapterData = {
  readonly id: string;
  readonly name: string;
  readonly chapterNumber: number;
  readonly mapWidth: number;
  readonly mapHeight: number;
  readonly terrain: TerrainType[][];
  readonly playerUnits: UnitPlacement[];
  readonly enemyUnits: UnitPlacement[];
  readonly objective: ChapterObjective;
  readonly prologue?: DialogueScene;
  readonly epilogue?: DialogueScene;
  readonly villages?: VillageData[];
};

// ===== Dialogue =====

export type DialogueLine = {
  readonly speaker: string;
  readonly text: string;
  readonly speakerFaction?: Faction;
};

export type DialogueScene = {
  readonly lines: DialogueLine[];
};

// ===== Campaign Persistence =====

export type UnitProgress = {
  readonly level: number;
  readonly exp: number;
  readonly stats: UnitStats;
};

export type SaveData = {
  readonly version: 1;
  readonly timestamp: number;
  readonly currentChapterId: string;
  readonly completedChapters: string[];
  readonly unitProgress: Record<string, UnitProgress>;
};

// ===== App Screens =====

export type AppScreen = 'title' | 'dialogue' | 'battle' | 'debug';
