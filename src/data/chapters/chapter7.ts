import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const W: TerrainType = 'water';
const X: TerrainType = 'wall';
const T: TerrainType = 'fort';

// 16 columns x 16 rows — the fortress at the Cut; blighted seaward edge along row 0
const terrain: TerrainType[][] = [
  // 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
  [W, W, P, P, P, P, P, P, P, P, P, P, P, P, W, W], // row 0  — blighted seaward edge (revenant spawns)
  [W, P, P, X, X, P, P, P, P, P, P, X, X, P, P, W], // row 1  — fortress walls
  [M, P, P, X, T, P, P, P, P, P, P, T, X, P, P, M], // row 2  — forts inside walls (Varro at 4,2)
  [M, P, P, P, P, P, X, P, P, X, P, P, P, P, P, M], // row 3  — inner corridors (2-wide)
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 4  — open courtyard
  [P, P, X, X, P, P, P, T, T, P, P, P, X, X, P, P], // row 5  — central fortifications
  [P, P, X, P, P, P, P, P, P, P, P, P, P, X, P, P], // row 6  — corridor sides
  [P, P, P, P, P, F, P, P, P, P, F, P, P, P, P, P], // row 7  — transition zone
  [M, P, P, P, T, F, P, P, P, P, F, T, P, P, P, M], // row 8  — secondary defense line
  [M, P, P, F, F, P, P, P, P, P, P, F, F, P, P, M], // row 9  — forest belt
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 10 — open ground
  [P, P, F, P, P, P, T, P, P, T, P, P, P, F, P, P], // row 11 — rear forts
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 12 — deployment area
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 13 — deployment row 1
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 14 — deployment row 2
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 15 — deployment row 3
];

export const CHAPTER_7: ChapterData = {
  id: 'ch7',
  name: 'Chapter 7: What the Wall Held',
  chapterNumber: 7,
  mapWidth: 16,
  mapHeight: 16,
  terrain,
  playerUnits: [
    { unitId: 'shigeru', position: { x: 7, y: 13 } },
    { unitId: 'akira', position: { x: 8, y: 13 } },
    { unitId: 'lisette', position: { x: 7, y: 14 } },
    { unitId: 'gareth', position: { x: 6, y: 14 } },
    { unitId: 'mirelle', position: { x: 9, y: 14 } },
    { unitId: 'corwin', position: { x: 6, y: 13 } },
    { unitId: 'nadine', position: { x: 9, y: 13 } },
  ],
  enemyUnits: [
    { unitId: 'ch7_boss', position: { x: 4, y: 2 } }, // Admiral Varro on fort
    { unitId: 'ch7_soldier_1', position: { x: 7, y: 4 } }, // courtyard
    { unitId: 'ch7_soldier_2', position: { x: 8, y: 4 } }, // courtyard
    { unitId: 'ch7_fighter_1', position: { x: 5, y: 7 } }, // transition zone
    { unitId: 'ch7_fighter_2', position: { x: 10, y: 7 } }, // transition zone
    { unitId: 'ch7_mage_1', position: { x: 6, y: 5 } }, // central fort
    { unitId: 'ch7_mage_2', position: { x: 9, y: 5 } }, // central fort
  ],
  objective: {
    type: 'survive',
    turns: 12,
    description: 'Survive for 12 turns',
  },
  deploymentSlots: 7,
  forceDeploy: ['shigeru'],
  parTurns: 12,
  prologue: {
    lines: [
      {
        speaker: 'Narrator',
        text: 'The fortress at the Cut, where the channel splits the island in two. These walls have stood two hundred years. Tonight something is moving inside the seaward wall itself.',
      },
      {
        speaker: 'Lisette',
        text: 'I have been at the ward readings all night. The blight is not spreading at random. It is answering.',
        speakerFaction: 'player',
      },
      { speaker: 'Akira', text: 'Answering what?', speakerFaction: 'player' },
      {
        speaker: 'Lisette',
        text: 'Me. Every time I chart where it will surface next, it surfaces somewhere else. Not once. Eleven times in a row. That is not weather, that is a thing that knows it is being looked at.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Corwin',
        text: 'Admiral Varro holds the keep above the channel. Old garrison, disciplined, spread thin along the wall.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'Hold the line and nobody chases. Lisette, stay at the rear — I need your eyes on the north wall, not on a lance.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: 'My eyes may be worth very little today, my lord. I want that said aloud before it matters.',
        speakerFaction: 'player',
      },
    ],
  },
  epilogue: {
    lines: [
      {
        speaker: 'Narrator',
        text: 'The revenants stop coming. The fortress goes quiet, and the quiet is worse than the noise was.',
      },
      {
        speaker: 'Lisette',
        text: 'Six years of ward theory. Every book in the royal archive. All of it built on the one thing everyone agrees on — that a seal does not think. And it thinks, my lord. It waited for me to commit my readings and then it moved.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'Then stop trying to predict it.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: 'That is all I am. Take the predicting away and there is a small rude woman with bad eyesight and no lance.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'You have been asking where it will go. Ask what it wants instead. You are the only one of us who could tell the difference.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: '...That is not a measurement.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: 'No. It is a question. Those are allowed too.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: 'Whatever your readings said, you kept the north wall standing for twelve turns. I was on it. I noticed.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Gareth',
        text: 'And you shouted the right things at the right people. That is most of what a commander does, and you did it without a horse.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Narrator',
        text: 'That night Lisette burned two years of charts, and started a new book with one line at the top of it: WHAT DOES IT WANT?',
      },
    ],
  },
  reinforcements: [
    {
      turn: 3,
      units: [
        { unitId: 'ch7_corrupted_1', position: { x: 5, y: 0 } },
        { unitId: 'ch7_corrupted_2', position: { x: 10, y: 0 } },
      ],
      message: 'Revenants claw their way out of the north wall!',
    },
    {
      turn: 5,
      units: [
        { unitId: 'ch7_corrupted_3', position: { x: 3, y: 0 } },
        { unitId: 'ch7_corrupted_4', position: { x: 12, y: 0 } },
      ],
      message: 'More revenants pull themselves free!',
    },
    {
      turn: 7,
      units: [
        { unitId: 'ch7_corrupted_5', position: { x: 4, y: 0 } },
        { unitId: 'ch7_corrupted_6', position: { x: 11, y: 0 } },
        { unitId: 'ch7_corrupted_7', position: { x: 7, y: 0 } },
      ],
      message: 'The wall splits wider — three more come through!',
    },
    {
      turn: 9,
      units: [{ unitId: 'ch7_corrupted_8', position: { x: 8, y: 0 } }],
      message: 'One last thing drags itself out of the stone!',
    },
  ],
  events: [
    // Turn 1: Lisette's forecast is off
    {
      id: 'ch7_lisette_off',
      trigger: { type: 'turn_start', turn: 1 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Lisette',
                text: 'The ward-stone has gone cold. Not cracked — cold, as though there were nothing left out west for it to point at.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'That could be good news.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: 'It could. It could also mean it is no longer out west. Watch the wall, my lord.',
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 3: Corrupted spawn + Lisette crisis
    {
      id: 'ch7_lisette_crisis',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Lisette',
                text: 'The north wall. The stone is going grey and something is climbing out of it.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Gareth',
                text: 'Those are not soldiers. Gods — that one is wearing Amagi colours.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Mirelle',
                text: 'They are revenants. The Blackflame does not kill men, it hollows them and stands them back up. Do not look at their faces. Please do not look at their faces.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'New orders. Nobody advances. We hold this courtyard and we outlast them.',
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 6: Lisette breakdown
    {
      id: 'ch7_lisette_breakdown',
      trigger: { type: 'turn_start', turn: 6 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Lisette',
                text: 'I called the east stair and it came up the west. I called the west and it came through the floor. It is not outrunning me — it is waiting to hear what I say.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Nadine',
                text: 'Lisette. Breathe. In, and out, and again.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: 'You do not understand. My whole use to this company is knowing. If I cannot know, what am I standing here for?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Corwin',
                text: 'Then stop calling it out loud, lass. Write it down and hand it to the prince. If the cursed thing is listening, make it work for what it hears.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: '...That is a horrible idea. Give me your chalk.',
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 9: Party rallies
    {
      id: 'ch7_rally',
      trigger: { type: 'turn_start', turn: 9 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Shigeru',
                text: "Three more turns. Hold the line — we're almost through this.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: '...Fewer of them each wave. Whatever is pushing them up through that wall is tiring.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Akira',
                text: 'Then we outlast it. That is a thing we are good at.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'Lisette. Keep writing. I will keep reading.',
                speakerFaction: 'player',
              },
              { speaker: 'Lisette', text: '...Thank you.', speakerFaction: 'player' },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 11: Corruption fading, survive almost complete
    {
      id: 'ch7_corruption_fading',
      trigger: { type: 'turn_start', turn: 11 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Lisette',
                text: 'Thinner again. Whatever fuel it had, it is nearly through it. One more turn!',
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'Hold your ground! One more push and the wall is ours!',
                speakerFaction: 'player',
              },
              {
                speaker: 'Narrator',
                text: 'Along the north wall the grey stone dulls and stops moving. Whatever was pushing through it has stopped pushing.',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 12: Survive complete — brief relief
    {
      id: 'ch7_survive_relief',
      trigger: { type: 'turn_start', turn: 12 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Lisette',
                text: 'Nothing more is coming out of the wall. It is spent.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Akira',
                text: 'We made it. Everyone still standing?',
                speakerFaction: 'player',
              },
              { speaker: 'Shigeru', text: 'Still standing. Barely.', speakerFaction: 'player' },
            ],
          },
        },
      ],
      once: true,
    },
    // Optional boss killed: Varro
    {
      id: 'ch7_isonami_killed',
      trigger: { type: 'unit_killed', unitId: 'ch7_boss' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Varro',
                text: 'Two hundred years this keep has held the Cut. It will hold after me.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: 'You watched your own wall turn grey, Admiral. You know it will not.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Narrator',
                text: "Admiral Varro's Hero Crest clatters to the stone floor.",
              },
            ],
          },
        },
        { type: 'give_item', unitId: 'shigeru', itemId: 'hero_crest' },
      ],
      once: true,
    },
  ],
  supportConversations: [
    {
      unitA: 'shigeru',
      unitB: 'lisette',
      lines: [
        {
          speaker: 'Lisette',
          text: 'My lord. When you were seven you fell off the archive ladder trying to reach the ward-theory shelf.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: 'You were there?',
          speakerFaction: 'player',
        },
        {
          speaker: 'Lisette',
          text: 'I was holding the ladder. Badly. Your father did not have me flogged, which surprised everyone including your father.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: 'He said you had the only interesting question in the room.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Lisette',
          text: '...He said that? Well. Then I had better find another one.',
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'lisette', stat: 'mag', amount: 1 },
    },
    {
      unitA: 'lisette',
      unitB: 'fenn',
      lines: [
        {
          speaker: 'Fenn',
          text: 'So your readings lie to you now. Welcome. That is how every day of my life has gone.',
          speakerFaction: 'player',
        },
        { speaker: 'Lisette', text: 'That is not helpful, Fenn.', speakerFaction: 'player' },
        {
          speaker: 'Fenn',
          text: 'It was not meant to be helpful, it was meant to be true. You want to know how a thief works a house that lies to them?',
          speakerFaction: 'player',
        },
        { speaker: 'Lisette', text: '...Go on.', speakerFaction: 'player' },
        {
          speaker: 'Fenn',
          text: 'You stop asking what is behind the door. You watch which door the owner never opens. Things give themselves away by what they protect.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Lisette',
          text: 'Fenn. That is genuinely the most useful thing anyone has said to me this month, and I resent it enormously.',
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'exp_both', amount: 20 },
    },
  ],
};
