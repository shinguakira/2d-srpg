import { CH17_SCRIPTS } from '../../story/chapters/ch17';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks, st } from './common';
import type { Seed } from '../roster';

/**
 * 第17章 サーズの浅瀬。**リゼットの規則が、そのまま盤になっている章。**
 *
 * 川が南北に走り、渡れるのは浅瀬三本と第2章の橋だけ。**西岸は全部灰、東岸は
 * 生きた土地。** 灰は水を渡らないので、東岸に一歩でも通せば規則が破れる、
 * という盤ではない —— 通すのはクロガネの兵で、彼らが通ると灰も一緒に来る。
 *
 * 十ターン、渡し場を保つ。**敵を殺し切っても終わらない。**
 *
 * specs/story/chapters/ch17.md
 */
const WEST: Seed[] = [
  ...mooks('c17_s', MOOK.soldier(17), [
    { x: 8, y: 5 },
    { x: 8, y: 10 },
    { x: 8, y: 15 },
    { x: 6, y: 7 },
    { x: 6, y: 13 },
  ]),
  ...mooks('c17_m', MOOK.mercenary(17), [
    { x: 5, y: 4 },
    { x: 5, y: 16 },
    { x: 4, y: 10 },
  ]),
  ...mooks('c17_c', MOOK.cavalier(17), [
    { x: 3, y: 6 },
    { x: 3, y: 14 },
  ]),
  ...mooks('c17_a', MOOK.archer(17), [
    { x: 2, y: 9, ai: 'guard' },
    { x: 2, y: 11, ai: 'guard' },
  ]),
  // 灰の側。クロガネの後ろから来て、同じ浅瀬を欲しがる
  ...mooks('c17_r', MOOK.revenant(17), [
    { x: 1, y: 4 },
    { x: 1, y: 8 },
    { x: 1, y: 12 },
    { x: 1, y: 16 },
  ]),
  ...mooks('c17_g', MOOK.gargoyle(17), [
    { x: 2, y: 2 },
    { x: 2, y: 18 },
  ]),
  ...mooks('c17_h', MOOK.shaman(17), [
    { x: 4, y: 2, ai: 'guard' },
    { x: 4, y: 18, ai: 'guard' },
  ]),
];

/** 八百人ぶんの足を濡らしたくない男 */
const DORG: Seed = {
  id: 'c17_boss',
  name: 'ドルグ',
  classId: 'general',
  level: 12,
  x: 1,
  y: 10,
  affinity: 'anima',
  stats: st(50, 20, 0, 15, 10, 7, 20, 8, 17, 5),
  growth: st(85, 55, 0, 45, 30, 20, 50, 20, 0, 0),
  weapons: ['steelAxe', 'handAxe'],
  wexp: { axe: 260 },
  ai: 'boss',
  isBoss: true,
};

export const CH17: ChapterDef = {
  title: '第17章  「サーズの浅瀬」',
  // 川は x=13〜14 の二列。渡れるのは浅瀬（b の橋）三本だけ。
  // 西岸（左）が灰、東岸（右）が生きた土地。第2章の橋は真ん中の一本。
  map: [
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'w###########~~,,,,,,,,,,,,,,,w',
    'w###########~~,,,,,,,,,,,,,,,w',
    'w###########~~,,,,,,f,,,,,,,,w',
    'w##########bbb,,,,,,,,,,,,,,,w',
    'w###########~~,,,,,,,,,,,,,,,w',
    'w###########~~,,,,,,,,,,,,,,,w',
    'w###########~~,,,,,,,,,,,,,,,w',
    'w###########~~,,,,,,,,,,,,,,,w',
    'w#########bbbbb,,,,,,,,,,,,,,w',
    'w#########bbbbb,,,,,FF,,,,,,,w',
    'w#########bbbbb,,,,,,,,,,,,,,w',
    'w###########~~,,,,,,,,,,,,,,,w',
    'w###########~~,,,,,,,,,,,,,,,w',
    'w###########~~,,,,,,,,,,,,,,,w',
    'w###########~~,,,,,,,,,,,,,,,w',
    'w##########bbb,,,,,,,,,,,,,,,w',
    'w###########~~,,,,,,f,,,,,,,,w',
    'w###########~~,,,,,,,,,,,,,,,w',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
  ],
  objective: { kind: 'survive', turns: 10, label: '10ターン、浅瀬を保て' },
  deploy: 12,
  starts: [
    { x: 16, y: 10 },
    { x: 16, y: 9 },
    { x: 16, y: 11 },
    { x: 17, y: 10 },
    { x: 15, y: 4 },
    { x: 16, y: 4 },
    { x: 15, y: 16 },
    { x: 16, y: 16 },
    { x: 17, y: 9 },
    { x: 17, y: 11 },
    { x: 18, y: 10 },
    { x: 15, y: 5 },
    { x: 15, y: 15 },
  ],
  enemies: [...WEST, DORG],
  villages: [],
  chests: [],
  shop: [],
  reinforcements: [2, 3, 4, 5, 6, 7, 8].flatMap((turn, w) =>
    [
      { x: 1, y: 1 },
      { x: 1, y: 18 },
      { x: 28, y: 10 },
    ].map((at, i) => ({
      turn,
      at,
      seed: {
        ...(i === 2 ? MOOK.cavalier(16 + Math.floor(w / 2)) : MOOK.revenant(16 + Math.floor(w / 2))),
        id: `c17_w${w}_${i}`,
        x: at.x,
        y: at.y,
        ai: 'aggressive',
      } as Seed,
    })),
  ),
  events: [
    {
      turn: 5,
      script: {
        id: 'ch17_t5',
        lines: [
          { text: '対岸で、灰が水際まで来た。そこで止まった。触れもしなかった。' },
          { speaker: 'アルド', who: 'p_ald', side: 'right', text: '……止まりました。' },
          { speaker: 'リゼット', who: 'p_lisette', side: 'right', text: 'まだ終わっていません。' },
        ],
      },
    },
    {
      turn: 9,
      script: {
        id: 'ch17_t9',
        lines: [
          { speaker: 'ガレス', who: 'p_gareth', side: 'left', text: 'おい学者。もう笑っていいぞ。' },
          { speaker: 'リゼット', who: 'p_lisette', side: 'right', text: 'まだです。' },
          { speaker: 'ガレス', who: 'p_gareth', side: 'left', text: '……そういうとこだよ。' },
        ],
      },
    },
  ],
  scripts: CH17_SCRIPTS,
};
