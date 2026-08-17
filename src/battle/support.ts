import type { Affinity, Pos, Unit } from '../types';

/**
 * 支援システム（FE8 準拠）
 *
 * ・効果は「(自分の属性値 + 相手の属性値) × 支援ランク(C=1/B=2/A=3)」、小数は切り捨て
 * ・支援相手が 3 マス以内にいるときだけ発動する
 * ・1 ユニットが持てる支援は合計 5 段階まで（A=3, B=2, C=1）
 *
 * 友好度のしきい値は原作どおり C=81 / B=161 / A=241。
 * ただし 1 マップで完結する PoC なので、隣接 1 ターンの上昇量だけ大きくしている
 * （原作は 1 ターンあたり +2〜4 程度）。
 */

export interface SupportBonus {
  atk: number;
  def: number;
  hit: number;
  avo: number;
  crit: number;
  ddg: number;
}

interface AffinityValue {
  atk: number;
  def: number;
  hit: number;
  avo: number;
  crit: number;
  ddg: number;
}

const A = (atk: number, def: number, hit: number, avo: number, crit: number, ddg: number): AffinityValue => ({
  atk,
  def,
  hit,
  avo,
  crit,
  ddg,
});

/** 属性ごとの 1 ランクあたりの寄与 */
const AFFINITY_VALUE: Record<Affinity, AffinityValue> = {
  fire: A(0.5, 0, 2.5, 2.5, 2.5, 0),
  thunder: A(0, 0.5, 0, 2.5, 2.5, 2.5),
  wind: A(0.5, 0, 2.5, 0, 2.5, 2.5),
  ice: A(0, 0.5, 2.5, 2.5, 0, 2.5),
  dark: A(0, 0, 2.5, 2.5, 2.5, 2.5),
  light: A(0.5, 0.5, 2.5, 0, 2.5, 0),
  anima: A(0.5, 0.5, 0, 2.5, 0, 2.5),
};

export const AFFINITY_NAME: Record<Affinity, string> = {
  fire: '火',
  thunder: '雷',
  wind: '風',
  ice: '氷',
  dark: '闇',
  light: '光',
  anima: '理',
};

export const AFFINITY_COLOR: Record<Affinity, string> = {
  fire: '#ff8a5c',
  thunder: '#ffd45c',
  wind: '#8ce8b0',
  ice: '#8cd8ff',
  dark: '#b98cff',
  light: '#fff0a8',
  anima: '#7fb0ff',
};

/** 友好度のしきい値（原作準拠） */
export const SUPPORT_THRESHOLD = [0, 81, 161, 241];
/** 隣接 1 ターンあたりの友好度上昇（PoC 用に加速） */
const SUPPORT_GAIN_PER_TURN = 28;
/** 支援効果が発動する距離 */
const SUPPORT_RANGE = 3;
/** 1 ユニットが持てる支援ランクの合計 */
const SUPPORT_LEVEL_CAP = 5;

export const RANK_LABEL = ['-', 'C', 'B', 'A'];

export const ZERO_BONUS: SupportBonus = { atk: 0, def: 0, hit: 0, avo: 0, crit: 0, ddg: 0 };

export function linkOf(u: Unit, otherId: string) {
  return u.supports.find((s) => s.with === otherId);
}

function totalSupportLevels(u: Unit): number {
  return u.supports.reduce((n, s) => n + s.rank, 0);
}

/** 次のランクに必要な友好度に達しているか（会話で確定させる） */
export function canRankUp(a: Unit, b: Unit): boolean {
  const la = linkOf(a, b.id);
  const lb = linkOf(b, a.id);
  if (!la || !lb) return false;
  if (la.rank >= 3) return false;
  if (la.points < SUPPORT_THRESHOLD[la.rank + 1]) return false;
  if (totalSupportLevels(a) >= SUPPORT_LEVEL_CAP || totalSupportLevels(b) >= SUPPORT_LEVEL_CAP) return false;
  return true;
}

const dist = (a: Pos, b: Pos) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

/**
 * そのユニットが今いる位置で受けている支援効果。
 * pos を渡すと移動先での効果を計算できる（戦闘予測用）。
 */
export function supportBonus(unit: Unit, units: Unit[], pos: Pos = unit): SupportBonus {
  const out: SupportBonus = { ...ZERO_BONUS };
  const mine = AFFINITY_VALUE[unit.affinity];

  for (const link of unit.supports) {
    if (link.rank <= 0) continue;
    const partner = units.find((u) => u.id === link.with && !u.dead);
    if (!partner) continue;
    if (dist(pos, partner) > SUPPORT_RANGE) continue;

    const theirs = AFFINITY_VALUE[partner.affinity];
    out.atk += Math.floor((mine.atk + theirs.atk) * link.rank);
    out.def += Math.floor((mine.def + theirs.def) * link.rank);
    out.hit += Math.floor((mine.hit + theirs.hit) * link.rank);
    out.avo += Math.floor((mine.avo + theirs.avo) * link.rank);
    out.crit += Math.floor((mine.crit + theirs.crit) * link.rank);
    out.ddg += Math.floor((mine.ddg + theirs.ddg) * link.rank);
  }
  return out;
}

/** 自軍フェイズ開始時に隣接している味方同士の友好度を上げる */
export function accumulateSupport(units: Unit[]): void {
  const alive = units.filter((u) => !u.dead && u.team === 'player');
  for (let i = 0; i < alive.length; i++) {
    for (let j = i + 1; j < alive.length; j++) {
      const a = alive[i];
      const b = alive[j];
      if (dist(a, b) !== 1) continue;
      const la = linkOf(a, b.id);
      const lb = linkOf(b, a.id);
      if (!la || !lb) continue; // 支援会話が用意されていないペア
      if (la.rank >= 3) continue;
      la.points = Math.min(SUPPORT_THRESHOLD[3], la.points + SUPPORT_GAIN_PER_TURN);
      lb.points = la.points;
    }
  }
}
