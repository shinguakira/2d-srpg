import type { Position } from '../../core/types';
import { posKey } from '../../core/types';
import {
  getMovementRange,
  getFullAttackRange,
  getPath,
  getAttackTilesFrom,
  getManhattanDistance,
} from '../../core/pathfinding';
import { calculateCombatForecast, getEffectiveWeaponRange } from '../../core/combat';
import { getWeatherMovPenalty, getWeatherTerrainCostMod } from '../../core/weather';
import type { GameState, GameActions } from '../gameStoreTypes';
import { EMPTY_SET, IDLE_RESET } from '../helpers/constants';
import { getClassFlags } from '../helpers/mapHelpers';
import { hasSkill } from '../../core/skills';
import { isExhausted, isNearRen } from '../../core/metaStats';
import { getTotalSupportBonuses } from '../../core/support';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function selectUnit(get: Get, set: Set, unitId: string) {
  const { units, gameMap, weather } = get();
  const unit = units.get(unitId);
  if (!unit) return;
  if (unit.faction !== 'player') return;
  if (unit.hasActed) return;
  if (unit.isCarried) return;

  const flags = getClassFlags(unit);
  const canPass = hasSkill(unit, 'pass');
  const weatherMods =
    weather !== 'clear'
      ? {
          movPenalty: getWeatherMovPenalty(weather, flags),
          terrainCostMod: getWeatherTerrainCostMod(weather, flags),
        }
      : undefined;

  // Exhausted units can only stay on current tile
  const moveRange = isExhausted(unit)
    ? new Set([posKey(unit.position)])
    : getMovementRange(unit, gameMap, units, flags, canPass, weatherMods);
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
    hoverMovementRange: EMPTY_SET,
    hoverAttackRange: EMPTY_SET,
    hoverUnitFaction: null,
  });
}

export function deselectUnit(_get: Get, set: Set) {
  set({ ...IDLE_RESET });
}

export function hoverTile(get: Get, set: Set, pos: Position | null) {
  const {
    playerAction,
    selectedUnitId,
    units,
    gameMap,
    movementRange,
    pendingPosition,
    pendingAttackTiles,
  } = get();

  if (playerAction === 'move_target' && selectedUnitId && pos) {
    const key = posKey(pos);
    if (movementRange.has(key)) {
      const unit = units.get(selectedUnitId)!;
      const flags = getClassFlags(unit);
      const path = getPath(unit.position, pos, unit, gameMap, units, flags);
      set({ hoveredTile: pos, movePath: path });
      return;
    }
  }

  // Show combat forecast when hovering enemy during attack_target or action_menu
  if (
    (playerAction === 'attack_target' || playerAction === 'action_menu') &&
    selectedUnitId &&
    pendingPosition &&
    pos
  ) {
    const key = posKey(pos);
    if (pendingAttackTiles.has(key)) {
      for (const unit of units.values()) {
        if (posKey(unit.position) === key && unit.faction === 'enemy') {
          const attacker = units.get(selectedUnitId)!;
          const { selectedWeaponIndex } = get();
          const weapon = attacker.inventory[selectedWeaponIndex] ?? attacker.equippedWeapon;
          const attackerTerrain = gameMap.tiles[pendingPosition.y][pendingPosition.x].terrain;
          const defenderTerrain = gameMap.tiles[unit.position.y][unit.position.x].terrain;
          const distance = getManhattanDistance(pendingPosition, unit.position);
          const atkAtPending = {
            ...attacker,
            position: { ...pendingPosition },
            equippedWeapon: weapon,
          };
          const attackerNearRen = attacker.id !== 'ren' && isNearRen(pendingPosition, units);
          const defenderNearRen = unit.id !== 'ren' && isNearRen(unit.position, units);
          const { weather: w, supportPairs: sp } = get();
          const attackerSupport = getTotalSupportBonuses(attacker.id, pendingPosition, units, sp);
          const defenderSupport = getTotalSupportBonuses(unit.id, unit.position, units, sp);
          const forecast = calculateCombatForecast(
            atkAtPending,
            unit,
            attackerTerrain,
            defenderTerrain,
            distance,
            { attackerNearRen, defenderNearRen, weather: w, attackerSupport, defenderSupport },
          );
          set({ hoveredTile: pos, movePath: [], combatForecast: forecast });
          return;
        }
      }
    }
    // Not hovering an enemy — clear forecast
    set({ hoveredTile: pos, movePath: [], combatForecast: null });
    return;
  }

  // Idle phase: compute hover range preview for unit under cursor
  if (playerAction === 'idle' && pos) {
    const prevHovered = get().hoveredTile;
    // Skip recompute if same tile
    if (prevHovered && prevHovered.x === pos.x && prevHovered.y === pos.y) return;

    const key = posKey(pos);
    let hoverUnit = null;
    for (const u of units.values()) {
      if (posKey(u.position) === key && !u.isHidden && !u.isCarried) {
        hoverUnit = u;
        break;
      }
    }

    if (hoverUnit) {
      const { weather } = get();
      const flags = getClassFlags(hoverUnit);
      const canPass = hasSkill(hoverUnit, 'pass');
      const weatherMods =
        weather !== 'clear'
          ? {
              movPenalty: getWeatherMovPenalty(weather, flags),
              terrainCostMod: getWeatherTerrainCostMod(weather, flags),
            }
          : undefined;
      const moveRange = isExhausted(hoverUnit)
        ? new Set([posKey(hoverUnit.position)])
        : getMovementRange(hoverUnit, gameMap, units, flags, canPass, weatherMods);
      const atkRange = getFullAttackRange(hoverUnit, moveRange, gameMap);
      set({
        hoveredTile: pos,
        movePath: [],
        hoverMovementRange: moveRange,
        hoverAttackRange: atkRange,
        hoverUnitFaction: hoverUnit.faction,
      });
      return;
    }

    set({
      hoveredTile: pos,
      movePath: [],
      hoverMovementRange: EMPTY_SET,
      hoverAttackRange: EMPTY_SET,
      hoverUnitFaction: null,
    });
    return;
  }

  set({ hoveredTile: pos, movePath: [] });
}

export function clickTile(get: Get, set: Set, pos: Position) {
  const {
    playerAction,
    selectedUnitId,
    units,
    gameMap,
    movementRange,
    pendingAttackTiles,
    pendingPosition,
  } = get();

  if (playerAction === 'idle') {
    const key = posKey(pos);
    for (const unit of units.values()) {
      if (posKey(unit.position) === key && unit.faction === 'player' && !unit.hasActed) {
        get().selectUnit(unit.id);
        return;
      }
    }
    get().openSystemMenu();
    return;
  }

  // Canto: click a tile in canto range to move there
  if (playerAction === 'canto_move' && selectedUnitId) {
    const key = posKey(pos);
    const { cantoRange } = get();
    if (cantoRange.has(key)) {
      get().confirmCantoMove(pos);
      return;
    }
    // Clicking outside canto range: stay in place (mark hasActed)
    const unit = units.get(selectedUnitId);
    if (unit) {
      get().confirmCantoMove(unit.position);
    }
    return;
  }

  if (playerAction === 'move_target' && selectedUnitId) {
    const key = posKey(pos);

    // Clicking another available player unit switches selection
    for (const unit of units.values()) {
      if (
        posKey(unit.position) === key &&
        unit.faction === 'player' &&
        !unit.hasActed &&
        unit.id !== selectedUnitId &&
        !unit.isCarried
      ) {
        get().selectUnit(unit.id);
        return;
      }
    }

    if (movementRange.has(key)) {
      const unit = units.get(selectedUnitId)!;
      const flags = getClassFlags(unit);
      const path = getPath(unit.position, pos, unit, gameMap, units, flags);
      const weapon = unit.inventory[0] ?? unit.equippedWeapon;
      const rangeOverride = getEffectiveWeaponRange(unit, weapon);
      const atkTiles = getAttackTilesFrom(pos, weapon, gameMap, rangeOverride);

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
        if (posKey(unit.position) === key && unit.faction === 'enemy') {
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
        if (
          posKey(unit.position) === key &&
          unit.faction === 'player' &&
          unit.id !== selectedUnitId
        ) {
          get().confirmHeal(unit.id);
          return;
        }
      }
    }
    // Clicked non-target — cancel back to action menu
    set({ playerAction: 'action_menu', healableTiles: EMPTY_SET });
    return;
  }

  if (playerAction === 'dance_target' && selectedUnitId && pendingPosition) {
    const key = posKey(pos);
    const { danceableTiles } = get();
    if (danceableTiles.has(key)) {
      for (const unit of units.values()) {
        if (
          posKey(unit.position) === key &&
          unit.faction === 'player' &&
          unit.id !== selectedUnitId
        ) {
          get().confirmDance(unit.id);
          return;
        }
      }
    }
    set({ playerAction: 'action_menu', danceableTiles: EMPTY_SET });
    return;
  }

  if (playerAction === 'steal_target' && selectedUnitId && pendingPosition) {
    const key = posKey(pos);
    const { stealableTiles } = get();
    if (stealableTiles.has(key)) {
      for (const unit of units.values()) {
        if (posKey(unit.position) === key && unit.faction === 'enemy') {
          get().confirmSteal(unit.id);
          return;
        }
      }
    }
    set({ playerAction: 'action_menu', stealableTiles: EMPTY_SET });
    return;
  }

  if (playerAction === 'trade_target' && selectedUnitId && pendingPosition) {
    const key = posKey(pos);
    const { tradableTiles } = get();
    if (tradableTiles.has(key)) {
      for (const unit of units.values()) {
        if (
          posKey(unit.position) === key &&
          unit.faction === 'player' &&
          unit.id !== selectedUnitId
        ) {
          // For now, do a simple "swap all items" trade. UI can be enhanced later.
          set({ tradePartnerId: unit.id });
          return;
        }
      }
    }
    set({ playerAction: 'action_menu', tradableTiles: EMPTY_SET, tradePartnerId: null });
    return;
  }

  if (playerAction === 'rescue_target' && selectedUnitId && pendingPosition) {
    const key = posKey(pos);
    const { rescuableTiles } = get();
    if (rescuableTiles.has(key)) {
      for (const unit of units.values()) {
        if (
          posKey(unit.position) === key &&
          unit.faction === 'player' &&
          unit.id !== selectedUnitId
        ) {
          get().confirmRescue(unit.id);
          return;
        }
      }
    }
    set({ playerAction: 'action_menu', rescuableTiles: EMPTY_SET });
    return;
  }

  if (playerAction === 'drop_target' && selectedUnitId && pendingPosition) {
    const key = posKey(pos);
    const { droppableTiles } = get();
    if (droppableTiles.has(key)) {
      get().confirmDrop(pos);
      return;
    }
    set({ playerAction: 'action_menu', droppableTiles: EMPTY_SET });
    return;
  }

  if (playerAction === 'action_menu' && selectedUnitId && pendingPosition) {
    // Clicking an enemy in attack range — auto-attack
    const key = posKey(pos);
    const atkTiles = get().pendingAttackTiles;
    if (atkTiles.has(key)) {
      for (const unit of units.values()) {
        if (posKey(unit.position) === key && unit.faction === 'enemy') {
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

  if (playerAction === 'system_menu') {
    get().closeSystemMenu();
    return;
  }

  if (playerAction === 'attack_target' && selectedUnitId) {
    // Go back to action menu
    set({ playerAction: 'action_menu', attackTargetId: null, combatForecast: null });
    return;
  }

  if (playerAction === 'heal_target' && selectedUnitId) {
    set({ playerAction: 'action_menu', healableTiles: EMPTY_SET });
    return;
  }

  if (playerAction === 'dance_target' && selectedUnitId) {
    set({ playerAction: 'action_menu', danceableTiles: EMPTY_SET });
    return;
  }

  if (playerAction === 'steal_target' && selectedUnitId) {
    set({ playerAction: 'action_menu', stealableTiles: EMPTY_SET });
    return;
  }

  if (playerAction === 'trade_target' && selectedUnitId) {
    set({ playerAction: 'action_menu', tradableTiles: EMPTY_SET, tradePartnerId: null });
    return;
  }

  if (playerAction === 'rescue_target' && selectedUnitId) {
    set({ playerAction: 'action_menu', rescuableTiles: EMPTY_SET });
    return;
  }

  if (playerAction === 'drop_target' && selectedUnitId) {
    set({ playerAction: 'action_menu', droppableTiles: EMPTY_SET });
    return;
  }

  if (playerAction === 'action_menu' && selectedUnitId) {
    set({ selectedWeaponIndex: 0 });
    get().selectUnit(selectedUnitId);
    return;
  }

  get().deselectUnit();
}
