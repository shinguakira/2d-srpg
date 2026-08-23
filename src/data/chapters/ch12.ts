import { CH12_SCRIPTS } from '../../story/chapters/ch12';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks } from './common';
import type { Seed } from '../roster';

/**
 * 第12章 物言わぬ村。**夜と霧の章で、ボスがいない。**
 *
 * 盤はシンバ —— 焼けても壊れてもいない村で、家並みも井戸も畑も、十一章かけて
 * 守ってきた村とそっくりに組んである。違うのは、住人が全員屍兵なことだけ。
 *
 * 霧（`fog: 4`）が全部で、広さではなく見えないことが敵。砦と門に立つと二マス
 * 遠くまで見える —— 見張りに立つ、というのがそういう意味であってほしい。
 *
 * 増援は引き金式。村の奥へ踏み込むと出る。**交渉できる相手が盤にいない。**
 *
 * specs/story/chapters/ch12.md
 */
const VILLAGERS: Seed[] = [
  ...mooks('c12_r', MOOK.revenant(12), [
    { x: 8, y: 4 },
    { x: 13, y: 3 },
    { x: 18, y: 5 },
    { x: 6, y: 8 },
    { x: 12, y: 9 },
    { x: 17, y: 8 },
    { x: 21, y: 10 },
    { x: 9, y: 12 },
    { x: 15, y: 13 },
    { x: 20, y: 14 },
  ]),
  ...mooks('c12_g', MOOK.gargoyle(12), [
    { x: 4, y: 2 },
    { x: 22, y: 2 },
  ]),
  ...mooks('c12_s', MOOK.shaman(12), [
    { x: 11, y: 6, ai: 'guard' },
    { x: 16, y: 11, ai: 'guard' },
  ]),
];

/** 村の奥へ踏み込むと湧く。三か所、四体ずつ */
const TRIGGERS: ChapterDef['reinforcements'] = [
  { at: { x: 12, y: 2 }, r: 4 },
  { at: { x: 4, y: 12 }, r: 4 },
  { at: { x: 21, y: 13 }, r: 4 },
].flatMap((t, g) =>
  [0, 1, 2, 3].map((i) => ({
    turn: 2,
    at: { x: t.at.x, y: t.at.y },
    when: { x: t.at.x, y: t.at.y, r: t.r },
    seed: {
      ...(i % 2 ? MOOK.revenant(12) : MOOK.gargoyle(12)),
      id: `c12_t${g}_${i}`,
      x: t.at.x,
      y: t.at.y,
      ai: 'aggressive',
    } as Seed,
  })),
);

export const CH12: ChapterDef = {
  title: '第12章  「物言わぬ村」',
  // シンバ。畑（草）に囲まれた家並みで、真ん中に広場と井戸。壊れた家は一軒も
  // 無い —— 焼けた村を十一章ぶん見てきた player に、焼けていない村を見せる盤。
  map: [
    'wwwwwwwwwwwwwwwwwwwwwwwwww',
    'w,,,,,,,,,,,,,,,,,,,,,,,,w',
    'w,,VV,,,,,,VV,,,,,,,,VV,,w',
    'w,,,,,,bbbbbbbbbbbb,,,,,,w',
    'w,,,,,,b,,,,,,,,,,b,,,,,,w',
    'w,VV,,,b,,VV,,VV,,b,,,VV,w',
    'w,,,,,,b,,,,FF,,,,b,,,,,,w',
    'w,,,,bbb,,,,,,,,,,bbb,,,,w',
    'w,,,,b,,,,,,,,,,,,,,b,,,,w',
    'w,,,,b,,VV,,,,,,VV,,b,,,,w',
    'w,,,,b,,,,,,,,,,,,,,b,,,,w',
    'w,,,,bbb,,,,,,,,,,bbb,,,,w',
    'w,VV,,,b,,,,,,,,,,b,,,VV,w',
    'w,,,,,,b,,VV,,VV,,b,,,,,,w',
    'w,,,,,,bbbbbbbbbbbb,,,,,,w',
    'w,,,,,,,,,,,,,,,,,,,,,,,,w',
    'w,,,,,,,,,,bb,,,,,,,,,,,,w',
    'wwwwwwwwwwwwwwwwwwwwwwwwww',
  ],
  objective: { kind: 'survive', turns: 10, label: '夜明けまで持ちこたえよ（10ターン）' },
  deploy: 10,
  fog: 4,
  starts: [
    { x: 11, y: 16 },
    { x: 12, y: 16 },
    { x: 10, y: 16 },
    { x: 13, y: 16 },
    { x: 11, y: 15 },
    { x: 12, y: 15 },
    { x: 10, y: 15 },
    { x: 13, y: 15 },
    { x: 9, y: 15 },
    { x: 14, y: 15 },
    { x: 9, y: 16 },
  ],
  enemies: VILLAGERS,
  villages: [],
  chests: [],
  shop: [],
  reinforcements: TRIGGERS,
  events: [
    {
      turn: 4,
      script: {
        id: 'ch12_t4',
        lines: [
          { text: '広場の井戸で、桶が上がった。誰も引いていない。' },
          { speaker: 'フェン', who: 'p_fenn', side: 'right', text: '……なあ。あれ、癖でやってるんじゃないか。' },
          { speaker: 'ヨルン', who: 'p_jorn', side: 'right', text: 'そうだ。' },
          { speaker: 'フェン', who: 'p_fenn', side: 'right', text: 'そこは嘘ついてくれよ。' },
        ],
      },
    },
    {
      turn: 8,
      script: {
        id: 'ch12_t8',
        lines: [
          { speaker: 'ミレイユ', who: 'p_mirelle', side: 'right', text: '……百八十。百八十一。' },
          { speaker: 'ナディーン', who: 'p_nadine', side: 'right', text: 'ミレイユさん。少し休んで。声が。' },
          { speaker: 'ミレイユ', who: 'p_mirelle', side: 'right', text: '休むと、どこまで数えたか分からなくなります。' },
        ],
      },
    },
  ],
  scripts: CH12_SCRIPTS,
};
