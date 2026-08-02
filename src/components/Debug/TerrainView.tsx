import { useState } from 'react';
import { TERRAIN, getClassMovementCost, isPassableForClass } from '../../core/terrain';
import {
  getTerrainCrpGain,
  getTerrainSyncChange,
  getTerrainStaRecovery,
} from '../../core/metaStats';
import type { TerrainType } from '../../core/types';

type SortMode = 'name' | 'cost' | 'defense';

const TERRAIN_ENTRIES = Object.entries(TERRAIN) as [TerrainType, (typeof TERRAIN)[TerrainType]][];

function getCostColor(cost: number): string {
  if (cost >= 99) return '#ef4444';
  if (cost >= 2) return '#fbbf24';
  return '#22c55e';
}

function signed(n: number): string {
  return n > 0 ? `+${n}` : `${n}`;
}

export function TerrainView({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [sort, setSort] = useState<SortMode>('name');

  const sorted = [...TERRAIN_ENTRIES].sort((a, b) => {
    if (sort === 'cost') return a[1].movementCost - b[1].movementCost;
    if (sort === 'defense') return b[1].defenseBonus - a[1].defenseBonus;
    return a[1].name.localeCompare(b[1].name);
  });

  const selectedKey = selectedId as TerrainType | null;
  const selectedData = selectedKey ? TERRAIN[selectedKey] : null;

  return (
    <div className="debug-screen__split">
      <div className="debug-screen__list">
        <div className="debug-screen__sub-tabs">
          {(['name', 'cost', 'defense'] as SortMode[]).map((s) => (
            <button
              key={s}
              className={`debug-screen__sub-tab ${sort === s ? 'debug-screen__sub-tab--active' : ''}`}
              data-testid={`debug-terrain-sort-${s}`}
              onClick={() => setSort(s)}
            >
              {s === 'name' ? 'Name' : s === 'cost' ? 'Move Cost' : 'Defense'}
            </button>
          ))}
        </div>
        {sorted.map(([key, data]) => (
          <button
            key={key}
            className={`debug-screen__entry ${key === selectedId ? 'debug-screen__entry--selected' : ''}`}
            data-testid={`debug-terrain-${key}`}
            onClick={() => onSelect(key)}
          >
            <div className="debug-screen__entry-info">
              <span className="debug-screen__entry-name">{data.name}</span>
              <span className="debug-screen__entry-meta">
                <span
                  style={{ color: getCostColor(data.movementCost), fontWeight: 700, fontSize: 12 }}
                >
                  {data.movementCost >= 99 ? '—' : data.movementCost}
                </span>
                {data.defenseBonus !== 0 && (
                  <span className="debug-screen__entry-class">DEF {signed(data.defenseBonus)}</span>
                )}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="debug-screen__detail">
        {selectedKey && selectedData ? (
          <TerrainDetail terrainKey={selectedKey} data={selectedData} />
        ) : (
          <div className="debug-screen__empty">Select a terrain to view details</div>
        )}
      </div>
    </div>
  );
}

function TerrainDetail({
  terrainKey,
  data,
}: {
  terrainKey: TerrainType;
  data: (typeof TERRAIN)[TerrainType];
}) {
  const baseCost = data.movementCost;
  const mountedCost = getClassMovementCost(terrainKey, { mounted: true });
  const flyingCost = getClassMovementCost(terrainKey, { flying: true });
  const armoredCost = getClassMovementCost(terrainKey, { armored: true });

  const basePassable = baseCost < 99;
  const flyingPassable = isPassableForClass(terrainKey, { flying: true });

  const crp = getTerrainCrpGain(terrainKey);
  const sync = getTerrainSyncChange(terrainKey);
  const sta = getTerrainStaRecovery(terrainKey);
  const hasMetaEffects = crp !== 0 || sync !== 0 || sta !== 0;

  return (
    <div data-testid={`debug-detail-${terrainKey}`}>
      <div className="debug-screen__detail-header">
        <div className="debug-screen__detail-header-info">
          <h2 className="debug-screen__detail-name">{data.name}</h2>
        </div>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Movement Cost</h3>
        <table className="debug-screen__table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Normal</td>
              <td style={{ color: getCostColor(baseCost) }}>
                {baseCost >= 99 ? 'Impassable' : baseCost}
              </td>
            </tr>
            <tr>
              <td>Mounted</td>
              <td style={{ color: getCostColor(mountedCost) }}>
                {mountedCost >= 99 ? 'Impassable' : mountedCost}
              </td>
            </tr>
            <tr>
              <td>Flying</td>
              <td style={{ color: getCostColor(flyingCost) }}>
                {flyingCost >= 99 ? 'Impassable' : flyingCost}
              </td>
            </tr>
            <tr>
              <td>Armored</td>
              <td style={{ color: getCostColor(armoredCost) }}>
                {armoredCost >= 99 ? 'Impassable' : armoredCost}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Combat Bonuses</h3>
        <div className="debug-screen__stats-grid">
          <div className="debug-screen__stat-row">
            <span className="debug-screen__stat-label">DEF</span>
            <span className="debug-screen__stat-value">{signed(data.defenseBonus)}</span>
            <div className="debug-screen__stat-bar-track">
              <div
                className="debug-screen__stat-bar-fill debug-screen__stat-bar-fill--blue"
                style={{ width: `${Math.min(100, (data.defenseBonus / 5) * 100)}%` }}
              />
            </div>
          </div>
          <div className="debug-screen__stat-row">
            <span className="debug-screen__stat-label">AVO</span>
            <span className="debug-screen__stat-value">{signed(data.avoidBonus)}</span>
            <div className="debug-screen__stat-bar-track">
              <div
                className="debug-screen__stat-bar-fill debug-screen__stat-bar-fill--gold"
                style={{ width: `${Math.min(100, Math.max(0, (data.avoidBonus / 30) * 100))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Passability</h3>
        <p className="debug-screen__desc-text">
          Base:{' '}
          <span style={{ color: basePassable ? '#22c55e' : '#ef4444', fontWeight: 700 }}>
            {basePassable ? 'Passable' : 'Impassable'}
          </span>
        </p>
        {!basePassable && flyingPassable && (
          <p className="debug-screen__desc-text">
            Flying units: <span style={{ color: '#22c55e', fontWeight: 700 }}>Passable</span>
          </p>
        )}
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Meta-Stat Effects (per turn)</h3>
        {hasMetaEffects ? (
          <div className="debug-screen__stats-grid">
            {crp !== 0 && (
              <div className="debug-screen__stat-row">
                <span className="debug-screen__stat-label">CRP</span>
                <span className="debug-screen__stat-value" style={{ color: '#ef4444' }}>
                  {signed(crp)}
                </span>
              </div>
            )}
            {sync !== 0 && (
              <div className="debug-screen__stat-row">
                <span className="debug-screen__stat-label">SYNC</span>
                <span
                  className="debug-screen__stat-value"
                  style={{ color: sync > 0 ? '#22c55e' : '#ef4444' }}
                >
                  {signed(sync)}
                </span>
              </div>
            )}
            {sta !== 0 && (
              <div className="debug-screen__stat-row">
                <span className="debug-screen__stat-label">STA</span>
                <span className="debug-screen__stat-value" style={{ color: '#22c55e' }}>
                  {signed(sta)}
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="debug-screen__desc-text">No meta-stat effects.</p>
        )}
      </div>
    </div>
  );
}
