import { useGameStore } from '../../stores/gameStore';
import { useT } from '../../i18n/useT';
import '../../styles/ui/boss.css';

export function BossPhaseTransition() {
  const T = useT();
  const transition = useGameStore((s) => s.bossPhaseTransition);
  const dismiss = useGameStore((s) => s.dismissBossPhaseTransition);
  const units = useGameStore((s) => s.units);

  if (!transition) return null;

  const boss = units.get(transition.bossId);
  const lines = transition.dialogue.lines;

  return (
    <div className="boss-phase-transition" data-testid="boss-phase-transition" onClick={dismiss}>
      <div className="boss-phase-transition__overlay" />
      <div className="boss-phase-transition__content">
        <div className="boss-phase-transition__header">
          <span className="boss-phase-transition__boss-name">{boss?.name ?? 'Boss'}</span>
          <span className="boss-phase-transition__phase-label">
            Phase {transition.phaseIndex + 1}
          </span>
        </div>
        <div className="boss-phase-transition__dialogue">
          {lines.map((line, i) => (
            <div key={i} className="boss-phase-transition__line">
              <span className="boss-phase-transition__speaker">{line.speaker}:</span>
              <span className="boss-phase-transition__text">{T.t(line.text)}</span>
            </div>
          ))}
        </div>
        <div className="boss-phase-transition__hint">
          {T.ui('common.clickToContinue', 'Click to continue')}
        </div>
      </div>
    </div>
  );
}
