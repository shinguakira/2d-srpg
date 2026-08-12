import { useGameStore } from '../../stores/gameStore';
import { useT } from '../../i18n/useT';

export function MapBossHPBar() {
  const T = useT();
  const mapBossState = useGameStore((s) => s.mapBossState);

  if (!mapBossState) return null;

  const hpPercent = Math.max(0, (mapBossState.currentHp / mapBossState.maxHp) * 100);
  const phaseLabel = `Phase ${mapBossState.currentPhase + 1}/${mapBossState.phases.length}`;

  return (
    <div className="map-boss-hp-bar" data-testid="map-boss-hp-bar">
      <span className="map-boss-hp-bar__label">{T.ui('boss.core', 'Blackflame Core')}</span>
      <div className="map-boss-hp-bar__bar">
        <div className="map-boss-hp-bar__fill" style={{ width: `${hpPercent}%` }} />
      </div>
      <span className="map-boss-hp-bar__text">
        {mapBossState.currentHp}/{mapBossState.maxHp} — {phaseLabel}
      </span>
    </div>
  );
}
