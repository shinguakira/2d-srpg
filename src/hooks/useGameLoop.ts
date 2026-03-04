import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';

/**
 * Orchestrates the enemy phase.
 * When in enemy_phase with pending actions, executes them one by one with delays.
 * When combat animation finishes during enemy phase, continues to next enemy.
 */
export function useGameLoop() {
  const currentPhase = useGameStore((s) => s.currentPhase);
  const enemyActions = useGameStore((s) => s.enemyActions);
  const enemyActionIndex = useGameStore((s) => s.enemyActionIndex);
  const combatResult = useGameStore((s) => s.combatResult);
  const executeNextEnemyAction = useGameStore((s) => s.executeNextEnemyAction);

  // Execute enemy actions sequentially
  useEffect(() => {
    if (currentPhase !== 'enemy_phase') return;
    if (enemyActionIndex < 0) return;
    if (combatResult) return; // combat animation in progress

    if (enemyActionIndex >= enemyActions.length) {
      // All done — endEnemyTurn is called by executeNextEnemyAction
      executeNextEnemyAction();
      return;
    }

    const timer = setTimeout(() => {
      executeNextEnemyAction();
    }, 600);

    return () => clearTimeout(timer);
  }, [currentPhase, enemyActionIndex, enemyActions.length, combatResult, executeNextEnemyAction]);
}
