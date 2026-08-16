// Shigeru — standing frame.
//
// Rebuilt on measurements taken off Ephraim's actual pixels, not off a memory
// of having looked at him. `node dump.mjs Bs_fe08_ephraim_lord_lance.png` in
// the scratchpad prints the reference as an indexed grid; these are the numbers
// that came out of it:
//
//   figure          31px          (the lance goes another 5px above that)
//   head             7px tall, 10px wide
//   visible face     1-3px of skin. That is not a typo.
//   neck             1px
//   torso           11px
//   legs            12px  — 40% of the figure
//   shadow           3 rows under the feet
//
// The face number is the one that matters. A head is a hair mass with two or
// three skin pixels at the front edge; drawing a readable face inside it makes
// the head look huge and the character look western, which is exactly what the
// earlier passes here did.

import { OUTLINE } from '../pixel.mjs';

export const PALETTE = {
  K: OUTLINE,
  h: '#33140e', // hair dark
  r: '#6a2818', // hair mid
  R: '#a8482a', // hair light
  s: '#c08050', // skin shadow
  S: '#f8c090', // skin
  b: '#103c90', // coat dark
  c: '#2a68d0', // coat mid
  C: '#58a4f0', // coat light
  w: '#a8dcf8', // coat highlight
  d: '#802018', // cape dark
  D: '#d03808', // cape bright
  g: '#f0b830', // gold
  M: '#8090b8', // steel dark
  W: '#d8e4f4', // steel light / blade
};

export const WIDTH = 40;

// prettier-ignore
export const ROWS = [
  '..........................KKK...........', //  0
  '.........................KWMK...........', //  1
  '.............KKKKK......KWMWK...........', //  2
  '............KhrRRrK.....KWMWK...........', //  3
  '...........KhrRRRrrK...KWMWK............', //  4
  '...........KhrRRKSSSK..KWMWK............', //  5
  '...........KhrrRKSKSK..KWMWK............', //  6
  '...........KhrrKsSSK..KWMWK.............', //  7
  '............KKrKSSK...KWMWK.............', //  8
  '..............KSK....KWMWK..............', //  9
  '.........KKKKKKgSgKKKKKgWK..............', // 10
  '........KdKMWcKgSgKcWMKSgK..............', // 11
  '........KdDKMcKgggKcMKKSSK..............', // 12
  '.......KddDKcwCCCcKccbKSSK..............', // 13
  '.......KdDDKcwCCCcKccbKKK...............', // 14
  '......KddDDKcwCCCcKccbK.................', // 15
  '......KdDDDKccCCCcKccbK.................', // 16
  '.....KddDDDKccCCccKcbbKK................', // 17
  '.....KdDDDDKccCcccKcbbKgK...............', // 18
  '....KddDDDDKKgggggggKKKgK...............', // 19
  '....KdDdDddKKcCccKcbbKKgMK..............', // 20
  '...KddDDdDddK.KwCcKcbbKKgMK.............', // 21
  '...KdDDdDdDdK.KwCcKKcbbK.KgMK...........', // 22
  '..KddDDdDdDdK.KwCcK.KcbbK.KgMK..........', // 23
  '..KdDDdDDdDdK.KwCcK.KcbbK.KgMK..........', // 24
  '.KddDDDdDDdDdKKwCcK.KcbbK..KgMK.........', // 25
  '.KdDDDdDDDdDdK.KKKK.KKKK..KgMK..........', // 26
  'KddDDDdDDDdDDdK.KwCcK.KcbbK.KgMK........', // 27
  'KdDDDDdDDDdDDdK.KwCcK.KcbbK.KgMK........', // 28
  'KdDDDdDDDdDDdK..KwCcK.KcbbK..KMK........', // 29
  'KKdDDDdDDdDdK...KwCcK.KcbbK..KKK........', // 30
  '.KKdDDdDdDdK....KwCcK.KcbbK.............', // 31
  '..KKdDdDddK....KKwCcKKKcbbK.............', // 32
  '...KKdDDDK....KKrRRRrKrRRRrK............', // 33
  '....KKKKK.....KrhhhhrKrhhhrK............', // 34
  '..............KKKKKKKKKKKKKK............', // 35
  '............KKKKKKKKKKKKKKKKKK..........', // 36
  '.............KKKKKKKKKKKKKKKK...........', // 37
  '........................................', // 38
  '........................................', // 39
];

export default { id: 'shigeru', width: WIDTH, palette: PALETTE, rows: ROWS };
