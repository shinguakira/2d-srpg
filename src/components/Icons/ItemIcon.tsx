import type { ConsumableItem } from '../../core/types';

/** Inline SVG consumable item icon */
export function ItemIcon({ item, size = 20 }: { item: ConsumableItem; size?: number }) {
  if (item.effect.kind === 'heal') {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" style={{ flexShrink: 0 }}>
        {/* Potion bottle */}
        <rect x="7" y="8" width="6" height="9" rx="2" fill="#22c55e" stroke="#166534" strokeWidth="0.8" />
        <rect x="8" y="5" width="4" height="4" rx="1" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
        <rect x="9" y="3" width="2" height="2.5" rx="0.5" fill="#94a3b8" />
        {/* Shine */}
        <rect x="8.5" y="9" width="1.5" height="4" rx="0.5" fill="rgba(255,255,255,0.4)" />
        {/* Cross */}
        <rect x="9" y="10" width="2" height="5" rx="0.3" fill="rgba(255,255,255,0.5)" />
        <rect x="7.5" y="11.5" width="5" height="2" rx="0.3" fill="rgba(255,255,255,0.5)" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ flexShrink: 0 }}>
      <rect x="4" y="4" width="12" height="12" rx="2" fill="#64748b" stroke="#475569" strokeWidth="0.8" />
      <text x="10" y="13" textAnchor="middle" fill="#e2e8f0" fontSize="8">?</text>
    </svg>
  );
}
