import { useState, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';

type Props = {
  roster: string[];
  onConfirm: (teamA: string[], teamB: string[]) => void;
};

export function TeamSelectionScreen({ roster, onConfirm }: Props) {
  const units = useGameStore((s) => s.units);
  const [teamA, setTeamA] = useState<string[]>(() => {
    // Default: first half to A, second half to B. Ren always on A.
    const renIdx = roster.indexOf('ren');
    const half = Math.ceil(roster.length / 2);
    const a = roster.slice(0, half);
    if (renIdx >= half) {
      // Swap ren into team A
      a.push('ren');
    }
    return [...new Set(a)];
  });

  const teamB = roster.filter((id) => !teamA.includes(id));

  const toggleUnit = useCallback(
    (unitId: string) => {
      if (unitId === 'ren') return; // Ren stays on Team A
      setTeamA((prev) => {
        if (prev.includes(unitId)) {
          // Move to B (if A still has 2+)
          if (prev.length <= 2) return prev;
          return prev.filter((id) => id !== unitId);
        } else {
          // Move to A (if B still has 2+)
          const currentB = roster.filter((id) => !prev.includes(id) && id !== unitId);
          if (currentB.length < 2) return prev;
          return [...prev, unitId];
        }
      });
    },
    [roster],
  );

  const canConfirm = teamA.length >= 2 && teamB.length >= 2;

  return (
    <div className="team-selection" data-testid="team-selection">
      <h2 className="team-selection__title">Split Party — Assign Teams</h2>

      <div className="team-selection__teams">
        <div className="team-selection__team">
          <h3 className="team-selection__team-label">Team A</h3>
          <div className="team-selection__slots">
            {teamA.map((id) => {
              const unit = units.get(id);
              return (
                <button
                  key={id}
                  className="team-selection__slot team-selection__slot--a"
                  data-testid="team-a-slot"
                  onClick={() => toggleUnit(id)}
                  disabled={id === 'ren'}
                >
                  {unit?.name ?? id}
                  {id === 'ren' && <span className="team-selection__lock">★</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="team-selection__team">
          <h3 className="team-selection__team-label">Team B</h3>
          <div className="team-selection__slots">
            {teamB.map((id) => {
              const unit = units.get(id);
              return (
                <button
                  key={id}
                  className="team-selection__slot team-selection__slot--b"
                  data-testid="team-b-slot"
                  onClick={() => toggleUnit(id)}
                >
                  {unit?.name ?? id}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        className="team-selection__confirm"
        data-testid="team-selection-confirm"
        disabled={!canConfirm}
        onClick={() => onConfirm(teamA, teamB)}
      >
        Confirm Teams
      </button>
    </div>
  );
}
