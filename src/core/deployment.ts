import { PLAYER_UNITS } from '../data/units';

/**
 * Compute auto-deploy list: forceDeploy units first, then fill remaining
 * slots from roster in order, skipping dead units in classic mode.
 */
export function computeAutoDeploy(
  forceDeploy: readonly string[],
  roster: readonly string[],
  maxDeploy: number,
  deadUnitIds: readonly string[],
  gameMode: 'classic' | 'casual',
): string[] {
  const deployed = [...forceDeploy];
  for (const uid of roster) {
    if (deployed.length >= maxDeploy) break;
    if (deployed.includes(uid)) continue;
    if (gameMode === 'classic' && deadUnitIds.includes(uid)) continue;
    if (!PLAYER_UNITS[uid]) continue;
    deployed.push(uid);
  }
  return deployed;
}
