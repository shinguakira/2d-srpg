/** 再現性のある乱数（xorshift32） */
class Rng {
  private s: number;

  constructor(seed = 20260817) {
    this.s = seed >>> 0 || 1;
  }

  next(): number {
    let x = this.s;
    x ^= x << 13;
    x >>>= 0;
    x ^= x >>> 17;
    x ^= x << 5;
    x >>>= 0;
    this.s = x;
    return x / 0x100000000;
  }

  /** 0..99 */
  roll(): number {
    return Math.floor(this.next() * 100);
  }

  /** FE準拠の 2RN 命中判定（表示命中より体感命中が高くなる） */
  hitCheck(displayed: number): boolean {
    if (displayed >= 100) return true;
    if (displayed <= 0) return false;
    const avg = (this.roll() + this.roll()) / 2;
    return avg < displayed;
  }

  /** 1RN 判定（必殺・成長率） */
  check(rate: number): boolean {
    if (rate <= 0) return false;
    if (rate >= 100) return true;
    return this.roll() < rate;
  }
}

export const rng = new Rng(Math.floor(Math.random() * 0xffffffff));
