import { useGameStore } from '../../stores/gameStore';

export function EndTurnButton() {
  const currentPhase = useGameStore((s) => s.currentPhase);
  const endPlayerTurn = useGameStore((s) => s.endPlayerTurn);
  const startAutoBattle = useGameStore((s) => s.startAutoBattle);
  const isAutoBattle = useGameStore((s) => s.isAutoBattle);

  // Show during player phase always (not just idle)
  if (currentPhase !== 'player_phase') return null;

  return (
    <div className="end-turn-btns">
      <button
        className="end-turn-btn"
        data-testid="auto-battle-button"
        onClick={startAutoBattle}
        disabled={isAutoBattle}
      >
        {isAutoBattle ? 'Auto...' : 'Auto Battle'}
      </button>
      <button
        className="end-turn-btn"
        data-testid="end-turn-button"
        onClick={endPlayerTurn}
      >
        End Turn
      </button>
    </div>
  );
}
