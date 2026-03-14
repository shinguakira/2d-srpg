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
    targetFaction: 'player' | 'enemy' | 'ally';
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
  movingUnit: { unitId: string; path: Position[]; stepIndex: number; onComplete: 'wait' | 'combat' | 'heal' | 'item' | 'seize' | 'village' } | null;
};

export type GameActions = {
  initChapter: (chapter: ChapterData, seed?: number, unitProgress?: Record<string, UnitProgress>) => void;
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

  // Seize
  seize: () => void;

  // Danger zone
  toggleDangerZone: () => void;

  // Walking animation
  advanceMovement: () => void;

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
};
