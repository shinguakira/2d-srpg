import { useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';

export function ReinforcementBanner() {
  const message = useGameStore((s) => s.reinforcementMessage);
  const dismiss = useGameStore((s) => s.dismissReinforcementMessage);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(dismiss, 2000);
    return () => clearTimeout(timer);
  }, [message, dismiss]);

  if (!message) return null;

  return (
    <div
      className="reinforcement-banner"
      data-testid="reinforcement-banner"
      onClick={dismiss}
      style={{
        position: 'fixed',
        top: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 450,
        background: 'rgba(239, 68, 68, 0.15)',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        borderRadius: '8px',
        padding: '12px 24px',
        backdropFilter: 'blur(4px)',
        animation: 'slide-down 0.3s ease-out',
      }}
    >
      <span style={{
        color: '#ef4444',
        fontSize: '20px',
        fontWeight: 'bold',
        letterSpacing: '2px',
        textTransform: 'uppercase',
      }}>
        {message}
      </span>
    </div>
  );
}
