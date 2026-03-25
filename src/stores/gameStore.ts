import { create } from 'zustand';
import { posKey } from '../core/types';
import { SeededRandom } from '../core/rng';
import { EMPTY_SET, EMPTY_MAP } from './helpers/constants';
export type { GameState, GameActions } from './gameStoreTypes';
import type { GameState, GameActions } from './gameStoreTypes';

// Action modules
import { initChapter } from './actions/initActions';
import { selectUnit, deselectUnit, hoverTile, clickTile, cancelAction } from './actions/selectionActions';
import { confirmMove, advanceMovement } from './actions/movementActions';
import { toggleDangerZone, dismissDeathQuote, dismissReinforcementMessage, selectWeapon, dismissLevelUp, dismissHealResult, dismissExpBar } from './actions/miscActions';
import { seize, escape } from './actions/seizeActions';
import { useItem, finishItemAnimation } from './actions/itemActions';
import { visitVillage, dismissVillageReward } from './actions/villageActions';
import { startHealTargeting, confirmHeal, finishHealAnimation, useBalance } from './actions/healActions';
import { endPlayerTurn, dismissPhaseBanner } from './actions/turnActions';
import { startAttackTargeting, selectAttackTarget, confirmAttack, advanceCombatAnimation, finishCombat } from './actions/combatActions';
import { computeEnemyActions, executeNextEnemyAction, finishEnemyCombat, endEnemyTurn } from './actions/enemyActions';
import { computeAllyActions, executeNextAllyAction, finishAllyCombat, endAllyTurn } from './actions/allyActions';
import { startAutoBattle, executeNextAutoAction, finishAutoCombat } from './actions/autoBattleActions';
import { advanceEventDialogue, dismissEventDialogue } from './actions/eventActions';
import { startTalk } from './actions/recruitActions';
import { executeShove, executeSwap, executeReposition } from './actions/movementSkillActions';
import { confirmCantoMove } from './actions/cantoActions';
import { startDanceTargeting, confirmDance } from './actions/danceActions';
import { startStealTargeting, confirmSteal } from './actions/stealActions';
import { startRescueTargeting, confirmRescue, startDropTargeting, confirmDrop } from './actions/rescueActions';
import { executeLockpick } from './actions/lockpickActions';
import { startTradeTargeting, confirmTrade } from './actions/tradeActions';
import { rest } from './actions/metaStatActions';
import { useTorch } from './actions/fogActions';
import { attackTerrain } from './actions/terrainActions';
import { dismissSupportRankUp } from './actions/supportActions';
import { negotiate } from './actions/negotiateActions';
import { openSystemMenu, closeSystemMenu } from './actions/systemMenuActions';

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  gameMap: EMPTY_MAP,
  units: new Map(),
  currentPhase: 'player_phase',
  pendingVictory: false,
  currentTurn: 1,
  playerAction: 'idle',
  rng: new SeededRandom(12345),
  selectedUnitId: null,
  hoveredTile: null,
  hoverMovementRange: EMPTY_SET,
  hoverAttackRange: EMPTY_SET,
  hoverUnitFaction: null,
  movementRange: EMPTY_SET,
  attackRange: EMPTY_SET,
  movePath: [],
  pendingPosition: null,
  pendingAttackTiles: EMPTY_SET,
  combatForecast: null,
  combatResult: null,
  combatAnimationStep: -1,
  attackTargetId: null,
  levelUpGains: null,
  levelUpUnitId: null,
  expBarData: null,
  phaseBanner: null,
  enemyActions: [],
  enemyActionIndex: -1,
  autoBattleActions: [],
  autoBattleIndex: -1,
  isAutoBattle: false,
  chapterName: '',
  objectiveDescription: '',
  selectedWeaponIndex: 0,
  visitedVillages: EMPTY_SET,
  villageReward: null,
  chapterVillages: [],
  dangerZone: EMPTY_SET,
  showDangerZone: false,
  chapterData: null,
  healableTiles: EMPTY_SET,
  healResult: null,
  healAnimationData: null,
  itemAnimationData: null,
  reinforcementMessage: null,
  deathQuote: null,
  floatingNumbers: [],
  movingUnit: null,
  chapterEvents: [],
  firedEventIds: new Set(),
  eventFlags: new Map(),
  pendingEffects: [],
  eventDialogue: null,
  eventDialogueLineIndex: 0,
  spawningUnitIds: new Set(),
  removingUnitIds: new Set(),
  terrainChangePositions: new Set(),
  escapedUnitIds: new Set(),
  cantoRange: EMPTY_SET,
  cantoRemainingMov: 0,
  allyActions: [],
  allyActionIndex: -1,
  openedChests: new Set(),
  danceableTiles: EMPTY_SET,
  stealableTiles: EMPTY_SET,
  rescuableTiles: EMPTY_SET,
  droppableTiles: EMPTY_SET,
  tradableTiles: EMPTY_SET,
  tradePartnerId: null,
  refreshedUnitIds: new Set(),
  stealAnimationData: null,
  rescueAnimationData: null,

  // Fog of war
  fogOfWar: false,
  fogMap: new Map(),
  visibleTiles: new Set(),
  torchEffects: new Map(),

  // Weather
  weather: 'clear',

  // Destructible terrain
  terrainHpMap: new Map(),
  terrainDestroyPositions: new Set(),

  // Fog reveal
  fogRevealTiles: new Set(),

  // Support
  supportPairs: [],
  supportRankUp: null,

  // Boss phases
  bossPhaseTransition: null,
  cycleAuthorityUsed: new Set(),
  vanishUsed: new Set(),

  // Map boss
  mapBossState: null,

  // Split party
  splitParty: null,

  // Init
  initChapter: (chapter, seed = 12345, unitProgress?, deployedUnitIds?, supportPairs?) => initChapter(get, set, chapter, seed, unitProgress, deployedUnitIds, supportPairs),

  // Selection & navigation
  selectUnit: (unitId) => selectUnit(get, set, unitId),
  deselectUnit: () => deselectUnit(get, set),
  hoverTile: (pos) => hoverTile(get, set, pos),
  clickTile: (pos) => clickTile(get, set, pos),
  cancelAction: () => cancelAction(get, set),

  // Movement
  confirmMove: () => confirmMove(get, set),
  advanceMovement: () => advanceMovement(get, set),

  // System menu
  openSystemMenu: () => openSystemMenu(get, set),
  closeSystemMenu: () => closeSystemMenu(get, set),

  // Misc
  toggleDangerZone: () => toggleDangerZone(get, set),
  dismissDeathQuote: () => dismissDeathQuote(get, set),
  dismissReinforcementMessage: () => dismissReinforcementMessage(get, set),
  selectWeapon: (index) => selectWeapon(get, set, index),
  dismissLevelUp: () => dismissLevelUp(get, set),
  dismissExpBar: () => dismissExpBar(get, set),
  dismissHealResult: () => dismissHealResult(get, set),

  // Seize / Escape
  seize: () => seize(get, set),
  escape: () => escape(get, set),

  // Items
  useItem: (itemIndex) => useItem(get, set, itemIndex),
  finishItemAnimation: () => finishItemAnimation(get, set),

  // Village
  visitVillage: () => visitVillage(get, set),
  dismissVillageReward: () => dismissVillageReward(get, set),

  // Healing
  startHealTargeting: () => startHealTargeting(get, set),
  confirmHeal: (targetId) => confirmHeal(get, set, targetId),
  finishHealAnimation: () => finishHealAnimation(get, set),

  // Recruitment
  startTalk: () => startTalk(get, set),

  // Events
  advanceEventDialogue: () => advanceEventDialogue(get, set),
  dismissEventDialogue: () => dismissEventDialogue(get, set),

  // Turn system
  endPlayerTurn: () => endPlayerTurn(get, set),
  dismissPhaseBanner: () => dismissPhaseBanner(get, set),

  // Combat
  startAttackTargeting: () => startAttackTargeting(get, set),
  selectAttackTarget: (targetId) => selectAttackTarget(get, set, targetId),
  confirmAttack: () => confirmAttack(get, set),
  advanceCombatAnimation: () => advanceCombatAnimation(get, set),
  finishCombat: () => finishCombat(get, set),

  // Auto-battle
  startAutoBattle: () => startAutoBattle(get, set),
  executeNextAutoAction: () => executeNextAutoAction(get, set),
  finishAutoCombat: () => finishAutoCombat(get, set),

  // Enemy actions
  computeEnemyActions: () => computeEnemyActions(get, set),
  executeNextEnemyAction: () => executeNextEnemyAction(get, set),
  finishEnemyCombat: () => finishEnemyCombat(get, set),
  endEnemyTurn: () => endEnemyTurn(get, set),

  // Ally actions
  computeAllyActions: () => computeAllyActions(get, set),
  executeNextAllyAction: () => executeNextAllyAction(get, set),
  finishAllyCombat: () => finishAllyCombat(get, set),
  endAllyTurn: () => endAllyTurn(get, set),

  // Movement skills
  shove: () => executeShove(get, set),
  swap: () => executeSwap(get, set),
  reposition: () => executeReposition(get, set),

  // Dance
  startDanceTargeting: () => startDanceTargeting(get, set),
  confirmDance: (targetId) => confirmDance(get, set, targetId),

  // Steal
  startStealTargeting: () => startStealTargeting(get, set),
  confirmSteal: (targetId) => confirmSteal(get, set, targetId),

  // Rescue / Drop
  startRescueTargeting: () => startRescueTargeting(get, set),
  confirmRescue: (targetId) => confirmRescue(get, set, targetId),
  startDropTargeting: () => startDropTargeting(get, set),
  confirmDrop: (pos) => confirmDrop(get, set, pos),

  // Lockpick
  lockpick: () => executeLockpick(get, set),

  // Trade
  startTradeTargeting: () => startTradeTargeting(get, set),
  confirmTrade: (targetId, swaps) => confirmTrade(get, set, targetId, swaps),

  // Rest
  rest: () => rest(get, set),

  // Fog of war
  useTorch: () => useTorch(get, set),
  attackTerrain: () => attackTerrain(get, set),
  dismissSupportRankUp: () => dismissSupportRankUp(get, set),

  // Boss phases
  dismissBossPhaseTransition: () => set({ bossPhaseTransition: null }),

  // Negotiate
  negotiate: () => negotiate(get, set),

  // Balance (Fortify)
  useBalance: () => useBalance(get, set),

  // Canto
  confirmCantoMove: (pos) => confirmCantoMove(get, set, pos),

  // Simple getters — kept inline
  getUnitAt: (pos) => {
    const key = posKey(pos);
    for (const unit of get().units.values()) {
      if (posKey(unit.position) === key) return unit;
    }
    return undefined;
  },

  getTileAt: (pos) => {
    const { gameMap } = get();
    if (pos.x < 0 || pos.x >= gameMap.width || pos.y < 0 || pos.y >= gameMap.height) {
      return undefined;
    }
    return gameMap.tiles[pos.y][pos.x];
  },
}));
