import { useGameStore } from '../../stores/gameStore';

export function TurnInfo() {
  const currentTurn = useGameStore((s) => s.currentTurn);
  const currentPhase = useGameStore((s) => s.currentPhase);
  const chapterName = useGameStore((s) => s.chapterName);
  const objectiveDescription = useGameStore((s) => s.objectiveDescription);
  const showDangerZone = useGameStore((s) => s.showDangerZone);
  const chapterData = useGameStore((s) => s.chapterData);
  const units = useGameStore((s) => s.units);

  const phaseLabel = currentPhase === 'player_phase' ? 'Player Phase' :
                     currentPhase === 'enemy_phase' ? 'Enemy Phase' :
                     currentPhase === 'combat_animation' ? 'Combat' :
                     'Game Over';

  // Build objective status text
  let objectiveText = objectiveDescription;
  let objectiveReady = false;
  if (chapterData) {
    if (chapterData.objective.type === 'rout') {
      let enemyCount = 0;
      let totalEnemies = chapterData.enemyUnits.length;
      for (const u of units.values()) {
        if (u.faction === 'enemy') enemyCount++;
      }
      const defeated = totalEnemies - enemyCount;
      objectiveText = `Rout: ${defeated}/${totalEnemies} defeated`;
      if (enemyCount === 0) objectiveReady = true;
    } else if (chapterData.objective.type === 'seize') {
      // Check if boss is still alive
      let bossAlive = false;
      for (const u of units.values()) {
        if (u.faction === 'enemy' && u.aiBehavior?.type === 'boss') {
          bossAlive = true;
          break;
        }
      }
      objectiveText = bossAlive ? 'Seize the throne' : 'Seize the throne \u2713';
      objectiveReady = !bossAlive;
    }
  }

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
      <div
        className="turn-info__objective"
        data-testid="objective-text"
        style={{
          color: objectiveReady ? '#fbbf24' : undefined,
          textShadow: objectiveReady ? '0 0 8px rgba(251,191,36,0.4)' : undefined,
        }}
      >
        {objectiveText}
      </div>
      {showDangerZone && (
        <div
          className="turn-info__danger-badge"
          data-testid="danger-zone-badge"
          style={{
            background: 'rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '1px',
          }}
        >
          DANGER
        </div>
      )}
    </div>
  );
}
