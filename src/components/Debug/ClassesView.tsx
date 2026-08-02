import { useState } from 'react';
import { ALL_CLASSES } from '../../data/promotedClasses';
import { SKILLS } from '../../data/skills';
import { PLAYER_UNITS, ENEMY_UNITS } from '../../data/units';
import { BattleSprite } from '../Combat/BattleSprite';
import { WeaponIcon } from '../Icons/WeaponIcon';
import type { UnitClass } from '../../core/types';

const ALL_CLASSES_ARR = Object.values(ALL_CLASSES);
const ALL_UNITS = Object.values({ ...PLAYER_UNITS, ...ENEMY_UNITS });

type TierFilter = 'all' | 'base' | 'promoted' | 'master';
const TIERS: TierFilter[] = ['all', 'base', 'promoted', 'master'];

const TIER_COLORS: Record<string, string> = {
  base: '#3b82f6',
  promoted: '#d97706',
  master: '#a855f7',
};

const TIER_ORDER: Record<string, number> = { base: 0, promoted: 1, master: 2 };

export function ClassesView({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [filter, setFilter] = useState<TierFilter>('all');

  const filtered = (
    filter === 'all' ? ALL_CLASSES_ARR : ALL_CLASSES_ARR.filter((c) => c.tier === filter)
  ).sort(
    (a, b) => (TIER_ORDER[a.tier] ?? 0) - (TIER_ORDER[b.tier] ?? 0) || a.name.localeCompare(b.name),
  );

  const selected = selectedId ? ALL_CLASSES[selectedId] : null;

  return (
    <div className="debug-screen__split">
      <div className="debug-screen__list">
        <div className="debug-screen__sub-tabs">
          {TIERS.map((t) => (
            <button
              key={t}
              className={`debug-screen__sub-tab ${filter === t ? 'debug-screen__sub-tab--active' : ''}`}
              data-testid={`debug-class-filter-${t}`}
              onClick={() => setFilter(t)}
            >
              {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        {filtered.map((cls) => (
          <button
            key={cls.id}
            className={`debug-screen__entry ${cls.id === selectedId ? 'debug-screen__entry--selected' : ''}`}
            data-testid={`debug-class-${cls.id}`}
            onClick={() => onSelect(cls.id)}
          >
            <div className="debug-screen__entry-info">
              <span className="debug-screen__entry-name">{cls.name}</span>
              <span className="debug-screen__entry-meta">
                <span
                  className="debug-screen__badge"
                  style={{ background: TIER_COLORS[cls.tier] ?? '#888' }}
                >
                  {cls.tier}
                </span>
                {cls.weaponTypes?.map((wt) => (
                  <WeaponIcon key={wt} type={wt} size={14} />
                ))}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="debug-screen__detail">
        {selected ? (
          <ClassDetail cls={selected} />
        ) : (
          <div className="debug-screen__empty">Select a class to view details</div>
        )}
      </div>
    </div>
  );
}

function ClassDetail({ cls }: { cls: UnitClass }) {
  const unitsOfClass = ALL_UNITS.filter((u) => u.classId === cls.id);

  return (
    <div data-testid={`debug-detail-${cls.id}`}>
      <div className="debug-screen__detail-header">
        <div className="debug-screen__detail-header-info">
          <h2 className="debug-screen__detail-name">{cls.name}</h2>
          <div className="debug-screen__detail-badges">
            <span
              className="debug-screen__badge debug-screen__badge--large"
              style={{ background: TIER_COLORS[cls.tier] ?? '#888' }}
            >
              {cls.tier}
            </span>
            {cls.mounted && (
              <span
                className="debug-screen__badge debug-screen__badge--large"
                style={{ background: '#0ea5e9' }}
              >
                Mounted
              </span>
            )}
            {cls.flying && (
              <span
                className="debug-screen__badge debug-screen__badge--large"
                style={{ background: '#06b6d4' }}
              >
                Flying
              </span>
            )}
            {cls.armored && (
              <span
                className="debug-screen__badge debug-screen__badge--large"
                style={{ background: '#64748b' }}
              >
                Armored
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Base Stats</h3>
        <div className="debug-screen__stats-grid">
          {(Object.entries(cls.baseStats) as [string, number][]).map(([key, val]) => (
            <div key={key} className="debug-screen__stat-row">
              <span className="debug-screen__stat-label">{key.toUpperCase()}</span>
              <span className="debug-screen__stat-value">{val}</span>
              <div className="debug-screen__stat-bar-track">
                <div
                  className="debug-screen__stat-bar-fill"
                  style={{ width: `${Math.min(100, (val / 30) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Growth Rates</h3>
        <div className="debug-screen__stats-grid">
          {(Object.entries(cls.growthRates) as [string, number][]).map(([key, val]) => (
            <div key={key} className="debug-screen__stat-row">
              <span className="debug-screen__stat-label">{key.toUpperCase()}</span>
              <span className="debug-screen__stat-value debug-screen__stat-value--growth">
                {val}%
              </span>
              <div className="debug-screen__growth-bar">
                <div className="debug-screen__growth-fill" style={{ width: `${val}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Weapon Types</h3>
        <div className="debug-screen__used-by">
          {cls.weaponTypes?.map((wt) => (
            <span key={wt} className="debug-screen__used-by-chip">
              <WeaponIcon type={wt} size={20} />
              <span>{wt}</span>
            </span>
          ))}
        </div>
      </div>

      {cls.innateSkills && cls.innateSkills.length > 0 && (
        <div className="debug-screen__section">
          <h3 className="debug-screen__section-title">Innate Skills</h3>
          <div className="debug-screen__used-by">
            {cls.innateSkills.map((sid) => {
              const skill = SKILLS[sid];
              return (
                <span key={sid} className="debug-screen__used-by-chip">
                  {skill?.name ?? sid}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Promotion Chain</h3>
        {cls.promotesFrom && (
          <p className="debug-screen__desc-text">
            Promotes from:{' '}
            <span style={{ color: '#fbbf24', fontWeight: 700 }}>
              {ALL_CLASSES[cls.promotesFrom]?.name ?? cls.promotesFrom}
            </span>
          </p>
        )}
        {cls.promotesTo && cls.promotesTo.length > 0 && (
          <p className="debug-screen__desc-text">
            Promotes to:{' '}
            {cls.promotesTo.map((id, i) => (
              <span key={id}>
                {i > 0 && ', '}
                <span style={{ color: '#fbbf24', fontWeight: 700 }}>
                  {ALL_CLASSES[id]?.name ?? id}
                </span>
              </span>
            ))}
          </p>
        )}
        {!cls.promotesFrom && (!cls.promotesTo || cls.promotesTo.length === 0) && (
          <p className="debug-screen__desc-text">No promotions available.</p>
        )}
      </div>

      {cls.bonusCrit != null && (
        <div className="debug-screen__section">
          <h3 className="debug-screen__section-title">Bonus Critical</h3>
          <p className="debug-screen__desc-text" style={{ color: '#fbbf24' }}>
            +{cls.bonusCrit} Crit
          </p>
        </div>
      )}

      {cls.statCaps && (
        <div className="debug-screen__section">
          <h3 className="debug-screen__section-title">Stat Caps</h3>
          <div className="debug-screen__stats-grid">
            {(Object.entries(cls.statCaps) as [string, number][]).map(([key, val]) => (
              <div key={key} className="debug-screen__stat-row">
                <span className="debug-screen__stat-label">{key.toUpperCase()}</span>
                <span className="debug-screen__stat-value">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {unitsOfClass.length > 0 && (
        <div className="debug-screen__section">
          <h3 className="debug-screen__section-title">Units of this Class</h3>
          <div className="debug-screen__used-by">
            {unitsOfClass.map((u) => (
              <span key={u.id} className="debug-screen__used-by-chip">
                <BattleSprite classId={u.classId} faction={u.faction} unitId={u.id} />
                <span>{u.name}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
