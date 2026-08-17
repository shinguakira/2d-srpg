import type { Affinity, Stats, Unit } from '../types';
import { SUPPORT_PAIRS } from '../story/script';
import { cloneWeapon, WEXP_THRESHOLD } from './weapons';

export const MAP: string[] = [
  'wwwwwwwwwwwwwwwwwwww',
  'w..f......ww..FGF..w',
  'w...ff....ww.......w',
  'w.....,,..bb....,,.w',
  'w~~~..,,..bb..hh...w',
  'w~~~......bb..hh...w',
  'w~~~.bbbbbbb.......w',
  'w....bb.....ff.....w',
  'w...bb...ff.ff.....w',
  'w..bb....ff........w',
  'w.bb......,,...F...w',
  'wF.b......,,.......w',
  'w..................w',
  'wwwwwwwwwwwwwwwwwwww',
];

export const MAP_W = MAP[0].length;
export const MAP_H = MAP.length;

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

interface Seed {
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
  seals?: number;
  ai?: Unit['ai'];
  isLord?: boolean;
  isBoss?: boolean;
  recruitableBy?: string;
}

const PLAYERS: Seed[] = [
  {
    id: 'p_shigeru',
    name: 'シゲル',
    classId: 'lord',
    level: 3,
    x: 3,
    y: 12,
    affinity: 'light',
    stats: st(20, 6, 2, 9, 11, 8, 5, 3, 5, 5),
    growth: st(70, 45, 25, 60, 60, 60, 30, 30, 0, 0),
    weapons: ['rapier', 'ironSword'],
    wexp: { sword: 45 },
    potion: 2,
    isLord: true,
    seals: 1,
  },
  {
    id: 'p_seth',
    name: 'ゼス',
    classId: 'cavalier',
    level: 4,
    x: 4,
    y: 12,
    affinity: 'anima',
    stats: st(24, 8, 1, 8, 8, 5, 8, 2, 10, 7),
    growth: st(80, 50, 15, 45, 45, 35, 40, 20, 0, 0),
    weapons: ['ironLance', 'ironSword', 'javelin'],
    wexp: { lance: 50, sword: 35 },
    potion: 1,
  },
  {
    id: 'p_garon',
    name: 'ガロン',
    classId: 'fighter',
    level: 3,
    x: 2,
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
    x: 5,
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
    x: 3,
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
    x: 4,
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
    x: 2,
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
    x: 5,
    y: 11,
    affinity: 'fire',
    stats: st(18, 1, 6, 7, 7, 4, 3, 6, 5, 5),
    growth: st(55, 10, 55, 50, 50, 30, 20, 50, 0, 0),
    weapons: ['lightning'],
    wexp: { light: 35 },
    potion: 1,
  },
];

const ENEMIES: Seed[] = [
  {
    id: 'e_b1',
    name: '山賊',
    classId: 'brigand',
    level: 3,
    x: 9,
    y: 8,
    affinity: 'fire',
    stats: st(24, 8, 0, 4, 5, 1, 3, 0, 13, 5),
    growth: st(70, 45, 0, 30, 30, 15, 20, 5, 0, 0),
    weapons: ['ironAxe'],
    ai: 'aggressive',
  },
  {
    id: 'e_b2',
    name: '山賊',
    classId: 'brigand',
    level: 2,
    x: 13,
    y: 7,
    affinity: 'fire',
    stats: st(22, 7, 0, 4, 5, 1, 3, 0, 13, 5),
    growth: st(70, 45, 0, 30, 30, 15, 20, 5, 0, 0),
    weapons: ['handAxe'],
    ai: 'aggressive',
  },
  {
    id: 'e_m1',
    name: 'ロウ',
    classId: 'mercenary',
    level: 4,
    x: 11,
    y: 4,
    affinity: 'dark',
    stats: st(23, 7, 0, 9, 9, 3, 5, 1, 9, 5),
    growth: st(70, 45, 0, 55, 55, 25, 25, 15, 0, 0),
    weapons: ['ironSword'],
    wexp: { sword: 90 },
    ai: 'guard',
    recruitableBy: 'p_shigeru',
  },
  {
    id: 'e_a1',
    name: '狩人',
    classId: 'eArcher',
    level: 3,
    x: 15,
    y: 10,
    affinity: 'wind',
    stats: st(19, 6, 0, 8, 7, 2, 3, 1, 7, 5),
    growth: st(60, 40, 0, 55, 45, 25, 20, 15, 0, 0),
    weapons: ['ironBow'],
    ai: 'guard',
  },
  {
    id: 'e_s1',
    name: '暗黒魔道士',
    classId: 'shaman',
    level: 3,
    x: 7,
    y: 3,
    affinity: 'dark',
    stats: st(19, 1, 7, 6, 6, 2, 3, 6, 6, 5),
    growth: st(55, 5, 55, 45, 40, 20, 15, 45, 0, 0),
    weapons: ['flux'],
    ai: 'guard',
  },
  {
    id: 'e_sd1',
    name: '兵士',
    classId: 'soldier',
    level: 4,
    x: 14,
    y: 1,
    affinity: 'ice',
    stats: st(22, 7, 0, 5, 6, 2, 6, 1, 10, 5),
    growth: st(70, 40, 0, 35, 35, 20, 30, 10, 0, 0),
    weapons: ['ironLance'],
    ai: 'guard',
  },
  {
    id: 'e_kn1',
    name: 'アーマーナイト',
    classId: 'knight',
    level: 5,
    x: 16,
    y: 1,
    affinity: 'ice',
    stats: st(26, 8, 0, 6, 3, 2, 11, 2, 14, 4),
    growth: st(80, 45, 0, 35, 20, 20, 45, 10, 0, 0),
    weapons: ['ironLance'],
    ai: 'guard',
  },

  // ---- 魔物（聖石の封印が緩んで湧いた個体）
  {
    id: 'e_rev1',
    name: '屍兵',
    classId: 'revenant',
    level: 3,
    x: 8,
    y: 6,
    affinity: 'dark',
    stats: st(24, 7, 0, 3, 4, 0, 4, 2, 12, 4),
    growth: st(70, 40, 0, 25, 25, 0, 25, 10, 0, 0),
    weapons: ['claw'],
    ai: 'aggressive',
  },
  {
    id: 'e_rev2',
    name: '屍兵',
    classId: 'revenant',
    level: 2,
    x: 12,
    y: 9,
    affinity: 'dark',
    stats: st(22, 6, 0, 3, 4, 0, 4, 2, 12, 4),
    growth: st(70, 40, 0, 25, 25, 0, 25, 10, 0, 0),
    weapons: ['claw'],
    ai: 'aggressive',
  },
  {
    id: 'e_bael1',
    name: 'バエル',
    classId: 'bael',
    level: 4,
    x: 10,
    y: 5,
    affinity: 'dark',
    stats: st(26, 8, 0, 6, 7, 0, 5, 1, 13, 5),
    growth: st(75, 45, 0, 40, 40, 0, 25, 5, 0, 0),
    weapons: ['fang'],
    ai: 'aggressive',
  },
  {
    id: 'e_mog1',
    name: 'モーグル',
    classId: 'mogall',
    level: 3,
    x: 13,
    y: 3,
    affinity: 'dark',
    stats: st(20, 0, 7, 5, 6, 0, 3, 8, 6, 5),
    growth: st(60, 0, 50, 35, 35, 0, 15, 40, 0, 0),
    weapons: ['evilEye'],
    ai: 'guard',
  },

  {
    id: 'e_boss',
    name: 'ヴァルガ',
    classId: 'general',
    level: 8,
    x: 15,
    y: 1,
    affinity: 'thunder',
    stats: st(34, 11, 0, 8, 5, 4, 11, 4, 14, 4),
    growth: st(90, 55, 0, 40, 20, 25, 45, 15, 0, 0),
    weapons: ['steelLance', 'handAxe'],
    ai: 'boss',
    isBoss: true,
  },
];

function build(seed: Seed, team: 'player' | 'enemy'): Unit {
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

export function createUnits(): Unit[] {
  const units = [...PLAYERS.map((s) => build(s, 'player')), ...ENEMIES.map((s) => build(s, 'enemy'))];

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
