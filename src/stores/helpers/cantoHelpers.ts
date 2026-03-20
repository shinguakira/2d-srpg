import { hasSkill } from '../../core/skills';
import { getMovementRange } from '../../core/pathfinding';
import type { GameState, GameActions } from '../gameStoreTypes';
import { getClassFlags } from './mapHelpers';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

/**
 * Check if a unit should enter Canto state after combat.
 * If Canto applies, sets canto state and returns true.
 * Otherwise returns false — caller should proceed with IDLE_RESET.
 */
export function tryCantoAfterCombat(get: Get, set: Set, unitId: string): boolean {
  const { units, gameMap, currentPhase, deathQuote, eventDialogue } = get();
  if (currentPhase !== 'player_phase') return false;
  if (deathQuote || eventDialogue) return false;

  const unit = units.get(unitId);
  if (!unit || unit.faction !== 'player') return false;
  if (!hasSkill(unit, 'canto')) return false;

  const remainingMov = Math.max(1, Math.floor(unit.stats.mov / 2));
  const cantoUnit = { ...unit, stats: { ...unit.stats, mov: remainingMov } };
  const flags = getClassFlags(cantoUnit);
  const cantoRange = getMovementRange(cantoUnit, gameMap, units, flags);

  if (cantoRange.size === 0) return false;

  set({
    selectedUnitId: unitId,
    playerAction: 'canto_move',
    cantoRange,
    cantoRemainingMov: remainingMov,
  });
  return true;
}
