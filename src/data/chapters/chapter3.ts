import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const W: TerrainType = 'water';
const T: TerrainType = 'fort';
const V: TerrainType = 'village';

// 25 columns x 12 rows — fills 16:9 desktop with square tiles
const terrain: TerrainType[][] = [
  //0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24
  [M, M, M, M, F, F, P, P, P, P, P, P, P, P, P, F, F, P, P, F, P, F, M, M, M], // row 0
  [M, M, M, F, P, P, P, F, P, P, P, F, P, P, P, P, F, P, P, P, F, P, F, M, M], // row 1
  [M, M, F, P, P, V, P, P, P, P, P, P, P, V, P, P, P, P, F, P, P, P, P, M, M], // row 2 — villages
  [M, F, P, P, F, F, P, P, P, T, P, P, F, F, P, P, P, F, P, P, F, P, P, F, M], // row 3 — fort at (9,3)
  [F, P, P, W, P, F, P, P, P, P, P, P, F, P, P, P, F, P, P, F, P, P, P, P, F], // row 4
  [P, P, P, W, P, P, P, F, P, T, F, P, P, P, F, P, P, P, P, P, P, P, P, P, P], // row 5 — fort at (9,5), boss
  [P, P, P, P, P, F, P, P, P, P, P, P, F, P, P, P, P, F, P, P, P, P, P, F, P], // row 6
  [P, P, P, P, F, P, P, P, P, P, P, P, P, F, P, P, P, P, F, P, P, P, P, P, P], // row 7
  [P, P, F, P, P, P, F, P, P, P, P, F, P, P, P, P, F, P, P, P, F, P, P, P, F], // row 8
  [F, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, F], // row 9
  [M, F, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, F, M], // row 10
  [M, M, F, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, F, M, M], // row 11
];

export const CHAPTER_3: ChapterData = {
  id: 'ch3',
  name: "Chapter 3: Scout's Honor",
  chapterNumber: 3,
  mapWidth: 25,
  mapHeight: 12,
  terrain,
  playerUnits: [
    { unitId: 'shigeru', position: { x: 9, y: 10 } },
    { unitId: 'akira', position: { x: 14, y: 10 } },
    { unitId: 'kanna', position: { x: 10, y: 11 } },
    { unitId: 'hina', position: { x: 15, y: 11 } },
    { unitId: 'goro', position: { x: 11, y: 10 } },
    { unitId: 'genzo', position: { x: 12, y: 11 } },
    { unitId: 'sayo', position: { x: 13, y: 11 } },
  ],
  enemyUnits: [
    { unitId: 'ch3_fighter_1', position: { x: 8, y: 5 } },
    { unitId: 'ch3_fighter_2', position: { x: 14, y: 6 } },
    { unitId: 'ch3_fighter_3', position: { x: 5, y: 3 } },
    { unitId: 'ch3_soldier_1', position: { x: 15, y: 3 } },
    { unitId: 'ch3_soldier_2', position: { x: 7, y: 4 } },
    { unitId: 'ch3_mage_1', position: { x: 12, y: 2 } },
    { unitId: 'ch3_mage_2', position: { x: 17, y: 4 } },
    { unitId: 'ch3_guard_1', position: { x: 9, y: 3 } }, // on fort
    { unitId: 'ch3_boss', position: { x: 9, y: 5 } }, // boss on fort
  ],
  objective: {
    type: 'rout',
    description: 'Defeat all enemies',
  },
  deploymentSlots: 6,
  forceDeploy: ['shigeru'],
  recruitableUnits: ['sayo'],
  prologue: {
    lines: [
      {
        speaker: 'Narrator',
        text: 'Rolling hills ahead. Forests cluster between ridgelines. A fortress sits on the highest hill.',
      },
      { speaker: 'Akira', text: 'Open ground! Finally. Room to charge!', speakerFaction: 'player' },
      {
        speaker: 'Shigeru',
        text: "Don't go too far ahead. There's a village under attack in the eastern valley.",
        speakerFaction: 'player',
      },
      { speaker: 'Akira', text: 'How do you know that?', speakerFaction: 'player' },
      { speaker: 'Shigeru', text: '...Smoke. I see smoke.', speakerFaction: 'player' },
      { speaker: 'Kanna', text: "I don't see any smoke.", speakerFaction: 'player' },
      { speaker: 'Shigeru', text: 'I have good eyes.', speakerFaction: 'player' },
      {
        speaker: 'Goro',
        text: "Can we talk about these trees? Why does it cost TWO moves to walk through a forest? I can see the other side. It's RIGHT THERE.",
        speakerFaction: 'player',
      },
      {
        speaker: 'Kanna',
        text: 'Movement cost varies by terrain type. Forests are 2, plains are 1, mountains are\u2014',
        speakerFaction: 'player',
      },
      {
        speaker: 'Goro',
        text: "I don't want a LECTURE. I want to PUNCH things.",
        speakerFaction: 'player',
      },
      {
        speaker: 'Hina',
        text: 'Maybe the trees are a metaphor? For obstacles in relationships?',
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: "They're trees, Hina. Let's move.", speakerFaction: 'player' },
    ],
  },
  epilogue: {
    lines: [
      {
        speaker: 'Hina',
        text: "Sayo! Now that we're allies, I have some important questions. What's your favorite color? Do you have any siblings? Have you ever been in love?",
        speakerFaction: 'player',
      },
      { speaker: 'Sayo', text: 'Green. No. No.', speakerFaction: 'player' },
      { speaker: 'Hina', text: "Three words! We're bonding!", speakerFaction: 'player' },
      { speaker: 'Sayo', text: "We're not.", speakerFaction: 'player' },
      { speaker: 'Hina', text: 'Four words! Progress!', speakerFaction: 'player' },
      { speaker: 'Goro', text: "I like her. She doesn't talk too much.", speakerFaction: 'player' },
      {
        speaker: 'Kanna',
        text: "Shigeru, I want to run some tests on the terrain data. That forest tile CHANGED. Data doesn't rewrite itself.",
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: "...I know. I've seen it before.", speakerFaction: 'player' },
      { speaker: 'Kanna', text: 'In a previous cycle?', speakerFaction: 'player' },
      {
        speaker: 'Shigeru',
        text: 'It starts small. Tiles flickering. Enemies spawning wrong. Then it gets worse. Much worse.',
        speakerFaction: 'player',
      },
      { speaker: 'Kanna', text: 'How much worse?', speakerFaction: 'player' },
      {
        speaker: 'Shigeru',
        text: "Let's talk about it later. Akira \u2014 there are reports of thieves in the next town. We should move.",
        speakerFaction: 'player',
      },
      { speaker: 'Akira', text: "Already saddled up. Let's ride!", speakerFaction: 'player' },
    ],
  },
  villages: [
    {
      position: { x: 5, y: 2 },
      reward: {
        type: 'weapon',
        weaponId: 'steel_sword',
        dialogue: 'A fine blade, forged by our best smith. Use it to drive these bandits out!',
        speaker: 'Borgo Blacksmith',
      },
    },
    {
      position: { x: 13, y: 2 },
      reward: {
        type: 'weapon',
        weaponId: 'elfire',
        dialogue: 'This tome was left behind by a traveling sage. It holds powerful fire magic.',
        speaker: 'Borgo Villager',
      },
    },
  ],
  parTurns: 10,
  reinforcements: [
    {
      turn: 4,
      units: [
        { unitId: 'ch3_reinforce_1', position: { x: 3, y: 11 } },
        { unitId: 'ch3_reinforce_2', position: { x: 20, y: 11 } },
      ],
      message: 'More bandits emerge from the forest!',
    },
  ],
  events: [
    // Turn 2 — Terrain lesson
    {
      id: 'ch3_terrain_lesson',
      trigger: { type: 'turn_start', turn: 2 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Goro',
                text: 'OW. How did that archer hit me from way over there??',
                speakerFaction: 'player',
              },
              {
                speaker: 'Kanna',
                text: "You're standing on a plain. Zero avoid bonus. If you'd stopped in that forest tile, you'd have had +20 avoid.",
                speakerFaction: 'player',
              },
              { speaker: 'Goro', text: "I'm not hiding behind a TREE.", speakerFaction: 'player' },
              {
                speaker: 'Genzo',
                text: "I'm hiding behind a tree. Very comfortable.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Akira',
                text: 'The fortress ahead has fort tiles \u2014 those give even more defense. The boss will be on one.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: "Akira's right. We can't brute force a fort tile. We'll need Kanna's magic or weapon advantage.",
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 3 — Sayo's rescue
    {
      id: 'ch3_sayo_rescue',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Akira',
                text: "There's someone defending that village alone!",
                speakerFaction: 'player',
              },
              { speaker: 'Sayo', text: 'Took you long enough.', speakerFaction: 'player' },
              { speaker: 'Shigeru', text: 'You held them off by yourself?', speakerFaction: 'player' },
              {
                speaker: 'Sayo',
                text: "Bow. High ground. They can't reach me. Simple.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Hina',
                text: 'Oh! A mysterious loner with a bow! Are you the stoic rival type or the\u2014',
                speakerFaction: 'player',
              },
              { speaker: 'Sayo', text: "I'm a hunter.", speakerFaction: 'player' },
              {
                speaker: 'Hina',
                text: '...The strong-silent type. Got it.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Kanna',
                text: "Bows have 2-range. She can hit from two tiles away but can't fight at melee. No counterattacks up close.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Sayo',
                text: "So don't let them get close. That's my only rule.",
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 5 — First glitch
    {
      id: 'ch3_first_glitch',
      trigger: { type: 'turn_start', turn: 5 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Kanna', text: 'Did that tile just... change?', speakerFaction: 'player' },
              { speaker: 'Shigeru', text: 'What tile?', speakerFaction: 'player' },
              {
                speaker: 'Kanna',
                text: 'That forest. It was a plain for a second. The terrain data stuttered.',
                speakerFaction: 'player',
              },
              { speaker: 'Genzo', text: "Terrain doesn't stutter.", speakerFaction: 'player' },
              {
                speaker: 'Kanna',
                text: "I know. That's why I'm concerned.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: "...Don't worry about it. Not yet.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Kanna',
                text: 'Shigeru, if the map data is unstable\u2014',
                speakerFaction: 'player',
              },
              { speaker: 'Shigeru', text: 'I said not yet. Focus on Hyodo.', speakerFaction: 'player' },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss pre-combat — Shigeru approaches Hyodo
    {
      id: 'ch3_boss_precombat',
      trigger: { type: 'unit_at', unitId: 'shigeru', position: { x: 9, y: 4 } },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Hyodo',
                text: 'This fortress will not fall while I draw breath.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: "Captain Hyodo. You don't have to die here.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Hyodo',
                text: "I received my orders this morning. Hold the fort. Repel all attackers. I don't know who you are and I don't care.",
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: 'You received those orders 347 mornings ago.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Hyodo',
                text: "...I don't understand what that means. And I don't need to. Raise your weapon.",
                speakerFaction: 'enemy',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss killed
    {
      id: 'ch3_boss_killed',
      trigger: { type: 'unit_killed', unitId: 'ch3_boss' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Akira',
                text: 'He fought well. Just a soldier doing his duty.',
                speakerFaction: 'player',
              },
              { speaker: 'Shigeru', text: 'Yeah. Most of them are.', speakerFaction: 'player' },
              {
                speaker: 'Sayo',
                text: 'Was there another way? Without killing him?',
                speakerFaction: 'player',
              },
              { speaker: 'Shigeru', text: '...Not in this version.', speakerFaction: 'player' },
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
      unitB: 'hina',
      lines: [
        {
          speaker: 'Hina',
          text: "Shigeru, I've been thinking about our team dynamic. We need more heart-to-hearts.",
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: "We're in the middle of a campaign, Hina.",
          speakerFaction: 'player',
        },
        {
          speaker: 'Hina',
          text: 'Exactly! Peak emotional bonding conditions! Shared adversity, campfire confessions, maybe some rain for atmosphere\u2014',
          speakerFaction: 'player',
        },
        { speaker: 'Shigeru', text: "We don't control the weather.", speakerFaction: 'player' },
        { speaker: 'Hina', text: '...Yet.', speakerFaction: 'player' },
      ],
      reward: { type: 'stat', unitId: 'hina', stat: 'res', amount: 1 },
    },
    {
      unitA: 'goro',
      unitB: 'genzo',
      lines: [
        {
          speaker: 'Goro',
          text: 'Genzo. Quick question. Do you ever miss being on the other side?',
          speakerFaction: 'player',
        },
        {
          speaker: 'Genzo',
          text: 'I stood still for fifteen turns. What do you think?',
          speakerFaction: 'player',
        },
        {
          speaker: 'Goro',
          text: "Fair. But at least you had a GUARD radius. I don't even have a COMBO METER.",
          speakerFaction: 'player',
        },
        {
          speaker: 'Genzo',
          text: "We're bonding over shared disappointment with game mechanics. Is this what the healer wanted?",
          speakerFaction: 'player',
        },
        { speaker: 'Goro', text: 'Probably.', speakerFaction: 'player' },
      ],
      reward: { type: 'stat', unitId: 'genzo', stat: 'def', amount: 1 },
    },
  ],
};
