import { useEffect, useCallback, useState, useRef } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { BattleSprite } from './BattleSprite';

type AnimState = 'idle' | 'lunge' | 'hit' | 'miss' | 'death';

export function CombatAnimation() {
  const currentPhase = useGameStore((s) => s.currentPhase);
  const combatResult = useGameStore((s) => s.combatResult);
  const combatForecast = useGameStore((s) => s.combatForecast);
  const combatAnimationStep = useGameStore((s) => s.combatAnimationStep);
  const advanceCombatAnimation = useGameStore((s) => s.advanceCombatAnimation);

  const [playerAnim, setPlayerAnim] = useState<AnimState>('idle');
  const [enemyAnim, setEnemyAnim] = useState<AnimState>('idle');
  const [flashType, setFlashType] = useState<'none' | 'hit' | 'crit'>('none');
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const advance = useCallback(() => {
    advanceCombatAnimation();
  }, [advanceCombatAnimation]);

  // Determine timing + trigger animations per hit
  useEffect(() => {
    if (currentPhase !== 'combat_animation' || !combatResult || !combatForecast) return;

    const currentHit = combatAnimationStep >= 0 && combatAnimationStep < combatResult.hits.length
      ? combatResult.hits[combatAnimationStep]
      : null;

    if (!currentHit) {
      setPlayerAnim('idle');
      setEnemyAnim('idle');
      setFlashType('none');
      // Done — auto-advance to finish
      timerRef.current = setTimeout(advance, 400);
      return () => clearTimeout(timerRef.current);
    }

    const attackerIsPlayer = combatForecast.attacker.faction === 'player';
    const playerIsAttacking = attackerIsPlayer ? currentHit.attackerIsInitiator : !currentHit.attackerIsInitiator;

    // Phase 1: Lunge animation
    if (playerIsAttacking) {
      setPlayerAnim('lunge');
      setEnemyAnim('idle');
    } else {
      setEnemyAnim('lunge');
      setPlayerAnim('idle');
    }

    // Phase 2: After lunge, show hit/miss on target
    const impactDelay = 250;
    const impactTimer = setTimeout(() => {
      if (playerIsAttacking) {
        setPlayerAnim('idle');
        if (!currentHit.hit) {
          setEnemyAnim('idle');
          setFlashType('none');
        } else {
          setEnemyAnim(currentHit.targetKilled ? 'death' : 'hit');
          setFlashType(currentHit.crit ? 'crit' : 'hit');
        }
      } else {
        setEnemyAnim('idle');
        if (!currentHit.hit) {
          setPlayerAnim('idle');
          setFlashType('none');
        } else {
          setPlayerAnim(currentHit.targetKilled ? 'death' : 'hit');
          setFlashType(currentHit.crit ? 'crit' : 'hit');
        }
      }
    }, impactDelay);

    // Phase 3: Clear flash and advance
    const totalDelay = !currentHit.hit ? 600 : currentHit.crit ? 1200 : 900;
    const advanceTimer = setTimeout(() => {
      setFlashType('none');
      advance();
    }, totalDelay);

    return () => {
      clearTimeout(impactTimer);
      clearTimeout(advanceTimer);
      clearTimeout(timerRef.current);
    };
  }, [currentPhase, combatResult, combatForecast, combatAnimationStep, advance]);

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

  // Always show player on left, enemy on right
  const attackerIsPlayer = combatForecast.attacker.faction === 'player';
  const playerSide = attackerIsPlayer
    ? { info: combatForecast.attacker, hp: atkHpDisplay }
    : { info: combatForecast.defender, hp: defHpDisplay };
  const enemySide = attackerIsPlayer
    ? { info: combatForecast.defender, hp: defHpDisplay }
    : { info: combatForecast.attacker, hp: atkHpDisplay };

  // Determine damage display info for current hit
  const playerIsAttacking = currentHit
    ? (attackerIsPlayer ? currentHit.attackerIsInitiator : !currentHit.attackerIsInitiator)
    : false;

  const hpColor = (hp: number, maxHp: number) => {
    const pct = hp / maxHp;
    if (pct > 0.5) return '#22c55e';
    if (pct > 0.25) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="combat-animation" data-testid="combat-animation">
      {/* Screen flash overlay */}
      {flashType !== 'none' && (
        <div className={`combat-animation__flash combat-animation__flash--${flashType}`} />
      )}

      <div className="combat-animation__modal">
        {/* Title bar */}
        <div className="combat-animation__title">Combat</div>

        {/* Battle scene */}
        <div className="combat-animation__scene">
          {/* Player unit (left) */}
          <div className={`combat-animation__fighter combat-animation__fighter--left combat-animation__fighter--${playerAnim}`}>
            <BattleSprite
              classId={playerSide.info.classId}
              faction={playerSide.info.faction}
              mirrored={false}
            />
          </div>

          {/* Center damage display */}
          <div className="combat-animation__center">
            {currentHit && (
              <div
                className={`combat-animation__damage ${currentHit.crit ? 'combat-animation__damage--crit' : ''} ${!currentHit.hit ? 'combat-animation__damage--miss' : ''}`}
                key={combatAnimationStep}
                data-testid="combat-damage-display"
              >
                {!currentHit.hit ? 'MISS' : currentHit.crit ? `${currentHit.damage}` : currentHit.damage}
              </div>
            )}
            {currentHit?.crit && currentHit.hit && (
              <div className="combat-animation__crit-label">CRITICAL!</div>
            )}
            {/* Damage direction arrow */}
            {currentHit && currentHit.hit && (
              <div className={`combat-animation__arrow ${playerIsAttacking ? 'combat-animation__arrow--right' : 'combat-animation__arrow--left'}`}>
                {playerIsAttacking ? '→' : '←'}
              </div>
            )}
          </div>

          {/* Enemy unit (right, mirrored) */}
          <div className={`combat-animation__fighter combat-animation__fighter--right combat-animation__fighter--${enemyAnim}`}>
            <BattleSprite
              classId={enemySide.info.classId}
              faction={enemySide.info.faction}
              mirrored={true}
            />
          </div>
        </div>

        {/* Ground strip */}
        <div className="combat-animation__ground" />

        {/* Info panel */}
        <div className="combat-animation__info">
          {/* Player info */}
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
          </div>

          {/* Hit counter */}
          <div className="combat-animation__step">
            Hit {Math.min(combatAnimationStep + 1, combatResult.hits.length)} / {combatResult.hits.length}
          </div>

          {/* Enemy info */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
