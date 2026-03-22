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
  [F, P, P, P, P, P, P, P, P, P, P, P, P, F], // row 3  — Orin appears here
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
  name: 'Chapter 9: The Void Left Behind',
  chapterNumber: 9,
  mapWidth: 14,
  mapHeight: 14,
  terrain,
  playerUnits: [
    { unitId: 'ren',   position: { x: 6, y: 12 } },
    { unitId: 'senna', position: { x: 7, y: 12 } },
    { unitId: 'bram',  position: { x: 5, y: 13 } },
    { unitId: 'lira',  position: { x: 8, y: 13 } },
    { unitId: 'voss',  position: { x: 6, y: 13 } },
    { unitId: 'nira',  position: { x: 7, y: 13 } },
    { unitId: 'rook',  position: { x: 5, y: 12 } },
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
  forceDeploy: ['ren'],
  parTurns: 18,
  prologue: {
    lines: [
      { speaker: 'Narrator', text: 'A narrow forest pass. The party retreats south in silence. One formation slot stands empty.' },
      { speaker: 'Bram', text: '...', speakerFaction: 'player' },
      { speaker: 'Senna', text: "I've plotted the route. It's linear — forest cover on both sides, a few defensive positions. We should be through in a day.", speakerFaction: 'player' },
      { speaker: 'Ren', text: "Everyone stays close. No heroics. We move as a group.", speakerFaction: 'player' },
      { speaker: 'Voss', text: "He would have been on point. Kael always took point.", speakerFaction: 'player' },
      { speaker: 'Lira', text: "...I know.", speakerFaction: 'player' },
      { speaker: 'Rook', text: "Raiders ahead. Scouts, by the look of them. Not organized enough to be Imperial.", speakerFaction: 'player' },
      { speaker: 'Ren', text: "Then we clear the path. Together.", speakerFaction: 'player' },
    ],
  },
  epilogue: {
    lines: [
      { speaker: 'Narrator', text: "The forest thins. The party emerges into open ground, bruised but intact." },
      { speaker: 'Orin', text: "That was... not what I expected when I joined a traveling company.", speakerFaction: 'player' },
      { speaker: 'Bram', text: "We're not a traveling company.", speakerFaction: 'player' },
      { speaker: 'Orin', text: "No. You're not. You're something that lost its heart and keeps walking anyway.", speakerFaction: 'player' },
      { speaker: 'Narrator', text: "For a moment, the performer's mask slips. Orin's eyes hold something older than comedy." },
      { speaker: 'Orin', text: "...I've seen that look before. In better stories than mine. It doesn't go away. But it gets quieter.", speakerFaction: 'player' },
      { speaker: 'Ren', text: "Thank you, Orin.", speakerFaction: 'player' },
      { speaker: 'Senna', text: "The grief debuff is still active. Our stats won't recover until after the next engagement.", speakerFaction: 'player' },
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
    // Turn 1: Kael absence felt
    {
      id: 'ch9_kael_absence',
      trigger: { type: 'turn_start', turn: 1 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Nira', text: "The left flank is exposed. Kael would have covered it.", speakerFaction: 'player' },
              { speaker: 'Rook', text: "I'll take it. Not as fast, but I can hold.", speakerFaction: 'player' },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 3: Orin appears and joins
    {
      id: 'ch9_orin_joins',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Narrator', text: 'A figure steps out of the treeline, arms spread wide as if expecting applause.' },
              { speaker: 'Orin', text: "At LAST! The ensemble arrives! I've been waiting for the second act to start!", speakerFaction: 'player' },
              { speaker: 'Bram', text: "...Who is this?", speakerFaction: 'player' },
              { speaker: 'Orin', text: "Orin! Performer, dancer, morale specialist! You all look like you need a song.", speakerFaction: 'player' },
              { speaker: 'Ren', text: "We really don't.", speakerFaction: 'player' },
              { speaker: 'Orin', text: "That's exactly what someone who needs a song would say. I'm joining you. No arguments!", speakerFaction: 'player' },
              { speaker: 'Senna', text: "A dancer... the Dance action lets an adjacent ally act again. That could compensate for our reduced mobility.", speakerFaction: 'player' },
            ],
          },
        },
        { type: 'spawn_units', units: [{ unitId: 'orin', position: { x: 7, y: 3 } }], faction: 'player' },
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
              { speaker: 'Senna', text: "Orin — move next to an ally who has already acted. Your Dance command will let them move and act again.", speakerFaction: 'player' },
              { speaker: 'Orin', text: "An encore! Everyone deserves an encore. Just say the word and I'll get them back on their feet.", speakerFaction: 'player' },
              { speaker: 'Narrator', text: "Tip: Select Orin, move adjacent to an exhausted ally, then choose Dance. That ally can take another full turn." },
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
              { speaker: 'Voss', text: "I keep looking for him at the flank. Every turn.", speakerFaction: 'player' },
              { speaker: 'Lira', text: "Me too.", speakerFaction: 'player' },
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
      unitB: 'orin',
      lines: [
        { speaker: 'Orin', text: "You carry yourself like a lead who's already read the script. Is this the part where you tell me the terrible secret?", speakerFaction: 'player' },
        { speaker: 'Ren', text: "There's no script, Orin.", speakerFaction: 'player' },
        { speaker: 'Orin', text: "Darling, there's ALWAYS a script. The question is whether we're reading the same one.", speakerFaction: 'player' },
        { speaker: 'Ren', text: "...You might be more right than you know.", speakerFaction: 'player' },
      ],
      reward: { type: 'exp_both', amount: 20 },
    },
    {
      unitA: 'bram',
      unitB: 'rook',
      lines: [
        { speaker: 'Bram', text: "You fight clean. Too clean. Where'd you learn?", speakerFaction: 'player' },
        { speaker: 'Rook', text: "Two hundred cycles of practice. Give or take.", speakerFaction: 'player' },
        { speaker: 'Bram', text: "Two hundred WHAT?", speakerFaction: 'player' },
        { speaker: 'Rook', text: "Jobs. I meant jobs.", speakerFaction: 'player' },
      ],
      reward: { type: 'stat', unitId: 'bram', stat: 'str', amount: 1 },
    },
  ],
};
