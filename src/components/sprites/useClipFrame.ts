import { useMemo, useSyncExternalStore } from 'react';
import type { Clip } from './spriteSheetConfig';

/**
 * One clock drives every sprite on screen. Previously each UnitSprite owned a
 * setInterval, so a 20-unit map ran 20 unsynchronised timers that also defeated
 * memoisation. The tick is the fastest rate any clip needs, and clips sample it
 * by their own fps.
 */
const TICK_MS = 1000 / 12;

let nowMs = 0;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  if (timer === null) {
    timer = setInterval(() => {
      nowMs += TICK_MS;
      for (const l of listeners) l();
    }, TICK_MS);
  }
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0 && timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  };
}

const getNow = () => nowMs;

/**
 * Current frame number of `clip`.
 *
 * `restartKey` restarts a non-looping clip when it changes — pass the combat
 * step so each attack replays from its first frame. `phase` offsets looping
 * clips so a map full of the same class does not animate in lockstep.
 */
export function useClipFrame(clip: Clip, restartKey?: string | number, phase = 0): number {
  const now = useSyncExternalStore(subscribe, getNow, getNow);
  // Captured once per restartKey; the clock is monotonic so this is the origin.
  const startedAt = useMemo(() => getNow(), [restartKey]);

  const step = Math.floor((now - startedAt) / (1000 / clip.fps));
  const n = clip.frames.length;
  const i = clip.loop
    ? (((step + phase) % n) + n) % n
    : Math.max(0, Math.min(step, n - 1));
  return clip.frames[i];
}

/** Stable small integer from a unit id, used to desynchronise idle loops. */
export function phaseOf(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}
