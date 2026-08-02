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
    { unitId: 'ren', position: { x: 6, y: 14 } },
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
    { unitId: 'ch5_boss', position: { x: 7, y: 1 } }, // Aldric on throne
    { unitId: 'ch5_knight_1', position: { x: 6, y: 2 } }, // escort left
    { unitId: 'ch5_knight_2', position: { x: 8, y: 2 } }, // escort right
    { unitId: 'ch5_soldier_1', position: { x: 5, y: 4 } }, // gate left
    { unitId: 'ch5_soldier_2', position: { x: 9, y: 4 } }, // gate right
    { unitId: 'ch5_archer_1', position: { x: 3, y: 3 } }, // wall archer left
    { unitId: 'ch5_archer_2', position: { x: 11, y: 3 } }, // wall archer right
    { unitId: 'ch5_cavalier_1', position: { x: 2, y: 7 } }, // flank cav left
    { unitId: 'ch5_cavalier_2', position: { x: 10, y: 7 } }, // flank cav right
    { unitId: 'ch5_mage_1', position: { x: 7, y: 5 } }, // courtyard mage
    { unitId: 'ch5_brigand_1', position: { x: 4, y: 10 } }, // approach brigand left
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
      {
        speaker: 'Narrator',
        text: 'Dawn. The party camps on a ridge overlooking the highland fortress. Clouds hang unnaturally low. A pegasus knight descends, lance drawn.',
      },
      {
        speaker: 'Yuel',
        text: "DON'T go up there. Please. Something is wrong with the sky.",
        speakerFaction: 'player',
      },
      { speaker: 'Ren', text: 'Wrong how?', speakerFaction: 'player' },
      {
        speaker: 'Yuel',
        text: 'The clouds were loading in SQUARES. Like tiles. I watched a patch of sky just... not render. For three seconds. Then it came back wrong.',
        speakerFaction: 'player',
      },
      { speaker: 'Kael', text: "Clouds don't load. They're clouds.", speakerFaction: 'player' },
      { speaker: 'Yuel', text: 'I know what I saw.', speakerFaction: 'player' },
      { speaker: 'Ren', text: '...I believe you.', speakerFaction: 'player' },
      {
        speaker: 'Senna',
        text: "The fortress is well-defended. General Aldric has knights on every approach. If we're doing this, we need the aerial route. Which means we need her.",
        speakerFaction: 'player',
      },
    ],
  },
  epilogue: {
    lines: [
      {
        speaker: 'Narrator',
        text: 'The fortress courtyard, after battle. The Data Void has closed, but the tiles it occupied are still wrong.',
      },
      {
        speaker: 'Senna',
        text: "I need to say something. I've been tracking the combat seed since Chapter 1. Every random number, every hit roll \u2014 I had the pattern mapped. All of it.",
        speakerFaction: 'player',
      },
      { speaker: 'Ren', text: 'Had?', speakerFaction: 'player' },
      {
        speaker: 'Senna',
        text: 'It changed. Mid-battle. Something reached into the system and REWROTE the seed. My entire model is compromised.',
        speakerFaction: 'player',
      },
      { speaker: 'Yuel', text: 'I told you. The sky was wrong.', speakerFaction: 'player' },
      {
        speaker: 'Coda',
        text: "And the ground. And the walls. And Senna's math.",
        speakerFaction: 'player',
      },
      { speaker: 'Lira', text: 'So what does this mean? For us?', speakerFaction: 'player' },
      {
        speaker: 'Ren',
        text: "It means the script isn't safe anymore. Whatever's running this world... it's editing in real time.",
        speakerFaction: 'player',
      },
      {
        speaker: 'Kael',
        text: "Then we adapt. We've fought bandits, pirates, and a general. We can handle a few broken tiles.",
        speakerFaction: 'player',
      },
      { speaker: 'Ren', text: '...Yeah. A few broken tiles.', speakerFaction: 'player' },
      {
        speaker: 'Narrator',
        text: 'As Arc 1 draws to a close, the company gazes at a sky that no longer obeys its own laws.',
      },
    ],
  },
  villages: [
    {
      position: { x: 2, y: 11 },
      reward: {
        type: 'weapon',
        weaponId: 'steel_sword',
        dialogue:
          'This blade was forged for mountain warfare. Take it — you will need it up there.',
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
      units: [{ unitId: 'ch5_reinforce_3', position: { x: 0, y: 10 } }],
      message: 'An enemy cavalier charges from the west!',
    },
  ],
  events: [
    // Turn 3 — Terrain Shift: 6 tiles change, disrupting planned paths
    {
      id: 'ch5_terrain_shift',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Bram',
                text: 'Did that TREE just turn into a RIVER?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Senna',
                text: "That's impossible. Terrain values are fixed. I mapped this entire grid.",
                speakerFaction: 'player',
              },
              { speaker: 'Ren', text: 'Senna. Your map.', speakerFaction: 'player' },
              {
                speaker: 'Senna',
                text: "It's... wrong now. My movement cost calculations are all wrong. The terrain changed AFTER I analyzed it.",
                speakerFaction: 'player',
              },
            ],
          },
        },
        { type: 'change_terrain', position: { x: 4, y: 8 }, terrain: 'plain' }, // water → plain
        { type: 'change_terrain', position: { x: 5, y: 6 }, terrain: 'mountain' }, // plain → mountain
        { type: 'change_terrain', position: { x: 9, y: 6 }, terrain: 'water' }, // plain → water
        { type: 'change_terrain', position: { x: 3, y: 9 }, terrain: 'forest' }, // plain → forest
        { type: 'change_terrain', position: { x: 10, y: 9 }, terrain: 'mountain' }, // plain → mountain
        { type: 'change_terrain', position: { x: 7, y: 8 }, terrain: 'forest' }, // plain → forest
      ],
      once: true,
    },
    // Turn 5 — Data Void: 3×2 block appears in NE corner, nearby enemies scatter
    {
      id: 'ch5_data_void',
      trigger: { type: 'turn_start', turn: 5 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Yuel',
                text: "THAT. That's what I saw in the sky. The nothing.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Coda',
                text: 'That\'s not "nothing." That\'s... unloaded. Like a texture that got deleted.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Senna',
                text: "I can't analyze what isn't there. My formulas need INPUT. That void has no data.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Ren',
                text: 'Everyone stay away from it. Push toward Aldric.',
                speakerFaction: 'player',
              },
            ],
          },
        },
        // 3×2 data void block: rows 0-1, cols 10-12
        { type: 'change_terrain', position: { x: 10, y: 0 }, terrain: 'data_void' },
        { type: 'change_terrain', position: { x: 11, y: 0 }, terrain: 'data_void' },
        { type: 'change_terrain', position: { x: 12, y: 0 }, terrain: 'data_void' },
        { type: 'change_terrain', position: { x: 10, y: 1 }, terrain: 'data_void' },
        { type: 'change_terrain', position: { x: 11, y: 1 }, terrain: 'data_void' },
        { type: 'change_terrain', position: { x: 12, y: 1 }, terrain: 'data_void' },
        // Nearby enemies panic: scatter from guard to aggressive
        { type: 'change_ai', unitId: 'ch5_archer_2', newBehavior: { type: 'aggressive' } },
        { type: 'change_ai', unitId: 'ch5_cavalier_2', newBehavior: { type: 'aggressive' } },
      ],
      once: true,
    },
    // Turn 7 — Forecast Flicker: dialogue-only story beat
    {
      id: 'ch5_forecast_flicker',
      trigger: { type: 'turn_start', turn: 7 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Narrator',
                text: 'For a brief moment, the combat forecast display flickers — showing impossible numbers before snapping back to normal.',
              },
              {
                speaker: 'Senna',
                text: "The seed changed. Mid-battle. That doesn't happen. The seed is set at the start and it NEVER changes.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Bram',
                text: 'Can we worry about math AFTER the guys with lances stop charging us?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Senna',
                text: "You don't understand. If the seed can change, NOTHING I've calculated this entire campaign is reliable.",
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss approach — Ren reaches the fortress gate
    {
      id: 'ch5_boss_approach',
      trigger: { type: 'unit_at', unitId: 'ren', position: { x: 7, y: 4 } },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Aldric',
                text: "You've fought bandits and pirates. Now face a real army.",
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Ren',
                text: 'Your walls just REWROTE themselves. Half your courtyard is a void. How are you not concerned?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Aldric',
                text: "I don't answer to anomalies. I answer to the Empire.",
                speakerFaction: 'enemy',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss killed — Aldric's denial
    {
      id: 'ch5_boss_killed',
      trigger: { type: 'unit_killed', unitId: 'ch5_boss' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Aldric',
                text: 'A real army... and you still broke through.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Ren',
                text: "It wasn't us. Your fortress was falling apart before we got here.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Aldric',
                text: '...I noticed. I chose not to see it. Easier that way.',
                speakerFaction: 'enemy',
              },
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
        {
          speaker: 'Yuel',
          text: 'Princess, may I speak freely? From the sky, the battlefield looks... different. Like a pattern.',
          speakerFaction: 'player',
        },
        { speaker: 'Ren', text: 'A pattern? What do you mean?', speakerFaction: 'player' },
        {
          speaker: 'Yuel',
          text: 'The enemies, the terrain, even our movements — they fit together too neatly. As if someone arranged them.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Ren',
          text: 'You see it too. I was beginning to think I was the only one.',
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'yuel', stat: 'spd', amount: 1 },
    },
    {
      unitA: 'kael',
      unitB: 'bram',
      lines: [
        {
          speaker: 'Kael',
          text: 'Bram, your axework is... unconventional. But effective.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Bram',
          text: 'Hah! No one ever taught me proper form. I just hit things until they stop moving.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Kael',
          text: 'Here — widen your stance when you swing overhead. It will add power without sacrificing balance.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Bram',
          text: 'A knight teaching a brawler? I like this army.',
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'bram', stat: 'skl', amount: 1 },
    },
  ],
};
