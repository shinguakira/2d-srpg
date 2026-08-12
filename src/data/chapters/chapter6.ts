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
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 13 — south approach (Nadine appears)
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 14 — deployment area
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 15 — deployment row 1
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 16 — deployment row 2
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 17 — south escape zone
];

export const CHAPTER_6: ChapterData = {
  id: 'ch6',
  name: 'Chapter 6: The Harbour at Kechi',
  chapterNumber: 6,
  mapWidth: 16,
  mapHeight: 18,
  terrain,
  playerUnits: [
    { unitId: 'shigeru', position: { x: 7, y: 15 } },
    { unitId: 'akira', position: { x: 8, y: 15 } },
    { unitId: 'lisette', position: { x: 7, y: 16 } },
    { unitId: 'gareth', position: { x: 6, y: 16 } },
    { unitId: 'mirelle', position: { x: 9, y: 16 } },
    { unitId: 'corwin', position: { x: 6, y: 15 } },
    { unitId: 'halvar', position: { x: 9, y: 15 } },
  ],
  enemyUnits: [
    { unitId: 'ch6_boss', position: { x: 7, y: 3 } }, // Captain Aeryn on fort
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
    description: 'Defeat Captain Aeryn',
  },
  deploymentSlots: 7,
  forceDeploy: ['shigeru'],
  parTurns: 16,
  recruitableUnits: ['corwin', 'nadine'],
  prologue: {
    lines: [
      {
        speaker: 'Narrator',
        text: 'The harbour at Kechi, on the inner water of Aso Bay. Salt air and smoke off the headlands. The company arrives at dawn looking for a hull that will carry them.',
      },
      {
        speaker: 'Corwin',
        text: 'Corwin. Sellsword. My last contract was a pack train out of the Sasu valley. There is no pack train and there is no Sasu valley, so here I am.',
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: 'No valley.', speakerFaction: 'player' },
      {
        speaker: 'Corwin',
        text: 'Grey ground where the road was, from Shimobaru to the river mouth. I walked back the way I came and there was nothing to walk back to. Do not ask me to describe it better than that.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: 'My lord, that is the fifth mark, and it is behind us now. It went past us in the night.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: 'Past us? Then it is between us and every road south.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'Which settles the argument. We were turning west anyway. Corwin — you said you were between contracts.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Corwin',
        text: 'Everyone else on this bay is running east. You are the only fools walking the other way. I want to see how that ends.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Narrator',
        text: 'A Kurogane patrol holds the harbour. Captain Tsubame’s riders wheel above the masts, waiting for a target to stand still.',
      },
    ],
  },
  epilogue: {
    lines: [
      {
        speaker: 'Narrator',
        text: 'The harbor is clear. Kurogane banners hang torn in the sea wind.',
      },
      {
        speaker: 'Corwin',
        text: 'So this is the work. Fight Kurogane, pick up strays, keep walking.',
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: 'Something like that.', speakerFaction: 'player' },
      {
        speaker: 'Nadine',
        text: 'The soldier I set a bone for — he was younger than me. He kept apologising while I worked. What is he even fighting for?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Corwin',
        text: 'Because a man he has never met told him to. That is the whole of it, girl, in every war there has ever been.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Halvar',
        text: 'It is not quite the whole of it. He is fighting because Takeshi told him the war would be the last one. Every soldier in Kurogane believes that. It is why they march so well.',
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: 'And do you still believe it?', speakerFaction: 'player' },
      {
        speaker: 'Halvar',
        text: '...I believe he believes it. That is the part that frightens me, my lord.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'Then we make time. The Cut next — and after that, west.',
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
        dialogue: "My son was a sailor before Kurogane came. He'd want you to have this.",
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
      message: 'Kurogane cavalry arrive from the north!',
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
      message: 'A full Kurogane column pours into the harbour!',
    },
  ],
  events: [
    // Turn 2: Corwin combat callout
    {
      id: 'ch6_corwin_callout',
      trigger: { type: 'turn_start', turn: 2 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Corwin',
                text: 'Pegasus knights, wall sentries, and cavalry on the flanks. What did I sign up for?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Gareth',
                text: 'You signed up for coin. Still want it?',
                speakerFaction: 'player',
              },
              { speaker: 'Corwin', text: '...Double the rate.', speakerFaction: 'player' },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 4: Nadine appears and joins
    {
      id: 'ch6_nadine_joins',
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
                speaker: 'Nadine',
                text: 'Wait — please! There are wounded soldiers on both sides. I can help!',
                speakerFaction: 'player',
              },
              {
                speaker: 'Akira',
                text: "She is binding a Kurogane man's wounds. Is she one of theirs?",
                speakerFaction: 'player',
              },
              {
                speaker: 'Mirelle',
                text: 'No. She is on the side of the hurt. I know that side.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Nadine',
                text: 'People are hurt and I can help. That has always been enough for me.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'More than enough. Welcome, Nadine.',
                speakerFaction: 'player',
              },
            ],
          },
        },
        {
          type: 'spawn_units',
          units: [{ unitId: 'nadine', position: { x: 8, y: 13 } }],
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
                speaker: 'Corwin',
                text: "Cavalry from the north road. Heavy armor — these aren't scouts.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
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
                speaker: 'Lisette',
                text: "The north road — I'm counting at least a full company. We cannot hold this position.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'Everyone fall back! South, now!',
                speakerFaction: 'player',
              },
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
                speaker: 'Aeryn',
                text: 'Beaten out of the air by a girl on a farm pegasus. My instructors would weep.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Elin',
                text: 'Your riders held formation. That is why I could predict every one of you.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Aeryn',
                text: '...Noted. Rider — you have flown north. Tell me you have seen it too.',
                speakerFaction: 'enemy',
              },
              { speaker: 'Elin', text: 'The hole in the sky. Yes.', speakerFaction: 'player' },
              {
                speaker: 'Aeryn',
                text: 'I reported it as weather. Twice. The second report came back with my commission attached to it and a note telling me to fly lower.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: 'We are going north to see what it is.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Aeryn',
                text: 'Then you are braver than my whole wing, boy, and I hope somebody writes it down.',
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
      unitB: 'corwin',
      lines: [
        {
          speaker: 'Corwin',
          text: 'You count your dead by name. Out loud, every night, when you think nobody is listening.',
          speakerFaction: 'player',
        },
        { speaker: 'Shigeru', text: 'Is that a criticism?', speakerFaction: 'player' },
        {
          speaker: 'Corwin',
          text: 'It is an observation. I have served eleven captains. The good ones did that for about a year, and then they stopped.',
          speakerFaction: 'player',
        },
        { speaker: 'Shigeru', text: 'Why did they stop?', speakerFaction: 'player' },
        {
          speaker: 'Corwin',
          text: 'Because the list gets long, lad. Every one of them thought they would be the exception too.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: '...Then tell me when I stop. That is an order, Corwin.',
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'exp_both', amount: 20 },
    },
    {
      unitA: 'mirelle',
      unitB: 'nadine',
      lines: [
        {
          speaker: 'Mirelle',
          text: 'You healed that enemy soldier without hesitation. Most healers choose sides.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Nadine',
          text: "Pain doesn't choose sides. Why should I?",
          speakerFaction: 'player',
        },
        {
          speaker: 'Mirelle',
          text: "That's... a different philosophy than mine. But I respect it deeply.",
          speakerFaction: 'player',
        },
        {
          speaker: 'Nadine',
          text: "We'll make a good team. You guard the soul, I'll guard the body.",
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'nadine', stat: 'mag', amount: 1 },
    },
  ],
};
