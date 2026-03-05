import { useGameStore } from '../../stores/gameStore';

export function DeathQuoteOverlay() {
  const deathQuote = useGameStore((s) => s.deathQuote);
  const dismissDeathQuote = useGameStore((s) => s.dismissDeathQuote);

  if (!deathQuote) return null;

  return (
    <div
      className="death-quote-overlay"
      data-testid="death-quote-overlay"
      onClick={dismissDeathQuote}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 250,
        background: 'rgba(0, 0, 0, 0.6)',
      }}
    >
      <div
        className="death-quote-panel modal-appear"
        style={{
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          borderRadius: '8px',
          padding: '32px 40px',
          maxWidth: '400px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '17px',
            color: 'rgba(255, 255, 255, 0.8)',
            fontStyle: 'italic',
            lineHeight: 1.6,
            marginBottom: '16px',
          }}
        >
          &ldquo;{deathQuote.quote}&rdquo;
        </div>
        <div
          style={{
            fontSize: '14px',
            color: '#fbbf24',
            textAlign: 'right',
          }}
        >
          &mdash; {deathQuote.unitName}
        </div>
        <div
          style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.4)',
            fontStyle: 'italic',
            marginTop: '16px',
          }}
        >
          Click to continue
        </div>
      </div>
    </div>
  );
}
