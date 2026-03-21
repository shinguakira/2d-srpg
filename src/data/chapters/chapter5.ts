import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const W: TerrainType = 'water';
const X: TerrainType = 'wall';
const T: TerrainType = 'fort';
const V: TerrainType = 'village';
const H: TerrainType = 'throne';
const B: TerrainType = 'bridge';
const C: TerrainType = 'chest';

// 14 columns x 16 rows — vertical mountain fortress assault
const terrain: TerrainType[][] = [
  // 0  1  2  3  4  5  6  7  8  9  10 11 12 13
  [X, X, X, X, X, X, X, X, X, X, P, P, P, M], // row 0  — fortress north wall, NE open (void target)
  [X, P, P, P, P, P, P, H, P, P, P, P, P, X], // row 1  — throne at (7,1)
  [X, P, P, X, P, P, P, P, P, P, X, P, P, X], // row 2  — interior pillars
  [X, P, P, P, P, X, P, P, X, P, P, P, C, X], // row 3  — archers + chest at (12,3)
  [X, X, P, P, P, P, P, P, P, P, P, P, X, X], // row 4  — fortress inner gate
  [M, X, P, P, F, P, P, P, P, F, P, P, X, M], // row 5  — fortress edge
  [M, F, P, F, P, P, P, P, P, P, F, P, F, M], // row 6  — forested ridge
  [M, F, P, W, B, P, P, P, P, P, P, P, F, M], // row 7  — bridge at (4,7), water at (3,7)
  [M, P, P, F, W, F, P, P, P, F, F, P, P, M], // row 8  — water below bridge
  [M, P, P, P, T, F, P, P, P, T, P, P, P, M], // row 9  — forts at (4,9) and (9,9)
  [P, P, F, P, P, P, P, P, P, P, P, F, P, P], // row 10 — brigand zone
  [P, P, V, P, P, F, P, P, F, P, P, P, P, P], // row 11 — village at (2,11)
  [P, P, P, P, F, P, P, P, P, F, P, P, P, P], // row 12 — approach
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 13 — deployment row 1
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 14 — deployment row 2
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 15 — deployment row 3
];

export const CHAPTER_5: ChapterData = {
  id: 'ch5',
  name: 'Chapter 5: Above the Clouds',
  chapterNumber: 5,
  mapWidth: 14,
  mapHeight: 16,
  terrain,
  playerUnits: [
    { unitId: 'ren',  position: { x: 6, y: 14 } },
    { unitId: 'kael', position: { x: 7, y: 14 } },
    { unitId: 'senna', position: { x: 6, y: 15 } },
    { unitId: 'bram', position: { x: 5, y: 13 } },
    { unitId: 'lira', position: { x: 7, y: 15 } },
    { unitId: 'voss', position: { x: 8, y: 13 } },
    { unitId: 'nira', position: { x: 5, y: 15 } },
    { unitId: 'coda', position: { x: 9, y: 13 } },
    { unitId: 'yuel', position: { x: 4, y: 14 } },
  ],
  enemyUnits: [
    { unitId: 'ch5_boss',      position: { x: 7,  y: 1 } },  // Aldric on throne
    { unitId: 'ch5_knight_1',  position: { x: 6,  y: 2 } },  // escort left
    { unitId: 'ch5_knight_2',  position: { x: 8,  y: 2 } },  // escort right
    { unitId: 'ch5_soldier_1', position: { x: 5,  y: 4 } },  // gate left
    { unitId: 'ch5_soldier_2', position: { x: 9,  y: 4 } },  // gate right
    { unitId: 'ch5_archer_1',  position: { x: 3,  y: 3 } },  // wall archer left
    { unitId: 'ch5_archer_2',  position: { x: 11, y: 3 } },  // wall archer right
    { unitId: 'ch5_cavalier_1', position: { x: 2, y: 7 } },  // flank cav left
    { unitId: 'ch5_cavalier_2', position: { x: 10, y: 7 } },  // flank cav right
    { unitId: 'ch5_mage_1',    position: { x: 7,  y: 5 } },  // courtyard mage
    { unitId: 'ch5_brigand_1', position: { x: 4,  y: 10 } }, // approach brigand left
    { unitId: 'ch5_brigand_2', position: { x: 10, y: 10 } }, // approach brigand right
  ],
  objective: {
    type: 'seize',
    description: 'Defeat General Aldric and seize the throne',
  },
  seizePosition: { x: 7, y: 1 },
  deploymentSlots: 6,
  forceDeploy: ['ren'],
  parTurns: 14,
  recruitableUnits: ['yuel'],
  prologue: {
    lines: [
      { speaker: 'Narrator', text: 'The mountain fortress looms above, its walls cutting the sky like a blade. General Aldric commands its garrison.' },
      { speaker: 'Yuel', text: 'Princess Ren! I bring urgent word from the border watch. The skies... something is wrong with them.', speakerFaction: 'player' },
      { speaker: 'Ren', text: 'Who are you?', speakerFaction: 'player' },
      { speaker: 'Yuel', text: 'Yuel, pegasus knight of the Third Wing. I was patrolling the mountain pass when the clouds... shifted. Like they were rewritten.', speakerFaction: 'player' },
      { speaker: 'Senna', text: 'Rewritten? Interesting choice of words. Show me exactly where.', speakerFaction: 'player' },
      { speaker: 'Kael', text: 'We can discuss anomalies later. The fortress must fall before nightfall or we lose our advantage.', speakerFaction: 'player' },
      { speaker: 'Yuel', text: 'Then let me fight alongside you. My pegasus can reach places your ground forces cannot.', speakerFaction: 'player' },
      { speaker: 'Ren', text: 'Welcome, Yuel. Stay close — the fortress approach will be dangerous.', speakerFaction: 'player' },
    ],
  },
  epilogue: {
    lines: [
      { speaker: 'Narrator', text: 'The fortress falls silent. General Aldric\'s garrison is broken. The mountain pass lies open.' },
      { speaker: 'Ren', text: 'It is done. The fortress is ours.', speakerFaction: 'player' },
      { speaker: 'Yuel', text: 'Princess, look — the sky above the fortress. It is... flickering. Like a painting with wet ink.', speakerFaction: 'player' },
      { speaker: 'Senna', text: 'I have been running the numbers since the terrain shifted. The RNG seed — the fundamental constant that governs probability in our world — it changed.', speakerFaction: 'player' },
      { speaker: 'Kael', text: 'Speak plainly, Senna.', speakerFaction: 'player' },
      { speaker: 'Senna', text: 'The script is not safe anymore. Someone — or something — is rewriting the rules while we are still inside them.', speakerFaction: 'player' },
      { speaker: 'Ren', text: '...Then we rewrite them back. Whatever is coming, we face it together.', speakerFaction: 'player' },
      { speaker: 'Narrator', text: 'As Arc 1 draws to a close, the company gazes at a sky that no longer obeys its own laws. The world they knew is changing — and the changes have only begun.' },
    ],
  },
  villages: [
    {
      position: { x: 2, y: 11 },
      reward: {
        type: 'weapon',
        weaponId: 'steel_sword',
        dialogue: 'This blade was forged for mountain warfare. Take it — you will need it up there.',
        speaker: 'Mountain Smith',
      },
    },
  ],
  chests: [
    {
      position: { x: 12, y: 3 },
      reward: {
        type: 'weapon',
        weaponId: 'javelin',
        dialogue: 'A javelin was stored inside the chest.',
        speaker: 'Narrator',
      },
    },
  ],
  reinforcements: [
    {
      turn: 6,
      units: [
        { unitId: 'ch5_reinforce_1', position: { x: 3, y: 14 } },
        { unitId: 'ch5_reinforce_2', position: { x: 10, y: 14 } },
      ],
      message: 'Enemy reinforcements arrive from the south!',
    },
    {
      turn: 8,
      units: [
        { unitId: 'ch5_reinforce_3', position: { x: 0, y: 10 } },
      ],
      message: 'An enemy cavalier charges from the west!',
    },
  ],
  events: [
    // Turn 3 — Terrain Shift: 6 tiles change, disrupting planned paths
    {
      id: 'ch5_terrain_shift',
      trigger: { type: 'turn_start' as const, turn: 3 },
      effects: [
        {
          type: 'show_dialogue' as const,
          scene: {
            lines: [
              { speaker: 'Bram', text: 'Did that TREE just turn into a RIVER?', speakerFaction: 'player' as const },
              { speaker: 'Senna', text: 'That\'s impossible. Terrain values are fixed. I mapped this entire grid.', speakerFaction: 'player' as const },
              { speaker: 'Ren', text: 'Senna. Your map.', speakerFaction: 'player' as const },
              { speaker: 'Senna', text: 'It\'s... wrong now. My movement cost calculations are all wrong. The terrain changed AFTER I analyzed it.', speakerFaction: 'player' as const },
            ],
          },
        },
        { type: 'change_terrain' as const, position: { x: 4, y: 8 }, terrain: 'plain' },     // water → plain
        { type: 'change_terrain' as const, position: { x: 5, y: 6 }, terrain: 'mountain' },   // plain → mountain
        { type: 'change_terrain' as const, position: { x: 9, y: 6 }, terrain: 'water' },      // plain → water
        { type: 'change_terrain' as const, position: { x: 3, y: 9 }, terrain: 'forest' },     // plain → forest
        { type: 'change_terrain' as const, position: { x: 10, y: 9 }, terrain: 'mountain' },  // plain → mountain
        { type: 'change_terrain' as const, position: { x: 7, y: 8 }, terrain: 'forest' },     // plain → forest
      ],
      once: true,
    },
    // Turn 5 — Data Void: 3×2 block appears in NE corner, nearby enemies scatter
    {
      id: 'ch5_data_void',
      trigger: { type: 'turn_start' as const, turn: 5 },
      effects: [
        {
          type: 'show_dialogue' as const,
          scene: {
            lines: [
              { speaker: 'Yuel', text: 'THAT. That\'s what I saw in the sky. The nothing.', speakerFaction: 'player' as const },
              { speaker: 'Coda', text: 'That\'s not "nothing." That\'s... unloaded. Like a texture that got deleted.', speakerFaction: 'player' as const },
              { speaker: 'Senna', text: 'I can\'t analyze what isn\'t there. My formulas need INPUT. That void has no data.', speakerFaction: 'player' as const },
              { speaker: 'Ren', text: 'Everyone stay away from it. Push toward Aldric.', speakerFaction: 'player' as const },
            ],
          },
        },
        // 3×2 data void block: rows 0-1, cols 10-12
        { type: 'change_terrain' as const, position: { x: 10, y: 0 }, terrain: 'data_void' },
        { type: 'change_terrain' as const, position: { x: 11, y: 0 }, terrain: 'data_void' },
        { type: 'change_terrain' as const, position: { x: 12, y: 0 }, terrain: 'data_void' },
        { type: 'change_terrain' as const, position: { x: 10, y: 1 }, terrain: 'data_void' },
        { type: 'change_terrain' as const, position: { x: 11, y: 1 }, terrain: 'data_void' },
        { type: 'change_terrain' as const, position: { x: 12, y: 1 }, terrain: 'data_void' },
        // Nearby enemies panic: scatter from guard to aggressive
        { type: 'change_ai' as const, unitId: 'ch5_archer_2', newBehavior: { type: 'aggressive' as const } },
        { type: 'change_ai' as const, unitId: 'ch5_cavalier_2', newBehavior: { type: 'aggressive' as const } },
      ],
      once: true,
    },
    // Turn 7 — Forecast Flicker: dialogue-only story beat
    {
      id: 'ch5_forecast_flicker',
      trigger: { type: 'turn_start' as const, turn: 7 },
      effects: [
        {
          type: 'show_dialogue' as const,
          scene: {
            lines: [
              { speaker: 'Narrator', text: 'For a brief moment, the combat forecast display flickers — showing impossible numbers before snapping back to normal.' },
              { speaker: 'Senna', text: 'The seed changed. Mid-battle. That doesn\'t happen. The seed is set at the start and it NEVER changes.', speakerFaction: 'player' as const },
              { speaker: 'Bram', text: 'Can we worry about math AFTER the guys with lances stop charging us?', speakerFaction: 'player' as const },
              { speaker: 'Senna', text: 'You don\'t understand. If the seed can change, NOTHING I\'ve calculated this entire campaign is reliable.', speakerFaction: 'player' as const },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss approach — Ren reaches the fortress gate
    {
      id: 'ch5_boss_approach',
      trigger: { type: 'unit_at' as const, unitId: 'ren', position: { x: 7, y: 4 } },
      effects: [
        {
          type: 'show_dialogue' as const,
          scene: {
            lines: [
              { speaker: 'Aldric', text: 'You\'ve fought bandits and pirates. Now face a real army.', speakerFaction: 'enemy' as const },
              { speaker: 'Ren', text: 'Your walls just REWROTE themselves. Half your courtyard is a void. How are you not concerned?', speakerFaction: 'player' as const },
              { speaker: 'Aldric', text: 'I don\'t answer to anomalies. I answer to the Empire.', speakerFaction: 'enemy' as const },
            ],
          },
        },
      ],
      once: true,
    },
  ],
  supportConversations: [
    {
      unitA: 'ren',
      unitB: 'yuel',
      lines: [
        { speaker: 'Yuel', text: 'Princess, may I speak freely? From the sky, the battlefield looks... different. Like a pattern.', speakerFaction: 'player' },
        { speaker: 'Ren', text: 'A pattern? What do you mean?', speakerFaction: 'player' },
        { speaker: 'Yuel', text: 'The enemies, the terrain, even our movements — they fit together too neatly. As if someone arranged them.', speakerFaction: 'player' },
        { speaker: 'Ren', text: 'You see it too. I was beginning to think I was the only one.', speakerFaction: 'player' },
      ],
      reward: { type: 'stat', unitId: 'yuel', stat: 'spd', amount: 1 },
    },
    {
      unitA: 'kael',
      unitB: 'bram',
      lines: [
        { speaker: 'Kael', text: 'Bram, your axework is... unconventional. But effective.', speakerFaction: 'player' },
        { speaker: 'Bram', text: 'Hah! No one ever taught me proper form. I just hit things until they stop moving.', speakerFaction: 'player' },
        { speaker: 'Kael', text: 'Here — widen your stance when you swing overhead. It will add power without sacrificing balance.', speakerFaction: 'player' },
        { speaker: 'Bram', text: 'A knight teaching a brawler? I like this army.', speakerFaction: 'player' },
      ],
      reward: { type: 'stat', unitId: 'bram', stat: 'skl', amount: 1 },
    },
  ],
};
