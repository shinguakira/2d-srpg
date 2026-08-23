import { CH22_SCRIPTS } from '../../story/chapters/ch22';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks, st } from './common';
import type { Seed } from '../roster';

/**
 * 第22章 義兄弟。**普通の会戦。それでいい。**
 *
 * タラギから海岸へ降りる街道で、相手は皇帝の第一連隊 —— 灰でも魔物でもなく、
 * 四十年きちんと訓練された人間の軍。**アーク5でここだけが「昔ながらの戦」**
 * で、それは player に、これが家の話であることを落ち着いて聞かせるため。
 *
 * specs/story/chapters/ch22.md
 */
const FIRST: Seed[] = [
  ...mooks('c22_c', MOOK.cavalier(21), [
    { x: 19, y: 5 },
    { x: 19, y: 13 },
    { x: 22, y: 7 },
    { x: 22, y: 11 },
    { x: 17, y: 9 },
  ]),
  ...mooks('c22_s', MOOK.soldier(21), [
    { x: 20, y: 8 },
    { x: 20, y: 10 },
    { x: 18, y: 6 },
    { x: 18, y: 12 },
    { x: 21, y: 9 },
  ]),
  ...mooks('c22_k', MOOK.knight(21), [
    { x: 24, y: 8, ai: 'guard' },
    { x: 24, y: 10, ai: 'guard' },
    { x: 25, y: 9, ai: 'guard' },
  ]),
  ...mooks('c22_a', MOOK.archer(21), [
    { x: 26, y: 5, ai: 'guard' },
    { x: 26, y: 13, ai: 'guard' },
    { x: 23, y: 4, ai: 'guard' },
    { x: 23, y: 14, ai: 'guard' },
  ]),
  ...mooks('c22_m', MOOK.mercenary(21), [
    { x: 15, y: 4 },
    { x: 15, y: 14 },
    { x: 16, y: 9 },
  ]),
  ...mooks('c22_h', MOOK.shaman(21), [
    { x: 25, y: 6, ai: 'guard' },
    { x: 25, y: 12, ai: 'guard' },
  ]),
  ...mooks('c22_p', MOOK.cavalier(22), [
    { x: 13, y: 2 },
    { x: 13, y: 16 },
  ]),
];

/** 誓いの場に立ち会い、水を運んだ男。コドの浜で王を斬った隊の長 */
const GERHARD: Seed = {
  id: 'c22_boss',
  name: 'ゲルハルト',
  classId: 'general',
  level: 18,
  x: 27,
  y: 9,
  affinity: 'fire',
  stats: st(58, 24, 0, 18, 13, 10, 22, 10, 19, 5),
  growth: st(90, 55, 0, 45, 35, 25, 50, 20, 0, 0),
  weapons: ['steelAxe', 'hammer', 'handAxe'],
  wexp: { axe: 300 },
  ai: 'boss',
  isBoss: true,
};

export const CH22: ChapterDef = {
  title: '第22章  「義兄弟」',
  // タラギから海岸への街道。真ん中を道が走り、南北は段々の畑と林。
  // 東の端に連隊の陣（砦と玉座）。地形の仕掛けは無い。腕だけで通る。
  map: [
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'w,,,,ff,,,,,,,,,,,,,,,ff,,,,,w',
    'w,,,fff,,,,,,,,,,,,,,,fff,,,,w',
    'w,,,,f,,,,,,,,,,,,,,,,,f,,,,,w',
    'w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w',
    'w,,,,,,,,,,,,,,,,,,,,,,,,FF,,w',
    'w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w',
    'wbbbbbbbbbbbbbbbbbbbbbbbbbb,,w',
    'wbbbbbbbbbbbbbbbbbbbbbbbbbb,,w',
    'wbbbbbbbbbbbbbbbbbbbbbbbbbbT,w',
    'wbbbbbbbbbbbbbbbbbbbbbbbbbb,,w',
    'wbbbbbbbbbbbbbbbbbbbbbbbbbb,,w',
    'w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w',
    'w,,,,,,,,,,,,,,,,,,,,,,,,FF,,w',
    'w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w',
    'w,,,,f,,,,,,,,,,,,,,,,,f,,,,,w',
    'w,,,fff,,,,,,,,,,,,,,,fff,,,,w',
    'w,,,,ff,,,,,,,,,,,,,,,ff,,,,,w',
    'w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
  ],
  objective: { kind: 'boss', label: '敵将ゲルハルトを討て' },
  deploy: 12,
  starts: [
    { x: 2, y: 9 },
    { x: 2, y: 8 },
    { x: 2, y: 10 },
    { x: 1, y: 9 },
    { x: 3, y: 9 },
    { x: 1, y: 8 },
    { x: 1, y: 10 },
    { x: 3, y: 8 },
    { x: 3, y: 10 },
    { x: 2, y: 7 },
    { x: 2, y: 11 },
    { x: 1, y: 7 },
    { x: 1, y: 11 },
  ],
  enemies: [...FIRST, GERHARD],
  villages: [],
  chests: [],
  shop: [
    { weapon: 'steelSword', price: 600 },
    { weapon: 'steelLance', price: 620 },
    { weapon: 'steelAxe', price: 500 },
    { weapon: 'steelBow', price: 1000 },
    { weapon: 'physic', price: 1600 },
    { weapon: 'restore', price: 1800 },
  ],
  reinforcements: [4, 7].flatMap((turn, w) =>
    [
      { x: 28, y: 1 },
      { x: 28, y: 18 },
      { x: 28, y: 5 },
      { x: 28, y: 14 },
    ].map((at, i) => ({
      turn,
      at,
      seed: {
        ...(i % 2 ? MOOK.cavalier(21 + w) : MOOK.soldier(21 + w)),
        id: `c22_w${w}_${i}`,
        x: at.x,
        y: at.y,
        ai: 'aggressive',
      } as Seed,
    })),
  ),
  events: [
    {
      turn: 3,
      script: {
        id: 'ch22_t3',
        lines: [
          { text: '街道の脇に、古い石標が立っていた。両家の紋が並べて彫ってある。' },
          { speaker: 'ロルフ', who: 'p_rolf', side: 'right', text: '……二十三年前の。誓いの日に立てたものだ。' },
          { speaker: 'ガレス', who: 'p_gareth', side: 'left', text: '倒すか。' },
          { speaker: 'シゲル', who: 'p_shigeru', side: 'left', text: '置いておけ。' },
        ],
      },
    },
  ],
  scripts: CH22_SCRIPTS,
};
