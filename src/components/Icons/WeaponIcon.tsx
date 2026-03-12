import { WEAPON_TYPE_COLORS } from './weaponTypeColors';
import type { WeaponType } from '../../core/types';

/** Inline SVG weapon icon — small 20x20 symbol */
export function WeaponIcon({ type, size = 20 }: { type: WeaponType; size?: number }) {
  const color = WEAPON_TYPE_COLORS[type] ?? '#888';
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ flexShrink: 0 }}>
      {type === 'sword' && (
        <g>
          <line x1="4" y1="16" x2="15" y2="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="15" y1="3" x2="13" y2="6" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="6" y1="12" x2="9" y2="15" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
          <circle cx="4" cy="16" r="1.5" fill="#8B6914" />
        </g>
      )}
      {type === 'lance' && (
        <g>
          <line x1="5" y1="18" x2="14" y2="4" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" />
          <polygon points="14,4 11,7 17,7" fill={color} stroke={color} strokeWidth="0.5" />
          <polygon points="14,1 12,5 16,5" fill="#c0c0c0" />
        </g>
      )}
      {type === 'axe' && (
        <g>
          <line x1="5" y1="17" x2="13" y2="3" stroke="#8B6914" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M10,3 Q16,2 17,7 L13,6 Z" fill={color} stroke={color} strokeWidth="0.5" />
        </g>
      )}
      {type === 'fire' && (
        <g>
          <ellipse cx="10" cy="12" rx="4" ry="6" fill={color} opacity="0.6" />
          <ellipse cx="10" cy="10" rx="2.5" ry="4.5" fill="#fbbf24" opacity="0.8" />
          <ellipse cx="10" cy="9" rx="1.2" ry="2.5" fill="#fff" opacity="0.7" />
        </g>
      )}
      {type === 'thunder' && (
        <g>
          <polygon points="9,2 6,10 9,9 7,18 14,8 11,9 13,2" fill={color} stroke="#d97706" strokeWidth="0.5" />
        </g>
      )}
      {type === 'wind' && (
        <g>
          <path d="M4,7 Q10,4 14,7" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3,11 Q10,8 15,11" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M5,15 Q10,12 13,15" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}
      {type === 'staff' && (
        <g>
          <line x1="10" y1="18" x2="10" y2="5" stroke="#8B6914" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="10" cy="4" r="3" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
          <circle cx="10" cy="4" r="1.2" fill="#fff" opacity="0.7" />
        </g>
      )}
    </svg>
  );
}
