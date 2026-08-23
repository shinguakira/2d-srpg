import type { Seed } from '../roster';
import type { Stats } from '../../types';

/** 能力値をまとめて書くための省略。順番は Stats のとおり */
export function st(
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

/**
 * 雑魚の型。**同じクラスの敵を並べるとき、違うのは位置と少しの能力だけ。**
 *
 * 一体ずつ書き下すと 20 行 × 敵の数になり、章の形（どこに何が立っているか）が
 * 数字の海に沈む。ここを通すと、章のファイルには盤の絵と配置だけが残る。
 */
interface MookSpec {
  name: string;
  classId: string;
  level: number;
  stats: Stats;
  growth: Stats;
  weapons: string[];
  affinity: Seed['affinity'];
  ai?: Seed['ai'];
}

export function mooks(prefix: string, spec: MookSpec, at: { x: number; y: number; ai?: Seed['ai'] }[]): Seed[] {
  return at.map((p, i) => ({
    id: `${prefix}${i + 1}`,
    name: spec.name,
    classId: spec.classId,
    level: spec.level,
    x: p.x,
    y: p.y,
    affinity: spec.affinity,
    stats: { ...spec.stats },
    growth: { ...spec.growth },
    weapons: [...spec.weapons],
    ai: p.ai ?? spec.ai ?? 'aggressive',
  }));
}

/** よく出る雑魚。章ごとにレベルだけ上げて使い回す */
export const MOOK = {
  brigand: (level: number, ai?: Seed['ai']): MookSpec => ({
    name: '山賊',
    classId: 'brigand',
    level,
    affinity: 'fire',
    stats: st(22 + level, 6 + Math.floor(level / 2), 0, 3 + Math.floor(level / 2), 4 + Math.floor(level / 3), 1, 3, 0, 13, 5),
    growth: st(70, 45, 0, 30, 30, 15, 20, 5, 0, 0),
    weapons: ['ironAxe'],
    ai,
  }),
  soldier: (level: number, ai?: Seed['ai']): MookSpec => ({
    name: '兵士',
    classId: 'soldier',
    level,
    affinity: 'ice',
    stats: st(19 + level, 5 + Math.floor(level / 2), 0, 4 + Math.floor(level / 2), 4 + Math.floor(level / 3), 2, 5, 1, 10, 5),
    growth: st(70, 40, 0, 35, 35, 20, 30, 10, 0, 0),
    weapons: ['ironLance'],
    ai,
  }),
  archer: (level: number, ai?: Seed['ai']): MookSpec => ({
    name: '狩人',
    classId: 'eArcher',
    level,
    affinity: 'wind',
    stats: st(17 + level, 5 + Math.floor(level / 2), 0, 6 + Math.floor(level / 2), 5 + Math.floor(level / 3), 2, 3, 1, 7, 5),
    growth: st(60, 40, 0, 50, 45, 20, 15, 10, 0, 0),
    weapons: ['ironBow'],
    ai: ai ?? 'guard',
  }),
  mercenary: (level: number, ai?: Seed['ai']): MookSpec => ({
    name: '傭兵',
    classId: 'mercenary',
    level,
    affinity: 'dark',
    stats: st(20 + level, 6 + Math.floor(level / 2), 0, 6 + Math.floor(level / 2), 6 + Math.floor(level / 3), 2, 4, 1, 9, 5),
    growth: st(70, 45, 0, 55, 55, 25, 25, 15, 0, 0),
    weapons: ['ironSword'],
    ai,
  }),
  knight: (level: number, ai?: Seed['ai']): MookSpec => ({
    name: 'アーマーナイト',
    classId: 'knight',
    level,
    affinity: 'anima',
    stats: st(22 + level, 7 + Math.floor(level / 2), 0, 3 + Math.floor(level / 3), 2, 1, 9 + Math.floor(level / 3), 1, 14, 4),
    growth: st(80, 50, 0, 30, 15, 15, 55, 10, 0, 0),
    weapons: ['ironLance'],
    ai: ai ?? 'guard',
  }),
  cavalier: (level: number, ai?: Seed['ai']): MookSpec => ({
    name: 'ソシアルナイト',
    classId: 'cavalier',
    level,
    affinity: 'anima',
    stats: st(20 + level, 6 + Math.floor(level / 2), 0, 5 + Math.floor(level / 2), 5 + Math.floor(level / 3), 2, 5, 1, 11, 7),
    growth: st(75, 45, 0, 40, 40, 20, 30, 15, 0, 0),
    weapons: ['ironLance'],
    ai,
  }),
  shaman: (level: number, ai?: Seed['ai']): MookSpec => ({
    name: '暗黒魔道士',
    classId: 'shaman',
    level,
    affinity: 'dark',
    stats: st(17 + level, 0, 5 + Math.floor(level / 2), 4 + Math.floor(level / 2), 3, 1, 3, 6, 6, 5),
    growth: st(60, 0, 50, 40, 30, 15, 20, 45, 0, 0),
    weapons: ['flux'],
    ai: ai ?? 'guard',
  }),
  revenant: (level: number, ai?: Seed['ai']): MookSpec => ({
    name: '屍兵',
    classId: 'revenant',
    level,
    affinity: 'dark',
    stats: st(21 + level, 6 + Math.floor(level / 2), 0, 3, 3, 0, 4, 2, 12, 4),
    growth: st(70, 40, 0, 25, 25, 0, 25, 10, 0, 0),
    weapons: ['claw'],
    ai,
  }),
  gargoyle: (level: number, ai?: Seed['ai']): MookSpec => ({
    name: 'ガーゴイル',
    classId: 'gargoyle',
    level,
    affinity: 'dark',
    stats: st(19 + level, 6 + Math.floor(level / 2), 0, 5 + Math.floor(level / 2), 7 + Math.floor(level / 3), 0, 4, 3, 9, 7),
    growth: st(65, 45, 0, 40, 50, 0, 20, 15, 0, 0),
    weapons: ['ironLance'],
    ai,
  }),
} as const;
