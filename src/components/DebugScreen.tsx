import { useState } from 'react';
import { useCampaignStore } from '../stores/campaignStore';
import { PLAYER_UNITS, ENEMY_UNITS } from '../data/units';
import { WEAPONS } from '../data/weapons';
import { CLASSES } from '../data/classes';
import type { Unit, Weapon } from '../core/types';

type Tab = 'characters' | 'items';

const ALL_UNITS = Object.values({ ...PLAYER_UNITS, ...ENEMY_UNITS });
const ALL_WEAPONS = Object.values(WEAPONS);

const WEAPON_TYPE_COLORS: Record<string, string> = {
  sword: '#60a5fa',
  lance: '#34d399',
  axe: '#f87171',
  fire: '#fb923c',
  thunder: '#facc15',
  wind: '#a3e635',
};

export function DebugScreen() {
  const goToTitle = useCampaignStore((s) => s.goToTitle);
  const [tab, setTab] = useState<Tab>('characters');
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(ALL_UNITS[0]?.id ?? null);
  const [selectedWeaponId, setSelectedWeaponId] = useState<string | null>(ALL_WEAPONS[0]?.id ?? null);

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
            selectedId={selectedWeaponId}
            onSelect={setSelectedWeaponId}
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
        <h2 className="debug-screen__detail-name">{unit.name}</h2>
        <span className="debug-screen__detail-class">
          {cls?.name ?? unit.classId} — Level {unit.level}
        </span>
        <span
          className="debug-screen__badge debug-screen__badge--large"
          style={{ background: unit.faction === 'player' ? '#3b82f6' : '#ef4444' }}
        >
          {unit.faction}
        </span>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Base Stats</h3>
        <div className="debug-screen__stats-grid">
          {(Object.entries(unit.stats) as [string, number][]).map(([key, val]) => (
            <div key={key} className="debug-screen__stat-row">
              <span className="debug-screen__stat-label">{key.toUpperCase()}</span>
              <span className="debug-screen__stat-value">{val}</span>
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
          Inventory ({unit.inventory.length})
        </h3>
        <div className="debug-screen__inventory">
          {unit.inventory.map((weapon, i) => {
            const isEquipped = weapon.id === unit.equippedWeapon.id && i === 0;
            return (
              <div
                key={`${weapon.id}-${i}`}
                className={`debug-screen__inv-item ${isEquipped ? 'debug-screen__inv-item--equipped' : ''}`}
              >
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
        </div>
      </div>
    </div>
  );
}

function ItemsView({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const selected = selectedId ? ALL_WEAPONS.find((w) => w.id === selectedId) : null;

  return (
    <div className="debug-screen__split">
      <div className="debug-screen__list">
        {ALL_WEAPONS.map((weapon) => (
          <button
            key={weapon.id}
            className={`debug-screen__entry ${weapon.id === selectedId ? 'debug-screen__entry--selected' : ''}`}
            data-testid={`debug-weapon-${weapon.id}`}
            onClick={() => onSelect(weapon.id)}
          >
            <span className="debug-screen__entry-name">{weapon.name}</span>
            <span className="debug-screen__entry-meta">
              <span
                className="debug-screen__badge"
                style={{ background: WEAPON_TYPE_COLORS[weapon.type] ?? '#888' }}
              >
                {weapon.type}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="debug-screen__detail">
        {selected ? <WeaponDetail weapon={selected} /> : <EmptyDetail />}
      </div>
    </div>
  );
}

function WeaponDetail({ weapon }: { weapon: Weapon }) {
  return (
    <div data-testid={`debug-detail-${weapon.id}`}>
      <div className="debug-screen__detail-header">
        <h2 className="debug-screen__detail-name">{weapon.name}</h2>
        <span
          className="debug-screen__badge debug-screen__badge--large"
          style={{ background: WEAPON_TYPE_COLORS[weapon.type] ?? '#888' }}
        >
          {weapon.type}
        </span>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Weapon Stats</h3>
        <div className="debug-screen__stats-grid">
          <div className="debug-screen__stat-row">
            <span className="debug-screen__stat-label">Might</span>
            <span className="debug-screen__stat-value">{weapon.might}</span>
          </div>
          <div className="debug-screen__stat-row">
            <span className="debug-screen__stat-label">Hit</span>
            <span className="debug-screen__stat-value">{weapon.hit}%</span>
          </div>
          <div className="debug-screen__stat-row">
            <span className="debug-screen__stat-label">Crit</span>
            <span className="debug-screen__stat-value">{weapon.crit}%</span>
          </div>
          <div className="debug-screen__stat-row">
            <span className="debug-screen__stat-label">Weight</span>
            <span className="debug-screen__stat-value">{weapon.weight}</span>
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
            <span key={u.id} className="debug-screen__used-by-unit">
              {u.name}
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
