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
  [M, M, M, P, P, X, P, P, T, P, P, P, X, P, P, M, M, M], // row 16 — Genzo's last stand position (8,16)
  [M, M, M, P, P, X, P, P, P, P, P, P, X, P, P, M, M, M], // row 17 — corridor
  [M, M, M, P, P, P, P, P, P, P, P, P, P, P, P, M, M, M], // row 18 — south gate (reinforcements)
  [M, M, M, M, P, P, P, P, P, P, P, P, P, P, M, M, M, M], // row 19 — south edge
];

export const CHAPTER_8: ChapterData = {
  id: 'ch8',
  name: 'Chapter 8: The Last Stand',
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
  forceDeploy: ['shigeru', 'genzo'],
  parTurns: 20,
  prologue: {
    lines: [
      {
        speaker: 'Narrator',
        text: 'Night. The mountain fortress looms ahead. Two fronts — the throne room to the north, a corridor to the south where reinforcements will come.',
      },
      {
        speaker: 'Genzo',
        text: 'My lord. A word before we go in.',
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: 'Say it.', speakerFaction: 'player' },
      {
        speaker: 'Genzo',
        text: 'I served under Doumeki for six years. He does not defend a fortress — he opens the south gate, lets you commit, and closes it behind you.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: 'Then we split the company. Half north to the throne, half holding the corridor.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Genzo',
        text: 'No, lad. Half the company does not take Doumeki. You need everything you have going north, and one man in that corridor who knows how long it can be held.',
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: 'No.', speakerFaction: 'player' },
      {
        speaker: 'Genzo',
        text: 'My lord—',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'I said no. I have not lost anyone since Amagi and I am not starting tonight because it is efficient.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Genzo',
        text: 'You will lose someone tonight either way. The only question you get to answer is whether it is somebody who chose it.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Narrator',
        text: 'Nobody spoke for a long moment. Around them the company checked buckles and edges — small routine motions, done more slowly than usual.',
      },
      { speaker: 'Hina', text: 'May the dawn find us all.', speakerFaction: 'player' },
      {
        speaker: 'Narrator',
        text: 'Goro shifted his grip on his axe, looked at Genzo, and said nothing at all.',
      },
      {
        speaker: 'Mio',
        text: 'I will stay close to the corridor. I will.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Genzo',
        text: 'You will stay with the prince, girl. That is where the healing is needed.',
        speakerFaction: 'player',
      },
    ],
  },
  epilogue: {
    lines: [
      { speaker: 'Narrator', text: 'The fortress is taken. But the victory tastes like ash.' },
      {
        speaker: 'Shigeru',
        text: 'He asked me for permission and I gave it. I said the word out loud and then I turned around and walked north.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Kanna',
        text: 'You did. And the fortress is ours, and eleven of us are alive who would not be. Both of those are true at once, my lord. You will have to learn to hold them at once.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Narrator',
        text: 'Goro put his fist into the fortress wall. His knuckles split. Nobody stopped him.',
      },
      {
        speaker: 'Hina',
        text: 'He was a Kurogane man for eleven years and an Amagi man for six weeks. I will pray for him as an Amagi man. I do not think he would mind.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: 'He held that corridor for nine turns. Nine. Against a full company, on foot, alone. I have read the histories of this kingdom and there is nothing in them like it.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Mio',
        text: 'I could not reach him. I tried to get down the stair and there were too many and I could not—',
        speakerFaction: 'player',
      },
      {
        speaker: 'Raiga',
        text: 'None of us could. Girl — that was the entire idea. He picked a place where nobody could reach him so that nobody would have to try.',
        speakerFaction: 'player',
      },
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
                text: 'I will draw them. Goro, Raiga — take the flank while their eyes are on a horse.',
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
                text: 'Movement at the south gate. He is doing exactly what Genzo said he would.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'Then we go faster. Take Doumeki before that corridor fills.',
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
                text: 'The corridor is filling, my lord. Someone holds it or they take us from behind.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'We cannot spare anyone. I need every blade for the throne room.',
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 8: GENZO'S SACRIFICE — remove from player, spawn as NPC ally
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
                  { speaker: 'Shigeru', text: 'Genzo. Stand down.', speakerFaction: 'player' },
                  {
                    speaker: 'Genzo',
                    text: 'I am afraid I am going to disobey an order, my lord. It is becoming a habit.',
                    speakerFaction: 'player',
                  },
                  {
                    speaker: 'Genzo',
                    text: 'Eleven years I stood a post because a man told me to. This one I picked.',
                    speakerFaction: 'player',
                  },
                  { speaker: 'Shigeru', text: 'Genzo—', speakerFaction: 'player' },
                  {
                    speaker: 'Genzo',
                    text: 'Go north, my lord. And when you get to Takeshi, tell him a sergeant of the second wall company stopped believing him.',
                    speakerFaction: 'player',
                  },
                ],
              },
            },
            { type: 'remove_unit', unitId: 'genzo' },
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
    // Turn 10: Genzo fighting alone — party watches
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
                text: 'From the south corridor: the flat ring of a lance being set, over and over, in a doorway one man wide.',
              },
              {
                speaker: 'Hina',
                text: 'Can anyone see him? Is he still—',
                speakerFaction: 'player',
              },
              {
                speaker: 'Akira',
                text: 'He is holding. Do not waste it, Hina. North.',
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 12: Genzo fading — urgency
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
                text: 'He is slowing. My lord, whatever we are going to do, it has to be now.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'Everything forward. Take the throne. NOW.',
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 13: GENZO'S DEATH
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
                    text: 'In the south corridor the lance comes up one more time, more slowly than the last, and does not come down.',
                  },
                  { speaker: 'Genzo', text: 'Post... held...', speakerFaction: 'player' },
                  { speaker: 'Narrator', text: 'The doorway goes quiet.' },
                  { speaker: 'Shigeru', text: 'GENZO!', speakerFaction: 'player' },
                  {
                    speaker: 'Hina',
                    text: 'No — I can reach him, let me go, I can still—',
                    speakerFaction: 'player',
                  },
                  {
                    speaker: 'Raiga',
                    text: 'You cannot. Hold her, Goro.',
                    speakerFaction: 'player',
                  },
                  {
                    speaker: 'Narrator',
                    text: 'Nothing else came up the south corridor that night. It had taken a full company all evening to get past one man, and by then the throne was already lost.',
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
                text: 'The corridor. Nine turns. Who was it?',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: 'Sergeant Genzo. Second wall company. He served under you for six years.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Doumeki',
                text: '...Genzo. He was the only man in my command who ever asked me a question. I had him posted to a wall for it.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Doumeki',
                text: 'Boy. Go north and look at what your Emperor is carrying. Then decide whether any of us were ever soldiers at all.',
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
      unitA: 'shigeru',
      unitB: 'genzo',
      lines: [
        {
          speaker: 'Genzo',
          text: 'My lord. If it comes to it tonight — do not come back for me.',
          speakerFaction: 'player',
        },
        { speaker: 'Shigeru', text: 'I will not promise that.', speakerFaction: 'player' },
        {
          speaker: 'Genzo',
          text: 'Then promise me the other thing. Do not let it be for nothing. That is all a soldier actually asks for, whatever the songs say.',
          speakerFaction: 'player',
        },
        { speaker: 'Shigeru', text: 'Genzo...', speakerFaction: 'player' },
        {
          speaker: 'Genzo',
          text: 'Say yes, my lord. It costs you nothing tonight and it will cost you a great deal later, which is how you will know it was worth saying.',
          speakerFaction: 'player',
        },
        { speaker: 'Shigeru', text: '...Yes.', speakerFaction: 'player' },
      ],
      reward: { type: 'exp_both', amount: 30 },
    },
    {
      unitA: 'genzo',
      unitB: 'hina',
      lines: [
        {
          speaker: 'Hina',
          text: 'Genzo. You have been settled all evening. Everyone else is sick with nerves and you have been mending a strap.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Genzo',
          text: 'It needed mending.',
          speakerFaction: 'player',
        },
        { speaker: 'Hina', text: 'That is not what I asked.', speakerFaction: 'player' },
        {
          speaker: 'Genzo',
          text: 'I have been frightened for eleven years, girl — every day, on a wall, of the wrong things. Tonight I am frightened of something worth it. It is quite restful.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Hina',
          text: '...I am going to pray for you whether you like it or not.',
          speakerFaction: 'player',
        },
        { speaker: 'Genzo', text: 'I would take it kindly.', speakerFaction: 'player' },
      ],
      reward: { type: 'stat', unitId: 'genzo', stat: 'def', amount: 2 },
    },
  ],
};
