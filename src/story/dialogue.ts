import { drawFacePortrait } from '../render/sprites';
import { fontOf } from '../render/text';
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

/**
 * 一つの章が持つ台本。**章ごとに違うものは全部ここに集める。**
 *
 * 以前は `script.ts` の定数を game が直に import していて、第1章のぶんしか
 * 無かった。第2章をクリアしても「第1章 終了」のミレイユ加入が流れ、ヴィダルも
 * オルリクもハーゲンの台詞を喋っていた。
 *
 * 無いものは黙って飛ばす。塔と魔物の群れには台本が無いので、勝てばそのまま
 * 結果画面へ行く。
 */
export interface ChapterScripts {
  /** 章の頭。無ければ章タイトルの帯だけ出る */
  opening?: Script;
  /** 勝ったとき */
  ending?: Script;
  /** 負けたとき。省略すると共通のものが使われる */
  defeat?: Script;
  /** ボスに「会話」したとき */
  bossTalk?: Script;
  /** 説得。鍵は説得される側のユニット ID */
  recruit?: Record<string, Script>;
}

const W = 960;
const H = 640;

/**
 * 吹き出し。**FE8 のそれは台詞の量に合わせて縮み、話し手の頭の上に出る。**
 *
 * 画面幅いっぱいの帯ではないし、名前の札も付かない —— 誰が喋っているかは
 * 立ち絵と、下へ伸びるしっぽが指す先で分かる、というのが原作の作り。
 */
const BUBBLE = {
  maxW: 620,
  minW: 280,
  padX: 32,
  padY: 34,
  line: 46,
  radius: 20,
  /** 文字の大きさ。実機は 240px 幅に 16px なので、960px なら 28px 相当 */
  size: 28,
  /** 吹き出しの底。ここから上へ伸びる */
  bottom: 296,
};
/** 立ち絵（画面下端で切れる） */
const PORTRAIT = { h: 344, leftX: 236, rightX: 724, baseY: 648 };

/** 実機の吹き出しは白に近い薄灰。紙色ではない */
const PAPER = '#eef0f6';
const PAPER_LOW = '#d6dae6';
const INK = '#242034';
const FRAME = '#191524';

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

  /**
   * 吹き出しの輪郭。tailX を渡すと下向きのしっぽが付き、その先が話し手になる。
   * 角は大きめに丸める —— 実機の吹き出しもかなり丸い。
   */
  private bubblePath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, tailX: number | null) {
    const b = y + h;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, b - r);
    ctx.quadraticCurveTo(x + w, b, x + w - r, b);
    if (tailX !== null) {
      const tx = Math.max(x + r + 30, Math.min(x + w - r - 30, tailX));
      ctx.lineTo(tx + 20, b);
      ctx.lineTo(tx - 4, b + 30);
      ctx.lineTo(tx - 12, b);
    }
    ctx.lineTo(x + r, b);
    ctx.quadraticCurveTo(x, b, x, b - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  /** 台詞を折り返し、それを包む吹き出しの位置と大きさを決める */
  private layout(ctx: CanvasRenderingContext2D) {
    ctx.font = fontOf(BUBBLE.size);
    const rows = this.wrap(ctx, this.line.text, BUBBLE.maxW - BUBBLE.padX * 2);
    let widest = 0;
    for (const r of rows) widest = Math.max(widest, ctx.measureText(r).width);
    // 最後の行のうしろに送りマークが出るので、そのぶんだけ余分に取る
    const w = Math.min(BUBBLE.maxW, Math.max(BUBBLE.minW, Math.ceil(widest) + BUBBLE.padX * 2 + 30));
    const h = rows.length * BUBBLE.line + BUBBLE.padY * 2 - (BUBBLE.line - BUBBLE.size);

    // 話し手の頭の上に置く。真ん中に寄せると誰の台詞か分からなくなる
    const side = this.line.side;
    const anchor = side === 'left' ? PORTRAIT.leftX : side === 'right' ? PORTRAIT.rightX : W / 2;
    const x = Math.max(28, Math.min(W - 28 - w, anchor - w / 2));
    const y = BUBBLE.bottom - h;
    return { rows, x, y, w, h, tailX: side ? anchor : null };
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
      ctx.font = fontOf(30);
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'rgba(0,0,0,0.8)';
      ctx.strokeText(this.script.title, W / 2, 60);
      ctx.fillStyle = '#f0e6c8';
      ctx.fillText(this.script.title, W / 2, 60);
    }

    // 吹き出し。**名前の札は付けない** —— 立ち絵としっぽが話し手を指す
    const { rows, x, y, w, h, tailX } = this.layout(ctx);
    this.wrapped = rows;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    this.bubblePath(ctx, x, y, w, h, BUBBLE.radius, tailX);
    const paper = ctx.createLinearGradient(0, y, 0, y + h);
    paper.addColorStop(0, PAPER);
    paper.addColorStop(1, PAPER_LOW);
    ctx.fillStyle = paper;
    ctx.fill();
    ctx.restore();
    this.bubblePath(ctx, x, y, w, h, BUBBLE.radius, tailX);
    ctx.strokeStyle = FRAME;
    ctx.lineWidth = 3;
    ctx.stroke();

    // 本文
    ctx.textAlign = 'left';
    ctx.font = fontOf(BUBBLE.size);
    const tx = x + BUBBLE.padX;
    let remain = Math.floor(this.shown);
    let ly = y + BUBBLE.padY + BUBBLE.size * 0.72;
    let lastX = tx;
    let lastY = ly;
    ctx.fillStyle = line.speaker ? INK : '#3c3850';
    for (const row of rows) {
      if (remain <= 0) break;
      const part = row.slice(0, remain);
      remain -= row.length;
      ctx.fillText(part, tx, ly);
      lastX = tx + ctx.measureText(part).width;
      lastY = ly;
      ly += BUBBLE.line;
    }

    // 送りマーク（文末に出る）
    if (this.shown >= this.fullLength && Math.floor(this.t * 3) % 2 === 0) {
      ctx.fillStyle = '#4a86c8';
      ctx.strokeStyle = '#25476e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lastX + 8, lastY - 18);
      ctx.lineTo(lastX + 26, lastY - 18);
      ctx.lineTo(lastX + 17, lastY - 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.textAlign = 'center';
    ctx.font = fontOf(12);
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
