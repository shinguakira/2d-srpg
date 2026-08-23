import { CH24_SCRIPTS } from '../../story/chapters/ch24';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks, st } from './common';
import type { Seed } from '../roster';

/**
 * 第24章 アレの崖。**盤で唯一、勝ち方が戦闘でない章。**
 *
 * 目標は `breach` の二段。まず**解呪** —— 光魔法か杖の者が門のマスに三ターン
 * 立ち続ける。降ろされれば 0 に戻る。次に**破石** —— 門とその両隣に立つ者の
 * 力を、自軍フェイズの終わりに足していく。200 で開く —— 腕のある三人で三ターン。
 *
 * つまり **player が勝ってきた駒では解けない。** 支援役に射線の中で三ターン
 * 突っ立たせ、殴り役を前線から外して壁を叩かせる必要がある。
 *
 * **HUD に残りターンは出ない。道が後ろから減る。** 3ターン目から二ターンおきに
 * 南の二列が灰になり、その二ターン後に裂け目になって落ちる。二ターンの警告帯が
 * 常に見えているので、失うとしたら立ち止まったからで、それが正しい罰しかた。
 *
 * 敵は門の側からしか来ない。**後ろから来るものは無い。後ろにあるのは地面。**
 *
 * specs/story/chapters/ch24.md
 */
const REARGUARD: Seed[] = [
  ...mooks('c24_s', MOOK.soldier(23), [
    { x: 8, y: 4 },
    { x: 9, y: 7 },
    { x: 10, y: 8 },
    { x: 12, y: 10 },
    { x: 15, y: 14 },
    { x: 18, y: 17 },
  ]),
  ...mooks('c24_k', MOOK.knight(23), [
    { x: 7, y: 6, ai: 'guard' },
    { x: 8, y: 6, ai: 'guard' },
    { x: 9, y: 5, ai: 'guard' },
  ]),
  ...mooks('c24_a', MOOK.archer(23), [
    { x: 5, y: 3, ai: 'guard' },
    { x: 10, y: 7, ai: 'guard' },
    { x: 13, y: 11, ai: 'guard' },
  ]),
  ...mooks('c24_m', MOOK.mercenary(23), [
    { x: 11, y: 9 },
    { x: 14, y: 12 },
    { x: 16, y: 15 },
  ]),
  ...mooks('c24_g', MOOK.gargoyle(23), [
    { x: 7, y: 3 },
    { x: 6, y: 2 },
    { x: 12, y: 9 },
  ]),
  ...mooks('c24_r', MOOK.revenant(24), [
    { x: 13, y: 13 },
    { x: 17, y: 16 },
    { x: 19, y: 18 },
  ]),
];

/** 勝てとは言われていない。遅らせろとだけ言われている */
const REAR_CAPTAIN: Seed = {
  id: 'c24_boss',
  name: '後衛隊長',
  classId: 'general',
  level: 20,
  x: 7,
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
 * 行ごとに「歩ける左端と右端」だけを持ち、そこから盤を組む。左は岩壁、右は
 * 外海（`o` —— 水辺と違って誰も入れない）。四マス幅の棚が南東から北西へ
 * 上がっていき、突き当たりの岬に洞門がある。
 *
 * 手で 32×24 を書くとどこかで幅が狂うし、狂うとこの章は「広い野原」になる。
 * 道の形が章の主張そのものなので、形のほうを一次資料にする。
 */
const LEDGE: Record<number, [number, number]> = {
  2: [4, 8],
  3: [4, 7],
  4: [5, 8],
  5: [6, 9],
  6: [6, 9],
  7: [7, 10],
  8: [8, 11],
  9: [9, 12],
  10: [10, 13],
  11: [11, 14],
  12: [12, 15],
  13: [12, 15],
  14: [13, 16],
  15: [14, 17],
  16: [15, 18],
  17: [16, 19],
  18: [17, 20],
  19: [17, 20],
  20: [18, 21],
  21: [19, 22],
  22: [20, 23],
};

const ROAD: string[] = Array.from({ length: 24 }, (_, y) => {
  const seg = LEDGE[y];
  let row = '';
  for (let x = 0; x < 32; x++) {
    if (!seg) row += y < 6 ? 'w' : 'o';
    else if (x < seg[0]) row += 'w';
    else if (x > seg[1]) row += 'o';
    // 岬の先端。洞門は岩に彫られている
    else row += y === 4 && x === 6 ? 'G' : '_';
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
  // 南（下）から北（上）へ登る崖道。左が岩壁、右が海。幅は三〜四マス。
  // 北の突き当たり、岬の先端に石の洞門（G）。そこが目標のマス。
  map: ROAD,
  objective: { kind: 'breach', x: 6, y: 4, wardTurns: 3, breakTotal: 200, label: '石の洞門を開け' },
  deploy: 16,
  forced: ['p_shigeru'],
  starts: [
    { x: 20, y: 22 },
    { x: 21, y: 22 },
    { x: 22, y: 22 },
    { x: 23, y: 22 },
    { x: 19, y: 21 },
    { x: 20, y: 21 },
    { x: 21, y: 21 },
    { x: 22, y: 21 },
    { x: 18, y: 20 },
    { x: 19, y: 20 },
    { x: 20, y: 20 },
    { x: 21, y: 20 },
    { x: 17, y: 19 },
    { x: 18, y: 19 },
    { x: 19, y: 19 },
    { x: 20, y: 19 },
    { x: 17, y: 18 },
  ],
  enemies: [...REARGUARD, REAR_CAPTAIN],
  villages: [],
  chests: [],
  shop: [],
  // 門の側からだけ。四回、五体ずつ、こちらが登った分だけ出てくる
  reinforcements: [
    { x: 6, y: 2, when: { x: 16, y: 16, r: 4 } },
    { x: 9, y: 6, when: { x: 13, y: 13, r: 4 } },
    { x: 11, y: 9, when: { x: 11, y: 10, r: 4 } },
    { x: 7, y: 4, when: { x: 8, y: 6, r: 3 } },
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
          { speaker: 'ミレイユ', who: 'p_mirelle', side: 'right', text: '……三ターン、私が門の上にいます。降ろされたら、また一からです。' },
          { speaker: 'アルド', who: 'p_ald', side: 'right', text: '私が替わりに立てます。二人いれば、どちらかは立っていられる。' },
          { speaker: 'ガレス', who: 'p_gareth', side: 'left', text: 'で、そのあいだ壁を殴るのは誰だ。' },
          { speaker: 'シゲル', who: 'p_shigeru', side: 'left', text: 'お前だ。' },
          { speaker: 'ガレス', who: 'p_gareth', side: 'left', text: '……二十四章かかったな、その台詞。' },
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
