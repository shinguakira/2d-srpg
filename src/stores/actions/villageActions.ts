import type { GameState, GameActions } from '../gameStoreTypes';
import { posKey } from '../../core/types';
import { WEAPONS } from '../../data/weapons';
import { IDLE_RESET } from '../helpers/constants';
import { allPlayersDone } from '../helpers/mapHelpers';
import { deriveFacing } from '../helpers/facingHelpers';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function visitVillage(get: Get, set: Set) {
  const { selectedUnitId, pendingPosition, visitedVillages, chapterVillages } = get();
  if (!selectedUnitId || !pendingPosition) return;

  const key = posKey(pendingPosition);
  if (visitedVillages.has(key)) return;

  const village = chapterVillages.find((v) => posKey(v.position) === key);
  if (!village) return;

  set({
    playerAction: 'village_visit',
    villageReward: village.reward,
  });
}

export function dismissVillageReward(get: Get, set: Set) {
  const { selectedUnitId, pendingPosition, villageReward, units, gameMap, visitedVillages } = get();
  if (!selectedUnitId || !pendingPosition || !villageReward) return;

  // Move unit to pending position
  const newUnits = new Map(units);
  const unit = units.get(selectedUnitId)!;
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));
  newTiles[unit.position.y][unit.position.x].occupantId = null;
  newTiles[pendingPosition.y][pendingPosition.x].occupantId = selectedUnitId;

  // Add reward weapon to inventory
  const rewardWeapon = { ...WEAPONS[villageReward.weaponId] };
  const facing = deriveFacing(unit.position, pendingPosition);
  const updatedUnit = {
    ...unit,
    position: { ...pendingPosition },
    hasActed: true,
    facing,
    inventory: [...unit.inventory, rewardWeapon],
  };
  newUnits.set(selectedUnitId, updatedUnit);

  // Mark village as visited
  const newVisited = new Set(visitedVillages);
  newVisited.add(posKey(pendingPosition));

  set({
    ...IDLE_RESET,
    units: newUnits,
    gameMap: { ...gameMap, tiles: newTiles },
    visitedVillages: newVisited,
    villageReward: null,
  });

  // Auto end turn if all player units have acted
  if (allPlayersDone(newUnits)) {
    get().endPlayerTurn();
  }
}
