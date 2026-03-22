import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const X: TerrainType = 'wall';
const T: TerrainType = 'fort';
const H: TerrainType = 'throne';

// 18 columns x 20 rows — mountain fortress, two fronts (north throne + south corridor)
const terrain: TerrainType[][] = [
  // 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17
  [M, M, X, X, X, X, X, X, X, X, X, X, X, X, X, X, M, M], // row 0  — fortress north wall
  [M, X, P, P, P, P, P, P, P, H, P, P, P, P, P, P, X, M], // row 1  — throne at (9,1)
  [M, X, P, P, X, P, P, P, P, P, P, P, P, X, P, P, X, M], // row 2  — interior pillars
  [M, X, P, P, P, P, T, P, P, P, P, T, P, P, P, P, X, M], // row 3  — interior forts
  [M, X, X, P, P, P, P, P, P, P, P, P, P, P, P, X, X, M], // row 4  — inner gate
  [M, P, P, P, P, F, P, P, P, P, P, P, F, P, P, P, P, M], // row 5  — fortress exit
  [M, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, M], // row 6  — courtyard
  [M, P, P, F, P, P, P, T, P, P, T, P, P, P, F, P, P, M], // row 7  — defensive forts
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 8  — open field
  [P, P, F, P, P, P, P, P, P, P, P, P, P, P, P, F, P, P], // row 9  — approach
  [P, P, P, P, P, T, P, P, P, P, P, P, T, P, P, P, P, P], // row 10 — mid-field forts
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 11 — deployment area
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 12 — deployment row 1
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 13 — deployment row 2
  [M, M, P, P, P, X, X, P, P, P, P, X, X, P, P, P, M, M], // row 14 — south corridor entrance
  [M, M, M, P, P, X, P, P, P, P, P, P, X, P, P, M, M, M], // row 15 — corridor narrows
  [M, M, M, P, P, X, P, P, T, P, P, P, X, P, P, M, M, M], // row 16 — Kael's last stand position (8,16)
  [M, M, M, P, P, X, P, P, P, P, P, P, X, P, P, M, M, M], // row 17 — corridor
  [M, M, M, P, P, P, P, P, P, P, P, P, P, P, P, M, M, M], // row 18 — south gate (reinforcements)
  [M, M, M, M, P, P, P, P, P, P, P, P, P, P, M, M, M, M], // row 19 — south edge
];

export const CHAPTER_8: ChapterData = {
  id: 'ch8',
  name: 'Chapter 8: The Last Ride',
  chapterNumber: 8,
  mapWidth: 18,
  mapHeight: 20,
  terrain,
  playerUnits: [
    { unitId: 'ren',   position: { x: 8, y: 12 } },
    { unitId: 'kael',  position: { x: 9, y: 12 } },
    { unitId: 'senna', position: { x: 8, y: 13 } },
    { unitId: 'bram',  position: { x: 7, y: 13 } },
    { unitId: 'lira',  position: { x: 10, y: 13 } },
    { unitId: 'voss',  position: { x: 7, y: 12 } },
    { unitId: 'rook',  position: { x: 10, y: 12 } },
    { unitId: 'faye',  position: { x: 9, y: 13 } },
  ],
  enemyUnits: [
    // Boss on throne
    { unitId: 'ch8_boss',     position: { x: 9,  y: 1 } },
    // Throne room guards
    { unitId: 'ch8_knight_1', position: { x: 8,  y: 2 } },
    { unitId: 'ch8_knight_2', position: { x: 10, y: 2 } },
    { unitId: 'ch8_knight_3', position: { x: 6,  y: 3 } },
    { unitId: 'ch8_knight_4', position: { x: 11, y: 3 } },
    // Courtyard attackers
    { unitId: 'ch8_cavalier_1', position: { x: 5, y: 6 } },
    { unitId: 'ch8_cavalier_2', position: { x: 12, y: 6 } },
    { unitId: 'ch8_cavalier_3', position: { x: 9, y: 7 } },
    // Mages
    { unitId: 'ch8_mage_1',  position: { x: 7,  y: 5 } },
    { unitId: 'ch8_mage_2',  position: { x: 10, y: 5 } },
  ],
  objective: {
    type: 'seize',
    description: 'Defeat General Morryn and seize the throne',
  },
  seizePosition: { x: 9, y: 1 },
  deploymentSlots: 8,
  forceDeploy: ['ren', 'kael'],
  parTurns: 20,
  prologue: {
    lines: [
      { speaker: 'Narrator', text: "Night. The mountain fortress looms ahead. Two fronts — the throne room to the north, a corridor to the south where reinforcements will come." },
      { speaker: 'Ren', text: "Kael. I need to tell you something.", speakerFaction: 'player' },
      { speaker: 'Kael', text: "You've been keeping something from me. I can tell.", speakerFaction: 'player' },
      { speaker: 'Ren', text: "This world... it's happened before. 347 times. Everything — the battles, the conversations, the deaths. I remember all of them.", speakerFaction: 'player' },
      { speaker: 'Kael', text: "...347 times? You've watched us fight this war 347 times?", speakerFaction: 'player' },
      { speaker: 'Ren', text: "Yes. And every time, I lose people. I lose you.", speakerFaction: 'player' },
      { speaker: 'Kael', text: "I don't care.", speakerFaction: 'player' },
      { speaker: 'Ren', text: "What?", speakerFaction: 'player' },
      { speaker: 'Kael', text: "This is the first time I REMEMBER. So it counts. Whatever happens today — it counts because I chose it.", speakerFaction: 'player' },
      { speaker: 'Narrator', text: "The party moves into position. No one speaks. The silence says everything." },
    ],
  },
  epilogue: {
    lines: [
      { speaker: 'Narrator', text: "The fortress is taken. But the victory tastes like ash." },
      { speaker: 'Ren', text: "I've seen him die 347 times. Why does this one hurt more?", speakerFaction: 'player' },
      { speaker: 'Senna', text: "Because this time he knew. He chose it.", speakerFaction: 'player' },
      { speaker: 'Bram', text: "...", speakerFaction: 'player' },
      { speaker: 'Narrator', text: "Bram punches the fortress wall. His knuckles bleed. No one stops him." },
      { speaker: 'Lira', text: "May his soul find the peace that this world denied him.", speakerFaction: 'player' },
      { speaker: 'Voss', text: "He held that corridor alone. Against everything. The garrison would have been proud.", speakerFaction: 'player' },
      { speaker: 'Faye', text: "I couldn't reach him. I tried to get there and I couldn't—", speakerFaction: 'player' },
      { speaker: 'Rook', text: "None of us could. That was the point.", speakerFaction: 'player' },
      { speaker: 'Narrator', text: "The grief settles over the party like armor — heavy, suffocating, and impossible to remove. All stats reduced by 3 for the next two chapters." },
    ],
  },
  reinforcements: [
    {
      turn: 5,
      units: [
        { unitId: 'ch8_reinforce_1', position: { x: 8, y: 19 } },
        { unitId: 'ch8_reinforce_2', position: { x: 9, y: 19 } },
      ],
      message: 'Enemy soldiers pour through the south gate!',
    },
    {
      turn: 7,
      units: [
        { unitId: 'ch8_reinforce_3', position: { x: 7, y: 19 } },
        { unitId: 'ch8_reinforce_4', position: { x: 10, y: 19 } },
      ],
      message: 'More reinforcements from the south!',
    },
    {
      turn: 9,
      units: [
        { unitId: 'ch8_reinforce_5', position: { x: 8, y: 19 } },
        { unitId: 'ch8_reinforce_6', position: { x: 9, y: 19 } },
        { unitId: 'ch8_reinforce_7', position: { x: 7, y: 19 } },
      ],
      message: 'A final wave crashes against the south corridor!',
    },
  ],
  events: [
    // Turn 7: South reinforcements dialogue
    {
      id: 'ch8_south_spotted',
      trigger: { type: 'turn_start', turn: 7 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Voss', text: "The south corridor — they're sending more. Someone has to hold the rear.", speakerFaction: 'player' },
              { speaker: 'Ren', text: "We can't split further. We need everyone for Morryn.", speakerFaction: 'player' },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 8: KAEL'S SACRIFICE — remove from player, spawn as NPC ally
    {
      id: 'ch8_kael_to_npc',
      trigger: { type: 'turn_start', turn: 8 },
      effects: [
        {
          type: 'chain',
          effects: [
            {
              type: 'show_dialogue',
              scene: {
                lines: [
                  { speaker: 'Kael', text: "I'll hold the corridor.", speakerFaction: 'player' },
                  { speaker: 'Ren', text: "Kael, don't—", speakerFaction: 'player' },
                  { speaker: 'Kael', text: "You said I've done this 347 times without knowing. Now I know. And I'm choosing to do it anyway.", speakerFaction: 'player' },
                  { speaker: 'Kael', text: "Was I brave this time?", speakerFaction: 'player' },
                  { speaker: 'Ren', text: "Every time.", speakerFaction: 'player' },
                  { speaker: 'Kael', text: "Then it counted.", speakerFaction: 'player' },
                ],
              },
            },
            { type: 'remove_unit', unitId: 'kael' },
            { type: 'spawn_units', units: [{ unitId: 'kael_npc', position: { x: 8, y: 16 } }], faction: 'ally' },
          ],
        },
      ],
      once: true,
    },
    // Turn 13: KAEL'S DEATH
    {
      id: 'ch8_kael_death',
      trigger: { type: 'turn_start', turn: 13 },
      effects: [
        {
          type: 'chain',
          effects: [
            {
              type: 'show_dialogue',
              scene: {
                lines: [
                  { speaker: 'Narrator', text: "In the south corridor, Kael staggers. His lance arm drops. The enemies close in." },
                  { speaker: 'Kael', text: "Still... standing...", speakerFaction: 'player' },
                  { speaker: 'Narrator', text: "He falls." },
                  { speaker: 'Ren', text: "KAEL!", speakerFaction: 'player' },
                  { speaker: 'Lira', text: "No— I can get there— let me—", speakerFaction: 'player' },
                  { speaker: 'Rook', text: "It's too late.", speakerFaction: 'player' },
                  { speaker: 'Narrator', text: "The tile where Kael stood is empty. It is the loudest silence the party has ever heard." },
                ],
              },
            },
            { type: 'remove_unit', unitId: 'kael_npc' },
            { type: 'set_flag', key: 'kael_dead', value: 'true' },
          ],
        },
      ],
      once: true,
    },
    // Boss killed: Morryn
    {
      id: 'ch8_morryn_killed',
      trigger: { type: 'unit_killed', unitId: 'ch8_boss' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Morryn', text: "I've killed you before. I remember it happening... AGAIN. And again. How many times have we done this?", speakerFaction: 'enemy' },
              { speaker: 'Ren', text: "347. But this is the last time.", speakerFaction: 'player' },
              { speaker: 'Morryn', text: "You always say that...", speakerFaction: 'enemy' },
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
        { speaker: 'Kael', text: "If you've seen this 347 times... did I always volunteer?", speakerFaction: 'player' },
        { speaker: 'Ren', text: "Always.", speakerFaction: 'player' },
        { speaker: 'Kael', text: "Good. That means it's who I am, not just what I'm told to do.", speakerFaction: 'player' },
        { speaker: 'Ren', text: "Kael...", speakerFaction: 'player' },
        { speaker: 'Kael', text: "Don't. Just... let me be brave while I still can.", speakerFaction: 'player' },
      ],
      reward: { type: 'exp_both', amount: 30 },
    },
    {
      unitA: 'kael',
      unitB: 'lira',
      lines: [
        { speaker: 'Lira', text: "Kael, you seem different today. Lighter, somehow.", speakerFaction: 'player' },
        { speaker: 'Kael', text: "I learned something today. About the world, about us. About how many times we've done this.", speakerFaction: 'player' },
        { speaker: 'Lira', text: "And that makes you lighter?", speakerFaction: 'player' },
        { speaker: 'Kael', text: "It makes me certain. For the first time in my life, I know exactly who I am.", speakerFaction: 'player' },
      ],
      reward: { type: 'stat', unitId: 'kael', stat: 'def', amount: 2 },
    },
  ],
};
