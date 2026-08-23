import { CH19_SCRIPTS } from '../../story/chapters/ch19';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks, st } from './common';
import type { Seed } from '../roster';

/**
 * 第19章 シラトの火。**守る章で、盤が二段に割れている。**
 *
 * 下半分は原始林 —— 重い、隠れられる、何も見えない。森林限界（y=6）から上は
 * 裸の白い岩で、遮蔽がゼロ。**下では移動コストが敵で、上では露出が敵になる。**
 * 同じ盤で問題が入れ替わるのが、この山の登り方。
 *
 * 守人は頂の火のそばに立つ。倒れたら負け。両軍から狙われるので、下の林で
 * 止めるか上で受けるかを player が選ぶ。
 *
 * 増援は 3〜9 ターン、毎ターン三体。**守る章なので圧を切らさない。**
 *
 * specs/story/chapters/ch19.md
 */
const CLIMBERS: Seed[] = [
  ...mooks('c19_s', MOOK.soldier(19), [
    { x: 7, y: 14 },
    { x: 12, y: 15 },
    { x: 18, y: 15 },
    { x: 23, y: 14 },
    { x: 10, y: 12 },
    { x: 20, y: 12 },
  ]),
  ...mooks('c19_m', MOOK.mercenary(19), [
    { x: 9, y: 10 },
    { x: 21, y: 10 },
    { x: 15, y: 13 },
  ]),
  ...mooks('c19_a', MOOK.archer(19), [
    { x: 5, y: 16, ai: 'guard' },
    { x: 25, y: 16, ai: 'guard' },
    { x: 15, y: 17, ai: 'guard' },
  ]),
  ...mooks('c19_k', MOOK.knight(19), [
    { x: 13, y: 8, ai: 'guard' },
    { x: 17, y: 8, ai: 'guard' },
  ]),
  ...mooks('c19_g', MOOK.gargoyle(19), [
    { x: 4, y: 3 },
    { x: 26, y: 3 },
    { x: 15, y: 2 },
  ]),
  ...mooks('c19_c', MOOK.cavalier(19), [
    { x: 3, y: 18 },
    { x: 27, y: 18 },
  ]),
  ...mooks('c19_h', MOOK.shaman(19), [
    { x: 11, y: 18, ai: 'guard' },
    { x: 19, y: 18, ai: 'guard' },
  ]),
];

/** 火を消しに来た。理由は聞いていない。五人目 */
const VOLKER: Seed = {
  id: 'c19_boss',
  name: 'ヴォルカー',
  classId: 'general',
  level: 15,
  x: 15,
  y: 10,
  affinity: 'ice',
  stats: st(55, 22, 0, 17, 12, 8, 21, 9, 18, 5),
  growth: st(90, 55, 0, 45, 30, 20, 50, 20, 0, 0),
  weapons: ['steelLance', 'javelin'],
  wexp: { lance: 280 },
  ai: 'boss',
  isBoss: true,
};

/** 占領のあいだ、気づかないふりで火を絶やさなかった老人 */
const KEEPER: Seed = {
  id: 'c19_keeper',
  name: '守人',
  classId: 'cleric',
  level: 8,
  x: 15,
  y: 3,
  affinity: 'light',
  stats: st(22, 1, 8, 8, 6, 12, 4, 12, 4, 0),
  growth: st(50, 5, 50, 40, 30, 60, 15, 60, 0, 0),
  weapons: ['heal'],
  wexp: { staff: 90 },
};

export const CH19: ChapterDef = {
  title: '第19章  「シラトの火」',
  // 上（北）が森林限界の上 —— 白い岩と、頂の社。遮蔽がゼロ。
  // 下（南）が原始林 —— 重くて、見通しが利かない。境目は y=6 の一列。
  map: [
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'w^^^^^^^^^^^^HHHH^^^^^^^^^^^^w',
    'w^^^^^^^^^^^HHHHHH^^^^^^^^^^^w',
    'w^^^^^^^^^^^HHHTHH^^^^^^^^^^^w',
    'w^^^^^^^^^^^HHHHHH^^^^^^^^^^^w',
    'w^^^^^^^^^^^^HHHH^^^^^^^^^^^^w',
    'w^^h,,,,,,,,,,bb,,,,,,,,,,h^^w',
    'w^h,,,,,,,,,,,bb,,,,,,,,,,,h^w',
    'wh,,,,,,,,,,,,bb,,,,,,,,,,,,hw',
    'w,,,,,,,,,,,,,bb,,,,,,,,,,,,,w',
    'w,,,,,,,,,,,,,bb,,,,,,,,,,,,,w',
    'wf,,fff,,,,,fffff,,,,,fff,,,fw',
    'wff,ffff,,,ffffffff,,,ffff,ffw',
    'wffffffff,fffffffff,,ffffffffw',
    'wfffffffff,ffffffff,fffffffffw',
    'wffffffffff,fffffff,fffffffffw',
    'wfffffffffff,ffffff,fffffffffw',
    'wffffffffffff,fffff,fffffffffw',
    'wfffffffffffff,ffff,fffffffffw',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
  ],
  objective: { kind: 'survive', turns: 10, guard: ['c19_keeper'], label: '守人を守り抜け（10ターン）' },
  deploy: 12,
  // 出撃は森林限界のすぐ上。裸の岩の上から始まって、守人は背中にいる
  starts: [
    { x: 14, y: 6 },
    { x: 15, y: 6 },
    { x: 13, y: 6 },
    { x: 16, y: 6 },
    { x: 12, y: 6 },
    { x: 17, y: 6 },
    { x: 14, y: 7 },
    { x: 15, y: 7 },
    { x: 13, y: 7 },
    { x: 16, y: 7 },
    { x: 12, y: 7 },
    { x: 17, y: 7 },
    { x: 11, y: 7 },
  ],
  enemies: [...CLIMBERS, VOLKER],
  allies: [KEEPER],
  villages: [],
  chests: [],
  shop: [],
  reinforcements: [3, 4, 5, 6, 7, 8, 9].flatMap((turn, w) =>
    [
      { x: 1, y: 18 },
      { x: 15, y: 18 },
      { x: 28, y: 18 },
    ].map((at, i) => ({
      turn,
      at,
      seed: {
        ...(i === 1 ? MOOK.mercenary(18 + Math.floor(w / 2)) : MOOK.soldier(18 + Math.floor(w / 2))),
        id: `c19_w${w}_${i}`,
        x: at.x,
        y: at.y,
        ai: 'aggressive',
      } as Seed,
    })),
  ),
  events: [
    {
      turn: 2,
      script: {
        id: 'ch19_t2',
        lines: [
          { text: '林を抜けた。木が一本も無くなり、風が変わった。' },
          { speaker: 'ジェイガン', who: 'p_akira', side: 'right', text: '殿下。ここから上は遮蔽がありません。両軍とも同じ条件です。' },
          { speaker: 'エイリン', who: 'p_aeryn', side: 'right', text: '……クロガネの登り方は知っている。左の肩から来る。毎回だ。' },
        ],
      },
    },
    {
      turn: 6,
      script: {
        id: 'ch19_t6',
        lines: [
          { text: '岩の割れ目に、見たことのない葉の草が生えていた。すぐ隣に、島でよく見る草も。' },
          { speaker: '守人', who: 'c19_keeper', side: 'right', text: 'ああ、それ。西の海の向こうの草です。' },
          { speaker: 'リゼット', who: 'p_lisette', side: 'right', text: '……いつから。' },
          { speaker: '守人', who: 'c19_keeper', side: 'right', text: '数えた人がいません。私が来たときにはもう並んで生えていました。' },
          { speaker: '守人', who: 'c19_keeper', side: 'right', text: '——それより、右の方が押されています。' },
        ],
      },
    },
  ],
  scripts: CH19_SCRIPTS,
};
