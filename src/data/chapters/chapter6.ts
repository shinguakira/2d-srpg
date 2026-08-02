import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const W: TerrainType = 'water';
const X: TerrainType = 'wall';
const T: TerrainType = 'fort';
const V: TerrainType = 'village';
const B: TerrainType = 'bridge';

// 16 columns x 18 rows — coastal harbor town
const terrain: TerrainType[][] = [
  // 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
  [W, W, W, M, M, P, P, P, P, P, P, M, M, W, W, W], // row 0  — water + cliffs (north)
  [W, W, M, P, P, X, X, P, P, X, X, P, P, M, W, W], // row 1  — harbor buildings
  [W, M, P, P, X, P, P, P, P, P, P, X, P, P, M, W], // row 2  — inner harbor
  [M, P, P, P, P, P, P, T, P, P, P, P, P, P, P, M], // row 3  — fort at (7,3), boss area
  [M, P, P, X, P, P, P, P, P, P, P, X, P, P, P, M], // row 4  — walls create corridors
  [P, P, P, P, P, F, P, P, P, P, F, P, P, P, P, P], // row 5  — town outskirts
  [P, P, F, P, P, P, P, P, P, P, P, P, P, F, P, P], // row 6  — approach area
  [P, P, P, P, P, P, T, P, P, T, P, P, P, P, P, P], // row 7  — defensive forts
  [M, P, P, P, P, P, P, P, P, P, P, P, P, P, P, M], // row 8  — cliff edges
  [M, P, P, F, P, P, P, P, P, P, P, P, F, P, P, M], // row 9
  [P, P, P, P, P, P, P, B, B, P, P, P, P, P, P, P], // row 10 — bridge crossing
  [W, P, P, P, P, P, W, W, W, W, P, P, P, P, P, W], // row 11 — water channel
  [P, P, P, V, P, P, P, B, B, P, P, P, P, P, P, P], // row 12 — village at (3,12), south bridge
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 13 — south approach (Faye appears)
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 14 — deployment area
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 15 — deployment row 1
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 16 — deployment row 2
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 17 — south escape zone
];

export const CHAPTER_6: ChapterData = {
  id: 'ch6',
  name: 'Chapter 6: New Alliances',
  chapterNumber: 6,
  mapWidth: 16,
  mapHeight: 18,
  terrain,
  playerUnits: [
    { unitId: 'ren', position: { x: 7, y: 15 } },
    { unitId: 'kael', position: { x: 8, y: 15 } },
    { unitId: 'senna', position: { x: 7, y: 16 } },
    { unitId: 'bram', position: { x: 6, y: 16 } },
    { unitId: 'lira', position: { x: 9, y: 16 } },
    { unitId: 'rook', position: { x: 6, y: 15 } },
    { unitId: 'voss', position: { x: 9, y: 15 } },
  ],
  enemyUnits: [
    { unitId: 'ch6_boss', position: { x: 7, y: 3 } }, // Captain Sera on fort
    { unitId: 'ch6_soldier_1', position: { x: 5, y: 1 } }, // harbor guard
    { unitId: 'ch6_soldier_2', position: { x: 10, y: 1 } }, // harbor guard
    { unitId: 'ch6_soldier_3', position: { x: 4, y: 4 } }, // corridor guard
    { unitId: 'ch6_soldier_4', position: { x: 11, y: 4 } }, // corridor guard
    { unitId: 'ch6_archer_1', position: { x: 3, y: 0 } }, // cliff archer (anti-air)
    { unitId: 'ch6_archer_2', position: { x: 12, y: 0 } }, // cliff archer (anti-air)
    { unitId: 'ch6_fighter_1', position: { x: 5, y: 6 } }, // town outskirts
    { unitId: 'ch6_fighter_2', position: { x: 10, y: 6 } }, // town outskirts
    { unitId: 'ch6_fighter_3', position: { x: 8, y: 8 } }, // approach
    { unitId: 'ch6_cavalier_1', position: { x: 3, y: 5 } }, // flank left
    { unitId: 'ch6_cavalier_2', position: { x: 12, y: 5 } }, // flank right
  ],
  objective: {
    type: 'boss_kill',
    description: 'Defeat Captain Sera',
  },
  deploymentSlots: 7,
  forceDeploy: ['ren'],
  parTurns: 16,
  recruitableUnits: ['rook', 'faye'],
  prologue: {
    lines: [
      {
        speaker: 'Narrator',
        text: 'A coastal harbor town. Salt air mixes with smoke from distant fires. The party arrives at dawn, seeking passage south.',
      },
      {
        speaker: 'Rook',
        text: "Name's Rook. Mercenary. My last employer got erased by a data void, so I'm between contracts.",
        speakerFaction: 'player',
      },
      { speaker: 'Ren', text: '...Erased?', speakerFaction: 'player' },
      {
        speaker: 'Rook',
        text: "You know what I mean. The anomalies. They're spreading from the highlands. Whole towns going wrong.",
        speakerFaction: 'player',
      },
      {
        speaker: 'Senna',
        text: "He's right. My readings show corruption expanding geographically since the seed destabilized. It's no longer localized.",
        speakerFaction: 'player',
      },
      { speaker: 'Kael', text: "So we're heading into it?", speakerFaction: 'player' },
      {
        speaker: 'Ren',
        text: "We're heading through it. Rook, you said you're between contracts?",
        speakerFaction: 'player',
      },
      {
        speaker: 'Rook',
        text: "You're doing something new. That's worth my blade. For now.",
        speakerFaction: 'player',
      },
      {
        speaker: 'Narrator',
        text: "An Imperial patrol blocks the harbor. Captain Sera's aerial unit circles overhead — a pegasus knight with a divebomb pattern.",
      },
    ],
  },
  epilogue: {
    lines: [
      {
        speaker: 'Narrator',
        text: 'The harbor is clear. Imperial banners hang torn in the sea wind.',
      },
      {
        speaker: 'Rook',
        text: 'So. This is what you do. Fight Imperials, recruit strays, keep moving.',
        speakerFaction: 'player',
      },
      { speaker: 'Ren', text: 'Something like that.', speakerFaction: 'player' },
      {
        speaker: 'Faye',
        text: 'That soldier I healed — he was barely older than us. Why are they fighting?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Rook',
        text: "Because someone told them to. That's how it works.",
        speakerFaction: 'player',
      },
      {
        speaker: 'Senna',
        text: "The anomalies are spreading faster than my models predicted. Whatever changed the seed... it's accelerating.",
        speakerFaction: 'player',
      },
      {
        speaker: 'Ren',
        text: 'Then we move faster. Next stop — the coastal fortress.',
        speakerFaction: 'player',
      },
    ],
  },
  villages: [
    {
      position: { x: 3, y: 12 },
      reward: {
        type: 'weapon',
        weaponId: 'steel_bow',
        dialogue: "My son was a sailor before the Empire came. He'd want you to have this.",
        speaker: 'Harbor Elder',
      },
    },
  ],
  reinforcements: [
    {
      turn: 8,
      units: [
        { unitId: 'ch6_reinforce_1', position: { x: 2, y: 0 } },
        { unitId: 'ch6_reinforce_2', position: { x: 13, y: 0 } },
        { unitId: 'ch6_reinforce_3', position: { x: 5, y: 0 } },
        { unitId: 'ch6_reinforce_4', position: { x: 10, y: 0 } },
      ],
      message: 'Imperial cavalry reinforcements arrive from the north!',
    },
    {
      turn: 12,
      units: [
        { unitId: 'ch6_reinforce_5', position: { x: 3, y: 0 } },
        { unitId: 'ch6_reinforce_6', position: { x: 12, y: 0 } },
        { unitId: 'ch6_reinforce_7', position: { x: 5, y: 0 } },
        { unitId: 'ch6_reinforce_8', position: { x: 10, y: 0 } },
        { unitId: 'ch6_reinforce_9', position: { x: 7, y: 0 } },
        { unitId: 'ch6_reinforce_10', position: { x: 8, y: 0 } },
      ],
      message: 'An overwhelming Imperial wave descends on the harbor!',
    },
  ],
  events: [
    // Turn 2: Rook combat callout
    {
      id: 'ch6_rook_callout',
      trigger: { type: 'turn_start', turn: 2 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Rook',
                text: 'Pegasus knights, wall sentries, and cavalry on the flanks. What did I sign up for?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Bram',
                text: 'You signed up for coin. Still want it?',
                speakerFaction: 'player',
              },
              { speaker: 'Rook', text: '...Double the rate.', speakerFaction: 'player' },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 4: Faye appears and joins
    {
      id: 'ch6_faye_joins',
      trigger: { type: 'turn_start', turn: 4 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Narrator',
                text: 'A mounted figure approaches from the southern docks, staff raised in peace.',
              },
              {
                speaker: 'Faye',
                text: 'Wait — please! There are wounded soldiers on both sides. I can help!',
                speakerFaction: 'player',
              },
              {
                speaker: 'Kael',
                text: "She's healing an Imperial soldier. Is she... on their side?",
                speakerFaction: 'player',
              },
              {
                speaker: 'Lira',
                text: "No. She's on the side of the hurt. I understand that.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Faye',
                text: "People are hurting. I can help. That's enough, isn't it?",
                speakerFaction: 'player',
              },
              {
                speaker: 'Ren',
                text: 'More than enough. Welcome, Faye.',
                speakerFaction: 'player',
              },
            ],
          },
        },
        {
          type: 'spawn_units',
          units: [{ unitId: 'faye', position: { x: 8, y: 13 } }],
          faction: 'player',
        },
      ],
      once: true,
    },
    // Turn 8: Reinforcement warning
    {
      id: 'ch6_reinforcement_warning',
      trigger: { type: 'turn_start', turn: 8 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Rook',
                text: "Cavalry from the north road. Heavy armor — these aren't scouts.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Ren',
                text: 'Reinforcements! We need to finish this and pull back!',
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 12: Overwhelming wave warning
    {
      id: 'ch6_overwhelming_wave',
      trigger: { type: 'turn_start', turn: 12 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Senna',
                text: "The north road — I'm counting at least a full company. We cannot hold this position.",
                speakerFaction: 'player',
              },
              { speaker: 'Ren', text: 'Everyone fall back! South, now!', speakerFaction: 'player' },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss killed
    {
      id: 'ch6_sera_defeat',
      trigger: { type: 'unit_killed', unitId: 'ch6_boss' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Sera',
                text: 'Do you even understand ALTITUDE? Tactical positioning is a three-dimensional problem — you ground-crawlers think in two dimensions!',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Ren',
                text: "She's... talking about flight sims?",
                speakerFaction: 'player',
              },
              {
                speaker: 'Sera',
                text: "COMBAT AVIATION. There's a DIFFERENCE.",
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Sera',
                text: "The sky... something is wrong with the sky. I've seen it from above — the clouds move in patterns that shouldn't exist.",
                speakerFaction: 'enemy',
              },
              { speaker: 'Ren', text: "I know. It's spreading.", speakerFaction: 'player' },
              {
                speaker: 'Sera',
                text: 'Then why are you walking INTO it?',
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
      unitB: 'rook',
      lines: [
        {
          speaker: 'Rook',
          text: "You fight like someone who's done this before. Many times before.",
          speakerFaction: 'player',
        },
        { speaker: 'Ren', text: 'What makes you say that?', speakerFaction: 'player' },
        {
          speaker: 'Rook',
          text: "You never hesitate. Not once. Either you're fearless or you already know what's going to happen.",
          speakerFaction: 'player',
        },
        { speaker: 'Ren', text: '...Maybe a bit of both.', speakerFaction: 'player' },
      ],
      reward: { type: 'exp_both', amount: 20 },
    },
    {
      unitA: 'lira',
      unitB: 'faye',
      lines: [
        {
          speaker: 'Lira',
          text: 'You healed that enemy soldier without hesitation. Most healers choose sides.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Faye',
          text: "Pain doesn't choose sides. Why should I?",
          speakerFaction: 'player',
        },
        {
          speaker: 'Lira',
          text: "That's... a different philosophy than mine. But I respect it deeply.",
          speakerFaction: 'player',
        },
        {
          speaker: 'Faye',
          text: "We'll make a good team. You guard the soul, I'll guard the body.",
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'faye', stat: 'mag', amount: 1 },
    },
  ],
};
