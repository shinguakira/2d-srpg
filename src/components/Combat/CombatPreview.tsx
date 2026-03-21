import { useGameStore } from '../../stores/gameStore';
import { getWeaponTriangle } from '../../core/combat';

const WEAPON_NAMES: Record<string, string> = {
  sword: 'Sword', axe: 'Axe', lance: 'Lance',
  fire: 'Fire', thunder: 'Thunder', wind: 'Wind', staff: 'Staff',
  light: 'Light', dark: 'Dark', bow: 'Bow', knife: 'Knife',
};

function getTriangleText(atkType: string, defType: string): { text: string; color: string } | null {
  const triangle = getWeaponTriangle(atkType as any, defType as any);
  if (triangle.dmgMod > 0) {
    return { text: `▲ ${WEAPON_NAMES[atkType]} beats ${WEAPON_NAMES[defType]}`, color: '#22c55e' };
  }
  if (triangle.dmgMod < 0) {
    return { text: `▼ ${WEAPON_NAMES[atkType]} loses to ${WEAPON_NAMES[defType]}`, color: '#ef4444' };
  }
  return null;
}

export function CombatPreview() {
  const forecast = useGameStore((s) => s.combatForecast);
  const playerAction = useGameStore((s) => s.playerAction);
  const units = useGameStore((s) => s.units);

  // Show forecast when hovering enemies during attack_target or action_menu
  if ((playerAction !== 'attack_target' && playerAction !== 'action_menu') || !forecast) return null;

  // Always show player on left, enemy on right
  const attackerIsPlayer = forecast.attacker.faction === 'player';

  // Weapon cycle hint for cycling bosses
  const enemyId = attackerIsPlayer ? forecast.defender.unitId : forecast.attacker.unitId;
  const enemyFullUnit = units.get(enemyId);
  let cycleHint: string | null = null;
  if (enemyFullUnit?.weaponCycleOrder && enemyFullUnit.weaponCycleOrder.length > 0) {
    const idx = enemyFullUnit.weaponCycleIndex ?? 0;
    const current = WEAPON_NAMES[enemyFullUnit.weaponCycleOrder[idx]] ?? enemyFullUnit.weaponCycleOrder[idx];
    const nextIdx = (idx + 1) % enemyFullUnit.weaponCycleOrder.length;
    const next = WEAPON_NAMES[enemyFullUnit.weaponCycleOrder[nextIdx]] ?? enemyFullUnit.weaponCycleOrder[nextIdx];
    cycleHint = `Cycle: ${current} \u2192 Next: ${next}`;
  }

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

  // Predictive HP after combat
  const playerPredictedHp = estimateHp(playerUnit.currentHp, enemyDmg, enemyCanAttack, enemyDouble);
  const enemyPredictedHp = estimateHp(enemyUnit.currentHp, playerDmg, playerCanAttack, playerDouble);

  // Weapon triangle — from player's perspective
  const triangle = getTriangleText(playerUnit.weaponType, enemyUnit.weaponType);

  return (
    <div className="combat-forecast" data-testid="combat-forecast">
      <div className="combat-forecast__header">Combat Forecast</div>
      <div className="combat-forecast__matchup">
        {/* Player side (always left, blue) */}
        <div className="combat-forecast__unit combat-forecast__unit--attacker">
          <div className="combat-forecast__name">{playerUnit.name}</div>
          <div className="combat-forecast__weapon-type">{playerUnit.weaponName}</div>
          <div className="combat-forecast__hp">
            HP {playerUnit.currentHp}/{playerUnit.maxHp}
            {playerCanAttack === false || enemyCanAttack ? (
              <span className="combat-forecast__predicted-hp" style={{ color: playerPredictedHp <= 0 ? '#ef4444' : playerPredictedHp < playerUnit.currentHp ? '#eab308' : undefined }}>
                {enemyCanAttack && ` →${Math.max(0, playerPredictedHp)}`}
              </span>
            ) : null}
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
              <div className={playerDouble ? 'combat-forecast__double' : 'combat-forecast__no-double'} data-testid="forecast-atk-double">
                {playerDouble ? 'x2' : '—'}
              </div>
            </>
          ) : (
            <div className="combat-forecast__no-counter">Cannot counter</div>
          )}
        </div>

        <div className="combat-forecast__vs">VS</div>

        {/* Enemy side (always right, red) */}
        <div className="combat-forecast__unit combat-forecast__unit--defender">
          <div className="combat-forecast__name">{enemyUnit.name}</div>
          <div className="combat-forecast__weapon-type">{enemyUnit.weaponName}</div>
          <div className="combat-forecast__hp">
            HP {enemyUnit.currentHp}/{enemyUnit.maxHp}
            <span className="combat-forecast__predicted-hp" style={{ color: enemyPredictedHp <= 0 ? '#ef4444' : enemyPredictedHp < enemyUnit.currentHp ? '#eab308' : undefined }}>
              {` →${Math.max(0, enemyPredictedHp)}`}
            </span>
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
              <div className={enemyDouble ? 'combat-forecast__double' : 'combat-forecast__no-double'} data-testid="forecast-def-double">
                {enemyDouble ? 'x2' : '—'}
              </div>
            </>
          ) : (
            <div className="combat-forecast__no-counter">Cannot counter</div>
          )}
        </div>
      </div>

      {/* Weapon triangle indicator */}
      {triangle && (
        <div className="combat-forecast__triangle" style={{ color: triangle.color }}>
          {triangle.text}
        </div>
      )}

      {/* Weapon cycle hint for cycling bosses */}
      {cycleHint && (
        <div className="combat-forecast__cycle-hint" data-testid="forecast-cycle-hint" style={{ color: '#f59e0b', fontSize: '0.75rem', textAlign: 'center', marginTop: 4 }}>
          {cycleHint}
        </div>
      )}

      {/* Skills info */}
      {(forecast.attackerSkills.length > 0 || forecast.defenderSkills.length > 0 || forecast.vantageActive) && (
        <div className="combat-forecast__skills">
          {forecast.vantageActive && (
            <div className="combat-forecast__skill-warning" style={{ color: '#ef4444' }}>
              Vantage — Defender attacks first!
            </div>
          )}
          {attackerIsPlayer && forecast.defenderSkills.includes('nihil') && (
            <div className="combat-forecast__skill-warning" style={{ color: '#ef4444' }}>
              Nihil — Your skills disabled
            </div>
          )}
          {!attackerIsPlayer && forecast.attackerSkills.includes('nihil') && (
            <div className="combat-forecast__skill-warning" style={{ color: '#ef4444' }}>
              Nihil — Your skills disabled
            </div>
          )}
          {forecast.attackerSkills.length > 0 && (
            <div className="combat-forecast__skill-list">
              <span className="combat-forecast__skill-label">{attackerIsPlayer ? 'You' : 'Foe'}:</span>
              {forecast.attackerSkills.map((s) => (
                <span key={s} className="combat-forecast__skill-name">{s}</span>
              ))}
            </div>
          )}
          {forecast.defenderSkills.length > 0 && (
            <div className="combat-forecast__skill-list">
              <span className="combat-forecast__skill-label">{attackerIsPlayer ? 'Foe' : 'You'}:</span>
              {forecast.defenderSkills.map((s) => (
                <span key={s} className="combat-forecast__skill-name">{s}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Estimate HP after combat assuming all hits land (worst case for defender) */
function estimateHp(hp: number, dmgPerHit: number, canAttack: boolean, doubles: boolean): number {
  if (!canAttack) return hp;
  const hits = doubles ? 2 : 1;
  return hp - dmgPerHit * hits;
}
