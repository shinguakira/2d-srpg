import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const W: TerrainType = 'water';
const X: TerrainType = 'wall';
const T: TerrainType = 'fort';
const V: TerrainType = 'village';
const H: TerrainType = 'throne';

// 18 columns x 10 rows — fills 16:9 desktop with square tiles
const terrain: TerrainType[][] = [
  //0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17
  [M, M, F, P, P, P, X, H, X, P, P, P, P, F, P, F, M, M], // row 0 — throne at (7,0)
  [M, F, P, P, F, P, P, P, P, P, P, F, P, P, P, P, F, M], // row 1
  [F, P, P, F, P, P, T, P, P, P, P, P, F, P, P, P, P, F], // row 2 — fort at (6,2)
  [P, P, P, V, P, W, W, W, W, P, P, P, P, V, P, P, P, P], // row 3 — river + 2 villages
  [P, F, P, P, W, P, P, P, P, W, P, P, F, P, P, F, P, P], // row 4 — river gap (bridge)
  [P, P, P, W, W, P, P, P, P, W, W, P, P, P, P, P, P, P], // row 5
  [P, P, F, P, P, P, P, P, P, P, P, F, P, P, F, P, P, P], // row 6
  [P, F, P, P, P, T, P, P, P, P, P, P, F, P, P, F, P, P], // row 7 — fort at (5,7)
  [F, P, P, P, F, P, P, P, P, F, P, P, P, P, F, P, P, F], // row 8
  [M, M, F, P, P, P, P, P, P, P, P, P, P, P, P, F, M, M], // row 9
];

export const CHAPTER_2: ChapterData = {
  id: 'ch2',
  name: 'Chapter 2: The Defector',
  chapterNumber: 2,
  mapWidth: 18,
  mapHeight: 10,
  terrain,
  playerUnits: [
    { unitId: 'shigeru', position: { x: 6, y: 8 } },
    { unitId: 'akira', position: { x: 10, y: 8 } },
    { unitId: 'kanna', position: { x: 7, y: 9 } },
    { unitId: 'hina', position: { x: 11, y: 9 } },
    { unitId: 'goro', position: { x: 8, y: 8 } },
  ],
  enemyUnits: [
    { unitId: 'ch2_fighter_1', position: { x: 4, y: 5 } },
    { unitId: 'ch2_soldier_1', position: { x: 7, y: 3 } },
    { unitId: 'ch2_guard_1', position: { x: 6, y: 1 } },
    { unitId: 'ryuji', position: { x: 7, y: 0 } },
    // Genzo: player template placed as enemy, defects turn 3 via event
    {
      unitId: 'genzo',
      position: { x: 8, y: 1 },
      faction: 'enemy',
      aiBehavior: { type: 'stationary' },
    },
  ],
  objective: {
    type: 'seize',
    description: 'Seize the throne',
  },
  seizePosition: { x: 7, y: 0 },
  prologue: {
    lines: [
      {
        speaker: 'Narrator',
        text: 'Dawn. The party approaches a border garrison. Flags flying, soldiers patrolling the walls.',
      },
      {
        speaker: 'Akira',
        text: 'A garrison. This will be a proper battle.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: "Commander Ryuji. Cavalier. Lance. He'll guard the throne area and won't come to us \u2014 we go to him.",
        speakerFaction: 'player',
      },
      {
        speaker: 'Kanna',
        text: "How do you know the enemy commander's name?",
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: '...Intelligence reports.', speakerFaction: 'player' },
      { speaker: 'Kanna', text: "We don't HAVE intelligence reports.", speakerFaction: 'player' },
      { speaker: 'Shigeru', text: 'Then call it intuition.', speakerFaction: 'player' },
      {
        speaker: 'Goro',
        text: 'WHO CARES. Are there more enemies this time? I need to test my axe on something that fights BACK.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Hina',
        text: 'I brought bandages! And conversation starters! This is the chapter where we really get to know each other, right?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: "It's the chapter where we seize a garrison, Hina.",
        speakerFaction: 'player',
      },
      {
        speaker: 'Hina',
        text: 'Bonding through shared combat trauma. Even BETTER.',
        speakerFaction: 'player',
      },
    ],
  },
  epilogue: {
    lines: [
      {
        speaker: 'Kanna',
        text: "Shigeru, the item Ryuji dropped. It's labeled 'Broken Seed.' That's not a plant seed. It's computational.",
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: 'I know what it is.', speakerFaction: 'player' },
      {
        speaker: 'Kanna',
        text: 'Then you know what it CONFIRMS. The combat sequence is pre-determined. If I study this, I can predict outcomes chapters in advance.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'You can try. But the seed... changes sometimes.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Kanna',
        text: "Seeds don't change. That's the point of a seed.",
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: "In a normal game, no. But this game isn't normal.",
        speakerFaction: 'player',
      },
      { speaker: 'Kanna', text: '...What does that mean?', speakerFaction: 'player' },
      {
        speaker: 'Shigeru',
        text: "It means keep studying. You'll figure it out. You always do.",
        speakerFaction: 'player',
      },
      {
        speaker: 'Genzo',
        text: "Is anyone going to explain what a 'seed' is?",
        speakerFaction: 'player',
      },
      {
        speaker: 'Hina',
        text: "I think it's a metaphor for growing as a person!",
        speakerFaction: 'player',
      },
      { speaker: 'Genzo', text: '...I regret defecting.', speakerFaction: 'player' },
      {
        speaker: 'Narrator',
        text: 'The company presses onward, carrying a broken seed and more questions than answers.',
      },
    ],
  },
  villages: [
    {
      position: { x: 13, y: 3 },
      reward: {
        type: 'weapon',
        weaponId: 'javelin',
        dialogue:
          'The garrison has been pressuring us for taxes. Take this \u2014 we hid it from the soldiers.',
        speaker: 'Villager',
      },
    },
    {
      position: { x: 3, y: 3 },
      reward: {
        type: 'weapon',
        weaponId: 'iron_lance',
        dialogue: 'A weapon, for our liberators. My grandfather forged it.',
        speaker: 'Villager',
      },
    },
  ],
  deploymentSlots: 5,
  forceDeploy: ['shigeru'],
  parTurns: 10,
  recruitableUnits: ['genzo'],
  events: [
    // Turn 2 — Bridge strategy + Kanna tracking
    {
      id: 'ch2_turn2_hint',
      trigger: { type: 'turn_start', turn: 2 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Akira',
                text: 'The bridge is narrow \u2014 only one unit can cross at a time.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Kanna',
                text: 'Or we flank through the shallow water. Slower, but we approach from two sides.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Kanna',
                text: "...Interesting. That archer had a 72% chance to hit Goro. He missed. I'm tracking these.",
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 3 — Genzo defection (expanded)
    {
      id: 'ch2_genzo_defection_dialogue',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Genzo', text: "I'm done.", speakerFaction: 'enemy' },
              { speaker: 'Akira', text: "It's a trap!", speakerFaction: 'player' },
              {
                speaker: 'Genzo',
                text: "It's not. I've been standing on that wall tile for... I don't know how long. Days? Years? I can't tell anymore.",
                speakerFaction: 'enemy',
              },
              { speaker: 'Shigeru', text: 'Welcome aboard, Genzo.', speakerFaction: 'player' },
              { speaker: 'Genzo', text: "You're not even surprised.", speakerFaction: 'player' },
              {
                speaker: 'Shigeru',
                text: 'You defected in cycle 298 too. Different reason that time \u2014 you were angry about the AI.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Genzo',
                text: 'The stationary AI. Fifteen turns. Standing. Watching. While my commander fights and I just STAND THERE.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Goro',
                text: "Wait \u2014 the ENEMIES know they're standing still? They know that's WEIRD?",
                speakerFaction: 'player',
              },
              {
                speaker: 'Genzo',
                text: "Most of them don't. I just... noticed. At some point. I don't know when.",
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    {
      id: 'ch2_genzo_defection_recruit',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [{ type: 'recruit_unit', unitId: 'genzo' }],
      once: true,
    },
    // Turn 4 — Kanna's seed observation
    {
      id: 'ch2_kanna_wards',
      trigger: { type: 'turn_start', turn: 4 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Kanna',
                text: "Seventeen combats tracked. The outcomes aren't random.",
                speakerFaction: 'player',
              },
              { speaker: 'Shigeru', text: 'Kanna\u2014', speakerFaction: 'player' },
              {
                speaker: 'Kanna',
                text: "There's a pattern. A sequence. Every hit and miss follows a fixed order. Like the combat is using a... a seed.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: '...You figured that out in seventeen combats?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Kanna',
                text: "I figured out the HYPOTHESIS. Proving it will take more data. But if I'm right, I can eventually predict every attack before it happens.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Hina',
                text: 'Can you predict romantic chemistry?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Kanna',
                text: "I can predict that you'll ask that. Because you ask it every chapter.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Hina',
                text: "...We've only had two chapters.",
                speakerFaction: 'player',
              },
              { speaker: 'Kanna', text: 'Exactly.', speakerFaction: 'player' },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss pre-combat — Shigeru approaches Ryuji
    {
      id: 'ch2_boss_precombat',
      trigger: { type: 'unit_at', unitId: 'shigeru', position: { x: 7, y: 1 } },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Ryuji',
                text: 'Halt. I am Commander Ryuji of the border garrison. State your purpose.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: "You won't believe me if I tell you.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Ryuji',
                text: "I don't know what 'save files' or 'cycles' are. I don't care. I received my orders this morning.",
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: 'You received those same orders 347 mornings ago.',
                speakerFaction: 'player',
              },
              { speaker: 'Ryuji', text: '...Is that a threat?', speakerFaction: 'enemy' },
              { speaker: 'Shigeru', text: "No. It's just sad.", speakerFaction: 'player' },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss killed — Genzo reflects
    {
      id: 'ch2_boss_killed',
      trigger: { type: 'unit_killed', unitId: 'ryuji' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Genzo',
                text: 'He never knew. He did his job every cycle and never once questioned it.',
                speakerFaction: 'player',
              },
              { speaker: 'Shigeru', text: "That's most people here, Genzo.", speakerFaction: 'player' },
              {
                speaker: 'Genzo',
                text: "I know. That's what made standing still so unbearable \u2014 I was the only one who noticed.",
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
  ],
  reinforcements: [
    {
      turn: 6,
      units: [{ unitId: 'ch2_reinforce_1', position: { x: 0, y: 0 } }],
      message: 'Enemy reinforcements arrive from the north!',
    },
  ],
  supportConversations: [
    {
      unitA: 'shigeru',
      unitB: 'kanna',
      lines: [
        {
          speaker: 'Kanna',
          text: "Shigeru. I've been analyzing your decision-making. You don't guess. You KNOW.",
          speakerFaction: 'player',
        },
        { speaker: 'Shigeru', text: 'I have good instincts.', speakerFaction: 'player' },
        {
          speaker: 'Kanna',
          text: "Instincts don't predict enemy commanders' names. I want an answer.",
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: "...Not yet, Kanna. Keep studying the seed. You're closer to the truth than you think.",
          speakerFaction: 'player',
        },
        {
          speaker: 'Kanna',
          text: 'I intend to. And when I have enough data, you WILL explain.',
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'shigeru', stat: 'skl', amount: 1 },
    },
    {
      unitA: 'akira',
      unitB: 'hina',
      lines: [
        {
          speaker: 'Hina',
          text: 'Akira! On a scale of one to ten, how would you rate our team chemistry?',
          speakerFaction: 'player',
        },
        {
          speaker: 'Akira',
          text: "I... don't think combat effectiveness works on a scale.",
          speakerFaction: 'player',
        },
        {
          speaker: 'Hina',
          text: "Not COMBAT chemistry. RELATIONSHIP chemistry. It's very important for party cohesion!",
          speakerFaction: 'player',
        },
        { speaker: 'Akira', text: 'Is... is that in the manual?', speakerFaction: 'player' },
        { speaker: 'Hina', text: "It's in MY manual.", speakerFaction: 'player' },
      ],
      reward: { type: 'exp_both', amount: 15 },
    },
  ],
};
