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
    { unitId: 'shigeru', position: { x: 10, y: 10 } },
    { unitId: 'akira', position: { x: 13, y: 10 } },
    { unitId: 'kanna', position: { x: 9, y: 11 } },
    { unitId: 'hina', position: { x: 14, y: 11 } },
    { unitId: 'goro', position: { x: 12, y: 11 } },
  ],
  enemyUnits: [
    { unitId: 'fighter_1', position: { x: 8, y: 2 } },
    { unitId: 'fighter_3', position: { x: 11, y: 4 } },
    { unitId: 'soldier_1', position: { x: 5, y: 1 } },
    { unitId: 'baraku', position: { x: 11, y: 1 } }, // boss on throne
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
        speaker: 'Akira',
        text: 'Lord Shigeru! Bandits are attacking the village! We must\u2014',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'Defend the east bridge, route the enemies, save the villager at the west end. I know.',
        speakerFaction: 'player',
      },
      { speaker: 'Akira', text: '...How do you know about the villager?', speakerFaction: 'player' },
      { speaker: 'Shigeru', text: "Lucky guess. Let's go.", speakerFaction: 'player' },
    ],
  },
  villages: [
    {
      position: { x: 3, y: 3 },
      reward: {
        type: 'weapon',
        weaponId: 'hand_axe',
        dialogue: 'Hand Axe, ranged, decent might. Thanks, same as last time.',
        speaker: 'Shigeru',
      },
    },
    {
      position: { x: 18, y: 3 },
      reward: {
        type: 'weapon',
        weaponId: 'wind',
        dialogue: 'Wind tome for the mage. Got it.',
        speaker: 'Shigeru',
      },
    },
  ],
  epilogue: {
    lines: [
      {
        speaker: 'Akira',
        text: 'A fine victory! Our first battle together!',
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: '...Yeah. The first.', speakerFaction: 'player' },
      {
        speaker: 'Hina',
        text: 'Excuse me! Is this where the story starts? I heard there would be character development and meaningful bonds!',
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: '...Who are you?', speakerFaction: 'player' },
      {
        speaker: 'Hina',
        text: "I'm your healer! And possibly your love interest? The game hasn't decided yet.",
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: "We don't have a romance system.", speakerFaction: 'player' },
      { speaker: 'Hina', text: '...We WHAT?', speakerFaction: 'player' },
      {
        speaker: 'Narrator',
        text: "Shigeru's company presses onward, their ranks growing in unexpected ways.",
      },
    ],
  },
  deploymentSlots: 5,
  forceDeploy: ['shigeru'],
  skipPreparation: true,
  parTurns: 8,
  events: [
    // Turn 2 — Goro's arrival
    {
      id: 'ch1_goro_arrival',
      trigger: { type: 'turn_start', turn: 2 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Goro',
                text: "FINALLY! A BATTLE! Where's the combo meter??",
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: "There's no combo meter. You get one attack per turn.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Goro',
                text: '...What kind of sick game is this?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'The kind with 5-tile movement and weapon triangles. Stay behind Akira.',
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
                speaker: 'Goro',
                text: 'Why did I hit like a WET NAPKIN? I have the highest STR!',
                speakerFaction: 'player',
              },
              {
                speaker: 'Kanna',
                text: 'Weapon triangle. Axes lose to lances, lances lose to swords, swords lose to axes.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Goro',
                text: "That's ROCK PAPER SCISSORS. This game is ROCK PAPER SCISSORS.",
                speakerFaction: 'player',
              },
              { speaker: 'Shigeru', text: 'Welcome to tactical RPGs.', speakerFaction: 'player' },
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
                speaker: 'Baraku',
                text: 'I am Baraku the Terr\u2014 stop YAWNING. This is my INTRO SPEECH.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: "I've heard it 347 times, Baraku.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Baraku',
                text: "Well I've GIVEN it 347 times and it still deserves RESPECT.",
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: 'Can we skip to the part where I beat you with the Rapier?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Baraku',
                text: 'NO. We do the speech. We do the fight. We do this PROPERLY.',
                speakerFaction: 'enemy',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss pre-combat — Shigeru approaches throne
    {
      id: 'ch1_boss_precombat',
      trigger: { type: 'unit_at', unitId: 'shigeru', position: { x: 11, y: 2 } },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Baraku', text: "You remember too, don't you?", speakerFaction: 'enemy' },
              { speaker: 'Shigeru', text: '...How long have you known?', speakerFaction: 'player' },
              {
                speaker: 'Baraku',
                text: "Every cycle. All 347. I've been the tutorial boss since the beginning. You at least get to MOVE. I stand on this throne and wait to die.",
                speakerFaction: 'enemy',
              },
              { speaker: 'Shigeru', text: "I'm sorry.", speakerFaction: 'player' },
              { speaker: 'Baraku', text: 'Just make it quick.', speakerFaction: 'enemy' },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss killed
    {
      id: 'ch1_boss_killed',
      trigger: { type: 'unit_killed', unitId: 'baraku' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Baraku', text: 'See you next cycle.', speakerFaction: 'enemy' },
              { speaker: 'Shigeru', text: '...Maybe not.', speakerFaction: 'player' },
              { speaker: 'Baraku', text: 'You say that every time.', speakerFaction: 'enemy' },
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
          text: 'Shigeru, you knew exactly where every enemy was. Before we even started.',
          speakerFaction: 'player',
        },
        { speaker: 'Shigeru', text: 'I pay attention.', speakerFaction: 'player' },
        {
          speaker: 'Akira',
          text: 'Nobody pays THAT much attention. You called the bandit by name.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: "Akira... when the time is right, I'll explain everything. For now, just trust me.",
          speakerFaction: 'player',
        },
        {
          speaker: 'Akira',
          text: '...Very well. I trust you, Shigeru. Always.',
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'exp_both', amount: 20 },
    },
    {
      unitA: 'kanna',
      unitB: 'hina',
      lines: [
        {
          speaker: 'Hina',
          text: "Kanna! I've been meaning to ask \u2014 do you believe in love at first sight?",
          speakerFaction: 'player',
        },
        {
          speaker: 'Kanna',
          text: "I believe in observable phenomena with reproducible results. 'Love at first sight' is a confirmation bias.",
          speakerFaction: 'player',
        },
        {
          speaker: 'Hina',
          text: "That's... the most romantic thing anyone has ever said to me.",
          speakerFaction: 'player',
        },
        { speaker: 'Kanna', text: '...How?', speakerFaction: 'player' },
      ],
      reward: { type: 'stat', unitId: 'hina', stat: 'mag', amount: 1 },
    },
  ],
};
