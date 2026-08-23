import type { UnitClass } from '../types';

/**
 * FE8 のクラス構成。下級職は Lv10 以上でマスタープルフを使うと 2 択でクラスチェンジできる。
 */
const CLASSES: Record<string, UnitClass> = {
  // ---------------- 自軍・下級職
  lord: {
    id: 'lord',
    name: 'ロード',
    moveType: 'foot',
    ranks: { sword: 'A' },
    color: '#4f7fd6',
    accent: '#cfe0ff',
    promotion: { item: 'masterSeal', options: ['masterLord'] },
    promoGain: { hp: 3, str: 2, skl: 2, spd: 2, def: 2, res: 3, con: 1 },
  },
  cavalier: {
    id: 'cavalier',
    name: 'ソシアルナイト',
    moveType: 'mounted',
    ranks: { sword: 'A', lance: 'A' },
    color: '#4a68c4',
    accent: '#dfe7ff',
    tags: ['cavalry'],
    promotion: { item: 'masterSeal', options: ['paladin', 'greatKnight'] },
    promoGain: { hp: 3, str: 2, skl: 1, spd: 1, def: 2, res: 3, con: 1, mov: 1 },
  },
  fighter: {
    id: 'fighter',
    name: '戦士',
    moveType: 'foot',
    ranks: { axe: 'A' },
    color: '#c46a3a',
    accent: '#ffe0c0',
    promotion: { item: 'masterSeal', options: ['warrior', 'berserker'] },
    promoGain: { hp: 4, str: 2, skl: 2, spd: 1, def: 2, res: 2, con: 1 },
  },
  archer: {
    id: 'archer',
    name: 'アーチャー',
    moveType: 'foot',
    ranks: { bow: 'A' },
    color: '#3f8f70',
    accent: '#d5ffe9',
    promotion: { item: 'masterSeal', options: ['sniper', 'ranger'] },
    promoGain: { hp: 3, str: 2, skl: 2, spd: 2, def: 1, res: 2, con: 1 },
  },
  mage: {
    id: 'mage',
    name: '魔道士',
    moveType: 'foot',
    ranks: { anima: 'A' },
    color: '#8a5ac4',
    accent: '#f0dcff',
    promotion: { item: 'masterSeal', options: ['sage', 'mageKnight'] },
    promoGain: { hp: 3, mag: 2, skl: 2, spd: 2, def: 2, res: 3, con: 1 },
  },
  cleric: {
    id: 'cleric',
    name: '僧侶',
    moveType: 'foot',
    ranks: { staff: 'A' },
    color: '#c9c04a',
    accent: '#fff9d0',
    promotion: { item: 'masterSeal', options: ['bishop', 'valkyrie'] },
    promoGain: { hp: 4, mag: 2, skl: 2, spd: 2, def: 3, res: 3, con: 1 },
  },
  monk: {
    id: 'monk',
    name: '修道士',
    moveType: 'foot',
    ranks: { light: 'A' },
    color: '#d8d2c0',
    accent: '#fffdf0',
    promotion: { item: 'masterSeal', options: ['bishop', 'sage'] },
    promoGain: { hp: 3, mag: 2, skl: 2, spd: 1, def: 2, res: 3, con: 1 },
  },
  thief: {
    id: 'thief',
    name: 'シーフ',
    moveType: 'foot',
    ranks: { sword: 'E' },
    color: '#4a4a68',
    accent: '#cfcfe8',
    steal: true,
    promotion: { item: 'masterSeal', options: ['rogue', 'assassin'] },
    promoGain: { hp: 3, str: 1, skl: 2, spd: 2, def: 1, res: 2, con: 1 },
  },
  dancer: {
    id: 'dancer',
    name: '踊り子',
    moveType: 'foot',
    ranks: { sword: 'E' },
    color: '#c05a86',
    accent: '#ffd8e8',
    dance: true,
  },
  /** 騎馬の杖。歩きの僧より届く範囲が広く、そのぶん打たれ弱い */
  troubadour: {
    id: 'troubadour',
    name: 'トルバドール',
    moveType: 'mounted',
    ranks: { staff: 'A' },
    color: '#c98fb0',
    accent: '#ffe6f2',
    promotion: { item: 'masterSeal', options: ['valkyrie', 'mageKnight'] },
    promoGain: { hp: 3, mag: 2, skl: 2, spd: 2, def: 3, res: 2, con: 1 },
  },
  pegasus: {
    id: 'pegasus',
    name: 'ペガサスナイト',
    moveType: 'flier',
    ranks: { lance: 'A' },
    color: '#5fb6d6',
    accent: '#e6faff',
    tags: ['flier'],
    promotion: { item: 'masterSeal', options: ['falcoknight', 'wyvernKnight'] },
    promoGain: { hp: 4, str: 2, skl: 2, spd: 1, def: 3, res: 2, con: 2 },
  },

  // ---------------- 自軍・上級職
  masterLord: {
    id: 'masterLord',
    name: 'マスターロード',
    moveType: 'foot',
    ranks: { sword: 'S' },
    color: '#3f6fd0',
    accent: '#e6f0ff',
    promoted: true,
    critBonus: 5,
  },
  paladin: {
    id: 'paladin',
    name: 'パラディン',
    moveType: 'mounted',
    ranks: { sword: 'A', lance: 'A' },
    color: '#3c5cbc',
    accent: '#eaf0ff',
    tags: ['cavalry'],
    promoted: true,
  },
  greatKnight: {
    id: 'greatKnight',
    name: 'グレートナイト',
    moveType: 'mounted',
    ranks: { sword: 'A', lance: 'A', axe: 'A' },
    color: '#48557f',
    accent: '#dce4ff',
    tags: ['cavalry', 'armor'],
    promoted: true,
  },
  warrior: {
    id: 'warrior',
    name: 'ウォーリア',
    moveType: 'foot',
    ranks: { axe: 'A', bow: 'A' },
    color: '#b25a2c',
    accent: '#ffdcb8',
    promoted: true,
  },
  berserker: {
    id: 'berserker',
    name: 'バーサーカー',
    moveType: 'foot',
    ranks: { axe: 'S' },
    color: '#a4432c',
    accent: '#ffd0b0',
    promoted: true,
    critBonus: 15,
  },
  sniper: {
    id: 'sniper',
    name: 'スナイパー',
    moveType: 'foot',
    ranks: { bow: 'S' },
    color: '#2f7d60',
    accent: '#cdf5e4',
    promoted: true,
    critBonus: 5,
  },
  ranger: {
    id: 'ranger',
    name: 'レンジャー',
    moveType: 'mounted',
    ranks: { sword: 'A', bow: 'A' },
    color: '#3b7f5c',
    accent: '#d8f7e6',
    tags: ['cavalry'],
    promoted: true,
  },
  sage: {
    id: 'sage',
    name: '賢者',
    moveType: 'foot',
    ranks: { anima: 'S', light: 'A', staff: 'A' },
    color: '#7a4bb8',
    accent: '#f2e2ff',
    promoted: true,
  },
  mageKnight: {
    id: 'mageKnight',
    name: 'マージナイト',
    moveType: 'mounted',
    ranks: { anima: 'A', staff: 'A' },
    color: '#6a54c0',
    accent: '#e8e0ff',
    tags: ['cavalry'],
    promoted: true,
  },
  bishop: {
    id: 'bishop',
    name: '司祭',
    moveType: 'foot',
    ranks: { light: 'S', staff: 'A' },
    color: '#c2b64a',
    accent: '#fffbd8',
    promoted: true,
    slayer: true,
  },
  valkyrie: {
    id: 'valkyrie',
    name: 'ヴァルキュリア',
    moveType: 'mounted',
    ranks: { anima: 'A', staff: 'A' },
    color: '#c99a4a',
    accent: '#fff0cc',
    tags: ['cavalry'],
    promoted: true,
  },
  falcoknight: {
    id: 'falcoknight',
    name: 'ファルコンナイト',
    moveType: 'flier',
    ranks: { lance: 'A', staff: 'A' },
    color: '#4fa8ce',
    accent: '#eafcff',
    tags: ['flier'],
    promoted: true,
  },
  rogue: {
    id: 'rogue',
    name: 'ローグ',
    moveType: 'foot',
    ranks: { sword: 'A' },
    color: '#3d3d5c',
    accent: '#dcdcf4',
    promoted: true,
    steal: true,
    critBonus: 5,
  },
  assassin: {
    id: 'assassin',
    name: 'アサシン',
    moveType: 'foot',
    ranks: { sword: 'S' },
    color: '#2f3350',
    accent: '#d0d4f0',
    promoted: true,
    steal: true,
    critBonus: 10,
  },
  wyvernKnight: {
    id: 'wyvernKnight',
    name: '飛竜ナイト',
    moveType: 'flier',
    ranks: { lance: 'S' },
    color: '#4a8f7a',
    accent: '#dcfff2',
    tags: ['flier', 'dragon'],
    promoted: true,
    critBonus: 5,
  },

  // ---------------- 敵・人間
  brigand: { id: 'brigand', name: '山賊', moveType: 'foot', ranks: { axe: 'D' }, color: '#9c3b3b', accent: '#ffd2d2' },
  mercenary: { id: 'mercenary', name: '傭兵', moveType: 'foot', ranks: { sword: 'C' }, color: '#a4453f', accent: '#ffd8cc', critBonus: 5 },
  soldier: { id: 'soldier', name: '兵士', moveType: 'foot', ranks: { lance: 'D' }, color: '#8a4a5c', accent: '#ffd6e0' },
  eArcher: { id: 'eArcher', name: '狩人', moveType: 'foot', ranks: { bow: 'D' }, color: '#7d4a2e', accent: '#ffe2c8' },
  shaman: { id: 'shaman', name: '暗黒魔道士', moveType: 'foot', ranks: { dark: 'D' }, color: '#6b3fa0', accent: '#e8d2ff' },
  knight: {
    id: 'knight',
    name: 'アーマーナイト',
    moveType: 'foot',
    ranks: { lance: 'D' },
    color: '#5a5f86',
    accent: '#dfe2ff',
    tags: ['armor'],
  },
  general: {
    id: 'general',
    name: 'アーマージェネラル',
    moveType: 'foot',
    ranks: { lance: 'A', axe: 'B' },
    color: '#70394c',
    accent: '#d8b8c4',
    tags: ['armor'],
    promoted: true,
  },

  // ---------------- 魔物（FE8 の看板）
  revenant: {
    id: 'revenant',
    name: '屍兵',
    moveType: 'foot',
    ranks: { monster: 'E' },
    color: '#4c5b48',
    accent: '#c3d6b8',
    tags: ['monster'],
  },
  bael: { id: 'bael', name: 'バエル', moveType: 'foot', ranks: { monster: 'E' }, color: '#6d4030', accent: '#e8c0a0', tags: ['monster'] },
  mogall: {
    id: 'mogall',
    name: 'モーグル',
    moveType: 'flier',
    ranks: { monster: 'E' },
    color: '#5a3a6e',
    accent: '#e0c8ff',
    tags: ['monster', 'flier'],
  },
  gargoyle: {
    id: 'gargoyle',
    name: 'ガーゴイル',
    moveType: 'flier',
    ranks: { lance: 'D' },
    color: '#4a5560',
    accent: '#cfd8e4',
    tags: ['monster', 'flier'],
  },
  /**
   * 黒炎の巨兵。**屍兵とは別物で、元は一人ではない。** 複数から組み上げられて
   * いる、というのが第10章でリゼットが言う区別（specs/story/chapters/ch10.md）。
   * 硬く、遅く、狙いを変えない。
   */
  colossus: {
    id: 'colossus',
    name: '巨兵',
    moveType: 'foot',
    ranks: { monster: 'A' },
    color: '#3a3340',
    accent: '#9c8fb0',
    tags: ['monster', 'armor'],
    promoted: true,
  },
};

// GBA FE では騎馬と飛行はもれなく再移動（カント）を持つ。クラスごとに書くと
// 増やしたときに必ずつけ忘れるので、移動型から起こす。
for (const c of Object.values(CLASSES)) {
  if (c.moveType === 'mounted' || c.moveType === 'flier') c.canto = true;
}

export function classOf(id: string): UnitClass {
  const c = CLASSES[id];
  if (!c) throw new Error(`unknown class: ${id}`);
  return c;
}

export const MOVE_INDEX = { foot: 0, mounted: 1, flier: 2 } as const;

/**
 * 魔法を使うクラスか。
 *
 * GBA の FE に「力」と「魔力」は無く、**枠は一つ**で、物理武器なら腕力、魔道書
 * なら魔力として働く。こちらは二つに分けているので、どちらが本物かをクラスで
 * 決める。レベルアップの八行に両方は載らないし、載せると使わないほうの数字が
 * 伸びていく。
 */
export function isMagicClass(id: string): boolean {
  const { ranks } = classOf(id);
  return Boolean(ranks.anima ?? ranks.light ?? ranks.dark ?? ranks.staff);
}

/**
 * 援護（Aid）。救出できる相手の体格の上限で、GBA FE はこの式。
 * 騎馬は 25 − 体格、飛行は 20 − 体格、歩行は 体格 − 1。
 */
export function aidOf(u: { classId: string; stats: { con: number } }): number {
  const t = classOf(u.classId).moveType;
  if (t === 'mounted') return Math.max(0, 25 - u.stats.con);
  if (t === 'flier') return Math.max(0, 20 - u.stats.con);
  return Math.max(0, u.stats.con - 1);
}
