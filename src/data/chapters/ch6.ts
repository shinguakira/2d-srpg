import { CH6_SCRIPTS } from '../../story/chapters/ch6';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks, st } from './common';
import type { Seed } from '../roster';

/**
 * 第6章 ケシュの港。**水路が盤を縦に割っていて、渡り方が兵科で違う。**
 *
 * 東の海と湾を分ける水路。橋は中央の一本きりで、**騎馬はそこしか通れない**。
 * 歩兵は浅瀬を渡れるが三倍かかり、渡っている最中は的になる。飛行は水路が
 * 無いのと同じ。
 *
 * エイリンの翼隊はそれを分かって、詰まった歩兵の後ろへ回ってくる。一度でも
 * 後衛を空から潰されれば、弓をどこに置くべきかが分かる。
 *
 * 目標は制圧ではなく**エイリン撃破**。殺し切る必要はない。
 *
 * specs/story/chapters/ch6.md
 */
const PATROL: Seed[] = [
  ...mooks('c6_s', MOOK.soldier(8), [
    { x: 13, y: 4, ai: 'guard' },
    { x: 14, y: 6, ai: 'guard' },
    { x: 13, y: 10, ai: 'guard' },
    { x: 14, y: 12, ai: 'guard' },
  ]),
  ...mooks('c6_a', MOOK.archer(8), [
    { x: 16, y: 3 },
    { x: 16, y: 13 },
    { x: 18, y: 8 },
  ]),
  ...mooks('c6_g', MOOK.gargoyle(8), [
    { x: 20, y: 5 },
    { x: 20, y: 11 },
    { x: 21, y: 8 },
  ]),
  ...mooks('c6_m', MOOK.mercenary(9), [
    { x: 17, y: 6 },
    { x: 17, y: 10 },
  ]),
  ...mooks('c6_k', MOOK.knight(9), [{ x: 19, y: 8, ai: 'guard' }]),
];

const AERYN: Seed = {
  id: 'c6_boss',
  name: 'エイリン',
  classId: 'pegasus',
  level: 12,
  x: 21,
  y: 7,
  affinity: 'wind',
  stats: st(32, 12, 3, 15, 17, 8, 9, 11, 8, 8),
  growth: st(70, 50, 20, 60, 70, 45, 30, 50, 0, 0),
  weapons: ['steelLance', 'javelin'],
  wexp: { lance: 180 },
  ai: 'aggressive',
  isBoss: true,
};

export const CH6: ChapterDef = {
  title: '第6章  「ケシュの港」',
  map: [
    'wwwwwwwwwwwwwwwwwwwwwwww',
    'w.,,f...,,~~,,....,,f,.w',
    'w,..,,f.,,~~,,.f..,,..,w',
    'wf.V..,,.,~~,..,,C.,,f.w',
    'w..,,..bb,~~,bb,,..,,..w',
    'w,,f..bb,,~~,,bb..f.,,,w',
    'w..,,bb,,,~~,,,bb,,..,.w',
    'wS.,bb,,,,GG,,,,bb,.,.Sw',
    'w..,,bb,,,~~,,,bb,,..,.w',
    'w,,f..bb,,~~,,bb..f.,,,w',
    'w..,,..bb,~~,bb,,..,,..w',
    'wf.V..,,.,~~,..,,C.,,f.w',
    'w,..,,f.,,~~,,.f..,,..,w',
    'w.,,f...,,~~,,....,,f,.w',
    'w,,,,f,,,,~~,,,,,f,,,,,w',
    'wwwwwwwwwwwwwwwwwwwwwwww',
  ],
  objective: { kind: 'boss', label: 'エイリンの撃破' },
  deploy: 8,
  starts: [
    { x: 3, y: 7 },
    { x: 3, y: 6 },
    { x: 3, y: 8 },
    { x: 2, y: 7 },
    { x: 4, y: 6 },
    { x: 4, y: 8 },
    { x: 2, y: 6 },
    { x: 2, y: 8 },
    { x: 4, y: 7 },
  ],
  enemies: [...PATROL, AERYN],
  villages: [
    { x: 3, y: 3, weapon: 'steelBow', text: '弓を。あの翼どもは、こちらの屋根の上を素通りしていきます。' },
    { x: 3, y: 11, potion: 3, text: '船はもう出せません。薬なら余っています。持って行ってください。' },
  ],
  chests: [
    { x: 17, y: 3, weapon: 'sleepStaff' },
    { x: 17, y: 11, gold: 3500 },
  ],
  shop: [
    { weapon: 'steelSword', price: 600 },
    { weapon: 'steelLance', price: 480 },
    { weapon: 'steelBow', price: 560 },
    { weapon: 'javelin', price: 400 },
    { weapon: 'thunder', price: 700 },
    { weapon: 'physic', price: 1400 },
  ],
  // 海岸道から重騎兵。橋の手前で背中を取りに来る
  reinforcements: [
    { turn: 3, at: { x: 22, y: 1 }, seed: { ...MOOK.cavalier(9), id: 'c6_w1', x: 22, y: 1, ai: 'aggressive' } as Seed },
    { turn: 3, at: { x: 22, y: 14 }, seed: { ...MOOK.cavalier(9), id: 'c6_w2', x: 22, y: 14, ai: 'aggressive' } as Seed },
    { turn: 3, at: { x: 22, y: 8 }, seed: { ...MOOK.gargoyle(9), id: 'c6_w3', x: 22, y: 8, ai: 'aggressive' } as Seed },
    { turn: 6, at: { x: 22, y: 1 }, seed: { ...MOOK.cavalier(10), id: 'c6_w4', x: 22, y: 1, ai: 'aggressive' } as Seed },
    { turn: 6, at: { x: 22, y: 14 }, seed: { ...MOOK.cavalier(10), id: 'c6_w5', x: 22, y: 14, ai: 'aggressive' } as Seed },
    { turn: 6, at: { x: 22, y: 8 }, seed: { ...MOOK.gargoyle(10), id: 'c6_w6', x: 22, y: 8, ai: 'aggressive' } as Seed },
  ],
  events: [
    {
      turn: 4,
      script: {
        id: 'ch6_nadine',
        lines: [
          { speaker: 'ジェイガン', who: 'p_akira', side: 'right', text: '……あれは。戦の最中に、クロガネの兵を診ている。' },
          { speaker: 'ジェイガン', who: 'p_akira', side: 'right', text: '殿下、あれは向こうの者ですか。' },
          { speaker: 'ミレイユ', who: 'p_mirelle', side: 'right', text: 'あの人は、痛いほうの側です。私はその側を知っています。' },
          {
            speaker: 'ナディーヌ',
            who: 'p_nadine',
            side: 'right',
            text: 'どちらの血も同じ色でしたよ。——手が足りていないでしょう。混ぜてください。',
          },
        ],
      },
      spawn: [
        {
          team: 'player',
          seed: {
            id: 'p_nadine',
            name: 'ナディーヌ',
            classId: 'troubadour',
            level: 3,
            x: 6,
            y: 7,
            affinity: 'light',
            stats: st(17, 1, 6, 6, 9, 8, 3, 8, 5, 7),
            growth: st(50, 10, 50, 40, 55, 55, 15, 55, 0, 0),
            weapons: ['heal', 'physic'],
            wexp: { staff: 110 },
            potion: 2,
          },
        },
      ],
      log: 'ナディーヌ が仲間になった',
    },
  ],
  scripts: CH6_SCRIPTS,
};
