import type { BattleEvent, BattleResult, LevelUpResult } from './combat';
import { maxHp, terrainAtPos } from './combat';
import { drawFacePortrait, drawUnitSprite, type Clip } from '../render/sprites';
import { classOf, isMagicClass } from '../data/classes';
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

/**
 * 能力の並び。**原作の枠は 8 行、2 列 4 段。**
 *
 * 左の列に HP・力・技・速さ、右の列に幸運・守備・魔防・体格。上がる順もこの
 * 並びのままで、左を上から下、続いて右を上から下へ降りる。
 *
 * 力と魔力は**どちらか一方しか出ない**。原作は物理職なら「力」、魔法職なら
 * 「魔力」がその一行を占める。両方並べると 9 行になって枠が崩れる。
 *
 * 体格は普通のレベルアップでは伸びないが、行は出る。空けておくのが原作。
 */
const LV_ROWS = 8;

function statRows(u: Unit): [keyof Stats, string][] {
  const power: [keyof Stats, string] = isMagicClass(u.classId) ? ['mag', '魔力'] : ['str', '力'];
  return [['hp', 'HP'], power, ['skl', '技'], ['spd', '速さ'], ['lck', '幸運'], ['def', '守備'], ['res', '魔防'], ['con', '体格']];
}

/**
 * レベルアップ画面の実寸。**GBA の 240×160 で測った値をそのまま 4 倍している。**
 *
 * 原作は画面の左に置いた大きな枠と、その上に浮いたクラス名の板の二段組で、
 * 顔は枠の外、右に立っている。中央に置いた一枚窓ではない。
 */
const LV_PLAQUE = { x: 36, y: 180, w: 504, h: 88 };
const LV_PANEL = { x: 24, y: 304, w: 528, h: 288 };
/** 一段目の文字の下端。罫もここに乗る */
const LV_BASE = 372;
const LV_PITCH = 64;
/** ラベルの左端。列の間隔は原作どおり 64px（GBA の 16px） */
const LV_COL = [64, 312];
/** ラベル左端からの距離。数字は右端揃え、+N と星はその右 */
const LV_NUM_R = 160;
const LV_PLUS = 168;
const LV_STAR = 208;

const LV_INK = {
  panel: '#7394b5',
  panelLip: '#84add6',
  frameDark: '#393129',
  frameLip: '#efdece',
  frameShade: '#524a42',
  label: '#fff78c',
  labelEdge: '#4a4208',
  num: '#c6ffff',
  numEdge: '#18185a',
  plus: '#ffe74a',
  rule: ['#c6efa5', '#def79c', '#f7ff8c'],
};

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
  /** 出す能力の並び。クラスで力か魔力かが変わるので一度だけ決める */
  private readonly lvRows: [keyof Stats, string][];

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
    this.lvRows = exp ? statRows(exp.unit) : [];
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
          for (let i = this.lvBeat + 1; i <= Math.min(beat, LV_ROWS - 1); i++) {
            if (lv.gains[this.lvRows[i][0]] && this.speed === 1) statPing(this.lvRung++);
          }
          this.lvBeat = beat;
          if (beat >= LV_ROWS && this.speed === 1 && !this.lvClosed) {
            this.lvClosed = true;
            levelUpChord();
          }
        }
        if (this.t >= LV_OPEN + LV_ROWS * LV_BEAT + LV_HOLD) {
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

  /**
   * 経験値のゲージ。**レベルアップと同じ枠と同じ色で描く。**
   *
   * ここはレベルアップに直結する一枚で、原作でも同じ意匠のまま続く。別の窓の
   * 作りにすると、伸びたゲージが弾けて能力の枠になる、という繋がりが切れる。
   */
  private drawExpBar(ctx: CanvasRenderingContext2D) {
    if (!this.exp) return;
    const w = 452;
    const x = LV_PANEL.x + 8;
    const y = 88;
    const h = 84;
    BattleScene.lvFrame(ctx, x, y, w, h, LV_INK.panel, 14);

    BattleScene.ink(ctx, this.exp.unit.name, x + 30, y + 40, 28, '#ffffff', '#2a2018');
    BattleScene.ink(ctx, 'EXP', x + 236, y + 40, 28, LV_INK.label, LV_INK.labelEdge);
    BattleScene.ink(ctx, String(Math.round(this.expShown)), x + w - 30, y + 40, 28, LV_INK.num, LV_INK.numEdge, 'right');

    // ゲージ。原作の経験値は金色で、目盛りは刻まれていない
    const bw = w - 60;
    const bx = x + 30;
    const by = y + 52;
    ctx.fillStyle = LV_INK.frameShade;
    ctx.fillRect(bx - 3, by - 3, bw + 6, 20);
    ctx.fillStyle = '#2c3a52';
    ctx.fillRect(bx, by, bw, 14);
    const g = ctx.createLinearGradient(0, by, 0, by + 14);
    g.addColorStop(0, '#ffffe0');
    g.addColorStop(0.45, LV_INK.plus);
    g.addColorStop(1, '#c68410');
    ctx.fillStyle = g;
    ctx.fillRect(bx, by, (bw * this.expShown) / 100, 14);
  }

  /**
   * 上がった能力に立つ星。**原作の星は飛んで消えない。上がった印として残る。**
   *
   * 形は実機の 7×7 ドットをそのまま起こしたもの。上に長い穂、左右に角、下は
   * 二股に割れて足になる。真円の四芒星ではない。
   */
  private static star(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, pop: number) {
    const s = (size / 7) * pop;
    // セル座標（中心は 3,3）
    const pts: [number, number][] = [
      [3, -0.6],
      [4.6, 1.8],
      [7.2, 3],
      [4.6, 4.2],
      [5.4, 7.2],
      [3, 5.6],
      [0.6, 7.2],
      [1.4, 4.2],
      [-1.2, 3],
      [1.4, 1.8],
    ];
    ctx.save();
    ctx.beginPath();
    for (const [i, [px, py]] of pts.entries()) {
      const x = cx + (px - 3) * s;
      const y = cy + (py - 3) * s;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.lineJoin = 'round';
    ctx.lineWidth = 5;
    ctx.strokeStyle = LV_INK.frameShade;
    ctx.stroke();
    const g = ctx.createLinearGradient(0, cy - size * 0.6, 0, cy + size * 0.6);
    g.addColorStop(0, '#ffffe0');
    g.addColorStop(0.5, LV_INK.rule[2]);
    g.addColorStop(1, LV_INK.rule[0]);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
  }

  /** 縁取りの付いた一行。FE の文字は色ごとに縁の色が決まっている */
  private static ink(
    ctx: CanvasRenderingContext2D,
    s: string,
    x: number,
    y: number,
    size: number,
    fill: string,
    edge: string,
    align: CanvasTextAlign = 'left',
  ) {
    ctx.font = fontOf(size);
    ctx.textAlign = align;
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(3, size * 0.28);
    ctx.strokeStyle = edge;
    ctx.strokeText(s, x, y);
    ctx.fillStyle = fill;
    ctx.fillText(s, x, y);
    ctx.textAlign = 'left';
  }

  /** 原作の枠。外は黒、内に明るい縁、その内側に影、そして地 */
  private static lvFrame(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    fill: string | CanvasGradient,
    r: number,
  ) {
    const ring = (ix: number, iy: number, iw: number, ih: number, rr: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(ix, iy, iw, ih, rr);
      ctx.fill();
    };
    ring(x, y, w, h, r, LV_INK.frameDark);
    ring(x + 5, y + 5, w - 10, h - 10, r - 2, LV_INK.frameLip);
    ring(x + 9, y + 9, w - 18, h - 18, r - 4, LV_INK.frameShade);
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.roundRect(x + 12, y + 12, w - 24, h - 24, Math.max(2, r - 6));
    ctx.fill();
  }

  /**
   * レベルアップ。**原作の版組をそのまま起こす。**
   *
   * 画面の左に能力の枠、その上にクラス名と Lv の板、顔は枠の外で右に立つ。
   * 中央に一枚窓を置いて顔を嵌め込むのは後年の作りで、GBA の FE ではない。
   *
   * 能力は最初から八つとも、**上がる前の値で**並んでいる。そこから一拍ずつ、
   * 上がるものだけが繰り上がって星が立つ。どれが上がるか分からないまま待つ
   * 時間そのものが、この画面の中身。
   */
  private drawLevelUp(ctx: CanvasRenderingContext2D) {
    const lv = this.exp?.levelUp;
    if (!lv || !this.exp) return;
    const unit = this.exp.unit;
    const open = Math.min(1, this.t / 0.14);

    // 顔は枠の外。窓に嵌めず、右にそのまま立たせる
    drawFacePortrait(ctx, unit, 772, 646, 402, -1);

    // ── クラス名と Lv の板
    ctx.save();
    ctx.translate(0, LV_PLAQUE.y + LV_PLAQUE.h / 2);
    ctx.scale(1, open);
    ctx.translate(0, -(LV_PLAQUE.y + LV_PLAQUE.h / 2));
    const brown = ctx.createLinearGradient(0, LV_PLAQUE.y, 0, LV_PLAQUE.y + LV_PLAQUE.h);
    brown.addColorStop(0, 'rgba(74,56,40,0.82)');
    brown.addColorStop(1, 'rgba(40,28,20,0.86)');
    BattleScene.lvFrame(ctx, LV_PLAQUE.x, LV_PLAQUE.y, LV_PLAQUE.w, LV_PLAQUE.h, brown, 20);
    // 両端の飾り鋲
    for (const bx of [LV_PLAQUE.x + 10, LV_PLAQUE.x + LV_PLAQUE.w - 10]) {
      const by = LV_PLAQUE.y + LV_PLAQUE.h / 2;
      ctx.fillStyle = LV_INK.frameDark;
      ctx.beginPath();
      ctx.arc(bx, by, 21, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = LV_INK.frameLip;
      ctx.beginPath();
      ctx.arc(bx, by, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = LV_INK.frameShade;
      ctx.beginPath();
      ctx.arc(bx, by, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    const cls = classOf(unit.classId).name;
    const py = LV_PLAQUE.y + 64;
    BattleScene.ink(ctx, cls, LV_PLAQUE.x + 64, py, 34, '#ffffff', '#2a2018');
    BattleScene.ink(ctx, 'Lv', LV_PLAQUE.x + 288, py, 34, LV_INK.label, LV_INK.labelEdge);
    // Lv は上がった瞬間に繰り上がる。開いた時点ではまだ前の値
    const shownLv = this.t >= LV_OPEN ? lv.newLevel : lv.newLevel - 1;
    BattleScene.ink(ctx, String(shownLv), LV_PLAQUE.x + 436, py, 34, LV_INK.num, LV_INK.numEdge, 'right');
    ctx.restore();

    // ── 能力の枠
    ctx.save();
    ctx.translate(0, LV_PANEL.y + LV_PANEL.h / 2);
    ctx.scale(1, open);
    ctx.translate(0, -(LV_PANEL.y + LV_PANEL.h / 2));
    BattleScene.lvFrame(ctx, LV_PANEL.x, LV_PANEL.y, LV_PANEL.w, LV_PANEL.h, LV_INK.panel, 14);
    ctx.fillStyle = LV_INK.panelLip;
    ctx.fillRect(LV_PANEL.x + 12, LV_PANEL.y + 12, 4, LV_PANEL.h - 24);

    for (const [row, [k, label]] of this.lvRows.entries()) {
      const cx = LV_COL[Math.floor(row / 4)];
      const base = LV_BASE + (row % 4) * LV_PITCH;
      const gain = lv.gains[k] ?? 0;
      const since = this.t - (LV_OPEN + row * LV_BEAT);
      const risen = since >= 0;
      const value = lv.before[k] + (risen ? gain : 0);

      // 罫。ラベルの右から +N の手前まで、数字の後ろを通って伸びる
      ctx.font = fontOf(36);
      const lw = ctx.measureText(label).width;
      const rx0 = cx + lw + 8;
      const rx1 = cx + LV_PLUS - 8;
      if (rx1 > rx0) {
        for (const [i, c] of LV_INK.rule.entries()) {
          ctx.fillStyle = c;
          ctx.fillRect(rx0, base - 11 + i * 4, rx1 - rx0, 4);
        }
      }

      BattleScene.ink(ctx, label, cx, base, 36, LV_INK.label, LV_INK.labelEdge);

      // 上がった直後だけ数字が跳ねる
      const pop = gain && risen && since < 0.24 ? 1 + (1 - since / 0.24) * 0.5 : 1;
      ctx.save();
      ctx.translate(cx + LV_NUM_R, base);
      ctx.scale(pop, pop);
      BattleScene.ink(ctx, String(value), 0, 0, 36, LV_INK.num, LV_INK.numEdge, 'right');
      ctx.restore();

      if (gain && risen) {
        BattleScene.ink(ctx, `+${gain}`, cx + LV_PLUS, base, 36, LV_INK.plus, LV_INK.frameShade);
        // 星は跳ねてから居座る。飛んで消えない
        const grow = since < 0.2 ? 0.4 + (since / 0.2) * 0.75 : 1;
        BattleScene.star(ctx, cx + LV_STAR, base - 44, 26, grow);
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
