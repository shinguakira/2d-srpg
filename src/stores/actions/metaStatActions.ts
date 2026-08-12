import type { Faction, MetaStats } from '../../core/types';
import type { GameState, GameActions } from '../gameStoreTypes';
import { IDLE_RESET } from '../helpers/constants';
import { allPlayersDone } from '../helpers/mapHelpers';
import {
  clampMetaStats,
  getTerrainCrpGain,
  getTerrainSyncChange,
  getTerrainStaRecovery,
  shouldCommentOnAnomaly,
} from '../../core/metaStats';
import { getManhattanDistance } from '../../core/pathfinding';
import { useCampaignStore } from '../campaignStore';

type Get = () => GameState & GameActions;
type Set = (partial: Partial<GameState>) => void;

// ===== Per-Turn Meta-Stat Updates =====

/** Canned remarks for INS >= 30 units standing next to blighted ground */
const ANOMALY_LINES: Record<string, string> = {
  shigeru: "The ground here is wrong. My father's sword is warm against my back.",
  lisette: 'The blight is measurable here. Appalling, and fascinating.',
  gareth: 'Something is off about this spot. My skin is crawling.',
  mirelle: 'I can feel it seeping in. Stand somewhere else, please.',
  akira: 'Stay sharp. The ground here is not right.',
  halvar: 'I have seen ground like this before. On the other side of the border.',
};
const DEFAULT_ANOMALY_LINE = 'Something feels... wrong about this place.';

/** Apply terrain-based meta-stat changes for all units of a faction at phase start */
export function updateTurnMetaStats(get: Get, set: Set, faction: Faction) {
  const { units, gameMap, floatingNumbers, eventFlags } = get();
  const newUnits = new Map(units);
  const newFloats = [...floatingNumbers];
  const newFlags = new Map(eventFlags);
  let corruptedUnitId: string | null = null;
  let anomalyDialogue: { speaker: string; text: string } | null = null;

  // Find Shigeru's position for LOY adjacency
  let lordPos: { x: number; y: number } | null = null;
  for (const u of units.values()) {
    if (u.id === 'shigeru' && u.faction === 'player') {
      lordPos = u.position;
      break;
    }
  }

  for (const [id, unit] of newUnits) {
    if (unit.faction !== faction) continue;
    if (unit.isCarried) continue;

    const tile = gameMap.tiles[unit.position.y]?.[unit.position.x];
    if (!tile) continue;

    const oldMeta = unit.metaStats;
    let meta: MetaStats = { ...oldMeta };

    // CRP from terrain
    const crpGain = getTerrainCrpGain(tile.terrain);
    if (crpGain > 0) {
      meta.crp += crpGain;
      addFloat(newFloats, unit.position.x, unit.position.y, `CRP +${crpGain}`, '#a855f7');
    }

    // SYNC from terrain
    const syncChange = getTerrainSyncChange(tile.terrain);
    if (syncChange !== 0) {
      meta.sync += syncChange;
      const sign = syncChange > 0 ? '+' : '';
      addFloat(newFloats, unit.position.x, unit.position.y, `SYNC ${sign}${syncChange}`, '#22c55e');
    }

    // STA recovery from terrain
    const staRecovery = getTerrainStaRecovery(tile.terrain);
    if (staRecovery < 0 && meta.sta > 0) {
      meta.sta += staRecovery;
      addFloat(newFloats, unit.position.x, unit.position.y, `STA ${staRecovery}`, '#f97316');
    }

    // LOY +2 if adjacent to Shigeru (player phase only)
    if (faction === 'player' && lordPos && id !== 'shigeru') {
      const dist = getManhattanDistance(unit.position, lordPos);
      if (dist <= 1) {
        meta.loy += 2;
        addFloat(newFloats, unit.position.x, unit.position.y, 'LOY +2', '#eab308');
      }
    }

    // AWR +2 if adjacent to glitched tile
    let adjacentToGlitch = false;
    if (faction === 'player') {
      const dirs = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
      ];
      for (const d of dirs) {
        const adj = { x: unit.position.x + d.x, y: unit.position.y + d.y };
        const adjTile = gameMap.tiles[adj.y]?.[adj.x];
        if (adjTile?.terrain === 'glitched') {
          meta.awr += 2;
          addFloat(newFloats, unit.position.x, unit.position.y, 'AWR +2', '#3b82f6');
          adjacentToGlitch = true;
          break; // only +2 once even if multiple adjacent glitched tiles
        }
      }
    }

    // AWR ≥ 30: comment on adjacent anomaly (once per unit per chapter)
    if (adjacentToGlitch && shouldCommentOnAnomaly(meta.awr)) {
      const flagKey = `awr_comment_${id}`;
      if (!newFlags.has(flagKey) && !anomalyDialogue) {
        newFlags.set(flagKey, 'true');
        anomalyDialogue = {
          speaker: unit.name,
          text: ANOMALY_LINES[id] ?? DEFAULT_ANOMALY_LINE,
        };
      }
    }

    meta = clampMetaStats(meta);

    // Check CRP >= 100 → corruption event
    if (meta.crp >= 100 && unit.faction === 'player') {
      corruptedUnitId = id;
    }

    const changed =
      meta.awr !== oldMeta.awr ||
      meta.loop !== oldMeta.loop ||
      meta.sync !== oldMeta.sync ||
      meta.loy !== oldMeta.loy ||
      meta.crp !== oldMeta.crp ||
      meta.sta !== oldMeta.sta;
    if (changed) {
      newUnits.set(id, { ...unit, metaStats: meta });
    }
  }

  const stateUpdate: Partial<GameState> = {
    units: newUnits,
    floatingNumbers: newFloats,
    eventFlags: newFlags,
  };
  if (anomalyDialogue) {
    stateUpdate.eventDialogue = {
      lines: [{ speaker: anomalyDialogue.speaker, text: anomalyDialogue.text }],
    };
    stateUpdate.eventDialogueLineIndex = 0;
  }
  set(stateUpdate);

  // Handle corruption event after state update
  if (corruptedUnitId) {
    handleCorruptionEvent(get, set, corruptedUnitId);
  }
}

// ===== STA Tracking =====

/** STA +1 per tile moved */
export function applyMovementSta(get: Get, set: Set, unitId: string, tilesMoved: number) {
  if (tilesMoved <= 0) return;
  applyStaChange(get, set, unitId, tilesMoved);
}

/** STA +3 per attack */
export function applyCombatSta(get: Get, set: Set, unitId: string) {
  applyStaChange(get, set, unitId, 3);
}

/** STA +2 per heal */
export function applyHealSta(get: Get, set: Set, unitId: string) {
  applyStaChange(get, set, unitId, 2);
}

/** STA +5 per skill activation */
export function applySkillSta(get: Get, set: Set, unitId: string) {
  applyStaChange(get, set, unitId, 5);
}

function applyStaChange(get: Get, set: Set, unitId: string, amount: number) {
  const { units } = get();
  const unit = units.get(unitId);
  if (!unit) return;

  const newMeta = clampMetaStats({ ...unit.metaStats, sta: unit.metaStats.sta + amount });
  const newUnits = new Map(units);
  newUnits.set(unitId, { ...unit, metaStats: newMeta });
  set({ units: newUnits });
}

// ===== Rest Action =====

/** Rest: skip turn, reduce STA by 10 */
export function rest(get: Get, set: Set) {
  const { selectedUnitId, pendingPosition, units, gameMap } = get();
  if (!selectedUnitId || !pendingPosition) return;

  const unit = units.get(selectedUnitId);
  if (!unit) return;

  const newUnits = new Map(units);
  const newTiles = gameMap.tiles.map((row) => row.map((t) => ({ ...t })));

  // Move to pending position
  newTiles[unit.position.y][unit.position.x].occupantId = null;
  newTiles[pendingPosition.y][pendingPosition.x].occupantId = selectedUnitId;

  const newMeta = clampMetaStats({ ...unit.metaStats, sta: unit.metaStats.sta - 10 });

  newUnits.set(selectedUnitId, {
    ...unit,
    position: { ...pendingPosition },
    hasActed: true,
    metaStats: newMeta,
  });

  const floatId = Date.now();
  set({
    ...IDLE_RESET,
    units: newUnits,
    gameMap: { ...gameMap, tiles: newTiles },
    floatingNumbers: [
      ...get().floatingNumbers,
      {
        id: floatId,
        x: pendingPosition.x,
        y: pendingPosition.y,
        text: 'STA -10',
        color: '#f97316',
      },
    ],
  });

  if (allPlayersDone(get().units)) {
    get().endPlayerTurn();
  }
}

// ===== CRP 100 Corruption Event =====

function handleCorruptionEvent(get: Get, set: Set, unitId: string) {
  const { units } = get();
  const unit = units.get(unitId);
  if (!unit) return;

  // Show dramatic dialogue
  set({
    eventDialogue: {
      lines: [
        { speaker: unit.name, text: `The corruption... it's consuming me...` },
        {
          speaker: 'System',
          text: `${unit.name} has been lost to corruption!`,
          speakerFaction: 'enemy',
        },
      ],
    },
    eventDialogueLineIndex: 0,
  });

  // Swap unit to enemy faction (permadeath — lost from roster)
  const newUnits = new Map(get().units);
  newUnits.set(unitId, {
    ...unit,
    faction: 'enemy',
    aiBehavior: { type: 'aggressive' },
    metaStats: { ...unit.metaStats, crp: 100 },
  });
  set({ units: newUnits });

  // Mark as dead in campaign store for permadeath tracking
  const campaign = useCampaignStore.getState();
  if (!campaign.deadUnitIds.includes(unitId)) {
    useCampaignStore.setState({ deadUnitIds: [...campaign.deadUnitIds, unitId] });
  }
}

// ===== Helpers =====

function addFloat(
  floats: GameState['floatingNumbers'],
  x: number,
  y: number,
  text: string,
  color: string,
) {
  floats.push({ id: Date.now() + Math.random(), x, y, text, color });
}
