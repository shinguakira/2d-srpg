import type { GameState, GameActions } from '../gameStoreTypes';
import { IDLE_RESET } from '../helpers/constants';
import { deriveFacing } from '../helpers/facingHelpers';
import { isBossDefeated, allPlayersDone } from '../helpers/mapHelpers';
import { useCampaignStore } from '../campaignStore';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

export function seize(get: Get, set: Set) {
  const { selectedUnitId, pendingPosition, units, gameMap, chapterData } = get();
  if (!selectedUnitId || !pendingPosition || !chapterData) return;

  const unit = units.get(selectedUnitId);
  if (!unit || !unit.isLord) return;

  // Verify on seize position
  if (!chapterData.seizePosition) return;
  if (
    pendingPosition.x !== chapterData.seizePosition.x ||
    pendingPosition.y !== chapterData.seizePosition.y
  )
    return;

  // Verify boss is defeated
  if (!isBossDefeated(units)) return;

  // Move unit to pending position and trigger victory
  const newUnits = new Map(units);
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));
  newTiles[unit.position.y][unit.position.x].occupantId = null;
  newTiles[pendingPosition.y][pendingPosition.x].occupantId = selectedUnitId;

  const facing = deriveFacing(unit.position, pendingPosition);
  newUnits.set(selectedUnitId, {
    ...unit,
    position: { ...pendingPosition },
    hasActed: true,
    facing,
  });

  // Check if Ren has Final Save Crystal — set campaign flag
  if (unit.items.some((i) => i.effect.kind === 'key_item' && i.id === 'final_save_crystal')) {
    const campaignState = useCampaignStore.getState();
    useCampaignStore.setState({
      campaignFlags: { ...campaignState.campaignFlags, final_save_crystal_used: true },
    });
  }

  set({
    ...IDLE_RESET,
    units: newUnits,
    gameMap: { ...gameMap, tiles: newTiles },
    currentPhase: 'game_over',
  });
}

/**
 * Escape action: Lord or any unit on the escape tile is removed from the map (safe).
 * If Ren (Lord) escapes, chapter ends in victory — all remaining units auto-escape.
 */
export function escape(get: Get, set: Set) {
  const { selectedUnitId, pendingPosition, units, gameMap, chapterData, escapedUnitIds } = get();
  if (!selectedUnitId || !pendingPosition || !chapterData) return;
  if (chapterData.objective.type !== 'escape' || !chapterData.objective.escapePosition) return;

  const escPos = chapterData.objective.escapePosition;
  if (pendingPosition.x !== escPos.x || pendingPosition.y !== escPos.y) return;

  const unit = units.get(selectedUnitId);
  if (!unit || unit.faction !== 'player') return;

  // Remove unit from map
  const newUnits = new Map(units);
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));
  newTiles[unit.position.y][unit.position.x].occupantId = null;
  newTiles[pendingPosition.y][pendingPosition.x].occupantId = null;
  newUnits.delete(selectedUnitId);

  const newEscaped = new Set(escapedUnitIds);
  newEscaped.add(selectedUnitId);

  // If Lord escapes, chapter ends — all remaining player units auto-escape
  if (unit.isLord) {
    for (const [id, u] of newUnits) {
      if (u.faction === 'player') {
        newEscaped.add(id);
        newTiles[u.position.y][u.position.x].occupantId = null;
        newUnits.delete(id);
      }
    }
    set({
      ...IDLE_RESET,
      units: newUnits,
      gameMap: { ...gameMap, tiles: newTiles },
      escapedUnitIds: newEscaped,
      currentPhase: 'game_over',
    });
    return;
  }

  set({
    ...IDLE_RESET,
    units: newUnits,
    gameMap: { ...gameMap, tiles: newTiles },
    escapedUnitIds: newEscaped,
  });

  // Auto end turn if all remaining player units have acted
  if (allPlayersDone(newUnits)) {
    get().endPlayerTurn();
  }
}
