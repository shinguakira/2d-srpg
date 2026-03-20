import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../src/stores/gameStore';
import type { Unit, GameMap, Tile, TerrainType, Position, Weapon } from '../../src/core/types';

function makeMap(terrain: TerrainType[][]): GameMap {
  const height = terrain.length;
  const width = terrain[0].length;
  const tiles: Tile[][] = terrain.map((row, y) =>
    row.map((t, x) => ({ position: { x, y }, terrain: t, occupantId: null }))
  );
  return { width, height, tiles };
}

function makeWeapon(overrides: Partial<Weapon> = {}): Weapon {
  return {
    id: 'iron_sword', name: 'Iron Sword', type: 'sword',
    might: 5, hit: 90, crit: 0, weight: 5, minRange: 1, maxRange: 1,
    ...overrides,
  };
}

function makeUnit(id: string, pos: Position, overrides: Partial<Unit> = {}): Unit {
  return {
    id, name: id, classId: 'lord', faction: 'player',
    position: pos,
    stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 5, cha: 0, wil: 0 },
    currentHp: 20, level: 1, exp: 0,
    equippedWeapon: makeWeapon(),
    inventory: [makeWeapon()],
    items: [], hasActed: false, facing: 'down' as const, sprite: '',
    skills: [], learnedSkills: [],
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

describe('Dance + Movement Integration', () => {
  beforeEach(() => {
    useGameStore.setState(useGameStore.getInitialState());
    // Enable instant teleport (skip walk animation)
    Object.defineProperty(window, 'location', {
      value: { search: '?skipWalkAnim', href: '' },
      writable: true,
    });
  });

  it('danced unit gets a full turn: can move and then wait', () => {
    const map = makeMap([
      ['plain', 'plain', 'plain', 'plain', 'plain'],
    ]);
    const dancer = makeUnit('dancer1', { x: 0, y: 0 }, {
      classId: 'dancer',
      skills: ['dance'],
      equippedWeapon: makeWeapon({ id: 'knife', name: 'Knife', type: 'knife' }),
      inventory: [makeWeapon({ id: 'knife', name: 'Knife', type: 'knife' })],
    });
    const ally = makeUnit('ally1', { x: 1, y: 0 }, {
      hasActed: true, // already acted this turn
    });

    setupStore([dancer, ally], map);

    // 1. Dancer dances the ally
    useGameStore.getState().selectUnit('dancer1');
    useGameStore.getState().clickTile({ x: 0, y: 0 }); // action menu at current pos
    useGameStore.getState().startDanceTargeting();
    expect(useGameStore.getState().playerAction).toBe('dance_target');

    useGameStore.getState().confirmDance('ally1');

    // 2. Verify ally is refreshed (hasActed = false)
    const allyAfterDance = useGameStore.getState().units.get('ally1')!;
    expect(allyAfterDance.hasActed).toBe(false);

    // 3. Select the refreshed ally
    useGameStore.getState().selectUnit('ally1');
    const stateAfterSelect = useGameStore.getState();
    expect(stateAfterSelect.selectedUnitId).toBe('ally1');
    expect(stateAfterSelect.playerAction).toBe('move_target');
    expect(stateAfterSelect.movementRange.size).toBeGreaterThan(0);

    // 4. Move ally to a new position
    useGameStore.getState().clickTile({ x: 3, y: 0 });
    expect(useGameStore.getState().playerAction).toBe('action_menu');
    expect(useGameStore.getState().pendingPosition).toEqual({ x: 3, y: 0 });

    // 5. Wait (end turn)
    useGameStore.getState().confirmMove();

    // 6. Verify ally is now at new position and has acted
    const allyFinal = useGameStore.getState().units.get('ally1')!;
    expect(allyFinal.position).toEqual({ x: 3, y: 0 });
    expect(allyFinal.hasActed).toBe(true);
  });

  it('danced unit can attack after being refreshed', () => {
    const map = makeMap([
      ['plain', 'plain', 'plain', 'plain', 'plain'],
    ]);
    const dancer = makeUnit('dancer1', { x: 0, y: 0 }, {
      classId: 'dancer',
      skills: ['dance'],
      equippedWeapon: makeWeapon({ id: 'knife', name: 'Knife', type: 'knife' }),
      inventory: [makeWeapon({ id: 'knife', name: 'Knife', type: 'knife' })],
    });
    const ally = makeUnit('ally1', { x: 1, y: 0 }, {
      hasActed: true,
    });
    const enemy = makeUnit('enemy1', { x: 3, y: 0 }, {
      faction: 'enemy',
      stats: { hp: 20, str: 5, mag: 0, def: 3, res: 0, spd: 5, skl: 5, lck: 3, mov: 3, cha: 0, wil: 0 },
      currentHp: 20,
    });

    setupStore([dancer, ally, enemy], map);

    // Dance the ally
    useGameStore.getState().selectUnit('dancer1');
    useGameStore.getState().clickTile({ x: 0, y: 0 });
    useGameStore.getState().startDanceTargeting();
    useGameStore.getState().confirmDance('ally1');

    // Refreshed ally can be selected
    const refreshed = useGameStore.getState().units.get('ally1')!;
    expect(refreshed.hasActed).toBe(false);

    // Select refreshed ally
    useGameStore.getState().selectUnit('ally1');
    expect(useGameStore.getState().selectedUnitId).toBe('ally1');

    // Move ally adjacent to enemy
    useGameStore.getState().clickTile({ x: 2, y: 0 });
    expect(useGameStore.getState().playerAction).toBe('action_menu');

    // Start attack targeting
    useGameStore.getState().startAttackTargeting();
    expect(useGameStore.getState().playerAction).toBe('attack_target');
  });
});
