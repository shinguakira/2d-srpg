import type { ChapterDef } from '../chapters';
import type { Seed } from '../roster';
import type { Stats } from '../../types';

/**
 * 本編の外にある戦い。FE8 のヴァルニの塔と、ワールドマップを彷徨く魔物の群れに
 * 当たる。章の進行には数えないので、勝っても cleared は進まない。
 *
 * どちらも目標は全滅で、話も無い。経験値と所持金のためだけにある。
 */
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

function monster(id: string, name: string, classId: string, level: number, x: number, y: number, weapon: string): Seed {
  const s = level;
  return {
    id,
    name,
    classId,
    level,
    x,
    y,
    affinity: 'dark',
    stats: st(18 + s * 2, 5 + s, 0, 3 + s, 3 + s, 0, 3 + Math.floor(s / 2), Math.floor(s / 3), 10, 4),
    growth: st(0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    weapons: [weapon],
    ai: 'aggressive',
  };
}

/** 塔。狭い縦長の階で、四方から寄ってくる */
export const TOWER: ChapterDef = {
  title: '影の塔',
  map: [
    'wwwwwwwwwwwwwwwwwwww',
    'wwwww..F...F..wwwwww',
    'wwwww.........wwwwww',
    'wwww...b...b...wwwww',
    'wwww...........wwwww',
    'www.....,,,.....wwww',
    'www..b..,,,..b..wwww',
    'www.....,,,.....wwww',
    'wwww...........wwwww',
    'wwww...b...b...wwwww',
    'wwwww.........wwwwww',
    'wwwww.........wwwwww',
    'wwwww.........wwwwww',
    'wwwwwwwwwwwwwwwwwwww',
  ],
  objective: { kind: 'rout', label: '敵の全滅' },
  deploy: 6,
  starts: [
    { x: 8, y: 12 },
    { x: 9, y: 12 },
    { x: 10, y: 12 },
    { x: 11, y: 12 },
    { x: 8, y: 11 },
    { x: 9, y: 11 },
    { x: 10, y: 11 },
    { x: 11, y: 11 },
  ],
  enemies: [
    monster('tw1', '屍兵', 'revenant', 6, 6, 2, 'claw'),
    monster('tw2', '屍兵', 'revenant', 6, 13, 2, 'claw'),
    monster('tw3', 'バエル', 'bael', 7, 5, 6, 'fang'),
    monster('tw4', 'バエル', 'bael', 7, 14, 6, 'fang'),
    monster('tw5', 'モーグル', 'mogall', 8, 9, 1, 'evilEye'),
    monster('tw6', 'モーグル', 'mogall', 8, 10, 1, 'evilEye'),
    monster('tw7', 'ガーゴイル', 'gargoyle', 8, 7, 4, 'ironLance'),
    monster('tw8', 'ガーゴイル', 'gargoyle', 8, 12, 4, 'ironLance'),
  ],
  villages: [],
  chests: [],
  shop: [],
  reinforcements: [
    { turn: 3, at: { x: 9, y: 1 }, seed: monster('tw9', '屍兵', 'revenant', 7, 9, 1, 'claw') },
    { turn: 3, at: { x: 10, y: 1 }, seed: monster('tw10', '屍兵', 'revenant', 7, 10, 1, 'claw') },
    { turn: 6, at: { x: 9, y: 1 }, seed: monster('tw11', 'バエル', 'bael', 9, 9, 1, 'fang') },
  ],
};

/** ワールドマップを彷徨く群れ。小さく、短く終わる */
export const SKIRMISH: ChapterDef = {
  title: '魔物の群れ',
  map: [
    'wwwwwwwwwwwwwwwwwwww',
    'w,,..f.....f....,,,w',
    'w..,,....b....,,...w',
    'w.f..,,,...,,,..f..w',
    'w....b..,,,..b.....w',
    'w,,....,,,,,....,,,w',
    'w..f...,,.,,...f...w',
    'w....b.......b.....w',
    'w,,..f.......f..,,,w',
    'w....,,,...,,,.....w',
    'w..b...........b...w',
    'w,,....f...f....,,,w',
    'w..................w',
    'wwwwwwwwwwwwwwwwwwww',
  ],
  objective: { kind: 'rout', label: '敵の全滅' },
  deploy: 5,
  starts: [
    { x: 8, y: 11 },
    { x: 9, y: 11 },
    { x: 10, y: 11 },
    { x: 11, y: 11 },
    { x: 8, y: 10 },
    { x: 9, y: 10 },
    { x: 10, y: 10 },
    { x: 11, y: 10 },
  ],
  enemies: [
    monster('sk1', '屍兵', 'revenant', 4, 5, 3, 'claw'),
    monster('sk2', '屍兵', 'revenant', 4, 14, 3, 'claw'),
    monster('sk3', 'バエル', 'bael', 5, 9, 2, 'fang'),
    monster('sk4', 'モーグル', 'mogall', 5, 10, 2, 'evilEye'),
    monster('sk5', 'ガーゴイル', 'gargoyle', 5, 3, 6, 'ironLance'),
  ],
  villages: [],
  chests: [],
  shop: [],
};
