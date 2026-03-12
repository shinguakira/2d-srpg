import type { Position } from '../../core/types';

export type Facing = 'down' | 'up' | 'left' | 'right';

export function deriveFacing(from: Position, to: Position): Facing {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (dx === 0 && dy === 0) return 'down';
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'right' : 'left';
  return dy > 0 ? 'down' : 'up';
}
