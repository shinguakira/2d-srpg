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
  | 'village'
  | 'throne'
  | 'sand'
  | 'ice'
  | 'lava'
  | 'ruins'
  | 'indoor'
  | 'door'
  | 'chest'
  | 'armory'
  | 'bridge'
  | 'glitched'
  | 'data_void'
  | 'memory'
  | 'corrupted_fort'
  | 'broken_throne';

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

export type WeaponType = 'sword' | 'axe' | 'lance' | 'fire' | 'thunder' | 'wind' | 'staff' | 'bow' | 'knife' | 'dark' | 'light';

export type WeaponRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'Prf';

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
  readonly effectiveAgainst?: string[];
  readonly rank?: WeaponRank;
  readonly durability?: number | null;
  readonly brave?: boolean;
  readonly prf?: string;
};

// ===== Items =====

export type ItemEffect =
  | { readonly kind: 'heal'; readonly amount: number }
  | { readonly kind: 'promote'; readonly eligibleClasses: string[] };

export type ConsumableItem = {
  readonly id: string;
  readonly name: string;
  readonly type: 'consumable';
  uses: number;
  readonly maxUses: number;
  readonly effect: ItemEffect;
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
  cha: number;
  wil: number;
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
  readonly cha: number;
  readonly wil: number;
};

export type ClassTier = 'base' | 'promoted' | 'master';

export type UnitClass = {
  readonly id: string;
  readonly name: string;
  readonly tier: ClassTier;
  readonly baseStats: UnitStats;
  readonly growthRates: GrowthRates;
  readonly flying?: boolean;
  readonly mounted?: boolean;
  readonly armored?: boolean;
  readonly promotesTo?: string[];
  readonly promotesFrom?: string;
  readonly weaponTypes?: WeaponType[];
  readonly statCaps?: Partial<UnitStats>;
  readonly bonusCrit?: number;
  readonly innateSkills?: string[];
};

// ===== AI Behavior =====

export type AIBehavior =
  | { readonly type: 'aggressive' }
  | { readonly type: 'stationary' }
  | { readonly type: 'guard'; readonly radius: number }
  | { readonly type: 'boss' }
  | { readonly type: 'survival' }
  | { readonly type: 'thief'; readonly targetPosition?: Position }
  | { readonly type: 'healer' }
  | { readonly type: 'escort'; readonly targetUnitId: string }
  | { readonly type: 'coordinated'; readonly groupId: string }
  | { readonly type: 'ambush'; readonly triggerRadius: number };

export type Faction = 'player' | 'enemy' | 'ally' | 'neutral';

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
  items: ConsumableItem[];
  hasActed: boolean;
  facing: 'down' | 'up' | 'left' | 'right';
  sprite: string; // sprite image path
  aiBehavior?: AIBehavior;
  startPosition?: Position;
  isLord?: boolean;
  deathQuote?: string;
  recruitableBy?: string;
  recruitCondition?: 'talk' | 'visit_village' | 'event' | 'defection';
  skills: string[];
  learnedSkills: string[];
};

// ===== Game State =====

export type GamePhase = 'player_phase' | 'enemy_phase' | 'ally_phase' | 'combat_animation' | 'heal_animation' | 'game_over';

export type PlayerAction =
  | 'idle'
  | 'unit_selected'
  | 'move_target'
  | 'action_menu'
  | 'attack_target'
  | 'heal_target'
  | 'confirm'
  | 'village_visit'
  | 'talk_target'
  | 'canto_move';

// ===== Chapter =====

export type ObjectiveType = 'rout' | 'seize' | 'survive' | 'boss_kill' | 'escape' | 'protect' | 'capture' | 'dual';

export type ChapterObjective = {
  readonly type: ObjectiveType;
  readonly turns?: number; // for survive/protect
  readonly escapePosition?: Position; // for escape
  readonly protectUnitId?: string; // for protect
  readonly description: string;
};

export type UnitPlacement = {
  readonly unitId: string;
  readonly position: Position;
  readonly faction?: Faction;
  readonly aiBehavior?: AIBehavior;
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

export type SupportConversation = {
  readonly unitA: string;
  readonly unitB: string;
  readonly lines: DialogueLine[];
  readonly reward: SupportReward;
};

export type SupportReward =
  | { readonly type: 'exp'; readonly unitId: string; readonly amount: number }
  | { readonly type: 'stat'; readonly unitId: string; readonly stat: keyof Omit<UnitStats, 'mov'>; readonly amount: number }
  | { readonly type: 'exp_both'; readonly amount: number };

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
  readonly seizePosition?: Position;
  readonly reinforcements?: ReinforcementWave[];
  readonly supportConversations?: SupportConversation[];
  readonly events?: ChapterEvent[];
  readonly deploymentSlots?: number;
  readonly forceDeploy?: string[];
  readonly parTurns?: number;
  readonly recruitableUnits?: string[]; // unit IDs recruitable in this chapter (cross-ref with unit.recruitableBy)
};

export type ReinforcementWave = {
  readonly turn: number;
  readonly units: UnitPlacement[];
  readonly message?: string;
};

// ===== Events =====

export type CustomTriggerFn = (ctx: {
  readonly currentTurn: number;
  readonly currentPhase: GamePhase;
  readonly units: ReadonlyMap<string, Unit>;
  readonly flags: ReadonlyMap<string, string>;
}) => boolean;

export type EventTrigger =
  | { readonly type: 'turn_start'; readonly turn: number }
  | { readonly type: 'turn_end'; readonly turn: number }
  | { readonly type: 'phase_start'; readonly faction: Faction }
  | { readonly type: 'unit_at'; readonly unitId: string; readonly position: Position }
  | { readonly type: 'unit_killed'; readonly unitId: string }
  | { readonly type: 'unit_hp_below'; readonly unitId: string; readonly percent: number }
  | { readonly type: 'tile_visited'; readonly position: Position }
  | { readonly type: 'custom'; readonly fn: CustomTriggerFn };

export type EventEffect =
  | { readonly type: 'show_dialogue'; readonly scene: DialogueScene }
  | { readonly type: 'spawn_units'; readonly units: UnitPlacement[]; readonly faction: Faction }
  | { readonly type: 'recruit_unit'; readonly unitId: string }
  | { readonly type: 'change_ai'; readonly unitId: string; readonly newBehavior: AIBehavior }
  | { readonly type: 'remove_unit'; readonly unitId: string }
  | { readonly type: 'change_terrain'; readonly position: Position; readonly terrain: TerrainType }
  | { readonly type: 'set_flag'; readonly key: string; readonly value: string }
  | { readonly type: 'chain'; readonly effects: EventEffect[] };

export type ChapterEvent = {
  readonly id: string;
  readonly trigger: EventTrigger;
  readonly effects: EventEffect[];
  readonly once: boolean;
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
  readonly weaponIds: string[];
  readonly itemIds: string[];
  readonly classId?: string;
  readonly skillIds?: string[];
  readonly learnedSkillIds?: string[];
};

export type SaveData = {
  readonly version: 3;
  readonly timestamp: number;
  readonly currentChapterId: string;
  readonly completedChapters: string[];
  readonly unitProgress: Record<string, UnitProgress>;
  readonly roster: string[];
  readonly deadUnitIds: string[];
};

// ===== App Screens =====

export type AppScreen = 'title' | 'dialogue' | 'battle' | 'debug' | 'preparation';
