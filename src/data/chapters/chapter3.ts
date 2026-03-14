import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const W: TerrainType = 'water';
const T: TerrainType = 'fort';
const V: TerrainType = 'village';

// 14 columns x 12 rows — bandit-infested village with dense forest ambush zones
const terrain: TerrainType[][] = [
  //0  1  2  3  4  5  6  7  8  9  10 11 12 13
  [M, M, F, F, P, P, P, P, P, P, F, F, M, M], // row 0
  [M, F, P, P, P, F, P, P, F, P, P, P, F, M], // row 1
  [F, P, P, V, P, P, P, P, P, P, V, P, P, F], // row 2 — villages at (3,2) and (10,2)
  [P, P, F, F, P, P, T, P, P, F, F, P, P, P], // row 3 — fort at (6,3)
  [P, W, P, F, P, P, P, P, P, F, P, P, P, P], // row 4 — pond
  [P, W, P, P, P, F, T, F, P, P, P, F, P, P], // row 5 — fort at (6,5), boss position
  [P, P, P, F, P, P, P, P, P, F, P, P, P, P], // row 6
  [P, P, F, P, P, P, P, P, P, P, F, P, P, P], // row 7
  [P, P, P, P, F, P, P, P, F, P, P, P, P, P], // row 8
  [F, P, P, P, P, P, P, P, P, P, P, P, P, F], // row 9
  [M, F, P, P, P, P, P, P, P, P, P, P, F, M], // row 10
  [M, M, F, P, P, P, P, P, P, P, P, F, M, M], // row 11
];

export const CHAPTER_3: ChapterData = {
  id: 'ch3',
  name: 'Chapter 3: The Bandits of Borgo',
  chapterNumber: 3,
  mapWidth: 14,
  mapHeight: 12,
  terrain,
  playerUnits: [
    { unitId: 'eirik', position: { x: 5, y: 10 } },
    { unitId: 'seth', position: { x: 7, y: 10 } },
    { unitId: 'lute', position: { x: 6, y: 11 } },
    { unitId: 'natasha', position: { x: 8, y: 11 } },
  ],
  enemyUnits: [
    { unitId: 'ch3_fighter_1', position: { x: 5, y: 5 } },
    { unitId: 'ch3_fighter_2', position: { x: 8, y: 6 } },
    { unitId: 'ch3_fighter_3', position: { x: 3, y: 3 } },
    { unitId: 'ch3_soldier_1', position: { x: 9, y: 3 } },
    { unitId: 'ch3_soldier_2', position: { x: 4, y: 4 } },
    { unitId: 'ch3_mage_1', position: { x: 7, y: 2 } },
    { unitId: 'ch3_mage_2', position: { x: 10, y: 4 } },  // extra mage — flanking threat
    { unitId: 'ch3_guard_1', position: { x: 6, y: 3 } },   // on fort
    { unitId: 'ch3_boss', position: { x: 6, y: 5 } },      // boss on fort
  ],
  objective: {
    type: 'rout',
    description: 'Defeat all enemies',
  },
  prologue: {
    lines: [
      { speaker: 'Narrator', text: 'Following the road north, Eirik\'s company reaches the village of Borgo — only to find it overrun by bandits.' },
      { speaker: 'Seth', text: 'Princess, these brigands have taken the village hostage. We cannot simply pass through.', speakerFaction: 'player' },
      { speaker: 'Eirik', text: 'Then we free them. These people need our help more than we need haste.', speakerFaction: 'player' },
      { speaker: 'Lute', text: 'I count at least eight hostiles. They\'ve positioned themselves in the forest for ambush.', speakerFaction: 'player' },
      { speaker: 'Natasha', text: 'Those poor villagers... We must drive the bandits out.', speakerFaction: 'player' },
      { speaker: 'Narrator', text: 'Eirik rallies her companions. Every last bandit must be defeated to liberate Borgo.' },
    ],
  },
  epilogue: {
    lines: [
      { speaker: 'Eirik', text: 'The village is safe. Is everyone all right?', speakerFaction: 'player' },
      { speaker: 'Narrator', text: 'The grateful villagers of Borgo tend to the company\'s wounds and share what supplies they can spare.' },
      { speaker: 'Seth', text: 'Princess, the villagers mention ancient ruins to the north. Grado scouts have been seen near them.', speakerFaction: 'player' },
      { speaker: 'Lute', text: 'Ancient ruins? How fascinating. There could be valuable artifacts inside.', speakerFaction: 'player' },
      { speaker: 'Eirik', text: 'If Grado is interested in those ruins, we should investigate before they can use whatever is inside.', speakerFaction: 'player' },
      { speaker: 'Narrator', text: 'With Borgo liberated, the company sets their sights on the mysterious ruins ahead.' },
    ],
  },
  villages: [
    {
      position: { x: 3, y: 2 },
      reward: {
        type: 'weapon',
        weaponId: 'steel_sword',
        dialogue: 'A fine blade, forged by our best smith. Use it to drive these bandits out!',
        speaker: 'Borgo Blacksmith',
      },
    },
    {
      position: { x: 10, y: 2 },
      reward: {
        type: 'weapon',
        weaponId: 'elfire',
        dialogue: 'This tome was left behind by a traveling sage. It holds powerful fire magic.',
        speaker: 'Borgo Villager',
      },
    },
  ],
  reinforcements: [
    {
      turn: 4,
      units: [
        { unitId: 'ch3_reinforce_1', position: { x: 3, y: 11 } },
        { unitId: 'ch3_reinforce_2', position: { x: 10, y: 11 } },
      ],
      message: 'More bandits emerge from the forest!',
    },
  ],
};
