import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useUIStore, getScaledDuration } from '../stores/uiStore';

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
  const eventDialogue = useGameStore((s) => s.eventDialogue);
  const allyActions = useGameStore((s) => s.allyActions);
  const allyActionIndex = useGameStore((s) => s.allyActionIndex);
  const executeNextAllyAction = useGameStore((s) => s.executeNextAllyAction);
  const animationSpeed = useUIStore((s) => s.animationSpeed);

  // Execute enemy actions sequentially
  useEffect(() => {
    if (currentPhase !== 'enemy_phase') return;
    if (enemyActionIndex < 0) return;
    if (combatResult) return; // combat animation in progress
    if (deathQuote) return; // death quote showing — pause everything
    if (movingUnit) return; // walking animation in progress
    if (eventDialogue) return; // event dialogue showing — pause everything

    if (enemyActionIndex >= enemyActions.length) {
      executeNextEnemyAction();
      return;
    }

    // Short delay between enemy actions so player can see each move
    const timer = setTimeout(
      () => {
        executeNextEnemyAction();
      },
      getScaledDuration(400, animationSpeed),
    );

    return () => clearTimeout(timer);
  }, [
    currentPhase,
    enemyActionIndex,
    enemyActions.length,
    combatResult,
    deathQuote,
    movingUnit,
    eventDialogue,
    executeNextEnemyAction,
    animationSpeed,
  ]);

  // Execute auto-battle actions sequentially
  useEffect(() => {
    if (!isAutoBattle) return;
    if (currentPhase !== 'player_phase') return;
    if (autoBattleIndex < 0) return;
    if (combatResult) return;
    if (expBarData) return;
    if (levelUpGains) return;
    if (deathQuote) return;
    if (movingUnit) return; // walking animation in progress
    if (eventDialogue) return; // event dialogue showing — pause everything

    if (autoBattleIndex >= autoBattleActions.length) {
      executeNextAutoAction();
      return;
    }

    const timer = setTimeout(
      () => {
        executeNextAutoAction();
      },
      getScaledDuration(400, animationSpeed),
    );

    return () => clearTimeout(timer);
  }, [
    isAutoBattle,
    currentPhase,
    autoBattleIndex,
    autoBattleActions.length,
    combatResult,
    expBarData,
    levelUpGains,
    deathQuote,
    movingUnit,
    eventDialogue,
    executeNextAutoAction,
    animationSpeed,
  ]);

  // Execute ally actions sequentially
  useEffect(() => {
    if (currentPhase !== 'ally_phase') return;
    if (allyActionIndex < 0) return;
    if (combatResult) return;
    if (deathQuote) return;
    if (movingUnit) return;
    if (eventDialogue) return;

    if (allyActionIndex >= allyActions.length) {
      executeNextAllyAction();
      return;
    }

    const timer = setTimeout(
      () => {
        executeNextAllyAction();
      },
      getScaledDuration(400, animationSpeed),
    );

    return () => clearTimeout(timer);
  }, [
    currentPhase,
    allyActionIndex,
    allyActions.length,
    combatResult,
    deathQuote,
    movingUnit,
    eventDialogue,
    executeNextAllyAction,
    animationSpeed,
  ]);
}
