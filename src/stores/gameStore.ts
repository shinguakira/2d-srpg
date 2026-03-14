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
import { toggleDangerZone, dismissDeathQuote, dismissReinforcementMessage, selectWeapon, dismissLevelUp, dismissHealResult } from './actions/miscActions';
import { seize } from './actions/seizeActions';
import { useItem } from './actions/itemActions';
import { visitVillage, dismissVillageReward } from './actions/villageActions';
import { startHealTargeting, confirmHeal, finishHealAnimation } from './actions/healActions';
import { endPlayerTurn, dismissPhaseBanner } from './actions/turnActions';
import { startAttackTargeting, selectAttackTarget, confirmAttack, advanceCombatAnimation, finishCombat } from './actions/combatActions';
import { computeEnemyActions, executeNextEnemyAction, finishEnemyCombat, endEnemyTurn } from './actions/enemyActions';

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  gameMap: EMPTY_MAP,
  units: new Map(),
  currentPhase: 'player_phase',
  currentTurn: 1,
  playerAction: 'idle',
  rng: new SeededRandom(12345),
  selectedUnitId: null,
  hoveredTile: null,
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
  phaseBanner: null,
  enemyActions: [],
  enemyActionIndex: -1,
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
  reinforcementMessage: null,
  deathQuote: null,
  floatingNumbers: [],
  movingUnit: null,

  // Init
  initChapter: (chapter, seed = 12345, unitProgress?) => initChapter(get, set, chapter, seed, unitProgress),

  // Selection & navigation
  selectUnit: (unitId) => selectUnit(get, set, unitId),
  deselectUnit: () => deselectUnit(get, set),
  hoverTile: (pos) => hoverTile(get, set, pos),
  clickTile: (pos) => clickTile(get, set, pos),
  cancelAction: () => cancelAction(get, set),

  // Movement
  confirmMove: () => confirmMove(get, set),
  advanceMovement: () => advanceMovement(get, set),

  // Misc
  toggleDangerZone: () => toggleDangerZone(get, set),
  dismissDeathQuote: () => dismissDeathQuote(get, set),
  dismissReinforcementMessage: () => dismissReinforcementMessage(get, set),
  selectWeapon: (index) => selectWeapon(get, set, index),
  dismissLevelUp: () => dismissLevelUp(get, set),
  dismissHealResult: () => dismissHealResult(get, set),

  // Seize
  seize: () => seize(get, set),

  // Items
  useItem: (itemIndex) => useItem(get, set, itemIndex),

  // Village
  visitVillage: () => visitVillage(get, set),
  dismissVillageReward: () => dismissVillageReward(get, set),

  // Healing
  startHealTargeting: () => startHealTargeting(get, set),
  confirmHeal: (targetId) => confirmHeal(get, set, targetId),
  finishHealAnimation: () => finishHealAnimation(get, set),

  // Turn system
  endPlayerTurn: () => endPlayerTurn(get, set),
  dismissPhaseBanner: () => dismissPhaseBanner(get, set),

  // Combat
  startAttackTargeting: () => startAttackTargeting(get, set),
  selectAttackTarget: (targetId) => selectAttackTarget(get, set, targetId),
  confirmAttack: () => confirmAttack(get, set),
  advanceCombatAnimation: () => advanceCombatAnimation(get, set),
  finishCombat: () => finishCombat(get, set),

  // Enemy actions
  computeEnemyActions: () => computeEnemyActions(get, set),
  executeNextEnemyAction: () => executeNextEnemyAction(get, set),
  finishEnemyCombat: () => finishEnemyCombat(get, set),
  endEnemyTurn: () => endEnemyTurn(get, set),

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
