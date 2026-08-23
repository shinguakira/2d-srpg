import { CH9_SCRIPTS } from '../../story/chapters/ch9';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks, st } from './common';
import type { Seed } from '../roster';

/**
 * 第9章 空いた場所。**盤も敵も、わざと普通。**
 *
 * マイシの峠。一本道の森で、左右に砦。ここまでで一番平凡な全滅戦で、それが
 * 正しい —— この章の相手は盤の上にいない。原始林はシラト（第19章）とタラギ
 * （第20章）のもので、ここでは使わない。ただの山の林。
 *
 * specs/story/chapters/ch9.md
 */
const RAIDERS: Seed[] = [
  ...mooks('c9_b', MOOK.brigand(10), [
    { x: 17, y: 4 },
    { x: 18, y: 8 },
    { x: 17, y: 12 },
    { x: 14, y: 6 },
    { x: 14, y: 10 },
  ]),
  ...mooks('c9_a', MOOK.archer(10), [
    { x: 20, y: 6 },
    { x: 20, y: 10 },
  ]),
  ...mooks('c9_m', MOOK.mercenary(10), [
    { x: 11, y: 3, ai: 'guard' },
    { x: 11, y: 13, ai: 'guard' },
  ]),
  ...mooks('c9_s', MOOK.shaman(10), [
    { x: 19, y: 8, ai: 'guard' },
    { x: 20, y: 4, ai: 'guard' },
  ]),
];

const CAPTAIN: Seed = {
  id: 'c9_boss',
  name: '斥候隊長',
  classId: 'cavalier',
  level: 12,
  x: 21,
  y: 8,
  affinity: 'dark',
  stats: st(33, 12, 0, 11, 11, 4, 9, 3, 12, 7),
  growth: st(80, 50, 0, 45, 45, 20, 35, 15, 0, 0),
  weapons: ['steelLance', 'javelin'],
  wexp: { lance: 150 },
  ai: 'boss',
  isBoss: true,
};

export const CH9: ChapterDef = {
  title: '第9章  「空いた場所」',
  map: [
    'wwwwwwwwwwwwwwwwwwwwwwww',
    'whh,,f..,,f..f,,..f,,hhw',
    'wh,,..f,,..,,..f,,..,,hw',
    'wh..f,,..,,..,,..f,,..hw',
    'w,,..f..F,,..,,F..f..,,w',
    'w..f,,..,,..,,..,,..f..w',
    'w,,..bbbbbbbbbbbbbb..,,w',
    'wf,,bb,,,,,,,,,,,,bb,,fw',
    'w..bb,,f..,,..,,f..bb..w',
    'wf,,bb,,,,,,,,,,,,bb,,fw',
    'w,,..bbbbbbbbbbbbbb..,,w',
    'w..f,,..,,..,,..,,..f..w',
    'w,,..f..F,,..,,F..f..,,w',
    'wh..f,,..,,..,,..f,,..hw',
    'wh,,..f,,..,,..f,,..,,hw',
    'whh,,f..,,f..f,,..f,,hhw',
    'wwwwwwwwwwwwwwwwwwwwwwww',
  ],
  objective: { kind: 'rout', label: '敵の全滅' },
  deploy: 8,
  starts: [
    { x: 3, y: 8 },
    { x: 3, y: 7 },
    { x: 3, y: 9 },
    { x: 2, y: 8 },
    { x: 4, y: 7 },
    { x: 4, y: 9 },
    { x: 2, y: 7 },
    { x: 2, y: 9 },
    { x: 5, y: 8 },
  ],
  enemies: [...RAIDERS, CAPTAIN],
  villages: [],
  chests: [],
  shop: [],
  reinforcements: [
    { turn: 6, at: { x: 22, y: 2 }, seed: { ...MOOK.brigand(11), id: 'c9_w1', x: 22, y: 2, ai: 'aggressive' } as Seed },
    { turn: 6, at: { x: 22, y: 8 }, seed: { ...MOOK.mercenary(11), id: 'c9_w2', x: 22, y: 8, ai: 'aggressive' } as Seed },
    { turn: 6, at: { x: 22, y: 14 }, seed: { ...MOOK.brigand(11), id: 'c9_w3', x: 22, y: 14, ai: 'aggressive' } as Seed },
  ],
  events: [
    {
      turn: 3,
      script: {
        id: 'ch9_viviane',
        lines: [
          { text: '林の際から、誰かが出てきた。拍手を待つような顔で。' },
          {
            speaker: 'ヴィヴィアン',
            who: 'p_viviane',
            side: 'right',
            text: 'あら。二日待った甲斐があった。おもしろい人が通らないかと思って。',
          },
          { speaker: 'シゲル', who: 'p_shigeru', side: 'left', text: '……戦の最中だ。下がれ。' },
          {
            speaker: 'ヴィヴィアン',
            who: 'p_viviane',
            side: 'right',
            text: '見れば分かるわ。それと、あなたたち、葬列の途中で足が止まった人みたいな顔をしてる。',
          },
          {
            speaker: 'リゼット',
            who: 'p_lisette',
            side: 'right',
            text: '……殿下。踊り子は、疲れ切った兵をもう一度動かせます。いまの我々には、剣より価値があります。',
          },
          { speaker: 'ヴィヴィアン', who: 'p_viviane', side: 'right', text: 'ほら、そこの賢い人が正しい。ついていくわね。' },
        ],
      },
      spawn: [
        {
          team: 'player',
          seed: {
            id: 'p_viviane',
            name: 'ヴィヴィアン',
            classId: 'dancer',
            level: 2,
            x: 6,
            y: 8,
            affinity: 'anima',
            stats: st(16, 2, 2, 8, 14, 10, 2, 4, 4, 6),
            growth: st(45, 15, 15, 50, 70, 70, 10, 35, 0, 0),
            weapons: ['slimSword'],
            wexp: { sword: 20 },
            potion: 1,
          },
        },
      ],
      log: 'ヴィヴィアン が仲間になった',
    },
    {
      turn: 5,
      script: {
        id: 'ch9_grief',
        lines: [
          { text: 'ジェイガンが、また後ろを見た。何があるか分かっていて、それでも見た。' },
          { speaker: 'ミレイユ', who: 'p_mirelle', side: 'right', text: '……私もです。' },
        ],
      },
    },
  ],
  scripts: CH9_SCRIPTS,
};
