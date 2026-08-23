import { CH16_SCRIPTS } from '../../story/chapters/ch16';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks, st } from './common';
import type { Seed } from '../roster';

/**
 * 第16章 何も上げなかった男。**焼けた王都に戻る章。**
 *
 * 盤は占領行政のイルザ。城跡（石床）と市街と、**柵で囲った東の三区**（灰）。
 * 灰は町の中にあり、外に出ていない —— 一年、囲い続けた者がいるから。
 *
 * 増援は引き金式。中庭に踏み込むと城の翼から出る。柵の中からは何も出ない。
 *
 * specs/story/chapters/ch16.md
 */
const GARRISON: Seed[] = [
  ...mooks('c16_s', MOOK.soldier(16), [
    { x: 8, y: 14 },
    { x: 12, y: 15 },
    { x: 16, y: 14 },
    { x: 10, y: 11 },
    { x: 18, y: 11 },
  ]),
  ...mooks('c16_k', MOOK.knight(17), [
    { x: 13, y: 8, ai: 'guard' },
    { x: 15, y: 8, ai: 'guard' },
    { x: 13, y: 6, ai: 'guard' },
    { x: 15, y: 6, ai: 'guard' },
  ]),
  ...mooks('c16_m', MOOK.mercenary(16), [
    { x: 6, y: 12 },
    { x: 21, y: 12 },
  ]),
  ...mooks('c16_a', MOOK.archer(16), [
    { x: 11, y: 5, ai: 'guard' },
    { x: 17, y: 5, ai: 'guard' },
  ]),
  ...mooks('c16_h', MOOK.shaman(16), [
    { x: 12, y: 3, ai: 'guard' },
    { x: 16, y: 3, ai: 'guard' },
  ]),
  ...mooks('c16_c', MOOK.cavalier(16), [
    { x: 4, y: 16 },
    { x: 24, y: 16 },
  ]),
];

/** 一年、報告を一通も出さなかった総督。剣の持ち方が下手 */
const HALVIK: Seed = {
  id: 'c16_boss',
  name: '総督ハルヴィク',
  classId: 'general',
  level: 10,
  x: 13,
  y: 2,
  affinity: 'ice',
  stats: st(48, 18, 0, 13, 9, 8, 19, 9, 16, 5),
  growth: st(85, 50, 0, 40, 25, 25, 50, 20, 0, 0),
  weapons: ['steelLance', 'javelin'],
  wexp: { lance: 250 },
  ai: 'boss',
  isBoss: true,
};

/**
 * 城の左右の翼から。中庭に踏み込むと出る。二か所、三体ずつ。
 *
 * **柵の中からは何も湧かない。** あそこは一年ぶん閉まっていて、この章では
 * 最後まで閉まったままでいる —— ハルヴィクが稼いだのはその一年だから。
 */
const WINGS: ChapterDef['reinforcements'] = [
  { x: 5, y: 1 },
  { x: 22, y: 1 },
].flatMap((at, g) =>
  [0, 1, 2].map((i) => ({
    turn: 2,
    at,
    when: { x: 14, y: 5, r: 3 },
    seed: {
      ...(i === 0 ? MOOK.knight(16) : MOOK.soldier(16)),
      id: `c16_p${g}_${i}`,
      x: at.x,
      y: at.y,
      ai: 'aggressive',
    } as Seed,
  })),
);

export const CH16: ChapterDef = {
  title: '第16章  「何も上げなかった男」',
  // 北に城跡（石床と玉座）、南に市街。東西の隅に柵で囲った灰の三区。
  // 灰は町の中で止まっている —— 囲いを破るかどうかは player が決める。
  map: [
    'wwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'w__________________________w',
    'w____________T_____________w',
    'w__________________________w',
    'w____wwww_________wwww_____w',
    'w__________________________w',
    'w###w____w_______w____w####w',
    'w###w,,,,,,,,,,,,,,,,,w####w',
    'w###w,,,,,,,,,,,,,,,,,w####w',
    'wwwww,,,,,,,,,,,,,,,,,wwwwww',
    'w,,,,,,,,bbbbbbbb,,,,,,,,,,w',
    'w,,,,,,,,b,,,,,,b,,,,,,,,,,w',
    'w,,VV,,,,b,,,,,,b,,,,,,VV,,w',
    'w,,,,,,,,b,,SS,,b,,,,,,,,,,w',
    'w,,,,,,,,b,,,,,,b,,,,,,,,,,w',
    'w,,,,,,,,bbbbbbbb,,,,,,,,,,w',
    'w,,,,,,,,,,,,,,,,,,,,,,,,,,w',
    'w,,,,,,,,,,,bb,,,,,,,,,,,,,w',
    'w,,,,,,,,,,,bb,,,,,,,,,,,,,w',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwww',
  ],
  objective: { kind: 'seize', x: 13, y: 2, label: '玉座を制圧せよ' },
  deploy: 11,
  starts: [
    { x: 12, y: 18 },
    { x: 13, y: 18 },
    { x: 14, y: 18 },
    { x: 11, y: 18 },
    { x: 12, y: 17 },
    { x: 13, y: 17 },
    { x: 14, y: 17 },
    { x: 11, y: 17 },
    { x: 15, y: 17 },
    { x: 10, y: 17 },
    { x: 15, y: 18 },
    { x: 10, y: 18 },
  ],
  enemies: [...GARRISON, HALVIK],
  villages: [
    {
      x: 3,
      y: 12,
      weapon: 'silenceStaff',
      text: '市の裏。店主は残っていた。「柵の内側の音が、夜だけ聞こえる」と言って、これを押しつけてきた。',
    },
    { x: 23, y: 12, potion: 2, text: '一年前に焼けた家の跡に、新しい戸が入っていた。中に薬が二つと、書き置き。「もどってきたひとへ」' },
  ],
  chests: [],
  shop: [
    { weapon: 'steelSword', price: 600 },
    { weapon: 'steelLance', price: 620 },
    { weapon: 'steelAxe', price: 500 },
    { weapon: 'physic', price: 1600 },
    { weapon: 'restore', price: 1800 },
  ],
  reinforcements: WINGS,
  events: [
    {
      turn: 3,
      script: {
        id: 'ch16_t3',
        lines: [
          { text: '柵の板に、白墨で数字が書いてあった。日付と、その日の中の数。' },
          { speaker: 'リゼット', who: 'p_lisette', side: 'right', text: '……三百六十四日ぶん、毎日。' },
          { speaker: 'ヨルン', who: 'p_jorn', side: 'right', text: '減ってるか。' },
          { speaker: 'リゼット', who: 'p_lisette', side: 'right', text: '増えています。' },
        ],
      },
    },
  ],
  scripts: CH16_SCRIPTS,
};
