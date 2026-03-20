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
  [P, P, P, P, P, W, W, W, W, P, P, P, P, V, P, P, P, P], // row 3 — river + village
  [P, F, P, P, W, P, P, P, P, W, P, P, F, P, P, F, P, P], // row 4 — river gap (bridge)
  [P, P, P, W, W, P, P, P, P, W, W, P, P, P, P, P, P, P], // row 5
  [P, P, F, P, P, P, P, P, P, P, P, F, P, P, F, P, P, P], // row 6
  [P, F, P, P, P, T, P, P, P, P, P, P, F, P, P, F, P, P], // row 7 — fort at (5,7)
  [F, P, P, P, F, P, P, P, P, F, P, P, P, P, F, P, P, F], // row 8
  [M, M, F, P, P, P, P, P, P, P, P, P, P, P, P, F, M, M], // row 9
];

export const CHAPTER_2: ChapterData = {
  id: 'ch2',
  name: 'Chapter 2: Escape',
  chapterNumber: 2,
  mapWidth: 18,
  mapHeight: 10,
  terrain,
  playerUnits: [
    { unitId: 'ren', position: { x: 6, y: 8 } },
    { unitId: 'kael', position: { x: 10, y: 8 } },
    { unitId: 'senna', position: { x: 7, y: 9 } },
    { unitId: 'lira', position: { x: 11, y: 9 } },
  ],
  enemyUnits: [
    { unitId: 'ch2_fighter_1', position: { x: 4, y: 5 } },
    { unitId: 'ch2_soldier_1', position: { x: 7, y: 3 } },
    { unitId: 'ch2_guard_1', position: { x: 6, y: 1 } },
    { unitId: 'zonta', position: { x: 7, y: 0 } },
    // Voss: player template placed as enemy, defects turn 3 via event
    { unitId: 'voss', position: { x: 8, y: 1 }, faction: 'enemy', aiBehavior: { type: 'stationary' } },
  ],
  objective: {
    type: 'seize',
    description: 'Seize the throne',
  },
  seizePosition: { x: 7, y: 0 },
  prologue: {
    lines: [
      { speaker: 'Narrator', text: 'Having escaped the castle, Ren and her companions follow the road north toward Frelia.' },
      { speaker: 'Kael', text: 'Princess, enemy forces have set up a blockade at the river crossing ahead.', speakerFaction: 'player' },
      { speaker: 'Ren', text: 'Then we have no choice but to break through. We cannot turn back now.', speakerFaction: 'player' },
      { speaker: 'Senna', text: 'The bridge is a natural chokepoint. We should use the terrain to our advantage.', speakerFaction: 'player' },
      { speaker: 'Lira', text: 'I will do my best to keep everyone safe.', speakerFaction: 'player' },
    ],
  },
  epilogue: {
    lines: [
      { speaker: 'Ren', text: 'We made it across. Frelia cannot be far now.', speakerFaction: 'player' },
      { speaker: 'Kael', text: 'We should rest at the next village. The soldiers need it.', speakerFaction: 'player' },
      { speaker: 'Narrator', text: 'The company presses on, drawing ever closer to the safety of Frelia.' },
    ],
  },
  villages: [
    {
      position: { x: 13, y: 3 },
      reward: {
        type: 'weapon',
        weaponId: 'javelin',
        dialogue: 'Take this javelin. It served my father well in the last war.',
        speaker: 'Old Soldier',
      },
    },
  ],
  deploymentSlots: 4,
  forceDeploy: ['ren'],
  parTurns: 10,
  recruitableUnits: ['voss'],
  events: [
    {
      id: 'ch2_turn2_hint',
      trigger: { type: 'turn_start' as const, turn: 2 },
      effects: [
        {
          type: 'show_dialogue' as const,
          scene: {
            lines: [
              { speaker: 'Senna', text: 'The fort up ahead provides cover. We should use it to hold our position.', speakerFaction: 'player' as const },
              { speaker: 'Kael', text: 'Good eye. I will advance to the bridge and draw their attention.', speakerFaction: 'player' as const },
            ],
          },
        },
      ],
      once: true,
    },
    // Voss defection — dialogue fires first, recruitment in next batch
    {
      id: 'ch2_voss_defection_dialogue',
      trigger: { type: 'turn_start' as const, turn: 3 },
      effects: [
        {
          type: 'show_dialogue' as const,
          scene: {
            lines: [
              { speaker: 'Voss', text: "I'm done. I've been standing on that wall for... I don't know how long. Days? Years?", speakerFaction: 'enemy' as const },
              { speaker: 'Voss', text: "The stationary AI. Fifteen turns. Standing. Watching. While my commander fights and I just STAND THERE.", speakerFaction: 'enemy' as const },
              { speaker: 'Ren', text: 'Welcome aboard, Voss.', speakerFaction: 'player' as const },
              { speaker: 'Voss', text: "You're not even surprised.", speakerFaction: 'player' as const },
              { speaker: 'Ren', text: 'Call it intuition.', speakerFaction: 'player' as const },
            ],
          },
        },
      ],
      once: true,
    },
    {
      id: 'ch2_voss_defection_recruit',
      trigger: { type: 'turn_start' as const, turn: 3 },
      effects: [
        { type: 'recruit_unit' as const, unitId: 'voss' },
      ],
      once: true,
    },
  ],
  reinforcements: [
    {
      turn: 6,
      units: [
        { unitId: 'ch2_reinforce_1', position: { x: 0, y: 0 } },
      ],
      message: 'Enemy reinforcements arrive from the north!',
    },
  ],
  supportConversations: [
    {
      unitA: 'ren',
      unitB: 'senna',
      lines: [
        { speaker: 'Ren', text: 'Senna, your magic was instrumental in the last battle. Thank you.', speakerFaction: 'player' },
        { speaker: 'Senna', text: 'Naturally. I am a prodigy, after all. But your swordplay was... not terrible.', speakerFaction: 'player' },
        { speaker: 'Ren', text: 'Ha! Coming from you, I will take that as a compliment.', speakerFaction: 'player' },
        { speaker: 'Senna', text: 'I have been observing your combat style. Here — adjust your stance like this.', speakerFaction: 'player' },
      ],
      reward: { type: 'stat', unitId: 'ren', stat: 'skl', amount: 1 },
    },
    {
      unitA: 'kael',
      unitB: 'lira',
      lines: [
        { speaker: 'Kael', text: 'Sister Lira, are you well? The march has been long.', speakerFaction: 'player' },
        { speaker: 'Lira', text: 'I am fine, thank you. But I worry about morale. The soldiers look exhausted.', speakerFaction: 'player' },
        { speaker: 'Kael', text: 'Your healing has kept us all going. The troops speak highly of you.', speakerFaction: 'player' },
        { speaker: 'Lira', text: 'That gives me strength. Let us continue to support each other.', speakerFaction: 'player' },
      ],
      reward: { type: 'exp_both', amount: 15 },
    },
  ],
};
