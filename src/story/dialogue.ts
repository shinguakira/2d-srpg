import { drawFacePortrait } from '../render/sprites';
import type { Unit } from '../types';

export interface Line {
  /** 話者名。省略するとナレーション */
  speaker?: string;
  /** 立ち絵に使うユニット ID */
  who?: string;
  /** 立ち絵の位置 */
  side?: 'left' | 'right';
  text: string;
}

export interface Script {
  id: string;
  /** 画面上部に出る見出し（章タイトルなど） */
  title?: string;
  lines: Line[];
}

const W = 960;
const H = 640;

/** 吹き出し */
const BOX = { x: 64, y: 92, w: 832, h: 186 };
/** 立ち絵（画面下端で切れる） */
const PORTRAIT = { h: 344, leftX: 236, rightX: 724, baseY: 648 };

const PAPER = '#f2e9d2';
const INK = '#33271b';
const FRAME = '#4a3524';

/** 0 遅い / 1 ふつう / 2 速い。オプションがここを書き換える */
const SPEEDS = [22, 42, 90];
let charsPerSec = SPEEDS[1];

export function setTextSpeed(level: number) {
  charsPerSec = SPEEDS[Math.max(0, Math.min(SPEEDS.length - 1, level))];
}

/**
 * FE 風の会話パート。
 * Z/Enter で送り、表示途中なら全文表示。X で早送り。
 */
export class DialogueScene {
  private index = 0;
  private shown = 0;
  private t = 0;
  private wrapped: string[] = [];
  private fast = false;
  done = false;

  constructor(
    public readonly script: Script,
    private readonly resolve: (id: string) => Unit | undefined,
    private readonly onDone: () => void,
  ) {}

  get line(): Line {
    return this.script.lines[Math.min(this.index, this.script.lines.length - 1)];
  }

  private get fullLength(): number {
    return this.line.text.length;
  }

  update(dt: number) {
    if (this.done) return;
    this.t += dt;
    this.shown = Math.min(this.fullLength, this.shown + dt * charsPerSec * (this.fast ? 4 : 1));
  }

  /** Z / クリック */
  advance() {
    if (this.done) return;
    if (this.shown < this.fullLength) {
      this.shown = this.fullLength;
      return;
    }
    this.index += 1;
    this.shown = 0;
    this.fast = false;
    if (this.index >= this.script.lines.length) {
      this.done = true;
      this.onDone();
    }
  }

  /** X 押しっぱなしで早送り */
  skip() {
    this.fast = true;
    this.advance();
  }

  private wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const out: string[] = [];
    let cur = '';
    for (const ch of text) {
      if (ch === '\n') {
        out.push(cur);
        cur = '';
        continue;
      }
      const next = cur + ch;
      if (ctx.measureText(next).width > maxWidth && cur.length) {
        out.push(cur);
        cur = ch;
      } else {
        cur = next;
      }
    }
    out.push(cur);
    return out;
  }

  /** 吹き出しの輪郭（tailX を渡すと下向きのしっぽが付く） */
  private bubblePath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, tailX: number | null) {
    const b = y + h;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, b - r);
    ctx.quadraticCurveTo(x + w, b, x + w - r, b);
    if (tailX !== null) {
      const tx = Math.max(x + r + 40, Math.min(x + w - r - 40, tailX));
      ctx.lineTo(tx + 26, b);
      ctx.lineTo(tx - 6, b + 34);
      ctx.lineTo(tx - 14, b);
    }
    ctx.lineTo(x + r, b);
    ctx.quadraticCurveTo(x, b, x, b - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  draw(ctx: CanvasRenderingContext2D) {
    const line = this.line;

    // 背景（マップを暗く沈ませる）
    ctx.fillStyle = 'rgba(6,9,18,0.72)';
    ctx.fillRect(0, 0, W, H);
    const gg = ctx.createLinearGradient(0, H * 0.45, 0, H);
    gg.addColorStop(0, 'rgba(6,9,18,0)');
    gg.addColorStop(1, 'rgba(4,6,14,0.85)');
    ctx.fillStyle = gg;
    ctx.fillRect(0, H * 0.45, W, H * 0.55);

    // 立ち絵（直近に喋った左右それぞれの人物を出しておく。枠なしで画面下端に立たせる）
    const left = this.lastSpeakerOn('left');
    const right = this.lastSpeakerOn('right');
    if (right) {
      const u = this.resolve(right.who!);
      if (u) drawFacePortrait(ctx, u, PORTRAIT.rightX, PORTRAIT.baseY, PORTRAIT.h, -1, line.side !== 'right');
    }
    if (left) {
      const u = this.resolve(left.who!);
      if (u) drawFacePortrait(ctx, u, PORTRAIT.leftX, PORTRAIT.baseY, PORTRAIT.h, 1, line.side !== 'left');
    }

    // 見出し
    if (this.script.title) {
      ctx.textAlign = 'center';
      ctx.font = 'bold 26px "Yu Gothic UI", sans-serif';
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'rgba(0,0,0,0.8)';
      ctx.strokeText(this.script.title, W / 2, 60);
      ctx.fillStyle = '#f0e6c8';
      ctx.fillText(this.script.title, W / 2, 60);
    }

    // 吹き出し
    const tailX = line.side === 'left' ? PORTRAIT.leftX + 40 : line.side === 'right' ? PORTRAIT.rightX - 40 : null;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 5;
    this.bubblePath(ctx, BOX.x, BOX.y, BOX.w, BOX.h, 22, tailX);
    ctx.fillStyle = PAPER;
    ctx.fill();
    ctx.restore();
    this.bubblePath(ctx, BOX.x, BOX.y, BOX.w, BOX.h, 22, tailX);
    ctx.strokeStyle = FRAME;
    ctx.lineWidth = 4;
    ctx.stroke();

    // 名前プレート
    if (line.speaker) {
      ctx.font = 'bold 18px "Yu Gothic UI", sans-serif';
      const nameW = Math.max(104, ctx.measureText(line.speaker).width + 40);
      ctx.fillStyle = PAPER;
      ctx.strokeStyle = FRAME;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(BOX.x + 26, BOX.y - 20, nameW, 38, 10);
      ctx.fill();
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillStyle = INK;
      ctx.fillText(line.speaker, BOX.x + 26 + nameW / 2, BOX.y + 6);
    }

    // 本文
    ctx.textAlign = 'left';
    ctx.font = '21px "Yu Gothic UI", sans-serif';
    this.wrapped = this.wrap(ctx, line.text, BOX.w - 76);
    let remain = Math.floor(this.shown);
    let ly = BOX.y + 66;
    let lastX = BOX.x + 38;
    let lastY = ly;
    ctx.fillStyle = line.speaker ? INK : '#4a3a28';
    for (const row of this.wrapped) {
      if (remain <= 0) break;
      const part = row.slice(0, remain);
      remain -= row.length;
      ctx.fillText(part, BOX.x + 38, ly);
      lastX = BOX.x + 38 + ctx.measureText(part).width;
      lastY = ly;
      ly += 34;
    }

    // 送りマーク（文末に出る）
    if (this.shown >= this.fullLength && Math.floor(this.t * 3) % 2 === 0) {
      ctx.fillStyle = '#4a86c8';
      ctx.strokeStyle = '#25476e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lastX + 12, lastY - 12);
      ctx.lineTo(lastX + 28, lastY - 12);
      ctx.lineTo(lastX + 20, lastY - 1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.textAlign = 'center';
    ctx.font = '12px "Yu Gothic UI", sans-serif';
    ctx.fillStyle = 'rgba(200,214,240,0.45)';
    ctx.fillText('Z / クリック で送る ・ X で早送り', W / 2, H - 12);
    ctx.textAlign = 'left';
  }

  private lastSpeakerOn(side: 'left' | 'right'): Line | undefined {
    for (let i = Math.min(this.index, this.script.lines.length - 1); i >= 0; i--) {
      const l = this.script.lines[i];
      if (l.side === side && l.who) return l;
    }
    return undefined;
  }
}
