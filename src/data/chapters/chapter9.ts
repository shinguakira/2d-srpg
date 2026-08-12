import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const T: TerrainType = 'fort';
const V: TerrainType = 'village';

// 14 columns x 14 rows — narrow forest pass, linear escape route
const terrain: TerrainType[][] = [
  // 0  1  2  3  4  5  6  7  8  9  10 11 12 13
  [M, M, F, F, P, P, F, F, P, P, F, F, M, M], // row 0  — north entry (pursuers)
  [M, F, P, F, P, P, F, F, P, P, F, P, F, M], // row 1
  [F, F, P, P, P, F, P, P, F, P, P, P, F, F], // row 2  — scattered enemies
  [F, P, P, P, P, P, P, P, P, P, P, P, P, F], // row 3  — Kagura appears here
  [M, F, P, P, T, P, P, P, P, T, P, P, F, M], // row 4  — forts for defense
  [F, F, P, F, F, P, P, P, P, F, F, P, F, F], // row 5  — forest corridor
  [F, P, P, F, P, P, P, P, P, P, F, P, P, F], // row 6
  [M, P, P, P, P, F, P, P, F, P, P, P, P, M], // row 7  — mid-map clearing
  [F, F, P, P, T, F, P, P, F, T, P, P, F, F], // row 8  — forts + forest chokepoint
  [F, P, P, F, F, P, P, P, P, F, F, P, P, F], // row 9
  [M, F, P, P, P, P, P, P, P, P, P, P, F, M], // row 10 — approach clearing
  [P, F, P, P, F, P, P, P, P, F, P, P, V, P], // row 11 — village at (12,11)
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 12 — deployment row 1
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 13 — deployment row 2
];

export const CHAPTER_9: ChapterData = {
  id: 'ch9',
  name: 'Chapter 9: The Void Left Behind',
  chapterNumber: 9,
  mapWidth: 14,
  mapHeight: 14,
  terrain,
  playerUnits: [
    { unitId: 'shigeru', position: { x: 6, y: 12 } },
    { unitId: 'kanna', position: { x: 7, y: 12 } },
    { unitId: 'goro', position: { x: 5, y: 13 } },
    { unitId: 'hina', position: { x: 8, y: 13 } },
    { unitId: 'genzo', position: { x: 6, y: 13 } },
    { unitId: 'sayo', position: { x: 7, y: 13 } },
    { unitId: 'raiga', position: { x: 5, y: 12 } },
  ],
  enemyUnits: [
    { unitId: 'ch9_raider_captain', position: { x: 7, y: 0 } },
    { unitId: 'ch9_soldier_1', position: { x: 4, y: 2 } },
    { unitId: 'ch9_soldier_2', position: { x: 10, y: 2 } },
    { unitId: 'ch9_soldier_3', position: { x: 7, y: 5 } },
    { unitId: 'ch9_fighter_1', position: { x: 3, y: 6 } },
    { unitId: 'ch9_fighter_2', position: { x: 11, y: 6 } },
    { unitId: 'ch9_fighter_3', position: { x: 7, y: 8 } },
    { unitId: 'ch9_archer_1', position: { x: 5, y: 4 } },
    { unitId: 'ch9_archer_2', position: { x: 9, y: 4 } },
  ],
  objective: {
    type: 'rout',
    description: 'Defeat all enemies',
  },
  deploymentSlots: 7,
  forceDeploy: ['shigeru'],
  parTurns: 18,
  prologue: {
    lines: [
      {
        speaker: 'Narrator',
        text: 'A narrow forest pass. The party retreats south in silence. One formation slot stands empty.',
      },
      { speaker: 'Goro', text: '...', speakerFaction: 'player' },
      {
        speaker: 'Kanna',
        text: "I've plotted the route. It's linear — forest cover on both sides, a few defensive positions. We should be through in a day.",
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'Everyone stays close. No heroics. We move as a group.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Genzo',
        text: 'He would have been on point. Akira always took point.',
        speakerFaction: 'player',
      },
      { speaker: 'Hina', text: '...I know.', speakerFaction: 'player' },
      {
        speaker: 'Raiga',
        text: 'Raiders ahead. Scouts, by the look of them. Not organized enough to be Imperial.',
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: 'Then we clear the path. Together.', speakerFaction: 'player' },
    ],
  },
  epilogue: {
    lines: [
      {
        speaker: 'Narrator',
        text: 'The forest thins. The party emerges into open ground, bruised but intact.',
      },
      {
        speaker: 'Kagura',
        text: 'That was... not what I expected when I joined a traveling company.',
        speakerFaction: 'player',
      },
      { speaker: 'Goro', text: "We're not a traveling company.", speakerFaction: 'player' },
      {
        speaker: 'Kagura',
        text: "No. You're not. You're something that lost its heart and keeps walking anyway.",
        speakerFaction: 'player',
      },
      {
        speaker: 'Narrator',
        text: "For a moment, the performer's mask slips. Kagura's eyes hold something older than comedy.",
      },
      {
        speaker: 'Kagura',
        text: "...I've seen that look before. In better stories than mine. It doesn't go away. But it gets quieter.",
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: 'Thank you, Kagura.', speakerFaction: 'player' },
      { speaker: 'Goro', text: "...You're alright, performer.", speakerFaction: 'player' },
      {
        speaker: 'Hina',
        text: 'Stay with us. We could use someone who still knows how to smile.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Kanna',
        text: "The grief is still weighing on us. Our stats won't recover until after the next engagement.",
        speakerFaction: 'player',
      },
    ],
  },
  villages: [
    {
      position: { x: 12, y: 11 },
      reward: {
        type: 'weapon',
        weaponId: 'steel_sword',
        dialogue: "A woodsman's blade, kept sharp for wolves. Take it — you need it more than us.",
        speaker: 'Villager',
      },
    },
  ],
  events: [
    // Turn 1: Akira absence felt
    {
      id: 'ch9_genzo_absence',
      trigger: { type: 'turn_start', turn: 1 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Sayo',
                text: 'The left flank is exposed. Akira would have covered it.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Raiga',
                text: "I'll take it. Not as fast, but I can hold.",
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 3: Kagura appears and joins
    {
      id: 'ch9_kagura_joins',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Narrator',
                text: 'A figure steps out of the treeline, arms spread wide as if expecting applause.',
              },
              {
                speaker: 'Kagura',
                text: "At LAST! The ensemble arrives! I've been waiting for the second act to start!",
                speakerFaction: 'player',
              },
              { speaker: 'Goro', text: '...Who is this?', speakerFaction: 'player' },
              {
                speaker: 'Kagura',
                text: 'Kagura! Performer, dancer, morale specialist! You all look like you need a song.',
                speakerFaction: 'player',
              },
              { speaker: 'Shigeru', text: "We really don't.", speakerFaction: 'player' },
              {
                speaker: 'Kagura',
                text: "That's exactly what someone who needs a song would say. I'm joining you. No arguments!",
                speakerFaction: 'player',
              },
              {
                speaker: 'Kanna',
                text: 'A dancer... the Dance action lets an adjacent ally act again. That could compensate for our reduced mobility.',
                speakerFaction: 'player',
              },
            ],
          },
        },
        {
          type: 'spawn_units',
          units: [{ unitId: 'kagura', position: { x: 7, y: 3 } }],
          faction: 'player',
        },
      ],
      once: true,
    },
    // Turn 4: Dance tutorial
    {
      id: 'ch9_dance_tutorial',
      trigger: { type: 'turn_start', turn: 4 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Kanna',
                text: 'Kagura — move next to an ally who has already acted. Your Dance command will let them move and act again.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Kagura',
                text: "An encore! Everyone deserves an encore. Just say the word and I'll get them back on their feet.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Narrator',
                text: 'Tip: Select Kagura, move adjacent to an exhausted ally, then choose Dance. That ally can take another full turn.',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 5: Grief callback
    {
      id: 'ch9_grief_dialogue',
      trigger: { type: 'turn_start', turn: 5 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Genzo',
                text: 'I keep looking for him at the flank. Every turn.',
                speakerFaction: 'player',
              },
              { speaker: 'Hina', text: 'Me too.', speakerFaction: 'player' },
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
      unitB: 'kagura',
      lines: [
        {
          speaker: 'Kagura',
          text: "You carry yourself like a lead who's already read the script. Is this the part where you tell me the terrible secret?",
          speakerFaction: 'player',
        },
        { speaker: 'Shigeru', text: "There's no script, Kagura.", speakerFaction: 'player' },
        {
          speaker: 'Kagura',
          text: "Darling, there's ALWAYS a script. The question is whether we're reading the same one.",
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: '...You might be more right than you know.',
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'exp_both', amount: 20 },
    },
    {
      unitA: 'goro',
      unitB: 'raiga',
      lines: [
        {
          speaker: 'Goro',
          text: "You fight clean. Too clean. Where'd you learn?",
          speakerFaction: 'player',
        },
        {
          speaker: 'Raiga',
          text: 'Two hundred cycles of practice. Give or take.',
          speakerFaction: 'player',
        },
        { speaker: 'Goro', text: 'Two hundred WHAT?', speakerFaction: 'player' },
        { speaker: 'Raiga', text: 'Jobs. I meant jobs.', speakerFaction: 'player' },
      ],
      reward: { type: 'stat', unitId: 'goro', stat: 'str', amount: 1 },
    },
  ],
};
