import { CH13_SCRIPTS } from '../../story/chapters/ch13';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks, st } from './common';
import type { Seed } from '../roster';

/**
 * 第13章 ウジアの盆地。**高さの章。**
 *
 * 谷底を渡るあいだ、尾根（峰＝歩兵も騎兵も入れない）に竜と狙撃兵が並ぶ。
 * 届くのは弓と魔法と飛行だけで、十二章ぶん荷物扱いしてきた弓兵にここで
 * 請求書が来る。
 *
 * セルマが入る。**すでに灰を受けている加入者**で、腕の灰は隠さない。
 *
 * specs/story/chapters/ch13.md
 */
const RIDGE: Seed[] = [
  ...mooks('c13_w', MOOK.gargoyle(13), [
    { x: 9, y: 2 },
    { x: 14, y: 2 },
    { x: 19, y: 2 },
    { x: 11, y: 17 },
    { x: 17, y: 17 },
  ]),
  // 峰には歩兵が上がれない。狩人は山肌（h）のほう —— 守備 +1、回避 +30 の巣
  ...mooks('c13_a', MOOK.archer(13), [
    { x: 5, y: 3, ai: 'guard' },
    { x: 10, y: 3, ai: 'guard' },
    { x: 15, y: 3, ai: 'guard' },
    { x: 10, y: 16, ai: 'guard' },
    { x: 20, y: 16, ai: 'guard' },
  ]),
  ...mooks('c13_s', MOOK.soldier(13), [
    { x: 22, y: 8 },
    { x: 22, y: 11 },
    { x: 20, y: 9 },
    { x: 20, y: 10 },
  ]),
  ...mooks('c13_c', MOOK.cavalier(13), [
    { x: 16, y: 8 },
    { x: 16, y: 11 },
    { x: 13, y: 9 },
  ]),
  ...mooks('c13_k', MOOK.knight(14), [
    { x: 24, y: 9, ai: 'guard' },
    { x: 24, y: 10, ai: 'guard' },
  ]),
  ...mooks('c13_m', MOOK.mercenary(13), [{ x: 18, y: 13 }]),
];

/** マイシの尾根を私物にした狙撃隊長。退けとの命令が来ないまま二か月 */
const VERDA: Seed = {
  id: 'c13_boss',
  name: 'ヴェルダ',
  classId: 'sniper',
  level: 5,
  x: 25,
  y: 10,
  affinity: 'wind',
  stats: st(38, 16, 0, 19, 15, 8, 11, 7, 9, 6),
  growth: st(75, 50, 0, 60, 55, 25, 30, 20, 0, 0),
  weapons: ['steelBow'],
  wexp: { bow: 220 },
  ai: 'boss',
  isBoss: true,
};

export const CH13: ChapterDef = {
  title: '第13章  「ウジアの盆地」',
  // 上下が尾根（^ 峰と h 山）、真ん中が谷底。東の橋頭（玉座）へ渡る。
  // 谷を横切る川が二本あり、橋は真ん中の一本だけ —— 渡る場所は選べない。
  map: [
    'wwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'w^^^^^^^^^^^^^^^^^^^^^^^^^^w',
    'wh^^^^^^^^^^^^^^^^^^^^^^^^hw',
    'whh^^h^^^^h^^^^h^^^^h^^^^hhw',
    'w,,hh,,hh,,,,hh,,,,hh,,hh,,w',
    'w,,,,,,,,,,,,,,,,,,,,,,,,,,w',
    'w,,f,,,,~~,,,,,,,,~~,,,,f,,w',
    'w,,,,,,,~~,,,,,,,,~~,,,,,,,w',
    'w,,,,,,,~~,,,,,,,,~~,,,,,,fw',
    'wbbbbbbbbbbbbbbbbbbbbbbbbTbw',
    'wbbbbbbbbbbbbbbbbbbbbbbbbbbw',
    'w,,,,,,,~~,,,,,,,,~~,,,,,,fw',
    'w,,,,,,,~~,,,,,,,,~~,,,,,,,w',
    'w,,f,,,,~~,,,,,,,,~~,,,,f,,w',
    'w,,,,,,,,,,,,,,,,,,,,,,,,,,w',
    'w,,hh,,hh,,,,hh,,,,hh,,hh,,w',
    'whh^^h^^^^h^^^^h^^^^h^^^^hhw',
    'wh^^^^^^^^^^^^^^^^^^^^^^^^hw',
    'w^^^^^^^^^^^^^^^^^^^^^^^^^^w',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwww',
  ],
  objective: { kind: 'seize', x: 25, y: 9, label: '対岸の橋頭を制圧せよ' },
  deploy: 10,
  starts: [
    { x: 2, y: 9 },
    { x: 2, y: 10 },
    { x: 1, y: 9 },
    { x: 1, y: 10 },
    { x: 3, y: 9 },
    { x: 3, y: 10 },
    { x: 2, y: 8 },
    { x: 2, y: 11 },
    { x: 1, y: 8 },
    { x: 1, y: 11 },
    { x: 4, y: 9 },
  ],
  enemies: [...RIDGE, VERDA],
  villages: [],
  chests: [],
  shop: [
    { weapon: 'steelBow', price: 1000 },
    { weapon: 'ironBow', price: 560 },
    { weapon: 'mend', price: 800 },
  ],
  reinforcements: [2, 5, 8].flatMap((turn, w) =>
    [
      { x: 26, y: 4 },
      { x: 26, y: 15 },
      { x: 14, y: 4 },
      { x: 14, y: 15 },
    ].map((at, i) => ({
      turn,
      at,
      seed: {
        ...(i % 2 ? MOOK.gargoyle(12 + w) : MOOK.archer(12 + w)),
        id: `c13_w${w}_${i}`,
        x: at.x,
        y: at.y,
        ai: 'aggressive',
      } as Seed,
    })),
  ),
  events: [
    {
      turn: 3,
      script: CH13_SCRIPTS.recruit?.p_selma,
      spawn: [
        {
          team: 'player',
          seed: {
            id: 'p_selma',
            name: 'セルマ',
            classId: 'wyvernKnight',
            level: 9,
            x: 5,
            y: 10,
            affinity: 'wind',
            stats: st(31, 12, 0, 11, 10, 4, 11, 3, 12, 8),
            growth: st(75, 55, 0, 45, 45, 20, 40, 15, 0, 0),
            weapons: ['steelLance', 'javelin'],
            wexp: { lance: 160 },
            potion: 1,
          },
        },
      ],
      log: 'セルマ が仲間になった',
    },
    {
      turn: 7,
      script: {
        id: 'ch13_t7',
        lines: [
          { text: '尾根の上で、竜が一頭、乗り手を落として飛び去った。' },
          { speaker: 'セルマ', who: 'p_selma', side: 'right', text: '……あれもだ。' },
          { speaker: 'エリン', who: 'p_elin', side: 'right', text: '乗り手が？' },
          { speaker: 'セルマ', who: 'p_selma', side: 'right', text: '竜のほうだ。竜は先に分かる。' },
        ],
      },
    },
  ],
  scripts: CH13_SCRIPTS,
};
