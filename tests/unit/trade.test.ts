import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../src/stores/gameStore';
import type {
  Unit,
  GameMap,
  Tile,
  TerrainType,
  Position,
  Weapon,
  ConsumableItem,
} from '../../src/core/types';

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

describe('Trade action', () => {
  beforeEach(() => {
    useGameStore.setState(useGameStore.getInitialState());
  });

  it('swaps items between allies', () => {
    const map = makeMap([['plain', 'plain', 'plain']]);
    const vulnerary: ConsumableItem = {
      id: 'vulnerary',
      name: 'Vulnerary',
      type: 'consumable',
      uses: 3,
      maxUses: 3,
      effect: { kind: 'heal', amount: 10 },
    };
    const elixir: ConsumableItem = {
      id: 'elixir',
      name: 'Elixir',
      type: 'consumable',
      uses: 3,
      maxUses: 3,
      effect: { kind: 'heal', amount: 20 },
    };

    const unitA = makeUnit('unitA', { x: 0, y: 0 }, { items: [vulnerary] });
    const unitB = makeUnit('unitB', { x: 1, y: 0 }, { items: [elixir] });

    setupStore([unitA, unitB], map);

    useGameStore.getState().selectUnit('unitA');
    useGameStore.getState().clickTile({ x: 0, y: 0 });
    useGameStore.getState().startTradeTargeting();

    expect(useGameStore.getState().playerAction).toBe('trade_target');

    // Swap: move vulnerary from A to B
    useGameStore.getState().confirmTrade('unitB', [{ from: 'a', index: 0 }]);

    const state = useGameStore.getState();
    const aAfter = state.units.get('unitA')!;
    const bAfter = state.units.get('unitB')!;

    expect(aAfter.items).toHaveLength(0); // vulnerary moved to B
    expect(bAfter.items).toHaveLength(2); // elixir + vulnerary
    expect(bAfter.items[1].id).toBe('vulnerary');
  });

  it('does NOT consume the turn', () => {
    const map = makeMap([['plain', 'plain', 'plain']]);
    const vulnerary: ConsumableItem = {
      id: 'vulnerary',
      name: 'Vulnerary',
      type: 'consumable',
      uses: 3,
      maxUses: 3,
      effect: { kind: 'heal', amount: 10 },
    };

    const unitA = makeUnit('unitA', { x: 0, y: 0 }, { items: [vulnerary] });
    const unitB = makeUnit('unitB', { x: 1, y: 0 });

    setupStore([unitA, unitB], map);

    useGameStore.getState().selectUnit('unitA');
    useGameStore.getState().clickTile({ x: 0, y: 0 });
    useGameStore.getState().startTradeTargeting();
    useGameStore.getState().confirmTrade('unitB', [{ from: 'a', index: 0 }]);

    const state = useGameStore.getState();
    // Trade returns to action_menu (not idle) — unit can still act
    expect(state.playerAction).toBe('action_menu');
    expect(state.units.get('unitA')!.hasActed).toBe(false);
  });

  it('requires adjacency', () => {
    const map = makeMap([['plain', 'plain', 'plain', 'plain']]);
    const unitA = makeUnit('unitA', { x: 0, y: 0 });
    const unitB = makeUnit('unitB', { x: 3, y: 0 }); // 3 tiles away

    setupStore([unitA, unitB], map);

    useGameStore.getState().selectUnit('unitA');
    useGameStore.getState().clickTile({ x: 0, y: 0 });
    useGameStore.getState().startTradeTargeting();

    // Non-adjacent — should not enter trade_target
    expect(useGameStore.getState().playerAction).toBe('action_menu');
  });
});
