import { useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';

export function PhaseBanner() {
  const phaseBanner = useGameStore((s) => s.phaseBanner);
  const currentTurn = useGameStore((s) => s.currentTurn);
  const dismissPhaseBanner = useGameStore((s) => s.dismissPhaseBanner);

  // Auto-dismiss after 2 seconds (up from 1.5s for more drama)
  useEffect(() => {
    if (!phaseBanner) return;
    const timer = setTimeout(dismissPhaseBanner, 2000);
    return () => clearTimeout(timer);
  }, [phaseBanner, dismissPhaseBanner]);

  if (!phaseBanner) return null;

  const isPlayer = phaseBanner === 'player_phase';

  return (
    <div
      className={`phase-banner ${isPlayer ? 'phase-banner--player' : 'phase-banner--enemy'}`}
      data-testid="phase-banner"
      data-phase={phaseBanner}
    >
      <div className="phase-banner__text">
        {isPlayer ? 'Player Phase' : 'Enemy Phase'}
      </div>
      <div className="phase-banner__turn">
        Turn {currentTurn}
      </div>
    </div>
  );
}
