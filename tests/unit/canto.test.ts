import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../src/stores/gameStore';
import type { Unit, GameMap, Tile, TerrainType, Position, Weapon } from '../../src/core/types';
import { SeededRandom } from '../../src/core/rng';

function makeMap(terrain: TerrainType[][]): GameMap {
  const height = terrain.length;
  const width = terrain[0].length;
  const tiles: Tile[][] = terrain.map((row, y) =>
    row.map((t, x) => ({ position: { x, y }, terrain: t, occupantId: null })),
  );
  return { width, height, tiles };
}

function makeWeapon(overrides: Partial<Weapon> = {}): Weapon {
  return {
    id: 'iron_sword',
    name: 'Iron Sword',
    type: 'sword',
    might: 5,
    hit: 90,
    crit: 0,
    weight: 5,
    minRange: 1,
    maxRange: 1,
    ...overrides,
  };
}

function makeUnit(id: string, pos: Position, overrides: Partial<Unit> = {}): Unit {
  return {
    id,
    name: id,
    classId: 'lord',
    faction: 'player',
    position: pos,
    stats: {
      hp: 20,
      str: 8,
      mag: 0,
      def: 5,
      res: 0,
      spd: 7,
      skl: 5,
      lck: 3,
      mov: 5,
      cha: 0,
      wil: 0,
    },
    currentHp: 20,
    level: 1,
    exp: 0,
    equippedWeapon: makeWeapon(),
    inventory: [makeWeapon()],
    items: [],
    hasActed: false,
    facing: 'down' as const,
    sprite: '',
    skills: [],
    learnedSkills: [],
    metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
    ...overrides,
  };
}

function setupStore(units: Unit[], map: GameMap) {
  const unitMap = new Map<string, Unit>();
  const tiles = map.tiles.map((row) => row.map((t) => ({ ...t })));

  for (const u of units) {
    unitMap.set(u.id, u);
    if (!u.isCarried) {
      tiles[u.position.y][u.position.x].occupantId = u.id;
    }
  }

  useGameStore.setState({
    units: unitMap,
    gameMap: { ...map, tiles },
    currentPhase: 'player_phase',
    playerAction: 'idle',
    selectedUnitId: null,
    pendingPosition: null,
    rng: new SeededRandom(42),
  });
}

describe('Canto after combat (Bug 1)', () => {
  beforeEach(() => {
    useGameStore.setState(useGameStore.getInitialState());
  });

  it('activates after dismissExpBar for cavalier with canto', () => {
    // Cavalier has innate canto skill
    const map = makeMap([['plain', 'plain', 'plain', 'plain', 'plain']]);
    const cavalier = makeUnit(
      'cav',
      { x: 0, y: 0 },
      {
        classId: 'cavalier',
        stats: {
          hp: 30,
          str: 12,
          mag: 0,
          def: 8,
          res: 3,
          spd: 10,
          skl: 8,
          lck: 5,
          mov: 7,
          cha: 0,
          wil: 0,
        },
        currentHp: 30,
      },
    );
    const enemy = makeUnit(
      'enemy',
      { x: 2, y: 0 },
      {
        faction: 'enemy',
        stats: {
          hp: 20,
          str: 5,
          mag: 0,
          def: 3,
          res: 0,
          spd: 5,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
        currentHp: 20,
      },
    );

    setupStore([cavalier, enemy], map);

    // Simulate: unit selected, moved to (1,0), attacked enemy, combat resolved
    // Set up state as if finishCombat just ran with expBarData
    useGameStore.setState({
      selectedUnitId: 'cav',
      pendingPosition: { x: 1, y: 0 },
      playerAction: 'idle',
      expBarData: {
        unitId: 'cav',
        unitName: 'cav',
        expBefore: 0,
        expGain: 30,
        leveled: false,
      },
      levelUpGains: null,
      levelUpUnitId: null,
    });

    // Dismiss EXP bar — should trigger Canto check
    useGameStore.getState().dismissExpBar();

    const state = useGameStore.getState();
    expect(state.playerAction).toBe('canto_move');
    expect(state.selectedUnitId).toBe('cav');
    expect(state.cantoRange.size).toBeGreaterThan(0);
  });

  it('activates after dismissLevelUp for cavalier with canto', () => {
    const map = makeMap([['plain', 'plain', 'plain', 'plain', 'plain']]);
    const cavalier = makeUnit(
      'cav',
      { x: 0, y: 0 },
      {
        classId: 'cavalier',
        stats: {
          hp: 30,
          str: 12,
          mag: 0,
          def: 8,
          res: 3,
          spd: 10,
          skl: 8,
          lck: 5,
          mov: 7,
          cha: 0,
          wil: 0,
        },
        currentHp: 30,
      },
    );
    const enemy = makeUnit(
      'enemy',
      { x: 2, y: 0 },
      {
        faction: 'enemy',
        stats: {
          hp: 20,
          str: 5,
          mag: 0,
          def: 3,
          res: 0,
          spd: 5,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
        currentHp: 20,
      },
    );

    setupStore([cavalier, enemy], map);

    // State as if finishCombat ran with level-up, expBar already dismissed
    // Unit has hasActed: true from combat
    const units = new Map(useGameStore.getState().units);
    const cav = units.get('cav')!;
    units.set('cav', { ...cav, hasActed: true });
    useGameStore.setState({
      units,
      selectedUnitId: 'cav',
      pendingPosition: { x: 1, y: 0 },
      playerAction: 'idle',
      expBarData: null,
      levelUpGains: {
        hp: 1,
        str: 1,
        mag: 0,
        def: 0,
        res: 0,
        spd: 0,
        skl: 0,
        lck: 0,
        cha: 0,
        wil: 0,
      },
      levelUpUnitId: 'cav',
    });

    // Dismiss level-up — should trigger Canto
    useGameStore.getState().dismissLevelUp();

    const state = useGameStore.getState();
    expect(state.playerAction).toBe('canto_move');
    expect(state.selectedUnitId).toBe('cav');
  });

  it('does NOT activate for non-canto units', () => {
    const map = makeMap([['plain', 'plain', 'plain', 'plain', 'plain']]);
    // Lord has no canto
    const lord = makeUnit(
      'lord',
      { x: 0, y: 0 },
      {
        classId: 'lord',
      },
    );
    const enemy = makeUnit(
      'enemy',
      { x: 2, y: 0 },
      {
        faction: 'enemy',
      },
    );

    setupStore([lord, enemy], map);

    useGameStore.setState({
      selectedUnitId: 'lord',
      pendingPosition: { x: 1, y: 0 },
      playerAction: 'idle',
      expBarData: {
        unitId: 'lord',
        unitName: 'lord',
        expBefore: 0,
        expGain: 30,
        leveled: false,
      },
      levelUpGains: null,
      levelUpUnitId: null,
    });

    useGameStore.getState().dismissExpBar();

    const state = useGameStore.getState();
    // Should go to idle, not canto
    expect(state.playerAction).toBe('idle');
    expect(state.selectedUnitId).toBeNull();
  });

  it('preserves selectedUnitId through EXP bar flow', () => {
    const map = makeMap([['plain', 'plain', 'plain']]);
    const cavalier = makeUnit('cav', { x: 0, y: 0 }, { classId: 'cavalier' });
    const enemy = makeUnit('enemy', { x: 2, y: 0 }, { faction: 'enemy' });
    setupStore([cavalier, enemy], map);

    // Simulate finishCombat setting expBarData while keeping selectedUnitId
    useGameStore.setState({
      selectedUnitId: 'cav',
      pendingPosition: { x: 1, y: 0 },
      expBarData: {
        unitId: 'cav',
        unitName: 'cav',
        expBefore: 0,
        expGain: 20,
        leveled: false,
      },
    });

    // selectedUnitId should still be set (not cleared by IDLE_RESET)
    expect(useGameStore.getState().selectedUnitId).toBe('cav');
  });
});
