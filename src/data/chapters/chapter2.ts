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
  name: 'Chapter 2: The Sasu Crossing',
  chapterNumber: 2,
  mapWidth: 18,
  mapHeight: 10,
  terrain,
  playerUnits: [
    { unitId: 'shigeru', position: { x: 6, y: 8 } },
    { unitId: 'akira', position: { x: 10, y: 8 } },
    { unitId: 'lisette', position: { x: 7, y: 9 } },
    { unitId: 'mirelle', position: { x: 11, y: 9 } },
    { unitId: 'gareth', position: { x: 8, y: 8 } },
  ],
  enemyUnits: [
    { unitId: 'ch2_fighter_1', position: { x: 4, y: 5 } },
    { unitId: 'ch2_soldier_1', position: { x: 7, y: 3 } },
    { unitId: 'ch2_guard_1', position: { x: 6, y: 1 } },
    { unitId: 'vidar', position: { x: 7, y: 0 } },
    // Halvar: player template placed as enemy, defects turn 3 via event
    {
      unitId: 'halvar',
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
        text: 'Dawn on the Sasu river. A Kurogane garrison holds the only bridge for thirty miles, and behind it the road runs south to Tsutsu and the last harbour still ours.',
      },
      {
        speaker: 'Akira',
        text: 'Regulars this time, my lord. Walls, watch rotations, a commander who knows his trade. Not brigands.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: 'Their banner is Commander Vidar\u2019s. He took this bridge eleven days ago and has not moved a man since. He will not come out to meet us.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'Then we go to him. How do you know his banner, Lisette?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: 'I catalogued every heraldic device in the royal archive when I was fourteen. It was that or conversation.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Gareth',
        text: 'I like her. Are these ones going to fight back, at least? The last lot mostly ran.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: 'I have bandages, thread, and a very stern speech about not dying. Please make me use only the first two.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'Take the bridge. Nobody crosses alone.',
        speakerFaction: 'player',
      },
    ],
  },
  epilogue: {
    lines: [
      {
        speaker: 'Lisette',
        text: 'Shigeru. Vidar was carrying a ward-stone. A shrine ward — the kind that is set into a seal and never, ever leaves it.',
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: 'From which shrine?', speakerFaction: 'player' },
      {
        speaker: 'Lisette',
        text: 'The one at Are. And it is cracked clean through. Wards do not crack. They are cut from a single stone precisely so they cannot.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Halvar',
        text: 'The shrine at Are. That is where the Emperor went, before the war. Alone. He came back three days later and gave the order to march.',
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: 'Went there and did what?', speakerFaction: 'player' },
      {
        speaker: 'Halvar',
        text: 'Nobody asked. You do not ask Takeshi things.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: 'The Sacred Flames hold the seal. If a ward is broken, then the seal is... my lord, that is not a small thing.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: 'Give me the stone and time. If something is leaking out of the west, it will leave traces, and traces can be mapped.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Narrator',
        text: 'The company crossed the Sasu that evening, carrying a cracked ward and a name none of them wanted to say twice.',
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
  recruitableUnits: ['halvar'],
  events: [
    // Turn 2 — Bridge strategy + Lisette tracking
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
                speaker: 'Lisette',
                text: 'Or we flank through the shallow water. Slower, but we approach from two sides.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: 'Note the sentry on the north wall who has not turned his head once. Either he is asleep or he wants us to think he is.',
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 3 — Halvar defection (expanded)
    {
      id: 'ch2_halvar_defection_dialogue',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Halvar', text: 'I am done.', speakerFaction: 'enemy' },
              { speaker: 'Akira', text: 'It is a trap. Hold the line!', speakerFaction: 'player' },
              {
                speaker: 'Halvar',
                text: 'It is not. Sergeant Halvar, second wall company. Eleven years I have stood a watch post for that man.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: 'And today you are putting down your lance in front of an enemy prince. Why today?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Halvar',
                text: 'Three weeks ago my own army burned a village I could see from my post. I watched the smoke for two days and I did not leave my post, because that is what a good soldier does.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Halvar',
                text: 'I have thought about that for three weeks. I have decided I would rather be a bad soldier.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Gareth',
                text: 'Huh. That is either the bravest thing I have heard or the stupidest.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Halvar',
                text: 'It is both, lad. Most true things are.',
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    {
      id: 'ch2_halvar_defection_recruit',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [{ type: 'recruit_unit', unitId: 'halvar' }],
      once: true,
    },
    // Turn 4 — Lisette's seed observation
    {
      id: 'ch2_lisette_wards',
      trigger: { type: 'turn_start', turn: 4 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Lisette',
                text: 'My lord. The grass along the north wall is grey. Not dead \u2014 grey. It has no scorch, no rot, no insects.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'Lisette, we are in the middle of\u2014',
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: 'It runs in a line. Two paces wide, arrow-straight, and it points west-north-west. Toward the sea cliffs.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Mirelle',
                text: 'The old shrine songs call that ashfall. They say it comes before the Blackflame.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: 'Songs are not evidence. But a straight line across broken ground is, and something drew it.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'Then mark it and finish the battle. We can be frightened later, in order.',
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss pre-combat — Shigeru approaches Vidar
    {
      id: 'ch2_boss_precombat',
      trigger: { type: 'unit_at', unitId: 'shigeru', position: { x: 7, y: 1 } },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Vidar',
                text: 'Halt. I am Commander Vidar of the border garrison. State your purpose.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: 'To cross your bridge. Amagi has fallen. There is nothing behind me worth defending and nothing ahead of me but road.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Vidar',
                text: 'Then you are the prince. My orders name you. They do not, I notice, explain you.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: 'Your emperor broke the shrine at Are. Do your orders explain that?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Vidar',
                text: '...My orders are to hold this bridge. A soldier who reads past his orders is a soldier looking for a reason to run.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: 'One of your sergeants read past his this morning.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Vidar',
                text: 'Then he will die a coward. Raise your sword.',
                speakerFaction: 'enemy',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss killed — Halvar reflects
    {
      id: 'ch2_boss_killed',
      trigger: { type: 'unit_killed', unitId: 'vidar' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Halvar',
                text: 'He was not a cruel man. He simply never once looked up from his orders.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'That is most of the men we are going to have to kill, Halvar.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Halvar',
                text: 'Aye. That is why I am telling you now, while it still bothers you.',
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
      unitB: 'lisette',
      lines: [
        {
          speaker: 'Lisette',
          text: 'My lord, may I be blunt? You give orders as though every one of them is already a mistake.',
          speakerFaction: 'player',
        },
        { speaker: 'Shigeru', text: 'That is because most of them are.', speakerFaction: 'player' },
        {
          speaker: 'Lisette',
          text: 'A commander who is certain gets people killed for nothing. A commander who is uncertain gets them killed slowly. Pick a third thing.',
          speakerFaction: 'player',
        },
        { speaker: 'Shigeru', text: 'Which is?', speakerFaction: 'player' },
        {
          speaker: 'Lisette',
          text: 'Ask me for the numbers before you decide, instead of after. I am extremely good at numbers and extremely bad at consoling people.',
          speakerFaction: 'player',
        },
        { speaker: 'Shigeru', text: '...Very well. Before, then.', speakerFaction: 'player' },
      ],
      reward: { type: 'stat', unitId: 'shigeru', stat: 'skl', amount: 1 },
    },
    {
      unitA: 'akira',
      unitB: 'mirelle',
      lines: [
        {
          speaker: 'Mirelle',
          text: 'Sir Akira. You have been awake for two nights and you keep standing outside his tent.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Akira',
          text: 'It is the correct post for a retainer.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Mirelle',
          text: 'It is the correct post for a man who is afraid that if he sits down he will start thinking about the palace.',
          speakerFaction: 'player',
        },
        { speaker: 'Akira', text: '...', speakerFaction: 'player' },
        {
          speaker: 'Mirelle',
          text: 'Sit down, Sir Akira. I will take the post. I am very small and very loud and nobody gets past me.',
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'exp_both', amount: 15 },
    },
  ],
};
