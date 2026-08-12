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
  name: 'Chapter 3: The Shiine Hills',
  chapterNumber: 3,
  mapWidth: 25,
  mapHeight: 12,
  terrain,
  playerUnits: [
    { unitId: 'shigeru', position: { x: 9, y: 10 } },
    { unitId: 'akira', position: { x: 14, y: 10 } },
    { unitId: 'lisette', position: { x: 10, y: 11 } },
    { unitId: 'mirelle', position: { x: 15, y: 11 } },
    { unitId: 'gareth', position: { x: 11, y: 10 } },
    { unitId: 'halvar', position: { x: 12, y: 11 } },
    { unitId: 'bryn', position: { x: 13, y: 11 } },
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
  recruitableUnits: ['bryn'],
  prologue: {
    lines: [
      {
        speaker: 'Narrator',
        text: 'Rolling hills ahead. Forests cluster between ridgelines. A fortress sits on the highest hill.',
      },
      { speaker: 'Akira', text: 'Open ground at last. Room to ride.', speakerFaction: 'player' },
      {
        speaker: 'Shigeru',
        text: 'Not too far ahead. There is smoke over the eastern valley \u2014 a village, and it has been burning a while.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Halvar',
        text: 'Not Kurogane work. We burn a village in one hour and move on. That has been going since yesterday.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: 'Brigands, then. The Shiine hills have carried them for generations, and a kingdom with no soldiers left is an invitation.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Gareth',
        text: 'Can we talk about these trees? It takes twice as long to cross one stride of forest as one stride of grass. I can see the other side. It is right there.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: 'Because you must go around trunks, over roots, and through undergrowth. Forest costs double. Mountain costs triple. Both hide you better than open grass does.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Gareth',
        text: 'So the slow ground is the safe ground.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: '...Yes. That is exactly it. Well done.',
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: 'Then take the tree line. Move.', speakerFaction: 'player' },
    ],
  },
  epilogue: {
    lines: [
      {
        speaker: 'Mirelle',
        text: 'Bryn! Now that we are comrades I have some very important questions. Favourite colour? Any brothers or sisters? Have you ever been in love?',
        speakerFaction: 'player',
      },
      { speaker: 'Bryn', text: 'Green. No. No.', speakerFaction: 'player' },
      {
        speaker: 'Mirelle',
        text: 'Three answers! We are getting along famously!',
        speakerFaction: 'player',
      },
      { speaker: 'Bryn', text: 'We are not.', speakerFaction: 'player' },
      { speaker: 'Mirelle', text: 'Four! She is opening up!', speakerFaction: 'player' },
      {
        speaker: 'Gareth',
        text: 'I like her. She does not waste breath.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: 'My lord. That stand of pines on the ridge. Yesterday it was green. This morning it is grey \u2014 every needle, all the way to the roots, and no fire touched it.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'The same grey as the line at the bridge?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: 'The same grey, and it lies on the same bearing. Two marks make a line, my lord. Three would make it a road.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: 'A road going where?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: 'I do not know yet. But it is not running out to sea. It is coming inland, and it is keeping pace with us.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'Then we do not stop. Akira \u2014 the harbour road, and quickly.',
        speakerFaction: 'player',
      },
      { speaker: 'Akira', text: 'Already saddled, my lord.', speakerFaction: 'player' },
    ],
  },
  villages: [
    {
      position: { x: 5, y: 2 },
      reward: {
        type: 'weapon',
        weaponId: 'steel_sword',
        dialogue: 'A fine blade, forged by our best smith. Use it to drive these bandits out!',
        speaker: 'Sasu Blacksmith',
      },
    },
    {
      position: { x: 13, y: 2 },
      reward: {
        type: 'weapon',
        weaponId: 'elfire',
        dialogue: 'This tome was left behind by a traveling sage. It holds powerful fire magic.',
        speaker: 'Sasu Villager',
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
                speaker: 'Gareth',
                text: 'OW. How did that archer hit me from way over there??',
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: "You're standing on a plain. Zero avoid bonus. If you'd stopped in that forest tile, you'd have had +20 avoid.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Gareth',
                text: "I'm not hiding behind a TREE.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Halvar',
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
                text: "Akira's right. We can't brute force a fort tile. We'll need Lisette's magic or weapon advantage.",
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 3 — Bryn's rescue
    {
      id: 'ch3_bryn_rescue',
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
              { speaker: 'Bryn', text: 'Took you long enough.', speakerFaction: 'player' },
              {
                speaker: 'Shigeru',
                text: 'You held them off by yourself?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Bryn',
                text: "Bow. High ground. They can't reach me. Simple.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Mirelle',
                text: 'Oh! A mysterious loner with a bow! Are you the stoic rival type or the\u2014',
                speakerFaction: 'player',
              },
              { speaker: 'Bryn', text: "I'm a hunter.", speakerFaction: 'player' },
              {
                speaker: 'Mirelle',
                text: '...The strong-silent type. Got it.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: "Bows have 2-range. She can hit from two tiles away but can't fight at melee. No counterattacks up close.",
                speakerFaction: 'player',
              },
              {
                speaker: 'Bryn',
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
              {
                speaker: 'Lisette',
                text: 'My lord. The grey has reached us.',
                speakerFaction: 'player',
              },
              { speaker: 'Shigeru', text: 'Where?', speakerFaction: 'player' },
              {
                speaker: 'Lisette',
                text: 'Underfoot. That whole stretch of hillside was green when we deployed. It is ash now, and it is still spreading \u2014 slowly, but I can watch it happen.',
                speakerFaction: 'player',
              },
              { speaker: 'Halvar', text: 'Ground does not do that.', speakerFaction: 'player' },
              {
                speaker: 'Lisette',
                text: 'Correct. That is precisely why I am concerned.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Mirelle',
                text: 'Do not stand in it. Whatever else we decide \u2014 nobody stands in the grey.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'Agreed. Everyone keep off the ash. Lisette, mark where its edge is when we finish, then we deal with Olrik.',
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss pre-combat — Shigeru approaches Olrik
    {
      id: 'ch3_boss_precombat',
      trigger: { type: 'unit_at', unitId: 'shigeru', position: { x: 9, y: 4 } },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Olrik',
                text: 'This fortress will not fall while I draw breath.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: 'Captain Olrik. You are holding a hill fort in a kingdom that no longer exists, against men who have nowhere else to go. You do not have to die here.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Olrik',
                text: 'I was given this fort. I do not much care who is left below it. A post is a post.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: 'Look behind you, at the hillside. Does a post explain that?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Olrik',
                text: '...I have been told not to look at it. That is an order too. Raise your weapon, boy.',
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
              {
                speaker: 'Shigeru',
                text: 'Most of them are. That is the trouble.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Bryn',
                text: 'Was there another way? One where he lives.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: '...Not one I could find in the time I had. Ask me again next time. Keep asking me.',
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
      unitA: 'shigeru',
      unitB: 'mirelle',
      lines: [
        {
          speaker: 'Mirelle',
          text: 'My lord, the men need an evening where nobody is dying. A fire, a pot, somebody singing badly.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: 'We are being hunted across our own country, Mirelle.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Mirelle',
          text: 'Which is exactly why. Men who never rest do not become hard, my lord. They become brittle. I have buried enough of the brittle ones to know.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: '...One evening. Where would we even stop?',
          speakerFaction: 'player',
        },
        {
          speaker: 'Mirelle',
          text: 'Leave that to me. I have already made Gareth dig a fire pit. He thinks it was his idea.',
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'mirelle', stat: 'res', amount: 1 },
    },
    {
      unitA: 'gareth',
      unitB: 'halvar',
      lines: [
        {
          speaker: 'Gareth',
          text: 'Halvar. Straight question. Do you ever miss the other side?',
          speakerFaction: 'player',
        },
        {
          speaker: 'Halvar',
          text: 'I miss the bread. Kurogane feeds its soldiers properly. That is the whole list.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Gareth',
          text: 'Not the men?',
          speakerFaction: 'player',
        },
        {
          speaker: 'Halvar',
          text: 'I will be killing the men. Some of them taught me to shave. So no, lad, I do not let myself miss the men.',
          speakerFaction: 'player',
        },
        { speaker: 'Gareth', text: '...Sorry I asked.', speakerFaction: 'player' },
        {
          speaker: 'Halvar',
          text: 'Do not be. You are the first one who did.',
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'halvar', stat: 'def', amount: 1 },
    },
  ],
};
