import { useEffect, useCallback, useState, useRef } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { BattleSprite } from './BattleSprite';
import { WeaponEffect } from './WeaponEffect';
import type { WeaponType } from '../../core/types';
import { getWeaponTriangle } from '../../core/combat';

/**
 * FE GBA-style battle animation choreography.
 *
 * Layout: Wide stage (640px). Player on far left, enemy on far right.
 * Physical attacks: attacker dashes across to defender, strikes, returns.
 * Magic attacks: caster stays in place, spell effect flies across to target.
 * Crits: dramatic pause + screen darken before the dash.
 * Dodge: defender leaps backward to evade.
 * Death: defender collapses downward.
 */

// Animation phases for the full FE-style choreography
type AnimPhase =
  | 'idle'           // Standing ready
  | 'windup'         // Anticipation — slight crouch before dash
  | 'dash'           // Running toward opponent (physical) or casting (magic)
  | 'strike'         // At opponent's position, weapon swung
  | 'impact'         // Hit connects — flash + shake + damage number
  | 'return'         // Running back to starting position
  | 'crit-pause'     // Special dramatic pause before crit
  | 'spell-fly'      // Magic projectile crossing the screen
  | 'spell-hit'      // Magic impact on target
  | 'dodge'          // Defender leaps back
  | 'death'          // Defender collapses
  | 'done';          // Finished, advance to next hit

function isMagicType(wt: WeaponType): boolean {
  return wt === 'fire' || wt === 'thunder' || wt === 'wind' || wt === 'staff';
}

export function CombatAnimation() {
  const currentPhase = useGameStore((s) => s.currentPhase);
  const combatResult = useGameStore((s) => s.combatResult);
  const combatForecast = useGameStore((s) => s.combatForecast);
  const combatAnimationStep = useGameStore((s) => s.combatAnimationStep);
  const advanceCombatAnimation = useGameStore((s) => s.advanceCombatAnimation);

  const [phase, setPhase] = useState<AnimPhase>('idle');
  const [flashType, setFlashType] = useState<'none' | 'hit' | 'crit'>('none');
  const [critDarken, setCritDarken] = useState(false);
  const [damageVisible, setDamageVisible] = useState(false);
  const [hpDrained, setHpDrained] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const advance = useCallback(() => {
    advanceCombatAnimation();
  }, [advanceCombatAnimation]);

  // Run the choreography timeline for each hit
  useEffect(() => {
    if (currentPhase !== 'combat_animation' || !combatResult || !combatForecast) return;

    const currentHit = combatAnimationStep >= 0 && combatAnimationStep < combatResult.hits.length
      ? combatResult.hits[combatAnimationStep]
      : null;

    if (!currentHit) {
      setPhase('idle');
      setFlashType('none');
      setCritDarken(false);
      setDamageVisible(false);
      timerRef.current = setTimeout(advance, 400);
      return () => clearTimeout(timerRef.current);
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, ms: number) => { timers.push(setTimeout(fn, ms)); };

    // Determine who is attacking this hit
    const attackerIsPlayer = combatForecast.attacker.faction === 'player';
    const playerIsAttacking = attackerIsPlayer
      ? currentHit.attackerIsInitiator
      : !currentHit.attackerIsInitiator;

    const weaponType = playerIsAttacking
      ? (attackerIsPlayer ? combatForecast.attacker.weaponType : combatForecast.defender.weaponType)
      : (attackerIsPlayer ? combatForecast.defender.weaponType : combatForecast.attacker.weaponType);

    const isMagic = isMagicType(weaponType);
    const isCrit = currentHit.crit && currentHit.hit;
    const isHit = currentHit.hit;

    // Reset
    setPhase('idle');
    setFlashType('none');
    setCritDarken(false);
    setDamageVisible(false);
    setHpDrained(false);

    let cursor = 100; // Start after brief idle

    if (isCrit) {
      // Crit: dramatic pause with screen darken
      t(() => { setPhase('crit-pause'); setCritDarken(true); }, cursor);
      cursor += 600;
      t(() => setCritDarken(false), cursor);
    }

    if (isMagic) {
      // Magic: caster raises staff/hand → spell flies across → impact → damage
      t(() => setPhase('windup'), cursor);
      cursor += 300;
      t(() => setPhase('spell-fly'), cursor);
      cursor += 400;
      if (isHit) {
        t(() => {
          setPhase('spell-hit');
          setFlashType(isCrit ? 'crit' : 'hit');
        }, cursor);
        cursor += 250;
        // Damage number appears after hit registers visually
        t(() => setDamageVisible(true), cursor);
        cursor += 150;
        // HP drains after damage number pops
        t(() => setHpDrained(true), cursor);
        cursor += 100;
        if (currentHit.targetKilled) {
          t(() => setPhase('death'), cursor);
          cursor += 600;
        } else {
          cursor += 300;
        }
      } else {
        // Miss — target dodges, then MISS text
        t(() => setPhase('dodge'), cursor);
        cursor += 250;
        t(() => setDamageVisible(true), cursor);
        cursor += 400;
      }
    } else {
      // Physical: windup → dash across → strike → impact → damage → HP drain → return
      t(() => setPhase('windup'), cursor);
      cursor += 200;
      t(() => setPhase('dash'), cursor);
      cursor += 250;
      t(() => setPhase('strike'), cursor);
      cursor += 100;

      if (isHit) {
        t(() => {
          setPhase('impact');
          setFlashType(isCrit ? 'crit' : 'hit');
        }, cursor);
        cursor += 300;
        // Damage number pops after hit impact registers visually
        t(() => setDamageVisible(true), cursor);
        cursor += 200;
        // HP drains after damage number pops
        t(() => setHpDrained(true), cursor);
        cursor += 150;
        if (currentHit.targetKilled) {
          t(() => setPhase('death'), cursor);
          cursor += 600;
        } else {
          cursor += 200;
        }
        t(() => setPhase('return'), cursor);
        cursor += 300;
      } else {
        // Miss — defender dodges, then MISS text
        t(() => setPhase('dodge'), cursor);
        cursor += 250;
        t(() => setDamageVisible(true), cursor);
        cursor += 300;
        t(() => setPhase('return'), cursor);
        cursor += 300;
      }
    }

    // Final: advance to next hit
    t(() => {
      setPhase('idle');
      setFlashType('none');
      setDamageVisible(false);
      advance();
    }, cursor + 200);

    return () => { timers.forEach(clearTimeout); clearTimeout(timerRef.current); };
  }, [currentPhase, combatResult, combatForecast, combatAnimationStep, advance]);

  if (currentPhase !== 'combat_animation' || !combatResult || !combatForecast) return null;

  const currentHit = combatAnimationStep >= 0 && combatAnimationStep < combatResult.hits.length
    ? combatResult.hits[combatAnimationStep]
    : null;

  // Calculate running HP totals — current hit only applies after HP drain animation
  let atkHpDisplay = combatForecast.attacker.currentHp;
  let defHpDisplay = combatForecast.defender.currentHp;
  const hpStepLimit = hpDrained ? combatAnimationStep : combatAnimationStep - 1;
  for (let i = 0; i <= hpStepLimit && i < combatResult.hits.length; i++) {
    const hit = combatResult.hits[i];
    if (hit.attackerIsInitiator) defHpDisplay = hit.targetHpAfter;
    else atkHpDisplay = hit.targetHpAfter;
  }

  const attackerIsPlayer = combatForecast.attacker.faction === 'player';
  const playerSide = attackerIsPlayer
    ? { info: combatForecast.attacker, hp: atkHpDisplay }
    : { info: combatForecast.defender, hp: defHpDisplay };
  const enemySide = attackerIsPlayer
    ? { info: combatForecast.defender, hp: defHpDisplay }
    : { info: combatForecast.attacker, hp: atkHpDisplay };

  const playerIsAttacking = currentHit
    ? (attackerIsPlayer ? currentHit.attackerIsInitiator : !currentHit.attackerIsInitiator)
    : false;

  const weaponType = currentHit
    ? (playerIsAttacking
        ? (attackerIsPlayer ? combatForecast.attacker.weaponType : combatForecast.defender.weaponType)
        : (attackerIsPlayer ? combatForecast.defender.weaponType : combatForecast.attacker.weaponType))
    : null;

  // Determine CSS classes for each fighter based on phase + who is attacking
  const getAttackerClass = (): string => {
    switch (phase) {
      case 'crit-pause': return 'crit-pause';
      case 'windup': return 'windup';
      case 'dash': return 'dash';
      case 'strike': return 'strike';
      case 'impact': return 'strike'; // Hold at strike position during impact
      case 'return': return 'return';
      case 'spell-fly': return 'casting';
      case 'spell-hit': return 'casting';
      default: return 'idle';
    }
  };

  const getDefenderClass = (): string => {
    switch (phase) {
      case 'impact': return 'hit';
      case 'spell-hit': return 'hit';
      case 'dodge': return 'dodge';
      case 'death': return 'death';
      default: return 'idle';
    }
  };

  const attackerCls = getAttackerClass();
  const defenderCls = getDefenderClass();

  // Map to left/right CSS classes
  const playerCls = playerIsAttacking ? attackerCls : defenderCls;
  const enemyCls = playerIsAttacking ? defenderCls : attackerCls;

  // Sprite poses
  const attackerPose = (phase === 'windup' || phase === 'dash' || phase === 'strike' || phase === 'impact' || phase === 'crit-pause' || phase === 'spell-fly' || phase === 'spell-hit') ? 'attack' : 'idle';
  const defenderPose = 'idle';

  const playerPose = playerIsAttacking ? attackerPose : defenderPose;
  const enemyPose = playerIsAttacking ? defenderPose : attackerPose;

  // Show weapon effect during specific phases
  const showEffect = phase === 'strike' || phase === 'impact' || phase === 'spell-fly' || phase === 'spell-hit';

  // Weapon triangle
  const triangle = getWeaponTriangle(playerSide.info.weaponType, enemySide.info.weaponType);
  const triangleLabel = triangle.dmgMod > 0 ? '▲' : triangle.dmgMod < 0 ? '▼' : '';
  const triangleColor = triangle.dmgMod > 0 ? '#22c55e' : triangle.dmgMod < 0 ? '#ef4444' : '';

  // Forecast stats for each side
  const playerForecast = attackerIsPlayer
    ? { damage: combatForecast.attackerDamage, hit: combatForecast.attackerHit, crit: combatForecast.attackerCrit, canCounter: true }
    : { damage: combatForecast.defenderDamage, hit: combatForecast.defenderHit, crit: combatForecast.defenderCrit, canCounter: combatForecast.defenderCanCounter };
  const enemyForecast = attackerIsPlayer
    ? { damage: combatForecast.defenderDamage, hit: combatForecast.defenderHit, crit: combatForecast.defenderCrit, canCounter: combatForecast.defenderCanCounter }
    : { damage: combatForecast.attackerDamage, hit: combatForecast.attackerHit, crit: combatForecast.attackerCrit, canCounter: true };

  const hpColor = (hp: number, maxHp: number) => {
    const pct = hp / maxHp;
    if (pct > 0.5) return '#22c55e';
    if (pct > 0.25) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="combat-animation" data-testid="combat-animation">
      {/* Screen flash */}
      {flashType !== 'none' && (
        <div className={`combat-animation__flash combat-animation__flash--${flashType}`} key={`flash-${combatAnimationStep}-${phase}`} />
      )}

      {/* Crit dramatic darken */}
      {critDarken && <div className="combat-animation__crit-darken" />}

      <div className="combat-animation__modal">
        <div className="combat-animation__title">Combat</div>

        {/* Wide battle stage */}
        <div className="combat-animation__stage">
          {/* Player fighter */}
          <div className={`combat-animation__fighter combat-animation__fighter--left combat-animation__fighter--${playerCls}`}>
            <BattleSprite
              classId={playerSide.info.classId}
              faction={playerSide.info.faction}
              mirrored={false}
              pose={playerPose}
              weaponType={playerSide.info.weaponType}
            />
          </div>

          {/* Weapon effect — positioned over the defender's area */}
          {showEffect && weaponType && (
            <div
              className={`combat-animation__effect combat-animation__effect--${playerIsAttacking ? 'right' : 'left'} ${phase === 'spell-fly' ? 'combat-animation__effect--flying' : ''}`}
              key={`eff-${combatAnimationStep}-${phase}`}
            >
              <WeaponEffect weaponType={weaponType} side={playerIsAttacking ? 'left' : 'right'} />
            </div>
          )}

          {/* Damage number — floats near defender */}
          {damageVisible && currentHit && (
            <div
              className={`combat-animation__dmg-float combat-animation__dmg-float--${playerIsAttacking ? 'right' : 'left'} ${currentHit.crit ? 'combat-animation__dmg-float--crit' : ''} ${!currentHit.hit ? 'combat-animation__dmg-float--miss' : ''}`}
              key={`dmg-${combatAnimationStep}`}
              data-testid="combat-damage-display"
            >
              {!currentHit.hit ? 'MISS' : currentHit.damage}
              {currentHit.crit && currentHit.hit && <span className="combat-animation__crit-label">CRITICAL!</span>}
            </div>
          )}

          {/* Enemy fighter */}
          <div className={`combat-animation__fighter combat-animation__fighter--right combat-animation__fighter--${enemyCls}`}>
            <BattleSprite
              classId={enemySide.info.classId}
              faction={enemySide.info.faction}
              mirrored={true}
              pose={enemyPose}
              weaponType={enemySide.info.weaponType}
            />
          </div>

          {/* Weapon triangle indicator — top right */}
          {triangleLabel && (
            <div className="combat-animation__triangle" style={{ color: triangleColor }}>
              <span className="combat-animation__triangle-arrow">{triangleLabel}</span>
              <span className="combat-animation__triangle-weapons">
                {playerSide.info.weaponName} vs {enemySide.info.weaponName}
              </span>
            </div>
          )}

          {/* Ground */}
          <div className="combat-animation__ground-line" />
        </div>

        {/* Info panel */}
        <div className="combat-animation__info">
          <div className="combat-animation__unit-info">
            <div className="combat-animation__name">{playerSide.info.name}</div>
            <div className="combat-animation__weapon-name">{playerSide.info.weaponName}</div>
            <div className="combat-animation__hp-bar">
              <div
                className="combat-animation__hp-fill combat-animation__hp-fill--player"
                style={{ width: `${Math.max(0, (playerSide.hp / playerSide.info.maxHp) * 100)}%` }}
              />
            </div>
            <div className="combat-animation__hp-text" style={{ color: hpColor(playerSide.hp, playerSide.info.maxHp) }}>
              {playerSide.hp}/{playerSide.info.maxHp}
            </div>
            <div className="combat-animation__forecast-stats">
              <span className="combat-animation__stat">Dmg <strong>{playerForecast.damage}</strong></span>
              <span className="combat-animation__stat">Hit <strong>{playerForecast.hit}%</strong></span>
              <span className="combat-animation__stat">Crit <strong>{playerForecast.crit}%</strong></span>
            </div>
          </div>

          <div className="combat-animation__step">
            Hit {Math.min(combatAnimationStep + 1, combatResult.hits.length)} / {combatResult.hits.length}
          </div>

          <div className="combat-animation__unit-info">
            <div className="combat-animation__name">{enemySide.info.name}</div>
            <div className="combat-animation__weapon-name">{enemySide.info.weaponName}</div>
            <div className="combat-animation__hp-bar">
              <div
                className="combat-animation__hp-fill combat-animation__hp-fill--enemy"
                style={{ width: `${Math.max(0, (enemySide.hp / enemySide.info.maxHp) * 100)}%` }}
              />
            </div>
            <div className="combat-animation__hp-text" style={{ color: hpColor(enemySide.hp, enemySide.info.maxHp) }}>
              {enemySide.hp}/{enemySide.info.maxHp}
            </div>
            <div className="combat-animation__forecast-stats">
              {enemyForecast.canCounter ? (
                <>
                  <span className="combat-animation__stat">Dmg <strong>{enemyForecast.damage}</strong></span>
                  <span className="combat-animation__stat">Hit <strong>{enemyForecast.hit}%</strong></span>
                  <span className="combat-animation__stat">Crit <strong>{enemyForecast.crit}%</strong></span>
                </>
              ) : (
                <span className="combat-animation__stat combat-animation__stat--no-counter">No counter</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
