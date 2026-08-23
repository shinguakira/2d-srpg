import { CH8_SCRIPTS } from '../../story/chapters/ch8';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks, st } from './common';
import type { Seed } from '../roster';

/**
 * 第8章 ヤタンの最後の抵抗。**ハルヴァルは、プレイヤーが何をしても死ぬ。**
 *
 * 4ターン目に自軍の手を離れて南の廊下へ行き（`toNpc`）、13ターン目に倒れる
 * （`kill`）。戦闘の結果ではないので、回復も救出も届かない —— 届かない場所を
 * 選んだ、というのがこの章の内容そのもの。
 *
 * 廊下は幅一マス。増援は4〜9ターン、南門と東壁の二方から毎ターン。玉座は北。
 * 「全部で上へ、廊下に一人」という彼の献策どおりに盤が組んである。
 *
 * specs/story/chapters/ch8.md
 */
const HOLD: Seed[] = [
  ...mooks('c8_k', MOOK.knight(11), [
    { x: 10, y: 3, ai: 'guard' },
    { x: 15, y: 3, ai: 'guard' },
    { x: 12, y: 5, ai: 'guard' },
    { x: 13, y: 5, ai: 'guard' },
  ]),
  ...mooks('c8_c', MOOK.cavalier(10), [
    { x: 6, y: 8 },
    { x: 19, y: 8 },
    { x: 8, y: 10 },
    { x: 17, y: 10 },
  ]),
  ...mooks('c8_m', MOOK.shaman(10), [
    { x: 11, y: 7, ai: 'guard' },
    { x: 14, y: 7, ai: 'guard' },
  ]),
  ...mooks('c8_a', MOOK.archer(10), [
    { x: 4, y: 5 },
    { x: 21, y: 5 },
  ]),
  ...mooks('c8_s', MOOK.soldier(10), [
    { x: 12, y: 13, ai: 'guard' },
    { x: 13, y: 13, ai: 'guard' },
    { x: 11, y: 12, ai: 'guard' },
  ]),
];

const WULFRAM: Seed = {
  id: 'c8_boss',
  name: 'ウルフラム',
  classId: 'general',
  level: 13,
  x: 12,
  y: 1,
  affinity: 'dark',
  stats: st(44, 16, 0, 12, 7, 6, 16, 7, 16, 4),
  growth: st(90, 60, 0, 45, 25, 25, 55, 20, 0, 0),
  weapons: ['steelLance', 'javelin'],
  wexp: { lance: 200 },
  ai: 'boss',
  isBoss: true,
};

/** 4〜9ターン、南門と東壁から毎ターン三体 */
const WAVES: ChapterDef['reinforcements'] = [4, 5, 6, 7, 8, 9].flatMap((turn, w) => [
  { turn, at: { x: 12, y: 17 }, seed: { ...MOOK.soldier(10), id: `c8_ws${w}`, x: 12, y: 17, ai: 'aggressive' } as Seed },
  { turn, at: { x: 22, y: 8 }, seed: { ...MOOK.cavalier(10), id: `c8_we${w}`, x: 22, y: 8, ai: 'aggressive' } as Seed },
  { turn, at: { x: 22, y: 12 }, seed: { ...MOOK.mercenary(10), id: `c8_wm${w}`, x: 22, y: 12, ai: 'aggressive' } as Seed },
]);

export const CH8: ChapterDef = {
  title: '第8章  「ヤタンの最後の抵抗」',
  // 北に玉座、南に幅一マスの廊下。廊下の口に砦が一つ ——
  // ハルヴァルが九ターン立つのはそこ。
  map: [
    'wwwwwwwwwwwwwwwwwwwwwwww',
    'ww__________T__________w',
    'ww_____________________w',
    'ww____C_________C______w',
    'wwwwwww_wwww_wwww_wwwwww',
    'w______________________w',
    'w______________________w',
    'w______________________w',
    'w______________________w',
    'wwwww_wwwwww_wwwww_wwwww',
    'w______________________w',
    'w______________________w',
    'w______________________w',
    'wwwwwwwwwww_F_wwwwwwwwww',
    'wwwwwwwwwww___wwwwwwwwww',
    'wwwwwwwwwww___wwwwwwwwww',
    'wwwwwwwwwww___wwwwwwwwww',
    'wwwwwwwwwwG__Gwwwwwwwwww',
    'wwwwwwwwwwwwwwwwwwwwwwww',
  ],
  objective: { kind: 'seize', x: 12, y: 1, label: '玉座の制圧' },
  deploy: 8,
  // 廊下に立つ者が居なければ、この章は成立しない
  forced: ['p_halvar'],
  starts: [
    { x: 12, y: 16 },
    { x: 11, y: 16 },
    { x: 13, y: 16 },
    { x: 12, y: 15 },
    { x: 11, y: 15 },
    { x: 13, y: 15 },
    { x: 12, y: 14 },
    { x: 11, y: 14 },
    { x: 13, y: 14 },
  ],
  enemies: [...HOLD, WULFRAM],
  villages: [],
  chests: [
    { x: 6, y: 3, weapon: 'horseslayer' },
    { x: 16, y: 3, gold: 4000 },
  ],
  shop: [],
  reinforcements: WAVES,
  events: [
    {
      turn: 4,
      toNpc: 'p_halvar',
      script: {
        id: 'ch8_t4',
        lines: [
          {
            speaker: 'ハルヴァル',
            who: 'p_halvar',
            side: 'right',
            text: '……申し訳ありません殿下。これから命令に背きます。癖になってきました。',
          },
          {
            speaker: 'ハルヴァル',
            who: 'p_halvar',
            side: 'right',
            text: '十一年、人に言われて壁に立っていました。これは、自分で選びます。',
          },
          {
            speaker: 'ハルヴァル',
            who: 'p_halvar',
            side: 'right',
            text: 'タケシに伝えてください。第二城壁隊の軍曹が一人、あなたを信じるのをやめた、と。',
          },
          { text: 'ハルヴァルは南の廊下へ降りていった。もう手は届かない。' },
        ],
      },
      log: 'ハルヴァル が命令を破り、南の廊下へ向かった',
    },
    {
      turn: 7,
      script: {
        id: 'ch8_t7',
        lines: [{ text: '下から、槍を構え直す音が、何度も、何度も聞こえてくる。' }],
      },
    },
    {
      turn: 11,
      script: {
        id: 'ch8_t11',
        lines: [{ text: '音の間隔が、少しずつ長くなってきた。' }],
      },
    },
    {
      turn: 13,
      kill: 'p_halvar',
      script: {
        id: 'ch8_t13',
        lines: [
          { text: '槍がもう一度上がった。前より、ゆっくりと。' },
          { text: 'そして、降りてこなかった。' },
          { speaker: 'ハルヴァル', who: 'p_halvar', side: 'left', text: '……持ち場、確保……' },
          { text: 'ミレイユが駆け出そうとして、コルウィンがガレスに目で合図した。ガレスが押さえた。' },
          { text: 'その夜、南の廊下から上がってきたものは何も無かった。' },
          { text: '一人を越えるのに一個中隊が一晩かかり、その頃には玉座はもう落ちていた。' },
        ],
      },
      log: 'ハルヴァル は倒れた。九ターン、持たせた',
    },
  ],
  scripts: CH8_SCRIPTS,
};
