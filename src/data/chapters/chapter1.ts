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
  name: 'Chapter 1: Not This Again',
  chapterNumber: 1,
  mapWidth: 25,
  mapHeight: 12,
  terrain,
  playerUnits: [
    { unitId: 'ren', position: { x: 10, y: 10 } },
    { unitId: 'kael', position: { x: 13, y: 10 } },
    { unitId: 'senna', position: { x: 9, y: 11 } },
    { unitId: 'lira', position: { x: 14, y: 11 } },
    { unitId: 'bram', position: { x: 12, y: 11 } },
  ],
  enemyUnits: [
    { unitId: 'fighter_1', position: { x: 8, y: 2 } },
    { unitId: 'fighter_3', position: { x: 11, y: 4 } },
    { unitId: 'soldier_1', position: { x: 5, y: 1 } },
    { unitId: 'garrek', position: { x: 11, y: 1 } }, // boss on throne
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
        text: 'A village. Smoke rising. Bandits approaching. The classic opening.',
      },
      {
        speaker: 'Kael',
        text: 'Lord Ren! Bandits are attacking the village! We must\u2014',
        speakerFaction: 'player',
      },
      {
        speaker: 'Ren',
        text: 'Defend the east bridge, route the enemies, save the villager at the west end. I know.',
        speakerFaction: 'player',
      },
      { speaker: 'Kael', text: '...How do you know about the villager?', speakerFaction: 'player' },
      { speaker: 'Ren', text: "Lucky guess. Let's go.", speakerFaction: 'player' },
    ],
  },
  villages: [
    {
      position: { x: 3, y: 3 },
      reward: {
        type: 'weapon',
        weaponId: 'hand_axe',
        dialogue: 'Hand Axe, ranged, decent might. Thanks, same as last time.',
        speaker: 'Ren',
      },
    },
    {
      position: { x: 18, y: 3 },
      reward: {
        type: 'weapon',
        weaponId: 'wind',
        dialogue: 'Wind tome for the mage. Got it.',
        speaker: 'Ren',
      },
    },
  ],
  epilogue: {
    lines: [
      {
        speaker: 'Kael',
        text: 'A fine victory! Our first battle together!',
        speakerFaction: 'player',
      },
      { speaker: 'Ren', text: '...Yeah. The first.', speakerFaction: 'player' },
      {
        speaker: 'Lira',
        text: 'Excuse me! Is this where the story starts? I heard there would be character development and meaningful bonds!',
        speakerFaction: 'player',
      },
      { speaker: 'Ren', text: '...Who are you?', speakerFaction: 'player' },
      {
        speaker: 'Lira',
        text: "I'm your healer! And possibly your love interest? The game hasn't decided yet.",
        speakerFaction: 'player',
      },
      { speaker: 'Ren', text: "We don't have a romance system.", speakerFaction: 'player' },
      { speaker: 'Lira', text: '...We WHAT?', speakerFaction: 'player' },
      {
        speaker: 'Narrator',
        text: "Ren's company presses onward, their ranks growing in unexpected ways.",
      },
    ],
  },
  deploymentSlots: 5,
  forceDeploy: ['ren'],
  skipPreparation: true,
  parTurns: 8,
  events: [
    // Turn 2 — Bram's arrival
    {
      id: 'ch1_bram_arrival',
      trigger: { type: 'turn_start', turn: 2 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Bram',
                text: "FINALLY! A BATTLE! Where's the combo meter??",
                speakerFaction: 'player',
              },
              {
                speaker: 'Ren',
                text: "There's no combo meter. You get one attack per turn.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Bram',
                text: '...What kind of sick game is this?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Ren',
                text: 'The kind with 5-tile movement and weapon triangles. Stay behind Kael.',
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
                speaker: 'Bram',
                text: 'Why did I hit like a WET NAPKIN? I have the highest STR!',
                speakerFaction: 'player',
              },
              {
                speaker: 'Senna',
                text: 'Weapon triangle. Axes lose to lances, lances lose to swords, swords lose to axes.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Bram',
                text: "That's ROCK PAPER SCISSORS. This game is ROCK PAPER SCISSORS.",
                speakerFaction: 'player',
              },
              { speaker: 'Ren', text: 'Welcome to tactical RPGs.', speakerFaction: 'player' },
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
                speaker: 'Garrek',
                text: 'I am Garrek the Terr\u2014 stop YAWNING. This is my INTRO SPEECH.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Ren',
                text: "I've heard it 347 times, Garrek.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Garrek',
                text: "Well I've GIVEN it 347 times and it still deserves RESPECT.",
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Ren',
                text: 'Can we skip to the part where I beat you with the Rapier?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Garrek',
                text: 'NO. We do the speech. We do the fight. We do this PROPERLY.',
                speakerFaction: 'enemy',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss pre-combat — Ren approaches throne
    {
      id: 'ch1_boss_precombat',
      trigger: { type: 'unit_at', unitId: 'ren', position: { x: 11, y: 2 } },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Garrek', text: "You remember too, don't you?", speakerFaction: 'enemy' },
              { speaker: 'Ren', text: '...How long have you known?', speakerFaction: 'player' },
              {
                speaker: 'Garrek',
                text: "Every cycle. All 347. I've been the tutorial boss since the beginning. You at least get to MOVE. I stand on this throne and wait to die.",
                speakerFaction: 'enemy',
              },
              { speaker: 'Ren', text: "I'm sorry.", speakerFaction: 'player' },
              { speaker: 'Garrek', text: 'Just make it quick.', speakerFaction: 'enemy' },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss killed
    {
      id: 'ch1_boss_killed',
      trigger: { type: 'unit_killed', unitId: 'garrek' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Garrek', text: 'See you next cycle.', speakerFaction: 'enemy' },
              { speaker: 'Ren', text: '...Maybe not.', speakerFaction: 'player' },
              { speaker: 'Garrek', text: 'You say that every time.', speakerFaction: 'enemy' },
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
      unitB: 'kael',
      lines: [
        {
          speaker: 'Kael',
          text: 'Ren, you knew exactly where every enemy was. Before we even started.',
          speakerFaction: 'player',
        },
        { speaker: 'Ren', text: 'I pay attention.', speakerFaction: 'player' },
        {
          speaker: 'Kael',
          text: 'Nobody pays THAT much attention. You called the bandit by name.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Ren',
          text: "Kael... when the time is right, I'll explain everything. For now, just trust me.",
          speakerFaction: 'player',
        },
        {
          speaker: 'Kael',
          text: '...Very well. I trust you, Ren. Always.',
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'exp_both', amount: 20 },
    },
    {
      unitA: 'senna',
      unitB: 'lira',
      lines: [
        {
          speaker: 'Lira',
          text: "Senna! I've been meaning to ask \u2014 do you believe in love at first sight?",
          speakerFaction: 'player',
        },
        {
          speaker: 'Senna',
          text: "I believe in observable phenomena with reproducible results. 'Love at first sight' is a confirmation bias.",
          speakerFaction: 'player',
        },
        {
          speaker: 'Lira',
          text: "That's... the most romantic thing anyone has ever said to me.",
          speakerFaction: 'player',
        },
        { speaker: 'Senna', text: '...How?', speakerFaction: 'player' },
      ],
      reward: { type: 'stat', unitId: 'lira', stat: 'mag', amount: 1 },
    },
  ],
};
