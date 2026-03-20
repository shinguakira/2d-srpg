import { describe, it, expect } from 'vitest';
import { evaluateEvents, resolveEffects, matchesTrigger, type EventContext } from '../../src/core/events';
import type { ChapterEvent, Unit, Position, EventEffect, ChapterData, TerrainType } from '../../src/core/types';

/**
 * Integration test: simulates a mini-chapter with mid-battle events + recruitment.
 * Verifies the full event pipeline: trigger matching → effect resolution → state changes.
 */

function makeUnit(id: string, faction: 'player' | 'enemy' | 'ally' = 'player', pos: Position = { x: 0, y: 0 }, overrides: Partial<Unit> = {}): Unit {
  return {
    id,
    name: id,
    classId: 'lord',
    faction,
    position: pos,
    stats: { hp: 20, str: 5, mag: 0, def: 5, res: 0, spd: 5, skl: 5, lck: 5, mov: 5, cha: 0, wil: 0 },
    currentHp: 20,
    level: 1,
    exp: 0,
    equippedWeapon: { id: 'iron_sword', name: 'Iron Sword', type: 'sword', might: 5, hit: 90, crit: 0, weight: 5, minRange: 1, maxRange: 1 },
    inventory: [{ id: 'iron_sword', name: 'Iron Sword', type: 'sword', might: 5, hit: 90, crit: 0, weight: 5, minRange: 1, maxRange: 1 }],
    items: [],
    hasActed: false,
    facing: 'down',
    sprite: '',
    ...overrides,
  };
}

// Mini test chapter: 3x3 map, player at (0,2), enemy at (2,0), recruitable ally at (1,1)
const TEST_CHAPTER_EVENTS: ChapterEvent[] = [
  // Turn 2: dialogue ("Reinforcements incoming!")
  {
    id: 'test_turn2_dialogue',
    trigger: { type: 'turn_start', turn: 2 },
    effects: [
      { type: 'show_dialogue', scene: { lines: [{ speaker: 'Narrator', text: 'Reinforcements incoming!' }] } },
    ],
    once: true,
  },
  // Turn 2: spawn enemy reinforcement at (2,2)
  {
    id: 'test_turn2_spawn',
    trigger: { type: 'turn_start', turn: 2 },
    effects: [
      { type: 'spawn_units', units: [{ unitId: 'bandit', position: { x: 2, y: 2 } }], faction: 'enemy' },
    ],
    once: true,
  },
  // When player visits tile (1,1): recruit ally unit
  {
    id: 'test_village_recruit',
    trigger: { type: 'tile_visited', position: { x: 1, y: 1 } },
    effects: [
      { type: 'show_dialogue', scene: { lines: [{ speaker: 'Ally', text: 'I will join you!' }] } },
      { type: 'recruit_unit', unitId: 'ally1' },
    ],
    once: true,
  },
  // Boss killed: change terrain + set flag
  {
    id: 'test_boss_killed',
    trigger: { type: 'unit_killed', unitId: 'boss1' },
    effects: [
      { type: 'change_terrain', position: { x: 2, y: 0 }, terrain: 'plain' },
      { type: 'set_flag', key: 'boss_dead', value: 'true' },
    ],
    once: true,
  },
  // Custom trigger: fires when boss_dead flag is set AND turn >= 3
  {
    id: 'test_custom_victory',
    trigger: {
      type: 'custom',
      fn: (ctx) => ctx.flags.get('boss_dead') === 'true' && ctx.currentTurn >= 3,
    },
    effects: [
      { type: 'show_dialogue', scene: { lines: [{ speaker: 'Ren', text: 'We won!' }] } },
    ],
    once: true,
  },
];

describe('Integration: mid-battle events + recruitment', () => {
  it('turn 2 events fire dialogue and spawn', () => {
    const ctx: EventContext = {
      currentTurn: 2,
      currentPhase: 'player_phase',
      units: new Map([
        ['ren', makeUnit('ren', 'player', { x: 0, y: 2 })],
        ['boss1', makeUnit('boss1', 'enemy', { x: 2, y: 0 })],
      ]),
      flags: new Map(),
      justStartedPhase: 'player',
    };

    const fired = evaluateEvents(TEST_CHAPTER_EVENTS, new Set(), ctx);
    expect(fired).toHaveLength(2);
    expect(fired.map((e) => e.id)).toEqual(['test_turn2_dialogue', 'test_turn2_spawn']);

    // Resolve dialogue event
    const dialogueResult = resolveEffects(fired[0].effects);
    expect(dialogueResult.dialogueToShow).not.toBeNull();
    expect(dialogueResult.dialogueToShow!.lines[0].text).toBe('Reinforcements incoming!');

    // Resolve spawn event
    const spawnResult = resolveEffects(fired[1].effects);
    expect(spawnResult.unitsToSpawn).toHaveLength(1);
    expect(spawnResult.unitsToSpawn[0].unitId).toBe('bandit');
    expect(spawnResult.unitsToSpawn[0].faction).toBe('enemy');
  });

  it('village tile visit triggers recruitment', () => {
    const ctx: EventContext = {
      currentTurn: 1,
      currentPhase: 'player_phase',
      units: new Map([
        ['ren', makeUnit('ren', 'player', { x: 1, y: 1 })],
        ['ally1', makeUnit('ally1', 'ally', { x: 1, y: 0 })],
      ]),
      flags: new Map(),
      lastMovedUnitId: 'ren',
      lastMovedPosition: { x: 1, y: 1 },
    };

    const fired = evaluateEvents(TEST_CHAPTER_EVENTS, new Set(), ctx);
    expect(fired).toHaveLength(1);
    expect(fired[0].id).toBe('test_village_recruit');

    const result = resolveEffects(fired[0].effects);
    expect(result.dialogueToShow).not.toBeNull();
    expect(result.unitsToRecruit).toEqual(['ally1']);
  });

  it('boss killed triggers terrain change + flag', () => {
    const ctx: EventContext = {
      currentTurn: 2,
      currentPhase: 'player_phase',
      units: new Map([['ren', makeUnit('ren', 'player', { x: 2, y: 1 })]]),
      flags: new Map(),
      lastKilledUnitId: 'boss1',
    };

    const fired = evaluateEvents(TEST_CHAPTER_EVENTS, new Set(), ctx);
    expect(fired).toHaveLength(1);
    expect(fired[0].id).toBe('test_boss_killed');

    const result = resolveEffects(fired[0].effects);
    expect(result.terrainChanges).toEqual([{ position: { x: 2, y: 0 }, terrain: 'plain' }]);
    expect(result.flagChanges).toEqual([{ key: 'boss_dead', value: 'true' }]);
  });

  it('custom trigger fires when flag set + turn condition met', () => {
    const flags = new Map([['boss_dead', 'true']]);
    const ctx: EventContext = {
      currentTurn: 3,
      currentPhase: 'player_phase',
      units: new Map([['ren', makeUnit('ren', 'player')]]),
      flags,
      justStartedPhase: 'player',
    };

    const fired = evaluateEvents(TEST_CHAPTER_EVENTS, new Set(), ctx);
    const customEvent = fired.find((e) => e.id === 'test_custom_victory');
    expect(customEvent).toBeDefined();

    const result = resolveEffects(customEvent!.effects);
    expect(result.dialogueToShow!.lines[0].text).toBe('We won!');
  });

  it('custom trigger does NOT fire when conditions not met', () => {
    // Turn 3 but flag not set
    const ctx1: EventContext = {
      currentTurn: 3,
      currentPhase: 'player_phase',
      units: new Map([['ren', makeUnit('ren', 'player')]]),
      flags: new Map(),
      justStartedPhase: 'player',
    };
    const fired1 = evaluateEvents(TEST_CHAPTER_EVENTS, new Set(), ctx1);
    expect(fired1.find((e) => e.id === 'test_custom_victory')).toBeUndefined();

    // Flag set but turn 2
    const ctx2: EventContext = {
      currentTurn: 2,
      currentPhase: 'player_phase',
      units: new Map([['ren', makeUnit('ren', 'player')]]),
      flags: new Map([['boss_dead', 'true']]),
      justStartedPhase: 'player',
    };
    const fired2 = evaluateEvents(TEST_CHAPTER_EVENTS, new Set(), ctx2);
    expect(fired2.find((e) => e.id === 'test_custom_victory')).toBeUndefined();
  });

  it('once-fired events are not repeated', () => {
    const ctx: EventContext = {
      currentTurn: 2,
      currentPhase: 'player_phase',
      units: new Map([['ren', makeUnit('ren', 'player')]]),
      flags: new Map(),
      justStartedPhase: 'player',
    };

    // First evaluation
    const fired1 = evaluateEvents(TEST_CHAPTER_EVENTS, new Set(), ctx);
    const firedIds = new Set(fired1.filter((e) => e.once).map((e) => e.id));
    expect(firedIds.has('test_turn2_dialogue')).toBe(true);
    expect(firedIds.has('test_turn2_spawn')).toBe(true);

    // Second evaluation — should not fire again
    const fired2 = evaluateEvents(TEST_CHAPTER_EVENTS, firedIds, ctx);
    expect(fired2.find((e) => e.id === 'test_turn2_dialogue')).toBeUndefined();
    expect(fired2.find((e) => e.id === 'test_turn2_spawn')).toBeUndefined();
  });

  it('chain effect combines multiple effects', () => {
    const chainEffects: EventEffect[] = [
      {
        type: 'chain',
        effects: [
          { type: 'recruit_unit', unitId: 'ally1' },
          { type: 'set_flag', key: 'ally_joined', value: 'true' },
          { type: 'change_terrain', position: { x: 1, y: 1 }, terrain: 'plain' },
        ],
      },
    ];

    const result = resolveEffects(chainEffects);
    expect(result.unitsToRecruit).toEqual(['ally1']);
    expect(result.flagChanges).toEqual([{ key: 'ally_joined', value: 'true' }]);
    expect(result.terrainChanges).toEqual([{ position: { x: 1, y: 1 }, terrain: 'plain' }]);
  });
});
