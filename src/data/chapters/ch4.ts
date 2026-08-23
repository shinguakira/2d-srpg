import { CH4_SCRIPTS } from '../../story/chapters/ch4';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks, st } from './common';
import type { Seed } from '../roster';

/**
 * 第4章 スザ岬。**倉庫が三棟。あれが町の冬。**
 *
 * 制圧の章だが、敵を殺し切っても倉庫は戻らない。三棟は盤の三方に散らしてあり、
 * 隊を割らないと届かない。ブラスクは玉座から降りてくるので、正面の圧力と
 * 三方の救援を同時にやることになる。
 *
 * specs/story/chapters/ch4.md
 */
const RAIDERS: Seed[] = [
  ...mooks('c4_r', MOOK.brigand(6), [
    { x: 4, y: 12 },
    { x: 17, y: 12 },
    { x: 6, y: 12 },
    { x: 3, y: 8 },
    { x: 18, y: 8 },
  ]),
  ...mooks('c4_m', MOOK.mercenary(6), [
    { x: 8, y: 9 },
    { x: 13, y: 9 },
  ]),
  ...mooks('c4_a', MOOK.archer(5), [
    { x: 6, y: 5, ai: 'guard' },
    { x: 14, y: 5, ai: 'guard' },
  ]),
  ...mooks('c4_s', MOOK.soldier(6), [{ x: 10, y: 4, ai: 'guard' }]),
];

const BRASK: Seed = {
  id: 'c4_boss',
  name: 'ブラスク',
  classId: 'fighter',
  level: 9,
  x: 10,
  y: 1,
  affinity: 'thunder',
  stats: st(34, 12, 0, 8, 7, 3, 7, 1, 14, 5),
  growth: st(85, 55, 0, 40, 35, 20, 30, 10, 0, 0),
  weapons: ['steelAxe', 'handAxe'],
  wexp: { axe: 130 },
  // 玉座に座らない。**降りてくる**のがこのボスの仕掛けで、
  // 倉庫を守りに散った隊の背中を突きに来る
  ai: 'aggressive',
  isBoss: true,
};

export const CH4: ChapterDef = {
  title: '第4章  「スザ岬」',
  // 北端に館、その手前が町。館へは中央の門と、東西の路地の三方から入れる。
  // 宝箱は扉の向こうの物置で、鍵を割かないと開かない —— 倉庫を守りに走るのと
  // どちらを取るか、というのがこの盤の問いかけ。
  map: [
    'wwwwwwwwwwwwwwwwwwwwww',
    'ww..,,ff..T..ff,,...ww',
    'w.,.wwwwwwGwwww,,..,.w',
    'w..fwCD.S.b.S.DCw,f..w',
    'w,..w..bbbbbbb..w..,.w',
    'w.f.wV.b.....b.Vw.f..w',
    'w...wwbbw...wbbww....w',
    'w.,..,b,,,,,,,b,..,,.w',
    'w..f.,b,.fVf.,b,.f...w',
    'w,...,bbbbbbbbb,....,w',
    'w.f..,,b,,,,,b,,..f..w',
    'w....s,b,,,,,b,,s....w',
    'w.,.ss,bbbbbbb,ss..,.w',
    'wss~~ss,,,,,,,ss~~ss.w',
    'w~~~~~~~~ss~~~~~~~~~~w',
    'wwwwwwwwwwwwwwwwwwwwww',
  ],
  objective: { kind: 'seize', x: 10, y: 1, label: '玉座の制圧' },
  deploy: 7,
  starts: [
    { x: 9, y: 12 },
    { x: 10, y: 12 },
    { x: 11, y: 12 },
    { x: 8, y: 12 },
    { x: 12, y: 12 },
    { x: 9, y: 13 },
    { x: 11, y: 13 },
    { x: 10, y: 13 },
  ],
  enemies: [...RAIDERS, BRASK],
  // 「倉庫」は村として置いてある。訪ねる＝守り切る
  villages: [
    { x: 5, y: 5, potion: 3, text: '西の倉です。麦は無事でした。……あなた方が来なければ、今ごろ灰でした。' },
    { x: 15, y: 5, weapon: 'steelSword', text: '東の倉です。番人の剣を持って行ってください。もう振る者がいない。' },
    { x: 10, y: 8, weapon: 'physic', text: '南の倉です。町の薬をここに集めてありました。遠くから傷を診る杖を、どうぞ。' },
  ],
  chests: [
    { x: 5, y: 3, gold: 2500 },
    { x: 15, y: 3, weapon: 'silenceStaff' },
  ],
  shop: [
    { weapon: 'ironSword', price: 460 },
    { weapon: 'steelLance', price: 480 },
    { weapon: 'handAxe', price: 300 },
    { weapon: 'steelBow', price: 560 },
    { weapon: 'thunder', price: 700 },
    { weapon: 'mend', price: 800 },
  ],
  // 波止場から二度。倉庫へ走らせるので、盤の下から湧く
  reinforcements: [
    { turn: 3, at: { x: 9, y: 14 }, seed: { ...MOOK.brigand(6), id: 'c4_w1', x: 9, y: 14, ai: 'aggressive' } as Seed },
    { turn: 3, at: { x: 10, y: 14 }, seed: { ...MOOK.mercenary(6), id: 'c4_w2', x: 10, y: 14, ai: 'aggressive' } as Seed },
    { turn: 6, at: { x: 9, y: 14 }, seed: { ...MOOK.brigand(7), id: 'c4_w3', x: 9, y: 14, ai: 'aggressive' } as Seed },
    { turn: 6, at: { x: 10, y: 14 }, seed: { ...MOOK.brigand(7), id: 'c4_w4', x: 10, y: 14, ai: 'aggressive' } as Seed },
  ],
  events: [
    {
      turn: 3,
      script: CH4_SCRIPTS.recruit?.p_fenn,
      spawn: [
        {
          team: 'player',
          seed: {
            id: 'p_fenn',
            name: 'フェン',
            classId: 'thief',
            level: 3,
            x: 10,
            y: 11,
            affinity: 'wind',
            stats: st(18, 5, 0, 11, 13, 7, 3, 1, 5, 6),
            growth: st(60, 35, 0, 60, 70, 45, 15, 20, 0, 0),
            weapons: ['ironSword'],
            wexp: { sword: 20 },
            keys: 4,
            potion: 1,
          },
        },
      ],
      log: 'フェン が仲間になった',
    },
  ],
  scripts: CH4_SCRIPTS,
};
