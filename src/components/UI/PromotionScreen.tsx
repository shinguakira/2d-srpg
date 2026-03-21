import { useState } from 'react';
import type { UnitClass, UnitStats } from '../../core/types';
import { PROMOTION_BONUSES } from '../../data/promotedClasses';
import { BattleSprite } from '../Combat/BattleSprite';

type Props = {
  unitName: string;
  options: UnitClass[];
  onConfirm: (classId: string) => void;
  onCancel: () => void;
};

const STAT_LABELS: (keyof UnitStats)[] = ['hp', 'str', 'mag', 'def', 'res', 'spd', 'skl', 'lck', 'mov'];

export function PromotionScreen({ unitName, options, onConfirm, onCancel }: Props) {
  const [selected, setSelected] = useState<string | null>(options.length === 1 ? options[0].id : null);
  const isMaster = options.some((cls) => cls.tier === 'master');

  return (
    <div className={`promotion-screen ${isMaster ? 'promotion-screen--master' : ''}`} data-testid="promotion-screen">
      <div className={`promotion-screen__title ${isMaster ? 'promotion-screen__title--master' : ''}`}>
        {isMaster ? 'Master Promotion' : `Promote ${unitName}`}
      </div>
      <div className="promotion-screen__subtitle">
        {isMaster ? `${unitName} ascends to a Master Class` : 'Choose a promotion path'}
      </div>

      <div className="promotion-screen__options">
        {options.map((cls, i) => {
          const bonuses = PROMOTION_BONUSES[cls.id] ?? {};
          return (
            <div
              key={cls.id}
              className={`promotion-screen__option ${selected === cls.id ? 'promotion-screen__option--selected' : ''}`}
              data-testid={`promotion-option-${i === 0 ? 'a' : 'b'}`}
              onClick={() => setSelected(cls.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BattleSprite classId={cls.id} faction="player" />
                <div>
                  <span className="promotion-screen__option-name">{cls.name}</span>
                  <span className="promotion-screen__option-tier">{cls.tier}</span>
                </div>
              </div>

              <div className="promotion-screen__stat-deltas">
                {STAT_LABELS.map((stat) => {
                  const val = bonuses[stat] ?? 0;
                  if (val === 0) return null;
                  return (
                    <div
                      key={stat}
                      className={`promotion-screen__stat-delta ${val > 0 ? 'promotion-screen__stat-delta--positive' : 'promotion-screen__stat-delta--negative'}`}
                    >
                      {stat.toUpperCase()} {val > 0 ? '+' : ''}{val}
                    </div>
                  );
                })}
              </div>

              {cls.weaponTypes && (
                <div className="promotion-screen__weapons">
                  Weapons: {cls.weaponTypes.join(', ')}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="promotion-screen__actions">
        <button
          className="promotion-screen__confirm"
          data-testid="promotion-confirm"
          disabled={!selected}
          onClick={() => selected && onConfirm(selected)}
        >
          Confirm
        </button>
        <button
          className="promotion-screen__cancel"
          data-testid="promotion-cancel"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
