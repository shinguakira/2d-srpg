import type { GameState, GameActions } from '../gameStoreTypes';
import { IDLE_RESET } from '../helpers/constants';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function openSystemMenu(get: Get, set: Set) {
  const { currentPhase, playerAction } = get();
  if (currentPhase !== 'player_phase') return;
  if (playerAction !== 'idle') return;
  set({ playerAction: 'system_menu' });
}

export function closeSystemMenu(_get: Get, set: Set) {
  set({ ...IDLE_RESET });
}
