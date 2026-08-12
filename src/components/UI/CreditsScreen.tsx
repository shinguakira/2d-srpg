import { useCampaignStore } from '../../stores/campaignStore';
import { useT } from '../../i18n/useT';
import { getCreditsRoster } from '../../core/endings';
import { BattleSprite } from '../Combat/BattleSprite';

export function CreditsScreen() {
  const T = useT();
  const endingsSeen = useCampaignStore((s) => s.endingsSeen);
  const startNewGamePlus = useCampaignStore((s) => s.startNewGamePlus);
  const goToTitle = useCampaignStore((s) => s.goToTitle);
  const roster = useCampaignStore((s) => s.roster);
  const deadUnitIds = useCampaignStore((s) => s.deadUnitIds);
  const unitProgress = useCampaignStore((s) => s.unitProgress);

  const partyRoster = getCreditsRoster(roster, deadUnitIds);

  return (
    <div className="credits-screen" data-testid="credits-screen">
      <div className="credits-screen__content">
        <h1 className="credits-screen__title">{T.ui('credits.title', 'Credits')}</h1>

        {/* Party still image — roster composition varies by deaths + recruits */}
        <div className="credits-screen__party" data-testid="credits-party">
          <h2 className="credits-screen__section-title">{T.ui('credits.party', 'Your Party')}</h2>
          <div className="credits-screen__party-grid">
            {partyRoster.map(({ id, alive }) => {
              const progress = unitProgress[id];
              return (
                <div
                  key={id}
                  className={`credits-screen__party-member ${!alive ? 'credits-screen__party-member--fallen' : ''}`}
                  data-testid={`credits-unit-${id}`}
                >
                  <BattleSprite classId={progress?.classId ?? 'lord'} faction="player" />
                  <span className="credits-screen__party-name">{id}</span>
                  {!alive && (
                    <span className="credits-screen__party-fallen">
                      {T.ui('prep.fallen', 'Fallen')}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="credits-screen__endings">
          <h2 className="credits-screen__section-title">
            {T.ui('credits.endings', 'Endings Discovered')}
          </h2>
          <div className="credits-screen__ending-list">
            {(['perfect', 'true', 'bittersweet', 'tragic'] as const).map((type) => (
              <div
                key={type}
                className={`credits-screen__ending-badge ${endingsSeen.includes(type) ? 'credits-screen__ending-badge--seen' : ''}`}
              >
                {endingsSeen.includes(type) ? type.toUpperCase() : '???'}
              </div>
            ))}
          </div>
        </div>

        <div className="credits-screen__actions">
          <button
            className="credits-screen__btn credits-screen__btn--ngplus"
            data-testid="new-game-plus"
            onClick={startNewGamePlus}
          >
            New Game+
          </button>
          <button className="credits-screen__btn" data-testid="credits-title" onClick={goToTitle}>
            {T.ui('common.returnToTitle', 'Return to Title')}
          </button>
        </div>
      </div>
    </div>
  );
}
