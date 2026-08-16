// Akira — mounted, standing frame.
//
// Construction read off Murray (Bs_fe08_murray_cavalier_lance.png, 64x47) as a
// grid of palette indices rather than glanced at:
//
//   rider head   rows 0-6, at the very top of the canvas
//   rider torso  ~10px wide — it does not flare, the horse is underneath it
//   horse head   a separate 12x8 mass, level with the rider's chest, joined to
//                the chest by a neck that rises. Drawn continuous with the
//                barrel it comes out a hippo.
//   legs         front pair set forward of the back pair, 12px
//   shadow       3 rows under the hooves
//
// Brief: white hair and glasses, so no helmet — a helmet hides both and they
// are the character. A cuirass over a teal surcoat rather than full plate.

import { OUTLINE } from '../pixel.mjs';

export const PALETTE = {
  K: OUTLINE,
  h: '#1d242c', // darkest — mane, tail, deep shadow
  w: '#c8d2de', // white hair, shaded
  W: '#f4f8ff', // white hair lit / steel highlight
  s: '#c08050', // skin shadow
  S: '#f8c090', // skin
  t: '#123f38', // teal dark
  T: '#1d7563', // teal mid
  U: '#33ab96', // teal light
  M: '#75849a', // steel dark
  N: '#b9c6d8', // steel mid
  b: '#4e3220', // hide dark
  B: '#835530', // hide mid
  C: '#b57c47', // hide light
  g: '#8fd8ec', // lens
};

export const WIDTH = 56;

// prettier-ignore
export const ROWS = [
  '...............KKKKK.........K..........................', //  0
  '..............KwwWWwK.......KWK.........................', //  1
  '.............KwwWWWwwK......KNK.........................', //  2
  '.............KwwWWWwKSSK....KNK.........................', //  3
  '.............KwwWWKSgKSK....KNK.........................', //  4
  '.............KwwKKKSKSSK....KNK.........................', //  5
  '..............KwK.KsSSSK....KNK.........................', //  6
  '...............K...KKSSK....KNK.........................', //  7
  '.............KKKKKKKSKKKK...KNK.........................', //  8
  '............KMNNKtTTTgKNNMK.KNK.........................', //  9
  '............KMNKtTTTTTTgKNMKKNK......Kh.................', // 10
  '............KMKtTNNNNNNTtKMKKNK.....KhKKKKKK............', // 11
  '............KKtTNNNNNNNNTtKSKNK......KhBCCCCK...........', // 12
  '.............KtTNNNNNNNNTtKSKNK......KhBCCCCCK..........', // 13
  '.............KtTNNNNNNNNTtKMKNK.......KBCCCChCK.........', // 14
  '.............KtTTNNNNNNTTtK.KNK.......KKBCCCCCCK........', // 15
  '.............KtTTTTTTTTTTtK.KNK.....KhBCKBCCCCCCK.......', // 16
  '.............KtTTTTTTTTTTtK.KNK....KhBCCCKBCCCCCK.......', // 17
  '.............KKtTTTTTTTTtKK.KNK..KhBCCCCCBKBbCCCK.......', // 18
  '.........KKKKKKtTTTTTTTTtKKKKNKKhBCCCCCBK..KhbCCK.......', // 19
  '..........KbBCCKtTTTTTTtKCCCKNKhBCCCCCBK....KhBK........', // 20
  '..KhbK...KbBCCCCKtTTTTTtKCCCKNKCCCCCCBK.................', // 21
  '.KhbbK..KbBCCCCCCCCCCCKtTTKCKNKCK.......................', // 22
  '.KhbbK.KbBCCCCCCCCCCCCCKtTTKKNKCK.......................', // 23
  '.KhbbKKbBCCCCCCCCCCCCCCCKtTTKNKCK.......................', // 24
  '..KhbKbBCCCCCCCCCCCCCCCCKMNNKNKCK.......................', // 25
  '..KhKKbBCCCCCCCCCCCCCCCCKMNNKKKCK.......................', // 26
  '......KbBCCCCCCCCCCCCCCCKhBBKCCCK.......................', // 27
  '.......KbBCCCCCCCCCCCCCCCCCCCCCCK.......................', // 28
  '..........KbBCCCCCCCCCCCCCCCCCK.........................', // 29
  '.............KbBCCCCCCCCCCCCK...........................', // 30
  '................KbBCCCCCCCK.............................', // 31
  '.......KbBBBKBBBBBBBBBKBBBBKKBBBK.......................', // 32
  '.......KbBBBK.........KBBBBKKBBBK.......................', // 33
  '.......KbBBBK.........KBBBBKKBBBK.......................', // 34
  '.......KbBBBK.........KBBBBKKBBBK.......................', // 35
  '.......KbBBBK.........KBBBBKKBBBK.......................', // 36
  '.......KbBBBK.........KBBBBKKBBBK.......................', // 37
  '.......KbBBBK.........KBBBBKKBBBK.......................', // 38
  '.......KbBBBK.........KBBBBKKBBBK.......................', // 39
  '.......KbBBBK.........KBBBBKKBBBK.......................', // 40
  '.......KhbBBhK........KhBBBhKhBBhK......................', // 41
  '.......KhhhhhK........KhhhhhKhhhhK......................', // 42
  '.......KKKKKKK........KKKKKKKKKKKK......................', // 43
  '.....KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK.....................', // 44
  '......KKKKKKKKKKKKKKKKKKKKKKKKKKKK......................', // 45
];

export default { id: 'akira', width: WIDTH, palette: PALETTE, rows: ROWS };
