import { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { BattleSprite } from './BattleSprite';

/**
 * FE GBA-style healing animation.
 *
 * Layout: Same wide stage as combat. Healer on left, target on right.
 * Healer raises staff (casting glow) → green heal particles fly across →
 * target glows green as HP recovers → heal number floats up.
 */

type HealPhase =
  | 'idle'
  | 'cast'        // Healer raises staff, glow builds
  | 'spell-fly'   // Green heal orb flies to target
  | 'receive'     // Target glows, HP restores
  | 'done';

export function HealingAnimation() {
  const currentPhase = useGameStore((s) => s.currentPhase);
  const healData = useGameStore((s) => s.healAnimationData);
  const finishHealAnimation = useGameStore((s) => s.finishHealAnimation);

  const [phase, setPhase] = useState<HealPhase>('idle');
  const [healVisible, setHealVisible] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [hpAnimated, setHpAnimated] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (currentPhase !== 'heal_animation' || !healData) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, ms: number) => { timers.push(setTimeout(fn, ms)); };

    // Reset
    setPhase('idle');
    setHealVisible(false);
    setFlashActive(false);
    setHpAnimated(false);

    let cursor = 200;

    // Cast — healer glows
    t(() => setPhase('cast'), cursor);
    cursor += 500;

    // Spell fly — green orb crosses stage
    t(() => setPhase('spell-fly'), cursor);
    cursor += 500;

    // Receive — target glows green, heal flash
    t(() => {
      setPhase('receive');
      setFlashActive(true);
      setHealVisible(true);
      setHpAnimated(true);
    }, cursor);
    cursor += 300;

    t(() => setFlashActive(false), cursor);
    cursor += 700;

    // Done — auto-finish after showing result
    t(() => {
      setPhase('done');
      finishHealAnimation();
    }, cursor);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(timerRef.current);
    };
  }, [currentPhase, healData, finishHealAnimation]);

  if (currentPhase !== 'heal_animation' || !healData) return null;

  const hpColor = (hp: number, maxHp: number) => {
    const pct = hp / maxHp;
    if (pct > 0.5) return '#22c55e';
    if (pct > 0.25) return '#eab308';
    return '#ef4444';
  };

  const healerPose = (phase === 'cast' || phase === 'spell-fly') ? 'attack' : 'idle';
  const healerCls = (phase === 'cast' || phase === 'spell-fly') ? 'heal-casting' : 'idle';
  const targetCls = phase === 'receive' ? 'heal-receive' : 'idle';

  const displayTargetHp = hpAnimated ? healData.targetHpAfter : healData.targetHpBefore;

  return (
    <div className="combat-animation" data-testid="heal-animation">
      {/* Green heal flash */}
      {flashActive && (
        <div className="heal-animation__flash" key={`heal-flash-${phase}`} />
      )}

      <div className="combat-animation__modal heal-animation__modal">
        <div className="combat-animation__title heal-animation__title-bar">Heal</div>

        {/* Battle stage */}
        <div className="combat-animation__stage">
          {/* Healer (left) */}
          <div className={`combat-animation__fighter combat-animation__fighter--left heal-animation__fighter--${healerCls}`}>
            <BattleSprite
              classId={healData.healerClassId}
              faction="player"
              mirrored={false}
              pose={healerPose}
              weaponType="staff"
            />
          </div>

          {/* Heal effect — green orb flying */}
          {phase === 'spell-fly' && (
            <div className="heal-animation__orb" key="heal-orb" />
          )}

          {/* Heal particles around target during receive */}
          {phase === 'receive' && (
            <div className="heal-animation__particles" key="heal-particles">
              <div className="heal-animation__particle heal-animation__particle--1" />
              <div className="heal-animation__particle heal-animation__particle--2" />
              <div className="heal-animation__particle heal-animation__particle--3" />
              <div className="heal-animation__particle heal-animation__particle--4" />
            </div>
          )}

          {/* Heal number — floats near target */}
          {healVisible && (
            <div className="heal-animation__number" key="heal-num" data-testid="heal-amount-display">
              +{healData.healAmount}
            </div>
          )}

          {/* Target (right) */}
          <div className={`combat-animation__fighter combat-animation__fighter--right heal-animation__fighter--${targetCls}`}>
            <BattleSprite
              classId={healData.targetClassId}
              faction={healData.targetFaction}
              mirrored={true}
              pose="idle"
              weaponType="sword"
            />
          </div>

          {/* Ground */}
          <div className="combat-animation__ground-line" />
        </div>

        {/* Info panel */}
        <div className="combat-animation__info">
          <div className="combat-animation__unit-info">
            <div className="combat-animation__name">{healData.healerName}</div>
            <div className="combat-animation__weapon-name">{healData.staffName}</div>
            <div className="combat-animation__hp-bar">
              <div
                className="combat-animation__hp-fill combat-animation__hp-fill--player"
                style={{ width: `${Math.max(0, (healData.healerHp / healData.healerMaxHp) * 100)}%` }}
              />
            </div>
            <div className="combat-animation__hp-text" style={{ color: hpColor(healData.healerHp, healData.healerMaxHp) }}>
              {healData.healerHp}/{healData.healerMaxHp}
            </div>
          </div>

          <div className="combat-animation__step" style={{ color: '#22c55e' }}>
            Healing
          </div>

          <div className="combat-animation__unit-info">
            <div className="combat-animation__name">{healData.targetName}</div>
            <div className="combat-animation__weapon-name" style={{ color: '#22c55e' }}>
              HP Recovery
            </div>
            <div className="combat-animation__hp-bar">
              <div
                className="combat-animation__hp-fill heal-animation__hp-fill--heal"
                style={{ width: `${Math.max(0, (displayTargetHp / healData.targetMaxHp) * 100)}%` }}
              />
            </div>
            <div className="combat-animation__hp-text" style={{ color: hpColor(displayTargetHp, healData.targetMaxHp) }}>
              {displayTargetHp}/{healData.targetMaxHp}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
