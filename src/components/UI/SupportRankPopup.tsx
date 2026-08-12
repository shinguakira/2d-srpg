import { useEffect } from 'react';
import { useT } from '../../i18n/useT';
import { useGameStore } from '../../stores/gameStore';

export function SupportRankPopup() {
  const T = useT();
  const supportRankUp = useGameStore((s) => s.supportRankUp);
  const dismissSupportRankUp = useGameStore((s) => s.dismissSupportRankUp);
  const units = useGameStore((s) => s.units);

  // Auto-dismiss after 2 seconds
  useEffect(() => {
    if (!supportRankUp) return;
    const timer = setTimeout(dismissSupportRankUp, 2000);
    return () => clearTimeout(timer);
  }, [supportRankUp, dismissSupportRankUp]);

  if (!supportRankUp) return null;

  const unitA = units.get(supportRankUp.unitA);
  const unitB = units.get(supportRankUp.unitB);
  const nameA = unitA?.name ?? supportRankUp.unitA;
  const nameB = unitB?.name ?? supportRankUp.unitB;

  return (
    <div
      className="support-rank-popup"
      data-testid="support-rank-popup"
      onClick={dismissSupportRankUp}
    >
      <div className="support-rank-popup__content">
        <div className="support-rank-popup__title">
          {T.ui('support.rankUp', 'Support Rank Up!')}
        </div>
        <div className="support-rank-popup__names">
          {nameA} & {nameB}
        </div>
        <div className="support-rank-popup__rank">Rank {supportRankUp.rank}</div>
      </div>
    </div>
  );
}
