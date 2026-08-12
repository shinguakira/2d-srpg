import { useEffect, useState } from 'react';
import { useT } from '../../i18n/useT';
import { useGameStore } from '../../stores/gameStore';
import { BattleSprite } from './BattleSprite';

/**
 * FE GBA-style item usage animation.
 *
 * Full-screen battle scene like HealingAnimation but single unit centered.
 * Unit glows green → green particles rise → heal number floats → HP bar fills.
 */

type ItemPhase = 'idle' | 'glow' | 'receive' | 'done';

export function ItemAnimation() {
  const T = useT();
  const currentPhase = useGameStore((s) => s.currentPhase);
  const data = useGameStore((s) => s.itemAnimationData);
  const finishItemAnimation = useGameStore((s) => s.finishItemAnimation);

  const [phase, setPhase] = useState<ItemPhase>('idle');
  const [healVisible, setHealVisible] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [hpAnimated, setHpAnimated] = useState(false);

  useEffect(() => {
    if (currentPhase !== 'item_animation' || !data) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, ms: number) => {
      timers.push(setTimeout(fn, ms));
    };

    // Reset
    setPhase('idle');
    setHealVisible(false);
    setFlashActive(false);
    setHpAnimated(false);

    let cursor = 200;

    // Glow — unit glows green (using item)
    t(() => setPhase('glow'), cursor);
    cursor += 600;

    // Receive — green flash, heal number, HP animates
    t(() => {
      setPhase('receive');
      setFlashActive(true);
      setHealVisible(true);
      setHpAnimated(true);
    }, cursor);
    cursor += 300;

    t(() => setFlashActive(false), cursor);
    cursor += 900;

    // Done
    t(() => {
      setPhase('done');
      finishItemAnimation();
    }, cursor);

    return () => timers.forEach(clearTimeout);
  }, [currentPhase, data, finishItemAnimation]);

  if (currentPhase !== 'item_animation' || !data) return null;

  const hpColor = (hp: number, maxHp: number) => {
    const pct = hp / maxHp;
    if (pct > 0.5) return '#22c55e';
    if (pct > 0.25) return '#eab308';
    return '#ef4444';
  };

  const unitCls =
    phase === 'glow'
      ? 'item-animation__fighter--glow'
      : phase === 'receive'
        ? 'heal-animation__fighter--heal-receive'
        : '';

  const displayHp = hpAnimated ? data.hpAfter : data.hpBefore;

  return (
    <div className="combat-animation" data-testid="item-animation">
      {/* Green heal flash */}
      {flashActive && <div className="heal-animation__flash" key={`item-flash-${phase}`} />}

      <div className="combat-animation__modal item-animation__modal">
        <div className="combat-animation__title item-animation__title-bar">{data.itemName}</div>

        {/* Battle stage — single unit centered */}
        <div className="combat-animation__stage">
          <div className={`combat-animation__fighter item-animation__fighter--center ${unitCls}`}>
            <BattleSprite
              classId={data.unitClassId}
              faction={data.unitFaction}
              mirrored={false}
              pose="idle"
              weaponType="sword"
            />
          </div>

          {/* Heal particles during receive */}
          {phase === 'receive' && (
            <div className="item-animation__particles" key="item-particles">
              <div className="heal-animation__particle heal-animation__particle--1" />
              <div className="heal-animation__particle heal-animation__particle--2" />
              <div className="heal-animation__particle heal-animation__particle--3" />
              <div className="heal-animation__particle heal-animation__particle--4" />
            </div>
          )}

          {/* Heal number */}
          {healVisible && (
            <div className="item-animation__number" key="item-num" data-testid="item-heal-amount">
              +{data.healAmount}
            </div>
          )}

          {/* Ground */}
          <div className="combat-animation__ground-line" />
        </div>

        {/* Info panel — single unit */}
        <div className="combat-animation__info item-animation__info">
          <div className="combat-animation__unit-info">
            <div className="combat-animation__name">{data.unitName}</div>
            <div className="combat-animation__weapon-name" style={{ color: '#22c55e' }}>
              {data.itemName}
            </div>
            <div className="combat-animation__hp-bar">
              <div
                className="combat-animation__hp-fill heal-animation__hp-fill--heal"
                style={{ width: `${Math.max(0, (displayHp / data.maxHp) * 100)}%` }}
              />
            </div>
            <div
              className="combat-animation__hp-text"
              style={{ color: hpColor(displayHp, data.maxHp) }}
            >
              {displayHp}/{data.maxHp}
            </div>
          </div>

          <div className="combat-animation__step" style={{ color: '#22c55e' }}>
            {T.ui('item.recovery', 'Recovery')}
          </div>

          <div className="combat-animation__unit-info" style={{ visibility: 'hidden' }}>
            {/* Hidden spacer for layout symmetry */}
          </div>
        </div>
      </div>
    </div>
  );
}
