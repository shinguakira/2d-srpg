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
  [M, M, P, P, P, P, P, H, P, P, P, P, P, P, M, M], // row 1  — throne at (7,1) — Drayen
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
  [P, P, P, P, P, P, P, T, P, P, P, P, P, P, P, P], // row 15 — Elder Maren's position (fort at 7,15)
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
    { unitId: 'ren',   position: { x: 7, y: 16 } },
    { unitId: 'senna', position: { x: 8, y: 16 } },
    { unitId: 'bram',  position: { x: 6, y: 17 } },
    { unitId: 'lira',  position: { x: 9, y: 17 } },
    { unitId: 'voss',  position: { x: 7, y: 17 } },
    { unitId: 'rook',  position: { x: 5, y: 16 } },
    { unitId: 'nira',  position: { x: 10, y: 16 } },
    { unitId: 'orin',  position: { x: 8, y: 17 } },
  ],
  enemyUnits: [
    // Boss on throne
    { unitId: 'ch10_boss',     position: { x: 7,  y: 1 } },
    // Coordinated escort guards
    { unitId: 'ch10_guard_1',  position: { x: 6,  y: 2 } },
    { unitId: 'ch10_guard_2',  position: { x: 8,  y: 2 } },
    { unitId: 'ch10_guard_3',  position: { x: 7,  y: 3 } },
    // Hill defenders
    { unitId: 'ch10_soldier_1', position: { x: 4, y: 4 } },
    { unitId: 'ch10_soldier_2', position: { x: 11, y: 4 } },
    { unitId: 'ch10_mage_1',   position: { x: 5,  y: 3 } },
    { unitId: 'ch10_mage_2',   position: { x: 10, y: 3 } },
    // Middle zone
    { unitId: 'ch10_soldier_3', position: { x: 6,  y: 6 } },
    { unitId: 'ch10_soldier_4', position: { x: 9,  y: 6 } },
    // Village raiders (approach from sides)
    { unitId: 'ch10_fighter_1', position: { x: 2,  y: 12 } },
    { unitId: 'ch10_fighter_2', position: { x: 13, y: 12 } },
    // Elder Maren — ally NPC at village center
    { unitId: 'elder_maren', position: { x: 7, y: 15 }, faction: 'ally', aiBehavior: { type: 'stationary' } },
  ],
  objective: {
    type: 'protect',
    protectUnitId: 'elder_maren',
    description: 'Defeat General Drayen while protecting Elder Maren',
  },
  deploymentSlots: 8,
  forceDeploy: ['ren'],
  parTurns: 20,
  prologue: {
    lines: [
      { speaker: 'Narrator', text: 'A border village. Farmland stretches south; a fortified hill rises to the north. General Drayen commands the heights.' },
      { speaker: 'Ren', text: "The village elder — Maren — has scrolls documenting the anomalies. If Drayen reaches her, we lose that knowledge.", speakerFaction: 'player' },
      { speaker: 'Senna', text: "Those scrolls could be the key to understanding what the System is doing. We need them.", speakerFaction: 'player' },
      { speaker: 'Voss', text: "Split forces? Half defend the village, half assault the hill?", speakerFaction: 'player' },
      { speaker: 'Rook', text: "Three routes to the hill — forest left, bridge center, open right. Drayen will have the center covered.", speakerFaction: 'player' },
      { speaker: 'Ren', text: "Protect Maren. Defeat Drayen. We can do both. Kael would have said the same thing.", speakerFaction: 'player' },
      { speaker: 'Bram', text: "...Yeah. He would have.", speakerFaction: 'player' },
    ],
  },
  epilogue: {
    lines: [
      { speaker: 'Narrator', text: "The hill is taken. The village stands. For the first time in two chapters, the party breathes without the weight of grief crushing their lungs." },
      { speaker: 'Senna', text: "The construct data — I've been analyzing the residue from where it spawned. The System isn't broken, Ren. It's RESPONDING to us.", speakerFaction: 'player' },
      { speaker: 'Ren', text: "Responding how?", speakerFaction: 'player' },
      { speaker: 'Senna', text: "Every time we fight back, it adapts. Every time we win, it builds something new. The constructs are prototypes — first drafts of something bigger.", speakerFaction: 'player' },
      { speaker: 'Rook', text: "So it's learning from us.", speakerFaction: 'player' },
      { speaker: 'Senna', text: "Yes. But prototypes have seams. Inefficiencies. I can find them. I just need more data.", speakerFaction: 'player' },
      { speaker: 'Ren', text: "We end this. For Kael. For everyone who died in 347 loops without knowing why.", speakerFaction: 'player' },
      { speaker: 'Narrator', text: "Arc 2 closes. The party is smaller, harder, and finally looking at the System not as a mystery — but as an enemy." },
    ],
  },
  villages: [
    {
      position: { x: 3, y: 14 },
      reward: {
        type: 'weapon',
        weaponId: 'killer_sword',
        dialogue: "My husband forged this before the Empire took him. It was meant for a hero. You'll do.",
        speaker: 'Blacksmith Widow',
      },
    },
    {
      position: { x: 11, y: 14 },
      reward: {
        type: 'weapon',
        weaponId: 'elfire',
        dialogue: 'An old tome, humming with latent power. The scholar said it was too dangerous for civilians.',
        speaker: 'Village Librarian',
      },
    },
  ],
  events: [
    // Turn 3: Elder Maren speaks about the scrolls
    {
      id: 'ch10_maren_speaks',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Elder Maren', text: "These scrolls document every anomaly for the past fifty years. If Drayen takes them, the truth dies with this village.", speakerFaction: 'ally' },
              { speaker: 'Ren', text: "We won't let that happen.", speakerFaction: 'player' },
              { speaker: 'Elder Maren', text: "I've survived worse than generals, young man. But I can't outrun what's coming from the north.", speakerFaction: 'ally' },
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
              { speaker: 'Narrator', text: "The ground at the base of the hill GLITCHES. A shape assembles itself from corrupted data — massive, armored, wrong." },
              { speaker: 'Senna', text: "That's not a soldier. That's not even a person. The System is BUILDING with the pieces. It can make soldiers from corrupted data.", speakerFaction: 'player' },
              { speaker: 'Rook', text: "It's heading for the village. For Maren.", speakerFaction: 'player' },
              { speaker: 'Ren', text: "The System isn't just watching anymore. It's acting. Everyone — protect the elder!", speakerFaction: 'player' },
            ],
          },
        },
        { type: 'spawn_units', units: [{ unitId: 'ch10_construct', position: { x: 7, y: 10 } }], faction: 'enemy' },
      ],
      once: true,
    },
    // Boss killed: Drayen
    {
      id: 'ch10_drayen_killed',
      trigger: { type: 'unit_killed', unitId: 'ch10_boss' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Drayen', text: "I sensed it too — the patterns beneath reality. I fought anyway, because what else is there?", speakerFaction: 'enemy' },
              { speaker: 'Ren', text: "You could have helped us.", speakerFaction: 'player' },
              { speaker: 'Drayen', text: "Perhaps. But I serve the Empire I was born into, not the truth I discovered too late.", speakerFaction: 'enemy' },
              { speaker: 'Narrator', text: "General Drayen falls. A Master Seal gleams among his effects." },
            ],
          },
        },
        { type: 'give_item', unitId: 'ren', itemId: 'master_seal' },
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
              { speaker: 'Senna', text: "The construct is dissolving — back into raw data. But I can read the residue. The System's architecture has seams.", speakerFaction: 'player' },
              { speaker: 'Ren', text: "Can you use that?", speakerFaction: 'player' },
              { speaker: 'Senna', text: "Maybe. Give me time and more data. This is the first crack in the wall.", speakerFaction: 'player' },
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
      unitB: 'voss',
      lines: [
        { speaker: 'Voss', text: "I held the garrison for years without losing a man. Then I joined you and watched the best of us die.", speakerFaction: 'player' },
        { speaker: 'Ren', text: "I'm sorry, Voss.", speakerFaction: 'player' },
        { speaker: 'Voss', text: "Don't be sorry. Be worth it. Make his choice mean something.", speakerFaction: 'player' },
        { speaker: 'Ren', text: "I will. I promise.", speakerFaction: 'player' },
      ],
      reward: { type: 'stat', unitId: 'voss', stat: 'def', amount: 1 },
    },
    {
      unitA: 'rook',
      unitB: 'nira',
      lines: [
        { speaker: 'Nira', text: "You've been with us for five chapters now. Still going to claim you're just here for the coin?", speakerFaction: 'player' },
        { speaker: 'Rook', text: "The pay is terrible. The hours are worse. The boss keeps muttering about time loops.", speakerFaction: 'player' },
        { speaker: 'Nira', text: "And yet you're still here.", speakerFaction: 'player' },
        { speaker: 'Rook', text: "...Shut up and cover my left side.", speakerFaction: 'player' },
      ],
      reward: { type: 'exp_both', amount: 20 },
    },
  ],
};
