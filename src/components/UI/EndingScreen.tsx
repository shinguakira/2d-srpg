import { useCampaignStore } from '../../stores/campaignStore';
import { useT } from '../../i18n/useT';
import { getEndingText } from '../../core/endings';

export function EndingScreen() {
  const T = useT();
  const currentEnding = useCampaignStore((s) => s.currentEnding);
  const goToCredits = useCampaignStore((s) => s.goToCredits);

  if (!currentEnding) return null;

  const { title, description } = getEndingText(currentEnding);

  return (
    <div className="ending-screen" data-testid="ending-screen">
      <div className="ending-screen__overlay" />
      <div className="ending-screen__content">
        <div className="ending-screen__type" data-testid="ending-type">
          {currentEnding.toUpperCase()} ENDING
        </div>
        <h1 className="ending-screen__title">{title}</h1>
        <p className="ending-screen__description">{description}</p>
        <button className="ending-screen__btn" data-testid="ending-continue" onClick={goToCredits}>
          {T.ui('common.continue', 'Continue')}
        </button>
      </div>
    </div>
  );
}
