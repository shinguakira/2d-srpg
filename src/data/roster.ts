import type { Affinity, Stats, Unit } from '../types';
import { SUPPORT_PAIRS } from '../story/supports';
import { cloneWeapon, WEXP_THRESHOLD } from './weapons';

/** 能力値をまとめて書くための省略。順番は Stats のとおり */
function st(
  hp: number,
  str: number,
  mag: number,
  skl: number,
  spd: number,
  lck: number,
  def: number,
  res: number,
  con: number,
  mov: number,
): Stats {
  return { hp, str, mag, skl, spd, lck, def, res, con, mov };
}

export interface Seed {
  id: string;
  name: string;
  classId: string;
  level: number;
  stats: Stats;
  growth: Stats;
  x: number;
  y: number;
  weapons: string[];
  affinity: Affinity;
  wexp?: Partial<Record<string, number>>;
  potion?: number;
  keys?: number;
  seals?: number;
  ai?: Unit['ai'];
  isLord?: boolean;
  isBoss?: boolean;
  recruitableBy?: string;
  /** 加入する章（0 起点）。無ければ最初から居る */
  joinsAt?: number;
  /** 味方 NPC。自軍だが操作できず、行動済みで始まる */
  npc?: boolean;
}

/**
 * 自軍の顔ぶれ。章をまたいで持ち越すので、章のデータからは切り離してある。
 *
 * **id は `specs/story/roster.md` の設計名、`name` は劇中の表記。** 二つが
 * 分かれているのはジェイガンの都合で、彼の設計名は Akira、劇中で名乗るのは
 * ジェイガンという別名。他の面々は素直に一致する。
 *
 * **加入章は `joinsAt` に入っている**（0 起点。第3章なら 2）。campaign が
 * それを見て、まだ加入していない者を出撃名簿から外す。章の途中で入る者は
 * 章の `events` が盤に置く —— ハルヴァルの寝返り、フェンの登場、ヴィヴィアンの
 * 乱入。設計は specs/story/roster.md。
 */
export const ROSTER: Seed[] = [
  {
    id: 'p_shigeru',
    name: 'シゲル',
    classId: 'lord',
    level: 3,
    x: 9,
    y: 12,
    affinity: 'light',
    stats: st(20, 6, 2, 9, 11, 8, 5, 3, 5, 5),
    growth: st(70, 45, 25, 60, 60, 60, 30, 30, 0, 0),
    weapons: ['rapier', 'ironSword'],
    keys: 1,
    wexp: { sword: 45 },
    potion: 2,
    isLord: true,
    seals: 1,
  },
  {
    id: 'p_akira',
    name: 'ジェイガン',
    classId: 'cavalier',
    level: 4,
    x: 10,
    y: 12,
    affinity: 'anima',
    stats: st(24, 8, 1, 8, 8, 5, 8, 2, 10, 7),
    growth: st(80, 50, 15, 45, 45, 35, 40, 20, 0, 0),
    weapons: ['ironLance', 'ironSword', 'javelin'],
    keys: 2,
    wexp: { lance: 50, sword: 35 },
    potion: 1,
  },
  {
    id: 'p_gareth',
    name: 'ガレス',
    classId: 'fighter',
    level: 3,
    x: 8,
    y: 12,
    affinity: 'fire',
    stats: st(28, 9, 0, 6, 6, 3, 4, 0, 12, 5),
    growth: st(85, 60, 5, 40, 40, 30, 25, 10, 0, 0),
    weapons: ['ironAxe', 'handAxe', 'hammer'],
    wexp: { axe: 60 },
    potion: 1,
  },
  {
    id: 'p_bryn',
    name: 'ブリン',
    classId: 'archer',
    level: 2,
    x: 11,
    y: 12,
    affinity: 'wind',
    stats: st(18, 6, 0, 10, 9, 6, 3, 1, 6, 5),
    growth: st(60, 45, 5, 65, 55, 40, 20, 20, 0, 0),
    weapons: ['ironBow'],
    wexp: { bow: 40 },
    potion: 1,
    joinsAt: 2,
  },
  {
    id: 'p_lisette',
    name: 'リゼット',
    classId: 'mage',
    level: 2,
    x: 9,
    y: 11,
    affinity: 'thunder',
    stats: st(17, 1, 7, 8, 8, 5, 2, 6, 4, 5),
    growth: st(55, 10, 60, 55, 55, 35, 15, 45, 0, 0),
    weapons: ['fire'],
    wexp: { anima: 35 },
    potion: 1,
  },
  {
    id: 'p_mirelle',
    name: 'ミレイユ',
    classId: 'cleric',
    level: 2,
    x: 10,
    y: 11,
    affinity: 'light',
    stats: st(16, 1, 6, 6, 8, 9, 2, 7, 4, 5),
    growth: st(50, 10, 55, 40, 50, 60, 10, 50, 0, 0),
    // 杖は回復だけではない。リザーブで状態異常を解き、スリープで敵を止める
    weapons: ['heal', 'restore', 'sleepStaff'],
    wexp: { staff: 125 },
    potion: 2,
  },
  {
    id: 'p_elin',
    name: 'エリン',
    classId: 'pegasus',
    level: 3,
    x: 8,
    y: 11,
    affinity: 'ice',
    stats: st(19, 6, 2, 9, 12, 7, 5, 6, 5, 7),
    growth: st(60, 45, 20, 55, 65, 45, 25, 45, 0, 0),
    weapons: ['ironLance', 'javelin'],
    wexp: { lance: 45 },
    potion: 1,
    joinsAt: 4,
  },
  {
    id: 'p_ald',
    name: 'アルド',
    classId: 'monk',
    level: 2,
    x: 11,
    y: 11,
    affinity: 'fire',
    stats: st(18, 1, 6, 7, 7, 4, 3, 6, 5, 5),
    growth: st(55, 10, 55, 50, 50, 30, 20, 50, 0, 0),
    weapons: ['lightning'],
    wexp: { light: 35 },
    potion: 1,
    joinsAt: 14,
  },
  {
    id: 'p_halvar',
    name: 'ハルヴァル',
    classId: 'soldier',
    level: 6,
    x: 9,
    y: 12,
    affinity: 'ice',
    stats: st(27, 9, 0, 7, 6, 4, 8, 2, 12, 5),
    growth: st(85, 50, 0, 40, 35, 25, 45, 15, 0, 0),
    weapons: ['ironLance', 'javelin'],
    wexp: { lance: 90 },
    potion: 1,
    // 第2章で寝返り、第8章で死ぬ。どちらも章の events が動かす
    joinsAt: 2,
  },
  {
    id: 'p_fenn',
    name: 'フェン',
    classId: 'thief',
    level: 3,
    x: 9,
    y: 12,
    affinity: 'wind',
    stats: st(18, 5, 0, 11, 13, 7, 3, 1, 5, 6),
    growth: st(60, 35, 0, 60, 70, 45, 15, 20, 0, 0),
    weapons: ['ironSword'],
    wexp: { sword: 20 },
    keys: 4,
    potion: 1,
    joinsAt: 4,
  },
  {
    id: 'p_nadine',
    name: 'ナディーヌ',
    classId: 'troubadour',
    level: 3,
    x: 9,
    y: 12,
    affinity: 'light',
    stats: st(17, 1, 6, 6, 9, 8, 3, 8, 5, 7),
    growth: st(50, 10, 50, 40, 55, 55, 15, 55, 0, 0),
    weapons: ['heal', 'physic'],
    wexp: { staff: 110 },
    potion: 2,
    joinsAt: 6,
  },
  {
    id: 'p_viviane',
    name: 'ヴィヴィアン',
    classId: 'dancer',
    level: 2,
    x: 9,
    y: 12,
    affinity: 'anima',
    stats: st(16, 2, 2, 8, 14, 10, 2, 4, 4, 6),
    growth: st(45, 15, 15, 50, 70, 70, 10, 35, 0, 0),
    weapons: ['slimSword'],
    wexp: { sword: 20 },
    potion: 1,
    joinsAt: 9,
  },
  {
    // 第11章。灰の中で六年暮らして、灰の言葉で灰に返事をすることを覚えた者。
    // ミレイユは教義で、リゼットは証拠で疑う —— どちらも本人が思うより健全な疑い方
    id: 'p_jorn',
    name: 'ヨルン',
    classId: 'shaman',
    level: 8,
    x: 6,
    y: 12,
    affinity: 'dark',
    stats: st(26, 1, 11, 9, 7, 3, 5, 9, 7, 5),
    growth: st(60, 5, 60, 45, 35, 20, 25, 55, 0, 0),
    weapons: ['flux'],
    wexp: { dark: 90 },
    potion: 1,
    joinsAt: 11,
  },
  {
    // 第13章。灰を身に受けたまま飛んでいる。加入したその日から数字が減っていく
    id: 'p_selma',
    name: 'セルマ',
    classId: 'wyvernKnight',
    level: 9,
    x: 6,
    y: 12,
    affinity: 'wind',
    stats: st(31, 12, 0, 11, 10, 4, 11, 3, 12, 8),
    growth: st(75, 55, 0, 45, 45, 20, 40, 15, 0, 0),
    weapons: ['steelLance', 'javelin'],
    wexp: { lance: 160 },
    potion: 1,
    joinsAt: 13,
  },
  {
    // 第18章。第6章で見逃していれば来る（アエリン救出フラグ）。来なければ来ない
    id: 'p_aeryn',
    name: 'エイリン',
    classId: 'falcoknight',
    level: 4,
    x: 6,
    y: 12,
    affinity: 'wind',
    stats: st(33, 13, 4, 16, 18, 9, 10, 12, 8, 8),
    growth: st(70, 45, 25, 60, 65, 40, 30, 45, 0, 0),
    weapons: ['steelLance', 'javelin'],
    wexp: { lance: 190 },
    potion: 1,
    joinsAt: 18,
  },
  {
    // 第18章。まず退き、次に寝返る。クロガネの将校団が割れる章の、割れ目そのもの
    id: 'p_rolf',
    name: 'ロルフ',
    classId: 'knight',
    level: 12,
    x: 6,
    y: 12,
    affinity: 'anima',
    stats: st(36, 14, 0, 9, 6, 5, 16, 4, 15, 4),
    growth: st(85, 50, 0, 35, 25, 20, 55, 15, 0, 0),
    weapons: ['steelLance', 'javelin'],
    wexp: { lance: 180 },
    potion: 1,
    joinsAt: 18,
  },
];

/** その章までに加入しているか。章は 0 起点 */
export function joinedBy(id: string, chapter: number): boolean {
  const seed = ROSTER.find((s) => s.id === id);
  return !seed || (seed.joinsAt ?? 0) <= chapter;
}

export function build(seed: Seed, team: 'player' | 'enemy'): Unit {
  const items = seed.weapons.map(cloneWeapon);

  // 持たせた武器は必ず装備できるよう、必要な熟練度を最低保証する
  const wexp = { ...seed.wexp } as Unit['wexp'];
  for (const w of items) {
    const need = WEXP_THRESHOLD[w.rank];
    if ((wexp[w.type] ?? 0) < need) wexp[w.type] = need;
  }

  return {
    id: seed.id,
    name: seed.name,
    team,
    classId: seed.classId,
    level: seed.level,
    exp: 0,
    stats: { ...seed.stats },
    growth: { ...seed.growth },
    hp: seed.stats.hp,
    x: seed.x,
    y: seed.y,
    px: seed.x,
    py: seed.y,
    items,
    equipped: 0,
    potion: seed.potion ?? 0,
    keys: seed.keys ?? 0,
    acted: false,
    ai: seed.ai,
    isLord: seed.isLord,
    isBoss: seed.isBoss,
    affinity: seed.affinity,
    supports: [],
    wexp,
    seals: seed.seals ?? 0,
    recruitableBy: seed.recruitableBy,
    npc: seed.npc,
  };
}

/**
 * 支援会話が用意されているペアだけ、支援の枠を作る。
 *
 * **説得で後から加わった者にも張り直せるように、外に出してある。** コルウィンは
 * 第1章の敵として盤に出て、説得されて自軍になる —— ROSTER を作った時点では
 * 隊にいないので、そのままだと誰とも友好度が溜まらない。
 */
export function linkSupports(units: Unit[]) {
  for (const [a, b] of SUPPORT_PAIRS) {
    const ua = units.find((u) => u.id === a);
    const ub = units.find((u) => u.id === b);
    if (!ua || !ub) continue;
    if (!ua.supports.some((s) => s.with === b)) ua.supports.push({ with: b, points: 0, rank: 0 });
    if (!ub.supports.some((s) => s.with === a)) ub.supports.push({ with: a, points: 0, rank: 0 });
  }
}

/** 自軍を作る。章をまたいで同じ配列を使い回す */
export function createRoster(): Unit[] {
  const units = ROSTER.map((s) => build(s, 'player'));
  linkSupports(units);
  return units;
}
