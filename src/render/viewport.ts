import { CANVAS_H, CANVAS_W } from './layout';

/**
 * 画面に canvas を合わせる係。スマホで遊べるようにするための層で、やることは二つ。
 *
 * - 表示できる限り大きく引き伸ばす（等倍のままだと 960x640 が指には小さすぎる）
 * - 縦持ちのときは 90 度回す。盤面は横長なので、回したほうが 2 倍以上大きく映る
 *
 * 回すと `getBoundingClientRect()` は回転後の外接矩形を返すので、指の座標を
 * canvas の座標に戻すのはここの仕事になる。`toCanvas` を通さずに clientX を
 * 使うと縦持ちで全部ずれる。
 */

let rotated = false;

/** 指で触る端末か。`?touch=1` を付ければ PC でも同じ UI を出せる */
export function detectTouch() {
  if (new URLSearchParams(location.search).get('touch') === '1') return true;
  return matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
}

export function fitCanvas(canvas: HTMLCanvasElement) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  rotated = vh > vw;
  // 回すと縦横が入れ替わるので、使える幅と高さも入れ替えて縮尺を決める
  const availW = rotated ? vh : vw;
  const availH = rotated ? vw : vh;
  const scale = Math.min(availW / CANVAS_W, availH / CANVAS_H);
  canvas.style.width = `${Math.round(CANVAS_W * scale)}px`;
  canvas.style.height = `${Math.round(CANVAS_H * scale)}px`;
  canvas.style.transform = rotated ? 'translate(-50%,-50%) rotate(90deg)' : 'translate(-50%,-50%)';
}

/** 画面の座標を canvas の座標へ。回転していてもいなくても同じ顔で答える */
export function toCanvas(canvas: HTMLCanvasElement, clientX: number, clientY: number) {
  const r = canvas.getBoundingClientRect();
  if (!rotated) {
    return {
      x: ((clientX - r.left) / r.width) * CANVAS_W,
      y: ((clientY - r.top) / r.height) * CANVAS_H,
    };
  }
  // 回転後の外接矩形は縦横が入れ替わっている。中心まわりに 90 度戻す
  const preW = r.height;
  const preH = r.width;
  const ccx = r.left + r.width / 2;
  const ccy = r.top + r.height / 2;
  const u = clientY - ccy + preW / 2;
  const v = ccx - clientX + preH / 2;
  return { x: (u / preW) * CANVAS_W, y: (v / preH) * CANVAS_H };
}
