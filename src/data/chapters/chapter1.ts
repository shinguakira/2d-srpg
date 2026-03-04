import type { ChapterData, TerrainType } from '../../core/types';

// Shorthand aliases for readability
const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const W: TerrainType = 'water';
const X: TerrainType = 'wall';
const T: TerrainType = 'fort';
const V: TerrainType = 'village';

// 15 columns x 12 rows
// Row 0 is the top (north), row 11 is the bottom (south)
const terrain: TerrainType[][] = [
  //0  1  2  3  4  5  6  7  8  9  10 11 12 13 14
  [M, M, F, P, P, P, P, F, P, P, P, P, F, M, M], // row 0
  [M, F, P, P, F, P, P, P, P, P, F, P, P, F, M], // row 1
  [F, P, P, P, P, P, F, P, F, P, P, P, P, P, F], // row 2
  [P, P, V, P, P, P, P, P, P, P, P, P, V, P, P], // row 3
  [P, P, P, P, F, P, P, T, P, P, F, P, P, P, P], // row 4
  [P, P, P, W, W, P, P, P, P, P, W, W, P, P, P], // row 5
  [P, P, P, W, P, P, P, P, P, P, P, W, P, P, P], // row 6
  [P, P, P, P, P, F, P, P, P, F, P, P, P, P, P], // row 7
  [P, F, P, P, P, P, P, P, P, P, P, P, P, F, P], // row 8
  [F, P, P, P, P, P, F, X, F, P, P, P, P, P, F], // row 9
  [M, F, P, P, F, P, P, X, P, P, F, P, P, F, M], // row 10
  [M, M, F, P, P, P, X, X, X, P, P, P, F, M, M], // row 11
];

export const CHAPTER_1: ChapterData = {
  id: 'ch1',
  name: 'Prologue: The Fall of Renais',
  chapterNumber: 1,
  mapWidth: 15,
  mapHeight: 12,
  terrain,
  playerUnits: [
    { unitId: 'eirik', position: { x: 6, y: 10 } },
    { unitId: 'seth', position: { x: 8, y: 10 } },
    { unitId: 'lute', position: { x: 5, y: 11 } },
  ],
  enemyUnits: [
    { unitId: 'fighter_1', position: { x: 5, y: 2 } },
    { unitId: 'fighter_2', position: { x: 9, y: 2 } },
    { unitId: 'fighter_3', position: { x: 7, y: 4 } },
    { unitId: 'soldier_1', position: { x: 3, y: 1 } },
    { unitId: 'soldier_2', position: { x: 11, y: 1 } },
  ],
  objective: {
    type: 'rout',
    description: 'Defeat all enemies',
  },
  prologue: {
    lines: [
      { speaker: 'Narrator', text: 'The kingdom of Renais has fallen. The Grado Empire struck without warning, shattering a century of peace.' },
      { speaker: 'Eirik', text: 'Father... The castle is lost. We must retreat while we still can.', speakerFaction: 'player' },
      { speaker: 'Seth', text: 'Princess, I will protect you with my life. Stay close to me.', speakerFaction: 'player' },
      { speaker: 'Eirik', text: 'Seth, we cannot abandon our people. There must be something we can do.', speakerFaction: 'player' },
      { speaker: 'Lute', text: 'I have studied the enemy formations. Their vanguard is small — we can break through.', speakerFaction: 'player' },
      { speaker: 'Seth', text: 'Then we fight. Defeat the enemy soldiers blocking our path and escape to the south.', speakerFaction: 'player' },
      { speaker: 'Narrator', text: 'With no choice but to fight, Eirik and her companions prepare for battle.' },
    ],
  },
  villages: [
    {
      position: { x: 2, y: 3 },
      reward: {
        type: 'weapon',
        weaponId: 'iron_axe',
        dialogue: 'Take this axe. You may need it on the road ahead.',
        speaker: 'Village Elder',
      },
    },
    {
      position: { x: 12, y: 3 },
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
};
