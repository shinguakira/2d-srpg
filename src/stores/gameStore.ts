import { create } from 'zustand';
import type {
  GameMap,
  Unit,
  GamePhase,
  PlayerAction,
  Position,
  ChapterData,
  Tile,
  UnitProgress,
  VillageData,
  VillageReward,
} from '../core/types';
import { posKey } from '../core/types';
import { PLAYER_UNITS, ENEMY_UNITS } from '../data/units';
import { CLASSES } from '../data/classes';
import { WEAPONS } from '../data/weapons';
import { SeededRandom } from '../core/rng';
import { getMovementRange, getFullAttackRange, getPath, getAttackTilesFrom } from '../core/pathfinding';
import { calculateCombatForecast, resolveCombat } from '../core/combat';
import type { CombatForecast, CombatResult } from '../core/combat';
import { calculateExpGain, checkLevelUp, rollLevelUp, applyStatGains } from '../core/experience';
import type { StatGains } from '../core/experience';
import { decideAction } from '../core/ai';
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

  // Phase transitions
  phaseBanner: 'player_phase' | 'enemy_phase' | null;
  enemyActions: AIAction[];
  enemyActionIndex: number;

  chapterName: string;
  objectiveDescription: string;

  // Weapon selection
  selectedWeaponIndex: number;

  // Villages
  visitedVillages: Set<string>;
  villageReward: VillageReward | null;
  chapterVillages: VillageData[];
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

  // Weapon selection
  selectWeapon: (index: number) => void;

  // Village
  visitVillage: () => void;
  dismissVillageReward: () => void;

  // Turn system
  endPlayerTurn: () => void;
  dismissPhaseBanner: () => void;
  computeEnemyActions: () => void;
  executeNextEnemyAction: () => void;
  finishEnemyCombat: () => void;
  endEnemyTurn: () => void;
};

function buildMap(chapter: ChapterData): GameMap {
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

function placeUnits(chapter: ChapterData, map: GameMap, unitProgress?: Record<string, UnitProgress>): Map<string, Unit> {
  const units = new Map<string, Unit>();

  for (const placement of chapter.playerUnits) {
    const template = PLAYER_UNITS[placement.unitId];
    if (!template) continue;
    const progress = unitProgress?.[placement.unitId];
    const unit: Unit = {
      ...template,
      position: { ...placement.position },
      stats: progress ? { ...progress.stats } : { ...template.stats },
      currentHp: progress ? progress.stats.hp : template.currentHp,
      level: progress ? progress.level : template.level,
      exp: progress ? progress.exp : template.exp,
      equippedWeapon: { ...template.equippedWeapon },
      inventory: template.inventory.map((w) => ({ ...w })),
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
      stats: { ...template.stats },
      equippedWeapon: { ...template.equippedWeapon },
      inventory: template.inventory.map((w) => ({ ...w })),
    };
    units.set(unit.id, unit);
    map.tiles[placement.position.y][placement.position.x].occupantId = unit.id;
  }

  return units;
}

function getManhattanDistance(a: Position, b: Position): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function allPlayersDone(units: Map<string, Unit>): boolean {
  for (const u of units.values()) {
    if (u.faction === 'player' && !u.hasActed) return false;
  }
  return true;
}

const EMPTY_MAP: GameMap = { width: 0, height: 0, tiles: [] };
const EMPTY_SET = new Set<string>();

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

  initChapter: (chapter, seed = 12345, unitProgress?) => {
    const map = buildMap(chapter);
    const units = placeUnits(chapter, map, unitProgress);
    set({
      gameMap: map,
      units,
      currentPhase: 'player_phase',
      currentTurn: 1,
      playerAction: 'idle',
      rng: new SeededRandom(seed),
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
      chapterName: chapter.name,
      objectiveDescription: chapter.objective.description,
      selectedWeaponIndex: 0,
      visitedVillages: new Set<string>(),
      villageReward: null,
      chapterVillages: chapter.villages ?? [],
    });
  },

  selectUnit: (unitId) => {
    const { units, gameMap } = get();
    const unit = units.get(unitId);
    if (!unit) return;
    if (unit.faction !== 'player') return;
    if (unit.hasActed) return;

    const moveRange = getMovementRange(unit, gameMap, units);
    const atkRange = getFullAttackRange(unit, moveRange, gameMap);

    set({
      selectedUnitId: unitId,
      playerAction: 'move_target',
      movementRange: moveRange,
      attackRange: atkRange,
      movePath: [],
      pendingPosition: null,
      pendingAttackTiles: EMPTY_SET,
      combatForecast: null,
      combatResult: null,
      combatAnimationStep: -1,
      attackTargetId: null,
    });
  },

  deselectUnit: () => {
    set({
      selectedUnitId: null,
      playerAction: 'idle',
      movementRange: EMPTY_SET,
      attackRange: EMPTY_SET,
      movePath: [],
      pendingPosition: null,
      pendingAttackTiles: EMPTY_SET,
      combatForecast: null,
      combatResult: null,
      combatAnimationStep: -1,
      attackTargetId: null,
      selectedWeaponIndex: 0,
    });
  },

  hoverTile: (pos) => {
    const { playerAction, selectedUnitId, units, gameMap, movementRange, pendingPosition, pendingAttackTiles } = get();

    if (playerAction === 'move_target' && selectedUnitId && pos) {
      const key = posKey(pos);
      if (movementRange.has(key)) {
        const unit = units.get(selectedUnitId)!;
        const path = getPath(unit.position, pos, unit, gameMap, units);
        set({ hoveredTile: pos, movePath: path });
        return;
      }
    }

    // Show combat forecast when hovering enemy during attack_target or action_menu
    if ((playerAction === 'attack_target' || playerAction === 'action_menu') && selectedUnitId && pendingPosition && pos) {
      const key = posKey(pos);
      if (pendingAttackTiles.has(key)) {
        for (const unit of units.values()) {
          if (posKey(unit.position) === key && unit.faction !== 'player') {
            const attacker = units.get(selectedUnitId)!;
            const { selectedWeaponIndex } = get();
            const weapon = attacker.inventory[selectedWeaponIndex] ?? attacker.equippedWeapon;
            const attackerTerrain = gameMap.tiles[pendingPosition.y][pendingPosition.x].terrain;
            const defenderTerrain = gameMap.tiles[unit.position.y][unit.position.x].terrain;
            const distance = getManhattanDistance(pendingPosition, unit.position);
            const atkAtPending = { ...attacker, position: { ...pendingPosition }, equippedWeapon: weapon };
            const forecast = calculateCombatForecast(atkAtPending, unit, attackerTerrain, defenderTerrain, distance);
            set({ hoveredTile: pos, movePath: [], combatForecast: forecast });
            return;
          }
        }
      }
      // Not hovering an enemy — clear forecast
      set({ hoveredTile: pos, movePath: [], combatForecast: null });
      return;
    }

    set({ hoveredTile: pos, movePath: [] });
  },

  clickTile: (pos) => {
    const { playerAction, selectedUnitId, units, gameMap, movementRange, pendingAttackTiles, pendingPosition } = get();

    if (playerAction === 'idle') {
      const key = posKey(pos);
      for (const unit of units.values()) {
        if (posKey(unit.position) === key && unit.faction === 'player' && !unit.hasActed) {
          get().selectUnit(unit.id);
          return;
        }
      }
      return;
    }

    if (playerAction === 'move_target' && selectedUnitId) {
      const key = posKey(pos);

      // Clicking another available player unit switches selection
      for (const unit of units.values()) {
        if (posKey(unit.position) === key && unit.faction === 'player' && !unit.hasActed && unit.id !== selectedUnitId) {
          get().selectUnit(unit.id);
          return;
        }
      }

      if (movementRange.has(key)) {
        const unit = units.get(selectedUnitId)!;
        const path = getPath(unit.position, pos, unit, gameMap, units);
        const weapon = unit.inventory[0] ?? unit.equippedWeapon;
        const atkTiles = getAttackTilesFrom(pos, weapon, gameMap);

        set({
          playerAction: 'action_menu',
          pendingPosition: pos,
          movePath: path,
          pendingAttackTiles: atkTiles,
          selectedWeaponIndex: 0,
        });
        return;
      }

      // Clicked outside range — deselect
      get().deselectUnit();
      return;
    }

    if (playerAction === 'attack_target' && selectedUnitId && pendingPosition) {
      // Check if clicked on a valid enemy target
      const key = posKey(pos);
      if (pendingAttackTiles.has(key)) {
        for (const unit of units.values()) {
          if (posKey(unit.position) === key && unit.faction !== 'player') {
            get().selectAttackTarget(unit.id);
            return;
          }
        }
      }
      // Clicked non-target — cancel back to action menu
      set({ playerAction: 'action_menu', attackTargetId: null, combatForecast: null });
      return;
    }

    if (playerAction === 'action_menu' && selectedUnitId && pendingPosition) {
      // Clicking an enemy in attack range — auto-attack
      const key = posKey(pos);
      const atkTiles = get().pendingAttackTiles;
      if (atkTiles.has(key)) {
        for (const unit of units.values()) {
          if (posKey(unit.position) === key && unit.faction !== 'player') {
            get().selectAttackTarget(unit.id);
            return;
          }
        }
      }
      get().cancelAction();
      return;
    }
  },

  confirmMove: () => {
    const { selectedUnitId, pendingPosition, units, gameMap } = get();
    if (!selectedUnitId || !pendingPosition) return;

    const unit = units.get(selectedUnitId);
    if (!unit) return;

    const newUnits = new Map(units);
    const movedUnit = { ...unit, position: { ...pendingPosition }, hasActed: true };
    newUnits.set(selectedUnitId, movedUnit);

    // Update tile occupants
    const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));
    newTiles[unit.position.y][unit.position.x].occupantId = null;
    newTiles[pendingPosition.y][pendingPosition.x].occupantId = selectedUnitId;

    set({
      units: newUnits,
      gameMap: { ...gameMap, tiles: newTiles },
      selectedUnitId: null,
      playerAction: 'idle',
      movementRange: EMPTY_SET,
      attackRange: EMPTY_SET,
      movePath: [],
      pendingPosition: null,
      pendingAttackTiles: EMPTY_SET,
      combatForecast: null,
      attackTargetId: null,
    });

    // Auto end turn if all player units have acted
    if (allPlayersDone(newUnits)) {
      get().endPlayerTurn();
    }
  },

  cancelAction: () => {
    const { selectedUnitId, playerAction } = get();

    if (playerAction === 'attack_target' && selectedUnitId) {
      // Go back to action menu
      set({ playerAction: 'action_menu', attackTargetId: null, combatForecast: null });
      return;
    }

    if (playerAction === 'action_menu' && selectedUnitId) {
      set({ selectedWeaponIndex: 0 });
      get().selectUnit(selectedUnitId);
      return;
    }

    get().deselectUnit();
  },

  // ===== Weapon Selection =====

  selectWeapon: (index) => {
    const { selectedUnitId, units, pendingPosition, gameMap } = get();
    if (!selectedUnitId || !pendingPosition) return;

    const unit = units.get(selectedUnitId);
    if (!unit || index < 0 || index >= unit.inventory.length) return;

    const weapon = unit.inventory[index];
    const atkTiles = getAttackTilesFrom(pendingPosition, weapon, gameMap);

    set({
      selectedWeaponIndex: index,
      pendingAttackTiles: atkTiles,
      combatForecast: null,
    });
  },

  // ===== Village =====

  visitVillage: () => {
    const { selectedUnitId, pendingPosition, visitedVillages, chapterVillages } = get();
    if (!selectedUnitId || !pendingPosition) return;

    const key = posKey(pendingPosition);
    if (visitedVillages.has(key)) return;

    const village = chapterVillages.find((v) => posKey(v.position) === key);
    if (!village) return;

    set({
      playerAction: 'village_visit',
      villageReward: village.reward,
    });
  },

  dismissVillageReward: () => {
    const { selectedUnitId, pendingPosition, villageReward, units, gameMap, visitedVillages } = get();
    if (!selectedUnitId || !pendingPosition || !villageReward) return;

    // Move unit to pending position
    const newUnits = new Map(units);
    const unit = units.get(selectedUnitId)!;
    const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));
    newTiles[unit.position.y][unit.position.x].occupantId = null;
    newTiles[pendingPosition.y][pendingPosition.x].occupantId = selectedUnitId;

    // Add reward weapon to inventory
    const rewardWeapon = { ...WEAPONS[villageReward.weaponId] };
    const updatedUnit = {
      ...unit,
      position: { ...pendingPosition },
      hasActed: true,
      inventory: [...unit.inventory, rewardWeapon],
    };
    newUnits.set(selectedUnitId, updatedUnit);

    // Mark village as visited
    const newVisited = new Set(visitedVillages);
    newVisited.add(posKey(pendingPosition));

    set({
      units: newUnits,
      gameMap: { ...gameMap, tiles: newTiles },
      visitedVillages: newVisited,
      villageReward: null,
      selectedUnitId: null,
      playerAction: 'idle',
      movementRange: EMPTY_SET,
      attackRange: EMPTY_SET,
      movePath: [],
      pendingPosition: null,
      pendingAttackTiles: EMPTY_SET,
      combatForecast: null,
      attackTargetId: null,
      selectedWeaponIndex: 0,
    });

    // Auto end turn if all player units have acted
    if (allPlayersDone(newUnits)) {
      get().endPlayerTurn();
    }
  },

  // ===== Combat Actions =====

  startAttackTargeting: () => {
    const { selectedUnitId, pendingPosition, pendingAttackTiles, units } = get();
    if (!selectedUnitId || !pendingPosition) return;

    // Check if there are any enemies in attack range
    let hasTarget = false;
    for (const unit of units.values()) {
      if (unit.faction !== 'player' && pendingAttackTiles.has(posKey(unit.position))) {
        hasTarget = true;
        break;
      }
    }

    if (!hasTarget) return; // No targets available

    set({
      playerAction: 'attack_target',
      attackTargetId: null,
      combatForecast: null,
    });
  },

  selectAttackTarget: (targetId) => {
    const { selectedUnitId, pendingPosition, units, gameMap, selectedWeaponIndex } = get();
    if (!selectedUnitId || !pendingPosition) return;

    const attacker = units.get(selectedUnitId);
    const defender = units.get(targetId);
    if (!attacker || !defender) return;

    const weapon = attacker.inventory[selectedWeaponIndex] ?? attacker.equippedWeapon;
    const attackerTerrain = gameMap.tiles[pendingPosition.y][pendingPosition.x].terrain;
    const defenderTerrain = gameMap.tiles[defender.position.y][defender.position.x].terrain;
    const distance = getManhattanDistance(pendingPosition, defender.position);

    const atkAtPending = { ...attacker, position: { ...pendingPosition }, equippedWeapon: weapon };
    const forecast = calculateCombatForecast(atkAtPending, defender, attackerTerrain, defenderTerrain, distance);

    set({
      attackTargetId: targetId,
      combatForecast: forecast,
    });

    // Auto-confirm: skip the preview modal, go straight to combat
    get().confirmAttack();
  },

  confirmAttack: () => {
    const { selectedUnitId, attackTargetId, pendingPosition, combatForecast, units, gameMap, rng, selectedWeaponIndex } = get();
    if (!selectedUnitId || !attackTargetId || !pendingPosition || !combatForecast) return;

    // First, move the unit to pending position and equip selected weapon
    const newUnits = new Map(units);
    const attacker = units.get(selectedUnitId)!;
    const weapon = attacker.inventory[selectedWeaponIndex] ?? attacker.equippedWeapon;
    const movedAttacker = { ...attacker, position: { ...pendingPosition }, equippedWeapon: weapon };
    newUnits.set(selectedUnitId, movedAttacker);

    const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));
    newTiles[attacker.position.y][attacker.position.x].occupantId = null;
    newTiles[pendingPosition.y][pendingPosition.x].occupantId = selectedUnitId;

    // Resolve combat
    const result = resolveCombat(combatForecast, rng);

    set({
      units: newUnits,
      gameMap: { ...gameMap, tiles: newTiles },
      currentPhase: 'combat_animation',
      combatResult: result,
      combatAnimationStep: 0,
      movementRange: EMPTY_SET,
      attackRange: EMPTY_SET,
      movePath: [],
    });
  },

  advanceCombatAnimation: () => {
    const { combatResult, combatAnimationStep, selectedUnitId, units } = get();
    if (!combatResult) return;

    const nextStep = combatAnimationStep + 1;
    if (nextStep >= combatResult.hits.length) {
      // Animation complete — determine which finish function to call
      const attacker = selectedUnitId ? units.get(selectedUnitId) : null;
      if (attacker && attacker.faction === 'enemy') {
        get().finishEnemyCombat();
      } else {
        get().finishCombat();
      }
    } else {
      set({ combatAnimationStep: nextStep });
    }
  },

  finishCombat: () => {
    const { selectedUnitId, attackTargetId, combatResult, units, gameMap, rng } = get();
    if (!selectedUnitId || !attackTargetId || !combatResult) return;

    const newUnits = new Map(units);
    const attacker = newUnits.get(selectedUnitId)!;
    const defender = newUnits.get(attackTargetId)!;
    const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));

    // Apply HP changes
    const updatedAttacker = { ...attacker, currentHp: combatResult.attackerHpAfter, hasActed: true };
    const updatedDefender = { ...defender, currentHp: combatResult.defenderHpAfter };

    newUnits.set(selectedUnitId, updatedAttacker);
    newUnits.set(attackTargetId, updatedDefender);

    // Remove dead units
    if (combatResult.defenderDied) {
      newUnits.delete(attackTargetId);
      newTiles[defender.position.y][defender.position.x].occupantId = null;
    }
    if (combatResult.attackerDied) {
      newUnits.delete(selectedUnitId);
      newTiles[attacker.position.y][attacker.position.x].occupantId = null;
    }

    // Calculate EXP for player attacker (only if attacker survived)
    let expGain = 0;
    let gains: StatGains | null = null;
    let levelUpUnit: string | null = null;

    if (!combatResult.attackerDied && attacker.faction === 'player') {
      expGain = calculateExpGain(attacker, defender, combatResult.defenderDied);
      const levelCheck = checkLevelUp(attacker.exp, expGain);
      const updated = newUnits.get(selectedUnitId)!;

      if (levelCheck.leveled) {
        const cls = CLASSES[attacker.classId];
        if (cls) {
          gains = rollLevelUp(cls.growthRates, rng);
          const newStats = applyStatGains(updated.stats, gains);
          newUnits.set(selectedUnitId, {
            ...updated,
            exp: levelCheck.newExp,
            level: updated.level + 1,
            stats: newStats,
            currentHp: updated.currentHp + gains.hp, // heal by HP gain
          });
          levelUpUnit = selectedUnitId;
        }
      } else {
        newUnits.set(selectedUnitId, { ...updated, exp: levelCheck.newExp });
      }
    }

    // Check win/lose conditions
    let allEnemiesDead = true;
    let allPlayersDead = true;
    for (const u of newUnits.values()) {
      if (u.faction === 'enemy') allEnemiesDead = false;
      if (u.faction === 'player') allPlayersDead = false;
    }

    const nextPhase: GamePhase = allEnemiesDead || allPlayersDead ? 'game_over' : 'player_phase';

    set({
      units: newUnits,
      gameMap: { ...gameMap, tiles: newTiles },
      currentPhase: nextPhase,
      playerAction: 'idle',
      selectedUnitId: null,
      combatForecast: null,
      combatResult: null,
      combatAnimationStep: -1,
      attackTargetId: null,
      pendingPosition: null,
      pendingAttackTiles: EMPTY_SET,
      levelUpGains: gains,
      levelUpUnitId: levelUpUnit,
      selectedWeaponIndex: 0,
    });

    // Auto end turn if all player units have acted (and game isn't over)
    if (nextPhase === 'player_phase' && !gains && allPlayersDone(get().units)) {
      get().endPlayerTurn();
    }
  },

  dismissLevelUp: () => {
    set({ levelUpGains: null, levelUpUnitId: null });
    // Auto end turn after level up if all units done
    const { currentPhase, units } = get();
    if (currentPhase === 'player_phase' && allPlayersDone(units)) {
      get().endPlayerTurn();
    }
  },

  // ===== Turn System =====

  endPlayerTurn: () => {
    const { currentPhase } = get();
    if (currentPhase !== 'player_phase') return;

    // Deselect everything
    set({
      selectedUnitId: null,
      playerAction: 'idle',
      movementRange: EMPTY_SET,
      attackRange: EMPTY_SET,
      movePath: [],
      pendingPosition: null,
      pendingAttackTiles: EMPTY_SET,
      combatForecast: null,
      attackTargetId: null,
      phaseBanner: 'enemy_phase',
    });
  },

  dismissPhaseBanner: () => {
    const { phaseBanner, units } = get();

    if (phaseBanner === 'enemy_phase') {
      // Check if there are any enemies left
      let hasEnemy = false;
      for (const u of units.values()) {
        if (u.faction === 'enemy') { hasEnemy = true; break; }
      }
      if (hasEnemy) {
        set({ phaseBanner: null, currentPhase: 'enemy_phase' });
        get().computeEnemyActions();
      } else {
        set({ phaseBanner: null, currentPhase: 'game_over' });
      }
    } else if (phaseBanner === 'player_phase') {
      // Reset player units' hasActed, start player phase
      const newUnits = new Map(get().units);
      for (const [id, unit] of newUnits) {
        if (unit.faction === 'player' && unit.hasActed) {
          newUnits.set(id, { ...unit, hasActed: false });
        }
      }
      set({
        phaseBanner: null,
        currentPhase: 'player_phase',
        units: newUnits,
      });
    }
  },

  computeEnemyActions: () => {
    const { units, gameMap } = get();
    const actions: AIAction[] = [];

    // Use a mutable copy of units so each enemy sees previous enemies' planned positions
    const simUnits = new Map(units);
    for (const [id, u] of simUnits) {
      simUnits.set(id, { ...u });
    }

    for (const unit of units.values()) {
      if (unit.faction === 'enemy' && !unit.hasActed) {
        const action = decideAction(simUnits.get(unit.id)!, gameMap, simUnits);
        actions.push(action);

        // Simulate the move so the next enemy sees the updated position
        const simUnit = simUnits.get(unit.id)!;
        simUnits.set(unit.id, { ...simUnit, position: { ...action.moveTo } });
      }
    }

    set({ enemyActions: actions, enemyActionIndex: 0 });
  },

  executeNextEnemyAction: () => {
    const { enemyActions, enemyActionIndex, units, gameMap, rng } = get();

    if (enemyActionIndex < 0 || enemyActionIndex >= enemyActions.length) {
      // All enemies done — end enemy turn
      get().endEnemyTurn();
      return;
    }

    const action = enemyActions[enemyActionIndex];
    const unit = units.get(action.unitId);
    if (!unit) {
      // Unit died during earlier combat, skip
      set({ enemyActionIndex: enemyActionIndex + 1 });
      return;
    }

    // Move the unit — check destination isn't already occupied
    const newUnits = new Map(units);
    const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));

    let destination = action.moveTo;
    const destOccupant = newTiles[destination.y][destination.x].occupantId;
    if (destOccupant && destOccupant !== unit.id) {
      // Destination occupied — stay in place
      destination = unit.position;
    }

    if (posKey(unit.position) !== posKey(destination)) {
      newTiles[unit.position.y][unit.position.x].occupantId = null;
      newTiles[destination.y][destination.x].occupantId = unit.id;
    }
    const movedUnit = { ...unit, position: { ...destination } };
    newUnits.set(unit.id, movedUnit);

    if (action.attackTargetId && action.forecast) {
      const target = newUnits.get(action.attackTargetId);
      if (!target) {
        // Target already dead, just move and mark acted
        newUnits.set(unit.id, { ...movedUnit, hasActed: true });
        set({
          units: newUnits,
          gameMap: { ...gameMap, tiles: newTiles },
          enemyActionIndex: enemyActionIndex + 1,
        });
        return;
      }

      // Recalculate forecast with actual current HP and real destination
      const attackerTerrain = newTiles[destination.y][destination.x].terrain;
      const defenderTerrain = newTiles[target.position.y][target.position.x].terrain;
      const distance = Math.abs(destination.x - target.position.x) + Math.abs(destination.y - target.position.y);

      // If enemy couldn't move to attack range, skip combat
      if (distance < unit.equippedWeapon.minRange || distance > unit.equippedWeapon.maxRange) {
        newUnits.set(unit.id, { ...movedUnit, hasActed: true });
        set({
          units: newUnits,
          gameMap: { ...gameMap, tiles: newTiles },
          enemyActionIndex: enemyActionIndex + 1,
        });
        return;
      }

      const forecast = calculateCombatForecast(movedUnit, target, attackerTerrain, defenderTerrain, distance);
      const result = resolveCombat(forecast, rng);

      set({
        units: newUnits,
        gameMap: { ...gameMap, tiles: newTiles },
        currentPhase: 'combat_animation',
        selectedUnitId: unit.id,
        attackTargetId: action.attackTargetId,
        combatForecast: forecast,
        combatResult: result,
        combatAnimationStep: 0,
      });
    } else {
      // No attack — just move and mark acted
      newUnits.set(unit.id, { ...movedUnit, hasActed: true });
      set({
        units: newUnits,
        gameMap: { ...gameMap, tiles: newTiles },
        enemyActionIndex: enemyActionIndex + 1,
      });
    }
  },

  finishEnemyCombat: () => {
    const { selectedUnitId, attackTargetId, combatResult, units, gameMap, enemyActionIndex } = get();
    if (!selectedUnitId || !attackTargetId || !combatResult) return;

    const newUnits = new Map(units);
    const attacker = newUnits.get(selectedUnitId)!;
    const defender = newUnits.get(attackTargetId)!;
    const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));

    // Apply HP changes
    newUnits.set(selectedUnitId, { ...attacker, currentHp: combatResult.attackerHpAfter, hasActed: true });
    newUnits.set(attackTargetId, { ...defender, currentHp: combatResult.defenderHpAfter });

    // Remove dead units
    if (combatResult.defenderDied) {
      newUnits.delete(attackTargetId);
      newTiles[defender.position.y][defender.position.x].occupantId = null;
    }
    if (combatResult.attackerDied) {
      newUnits.delete(selectedUnitId);
      newTiles[attacker.position.y][attacker.position.x].occupantId = null;
    }

    // Check win/lose
    let allEnemiesDead = true;
    let allPlayersDead = true;
    for (const u of newUnits.values()) {
      if (u.faction === 'enemy') allEnemiesDead = false;
      if (u.faction === 'player') allPlayersDead = false;
    }

    if (allEnemiesDead || allPlayersDead) {
      set({
        units: newUnits,
        gameMap: { ...gameMap, tiles: newTiles },
        currentPhase: 'game_over',
        combatForecast: null,
        combatResult: null,
        combatAnimationStep: -1,
        selectedUnitId: null,
        attackTargetId: null,
      });
      return;
    }

    set({
      units: newUnits,
      gameMap: { ...gameMap, tiles: newTiles },
      currentPhase: 'enemy_phase',
      combatForecast: null,
      combatResult: null,
      combatAnimationStep: -1,
      selectedUnitId: null,
      attackTargetId: null,
      enemyActionIndex: enemyActionIndex + 1,
    });
  },

  endEnemyTurn: () => {
    // Check win/lose before transitioning
    const { units } = get();
    let hasEnemy = false;
    let hasPlayer = false;
    for (const u of units.values()) {
      if (u.faction === 'enemy') hasEnemy = true;
      if (u.faction === 'player') hasPlayer = true;
    }

    if (!hasEnemy || !hasPlayer) {
      set({ currentPhase: 'game_over', enemyActions: [], enemyActionIndex: -1 });
      return;
    }

    // Reset all enemy hasActed
    const newUnits = new Map(units);
    for (const [id, unit] of newUnits) {
      if (unit.faction === 'enemy' && unit.hasActed) {
        newUnits.set(id, { ...unit, hasActed: false });
      }
    }

    set({
      units: newUnits,
      currentPhase: 'player_phase',
      currentTurn: get().currentTurn + 1,
      playerAction: 'idle',
      enemyActions: [],
      enemyActionIndex: -1,
      phaseBanner: 'player_phase',
    });
  },

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
