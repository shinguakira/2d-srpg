import { CH11_SCRIPTS } from '../../story/chapters/ch11';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks, st } from './common';
import type { Seed } from '../roster';

/**
 * 第11章 灰の道。**灰が天候をやめて地面になる章。**
 *
 * 盤の真ん中十七列が灰で、そこに立つと毎ターン削られる。抜けるには川を渡る
 * しかなく、流れる水の上とその橋だけが灰の来ない床 —— リゼットが二章ぶんの
 * 記録で出した唯一の規則が、そのまま盤の形になっている。
 *
 * 目標は脱出。**誰でも川上の道から出られて、シゲルが出た時点で終わる。** つまり
 * 訊いているのは順番だけで、先に兵を逃がすか、自分が先に抜けて置き去りにするか。
 *
 * 増援は後ろから来る。前に灰、後ろに敵で、立ち止まる理由がどこにも無い。
 *
 * specs/story/chapters/ch11.md
 */
const COLUMN: Seed[] = [
  ...mooks('c11_r', MOOK.revenant(11), [
    { x: 12, y: 3 },
    { x: 15, y: 5 },
    { x: 11, y: 8 },
    { x: 16, y: 10 },
    { x: 12, y: 13 },
    { x: 9, y: 15 },
  ]),
  ...mooks('c11_g', MOOK.gargoyle(11), [
    { x: 8, y: 2 },
    { x: 19, y: 3 },
    { x: 7, y: 16 },
  ]),
  ...mooks('c11_s', MOOK.soldier(12), [
    { x: 5, y: 6, ai: 'guard' },
    { x: 5, y: 12, ai: 'guard' },
  ]),
  ...mooks('c11_c', MOOK.cavalier(12), [
    { x: 4, y: 8 },
    { x: 4, y: 10 },
  ]),
  ...mooks('c11_a', MOOK.archer(12), [
    { x: 3, y: 5, ai: 'guard' },
    { x: 3, y: 13, ai: 'guard' },
  ]),
];

/** 南へ退いている縦隊長。灰のほうへ登る者の意味が分からない */
const TARG: Seed = {
  id: 'c11_boss',
  name: 'タルグ',
  classId: 'general',
  level: 4,
  x: 3,
  y: 9,
  affinity: 'ice',
  stats: st(42, 16, 0, 12, 8, 6, 16, 6, 16, 5),
  growth: st(85, 55, 0, 40, 25, 20, 50, 15, 0, 0),
  weapons: ['steelLance', 'javelin'],
  wexp: { lance: 210 },
  ai: 'boss',
  isBoss: true,
};

/** 後ろから追ってくる屍兵。3〜7ターン、毎ターン三体 */
const CHASE: ChapterDef['reinforcements'] = [3, 4, 5, 6, 7].flatMap((turn, w) =>
  [
    { x: 26, y: 4 },
    { x: 26, y: 9 },
    { x: 26, y: 14 },
  ].map((at, i) => ({
    turn,
    at,
    seed: { ...MOOK.revenant(10 + w), id: `c11_w${w}_${i}`, x: at.x, y: at.y, ai: 'aggressive' } as Seed,
  })),
);

export const CH11: ChapterDef = {
  title: '第11章  「灰の道」',
  // 右が来た側の、まだ生きている土地。左が抜けた先。あいだ十七列が灰。
  // 川は x=13 を南北に流れ、橋が y=4 / y=9 / y=14 の三本 —— 灰の上で
  // 唯一まともに立てるのがその三本と、道端の古い神域石（H）だけ。
  map: [
    'wwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'wb###########~###########,,w',
    'w,###########~###########,,w',
    'w,###########~###########..w',
    'wbbbbbbbbbbbbbbbbbbbbbbbbb,w',
    'w,###H#######~#######H###,,w',
    'w,###########~###########..w',
    'w,###########~###########,,w',
    'wV###########~###########,,w',
    'wbbbbbbbbbbbbbbbbbbbbbbbbb,w',
    'w,###########~###########,,w',
    'w,###########~###########..w',
    'w,###H#######~#######H###,,w',
    'w,###########~###########,,w',
    'wbbbbbbbbbbbbbbbbbbbbbbbbb,w',
    'w,###########~###########..w',
    'w,###########~###########,,w',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwww',
  ],
  objective: { kind: 'escape', x: 1, y: 1, label: '川上の道へ脱出せよ' },
  deploy: 10,
  starts: [
    { x: 25, y: 9 },
    { x: 25, y: 8 },
    { x: 25, y: 10 },
    { x: 26, y: 9 },
    { x: 26, y: 8 },
    { x: 26, y: 10 },
    { x: 25, y: 7 },
    { x: 25, y: 11 },
    { x: 26, y: 7 },
    { x: 26, y: 11 },
    { x: 25, y: 6 },
  ],
  enemies: [...COLUMN, TARG],
  villages: [
    {
      x: 1,
      y: 8,
      potion: 2,
      text: '井戸が冷たい。桶に汲んだ水は澄んでいて、飲めた。人はいない。棚に、包んだ薬が二つ置いてあった。',
    },
  ],
  chests: [],
  shop: [],
  reinforcements: CHASE,
  events: [
    {
      turn: 2,
      script: CH11_SCRIPTS.recruit?.p_jorn,
      spawn: [
        {
          team: 'player',
          seed: {
            id: 'p_jorn',
            name: 'ヨルン',
            classId: 'shaman',
            level: 8,
            x: 22,
            y: 9,
            affinity: 'dark',
            stats: st(26, 1, 11, 9, 7, 3, 5, 9, 7, 5),
            growth: st(60, 5, 60, 45, 35, 20, 25, 55, 0, 0),
            weapons: ['flux'],
            wexp: { dark: 90 },
            potion: 1,
          },
        },
      ],
      log: 'ヨルン が仲間になった',
    },
    {
      turn: 6,
      script: {
        id: 'ch11_t6',
        lines: [
          { text: '灰が動いた。誰も歩いていないのに、模様が変わった。' },
          { speaker: 'リゼット', who: 'p_lisette', side: 'right', text: '……測っています。こちらを。' },
          { speaker: 'ヨルン', who: 'p_jorn', side: 'right', text: '慣れろ。毎晩やられてた。' },
        ],
      },
    },
  ],
  scripts: CH11_SCRIPTS,
};
