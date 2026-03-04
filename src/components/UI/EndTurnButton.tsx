import { useGameStore } from '../../stores/gameStore';

export function EndTurnButton() {
  const currentPhase = useGameStore((s) => s.currentPhase);
  const endPlayerTurn = useGameStore((s) => s.endPlayerTurn);

  // Show during player phase always (not just idle)
  if (currentPhase !== 'player_phase') return null;

  return (
    <button
      className="end-turn-btn"
      data-testid="end-turn-button"
      onClick={endPlayerTurn}
    >
      End Turn
    </button>
  );
}
