import { describe, it, expect } from 'vitest';
import {
  matchesTrigger,
  evaluateEvents,
  resolveEffects,
  type EventContext,
} from '../../src/core/events';
import type { ChapterEvent, Unit, Position } from '../../src/core/types';

function makeUnit(
  id: string,
  faction: 'player' | 'enemy' = 'player',
  pos: Position = { x: 0, y: 0 },
): Unit {
  return {
    id,
    name: id,
    classId: 'lord',
    faction,
    position: pos,
    stats: {
      hp: 20,
      str: 5,
      mag: 0,
      def: 5,
      res: 0,
      spd: 5,
      skl: 5,
      lck: 5,
      mov: 5,
      cha: 0,
      wil: 0,
    },
    currentHp: 20,
    level: 1,
    exp: 0,
    equippedWeapon: {
      id: 'iron_sword',
      name: 'Iron Sword',
      type: 'sword',
      might: 5,
      hit: 90,
      crit: 0,
      weight: 5,
      minRange: 1,
      maxRange: 1,
    },
    inventory: [
      {
        id: 'iron_sword',
        name: 'Iron Sword',
        type: 'sword',
        might: 5,
        hit: 90,
        crit: 0,
        weight: 5,
        minRange: 1,
        maxRange: 1,
      },
    ],
    items: [],
    hasActed: false,
    skills: [],
    learnedSkills: [],
    facing: 'down',
    sprite: '',
    metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
  };
}

function makeContext(overrides: Partial<EventContext> = {}): EventContext {
  const units = new Map<string, Unit>();
  units.set('ren', makeUnit('ren', 'player', { x: 3, y: 4 }));
  units.set('boss1', makeUnit('boss1', 'enemy', { x: 7, y: 7 }));
  return {
    currentTurn: 1,
    currentPhase: 'player_phase',
    units,
    flags: new Map(),
    ...overrides,
  };
}

describe('matchesTrigger', () => {
  it('matches turn_start trigger', () => {
    const trigger = { type: 'turn_start' as const, turn: 2 };
    expect(
      matchesTrigger(trigger, makeContext({ justStartedPhase: 'player', currentTurn: 2 })),
    ).toBe(true);
    expect(
      matchesTrigger(trigger, makeContext({ justStartedPhase: 'player', currentTurn: 1 })),
    ).toBe(false);
    expect(
      matchesTrigger(trigger, makeContext({ justStartedPhase: 'enemy', currentTurn: 2 })),
    ).toBe(false);
  });

  it('matches turn_end trigger', () => {
    const trigger = { type: 'turn_end' as const, turn: 3 };
    expect(
      matchesTrigger(trigger, makeContext({ justStartedPhase: 'enemy', currentTurn: 3 })),
    ).toBe(true);
    expect(
      matchesTrigger(trigger, makeContext({ justStartedPhase: 'player', currentTurn: 3 })),
    ).toBe(false);
  });

  it('matches phase_start trigger', () => {
    const trigger = { type: 'phase_start' as const, faction: 'enemy' as const };
    expect(matchesTrigger(trigger, makeContext({ justStartedPhase: 'enemy' }))).toBe(true);
    expect(matchesTrigger(trigger, makeContext({ justStartedPhase: 'player' }))).toBe(false);
  });

  it('matches unit_at trigger', () => {
    const trigger = { type: 'unit_at' as const, unitId: 'ren', position: { x: 3, y: 4 } };
    expect(matchesTrigger(trigger, makeContext())).toBe(true);
    const trigger2 = { type: 'unit_at' as const, unitId: 'ren', position: { x: 0, y: 0 } };
    expect(matchesTrigger(trigger2, makeContext())).toBe(false);
  });

  it('matches unit_killed trigger', () => {
    const trigger = { type: 'unit_killed' as const, unitId: 'boss1' };
    expect(matchesTrigger(trigger, makeContext({ lastKilledUnitId: 'boss1' }))).toBe(true);
    expect(matchesTrigger(trigger, makeContext({ lastKilledUnitId: 'ren' }))).toBe(false);
    expect(matchesTrigger(trigger, makeContext())).toBe(false);
  });

  it('matches unit_hp_below trigger', () => {
    const ctx = makeContext();
    const unit = ctx.units.get('ren')!;
    // ren has 20 hp / 20 max = 100%
    const trigger = { type: 'unit_hp_below' as const, unitId: 'ren', percent: 50 };
    expect(matchesTrigger(trigger, ctx)).toBe(false);

    // Set hp to 5/20 = 25%
    ctx.units.set('ren', { ...unit, currentHp: 5 });
    expect(matchesTrigger(trigger, ctx)).toBe(true);
  });

  it('matches tile_visited trigger', () => {
    const trigger = { type: 'tile_visited' as const, position: { x: 5, y: 5 } };
    expect(matchesTrigger(trigger, makeContext({ lastMovedPosition: { x: 5, y: 5 } }))).toBe(true);
    expect(matchesTrigger(trigger, makeContext({ lastMovedPosition: { x: 5, y: 6 } }))).toBe(false);
    expect(matchesTrigger(trigger, makeContext())).toBe(false);
  });

  it('matches custom trigger function', () => {
    const trigger = {
      type: 'custom' as const,
      fn: (ctx: { currentTurn: number }) => ctx.currentTurn >= 3,
    };
    expect(matchesTrigger(trigger, makeContext({ currentTurn: 3 }))).toBe(true);
    expect(matchesTrigger(trigger, makeContext({ currentTurn: 2 }))).toBe(false);
    expect(matchesTrigger(trigger, makeContext({ currentTurn: 5 }))).toBe(true);
  });

  it('custom trigger can check flags', () => {
    const trigger = {
      type: 'custom' as const,
      fn: (ctx: { flags: ReadonlyMap<string, string> }) => ctx.flags.get('boss_angry') === 'true',
    };
    const flags = new Map([['boss_angry', 'true']]);
    expect(matchesTrigger(trigger, makeContext({ flags }))).toBe(true);
    expect(matchesTrigger(trigger, makeContext())).toBe(false);
  });
});

describe('evaluateEvents', () => {
  it('returns matching events', () => {
    const events: ChapterEvent[] = [
      { id: 'e1', trigger: { type: 'turn_start', turn: 1 }, effects: [], once: true },
      { id: 'e2', trigger: { type: 'turn_start', turn: 2 }, effects: [], once: true },
    ];
    const ctx = makeContext({ justStartedPhase: 'player', currentTurn: 1 });
    const result = evaluateEvents(events, new Set(), ctx);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('e1');
  });

  it('skips already-fired once events', () => {
    const events: ChapterEvent[] = [
      { id: 'e1', trigger: { type: 'turn_start', turn: 1 }, effects: [], once: true },
    ];
    const ctx = makeContext({ justStartedPhase: 'player', currentTurn: 1 });
    const result = evaluateEvents(events, new Set(['e1']), ctx);
    expect(result).toHaveLength(0);
  });

  it('allows repeating non-once events', () => {
    const events: ChapterEvent[] = [
      { id: 'e1', trigger: { type: 'turn_start', turn: 1 }, effects: [], once: false },
    ];
    const ctx = makeContext({ justStartedPhase: 'player', currentTurn: 1 });
    const result = evaluateEvents(events, new Set(['e1']), ctx);
    expect(result).toHaveLength(1);
  });
});

describe('resolveEffects', () => {
  it('resolves recruit_unit effect', () => {
    const result = resolveEffects([{ type: 'recruit_unit', unitId: 'voss' }]);
    expect(result.unitsToRecruit).toEqual(['voss']);
    expect(result.dialogueToShow).toBeNull();
  });

  it('resolves show_dialogue effect', () => {
    const scene = { lines: [{ speaker: 'Ren', text: 'Hello!' }] };
    const result = resolveEffects([{ type: 'show_dialogue', scene }]);
    expect(result.dialogueToShow).toBe(scene);
  });

  it('resolves set_flag effect', () => {
    const result = resolveEffects([{ type: 'set_flag', key: 'recruited_voss', value: 'true' }]);
    expect(result.flagChanges).toEqual([{ key: 'recruited_voss', value: 'true' }]);
  });

  it('resolves chain effects', () => {
    const result = resolveEffects([
      {
        type: 'chain',
        effects: [
          { type: 'recruit_unit', unitId: 'voss' },
          { type: 'set_flag', key: 'voss_joined', value: 'true' },
        ],
      },
    ]);
    expect(result.unitsToRecruit).toEqual(['voss']);
    expect(result.flagChanges).toEqual([{ key: 'voss_joined', value: 'true' }]);
  });

  it('resolves remove_unit effect', () => {
    const result = resolveEffects([{ type: 'remove_unit', unitId: 'boss1' }]);
    expect(result.unitsToRemove).toEqual(['boss1']);
  });

  it('resolves change_terrain effect', () => {
    const result = resolveEffects([
      { type: 'change_terrain', position: { x: 3, y: 4 }, terrain: 'water' },
    ]);
    expect(result.terrainChanges).toEqual([{ position: { x: 3, y: 4 }, terrain: 'water' }]);
  });

  it('resolves spawn_units effect', () => {
    const result = resolveEffects([
      {
        type: 'spawn_units',
        units: [{ unitId: 'bandit1', position: { x: 1, y: 1 } }],
        faction: 'enemy',
      },
    ]);
    expect(result.unitsToSpawn).toEqual([
      { unitId: 'bandit1', position: { x: 1, y: 1 }, faction: 'enemy' },
    ]);
  });
});
