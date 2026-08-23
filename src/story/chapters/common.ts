import type { Line, Script } from '../dialogue';

/** 台詞。話者名・立ち絵に使う ID・左右・本文 */
export const L = (speaker: string, who: string, side: 'left' | 'right', text: string): Line => ({ speaker, who, side, text });

/** ナレーション。話者を持たない行 */
export const N = (text: string): Line => ({ text });

/**
 * 負けたときの共通台本。章が自前のものを持っていればそちらが優先される。
 *
 * シゲルが倒れれば章に関わらず走行はそこで終わるので、ここは章ごとに書き分ける
 * ものが無い。
 */
export const DEFEAT: Script = {
  id: 'defeat',
  lines: [L('ジェイガン', 'p_akira', 'right', '殿下——！ ……申し訳、ありません。'), N('炎の聖剣は、ここで失われた。')],
};
