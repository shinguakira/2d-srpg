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
  '.............KKKKK......................', //  0
  '............KhrRRrK.....................', //  1
  '...........KhrRRRrrK............KKW.....', //  2
  '...........KhrRRKSSSK..........KWMWK....', //  3
  '...........KhrrRKSKSK.........KWMWK.....', //  4
  '...........KhrrKsSSK.........KWMWK......', //  5
  '............KKrKSSK.........KWMWK.......', //  6
  '..............KSSK.........KWMWK........', //  7
  '.........KKKKKKgSgKKKKK...KWMWK.........', //  8
  '........KdKMWcKgSgKcWMKKK.KWMK..........', //  9
  '........KdDKMcKgggKcMKccKKWMK...........', // 10
  '.......KddDKcwCCCcKccbKcSKgWK...........', // 11
  '.......KdDDKcwCCCcKccbKKSSggK...........', // 12
  '......KddDDKcwCCCcKccbK.KSSgK...........', // 13
  '......KdDDDKccCCCcKccbK..KKKK...........', // 14
  '.....KddDDDKccCCccKcbbK.................', // 15
  '.....KdDDDDKccCcccKcbbK.................', // 16
  '....KddDDDDKKgggggggKKK.................', // 17
  '....KdDDDDDKKcCccKcbbKK.................', // 18
  '...KddDDDDDK.KcCcKcbbK..................', // 19
  '...KdDDDDDDK.KcCKKcbbK..................', // 20
  '..KddDDDDDK.KKcCK.KcbbK.................', // 21
  '..KdDDDDDK..KcCcK.KcbbK.................', // 22
  '..KddDDDK...KcCcK.KcbbK.................', // 23
  '..KdDDDK....KKKKK.KKcbbK................', // 24
  '..KdDDK.....KbcbK..KcbbK................', // 25
  '..KKDKK.....KbcbK..KcbbK................', // 26
  '...KKK......KbcbK..KcbbK................', // 27
  '............KKbcbKKKcbbK................', // 28
  '...........KKrRRRrKKrRRRrK..............', // 29
  '...........KrhhhhrK.KrhhhrK.............', // 30
  '...........KKKKKKKK.KKKKKKK.............', // 31
  '..........KKKKKKKKKKKKKKKKKK............', // 32
  '...........KKKKKKKK.KKKKKKK.............', // 33
  '........................................', // 34
];

export default { id: 'shigeru', width: WIDTH, palette: PALETTE, rows: ROWS };
