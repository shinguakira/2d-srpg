import type { GameState, GameActions } from '../gameStoreTypes';
import { getDangerZone } from '../../core/pathfinding';
import { getAttackTilesFrom } from '../../core/pathfinding';
import type { Unit } from '../../core/types';
import { EMPTY_SET } from '../helpers/constants';
import { allPlayersDone } from '../helpers/mapHelpers';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function toggleDangerZone(get: Get, set: Set) {
  const { showDangerZone, units, gameMap } = get();
  if (showDangerZone) {
    set({ showDangerZone: false, dangerZone: EMPTY_SET });
    return;
  }
  // Compute danger zone from all living enemies
  const enemies: Unit[] = [];
  for (const u of units.values()) {
    if (u.faction === 'enemy') enemies.push(u);
  }
  const zone = getDangerZone(enemies, gameMap, units);
  set({ showDangerZone: true, dangerZone: zone });
}

export function dismissDeathQuote(_get: Get, set: Set) {
  set({ deathQuote: null });
}

export function dismissReinforcementMessage(_get: Get, set: Set) {
  set({ reinforcementMessage: null });
}

export function selectWeapon(get: Get, set: Set, index: number) {
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
}

export function dismissLevelUp(get: Get, set: Set) {
  set({ levelUpGains: null, levelUpUnitId: null });
  // Auto end turn after level up if all units done
  const { currentPhase, units } = get();
  if (currentPhase === 'player_phase' && allPlayersDone(units)) {
    get().endPlayerTurn();
  }
}

export function dismissExpBar(get: Get, set: Set) {
  const { levelUpGains, levelUpUnitId } = get();
  set({ expBarData: null });

  // If no level-up pending, check auto-end turn
  if (!levelUpGains && !levelUpUnitId) {
    const { currentPhase, deathQuote, units } = get();
    if (currentPhase === 'player_phase' && !deathQuote && allPlayersDone(units)) {
      get().endPlayerTurn();
    }
  }
}

export function dismissHealResult(_get: Get, set: Set) {
  set({ healResult: null });
}
