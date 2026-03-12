import { PLAYER_UNITS, ENEMY_UNITS } from '../../data/units';
import { WEAPONS } from '../../data/weapons';
import { ITEMS } from '../../data/items';
import { BattleSprite } from '../Combat/BattleSprite';
import { WeaponIcon } from '../Icons/WeaponIcon';
import { ItemIcon } from '../Icons/ItemIcon';
import { WEAPON_TYPE_COLORS } from '../Icons/weaponTypeColors';
import type { Weapon, ConsumableItem } from '../../core/types';

const ALL_UNITS = Object.values({ ...PLAYER_UNITS, ...ENEMY_UNITS });
const ALL_WEAPONS = Object.values(WEAPONS);
const ALL_CONSUMABLES = Object.values(ITEMS);

export function ItemsView({
  selectedId,
  onSelect,
  subTab,
  onSubTabChange,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
  subTab: 'weapons' | 'consumables';
  onSubTabChange: (tab: 'weapons' | 'consumables') => void;
}) {
  const selectedWeapon = subTab === 'weapons' && selectedId ? ALL_WEAPONS.find((w) => w.id === selectedId) : null;
  const selectedConsumable = subTab === 'consumables' && selectedId ? ALL_CONSUMABLES.find((c) => c.id === selectedId) : null;

  return (
    <div className="debug-screen__split">
      <div className="debug-screen__list">
        <div className="debug-screen__sub-tabs">
          <button
            className={`debug-screen__sub-tab ${subTab === 'weapons' ? 'debug-screen__sub-tab--active' : ''}`}
            data-testid="debug-subtab-weapons"
            onClick={() => {
              onSubTabChange('weapons');
              onSelect(ALL_WEAPONS[0]?.id ?? '');
            }}
          >
            Weapons ({ALL_WEAPONS.length})
          </button>
          <button
            className={`debug-screen__sub-tab ${subTab === 'consumables' ? 'debug-screen__sub-tab--active' : ''}`}
            data-testid="debug-subtab-consumables"
            onClick={() => {
              onSubTabChange('consumables');
              onSelect(ALL_CONSUMABLES[0]?.id ?? '');
            }}
          >
            Consumables ({ALL_CONSUMABLES.length})
          </button>
        </div>

        {subTab === 'weapons' ? (
          ALL_WEAPONS.map((weapon) => (
            <button
              key={weapon.id}
              className={`debug-screen__entry ${weapon.id === selectedId ? 'debug-screen__entry--selected' : ''}`}
              data-testid={`debug-weapon-${weapon.id}`}
              onClick={() => onSelect(weapon.id)}
            >
              <WeaponIcon type={weapon.type} size={24} />
              <div className="debug-screen__entry-info">
                <span className="debug-screen__entry-name">{weapon.name}</span>
                <span className="debug-screen__entry-meta">
                  <span
                    className="debug-screen__badge"
                    style={{ background: WEAPON_TYPE_COLORS[weapon.type] ?? '#888' }}
                  >
                    {weapon.type}
                  </span>
                  <span className="debug-screen__entry-class">Mt {weapon.might}</span>
                </span>
              </div>
            </button>
          ))
        ) : (
          ALL_CONSUMABLES.map((item) => (
            <button
              key={item.id}
              className={`debug-screen__entry ${item.id === selectedId ? 'debug-screen__entry--selected' : ''}`}
              data-testid={`debug-item-${item.id}`}
              onClick={() => onSelect(item.id)}
            >
              <ItemIcon item={item} size={24} />
              <div className="debug-screen__entry-info">
                <span className="debug-screen__entry-name">{item.name}</span>
                <span className="debug-screen__entry-meta">
                  <span className="debug-screen__badge" style={{ background: '#22c55e' }}>
                    consumable
                  </span>
                  <span className="debug-screen__entry-class">({item.uses}/{item.maxUses})</span>
                </span>
              </div>
            </button>
          ))
        )}
      </div>

      <div className="debug-screen__detail">
        {selectedWeapon ? (
          <WeaponDetail weapon={selectedWeapon} />
        ) : selectedConsumable ? (
          <ConsumableDetail item={selectedConsumable} />
        ) : (
          <EmptyDetail />
        )}
      </div>
    </div>
  );
}

function WeaponDetail({ weapon }: { weapon: Weapon }) {
  return (
    <div data-testid={`debug-detail-${weapon.id}`}>
      <div className="debug-screen__detail-header">
        <div className="debug-screen__weapon-icon-large">
          <WeaponIcon type={weapon.type} size={48} />
        </div>
        <div className="debug-screen__detail-header-info">
          <h2 className="debug-screen__detail-name">{weapon.name}</h2>
          <span
            className="debug-screen__badge debug-screen__badge--large"
            style={{ background: WEAPON_TYPE_COLORS[weapon.type] ?? '#888' }}
          >
            {weapon.type}
          </span>
        </div>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Weapon Stats</h3>
        <div className="debug-screen__stats-grid">
          <div className="debug-screen__stat-row">
            <span className="debug-screen__stat-label">Might</span>
            <span className="debug-screen__stat-value">{weapon.might}</span>
            <div className="debug-screen__stat-bar-track">
              <div className="debug-screen__stat-bar-fill debug-screen__stat-bar-fill--red" style={{ width: `${Math.min(100, (weapon.might / 15) * 100)}%` }} />
            </div>
          </div>
          <div className="debug-screen__stat-row">
            <span className="debug-screen__stat-label">Hit</span>
            <span className="debug-screen__stat-value">{weapon.hit}%</span>
            <div className="debug-screen__stat-bar-track">
              <div className="debug-screen__stat-bar-fill debug-screen__stat-bar-fill--blue" style={{ width: `${weapon.hit}%` }} />
            </div>
          </div>
          <div className="debug-screen__stat-row">
            <span className="debug-screen__stat-label">Crit</span>
            <span className="debug-screen__stat-value">{weapon.crit}%</span>
            <div className="debug-screen__stat-bar-track">
              <div className="debug-screen__stat-bar-fill debug-screen__stat-bar-fill--gold" style={{ width: `${Math.min(100, weapon.crit * 5)}%` }} />
            </div>
          </div>
          <div className="debug-screen__stat-row">
            <span className="debug-screen__stat-label">Weight</span>
            <span className="debug-screen__stat-value">{weapon.weight}</span>
            <div className="debug-screen__stat-bar-track">
              <div className="debug-screen__stat-bar-fill debug-screen__stat-bar-fill--gray" style={{ width: `${Math.min(100, (weapon.weight / 15) * 100)}%` }} />
            </div>
          </div>
          <div className="debug-screen__stat-row">
            <span className="debug-screen__stat-label">Range</span>
            <span className="debug-screen__stat-value">
              {weapon.minRange === weapon.maxRange
                ? weapon.minRange
                : `${weapon.minRange}-${weapon.maxRange}`}
            </span>
          </div>
        </div>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Used By</h3>
        <div className="debug-screen__used-by">
          {ALL_UNITS.filter((u) => u.inventory.some((w) => w.id === weapon.id)).map((u) => (
            <span key={u.id} className="debug-screen__used-by-chip">
              <BattleSprite classId={u.classId} faction={u.faction} />
              <span>{u.name}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConsumableDetail({ item }: { item: ConsumableItem }) {
  return (
    <div data-testid={`debug-detail-${item.id}`}>
      <div className="debug-screen__detail-header">
        <div className="debug-screen__weapon-icon-large">
          <ItemIcon item={item} size={48} />
        </div>
        <div className="debug-screen__detail-header-info">
          <h2 className="debug-screen__detail-name">{item.name}</h2>
          <span className="debug-screen__badge debug-screen__badge--large" style={{ background: '#22c55e' }}>
            consumable
          </span>
        </div>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Item Stats</h3>
        <div className="debug-screen__stats-grid">
          <div className="debug-screen__stat-row">
            <span className="debug-screen__stat-label">Uses</span>
            <span className="debug-screen__stat-value">{item.uses}/{item.maxUses}</span>
          </div>
          <div className="debug-screen__stat-row">
            <span className="debug-screen__stat-label">Effect</span>
            <span className="debug-screen__stat-value" style={{ color: '#22c55e' }}>
              Heal {item.effect.amount} HP
            </span>
          </div>
        </div>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Carried By</h3>
        <div className="debug-screen__used-by">
          {ALL_UNITS.filter((u) => u.items.some((it) => it.id === item.id)).map((u) => (
            <span key={u.id} className="debug-screen__used-by-chip">
              <BattleSprite classId={u.classId} faction={u.faction} />
              <span>{u.name}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyDetail() {
  return <div className="debug-screen__empty">Select an entry to view details</div>;
}
