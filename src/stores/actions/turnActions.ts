import type { Unit } from '../../core/types';
import type { GameState, GameActions } from '../gameStoreTypes';
import { IDLE_RESET } from '../helpers/constants';
import { ENEMY_UNITS } from '../../data/units';
import { refreshDangerZone } from '../helpers/dangerZoneHelpers';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function endPlayerTurn(get: Get, set: Set) {
  const { currentPhase } = get();
  if (currentPhase !== 'player_phase') return;

  // Deselect everything
  set({
    ...IDLE_RESET,
    phaseBanner: 'enemy_phase',
  });
}

export function dismissPhaseBanner(get: Get, set: Set) {
  const { phaseBanner, units, gameMap } = get();

  if (phaseBanner === 'enemy_phase') {
    const { currentTurn, chapterData } = get();

    // Fort/throne healing for enemy units at start of enemy phase
    const newEnemyUnits = new Map(units);
    const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));

    for (const [id, unit] of newEnemyUnits) {
      if (unit.faction === 'enemy' && unit.currentHp < unit.stats.hp) {
        const tile = newTiles[unit.position.y]?.[unit.position.x];
        if (tile && (tile.terrain === 'fort' || tile.terrain === 'throne')) {
          const heal = Math.max(1, Math.floor(unit.stats.hp * 0.1));
          const newHp = Math.min(unit.stats.hp, unit.currentHp + heal);
          newEnemyUnits.set(id, { ...unit, currentHp: newHp });
        }
      }
    }

    // Spawn reinforcements for this turn
    let reinforcementMessage: string | null = null;
    if (chapterData?.reinforcements) {
      for (const wave of chapterData.reinforcements) {
        if (wave.turn === currentTurn) {
          for (const placement of wave.units) {
            const template = ENEMY_UNITS[placement.unitId];
            if (!template) continue;
            // Don't spawn if tile is occupied
            if (newTiles[placement.position.y]?.[placement.position.x]?.occupantId) continue;
            const spawnedUnit: Unit = {
              ...template,
              position: { ...placement.position },
              startPosition: { ...placement.position },
              stats: { ...template.stats },
              equippedWeapon: { ...template.equippedWeapon },
              inventory: template.inventory.map((w) => ({ ...w })),
              items: template.items.map((i) => ({ ...i, effect: { ...i.effect } })),
            };
            newEnemyUnits.set(spawnedUnit.id, spawnedUnit);
            newTiles[placement.position.y][placement.position.x].occupantId = spawnedUnit.id;
          }
          if (wave.message) reinforcementMessage = wave.message;
        }
      }
    }

    // Check if there are any enemies left
    let hasEnemy = false;
    for (const u of newEnemyUnits.values()) {
      if (u.faction === 'enemy') { hasEnemy = true; break; }
    }
    if (hasEnemy) {
      set({
        phaseBanner: null,
        currentPhase: 'enemy_phase',
        units: newEnemyUnits,
        gameMap: { ...gameMap, tiles: newTiles },
        reinforcementMessage,
      });
      get().computeEnemyActions();
    } else {
      set({ phaseBanner: null, currentPhase: 'game_over', units: newEnemyUnits, gameMap: { ...gameMap, tiles: newTiles } });
    }
  } else if (phaseBanner === 'player_phase') {
    // Reset player units' hasActed + fort/throne healing
    const newUnits = new Map(get().units);
    for (const [id, unit] of newUnits) {
      if (unit.faction === 'player') {
        let updated = unit;
        if (unit.hasActed) {
          updated = { ...updated, hasActed: false };
        }
        // Fort/throne healing at start of player phase
        if (unit.currentHp < unit.stats.hp) {
          const tile = gameMap.tiles[unit.position.y]?.[unit.position.x];
          if (tile && (tile.terrain === 'fort' || tile.terrain === 'throne')) {
            const heal = Math.max(1, Math.floor(unit.stats.hp * 0.1));
            const newHp = Math.min(unit.stats.hp, unit.currentHp + heal);
            updated = { ...updated, currentHp: newHp };
          }
        }
        if (updated !== unit) {
          newUnits.set(id, updated);
        }
      }
    }
    set({
      phaseBanner: null,
      currentPhase: 'player_phase',
      units: newUnits,
    });
    // Refresh danger zone after enemy turn (enemies may have moved)
    refreshDangerZone(get, set);
  }
}
