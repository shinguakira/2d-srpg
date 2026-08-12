import { useState } from 'react';
import type { Unit } from '../../core/types';
import { CLASSES } from '../../data/classes';
import { getTerrainData, getClassMovementCost } from '../../core/terrain';
import {
  canSeeEnemyMetaStats,
  getStaWarning,
  getTerrainCrpGain,
  getTerrainSyncChange,
  getTerrainStaRecovery,
} from '../../core/metaStats';
import { getDurabilityColor } from '../../core/items';
import { getSupportRank, getSupportCombatBonuses } from '../../core/support';
import { getManhattanDistance } from '../../core/pathfinding';
import { ALL_CLASSES } from '../../data/promotedClasses';
import { useGameStore } from '../../stores/gameStore';

type MetaStatBarProps = {
  label: string;
  value: number;
  max: number;
  stat: string;
};

function MetaStatBar({ label, value, max, stat }: MetaStatBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  const fillClass =
    stat === 'crp' && value >= 60
      ? 'meta-stats__fill meta-stats__fill--crp-danger'
      : `meta-stats__fill meta-stats__fill--${stat}`;
  return (
    <div className="meta-stats__row">
      <span className={`meta-stats__label meta-stats__label--${stat}`}>{label}</span>
      <div className="meta-stats__bar">
        <div className={fillClass} style={{ width: `${pct}%` }} />
      </div>
      <span className="meta-stats__value">{value}</span>
    </div>
  );
}

function MetaStatsSection({ unit }: { unit: Unit }) {
  const [collapsed, setCollapsed] = useState(false);
  const staWarning = getStaWarning(unit.metaStats.sta);
  return (
    <div className="meta-stats" data-testid="meta-stats">
      <div
        className="meta-stats__header"
        onClick={() => setCollapsed(!collapsed)}
        style={{
          cursor: 'pointer',
          fontSize: '11px',
          opacity: 0.7,
          marginBottom: collapsed ? 0 : 4,
        }}
      >
        {collapsed ? '+ Meta-Stats' : '- Meta-Stats'}
      </div>
      {!collapsed && (
        <>
          <MetaStatBar label="AWR" value={unit.metaStats.awr} max={100} stat="awr" />
          {unit.id === 'shigeru' && (
            <div className="meta-stats__row">
              <span className="meta-stats__label meta-stats__label--loop">LOOP</span>
              <span className="meta-stats__loop-value">{unit.metaStats.loop}</span>
            </div>
          )}
          <MetaStatBar label="SYNC" value={unit.metaStats.sync} max={100} stat="sync" />
          <MetaStatBar label="LOY" value={unit.metaStats.loy} max={100} stat="loy" />
          <MetaStatBar label="CRP" value={unit.metaStats.crp} max={100} stat="crp" />
          <MetaStatBar label="STA" value={unit.metaStats.sta} max={45} stat="sta" />
          {staWarning && (
            <div
              data-testid="sta-warning"
              style={{ fontSize: '10px', color: staWarning.color, marginTop: 2 }}
            >
              {staWarning.text}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SupportSection({
  unit,
  units,
  supportPairs,
}: {
  unit: Unit;
  units: Map<string, Unit>;
  supportPairs: any[];
}) {
  if (unit.faction !== 'player' || !supportPairs?.length) return null;

  const activeSupports: {
    id: string;
    name: string;
    rank: string;
    bonuses: { hit: number; avoid: number; crit: number; dmg: number };
  }[] = [];
  for (const pair of supportPairs) {
    const partnerId =
      pair.unitA === unit.id ? pair.unitB : pair.unitB === unit.id ? pair.unitA : null;
    if (!partnerId) continue;
    const partner = units.get(partnerId);
    if (!partner || partner.currentHp <= 0) continue;
    if (getManhattanDistance(unit.position, partner.position) > 3) continue;
    const rank = getSupportRank(pair.points);
    if (!rank) continue;
    activeSupports.push({
      id: partner.id,
      name: partner.name,
      rank,
      bonuses: getSupportCombatBonuses(rank),
    });
  }

  if (activeSupports.length === 0) return null;

  return (
    <div data-testid="support-bonuses" style={{ marginTop: 6, fontSize: '11px' }}>
      <div
        style={{
          color: '#fbbf24',
          fontWeight: 700,
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        Support
      </div>
      {activeSupports.map((s) => (
        <div key={s.id} data-testid={`support-partner-${s.id}`} style={{ marginTop: 2 }}>
          <span style={{ color: '#f472b6' }}>
            {s.name} ({s.rank})
          </span>
          <span style={{ color: '#fff', marginLeft: 4 }}>
            +{s.bonuses.hit} Hit, +{s.bonuses.avoid} Avo
            {s.bonuses.crit > 0 && `, +${s.bonuses.crit} Crit`}
            {s.bonuses.dmg > 0 && `, +${s.bonuses.dmg} Dmg`}
          </span>
        </div>
      ))}
    </div>
  );
}

export function UnitStatsPanel() {
  const selectedUnitId = useGameStore((s) => s.selectedUnitId);
  const hoveredTile = useGameStore((s) => s.hoveredTile);
  const units = useGameStore((s) => s.units);
  const getUnitAt = useGameStore((s) => s.getUnitAt);
  const getTileAt = useGameStore((s) => s.getTileAt);
  const supportPairs = useGameStore((s) => s.supportPairs);
  const showDangerZone = useGameStore((s) => s.showDangerZone);
  const dangerZone = useGameStore((s) => s.dangerZone);
  const dangerZoneAttribution = useGameStore((s) => s.dangerZoneAttribution);

  // Show selected unit, or hovered unit
  let unit: Unit | undefined;
  if (selectedUnitId) {
    unit = units.get(selectedUnitId);
  } else if (hoveredTile) {
    unit = getUnitAt(hoveredTile);
  }

  // Show terrain info for hovered tile
  const tile = hoveredTile ? getTileAt(hoveredTile) : null;
  const terrainInfo = tile ? getTerrainData(tile.terrain) : null;

  // Terrain meta-stat effects (Task 4)
  const terrainCrp = tile ? getTerrainCrpGain(tile.terrain) : 0;
  const terrainSync = tile ? getTerrainSyncChange(tile.terrain) : 0;
  const terrainSta = tile ? getTerrainStaRecovery(tile.terrain) : 0;
  const hasTerrainMetaEffects = terrainCrp !== 0 || terrainSync !== 0 || terrainSta !== 0;

  // Movement cost (Task 6)
  let moveCost: number | null = null;
  let moveLabel = '';
  if (tile && terrainInfo) {
    if (unit) {
      const cls = ALL_CLASSES[unit.classId];
      const flags = { flying: !!cls?.flying, mounted: !!cls?.mounted, armored: !!cls?.armored };
      moveCost = getClassMovementCost(tile.terrain, flags);
      if (cls?.flying) moveLabel = '(Flying)';
      else if (cls?.mounted) moveLabel = '(Mounted)';
      else if (cls?.armored) moveLabel = '(Armored)';
      else moveLabel = '(Infantry)';
    } else {
      moveCost = terrainInfo.movementCost;
    }
  }

  // Danger zone attribution (Task 12)
  const hoveredKey = hoveredTile ? `${hoveredTile.x},${hoveredTile.y}` : null;
  const threatEnemyIds =
    showDangerZone && hoveredKey && dangerZone?.has(hoveredKey) && dangerZoneAttribution
      ? dangerZoneAttribution.get(hoveredKey)
      : null;
  const threatEnemies = threatEnemyIds?.map((id) => units.get(id)).filter(Boolean) as
    | Unit[]
    | undefined;

  return (
    <div className="unit-stats-panel" data-testid="unit-stats-panel">
      {unit && (
        <div className="unit-stats-panel__unit" data-testid="unit-info">
          <div className="unit-stats-panel__name">{unit.name}</div>
          <div className="unit-stats-panel__class">
            {CLASSES[unit.classId]?.name ?? unit.classId} Lv.{unit.level}
          </div>
          <div className="unit-stats-panel__hp">
            HP: {unit.currentHp}/{unit.stats.hp}
          </div>
          <div className="unit-stats-panel__stats">
            <span>STR {unit.stats.str}</span>
            <span>MAG {unit.stats.mag}</span>
            <span>DEF {unit.stats.def}</span>
            <span>RES {unit.stats.res}</span>
            <span>SPD {unit.stats.spd}</span>
            <span>SKL {unit.stats.skl}</span>
            <span>LCK {unit.stats.lck}</span>
            <span>MOV {unit.stats.mov}</span>
            <span>CHA {unit.stats.cha}</span>
            <span>WIL {unit.stats.wil}</span>
          </div>
          <div className="unit-stats-panel__weapon">
            {unit.equippedWeapon.name} (Mt {unit.equippedWeapon.might})
            {unit.equippedWeapon.durability != null &&
              unit.equippedWeapon.maxDurability != null && (
                <span
                  data-testid="weapon-durability"
                  style={{
                    marginLeft: 6,
                    color: getDurabilityColor(unit.equippedWeapon.durability),
                  }}
                >
                  {unit.equippedWeapon.durability}/{unit.equippedWeapon.maxDurability}
                </span>
              )}
          </div>

          {/* Meta-Stats — enemy meta-stats require AWR >= 80 from any player unit */}
          {(unit.faction === 'player' || canSeeEnemyMetaStats(units.values())) && (
            <MetaStatsSection unit={unit} />
          )}

          {/* Support bonuses (Task 7) */}
          <SupportSection unit={unit} units={units} supportPairs={supportPairs} />
        </div>
      )}

      {terrainInfo && (
        <div className="unit-stats-panel__terrain" data-testid="terrain-info">
          <div className="unit-stats-panel__terrain-name">{terrainInfo.name}</div>
          <div>DEF +{terrainInfo.defenseBonus}</div>
          <div>AVO +{terrainInfo.avoidBonus}</div>

          {/* Movement cost (Task 6) */}
          {moveCost != null && (
            <div
              data-testid="terrain-move-cost"
              style={moveCost >= 99 ? { color: '#ef4444' } : undefined}
            >
              Move: {moveCost >= 99 ? '---' : moveCost} {moveLabel}
            </div>
          )}

          {/* Terrain meta-stat effects (Task 4) */}
          {hasTerrainMetaEffects && (
            <div data-testid="terrain-meta-effects" style={{ marginTop: 4 }}>
              {terrainCrp !== 0 && (
                <div style={{ color: '#d946ef' }}>
                  CRP {terrainCrp > 0 ? '+' : ''}
                  {terrainCrp}/turn
                </div>
              )}
              {terrainSync !== 0 && (
                <div style={{ color: terrainSync > 0 ? '#22d3ee' : '#ef4444' }}>
                  SYNC {terrainSync > 0 ? '+' : ''}
                  {terrainSync}/turn
                </div>
              )}
              {terrainSta !== 0 && (
                <div style={{ color: '#60a5fa' }}>
                  STA {terrainSta > 0 ? '+' : ''}
                  {terrainSta}/turn
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Danger zone threats (Task 12) */}
      {threatEnemies && threatEnemies.length > 0 && (
        <div data-testid="danger-threats" style={{ padding: '6px 8px', fontSize: '11px' }}>
          <div style={{ color: '#ef4444', fontWeight: 700 }}>
            Threats ({threatEnemies.length} {threatEnemies.length === 1 ? 'enemy' : 'enemies'})
          </div>
          {threatEnemies.map((e) => (
            <div
              key={e.id}
              data-testid={`danger-threat-${e.id}`}
              style={{ color: 'rgba(255,255,255,0.7)', marginTop: 1 }}
            >
              {e.name} — {e.equippedWeapon.name}
            </div>
          ))}
        </div>
      )}

      {!unit && !terrainInfo && (
        <div className="unit-stats-panel__empty">Hover a tile or select a unit</div>
      )}
    </div>
  );
}
