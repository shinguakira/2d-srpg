import { useGameStore } from '../../stores/gameStore';

export function CombatPreview() {
  const forecast = useGameStore((s) => s.combatForecast);
  const playerAction = useGameStore((s) => s.playerAction);

  // Show forecast when hovering enemies during attack_target or action_menu
  if ((playerAction !== 'attack_target' && playerAction !== 'action_menu') || !forecast) return null;

  // Always show player on left, enemy on right
  const attackerIsPlayer = forecast.attacker.faction === 'player';

  const playerUnit = attackerIsPlayer ? forecast.attacker : forecast.defender;
  const enemyUnit = attackerIsPlayer ? forecast.defender : forecast.attacker;

  const playerDmg = attackerIsPlayer ? forecast.attackerDamage : forecast.defenderDamage;
  const playerHit = attackerIsPlayer ? forecast.attackerHit : forecast.defenderHit;
  const playerCrit = attackerIsPlayer ? forecast.attackerCrit : forecast.defenderCrit;
  const playerDouble = attackerIsPlayer ? forecast.attackerCanDouble : forecast.defenderCanDouble;
  const playerCanAttack = attackerIsPlayer ? true : forecast.defenderCanCounter;

  const enemyDmg = attackerIsPlayer ? forecast.defenderDamage : forecast.attackerDamage;
  const enemyHit = attackerIsPlayer ? forecast.defenderHit : forecast.attackerHit;
  const enemyCrit = attackerIsPlayer ? forecast.defenderCrit : forecast.attackerCrit;
  const enemyDouble = attackerIsPlayer ? forecast.defenderCanDouble : forecast.attackerCanDouble;
  const enemyCanAttack = attackerIsPlayer ? forecast.defenderCanCounter : true;

  return (
    <div className="combat-forecast" data-testid="combat-forecast">
      <div className="combat-forecast__header">Combat Forecast</div>
      <div className="combat-forecast__matchup">
        {/* Player side (always left, blue) */}
        <div className="combat-forecast__unit combat-forecast__unit--attacker">
          <div className="combat-forecast__name">{playerUnit.name}</div>
          <div className="combat-forecast__hp">
            HP {playerUnit.currentHp}/{playerUnit.maxHp}
          </div>
          {playerCanAttack ? (
            <>
              <div className="combat-forecast__stat">
                <span className="combat-forecast__label">DMG</span>
                <span className="combat-forecast__value" data-testid="forecast-atk-damage">{playerDmg}</span>
              </div>
              <div className="combat-forecast__stat">
                <span className="combat-forecast__label">HIT</span>
                <span className="combat-forecast__value" data-testid="forecast-atk-hit">{playerHit}%</span>
              </div>
              <div className="combat-forecast__stat">
                <span className="combat-forecast__label">CRIT</span>
                <span className="combat-forecast__value" data-testid="forecast-atk-crit">{playerCrit}%</span>
              </div>
              {playerDouble && (
                <div className="combat-forecast__double" data-testid="forecast-atk-double">x2</div>
              )}
            </>
          ) : (
            <div className="combat-forecast__no-counter">Cannot counter</div>
          )}
        </div>

        <div className="combat-forecast__vs">VS</div>

        {/* Enemy side (always right, red) */}
        <div className="combat-forecast__unit combat-forecast__unit--defender">
          <div className="combat-forecast__name">{enemyUnit.name}</div>
          <div className="combat-forecast__hp">
            HP {enemyUnit.currentHp}/{enemyUnit.maxHp}
          </div>
          {enemyCanAttack ? (
            <>
              <div className="combat-forecast__stat">
                <span className="combat-forecast__label">DMG</span>
                <span className="combat-forecast__value" data-testid="forecast-def-damage">{enemyDmg}</span>
              </div>
              <div className="combat-forecast__stat">
                <span className="combat-forecast__label">HIT</span>
                <span className="combat-forecast__value" data-testid="forecast-def-hit">{enemyHit}%</span>
              </div>
              <div className="combat-forecast__stat">
                <span className="combat-forecast__label">CRIT</span>
                <span className="combat-forecast__value" data-testid="forecast-def-crit">{enemyCrit}%</span>
              </div>
              {enemyDouble && (
                <div className="combat-forecast__double" data-testid="forecast-def-double">x2</div>
              )}
            </>
          ) : (
            <div className="combat-forecast__no-counter">Cannot counter</div>
          )}
        </div>
      </div>
    </div>
  );
}
