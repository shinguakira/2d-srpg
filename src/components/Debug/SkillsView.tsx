import { useState } from 'react';
import { SKILLS, type SkillCategory } from '../../data/skills';
import { ALL_CLASSES } from '../../data/promotedClasses';

const ALL_SKILLS = Object.values(SKILLS);
const ALL_CLASSES_ARR = Object.values(ALL_CLASSES);

const CATEGORY_COLORS: Record<SkillCategory, string> = {
  combat: '#ef4444',
  movement: '#3b82f6',
  support: '#22c55e',
  meta: '#a855f7',
  passive: '#64748b',
};

const CATEGORIES: Array<SkillCategory | 'all'> = ['all', 'combat', 'movement', 'support', 'passive', 'meta'];

function getActivationText(activation: { type: string; threshold?: number }): string {
  switch (activation.type) {
    case 'passive': return 'Always active';
    case 'skl_pct': return 'SKL% chance per hit';
    case 'spd_pct': return 'SPD% chance per hit';
    case 'lck_pct': return 'LCK% chance';
    case 'skl_half_pct': return 'SKL/2% chance';
    case 'skl_quarter_pct': return 'SKL/4% chance';
    case 'hp_threshold': return `Active when HP ≤ ${(activation as { threshold: number }).threshold}%`;
    default: return activation.type;
  }
}

export function SkillsView({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [filter, setFilter] = useState<SkillCategory | 'all'>('all');
  const filtered = filter === 'all' ? ALL_SKILLS : ALL_SKILLS.filter((s) => s.category === filter);
  const selected = selectedId ? SKILLS[selectedId] : null;

  return (
    <div className="debug-screen__split">
      <div className="debug-screen__list">
        <div className="debug-screen__sub-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`debug-screen__sub-tab ${filter === cat ? 'debug-screen__sub-tab--active' : ''}`}
              data-testid={`debug-skill-filter-${cat}`}
              onClick={() => setFilter(cat)}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        {filtered.map((skill) => (
          <button
            key={skill.id}
            className={`debug-screen__entry ${skill.id === selectedId ? 'debug-screen__entry--selected' : ''}`}
            data-testid={`debug-skill-${skill.id}`}
            onClick={() => onSelect(skill.id)}
          >
            <div className="debug-screen__entry-info">
              <span className="debug-screen__entry-name">{skill.name}</span>
              <span className="debug-screen__entry-meta">
                <span
                  className="debug-screen__badge"
                  style={{ background: CATEGORY_COLORS[skill.category] }}
                >
                  {skill.category}
                </span>
                {skill.isInnate && (
                  <span className="debug-screen__badge" style={{ background: '#d97706' }}>
                    innate
                  </span>
                )}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="debug-screen__detail">
        {selected ? <SkillDetail skill={selected} /> : <div className="debug-screen__empty">Select a skill to view details</div>}
      </div>
    </div>
  );
}

function SkillDetail({ skill }: { skill: (typeof ALL_SKILLS)[0] }) {
  const classesWithSkill = ALL_CLASSES_ARR.filter(
    (cls) => cls.innateSkills?.includes(skill.id),
  );

  return (
    <div data-testid={`debug-detail-${skill.id}`}>
      <div className="debug-screen__detail-header">
        <div className="debug-screen__detail-header-info">
          <h2 className="debug-screen__detail-name">{skill.name}</h2>
          <div className="debug-screen__detail-badges">
            <span
              className="debug-screen__badge debug-screen__badge--large"
              style={{ background: CATEGORY_COLORS[skill.category] }}
            >
              {skill.category}
            </span>
            {skill.isInnate && (
              <span className="debug-screen__badge debug-screen__badge--large" style={{ background: '#d97706' }}>
                Class Innate
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Activation</h3>
        <p className="debug-screen__desc-text">{getActivationText(skill.activation)}</p>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Description</h3>
        <p className="debug-screen__desc-text">{skill.description}</p>
      </div>

      {skill.isInnate && (
        <div className="debug-screen__section">
          <p className="debug-screen__desc-text" style={{ color: '#d97706' }}>
            Class-granted skill — does not use a skill slot.
          </p>
        </div>
      )}

      {classesWithSkill.length > 0 && (
        <div className="debug-screen__section">
          <h3 className="debug-screen__section-title">Classes with this Innate Skill</h3>
          <div className="debug-screen__used-by">
            {classesWithSkill.map((cls) => (
              <span key={cls.id} className="debug-screen__used-by-chip">
                {cls.name}
                <span className="debug-screen__badge" style={{ background: cls.tier === 'base' ? '#3b82f6' : cls.tier === 'promoted' ? '#d97706' : '#a855f7' }}>
                  {cls.tier}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
