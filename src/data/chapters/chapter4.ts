import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const X: TerrainType = 'wall';
const T: TerrainType = 'fort';
const V: TerrainType = 'village';
const H: TerrainType = 'throne';

// 18 columns x 10 rows — pirate stronghold (reframed from ruins)
const terrain: TerrainType[][] = [
  //0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17
  [X, X, X, X, X, F, X, X, H, X, X, F, X, X, X, X, X, X], // row 0 — throne at (8,0)
  [X, P, P, X, P, P, P, P, P, P, P, P, P, X, P, P, P, X], // row 1
  [X, P, P, X, P, X, X, P, P, X, X, P, P, X, P, P, P, X], // row 2
  [X, P, P, P, P, X, P, P, P, P, X, P, P, P, P, X, P, X], // row 3
  [X, X, X, P, X, X, P, T, P, P, X, X, P, X, X, P, P, X], // row 4 — fort at (7,4)
  [X, V, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, X], // row 5 — village at (1,5), main corridor
  [X, P, X, X, P, X, P, P, P, X, P, X, X, P, V, P, P, X], // row 6 — village at (14,6)
  [X, P, P, P, P, X, P, T, P, X, P, P, P, P, P, P, P, X], // row 7 — fort at (7,7)
  [X, X, P, P, P, P, P, P, P, P, P, P, P, P, X, V, P, X], // row 8 — village at (15,8)
  [M, X, X, F, P, P, P, P, P, P, P, P, F, X, X, P, P, M], // row 9 — entrance
];

export const CHAPTER_4: ChapterData = {
  id: 'ch4',
  name: 'Chapter 4: The Cape of Tsutsu',
  chapterNumber: 4,
  mapWidth: 18,
  mapHeight: 10,
  terrain,
  playerUnits: [
    { unitId: 'shigeru', position: { x: 7, y: 9 } },
    { unitId: 'akira', position: { x: 10, y: 9 } },
    { unitId: 'kanna', position: { x: 6, y: 9 } },
    { unitId: 'hina', position: { x: 11, y: 9 } },
    { unitId: 'goro', position: { x: 8, y: 9 } },
    { unitId: 'genzo', position: { x: 9, y: 9 } },
    { unitId: 'sayo', position: { x: 5, y: 9 } },
    { unitId: 'hachi', position: { x: 4, y: 9 } },
  ],
  enemyUnits: [
    { unitId: 'ch4_soldier_1', position: { x: 4, y: 7 } },
    { unitId: 'ch4_soldier_2', position: { x: 13, y: 7 } },
    { unitId: 'ch4_soldier_3', position: { x: 15, y: 5 } },
    { unitId: 'ch4_fighter_1', position: { x: 8, y: 5 } },
    { unitId: 'ch4_fighter_2', position: { x: 3, y: 5 } },
    { unitId: 'ch4_fighter_3', position: { x: 13, y: 3 } },
    { unitId: 'ch4_mage_1', position: { x: 11, y: 3 } },
    { unitId: 'ch4_mage_2', position: { x: 5, y: 3 } },
    { unitId: 'ch4_guard_1', position: { x: 7, y: 4 } }, // on fort
    { unitId: 'ch4_guard_2', position: { x: 4, y: 1 } },
    { unitId: 'ch4_boss', position: { x: 8, y: 0 } }, // boss — aggressive AI, will leave throne
  ],
  objective: {
    type: 'seize',
    description: 'Seize the throne',
  },
  seizePosition: { x: 8, y: 0 },
  deploymentSlots: 7,
  forceDeploy: ['shigeru'],
  recruitableUnits: [],
  prologue: {
    lines: [
      {
        speaker: 'Narrator',
        text: "Shigeru's company arrives at the cape town of Tsutsu. Overturned stalls and fleeing merchants paint a grim picture.",
      },
      { speaker: 'Akira', text: 'Raiders? This far south?', speakerFaction: 'player' },
      {
        speaker: 'Kanna',
        text: 'Sea raiders. They have been working this cape for weeks. Three storehouses are still holding out.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Goro',
        text: 'Pirates. Do pirates keep good axes? Asking for professional reasons.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Hina',
        text: 'Goro. These people are losing their homes.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Goro',
        text: 'Aye, and I mean to take the axes off the men doing it. Where is the disagreement?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'We protect the storehouses. All three. If even one falls, the town loses its trade route.',
        speakerFaction: 'player',
      },
    ],
  },
  epilogue: {
    lines: [
      {
        speaker: 'Hina',
        text: "Hachi, was it? You're really staying with us?",
        speakerFaction: 'player',
      },
      {
        speaker: 'Hachi',
        text: 'You lot move through a town like a parade and somehow nobody has killed you. I want to see how far that goes.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Genzo',
        text: 'They took my belt pouch. Twice. During the battle.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Hachi',
        text: 'And gave it back twice. Consider it a lesson, grandfather.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Goro',
        text: 'I like them.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Hachi',
        text: 'One thing, though. The back lane behind the north storehouse. Do not go down it.',
        speakerFaction: 'player',
      },
      { speaker: 'Kanna', text: 'Why not?', speakerFaction: 'player' },
      {
        speaker: 'Hachi',
        text: 'Cats will not walk it. Every cat in Tsutsu, and not one of them will set foot in that lane. I have been picking pockets in this town since I was six and I have learned to bet on the cats.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Kanna',
        text: 'Which way does the lane run?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Hachi',
        text: 'West-north-west. Straight as a rule. Why has everyone gone quiet?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Narrator',
        text: 'That night Kanna walked the lane end to end with a lamp, and came back without saying what she had found.',
      },
    ],
  },
  villages: [
    {
      position: { x: 1, y: 5 },
      reward: {
        type: 'weapon',
        weaponId: 'steel_sword',
        dialogue: 'You saved my shop! Here \u2014 take this blade. It is the least I can do.',
        speaker: 'Merchant',
      },
    },
    {
      position: { x: 14, y: 6 },
      reward: {
        type: 'weapon',
        weaponId: 'silver_sword',
        dialogue: 'The pirates hid this in my cellar. Take it before they come back.',
        speaker: 'Shopkeeper',
      },
    },
    {
      position: { x: 15, y: 8 },
      reward: {
        type: 'weapon',
        weaponId: 'javelin',
        dialogue: 'My grandfather forged this. Use it well against those scoundrels.',
        speaker: 'Old Fisherman',
      },
    },
  ],
  parTurns: 12,
  reinforcements: [
    {
      turn: 4,
      units: [
        { unitId: 'ch4_reinforce_1', position: { x: 4, y: 9 } },
        { unitId: 'ch4_reinforce_2', position: { x: 12, y: 9 } },
        { unitId: 'ch4_reinforce_3', position: { x: 16, y: 8 } },
      ],
      message: 'More pirates arrive from the docks!',
    },
  ],
  events: [
    // Turn 2 — Thief rush warning
    {
      id: 'ch4_thief_rush',
      trigger: { type: 'turn_start', turn: 2 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Kanna',
                text: "Raiders \u2014 heading for the storehouses. They're fast and they won't stop to fight.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'Split up. Cover all three routes.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Goro',
                text: 'Split three ways? Against that many? We will be thin everywhere and strong nowhere.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Akira',
                text: 'He is right, my lord. Doctrine says concentrate.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'Doctrine assumes the objective is the enemy. It is not. It is three roofs full of a town’s winter grain. Split up.',
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 3 — Hachi encounter
    {
      id: 'ch4_hachi_encounter',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Hachi',
                text: 'Purse. Purse. Ooh, a good purse. And what have we here \u2014 a very fine sword on a very tired prince\u2014',
                speakerFaction: 'player',
              },
              { speaker: 'Shigeru', text: 'Put it down.', speakerFaction: 'player' },
              {
                speaker: 'Hachi',
                text: 'How did you even see me? I was behind a barrel!',
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'You were behind half a barrel. Also you were humming.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Hachi',
                text: '...I hum when I concentrate. It is a flaw. I am working on it.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'The pirates are three streets away and about to burn the grain. Run, or help.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Hachi',
                text: 'Those are the only two choices? No third option where I take the sword and run?',
                speakerFaction: 'player',
              },
              { speaker: 'Shigeru', text: 'No.', speakerFaction: 'player' },
              {
                speaker: 'Hachi',
                text: '...Fine. I know every alley in this town, which is more than your knight does. Follow me and try not to clank.',
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 5 — Village pressure
    {
      id: 'ch4_village_pressure',
      trigger: { type: 'turn_start', turn: 5 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Kanna',
                text: "That raider is closing on the southern storehouse. If they reach it, it's lost.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Sayo',
                text: "I can intercept \u2014 but I'd be overextended.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: "Do it. We can't lose any of them.",
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss pre-combat — Shigeru approaches Zanba
    {
      id: 'ch4_boss_precombat',
      trigger: { type: 'unit_at', unitId: 'shigeru', position: { x: 8, y: 1 } },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Zanba',
                text: 'A prince. In my town. Wearing a crown-sword worth more than this whole quarter.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: 'Take your boats and go. I have no interest in you.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Zanba',
                text: 'Kurogane pays for grain and asks no questions. Amagi is a name on a burnt map. Why would I go anywhere?',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: 'Because the men who pay you are also the reason the fish are leaving the river. Ask your own crews.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Zanba',
                text: '...Pretty speech. Draw, boy.',
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
      id: 'ch4_boss_killed',
      trigger: { type: 'unit_killed', unitId: 'ch4_boss' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Goro',
                text: 'Search him. A man like that keeps his coin close.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Hachi',
                text: 'Already have. It is a Kurogane pay chit, signed, dated this month.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'So the Empire is paying river pirates to starve its own conquest.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Genzo',
                text: 'A hungry province does not raise an army. That is not cruelty, my lord. That is the manual.',
                speakerFaction: 'player',
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
      unitA: 'hachi',
      unitB: 'goro',
      lines: [
        {
          speaker: 'Goro',
          text: 'Hachi. Best thing you ever lifted. Go.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Hachi',
          text: 'A ring of keys off a harbourmaster. Opened every warehouse on the north quay.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Goro',
          text: 'Keys. That is not treasure, that is a tool. I meant weapons. Armour. Things that hit.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Hachi',
          text: 'I fed forty families that winter with those keys. How many did your axe feed?',
          speakerFaction: 'player',
        },
        {
          speaker: 'Goro',
          text: '...Right. Fine. Keys. Good answer.',
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'goro', stat: 'str', amount: 1 },
    },
    {
      unitA: 'genzo',
      unitB: 'sayo',
      lines: [
        { speaker: 'Genzo', text: "You don't talk much.", speakerFaction: 'player' },
        { speaker: 'Sayo', text: 'No.', speakerFaction: 'player' },
        {
          speaker: 'Genzo',
          text: 'Eleven years on a wall and nobody said a word to me either. It is not the worst way to pass a life.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Sayo',
          text: 'I prefer high ground and clear sightlines to conversation.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Genzo',
          text: '...That might be the most relatable thing anyone in this company has said to me.',
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'sayo', stat: 'skl', amount: 1 },
    },
  ],
};
