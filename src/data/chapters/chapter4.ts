import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const X: TerrainType = 'wall';
const T: TerrainType = 'fort';
const V: TerrainType = 'village';
const H: TerrainType = 'throne';

// 18 columns x 10 rows — pirate stronghold (reframed from ruins)
const terrain: TerrainType[][] = [
  //0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17
  [X, X, X, X, X, F, X, X, H, X, X, F, X, X, X, X, X, X], // row 0 — throne at (8,0)
  [X, P, P, X, P, P, P, P, P, P, P, P, P, X, P, P, P, X], // row 1
  [X, P, P, X, P, X, X, P, P, X, X, P, P, X, P, P, P, X], // row 2
  [X, P, P, P, P, X, P, P, P, P, X, P, P, P, P, X, P, X], // row 3
  [X, X, X, P, X, X, P, T, P, P, X, X, P, X, X, P, P, X], // row 4 — fort at (7,4)
  [X, V, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, X], // row 5 — village at (1,5), main corridor
  [X, P, X, X, P, X, P, P, P, X, P, X, X, P, V, P, P, X], // row 6 — village at (14,6)
  [X, P, P, P, P, X, P, T, P, X, P, P, P, P, P, P, P, X], // row 7 — fort at (7,7)
  [X, X, P, P, P, P, P, P, P, P, P, P, P, P, X, V, P, X], // row 8 — village at (15,8)
  [M, X, X, F, P, P, P, P, P, P, P, P, F, X, X, P, P, M], // row 9 — entrance
];

export const CHAPTER_4: ChapterData = {
  id: 'ch4',
  name: 'Chapter 4: The Pickpocket',
  chapterNumber: 4,
  mapWidth: 18,
  mapHeight: 10,
  terrain,
  playerUnits: [
    { unitId: 'ren', position: { x: 7, y: 9 } },
    { unitId: 'kael', position: { x: 10, y: 9 } },
    { unitId: 'senna', position: { x: 6, y: 9 } },
    { unitId: 'lira', position: { x: 11, y: 9 } },
    { unitId: 'bram', position: { x: 8, y: 9 } },
    { unitId: 'voss', position: { x: 9, y: 9 } },
    { unitId: 'nira', position: { x: 5, y: 9 } },
    { unitId: 'coda', position: { x: 4, y: 9 } },
  ],
  enemyUnits: [
    { unitId: 'ch4_soldier_1', position: { x: 4, y: 7 } },
    { unitId: 'ch4_soldier_2', position: { x: 13, y: 7 } },
    { unitId: 'ch4_soldier_3', position: { x: 15, y: 5 } },
    { unitId: 'ch4_fighter_1', position: { x: 8, y: 5 } },
    { unitId: 'ch4_fighter_2', position: { x: 3, y: 5 } },
    { unitId: 'ch4_fighter_3', position: { x: 13, y: 3 } },
    { unitId: 'ch4_mage_1', position: { x: 11, y: 3 } },
    { unitId: 'ch4_mage_2', position: { x: 5, y: 3 } },
    { unitId: 'ch4_guard_1', position: { x: 7, y: 4 } },     // on fort
    { unitId: 'ch4_guard_2', position: { x: 4, y: 1 } },
    { unitId: 'ch4_boss', position: { x: 8, y: 0 } },        // boss — aggressive AI, will leave throne
  ],
  objective: {
    type: 'seize',
    description: 'Seize the throne',
  },
  seizePosition: { x: 8, y: 0 },
  deploymentSlots: 7,
  forceDeploy: ['ren'],
  recruitableUnits: [],
  prologue: {
    lines: [
      { speaker: 'Narrator', text: "Ren's company arrives at the pirate stronghold of Portwall. Overturned stalls and fleeing merchants paint a grim picture." },
      { speaker: 'Kael', text: 'Pirates? This far inland?', speakerFaction: 'player' },
      { speaker: 'Senna', text: "River pirates. They've been raiding the district for weeks. Three storehouses are still holding out.", speakerFaction: 'player' },
      { speaker: 'Bram', text: "PIRATES. Do they have a loot system? Tell me they drop rare items.", speakerFaction: 'player' },
      { speaker: 'Lira', text: 'Bram, these people are losing their HOMES.', speakerFaction: 'player' },
      { speaker: 'Bram', text: 'Right. Tragic. But also \u2014 loot?', speakerFaction: 'player' },
      { speaker: 'Ren', text: "We protect the storehouses. All three. If even one falls, the town loses its trade route.", speakerFaction: 'player' },
    ],
  },
  epilogue: {
    lines: [
      { speaker: 'Lira', text: "Coda, was it? You're really staying with us?", speakerFaction: 'player' },
      { speaker: 'Coda', text: "Your group has terrible stealth discipline, but decent loot potential. I'll manage.", speakerFaction: 'player' },
      { speaker: 'Voss', text: 'They stole my belt pouch. Twice. During the battle.', speakerFaction: 'player' },
      { speaker: 'Coda', text: 'Quality assurance. You passed. Mostly.', speakerFaction: 'player' },
      { speaker: 'Bram', text: 'I like them. Finally someone who understands the importance of a good item game.', speakerFaction: 'player' },
      { speaker: 'Coda', text: "Oh \u2014 one thing. That corridor back there? Something was... flickering.", speakerFaction: 'player' },
      { speaker: 'Senna', text: 'Flickering?', speakerFaction: 'player' },
      { speaker: 'Coda', text: "Like the air was glitching. Just for a second. Textures not loading properly, you know? Probably nothing.", speakerFaction: 'player' },
      { speaker: 'Ren', text: '...Probably.', speakerFaction: 'player' },
      { speaker: 'Narrator', text: 'The company rests as evening falls, but the flickering Coda noticed lingers in their thoughts.' },
    ],
  },
  villages: [
    {
      position: { x: 1, y: 5 },
      reward: {
        type: 'weapon',
        weaponId: 'steel_sword',
        dialogue: 'You saved my shop! Here \u2014 take this blade. It is the least I can do.',
        speaker: 'Merchant',
      },
    },
    {
      position: { x: 14, y: 6 },
      reward: {
        type: 'weapon',
        weaponId: 'silver_sword',
        dialogue: 'The pirates hid this in my cellar. Take it before they come back.',
        speaker: 'Shopkeeper',
      },
    },
    {
      position: { x: 15, y: 8 },
      reward: {
        type: 'weapon',
        weaponId: 'javelin',
        dialogue: 'My grandfather forged this. Use it well against those scoundrels.',
        speaker: 'Old Fisherman',
      },
    },
  ],
  parTurns: 12,
  reinforcements: [
    {
      turn: 4,
      units: [
        { unitId: 'ch4_reinforce_1', position: { x: 4, y: 9 } },
        { unitId: 'ch4_reinforce_2', position: { x: 12, y: 9 } },
        { unitId: 'ch4_reinforce_3', position: { x: 16, y: 8 } },
      ],
      message: 'More pirates arrive from the docks!',
    },
  ],
  events: [
    // Turn 2 — Thief rush warning
    {
      id: 'ch4_thief_rush',
      trigger: { type: 'turn_start', turn: 2 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Senna', text: "Raiders \u2014 heading for the storehouses. They're fast and they won't stop to fight.", speakerFaction: 'player' },
              { speaker: 'Ren', text: 'Split up. Cover all three routes.', speakerFaction: 'player' },
              { speaker: 'Bram', text: "Splitting the party?! That's ALWAYS a bad idea!", speakerFaction: 'player' },
              { speaker: 'Lira', text: "He's right, actually. In my experience, the party should stay together for bonding opportunities.", speakerFaction: 'player' },
              { speaker: 'Ren', text: "We're splitting up.", speakerFaction: 'player' },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 3 — Coda encounter
    {
      id: 'ch4_coda_encounter',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Coda', text: 'Stealth check... passed. Lockpick check... passed. Inventory extraction in progress\u2014', speakerFaction: 'player' },
              { speaker: 'Ren', text: 'HEY. Drop it.', speakerFaction: 'player' },
              { speaker: 'Coda', text: "...How did you SEE me? I'm crouching! Crouching makes you invisible!", speakerFaction: 'player' },
              { speaker: 'Ren', text: "It doesn't.", speakerFaction: 'player' },
              { speaker: 'Coda', text: "It does in EVERY game I've played.", speakerFaction: 'player' },
              { speaker: 'Coda', text: "Fine. I'll join your... whatever this is. Loud squad. Walking-in-the-open squad.", speakerFaction: 'player' },
              { speaker: 'Senna', text: 'Welcome to tactical combat.', speakerFaction: 'player' },
              { speaker: 'Coda', text: "I don't DO combat. I do 'data extraction' and 'tactical repositioning.'", speakerFaction: 'player' },
              { speaker: 'Bram', text: 'Those are just fancy words for stealing and running away.', speakerFaction: 'player' },
              { speaker: 'Coda', text: '...Exactly.', speakerFaction: 'player' },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 5 — Village pressure
    {
      id: 'ch4_village_pressure',
      trigger: { type: 'turn_start', turn: 5 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Senna', text: "That raider is closing on the southern storehouse. If they reach it, it's lost.", speakerFaction: 'player' },
              { speaker: 'Nira', text: "I can intercept \u2014 but I'd be overextended.", speakerFaction: 'player' },
              { speaker: 'Ren', text: "Do it. We can't lose any of them.", speakerFaction: 'player' },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss pre-combat — Ren approaches Marko
    {
      id: 'ch4_boss_precombat',
      trigger: { type: 'unit_at', unitId: 'ren', position: { x: 8, y: 1 } },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Marko', text: "More heroes? I get a new batch every week. You all look the same.", speakerFaction: 'enemy' },
              { speaker: 'Ren', text: 'Stand down. Your operation is finished.', speakerFaction: 'player' },
              { speaker: 'Marko', text: "Gold is gold. Don't care about your 'grand quest.' I'm just getting PAID.", speakerFaction: 'enemy' },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss killed
    {
      id: 'ch4_boss_killed',
      trigger: { type: 'unit_killed', unitId: 'ch4_boss' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              { speaker: 'Bram', text: 'Did he drop anything? Check his pockets!', speakerFaction: 'player' },
              { speaker: 'Coda', text: 'Already did. Nothing good.', speakerFaction: 'player' },
              { speaker: 'Bram', text: 'WHEN did you\u2014', speakerFaction: 'player' },
              { speaker: 'Coda', text: 'Stealth.', speakerFaction: 'player' },
            ],
          },
        },
      ],
      once: true,
    },
  ],
  supportConversations: [
    {
      unitA: 'coda',
      unitB: 'bram',
      lines: [
        { speaker: 'Bram', text: "Coda. Important question. What's the best loot you've ever found?", speakerFaction: 'player' },
        { speaker: 'Coda', text: "A key that opened every door in a twelve-floor dungeon. Beautiful piece of data.", speakerFaction: 'player' },
        { speaker: 'Bram', text: "That's not loot! That's a TOOL. I mean weapons! Armor! Things that make you HIT HARDER.", speakerFaction: 'player' },
        { speaker: 'Coda', text: "...You people and your direct approaches. Sometimes the best weapon is the one they never see.", speakerFaction: 'player' },
        { speaker: 'Bram', text: "I want them to see it. I want them to see it COMING.", speakerFaction: 'player' },
      ],
      reward: { type: 'stat', unitId: 'bram', stat: 'str', amount: 1 },
    },
    {
      unitA: 'voss',
      unitB: 'nira',
      lines: [
        { speaker: 'Voss', text: "You don't talk much.", speakerFaction: 'player' },
        { speaker: 'Nira', text: 'No.', speakerFaction: 'player' },
        { speaker: 'Voss', text: "I stood still for fifteen turns and nobody talked to me either. It's not bad, actually.", speakerFaction: 'player' },
        { speaker: 'Nira', text: "I prefer high ground and clear sightlines to conversation.", speakerFaction: 'player' },
        { speaker: 'Voss', text: "...That might be the most relatable thing anyone in this company has said to me.", speakerFaction: 'player' },
      ],
      reward: { type: 'stat', unitId: 'nira', stat: 'skl', amount: 1 },
    },
  ],
};
