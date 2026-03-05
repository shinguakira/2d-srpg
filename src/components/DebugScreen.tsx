import { useState } from 'react';
import { useCampaignStore } from '../stores/campaignStore';
import { PLAYER_UNITS, ENEMY_UNITS } from '../data/units';
import { WEAPONS } from '../data/weapons';
import { ITEMS } from '../data/items';
import { CLASSES } from '../data/classes';
import { BattleSprite } from './Combat/BattleSprite';
import type { Unit, Weapon, ConsumableItem, WeaponType } from '../core/types';

type Tab = 'characters' | 'items';

const ALL_UNITS = Object.values({ ...PLAYER_UNITS, ...ENEMY_UNITS });
const ALL_WEAPONS = Object.values(WEAPONS);
const ALL_CONSUMABLES = Object.values(ITEMS);

const WEAPON_TYPE_COLORS: Record<string, string> = {
  sword: '#60a5fa',
  lance: '#34d399',
  axe: '#f87171',
  fire: '#fb923c',
  thunder: '#facc15',
  wind: '#a3e635',
  staff: '#e2e8f0',
};

/** Inline SVG weapon icon — small 20x20 symbol */
function WeaponIcon({ type, size = 20 }: { type: WeaponType; size?: number }) {
  const color = WEAPON_TYPE_COLORS[type] ?? '#888';
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ flexShrink: 0 }}>
      {type === 'sword' && (
        <g>
          <line x1="4" y1="16" x2="15" y2="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="15" y1="3" x2="13" y2="6" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="6" y1="12" x2="9" y2="15" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
          <circle cx="4" cy="16" r="1.5" fill="#8B6914" />
        </g>
      )}
      {type === 'lance' && (
        <g>
          <line x1="5" y1="18" x2="14" y2="4" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" />
          <polygon points="14,4 11,7 17,7" fill={color} stroke={color} strokeWidth="0.5" />
          <polygon points="14,1 12,5 16,5" fill="#c0c0c0" />
        </g>
      )}
      {type === 'axe' && (
        <g>
          <line x1="5" y1="17" x2="13" y2="3" stroke="#8B6914" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M10,3 Q16,2 17,7 L13,6 Z" fill={color} stroke={color} strokeWidth="0.5" />
        </g>
      )}
      {type === 'fire' && (
        <g>
          <ellipse cx="10" cy="12" rx="4" ry="6" fill={color} opacity="0.6" />
          <ellipse cx="10" cy="10" rx="2.5" ry="4.5" fill="#fbbf24" opacity="0.8" />
          <ellipse cx="10" cy="9" rx="1.2" ry="2.5" fill="#fff" opacity="0.7" />
        </g>
      )}
      {type === 'thunder' && (
        <g>
          <polygon points="9,2 6,10 9,9 7,18 14,8 11,9 13,2" fill={color} stroke="#d97706" strokeWidth="0.5" />
        </g>
      )}
      {type === 'wind' && (
        <g>
          <path d="M4,7 Q10,4 14,7" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3,11 Q10,8 15,11" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M5,15 Q10,12 13,15" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}
      {type === 'staff' && (
        <g>
          <line x1="10" y1="18" x2="10" y2="5" stroke="#8B6914" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="10" cy="4" r="3" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
          <circle cx="10" cy="4" r="1.2" fill="#fff" opacity="0.7" />
        </g>
      )}
    </svg>
  );
}

/** Inline SVG consumable item icon */
function ItemIcon({ item, size = 20 }: { item: ConsumableItem; size?: number }) {
  if (item.effect.kind === 'heal') {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" style={{ flexShrink: 0 }}>
        {/* Potion bottle */}
        <rect x="7" y="8" width="6" height="9" rx="2" fill="#22c55e" stroke="#166534" strokeWidth="0.8" />
        <rect x="8" y="5" width="4" height="4" rx="1" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
        <rect x="9" y="3" width="2" height="2.5" rx="0.5" fill="#94a3b8" />
        {/* Shine */}
        <rect x="8.5" y="9" width="1.5" height="4" rx="0.5" fill="rgba(255,255,255,0.4)" />
        {/* Cross */}
        <rect x="9" y="10" width="2" height="5" rx="0.3" fill="rgba(255,255,255,0.5)" />
        <rect x="7.5" y="11.5" width="5" height="2" rx="0.3" fill="rgba(255,255,255,0.5)" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ flexShrink: 0 }}>
      <rect x="4" y="4" width="12" height="12" rx="2" fill="#64748b" stroke="#475569" strokeWidth="0.8" />
      <text x="10" y="13" textAnchor="middle" fill="#e2e8f0" fontSize="8">?</text>
    </svg>
  );
}

export function DebugScreen() {
  const goToTitle = useCampaignStore((s) => s.goToTitle);
  const [tab, setTab] = useState<Tab>('characters');
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(ALL_UNITS[0]?.id ?? null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(ALL_WEAPONS[0]?.id ?? null);
  const [itemSubTab, setItemSubTab] = useState<'weapons' | 'consumables'>('weapons');

  return (
    <div className="debug-screen" data-testid="debug-screen">
      <div className="debug-screen__header">
        <h1 className="debug-screen__title">Debug Database</h1>
        <button
          className="debug-screen__back"
          data-testid="debug-back"
          onClick={goToTitle}
        >
          Back
        </button>
      </div>

      <div className="debug-screen__tabs">
        <button
          className={`debug-screen__tab ${tab === 'characters' ? 'debug-screen__tab--active' : ''}`}
          data-testid="debug-tab-characters"
          onClick={() => setTab('characters')}
        >
          Characters
        </button>
        <button
          className={`debug-screen__tab ${tab === 'items' ? 'debug-screen__tab--active' : ''}`}
          data-testid="debug-tab-items"
          onClick={() => setTab('items')}
        >
          Items
        </button>
      </div>

      <div className="debug-screen__content">
        {tab === 'characters' ? (
          <CharactersView
            selectedId={selectedUnitId}
            onSelect={setSelectedUnitId}
          />
        ) : (
          <ItemsView
            selectedId={selectedItemId}
            onSelect={setSelectedItemId}
            subTab={itemSubTab}
            onSubTabChange={setItemSubTab}
          />
        )}
      </div>
    </div>
  );
}

function CharactersView({
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

function ItemsView({
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
