import { CH21_SCRIPTS } from '../../story/chapters/ch21';
import type { ChapterDef } from '../chapters';
import { MOOK, mooks, st } from './common';
import type { Seed } from '../roster';

/**
 * 第21章 禁足の地。**安全な床が禁足地しかない盤。**
 *
 * 森の芯へ向かって、灰（#）の中を石（H）伝いに進む。石の上は灰が来ないので
 * 立てるが、そこは全員が「立ってはならない」と教わって育った場所 ——
 * 盤の規則と、育ちの規則が正面からぶつかる。
 *
 * 中央の石を踏めば勝ち（`seize`）。番人はそこに立っていて、四百年、交代を
 * 待っている。
 *
 * specs/story/chapters/ch21.md
 */
const GROVE: Seed[] = [
  ...mooks('c21_r', MOOK.revenant(21), [
    { x: 8, y: 5 },
    { x: 21, y: 5 },
    { x: 6, y: 11 },
    { x: 23, y: 11 },
    { x: 9, y: 17 },
    { x: 20, y: 17 },
    { x: 14, y: 4 },
    { x: 12, y: 18 },
  ]),
  ...mooks('c21_g', MOOK.gargoyle(21), [
    { x: 4, y: 3 },
    { x: 25, y: 3 },
    { x: 4, y: 19 },
    { x: 25, y: 19 },
  ]),
  ...mooks('c21_o', { ...MOOK.knight(23), name: '古い甲冑' }, [
    { x: 12, y: 8, ai: 'guard' },
    { x: 17, y: 8, ai: 'guard' },
    { x: 12, y: 13, ai: 'guard' },
    { x: 17, y: 13, ai: 'guard' },
  ]),
  ...mooks('c21_s', MOOK.shaman(21), [
    { x: 7, y: 8, ai: 'guard' },
    { x: 22, y: 8, ai: 'guard' },
    { x: 7, y: 14, ai: 'guard' },
    { x: 22, y: 14, ai: 'guard' },
  ]),
  ...mooks('c21_b', MOOK.revenant(23), [
    { x: 11, y: 10 },
    { x: 18, y: 12 },
  ]),
];

/** 四百年、交代を待って立っている者。まだ喋れる */
const WARDEN: Seed = {
  id: 'c21_boss',
  name: '番人',
  classId: 'general',
  level: 18,
  x: 15,
  y: 10,
  affinity: 'dark',
  stats: st(58, 23, 0, 16, 11, 5, 23, 12, 19, 4),
  growth: st(90, 55, 0, 40, 25, 10, 55, 30, 0, 0),
  weapons: ['steelLance', 'javelin'],
  wexp: { lance: 300 },
  ai: 'boss',
  isBoss: true,
};

export const CH21: ChapterDef = {
  title: '第21章  「禁足の地」',
  // 森の芯。灰（#）の中に、苔の生えた石（H）が円く並んでいる。
  // 中央に平らな石（玉座）。石の上だけが灰の来ない床。
  map: [
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'w############################w',
    'w############################w',
    'w####f#################f#####w',
    'w#########HHHHHHHHHH#########w',
    'w########H##########H########w',
    'w#######H############H#######w',
    'w######H##HHHHHHHHHH##H######w',
    'w#####H##H##########H##H#####w',
    'w#####H##H###HHHH###H##H#####w',
    'w#####H##H###HTHH###H##H#####w',
    'w#####H##H###HHHH###H##H#####w',
    'w#####H##H##########H##H#####w',
    'w######H##HHHHHHHHHH##H######w',
    'w#######H############H#######w',
    'w########H##########H########w',
    'w#########HHHHHHHHHH#########w',
    'w####f#################f#####w',
    'w############################w',
    'w##############HH############w',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
  ],
  objective: { kind: 'seize', x: 14, y: 10, label: '中央の石に到達せよ' },
  deploy: 12,
  starts: [
    { x: 15, y: 19 },
    { x: 16, y: 19 },
    { x: 14, y: 18 },
    { x: 15, y: 18 },
    { x: 16, y: 18 },
    { x: 17, y: 18 },
    { x: 13, y: 18 },
    { x: 18, y: 18 },
    { x: 14, y: 17 },
    { x: 15, y: 17 },
    { x: 16, y: 17 },
    { x: 17, y: 17 },
    { x: 13, y: 17 },
  ],
  enemies: [...GROVE, WARDEN],
  villages: [],
  chests: [],
  shop: [],
  reinforcements: [3, 4, 5, 6, 7, 8].flatMap((turn, w) =>
    [
      { x: 1, y: 1 },
      { x: 28, y: 1 },
      { x: 15, y: 1 },
    ].map((at, i) => ({
      turn,
      at,
      seed: {
        ...(i === 2 ? MOOK.gargoyle(20 + Math.floor(w / 2)) : MOOK.revenant(20 + Math.floor(w / 2))),
        id: `c21_w${w}_${i}`,
        x: at.x,
        y: at.y,
        ai: 'aggressive',
      } as Seed,
    })),
  ),
  events: [
    {
      turn: 4,
      script: {
        id: 'ch21_t4',
        lines: [
          { text: '石の上に足を乗せた者から順に、削られるのが止まった。' },
          { speaker: 'アルド', who: 'p_ald', side: 'right', text: '……本当に止まりました。' },
          { speaker: 'ミレイユ', who: 'p_mirelle', side: 'right', text: 'はい。' },
          { speaker: 'ミレイユ', who: 'p_mirelle', side: 'right', text: '——十九年、この石に足を乗せてはいけないと教わってきました。' },
          {
            speaker: 'ミレイユ',
            who: 'p_mirelle',
            side: 'right',
            text: '乗せた理由が「そこしか安全でないから」というのは、たぶん、いちばん悪くない理由です。',
          },
        ],
      },
    },
  ],
  scripts: CH21_SCRIPTS,
};
