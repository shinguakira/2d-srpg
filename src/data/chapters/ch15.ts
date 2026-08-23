import { CH15_SCRIPTS } from '../../story/chapters/ch15';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks, st } from './common';
import type { Seed } from '../roster';

/**
 * 第15章 スザ炎上。**アーク3の山場で、盤に軍が三つある。**
 *
 * こちらと、崩れているクロガネと、灰。クロガネの兵は `aggressive` のまま北へ
 * 出てくるが、彼らを押しているのは player ではない —— 南から灰が寄せてくる
 * ターン事件がそれを見せる。
 *
 * 逃げ切れるのは境内（H）が灰を通さないから。第14章で守った柱の内側と同じ
 * 規則で、これが第21章と第25章の足場になる。
 *
 * specs/story/chapters/ch15.md
 */
const ROUT: Seed[] = [
  ...mooks('c15_s', MOOK.soldier(15), [
    { x: 6, y: 12 },
    { x: 10, y: 13 },
    { x: 15, y: 13 },
    { x: 19, y: 12 },
    { x: 22, y: 11 },
    { x: 8, y: 15 },
  ]),
  ...mooks('c15_m', MOOK.mercenary(15), [
    { x: 12, y: 11 },
    { x: 17, y: 11 },
    { x: 20, y: 14 },
  ]),
  ...mooks('c15_c', MOOK.cavalier(15), [
    { x: 4, y: 14 },
    { x: 24, y: 13 },
    { x: 13, y: 15 },
  ]),
  ...mooks('c15_a', MOOK.archer(15), [
    { x: 3, y: 11, ai: 'guard' },
    { x: 25, y: 10, ai: 'guard' },
  ]),
  // 灰の側。クロガネを南から食っている連中で、こちらにも同じことをする
  ...mooks('c15_r', MOOK.revenant(15), [
    { x: 7, y: 17 },
    { x: 11, y: 18 },
    { x: 16, y: 18 },
    { x: 21, y: 17 },
    { x: 5, y: 18 },
    { x: 25, y: 18 },
  ]),
  ...mooks('c15_g', MOOK.gargoyle(15), [
    { x: 14, y: 17 },
    { x: 19, y: 18 },
  ]),
];

/** 旗を捨てた将。八百のうち三百を連れて北へ抜けようとしている */
const HAUG: Seed = {
  id: 'c15_boss',
  name: 'ハウグ',
  classId: 'general',
  level: 8,
  x: 14,
  y: 14,
  affinity: 'fire',
  stats: st(46, 19, 0, 14, 10, 6, 18, 7, 17, 5),
  growth: st(85, 55, 0, 40, 30, 20, 50, 15, 0, 0),
  weapons: ['steelAxe', 'handAxe'],
  wexp: { axe: 240 },
  ai: 'boss',
  isBoss: true,
};

/** 南から寄せる灰。二ターンおきに一列ずつ町を食う */
const CREEP: ChapterDef['events'] = [3, 5, 7, 9].map((turn, w) => ({
  turn,
  terrain: Array.from({ length: 26 }, (_, i) => ({ x: i + 1, y: 18 - w, ch: '#' })),
  log: '灰が一区画ぶん上がってきた',
}));

export const CH15: ChapterDef = {
  title: '第15章  「スザ炎上」',
  // スザの町。北の高台に社の境内（H）、そこから南へ町並みと浜。
  // 南の縁から灰が上がってきて、境内の柱のところで止まる。
  map: [
    'wwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'w^^^^^^^^^^HHHHHH^^^^^^^^^^w',
    'w^^^^^^^^^HHHHHHHH^^^^^^^^^w',
    'w^^^^^^^^^HHHHHHHH^^^^^^^^^w',
    'w^^^^h^^^^HHHbbHHH^^^^h^^^^w',
    'w^^^hh,,,,,,,bb,,,,,,,hh^^^w',
    'w^^h,,,,,,,,,bb,,,,,,,,,h^^w',
    'w^,,,,VV,,,,,bb,,,,,VV,,,,,w',
    'w,,,,,,,,,,,,bb,,,,,,,,,,,,w',
    'w,,f,,,,,,,,,bb,,,,,,,,,f,,w',
    'w,,,,,,,,,,,,bb,,,,,,,,,,,,w',
    'w,,,,,VV,,,,,bb,,,,,VV,,,,,w',
    'w,,,,,,,,,,,,bb,,,,,,,,,,,,w',
    'w,,,,,,,,,,,,bb,,,,,,,,,,,,w',
    'w,,,,,,,,,,,,bb,,,,,,,,,,,,w',
    'wsss,,,,,,,,,bb,,,,,,,,,sssw',
    'wssssss,,,,,,bb,,,,,,ssssssw',
    'wssssssssssssssssssssssssssw',
    'wssssssssssssssssssssssssssw',
    'wssssssssssssssssssssssssssw',
  ],
  objective: { kind: 'rout', label: '敵の全滅' },
  deploy: 11,
  starts: [
    { x: 13, y: 5 },
    { x: 14, y: 5 },
    { x: 12, y: 6 },
    { x: 13, y: 6 },
    { x: 14, y: 6 },
    { x: 15, y: 6 },
    { x: 11, y: 7 },
    { x: 13, y: 7 },
    { x: 14, y: 7 },
    { x: 16, y: 7 },
    { x: 12, y: 8 },
    { x: 15, y: 8 },
  ],
  enemies: [...ROUT, HAUG],
  villages: [],
  chests: [],
  shop: [],
  reinforcements: [3, 6].flatMap((turn, w) =>
    [
      { x: 1, y: 19 },
      { x: 9, y: 19 },
      { x: 18, y: 19 },
      { x: 26, y: 19 },
    ].map((at, i) => ({
      turn,
      at,
      seed: {
        ...(i % 2 ? MOOK.revenant(15 + w) : MOOK.gargoyle(15 + w)),
        id: `c15_w${w}_${i}`,
        x: at.x,
        y: at.y,
        ai: 'aggressive',
      } as Seed,
    })),
  ),
  events: [
    ...CREEP,
    {
      turn: 4,
      script: {
        id: 'ch15_t4',
        lines: [
          { text: 'クロガネの一隊が、こちらに背を向けて走ってきた。武器を捨てている。' },
          { speaker: 'ジェイガン', who: 'p_akira', side: 'right', text: '殿下。射ますか。' },
          { speaker: 'シゲル', who: 'p_shigeru', side: 'left', text: '通せ。' },
          { speaker: 'ジェイガン', who: 'p_akira', side: 'right', text: '……承知。' },
        ],
      },
    },
  ],
  scripts: CH15_SCRIPTS,
};
