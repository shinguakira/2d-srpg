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
  [F, P, P, P, P, P, P, P, P, P, P, P, P, F], // row 3  — Viviane appears here
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
  name: 'Chapter 9: The Empty Place',
  chapterNumber: 9,
  mapWidth: 14,
  mapHeight: 14,
  terrain,
  playerUnits: [
    { unitId: 'shigeru', position: { x: 6, y: 12 } },
    { unitId: 'lisette', position: { x: 7, y: 12 } },
    { unitId: 'gareth', position: { x: 5, y: 13 } },
    { unitId: 'mirelle', position: { x: 8, y: 13 } },
    { unitId: 'akira', position: { x: 6, y: 13 } },
    { unitId: 'bryn', position: { x: 7, y: 13 } },
    { unitId: 'corwin', position: { x: 5, y: 12 } },
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
        text: 'A pass through the old forest under Shiratake, where the trees have never been cut. The company moves in silence. Nobody has taken the empty place in the marching order.',
      },
      { speaker: 'Gareth', text: '...', speakerFaction: 'player' },
      {
        speaker: 'Lisette',
        text: 'I have the route. One pass, forest on both sides, three places worth standing on. A day, if nothing goes wrong.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'Everyone stays close. No heroics. We move as a group.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: 'He would have taken the rearguard. He always took the rearguard, and he never once made a thing of it.',
        speakerFaction: 'player',
      },
      { speaker: 'Mirelle', text: '...I know.', speakerFaction: 'player' },
      {
        speaker: 'Corwin',
        text: 'Raiders ahead. Scouts, by the look of them. Too ragged to be Kurogane regulars.',
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: 'Then we clear the path. Together.', speakerFaction: 'player' },
    ],
  },
  epilogue: {
    lines: [
      {
        speaker: 'Narrator',
        text: 'The old forest thins. The company comes out onto open ground above the bay, bruised and intact.',
      },
      {
        speaker: 'Viviane',
        text: 'That was... not what I expected when I signed on with a travelling company.',
        speakerFaction: 'player',
      },
      { speaker: 'Gareth', text: 'We are not a travelling company.', speakerFaction: 'player' },
      {
        speaker: 'Viviane',
        text: 'No. You are not. You are something that lost its heart and kept walking anyway.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Narrator',
        text: "For a moment, the performer's mask slips. Viviane's eyes hold something older than comedy.",
      },
      {
        speaker: 'Viviane',
        text: '...I have seen that look before, on better people than me. It does not go away. It does get quieter.',
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: 'Thank you, Viviane.', speakerFaction: 'player' },
      { speaker: 'Gareth', text: '...You will do, performer.', speakerFaction: 'player' },
      {
        speaker: 'Mirelle',
        text: 'Stay with us. We could use someone who still knows how to smile.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: 'Everyone is still carrying it. We will not be ourselves again for another engagement at least, and that is not a thing I can fix with a chart.',
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
      id: 'ch9_halvar_absence',
      trigger: { type: 'turn_start', turn: 1 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Bryn',
                text: 'The left flank is open. Halvar would have planted himself in it and dared them.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Corwin',
                text: 'I will take it. I am not as stubborn as he was, but I will hold.',
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 3: Viviane appears and joins
    {
      id: 'ch9_viviane_joins',
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
                speaker: 'Viviane',
                text: 'There you are! I have been sitting in that treeline for two days waiting for somebody interesting to walk past!',
                speakerFaction: 'player',
              },
              { speaker: 'Gareth', text: '...Who is this?', speakerFaction: 'player' },
              {
                speaker: 'Viviane',
                text: 'Viviane. Dancer. And you lot look like a funeral that has not finished walking to the grave.',
                speakerFaction: 'player',
              },
              { speaker: 'Shigeru', text: 'We really do not.', speakerFaction: 'player' },
              {
                speaker: 'Viviane',
                text: 'That is exactly what a funeral would say. I am coming with you. Do not bother arguing, I have already put my things down.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: 'A dancer. A dancer can rouse a spent soldier to move again — which, given the state of this company, is worth more than another sword.',
                speakerFaction: 'player',
              },
            ],
          },
        },
        {
          type: 'spawn_units',
          units: [{ unitId: 'viviane', position: { x: 7, y: 3 } }],
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
                speaker: 'Lisette',
                text: 'Viviane — stand beside someone who has already spent themselves. Your dance will put them back on their feet for another go.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Viviane',
                text: 'An encore, then. Point me at whoever is finished and I will get them back on their feet.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Narrator',
                text: 'Tip: select Viviane, move beside a spent ally, then choose Dance. That ally gets a full turn back.',
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
                speaker: 'Akira',
                text: 'I keep checking the rear. Every turn. I know what is there and I keep checking it.',
                speakerFaction: 'player',
              },
              { speaker: 'Mirelle', text: 'So do I.', speakerFaction: 'player' },
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
      unitB: 'viviane',
      lines: [
        {
          speaker: 'Viviane',
          text: 'You hold yourself like a man in the third act. Is this the part where you tell me the terrible secret?',
          speakerFaction: 'player',
        },
        { speaker: 'Shigeru', text: 'There is no secret, Viviane.', speakerFaction: 'player' },
        {
          speaker: 'Viviane',
          text: 'Darling, there is ALWAYS a secret. The only question is who is carrying it.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: '...You are closer than I would like.',
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'exp_both', amount: 20 },
    },
    {
      unitA: 'gareth',
      unitB: 'corwin',
      lines: [
        {
          speaker: 'Gareth',
          text: 'You fight tidy. Too tidy. Where does a sellsword learn that?',
          speakerFaction: 'player',
        },
        {
          speaker: 'Corwin',
          text: 'Twenty years of it. Most of them for people I did not like.',
          speakerFaction: 'player',
        },
        { speaker: 'Gareth', text: 'Two hundred WHAT?', speakerFaction: 'player' },
        { speaker: 'Corwin', text: 'Jobs. I meant jobs.', speakerFaction: 'player' },
      ],
      reward: { type: 'stat', unitId: 'gareth', stat: 'str', amount: 1 },
    },
  ],
};
