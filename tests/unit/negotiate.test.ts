import { describe, it, expect } from 'vitest';
import { checkNegotiateCondition, negotiate } from '../../src/stores/actions/negotiateActions';
import { useCampaignStore } from '../../src/stores/campaignStore';
import type { Unit, GameMap, Tile } from '../../src/core/types';
import type { GameState, GameActions } from '../../src/stores/gameStoreTypes';

function makeUnit(overrides: Partial<Unit> = {}): Unit {
  return {
    id: 'ren',
    name: 'Ren',
    classId: 'lord',
    faction: 'player',
    position: { x: 3, y: 3 },
    stats: {
      hp: 30,
      str: 10,
      mag: 5,
      def: 8,
      res: 5,
      spd: 10,
      skl: 10,
      lck: 8,
      mov: 5,
      cha: 0,
      wil: 0,
    },
    currentHp: 30,
    level: 5,
    exp: 0,
    equippedWeapon: {
      id: 'iron_sword',
      name: 'Iron Sword',
      type: 'sword',
      might: 8,
      hit: 90,
      crit: 5,
      weight: 7,
      minRange: 1,
      maxRange: 1,
    },
    inventory: [
      {
        id: 'iron_sword',
        name: 'Iron Sword',
        type: 'sword',
        might: 8,
        hit: 90,
        crit: 5,
        weight: 7,
        minRange: 1,
        maxRange: 1,
      },
    ],
    items: [],
    hasActed: false,
    isLord: true,
    skills: [],
    learnedSkills: [],
    facing: 'down',
    sprite: '',
    metaStats: { awr: 80, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
    ...overrides,
  };
}

function makeBoss(overrides: Partial<Unit> = {}): Unit {
  return {
    id: 'boss1',
    name: 'Boss',
    classId: 'lord',
    faction: 'enemy',
    position: { x: 4, y: 3 },
    stats: {
      hp: 40,
      str: 15,
      mag: 5,
      def: 10,
      res: 5,
      spd: 10,
      skl: 10,
      lck: 5,
      mov: 3,
      cha: 0,
      wil: 0,
    },
    currentHp: 20,
    level: 10,
    exp: 0,
    equippedWeapon: {
      id: 'iron_lance',
      name: 'Iron Lance',
      type: 'lance',
      might: 7,
      hit: 85,
      crit: 0,
      weight: 8,
      minRange: 1,
      maxRange: 1,
    },
    inventory: [
      {
        id: 'iron_lance',
        name: 'Iron Lance',
        type: 'lance',
        might: 7,
        hit: 85,
        crit: 0,
        weight: 8,
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
    aiBehavior: { type: 'boss' },
    metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
    ...overrides,
  };
}

function makeState(overrides: Partial<GameState> = {}): () => GameState & GameActions {
  const units = new Map<string, Unit>();
  const ren = makeUnit();
  const boss = makeBoss();
  // Add more allies with high AWR to meet the 70 threshold
  const ally1 = makeUnit({
    id: 'ally1',
    name: 'Ally1',
    isLord: false,
    position: { x: 2, y: 3 },
    metaStats: { awr: 75, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
  });
  const ally2 = makeUnit({
    id: 'ally2',
    name: 'Ally2',
    isLord: false,
    position: { x: 3, y: 2 },
    metaStats: { awr: 75, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
  });

  units.set('ren', ren);
  units.set('boss1', boss);
  units.set('ally1', ally1);
  units.set('ally2', ally2);

  const base: Partial<GameState> = {
    selectedUnitId: 'ren',
    units,
    pendingPosition: { x: 3, y: 3 },
    eventFlags: new Map(),
    ...overrides,
  };

  return () => base as GameState & GameActions;
}

describe('Negotiate Action', () => {
  describe('checkNegotiateCondition', () => {
    it('returns available when all conditions met', () => {
      const get = makeState();
      const result = checkNegotiateCondition(get);
      expect(result.available).toBe(true);
      expect(result.bossId).toBe('boss1');
    });

    it('returns unavailable when no unit selected', () => {
      const get = makeState({ selectedUnitId: null });
      const result = checkNegotiateCondition(get);
      expect(result.available).toBe(false);
    });

    it('returns unavailable for non-lord unit', () => {
      const units = new Map<string, Unit>();
      const nonLord = makeUnit({ id: 'npc', isLord: false });
      units.set('npc', nonLord);
      units.set('boss1', makeBoss());
      const get = makeState({ selectedUnitId: 'npc', units });
      const result = checkNegotiateCondition(get);
      expect(result.available).toBe(false);
    });

    it('returns unavailable when boss HP > 50%', () => {
      const units = new Map<string, Unit>();
      units.set('ren', makeUnit());
      units.set('boss1', makeBoss({ currentHp: 30 })); // 30/40 = 75%
      units.set(
        'ally1',
        makeUnit({
          id: 'ally1',
          isLord: false,
          position: { x: 2, y: 3 },
          metaStats: { awr: 80, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
        }),
      );
      const get = makeState({ units });
      const result = checkNegotiateCondition(get);
      expect(result.available).toBe(false);
    });

    it('returns unavailable when boss not adjacent', () => {
      const units = new Map<string, Unit>();
      units.set('ren', makeUnit());
      units.set('boss1', makeBoss({ position: { x: 6, y: 6 } })); // far away
      units.set(
        'ally1',
        makeUnit({
          id: 'ally1',
          isLord: false,
          position: { x: 2, y: 3 },
          metaStats: { awr: 80, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
        }),
      );
      const get = makeState({ units });
      const result = checkNegotiateCondition(get);
      expect(result.available).toBe(false);
    });

    it('returns unavailable when party AWR average < 70', () => {
      const units = new Map<string, Unit>();
      units.set(
        'ren',
        makeUnit({ metaStats: { awr: 30, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 } }),
      );
      units.set('boss1', makeBoss());
      units.set(
        'ally1',
        makeUnit({
          id: 'ally1',
          isLord: false,
          position: { x: 2, y: 3 },
          metaStats: { awr: 30, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
        }),
      );
      const get = makeState({ units });
      const result = checkNegotiateCondition(get);
      expect(result.available).toBe(false);
    });
  });

  describe('negotiate', () => {
    it('removes boss and sets negotiation flag on campaign store', () => {
      // Reset campaign store flags
      useCampaignStore.setState({ campaignFlags: {} });

      const get = makeState();
      let state = get() as Partial<GameState>;
      const set = (partial: Partial<GameState>) => {
        state = { ...state, ...partial };
      };

      negotiate(get, set);

      expect(state.units).toBeDefined();
      expect(state.units!.has('boss1')).toBe(false);
      // Flag is on campaignStore, not gameStore eventFlags
      expect(useCampaignStore.getState().campaignFlags.system_negotiated).toBe(true);
    });

    it('shows dialogue when negotiate succeeds', () => {
      const get = makeState();
      let state = get() as Partial<GameState>;
      const set = (partial: Partial<GameState>) => {
        state = { ...state, ...partial };
      };

      negotiate(get, set);

      expect(state.eventDialogue).not.toBeNull();
      expect(state.eventDialogue!.lines.length).toBe(2);
      expect(state.eventDialogueLineIndex).toBe(0);
    });

    it('does nothing when conditions not met', () => {
      const get = makeState({ selectedUnitId: null });
      let setCalled = false;
      const set = () => {
        setCalled = true;
      };

      negotiate(get, set as any);

      expect(setCalled).toBe(false);
    });
  });
});
