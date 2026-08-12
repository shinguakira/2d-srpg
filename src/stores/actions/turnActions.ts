import type { Localized } from '../../i18n';
import type { Unit } from '../../core/types';
import type { GameState, GameActions } from '../gameStoreTypes';
import { IDLE_RESET } from '../helpers/constants';
import { ENEMY_UNITS } from '../../data/units';
import { refreshDangerZone } from '../helpers/dangerZoneHelpers';
import { checkAndFireEvents } from './eventActions';
import { getRenewalHeal } from '../../core/skills';
import { updateTurnMetaStats } from './metaStatActions';
import { decrementTorches, recalculateFog } from './fogActions';
import { getWeatherCrpGain } from '../../core/weather';
import { clampMetaStats } from '../../core/metaStats';
import { processTurnEndSupports } from './supportActions';
import { getBossSelfHeal, advanceWeaponCycle } from '../../core/bossPhase';
import { useCampaignStore } from '../campaignStore';
import { getReinforcementTurnOffset } from '../../core/difficulty';
import { getMapBossEnemyHealRate, getMapBossSpawnRate } from '../actions/mapBossActions';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function endPlayerTurn(get: Get, set: Set) {
  const { currentPhase } = get();
  if (currentPhase !== 'player_phase') return;

  // Process support point gains from adjacency
  processTurnEndSupports(get, set);

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
      if (unit.faction === 'enemy') {
        let updated = unit;
        // Fort/throne healing
        if (updated.currentHp < updated.stats.hp) {
          const tile = newTiles[updated.position.y]?.[updated.position.x];
          if (
            tile &&
            (tile.terrain === 'fort' ||
              tile.terrain === 'throne' ||
              tile.terrain === 'corrupted_fort' ||
              tile.terrain === 'broken_throne')
          ) {
            const heal = Math.max(1, Math.floor(updated.stats.hp * 0.1));
            updated = {
              ...updated,
              currentHp: Math.min(updated.stats.hp, updated.currentHp + heal),
            };
          }
        }
        // Boss self-heal per phase
        const selfHeal = getBossSelfHeal(updated);
        if (selfHeal > 0 && updated.currentHp < updated.stats.hp) {
          updated = {
            ...updated,
            currentHp: Math.min(updated.stats.hp, updated.currentHp + selfHeal),
          };
        }
        // Weapon cycling boss: advance to next weapon
        if (updated.weaponCycleOrder && updated.weaponCycleOrder.length > 0) {
          updated = advanceWeaponCycle(updated);
        }
        if (updated !== unit) {
          newEnemyUnits.set(id, updated);
        }
      }
    }

    // Map boss: heal all enemies based on current phase heal rate
    const { mapBossState } = get();
    if (mapBossState && mapBossState.currentHp > 0) {
      const healRate = getMapBossEnemyHealRate(mapBossState);
      if (healRate > 0) {
        for (const [id, unit] of newEnemyUnits) {
          if (unit.faction === 'enemy' && unit.currentHp > 0 && unit.currentHp < unit.stats.hp) {
            const healAmount = Math.max(1, Math.floor(unit.stats.hp * healRate));
            newEnemyUnits.set(id, {
              ...unit,
              currentHp: Math.min(unit.stats.hp, unit.currentHp + healAmount),
            });
          }
        }
      }
    }

    // Spawn reinforcements for this turn (hard mode: arrive 1 turn earlier)
    // Map boss: spawn rate scales down as map HP drops (fewer spawns in later phases)
    let reinforcementMessage: Localized | null = null;
    const difficulty = useCampaignStore.getState().difficulty;
    const reinforcementOffset = getReinforcementTurnOffset(difficulty);
    const mapBossSpawnRate =
      mapBossState && mapBossState.currentHp > 0 ? getMapBossSpawnRate(mapBossState) : 1; // no map boss = full spawn rate
    if (chapterData?.reinforcements) {
      for (const wave of chapterData.reinforcements) {
        if (wave.turn + reinforcementOffset === currentTurn) {
          for (const placement of wave.units) {
            // Map boss spawn rate: skip spawns probabilistically when rate < 1
            if (mapBossSpawnRate < 1 && Math.random() > mapBossSpawnRate) continue;
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
      if (u.faction === 'enemy') {
        hasEnemy = true;
        break;
      }
    }
    if (hasEnemy) {
      set({
        phaseBanner: null,
        currentPhase: 'enemy_phase',
        units: newEnemyUnits,
        gameMap: { ...gameMap, tiles: newTiles },
        reinforcementMessage,
      });

      // Per-turn meta-stat updates for enemies
      updateTurnMetaStats(get, set, 'enemy');

      // Fire turn-start events (enemy phase = end of player's turn)
      checkAndFireEvents(get, set, { justStartedPhase: 'enemy' });

      // Don't compute enemy actions if event dialogue is showing — useGameLoop will resume
      if (!get().eventDialogue) {
        get().computeEnemyActions();
      }
    } else {
      set({
        phaseBanner: null,
        currentPhase: 'game_over',
        units: newEnemyUnits,
        gameMap: { ...gameMap, tiles: newTiles },
      });
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
          if (
            tile &&
            (tile.terrain === 'fort' ||
              tile.terrain === 'throne' ||
              tile.terrain === 'corrupted_fort' ||
              tile.terrain === 'broken_throne')
          ) {
            const heal = Math.max(1, Math.floor(unit.stats.hp * 0.1));
            const newHp = Math.min(unit.stats.hp, updated.currentHp + heal);
            updated = { ...updated, currentHp: newHp };
          }
        }
        // Renewal skill healing at start of player phase
        const renewalHeal = getRenewalHeal(updated);
        if (renewalHeal > 0 && updated.currentHp < updated.stats.hp) {
          const newHp = Math.min(updated.stats.hp, updated.currentHp + renewalHeal);
          updated = { ...updated, currentHp: newHp };
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

    // Check survive/protect turn-based victory at start of new player phase
    // currentTurn was already incremented in endEnemyTurn, so check if prev turn met the objective
    const { currentTurn, chapterData: cd } = get();
    const objType = cd?.objective.type;
    if ((objType === 'survive' || objType === 'protect') && cd?.objective.turns) {
      // Turn N+1 means N full enemy phases survived
      if (currentTurn > cd.objective.turns) {
        set({ currentPhase: 'game_over' });
        return;
      }
    }

    // Per-turn meta-stat updates (CRP terrain, STA recovery, LOY adjacency, etc.)
    updateTurnMetaStats(get, set, 'player');

    // Weather: check for scheduled weather changes
    const { currentTurn: turn, chapterData: chData } = get();
    if (chData?.weatherChanges) {
      for (const change of chData.weatherChanges) {
        if (change.turn === turn) {
          set({ weather: change.weather });
          if (change.message) {
            // Show as a floating message via reinforcementMessage (reuse existing mechanism)
            set({ reinforcementMessage: change.message });
          }
          break;
        }
      }
    }

    // Weather: corruption storm +1 CRP per turn for all units
    const weatherNow = get().weather;
    const crpGain = getWeatherCrpGain(weatherNow);
    if (crpGain > 0) {
      const crpUnits = new Map(get().units);
      for (const [uid, u] of crpUnits) {
        if (u.faction === 'player' || u.faction === 'enemy') {
          crpUnits.set(uid, {
            ...u,
            metaStats: clampMetaStats({ ...u.metaStats, crp: u.metaStats.crp + crpGain }),
          });
        }
      }
      set({ units: crpUnits });
    }

    // Fog of war: decrement torches and recalculate visibility
    decrementTorches(get, set);
    recalculateFog(get, set);

    // Fire turn-start events for player phase
    checkAndFireEvents(get, set, { justStartedPhase: 'player' });

    // Refresh danger zone after enemy turn (enemies may have moved)
    refreshDangerZone(get, set);
  }
}
