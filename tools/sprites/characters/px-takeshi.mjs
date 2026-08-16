// Takeshi — standing frame.
//
// Scale off Dozla (Bs_fe08_dozla_berserker_axe.png, 32x57): a heavy class runs
// broader than a lord and its weapon carries well above the head — Dozla's axe
// takes fifteen of his fifty-seven rows. Same 15-colour budget and #282828
// outline as the others, used inside the silhouette as well as around it.
//
// He is written as polite, patient and certain, never mad, so nothing here is
// jagged: square shoulders, weight even, the axe shouldered rather than raised.
// The only bright thing on him is the ember through the burns on his forearms
// and the seam of the breastplate.

import { OUTLINE } from '../pixel.mjs';

export const PALETTE = {
  K: OUTLINE,
  h: '#12161f', // deepest shadow
  i: '#1e2230', // iron darkest
  n: '#39415a', // iron mid
  N: '#5d6a8a', // iron light
  s: '#b07a4c', // skin shadow
  S: '#e8b07c', // skin
  u: '#3a2028', // burnt arm dark
  U: '#6a3a30', // burnt arm mid
  e: '#d85018', // ember
  E: '#ffb038', // ember hot
  M: '#6d7a92', // axe steel dark
  W: '#dde6f6', // axe steel light
  c: '#2a1a24', // cloth
  g: '#b89040', // tarnished gold
};

export const WIDTH = 44;

// prettier-ignore
export const ROWS = [
  '............................KKKKKK..........', //  0
  '..........................KKMWWWWMK.........', //  1
  '.........................KMWWWWWWWMK........', //  2
  '.................KKKKKK.KMWWWWWWWWMK........', //  3
  '................KsSSSSSKKMWWWWWWWMK.........', //  4
  '................KSSSSSSKKMWWWWWWMK..........', //  5
  '................KSSKSSSK.KMWWWWMK...........', //  6
  '................KsSSSSSK..KMWWMK............', //  7
  '.................KsSSSK...KMMMK.............', //  8
  '..................KSSK....KMMK..............', //  9
  '...........KKKKKKKKSKKKKKKMMK...............', // 10
  '..........KnNNKcgggggcKNNnKMK...............', // 11
  '.........KnNNKciiiiiiicKNNnKK...............', // 12
  '.........KnNKciiiEEiiiicKNnK................', // 13
  '.........KnKciiiiEEiiiiicKnK................', // 14
  '........KnKUiiiiiEEiiiiiiUKnK...............', // 15
  '........KnKUUiiiiEEiiiiiUUKnK...............', // 16
  '........KUUeUiiiiEEiiiiUeUUK................', // 17
  '........KUUUUiiiiiiiiiiUUUUK................', // 18
  '........KUUeUUiiiiiiiiUUeUUK................', // 19
  '.........KUUUUiiiiiiiiUUUUK.................', // 20
  '.........KUUUKggggggggKUUUK.................', // 21
  '..........KKKKcciiiiccKKKK..................', // 22
  '............KcciiiiiiccK....................', // 23
  '............KcciiKKiiccK....................', // 24
  '...........KcciiK.KiiccK....................', // 25
  '...........KcciiK.KiiccK....................', // 26
  '...........KcciiK.KiiccK....................', // 27
  '...........KcciiK.KiiccK....................', // 28
  '...........KKciiK.KiicKK....................', // 29
  '............KciiK.KiicK.....................', // 30
  '............KciiK.KiicK.....................', // 31
  '............KciiK.KiicK.....................', // 32
  '............KciiK.KiicK.....................', // 33
  '...........KKciiKKKiicKK....................', // 34
  '...........KnNNnKKnNNnK.....................', // 35
  '...........KnNNnK.KnNNnK....................', // 36
  '...........KhnnhK.KhnnhK....................', // 37
  '...........KKKKKK.KKKKKK....................', // 38
  '.........KKKKKKKKKKKKKKKK...................', // 39
  '..........KKKKKKKKKKKKKK....................', // 40
  '............................................', // 41
  '............................................', // 42
  '............................................', // 43
];

export default { id: 'takeshi', width: WIDTH, palette: PALETTE, rows: ROWS };
