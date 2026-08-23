import { CH25_SCRIPTS } from '../../story/chapters/ch25';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks, st } from './common';
import type { Seed } from '../roster';

/**
 * 終章 海の門。**盤そのものが話になっている。**
 *
 * 崖の上の社。境内（H）は神域で灰が入れない。崖のふちは海で、退路が無い。
 * その社の床にタケシが座っていて、両方それを知っている。
 *
 * 出撃は 12 に戻る —— **最後の章は、player が選んだ隊であってほしい。**
 * 二十三章の十六人ではなく。
 *
 * specs/story/chapters/ch25.md
 */
const GUARD: Seed[] = [
  ...mooks('c25_k', MOOK.knight(25), [
    { x: 15, y: 8, ai: 'guard' },
    { x: 18, y: 8, ai: 'guard' },
    { x: 15, y: 12, ai: 'guard' },
    { x: 18, y: 12, ai: 'guard' },
    { x: 16, y: 6, ai: 'guard' },
    { x: 17, y: 6, ai: 'guard' },
  ]),
  ...mooks('c25_s', MOOK.soldier(24), [
    { x: 12, y: 7 },
    { x: 21, y: 7 },
    { x: 12, y: 13 },
    { x: 21, y: 13 },
    { x: 10, y: 10 },
    { x: 23, y: 10 },
  ]),
  ...mooks('c25_m', MOOK.mercenary(24), [
    { x: 9, y: 6 },
    { x: 24, y: 6 },
    { x: 9, y: 14 },
    { x: 24, y: 14 },
  ]),
  ...mooks('c25_a', MOOK.archer(24), [
    { x: 14, y: 4, ai: 'guard' },
    { x: 19, y: 4, ai: 'guard' },
    { x: 14, y: 16, ai: 'guard' },
    { x: 19, y: 16, ai: 'guard' },
  ]),
  ...mooks('c25_h', MOOK.shaman(24), [
    { x: 11, y: 4, ai: 'guard' },
    { x: 22, y: 4, ai: 'guard' },
  ]),
  ...mooks('c25_g', MOOK.gargoyle(24), [
    { x: 6, y: 3 },
    { x: 27, y: 3 },
    { x: 6, y: 17 },
    { x: 27, y: 17 },
  ]),
];

/**
 * 黒炎を自分の体に容れた男。**狂人としては絶対に書かない。**
 * 丁寧で、辛抱強く、完全に確信している。
 */
const TAKESHI: Seed = {
  id: 'c25_boss',
  name: 'タケシ',
  classId: 'general',
  level: 20,
  x: 16,
  y: 2,
  affinity: 'dark',
  stats: st(72, 28, 12, 22, 16, 12, 26, 18, 22, 5),
  growth: st(95, 60, 40, 50, 40, 30, 55, 40, 0, 0),
  weapons: ['steelAxe', 'hammer', 'handAxe'],
  wexp: { axe: 350 },
  ai: 'boss',
  isBoss: true,
};

export const CH25: ChapterDef = {
  title: '終章  「海の門」',
  // 崖の上の社。北が境内（H）と火の鉢（玉座）。南が登ってきた道。外海（o）は
  // 誰も入れないので、東西の崖のふちは本当に行き止まり。**下がる場所が無い。**
  map: [
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'oooooooooooHHHHHHHHHHHHooooooooooo',
    'ooooooooooHHHHHHTHHHHHHHoooooooooo',
    'ooooooHHHHHHHHHHHHHHHHHHHHoooooooo',
    'oooooHHHHHHHHHHHHHHHHHHHHHHooooooo',
    'ooooHHHHHHHHHHHHHHHHHHHHHHHHoooooo',
    'oooo,,,,HHHHHHHHHHHHHHHHH,,,,ooooo',
    'ooo,,,,,,,,,,,,,,,,,,,,,,,,,,ooooo',
    'ooo,,,,,,,,,,,,,,,,,,,,,,,,,,,oooo',
    'oo,,,,,,,,,,,,,,,,,,,,,,,,,,,,oooo',
    'oo,,,,,,,,,,,,,,,,,,,,,,,,,,,,,ooo',
    'oo,,,,,,,,,,,,,,,,,,,,,,,,,,,,oooo',
    'ooo,,,,,,,,,,,,,,,,,,,,,,,,,,,oooo',
    'ooo,,,,,,,,,,,,,,,,,,,,,,,,,,ooooo',
    'oooo,,,,,,,,,,,,,,,,,,,,,,,,,ooooo',
    'ooooo,,,,,,,,,,,,,,,,,,,,,,,oooooo',
    'oooooo,,,,,,,,,,,,,,,,,,,,,ooooooo',
    'ooooooo,,,,,,,,,,,,,,,,,,,oooooooo',
    'oooooooo,,,,,,,,,,,,,,,,,ooooooooo',
    'ooooooooo,,,,,,,,,,,,,,,oooooooooo',
    'ooooooooooo,,,,bb,,,,,oooooooooooo',
    'oooooooooooooo,bb,oooooooooooooooo',
    'oooooooooooooo,bb,oooooooooooooooo',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
  ],
  objective: { kind: 'boss', label: 'タケシを討て' },
  deploy: 12,
  forced: ['p_shigeru'],
  starts: [
    { x: 15, y: 22 },
    { x: 16, y: 22 },
    { x: 15, y: 21 },
    { x: 16, y: 21 },
    { x: 14, y: 20 },
    { x: 15, y: 20 },
    { x: 16, y: 20 },
    { x: 17, y: 20 },
    { x: 13, y: 20 },
    { x: 18, y: 20 },
    { x: 12, y: 20 },
    { x: 19, y: 20 },
    { x: 20, y: 20 },
  ],
  enemies: [...GUARD, TAKESHI],
  villages: [],
  chests: [],
  shop: [],
  // 崖の上へ登った分だけ出る。三回、四体ずつ
  reinforcements: [
    { x: 5, y: 6, when: { x: 16, y: 16, r: 4 } },
    { x: 28, y: 6, when: { x: 16, y: 16, r: 4 } },
    { x: 8, y: 3, when: { x: 16, y: 8, r: 4 } },
    { x: 25, y: 3, when: { x: 16, y: 8, r: 4 } },
  ].flatMap((t, g) =>
    [0, 1, 2, 3].map((i) => ({
      turn: 2,
      at: { x: t.x, y: t.y },
      when: t.when,
      seed: {
        ...(i % 2 ? MOOK.soldier(24) : MOOK.gargoyle(24)),
        id: `c25_t${g}_${i}`,
        x: t.x,
        y: t.y,
        ai: 'aggressive',
      } as Seed,
    })),
  ),
  events: [
    {
      turn: 5,
      script: {
        id: 'ch25_t5',
        lines: [
          { text: '下の海の門を、潮が通っていく音が、崖の上まで届いていた。' },
          { speaker: 'ミレイユ', who: 'p_mirelle', side: 'right', text: '……四百年前も、同じ音がしていたはずです。' },
          { speaker: 'アルド', who: 'p_ald', side: 'right', text: '同じでしょう。潮は当番を替えません。' },
        ],
      },
    },
    {
      turn: 9,
      script: {
        id: 'ch25_t9',
        lines: [
          { speaker: 'タケシ', who: 'c25_boss', side: 'right', text: '——まだ来るか。' },
          { speaker: 'シゲル', who: 'p_shigeru', side: 'left', text: '行く。' },
          { speaker: 'タケシ', who: 'c25_boss', side: 'right', text: 'よろしい。' },
          {
            speaker: 'タケシ',
            who: 'c25_boss',
            side: 'right',
            text: '……わしは、来ないほうに賭けていた。負けたのは、たぶん今日が初めてだ。',
          },
        ],
      },
    },
  ],
  scripts: CH25_SCRIPTS,
};
