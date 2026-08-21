import type { Game } from '../game/game';
import { CANVAS_W } from './layout';
import { fontOf } from './text';

/**
 * 指で遊ぶための画面上のボタン。GBA に十字キーと A/B があったのと同じ理由で、
 * 盤面を叩くだけでは足りないものをここに置く。
 *
 * 置き場所は盤面の外の余白 —— 左右 80px の柱と下の帯 —— に限る。盤面は
 * `OX/OY + VIEW_W/VIEW_H` で切り抜かれていて、そこへ被せると駒が読めなくなる。
 * カーソル移動はボタンではなく「盤面をなぞる」で行う（`main.ts`）。
 */

export interface PadButton {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  on?: boolean;
}

/** 指で触っているか。`?touch=1` でも立つので PC でも確認できる */
export let touchUI = false;

export function setTouchUI(v: boolean) {
  touchUI = v;
}

const B = 72;
const GAP = 12;
/** 一番下のボタンの底。盤面の下端 600 より上に収める */
const BOTTOM = 592;

const left = (row: number, id: string, label: string, on?: boolean): PadButton => ({
  id,
  label,
  x: 6,
  y: BOTTOM - B - row * (B + GAP),
  w: B,
  h: B,
  on,
});

const right = (row: number, id: string, label: string): PadButton => ({
  id,
  label,
  x: CANVAS_W - B - 6,
  y: BOTTOM - B - row * (B + GAP),
  w: B,
  h: B,
});

/**
 * その場面で要るボタンだけを返す。全画面のパネルを開いているあいだは中身を
 * 直接叩けるので「戻る」しか要らない。
 */
export function padFor(g: Game): PadButton[] {
  if (g.dialogue || g.battle || g.result) return [];
  if (g.mode === 'status' || g.mode === 'unit' || g.mode === 'options') {
    return [right(0, 'cancel', '戻る')];
  }
  const pad = [right(0, 'ok', '決定'), right(1, 'cancel', '戻る')];
  if (g.phase !== 'player' || g.busy) return pad;

  // 左の柱は下から積む。使えない場面のボタンは並べない —— 押しても何も
  // 起きないボタンは、盤面のほうが壊れているように見える
  const stack: [string, string, boolean?][] = [];
  if (g.mode === 'free') stack.push(['menu', 'メニュー']);
  stack.push(['info', '詳細']);
  for (const [i, [id, label, on]] of stack.entries()) pad.push(left(i, id, label, on));
  return pad;
}

// -------------------------------------------------------------------- 描画

/** 押した瞬間の光り。反応が見えないと画面が固まったように感じる */
let flash = { id: '', t: 0 };

export function flashPad(id: string) {
  flash = { id, t: 0.16 };
}

export function drawPadButton(ctx: CanvasRenderingContext2D, b: PadButton, dt = 0) {
  if (flash.id === b.id && flash.t > 0) flash.t = Math.max(0, flash.t - dt);
  const lit = (flash.id === b.id && flash.t > 0) || b.on;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(b.x, b.y, b.w, b.h, 10);
  ctx.fillStyle = lit ? 'rgba(90,120,190,0.85)' : 'rgba(14,20,36,0.78)';
  ctx.fill();
  ctx.strokeStyle = lit ? '#ffd24a' : '#5c6d94';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 4 文字（メニュー）でも柱に収まるように、長い札だけ細くする
  const size = b.label.length >= 4 ? 14 : 17;
  ctx.font = fontOf(size);
  ctx.textAlign = 'center';
  ctx.fillStyle = lit ? '#ffffff' : '#cfd9f2';
  ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2 + size / 2 - 1);
  ctx.restore();
}

export function drawPad(ctx: CanvasRenderingContext2D, pad: PadButton[], dt = 0) {
  if (!touchUI) return;
  for (const b of pad) drawPadButton(ctx, b, dt);
}

// ------------------------------------------------------------------ 当たり

/**
 * 指は太いので少しだけ枠より広く取る。ボタン同士は 12px 空けてあるので、
 * この余白でも隣と食い合わない。
 */
const SLOP = 6;

export function hitPad(pad: PadButton[], x: number, y: number) {
  if (!touchUI) return undefined;
  return pad.find((b) => x >= b.x - SLOP && x <= b.x + b.w + SLOP && y >= b.y - SLOP && y <= b.y + b.h + SLOP);
}

export function inRect(x: number, y: number, rx: number, ry: number, rw: number, rh: number) {
  return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
}
