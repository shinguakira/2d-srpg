import { CHAPTERS, CHAPTER_ORDER } from '../../data/chapters';
import { PLAYER_UNITS, ENEMY_UNITS } from '../../data/units';
import type { ChapterData } from '../../core/types';

const OBJECTIVE_COLORS: Record<string, string> = {
  seize: '#d97706',
  rout: '#ef4444',
  survive: '#3b82f6',
  boss_kill: '#a855f7',
  escape: '#22c55e',
};

export function ChaptersView({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const selected = selectedId ? CHAPTERS[selectedId] : null;

  return (
    <div className="debug-screen__split">
      <div className="debug-screen__list">
        {CHAPTER_ORDER.map((chId) => {
          const ch = CHAPTERS[chId];
          if (!ch) return null;
          return (
            <button
              key={chId}
              className={`debug-screen__entry ${chId === selectedId ? 'debug-screen__entry--selected' : ''}`}
              data-testid={`debug-chapter-${chId}`}
              onClick={() => onSelect(chId)}
            >
              <div className="debug-screen__entry-info">
                <span className="debug-screen__entry-name">
                  Ch.{ch.chapterNumber}: {ch.name.replace(/^Chapter \d+:\s*/, '')}
                </span>
                <span className="debug-screen__entry-meta">
                  <span
                    className="debug-screen__badge"
                    style={{ background: OBJECTIVE_COLORS[ch.objective.type] ?? '#888' }}
                  >
                    {ch.objective.type}
                  </span>
                  <span className="debug-screen__entry-class">
                    {ch.mapWidth}x{ch.mapHeight}
                  </span>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="debug-screen__detail">
        {selected ? (
          <ChapterDetail chapter={selected} />
        ) : (
          <div className="debug-screen__empty">Select a chapter to view details</div>
        )}
      </div>
    </div>
  );
}

function ChapterDetail({ chapter }: { chapter: ChapterData }) {
  return (
    <div data-testid={`debug-detail-${chapter.id}`}>
      <div className="debug-screen__detail-header">
        <div className="debug-screen__detail-header-info">
          <h2 className="debug-screen__detail-name">{chapter.name}</h2>
          <div className="debug-screen__detail-badges">
            <span
              className="debug-screen__badge debug-screen__badge--large"
              style={{ background: OBJECTIVE_COLORS[chapter.objective.type] ?? '#888' }}
            >
              {chapter.objective.type}
            </span>
          </div>
        </div>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Objective</h3>
        <p className="debug-screen__desc-text">
          Type: <span style={{ fontWeight: 700, color: '#fbbf24' }}>{chapter.objective.type}</span>
        </p>
        {chapter.seizePosition && (
          <p className="debug-screen__desc-text">
            Seize position: ({chapter.seizePosition.x}, {chapter.seizePosition.y})
          </p>
        )}
        {chapter.parTurns != null && (
          <p className="debug-screen__desc-text">Par turns: {chapter.parTurns}</p>
        )}
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Map</h3>
        <p className="debug-screen__desc-text">
          {chapter.mapWidth} x {chapter.mapHeight} tiles
        </p>
        {chapter.fogOfWar && (
          <p className="debug-screen__desc-text" style={{ color: '#a855f7' }}>
            Fog of War enabled
          </p>
        )}
        {chapter.weather && <p className="debug-screen__desc-text">Weather: {chapter.weather}</p>}
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Player Units ({chapter.playerUnits.length})</h3>
        <table className="debug-screen__table">
          <thead>
            <tr>
              <th>Unit</th>
              <th>Position</th>
            </tr>
          </thead>
          <tbody>
            {chapter.playerUnits.map((pu) => {
              const unit = PLAYER_UNITS[pu.unitId];
              return (
                <tr key={pu.unitId}>
                  <td>{unit?.name ?? pu.unitId}</td>
                  <td>
                    ({pu.position.x}, {pu.position.y})
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {chapter.deploymentSlots != null && (
          <p className="debug-screen__desc-text">Deployment slots: {chapter.deploymentSlots}</p>
        )}
        {chapter.forceDeploy && chapter.forceDeploy.length > 0 && (
          <p className="debug-screen__desc-text">Force deploy: {chapter.forceDeploy.join(', ')}</p>
        )}
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Enemy Units ({chapter.enemyUnits.length})</h3>
        <table className="debug-screen__table">
          <thead>
            <tr>
              <th>Unit</th>
              <th>Position</th>
              <th>AI</th>
            </tr>
          </thead>
          <tbody>
            {chapter.enemyUnits.map((eu, i) => {
              const unit = ENEMY_UNITS[eu.unitId];
              return (
                <tr key={`${eu.unitId}-${i}`}>
                  <td>{unit?.name ?? eu.unitId}</td>
                  <td>
                    ({eu.position.x}, {eu.position.y})
                  </td>
                  <td>
                    {unit?.aiBehavior ? (
                      <span className="debug-screen__badge" style={{ background: '#7c3aed' }}>
                        {unit.aiBehavior.type}
                      </span>
                    ) : (
                      <span style={{ opacity: 0.5 }}>aggressive</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {chapter.reinforcements && chapter.reinforcements.length > 0 && (
        <div className="debug-screen__section">
          <h3 className="debug-screen__section-title">
            Reinforcements ({chapter.reinforcements.length} waves)
          </h3>
          <table className="debug-screen__table">
            <thead>
              <tr>
                <th>Turn</th>
                <th>Units</th>
              </tr>
            </thead>
            <tbody>
              {chapter.reinforcements.map((wave, i) => (
                <tr key={i}>
                  <td>Turn {wave.turn}</td>
                  <td>
                    {wave.units.length} unit{wave.units.length !== 1 ? 's' : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {chapter.villages && chapter.villages.length > 0 && (
        <div className="debug-screen__section">
          <h3 className="debug-screen__section-title">Villages ({chapter.villages.length})</h3>
          <table className="debug-screen__table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Reward</th>
              </tr>
            </thead>
            <tbody>
              {chapter.villages.map((v, i) => (
                <tr key={i}>
                  <td>
                    ({v.position.x}, {v.position.y})
                  </td>
                  <td>{v.reward.weaponId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {chapter.events && chapter.events.length > 0 && (
        <div className="debug-screen__section">
          <h3 className="debug-screen__section-title">Events ({chapter.events.length})</h3>
          <table className="debug-screen__table">
            <thead>
              <tr>
                <th>Trigger</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {chapter.events.map((evt, i) => (
                <tr key={i}>
                  <td>
                    {evt.trigger.type}
                    {'turn' in evt.trigger ? ` ${evt.trigger.turn}` : ''}
                  </td>
                  <td>{evt.effects.map((e) => e.type).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {chapter.recruitableUnits && chapter.recruitableUnits.length > 0 && (
        <div className="debug-screen__section">
          <h3 className="debug-screen__section-title">Recruitable Units</h3>
          <p className="debug-screen__desc-text">{chapter.recruitableUnits.join(', ')}</p>
        </div>
      )}
    </div>
  );
}
