import type { ChapterData, TerrainType } from '../../core/types';

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
  name: 'Chapter 1: The Road to Kuta',
  chapterNumber: 1,
  mapWidth: 25,
  mapHeight: 12,
  terrain,
  playerUnits: [
    { unitId: 'shigeru', position: { x: 10, y: 10 } },
    { unitId: 'akira', position: { x: 13, y: 10 } },
    { unitId: 'lisette', position: { x: 9, y: 11 } },
    { unitId: 'mirelle', position: { x: 14, y: 11 } },
    { unitId: 'gareth', position: { x: 12, y: 11 } },
  ],
  enemyUnits: [
    { unitId: 'fighter_1', position: { x: 8, y: 2 } },
    { unitId: 'fighter_3', position: { x: 11, y: 4 } },
    { unitId: 'soldier_1', position: { x: 5, y: 1 } },
    { unitId: 'hagen', position: { x: 11, y: 1 } }, // boss on throne
  ],
  objective: {
    type: 'seize',
    description: 'Seize the throne',
  },
  seizePosition: { x: 11, y: 1 },
  prologue: {
    lines: [
      {
        speaker: 'Narrator',
        text: 'The Kurogane fleet came ashore at Komoda Beach at first light, and the king rode west to meet them on the sand. By dusk he was dead and Izuhara was burning. By noon the next day the prince was on the coast road south with what was left of his father’s guard.',
      },
      {
        speaker: 'Akira',
        text: 'My lord — the keep at Kuta has fallen. Brigands, flying Kurogane colours. They have the village pinned against the river.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'Then we take it back. The south road runs through that gate, and we have nowhere else to be.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: 'You have not slept since the palace. Neither has anyone. If you would rather we—',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'I would rather my father were alive. Form up.',
        speakerFaction: 'player',
      },
    ],
  },
  villages: [
    {
      position: { x: 3, y: 3 },
      reward: {
        type: 'weapon',
        weaponId: 'hand_axe',
        dialogue:
          'Take my father’s hand axe, my lord. It throws true. He would rather it went with you than rusted over my hearth.',
        speaker: 'Villager',
      },
    },
    {
      position: { x: 18, y: 3 },
      reward: {
        type: 'weapon',
        weaponId: 'wind',
        dialogue:
          'The old scholar left this tome when he fled inland. Not one of us can read a word of it. Perhaps your mage can.',
        speaker: 'Villager',
      },
    },
  ],
  epilogue: {
    lines: [
      {
        speaker: 'Akira',
        text: 'The gate is ours, my lord. A victory.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'A gate. We hold one gate, and the kingdom is gone.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: 'Excuse me! Is this the royal company? I have run here from the Shiratake shrine and I have blisters in places I will not describe.',
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: '...Who are you?', speakerFaction: 'player' },
      {
        speaker: 'Mirelle',
        text: 'Mirelle. Shrine maiden. The high priestess sent me to find the bearer of the Flamebrand, and I have found him, so please hold still while I look at that arm.',
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: 'It is nothing.', speakerFaction: 'player' },
      {
        speaker: 'Mirelle',
        text: 'It is four inches long and you have favoured it since I arrived. Sit down.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Narrator',
        text: 'The prince sat. It was the only order anyone gave him that day that he obeyed.',
      },
    ],
  },
  deploymentSlots: 5,
  forceDeploy: ['shigeru'],
  skipPreparation: true,
  parTurns: 8,
  events: [
    // Turn 2 — Goro’s arrival
    {
      id: 'ch1_gareth_arrival',
      trigger: { type: 'turn_start', turn: 2 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Gareth',
                text: 'Oi! Down here! Is that the royal banner? I have been swinging at these bastards since sunup and it is getting lonely!',
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'Who are you?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Gareth',
                text: 'Gareth. I fell trees for a living. Turns out men come down about the same way.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Akira',
                text: 'My lord, he is a woodcutter with an axe and no discipline whatsoever.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Gareth',
                text: 'And you are a man on a horse who talks like a written letter. Are we fighting, or are we being introduced?',
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 3 — Weapon triangle lesson
    {
      id: 'ch1_weapon_triangle',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Gareth',
                text: 'Why did that lancer shrug me off? I caught him square!',
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: 'Because you caught him with an axe. Lances beat axes, swords beat lances, axes beat swords. Every drillmaster on the continent teaches it.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Gareth',
                text: 'So I should have brought a sword.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: 'You should have brought a lance. Do try to keep up.',
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 4 — Boss intro
    {
      id: 'ch1_boss_intro',
      trigger: { type: 'turn_start', turn: 4 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Hagen',
                text: 'A royal banner. On my road.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: 'Your road?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Hagen',
                text: 'Twenty years I have worked this stretch. A toll here, a toll there, nobody hurt who paid. Then Kurogane came through with real coin and real orders.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Akira',
                text: 'You are a brigand taking an emperor’s pay to hold a gate against your own countrymen.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Hagen',
                text: 'I am a man that army was going to walk over either way. This way I got paid first.',
                speakerFaction: 'enemy',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss pre-combat — Shigeru approaches the throne
    {
      id: 'ch1_boss_precombat',
      trigger: { type: 'unit_at', unitId: 'shigeru', position: { x: 11, y: 2 } },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Hagen',
                text: 'So you are the prince. You look about twelve.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: 'Take your men south. I will not chase you.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Hagen',
                text: 'Can’t. Kurogane holds my brother’s village. That is the other half of the pay.',
                speakerFaction: 'enemy',
              },
              { speaker: 'Shigeru', text: '...Then I am sorry.', speakerFaction: 'player' },
              { speaker: 'Hagen', text: 'Don’t be sorry. Be quick.', speakerFaction: 'enemy' },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss killed
    {
      id: 'ch1_boss_killed',
      trigger: { type: 'unit_killed', unitId: 'hagen' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Hagen',
                text: 'Kuta. The village is called Kuta. Somebody ought to know that.',
                speakerFaction: 'enemy',
              },
              { speaker: 'Shigeru', text: 'I will remember it.', speakerFaction: 'player' },
              {
                speaker: 'Hagen',
                text: '...That is more than I expected from a prince.',
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
      unitB: 'akira',
      lines: [
        {
          speaker: 'Akira',
          text: 'My lord. You have not eaten since Amagi.',
          speakerFaction: 'player',
        },
        { speaker: 'Shigeru', text: 'I am not hungry.', speakerFaction: 'player' },
        {
          speaker: 'Akira',
          text: 'That was not a question about your appetite.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: '...If I stop moving I will have to think about it. So I do not stop.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Akira',
          text: 'Then I will keep your pace. And when you do stop, I will be there for that as well.',
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'exp_both', amount: 20 },
    },
    {
      unitA: 'lisette',
      unitB: 'mirelle',
      lines: [
        {
          speaker: 'Mirelle',
          text: 'Lisette, may I ask you something? Do you believe the Sacred Flames hear us when we pray?',
          speakerFaction: 'player',
        },
        {
          speaker: 'Lisette',
          text: 'I believe the shrines are warm, that warm people are calmer, and that calm soldiers fight better. Whether anything is listening, I have no way to measure.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Mirelle',
          text: 'That is the kindest refusal anyone has ever given me.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Lisette',
          text: 'It was not a refusal. I said I cannot measure it. Those are different things.',
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'mirelle', stat: 'mag', amount: 1 },
    },
  ],
};
