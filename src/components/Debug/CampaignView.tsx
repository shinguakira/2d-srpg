import { useCampaignStore } from '../../stores/campaignStore';

export function CampaignView() {
  const currentScreen = useCampaignStore((s) => s.currentScreen);
  const currentChapterId = useCampaignStore((s) => s.currentChapterId);
  const completedChapters = useCampaignStore((s) => s.completedChapters);
  const roster = useCampaignStore((s) => s.roster);
  const deployedUnitIds = useCampaignStore((s) => s.deployedUnitIds);
  const deadUnitIds = useCampaignStore((s) => s.deadUnitIds);
  const gameMode = useCampaignStore((s) => s.gameMode);
  const difficulty = useCampaignStore((s) => s.difficulty);
  const gold = useCampaignStore((s) => s.gold);
  const forgeMaterials = useCampaignStore((s) => s.forgeMaterials);
  const bonusExp = useCampaignStore((s) => s.bonusExp);
  const supportPairs = useCampaignStore((s) => s.supportPairs);
  const campaignFlags = useCampaignStore((s) => s.campaignFlags);
  const endingsSeen = useCampaignStore((s) => s.endingsSeen);
  const newGamePlusUnlocked = useCampaignStore((s) => s.newGamePlusUnlocked);
  const storage = useCampaignStore((s) => s.storage);

  return (
    <div className="debug-screen__reference" data-testid="debug-campaign-view">
      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Progress</h3>
        <p className="debug-screen__desc-text">Current screen: <span style={{ color: '#fbbf24', fontWeight: 700 }}>{currentScreen}</span></p>
        <p className="debug-screen__desc-text">Current chapter: <span style={{ color: '#fbbf24', fontWeight: 700 }}>{currentChapterId ?? 'None'}</span></p>
        <p className="debug-screen__desc-text">Completed chapters: {completedChapters.length > 0 ? (
          completedChapters.map((ch) => (
            <span key={ch} className="debug-screen__badge" style={{ background: '#22c55e', marginRight: 4 }}>{ch}</span>
          ))
        ) : 'None'}</p>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Roster ({roster.length})</h3>
        <p className="debug-screen__desc-text">
          {roster.length > 0 ? roster.join(', ') : 'Empty'}
        </p>
        {deployedUnitIds.length > 0 && (
          <p className="debug-screen__desc-text">
            Deployed ({deployedUnitIds.length}): {deployedUnitIds.join(', ')}
          </p>
        )}
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Dead Units</h3>
        <p className="debug-screen__desc-text">
          {deadUnitIds.length > 0 ? deadUnitIds.map((id) => (
            <span key={id} className="debug-screen__badge" style={{ background: '#ef4444', marginRight: 4 }}>{id}</span>
          )) : <span style={{ color: '#22c55e' }}>None</span>}
        </p>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Settings</h3>
        <p className="debug-screen__desc-text">Game mode: <span style={{ fontWeight: 700 }}>{gameMode}</span></p>
        <p className="debug-screen__desc-text">Difficulty: <span style={{ fontWeight: 700 }}>{difficulty}</span></p>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Economy</h3>
        <p className="debug-screen__desc-text">Gold: <span style={{ color: '#fbbf24', fontWeight: 700 }}>{gold}</span></p>
        <p className="debug-screen__desc-text">Forge materials: {forgeMaterials.length > 0 ? forgeMaterials.join(', ') : 'None'}</p>
        <p className="debug-screen__desc-text">Bonus EXP pool: <span style={{ color: '#22c55e', fontWeight: 700 }}>{bonusExp}</span></p>
      </div>

      {supportPairs.length > 0 && (
        <div className="debug-screen__section">
          <h3 className="debug-screen__section-title">Support Pairs ({supportPairs.length})</h3>
          <table className="debug-screen__table">
            <thead>
              <tr><th>Unit A</th><th>Unit B</th><th>Points</th><th>Rank</th></tr>
            </thead>
            <tbody>
              {supportPairs.map((sp, i) => (
                <tr key={i}>
                  <td>{sp.unitA}</td>
                  <td>{sp.unitB}</td>
                  <td>{sp.points}</td>
                  <td><span className="debug-screen__badge" style={{ background: '#d97706' }}>{sp.rank}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Campaign Flags</h3>
        {Object.keys(campaignFlags).length > 0 ? (
          <table className="debug-screen__table">
            <thead>
              <tr><th>Key</th><th>Value</th></tr>
            </thead>
            <tbody>
              {Object.entries(campaignFlags).map(([key, val]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{String(val)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="debug-screen__desc-text">No flags set.</p>
        )}
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Endings</h3>
        <p className="debug-screen__desc-text">
          Endings seen: {endingsSeen.length > 0 ? endingsSeen.map((e) => (
            <span key={e} className="debug-screen__badge" style={{ background: '#a855f7', marginRight: 4 }}>{e}</span>
          )) : 'None'}
        </p>
        <p className="debug-screen__desc-text">
          NG+ unlocked: <span style={{ color: newGamePlusUnlocked ? '#22c55e' : '#ef4444', fontWeight: 700 }}>{newGamePlusUnlocked ? 'Yes' : 'No'}</span>
        </p>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Storage</h3>
        <p className="debug-screen__desc-text">
          {storage.length > 0 ? storage.join(', ') : 'Empty'}
        </p>
      </div>
    </div>
  );
}
