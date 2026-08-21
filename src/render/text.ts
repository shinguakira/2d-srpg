/**
 * 文字。**game の中の文字はすべてここを通す。**
 *
 * GBA の FE は数字も見出しも本文も同じビットマップフォント一つで書かれていて、
 * 等幅と可変幅が混じることはない。以前はここが場所ごとにばらばらで、同じ画面の
 * 中に Yu Gothic UI と Consolas が並んでいた。
 *
 * DotGothic16 はその時代の日本語ドットゴシック。読み込みは index.html にあり、
 * 落ちたら後ろの並びで描かれる。
 */
const FONT = '"DotGothic16", "Yu Gothic UI", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif';

/**
 * 読み込みを待つ。canvas の文字はフォントが来る前に描くと代替で焼かれるので、
 * 最初の一枚を出す前に一度だけ待つ。落ちても待たずに進む。
 */
export function loadFont(): Promise<unknown> {
  const f = document.fonts;
  if (!f) return Promise.resolve();
  const want = Promise.all([f.load('16px DotGothic16'), f.load('bold 16px DotGothic16')]).catch(() => undefined);
  // 回線が死んでいるときに待ち続けない。1.5 秒で見切って代替で始める
  const giveUp = new Promise((r) => setTimeout(r, 1500));
  return Promise.race([want, giveUp]);
}

export function fontOf(size: number, bold = false) {
  return `${bold ? 'bold ' : ''}${size}px ${FONT}`;
}

export interface TextOpts {
  size?: number;
  color?: string;
  bold?: boolean;
  align?: CanvasTextAlign;
}

/** 縁取りの付いた白抜き文字。FE のフォントは濃い縁取りを持つ */
export function feText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, o: TextOpts = {}) {
  const size = o.size ?? 14;
  ctx.font = fontOf(size, o.bold);
  ctx.textAlign = o.align ?? 'left';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(16,12,24,0.92)';
  ctx.lineWidth = Math.max(2.5, size * 0.3);
  ctx.strokeText(text, x, y);
  ctx.fillStyle = o.color ?? '#ffffff';
  ctx.fillText(text, x, y);
  ctx.textAlign = 'left';
}

/** 縁取りなし。全画面のパネルのように、背景が暗いと分かっている場所で使う */
export function plainText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, o: TextOpts = {}) {
  ctx.save();
  ctx.font = fontOf(o.size ?? 16, o.bold);
  ctx.fillStyle = o.color ?? '#e8eefc';
  ctx.textAlign = o.align ?? 'left';
  ctx.fillText(text, x, y);
  ctx.restore();
}
