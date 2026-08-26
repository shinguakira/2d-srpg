import { CH18_SCRIPTS } from '../../story/chapters/ch18';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks, st } from './common';
import type { Seed } from '../roster';

/**
 * 第18章 二つの冠。**盤の上で敵が二派に割れる章。**
 *
 * 港の東半分がソルグの隊、西半分が退いた側。退いた側は `guard` で立って
 * いるだけで、こちらから殴らなければ動かない —— 4ターン目にロルフが
 * 寝返り、6ターン目にエイリンが来る。
 *
 * **寝返りは `defect` で盤の上の駒がそのまま自軍になる。** 新しく湧かせない
 * のは、彼らが「もう三日前からそこに立っていた」から。
 *
 * specs/story/chapters/ch18.md
 */
const SORG_MEN: Seed[] = [
  ...mooks('c18_s', MOOK.soldier(18), [
    { x: 22, y: 6 },
    { x: 24, y: 8 },
    { x: 22, y: 12 },
    { x: 24, y: 10 },
    { x: 20, y: 7 },
    { x: 20, y: 11 },
  ]),
  ...mooks('c18_k', MOOK.knight(18), [
    { x: 26, y: 8, ai: 'guard' },
    { x: 26, y: 10, ai: 'guard' },
    { x: 25, y: 9, ai: 'guard' },
  ]),
  ...mooks('c18_m', MOOK.mercenary(18), [
    { x: 19, y: 4 },
    { x: 19, y: 14 },
    { x: 21, y: 9 },
  ]),
  ...mooks('c18_a', MOOK.archer(18), [
    { x: 27, y: 5, ai: 'guard' },
    { x: 27, y: 13, ai: 'guard' },
  ]),
  ...mooks('c18_c', MOOK.cavalier(18), [
    { x: 17, y: 2 },
    { x: 17, y: 16 },
  ]),
  ...mooks('c18_h', MOOK.shaman(18), [
    { x: 25, y: 4, ai: 'guard' },
    { x: 25, y: 14, ai: 'guard' },
  ]),
];

/** 三日前に退いた側。殴らなければ動かない */
const STOOD_ASIDE: Seed[] = [
  ...mooks('c18_x', MOOK.soldier(17, 'guard'), [
    { x: 10, y: 5 },
    { x: 10, y: 13 },
    { x: 12, y: 4 },
    { x: 12, y: 14 },
  ]),
  ...mooks('c18_y', MOOK.knight(17, 'guard'), [
    { x: 9, y: 9 },
    { x: 11, y: 9 },
  ]),
];

/** 四十年前の借りで立っている。理屈は全部あちらにあると知っている */
const SORG: Seed = {
  id: 'c18_boss',
  name: 'ソルグ',
  classId: 'general',
  level: 14,
  x: 28,
  y: 9,
  affinity: 'fire',
  stats: st(54, 22, 0, 17, 12, 9, 21, 9, 18, 5),
  growth: st(90, 55, 0, 45, 30, 25, 50, 20, 0, 0),
  weapons: ['steelAxe', 'hammer', 'handAxe'],
  wexp: { axe: 280 },
  ai: 'boss',
  isBoss: true,
};

/** 退いた側に混ざって立っている重騎士。4ターン目に寝返る */
const ROLF_ONBOARD: Seed = {
  id: 'p_rolf',
  name: 'ロルフ',
  classId: 'knight',
  level: 12,
  x: 10,
  y: 9,
  affinity: 'anima',
  stats: st(36, 14, 0, 9, 6, 5, 16, 4, 15, 4),
  growth: st(85, 50, 0, 35, 25, 20, 55, 15, 0, 0),
  weapons: ['steelLance', 'javelin'],
  wexp: { lance: 180 },
  ai: 'guard',
};

export const CH18: ChapterDef = {
  title: '第18章  「二つの冠」',
  // ケシュの港。真ん中に石畳の広場、東に桟橋（ソルグの側）、西に倉庫街
  // （退いた側）。二つの旗が向かい合っていて、こちらは割れ目から入る。
  map: [
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w',
    'w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w',
    'w,,,,,VV,,,,,,,,,,,,,,,,,,,,,w',
    'w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w',
    'w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w',
    'w,,,,,,,,__________,,,,,,,,,,w',
    'w,,,,,,,,__________,,,,,,,,,,w',
    'w,,,,,,,,__________,,,,,,,,~~w',
    'w,,,,,,,,____TT____,,,,,,,,~Tw',
    'w,,,,,,,,__________,,,,,,,,~~w',
    'w,,,,,,,,__________,,,,,,,,,,w',
    'w,,,,,,,,__________,,,,,,,,,,w',
    'w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w',
    'w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w',
    'w,,,,,VV,,,,,,,,,,,,,,,,,,,,,w',
    'w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w',
    'w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w',
    'w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
  ],
  objective: { kind: 'boss', label: '敵将ソルグを討て' },
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
  enemies: [...SORG_MEN, ...STOOD_ASIDE, ROLF_ONBOARD, SORG],
  villages: [
    { x: 6, y: 3, weapon: 'hammer', text: '倉庫街の鍛冶。「両方の軍に売った。今日はどっちにも売らん」と言って、これを投げてよこした。' },
    { x: 6, y: 15, potion: 2, text: '船を焼いたあの桟橋の下。網の陰に、包みが二つ。誰が置いたかは分からない。' },
  ],
  chests: [],
  shop: [
    { weapon: 'steelSword', price: 600 },
    { weapon: 'steelBow', price: 1000 },
    { weapon: 'shine', price: 900 },
    { weapon: 'physic', price: 1600 },
  ],
  reinforcements: [4, 8].flatMap((turn, w) =>
    [
      { x: 28, y: 1 },
      { x: 28, y: 18 },
      { x: 28, y: 6 },
      { x: 28, y: 12 },
    ].map((at, i) => ({
      turn,
      at,
      seed: {
        ...(i % 2 ? MOOK.soldier(18 + w) : MOOK.mercenary(18 + w)),
        id: `c18_w${w}_${i}`,
        x: at.x,
        y: at.y,
        ai: 'aggressive',
      } as Seed,
    })),
  ),
  events: [
    {
      turn: 4,
      script: CH18_SCRIPTS.recruit?.p_rolf,
      defect: 'p_rolf',
      log: 'ロルフ が仲間になった',
    },
    {
      turn: 6,
      // 第6章で討ち取っていたら来ない。見逃した者だけが来る
      unless: 'c6_boss',
      script: CH18_SCRIPTS.recruit?.p_aeryn,
      spawn: [
        {
          team: 'player',
          seed: {
            id: 'p_aeryn',
            name: 'エイリン',
            classId: 'falcoknight',
            level: 4,
            x: 4,
            y: 9,
            affinity: 'wind',
            stats: st(33, 13, 4, 16, 18, 9, 10, 12, 8, 8),
            growth: st(70, 45, 25, 60, 65, 40, 30, 45, 0, 0),
            weapons: ['steelLance', 'javelin'],
            wexp: { lance: 190 },
            potion: 1,
          },
        },
      ],
      log: 'エイリン が仲間になった',
    },
  ],
  scripts: CH18_SCRIPTS,
};
