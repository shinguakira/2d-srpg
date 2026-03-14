import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { BattleSprite } from './BattleSprite';

const STAT_LABELS: Record<string, string> = {
  hp: 'HP', str: 'STR', mag: 'MAG', def: 'DEF',
  res: 'RES', spd: 'SPD', skl: 'SKL', lck: 'LCK',
};

const STAT_ORDER = ['hp', 'str', 'mag', 'skl', 'spd', 'def', 'res', 'lck'];

export function LevelUpPopup() {
  const gains = useGameStore((s) => s.levelUpGains);
  const unitId = useGameStore((s) => s.levelUpUnitId);
  const units = useGameStore((s) => s.units);
  const dismiss = useGameStore((s) => s.dismissLevelUp);
  const expBarData = useGameStore((s) => s.expBarData);

  // FE-style: reveal stats one by one
  const [revealedCount, setRevealedCount] = useState(0);
  const [allRevealed, setAllRevealed] = useState(false);

  useEffect(() => {
    if (!gains || !unitId) {
      setRevealedCount(0);
      setAllRevealed(false);
      return;
    }
    // Start revealing stats one by one
    setRevealedCount(0);
    setAllRevealed(false);
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setRevealedCount(idx);
      if (idx >= STAT_ORDER.length) {
        clearInterval(interval);
        setAllRevealed(true);
      }
    }, 250); // 250ms per stat — FE-style pacing
    return () => clearInterval(interval);
  }, [gains, unitId]);

  const handleClick = useCallback(() => {
    if (!allRevealed) {
      // Skip animation — reveal all at once
      setRevealedCount(STAT_ORDER.length);
      setAllRevealed(true);
    } else {
      dismiss();
    }
  }, [allRevealed, dismiss]);

  // Don't show level-up until EXP bar is done
  if (expBarData) return null;
  if (!gains || !unitId) return null;

  const unit = units.get(unitId);
  if (!unit) return null;

  return (
    <div className="level-up-popup" data-testid="level-up-popup" onClick={handleClick}>
      <div className="level-up-popup__panel">
        <div className="level-up-popup__header">
          ★ LEVEL UP! ★
        </div>

        <div className="level-up-popup__identity">
          <div className="level-up-popup__sprite">
            <BattleSprite classId={unit.classId} faction={unit.faction} />
          </div>
          <div className="level-up-popup__name-block">
            <div className="level-up-popup__name">{unit.name}</div>
            <div className="level-up-popup__class">→ Lv.{unit.level}</div>
          </div>
        </div>

        <div className="level-up-popup__stats">
          {STAT_ORDER.map((key, idx) => {
            const value = (gains as Record<string, number>)[key] ?? 0;
            const statVal = (unit.stats as Record<string, number>)[key] ?? 0;
            const gained = value > 0;
            const revealed = idx < revealedCount;

            return (
              <div
                key={key}
                className={`level-up-popup__stat ${revealed && gained ? 'level-up-popup__stat--gained' : ''} ${revealed ? 'level-up-popup__stat--revealed' : 'level-up-popup__stat--hidden'}`}
              >
                <span className="level-up-popup__stat-name">{STAT_LABELS[key]}</span>
                <span className="level-up-popup__stat-value">{revealed ? statVal : '—'}</span>
                <div className="level-up-popup__stat-bar">
                  <div
                    className={`level-up-popup__stat-bar-fill ${revealed && gained ? 'level-up-popup__stat-bar-fill--gained' : ''}`}
                    style={{ width: revealed ? `${Math.min(100, (statVal / 30) * 100)}%` : '0%' }}
                  />
                </div>
                <span className="level-up-popup__stat-gain">
                  {revealed ? (gained ? `+${value}` : '—') : ''}
                </span>
              </div>
            );
          })}
        </div>

        <div className="level-up-popup__hint">
          {allRevealed ? 'Click to dismiss' : 'Click to skip'}
        </div>
      </div>
    </div>
  );
}
