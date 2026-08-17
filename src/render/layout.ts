import { MAP_H, MAP_W } from '../data/chapter1';

export const TILE = 40;
export const CANVAS_W = 960;
export const CANVAS_H = 640;

/**
 * 盤面を映す窓。ここから外は HUD の領分で、カメラが動いてもずれない。
 *
 * 20x14 のマップならちょうど収まる大きさで、カメラを入れる前の見た目と一致する。
 */
export const OX = 80;
export const OY = 40;
export const VIEW_W = 800;
export const VIEW_H = 560;

/**
 * スクロール位置（ピクセル）。GBA の FE と同じで、盤面は画面より大きくてよく、
 * 窓のほうが動く。`specs/story/chapter-scale.md` は 34x24 までを想定していて、
 * どのみち一画面には入らない。
 */
export const camera = { x: 0, y: 0 };

const maxScroll = () => ({
  x: Math.max(0, MAP_W * TILE - VIEW_W),
  y: Math.max(0, MAP_H * TILE - VIEW_H),
});

/** マップの外を映さない。小さいマップでは 0 に張り付く */
function clamp() {
  const m = maxScroll();
  camera.x = Math.min(m.x, Math.max(0, camera.x));
  camera.y = Math.min(m.y, Math.max(0, camera.y));
}

/** 注目点を窓の中に入れるのに必要なスクロール位置 */
function targetFor(tx: number, ty: number) {
  // 端から何マス内側を保つか。カーソルが縁に貼り付く前に動き出す。
  const margin = 3;
  const px = tx * TILE;
  const py = ty * TILE;
  const want = { x: camera.x, y: camera.y };

  const left = px - margin * TILE;
  const right = px + TILE + margin * TILE - VIEW_W;
  if (want.x > left) want.x = left;
  if (want.x < right) want.x = right;

  const top = py - margin * TILE;
  const bottom = py + TILE + margin * TILE - VIEW_H;
  if (want.y > top) want.y = top;
  if (want.y < bottom) want.y = bottom;

  const m = maxScroll();
  want.x = Math.min(m.x, Math.max(0, want.x));
  want.y = Math.min(m.y, Math.max(0, want.y));
  return want;
}

/**
 * 注目点を追う。dt を渡すと滑らかに、省くと即座に合わせる。
 *
 * 追従は指数の緩和なので、カーソルを押しっぱなしにしてもスクロールが置いていか
 * れない程度には速く、1マス動かしただけでは画面が跳ねない。
 */
export function focusOn(tx: number, ty: number, dt?: number) {
  const want = targetFor(tx, ty);
  if (dt === undefined) {
    camera.x = want.x;
    camera.y = want.y;
    return;
  }
  const k = 1 - Math.exp(-12 * dt);
  camera.x += (want.x - camera.x) * k;
  camera.y += (want.y - camera.y) * k;
  // 目標に十分近ければ吸着させる。半端な小数はタイル境界を滲ませる。
  if (Math.abs(want.x - camera.x) < 0.5) camera.x = want.x;
  if (Math.abs(want.y - camera.y) < 0.5) camera.y = want.y;
  clamp();
}

export function screenToTile(sx: number, sy: number) {
  return {
    x: Math.floor((sx - OX + camera.x) / TILE),
    y: Math.floor((sy - OY + camera.y) / TILE),
  };
}
