import type { Affinity, Stats, Unit } from '../types';
import { SUPPORT_PAIRS } from '../story/script';
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
}

/** 自軍の顔ぶれ。章をまたいで持ち越すので、章のデータからは切り離してある */
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
    id: 'p_garon',
    name: 'ガロン',
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
    id: 'p_rina',
    name: 'リナ',
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
  },
  {
    id: 'p_teo',
    name: 'テオ',
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
    id: 'p_mina',
    name: 'ミナ',
    classId: 'cleric',
    level: 2,
    x: 10,
    y: 11,
    affinity: 'light',
    stats: st(16, 1, 6, 6, 8, 9, 2, 7, 4, 5),
    growth: st(50, 10, 55, 40, 50, 60, 10, 50, 0, 0),
    weapons: ['heal'],
    wexp: { staff: 40 },
    potion: 2,
  },
  {
    id: 'p_shiel',
    name: 'シエル',
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
  },
];

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
  };
}

/** 自軍を作る。章をまたいで同じ配列を使い回す */
export function createRoster(): Unit[] {
  const units = ROSTER.map((s) => build(s, 'player'));
  // 支援会話が用意されているペアだけ、支援の枠を作っておく
  for (const [a, b] of SUPPORT_PAIRS) {
    const ua = units.find((u) => u.id === a);
    const ub = units.find((u) => u.id === b);
    if (!ua || !ub) continue;
    ua.supports.push({ with: b, points: 0, rank: 0 });
    ub.supports.push({ with: a, points: 0, rank: 0 });
  }
  return units;
}
