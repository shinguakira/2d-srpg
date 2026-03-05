import { useEffect, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useUIStore } from '../../stores/uiStore';
import { CLASSES } from '../../data/classes';
import { getTerrainData } from '../../core/terrain';
import { BattleSprite } from '../Combat/BattleSprite';

const STAT_LABELS: Record<string, string> = {
  hp: 'HP', str: 'STR', mag: 'MAG', skl: 'SKL',
  spd: 'SPD', def: 'DEF', res: 'RES', lck: 'LCK', mov: 'MOV',
};

const WEAPON_TYPE_COLORS: Record<string, string> = {
  sword: '#3b82f6',
  lance: '#22c55e',
  axe: '#ef4444',
  fire: '#f97316',
  thunder: '#eab308',
  wind: '#22d3ee',
  staff: '#e2e8f0',
};

export function UnitDetailScreen() {
  const detailUnitId = useUIStore((s) => s.detailUnitId);
  const setDetailUnitId = useUIStore((s) => s.setDetailUnitId);
  const units = useGameStore((s) => s.units);
  const getTileAt = useGameStore((s) => s.getTileAt);

  const close = useCallback(() => setDetailUnitId(null), [setDetailUnitId]);

  // Close on Escape
  useEffect(() => {
    if (!detailUnitId) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        e.stopPropagation();
        close();
      }
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [detailUnitId, close]);

  if (!detailUnitId) return null;

  const unit = units.get(detailUnitId);
  if (!unit) return null;

  const cls = CLASSES[unit.classId];
  const tile = getTileAt(unit.position);
  const terrain = tile ? getTerrainData(tile.terrain) : null;

  const hpPercent = unit.currentHp / unit.stats.hp;
  const hpColor = hpPercent > 0.5 ? '#22c55e' : hpPercent > 0.25 ? '#eab308' : '#ef4444';

  const statEntries = [
    ['str', unit.stats.str], ['mag', unit.stats.mag],
    ['skl', unit.stats.skl], ['spd', unit.stats.spd],
    ['def', unit.stats.def], ['res', unit.stats.res],
    ['lck', unit.stats.lck], ['mov', unit.stats.mov],
  ] as const;

  return (
    <div
      className="unit-detail-backdrop"
      data-testid="unit-detail-screen"
      onClick={close}
      style={{
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.9)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 350,
        animation: 'modal-appear 0.3s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
          border: '2px solid rgba(251,191,36,0.3)',
          borderRadius: 12,
          padding: '24px 32px',
          color: '#fff',
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          maxWidth: 500,
          width: '90%',
          animation: 'modal-appear 0.3s ease',
        }}
      >
        {/* Header with sprite and name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <BattleSprite classId={unit.classId} faction={unit.faction} />
          <div>
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>
              {unit.name}
              {unit.aiBehavior?.type === 'boss' && (
                <span style={{ marginLeft: 8, fontSize: 11, background: 'rgba(251,191,36,0.2)', color: '#fbbf24', padding: '2px 6px', borderRadius: 3, verticalAlign: 'middle' }}>Boss</span>
              )}
            </div>
            <div style={{ fontSize: 14, opacity: 0.6 }}>
              {cls?.name ?? unit.classId} Lv.{unit.level}
            </div>
            {/* HP bar */}
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 13, color: hpColor, fontWeight: 'bold' }}>
                HP {unit.currentHp}/{unit.stats.hp}
              </div>
              <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden', maxWidth: 120 }}>
                <div style={{ width: `${hpPercent * 100}%`, height: '100%', background: hpColor, borderRadius: 3, transition: 'width 0.3s' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Stats</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 20px' }}>
            {statEntries.map(([key, val]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.5, width: 32, textTransform: 'uppercase' }}>{STAT_LABELS[key]}</span>
                <span style={{ fontSize: 14, fontWeight: 600, width: 24 }}>{val}</span>
                <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (val / 30) * 100)}%`, height: '100%', background: 'rgba(59,130,246,0.4)', borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment section */}
        <div style={{ marginBottom: terrain ? 16 : 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Equipment</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {unit.inventory.map((weapon, i) => {
              const isEquipped = weapon.id === unit.equippedWeapon.id;
              const typeColor = WEAPON_TYPE_COLORS[weapon.type] ?? '#e2e8f0';
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '6px 10px', borderRadius: 5,
                  background: isEquipped ? 'rgba(251,191,36,0.06)' : 'rgba(255,255,255,0.03)',
                  border: isEquipped ? '1px solid rgba(251,191,36,0.3)' : '1px solid rgba(255,255,255,0.05)',
                }}>
                  <span style={{ color: typeColor, fontWeight: 600, fontSize: 14, minWidth: 100 }}>
                    {weapon.name}
                    {isEquipped && <span style={{ marginLeft: 6, fontSize: 10, color: '#fbbf24', background: 'rgba(251,191,36,0.2)', padding: '0 4px', borderRadius: 2 }}>E</span>}
                  </span>
                  <span style={{ fontSize: 12, opacity: 0.6 }}>
                    Mt {weapon.might} Hit {weapon.hit} Crit {weapon.crit} Rng {weapon.minRange}-{weapon.maxRange}
                  </span>
                </div>
              );
            })}
            {unit.items.map((item, i) => (
              <div key={`item-${i}`} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '6px 10px', borderRadius: 5,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <span style={{ color: '#22c55e', fontWeight: 600, fontSize: 14 }}>{item.name}</span>
                <span style={{ fontSize: 12, opacity: 0.5 }}>({item.uses}/{item.maxUses})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Terrain section */}
        {terrain && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Terrain</div>
            <div style={{ fontSize: 14, display: 'flex', gap: 16 }}>
              <span style={{ fontWeight: 600 }}>{terrain.name}</span>
              {terrain.defenseBonus > 0 && <span style={{ color: '#3b82f6' }}>DEF +{terrain.defenseBonus}</span>}
              {terrain.avoidBonus > 0 && <span style={{ color: '#22c55e' }}>AVO +{terrain.avoidBonus}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
