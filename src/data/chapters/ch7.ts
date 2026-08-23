import { CH7_SCRIPTS } from '../../story/chapters/ch7';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks, st } from './common';
import type { Seed } from '../roster';

/**
 * 第7章 壁が抱えていたもの。**耐える章で、敵を殺し切っても終わらない。**
 *
 * 屍兵が北の壁から湧く。3・5・7・9ターン目に三体ずつで、殺しても次が来る。
 * 砦の中は廊下で、通せる幅がどこも二マス以下 —— 前を固めて後ろで回復するしか
 * なく、その形を十二ターン維持できるかだけを訊いている。
 *
 * ヴァロは任意。玉座に座ったまま動かず、倒せばヒーローの証を落とす……のだが
 * ドロップの仕組みがまだ無いので、いまは硬いだけの相手。
 *
 * specs/story/chapters/ch7.md
 */
const WALL: Seed[] = [
  ...mooks('c7_r', MOOK.revenant(7), [
    { x: 6, y: 3 },
    { x: 11, y: 3 },
    { x: 16, y: 3 },
    { x: 8, y: 5 },
    { x: 14, y: 5 },
  ]),
  ...mooks('c7_g', MOOK.gargoyle(8), [
    { x: 4, y: 2 },
    { x: 18, y: 2 },
  ]),
  ...mooks('c7_s', MOOK.soldier(9), [
    { x: 3, y: 9, ai: 'guard' },
    { x: 19, y: 9, ai: 'guard' },
  ]),
  ...mooks('c7_a', MOOK.archer(9), [
    { x: 3, y: 12 },
    { x: 19, y: 12 },
  ]),
  ...mooks('c7_k', MOOK.knight(10), [
    { x: 8, y: 14, ai: 'guard' },
    { x: 14, y: 14, ai: 'guard' },
    { x: 11, y: 15, ai: 'guard' },
  ]),
];

const VARRO: Seed = {
  id: 'c7_boss',
  name: 'ヴァロ',
  classId: 'general',
  level: 12,
  x: 11,
  y: 16,
  affinity: 'ice',
  stats: st(40, 14, 0, 10, 5, 6, 15, 6, 15, 4),
  growth: st(90, 55, 0, 40, 20, 25, 50, 15, 0, 0),
  weapons: ['steelLance', 'javelin'],
  wexp: { lance: 190 },
  ai: 'boss',
  isBoss: true,
};

/** 北の壁から湧く。三体 × 4 波。壁の穴は三つ */
const WAVES = [3, 5, 7, 9].flatMap((turn, w) =>
  [
    { x: 5, y: 1 },
    { x: 11, y: 1 },
    { x: 17, y: 1 },
  ].map((at, i) => ({
    turn,
    at,
    seed: { ...MOOK.revenant(7 + w), id: `c7_w${w}_${i}`, x: at.x, y: at.y, ai: 'aggressive' } as Seed,
  })),
);

export const CH7: ChapterDef = {
  title: '第7章  「壁が抱えていたもの」',
  // 砦の中。北の壁（灰色の側）から南へ、廊下が三本。どこも幅二マス以下で、
  // 前を固めて後ろで回復する形をどれだけ保てるか、という盤。
  map: [
    'wwwwwwwwwwwwwwwwwwwwwwww',
    'w______________________w',
    'w______________________w',
    'w______________________w',
    'wwww_wwwww_wwww_wwww_www',
    'w______________________w',
    'w_wwww_wwwww_wwww_wwww_w',
    'w__F________________F__w',
    'wwww_wwww_wwwww_wwww_www',
    'w______________________w',
    'w_wwww_wwwww_wwww_wwww_w',
    'w______________________w',
    'wwww_wwwww_wwww_wwww_www',
    'w__F________________F__w',
    'w_wwww_wwwww_wwww_wwww_w',
    'w______________________w',
    'wS_________T__________Sw',
    'w______________________w',
    'wwwwwwwwwwwwwwwwwwwwwwww',
  ],
  objective: { kind: 'survive', turns: 12, label: '12ターン生き延びる' },
  deploy: 8,
  starts: [
    { x: 10, y: 17 },
    { x: 11, y: 17 },
    { x: 12, y: 17 },
    { x: 9, y: 17 },
    { x: 13, y: 17 },
    { x: 8, y: 17 },
    { x: 14, y: 17 },
    { x: 7, y: 17 },
    { x: 15, y: 17 },
  ],
  enemies: [...WALL, VARRO],
  villages: [],
  chests: [],
  shop: [
    { weapon: 'steelSword', price: 600 },
    { weapon: 'steelAxe', price: 500 },
    { weapon: 'shine', price: 900 },
    { weapon: 'lightning', price: 600 },
    { weapon: 'mend', price: 800 },
    { weapon: 'restore', price: 1500 },
  ],
  reinforcements: WAVES,
  events: [
    {
      turn: 3,
      script: {
        id: 'ch7_revenants',
        lines: [
          { text: '灰色の石から、何かが這い出してきた。' },
          { speaker: 'ガレス', who: 'p_gareth', side: 'left', text: '……おい。あいつ、アマギの色を着てるぞ。' },
          {
            speaker: 'ミレイユ',
            who: 'p_mirelle',
            side: 'right',
            text: '黒炎は人を殺しません。**空ろにして、立たせ直すのです。**',
          },
          { speaker: 'ミレイユ', who: 'p_mirelle', side: 'right', text: '——顔を見てはいけません。全員です。いいですね。' },
        ],
      },
    },
    {
      turn: 6,
      script: {
        id: 'ch7_break',
        lines: [
          { speaker: 'リゼット', who: 'p_lisette', side: 'right', text: '東の階段！' },
          { text: '西から来た。' },
          { speaker: 'リゼット', who: 'p_lisette', side: 'right', text: '……西！' },
          { text: '床から来た。' },
          {
            speaker: 'リゼット',
            who: 'p_lisette',
            side: 'right',
            text: '追い抜かれているのではありません。**私が何と言うかを待っています。**',
          },
          {
            speaker: 'コルウィン',
            who: 'p_corwin',
            side: 'left',
            text: '——なら声に出すのをやめろ。書いて殿下に渡せ。聞いてるなら、聞くぶんの手間をかけさせてやれ。',
          },
          { speaker: 'リゼット', who: 'p_lisette', side: 'right', text: '……ひどい思いつきです。石筆を貸してください。' },
        ],
      },
    },
  ],
  scripts: CH7_SCRIPTS,
};
