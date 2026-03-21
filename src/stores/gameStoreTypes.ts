import type {
  GameMap,
  Unit,
  GamePhase,
  PlayerAction,
  Position,
  ChapterData,
  Tile,
  UnitProgress,
  VillageReward,
  VillageData,
  Faction,
  ChapterEvent,
  DialogueScene,
  EventEffect,
  FogState,
  WeatherType,
  SupportPair,
  SupportRank,
} from '../core/types';
import type { SeededRandom } from '../core/rng';
import type { CombatForecast, CombatResult } from '../core/combat';
import type { StatGains } from '../core/experience';
import type { AIAction } from '../core/ai';

export type GameState = {
  gameMap: GameMap;
  units: Map<string, Unit>;
  currentPhase: GamePhase;
  currentTurn: number;
  playerAction: PlayerAction;
  rng: SeededRandom;

  selectedUnitId: string | null;
  hoveredTile: Position | null;

  // Movement
  movementRange: Set<string>;
  attackRange: Set<string>;
  movePath: Position[];
  pendingPosition: Position | null;
  pendingAttackTiles: Set<string>;

  // Combat
  combatForecast: CombatForecast | null;
  combatResult: CombatResult | null;
  combatAnimationStep: number; // -1 = no animation, 0+ = current hit index
  attackTargetId: string | null;

  // Level up
  levelUpGains: StatGains | null;
  levelUpUnitId: string | null;

  // EXP bar animation
  expBarData: { unitId: string; unitName: string; expBefore: number; expGain: number; leveled: boolean } | null;

  // Phase transitions
  phaseBanner: 'player_phase' | 'enemy_phase' | null;
  enemyActions: AIAction[];
  enemyActionIndex: number;

  // Auto-battle
  autoBattleActions: AIAction[];
  autoBattleIndex: number;
  isAutoBattle: boolean;

  // Ally AI
  allyActions: AIAction[];
  allyActionIndex: number;

  chapterName: string;
  objectiveDescription: string;

  // Weapon selection
  selectedWeaponIndex: number;

  // Villages
  visitedVillages: Set<string>;
  villageReward: VillageReward | null;
  chapterVillages: VillageData[];

  // Danger zone
  dangerZone: Set<string>;
  showDangerZone: boolean;

  // Chapter reference
  chapterData: ChapterData | null;

  // Healing
  healableTiles: Set<string>;
  healResult: { healerName: string; targetName: string; hpBefore: number; hpAfter: number } | null;
  healAnimationData: {
    healerName: string;
    healerClassId: string;
    targetName: string;
    targetClassId: string;
    targetFaction: Faction;
    healAmount: number;
    targetHpBefore: number;
    targetHpAfter: number;
    targetMaxHp: number;
    healerMaxHp: number;
    healerHp: number;
    staffName: string;
  } | null;

  // Reinforcements
  reinforcementMessage: string | null;

  // Death quote
  deathQuote: { unitName: string; quote: string } | null;

  // Map combat effects (floating numbers after combat)
  floatingNumbers: Array<{ id: number; x: number; y: number; text: string; color: string }>;

  // Walking animation
  movingUnit: { unitId: string; path: Position[]; stepIndex: number; onComplete: 'wait' | 'combat' | 'heal' | 'item' | 'seize' | 'village' | 'enemy_action' | 'auto_action' } | null;

  // Events
  chapterEvents: ChapterEvent[];
  firedEventIds: Set<string>;
  eventFlags: Map<string, string>;
  pendingEffects: EventEffect[][];
  eventDialogue: DialogueScene | null;
  eventDialogueLineIndex: number;

  // Event animations
  spawningUnitIds: Set<string>; // units currently fading in
  removingUnitIds: Set<string>; // units currently fading out
  terrainChangePositions: Set<string>; // tiles currently flashing

  // Escape
  escapedUnitIds: Set<string>; // units that have escaped the map

  // Chests
  openedChests: Set<string>; // chest positions that have been opened

  // Canto (post-combat movement for cavalry)
  cantoRange: Set<string>;
  cantoRemainingMov: number;

  // Dance / Steal targeting
  danceableTiles: Set<string>;
  stealableTiles: Set<string>;

  // Rescue / Drop targeting
  rescuableTiles: Set<string>;
  droppableTiles: Set<string>;

  // Trade
  tradableTiles: Set<string>;
  tradePartnerId: string | null;

  // Visual effects
  refreshedUnitIds: Set<string>; // units just danced — sparkle effect
  stealAnimationData: { position: Position; itemName: string } | null;
  rescueAnimationData: { position: Position; type: 'rescue' | 'drop' } | null;

  // Fog of war
  fogOfWar: boolean;
  fogMap: Map<string, FogState>;
  visibleTiles: Set<string>;
  torchEffects: Map<string, number>; // unitId -> turns remaining

  // Weather
  weather: WeatherType;

  // Destructible terrain
  terrainHpMap: Map<string, { hp: number; maxHp: number }>;
  terrainDestroyPositions: Set<string>; // tiles currently playing destroy animation

  // Fog reveal
  fogRevealTiles: Set<string>; // tiles that just became visible (flash animation)

  // Support system
  supportPairs: SupportPair[];
  supportRankUp: { unitA: string; unitB: string; rank: SupportRank } | null;
};

export type GameActions = {
  initChapter: (chapter: ChapterData, seed?: number, unitProgress?: Record<string, UnitProgress>, deployedUnitIds?: string[], supportPairs?: SupportPair[]) => void;
  selectUnit: (unitId: string) => void;
  deselectUnit: () => void;
  hoverTile: (pos: Position | null) => void;
  getUnitAt: (pos: Position) => Unit | undefined;
  getTileAt: (pos: Position) => Tile | undefined;
  clickTile: (pos: Position) => void;
  confirmMove: () => void;
  cancelAction: () => void;

  // Combat
  startAttackTargeting: () => void;
  selectAttackTarget: (targetId: string) => void;
  confirmAttack: () => void;
  advanceCombatAnimation: () => void;
  finishCombat: () => void;
  dismissLevelUp: () => void;
  dismissExpBar: () => void;

  // Weapon selection
  selectWeapon: (index: number) => void;

  // Village
  visitVillage: () => void;
  dismissVillageReward: () => void;

  // Items
  useItem: (itemIndex: number) => void;

  // Healing
  startHealTargeting: () => void;
  confirmHeal: (targetId: string) => void;
  dismissHealResult: () => void;
  finishHealAnimation: () => void;

  // Reinforcements
  dismissReinforcementMessage: () => void;

  // Death quote
  dismissDeathQuote: () => void;

  // Seize / Escape
  seize: () => void;
  escape: () => void;

  // Danger zone
  toggleDangerZone: () => void;

  // Walking animation
  advanceMovement: () => void;

  // Recruitment
  startTalk: () => void;

  // Events
  advanceEventDialogue: () => void;
  dismissEventDialogue: () => void;

  // Turn system
  endPlayerTurn: () => void;
  startAutoBattle: () => void;
  executeNextAutoAction: () => void;
  finishAutoCombat: () => void;
  dismissPhaseBanner: () => void;
  computeEnemyActions: () => void;
  executeNextEnemyAction: () => void;
  finishEnemyCombat: () => void;
  endEnemyTurn: () => void;

  // Ally AI
  computeAllyActions: () => void;
  executeNextAllyAction: () => void;
  finishAllyCombat: () => void;
  endAllyTurn: () => void;

  // Movement skills
  shove: () => void;
  swap: () => void;
  reposition: () => void;

  // Canto
  confirmCantoMove: (pos: Position) => void;

  // Dance
  startDanceTargeting: () => void;
  confirmDance: (targetId: string) => void;

  // Steal
  startStealTargeting: () => void;
  confirmSteal: (targetId: string) => void;

  // Rescue / Drop
  startRescueTargeting: () => void;
  confirmRescue: (targetId: string) => void;
  startDropTargeting: () => void;
  confirmDrop: (pos: Position) => void;

  // Lockpick
  lockpick: () => void;

  // Trade
  startTradeTargeting: () => void;
  confirmTrade: (targetId: string, swaps: Array<{ from: 'a' | 'b'; index: number }>) => void;

  // Rest (STA recovery)
  rest: () => void;

  // Fog of war
  useTorch: () => void;

  // Destructible terrain
  attackTerrain: () => void;

  // Support
  dismissSupportRankUp: () => void;
};
