import type { BattleEvent, BattleResult, LevelUpResult } from './combat';
import { maxHp, terrainAtPos } from './combat';
import { drawFacePortrait, drawUnitSprite, type Clip } from '../render/sprites';
import { classOf } from '../data/classes';
import { shade } from '../render/sprites';
import { fontOf } from '../render/text';
import { critSound, hitSound, levelUpChord, missSound, statPing } from '../audio/sfx';
import type { Stats, Unit } from '../types';

export interface ExpAnim {
  unit: Unit;
  from: number;
  gain: number;
  levelUp?: LevelUpResult;
}

type Phase = 'intro' | 'strike' | 'heal' | 'gap' | 'outro' | 'exp' | 'levelup' | 'done';

const W = 960;
const H = 640;
/** 立ち位置 */
const GROUND_Y = 436;
// GBA の FE は両者を最初から近くに置き、攻撃側は大きく移動しない。離して置いて
// 踏み込みで詰めようとすると、届かないか、詰めるのに時間がかかりすぎる。
const LEFT_X = 350;
const RIGHT_X = 610;
const SPRITE = 245;

/**
 * 必殺の溜め。通常の 0.2 に対してここまで伸ばすと、寄って・暗くなって・構えて、
 * という一拍が入る。原作の必殺が通常攻撃と別物に見えるのはこの間があるから。
 */
const CRIT_WINDUP = 0.52;

/**
 * レベルアップの拍。**能力は一つずつ、間を置いて上がる。**
 *
 * 原作のレベルアップは結果の報告ではなく、上から順に一拍ずつめくって
 * 「次は上がるか」を待たせる時間そのものが見せ場になっている。表を一気に
 * 出してしまうと、その待ちが消えて数字の一覧になる。
 */
const LV_OPEN = 0.34;
const LV_BEAT = 0.34;
const LV_HOLD = 1.1;

const STAT_LABELS: [keyof Stats, string][] = [
  ['hp', 'HP'],
  ['str', '力'],
  ['mag', '魔力'],
  ['skl', '技'],
  ['spd', '速さ'],
  ['lck', '幸運'],
  ['def', '守備'],
  ['res', '魔防'],
];

export class BattleScene {
  private phase: Phase = 'intro';
  private t = 0;
  private idx = 0;
  private speed = 1;
  /** ゲーム速度。オプションの「はやい」で 2 になる */
  baseSpeed = 1;
  /** 「キャラのみ」だと地形の背景を描かない */
  backdrop = true;

  private aHp: number;
  private dHp: number;
  private aShown: number;
  private dShown: number;

  private lunge = 0;
  private impacted = false;
  private lungeBy: 'attacker' | 'defender' = 'attacker';
  private shake = 0;
  private flash = 0;
  /**
   * ヒットストップ。必殺が当たった瞬間だけ世界を止める。
   * 一番安く効く「重さ」の出し方で、当たった実感はほとんどこれで出る。
   */
  private freeze = 0;
  /** 必殺の炸裂。0..1 で外へ広がる */
  private burst = 0;
  private burstX = 0;
  private expShown: number;
  private expTarget: number;
  private levelUpShown = false;
  /** どの拍まで進んだか。−1 は「まだ一つも上がっていない」 */
  private lvBeat = -1;
  /** 上がった回数。音の高さがこれで上がっていく */
  private lvRung = 0;
  private lvClosed = false;

  constructor(
    public readonly result: BattleResult,
    public readonly exp: ExpAnim | undefined,
    private readonly onDone: () => void,
  ) {
    this.aHp = result.aStartHp;
    this.dHp = result.dStartHp;
    this.aShown = this.aHp;
    this.dShown = this.dHp;
    this.expShown = exp ? exp.from : 0;
    this.expTarget = exp ? Math.min(100, exp.from + exp.gain) : 0;
  }

  get attacker(): Unit {
    return this.result.forecast.attacker.unit;
  }
  get defender(): Unit {
    return this.result.forecast.defender.unit;
  }

  skip() {
    this.speed = 4;
  }

  private currentEvent(): BattleEvent | undefined {
    return this.result.events[this.idx];
  }

  private startStrike() {
    const ev = this.currentEvent();
    if (!ev) {
      this.phase = 'outro';
      this.t = 0;
      return;
    }
    this.phase = 'strike';
    this.t = 0;
    this.lungeBy = ev.by;
  }

  /**
   * 着弾。**数字は出さない。**
   *
   * GBA の FE にダメージのポップアップは無く、HP ゲージが減り、その下の数値が
   * 下がるだけで伝える。MISS も必殺も、避ける絵と斬る絵そのもので見せる。
   */
  private applyImpact(ev: BattleEvent) {
    if (this.speed === 1) {
      if (!ev.hit) missSound();
      else if (ev.crit) critSound();
      else hitSound(ev.effective);
    }
    if (!ev.hit) return;
    if (ev.crit) {
      this.flash = 1;
      this.shake = 20;
      // 止めて、炸裂させる。必殺を通常攻撃の強い版にしないための二つ
      this.freeze = 0.11;
      this.burst = 0.001;
      this.burstX = ev.by === 'attacker' ? RIGHT_X : LEFT_X;
    } else {
      this.shake = ev.effective ? 10 : 6;
    }
    if (ev.by === 'attacker') this.dHp = ev.targetHp;
    else this.aHp = ev.targetHp;
  }

  update(dtRaw: number) {
    // 止まっているあいだは時計も演出も進まない。飛ばしているときは止めない
    if (this.freeze > 0 && this.speed === 1) {
      this.freeze -= dtRaw;
      if (this.burst > 0) this.burst = Math.min(1, this.burst + dtRaw * 3);
      return;
    }
    const dt = dtRaw * this.speed * this.baseSpeed;
    this.t += dt;
    if (this.burst > 0) this.burst = this.burst >= 1 ? 0 : Math.min(1, this.burst + dt * 2.6);

    // HP バーの補間
    const rate = 26 * dt;
    this.aShown += Math.sign(this.aHp - this.aShown) * Math.min(Math.abs(this.aHp - this.aShown), rate);
    this.dShown += Math.sign(this.dHp - this.dShown) * Math.min(Math.abs(this.dHp - this.dShown), rate);

    this.shake = Math.max(0, this.shake - dt * 45);
    this.flash = Math.max(0, this.flash - dt * 3.4);

    switch (this.phase) {
      case 'intro':
        if (this.t >= 0.4) {
          if (this.result.staffHeal) {
            this.phase = 'heal';
            this.t = 0;
          } else this.startStrike();
        }
        break;

      // 杖を掲げ、光が降り、HP が満ちる
      case 'heal': {
        const raise = 0.45;
        if (this.t >= raise && !this.impacted) {
          this.impacted = true;
          this.dHp = this.result.dEndHp;
          this.flash = 0.7;
        }
        if (this.t >= raise + 0.75) {
          this.phase = 'outro';
          this.t = 0;
        }
        break;
      }

      case 'strike': {
        const ev = this.currentEvent()!;
        const windup = ev.crit ? CRIT_WINDUP : 0.2;
        const recover = 0.42;
        if (this.t < windup) {
          // 溜め: 前へ踏み込む
          this.lunge = (this.t / windup) ** 2 * 0.45;
        } else {
          if (!this.impacted) {
            this.impacted = true;
            this.applyImpact(ev);
          }
          const p = Math.min(1, (this.t - windup) / recover);
          this.lunge = 0.45 * (1 - p) ** 2;
          if (p >= 1) {
            this.idx += 1;
            this.impacted = false;
            this.lunge = 0;
            this.phase = 'gap';
            this.t = 0;
          }
        }
        break;
      }

      case 'gap': {
        const settled = Math.abs(this.aShown - this.aHp) < 0.5 && Math.abs(this.dShown - this.dHp) < 0.5;
        if (this.t >= 0.18 && settled) {
          if (this.aHp <= 0 || this.dHp <= 0 || this.idx >= this.result.events.length) {
            this.phase = 'outro';
            this.t = 0;
          } else {
            this.startStrike();
          }
        }
        break;
      }

      case 'outro':
        if (this.t >= 0.5) {
          if (this.exp && this.exp.gain > 0) {
            this.phase = 'exp';
            this.t = 0;
          } else {
            this.phase = 'done';
            this.onDone();
          }
        }
        break;

      case 'exp': {
        const step = 90 * dt;
        this.expShown = Math.min(this.expTarget, this.expShown + step);
        if (this.expShown >= this.expTarget && this.t > 0.7) {
          if (this.exp?.levelUp) {
            this.phase = 'levelup';
            this.t = 0;
            this.levelUpShown = true;
          } else {
            this.phase = 'done';
            this.onDone();
          }
        }
        break;
      }

      case 'levelup': {
        // 拍が進むたびに、そこが上がる能力なら鳴らす。早送り中は鳴らさない
        const beat = Math.floor((this.t - LV_OPEN) / LV_BEAT);
        const lv = this.exp?.levelUp;
        if (lv && beat > this.lvBeat) {
          for (let i = this.lvBeat + 1; i <= Math.min(beat, STAT_LABELS.length - 1); i++) {
            if (lv.gains[STAT_LABELS[i][0]] && this.speed === 1) statPing(this.lvRung++);
          }
          this.lvBeat = beat;
          if (beat >= STAT_LABELS.length && this.speed === 1 && !this.lvClosed) {
            this.lvClosed = true;
            levelUpChord();
          }
        }
        if (this.t >= LV_OPEN + STAT_LABELS.length * LV_BEAT + LV_HOLD) {
          this.phase = 'done';
          this.onDone();
        }
        break;
      }

      case 'done':
        break;
    }
  }

  get finished() {
    return this.phase === 'done';
  }

  /**
   * この瞬間このユニットが再生すべきクリップと、その進行度。
   *
   * 時計ではなく演出の進行に紐づける。斬撃は踏み込みの途中で当たり、被弾は当たった
   * 瞬間から始まる。時計で回すと剣を振り終わってから当たったりする。
   */
  /**
   * 必殺のときだけ画面ごと変える。GBA の FE は必殺を通常攻撃の強化版ではなく
   * 別の見せ物として扱う — 背景が沈み、線が寄り、カメラが押し込む。
   * 戻り値の k は 0..1 で、溜めで上がり着弾後に戻る。
   */
  private critFocus() {
    if (this.phase !== 'strike') return undefined;
    const ev = this.currentEvent();
    if (!ev?.crit) return undefined;
    const windup = CRIT_WINDUP;
    const total = windup + 0.42;
    const p = Math.min(1, this.t / total);
    const at = windup / total;
    // 溜めのあいだに寄り切って、そこで**留まる**。着弾してから引く。
    // 山なりに上げ下げすると、一番見せたい瞬間にはもう引き始めている
    const k = p < at ? Math.min(1, (p / at) * 1.35) : Math.max(0, 1 - Math.max(0, (p - at) / (1 - at) - 0.45) / 0.55);
    return { x: ev.by === 'attacker' ? LEFT_X : RIGHT_X, k };
  }

  private clipFor(unit: Unit): { clip: Clip; clipT: number } {
    const dead = (unit === this.attacker ? this.aHp : this.dHp) <= 0;
    if (dead) {
      // 倒れる側は outro のあいだに崩れ落ちる
      return { clip: 'die', clipT: Math.min(1, this.t / 0.7) };
    }

    if (this.phase !== 'strike') return { clip: 'idle', clipT: NaN };

    const ev = this.currentEvent();
    if (!ev) return { clip: 'idle', clipT: NaN };

    const striker = ev.by === 'attacker' ? this.attacker : this.defender;
    const windup = ev.crit ? CRIT_WINDUP : 0.2;
    const total = windup + 0.42;

    if (unit === striker) {
      return { clip: ev.crit ? 'crit' : 'attack', clipT: Math.min(1, this.t / total) };
    }
    // 受け側。外したなら回避、当たったなら被弾。どちらも当たる瞬間から始める。
    if (this.t < windup) return { clip: 'idle', clipT: NaN };
    const p = Math.min(1, (this.t - windup) / 0.42);
    return { clip: ev.hit ? 'hit' : 'dodge', clipT: p };
  }

  private drawSide(ctx: CanvasRenderingContext2D, unit: Unit, x: number, facing: number, dying: boolean, alive: number) {
    const active = this.phase === 'strike' && (this.lungeBy === 'attacker') === (unit === this.attacker);
    const lunge = active ? this.lunge : 0;
    const px = x + facing * lunge * 130;

    ctx.save();
    if (dying) {
      const fade = Math.max(0, 1 - this.t * 1.6);
      ctx.globalAlpha = this.phase === 'outro' || this.phase === 'gap' ? Math.max(0.15, fade) : 1;
    }
    // 足場（ぼかした影 + チームカラーのリング）
    const grad = ctx.createRadialGradient(px, GROUND_Y, 4, px, GROUND_Y, 120);
    grad.addColorStop(0, 'rgba(0,0,0,0.45)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save();
    ctx.translate(px, GROUND_Y);
    ctx.scale(1, 0.26);
    ctx.translate(-px, -GROUND_Y);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, GROUND_Y, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = unit.team === 'player' ? 'rgba(90,150,240,0.5)' : 'rgba(220,90,90,0.5)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(px, GROUND_Y + 2, 96, 20, 0, 0, Math.PI * 2);
    ctx.stroke();

    const anim = this.clipFor(unit);
    drawUnitSprite(ctx, unit, px, GROUND_Y, SPRITE, {
      facing,
      ground: false,
      bob: alive > 0 ? Math.sin(this.t * 4 + (facing > 0 ? 0 : 1)) * 4 : 0,
      clip: anim.clip,
      clipT: Number.isNaN(anim.clipT) ? undefined : anim.clipT,
    });
    ctx.restore();
  }

  /** 縁取り文字 */
  private text(
    ctx: CanvasRenderingContext2D,
    s: string,
    x: number,
    y: number,
    o: { size?: number; color?: string; bold?: boolean; align?: CanvasTextAlign; mono?: boolean } = {},
  ) {
    const size = o.size ?? 14;
    ctx.font = fontOf(size, o.bold);
    ctx.textAlign = o.align ?? 'left';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(14,10,20,0.95)';
    ctx.lineWidth = Math.max(3, size * 0.32);
    ctx.strokeText(s, x, y);
    ctx.fillStyle = o.color ?? '#ffffff';
    ctx.fillText(s, x, y);
    ctx.textAlign = 'left';
  }

  /** 上隅の名前プレート */
  private drawNamePlate(ctx: CanvasRenderingContext2D, unit: Unit, side: 'left' | 'right') {
    const w = 280;
    const h = 42;
    const x = side === 'left' ? 20 : W - 20 - w;
    const y = 18;
    const player = unit.team === 'player';

    const g = ctx.createLinearGradient(x, y, x + w, y);
    if (player) {
      g.addColorStop(0, side === 'left' ? '#5f80c4' : '#33487c');
      g.addColorStop(1, side === 'left' ? '#33487c' : '#5f80c4');
    } else {
      g.addColorStop(0, side === 'left' ? '#c4623a' : '#8a3a24');
      g.addColorStop(1, side === 'left' ? '#8a3a24' : '#c4623a');
    }
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 6);
    ctx.fill();
    ctx.strokeStyle = '#c9a25a';
    ctx.lineWidth = 3;
    ctx.stroke();

    this.text(ctx, unit.name, side === 'left' ? x + 18 : x + w - 18, y + 29, {
      size: 22,
      bold: true,
      align: side === 'left' ? 'left' : 'right',
    });
    this.text(ctx, `${classOf(unit.classId).name} Lv.${unit.level}`, side === 'left' ? x + w - 14 : x + 14, y + 28, {
      size: 12,
      color: '#f0e2c0',
      align: side === 'left' ? 'right' : 'left',
    });
  }

  /** HIT / DMG / CRT の小箱 */
  private drawStatBox(ctx: CanvasRenderingContext2D, unit: Unit, side: 'left' | 'right') {
    const view = unit === this.attacker ? this.result.forecast.attacker : this.result.forecast.defender;
    const w = 104;
    const h = 84;
    const x = side === 'left' ? 20 : W - 20 - w;
    const y = 508;

    ctx.fillStyle = unit.team === 'player' ? '#2c3f6b' : '#6e2f22';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 5);
    ctx.fill();
    ctx.strokeStyle = '#c9a25a';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    const rows: [string, string][] = [
      ['命中', view.canAttack ? String(view.hitRate) : '--'],
      ['威力', view.canAttack ? String(view.damage) : '--'],
      ['必殺', view.canAttack ? String(view.critRate) : '--'],
    ];
    rows.forEach(([label, value], i) => {
      const ry = y + 24 + i * 24;
      this.text(ctx, label, x + 10, ry, { size: 13, color: '#ffd86a' });
      this.text(ctx, value, x + w - 10, ry, { size: 17, bold: true, mono: true, align: 'right' });
    });
  }

  /** HP: FE 風の目盛りゲージ */
  private drawHpRow(ctx: CanvasRenderingContext2D, unit: Unit, shownHp: number, side: 'left' | 'right') {
    const view = unit === this.attacker ? this.result.forecast.attacker : this.result.forecast.defender;
    const boxW = 104;
    const x = side === 'left' ? 20 + boxW + 8 : W - 20 - boxW - 8 - 320;
    const w = 320;
    const y = 508;

    // 武器プレート
    ctx.fillStyle = '#efe4c8';
    ctx.beginPath();
    ctx.roundRect(x, y, w, 34, 5);
    ctx.fill();
    ctx.strokeStyle = '#7c5a30';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.font = fontOf(15);
    ctx.fillStyle = '#3a2c1c';
    ctx.textAlign = 'left';
    const heal = this.result.staffHeal;
    const label = heal ? (unit === this.attacker ? heal.staffName : '') : view.weapon ? view.weapon.name : '(武器なし)';
    ctx.fillText(label, x + 12, y + 23);
    if (view.tri !== 0) {
      // 三すくみは印だけ。マップの予測窓と同じで、原作は言葉で書かない
      ctx.fillStyle = view.tri > 0 ? '#1f7a3a' : '#a03030';
      ctx.font = fontOf(15);
      ctx.textAlign = 'right';
      ctx.fillText(view.tri > 0 ? '▲' : '▼', x + w - 12, y + 24);
      ctx.textAlign = 'left';
    }

    // HP の帯
    const barY = y + 42;
    ctx.fillStyle = unit.team === 'player' ? '#2c3f6b' : '#6e2f22';
    ctx.beginPath();
    ctx.roundRect(x, barY, w, 42, 5);
    ctx.fill();
    ctx.strokeStyle = '#c9a25a';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    const hp = Math.round(shownHp);
    const max = maxHp(unit);
    this.text(ctx, String(hp), x + 14, barY + 31, { size: 26, bold: true, mono: true, color: '#ffffff' });

    // 目盛り
    const pipX = x + 62;
    const pipW = Math.min(6, (w - 76) / max);
    const gap = pipW > 4 ? 1 : 0.6;
    for (let i = 0; i < max; i++) {
      const px = pipX + i * (pipW + gap);
      ctx.fillStyle = i < hp ? (hp / max > 0.25 ? '#5fe3d8' : '#ff7a6a') : 'rgba(0,0,0,0.45)';
      ctx.fillRect(px, barY + 10, pipW, 22);
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(pipX - 1, barY + 9, max * (pipW + gap) + 1, 24);

    // 地形（武器プレートの上）
    const terrain = terrainAtPos(unit);
    this.text(ctx, `${terrain.name}  守+${view.defTerrain}  回+${view.avoTerrain}`, x + w, y - 8, {
      size: 12,
      align: 'right',
      color: view.defTerrain || view.avoTerrain ? '#9dffb8' : '#c8d2e8',
    });
  }

  private drawExpBar(ctx: CanvasRenderingContext2D) {
    if (!this.exp) return;
    const w = 420;
    const x = (W - w) / 2;
    const y = 92;
    ctx.fillStyle = 'rgba(10,14,24,0.94)';
    ctx.strokeStyle = '#5f7ec0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, w, 82, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#eaf0ff';
    ctx.font = fontOf(18, true);
    ctx.textAlign = 'left';
    ctx.fillText(`${this.exp.unit.name}  EXP +${this.exp.gain}`, x + 18, y + 30);

    const bw = w - 36;
    ctx.fillStyle = '#2b3145';
    ctx.fillRect(x + 18, y + 44, bw, 16);
    ctx.fillStyle = '#66c6ff';
    ctx.fillRect(x + 18, y + 44, bw * (this.expShown / 100), 16);
    ctx.strokeStyle = '#0b0e18';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 18, y + 44, bw, 16);

    ctx.textAlign = 'right';
    ctx.font = fontOf(14, true);
    ctx.fillStyle = '#cfe0ff';
    ctx.fillText(`${Math.round(this.expShown)} / 100`, x + w - 18, y + 74);
  }

  /** 上がった能力に飛ぶ星。四芒星をひとつ、弾けて消える */
  private static sparkle(ctx: CanvasRenderingContext2D, x: number, y: number, k: number) {
    if (k <= 0 || k >= 1) return;
    const r = 6 + k * 14;
    ctx.save();
    ctx.globalAlpha = 1 - k;
    ctx.fillStyle = '#fff6c8';
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
      const b = a + Math.PI / 4;
      ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
      ctx.lineTo(x + Math.cos(b) * r * 0.3, y + Math.sin(b) * r * 0.3);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /**
   * レベルアップ。**顔グラを添えて、上がった能力に星を飛ばす。**
   *
   * FE のレベルアップは数字の報告ではなく、そのキャラの見せ場として作られている。
   * 顔が出て、能力が一つずつ上から捲れて、伸びたところで音と星が来る。
   */
  private drawLevelUp(ctx: CanvasRenderingContext2D) {
    const lv = this.exp?.levelUp;
    if (!lv || !this.exp) return;
    const w = 470;
    const h = 300;
    const x = (W - w) / 2;
    const y = 180;
    const appear = Math.min(1, this.t * 4);

    ctx.save();
    ctx.translate(W / 2, y + h / 2);
    ctx.scale(appear, appear);
    ctx.translate(-W / 2, -(y + h / 2));

    ctx.fillStyle = 'rgba(10,14,24,0.96)';
    ctx.strokeStyle = '#ffd24a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 12);
    ctx.fill();
    ctx.stroke();

    // 顔グラ。窓の中で下端が切れるように切り抜く
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x + 4, y + 4, 178, h - 8, 10);
    ctx.clip();
    ctx.fillStyle = 'rgba(30,40,66,0.9)';
    ctx.fillRect(x + 4, y + 4, 178, h - 8);
    drawFacePortrait(ctx, this.exp.unit, x + 94, y + h + 6, 300, 1);
    ctx.restore();
    ctx.strokeStyle = 'rgba(255,210,74,0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 186, y + 12);
    ctx.lineTo(x + 186, y + h - 12);
    ctx.stroke();

    const px = x + 198;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffd24a';
    ctx.font = fontOf(24);
    ctx.fillText('LEVEL UP!', px, y + 42);
    ctx.fillStyle = '#eaf0ff';
    ctx.font = fontOf(17);
    ctx.fillText(`${this.exp.unit.name}   Lv.${lv.newLevel - 1} → ${lv.newLevel}`, px, y + 70);

    // **能力は最初から全部、上がる前の値で並んでいる。**
    // そこから一拍ずつ、上がるものだけが +1 されていく。どれが上がるか
    // 分からないまま待つ時間が、この画面の中身そのもの。
    for (const [row, [k, label]] of STAT_LABELS.entries()) {
      const col = row % 2;
      const line = Math.floor(row / 2);
      const sx = px + col * 132;
      const sy = y + 112 + line * 34;
      const gain = lv.gains[k] ?? 0;
      const at = LV_OPEN + row * LV_BEAT;
      const since = this.t - at;
      const risen = since >= 0;

      ctx.fillStyle = '#93a2c4';
      ctx.font = fontOf(14);
      ctx.fillText(label, sx, sy);

      // 上がった直後だけ数字が跳ねる
      const pop = gain && risen && since < 0.26 ? 1 + (1 - since / 0.26) * 0.55 : 1;
      ctx.save();
      ctx.translate(sx + 48, sy);
      ctx.scale(pop, pop);
      ctx.font = fontOf(17);
      ctx.fillStyle = gain && risen ? '#8cf0a8' : '#c3cee6';
      ctx.fillText(String(lv.before[k] + (risen ? gain : 0)), 0, 0);
      ctx.restore();

      if (gain && risen) {
        ctx.fillStyle = '#8cf0a8';
        ctx.font = fontOf(14);
        ctx.fillText(`+${gain}`, sx + 84, sy);
        BattleScene.sparkle(ctx, sx + 62, sy - 6, since / 0.45);
      }
      // いま来ている拍に指をかける。次にどれが上がるかを見せる印
      if (!risen && this.t >= at - LV_BEAT) {
        ctx.fillStyle = `rgba(255,210,74,${(0.35 + Math.abs(Math.sin(this.t * 14)) * 0.5).toFixed(2)})`;
        ctx.beginPath();
        ctx.moveTo(sx - 14, sy - 10);
        ctx.lineTo(sx - 6, sy - 5);
        ctx.lineTo(sx - 14, sy);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.restore();
  }

  /**
   * 戦場の背景。**画面の高さを使い切る。**
   *
   * FE は戦闘画面の上半分を空のまま置かず、立っている地形の景色で埋める。
   * 左右で別々に描くのは、二人が違う地形に立っていることがあるため。
   */
  private drawBackdrop(ctx: CanvasRenderingContext2D) {
    // オプションの「キャラのみ」。FE の「背景なし」に当たる
    if (!this.backdrop) return;
    const sides: [Unit, number, number][] = [
      [this.attacker, 0, W / 2],
      [this.defender, W / 2, W / 2],
    ];
    for (const [unit, x0, w] of sides) {
      const t = terrainAtPos(unit);
      ctx.save();
      ctx.beginPath();
      ctx.rect(x0, 0, w, GROUND_Y);
      ctx.clip();

      // 空。地形の色をわずかに混ぜて、場所ごとに空気の色が変わる
      const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
      sky.addColorStop(0, '#131a30');
      sky.addColorStop(0.72, shade(t.color, 0.55));
      sky.addColorStop(1, shade(t.color, 0.8));
      ctx.fillStyle = sky;
      ctx.fillRect(x0, 0, w, GROUND_Y);

      // 遠景。地形ごとに輪郭を変える
      const far = shade(t.color, 0.45);
      const mid = shade(t.color, 0.7);
      const hz = GROUND_Y - 210;
      ctx.fillStyle = far;
      ctx.beginPath();
      ctx.moveTo(x0, GROUND_Y);
      switch (t.id) {
        case 'mountain':
        case 'peak':
          for (let i = 0; i <= 4; i++) {
            ctx.lineTo(x0 + (w * i) / 4 - w / 8, hz + (i % 2 ? 70 : -40));
            ctx.lineTo(x0 + (w * i) / 4, hz + (i % 2 ? -50 : 60));
          }
          break;
        case 'forest':
          for (let i = 0; i <= 10; i++) {
            const cx = x0 + (w * i) / 10;
            ctx.lineTo(cx - w / 30, hz + 90);
            ctx.lineTo(cx, hz + 10 + ((i * 37) % 50));
            ctx.lineTo(cx + w / 30, hz + 90);
          }
          break;
        case 'fort':
        case 'gate':
        case 'throne':
          for (let i = 0; i <= 8; i++) {
            const cx = x0 + (w * i) / 8;
            ctx.lineTo(cx, hz + 60);
            ctx.lineTo(cx, hz + (i % 2 ? 60 : 20));
            ctx.lineTo(cx + w / 16, hz + (i % 2 ? 60 : 20));
            ctx.lineTo(cx + w / 16, hz + 60);
          }
          break;
        case 'water':
          ctx.lineTo(x0, hz + 120);
          ctx.lineTo(x0 + w, hz + 120);
          break;
        default:
          for (let i = 0; i <= 6; i++) {
            ctx.quadraticCurveTo(x0 + (w * (i - 0.5)) / 6, hz + 40 + ((i * 53) % 70), x0 + (w * i) / 6, hz + 80);
          }
      }
      ctx.lineTo(x0 + w, GROUND_Y);
      ctx.closePath();
      ctx.fill();

      // 近景の土手
      ctx.fillStyle = mid;
      ctx.beginPath();
      ctx.moveTo(x0, GROUND_Y);
      ctx.lineTo(x0, GROUND_Y - 70);
      ctx.quadraticCurveTo(x0 + w * 0.45, GROUND_Y - 110, x0 + w, GROUND_Y - 60);
      ctx.lineTo(x0 + w, GROUND_Y);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    // 足場。FE は戦う二人がそれぞれ自分の地形の台に乗る
    for (const [unit, x] of [
      [this.attacker, LEFT_X],
      [this.defender, RIGHT_X],
    ] as [Unit, number][]) {
      const t = terrainAtPos(unit);
      ctx.save();
      ctx.fillStyle = t.color;
      ctx.beginPath();
      ctx.ellipse(x, GROUND_Y + 6, 150, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = t.color2;
      ctx.beginPath();
      ctx.ellipse(x, GROUND_Y, 150, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }
    ctx.textAlign = 'left';
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const sx = (Math.random() - 0.5) * this.shake;
    const sy = (Math.random() - 0.5) * this.shake;
    ctx.translate(sx, sy);

    const crit = this.critFocus();
    if (crit) {
      const zoom = 1 + 0.16 * crit.k;
      const fy = GROUND_Y - SPRITE * 0.4;
      ctx.translate(crit.x, fy);
      ctx.scale(zoom, zoom);
      ctx.translate(-crit.x, -fy);
    }

    // 背景
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#151a2c');
    g.addColorStop(0.65, '#1d2438');
    g.addColorStop(1, '#0d1120');
    ctx.fillStyle = g;
    ctx.fillRect(-20, -20, W + 40, H + 40);

    this.drawBackdrop(ctx);

    if (crit) {
      const fy = GROUND_Y - SPRITE * 0.4;
      ctx.save();
      ctx.globalAlpha = crit.k * 0.72;
      ctx.fillStyle = '#05060c';
      ctx.fillRect(-W, -H, W * 3, H * 3);
      // 集中線。焦点から外へ抜ける
      ctx.strokeStyle = 'rgba(255,226,150,0.5)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 28; i++) {
        const a = (i / 28) * Math.PI * 2 + i * 0.37;
        const r0 = 190 + ((i * 53) % 90);
        const r1 = r0 + 260 + ((i * 31) % 140);
        ctx.beginPath();
        ctx.moveTo(crit.x + Math.cos(a) * r0, fy + Math.sin(a) * r0);
        ctx.lineTo(crit.x + Math.cos(a) * r1, fy + Math.sin(a) * r1);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 地面
    const gg = ctx.createLinearGradient(0, GROUND_Y - 30, 0, H);
    gg.addColorStop(0, '#2b3752');
    gg.addColorStop(1, '#151b2c');
    ctx.fillStyle = gg;
    ctx.fillRect(-20, GROUND_Y - 26, W + 40, H - GROUND_Y + 46);
    ctx.strokeStyle = 'rgba(160,190,255,0.10)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      const yy = GROUND_Y - 20 + i * i * 3.2;
      ctx.beginPath();
      ctx.moveTo(-20, yy);
      ctx.lineTo(W + 20, yy);
      ctx.stroke();
    }

    const introSlide = this.phase === 'intro' ? 1 - Math.min(1, this.t / 0.4) : 0;
    ctx.save();
    ctx.translate(-introSlide * 300, 0);
    this.drawSide(ctx, this.attacker, LEFT_X, 1, this.aHp <= 0, this.aHp);
    ctx.restore();
    ctx.save();
    ctx.translate(introSlide * 300, 0);
    this.drawSide(ctx, this.defender, RIGHT_X, -1, this.dHp <= 0, this.dHp);
    ctx.restore();

    // 必殺の溜めのあいだは斬るほうにだけ光が残る。受けるほうは影に沈める。
    // 透かすのではなく上から暗を掛ける —— 透かすと背景が抜けて幽霊になる
    if (crit && crit.k > 0.02) {
      const striking = this.currentEvent()?.by === 'attacker';
      const mid = (LEFT_X + RIGHT_X) / 2;
      const shadeGrad = ctx.createLinearGradient(striking ? mid - 60 : mid + 60, 0, striking ? W + 40 : -40, 0);
      shadeGrad.addColorStop(0, 'rgba(4,5,12,0)');
      shadeGrad.addColorStop(1, `rgba(4,5,12,${(crit.k * 0.72).toFixed(3)})`);
      ctx.fillStyle = shadeGrad;
      ctx.fillRect(-40, -40, W + 80, GROUND_Y + 70);
    }

    this.drawNamePlate(ctx, this.attacker, 'left');
    this.drawNamePlate(ctx, this.defender, 'right');
    if (!this.result.staffHeal) {
      this.drawStatBox(ctx, this.attacker, 'left');
      this.drawStatBox(ctx, this.defender, 'right');
    }
    this.drawHpRow(ctx, this.attacker, this.aShown, 'left');
    this.drawHpRow(ctx, this.defender, this.dShown, 'right');

    // 必殺の炸裂。刃は描かない —— 輪と破片だけで当たった衝撃を出す
    if (this.burst > 0) {
      const b = this.burst;
      const by = GROUND_Y - SPRITE * 0.42;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - b);
      ctx.strokeStyle = '#fff2c0';
      ctx.lineWidth = 14 * (1 - b) + 2;
      ctx.beginPath();
      ctx.arc(this.burstX, by, 30 + b * 190, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,214,120,0.85)';
      ctx.lineWidth = 5 * (1 - b) + 1;
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2 + 0.4;
        const r0 = 30 + b * 120;
        const r1 = r0 + 70 * (1 - b) + 20;
        ctx.beginPath();
        ctx.moveTo(this.burstX + Math.cos(a) * r0, by + Math.sin(a) * r0);
        ctx.lineTo(this.burstX + Math.cos(a) * r1, by + Math.sin(a) * r1);
        ctx.stroke();
      }
      ctx.restore();
    }

    if (this.phase === 'exp' || this.phase === 'levelup') this.drawExpBar(ctx);
    if (this.phase === 'levelup') this.drawLevelUp(ctx);

    ctx.restore();

    if (this.flash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${Math.min(0.75, this.flash * 0.75)})`;
      ctx.fillRect(0, 0, W, H);
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(190,205,235,0.45)';
    ctx.font = fontOf(12);
    ctx.fillText('Z / X で早送り', W / 2, H - 14);
    ctx.textAlign = 'left';
  }
}
