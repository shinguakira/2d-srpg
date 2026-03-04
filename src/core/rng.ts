/**
 * Seeded pseudo-random number generator.
 * Uses a linear congruential generator for deterministic results.
 * All game randomness must go through this — no Math.random() calls.
 */
export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  /** Returns a float in [0, 1) */
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  /** Returns an integer in [min, max] inclusive */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /** Returns true with the given probability (0-100) */
  roll(percent: number): boolean {
    return this.next() * 100 < percent;
  }
}
