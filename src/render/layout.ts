export const TILE = 40;
export const OX = 80;
export const OY = 40;
export const CANVAS_W = 960;
export const CANVAS_H = 640;

export function screenToTile(sx: number, sy: number) {
  return { x: Math.floor((sx - OX) / TILE), y: Math.floor((sy - OY) / TILE) };
}
