import { useGameStore } from '../../stores/gameStore';

const STAT_LABELS: Record<string, string> = {
  hp: 'HP', str: 'STR', mag: 'MAG', def: 'DEF',
  res: 'RES', spd: 'SPD', skl: 'SKL', lck: 'LCK',
};

export function LevelUpPopup() {
  const gains = useGameStore((s) => s.levelUpGains);
  const unitId = useGameStore((s) => s.levelUpUnitId);
  const units = useGameStore((s) => s.units);
  const dismiss = useGameStore((s) => s.dismissLevelUp);

  if (!gains || !unitId) return null;

  const unit = units.get(unitId);
  if (!unit) return null;

  const statEntries = Object.entries(gains).filter(([key]) => key in STAT_LABELS);

  return (
    <div className="level-up-popup" data-testid="level-up-popup" onClick={dismiss}>
      <div className="level-up-popup__panel">
        <div className="level-up-popup__header">Level Up!</div>
        <div className="level-up-popup__name">{unit.name} → Lv.{unit.level}</div>
        <div className="level-up-popup__stats">
          {statEntries.map(([key, value]) => (
            <div
              key={key}
              className={`level-up-popup__stat ${value > 0 ? 'level-up-popup__stat--gained' : ''}`}
            >
              <span className="level-up-popup__stat-name">{STAT_LABELS[key]}</span>
              <span className="level-up-popup__stat-value">
                {value > 0 ? `+${value}` : '-'}
              </span>
            </div>
          ))}
        </div>
        <div className="level-up-popup__hint">Click to dismiss</div>
      </div>
    </div>
  );
}
