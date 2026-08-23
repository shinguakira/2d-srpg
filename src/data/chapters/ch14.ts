import { CH14_SCRIPTS } from '../../story/chapters/ch14';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks, st } from './common';
import type { Seed } from '../roster';

/**
 * 第14章 岬の社。**守る章で、守る相手が味方ではなく他人。**
 *
 * 岬の地形 —— 浜は砂（重い）、社へ上がる道は崖の細い段。騎兵が罰される盤に
 * してあるので、ここまで置物にしてきた歩兵と魔道士で戦うことになる。
 *
 * アルドは味方 NPC として境内に立つ。彼が倒れたら負け。八ターン保てば勝ちで、
 * **敵を殺し切っても終わらない** —— 守るというのはそういうこと。
 *
 * 加入は第15章から（`joinsAt: 14`）。この章の彼は、まだこちらの人間ではない。
 *
 * specs/story/chapters/ch14.md
 */
const COLUMN: Seed[] = [
  ...mooks('c14_s', MOOK.soldier(14), [
    { x: 6, y: 17 },
    { x: 9, y: 18 },
    { x: 14, y: 18 },
    { x: 18, y: 17 },
    { x: 20, y: 16 },
  ]),
  ...mooks('c14_m', MOOK.mercenary(14), [
    { x: 8, y: 15 },
    { x: 11, y: 16 },
    { x: 17, y: 15 },
  ]),
  ...mooks('c14_a', MOOK.archer(14), [
    { x: 4, y: 16, ai: 'guard' },
    { x: 21, y: 18, ai: 'guard' },
    { x: 11, y: 18, ai: 'guard' },
  ]),
  ...mooks('c14_k', MOOK.knight(15), [
    { x: 10, y: 14 },
    { x: 15, y: 14 },
  ]),
  ...mooks('c14_h', MOOK.shaman(14), [
    { x: 6, y: 13, ai: 'guard' },
    { x: 19, y: 13, ai: 'guard' },
  ]),
  ...mooks('c14_c', MOOK.cavalier(14), [
    { x: 3, y: 18 },
    { x: 23, y: 16 },
  ]),
];

/** 焼くより安く買おうとした男。理由は伺わないのが職分 */
const KEVE: Seed = {
  id: 'c14_boss',
  name: 'ケーヴェ',
  classId: 'paladin',
  level: 6,
  x: 12,
  y: 16,
  affinity: 'ice',
  stats: st(41, 17, 0, 15, 13, 7, 14, 8, 13, 8),
  growth: st(80, 50, 0, 45, 40, 25, 40, 20, 0, 0),
  weapons: ['steelLance', 'javelin'],
  wexp: { lance: 230 },
  ai: 'boss',
  isBoss: true,
};

/** 社の守り手。動かず、来た者だけを打ち返す */
const ALD_WARDEN: Seed = {
  id: 'p_ald',
  name: 'アルド',
  classId: 'monk',
  level: 2,
  x: 12,
  y: 3,
  affinity: 'fire',
  stats: st(18, 1, 6, 7, 7, 4, 3, 6, 5, 0),
  growth: st(55, 10, 55, 50, 50, 30, 20, 50, 0, 0),
  weapons: ['lightning'],
  wexp: { light: 35 },
};

export const CH14: ChapterDef = {
  title: '第14章  「岬の社」',
  // 北の高いところに社（H の境内と、火の立つ玉座）。そこへ上がる道は
  // 東西二本の崖段だけで、下は砂浜。騎兵は砂で二倍、崖段は一マス幅。
  map: [
    'wwwwwwwwwwwwwwwwwwwwwwwwww',
    'w^^^^^^^^^^^HHH^^^^^^^^^^w',
    'w^^^^^^^^^^HHHHH^^^^^^^^^w',
    'w^^^^^^^^^HHHTHHH^^^^^^^^w',
    'w^^^^^^^^^HHHHHHH^^^^^^^^w',
    'w^^^^h^^^^HHHHHHH^^^^h^^^w',
    'w^^^hh^^^^^HHbHH^^^^^hh^^w',
    'w^^^h,,^^^^^,b,^^^^^,,h^^w',
    'w^^hh,,,^^^^,b,^^^^,,,hh^w',
    'w^^h,,,,,,,,,b,,,,,,,,,h^w',
    'w^^,,,,,,,,,,b,,,,,,,,,,^w',
    'w^,,,,f,,,,,,b,,,,,,f,,,,w',
    'w,,,,,,,,,,,,b,,,,,,,,,,,w',
    'w,,,,,,,,,,,,b,,,,,,,,,,,w',
    'wsss,,,,,,,,,b,,,,,,,,sssw',
    'wsssss,,,,,,,b,,,,,,sssssw',
    'wssssssssssssbsssssssssssw',
    'wssssssssssssssssssssssssw',
    'wssssssssssssssssssssssssw',
    'wssssssssssssssssssssssssw',
  ],
  objective: { kind: 'survive', turns: 8, guard: ['p_ald'], label: '社の境内を守り抜け（8ターン）' },
  deploy: 11,
  starts: [
    { x: 13, y: 7 },
    { x: 12, y: 8 },
    { x: 13, y: 8 },
    { x: 14, y: 8 },
    { x: 11, y: 9 },
    { x: 13, y: 9 },
    { x: 15, y: 9 },
    { x: 10, y: 9 },
    { x: 16, y: 9 },
    { x: 12, y: 10 },
    { x: 14, y: 10 },
    { x: 9, y: 10 },
  ],
  enemies: [...COLUMN, KEVE],
  allies: [ALD_WARDEN],
  villages: [],
  chests: [],
  shop: [
    { weapon: 'shine', price: 900 },
    { weapon: 'lightning', price: 600 },
    { weapon: 'mend', price: 800 },
    { weapon: 'physic', price: 1600 },
  ],
  reinforcements: [4, 5, 6, 7, 8].flatMap((turn, w) =>
    [
      { x: 1, y: 19 },
      { x: 12, y: 19 },
      { x: 24, y: 19 },
    ].map((at, i) => ({
      turn,
      at,
      seed: {
        ...(i === 1 ? MOOK.mercenary(13 + w) : MOOK.soldier(13 + w)),
        id: `c14_w${w}_${i}`,
        x: at.x,
        y: at.y,
        ai: 'aggressive',
      } as Seed,
    })),
  ),
  events: [
    {
      turn: 5,
      script: CH14_SCRIPTS.recruit?.p_ald,
    },
    {
      turn: 7,
      script: {
        id: 'ch14_t7',
        lines: [
          { text: '境内の外で、砂が灰色になっていた。鳥居の柱のところで、線を引いたように止まっている。' },
          { speaker: 'リゼット', who: 'p_lisette', side: 'right', text: '……止まっています。柱の内側に一寸も入っていません。' },
          { speaker: 'ミレイユ', who: 'p_mirelle', side: 'right', text: 'はい。神域ですから。' },
          { speaker: 'リゼット', who: 'p_lisette', side: 'right', text: '「ですから」で済ませないでください。それは規則です。使えます。' },
        ],
      },
    },
  ],
  scripts: CH14_SCRIPTS,
};
