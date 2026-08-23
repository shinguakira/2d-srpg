import { CH20_SCRIPTS } from '../../story/chapters/ch20';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks } from './common';
import type { Seed } from '../roster';

/**
 * 第20章 伐られたことのない森。**ほぼ全マスが林の盤。**
 *
 * 移動は半分、見通しは無し、危険域が読めない。**手探りで進む章。**
 * 抜ける道は無く、十二ターン耐えるだけ。
 *
 * 出てくるのは屍兵と巨兵だけで、人間の敵が一人もいない —— それがこの山の
 * 中身で、幕切れで甲冑の型が四百年前のものだと分かる。
 *
 * 増援は引き金式。四か所、踏み込むと四体ずつ。**深く入るほど起きる。**
 *
 * specs/story/chapters/ch20.md
 */
const WOOD: Seed[] = [
  ...mooks('c20_r', MOOK.revenant(20), [
    { x: 6, y: 8 },
    { x: 11, y: 4 },
    { x: 17, y: 4 },
    { x: 24, y: 5 },
    { x: 8, y: 9 },
    { x: 14, y: 8 },
    { x: 21, y: 9 },
    { x: 27, y: 8 },
    { x: 7, y: 14 },
    { x: 13, y: 15 },
    { x: 19, y: 14 },
    { x: 25, y: 15 },
  ]),
  ...mooks('c20_b', MOOK.revenant(22), [
    { x: 15, y: 6 },
    { x: 11, y: 11 },
    { x: 20, y: 11 },
    { x: 15, y: 17 },
  ]),
  ...mooks('c20_g', MOOK.gargoyle(20), [
    { x: 3, y: 2 },
    { x: 28, y: 2 },
    { x: 3, y: 19 },
    { x: 28, y: 19 },
  ]),
  ...mooks('c20_s', MOOK.shaman(20), [
    { x: 5, y: 11, ai: 'guard' },
    { x: 26, y: 11, ai: 'guard' },
  ]),
];

/** 四世紀前の甲冑を着た屍兵。**347 の人たち。** 硬く、遅く、止まらない */
const SWORN: Seed[] = mooks('c20_o', { ...MOOK.knight(22), name: '古い甲冑' }, [
  { x: 15, y: 10, ai: 'guard' },
  { x: 14, y: 12, ai: 'guard' },
  { x: 16, y: 12, ai: 'guard' },
  { x: 15, y: 14, ai: 'guard' },
]);

export const CH20: ChapterDef = {
  title: '第20章  「伐られたことのない森」',
  // 林しかない。細い獣道が縦横に一本ずつ通っているだけで、それも
  // 途中で消える。危険域が読めないのがこの盤の全部。
  map: [
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'wffffffffffffffffffffffffffffffw',
    'wffffffffffff,,ffffffffffffffffw',
    'wfffffffffff,,,,fffffffffffffffw',
    'wffffff,,fffffffffff,,fffffffffw',
    'wfffff,,,,ffffffffff,,,,fffffffw',
    'wffffffffff,,,,,,,,ffffffffffffw',
    'wffffffffff,ffffff,ffffffffffffw',
    'wfffff,,ffff,ffff,fffff,,ffffffw',
    'wffff,,,,fff,ffff,ffff,,,,fffffw',
    'wfffffffffff,,ff,,fffffffffffffw',
    'wffff,ffffffff,,ffffffffff,ffffw',
    'wfffffffffff,,ff,,fffffffffffffw',
    'wffff,,,,fff,ffff,ffff,,,,fffffw',
    'wfffff,,ffff,ffff,fffff,,ffffffw',
    'wffffffffff,ffffff,ffffffffffffw',
    'wffffffffff,,,,,,,,ffffffffffffw',
    'wfffff,,,,ffffffffff,,,,fffffffw',
    'wffffff,,fffffffffff,,fffffffffw',
    'wffffffffffffffffffffffffffffffw',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
  ],
  objective: { kind: 'survive', turns: 12, label: '森を抜けて生き延びよ（12ターン）' },
  deploy: 12,
  starts: [
    { x: 13, y: 2 },
    { x: 14, y: 2 },
    { x: 12, y: 3 },
    { x: 13, y: 3 },
    { x: 14, y: 3 },
    { x: 15, y: 3 },
    { x: 7, y: 4 },
    { x: 8, y: 4 },
    { x: 20, y: 4 },
    { x: 21, y: 4 },
    { x: 6, y: 5 },
    { x: 22, y: 5 },
    { x: 7, y: 5 },
  ],
  enemies: [...WOOD, ...SWORN],
  villages: [],
  chests: [],
  shop: [],
  reinforcements: [
    { x: 6, y: 9 },
    { x: 25, y: 9 },
    { x: 6, y: 13 },
    { x: 25, y: 13 },
  ].flatMap((at, g) =>
    [0, 1, 2, 3].map((i) => ({
      turn: 2,
      at,
      when: { x: at.x, y: at.y, r: 3 },
      seed: {
        ...(i === 3 ? MOOK.knight(21) : MOOK.revenant(20)),
        id: `c20_t${g}_${i}`,
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
        id: 'ch20_t5',
        lines: [
          { text: '枝の下で、金属が擦れる音がした。歩幅が揃っている。' },
          { speaker: 'ロルフ', who: 'p_rolf', side: 'right', text: '……隊列だ。あれは隊列を組んでる。' },
          { speaker: 'ジェイガン', who: 'p_akira', side: 'right', text: '屍兵は隊列を組みません。' },
          { speaker: 'ロルフ', who: 'p_rolf', side: 'right', text: 'だろうな。組んでる。' },
        ],
      },
    },
    {
      turn: 9,
      script: {
        id: 'ch20_t9',
        lines: [
          { speaker: 'ミレイユ', who: 'p_mirelle', side: 'right', text: '……唄を、止めます。' },
          { speaker: 'アルド', who: 'p_ald', side: 'right', text: 'ミレイユさん。' },
          { speaker: 'ミレイユ', who: 'p_mirelle', side: 'right', text: '送る言葉が、合っていない気がして。' },
          { speaker: 'ミレイユ', who: 'p_mirelle', side: 'right', text: 'ここの方々は、まだ送られる番ではないのかもしれません。' },
        ],
      },
    },
  ],
  scripts: CH20_SCRIPTS,
};
