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
    { unitId: 'ren', position: { x: 6, y: 8 } },
    { unitId: 'kael', position: { x: 10, y: 8 } },
    { unitId: 'senna', position: { x: 7, y: 9 } },
    { unitId: 'lira', position: { x: 11, y: 9 } },
    { unitId: 'bram', position: { x: 8, y: 8 } },
  ],
  enemyUnits: [
    { unitId: 'ch2_fighter_1', position: { x: 4, y: 5 } },
    { unitId: 'ch2_soldier_1', position: { x: 7, y: 3 } },
    { unitId: 'ch2_guard_1', position: { x: 6, y: 1 } },
    { unitId: 'thane', position: { x: 7, y: 0 } },
    // Voss: player template placed as enemy, defects turn 3 via event
    {
      unitId: 'voss',
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
        speaker: 'Kael',
        text: 'A garrison. This will be a proper battle.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Ren',
        text: "Commander Thane. Cavalier. Lance. He'll guard the throne area and won't come to us \u2014 we go to him.",
        speakerFaction: 'player',
      },
      {
        speaker: 'Senna',
        text: "How do you know the enemy commander's name?",
        speakerFaction: 'player',
      },
      { speaker: 'Ren', text: '...Intelligence reports.', speakerFaction: 'player' },
      { speaker: 'Senna', text: "We don't HAVE intelligence reports.", speakerFaction: 'player' },
      { speaker: 'Ren', text: 'Then call it intuition.', speakerFaction: 'player' },
      {
        speaker: 'Bram',
        text: 'WHO CARES. Are there more enemies this time? I need to test my axe on something that fights BACK.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lira',
        text: 'I brought bandages! And conversation starters! This is the chapter where we really get to know each other, right?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Ren',
        text: "It's the chapter where we seize a garrison, Lira.",
        speakerFaction: 'player',
      },
      {
        speaker: 'Lira',
        text: 'Bonding through shared combat trauma. Even BETTER.',
        speakerFaction: 'player',
      },
    ],
  },
  epilogue: {
    lines: [
      {
        speaker: 'Senna',
        text: "Ren, the item Thane dropped. It's labeled 'Broken Seed.' That's not a plant seed. It's computational.",
        speakerFaction: 'player',
      },
      { speaker: 'Ren', text: 'I know what it is.', speakerFaction: 'player' },
      {
        speaker: 'Senna',
        text: 'Then you know what it CONFIRMS. The combat sequence is pre-determined. If I study this, I can predict outcomes chapters in advance.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Ren',
        text: 'You can try. But the seed... changes sometimes.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Senna',
        text: "Seeds don't change. That's the point of a seed.",
        speakerFaction: 'player',
      },
      {
        speaker: 'Ren',
        text: "In a normal game, no. But this game isn't normal.",
        speakerFaction: 'player',
      },
      { speaker: 'Senna', text: '...What does that mean?', speakerFaction: 'player' },
      {
        speaker: 'Ren',
        text: "It means keep studying. You'll figure it out. You always do.",
        speakerFaction: 'player',
      },
      {
        speaker: 'Voss',
        text: "Is anyone going to explain what a 'seed' is?",
        speakerFaction: 'player',
      },
      {
        speaker: 'Lira',
        text: "I think it's a metaphor for growing as a person!",
        speakerFaction: 'player',
      },
      { speaker: 'Voss', text: '...I regret defecting.', speakerFaction: 'player' },
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
  forceDeploy: ['ren'],
  parTurns: 10,
  recruitableUnits: ['voss'],
  events: [
    // Turn 2 — Bridge strategy + Senna tracking
    {
      id: 'ch2_turn2_hint',
      trigger: { type: 'turn_start', turn: 2 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Kael',
                text: 'The bridge is narrow \u2014 only one unit can cross at a time.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Senna',
                text: 'Or we flank through the shallow water. Slower, but we approach from two sides.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Senna',
                text: "...Interesting. That archer had a 72% chance to hit Bram. He missed. I'm tracking these.",
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 3 — Voss defection (expanded)
    {
      id: 'ch2_voss_defection_dialogue',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Voss', text: "I'm done.", speakerFaction: 'enemy' },
              { speaker: 'Kael', text: "It's a trap!", speakerFaction: 'player' },
              {
                speaker: 'Voss',
                text: "It's not. I've been standing on that wall tile for... I don't know how long. Days? Years? I can't tell anymore.",
                speakerFaction: 'enemy',
              },
              { speaker: 'Ren', text: 'Welcome aboard, Voss.', speakerFaction: 'player' },
              { speaker: 'Voss', text: "You're not even surprised.", speakerFaction: 'player' },
              {
                speaker: 'Ren',
                text: 'You defected in cycle 298 too. Different reason that time \u2014 you were angry about the AI.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Voss',
                text: 'The stationary AI. Fifteen turns. Standing. Watching. While my commander fights and I just STAND THERE.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Bram',
                text: "Wait \u2014 the ENEMIES know they're standing still? They know that's WEIRD?",
                speakerFaction: 'player',
              },
              {
                speaker: 'Voss',
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
      id: 'ch2_voss_defection_recruit',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [{ type: 'recruit_unit', unitId: 'voss' }],
      once: true,
    },
    // Turn 4 — Senna's seed observation
    {
      id: 'ch2_senna_seed',
      trigger: { type: 'turn_start', turn: 4 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Senna',
                text: "Seventeen combats tracked. The outcomes aren't random.",
                speakerFaction: 'player',
              },
              { speaker: 'Ren', text: 'Senna\u2014', speakerFaction: 'player' },
              {
                speaker: 'Senna',
                text: "There's a pattern. A sequence. Every hit and miss follows a fixed order. Like the combat is using a... a seed.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Ren',
                text: '...You figured that out in seventeen combats?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Senna',
                text: "I figured out the HYPOTHESIS. Proving it will take more data. But if I'm right, I can eventually predict every attack before it happens.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Lira',
                text: 'Can you predict romantic chemistry?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Senna',
                text: "I can predict that you'll ask that. Because you ask it every chapter.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Lira',
                text: "...We've only had two chapters.",
                speakerFaction: 'player',
              },
              { speaker: 'Senna', text: 'Exactly.', speakerFaction: 'player' },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss pre-combat — Ren approaches Thane
    {
      id: 'ch2_boss_precombat',
      trigger: { type: 'unit_at', unitId: 'ren', position: { x: 7, y: 1 } },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Thane',
                text: 'Halt. I am Commander Thane of the border garrison. State your purpose.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Ren',
                text: "You won't believe me if I tell you.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Thane',
                text: "I don't know what 'save files' or 'cycles' are. I don't care. I received my orders this morning.",
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Ren',
                text: 'You received those same orders 347 mornings ago.',
                speakerFaction: 'player',
              },
              { speaker: 'Thane', text: '...Is that a threat?', speakerFaction: 'enemy' },
              { speaker: 'Ren', text: "No. It's just sad.", speakerFaction: 'player' },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss killed — Voss reflects
    {
      id: 'ch2_boss_killed',
      trigger: { type: 'unit_killed', unitId: 'thane' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Voss',
                text: 'He never knew. He did his job every cycle and never once questioned it.',
                speakerFaction: 'player',
              },
              { speaker: 'Ren', text: "That's most people here, Voss.", speakerFaction: 'player' },
              {
                speaker: 'Voss',
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
      unitA: 'ren',
      unitB: 'senna',
      lines: [
        {
          speaker: 'Senna',
          text: "Ren. I've been analyzing your decision-making. You don't guess. You KNOW.",
          speakerFaction: 'player',
        },
        { speaker: 'Ren', text: 'I have good instincts.', speakerFaction: 'player' },
        {
          speaker: 'Senna',
          text: "Instincts don't predict enemy commanders' names. I want an answer.",
          speakerFaction: 'player',
        },
        {
          speaker: 'Ren',
          text: "...Not yet, Senna. Keep studying the seed. You're closer to the truth than you think.",
          speakerFaction: 'player',
        },
        {
          speaker: 'Senna',
          text: 'I intend to. And when I have enough data, you WILL explain.',
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'ren', stat: 'skl', amount: 1 },
    },
    {
      unitA: 'kael',
      unitB: 'lira',
      lines: [
        {
          speaker: 'Lira',
          text: 'Kael! On a scale of one to ten, how would you rate our team chemistry?',
          speakerFaction: 'player',
        },
        {
          speaker: 'Kael',
          text: "I... don't think combat effectiveness works on a scale.",
          speakerFaction: 'player',
        },
        {
          speaker: 'Lira',
          text: "Not COMBAT chemistry. RELATIONSHIP chemistry. It's very important for party cohesion!",
          speakerFaction: 'player',
        },
        { speaker: 'Kael', text: 'Is... is that in the manual?', speakerFaction: 'player' },
        { speaker: 'Lira', text: "It's in MY manual.", speakerFaction: 'player' },
      ],
      reward: { type: 'exp_both', amount: 15 },
    },
  ],
};
