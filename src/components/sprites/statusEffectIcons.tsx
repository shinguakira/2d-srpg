import type { ReactElement } from 'react';
import type { StatusEffect, StatusEffectType } from '../../core/types';

const STATUS_EFFECT_PRIORITY: StatusEffectType[] = [
  'panic',
  'poison',
  'dazed',
  'atk_break',
  'def_break',
  'spd_break',
  'mov_break',
];

const STATUS_EFFECT_COLORS: Record<StatusEffectType, string> = {
  panic: '#ef4444',
  poison: '#a855f7',
  dazed: '#eab308',
  atk_break: '#ef4444',
  def_break: '#ef4444',
  spd_break: '#f97316',
  mov_break: '#f97316',
};

const MAX_VISIBLE = 3;

export function sortAndTruncateEffects(effects: StatusEffect[]): StatusEffect[] {
  const sorted = [...effects].sort(
    (a, b) => STATUS_EFFECT_PRIORITY.indexOf(a.type) - STATUS_EFFECT_PRIORITY.indexOf(b.type),
  );
  return sorted.slice(0, MAX_VISIBLE);
}

export function renderStatusIcon(type: StatusEffectType): ReactElement {
  const color = STATUS_EFFECT_COLORS[type];
  switch (type) {
    case 'panic':
      // Exclamation mark
      return (
        <g fill={color}>
          <rect x="3.25" y="1" width="1.5" height="4" rx="0.5" />
          <rect x="3.25" y="6" width="1.5" height="1.5" rx="0.5" />
        </g>
      );
    case 'poison':
      // Droplet
      return <path d="M4 1 Q6.5 4 4 7 Q1.5 4 4 1Z" fill={color} />;
    case 'dazed':
      // Spiral
      return (
        <g fill="none" stroke={color} strokeWidth="0.8" strokeLinecap="round">
          <path d="M4 5 A1 1 0 1 1 4 3 A2 2 0 1 0 4 7" />
        </g>
      );
    case 'atk_break':
      // Broken sword — two angled segments with gap
      return (
        <g stroke={color} strokeWidth="1" strokeLinecap="round" fill="none">
          <line x1="2" y1="7" x2="3.5" y2="4.5" />
          <line x1="4.5" y1="3.5" x2="6" y2="1" />
        </g>
      );
    case 'def_break':
      // Broken shield — shield outline with crack
      return (
        <g fill="none" stroke={color} strokeWidth="0.8">
          <path d="M4 1 L1.5 2.5 L1.5 4.5 Q1.5 7 4 7.5 Q6.5 7 6.5 4.5 L6.5 2.5 Z" />
          <line x1="3" y1="3" x2="5" y2="5.5" strokeWidth="0.9" />
        </g>
      );
    case 'spd_break':
      // Snail silhouette
      return (
        <g fill={color}>
          <ellipse cx="4.5" cy="5" rx="2.5" ry="2" />
          <circle cx="3" cy="3" r="1.2" />
          <line x1="2.5" y1="2" x2="2" y2="1" stroke={color} strokeWidth="0.6" />
          <line x1="3.5" y1="2" x2="4" y2="1" stroke={color} strokeWidth="0.6" />
        </g>
      );
    case 'mov_break':
      // Chain links
      return (
        <g fill="none" stroke={color} strokeWidth="0.9" strokeLinecap="round">
          <ellipse cx="3" cy="3.5" rx="1.5" ry="2" />
          <ellipse cx="5" cy="4.5" rx="1.5" ry="2" />
        </g>
      );
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}
