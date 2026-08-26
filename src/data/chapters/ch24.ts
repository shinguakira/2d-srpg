import { CH24_SCRIPTS } from '../../story/chapters/ch24';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks, st } from './common';
import type { Seed } from '../roster';

/**
 * 第24章 アレの崖。**盤で唯一、勝ち方が戦闘でない章。**
 *
 * **岬の岩山はただの岩山で、門でも通路でもない。** 抜くのはこの隊で、洞門に
 * なるのは抜いたあと。開くとか開かないという話ではなく、無いものを作る話。
 *
 * 目標は `breach` の二段。まず**見立て** —— 魔道書か杖を持つ者が岩の面（`R`）に
 * 三ターン立ち続けて石の筋を探す。降ろされれば 0 に戻る。次に**破石** ——
 * 岩の面とその両隣に立つ者の力を、自軍フェイズの終わりに足していく。200 で
 * 抜ける —— 腕のある三人で三ターン。
 *
 * つまり **player が勝ってきた駒だけでは抜けない。** 殴らずに来た者に射線の中で
 * 三ターン突っ立たせ、殴る者を前線から外して岩を叩かせる必要がある。
 *
 * **HUD に残りターンは出ない。道が後ろから減る。** 3ターン目から二ターンおきに
 * 南の二列が灰になり、その二ターン後に裂け目になって落ちる。二ターンの警告帯が
 * 常に見えているので、失うとしたら立ち止まったからで、それが正しい罰しかた。
 *
 * 敵は岬の側からしか来ない。**後ろから来るものは無い。後ろにあるのは地面。**
 *
 * specs/story/chapters/ch24.md
 */
const REARGUARD: Seed[] = [
  ...mooks('c24_s', MOOK.soldier(23), [
    { x: 23, y: 4 },
    { x: 22, y: 7 },
    { x: 21, y: 8 },
    { x: 19, y: 10 },
    { x: 16, y: 14 },
    { x: 13, y: 17 },
  ]),
  ...mooks('c24_k', MOOK.knight(23), [
    { x: 24, y: 6, ai: 'guard' },
    { x: 23, y: 6, ai: 'guard' },
    { x: 22, y: 5, ai: 'guard' },
  ]),
  ...mooks('c24_a', MOOK.archer(23), [
    { x: 26, y: 3, ai: 'guard' },
    { x: 21, y: 7, ai: 'guard' },
    { x: 18, y: 11, ai: 'guard' },
  ]),
  ...mooks('c24_m', MOOK.mercenary(23), [
    { x: 20, y: 9 },
    { x: 17, y: 12 },
    { x: 15, y: 15 },
  ]),
  ...mooks('c24_g', MOOK.gargoyle(23), [
    { x: 24, y: 3 },
    { x: 25, y: 2 },
    { x: 19, y: 9 },
  ]),
  ...mooks('c24_r', MOOK.revenant(24), [
    { x: 18, y: 13 },
    { x: 14, y: 16 },
    { x: 12, y: 18 },
  ]),
];

/** 勝てとは言われていない。遅らせろとだけ言われている */
const REAR_CAPTAIN: Seed = {
  id: 'c24_boss',
  name: '後衛隊長',
  classId: 'general',
  level: 20,
  x: 24,
  y: 5,
  affinity: 'ice',
  stats: st(60, 24, 0, 19, 14, 9, 24, 11, 20, 5),
  growth: st(90, 55, 0, 45, 35, 25, 55, 25, 0, 0),
  weapons: ['steelLance', 'javelin'],
  wexp: { lance: 310 },
  ai: 'boss',
  isBoss: true,
};

/**
 * 崖道。**盤の中でいちばん狭い。**
 *
 * 行ごとに「歩ける左端と右端」だけを持ち、そこから盤を組む。**左（西）が外海
 * （`o` —— 水辺と違って誰も入れない）、右（東）が岩壁。** アレもサーズも島の
 * 西岸なので、北へ歩けば海は左手にある。四マス幅の棚が南西から北東へ上がって
 * いき、突き当たりの岬で終わる。その先は岩で、道は無い。
 *
 * 手で 32×24 を書くとどこかで幅が狂うし、狂うとこの章は「広い野原」になる。
 * 道の形が章の主張そのものなので、形のほうを一次資料にする。
 */
const LEDGE: Record<number, [number, number]> = {
  2: [23, 27],
  3: [24, 27],
  4: [23, 26],
  5: [22, 25],
  6: [22, 25],
  7: [21, 24],
  8: [20, 23],
  9: [19, 22],
  10: [18, 21],
  11: [17, 20],
  12: [16, 19],
  13: [16, 19],
  14: [15, 18],
  15: [14, 17],
  16: [13, 16],
  17: [12, 15],
  18: [11, 14],
  19: [11, 14],
  20: [10, 13],
  21: [9, 12],
  22: [8, 11],
};

const ROAD: string[] = Array.from({ length: 24 }, (_, y) => {
  const seg = LEDGE[y];
  let row = '';
  for (let x = 0; x < 32; x++) {
    if (!seg) row += y < 6 ? 'w' : 'o';
    else if (x < seg[0]) row += 'o';
    else if (x > seg[1]) row += 'w';
    // 岬の先端。ここはただの岩で、抜けるのは掘ったあと
    else row += y === 4 && x === 25 ? 'R' : '_';
  }
  return row;
});

/** その行のうち歩ける場所だけ。岩壁と海を灰にしても意味が無い */
const walkable = (y: number) => [...ROAD[y]].flatMap((ch, x) => (ch === '_' ? [x] : []));

/**
 * 道が落ちる。**南から北へ、二ターンおきに二列ずつ。**
 *
 * 灰になった二ターン後に同じ列が裂け目になるので、盤の上には常に
 * 「もう危ない帯」と「まだ歩ける床」の境目が見えている。HUD の残りターン
 * 表示はこの章に無く、床の減りかたがそれの代わり。
 */
const FALLING: ChapterDef['events'] = [3, 5, 7, 9, 11, 13, 15].flatMap((turn, w) => {
  const ash = [22 - w * 2, 21 - w * 2].filter((y) => y >= 6);
  const rift = w > 0 ? [24 - w * 2, 23 - w * 2].filter((y) => y >= 6 && y <= 22) : [];
  const out: NonNullable<ChapterDef['events']> = [];
  if (ash.length) {
    out.push({
      turn,
      terrain: ash.flatMap((y) => walkable(y).map((x) => ({ x, y, ch: '#' }))),
      log: '後ろの道が灰になった',
    });
  }
  if (rift.length) {
    out.push({
      turn,
      terrain: rift.flatMap((y) => walkable(y).map((x) => ({ x, y, ch: 'x' }))),
      log: '灰になった区画が落ちた',
    });
  }
  return out;
});

export const CH24: ChapterDef = {
  title: '第24章  「アレの崖」',
  // 南（下）から北（上）へ登る崖道。左（西）が海、右（東）が岩壁。幅は三〜四マス。
  // 北の突き当たり、岬の先端が岩の面（R）。そこが取りつく場所で、門ではない。
  map: ROAD,
  objective: { kind: 'breach', x: 25, y: 4, seamTurns: 3, breakTotal: 200, label: '岩山を抜けよ' },
  deploy: 16,
  forced: ['p_shigeru'],
  starts: [
    { x: 11, y: 22 },
    { x: 10, y: 22 },
    { x: 9, y: 22 },
    { x: 8, y: 22 },
    { x: 12, y: 21 },
    { x: 11, y: 21 },
    { x: 10, y: 21 },
    { x: 9, y: 21 },
    { x: 13, y: 20 },
    { x: 12, y: 20 },
    { x: 11, y: 20 },
    { x: 10, y: 20 },
    { x: 14, y: 19 },
    { x: 13, y: 19 },
    { x: 12, y: 19 },
    { x: 11, y: 19 },
    { x: 14, y: 18 },
  ],
  enemies: [...REARGUARD, REAR_CAPTAIN],
  villages: [],
  chests: [],
  shop: [],
  // 岬の側からだけ。四回、五体ずつ、こちらが登った分だけ出てくる
  reinforcements: [
    { x: 25, y: 2, when: { x: 15, y: 16, r: 4 } },
    { x: 22, y: 6, when: { x: 18, y: 13, r: 4 } },
    { x: 20, y: 9, when: { x: 20, y: 10, r: 4 } },
    { x: 24, y: 4, when: { x: 23, y: 6, r: 3 } },
  ].flatMap((t, g) =>
    [0, 1, 2, 3, 4].map((i) => ({
      turn: 2,
      at: { x: t.x, y: t.y },
      when: t.when,
      seed: {
        ...(i === 4 ? MOOK.revenant(24) : i % 2 ? MOOK.soldier(23) : MOOK.mercenary(23)),
        id: `c24_t${g}_${i}`,
        x: t.x,
        y: t.y,
        ai: 'aggressive',
      } as Seed,
    })),
  ),
  events: [
    ...FALLING,
    {
      turn: 2,
      script: {
        id: 'ch24_t2',
        lines: [
          // 前口上で段取りは済んでいる。ここは仕事が始まっている場面
          { text: 'ガレスが鎚を担いで岩の前に出た。リゼットは岩に耳をつけている。' },
          { speaker: 'ガレス', who: 'p_gareth', side: 'left', text: 'おい学者。どこを叩けばいい。' },
          { speaker: 'リゼット', who: 'p_lisette', side: 'right', text: 'まだです。聞いています。' },
          { speaker: 'ガレス', who: 'p_gareth', side: 'left', text: '何が聞こえてる。' },
          { speaker: 'リゼット', who: 'p_lisette', side: 'right', text: '……厚いところと、薄いところの違いです。うまく言えません。' },
          { speaker: 'ガレス', who: 'p_gareth', side: 'left', text: '言わなくていい。当てろ。' },
        ],
      },
    },
    {
      turn: 6,
      script: {
        id: 'ch24_t6',
        lines: [
          { text: '南で音がした。振り返ると、朝に通った岩棚が無くなっていた。' },
          { speaker: 'リゼット', who: 'p_lisette', side: 'right', text: '……予定どおりです。' },
          { speaker: 'ヴィヴィアン', who: 'p_viviane', side: 'right', text: 'その言い方はやめて。' },
          { speaker: 'リゼット', who: 'p_lisette', side: 'right', text: '……はい。すみません。' },
        ],
      },
    },
  ],
  scripts: CH24_SCRIPTS,
};
