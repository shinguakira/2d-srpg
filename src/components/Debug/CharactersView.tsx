import { PLAYER_UNITS, ENEMY_UNITS } from '../../data/units';
import { CLASSES } from '../../data/classes';
import { BattleSprite } from '../Combat/BattleSprite';
import { WeaponIcon } from '../Icons/WeaponIcon';
import { ItemIcon } from '../Icons/ItemIcon';
import { WEAPON_TYPE_COLORS } from '../Icons/weaponTypeColors';
import type { Unit } from '../../core/types';

const ALL_UNITS = Object.values({ ...PLAYER_UNITS, ...ENEMY_UNITS });

export function CharactersView({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const selected = selectedId ? ALL_UNITS.find((u) => u.id === selectedId) : null;

  return (
    <div className="debug-screen__split">
      <div className="debug-screen__list">
        {ALL_UNITS.map((unit) => (
          <button
            key={unit.id}
            className={`debug-screen__entry ${unit.id === selectedId ? 'debug-screen__entry--selected' : ''}`}
            data-testid={`debug-unit-${unit.id}`}
            onClick={() => onSelect(unit.id)}
          >
            <div className="debug-screen__entry-sprite">
              <BattleSprite classId={unit.classId} faction={unit.faction} />
            </div>
            <div className="debug-screen__entry-info">
              <span className="debug-screen__entry-name">{unit.name}</span>
              <span className="debug-screen__entry-meta">
                <span
                  className="debug-screen__badge"
                  style={{ background: unit.faction === 'player' ? '#3b82f6' : '#ef4444' }}
                >
                  {unit.faction}
                </span>
                <span className="debug-screen__entry-class">
                  {CLASSES[unit.classId]?.name ?? unit.classId} Lv.{unit.level}
                </span>
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="debug-screen__detail">
        {selected ? <UnitDetail unit={selected} /> : <EmptyDetail />}
      </div>
    </div>
  );
}

function UnitDetail({ unit }: { unit: Unit }) {
  const cls = CLASSES[unit.classId];

  return (
    <div data-testid={`debug-detail-${unit.id}`}>
      <div className="debug-screen__detail-header">
        <div className="debug-screen__portrait" data-testid={`debug-portrait-${unit.id}`}>
          <BattleSprite classId={unit.classId} faction={unit.faction} />
        </div>
        <div className="debug-screen__detail-header-info">
          <h2 className="debug-screen__detail-name">{unit.name}</h2>
          <span className="debug-screen__detail-class">
            {cls?.name ?? unit.classId} — Level {unit.level}
          </span>
          <div className="debug-screen__detail-badges">
            <span
              className="debug-screen__badge debug-screen__badge--large"
              style={{ background: unit.faction === 'player' ? '#3b82f6' : '#ef4444' }}
            >
              {unit.faction}
            </span>
            {unit.isLord && (
              <span className="debug-screen__badge debug-screen__badge--large" style={{ background: '#d97706' }}>
                Lord
              </span>
            )}
            {unit.aiBehavior && (
              <span className="debug-screen__badge debug-screen__badge--large" style={{ background: '#7c3aed' }}>
                AI: {unit.aiBehavior.type}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* HP bar */}
      <div className="debug-screen__hp-section">
        <div className="debug-screen__hp-label">
          HP: {unit.currentHp}/{unit.stats.hp}
        </div>
        <div className="debug-screen__hp-bar-track">
          <div
            className="debug-screen__hp-bar-fill"
            style={{ width: `${(unit.currentHp / unit.stats.hp) * 100}%` }}
          />
        </div>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Base Stats</h3>
        <div className="debug-screen__stats-grid">
          {(Object.entries(unit.stats) as [string, number][]).map(([key, val]) => (
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

      {cls && (
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
                  <div
                    className="debug-screen__growth-fill"
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">
          Equipment ({unit.inventory.length} weapon{unit.inventory.length !== 1 ? 's' : ''}{unit.items.length > 0 ? `, ${unit.items.length} item${unit.items.length !== 1 ? 's' : ''}` : ''})
        </h3>
        <div className="debug-screen__inventory">
          {unit.inventory.map((weapon, i) => {
            const isEquipped = weapon.id === unit.equippedWeapon.id && i === 0;
            return (
              <div
                key={`${weapon.id}-${i}`}
                className={`debug-screen__inv-item ${isEquipped ? 'debug-screen__inv-item--equipped' : ''}`}
              >
                <WeaponIcon type={weapon.type} size={24} />
                <span className="debug-screen__inv-name">
                  {weapon.name}
                  {isEquipped && <span className="debug-screen__equipped-tag">E</span>}
                </span>
                <span
                  className="debug-screen__badge debug-screen__badge--small"
                  style={{ background: WEAPON_TYPE_COLORS[weapon.type] ?? '#888' }}
                >
                  {weapon.type}
                </span>
                <span className="debug-screen__inv-stats">
                  Mt {weapon.might} / Hit {weapon.hit} / Wt {weapon.weight} / Rng {weapon.minRange}-{weapon.maxRange}
                </span>
              </div>
            );
          })}
          {unit.items.map((item, i) => (
            <div
              key={`item-${item.id}-${i}`}
              className="debug-screen__inv-item debug-screen__inv-item--consumable"
            >
              <ItemIcon item={item} size={24} />
              <span className="debug-screen__inv-name" style={{ color: '#22c55e' }}>
                {item.name}
              </span>
              <span className="debug-screen__inv-uses">
                ({item.uses}/{item.maxUses})
              </span>
              <span className="debug-screen__inv-stats">
                Heals {item.effect.amount} HP
              </span>
            </div>
          ))}
        </div>
      </div>

      {unit.deathQuote && (
        <div className="debug-screen__section">
          <h3 className="debug-screen__section-title">Death Quote</h3>
          <div className="debug-screen__death-quote">
            "{unit.deathQuote}"
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyDetail() {
  return <div className="debug-screen__empty">Select an entry to view details</div>;
}
