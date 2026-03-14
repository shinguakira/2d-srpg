import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const X: TerrainType = 'wall';
const T: TerrainType = 'fort';
const V: TerrainType = 'village';
const H: TerrainType = 'throne';

// 16 columns x 10 rows — ancient dungeon/ruins with wall corridors
const terrain: TerrainType[][] = [
  //0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
  [X, X, X, X, F, X, X, H, X, X, F, X, X, X, X, X], // row 0 — throne at (7,0)
  [X, P, P, X, P, P, P, P, P, P, P, X, P, P, P, X], // row 1
  [X, P, P, X, P, X, X, P, X, X, P, X, P, P, P, X], // row 2
  [X, P, P, P, P, X, P, P, P, X, P, P, P, X, P, X], // row 3
  [X, X, X, P, X, X, P, T, P, X, X, P, X, X, P, X], // row 4 — fort at (7,4)
  [X, P, P, P, P, P, P, P, P, P, P, P, P, P, P, X], // row 5 — main east-west corridor
  [X, P, X, X, P, X, P, P, P, X, P, X, X, P, V, X], // row 6 — village at (14,6)
  [X, P, P, P, P, X, P, T, P, X, P, P, P, P, P, X], // row 7 — fort at (7,7)
  [X, X, P, P, P, P, P, P, P, P, P, P, P, X, P, X], // row 8
  [M, X, X, F, P, P, P, P, P, P, P, F, X, X, P, M], // row 9 — entrance
];

export const CHAPTER_4: ChapterData = {
  id: 'ch4',
  name: 'Chapter 4: Ancient Horrors',
  chapterNumber: 4,
  mapWidth: 16,
  mapHeight: 10,
  terrain,
  playerUnits: [
    { unitId: 'eirik', position: { x: 6, y: 9 } },
    { unitId: 'seth', position: { x: 8, y: 9 } },
    { unitId: 'lute', position: { x: 5, y: 9 } },
    { unitId: 'natasha', position: { x: 9, y: 9 } },
  ],
  enemyUnits: [
    { unitId: 'ch4_soldier_1', position: { x: 3, y: 7 } },
    { unitId: 'ch4_soldier_2', position: { x: 12, y: 7 } },
    { unitId: 'ch4_soldier_3', position: { x: 13, y: 5 } },  // extra — corridor blocker
    { unitId: 'ch4_fighter_1', position: { x: 7, y: 5 } },
    { unitId: 'ch4_fighter_2', position: { x: 2, y: 5 } },
    { unitId: 'ch4_fighter_3', position: { x: 11, y: 3 } },  // extra — ambush position
    { unitId: 'ch4_mage_1', position: { x: 10, y: 3 } },
    { unitId: 'ch4_mage_2', position: { x: 4, y: 3 } },
    { unitId: 'ch4_guard_1', position: { x: 7, y: 4 } },     // on fort
    { unitId: 'ch4_guard_2', position: { x: 4, y: 1 } },
    { unitId: 'ch4_boss', position: { x: 7, y: 0 } },        // boss on throne
  ],
  objective: {
    type: 'seize',
    description: 'Seize the throne',
  },
  seizePosition: { x: 7, y: 0 },
  prologue: {
    lines: [
      { speaker: 'Narrator', text: 'North of Borgo, the ancient ruins loom before Eirik\'s company. Strange sounds echo from within.' },
      { speaker: 'Eirik', text: 'These ruins... something feels wrong. The air itself seems hostile.', speakerFaction: 'player' },
      { speaker: 'Seth', text: 'Stay alert. The villagers spoke of monsters dwelling within these walls.', speakerFaction: 'player' },
      { speaker: 'Lute', text: 'Fascinating. These ruins predate the founding of Renais. The magical residue here is immense.', speakerFaction: 'player' },
      { speaker: 'Natasha', text: 'I sense a dark presence deep inside. We must be careful.', speakerFaction: 'player' },
      { speaker: 'Eirik', text: 'We press forward. If Grado seeks something in these ruins, we must reach it first.', speakerFaction: 'player' },
      { speaker: 'Narrator', text: 'The company enters the ancient temple, weapons drawn against the horrors that lurk within.' },
    ],
  },
  epilogue: {
    lines: [
      { speaker: 'Eirik', text: 'It\'s over. Whatever dark power animated those creatures has been dispelled.', speakerFaction: 'player' },
      { speaker: 'Lute', text: 'The magical energy here has dissipated. These ruins are inert now.', speakerFaction: 'player' },
      { speaker: 'Seth', text: 'Princess, we should not linger. The road to Frelia lies just beyond these mountains.', speakerFaction: 'player' },
      { speaker: 'Natasha', text: 'I\'m glad we could put those poor souls to rest.', speakerFaction: 'player' },
      { speaker: 'Narrator', text: 'Having braved the ancient horrors, Eirik\'s company emerges from the ruins. The borders of Frelia draw near, and with them, the promise of sanctuary.' },
    ],
  },
  villages: [
    {
      position: { x: 14, y: 6 },
      reward: {
        type: 'weapon',
        weaponId: 'silver_sword',
        dialogue: 'This blade was sealed within the ruins long ago. Its edge has not dulled with time.',
        speaker: 'Spirit Guardian',
      },
    },
  ],
  reinforcements: [
    {
      turn: 4,
      units: [
        { unitId: 'ch4_reinforce_1', position: { x: 4, y: 9 } },
        { unitId: 'ch4_reinforce_2', position: { x: 10, y: 9 } },
        { unitId: 'ch4_reinforce_3', position: { x: 14, y: 8 } },
      ],
      message: 'More creatures stir from the depths of the ruins!',
    },
  ],
};
