import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const W: TerrainType = 'water';
const X: TerrainType = 'wall';
const T: TerrainType = 'fort';
const V: TerrainType = 'village';
const H: TerrainType = 'throne';
const B: TerrainType = 'bridge';
const C: TerrainType = 'chest';

// 14 columns x 16 rows — vertical mountain fortress assault
const terrain: TerrainType[][] = [
  // 0  1  2  3  4  5  6  7  8  9  10 11 12 13
  [X, X, X, X, X, X, X, X, X, X, P, P, P, M], // row 0  — fortress north wall, NE open (void target)
  [X, P, P, P, P, P, P, H, P, P, P, P, P, X], // row 1  — throne at (7,1)
  [X, P, P, X, P, P, P, P, P, P, X, P, P, X], // row 2  — interior pillars
  [X, P, P, P, P, X, P, P, X, P, P, P, C, X], // row 3  — archers + chest at (12,3)
  [X, X, P, P, P, P, P, P, P, P, P, P, X, X], // row 4  — fortress inner gate
  [M, X, P, P, F, P, P, P, P, F, P, P, X, M], // row 5  — fortress edge
  [M, F, P, F, P, P, P, P, P, P, F, P, F, M], // row 6  — forested ridge
  [M, F, P, W, B, P, P, P, P, P, P, P, F, M], // row 7  — bridge at (4,7), water at (3,7)
  [M, P, P, F, W, F, P, P, P, F, F, P, P, M], // row 8  — water below bridge
  [M, P, P, P, T, F, P, P, P, T, P, P, P, M], // row 9  — forts at (4,9) and (9,9)
  [P, P, F, P, P, P, P, P, P, P, P, F, P, P], // row 10 — brigand zone
  [P, P, V, P, P, F, P, P, F, P, P, P, P, P], // row 11 — village at (2,11)
  [P, P, P, P, F, P, P, P, P, F, P, P, P, P], // row 12 — approach
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 13 — deployment row 1
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 14 — deployment row 2
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 15 — deployment row 3
];

export const CHAPTER_5: ChapterData = {
  id: 'ch5',
  name: 'Chapter 5: Kaneda, Above the Clouds',
  chapterNumber: 5,
  mapWidth: 14,
  mapHeight: 16,
  terrain,
  playerUnits: [
    { unitId: 'shigeru', position: { x: 6, y: 14 } },
    { unitId: 'akira', position: { x: 7, y: 14 } },
    { unitId: 'lisette', position: { x: 6, y: 15 } },
    { unitId: 'gareth', position: { x: 5, y: 13 } },
    { unitId: 'mirelle', position: { x: 7, y: 15 } },
    { unitId: 'halvar', position: { x: 8, y: 13 } },
    { unitId: 'bryn', position: { x: 5, y: 15 } },
    { unitId: 'fenn', position: { x: 9, y: 13 } },
    { unitId: 'elin', position: { x: 4, y: 14 } },
  ],
  enemyUnits: [
    { unitId: 'ch5_boss', position: { x: 7, y: 1 } }, // Roderic on throne
    { unitId: 'ch5_knight_1', position: { x: 6, y: 2 } }, // escort left
    { unitId: 'ch5_knight_2', position: { x: 8, y: 2 } }, // escort right
    { unitId: 'ch5_soldier_1', position: { x: 5, y: 4 } }, // gate left
    { unitId: 'ch5_soldier_2', position: { x: 9, y: 4 } }, // gate right
    { unitId: 'ch5_archer_1', position: { x: 3, y: 3 } }, // wall archer left
    { unitId: 'ch5_archer_2', position: { x: 11, y: 3 } }, // wall archer right
    { unitId: 'ch5_cavalier_1', position: { x: 2, y: 7 } }, // flank cav left
    { unitId: 'ch5_cavalier_2', position: { x: 10, y: 7 } }, // flank cav right
    { unitId: 'ch5_mage_1', position: { x: 7, y: 5 } }, // courtyard mage
    { unitId: 'ch5_brigand_1', position: { x: 4, y: 10 } }, // approach brigand left
    { unitId: 'ch5_brigand_2', position: { x: 10, y: 10 } }, // approach brigand right
  ],
  objective: {
    type: 'seize',
    description: 'Defeat General Roderic and seize the throne',
  },
  seizePosition: { x: 7, y: 1 },
  deploymentSlots: 6,
  forceDeploy: ['shigeru'],
  parTurns: 14,
  recruitableUnits: ['elin'],
  prologue: {
    lines: [
      {
        speaker: 'Narrator',
        text: 'Dawn below Shiroyama. The old border fortress of Kaneda stands over the south shore of Aso Bay, built four centuries ago to watch the western sea. Clouds hang unnaturally low. A pegasus knight descends, lance drawn.',
      },
      {
        speaker: 'Elin',
        text: "DON'T go up there. Please. Something is wrong with the sky.",
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: 'Wrong how?', speakerFaction: 'player' },
      {
        speaker: 'Elin',
        text: 'There is a hole in it. Out over the western cliffs, a stretch of sky the size of a village where there is no cloud, no sun, no colour. My mare will not fly within a mile of it and she has flown through a storm front.',
        speakerFaction: 'player',
      },
      { speaker: 'Akira', text: 'Sky does not have holes in it.', speakerFaction: 'player' },
      { speaker: 'Elin', text: 'I know what I flew past.', speakerFaction: 'player' },
      {
        speaker: 'Lisette',
        text: 'What bearing, rider? From the fortress — what bearing to the hole?',
        speakerFaction: 'player',
      },
      { speaker: 'Elin', text: '...West-north-west. Why?', speakerFaction: 'player' },
      {
        speaker: 'Shigeru',
        text: 'Because that is the fourth one. Lisette?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: 'Four marks on one bearing is not a line any more, my lord. It is an arrow, and the point of it is the shrine at Are.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: 'The fortress is held in strength. General Roderic has knights on every approach. If we are taking it, we take it from above — which means we need her.',
        speakerFaction: 'player',
      },
    ],
  },
  epilogue: {
    lines: [
      {
        speaker: 'Narrator',
        text: 'The fortress courtyard, after the battle. The rift at its centre has closed. The stones where it stood are grey, and nothing casts a shadow on them.',
      },
      {
        speaker: 'Lisette',
        text: 'I have it. Every mark we have seen since the Sasu bridge, laid on the survey maps. It is not a spreading stain. It is a line, and it is being drawn.',
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: 'Drawn from where to where?', speakerFaction: 'player' },
      {
        speaker: 'Lisette',
        text: 'From the shrine at Are \u2014 to us. Every mark is nearer than the last. It has been walking toward this company since the day we found the cracked ward.',
        speakerFaction: 'player',
      },
      { speaker: 'Elin', text: 'Toward us. Not toward the cities?', speakerFaction: 'player' },
      {
        speaker: 'Lisette',
        text: 'It went past two cities to get here. It wants something we are carrying.',
        speakerFaction: 'player',
      },
      { speaker: 'Mirelle', text: 'The Flamebrand.', speakerFaction: 'player' },
      {
        speaker: 'Halvar',
        text: 'Then say the rest of it, my lord, since nobody else will. The shrine at Are held the Blackflame. Takeshi went into that shrine alone before the war and came out changed. And now the thing that was sealed there is walking inland, and it knows where your sword is.',
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: '...Yes. That is the shape of it.', speakerFaction: 'player' },
      {
        speaker: 'Akira',
        text: 'Then we stop running. My lord \u2014 if it is following the Flamebrand, every town we pass through is a town it burns after we leave.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'I know. We turn west at the harbour. Lisette \u2014 I want to know what it is before I take it to my father\u2019s sword.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Narrator',
        text: 'They had spent five chapters running from an empire. From that evening they were walking toward something older, and they knew its name.',
      },
    ],
  },
  villages: [
    {
      position: { x: 2, y: 11 },
      reward: {
        type: 'weapon',
        weaponId: 'steel_sword',
        dialogue:
          'This blade was forged for mountain warfare. Take it — you will need it up there.',
        speaker: 'Mountain Smith',
      },
    },
  ],
  chests: [
    {
      position: { x: 12, y: 3 },
      reward: {
        type: 'weapon',
        weaponId: 'javelin',
        dialogue: 'A javelin was stored inside the chest.',
        speaker: 'Narrator',
      },
    },
  ],
  reinforcements: [
    {
      turn: 6,
      units: [
        { unitId: 'ch5_reinforce_1', position: { x: 3, y: 14 } },
        { unitId: 'ch5_reinforce_2', position: { x: 10, y: 14 } },
      ],
      message: 'Enemy reinforcements arrive from the south!',
    },
    {
      turn: 8,
      units: [{ unitId: 'ch5_reinforce_3', position: { x: 0, y: 10 } }],
      message: 'An enemy cavalier charges from the west!',
    },
  ],
  events: [
    // Turn 3 — Terrain Shift: 6 tiles change, disrupting planned paths
    {
      id: 'ch5_terrain_shift',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Gareth',
                text: 'Did that TREE just turn into a RIVER?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: 'Ground does not do that. I surveyed this valley from the ridge two hours ago.',
                speakerFaction: 'player',
              },
              { speaker: 'Shigeru', text: 'Lisette. Your map.', speakerFaction: 'player' },
              {
                speaker: 'Lisette',
                text: 'Useless, my lord. Every route I plotted has changed under us. Warn the men — nobody trusts the ground they have not just walked on.',
                speakerFaction: 'player',
              },
            ],
          },
        },
        { type: 'change_terrain', position: { x: 4, y: 8 }, terrain: 'plain' }, // water → plain
        { type: 'change_terrain', position: { x: 5, y: 6 }, terrain: 'mountain' }, // plain → mountain
        { type: 'change_terrain', position: { x: 9, y: 6 }, terrain: 'water' }, // plain → water
        { type: 'change_terrain', position: { x: 3, y: 9 }, terrain: 'forest' }, // plain → forest
        { type: 'change_terrain', position: { x: 10, y: 9 }, terrain: 'mountain' }, // plain → mountain
        { type: 'change_terrain', position: { x: 7, y: 8 }, terrain: 'forest' }, // plain → forest
      ],
      once: true,
    },
    // Turn 5 — Data Void: 3×2 block appears in NE corner, nearby enemies scatter
    {
      id: 'ch5_data_void',
      trigger: { type: 'turn_start', turn: 5 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Elin',
                text: 'That. That is the hole. That is what is in the sky, and now it is on the ground.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Fenn',
                text: 'I threw a stone into it. I did not hear it land.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: 'I cannot measure a thing that gives nothing back. No heat, no sound, no shadow. It is a hole in the world and I do not have a word for it.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Mirelle',
                text: 'The shrine songs have a word. They call it the Abyss, and they say the Blackflame leaves one behind wherever it has fed.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'Nobody goes near it. Push on to Roderic.',
                speakerFaction: 'player',
              },
            ],
          },
        },
        // 3×2 data void block: rows 0-1, cols 10-12
        { type: 'change_terrain', position: { x: 10, y: 0 }, terrain: 'data_void' },
        { type: 'change_terrain', position: { x: 11, y: 0 }, terrain: 'data_void' },
        { type: 'change_terrain', position: { x: 12, y: 0 }, terrain: 'data_void' },
        { type: 'change_terrain', position: { x: 10, y: 1 }, terrain: 'data_void' },
        { type: 'change_terrain', position: { x: 11, y: 1 }, terrain: 'data_void' },
        { type: 'change_terrain', position: { x: 12, y: 1 }, terrain: 'data_void' },
        // Nearby enemies panic: scatter from guard to aggressive
        { type: 'change_ai', unitId: 'ch5_archer_2', newBehavior: { type: 'aggressive' } },
        { type: 'change_ai', unitId: 'ch5_cavalier_2', newBehavior: { type: 'aggressive' } },
      ],
      once: true,
    },
    // Turn 7 — Forecast Flicker: dialogue-only story beat
    {
      id: 'ch5_forecast_flicker',
      trigger: { type: 'turn_start', turn: 7 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Narrator',
                text: 'For the space of a breath the whole valley goes silent — no wind, no birds, no ring of steel — and then the noise of the battle rushes back in.',
              },
              {
                speaker: 'Lisette',
                text: 'It moved. The rift. It was in the north corner and now it is thirty paces closer and nobody saw it cross.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Gareth',
                text: 'Can we be frightened of the hole after the men with lances stop charging us?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: 'You are not listening. It is moving toward the prince. Not toward the fighting — toward him.',
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss approach — Shigeru reaches the fortress gate
    {
      id: 'ch5_boss_approach',
      trigger: { type: 'unit_at', unitId: 'shigeru', position: { x: 7, y: 4 } },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Roderic',
                text: 'You have beaten brigands and river scum. Now you meet a soldier.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: 'There is a hole in your courtyard, General, and it is getting bigger. How many of your men have you lost to it?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Roderic',
                text: 'Nine. I reported it to the capital three times. The reply was: hold the fortress.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: 'And that was enough for you?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Roderic',
                text: 'It has to be. A man my age does not get to start asking questions. Come and take the gate.',
                speakerFaction: 'enemy',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss killed — Roderic's denial
    {
      id: 'ch5_boss_killed',
      trigger: { type: 'unit_killed', unitId: 'ch5_boss' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Roderic',
                text: 'Nine men to the hole. The rest to you. A fine account of a career.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: 'It was not us that broke this place, General. It was already coming apart.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Roderic',
                text: 'I know. Boy — the Emperor came through here in the spring. He walked to the edge of that hole and he stood at it for an hour and he was not afraid of it.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: 'What did he say?',
                speakerFaction: 'player',
              },
              {
                speaker: 'Roderic',
                text: '"Good. It is still hungry." ...Take the fortress. I have nothing else to give you.',
                speakerFaction: 'enemy',
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
      unitB: 'elin',
      lines: [
        {
          speaker: 'Elin',
          text: 'My lord, may I speak plainly? From the air I can see the whole of a battle at once. It is not like being in one.',
          speakerFaction: 'player',
        },
        { speaker: 'Shigeru', text: 'How is it different?', speakerFaction: 'player' },
        {
          speaker: 'Elin',
          text: 'From up there they are shapes. I can watch a shape stop moving and feel nothing about it. That frightens me more than the hole in the sky does.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: '...I have the same problem from the ground. Come and find me when it starts feeling easy. I will do the same.',
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'elin', stat: 'spd', amount: 1 },
    },
    {
      unitA: 'akira',
      unitB: 'gareth',
      lines: [
        {
          speaker: 'Akira',
          text: 'Gareth, your axework is... unconventional. But effective.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Gareth',
          text: 'Hah! No one ever taught me proper form. I just hit things until they stop moving.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Akira',
          text: 'Here — widen your stance when you swing overhead. It will add power without sacrificing balance.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Gareth',
          text: 'A knight teaching a brawler? I like this army.',
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'gareth', stat: 'skl', amount: 1 },
    },
  ],
};
