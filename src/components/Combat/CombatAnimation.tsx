import { useEffect, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';

export function CombatAnimation() {
  const currentPhase = useGameStore((s) => s.currentPhase);
  const combatResult = useGameStore((s) => s.combatResult);
  const combatForecast = useGameStore((s) => s.combatForecast);
  const combatAnimationStep = useGameStore((s) => s.combatAnimationStep);
  const advanceCombatAnimation = useGameStore((s) => s.advanceCombatAnimation);

  const advance = useCallback(() => {
    advanceCombatAnimation();
  }, [advanceCombatAnimation]);

  // Auto-advance combat animation on a timer
  useEffect(() => {
    if (currentPhase !== 'combat_animation' || !combatResult) return;

    const timer = setTimeout(advance, 800);
    return () => clearTimeout(timer);
  }, [currentPhase, combatResult, combatAnimationStep, advance]);

  if (currentPhase !== 'combat_animation' || !combatResult || !combatForecast) return null;

  const currentHit = combatAnimationStep >= 0 && combatAnimationStep < combatResult.hits.length
    ? combatResult.hits[combatAnimationStep]
    : null;

  // Calculate running HP totals up to current step
  let atkHpDisplay = combatForecast.attacker.currentHp;
  let defHpDisplay = combatForecast.defender.currentHp;
  for (let i = 0; i <= combatAnimationStep && i < combatResult.hits.length; i++) {
    const hit = combatResult.hits[i];
    if (hit.attackerIsInitiator) {
      defHpDisplay = hit.targetHpAfter;
    } else {
      atkHpDisplay = hit.targetHpAfter;
    }
  }

  // Determine which side is player and which is enemy — always player left, enemy right
  const attackerIsPlayer = combatForecast.attacker.faction === 'player';
  const playerSide = attackerIsPlayer
    ? { info: combatForecast.attacker, hp: atkHpDisplay }
    : { info: combatForecast.defender, hp: defHpDisplay };
  const enemySide = attackerIsPlayer
    ? { info: combatForecast.defender, hp: defHpDisplay }
    : { info: combatForecast.attacker, hp: atkHpDisplay };

  // Determine who is currently attacking for the animation pulse
  const playerIsAttacking = currentHit
    ? (attackerIsPlayer ? currentHit.attackerIsInitiator : !currentHit.attackerIsInitiator)
    : false;
  const enemyIsAttacking = currentHit
    ? (attackerIsPlayer ? !currentHit.attackerIsInitiator : currentHit.attackerIsInitiator)
    : false;

  return (
    <div className="combat-animation" data-testid="combat-animation">
      <div className="combat-animation__modal">
        <div className="combat-animation__title">Combat</div>
        <div className="combat-animation__panel">
          {/* Player side (always left, always blue) */}
          <div className={`combat-animation__unit ${playerIsAttacking ? 'combat-animation__unit--attacking' : ''}`}>
            <div className="combat-animation__name">{playerSide.info.name}</div>
            <div className="combat-animation__hp-bar">
              <div
                className="combat-animation__hp-fill combat-animation__hp-fill--player"
                style={{ width: `${(playerSide.hp / playerSide.info.maxHp) * 100}%` }}
              />
            </div>
            <div className="combat-animation__hp-text">
              {playerSide.hp}/{playerSide.info.maxHp}
            </div>
          </div>

          {/* Center: damage display */}
          <div className="combat-animation__center">
            {currentHit && (
              <div
                className={`combat-animation__damage ${currentHit.crit ? 'combat-animation__damage--crit' : ''} ${!currentHit.hit ? 'combat-animation__damage--miss' : ''}`}
                data-testid="combat-damage-display"
              >
                {!currentHit.hit ? 'MISS' : currentHit.crit ? `${currentHit.damage} CRIT!` : currentHit.damage}
              </div>
            )}
            <div className="combat-animation__step">
              Hit {Math.min(combatAnimationStep + 1, combatResult.hits.length)} / {combatResult.hits.length}
            </div>
          </div>

          {/* Enemy side (always right, always red) */}
          <div className={`combat-animation__unit ${enemyIsAttacking ? 'combat-animation__unit--attacking' : ''}`}>
            <div className="combat-animation__name">{enemySide.info.name}</div>
            <div className="combat-animation__hp-bar">
              <div
                className="combat-animation__hp-fill combat-animation__hp-fill--enemy"
                style={{ width: `${(enemySide.hp / enemySide.info.maxHp) * 100}%` }}
              />
            </div>
            <div className="combat-animation__hp-text">
              {enemySide.hp}/{enemySide.info.maxHp}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
