import { TERRAIN } from '../../core/terrain';
import {
  getTerrainCrpGain,
  getTerrainSyncChange,
  getTerrainStaRecovery,
} from '../../core/metaStats';
import type { TerrainType } from '../../core/types';

const TERRAIN_KEYS = Object.keys(TERRAIN) as TerrainType[];

const TERRAIN_EFFECTS = TERRAIN_KEYS.map((key) => ({
  key,
  name: TERRAIN[key].name,
  crp: getTerrainCrpGain(key),
  sync: getTerrainSyncChange(key),
  sta: getTerrainStaRecovery(key),
})).filter((t) => t.crp !== 0 || t.sync !== 0 || t.sta !== 0);

function signed(n: number): string {
  return n > 0 ? `+${n}` : `${n}`;
}

export function MetaStatsView() {
  return (
    <div className="debug-screen__reference" data-testid="debug-metastats-view">
      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">AWR (Awareness)</h3>
        <p className="debug-screen__desc-text">Range: 0-100. +1 per chapter.</p>
        <p className="debug-screen__desc-text">&ge; 80: Can see enemy unit meta-stats.</p>
        <p className="debug-screen__desc-text">&ge; 30: Unit may comment on adjacent anomalies.</p>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">LOOP (Loop Counter)</h3>
        <p className="debug-screen__desc-text">Range: &ge; 0. Ren-only spendable resource.</p>
        <div className="debug-screen__formula">Memory Blade might = 1 + floor(LOOP / 30)</div>
        <p className="debug-screen__desc-text">+10 at arc transitions.</p>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">SYNC (Synchronization)</h3>
        <p className="debug-screen__desc-text">Range: 0-100.</p>
        <p className="debug-screen__desc-text">&gt; 80: +5 hit bonus.</p>
        <p className="debug-screen__desc-text">
          &lt; 30: Random &plusmn;2 stat variance to combat stats.
        </p>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">LOY (Loyalty)</h3>
        <p className="debug-screen__desc-text">Range: 0-100.</p>
        <p className="debug-screen__desc-text">
          &ge; 80 (near Ren, &le; 3 tiles): +1 all combat stats.
        </p>
        <p className="debug-screen__desc-text">&lt; 30: 5% chance to disobey orders.</p>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">CRP (Corruption)</h3>
        <p className="debug-screen__desc-text">Range: 0-100.</p>
        <p className="debug-screen__desc-text">
          &ge; 60: -1 all combat stats (STR, MAG, DEF, RES, SPD, SKL, LCK).
        </p>
        <p className="debug-screen__desc-text">&ge; 80: -2 all combat stats.</p>
        <p className="debug-screen__desc-text">= 100: Unit turns enemy.</p>
        <p className="debug-screen__desc-text">
          Light magic deals x1.5 damage vs units with CRP &gt; 0.
        </p>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">STA (Stamina / Fatigue)</h3>
        <p className="debug-screen__desc-text">Range: &ge; 0. Resets between chapters.</p>
        <p className="debug-screen__desc-text">&ge; 30: -1 SPD.</p>
        <p className="debug-screen__desc-text">&ge; 45: -2 SPD, -1 SKL.</p>
        <p className="debug-screen__desc-text">&gt; 45: Cannot act (exhausted), only wait.</p>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Default Values</h3>
        <table className="debug-screen__table">
          <thead>
            <tr>
              <th>Unit</th>
              <th>AWR</th>
              <th>LOOP</th>
              <th>SYNC</th>
              <th>LOY</th>
              <th>CRP</th>
              <th>STA</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ren</td>
              <td>0</td>
              <td>347</td>
              <td>80</td>
              <td>50</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Others</td>
              <td>0</td>
              <td>0</td>
              <td>70</td>
              <td>50</td>
              <td>0</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Terrain Effects (per turn)</h3>
        <table className="debug-screen__table">
          <thead>
            <tr>
              <th>Terrain</th>
              <th>CRP</th>
              <th>SYNC</th>
              <th>STA</th>
            </tr>
          </thead>
          <tbody>
            {TERRAIN_EFFECTS.map((t) => (
              <tr key={t.key}>
                <td>{t.name}</td>
                <td style={{ color: t.crp > 0 ? '#ef4444' : undefined }}>
                  {t.crp !== 0 ? signed(t.crp) : '—'}
                </td>
                <td style={{ color: t.sync < 0 ? '#ef4444' : t.sync > 0 ? '#22c55e' : undefined }}>
                  {t.sync !== 0 ? signed(t.sync) : '—'}
                </td>
                <td style={{ color: t.sta < 0 ? '#22c55e' : undefined }}>
                  {t.sta !== 0 ? signed(t.sta) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
