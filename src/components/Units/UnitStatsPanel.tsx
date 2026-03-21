import { useState } from 'react';
import type { Unit } from '../../core/types';
import { CLASSES } from '../../data/classes';
import { getTerrainData } from '../../core/terrain';
import { canSeeEnemyMetaStats } from '../../core/metaStats';
import { useGameStore } from '../../stores/gameStore';

type MetaStatBarProps = {
  label: string;
  value: number;
  max: number;
  stat: string;
};

function MetaStatBar({ label, value, max, stat }: MetaStatBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  const fillClass = stat === 'crp' && value >= 60
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
  return (
    <div className="meta-stats" data-testid="meta-stats">
      <div
        className="meta-stats__header"
        onClick={() => setCollapsed(!collapsed)}
        style={{ cursor: 'pointer', fontSize: '11px', opacity: 0.7, marginBottom: collapsed ? 0 : 4 }}
      >
        {collapsed ? '+ Meta-Stats' : '- Meta-Stats'}
      </div>
      {!collapsed && (
        <>
          <MetaStatBar label="AWR" value={unit.metaStats.awr} max={100} stat="awr" />
          {unit.id === 'ren' && (
            <div className="meta-stats__row">
              <span className="meta-stats__label meta-stats__label--loop">LOOP</span>
              <span className="meta-stats__loop-value">{unit.metaStats.loop}</span>
            </div>
          )}
          <MetaStatBar label="SYNC" value={unit.metaStats.sync} max={100} stat="sync" />
          <MetaStatBar label="LOY" value={unit.metaStats.loy} max={100} stat="loy" />
          <MetaStatBar label="CRP" value={unit.metaStats.crp} max={100} stat="crp" />
          <MetaStatBar label="STA" value={unit.metaStats.sta} max={45} stat="sta" />
        </>
      )}
    </div>
  );
}

export function UnitStatsPanel() {
  const selectedUnitId = useGameStore((s) => s.selectedUnitId);
  const hoveredTile = useGameStore((s) => s.hoveredTile);
  const units = useGameStore((s) => s.units);
  const getUnitAt = useGameStore((s) => s.getUnitAt);
  const getTileAt = useGameStore((s) => s.getTileAt);

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
          </div>

          {/* Meta-Stats — enemy meta-stats require AWR ≥ 80 from any player unit */}
          {(unit.faction === 'player' || canSeeEnemyMetaStats(units.values())) && (
            <MetaStatsSection unit={unit} />
          )}
        </div>
      )}

      {terrainInfo && (
        <div className="unit-stats-panel__terrain" data-testid="terrain-info">
          <div className="unit-stats-panel__terrain-name">{terrainInfo.name}</div>
          <div>DEF +{terrainInfo.defenseBonus}</div>
          <div>AVO +{terrainInfo.avoidBonus}</div>
        </div>
      )}

      {!unit && !terrainInfo && (
        <div className="unit-stats-panel__empty">
          Hover a tile or select a unit
        </div>
      )}
    </div>
  );
}
