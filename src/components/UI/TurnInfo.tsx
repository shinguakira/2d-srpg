import { useGameStore } from '../../stores/gameStore';

export function TurnInfo() {
  const currentTurn = useGameStore((s) => s.currentTurn);
  const currentPhase = useGameStore((s) => s.currentPhase);
  const chapterName = useGameStore((s) => s.chapterName);
  const objectiveDescription = useGameStore((s) => s.objectiveDescription);

  const phaseLabel = currentPhase === 'player_phase' ? 'Player Phase' :
                     currentPhase === 'enemy_phase' ? 'Enemy Phase' :
                     currentPhase === 'combat_animation' ? 'Combat' :
                     'Game Over';

  return (
    <div className="turn-info" data-testid="turn-info">
      <div className="turn-info__chapter">{chapterName}</div>
      <div className="turn-info__turn">Turn {currentTurn}</div>
      <div
        className="turn-info__phase"
        data-testid="phase-indicator"
        data-phase={currentPhase}
      >
        {phaseLabel}
      </div>
      <div className="turn-info__objective">{objectiveDescription}</div>
    </div>
  );
}
