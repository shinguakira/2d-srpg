import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const X: TerrainType = 'wall';
const T: TerrainType = 'fort';
const H: TerrainType = 'throne';

// 18 columns x 20 rows — mountain fortress, two fronts (north throne + south corridor)
const terrain: TerrainType[][] = [
  // 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17
  [M, M, X, X, X, X, X, X, X, X, X, X, X, X, X, X, M, M], // row 0  — fortress north wall
  [M, X, P, P, P, P, P, P, P, H, P, P, P, P, P, P, X, M], // row 1  — throne at (9,1)
  [M, X, P, P, X, P, P, P, P, P, P, P, P, X, P, P, X, M], // row 2  — interior pillars
  [M, X, P, P, P, P, T, P, P, P, P, T, P, P, P, P, X, M], // row 3  — interior forts
  [M, X, X, P, P, P, P, P, P, P, P, P, P, P, P, X, X, M], // row 4  — inner gate
  [M, P, P, P, P, F, P, P, P, P, P, P, F, P, P, P, P, M], // row 5  — fortress exit
  [M, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, M], // row 6  — courtyard
  [M, P, P, F, P, P, P, T, P, P, T, P, P, P, F, P, P, M], // row 7  — defensive forts
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 8  — open field
  [P, P, F, P, P, P, P, P, P, P, P, P, P, P, P, F, P, P], // row 9  — approach
  [P, P, P, P, P, T, P, P, P, P, P, P, T, P, P, P, P, P], // row 10 — mid-field forts
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 11 — deployment area
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 12 — deployment row 1
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 13 — deployment row 2
  [M, M, P, P, P, X, X, P, P, P, P, X, X, P, P, P, M, M], // row 14 — south corridor entrance
  [M, M, M, P, P, X, P, P, P, P, P, P, X, P, P, M, M, M], // row 15 — corridor narrows
  [M, M, M, P, P, X, P, P, T, P, P, P, X, P, P, M, M, M], // row 16 — Akira's last stand position (8,16)
  [M, M, M, P, P, X, P, P, P, P, P, P, X, P, P, M, M, M], // row 17 — corridor
  [M, M, M, P, P, P, P, P, P, P, P, P, P, P, P, M, M, M], // row 18 — south gate (reinforcements)
  [M, M, M, M, P, P, P, P, P, P, P, P, P, P, M, M, M, M], // row 19 — south edge
];

export const CHAPTER_8: ChapterData = {
  id: 'ch8',
  name: 'Chapter 8: The Last Ride',
  chapterNumber: 8,
  mapWidth: 18,
  mapHeight: 20,
  terrain,
  playerUnits: [
    { unitId: 'shigeru', position: { x: 8, y: 12 } },
    { unitId: 'akira', position: { x: 9, y: 12 } },
    { unitId: 'kanna', position: { x: 8, y: 13 } },
    { unitId: 'goro', position: { x: 7, y: 13 } },
    { unitId: 'hina', position: { x: 10, y: 13 } },
    { unitId: 'genzo', position: { x: 7, y: 12 } },
    { unitId: 'raiga', position: { x: 10, y: 12 } },
    { unitId: 'mio', position: { x: 9, y: 13 } },
  ],
  enemyUnits: [
    // Boss on throne
    { unitId: 'ch8_boss', position: { x: 9, y: 1 } },
    // Throne room guards
    { unitId: 'ch8_knight_1', position: { x: 8, y: 2 } },
    { unitId: 'ch8_knight_2', position: { x: 10, y: 2 } },
    { unitId: 'ch8_knight_3', position: { x: 6, y: 3 } },
    { unitId: 'ch8_knight_4', position: { x: 11, y: 3 } },
    // Courtyard attackers
    { unitId: 'ch8_cavalier_1', position: { x: 5, y: 6 } },
    { unitId: 'ch8_cavalier_2', position: { x: 12, y: 6 } },
    { unitId: 'ch8_cavalier_3', position: { x: 9, y: 7 } },
    // Mages
    { unitId: 'ch8_mage_1', position: { x: 7, y: 5 } },
    { unitId: 'ch8_mage_2', position: { x: 10, y: 5 } },
  ],
  objective: {
    type: 'seize',
    description: 'Defeat General Doumeki and seize the throne',
  },
  seizePosition: { x: 9, y: 1 },
  deploymentSlots: 8,
  forceDeploy: ['shigeru', 'akira'],
  parTurns: 20,
  prologue: {
    lines: [
      {
        speaker: 'Narrator',
        text: 'Night. The mountain fortress looms ahead. Two fronts — the throne room to the north, a corridor to the south where reinforcements will come.',
      },
      { speaker: 'Shigeru', text: 'Akira. I need to tell you something.', speakerFaction: 'player' },
      {
        speaker: 'Akira',
        text: "You've been keeping something from me. I can tell.",
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: "This world... it's happened before. 347 times. Everything — the battles, the conversations, the deaths. I remember all of them.",
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: "...347 times? You've watched us fight this war 347 times?",
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'Yes. And every time, I lose people. I lose you.',
        speakerFaction: 'player',
      },
      { speaker: 'Akira', text: "I don't care.", speakerFaction: 'player' },
      { speaker: 'Shigeru', text: 'What?', speakerFaction: 'player' },
      {
        speaker: 'Akira',
        text: 'This is the first time I REMEMBER. So it counts. Whatever happens today — it counts because I chose it.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Narrator',
        text: 'The party moves into position. Each member checks their weapons. The gestures are small, routine — but tonight they carry weight.',
      },
      { speaker: 'Goro', text: '...', speakerFaction: 'player' },
      { speaker: 'Narrator', text: 'Goro adjusts his axe grip, glances at Akira, says nothing.' },
      { speaker: 'Hina', text: 'May the dawn find us all.', speakerFaction: 'player' },
      { speaker: 'Genzo', text: '...', speakerFaction: 'player' },
      { speaker: 'Narrator', text: "Genzo nods to Akira — a soldier's acknowledgment." },
      { speaker: 'Mio', text: "I'll stay close. Whatever happens.", speakerFaction: 'player' },
    ],
  },
  epilogue: {
    lines: [
      { speaker: 'Narrator', text: 'The fortress is taken. But the victory tastes like ash.' },
      {
        speaker: 'Shigeru',
        text: "I've seen him die 347 times. Why does this one hurt more?",
        speakerFaction: 'player',
      },
      {
        speaker: 'Kanna',
        text: 'Because this time he knew. He chose it.',
        speakerFaction: 'player',
      },
      { speaker: 'Goro', text: '...', speakerFaction: 'player' },
      {
        speaker: 'Narrator',
        text: 'Goro punches the fortress wall. His knuckles bleed. No one stops him.',
      },
      {
        speaker: 'Hina',
        text: 'May his soul find the peace that this world denied him.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Genzo',
        text: 'He held that corridor alone. Against everything. The garrison would have been proud.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Mio',
        text: "I couldn't reach him. I tried to get there and I couldn't—",
        speakerFaction: 'player',
      },
      { speaker: 'Raiga', text: 'None of us could. That was the point.', speakerFaction: 'player' },
      {
        speaker: 'Narrator',
        text: 'The grief settles over the party like armor — heavy, suffocating, and impossible to remove. All stats reduced by 3 for the next two chapters.',
      },
    ],
  },
  reinforcements: [
    {
      turn: 5,
      units: [
        { unitId: 'ch8_reinforce_1', position: { x: 8, y: 19 } },
        { unitId: 'ch8_reinforce_2', position: { x: 9, y: 19 } },
      ],
      message: 'Enemy soldiers pour through the south gate!',
    },
    {
      turn: 7,
      units: [
        { unitId: 'ch8_reinforce_3', position: { x: 7, y: 19 } },
        { unitId: 'ch8_reinforce_4', position: { x: 10, y: 19 } },
      ],
      message: 'More reinforcements from the south!',
    },
    {
      turn: 9,
      units: [
        { unitId: 'ch8_reinforce_5', position: { x: 8, y: 19 } },
        { unitId: 'ch8_reinforce_6', position: { x: 9, y: 19 } },
        { unitId: 'ch8_reinforce_7', position: { x: 7, y: 19 } },
      ],
      message: 'A final wave crashes against the south corridor!',
    },
  ],
  events: [
    // Turn 3: Tactical callout — throne room assessment
    {
      id: 'ch8_tactical_1',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Raiga',
                text: 'Knights guarding the throne room. Heavy armor — axes or magic will do better than swords.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Akira',
                text: "I'll draw their attention. You flank.",
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 5: South gate reinforcement warning
    {
      id: 'ch8_tactical_2',
      trigger: { type: 'turn_start', turn: 5 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Kanna',
                text: "South gate activity — they're sending reinforcements through the corridor.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'Push north. We take Doumeki before they overwhelm us.',
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 7: South reinforcements dialogue
    {
      id: 'ch8_south_spotted',
      trigger: { type: 'turn_start', turn: 7 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Genzo',
                text: "The south corridor — they're sending more. Someone has to hold the rear.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: "We can't split further. We need everyone for Doumeki.",
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 8: KAEL'S SACRIFICE — remove from player, spawn as NPC ally
    {
      id: 'ch8_genzo_to_npc',
      trigger: { type: 'turn_start', turn: 8 },
      effects: [
        {
          type: 'chain',
          effects: [
            {
              type: 'show_dialogue',
              scene: {
                lines: [
                  { speaker: 'Akira', text: "I'll hold the corridor.", speakerFaction: 'player' },
                  { speaker: 'Shigeru', text: "Akira, don't—", speakerFaction: 'player' },
                  {
                    speaker: 'Akira',
                    text: "You said I've done this 347 times without knowing. Now I know. And I'm choosing to do it anyway.",
                    speakerFaction: 'player',
                  },
                  { speaker: 'Akira', text: 'Was I brave this time?', speakerFaction: 'player' },
                  { speaker: 'Shigeru', text: 'Every time.', speakerFaction: 'player' },
                  { speaker: 'Akira', text: 'Then it counted.', speakerFaction: 'player' },
                ],
              },
            },
            { type: 'remove_unit', unitId: 'akira' },
            {
              type: 'spawn_units',
              units: [{ unitId: 'genzo_npc', position: { x: 8, y: 16 } }],
              faction: 'ally',
            },
          ],
        },
      ],
      once: true,
    },
    // Turn 10: Akira fighting alone — party watches
    {
      id: 'ch8_genzo_holding',
      trigger: { type: 'turn_start', turn: 10 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Narrator',
                text: 'In the south corridor, Akira fights alone. His lance catches the torchlight between strikes.',
              },
              { speaker: 'Hina', text: 'Can anyone see him? Is he—', speakerFaction: 'player' },
              { speaker: 'Genzo', text: "He's holding. Focus on Doumeki.", speakerFaction: 'player' },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 12: Akira fading — urgency
    {
      id: 'ch8_genzo_fading',
      trigger: { type: 'turn_start', turn: 12 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Narrator',
                text: 'The sounds from the south corridor are slowing. Fewer clashes. Longer pauses.',
              },
              {
                speaker: 'Kanna',
                text: "His vitals... they're dropping. We need to finish this NOW.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'Everyone — push! Take the throne!',
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 13: KAEL'S DEATH
    {
      id: 'ch8_genzo_death',
      trigger: { type: 'turn_start', turn: 13 },
      effects: [
        {
          type: 'chain',
          effects: [
            {
              type: 'show_dialogue',
              scene: {
                lines: [
                  {
                    speaker: 'Narrator',
                    text: 'In the south corridor, Akira staggers. His lance arm drops. The enemies close in.',
                  },
                  { speaker: 'Akira', text: 'Still... standing...', speakerFaction: 'player' },
                  { speaker: 'Narrator', text: 'He falls.' },
                  { speaker: 'Shigeru', text: 'KAEL!', speakerFaction: 'player' },
                  {
                    speaker: 'Hina',
                    text: 'No— I can get there— let me—',
                    speakerFaction: 'player',
                  },
                  { speaker: 'Raiga', text: "It's too late.", speakerFaction: 'player' },
                  {
                    speaker: 'Narrator',
                    text: 'The tile where Akira stood is empty. It is the loudest silence the party has ever heard.',
                  },
                ],
              },
            },
            { type: 'remove_unit', unitId: 'genzo_npc' },
            { type: 'set_flag', key: 'genzo_dead', value: 'true' },
          ],
        },
      ],
      once: true,
    },
    // Boss killed: Doumeki
    {
      id: 'ch8_doumeki_killed',
      trigger: { type: 'unit_killed', unitId: 'ch8_boss' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Doumeki',
                text: "I've killed you before. I remember it happening... AGAIN. And again. How many times have we done this?",
                speakerFaction: 'enemy',
              },
              { speaker: 'Shigeru', text: '347. But this is the last time.', speakerFaction: 'player' },
              { speaker: 'Doumeki', text: 'You always say that...', speakerFaction: 'enemy' },
            ],
          },
        },
      ],
      once: true,
    },
  ],
  supportConversations: [
    {
      unitA: 'shigeru',
      unitB: 'akira',
      lines: [
        {
          speaker: 'Akira',
          text: "If you've seen this 347 times... did I always volunteer?",
          speakerFaction: 'player',
        },
        { speaker: 'Shigeru', text: 'Always.', speakerFaction: 'player' },
        {
          speaker: 'Akira',
          text: "Good. That means it's who I am, not just what I'm told to do.",
          speakerFaction: 'player',
        },
        { speaker: 'Shigeru', text: 'Akira...', speakerFaction: 'player' },
        {
          speaker: 'Akira',
          text: "Don't. Just... let me be brave while I still can.",
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'exp_both', amount: 30 },
    },
    {
      unitA: 'akira',
      unitB: 'hina',
      lines: [
        {
          speaker: 'Hina',
          text: 'Akira, you seem different today. Lighter, somehow.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Akira',
          text: "I learned something today. About the world, about us. About how many times we've done this.",
          speakerFaction: 'player',
        },
        { speaker: 'Hina', text: 'And that makes you lighter?', speakerFaction: 'player' },
        {
          speaker: 'Akira',
          text: 'It makes me certain. For the first time in my life, I know exactly who I am.',
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'akira', stat: 'def', amount: 2 },
    },
  ],
};
