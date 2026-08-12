import type { Faction } from '../../core/types';
import { posKey } from '../../core/types';
import {
  evaluateEvents,
  resolveEffects,
  type EventContext,
  type EffectResult,
} from '../../core/events';
import type { GameState, GameActions } from '../gameStoreTypes';
import { refreshDangerZone } from '../helpers/dangerZoneHelpers';
import { ENEMY_UNITS, PLAYER_UNITS } from '../../data/units';
import { ITEMS } from '../../data/items';
import { getManhattanDistance } from '../../core/pathfinding';
import { clampMetaStats } from '../../core/metaStats';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

/**
 * Check for events that should fire and process them.
 * Called from turnActions, movementActions, combatActions, etc.
 */
export function checkAndFireEvents(get: Get, set: Set, overrides: Partial<EventContext>) {
  const { chapterEvents, firedEventIds, eventFlags, units, currentTurn, currentPhase } = get();
  if (chapterEvents.length === 0) return;

  const ctx: EventContext = {
    currentTurn,
    currentPhase,
    units,
    flags: eventFlags,
    ...overrides,
  };

  const fired = evaluateEvents(chapterEvents, firedEventIds, ctx);
  if (fired.length === 0) return;

  // Mark fired events
  const newFired = new Set(firedEventIds);
  for (const event of fired) {
    if (event.once) newFired.add(event.id);
  }

  // Collect all effects from all fired events into a queue
  const effectQueue = fired.map((e) => e.effects);

  set({ firedEventIds: newFired, pendingEffects: effectQueue });

  // Process first batch
  processNextEffectBatch(get, set);
}

/**
 * Process the next batch of effects from the pending queue.
 */
function processNextEffectBatch(get: Get, set: Set) {
  const { pendingEffects } = get();
  if (pendingEffects.length === 0) return;

  const [currentBatch, ...remaining] = pendingEffects;
  const result = resolveEffects(currentBatch);

  set({ pendingEffects: remaining });

  applyEffectResult(get, set, result);
}

/**
 * Apply a resolved EffectResult to the game state.
 */
function applyEffectResult(get: Get, set: Set, result: EffectResult) {
  const { units, gameMap, eventFlags } = get();
  const newUnits = new Map(units);
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));
  let flagsChanged = false;
  const newFlags = new Map(eventFlags);
  const newSpawning = new Set<string>();
  const newRemoving = new Set<string>();
  const newTerrainChanges = new Set<string>();

  // Spawn units
  for (const spawn of result.unitsToSpawn) {
    const template = ENEMY_UNITS[spawn.unitId] ?? PLAYER_UNITS[spawn.unitId];
    if (!template) continue;
    if (newTiles[spawn.position.y]?.[spawn.position.x]?.occupantId) continue;
    const spawnedUnit = {
      ...template,
      faction: spawn.faction as Faction,
      position: { ...spawn.position },
      startPosition: { ...spawn.position },
      stats: { ...template.stats },
      equippedWeapon: { ...template.equippedWeapon },
      inventory: template.inventory.map((w) => ({ ...w })),
      items: template.items.map((i) => ({ ...i, effect: { ...i.effect } })),
    };
    newUnits.set(spawnedUnit.id, spawnedUnit);
    newTiles[spawn.position.y][spawn.position.x].occupantId = spawnedUnit.id;
    newSpawning.add(spawnedUnit.id);
  }

  // Remove units (mark for fade-out, actual removal after animation)
  for (const unitId of result.unitsToRemove) {
    const unit = newUnits.get(unitId);
    if (unit) {
      newTiles[unit.position.y][unit.position.x].occupantId = null;
      newUnits.delete(unitId);
      newRemoving.add(unitId);
    }
  }

  // Recruit units (faction swap to player)
  for (const unitId of result.unitsToRecruit) {
    const unit = newUnits.get(unitId);
    if (unit) {
      newUnits.set(unitId, {
        ...unit,
        faction: 'player',
        hasActed: true,
        aiBehavior: undefined,
        recruitableBy: undefined,
        recruitCondition: undefined,
      });
    }
  }

  // AI changes
  for (const change of result.aiChanges) {
    const unit = newUnits.get(change.unitId);
    if (unit) {
      newUnits.set(change.unitId, { ...unit, aiBehavior: change.behavior });
    }
  }

  // Terrain changes
  for (const change of result.terrainChanges) {
    const tile = newTiles[change.position.y]?.[change.position.x];
    if (tile) {
      newTiles[change.position.y][change.position.x] = { ...tile, terrain: change.terrain };
      newTerrainChanges.add(posKey(change.position));
    }
  }

  // Flag changes
  for (const change of result.flagChanges) {
    newFlags.set(change.key, change.value);
    flagsChanged = true;
  }

  // Give items to units
  for (const give of result.itemsToGive) {
    const unit = newUnits.get(give.unitId);
    const itemTemplate = ITEMS[give.itemId];
    if (unit && itemTemplate) {
      newUnits.set(give.unitId, {
        ...unit,
        items: [...unit.items, { ...itemTemplate }],
      });
    }
  }

  // AWR gain: player units near glitched terrain changes get +3 AWR
  for (const change of result.terrainChanges) {
    if (change.terrain === 'glitched' || change.terrain === 'data_void') {
      const awrGain = change.terrain === 'data_void' ? 5 : 3;
      for (const [uid, u] of newUnits) {
        if (u.faction !== 'player') continue;
        if (getManhattanDistance(u.position, change.position) <= 3) {
          newUnits.set(uid, {
            ...u,
            metaStats: clampMetaStats({ ...u.metaStats, awr: u.metaStats.awr + awrGain }),
          });
        }
      }
    }
  }

  // LOOP expenditure: if event sets flag 'loop_cost', deduct from Shigeru
  for (const change of result.flagChanges) {
    if (change.key === 'loop_cost') {
      const cost = parseInt(change.value, 10);
      if (!isNaN(cost) && cost > 0) {
        const lord = newUnits.get('shigeru');
        if (lord) {
          newUnits.set('shigeru', {
            ...lord,
            metaStats: clampMetaStats({ ...lord.metaStats, loop: lord.metaStats.loop - cost }),
          });
        }
      }
    }
  }

  const stateUpdate: Partial<GameState> = {
    units: newUnits,
    gameMap: { ...gameMap, tiles: newTiles },
  };
  if (flagsChanged) {
    stateUpdate.eventFlags = newFlags;
  }
  if (result.weatherChange) {
    stateUpdate.weather = result.weatherChange;
  }

  // Track animations
  if (newSpawning.size > 0) stateUpdate.spawningUnitIds = newSpawning;
  if (newRemoving.size > 0) stateUpdate.removingUnitIds = newRemoving;
  if (newTerrainChanges.size > 0) stateUpdate.terrainChangePositions = newTerrainChanges;

  // Show dialogue if present — pauses game loop
  if (result.dialogueToShow) {
    stateUpdate.eventDialogue = result.dialogueToShow;
    stateUpdate.eventDialogueLineIndex = 0;
  }

  set(stateUpdate);

  // Clear animation sets after animation duration (500ms)
  if (newSpawning.size > 0 || newRemoving.size > 0 || newTerrainChanges.size > 0) {
    setTimeout(() => {
      set({
        spawningUnitIds: new Set<string>(),
        removingUnitIds: new Set<string>(),
        terrainChangePositions: new Set<string>(),
      });
    }, 500);
  }

  // If no dialogue, continue processing remaining batches
  if (!result.dialogueToShow) {
    processNextEffectBatch(get, set);
  }
  // If dialogue is showing, processing resumes when dismissEventDialogue is called
}

/**
 * Advance the current event dialogue line.
 */
export function advanceEventDialogue(get: Get, set: Set) {
  const { eventDialogue, eventDialogueLineIndex } = get();
  if (!eventDialogue) return;

  if (eventDialogueLineIndex < eventDialogue.lines.length - 1) {
    set({ eventDialogueLineIndex: eventDialogueLineIndex + 1 });
  } else {
    // Dialogue finished — dismiss
    dismissEventDialogue(get, set);
  }
}

/**
 * Dismiss event dialogue and continue processing remaining effects.
 */
export function dismissEventDialogue(get: Get, set: Set) {
  set({ eventDialogue: null, eventDialogueLineIndex: 0 });

  // Continue processing remaining effect batches
  processNextEffectBatch(get, set);

  // If still showing dialogue (from next batch), stop here
  if (get().eventDialogue) return;

  // Refresh danger zone since events may have changed units
  refreshDangerZone(get, set);

  // If we're in enemy phase and enemy actions haven't been computed yet, compute them now
  const { currentPhase, enemyActionIndex, enemyActions } = get();
  if (currentPhase === 'enemy_phase' && enemyActionIndex === -1 && enemyActions.length === 0) {
    get().computeEnemyActions();
  }
}
