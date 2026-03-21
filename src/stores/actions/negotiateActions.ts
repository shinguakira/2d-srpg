import type { GameState, GameActions } from '../gameStoreTypes';
import { useCampaignStore } from '../campaignStore';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

/**
 * Check if the negotiate action is available.
 * Conditions: selected unit is Ren (isLord), adjacent to a boss,
 * boss HP ≤ 50%, party AWR average ≥ 70.
 */
export function checkNegotiateCondition(get: Get): { available: boolean; bossId: string | null } {
  const { selectedUnitId, units, pendingPosition } = get();
  if (!selectedUnitId) return { available: false, bossId: null };

  const unit = units.get(selectedUnitId);
  if (!unit || !unit.isLord) return { available: false, bossId: null };

  const pos = pendingPosition ?? unit.position;

  // Find adjacent boss with HP ≤ 50%
  const adjacentOffsets = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }];
  let targetBossId: string | null = null;

  for (const offset of adjacentOffsets) {
    const adjX = pos.x + offset.x;
    const adjY = pos.y + offset.y;
    for (const u of units.values()) {
      if (u.position.x === adjX && u.position.y === adjY &&
          u.faction === 'enemy' && u.aiBehavior?.type === 'boss') {
        if (u.currentHp / u.stats.hp <= 0.5) {
          targetBossId = u.id;
          break;
        }
      }
    }
    if (targetBossId) break;
  }
  if (!targetBossId) return { available: false, bossId: null };

  // Check party AWR average ≥ 70
  let awrSum = 0;
  let playerCount = 0;
  for (const u of units.values()) {
    if (u.faction === 'player' && u.currentHp > 0) {
      awrSum += u.metaStats.awr;
      playerCount++;
    }
  }
  const awrAvg = playerCount > 0 ? awrSum / playerCount : 0;
  if (awrAvg < 70) return { available: false, bossId: null };

  return { available: true, bossId: targetBossId };
}

/**
 * Execute the negotiate action: boss stands down, chapter ends peacefully.
 */
export function negotiate(get: Get, set: Set): void {
  const { available, bossId } = checkNegotiateCondition(get);
  if (!available || !bossId) return;

  const { units } = get();
  const boss = units.get(bossId);
  if (!boss) return;

  // Set campaign flag (persists across saves)
  const campaignState = useCampaignStore.getState();
  useCampaignStore.setState({
    campaignFlags: { ...campaignState.campaignFlags, system_negotiated: true },
  });

  // Remove boss from map (stands down)
  const newUnits = new Map(units);
  newUnits.delete(bossId);

  // Show dialogue
  set({
    units: newUnits,
    eventDialogue: {
      lines: [
        { speaker: boss.name, text: 'I... I will stand down.' },
        { speaker: 'Ren', text: 'We don\'t have to fight. There\'s another way.' },
      ],
    },
    eventDialogueLineIndex: 0,
    playerAction: 'idle',
  });
}
