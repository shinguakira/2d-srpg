import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';

/**
 * Orchestrates the enemy phase and auto-battle.
 * Pauses when overlays (combat animation, death quote, EXP bar, level-up) are active.
 */
export function useGameLoop() {
  const currentPhase = useGameStore((s) => s.currentPhase);
  const enemyActions = useGameStore((s) => s.enemyActions);
  const enemyActionIndex = useGameStore((s) => s.enemyActionIndex);
  const combatResult = useGameStore((s) => s.combatResult);
  const executeNextEnemyAction = useGameStore((s) => s.executeNextEnemyAction);
  const isAutoBattle = useGameStore((s) => s.isAutoBattle);
  const autoBattleActions = useGameStore((s) => s.autoBattleActions);
  const autoBattleIndex = useGameStore((s) => s.autoBattleIndex);
  const executeNextAutoAction = useGameStore((s) => s.executeNextAutoAction);
  const expBarData = useGameStore((s) => s.expBarData);
  const levelUpGains = useGameStore((s) => s.levelUpGains);
  const deathQuote = useGameStore((s) => s.deathQuote);
  const movingUnit = useGameStore((s) => s.movingUnit);

  // Execute enemy actions sequentially
  useEffect(() => {
    if (currentPhase !== 'enemy_phase') return;
    if (enemyActionIndex < 0) return;
    if (combatResult) return; // combat animation in progress
    if (deathQuote) return; // death quote showing — pause everything
    if (movingUnit) return; // walking animation in progress

    if (enemyActionIndex >= enemyActions.length) {
      executeNextEnemyAction();
      return;
    }

    // Longer delay (1200ms) so player can see each enemy move clearly
    const timer = setTimeout(() => {
      executeNextEnemyAction();
    }, 1200);

    return () => clearTimeout(timer);
  }, [currentPhase, enemyActionIndex, enemyActions.length, combatResult, deathQuote, movingUnit, executeNextEnemyAction]);

  // Execute auto-battle actions sequentially
  useEffect(() => {
    if (!isAutoBattle) return;
    if (currentPhase !== 'player_phase') return;
    if (autoBattleIndex < 0) return;
    if (combatResult) return;
    if (expBarData) return;
    if (levelUpGains) return;
    if (deathQuote) return;

    if (autoBattleIndex >= autoBattleActions.length) {
      executeNextAutoAction();
      return;
    }

    const timer = setTimeout(() => {
      executeNextAutoAction();
    }, 600);

    return () => clearTimeout(timer);
  }, [isAutoBattle, currentPhase, autoBattleIndex, autoBattleActions.length, combatResult, expBarData, levelUpGains, deathQuote, executeNextAutoAction]);
}
