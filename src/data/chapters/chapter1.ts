import type { ChapterData, TerrainType, SupportConversation } from '../../core/types';

// Shorthand aliases for readability
const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const W: TerrainType = 'water';
const X: TerrainType = 'wall';
const T: TerrainType = 'fort';
const V: TerrainType = 'village';
const H: TerrainType = 'throne';

// 25 columns x 12 rows — fills 16:9 desktop with square tiles
const terrain: TerrainType[][] = [
  //0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24
  [M, M, M, F, P, P, P, P, P, F, P, P, P, F, P, P, P, P, P, F, P, F, M, M, M], // row 0
  [M, M, F, P, P, F, P, P, P, P, P, H, P, P, P, P, F, P, P, P, F, P, F, M, M], // row 1 — throne at (11,1)
  [M, F, P, P, P, P, P, P, F, P, P, P, P, P, F, P, P, P, P, P, P, P, P, F, M], // row 2
  [F, P, P, V, P, P, P, P, P, P, P, P, P, P, P, P, P, P, V, P, P, P, P, P, F], // row 3
  [P, P, P, P, P, F, P, P, P, P, P, T, P, P, P, F, P, P, P, P, F, P, P, P, P], // row 4
  [P, P, P, P, W, W, P, P, P, P, P, P, P, P, P, W, W, P, P, P, P, P, P, P, P], // row 5
  [P, P, F, P, W, P, P, P, P, P, P, P, P, P, P, P, W, P, P, F, P, P, P, F, P], // row 6
  [P, P, P, P, P, P, F, P, P, P, P, P, P, P, F, P, P, P, P, P, P, P, F, P, P], // row 7
  [P, P, F, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, F, P, P, P, P, F], // row 8
  [F, P, P, P, P, P, P, P, F, P, X, F, P, P, P, P, P, F, P, P, P, P, P, P, F], // row 9
  [M, F, P, P, P, F, P, P, P, P, X, P, P, P, F, P, P, P, P, F, P, P, F, P, M], // row 10
  [M, M, F, P, P, P, P, P, P, X, X, X, P, P, P, P, P, P, P, P, F, F, F, M, M], // row 11
];

export const CHAPTER_1: ChapterData = {
  id: 'ch1',
  name: 'Prologue: The Fall of Renais',
  chapterNumber: 1,
  mapWidth: 25,
  mapHeight: 12,
  terrain,
  playerUnits: [
    { unitId: 'eirik', position: { x: 10, y: 10 } },
    { unitId: 'seth', position: { x: 13, y: 10 } },
    { unitId: 'lute', position: { x: 9, y: 11 } },
    { unitId: 'natasha', position: { x: 14, y: 11 } },
  ],
  enemyUnits: [
    { unitId: 'fighter_1', position: { x: 8, y: 2 } },
    { unitId: 'fighter_3', position: { x: 11, y: 4 } },
    { unitId: 'soldier_1', position: { x: 5, y: 1 } },
    { unitId: 'bone', position: { x: 11, y: 1 } }, // boss on throne
  ],
  objective: {
    type: 'seize',
    description: 'Seize the throne',
  },
  seizePosition: { x: 11, y: 1 },
  prologue: {
    lines: [
      { speaker: 'Narrator', text: 'The kingdom of Renais has fallen. The Grado Empire struck without warning, shattering a century of peace.' },
      { speaker: 'Eirik', text: 'Father... The castle is lost. We must retreat while we still can.', speakerFaction: 'player' },
      { speaker: 'Seth', text: 'Princess, I will protect you with my life. Stay close to me.', speakerFaction: 'player' },
      { speaker: 'Eirik', text: 'Seth, we cannot abandon our people. There must be something we can do.', speakerFaction: 'player' },
      { speaker: 'Lute', text: 'I have studied the enemy formations. Their vanguard is small — we can break through.', speakerFaction: 'player' },
      { speaker: 'Seth', text: 'Then we fight. Defeat their leader and seize the throne to secure our escape route.', speakerFaction: 'player' },
      { speaker: 'Narrator', text: 'With no choice but to fight, Eirik and her companions prepare for battle.' },
    ],
  },
  villages: [
    {
      position: { x: 3, y: 3 },  // village west
      reward: {
        type: 'weapon',
        weaponId: 'hand_axe',
        dialogue: 'Take this axe. It can strike from a distance — very useful.',
        speaker: 'Village Elder',
      },
    },
    {
      position: { x: 18, y: 3 },
      reward: {
        type: 'weapon',
        weaponId: 'wind',
        dialogue: 'I found this tome in the ruins. Perhaps your mage can use it.',
        speaker: 'Villager',
      },
    },
  ],
  epilogue: {
    lines: [
      { speaker: 'Eirik', text: 'We made it through... but the road ahead will only grow harder.', speakerFaction: 'player' },
      { speaker: 'Seth', text: 'We should make for Frelia. King Hayden will grant us sanctuary.', speakerFaction: 'player' },
      { speaker: 'Lute', text: 'I calculate a 73% chance of encountering more resistance along the way.', speakerFaction: 'player' },
      { speaker: 'Narrator', text: 'The survivors press onward, leaving the ruins of Renais behind them.' },
    ],
  },
  supportConversations: [
    {
      unitA: 'eirik',
      unitB: 'seth',
      lines: [
        { speaker: 'Eirik', text: 'Seth, you fought bravely today. I feel safer with you by my side.', speakerFaction: 'player' },
        { speaker: 'Seth', text: 'It is my honor, Princess. I swear I will not let harm befall you.', speakerFaction: 'player' },
        { speaker: 'Eirik', text: 'Please, just call me Eirik. We are companions now, not just knight and princess.', speakerFaction: 'player' },
        { speaker: 'Seth', text: '...Very well, Eirik. Then let us face what comes together.', speakerFaction: 'player' },
      ],
      reward: { type: 'exp_both', amount: 20 },
    },
    {
      unitA: 'lute',
      unitB: 'natasha',
      lines: [
        { speaker: 'Lute', text: 'Natasha, I have been studying healing magic. Your technique is... adequate.', speakerFaction: 'player' },
        { speaker: 'Natasha', text: 'Oh? That is high praise coming from you, Lute.', speakerFaction: 'player' },
        { speaker: 'Lute', text: 'I could teach you a focus technique that amplifies magical energy. Interested?', speakerFaction: 'player' },
        { speaker: 'Natasha', text: 'I would be grateful. Every bit of knowledge helps protect our friends.', speakerFaction: 'player' },
      ],
      reward: { type: 'stat', unitId: 'natasha', stat: 'mag', amount: 1 },
    },
  ],
};
