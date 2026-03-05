import { useGameStore } from '../../stores/gameStore';

export function HealNotification() {
  const healResult = useGameStore((s) => s.healResult);
  const dismissHealResult = useGameStore((s) => s.dismissHealResult);

  if (!healResult) return null;

  return (
    <div
      className="heal-notification"
      data-testid="heal-notification"
      onClick={dismissHealResult}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        background: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div
        className="modal-appear"
        style={{
          background: 'rgba(0, 0, 0, 0.88)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '8px',
          padding: '24px 32px',
          textAlign: 'center',
          minWidth: '240px',
        }}
      >
        <div style={{ fontSize: '18px', color: '#fbbf24', marginBottom: '12px' }}>
          Healed
        </div>
        <div style={{ fontSize: '14px', color: 'white', marginBottom: '8px' }}>
          {healResult.healerName} → {healResult.targetName}
        </div>
        <div style={{ fontSize: '16px', color: '#22c55e' }}>
          HP: {healResult.hpBefore} → {healResult.hpAfter}
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', marginTop: '12px' }}>
          Click to continue
        </div>
      </div>
    </div>
  );
}
