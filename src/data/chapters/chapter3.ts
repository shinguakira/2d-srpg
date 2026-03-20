import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const W: TerrainType = 'water';
const T: TerrainType = 'fort';
const V: TerrainType = 'village';

// 25 columns x 12 rows — fills 16:9 desktop with square tiles
const terrain: TerrainType[][] = [
  //0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24
  [M, M, M, M, F, F, P, P, P, P, P, P, P, P, P, F, F, P, P, F, P, F, M, M, M], // row 0
  [M, M, M, F, P, P, P, F, P, P, P, F, P, P, P, P, F, P, P, P, F, P, F, M, M], // row 1
  [M, M, F, P, P, V, P, P, P, P, P, P, P, V, P, P, P, P, F, P, P, P, P, M, M], // row 2 — villages
  [M, F, P, P, F, F, P, P, P, T, P, P, F, F, P, P, P, F, P, P, F, P, P, F, M], // row 3 — fort at (9,3)
  [F, P, P, W, P, F, P, P, P, P, P, P, F, P, P, P, F, P, P, F, P, P, P, P, F], // row 4
  [P, P, P, W, P, P, P, F, P, T, F, P, P, P, F, P, P, P, P, P, P, P, P, P, P], // row 5 — fort at (9,5), boss
  [P, P, P, P, P, F, P, P, P, P, P, P, F, P, P, P, P, F, P, P, P, P, P, F, P], // row 6
  [P, P, P, P, F, P, P, P, P, P, P, P, P, F, P, P, P, P, F, P, P, P, P, P, P], // row 7
  [P, P, F, P, P, P, F, P, P, P, P, F, P, P, P, P, F, P, P, P, F, P, P, P, F], // row 8
  [F, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, F], // row 9
  [M, F, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, F, M], // row 10
  [M, M, F, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, F, M, M], // row 11
];

export const CHAPTER_3: ChapterData = {
  id: 'ch3',
  name: 'Chapter 3: The Bandits of Borgo',
  chapterNumber: 3,
  mapWidth: 25,
  mapHeight: 12,
  terrain,
  playerUnits: [
    { unitId: 'ren', position: { x: 9, y: 10 } },
    { unitId: 'kael', position: { x: 14, y: 10 } },
    { unitId: 'senna', position: { x: 10, y: 11 } },
    { unitId: 'lira', position: { x: 15, y: 11 } },
  ],
  enemyUnits: [
    { unitId: 'ch3_fighter_1', position: { x: 8, y: 5 } },
    { unitId: 'ch3_fighter_2', position: { x: 14, y: 6 } },
    { unitId: 'ch3_fighter_3', position: { x: 5, y: 3 } },
    { unitId: 'ch3_soldier_1', position: { x: 15, y: 3 } },
    { unitId: 'ch3_soldier_2', position: { x: 7, y: 4 } },
    { unitId: 'ch3_mage_1', position: { x: 12, y: 2 } },
    { unitId: 'ch3_mage_2', position: { x: 17, y: 4 } },
    { unitId: 'ch3_guard_1', position: { x: 9, y: 3 } },   // on fort
    { unitId: 'ch3_boss', position: { x: 9, y: 5 } },       // boss on fort
  ],
  objective: {
    type: 'rout',
    description: 'Defeat all enemies',
  },
  prologue: {
    lines: [
      { speaker: 'Narrator', text: 'Following the road north, Ren\'s company reaches the village of Borgo — only to find it overrun by bandits.' },
      { speaker: 'Kael', text: 'Princess, these brigands have taken the village hostage. We cannot simply pass through.', speakerFaction: 'player' },
      { speaker: 'Ren', text: 'Then we free them. These people need our help more than we need haste.', speakerFaction: 'player' },
      { speaker: 'Senna', text: 'I count at least eight hostiles. They\'ve positioned themselves in the forest for ambush.', speakerFaction: 'player' },
      { speaker: 'Lira', text: 'Those poor villagers... We must drive the bandits out.', speakerFaction: 'player' },
      { speaker: 'Narrator', text: 'Ren rallies her companions. Every last bandit must be defeated to liberate Borgo.' },
    ],
  },
  epilogue: {
    lines: [
      { speaker: 'Ren', text: 'The village is safe. Is everyone all right?', speakerFaction: 'player' },
      { speaker: 'Narrator', text: 'The grateful villagers of Borgo tend to the company\'s wounds and share what supplies they can spare.' },
      { speaker: 'Kael', text: 'Princess, the villagers mention ancient ruins to the north. Grado scouts have been seen near them.', speakerFaction: 'player' },
      { speaker: 'Senna', text: 'Ancient ruins? How fascinating. There could be valuable artifacts inside.', speakerFaction: 'player' },
      { speaker: 'Ren', text: 'If Grado is interested in those ruins, we should investigate before they can use whatever is inside.', speakerFaction: 'player' },
      { speaker: 'Narrator', text: 'With Borgo liberated, the company sets their sights on the mysterious ruins ahead.' },
    ],
  },
  villages: [
    {
      position: { x: 5, y: 2 },  // village west
      reward: {
        type: 'weapon',
        weaponId: 'steel_sword',
        dialogue: 'A fine blade, forged by our best smith. Use it to drive these bandits out!',
        speaker: 'Borgo Blacksmith',
      },
    },
    {
      position: { x: 13, y: 2 },
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
        { unitId: 'ch3_reinforce_2', position: { x: 20, y: 11 } },
      ],
      message: 'More bandits emerge from the forest!',
    },
  ],
  supportConversations: [
    {
      unitA: 'ren',
      unitB: 'lira',
      lines: [
        { speaker: 'Ren', text: 'Lira, you seem troubled. Is something on your mind?', speakerFaction: 'player' },
        { speaker: 'Lira', text: 'These bandits... they prey on the innocent. It fills me with resolve.', speakerFaction: 'player' },
        { speaker: 'Ren', text: 'Then let us fight together to protect those who cannot protect themselves.', speakerFaction: 'player' },
        { speaker: 'Lira', text: 'Yes. Your determination gives me courage, Ren. I feel my faith growing stronger.', speakerFaction: 'player' },
      ],
      reward: { type: 'stat', unitId: 'lira', stat: 'res', amount: 1 },
    },
    {
      unitA: 'kael',
      unitB: 'senna',
      lines: [
        { speaker: 'Kael', text: 'Senna, I have noticed you studying the enemy formations before each battle.', speakerFaction: 'player' },
        { speaker: 'Senna', text: 'Obviously. Knowledge is the ultimate weapon. I have identified three weaknesses in their strategy.', speakerFaction: 'player' },
        { speaker: 'Kael', text: 'Impressive. Perhaps you could brief me before we engage? Your insights could save lives.', speakerFaction: 'player' },
        { speaker: 'Senna', text: 'Hmm. Very well. I suppose even a genius needs someone to execute the plan.', speakerFaction: 'player' },
      ],
      reward: { type: 'stat', unitId: 'kael', stat: 'spd', amount: 1 },
    },
  ],
};
