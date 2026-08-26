import { CH24_SCRIPTS } from '../../story/chapters/ch24';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks, st } from './common';
import type { Seed } from '../roster';

/**
 * 第24章 アレの崖。**盤で唯一、勝ち方が戦闘でない章。**
 *
 * **始まった時点で、もう行き止まりに着いている。** 崖道の北の突き当たり、山の背が
 * 海へ落ちているところ。隊はそこに背中をつけて出撃する。前口上で岩を抜くと決めた
 * あとの場面なので、盤は「決めたことをやる」ところから始まる。
 *
 * **敵は後ろから来る。追われている形。** 奥に大将が座っていて、そこまで突破する章
 * ではない —— **この章にボスは居ない。** 追ってきた後衛が南の道を上がってきて、
 * こちらは岩に張りついたまま押される。
 *
 * 目標は `breach` の三段。まず**見立て** —— 魔道書か杖を持つ者が岩の面（`R`）に
 * 三ターン立ち続けて石の筋を探す。降ろされれば 0 に戻る。次に**破石** —— 岩の面と
 * その両隣に立つ者の力を、自軍フェイズの終わりに足していく。200 で穴が通る。
 * そして**通り抜ける** —— 開いた穴の向こう、北の口（`exit`）にシゲルが立ったとき、
 * はじめて章が終わる。**壊すことが目標ではない。抜けることが目標。**
 *
 * つまり **player が勝ってきた駒だけでは抜けない。** 殴らずに来た者を追手の射線の
 * 中に三ターン突っ立たせ、殴る者を防衛線から外して岩を叩かせる必要がある。
 *
 * **HUD に残りターンは出ない。道が後ろから減る。** 3ターン目から二ターンおきに南の
 * 二列が灰になり、その二ターン後に裂け目になって落ちる。追手も同じ道の上にいるので、
 * 崩れは後ろから彼らを押し上げてくる。逃げ場が無いのは両方。
 *
 * specs/story/chapters/ch24.md
 */

/**
 * 崖道。**盤の中でいちばん狭い。**
 *
 * 行ごとに「歩ける左端と右端」だけを持ち、そこから盤を組む。**左（西）が外海
 * （`o` —— 水辺と違って誰も入れない）、右（東）が岩壁。** アレもサーズも島の西岸
 * なので、北へ歩けば海は左手にある。四マス幅の棚が南西から北東へ上がっていき、
 * 4 行目で終わる。その北は山の背 —— 道は無い。
 *
 * 手で 32×24 を書くとどこかで幅が狂うし、狂うとこの章は「広い野原」になる。
 * 道の形が章の主張そのものなので、形のほうを一次資料にする。
 */
const LEDGE: Record<number, [number, number]> = {
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
    // 道の北（0〜3 行）は山の背そのもの。南の端（23 行）はもう海
    if (!seg) row += y < 6 ? 'w' : 'o';
    else if (x < seg[0]) row += 'o';
    else if (x > seg[1]) row += 'w';
    // 突き当たりの岩。ただの岩で、抜けるのは掘ったあと
    else row += y === 4 && x === 25 ? 'R' : '_';
  }
  return row;
});

/**
 * 追ってきた後衛。**全員こちらへ来る。守って待つ者は一人も置かない。**
 *
 * 立っているのは 11 行より南、つまり隊の後ろ。追いつかれるまでの数ターンが、
 * 石の目を読む三ターンにちょうど足りない —— それがこの章の全部。
 */
const PURSUIT: Seed[] = [
  ...mooks('c24_k', MOOK.knight(23), [
    { x: 18, y: 11 },
    { x: 19, y: 11 },
    { x: 20, y: 11 },
  ]),
  ...mooks('c24_g', MOOK.gargoyle(23), [
    { x: 17, y: 11 },
    { x: 19, y: 12 },
    { x: 17, y: 13 },
  ]),
  ...mooks('c24_s', MOOK.soldier(23), [
    { x: 16, y: 12 },
    { x: 18, y: 13 },
    { x: 15, y: 14 },
    { x: 16, y: 15 },
    { x: 13, y: 16 },
    { x: 12, y: 18 },
  ]),
  ...mooks('c24_a', MOOK.archer(23), [
    { x: 17, y: 12 },
    { x: 14, y: 15 },
    { x: 11, y: 18 },
  ]),
  ...mooks('c24_m', MOOK.mercenary(23), [
    { x: 16, y: 13 },
    { x: 17, y: 14 },
    { x: 15, y: 16 },
  ]),
  ...mooks('c24_r', MOOK.revenant(24), [
    { x: 12, y: 17 },
    { x: 11, y: 19 },
    { x: 13, y: 19 },
  ]),
];

/**
 * 追手の頭。**ボスではない。** 玉座に座らないし、倒しても岩は退かない。
 *
 * 勝てとは言われていない。遅らせろとだけ言われていて、本人がそう言う。
 * 無視して掘り続けるのが正解になりうる敵で、この章にはそれで足りる。
 */
const REAR_CAPTAIN: Seed = {
  // id は顔グラと死に際（script.ts）の鍵。ボスをやめても人物は同じ
  id: 'c24_boss',
  name: '後衛隊長',
  classId: 'general',
  level: 20,
  x: 12,
  y: 19,
  affinity: 'ice',
  stats: st(60, 24, 0, 19, 14, 9, 24, 11, 20, 5),
  growth: st(90, 55, 0, 45, 35, 25, 55, 25, 0, 0),
  weapons: ['steelLance', 'javelin'],
  wexp: { lance: 310 },
  ai: 'aggressive',
};

/** その行のうち歩ける場所だけ。岩壁と海を灰にしても意味が無い */
const walkable = (y: number) => [...ROAD[y]].flatMap((ch, x) => (ch === '_' ? [x] : []));

/**
 * 道が落ちる。**南から北へ、二ターンおきに二列ずつ。**
 *
 * 灰になった二ターン後に同じ列が裂け目になるので、盤の上には常に「もう危ない帯」と
 * 「まだ歩ける床」の境目が見えている。HUD の残りターン表示はこの章に無く、床の
 * 減りかたがそれの代わり。**追手も同じ床の上にいる。**
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

/**
 * 追いついてくる分。**南の、そのターンにまだ立っている床から湧く。**
 *
 * 崩れが北へ上がってくるので、湧く場所も一緒に上がってくる。増援というより、
 * 後ろから押し出されてくる人間の列。
 */
const CHASE = [
  { turn: 2, x: 9, y: 22 },
  { turn: 4, x: 11, y: 20 },
  { turn: 6, x: 12, y: 18 },
  { turn: 8, x: 14, y: 16 },
  { turn: 10, x: 15, y: 14 },
  { turn: 12, x: 17, y: 12 },
];

export const CH24: ChapterDef = {
  title: '第24章  「アレの崖」',
  // 南（下）から北（上）へ登ってきた崖道の、その北の端。左（西）が海、右（東）が
  // 岩壁。突き当たりが岩の面（R）で、その先の北の口（25,1）まで掘って抜ける。
  map: ROAD,
  objective: {
    kind: 'breach',
    x: 25,
    y: 4,
    seamTurns: 3,
    breakTotal: 200,
    exit: { x: 25, y: 1 },
    label: '岩を抜いて北へ出よ',
  },
  deploy: 16,
  forced: ['p_shigeru'],
  // 行き止まりに背中をつけて始まる。岩の面（25,4）は空けてある
  starts: [
    { x: 23, y: 4 },
    { x: 24, y: 4 },
    { x: 26, y: 4 },
    { x: 22, y: 5 },
    { x: 23, y: 5 },
    { x: 24, y: 5 },
    { x: 25, y: 5 },
    { x: 22, y: 6 },
    { x: 23, y: 6 },
    { x: 24, y: 6 },
    { x: 25, y: 6 },
    { x: 21, y: 7 },
    { x: 22, y: 7 },
    { x: 23, y: 7 },
    { x: 24, y: 7 },
    { x: 20, y: 8 },
    { x: 21, y: 8 },
  ],
  enemies: [...PURSUIT, REAR_CAPTAIN],
  villages: [],
  chests: [],
  shop: [],
  reinforcements: CHASE.flatMap((w, g) =>
    [0, 1, 2].map((i) => ({
      turn: w.turn,
      at: { x: w.x, y: w.y },
      seed: {
        ...(i === 2 ? MOOK.revenant(24) : i ? MOOK.soldier(23) : MOOK.mercenary(23)),
        id: `c24_p${g}_${i}`,
        x: w.x,
        y: w.y,
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
      turn: 4,
      script: {
        id: 'ch24_t4',
        lines: [
          // 追手の頭が名乗る。ここが唯一この男の喋る場面で、盤の上では
          // ただの敵。倒す必要はなく、倒しても岩は退かない
          { text: '南の道に旗が見えた。数えるだけ無駄なほど、後ろから続いていた。' },
          { speaker: '後衛隊長', who: 'c24_boss', side: 'right', text: '——通さん、とは言わん。' },
          { speaker: 'シゲル', who: 'p_shigeru', side: 'left', text: 'では何だ。' },
          { speaker: '後衛隊長', who: 'c24_boss', side: 'right', text: '遅らせる。それだけを命じられている。' },
          { speaker: '後衛隊長', who: 'c24_boss', side: 'right', text: '陛下はお前たちを死なせる必要がない。疲れさせればいい。' },
          { speaker: '後衛隊長', who: 'c24_boss', side: 'right', text: '違いがある。明日、分かる。' },
          { speaker: 'ガレス', who: 'p_gareth', side: 'left', text: '——おい。あいつ、こっちが岩を掘ってるのを見て笑ってるぞ。' },
          { speaker: 'シゲル', who: 'p_shigeru', side: 'left', text: '笑わせておけ。手を止めるな。' },
        ],
      },
    },
    {
      turn: 6,
      script: {
        id: 'ch24_t6',
        lines: [
          { text: '南で音がした。朝に通った岩棚が、追ってきた列ごと無くなっていた。' },
          { speaker: 'リゼット', who: 'p_lisette', side: 'right', text: '……予定どおりです。' },
          { speaker: 'ヴィヴィアン', who: 'p_viviane', side: 'right', text: 'その言い方はやめて。' },
          { speaker: 'リゼット', who: 'p_lisette', side: 'right', text: '……はい。すみません。' },
        ],
      },
    },
  ],
  scripts: CH24_SCRIPTS,
};
