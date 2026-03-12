import type { GameState, GameActions } from '../gameStoreTypes';
import { IDLE_RESET } from '../helpers/constants';
import { deriveFacing } from '../helpers/facingHelpers';
import { isBossDefeated } from '../helpers/mapHelpers';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function seize(get: Get, set: Set) {
  const { selectedUnitId, pendingPosition, units, gameMap, chapterData } = get();
  if (!selectedUnitId || !pendingPosition || !chapterData) return;

  const unit = units.get(selectedUnitId);
  if (!unit || !unit.isLord) return;

  // Verify on seize position
  if (!chapterData.seizePosition) return;
  if (pendingPosition.x !== chapterData.seizePosition.x || pendingPosition.y !== chapterData.seizePosition.y) return;

  // Verify boss is defeated
  if (!isBossDefeated(units)) return;

  // Move unit to pending position and trigger victory
  const newUnits = new Map(units);
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));
  newTiles[unit.position.y][unit.position.x].occupantId = null;
  newTiles[pendingPosition.y][pendingPosition.x].occupantId = selectedUnitId;

  const facing = deriveFacing(unit.position, pendingPosition);
  newUnits.set(selectedUnitId, { ...unit, position: { ...pendingPosition }, hasActed: true, facing });

  set({
    ...IDLE_RESET,
    units: newUnits,
    gameMap: { ...gameMap, tiles: newTiles },
    currentPhase: 'game_over',
  });
}
