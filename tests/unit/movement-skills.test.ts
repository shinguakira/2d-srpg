import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../src/stores/gameStore';
import type { Unit, GameMap, Tile, TerrainType, Position, Weapon } from '../../src/core/types';

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
    tiles[u.position.y][u.position.x].occupantId = u.id;
  }

  useGameStore.setState({
    units: unitMap,
    gameMap: { ...map, tiles },
    currentPhase: 'player_phase',
    playerAction: 'idle',
    selectedUnitId: null,
    pendingPosition: null,
  });
}

describe('executeSwap (Bug 2: ghost occupant)', () => {
  beforeEach(() => {
    useGameStore.setState(useGameStore.getInitialState());
  });

  it('clears original tile occupant after swap', () => {
    // Unit at (0,0), will move to (1,0), ally at (2,0)
    const map = makeMap([['plain', 'plain', 'plain']]);
    const unit = makeUnit('unitA', { x: 0, y: 0 }, { skills: ['swap'] });
    const ally = makeUnit('unitB', { x: 2, y: 0 });

    setupStore([unit, ally], map);

    // Select unit and move to (1,0) to get action menu
    useGameStore.getState().selectUnit('unitA');
    useGameStore.getState().clickTile({ x: 1, y: 0 });

    // pendingPosition should be (1,0)
    expect(useGameStore.getState().pendingPosition).toEqual({ x: 1, y: 0 });

    // Execute swap
    useGameStore.getState().swap();

    const state = useGameStore.getState();
    const tiles = state.gameMap.tiles;

    // Original tile (0,0) should be clear — no ghost occupant
    expect(tiles[0][0].occupantId).toBeNull();
    // Ally moves to pendingPosition (1,0)
    expect(tiles[0][1].occupantId).toBe('unitB');
    // Unit moves to ally's old position (2,0)
    expect(tiles[0][2].occupantId).toBe('unitA');
  });
});
