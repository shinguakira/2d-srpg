import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { getWeaponTriangle, isEffectiveAgainst, isWeaponProficient } from '../../core/combat';
import { getDurabilityColor } from '../../core/items';
import { SKILLS, getSkillActivationText } from '../../data/skills';
import { getStaCombatNote } from '../../core/metaStats';
import { getTerrainData } from '../../core/terrain';
import { getWeatherCombatModifiers } from '../../core/weather';
import { getSupportCombatBonuses, getSupportRank } from '../../core/support';
import { applySyncHitBonus } from '../../core/metaStats';
import { getManhattanDistance } from '../../core/pathfinding';
const WEAPON_NAMES: Record<string, string> = {
  sword: 'Sword',
  axe: 'Axe',
  lance: 'Lance',
  fire: 'Fire',
  thunder: 'Thunder',
  wind: 'Wind',
  staff: 'Staff',
  light: 'Light',
  dark: 'Dark',
  bow: 'Bow',
  knife: 'Knife',
};

function getTriangleText(atkType: string, defType: string): { text: string; color: string } | null {
  const triangle = getWeaponTriangle(atkType as any, defType as any);
  if (triangle.dmgMod > 0) {
    return { text: `▲ ${WEAPON_NAMES[atkType]} beats ${WEAPON_NAMES[defType]}`, color: '#22c55e' };
  }
  if (triangle.dmgMod < 0) {
    return {
      text: `▼ ${WEAPON_NAMES[atkType]} loses to ${WEAPON_NAMES[defType]}`,
      color: '#ef4444',
    };
  }
  return null;
}

export function CombatPreview() {
  const forecast = useGameStore((s) => s.combatForecast);
  const playerAction = useGameStore((s) => s.playerAction);
  const units = useGameStore((s) => s.units);
  const getTileAt = useGameStore((s) => s.getTileAt);
  const weather = useGameStore((s) => s.weather);
  const supportPairs = useGameStore((s) => s.supportPairs);
  const [showModifiers, setShowModifiers] = useState(false);

  // Show forecast when hovering enemies during attack_target or action_menu
  if ((playerAction !== 'attack_target' && playerAction !== 'action_menu') || !forecast)
    return null;

  // Always show player on left, enemy on right
  const attackerIsPlayer = forecast.attacker.faction === 'player';

  // Get full unit objects for effectiveness / STA checks
  const attackerFullUnit = units.get(forecast.attacker.unitId);
  const defenderFullUnit = units.get(forecast.defender.unitId);
  const playerFullUnit = attackerIsPlayer ? attackerFullUnit : defenderFullUnit;
  const enemyFullUnit = attackerIsPlayer ? defenderFullUnit : attackerFullUnit;

  // Weapon cycle hint for cycling bosses
  let cycleHint: string | null = null;
  if (enemyFullUnit?.weaponCycleOrder && enemyFullUnit.weaponCycleOrder.length > 0) {
    const idx = enemyFullUnit.weaponCycleIndex ?? 0;
    const current =
      WEAPON_NAMES[enemyFullUnit.weaponCycleOrder[idx]] ?? enemyFullUnit.weaponCycleOrder[idx];
    const nextIdx = (idx + 1) % enemyFullUnit.weaponCycleOrder.length;
    const next =
      WEAPON_NAMES[enemyFullUnit.weaponCycleOrder[nextIdx]] ??
      enemyFullUnit.weaponCycleOrder[nextIdx];
    cycleHint = `Cycle: ${current} \u2192 Next: ${next}`;
  }

  // Effectiveness checks (Task 1)
  const playerEffective =
    playerFullUnit && enemyFullUnit
      ? isEffectiveAgainst(playerFullUnit.equippedWeapon, enemyFullUnit)
      : false;
  const enemyEffective =
    enemyFullUnit && playerFullUnit
      ? isEffectiveAgainst(enemyFullUnit.equippedWeapon, playerFullUnit)
      : false;

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
  const enemyPredictedHp = estimateHp(
    enemyUnit.currentHp,
    playerDmg,
    playerCanAttack,
    playerDouble,
  );

  // Weapon triangle — from player's perspective
  const triangle = getTriangleText(playerUnit.weaponType, enemyUnit.weaponType);

  // STA combat notes (Task 3)
  const playerStaNote = playerFullUnit ? getStaCombatNote(playerFullUnit.metaStats.sta) : null;
  const enemyStaNote = enemyFullUnit ? getStaCombatNote(enemyFullUnit.metaStats.sta) : null;

  // Boss phase info (Task 8)
  let nextPhaseText: string | null = null;
  if (enemyFullUnit?.bossPhases && enemyFullUnit.bossPhases.length > 0) {
    const currentPhase = enemyFullUnit.currentBossPhase ?? 0;
    const nextPhase = enemyFullUnit.bossPhases.find((_p, i) => i > currentPhase);
    if (nextPhase) {
      const parts: string[] = [];
      if (nextPhase.immunity)
        parts.push(`+${nextPhase.immunity === 'physical' ? 'Physical' : 'Magical'} Immunity`);
      if (nextPhase.selfHeal) parts.push(`Self Heal ${nextPhase.selfHeal}/turn`);
      if (nextPhase.weaponId) parts.push('Weapon swap');
      const desc = parts.length > 0 ? parts.join(', ') : 'Phase change';
      nextPhaseText = `Phase ${currentPhase + 2} at ${nextPhase.hpThreshold}% HP: ${desc}`;
    }
  }

  // Compute modifier lines grouped by attacker/defender (Task 5)
  const playerModifiers: { label: string; color?: string }[] = [];
  const enemyModifiers: { label: string; color?: string }[] = [];
  if (showModifiers) {
    // --- Player (attacker) modifiers ---
    // Weapon triangle
    const tri = getWeaponTriangle(playerUnit.weaponType as any, enemyUnit.weaponType as any);
    if (tri.hitMod !== 0 || tri.dmgMod !== 0) {
      playerModifiers.push({
        label: `Triangle: HIT ${tri.hitMod > 0 ? '+' : ''}${tri.hitMod}, DMG ${tri.dmgMod > 0 ? '+' : ''}${tri.dmgMod}`,
      });
    }
    // Weather (player)
    if (weather && weather !== 'clear' && playerFullUnit) {
      const wm = getWeatherCombatModifiers(weather, playerFullUnit.equippedWeapon);
      const parts: string[] = [];
      if (wm.hitMod !== 0) parts.push(`HIT ${wm.hitMod}`);
      if (wm.mightMod !== 0) parts.push(`Mt ${wm.mightMod}`);
      if (wm.spdMod !== 0) parts.push(`SPD ${wm.spdMod}`);
      if (parts.length > 0) playerModifiers.push({ label: `Weather: ${parts.join(', ')}` });
    }
    // Support
    if (playerFullUnit && supportPairs) {
      let totalHit = 0,
        totalAvo = 0,
        totalCrit = 0,
        totalDmg = 0;
      for (const pair of supportPairs) {
        const partnerId =
          pair.unitA === playerFullUnit.id
            ? pair.unitB
            : pair.unitB === playerFullUnit.id
              ? pair.unitA
              : null;
        if (!partnerId) continue;
        const partner = units.get(partnerId);
        if (!partner || partner.currentHp <= 0) continue;
        if (getManhattanDistance(playerFullUnit.position, partner.position) > 3) continue;
        const rank = getSupportRank(pair.points);
        if (!rank) continue;
        const b = getSupportCombatBonuses(rank);
        totalHit += b.hit;
        totalAvo += b.avoid;
        totalCrit += b.crit;
        totalDmg += b.dmg;
      }
      if (totalHit > 0 || totalAvo > 0 || totalCrit > 0 || totalDmg > 0) {
        const parts: string[] = [];
        if (totalHit > 0) parts.push(`HIT +${totalHit}`);
        if (totalAvo > 0) parts.push(`AVO +${totalAvo}`);
        if (totalCrit > 0) parts.push(`CRIT +${totalCrit}`);
        if (totalDmg > 0) parts.push(`DMG +${totalDmg}`);
        playerModifiers.push({ label: `Support: ${parts.join(', ')}`, color: '#f472b6' });
      }
    }
    // SYNC hit bonus
    if (playerFullUnit && applySyncHitBonus(playerFullUnit.metaStats.sync) > 0) {
      playerModifiers.push({
        label: `SYNC ${playerFullUnit.metaStats.sync}: HIT +5`,
        color: '#22d3ee',
      });
    }
    // STA penalties (player)
    if (playerStaNote) playerModifiers.push({ label: playerStaNote, color: '#f97316' });
    // Effectiveness (player weapon)
    if (playerEffective) playerModifiers.push({ label: 'Effective: Mt x3', color: '#22c55e' });
    // Proficiency (player)
    if (playerFullUnit && !isWeaponProficient(playerFullUnit, playerFullUnit.equippedWeapon)) {
      playerModifiers.push({ label: 'Not proficient: HIT -20', color: '#ef4444' });
    }

    // --- Enemy (defender) modifiers ---
    // Terrain (defender)
    if (enemyFullUnit) {
      const defTile = getTileAt(enemyFullUnit.position);
      if (defTile) {
        const td = getTerrainData(defTile.terrain);
        if (td.defenseBonus > 0 || td.avoidBonus > 0) {
          enemyModifiers.push({
            label:
              `Terrain (${td.name}): ${td.avoidBonus > 0 ? `AVO +${td.avoidBonus}` : ''}${td.defenseBonus > 0 ? ` DEF +${td.defenseBonus}` : ''}`.trim(),
          });
        }
      }
    }
    // Weather (enemy)
    if (weather && weather !== 'clear' && enemyFullUnit) {
      const wm = getWeatherCombatModifiers(weather, enemyFullUnit.equippedWeapon);
      const parts: string[] = [];
      if (wm.hitMod !== 0) parts.push(`HIT ${wm.hitMod}`);
      if (wm.mightMod !== 0) parts.push(`Mt ${wm.mightMod}`);
      if (wm.spdMod !== 0) parts.push(`SPD ${wm.spdMod}`);
      if (parts.length > 0) enemyModifiers.push({ label: `Weather: ${parts.join(', ')}` });
    }
    // STA penalties (enemy)
    if (enemyStaNote) enemyModifiers.push({ label: enemyStaNote, color: '#f97316' });
    // Effectiveness (enemy weapon)
    if (enemyEffective) enemyModifiers.push({ label: 'Effective: Mt x3', color: '#ef4444' });
    // Proficiency (enemy)
    if (enemyFullUnit && !isWeaponProficient(enemyFullUnit, enemyFullUnit.equippedWeapon)) {
      enemyModifiers.push({ label: 'Not proficient: HIT -20', color: '#ef4444' });
    }
  }

  // Skill rendering helper for descriptions (Task 2)
  const renderSkillList = (skillIds: string[], isPlayerSide: boolean) => {
    const combatant = isPlayerSide ? playerFullUnit : enemyFullUnit;
    return (
      <div className="combat-forecast__skill-list">
        <span className="combat-forecast__skill-label">{isPlayerSide ? 'You' : 'Foe'}:</span>
        {skillIds.map((s) => {
          const skill = SKILLS[s];
          const activationText =
            skill && combatant ? getSkillActivationText(skill, combatant.stats) : null;
          return (
            <div key={s}>
              <span className="combat-forecast__skill-name">
                {skill?.name ?? s}
                {activationText && activationText !== 'Passive' && (
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginLeft: 4 }}>
                    ({activationText})
                  </span>
                )}
              </span>
              {skill && (
                <div className="combat-forecast__skill-desc" data-testid={`skill-description-${s}`}>
                  {skill.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Determine player/attacker skills
  const playerSkills = attackerIsPlayer ? forecast.attackerSkills : forecast.defenderSkills;
  const enemySkills = attackerIsPlayer ? forecast.defenderSkills : forecast.attackerSkills;

  return (
    <div className="combat-forecast" data-testid="combat-forecast">
      <div className="combat-forecast__header">Combat Forecast</div>
      <div className="combat-forecast__matchup">
        {/* Player side (always left, blue) */}
        <div className="combat-forecast__unit combat-forecast__unit--attacker">
          <div className="combat-forecast__name">{playerUnit.name}</div>
          <div className="combat-forecast__weapon-type">
            {playerUnit.weaponName}
            {playerUnit.weaponDurability != null && playerUnit.weaponMaxDurability != null && (
              <span
                data-testid="weapon-durability"
                style={{
                  marginLeft: 4,
                  fontSize: '0.85em',
                  color: getDurabilityColor(playerUnit.weaponDurability),
                }}
              >
                ({playerUnit.weaponDurability}/{playerUnit.weaponMaxDurability})
              </span>
            )}
          </div>
          <div className="combat-forecast__hp">
            HP {playerUnit.currentHp}/{playerUnit.maxHp}
            {playerCanAttack === false || enemyCanAttack ? (
              <span
                className="combat-forecast__predicted-hp"
                style={{
                  color:
                    playerPredictedHp <= 0
                      ? '#ef4444'
                      : playerPredictedHp < playerUnit.currentHp
                        ? '#eab308'
                        : undefined,
                }}
              >
                {enemyCanAttack && ` →${Math.max(0, playerPredictedHp)}`}
              </span>
            ) : null}
          </div>
          {enemyEffective && <div className="combat-forecast__effective--weak">Weak!</div>}
          {playerCanAttack ? (
            <>
              <div className="combat-forecast__stat">
                <span className="combat-forecast__label">DMG</span>
                <span className="combat-forecast__value" data-testid="forecast-atk-damage">
                  {playerDmg}
                </span>
              </div>
              {playerEffective && (
                <div className="combat-forecast__effective" data-testid="forecast-effective">
                  EFFECTIVE!
                </div>
              )}
              <div className="combat-forecast__stat">
                <span className="combat-forecast__label">HIT</span>
                <span className="combat-forecast__value" data-testid="forecast-atk-hit">
                  {playerHit}%
                </span>
              </div>
              <div className="combat-forecast__stat">
                <span className="combat-forecast__label">CRIT</span>
                <span className="combat-forecast__value" data-testid="forecast-atk-crit">
                  {playerCrit}%
                </span>
              </div>
              <div
                className={playerDouble ? 'combat-forecast__double' : 'combat-forecast__no-double'}
                data-testid="forecast-atk-double"
              >
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
          <div className="combat-forecast__weapon-type">
            {enemyUnit.weaponName}
            {enemyUnit.weaponDurability != null && enemyUnit.weaponMaxDurability != null && (
              <span
                data-testid="weapon-durability"
                style={{
                  marginLeft: 4,
                  fontSize: '0.85em',
                  color: getDurabilityColor(enemyUnit.weaponDurability),
                }}
              >
                ({enemyUnit.weaponDurability}/{enemyUnit.weaponMaxDurability})
              </span>
            )}
          </div>
          <div className="combat-forecast__hp">
            HP {enemyUnit.currentHp}/{enemyUnit.maxHp}
            <span
              className="combat-forecast__predicted-hp"
              style={{
                color:
                  enemyPredictedHp <= 0
                    ? '#ef4444'
                    : enemyPredictedHp < enemyUnit.currentHp
                      ? '#eab308'
                      : undefined,
              }}
            >
              {` →${Math.max(0, enemyPredictedHp)}`}
            </span>
          </div>
          {/* Boss phase HP tick marks (Task 8) */}
          {enemyFullUnit?.bossPhases && enemyFullUnit.bossPhases.length > 0 && (
            <div
              className="combat-forecast__hp-bar"
              style={{
                position: 'relative',
                width: '100%',
                height: 6,
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 3,
                marginTop: 2,
              }}
            >
              <div
                style={{
                  width: `${Math.max(0, (enemyUnit.currentHp / enemyUnit.maxHp) * 100)}%`,
                  height: '100%',
                  background: '#ef4444',
                  borderRadius: 3,
                }}
              />
              {enemyFullUnit.bossPhases.map((phase, i) => {
                const pct = phase.hpThreshold;
                const current = enemyFullUnit.currentBossPhase ?? 0;
                const isPast = i < current;
                return (
                  <div
                    key={i}
                    data-testid={`boss-phase-tick-${i}`}
                    style={{
                      position: 'absolute',
                      left: `${pct}%`,
                      top: -2,
                      width: 2,
                      height: 10,
                      background: isPast ? '#666' : i === current ? '#fbbf24' : '#fff',
                      opacity: isPast ? 0.4 : 0.9,
                    }}
                    title={`Phase ${i + 2} at ${pct}%`}
                  />
                );
              })}
            </div>
          )}
          {playerEffective && (
            <div
              className="combat-forecast__effective--weak"
              style={{ color: '#22c55e', fontSize: 10 }}
            >
              Eff. target
            </div>
          )}
          {enemyCanAttack ? (
            <>
              <div className="combat-forecast__stat">
                <span className="combat-forecast__label">DMG</span>
                <span className="combat-forecast__value" data-testid="forecast-def-damage">
                  {enemyDmg}
                </span>
              </div>
              {enemyEffective && (
                <div
                  className="combat-forecast__effective"
                  data-testid="forecast-effective-enemy"
                  style={{ color: '#ef4444' }}
                >
                  EFFECTIVE!
                </div>
              )}
              <div className="combat-forecast__stat">
                <span className="combat-forecast__label">HIT</span>
                <span className="combat-forecast__value" data-testid="forecast-def-hit">
                  {enemyHit}%
                </span>
              </div>
              <div className="combat-forecast__stat">
                <span className="combat-forecast__label">CRIT</span>
                <span className="combat-forecast__value" data-testid="forecast-def-crit">
                  {enemyCrit}%
                </span>
              </div>
              <div
                className={enemyDouble ? 'combat-forecast__double' : 'combat-forecast__no-double'}
                data-testid="forecast-def-double"
              >
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

      {/* STA combat notes (Task 3) */}
      {(playerStaNote || enemyStaNote) && (
        <div className="combat-forecast__sta-note" style={{ color: '#f97316' }}>
          {playerStaNote && <div data-testid="sta-combat-note">{playerStaNote}</div>}
          {enemyStaNote && <div>Foe: {enemyStaNote}</div>}
        </div>
      )}

      {/* Weapon cycle hint for cycling bosses */}
      {cycleHint && (
        <div
          className="combat-forecast__cycle-hint"
          data-testid="forecast-cycle-hint"
          style={{ color: '#f59e0b', fontSize: '0.75rem', textAlign: 'center', marginTop: 4 }}
        >
          {cycleHint}
        </div>
      )}

      {/* Boss phase info (Task 8) */}
      {nextPhaseText && (
        <div className="combat-forecast__boss-phase" data-testid="boss-phase-info">
          {nextPhaseText}
        </div>
      )}

      {/* Skills info with descriptions (Task 2) */}
      {(playerSkills.length > 0 || enemySkills.length > 0 || forecast.vantageActive) && (
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
          {playerSkills.length > 0 && renderSkillList(playerSkills, true)}
          {enemySkills.length > 0 && renderSkillList(enemySkills, false)}
        </div>
      )}

      {/* Combat Modifier Breakdown (Task 5) */}
      <div
        className="combat-forecast__modifier-toggle"
        data-testid="forecast-modifier-toggle"
        onClick={() => setShowModifiers(!showModifiers)}
      >
        Modifiers {showModifiers ? '▲' : '▼'}
      </div>
      {showModifiers && (playerModifiers.length > 0 || enemyModifiers.length > 0) && (
        <div className="combat-forecast__modifiers" data-testid="forecast-modifiers">
          {playerModifiers.length > 0 && (
            <>
              <div
                className="combat-forecast__modifier-line"
                style={{ color: '#60a5fa', fontWeight: 600 }}
              >
                You
              </div>
              {playerModifiers.map((m, i) => (
                <div
                  key={`p${i}`}
                  className="combat-forecast__modifier-line"
                  style={m.color ? { color: m.color } : undefined}
                >
                  {m.label}
                </div>
              ))}
            </>
          )}
          {enemyModifiers.length > 0 && (
            <>
              <div
                className="combat-forecast__modifier-line"
                style={{
                  color: '#ef4444',
                  fontWeight: 600,
                  marginTop: playerModifiers.length > 0 ? 4 : 0,
                }}
              >
                Foe
              </div>
              {enemyModifiers.map((m, i) => (
                <div
                  key={`e${i}`}
                  className="combat-forecast__modifier-line"
                  style={m.color ? { color: m.color } : undefined}
                >
                  {m.label}
                </div>
              ))}
            </>
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
