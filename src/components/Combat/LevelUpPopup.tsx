import { useGameStore } from '../../stores/gameStore';
import { BattleSprite } from './BattleSprite';

const STAT_LABELS: Record<string, string> = {
  hp: 'HP', str: 'STR', mag: 'MAG', def: 'DEF',
  res: 'RES', spd: 'SPD', skl: 'SKL', lck: 'LCK',
};

const STAT_ORDER = ['hp', 'str', 'mag', 'skl', 'spd', 'def', 'res', 'lck'];

export function LevelUpPopup() {
  const gains = useGameStore((s) => s.levelUpGains);
  const unitId = useGameStore((s) => s.levelUpUnitId);
  const units = useGameStore((s) => s.units);
  const dismiss = useGameStore((s) => s.dismissLevelUp);

  if (!gains || !unitId) return null;

  const unit = units.get(unitId);
  if (!unit) return null;

  return (
    <div className="level-up-popup" data-testid="level-up-popup" onClick={dismiss}>
      <div className="level-up-popup__panel">
        <div className="level-up-popup__header">
          ★ LEVEL UP! ★
        </div>

        <div className="level-up-popup__identity">
          <div className="level-up-popup__sprite">
            <BattleSprite classId={unit.classId} faction={unit.faction} />
          </div>
          <div className="level-up-popup__name-block">
            <div className="level-up-popup__name">{unit.name}</div>
            <div className="level-up-popup__class">→ Lv.{unit.level}</div>
          </div>
        </div>

        <div className="level-up-popup__stats">
          {STAT_ORDER.map((key, idx) => {
            const value = (gains as Record<string, number>)[key] ?? 0;
            const statVal = (unit.stats as Record<string, number>)[key] ?? 0;
            const gained = value > 0;

            return (
              <div
                key={key}
                className={`level-up-popup__stat ${gained ? 'level-up-popup__stat--gained' : ''}`}
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <span className="level-up-popup__stat-name">{STAT_LABELS[key]}</span>
                <span className="level-up-popup__stat-value">{statVal}</span>
                <div className="level-up-popup__stat-bar">
                  <div
                    className={`level-up-popup__stat-bar-fill ${gained ? 'level-up-popup__stat-bar-fill--gained' : ''}`}
                    style={{ width: `${Math.min(100, (statVal / 30) * 100)}%` }}
                  />
                </div>
                <span className="level-up-popup__stat-gain">
                  {gained ? `+${value}` : '—'}
                </span>
              </div>
            );
          })}
        </div>

        <div className="level-up-popup__hint">Click to dismiss</div>
      </div>
    </div>
  );
}
