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

describe('Dance action', () => {
  beforeEach(() => {
    useGameStore.setState(useGameStore.getInitialState());
  });

  it('refreshes ally (hasActed → false) and grants 20 EXP to dancer', () => {
    const map = makeMap([['plain', 'plain', 'plain']]);
    const dancer = makeUnit(
      'dancer1',
      { x: 0, y: 0 },
      {
        classId: 'dancer',
        skills: ['dance'],
        equippedWeapon: makeWeapon({ id: 'knife', name: 'Knife', type: 'knife' }),
        inventory: [makeWeapon({ id: 'knife', name: 'Knife', type: 'knife' })],
      },
    );
    const ally = makeUnit(
      'ally1',
      { x: 1, y: 0 },
      {
        hasActed: true,
      },
    );

    setupStore([dancer, ally], map);

    // Select dancer, move to (0,0), dance ally
    useGameStore.getState().selectUnit('dancer1');
    useGameStore.getState().clickTile({ x: 0, y: 0 }); // action menu
    useGameStore.getState().startDanceTargeting();

    const state1 = useGameStore.getState();
    expect(state1.playerAction).toBe('dance_target');
    expect(state1.danceableTiles.size).toBe(1);

    useGameStore.getState().confirmDance('ally1');

    const state2 = useGameStore.getState();
    const dancerAfter = state2.units.get('dancer1')!;
    const allyAfter = state2.units.get('ally1')!;
    expect(dancerAfter.hasActed).toBe(true);
    expect(dancerAfter.exp).toBe(20);
    expect(allyAfter.hasActed).toBe(false); // refreshed!
  });

  it('can only dance adjacent allies that have already acted', () => {
    const map = makeMap([['plain', 'plain', 'plain']]);
    const dancer = makeUnit(
      'dancer1',
      { x: 0, y: 0 },
      {
        classId: 'dancer',
        skills: ['dance'],
      },
    );
    const ally = makeUnit(
      'ally1',
      { x: 1, y: 0 },
      {
        hasActed: false, // hasn't acted yet
      },
    );

    setupStore([dancer, ally], map);

    useGameStore.getState().selectUnit('dancer1');
    useGameStore.getState().clickTile({ x: 0, y: 0 });
    useGameStore.getState().startDanceTargeting();

    // Should not enter dance_target since no valid targets
    expect(useGameStore.getState().playerAction).toBe('action_menu');
  });

  it('non-dancer unit cannot dance', () => {
    const map = makeMap([['plain', 'plain', 'plain']]);
    const fighter = makeUnit(
      'fighter1',
      { x: 0, y: 0 },
      {
        classId: 'fighter',
      },
    );
    const ally = makeUnit(
      'ally1',
      { x: 1, y: 0 },
      {
        hasActed: true,
      },
    );

    setupStore([fighter, ally], map);

    useGameStore.getState().selectUnit('fighter1');
    useGameStore.getState().clickTile({ x: 0, y: 0 });
    useGameStore.getState().startDanceTargeting();

    // Should not enter dance_target
    expect(useGameStore.getState().playerAction).toBe('action_menu');
  });
});

describe('Steal action', () => {
  beforeEach(() => {
    useGameStore.setState(useGameStore.getInitialState());
  });

  it('transfers first item from enemy to thief', () => {
    const map = makeMap([['plain', 'plain', 'plain']]);
    const vulnerary: ConsumableItem = {
      id: 'vulnerary',
      name: 'Vulnerary',
      type: 'consumable',
      uses: 3,
      maxUses: 3,
      effect: { kind: 'heal', amount: 10 },
    };
    const thief = makeUnit(
      'thief1',
      { x: 0, y: 0 },
      {
        classId: 'thief',
        skills: ['steal'],
        stats: {
          hp: 18,
          str: 4,
          mag: 0,
          def: 3,
          res: 1,
          spd: 10,
          skl: 6,
          lck: 5,
          mov: 6,
          cha: 0,
          wil: 0,
        },
      },
    );
    const enemy = makeUnit(
      'enemy1',
      { x: 1, y: 0 },
      {
        faction: 'enemy',
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 0,
          spd: 7,
          skl: 5,
          lck: 3,
          mov: 3,
          cha: 0,
          wil: 0,
        },
        items: [vulnerary],
      },
    );

    setupStore([thief, enemy], map);

    useGameStore.getState().selectUnit('thief1');
    useGameStore.getState().clickTile({ x: 0, y: 0 });
    useGameStore.getState().startStealTargeting();

    const state1 = useGameStore.getState();
    expect(state1.playerAction).toBe('steal_target');
    expect(state1.stealableTiles.size).toBe(1);

    useGameStore.getState().confirmSteal('enemy1');

    const state2 = useGameStore.getState();
    const thiefAfter = state2.units.get('thief1')!;
    const enemyAfter = state2.units.get('enemy1')!;

    expect(thiefAfter.items).toHaveLength(1);
    expect(thiefAfter.items[0].id).toBe('vulnerary');
    expect(enemyAfter.items).toHaveLength(0);
    expect(thiefAfter.hasActed).toBe(false); // steal does not end the turn
    expect(thiefAfter.exp).toBe(15);
    // After steal, returns to action menu so thief can still act
    expect(state2.playerAction).toBe('action_menu');
  });

  it('requires SPD > enemy SPD', () => {
    const map = makeMap([['plain', 'plain', 'plain']]);
    const vulnerary: ConsumableItem = {
      id: 'vulnerary',
      name: 'Vulnerary',
      type: 'consumable',
      uses: 3,
      maxUses: 3,
      effect: { kind: 'heal', amount: 10 },
    };
    const thief = makeUnit(
      'thief1',
      { x: 0, y: 0 },
      {
        classId: 'thief',
        skills: ['steal'],
        stats: {
          hp: 18,
          str: 4,
          mag: 0,
          def: 3,
          res: 1,
          spd: 5,
          skl: 6,
          lck: 5,
          mov: 6,
          cha: 0,
          wil: 0,
        },
      },
    );
    const enemy = makeUnit(
      'enemy1',
      { x: 1, y: 0 },
      {
        faction: 'enemy',
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 0,
          spd: 7,
          skl: 5,
          lck: 3,
          mov: 3,
          cha: 0,
          wil: 0,
        },
        items: [vulnerary],
      },
    );

    setupStore([thief, enemy], map);

    useGameStore.getState().selectUnit('thief1');
    useGameStore.getState().clickTile({ x: 0, y: 0 });
    useGameStore.getState().startStealTargeting();

    // SPD 5 <= enemy SPD 7 — can't steal
    expect(useGameStore.getState().playerAction).toBe('action_menu');
  });

  it('cannot steal equipped weapons (only consumable items)', () => {
    const map = makeMap([['plain', 'plain', 'plain']]);
    const thief = makeUnit(
      'thief1',
      { x: 0, y: 0 },
      {
        classId: 'thief',
        skills: ['steal'],
        stats: {
          hp: 18,
          str: 4,
          mag: 0,
          def: 3,
          res: 1,
          spd: 10,
          skl: 6,
          lck: 5,
          mov: 6,
          cha: 0,
          wil: 0,
        },
      },
    );
    const enemy = makeUnit(
      'enemy1',
      { x: 1, y: 0 },
      {
        faction: 'enemy',
        stats: {
          hp: 20,
          str: 8,
          mag: 0,
          def: 5,
          res: 0,
          spd: 7,
          skl: 5,
          lck: 3,
          mov: 3,
          cha: 0,
          wil: 0,
        },
        items: [], // no consumable items, just equipped weapon
      },
    );

    setupStore([thief, enemy], map);

    useGameStore.getState().selectUnit('thief1');
    useGameStore.getState().clickTile({ x: 0, y: 0 });
    useGameStore.getState().startStealTargeting();

    // No items to steal
    expect(useGameStore.getState().playerAction).toBe('action_menu');
  });
});
