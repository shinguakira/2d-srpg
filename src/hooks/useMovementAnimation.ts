import { useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';

const STEP_INTERVAL_MS = 100;

/** Watches movingUnit state and advances walk animation on an interval */
export function useMovementAnimation() {
  const movingUnit = useGameStore((s) => s.movingUnit);
  const advanceMovement = useGameStore((s) => s.advanceMovement);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (!movingUnit) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      advanceMovement();
    }, STEP_INTERVAL_MS);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, [movingUnit, advanceMovement]);
}
