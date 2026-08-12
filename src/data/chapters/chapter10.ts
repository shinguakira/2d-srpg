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

// 16 columns x 18 rows — village (south) + fortified hill (north)
const terrain: TerrainType[][] = [
  // 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
  [M, M, M, P, P, P, P, P, P, P, P, P, P, M, M, M], // row 0  — hilltop edge
  [M, M, P, P, P, P, P, H, P, P, P, P, P, P, M, M], // row 1  — throne at (7,1) — Sozen
  [M, P, P, P, X, P, P, P, P, P, X, P, P, P, P, M], // row 2  — hill fortifications
  [M, P, P, P, P, P, P, T, P, P, P, P, P, P, P, M], // row 3  — fort
  [P, P, P, F, F, P, P, P, P, P, F, F, P, P, P, P], // row 4  — forest flanks (left route)
  [P, P, F, F, P, P, P, P, P, P, P, P, F, F, P, P], // row 5
  [P, P, F, P, P, P, P, P, P, P, P, P, P, F, P, P], // row 6  — mid approach
  [P, P, P, P, P, P, W, W, W, W, P, P, P, P, P, P], // row 7  — water barrier (center bridge)
  [P, P, P, P, P, P, B, P, P, B, P, P, P, P, P, P], // row 8  — bridge crossing (center route)
  [P, P, P, P, P, P, W, W, W, W, P, P, P, P, P, P], // row 9  — water barrier
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 10 — open ground (right route)
  [P, P, P, P, F, P, P, P, P, P, P, F, P, P, P, P], // row 11 — approach to village
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 12 — village outskirts
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 13
  [P, P, X, V, X, P, P, P, P, P, X, V, X, P, P, P], // row 14 — village buildings
  [P, P, P, P, P, P, P, T, P, P, P, P, P, P, P, P], // row 15 — Elder Toki's position (fort at 7,15)
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 16 — deployment row 1
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 17 — deployment row 2
];

export const CHAPTER_10: ChapterData = {
  id: 'ch10',
  name: 'Chapter 10: What We Carry',
  chapterNumber: 10,
  mapWidth: 16,
  mapHeight: 18,
  terrain,
  playerUnits: [
    { unitId: 'shigeru', position: { x: 7, y: 16 } },
    { unitId: 'kanna', position: { x: 8, y: 16 } },
    { unitId: 'goro', position: { x: 6, y: 17 } },
    { unitId: 'hina', position: { x: 9, y: 17 } },
    { unitId: 'akira', position: { x: 7, y: 17 } },
    { unitId: 'raiga', position: { x: 5, y: 16 } },
    { unitId: 'sayo', position: { x: 10, y: 16 } },
    { unitId: 'kagura', position: { x: 8, y: 17 } },
  ],
  enemyUnits: [
    // Boss on throne
    { unitId: 'ch10_boss', position: { x: 7, y: 1 } },
    // Coordinated escort guards
    { unitId: 'ch10_guard_1', position: { x: 6, y: 2 } },
    { unitId: 'ch10_guard_2', position: { x: 8, y: 2 } },
    { unitId: 'ch10_guard_3', position: { x: 7, y: 3 } },
    // Hill defenders
    { unitId: 'ch10_soldier_1', position: { x: 4, y: 4 } },
    { unitId: 'ch10_soldier_2', position: { x: 11, y: 4 } },
    { unitId: 'ch10_mage_1', position: { x: 5, y: 3 } },
    { unitId: 'ch10_mage_2', position: { x: 10, y: 3 } },
    // Middle zone
    { unitId: 'ch10_soldier_3', position: { x: 6, y: 6 } },
    { unitId: 'ch10_soldier_4', position: { x: 9, y: 6 } },
    // Village raiders (approach from sides)
    { unitId: 'ch10_fighter_1', position: { x: 2, y: 12 } },
    { unitId: 'ch10_fighter_2', position: { x: 13, y: 12 } },
    // Elder Toki — ally NPC at village center
    {
      unitId: 'elder_toki',
      position: { x: 7, y: 15 },
      faction: 'ally',
      aiBehavior: { type: 'stationary' },
    },
  ],
  objective: {
    type: 'protect',
    protectUnitId: 'elder_toki',
    description: 'Defeat General Sozen while protecting Elder Toki',
  },
  deploymentSlots: 8,
  forceDeploy: ['shigeru'],
  parTurns: 20,
  prologue: {
    lines: [
      {
        speaker: 'Narrator',
        text: 'A border village. Farmland to the south, a fortified hill to the north. Grand Magus Sozen holds the heights, and he has not once sent a man down to take the village.',
      },
      {
        speaker: 'Shigeru',
        text: 'The elder here — Toki — keeps the village chronicle. Four hundred years of it, and every time the Blackflame stirred it went into that book.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Kanna',
        text: 'Which is why Sozen is here. He is not garrisoning a hill, my lord. He came for the book.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: 'Then we split. Half to hold the village, half up the hill.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Raiga',
        text: 'Three ways up — forest on the left, bridge in the centre, open ground right. He will have the centre covered and he will want us to know it.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'Protect Toki. Take Sozen. We do both. Genzo held a corridor for nine turns so that we could still afford to do both.',
        speakerFaction: 'player',
      },
      { speaker: 'Goro', text: '...Aye. Let us not waste it.', speakerFaction: 'player' },
    ],
  },
  epilogue: {
    lines: [
      {
        speaker: 'Narrator',
        text: 'The hill is taken. The village stands. For the first time in two chapters, the party breathes without the weight of grief crushing their lungs.',
      },
      {
        speaker: 'Narrator',
        text: 'A single figure came down the hill road while they were still counting the wounded. He was not in armour. He did not draw.',
      },
      {
        speaker: 'Narrator',
        text: 'He was enormous — a head taller than Raiga, shaven bald, the skin of both arms burned to the elbow in a pattern like bark. He stopped at a polite distance and waited to be addressed.',
      },
      { speaker: 'Akira', text: 'My lord. Get behind me.', speakerFaction: 'player' },
      {
        speaker: 'Takeshi',
        text: 'Please do not. I have walked a long way and I would rather look at him than at your back.',
        speakerFaction: 'enemy',
      },
      { speaker: 'Shigeru', text: 'You are Takeshi.', speakerFaction: 'player' },
      {
        speaker: 'Takeshi',
        text: 'I am. You have your father’s way of standing. He used to do that when he had decided something and had not said it yet.',
        speakerFaction: 'enemy',
      },
      { speaker: 'Shigeru', text: 'You killed him.', speakerFaction: 'player' },
      {
        speaker: 'Takeshi',
        text: 'I did. He would not give me the sword you are wearing. I asked him four times, which is three more than I have ever asked anyone.',
        speakerFaction: 'enemy',
      },
      {
        speaker: 'Kanna',
        text: 'You broke the northern seal. You let that thing out into your own country.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Takeshi',
        text: 'I took it into myself, scholar. There is a difference, and I am the only man alive who can feel it. It has not got out. It is in here, and it is quiet, and it has been quiet for eleven months.',
        speakerFaction: 'enemy',
      },
      {
        speaker: 'Hina',
        text: 'The grey ground behind you says otherwise.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Takeshi',
        text: 'Yes. That is the cost, and I pay it, and it is smaller every year than another war would be. Three hundred and forty-seven knights burned themselves to seal this thing and it bought the world four centuries. Four. I intend to end it instead.',
        speakerFaction: 'enemy',
      },
      {
        speaker: 'Shigeru',
        text: 'By carrying it. Alone. Forever.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Takeshi',
        text: 'Somebody has to hold it, boy. I have simply stopped pretending it can be put in a box and forgotten by the next generation.',
        speakerFaction: 'enemy',
      },
      {
        speaker: 'Takeshi',
        text: 'Bring me the Flamebrand. It is the last thing in the world that still answers to the seal, and while it exists the thing inside me keeps reaching for it. Bring it north and I will let every one of these people walk away.',
        speakerFaction: 'enemy',
      },
      { speaker: 'Shigeru', text: 'And if I do not?', speakerFaction: 'player' },
      {
        speaker: 'Takeshi',
        text: 'Then it will keep walking toward you, and it will go through whatever is in the way, and one morning you will be standing in a grey field wondering which of these faces you could have kept.',
        speakerFaction: 'enemy',
      },
      {
        speaker: 'Narrator',
        text: 'He turned and walked back up the hill road. Nobody raised a bow. Later, not one of them could give a reason why.',
      },
      {
        speaker: 'Shigeru',
        text: '...We go north. Not because he asked. Because he is right that it is coming, and I would rather meet it at the shrine than in somebody’s field.',
        speakerFaction: 'player',
      },
    ],
  },
  villages: [
    {
      position: { x: 3, y: 14 },
      reward: {
        type: 'weapon',
        weaponId: 'killer_sword',
        dialogue:
          "My husband forged this before the Empire took him. It was meant for a hero. You'll do.",
        speaker: 'Blacksmith Widow',
      },
    },
    {
      position: { x: 11, y: 14 },
      reward: {
        type: 'weapon',
        weaponId: 'elfire',
        dialogue:
          'An old tome, humming with latent power. The scholar said it was too dangerous for civilians.',
        speaker: 'Village Librarian',
      },
    },
  ],
  events: [
    // Turn 3: Elder Toki speaks about the scrolls
    {
      id: 'ch10_toki_speaks',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Elder Toki',
                text: 'This chronicle has four hundred years in it, and every time the Blackflame stirred, somebody here wrote it down. If Sozen takes it, the last account of the thing burns with my roof.',
                speakerFaction: 'ally',
              },
              { speaker: 'Shigeru', text: "We won't let that happen.", speakerFaction: 'player' },
              {
                speaker: 'Elder Toki',
                text: 'I have outlived worse men than that general. But I cannot outwalk what is coming down from the north, and neither can you.',
                speakerFaction: 'ally',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 6: System Construct spawn
    {
      id: 'ch10_construct_spawn',
      trigger: { type: 'turn_start', turn: 6 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Narrator',
                text: 'At the foot of the hill the grass turned grey in a widening ring, and something stood up out of the middle of it — huge, armoured, and put together wrong.',
              },
              {
                speaker: 'Kanna',
                text: 'That is not a revenant. A revenant was a person once. This has been made — assembled, out of several.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Raiga',
                text: 'It is going for the village. For the old woman.',
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: 'Then it is not wandering — it knows what it came for. Everyone back to the elder. Now!',
                speakerFaction: 'player',
              },
            ],
          },
        },
        {
          type: 'spawn_units',
          units: [{ unitId: 'ch10_construct', position: { x: 7, y: 10 } }],
          faction: 'enemy',
        },
      ],
      once: true,
    },
    // Boss killed: Sozen
    {
      id: 'ch10_sozen_killed',
      trigger: { type: 'unit_killed', unitId: 'ch10_boss' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Sozen',
                text: 'I felt it too. The wrongness in the north. I read the same signs your scholar reads.',
                speakerFaction: 'enemy',
              },
              { speaker: 'Shigeru', text: 'You could have helped us.', speakerFaction: 'player' },
              {
                speaker: 'Sozen',
                text: 'Perhaps. But I serve the empire I was born in, not the truth I found too late to use.',
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Narrator',
                text: 'General Sozen falls. A Master Seal gleams among his effects.',
              },
            ],
          },
        },
        { type: 'give_item', unitId: 'shigeru', itemId: 'master_seal' },
      ],
      once: true,
    },
    // Construct destroyed
    {
      id: 'ch10_construct_killed',
      trigger: { type: 'unit_killed', unitId: 'ch10_construct' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Kanna',
                text: 'It is coming apart. Look — the ash is not scattering. It is running back north, along the ground, against the wind.',
                speakerFaction: 'player',
              },
              { speaker: 'Shigeru', text: 'Going home.', speakerFaction: 'player' },
              {
                speaker: 'Kanna',
                text: 'Being recalled. My lord, that is the first thing this campaign has shown me that I can actually follow. Whatever built that thing wants its pieces back — and it will lead us straight to the door.',
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
      unitB: 'akira',
      lines: [
        {
          speaker: 'Akira',
          text: 'My lord. You have not said his name since the fortress.',
          speakerFaction: 'player',
        },
        { speaker: 'Shigeru', text: 'I said it in the epilogue speech.', speakerFaction: 'player' },
        {
          speaker: 'Akira',
          text: 'You said it to the company. That is not the same as saying it.',
          speakerFaction: 'player',
        },
        { speaker: 'Shigeru', text: '...', speakerFaction: 'player' },
        {
          speaker: 'Akira',
          text: 'I was there when you gave him leave to do it. It was the right order and it was a terrible thing to have to say, and both of those are going to be true for the rest of your life.',
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: 'Genzo. His name was Genzo. ...Thank you, Akira.',
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'akira', stat: 'def', amount: 1 },
    },
    {
      unitA: 'raiga',
      unitB: 'sayo',
      lines: [
        {
          speaker: 'Sayo',
          text: 'Five engagements now. Still telling people you are only here for the coin?',
          speakerFaction: 'player',
        },
        {
          speaker: 'Raiga',
          text: 'The pay is terrible. The hours are worse. The commander apologises to corpses.',
          speakerFaction: 'player',
        },
        { speaker: 'Sayo', text: "And yet you're still here.", speakerFaction: 'player' },
        { speaker: 'Raiga', text: '...Shut up and cover my left side.', speakerFaction: 'player' },
      ],
      reward: { type: 'exp_both', amount: 20 },
    },
  ],
};
