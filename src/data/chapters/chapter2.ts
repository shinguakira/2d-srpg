import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const W: TerrainType = 'water';
const X: TerrainType = 'wall';
const T: TerrainType = 'fort';
const V: TerrainType = 'village';
const H: TerrainType = 'throne';

// 12 columns x 10 rows — a river crossing map with chokepoints
const terrain: TerrainType[][] = [
  //0  1  2  3  4  5  6  7  8  9  10 11
  [M, F, P, P, P, X, H, X, P, P, F, M], // row 0 — throne at (6,0)
  [F, P, P, F, P, P, P, P, P, F, P, F], // row 1
  [P, P, F, P, P, T, P, P, P, P, P, P], // row 2 — fort at (5,2)
  [P, P, P, P, W, W, W, W, P, P, V, P], // row 3 — river + village
  [P, F, P, P, W, P, P, W, P, P, P, P], // row 4 — river gap (bridge)
  [P, P, P, W, W, P, P, W, W, P, P, P], // row 5
  [P, P, F, P, P, P, P, P, P, F, P, P], // row 6
  [P, F, P, P, P, T, P, P, P, P, F, P], // row 7 — fort at (5,7)
  [F, P, P, P, F, P, P, P, F, P, P, F], // row 8
  [M, F, P, P, P, P, P, P, P, P, F, M], // row 9
];

export const CHAPTER_2: ChapterData = {
  id: 'ch2',
  name: 'Chapter 2: Escape',
  chapterNumber: 2,
  mapWidth: 12,
  mapHeight: 10,
  terrain,
  playerUnits: [
    { unitId: 'eirik', position: { x: 4, y: 8 } },
    { unitId: 'seth', position: { x: 6, y: 8 } },
    { unitId: 'lute', position: { x: 5, y: 9 } },
    { unitId: 'natasha', position: { x: 7, y: 9 } },
  ],
  enemyUnits: [
    { unitId: 'ch2_fighter_1', position: { x: 3, y: 5 } },
    { unitId: 'ch2_fighter_2', position: { x: 8, y: 5 } },
    { unitId: 'ch2_soldier_1', position: { x: 5, y: 3 } },
    { unitId: 'ch2_guard_1', position: { x: 5, y: 1 } },
    { unitId: 'ch2_guard_2', position: { x: 7, y: 1 } },
    { unitId: 'zonta', position: { x: 6, y: 0 } },
  ],
  objective: {
    type: 'seize',
    description: 'Seize the throne',
  },
  seizePosition: { x: 6, y: 0 },
  prologue: {
    lines: [
      { speaker: 'Narrator', text: 'Having escaped the castle, Eirik and her companions follow the road north toward Frelia.' },
      { speaker: 'Seth', text: 'Princess, enemy forces have set up a blockade at the river crossing ahead.', speakerFaction: 'player' },
      { speaker: 'Eirik', text: 'Then we have no choice but to break through. We cannot turn back now.', speakerFaction: 'player' },
      { speaker: 'Lute', text: 'The bridge is a natural chokepoint. We should use the terrain to our advantage.', speakerFaction: 'player' },
      { speaker: 'Natasha', text: 'I will do my best to keep everyone safe.', speakerFaction: 'player' },
    ],
  },
  epilogue: {
    lines: [
      { speaker: 'Eirik', text: 'We made it across. Frelia cannot be far now.', speakerFaction: 'player' },
      { speaker: 'Seth', text: 'We should rest at the next village. The soldiers need it.', speakerFaction: 'player' },
      { speaker: 'Narrator', text: 'The company presses on, drawing ever closer to the safety of Frelia.' },
    ],
  },
  villages: [
    {
      position: { x: 10, y: 3 },
      reward: {
        type: 'weapon',
        weaponId: 'javelin',
        dialogue: 'Take this javelin. It served my father well in the last war.',
        speaker: 'Old Soldier',
      },
    },
  ],
  reinforcements: [
    {
      turn: 6,
      units: [
        { unitId: 'ch2_reinforce_1', position: { x: 0, y: 0 } },
        { unitId: 'ch2_reinforce_2', position: { x: 11, y: 0 } },
      ],
      message: 'Enemy reinforcements arrive from the north!',
    },
  ],
};
