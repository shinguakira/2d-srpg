import { CH10_SCRIPTS } from '../../story/chapters/ch10';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks, st } from './common';
import type { Seed } from '../roster';

/**
 * 第10章 コドの砂。**守る相手が盤の上にいる、最初の章。**
 *
 * イルゼ長老は自軍として村に立っているが、動けず、武器も持たない（mov 0、
 * 武器なし）。倒れたらその場で負け —— 目標は「エズリン撃破」で、守りは
 * 勝ち筋ではなく敗北条件のほう。FE の「〜を守れ」はいつもその形。
 *
 * 6ターン目に**巨兵**が砂から立ち上がり、まっすぐ長老へ向かう。屍兵と違って
 * 元は一人ではない、というのがリゼットの台詞で、盤の上でもそれが分かるように
 * 硬く・遅く・狙いを変えない。
 *
 * specs/story/chapters/ch10.md
 */
const HILL: Seed[] = [
  ...mooks('c10_k', MOOK.knight(12), [
    { x: 10, y: 3, ai: 'guard' },
    { x: 15, y: 3, ai: 'guard' },
    { x: 12, y: 2, ai: 'guard' },
  ]),
  ...mooks('c10_m', MOOK.shaman(11), [
    { x: 9, y: 5, ai: 'guard' },
    { x: 16, y: 5, ai: 'guard' },
  ]),
  ...mooks('c10_a', MOOK.archer(11), [
    { x: 7, y: 4 },
    { x: 18, y: 4 },
    { x: 12, y: 6 },
  ]),
  ...mooks('c10_c', MOOK.cavalier(11), [
    { x: 5, y: 9 },
    { x: 20, y: 9 },
    { x: 8, y: 11 },
    { x: 17, y: 11 },
  ]),
  ...mooks('c10_s', MOOK.soldier(11), [
    { x: 11, y: 9 },
    { x: 14, y: 9 },
  ]),
  ...mooks('c10_g', MOOK.gargoyle(11), [
    { x: 3, y: 6 },
    { x: 22, y: 6 },
  ]),
  ...mooks('c10_r', MOOK.revenant(11), [{ x: 3, y: 12 }]),
];

const EZRIN: Seed = {
  id: 'c10_boss',
  name: 'エズリン',
  classId: 'sage',
  level: 13,
  x: 12,
  y: 1,
  affinity: 'dark',
  stats: st(36, 3, 17, 14, 12, 7, 9, 14, 9, 6),
  growth: st(75, 15, 60, 50, 45, 30, 25, 55, 0, 0),
  weapons: ['thunder', 'mend'],
  wexp: { anima: 200, staff: 130 },
  ai: 'boss',
  isBoss: true,
};

/** 記録を預かる長老。動けず、戦えず、倒れたら負け */
const ILSE: Seed = {
  id: 'c10_ilse',
  name: 'イルゼ',
  classId: 'cleric',
  level: 1,
  x: 12,
  y: 13,
  affinity: 'light',
  stats: st(18, 0, 1, 1, 1, 10, 0, 3, 4, 0),
  growth: st(0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
  weapons: [],
};

const COLOSSUS: Seed = {
  id: 'c10_colossus',
  name: '巨兵',
  classId: 'colossus',
  level: 8,
  x: 12,
  y: 11,
  affinity: 'dark',
  stats: st(46, 16, 0, 6, 3, 0, 13, 6, 20, 4),
  growth: st(0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
  weapons: ['fang'],
  ai: 'aggressive',
};

export const CH10: ChapterDef = {
  title: '第10章  「コドの砂」',
  // 上が要塞化された丘、下が村と砂浜。あいだを川が横切り、橋は中央の一本。
  // 丘へ上がる道は三本 —— 中央の橋から、西の浅瀬から、東の岩場から。
  map: [
    'wwwwwwwwwwwwwwwwwwwwwwww',
    'wwhh,,f..,,fTf,,..f,,hhw',
    'whh,,..,,..,C,..,,..,,hw',
    'wh,,..,,f..,,,..f,,..,hw',
    'wh..,,..,,..,,..,,..,,hw',
    'wh,,..,,..,,,,..,,..,,hw',
    'w,,..,,f..,,b,,..f,,..,w',
    'w..,,..,,..,b,..,,..,,.w',
    'w~~~~~~~~~~,b,~~~~~~~~~w',
    'w~~~ss~~~~~,b,~~~~~ss~~w',
    'wsss,,ss,,,,b,,,,ss,,ssw',
    'ws,,..,,..,,b,,..,,..,sw',
    'wss,,f..,V,,b,,V..f,,ssw',
    'ws,,..,,..,,V,,..,,..,sw',
    'wsss,,ss,,,,b,,,,ss,,ssw',
    'wss~~ss,,,,,b,,,,,ss~~sw',
    'wwwwwwwwwwwwwwwwwwwwwwww',
  ],
  objective: { kind: 'boss', guard: ['c10_ilse'], label: 'エズリンの撃破（イルゼを守れ）' },
  deploy: 9,
  starts: [
    { x: 12, y: 15 },
    { x: 11, y: 15 },
    { x: 13, y: 15 },
    { x: 10, y: 15 },
    { x: 14, y: 15 },
    { x: 11, y: 14 },
    { x: 13, y: 14 },
    { x: 9, y: 14 },
    { x: 15, y: 14 },
    { x: 12, y: 14 },
  ],
  enemies: [...HILL, EZRIN],
  allies: [ILSE],
  villages: [
    { x: 9, y: 12, weapon: 'shine', text: '社の光の書です。長老がずっと預かっておられた。……あの人を守ってください。' },
    { x: 15, y: 12, potion: 3, text: '十一か月前、ここで王様をお見送りしました。今度は帰ってきてください。' },
  ],
  chests: [{ x: 12, y: 2, weapon: 'silenceStaff' }],
  shop: [],
  reinforcements: [4, 4, 4, 4, 7, 7, 7, 7, 10, 10, 10, 10].map((turn, i) => {
    const from = [
      { x: 1, y: 6 },
      { x: 22, y: 6 },
      { x: 12, y: 1 },
      { x: 1, y: 10 },
    ][i % 4];
    const spec = i % 4 === 2 ? MOOK.knight(12) : i % 4 === 3 ? MOOK.gargoyle(12) : MOOK.cavalier(12);
    return { turn, at: from, seed: { ...spec, id: `c10_w${i}`, x: from.x, y: from.y, ai: 'aggressive' } as Seed };
  }),
  events: [
    {
      turn: 6,
      spawn: [{ team: 'enemy', seed: COLOSSUS }],
      script: {
        id: 'ch10_colossus',
        lines: [
          { text: '草が、輪を広げるように灰色になった。そこから、何かが立ち上がった。' },
          { text: '大きい。鎧を着ている。……組み立て方が、間違っている。' },
          {
            speaker: 'リゼット',
            who: 'p_lisette',
            side: 'right',
            text: 'あれは屍兵ではありません。屍兵は、かつて一人でした。',
          },
          {
            speaker: 'リゼット',
            who: 'p_lisette',
            side: 'right',
            text: '**あれは作られています。何人かから、組み上げて。**',
          },
          { text: '巨兵はまっすぐ村へ向かった。迷いも、寄り道も無い。' },
          {
            speaker: 'ジェイガン',
            who: 'p_akira',
            side: 'right',
            text: '……彷徨っているのではありません。**寄越されたのです。**',
          },
        ],
      },
      log: '巨兵 が砂の中から立ち上がった',
    },
  ],
  scripts: CH10_SCRIPTS,
};
