import { useEffect, useCallback, useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useUIStore } from '../../stores/uiStore';
import { ALL_CLASSES } from '../../data/promotedClasses';
import { SKILLS, getSkillActivationText } from '../../data/skills';
import { getTerrainData } from '../../core/terrain';
import { BattleSprite } from '../Combat/BattleSprite';
import { getDurabilityColor } from '../../core/items';

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  str: 'STR',
  mag: 'MAG',
  skl: 'SKL',
  spd: 'SPD',
  def: 'DEF',
  res: 'RES',
  lck: 'LCK',
  mov: 'MOV',
};

const GROWTH_STAT_KEYS = ['hp', 'str', 'mag', 'skl', 'spd', 'def', 'res', 'lck'] as const;

const WEAPON_TYPE_COLORS: Record<string, string> = {
  sword: '#3b82f6',
  lance: '#22c55e',
  axe: '#ef4444',
  fire: '#f97316',
  thunder: '#eab308',
  wind: '#22d3ee',
  staff: '#e2e8f0',
  light: '#fef08a',
  dark: '#a855f7',
  bow: '#a3e635',
  knife: '#94a3b8',
};

function getGrowthColor(rate: number): string {
  if (rate >= 60) return '#22c55e';
  if (rate >= 30) return '#eab308';
  return '#ef4444';
}

export function UnitDetailScreen() {
  const detailUnitId = useUIStore((s) => s.detailUnitId);
  const setDetailUnitId = useUIStore((s) => s.setDetailUnitId);
  const units = useGameStore((s) => s.units);
  const getTileAt = useGameStore((s) => s.getTileAt);
  const [showGrowths, setShowGrowths] = useState(false);

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

  const cls = ALL_CLASSES[unit.classId];
  const tile = getTileAt(unit.position);
  const terrain = tile ? getTerrainData(tile.terrain) : null;

  const hpPercent = unit.currentHp / unit.stats.hp;
  const hpColor = hpPercent > 0.5 ? '#22c55e' : hpPercent > 0.25 ? '#eab308' : '#ef4444';

  const statEntries = [
    ['str', unit.stats.str],
    ['mag', unit.stats.mag],
    ['skl', unit.stats.skl],
    ['spd', unit.stats.spd],
    ['def', unit.stats.def],
    ['res', unit.stats.res],
    ['lck', unit.stats.lck],
    ['mov', unit.stats.mov],
  ] as const;

  // Growth rates (Task 9)
  const growthRates = cls?.growthRates;
  const statCaps = cls?.statCaps as Record<string, number> | undefined;

  // Promotion paths (Task 10)
  const promotesTo = cls?.promotesTo as string[] | undefined;
  const isMasterTier = cls?.tier === 'master';

  // Boss phases (Task 8)
  const bossPhases = unit.bossPhases;
  const currentBossPhase = unit.currentBossPhase ?? 0;

  const sectionHeader = {
    fontSize: 12,
    fontWeight: 700 as const,
    color: '#fbbf24',
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: 8,
  };

  return (
    <div
      className="unit-detail-backdrop"
      data-testid="unit-detail-screen"
      onClick={close}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(2px)',
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
          maxWidth: 700,
          width: '92%',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'modal-appear 0.3s ease',
        }}
      >
        {/* Header with sprite and name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <BattleSprite classId={unit.classId} faction={unit.faction} />
          <div>
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>
              {unit.name}
              {unit.aiBehavior?.type === 'boss' && (
                <span
                  style={{
                    marginLeft: 8,
                    fontSize: 11,
                    background: 'rgba(251,191,36,0.2)',
                    color: '#fbbf24',
                    padding: '2px 6px',
                    borderRadius: 3,
                    verticalAlign: 'middle',
                  }}
                >
                  Boss
                </span>
              )}
            </div>
            <div style={{ fontSize: 14, opacity: 0.6 }}>
              {cls?.name ?? unit.classId} Lv.{unit.level}
              {cls?.tier && (
                <span
                  style={{
                    marginLeft: 6,
                    fontSize: 10,
                    background:
                      cls.tier === 'master'
                        ? 'rgba(168,85,247,0.2)'
                        : cls.tier === 'promoted'
                          ? 'rgba(59,130,246,0.2)'
                          : 'rgba(255,255,255,0.1)',
                    color:
                      cls.tier === 'master'
                        ? '#a855f7'
                        : cls.tier === 'promoted'
                          ? '#60a5fa'
                          : '#94a3b8',
                    padding: '1px 5px',
                    borderRadius: 3,
                    textTransform: 'capitalize',
                  }}
                >
                  {cls.tier}
                </span>
              )}
            </div>
            {/* HP bar */}
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 13, color: hpColor, fontWeight: 'bold' }}>
                HP {unit.currentHp}/{unit.stats.hp}
              </div>
              <div
                style={{
                  flex: 1,
                  height: 6,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  maxWidth: 120,
                }}
              >
                <div
                  style={{
                    width: `${hpPercent * 100}%`,
                    height: '100%',
                    background: hpColor,
                    borderRadius: 3,
                    transition: 'width 0.3s',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div style={{ marginBottom: 20 }}>
          <div style={sectionHeader}>Stats</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 20px' }}>
            {statEntries.map(([key, val]) => (
              <div
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '3px 8px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 3,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    opacity: 0.5,
                    width: 32,
                    textTransform: 'uppercase',
                  }}
                >
                  {STAT_LABELS[key]}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, width: 24 }}>{val}</span>
                <div
                  style={{
                    flex: 1,
                    height: 3,
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(100, (val / 30) * 100)}%`,
                      height: '100%',
                      background: 'rgba(59,130,246,0.4)',
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Rates (Task 9) — collapsible */}
        {growthRates && (
          <div style={{ marginBottom: 16 }} data-testid="growth-rates">
            <div
              style={{ ...sectionHeader, cursor: 'pointer', marginBottom: showGrowths ? 8 : 0 }}
              onClick={() => setShowGrowths(!showGrowths)}
            >
              {showGrowths ? '- Growth Rates' : '+ Growth Rates'}
            </div>
            {showGrowths && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 20px' }}>
                {GROWTH_STAT_KEYS.map((key) => {
                  const rate = (growthRates as Record<string, number>)[key] ?? 0;
                  const cap = statCaps?.[key];
                  return (
                    <div
                      key={key}
                      data-testid={`growth-${key}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '2px 8px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: 3,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          opacity: 0.5,
                          width: 32,
                          textTransform: 'uppercase',
                        }}
                      >
                        {STAT_LABELS[key] ?? key.toUpperCase()}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          width: 32,
                          color: getGrowthColor(rate),
                        }}
                      >
                        {rate}%
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 3,
                          background: 'rgba(255,255,255,0.08)',
                          borderRadius: 2,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${rate}%`,
                            height: '100%',
                            background: getGrowthColor(rate),
                            borderRadius: 2,
                            opacity: 0.6,
                          }}
                        />
                      </div>
                      {cap != null && <span style={{ fontSize: 9, opacity: 0.4 }}>Cap {cap}</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Equipment section */}
        <div style={{ marginBottom: 16 }}>
          <div style={sectionHeader}>Equipment</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {unit.inventory.map((weapon, i) => {
              const isEquipped = weapon.id === unit.equippedWeapon.id;
              const typeColor = WEAPON_TYPE_COLORS[weapon.type] ?? '#e2e8f0';
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '6px 10px',
                    borderRadius: 5,
                    background: isEquipped ? 'rgba(251,191,36,0.06)' : 'rgba(255,255,255,0.03)',
                    border: isEquipped
                      ? '1px solid rgba(251,191,36,0.3)'
                      : '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <span style={{ color: typeColor, fontWeight: 600, fontSize: 14, minWidth: 100 }}>
                    {weapon.name}
                    {isEquipped && (
                      <span
                        style={{
                          marginLeft: 6,
                          fontSize: 10,
                          color: '#fbbf24',
                          background: 'rgba(251,191,36,0.2)',
                          padding: '0 4px',
                          borderRadius: 2,
                        }}
                      >
                        E
                      </span>
                    )}
                  </span>
                  <span style={{ fontSize: 12, opacity: 0.6 }}>
                    Mt {weapon.might} Hit {weapon.hit} Crit {weapon.crit} Rng {weapon.minRange}-
                    {weapon.maxRange}
                    {weapon.durability != null && weapon.maxDurability != null && (
                      <span
                        data-testid="weapon-durability"
                        style={{
                          marginLeft: 4,
                          color: getDurabilityColor(weapon.durability),
                          opacity: 1,
                        }}
                      >
                        Uses {weapon.durability}/{weapon.maxDurability}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
            {unit.items.map((item, i) => (
              <div
                key={`item-${i}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '6px 10px',
                  borderRadius: 5,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <span style={{ color: '#22c55e', fontWeight: 600, fontSize: 14 }}>{item.name}</span>
                <span style={{ fontSize: 12, opacity: 0.5 }}>
                  ({item.uses}/{item.maxUses})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Class Path / Promotion Preview (Task 10) */}
        {cls && (
          <div style={{ marginBottom: 16 }} data-testid="class-path">
            <div style={sectionHeader}>Class Path</div>
            {isMasterTier ? (
              <div style={{ fontSize: 13, opacity: 0.6, fontStyle: 'italic' }}>
                Master tier reached
              </div>
            ) : promotesTo && promotesTo.length > 0 ? (
              <div
                style={{
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 4,
                }}
              >
                <span style={{ opacity: 0.6 }}>{cls.name} →</span>
                {promotesTo.map((targetId, i) => {
                  const target = ALL_CLASSES[targetId];
                  if (!target) return null;
                  const newWeapons = ((target.weaponTypes as string[]) ?? []).filter(
                    (w: string) => !((cls.weaponTypes as string[]) ?? []).includes(w),
                  );
                  return (
                    <span key={targetId} data-testid={`promotion-option-${targetId}`}>
                      {i > 0 && <span style={{ opacity: 0.4, margin: '0 4px' }}>|</span>}
                      <span style={{ fontWeight: 600 }}>{target.name}</span>
                      {newWeapons.length > 0 && (
                        <span style={{ fontSize: 11, marginLeft: 4 }}>
                          (adds{' '}
                          {newWeapons
                            .map((w: string) => (
                              <span key={w} style={{ color: WEAPON_TYPE_COLORS[w] ?? '#e2e8f0' }}>
                                {w}
                              </span>
                            ))
                            .reduce(
                              (prev: any, curr: any, idx: number) =>
                                idx === 0 ? [curr] : [...prev, ', ', curr],
                              [],
                            )}
                          )
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            ) : (
              <div style={{ fontSize: 13, opacity: 0.6, fontStyle: 'italic' }}>
                No promotions available
              </div>
            )}
          </div>
        )}

        {/* Skills section with descriptions (Task 2) */}
        {(unit.skills?.length > 0 || (cls?.innateSkills?.length ?? 0) > 0) && (
          <div style={{ marginBottom: 16 }}>
            <div style={sectionHeader}>Skills</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {cls?.innateSkills?.map((sid) => {
                const skill = SKILLS[sid];
                if (!skill) return null;
                const activation = getSkillActivationText(skill, unit.stats);
                return (
                  <div
                    key={sid}
                    data-testid={`skill-description-${sid}`}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      border: '1px solid #4b5563',
                      background: '#1a1a2e',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>
                        {skill.name}
                      </span>
                      <span style={{ fontSize: 10, color: '#6b7280' }}>Innate</span>
                      <span style={{ fontSize: 10, color: '#64748b', marginLeft: 'auto' }}>
                        {activation}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                      {skill.description}
                    </div>
                  </div>
                );
              })}
              {unit.skills?.map((sid) => {
                const skill = SKILLS[sid];
                if (!skill) return null;
                const activation = getSkillActivationText(skill, unit.stats);
                return (
                  <div
                    key={sid}
                    data-testid={`skill-description-${sid}`}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      border: '1px solid #3b82f6',
                      background: '#1e3a5f',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, color: '#93c5fd', fontWeight: 600 }}>
                        {skill.name}
                      </span>
                      <span style={{ fontSize: 10, color: '#64748b', marginLeft: 'auto' }}>
                        {activation}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: '#93c5fd', opacity: 0.7, marginTop: 2 }}>
                      {skill.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Boss Phases (Task 8) */}
        {bossPhases && bossPhases.length > 0 && (
          <div style={{ marginBottom: 16 }} data-testid="boss-phase-info">
            <div style={sectionHeader}>Boss Phases</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {bossPhases.map((phase, i) => {
                const isCurrent = i === currentBossPhase;
                const parts: string[] = [];
                if (phase.immunity)
                  parts.push(`${phase.immunity === 'physical' ? 'Physical' : 'Magical'} Immunity`);
                if (phase.selfHeal) parts.push(`Heal ${phase.selfHeal}/turn`);
                if (phase.weaponId) parts.push(`Weapon: ${phase.weaponId}`);
                if (phase.statChanges) {
                  const changes = Object.entries(phase.statChanges)
                    .filter(([, v]) => v !== 0)
                    .map(([k, v]) => `${k.toUpperCase()} ${(v as number) > 0 ? '+' : ''}${v}`)
                    .join(', ');
                  if (changes) parts.push(changes);
                }
                return (
                  <div
                    key={i}
                    data-testid={`boss-phase-tick-${i}`}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                      background: isCurrent ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.03)',
                      border: isCurrent
                        ? '1px solid rgba(251,191,36,0.4)'
                        : '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <span style={{ fontWeight: 600, color: isCurrent ? '#fbbf24' : '#fff' }}>
                      Phase {i + 1}{' '}
                      {phase.hpThreshold > 0 ? `(${phase.hpThreshold}% HP)` : '(Start)'}
                    </span>
                    {isCurrent && (
                      <span style={{ fontSize: 10, color: '#fbbf24', marginLeft: 6 }}>Current</span>
                    )}
                    {parts.length > 0 && (
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 }}>
                        {parts.join(' | ')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Terrain section */}
        {terrain && (
          <div>
            <div style={sectionHeader}>Terrain</div>
            <div style={{ fontSize: 14, display: 'flex', gap: 16 }}>
              <span style={{ fontWeight: 600 }}>{terrain.name}</span>
              {terrain.defenseBonus > 0 && (
                <span style={{ color: '#3b82f6' }}>DEF +{terrain.defenseBonus}</span>
              )}
              {terrain.avoidBonus > 0 && (
                <span style={{ color: '#22c55e' }}>AVO +{terrain.avoidBonus}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
