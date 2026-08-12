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
  | 'broken_throne'
  | 'rubble';

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

export type WeaponType =
  | 'sword'
  | 'axe'
  | 'lance'
  | 'fire'
  | 'thunder'
  | 'wind'
  | 'staff'
  | 'bow'
  | 'knife'
  | 'dark'
  | 'light';

type WeaponRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'Prf';

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
  readonly maxDurability?: number | null;
  readonly brave?: boolean;
  readonly prf?: string;
  readonly crpGain?: number; // CRP inflicted on hit (dark magic)
  readonly forgeLevel?: number; // 0-3, forge bonuses: +2 might/level, +5 hit/level
};

// ===== Items =====

type ItemEffect =
  | { readonly kind: 'heal'; readonly amount: number }
  | { readonly kind: 'promote'; readonly eligibleClasses: string[] }
  | { readonly kind: 'unlock'; readonly targetTerrain: 'door' | 'chest' }
  | { readonly kind: 'torch' }
  | { readonly kind: 'key_item' };

export type ConsumableItem = {
  readonly id: string;
  readonly name: string;
  readonly type: 'consumable';
  uses: number;
  readonly maxUses: number;
  readonly effect: ItemEffect;
};

// ===== Meta-Stats =====

export type MetaStats = {
  awr: number; // Awareness: 0-100
  loop: number; // Memory (Shigeru only): spendable resource, starts 347
  sync: number; // Stability: 0-100
  loy: number; // Loyalty: 0-100
  crp: number; // Corruption: 0-100, 100 = turns enemy
  sta: number; // Stamina: 0-45 per chapter, resets between chapters
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
  readonly hp: number; // 0-100%
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
  | { readonly type: 'guard'; readonly radius: number; readonly patrolPath?: readonly Position[] }
  | { readonly type: 'boss' }
  | { readonly type: 'survival' }
  | { readonly type: 'thief'; readonly targetPosition?: Position }
  | { readonly type: 'healer' }
  | { readonly type: 'escort'; readonly targetUnitId: string }
  | { readonly type: 'coordinated'; readonly groupId: string }
  | { readonly type: 'ambush'; readonly triggerRadius: number };

// ===== Boss Phases =====

export type BossPhase = {
  readonly hpThreshold: number;
  readonly statChanges?: Partial<UnitStats>;
  readonly weaponId?: string;
  readonly dialogue?: DialogueScene;
  readonly aiOverride?: AIBehavior;
  readonly immunity?: 'physical' | 'magical';
  readonly selfHeal?: number;
};

// ===== Map Boss =====

type MapBossPhase = {
  readonly hpThreshold: number;
  readonly terrainChanges: ReadonlyArray<{
    readonly position: Position;
    readonly terrain: TerrainType;
  }>;
  readonly enemyHealRate: number;
  readonly spawnRate: number;
  readonly clearWalls?: boolean; // Final phase: remove all wall/mountain terrain
};

export type MapBossState = {
  maxHp: number;
  currentHp: number;
  phases: MapBossPhase[];
  currentPhase: number;
  checkpointPositions: Position[];
};

// ===== Split Party =====

type SplitPartyConfig = {
  readonly teamASlots: number;
  readonly teamBSlots: number;
  readonly mergeCondition: { readonly bossHpPercent: number };
};

// ===== Difficulty =====

export type DifficultyMode = 'classic' | 'casual' | 'hard';

// ===== Endings =====

export type EndingType = 'perfect' | 'true' | 'bittersweet' | 'tragic';

// ===== Status Effects =====

export type StatusEffectType =
  | 'panic'
  | 'poison'
  | 'dazed'
  | 'atk_break'
  | 'def_break'
  | 'spd_break'
  | 'mov_break';

export type StatusEffect = {
  readonly type: StatusEffectType;
  duration: number; // turns remaining
};

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
  recruitLoyThreshold?: number;
  skills: string[];
  learnedSkills: string[];
  traumaSkills?: string[];
  retreated?: boolean;
  bossPhases?: BossPhase[];
  currentBossPhase?: number;
  corruptionLayers?: number;
  weaponCycleOrder?: WeaponType[];
  weaponCycleIndex?: number;
  tags?: string[];
  isHidden?: boolean;
  carriedUnitId?: string;
  isCarried?: boolean;
  originalStats?: UnitStats;
  metaStats: MetaStats;
  visionRange?: number; // default 3, thief 5
  statusEffects?: StatusEffect[];
};

// ===== Game State =====

export type GamePhase =
  | 'player_phase'
  | 'enemy_phase'
  | 'ally_phase'
  | 'combat_animation'
  | 'heal_animation'
  | 'item_animation'
  | 'game_over';

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
  | 'canto_move'
  | 'dance_target'
  | 'steal_target'
  | 'rescue_target'
  | 'drop_target'
  | 'trade_target'
  | 'negotiate'
  | 'system_menu';

// ===== Weather & Fog =====

export type WeatherType = 'clear' | 'rain' | 'fog' | 'snow' | 'sandstorm' | 'corruption_storm';

export type FogState = 'hidden' | 'revealed' | 'visible';

// ===== Support System =====

export type SupportRank = 'C' | 'B' | 'A' | 'S';

export type SupportPair = {
  unitA: string;
  unitB: string;
  points: number;
  rank: SupportRank | null;
};

// ===== Chapter =====

type ObjectiveType =
  | 'rout'
  | 'seize'
  | 'survive'
  | 'boss_kill'
  | 'escape'
  | 'protect'
  | 'capture'
  | 'dual';

type ChapterObjective = {
  readonly type: ObjectiveType;
  readonly turns?: number; // for survive/protect
  readonly escapePosition?: Position; // for escape
  readonly protectUnitId?: string; // for protect
  readonly description: string;
};

type UnitPlacement = {
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
  readonly rank?: SupportRank; // if set, unlocks when pair reaches this rank
  readonly lines: DialogueLine[];
  readonly reward: SupportReward;
};

type SupportReward =
  | { readonly type: 'exp'; readonly unitId: string; readonly amount: number }
  | {
      readonly type: 'stat';
      readonly unitId: string;
      readonly stat: keyof Omit<UnitStats, 'mov'>;
      readonly amount: number;
    }
  | { readonly type: 'exp_both'; readonly amount: number };

export type ChestData = {
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
  readonly chests?: ChestData[];
  readonly seizePosition?: Position;
  readonly reinforcements?: ReinforcementWave[];
  readonly supportConversations?: SupportConversation[];
  readonly events?: ChapterEvent[];
  readonly deploymentSlots?: number;
  readonly forceDeploy?: string[];
  readonly skipPreparation?: boolean;
  readonly parTurns?: number;
  readonly recruitableUnits?: string[]; // unit IDs recruitable in this chapter (cross-ref with unit.recruitableBy)
  readonly fogOfWar?: boolean;
  readonly weather?: WeatherType;
  readonly weatherChanges?: ReadonlyArray<{
    readonly turn: number;
    readonly weather: WeatherType;
    readonly message?: string;
  }>;
  readonly destructibleTerrain?: ReadonlyArray<{
    readonly position: Position;
    readonly hp: number;
    readonly destroyedTerrain: TerrainType;
  }>;
  readonly bossPhases?: Readonly<Record<string, readonly BossPhase[]>>;
  readonly mapBoss?: MapBossState;
  readonly splitParty?: SplitPartyConfig;
};

type ReinforcementWave = {
  readonly turn: number;
  readonly units: UnitPlacement[];
  readonly message?: string;
};

// ===== Events =====

type CustomTriggerFn = (ctx: {
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
  | { readonly type: 'chain'; readonly effects: EventEffect[] }
  | { readonly type: 'change_weather'; readonly weather: WeatherType }
  | { readonly type: 'give_item'; readonly unitId: string; readonly itemId: string };

export type ChapterEvent = {
  readonly id: string;
  readonly trigger: EventTrigger;
  readonly effects: EventEffect[];
  readonly once: boolean;
};

// ===== Dialogue =====

type DialogueLine = {
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
  readonly metaStats?: MetaStats;
  readonly crpLowChapters?: number; // chapters with CRP < 15 (for passive decay)
  readonly supportPartners?: string[]; // partner unit IDs (5-partner limit enforcement)
  readonly weaponForgeLevel?: number[]; // per-weapon forge levels (parallel to weaponIds)
  readonly retreated?: boolean; // casual mode: unit retreated instead of dying
  readonly currentHp?: number; // track HP across chapters for casual restore
  readonly traumaSkills?: string[]; // trauma skills persist across chapters
};

export type SaveData = {
  readonly version: 7;
  readonly timestamp: number;
  readonly currentChapterId: string;
  readonly completedChapters: string[];
  readonly unitProgress: Record<string, UnitProgress>;
  readonly roster: string[];
  readonly deadUnitIds: string[];
  readonly supportPairs?: SupportPair[];
  readonly bonusExp?: number;
  readonly forgeMaterials?: string[];
  readonly gold?: number;
  readonly difficulty?: DifficultyMode;
  readonly campaignFlags?: Record<string, string | number | boolean>;
  readonly newGamePlusUnlocked?: boolean;
  readonly endingsSeen?: EndingType[];
  readonly storage?: string[];
  readonly viewedSupports?: string[];
};

// ===== App Screens =====

export type AppScreen =
  | 'title'
  | 'dialogue'
  | 'battle'
  | 'debug'
  | 'preparation'
  | 'ending'
  | 'credits'
  | 'team_selection';
