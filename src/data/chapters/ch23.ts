import { CH23_SCRIPTS } from '../../story/chapters/ch23';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks } from './common';
import type { Seed } from '../roster';

/**
 * 第23章 三百の誓い。**封の間を抜ける章。十六人出す。**
 *
 * 名前の壁のある部屋から、奥の階段まで。石床の広間が三つ縦に並び、
 * どれも狭い口で繋がっている。**押し合いになる盤で、出撃十六はそのため。**
 *
 * 目標は脱出（奥の階段）。シゲルが階段に立てば終わるので、**十六人を
 * どの順で通すか**を訊いている。
 *
 * 敵は屍兵と、四世紀前の甲冑。人間は一人もいない。
 *
 * specs/story/chapters/ch23.md
 */
const CHAMBER: Seed[] = [
  ...mooks('c23_r', MOOK.revenant(23), [
    { x: 6, y: 17 },
    { x: 12, y: 17 },
    { x: 19, y: 17 },
    { x: 25, y: 17 },
    { x: 8, y: 13 },
    { x: 15, y: 13 },
    { x: 23, y: 13 },
    { x: 5, y: 9 },
    { x: 11, y: 9 },
    { x: 20, y: 9 },
    { x: 26, y: 9 },
    { x: 9, y: 4 },
    { x: 22, y: 4 },
  ]),
  ...mooks('c23_o', { ...MOOK.knight(24), name: '古い甲冑' }, [
    { x: 15, y: 15, ai: 'guard' },
    { x: 16, y: 15, ai: 'guard' },
    { x: 15, y: 11, ai: 'guard' },
    { x: 16, y: 11, ai: 'guard' },
    { x: 15, y: 7, ai: 'guard' },
    { x: 16, y: 7, ai: 'guard' },
    { x: 15, y: 3, ai: 'guard' },
    { x: 16, y: 3, ai: 'guard' },
  ]),
  ...mooks('c23_s', MOOK.shaman(23), [
    { x: 3, y: 11, ai: 'guard' },
    { x: 28, y: 11, ai: 'guard' },
    { x: 3, y: 7, ai: 'guard' },
    { x: 28, y: 7, ai: 'guard' },
  ]),
  ...mooks('c23_g', MOOK.gargoyle(23), [
    { x: 4, y: 3 },
    { x: 27, y: 3 },
    { x: 10, y: 2 },
    { x: 21, y: 2 },
  ]),
];

export const CH23: ChapterDef = {
  title: '第23章  「三百の誓い」',
  // 石床の広間が三つ、縦に。繋ぎ目はどれも二マス幅。北の端に名前の壁と
  // 奥の階段（脱出口）。南の端が降りてきた階段。
  map: [
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'ww____________________________ww',
    'ww____________________________ww',
    'ww____________________________ww',
    'ww____________________________ww',
    'wwwwwwwwwwwww______wwwwwwwwwwwww',
    'ww____________________________ww',
    'ww____________________________ww',
    'ww____________________________ww',
    'ww____________________________ww',
    'ww____________________________ww',
    'ww____________________________ww',
    'wwwwwwwwwwwww______wwwwwwwwwwwww',
    'ww____________________________ww',
    'ww____________________________ww',
    'ww____________________________ww',
    'ww____________________________ww',
    'ww____________________________ww',
    'ww____________________________ww',
    'wwwwwwwwwwwww______wwwwwwwwwwwww',
    'ww____________________________ww',
    'ww____________________________ww',
    'ww____________________________ww',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
  ],
  objective: { kind: 'escape', x: 15, y: 1, label: '封の間を抜けよ' },
  deploy: 16,
  starts: [
    { x: 15, y: 22 },
    { x: 16, y: 22 },
    { x: 14, y: 22 },
    { x: 17, y: 22 },
    { x: 13, y: 22 },
    { x: 18, y: 22 },
    { x: 15, y: 21 },
    { x: 16, y: 21 },
    { x: 14, y: 21 },
    { x: 17, y: 21 },
    { x: 13, y: 21 },
    { x: 18, y: 21 },
    { x: 12, y: 21 },
    { x: 19, y: 21 },
    { x: 15, y: 20 },
    { x: 16, y: 20 },
    { x: 14, y: 20 },
  ],
  enemies: CHAMBER,
  villages: [],
  chests: [],
  shop: [],
  reinforcements: [2, 3, 4, 5, 6, 7, 8, 9, 10].flatMap((turn, w) =>
    [
      { x: 2, y: 21 },
      { x: 29, y: 21 },
      { x: 2, y: 14 },
      { x: 29, y: 14 },
    ].map((at, i) => ({
      turn,
      at,
      seed: {
        ...(i % 3 === 0 ? MOOK.knight(23) : MOOK.revenant(22 + Math.floor(w / 3))),
        id: `c23_w${w}_${i}`,
        x: at.x,
        y: at.y,
        ai: 'aggressive',
      } as Seed,
    })),
  ),
  events: [
    {
      turn: 4,
      script: {
        id: 'ch23_t4',
        lines: [
          // 前口上でミレイユが「当番表です」と言い切っているので、ここは
          // 見つけ直さない。表の続きを見つけて、その先を訊く
          { text: '奥の広間にも、同じ表があった。最後の一行だけ、名前が彫られずに空けてある。' },
          { speaker: 'ヨルン', who: 'p_jorn', side: 'right', text: '……ここが空いてる。なら、いま当番なのは誰だ。' },
          { speaker: 'ミレイユ', who: 'p_mirelle', side: 'right', text: '……全員です。四百年、ずっと。' },
        ],
      },
    },
    {
      turn: 8,
      script: {
        id: 'ch23_t8',
        lines: [
          { text: '甲冑の一体が、こちらを見て、槍の穂先を下げた。それから、また上げた。' },
          { speaker: 'ロルフ', who: 'p_rolf', side: 'right', text: '……今、下げたぞ。' },
          { speaker: 'ジェイガン', who: 'p_akira', side: 'right', text: '見ました。' },
          { speaker: 'ロルフ', who: 'p_rolf', side: 'right', text: 'あれは、味方に会ったときの礼だ。四百年前の型の。' },
        ],
      },
    },
  ],
  scripts: CH23_SCRIPTS,
};
