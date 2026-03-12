import type { Position } from '../../core/types';
import { posKey } from '../../core/types';
import { getMovementRange, getFullAttackRange, getPath, getAttackTilesFrom, getManhattanDistance } from '../../core/pathfinding';
import { calculateCombatForecast } from '../../core/combat';
import type { GameState, GameActions } from '../gameStoreTypes';
import { EMPTY_SET, IDLE_RESET } from '../helpers/constants';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function selectUnit(get: Get, set: Set, unitId: string) {
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
}

export function deselectUnit(_get: Get, set: Set) {
  set({ ...IDLE_RESET });
}

export function hoverTile(get: Get, set: Set, pos: Position | null) {
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
}

export function clickTile(get: Get, set: Set, pos: Position) {
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

  if (playerAction === 'heal_target' && selectedUnitId && pendingPosition) {
    const key = posKey(pos);
    const { healableTiles } = get();
    if (healableTiles.has(key)) {
      for (const unit of units.values()) {
        if (posKey(unit.position) === key && unit.faction === 'player' && unit.id !== selectedUnitId) {
          get().confirmHeal(unit.id);
          return;
        }
      }
    }
    // Clicked non-target — cancel back to action menu
    set({ playerAction: 'action_menu', healableTiles: EMPTY_SET });
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
}

export function cancelAction(get: Get, set: Set) {
  const { selectedUnitId, playerAction } = get();

  if (playerAction === 'attack_target' && selectedUnitId) {
    // Go back to action menu
    set({ playerAction: 'action_menu', attackTargetId: null, combatForecast: null });
    return;
  }

  if (playerAction === 'heal_target' && selectedUnitId) {
    set({ playerAction: 'action_menu', healableTiles: EMPTY_SET });
    return;
  }

  if (playerAction === 'action_menu' && selectedUnitId) {
    set({ selectedWeaponIndex: 0 });
    get().selectUnit(selectedUnitId);
    return;
  }

  get().deselectUnit();
}
