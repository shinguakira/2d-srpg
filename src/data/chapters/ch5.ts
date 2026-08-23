import { CH5_SCRIPTS } from '../../story/chapters/ch5';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks, st } from './common';
import type { Seed } from '../roster';

/**
 * 第5章 雲上のカンデル。**飛行を教える章で、盤がそのために組んである。**
 *
 * 城は尾根の上にあり、地上から入る道は南の門ひとつ。左右は峰で歩兵は入れず、
 * 飛行だけが越えられる。城壁の中の弓は、それを分かって置いてある。
 *
 * specs/story/chapters/ch5.md
 */
const GARRISON: Seed[] = [
  ...mooks('c5_k', MOOK.knight(8), [
    { x: 11, y: 5 },
    { x: 12, y: 5 },
    { x: 11, y: 3 },
    { x: 12, y: 3 },
  ]),
  ...mooks('c5_a', MOOK.archer(7), [
    { x: 8, y: 4 },
    { x: 15, y: 4 },
    { x: 6, y: 7 },
    { x: 17, y: 7 },
  ]),
  ...mooks('c5_s', MOOK.soldier(8), [
    { x: 10, y: 8, ai: 'aggressive' },
    { x: 13, y: 8, ai: 'aggressive' },
  ]),
  ...mooks('c5_c', MOOK.cavalier(8), [
    { x: 8, y: 11, ai: 'aggressive' },
    { x: 15, y: 11, ai: 'aggressive' },
  ]),
];

const RODERIC: Seed = {
  id: 'c5_boss',
  name: 'ロデリック',
  classId: 'general',
  level: 11,
  x: 11,
  y: 1,
  affinity: 'ice',
  stats: st(38, 13, 0, 9, 5, 5, 14, 5, 15, 4),
  growth: st(90, 55, 0, 40, 20, 25, 50, 15, 0, 0),
  weapons: ['steelLance', 'javelin'],
  wexp: { lance: 180 },
  ai: 'boss',
  isBoss: true,
};

export const CH5: ChapterDef = {
  title: '第5章  「雲上のカンデル」',
  // 尾根の城。地上の道は南の門ひとつで、東西は峰 —— 歩けない。エリンだけが
  // 城壁を越えて中庭へ降りられる。倒すべき弓は、その降り口を見ている。
  map: [
    'wwwwwwwwwwwwwwwwwwwwwwww',
    'w^^^hhwwww.T..wwwwhh^^^w',
    'w^^hh.wwCw...wwCww.hh^^w',
    'w^hh..wwD.,..,.Dww..hh^w',
    'w^h..f.w..,..,..w.f..h^w',
    'w^h.,..w.....,..w..,.h^w',
    'wh..,..GbbbbbbbbG..,..hw',
    'wh.f..bb,,f..f,,bb..f.hw',
    'wh..,,b,......,,,b,,..hw',
    'wh.f,,b..V..V..,,b,f,.hw',
    'wh,,..bb,,,,,,,,bb..,,hw',
    'wh...f,,b,,,,,,b,,f...hw',
    'whS.,,,,bbbbbbbb,,,,.Shw',
    'wh,,f,,,,,,,,,,,,,,f,,hw',
    'whh..hh,,,,,,,,,,hh..hhw',
    'wwwwwwwwwwwwwwwwwwwwwwww',
  ],
  objective: { kind: 'seize', x: 11, y: 1, label: '玉座の制圧' },
  deploy: 7,
  starts: [
    { x: 10, y: 13 },
    { x: 11, y: 13 },
    { x: 12, y: 13 },
    { x: 13, y: 13 },
    { x: 9, y: 13 },
    { x: 10, y: 14 },
    { x: 11, y: 14 },
    { x: 12, y: 14 },
  ],
  enemies: [...GARRISON, RODERIC],
  villages: [
    { x: 9, y: 9, weapon: 'javelin', text: '尾根の番小屋です。投げ槍を。上の連中は、こちらを人と思っていません。' },
    { x: 12, y: 9, potion: 3, text: '雲の上は冷えます。薬を持って行ってください。……あの穴のことは、訊かないで。' },
  ],
  chests: [
    { x: 8, y: 2, weapon: 'armorslayer' },
    { x: 15, y: 2, gold: 3000 },
  ],
  shop: [
    { weapon: 'steelSword', price: 600 },
    { weapon: 'steelLance', price: 480 },
    { weapon: 'steelAxe', price: 500 },
    { weapon: 'steelBow', price: 560 },
    { weapon: 'armorslayer', price: 1200 },
    { weapon: 'mend', price: 800 },
  ],
  reinforcements: [
    { turn: 4, at: { x: 11, y: 1 }, seed: { ...MOOK.knight(8), id: 'c5_w1', x: 11, y: 1 } as Seed },
    { turn: 4, at: { x: 10, y: 1 }, seed: { ...MOOK.soldier(8), id: 'c5_w2', x: 10, y: 1, ai: 'aggressive' } as Seed },
    { turn: 4, at: { x: 12, y: 1 }, seed: { ...MOOK.soldier(8), id: 'c5_w3', x: 12, y: 1, ai: 'aggressive' } as Seed },
    { turn: 7, at: { x: 2, y: 13 }, seed: { ...MOOK.cavalier(9), id: 'c5_w4', x: 2, y: 13, ai: 'aggressive' } as Seed },
    { turn: 7, at: { x: 21, y: 13 }, seed: { ...MOOK.cavalier(9), id: 'c5_w5', x: 21, y: 13, ai: 'aggressive' } as Seed },
    { turn: 7, at: { x: 11, y: 14 }, seed: { ...MOOK.mercenary(9), id: 'c5_w6', x: 11, y: 14, ai: 'aggressive' } as Seed },
  ],
  events: [
    // 設計の「3ターン目に地形が書き換わる」は、予定表で地形を書き換える仕組みが
    // まだ無い。台詞だけ置いて、盤は動かさない（specs/story/chapters/ch5.md）
    {
      turn: 3,
      script: {
        id: 'ch5_t3',
        lines: [
          { speaker: 'リゼット', who: 'p_lisette', side: 'right', text: '……殿下。いま通った道筋を、もう一度確かめてください。' },
          { speaker: 'シゲル', who: 'p_shigeru', side: 'left', text: '同じ道だ。何も変わって——' },
          { speaker: 'リゼット', who: 'p_lisette', side: 'right', text: '変わっています。私の図が合いません。' },
          { text: '以後の決まりごと。いま自分の足で踏んだ地面だけを信じること。' },
        ],
      },
    },
    {
      turn: 7,
      script: {
        id: 'ch5_t7',
        lines: [
          { text: '谷が、ひと息ぶん静かになった。' },
          { speaker: 'エリン', who: 'p_elin', side: 'right', text: '……穴が。動きました。三十歩、こちらへ。誰も見ていないのに。' },
          {
            speaker: 'リゼット',
            who: 'p_lisette',
            side: 'right',
            text: '殿下のほうへ動いています。戦っているほうではなく——殿下のほうへ。',
          },
        ],
      },
    },
  ],
  scripts: CH5_SCRIPTS,
};
