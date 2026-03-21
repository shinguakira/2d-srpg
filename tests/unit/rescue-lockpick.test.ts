import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../src/stores/gameStore';
import { canRescueUnit } from '../../src/core/rescue';
import type { Unit, GameMap, Tile, TerrainType, Position, Weapon, ChapterData, ChestData, VillageReward } from '../../src/core/types';

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

describe('canRescueUnit', () => {
  it('returns true when STR > target weight', () => {
    const rescuer = makeUnit('r', { x: 0, y: 0 }, { stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 5, cha: 0, wil: 0 } });
    // lord class has base mov=5, so weight=5. STR 8 > 5 → true
    const target = makeUnit('t', { x: 1, y: 0 }, { classId: 'lord' });
    expect(canRescueUnit(rescuer, target)).toBe(true);
  });

  it('returns false when STR ≤ target weight', () => {
    const rescuer = makeUnit('r', { x: 0, y: 0 }, { stats: { hp: 20, str: 4, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 5, cha: 0, wil: 0 } });
    // lord base mov=5. STR 4 <= 5 → false
    const target = makeUnit('t', { x: 1, y: 0 }, { classId: 'lord' });
    expect(canRescueUnit(rescuer, target)).toBe(false);
  });
});

describe('Rescue action', () => {
  beforeEach(() => {
    useGameStore.setState(useGameStore.getInitialState());
  });

  it('applies stat penalties when rescuing', () => {
    const map = makeMap([['plain', 'plain', 'plain']]);
    const rescuer = makeUnit('rescuer1', { x: 0, y: 0 }, {
      stats: { hp: 20, str: 10, mag: 0, def: 5, res: 0, spd: 8, skl: 5, lck: 3, mov: 6, cha: 0, wil: 0 },
    });
    const ally = makeUnit('ally1', { x: 1, y: 0 }, { classId: 'lord' });

    setupStore([rescuer, ally], map);

    useGameStore.getState().selectUnit('rescuer1');
    useGameStore.getState().clickTile({ x: 0, y: 0 });
    useGameStore.getState().startRescueTargeting();

    expect(useGameStore.getState().playerAction).toBe('rescue_target');

    useGameStore.getState().confirmRescue('ally1');

    const state = useGameStore.getState();
    const rAfter = state.units.get('rescuer1')!;
    const aAfter = state.units.get('ally1')!;

    // STR halved: 10 → 10 - 5 = 5
    expect(rAfter.stats.str).toBe(5);
    // SPD halved: 8 → 8 - 4 = 4
    expect(rAfter.stats.spd).toBe(4);
    // MOV: max(1, 6-2) = 4
    expect(rAfter.stats.mov).toBe(4);
    // Original stats saved
    expect(rAfter.originalStats?.str).toBe(10);
    expect(rAfter.carriedUnitId).toBe('ally1');
    expect(aAfter.isCarried).toBe(true);
    expect(rAfter.hasActed).toBe(true);
  });
});

describe('Drop action', () => {
  beforeEach(() => {
    useGameStore.setState(useGameStore.getInitialState());
  });

  it('restores original stats after dropping', () => {
    const map = makeMap([['plain', 'plain', 'plain']]);
    const rescuer = makeUnit('rescuer1', { x: 0, y: 0 }, {
      stats: { hp: 20, str: 5, mag: 0, def: 5, res: 0, spd: 4, skl: 5, lck: 3, mov: 4, cha: 0, wil: 0 },
      originalStats: { hp: 20, str: 10, mag: 0, def: 5, res: 0, spd: 8, skl: 5, lck: 3, mov: 6, cha: 0, wil: 0 },
      carriedUnitId: 'ally1',
    });
    const ally = makeUnit('ally1', { x: 0, y: 0 }, { isCarried: true });

    // Setup: place rescuer on map, ally is carried (not on map)
    const unitMap = new Map<string, Unit>();
    const tiles = map.tiles.map((row) => row.map((t) => ({ ...t })));
    unitMap.set('rescuer1', rescuer);
    unitMap.set('ally1', ally);
    tiles[0][0].occupantId = 'rescuer1';

    useGameStore.setState({
      units: unitMap,
      gameMap: { ...map, tiles },
      currentPhase: 'player_phase',
      playerAction: 'idle',
      selectedUnitId: null,
      pendingPosition: null,
    });

    useGameStore.getState().selectUnit('rescuer1');
    useGameStore.getState().clickTile({ x: 0, y: 0 });
    useGameStore.getState().startDropTargeting();

    expect(useGameStore.getState().playerAction).toBe('drop_target');

    useGameStore.getState().confirmDrop({ x: 1, y: 0 });

    const state = useGameStore.getState();
    const rAfter = state.units.get('rescuer1')!;
    const aAfter = state.units.get('ally1')!;

    // Stats restored
    expect(rAfter.stats.str).toBe(10);
    expect(rAfter.stats.spd).toBe(8);
    expect(rAfter.stats.mov).toBe(6);
    expect(rAfter.originalStats).toBeUndefined();
    expect(rAfter.carriedUnitId).toBeUndefined();
    // Dropped unit placed and can't act
    expect(aAfter.isCarried).toBe(false);
    expect(aAfter.hasActed).toBe(true);
    expect(aAfter.position).toEqual({ x: 1, y: 0 });
  });
});

describe('Lockpick action', () => {
  beforeEach(() => {
    useGameStore.setState(useGameStore.getInitialState());
  });

  it('opens adjacent chest', () => {
    const map = makeMap([['plain', 'chest']]);
    const thief = makeUnit('thief1', { x: 0, y: 0 }, {
      classId: 'thief',
      skills: ['lockpick_skill'],
    });

    const chestReward: VillageReward = { type: 'weapon', weaponId: 'steel_sword', dialogue: 'Found a sword!', speaker: 'Narrator' };
    const chestData: ChestData = { position: { x: 1, y: 0 }, reward: chestReward };

    setupStore([thief], map);
    useGameStore.setState({
      chapterData: {
        id: 'ch_test', name: 'Test', chapterNumber: 1,
        mapWidth: 2, mapHeight: 1,
        terrain: [['plain', 'chest']],
        playerUnits: [], enemyUnits: [],
        objective: { type: 'rout', description: 'Defeat all enemies' },
        chests: [chestData],
      },
    });

    useGameStore.getState().selectUnit('thief1');
    useGameStore.getState().clickTile({ x: 0, y: 0 });
    useGameStore.getState().lockpick();

    const state = useGameStore.getState();
    expect(state.openedChests.has('1,0')).toBe(true);
    expect(state.units.get('thief1')!.hasActed).toBe(true);
    expect(state.villageReward).toEqual(chestReward);
  });

  it('opens adjacent door (terrain → indoor)', () => {
    const map = makeMap([['plain', 'door']]);
    const thief = makeUnit('thief1', { x: 0, y: 0 }, {
      classId: 'thief',
      skills: ['lockpick_skill'],
    });

    setupStore([thief], map);

    useGameStore.getState().selectUnit('thief1');
    useGameStore.getState().clickTile({ x: 0, y: 0 });
    useGameStore.getState().lockpick();

    const state = useGameStore.getState();
    expect(state.gameMap.tiles[0][1].terrain).toBe('indoor');
    expect(state.units.get('thief1')!.hasActed).toBe(true);
  });

  it('non-thief cannot lockpick', () => {
    const map = makeMap([['plain', 'chest']]);
    const fighter = makeUnit('fighter1', { x: 0, y: 0 }, { classId: 'fighter' });

    setupStore([fighter], map);

    useGameStore.getState().selectUnit('fighter1');
    useGameStore.getState().clickTile({ x: 0, y: 0 });
    useGameStore.getState().lockpick();

    // Should not have opened the chest
    expect(useGameStore.getState().openedChests.has('1,0')).toBe(false);
  });
});
