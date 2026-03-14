import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../../stores/gameStore';

/**
 * FE GBA-style EXP bar that fills from old value to new after combat.
 * If it reaches 100, it instantly resets to 0 (level-up), then continues filling.
 */
export function ExpBar() {
  const expBarData = useGameStore((s) => s.expBarData);
  const dismissExpBar = useGameStore((s) => s.dismissExpBar);

  const [displayExp, setDisplayExp] = useState(0);
  const [filling, setFilling] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!expBarData) {
      setDisplayExp(0);
      setFilling(false);
      return;
    }

    const { expBefore, expGain, leveled } = expBarData;
    setDisplayExp(expBefore);
    setFilling(true);

    const totalTarget = expBefore + expGain;
    let current = expBefore;
    const step = Math.max(1, Math.ceil(expGain / 30));
    let cancelled = false;

    function startFillPhase1() {
      const interval = setInterval(() => {
        if (cancelled) { clearInterval(interval); return; }
        current += step;

        if (leveled && current >= 100) {
          // Hit 100 — instantly reset to 0 and continue
          clearInterval(interval);
          setDisplayExp(0);
          current = 0;
          const remainder = totalTarget - 100;
          // Start phase 2 immediately from 0
          setTimeout(() => {
            if (cancelled) return;
            startFillPhase2(remainder);
          }, 50); // tiny delay for visual "reset" flash
          return;
        }

        if (!leveled && current >= totalTarget) {
          setDisplayExp(totalTarget);
          setFilling(false);
          clearInterval(interval);
          setTimeout(() => { if (!cancelled) dismissExpBar(); }, 600);
          return;
        }

        setDisplayExp(Math.min(current, 100));
      }, 30);

      cleanupRef.current = () => { cancelled = true; clearInterval(interval); };
    }

    function startFillPhase2(remainder: number) {
      let cur2 = 0;
      const step2 = Math.max(1, Math.ceil(remainder / 15));
      const interval2 = setInterval(() => {
        if (cancelled) { clearInterval(interval2); return; }
        cur2 += step2;
        if (cur2 >= remainder) {
          setDisplayExp(remainder);
          setFilling(false);
          clearInterval(interval2);
          setTimeout(() => { if (!cancelled) dismissExpBar(); }, 600);
        } else {
          setDisplayExp(cur2);
        }
      }, 30);

      cleanupRef.current = () => { cancelled = true; clearInterval(interval2); };
    }

    startFillPhase1();

    return () => {
      cancelled = true;
      cleanupRef.current?.();
    };
  }, [expBarData]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = useCallback(() => {
    cleanupRef.current?.();
    dismissExpBar();
  }, [dismissExpBar]);

  if (!expBarData) return null;

  return (
    <div className="exp-bar-overlay" data-testid="exp-bar" onClick={handleClick}>
      <div className="exp-bar__panel">
        <div className="exp-bar__label">
          <span className="exp-bar__name">{expBarData.unitName}</span>
          <span className="exp-bar__text">EXP</span>
          <span className="exp-bar__value">{Math.min(displayExp, 99)}</span>
        </div>
        <div className="exp-bar__track">
          <div
            className={`exp-bar__fill ${filling ? 'exp-bar__fill--filling' : ''}`}
            style={{ width: `${displayExp}%` }}
          />
        </div>
      </div>
    </div>
  );
}
