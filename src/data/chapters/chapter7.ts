import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const W: TerrainType = 'water';
const X: TerrainType = 'wall';
const T: TerrainType = 'fort';

// 16 columns x 16 rows — coastal fortress with corridors and corrupted north edge
const terrain: TerrainType[][] = [
  // 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
  [W, W, P, P, P, P, P, P, P, P, P, P, P, P, W, W], // row 0  — corrupted spawn edge (north)
  [W, P, P, X, X, P, P, P, P, P, P, X, X, P, P, W], // row 1  — fortress walls
  [M, P, P, X, T, P, P, P, P, P, P, T, X, P, P, M], // row 2  — forts inside walls (Varga at 4,2)
  [M, P, P, P, P, P, X, P, P, X, P, P, P, P, P, M], // row 3  — inner corridors (2-wide)
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 4  — open courtyard
  [P, P, X, X, P, P, P, T, T, P, P, P, X, X, P, P], // row 5  — central fortifications
  [P, P, X, P, P, P, P, P, P, P, P, P, P, X, P, P], // row 6  — corridor sides
  [P, P, P, P, P, F, P, P, P, P, F, P, P, P, P, P], // row 7  — transition zone
  [M, P, P, P, T, F, P, P, P, P, F, T, P, P, P, M], // row 8  — secondary defense line
  [M, P, P, F, F, P, P, P, P, P, P, F, F, P, P, M], // row 9  — forest belt
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 10 — open ground
  [P, P, F, P, P, P, T, P, P, T, P, P, P, F, P, P], // row 11 — rear forts
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 12 — deployment area
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 13 — deployment row 1
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 14 — deployment row 2
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 15 — deployment row 3
];

export const CHAPTER_7: ChapterData = {
  id: 'ch7',
  name: 'Chapter 7: The Seed Breaks',
  chapterNumber: 7,
  mapWidth: 16,
  mapHeight: 16,
  terrain,
  playerUnits: [
    { unitId: 'ren',   position: { x: 7, y: 13 } },
    { unitId: 'kael',  position: { x: 8, y: 13 } },
    { unitId: 'senna', position: { x: 7, y: 14 } },
    { unitId: 'bram',  position: { x: 6, y: 14 } },
    { unitId: 'lira',  position: { x: 9, y: 14 } },
    { unitId: 'rook',  position: { x: 6, y: 13 } },
    { unitId: 'faye',  position: { x: 9, y: 13 } },
  ],
  enemyUnits: [
    { unitId: 'ch7_boss',      position: { x: 4,  y: 2 } },  // Admiral Varga on fort
    { unitId: 'ch7_soldier_1', position: { x: 7,  y: 4 } },  // courtyard
    { unitId: 'ch7_soldier_2', position: { x: 8,  y: 4 } },  // courtyard
    { unitId: 'ch7_fighter_1', position: { x: 5,  y: 7 } },  // transition zone
    { unitId: 'ch7_fighter_2', position: { x: 10, y: 7 } },  // transition zone
    { unitId: 'ch7_mage_1',   position: { x: 6,  y: 5 } },  // central fort
    { unitId: 'ch7_mage_2',   position: { x: 9,  y: 5 } },  // central fort
  ],
  objective: {
    type: 'survive',
    turns: 12,
    description: 'Survive for 12 turns',
  },
  deploymentSlots: 7,
  forceDeploy: ['ren'],
  parTurns: 12,
  prologue: {
    lines: [
      { speaker: 'Narrator', text: 'The coastal fortress. Waves crash against stone walls that have held for centuries. But something stirs at the northern edge.' },
      { speaker: 'Senna', text: "I've been running predictive models all night. The anomaly patterns... they're not random. Something is adapting.", speakerFaction: 'player' },
      { speaker: 'Kael', text: "Adapting to what?", speakerFaction: 'player' },
      { speaker: 'Senna', text: "To ME. Every time I map a pattern, it shifts. Like it knows I'm watching.", speakerFaction: 'player' },
      { speaker: 'Rook', text: "Admiral Varga holds the fortress interior. His garrison is disciplined but spread thin.", speakerFaction: 'player' },
      { speaker: 'Ren', text: "Hold the defensive line. Don't overextend. Senna, stay near the rear — I need your analysis.", speakerFaction: 'player' },
      { speaker: 'Senna', text: "My analysis might be worthless by Turn 3.", speakerFaction: 'player' },
    ],
  },
  epilogue: {
    lines: [
      { speaker: 'Narrator', text: 'The corrupted spawns cease. The fortress falls quiet. But the silence feels wrong.' },
      { speaker: 'Senna', text: "My model is broken. Everything I built — 347 loops of pattern tracking — it changed underneath me. I need... I need a new approach.", speakerFaction: 'player' },
      { speaker: 'Ren', text: "You found an answer before. You'll find one again.", speakerFaction: 'player' },
      { speaker: 'Senna', text: "You keep saying things like that. Like you've seen it happen.", speakerFaction: 'player' },
      { speaker: 'Ren', text: "...Because I have.", speakerFaction: 'player' },
      { speaker: 'Kael', text: "Ren? What does that mean?", speakerFaction: 'player' },
      { speaker: 'Ren', text: "It means I trust her. That's all.", speakerFaction: 'player' },
      { speaker: 'Kael', text: "Whatever your numbers say, you kept us alive in there.", speakerFaction: 'player' },
      { speaker: 'Faye', text: "I've seen healers break under less. The fact that you're still standing means something.", speakerFaction: 'player' },
      { speaker: 'Bram', text: "Stop overthinking it. You're smart. That's enough.", speakerFaction: 'player' },
      { speaker: 'Narrator', text: "Senna stares at her notes. The numbers don't lie. But they don't tell the truth anymore either." },
    ],
  },
  reinforcements: [
    {
      turn: 3,
      units: [
        { unitId: 'ch7_corrupted_1', position: { x: 5, y: 0 } },
        { unitId: 'ch7_corrupted_2', position: { x: 10, y: 0 } },
      ],
      message: 'Corrupted entities spawn from the glitched tiles!',
    },
    {
      turn: 5,
      units: [
        { unitId: 'ch7_corrupted_3', position: { x: 3, y: 0 } },
        { unitId: 'ch7_corrupted_4', position: { x: 12, y: 0 } },
      ],
      message: 'More corrupted entities emerge!',
    },
    {
      turn: 7,
      units: [
        { unitId: 'ch7_corrupted_5', position: { x: 4, y: 0 } },
        { unitId: 'ch7_corrupted_6', position: { x: 11, y: 0 } },
        { unitId: 'ch7_corrupted_7', position: { x: 7, y: 0 } },
      ],
      message: 'The corruption intensifies — three more entities!',
    },
    {
      turn: 9,
      units: [
        { unitId: 'ch7_corrupted_8', position: { x: 8, y: 0 } },
      ],
      message: 'A final wave of corruption pulses from the north!',
    },
  ],
  events: [
    // Turn 1: Senna's forecast is off
    {
      id: 'ch7_senna_off',
      trigger: { type: 'turn_start', turn: 1 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Senna', text: "Wait. That soldier's hit rate — my prediction was off by twelve points. That's... not right.", speakerFaction: 'player' },
              { speaker: 'Ren', text: "Could be noise. Focus on the battle.", speakerFaction: 'player' },
              { speaker: 'Senna', text: "It's not noise. I don't get twelve-point errors.", speakerFaction: 'player' },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 3: Corrupted spawn + Senna crisis
    {
      id: 'ch7_senna_crisis',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Senna', text: "The north wall — those tiles are GLITCHING. Something is spawning from corrupted data!", speakerFaction: 'player' },
              { speaker: 'Bram', text: "Those things aren't soldiers. They're... wrong.", speakerFaction: 'player' },
              { speaker: 'Senna', text: "My predictions aren't working. The numbers are CHANGING. Every calculation I run comes back different.", speakerFaction: 'player' },
              { speaker: 'Ren', text: "New plan — we hold position and survive. Forget the advance!", speakerFaction: 'player' },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 6: Senna breakdown
    {
      id: 'ch7_senna_breakdown',
      trigger: { type: 'turn_start', turn: 6 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Senna', text: "The system is changing the ANSWER. Every time I try to predict, it changes MORE. Something is watching me analyze it and CHANGING to stay ahead.", speakerFaction: 'player' },
              { speaker: 'Faye', text: "Senna, breathe. We need you here.", speakerFaction: 'player' },
              { speaker: 'Senna', text: "You don't understand — I AM my analysis. If the numbers lie, what am I?", speakerFaction: 'player' },
              { speaker: 'Rook', text: "You're the person keeping us alive. Numbers or not.", speakerFaction: 'player' },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 9: Party rallies
    {
      id: 'ch7_rally',
      trigger: { type: 'turn_start', turn: 9 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Ren', text: "Three more turns. Hold the line — we're almost through this.", speakerFaction: 'player' },
              { speaker: 'Senna', text: "...The spawn rate is decreasing. Whatever it was... it's running out of energy.", speakerFaction: 'player' },
              { speaker: 'Kael', text: "Then we outlast it. Like we always do.", speakerFaction: 'player' },
              { speaker: 'Ren', text: "Senna — you'll figure it out. You always do.", speakerFaction: 'player' },
              { speaker: 'Senna', text: "...Thank you.", speakerFaction: 'player' },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 11: Corruption fading, survive almost complete
    {
      id: 'ch7_corruption_fading',
      trigger: { type: 'turn_start', turn: 11 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Senna', text: "The spawn frequency is dropping — the corruption is burning itself out. One more turn!", speakerFaction: 'player' },
              { speaker: 'Ren', text: "Hold steady! They're retreating — we just need to survive this last push!", speakerFaction: 'player' },
              { speaker: 'Narrator', text: "The glitched tiles at the north edge flicker and dim. The corruption is exhausting its fuel." },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 12: Survive complete — brief relief
    {
      id: 'ch7_survive_relief',
      trigger: { type: 'turn_start', turn: 12 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Senna', text: "The spawns have stopped. The corruption is spent.", speakerFaction: 'player' },
              { speaker: 'Kael', text: "We made it. Everyone still standing?", speakerFaction: 'player' },
              { speaker: 'Ren', text: "Still standing. Barely.", speakerFaction: 'player' },
            ],
          },
        },
      ],
      once: true,
    },
    // Optional boss killed: Varga
    {
      id: 'ch7_varga_killed',
      trigger: { type: 'unit_killed', unitId: 'ch7_boss' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Varga', text: "This fortress... has stood for two hundred years. It will stand after I'm gone.", speakerFaction: 'enemy' },
              { speaker: 'Ren', text: "You saw the corruption at the north wall. You know this fortress won't stand much longer.", speakerFaction: 'player' },
              { speaker: 'Narrator', text: "Admiral Varga's Hero Crest clatters to the stone floor." },
            ],
          },
        },
        { type: 'give_item', unitId: 'ren', itemId: 'hero_crest' },
      ],
      once: true,
    },
  ],
  supportConversations: [
    {
      unitA: 'ren',
      unitB: 'senna',
      lines: [
        { speaker: 'Senna', text: "Ren. How many times have you seen me fail like this?", speakerFaction: 'player' },
        { speaker: 'Ren', text: "You've never failed. Not once, in any—", speakerFaction: 'player' },
        { speaker: 'Senna', text: "In any WHAT? Finish that sentence.", speakerFaction: 'player' },
        { speaker: 'Ren', text: "...In any way that matters. You always find a new approach.", speakerFaction: 'player' },
      ],
      reward: { type: 'stat', unitId: 'senna', stat: 'mag', amount: 1 },
    },
    {
      unitA: 'senna',
      unitB: 'coda',
      lines: [
        { speaker: 'Coda', text: "Your numbers are broken? Good. Numbers were always a cage. Now you can see what's BEHIND them.", speakerFaction: 'player' },
        { speaker: 'Senna', text: "That's not helpful, Coda.", speakerFaction: 'player' },
        { speaker: 'Coda', text: "Wasn't trying to be helpful. Was trying to be honest. There's a difference.", speakerFaction: 'player' },
        { speaker: 'Senna', text: "...Fine. What do you see behind the numbers?", speakerFaction: 'player' },
      ],
      reward: { type: 'exp_both', amount: 20 },
    },
  ],
};
