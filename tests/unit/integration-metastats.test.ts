import { describe, it, expect } from 'vitest';
import type { Unit, GameMap, Tile } from '../../src/core/types';
import type { GameState, GameActions } from '../../src/stores/gameStoreTypes';
import { updateTurnMetaStats } from '../../src/stores/actions/metaStatActions';
import { applyCombatResult } from '../../src/stores/helpers/combatResolution';
import type { CombatResult } from '../../src/core/combat';

function makeTile(x: number, y: number, terrain: string = 'plain'): Tile {
  return { terrain: terrain as Tile['terrain'], x, y, occupantId: null };
}

function makeUnit(id: string, pos: { x: number; y: number }, opts?: Partial<Unit>): Unit {
  return {
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    classId: 'lord',
    faction: 'player',
    position: pos,
    stats: {
      hp: 20,
      str: 8,
      mag: 4,
      def: 5,
      res: 3,
      spd: 7,
      skl: 6,
      lck: 4,
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
    inventory: [],
    items: [],
    hasActed: false,
    facing: 'down',
    sprite: '',
    skills: [],
    learnedSkills: [],
    metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
    ...opts,
  };
}

function makeMap(
  width: number,
  height: number,
  terrainOverrides: Record<string, string> = {},
): GameMap {
  const tiles: Tile[][] = [];
  for (let y = 0; y < height; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < width; x++) {
      const key = `${x},${y}`;
      row.push(makeTile(x, y, terrainOverrides[key] ?? 'plain'));
    }
    tiles.push(row);
  }
  return { tiles, width, height };
}

type MockState = Partial<GameState> & {
  units: Map<string, Unit>;
  gameMap: GameMap;
  floatingNumbers: GameState['floatingNumbers'];
  eventFlags: Map<string, string>;
};

function createMockGetSet(state: MockState) {
  let current = { ...state };
  const get = () => current as GameState & GameActions;
  const set = (partial: Partial<GameState>) => {
    current = { ...current, ...partial };
  };
  return { get, set, getState: () => current };
}

describe('Integration: CRP rises on glitched tile per turn', () => {
  it('unit on glitched tile gains +2 CRP per turn', () => {
    const unit = makeUnit('test1', { x: 1, y: 1 });
    const units = new Map<string, Unit>([['test1', unit]]);
    const gameMap = makeMap(3, 3, { '1,1': 'glitched' });
    gameMap.tiles[1][1].occupantId = 'test1';

    const { get, set, getState } = createMockGetSet({
      units,
      gameMap,
      floatingNumbers: [],
      eventFlags: new Map(),
    });

    // Turn 1
    updateTurnMetaStats(get, set, 'player');
    expect(getState().units.get('test1')!.metaStats.crp).toBe(2);

    // Turn 2
    updateTurnMetaStats(get, set, 'player');
    expect(getState().units.get('test1')!.metaStats.crp).toBe(4);

    // Turn 3
    updateTurnMetaStats(get, set, 'player');
    expect(getState().units.get('test1')!.metaStats.crp).toBe(6);
  });

  it('unit on data_void gains +3 CRP per turn', () => {
    const unit = makeUnit('test1', { x: 1, y: 1 });
    const units = new Map<string, Unit>([['test1', unit]]);
    const gameMap = makeMap(3, 3, { '1,1': 'data_void' });
    gameMap.tiles[1][1].occupantId = 'test1';

    const { get, set, getState } = createMockGetSet({
      units,
      gameMap,
      floatingNumbers: [],
      eventFlags: new Map(),
    });

    updateTurnMetaStats(get, set, 'player');
    expect(getState().units.get('test1')!.metaStats.crp).toBe(3);
  });

  it('unit on plain tile gets no CRP', () => {
    const unit = makeUnit('test1', { x: 1, y: 1 });
    const units = new Map<string, Unit>([['test1', unit]]);
    const gameMap = makeMap(3, 3);
    gameMap.tiles[1][1].occupantId = 'test1';

    const { get, set, getState } = createMockGetSet({
      units,
      gameMap,
      floatingNumbers: [],
      eventFlags: new Map(),
    });

    updateTurnMetaStats(get, set, 'player');
    expect(getState().units.get('test1')!.metaStats.crp).toBe(0);
  });

  it('CRP is clamped to 100', () => {
    const unit = makeUnit(
      'test1',
      { x: 1, y: 1 },
      {
        metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 99, sta: 0 },
      },
    );
    const units = new Map<string, Unit>([['test1', unit]]);
    const gameMap = makeMap(3, 3, { '1,1': 'data_void' });
    gameMap.tiles[1][1].occupantId = 'test1';

    const { get, set, getState } = createMockGetSet({
      units,
      gameMap,
      floatingNumbers: [],
      eventFlags: new Map(),
    });

    updateTurnMetaStats(get, set, 'player');
    expect(getState().units.get('test1')!.metaStats.crp).toBe(100);
  });
});

describe('Integration: LOY -5 when Shigeru takes damage near adjacent ally', () => {
  it('adjacent ally loses LOY when Shigeru is hit', () => {
    const lord = makeUnit('shigeru', { x: 1, y: 1 }, { isLord: true });
    const ally = makeUnit(
      'akira',
      { x: 1, y: 2 },
      { metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 } },
    );
    const enemy = makeUnit('enemy1', { x: 2, y: 1 }, { faction: 'enemy' });
    const units = new Map<string, Unit>([
      ['shigeru', lord],
      ['akira', ally],
      ['enemy1', enemy],
    ]);
    const gameMap = makeMap(4, 4);

    // Enemy attacks Shigeru, deals 5 damage
    const combatResult: CombatResult = {
      hits: [
        {
          attackerIsInitiator: true,
          hit: true,
          crit: false,
          damage: 5,
          targetHpAfter: 15,
          targetKilled: false,
          activatedSkill: null,
          healedAmount: 0,
          miracleSaved: false,
        },
      ],
      attackerHpAfter: 20, // enemy (attacker) is fine
      defenderHpAfter: 15, // lord (defender) took damage
      attackerDied: false,
      defenderDied: false,
    };

    // Enemy is attacker, Shigeru is defender
    const result = applyCombatResult(units, gameMap, 'enemy1', 'shigeru', combatResult, null);
    // Akira should lose 5 LOY for being adjacent when Shigeru took damage
    const akira = result.newUnits.get('akira')!;
    expect(akira.metaStats.loy).toBe(45);
  });

  it('non-adjacent ally is unaffected', () => {
    const lord = makeUnit('shigeru', { x: 1, y: 1 }, { isLord: true });
    const farAlly = makeUnit(
      'lisette',
      { x: 3, y: 3 },
      { metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 } },
    );
    const enemy = makeUnit('enemy1', { x: 2, y: 1 }, { faction: 'enemy' });
    const units = new Map<string, Unit>([
      ['shigeru', lord],
      ['lisette', farAlly],
      ['enemy1', enemy],
    ]);
    const gameMap = makeMap(4, 4);

    const combatResult: CombatResult = {
      hits: [
        {
          attackerIsInitiator: true,
          hit: true,
          crit: false,
          damage: 5,
          targetHpAfter: 15,
          targetKilled: false,
          activatedSkill: null,
          healedAmount: 0,
          miracleSaved: false,
        },
      ],
      attackerHpAfter: 20,
      defenderHpAfter: 15,
      attackerDied: false,
      defenderDied: false,
    };

    const result = applyCombatResult(units, gameMap, 'enemy1', 'shigeru', combatResult, null);
    const lisette = result.newUnits.get('lisette')!;
    expect(lisette.metaStats.loy).toBe(50); // unchanged
  });

  it('LOY does not go below 0 from Shigeru damage penalty', () => {
    const lord = makeUnit('shigeru', { x: 1, y: 1 }, { isLord: true });
    const ally = makeUnit(
      'halvar',
      { x: 1, y: 2 },
      { metaStats: { awr: 0, loop: 0, sync: 70, loy: 3, crp: 0, sta: 0 } },
    );
    const enemy = makeUnit('enemy1', { x: 2, y: 1 }, { faction: 'enemy' });
    const units = new Map<string, Unit>([
      ['shigeru', lord],
      ['halvar', ally],
      ['enemy1', enemy],
    ]);
    const gameMap = makeMap(4, 4);

    const combatResult: CombatResult = {
      hits: [
        {
          attackerIsInitiator: true,
          hit: true,
          crit: false,
          damage: 5,
          targetHpAfter: 15,
          targetKilled: false,
          activatedSkill: null,
          healedAmount: 0,
          miracleSaved: false,
        },
      ],
      attackerHpAfter: 20,
      defenderHpAfter: 15,
      attackerDied: false,
      defenderDied: false,
    };

    const result = applyCombatResult(units, gameMap, 'enemy1', 'shigeru', combatResult, null);
    expect(result.newUnits.get('halvar')!.metaStats.loy).toBe(0);
  });
});

describe('Integration: AWR 30 anomaly dialogue', () => {
  it('triggers dialogue when AWR >= 30 unit is adjacent to glitched tile', () => {
    const unit = makeUnit(
      'lisette',
      { x: 1, y: 1 },
      {
        metaStats: { awr: 30, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
      },
    );
    const units = new Map<string, Unit>([['lisette', unit]]);
    // Glitched tile adjacent at (2,1)
    const gameMap = makeMap(3, 3, { '2,1': 'glitched' });
    gameMap.tiles[1][1].occupantId = 'lisette';

    const { get, set, getState } = createMockGetSet({
      units,
      gameMap,
      floatingNumbers: [],
      eventFlags: new Map(),
    });

    updateTurnMetaStats(get, set, 'player');

    const state = getState();
    // Should have event dialogue
    expect(state.eventDialogue).toBeDefined();
    expect(state.eventDialogue!.lines[0].speaker).toBe('Lisette');
    // Should set flag to prevent repeat
    expect(state.eventFlags.has('awr_comment_lisette')).toBe(true);
  });

  it('does not trigger if AWR < 30', () => {
    const unit = makeUnit(
      'bryn',
      { x: 1, y: 1 },
      {
        metaStats: { awr: 10, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
      },
    );
    const units = new Map<string, Unit>([['bryn', unit]]);
    const gameMap = makeMap(3, 3, { '2,1': 'glitched' });
    gameMap.tiles[1][1].occupantId = 'bryn';

    const { get, set, getState } = createMockGetSet({
      units,
      gameMap,
      floatingNumbers: [],
      eventFlags: new Map(),
    });

    updateTurnMetaStats(get, set, 'player');

    const state = getState();
    expect(state.eventDialogue).toBeUndefined();
  });

  it('does not repeat for same unit', () => {
    const unit = makeUnit(
      'gareth',
      { x: 1, y: 1 },
      {
        metaStats: { awr: 40, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
      },
    );
    const units = new Map<string, Unit>([['gareth', unit]]);
    const gameMap = makeMap(3, 3, { '2,1': 'glitched' });
    gameMap.tiles[1][1].occupantId = 'gareth';

    const flags = new Map<string, string>();
    flags.set('awr_comment_gareth', 'true');

    const { get, set, getState } = createMockGetSet({
      units,
      gameMap,
      floatingNumbers: [],
      eventFlags: flags,
    });

    updateTurnMetaStats(get, set, 'player');

    const state = getState();
    // Should NOT trigger dialogue since flag already set
    expect(state.eventDialogue).toBeUndefined();
  });
});
