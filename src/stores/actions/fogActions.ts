import type { GameState, GameActions } from '../gameStoreTypes';
import { calculateVisibleTiles, updateFogMap, initializeFogMap } from '../../core/fogOfWar';
import type { Unit } from '../../core/types';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

/** Recalculate fog of war visibility after any unit movement or phase change. */
export function recalculateFog(get: Get, set: Set) {
  const { fogOfWar, units, gameMap, fogMap, torchEffects, visibleTiles: oldVisible } = get();
  if (!fogOfWar) return;

  const playerUnits: Unit[] = [];
  for (const u of units.values()) {
    if (u.faction === 'player' && !u.isCarried) playerUnits.push(u);
  }

  const { weather } = get();
  const visibleTiles = calculateVisibleTiles(playerUnits, gameMap, torchEffects, weather);
  const newFogMap = updateFogMap(fogMap, visibleTiles, gameMap);

  // Detect tiles that just became visible (for reveal flash animation)
  const newlyVisible = new Set<string>();
  for (const key of visibleTiles) {
    if (!oldVisible.has(key)) newlyVisible.add(key);
  }

  set({ visibleTiles, fogMap: newFogMap });

  if (newlyVisible.size > 0) {
    set({ fogRevealTiles: newlyVisible });
    setTimeout(() => { set({ fogRevealTiles: new Set<string>() }); }, 500);
  }
}

/** Use a torch item on the selected unit: +5 vision for 3 turns. */
export function useTorch(get: Get, set: Set) {
  const { selectedUnitId, units, fogOfWar } = get();
  if (!fogOfWar || !selectedUnitId) return;

  const unit = units.get(selectedUnitId);
  if (!unit) return;

  // Find and consume torch item
  const torchIdx = unit.items.findIndex((i) => i.effect.kind === 'torch' && i.uses > 0);
  if (torchIdx === -1) return;

  const newItems = [...unit.items];
  const torch = newItems[torchIdx];
  if (torch.uses <= 1) {
    newItems.splice(torchIdx, 1);
  } else {
    newItems[torchIdx] = { ...torch, uses: torch.uses - 1 };
  }

  const newUnits = new Map(units);
  newUnits.set(selectedUnitId, { ...unit, items: newItems, hasActed: true });
  set({ units: newUnits });

  // Set torch effect
  const torchEffects = new Map(get().torchEffects);
  torchEffects.set(selectedUnitId, 3);
  set({ torchEffects });

  // Recalculate fog
  recalculateFog(get, set);
}

/** Decrement torch turn counters at start of player phase. Remove expired ones. */
export function decrementTorches(get: Get, set: Set) {
  const { torchEffects } = get();
  if (torchEffects.size === 0) return;

  const newEffects = new Map<string, number>();
  for (const [uid, turns] of torchEffects) {
    if (turns > 1) newEffects.set(uid, turns - 1);
  }
  set({ torchEffects: newEffects });
}

/** Initialize fog of war state from chapter config. */
export function initFog(get: Get, set: Set) {
  const { chapterData, units, gameMap } = get();
  if (!chapterData?.fogOfWar) {
    set({ fogOfWar: false, fogMap: new Map(), visibleTiles: new Set(), torchEffects: new Map() });
    return;
  }

  const playerUnits: Unit[] = [];
  for (const u of units.values()) {
    if (u.faction === 'player' && !u.isCarried) playerUnits.push(u);
  }

  const { weather } = get();
  const { fogMap, visibleTiles } = initializeFogMap(gameMap, playerUnits, undefined, weather);
  set({ fogOfWar: true, fogMap, visibleTiles, torchEffects: new Map() });
}
