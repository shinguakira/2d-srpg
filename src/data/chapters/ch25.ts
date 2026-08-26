import { CH25_SCRIPTS } from '../../story/chapters/ch25';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks, st } from './common';
import type { Seed } from '../roster';

/**
 * 終章 アレの社。**盤そのものが話になっている。**
 *
 * **アレは海の上ではなく、谷にある集落。** 島の西岸、川が海に出るところ。左（西）が
 * 海で、あとは全部土地 —— 川、田、林、そして三方の山。海の門は谷の外の水に立って
 * いて、盤には出てこない。見えるのは崖の上の社のほうで、そこにタケシが座っている。
 *
 * 隊は南の海沿いの道から入る。第24章で抜けた穴の、その北側の出口。
 *
 * 境内（`H`）は神域なので灰が入れない。川（`~`）は騎馬が渡れず、橋は二か所しかない。
 * **どこを通るかを二度選ばせる盤で、退路の無さは崖ではなく時間のほうにある。**
 *
 * 出撃は 12 に戻る —— **最後の章は、player が選んだ隊であってほしい。**
 * 二十三章の十六人ではなく。
 *
 * specs/story/chapters/ch25.md
 */
const GUARD: Seed[] = [
  ...mooks('c25_k', MOOK.knight(25), [
    { x: 7, y: 6, ai: 'guard' },
    { x: 10, y: 6, ai: 'guard' },
    { x: 13, y: 6, ai: 'guard' },
    { x: 6, y: 5, ai: 'guard' },
    { x: 14, y: 5, ai: 'guard' },
    { x: 10, y: 2, ai: 'guard' },
  ]),
  ...mooks('c25_s', MOOK.soldier(24), [
    { x: 6, y: 8 },
    { x: 12, y: 8 },
    { x: 18, y: 8 },
    { x: 8, y: 10 },
    { x: 15, y: 10 },
    { x: 22, y: 10 },
  ]),
  // 橋を押さえる。渡れるところが二か所しかないので、ここが最初の壁になる
  ...mooks('c25_m', MOOK.mercenary(24), [
    { x: 10, y: 11 },
    { x: 21, y: 11 },
    { x: 13, y: 12 },
    { x: 19, y: 12 },
  ]),
  ...mooks('c25_a', MOOK.archer(24), [
    { x: 3, y: 7, ai: 'guard' },
    { x: 16, y: 7, ai: 'guard' },
    { x: 26, y: 8, ai: 'guard' },
    { x: 27, y: 9, ai: 'guard' },
  ]),
  ...mooks('c25_h', MOOK.shaman(24), [
    { x: 4, y: 3, ai: 'guard' },
    { x: 15, y: 3, ai: 'guard' },
  ]),
  // 谷を囲む山の上。飛べる者だけが取れる高さ
  ...mooks('c25_g', MOOK.gargoyle(24), [
    { x: 20, y: 3 },
    { x: 28, y: 6 },
    { x: 30, y: 16 },
    { x: 31, y: 19 },
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
  x: 10,
  y: 4,
  affinity: 'dark',
  stats: st(72, 28, 12, 22, 16, 12, 26, 18, 22, 5),
  growth: st(95, 60, 40, 50, 40, 30, 55, 40, 0, 0),
  weapons: ['steelAxe', 'hammer', 'handAxe'],
  wexp: { axe: 350 },
  ai: 'boss',
  isBoss: true,
};

export const CH25: ChapterDef = {
  title: '終章  「アレの社」',
  // 阿連の谷。左（西）が海、それ以外は土地。北西の高みが社の境内（H）で、その真ん中
  // に火の鉢（T）。谷の底を川が西へ流れ、橋は二か所。南の海沿いの道から入る。
  map: [
    'oohhhh^^hhhhhhhhhhhhhhhhhhhhhhhhhh',
    'ooffffffffffffffffhhhhhhhhhhhhhhhh',
    'ooHHHHHHHHHHHHHHffhhhhhhhhhhhhhhhh',
    'ooHHHHHHHHHHHHHHHHffhhhhhhhhhhhhhh',
    'ooHHHHHHHHTHHHHHHHffhhhhhhhhhhhhhh',
    'ooHHHHHHHHHHHHHHHHffhhhhhhhhhhhhhh',
    'ooHHHHHHHHHHHHHHff,,,,,,hhhhhhhhhh',
    'ooff,,,,,,,,,,,,ff,,,,,,,,hhhhhhhh',
    'oof,,,,,,,,,,,,,,,,,,,,,,,ffhhhhhh',
    'ooo,,,,,,,,,,,,,,,,,,,,,,,,fhhhhhh',
    'ooo,,,,,,,,,,,,,,,,,,,,,,,,fhhhhhh',
    'ooo~~~~~~~bb~~~~~~~~~bb~~~~~hhhhhh',
    'ooo,,,,,,,,,,,,,,,,,,,,,,,,,hhhhhh',
    'ooo,,,,,..........,,,,,,,,,,hhhhhh',
    'ooo,,,,f..........f,,,,,,,,,hhhhhh',
    'ooo,,,,,,,,,,,,,,,,,,,,,,,,,ffhhhh',
    'oooo,,,,,,,,,,,,,,,,,,,,,,,,ffhhhh',
    'oooo,,,,,,,,,,,,,,,,,,,,,,,fffhhhh',
    'ooooo,,,,,,,,,,,,,,,,,,,,,,fffhhhh',
    'ooooo,,,,,,,,,,,,,,,,,,,,,ffffhhhh',
    'oooooobb,,,,,,,,,,,,,,,,,fffhhhhhh',
    'ooooooobb,,,,,,,,,,,,,,,ffffhhhhhh',
    'oooooooobb,,,,,,,,,,,,ffffhhhhhhhh',
    'ooooooooobb,,,,,,,,,,fffhhhhhhhhhh',
  ],
  objective: { kind: 'boss', label: 'タケシを討て' },
  deploy: 12,
  forced: ['p_shigeru'],
  // 南の海沿いの道。抜けてきた穴は、この盤のすぐ南にある
  starts: [
    { x: 6, y: 20 },
    { x: 7, y: 20 },
    { x: 8, y: 20 },
    { x: 9, y: 20 },
    { x: 7, y: 21 },
    { x: 8, y: 21 },
    { x: 9, y: 21 },
    { x: 10, y: 21 },
    { x: 8, y: 22 },
    { x: 9, y: 22 },
    { x: 10, y: 22 },
    { x: 11, y: 22 },
    { x: 9, y: 23 },
  ],
  enemies: [...GUARD, TAKESHI],
  villages: [],
  chests: [],
  shop: [],
  // 谷を上がった分だけ出る。四回、四体ずつ
  reinforcements: [
    { x: 25, y: 7, when: { x: 14, y: 14, r: 4 } },
    { x: 28, y: 12, when: { x: 14, y: 14, r: 4 } },
    { x: 13, y: 2, when: { x: 10, y: 8, r: 4 } },
    { x: 2, y: 7, when: { x: 10, y: 8, r: 4 } },
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
          { text: '谷の外で、海の門を潮が通っていく音がしていた。崖の上まで届いていた。' },
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
