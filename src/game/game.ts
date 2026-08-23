import { BattleScene, type ExpAnim } from '../battle/battleScene';
import {
  applyStatus,
  battleWeapons,
  canUse,
  forecast,
  gainExp,
  healAmount,
  healResult,
  maxHp,
  resolveBattle,
  staffHitRate,
  staffOf,
  staffRange,
  staves,
  tickStatus,
} from '../battle/combat';
import { accumulateSupport, canRankUp, linkOf, RANK_LABEL } from '../battle/support';
import { computeMoveRange, key, manhattan, pathTo, unitAt, unkeyX, unkeyY, type MoveRange } from '../core/grid';
import {
  ARENA_LEVEL,
  chapterDef,
  CHESTS,
  createEnemies,
  loadChapter,
  MAP,
  MAP_H,
  MAP_W,
  OBJECTIVE,
  REINFORCEMENTS,
  SHOP,
  TITLE,
  VILLAGES,
  type Reinforcement,
} from '../data/chapters';
import { build } from '../data/roster';
import type { Campaign } from './campaign';
import { cloneWeapon } from '../data/weapons';
import { aidOf, classOf } from '../data/classes';
import { terrainAt } from '../data/terrain';
import { rng } from '../core/rng';
import { setSfx } from '../audio/sfx';
import { GUIDE_COUNT } from '../data/guide';
import { DEFAULT_OPTIONS, OPTION_ROWS, type GameOptions } from './options';
import { DialogueScene, setTextSpeed, type ChapterScripts, type Script } from '../story/dialogue';
import { DEFEAT } from '../story/chapters/common';
import { deathScript, supportScript } from '../story/script';
import { decideAction } from './ai';
import type { Pos, Stats, StatusKind, Unit, Weapon } from '../types';

export type Mode = 'free' | 'move' | 'menu' | 'target' | 'result' | 'status' | 'unit' | 'options' | 'roster' | 'guide';
export type TargetKind = 'attack' | 'staff' | 'talk' | 'support' | 'trade' | 'rescue' | 'drop' | 'take' | 'steal' | 'dance';

interface MenuItem {
  id: string;
  label: string;
  enabled: boolean;
  sub?: string;
}

export interface Menu {
  items: MenuItem[];
  index: number;
  x: number;
  y: number;
  w: number;
  title?: string;
}

export interface Walk {
  unit: Unit;
  path: Pos[];
  i: number;
  t: number;
  done: () => void;
}

export interface FloatMsg {
  text: string;
  t: number;
}

/** 状態異常の呼び名。HUD もログもここを見る */
export const STATUS_LABEL: Record<StatusKind, string> = {
  sleep: '睡眠',
  silence: '沈黙',
  berserk: '狂戦',
  poison: '毒',
};

/** ユニット一覧のページ数。FE8 の「ユニット」は 6 面ある */
export const ROSTER_PAGES = 6;
export const ROSTER_PAGE_LABEL = ['基本', '能力', '装備', '個人', '武器レベル', '支援'];

export class Game {
  units: Unit[] = [];
  turn = 1;
  phase: 'player' | 'enemy' = 'player';
  mode: Mode = 'free';
  cursor: Pos = { x: 3, y: 12 };

  sel?: Unit;
  from?: Pos;
  range?: MoveRange;
  moveTiles = new Set<number>();
  atkTiles = new Set<number>();

  menu?: Menu;
  targets: Unit[] = [];
  /** 「降ろす」だけは相手ではなくマスを選ぶ */
  posTargets: Pos[] = [];
  targetIndex = 0;
  targetKind: TargetKind = 'attack';

  /** マップメニューの「中断」。main 側がこれを見てタイトルへ戻す */
  suspendRequested = false;

  battle?: BattleScene;
  dialogue?: DialogueScene;
  walk?: Walk;

  banner?: { text: string; t: number; color: string };
  messages: FloatMsg[] = [];
  result?: 'win' | 'lose';

  /** イベントの発生済みフラグ */
  flags = { bossTalked: false, ending: false };

  /** FE のオプション。中身は OPTION_ROWS が持つ。campaign と共有する */
  options: GameOptions = { ...DEFAULT_OPTIONS };
  optionIndex = 0;

  /** 目標ウィンドウの残り表示時間。フェイズの頭に出て消える */
  objectiveNotice = 0;

  /** 戦闘アニメを出すか。0 は「省略」で、戦闘は一行の報告になる */
  get animOn() {
    return this.options.battleAnim > 0;
  }

  /** 詳細画面で見ているユニットとページ。FE の R ボタンの画面 */
  inspect?: Unit;
  inspectPage = 0;
  /** 詳細を開く前のモード。移動先や攻撃対象を選んでいる途中でも見られる */
  private inspectFrom: Mode = 'free';

  /** 所持金。宝箱と武器屋がこれを動かす */
  gold = 0;

  /** 開けた宝箱 */
  opened = new Set<string>();

  /** トレード中の相手 */
  tradePartner?: Unit;

  /** 「攻撃」で選んだ武器。FE は武器を決めてから相手を選ぶ */
  private chosenWeapon?: Weapon;
  /** 「杖」で選んだ杖 */
  private chosenStaff?: Weapon;

  /** 再移動に残っている移動力 */
  private cantoBudget = 0;

  /** ユニット一覧のページ。マップメニューの「ユニット」 */
  rosterPage = 0;
  rosterIndex = 0;
  /** 章の中から開いたガイドの行 */
  guideIndex = 0;

  /** まだ湧いていない増援。ターンが来たら盤に置く。中断が読み書きする */
  pendingReinforcements: Reinforcement[] = [];

  /** 中断から戻ったあとの立て直し。カメラと危険域を今の盤面に合わせる */
  resumeFromSuspend() {
    this.mode = 'free';
    this.menu = undefined;
    this.sel = undefined;
    const first = this.alive('player').find((u) => !u.acted && !u.carried) ?? this.alive('player')[0];
    if (first) this.cursor = { x: first.x, y: first.y };
    if (this.phase === 'enemy') {
      // 敵軍フェイズの途中で中断したなら、そのフェイズはやり直す
      this.enemyQueue = this.alive('enemy').filter((u) => !u.acted);
      this.enemyTimer = 0.7;
    }
    this.showBanner(TITLE, '#8fc0ff');
  }

  /** 訪問済みの村。FE の村は一度きり */
  visited = new Set<string>();

  /** この章の目標。HUD と勝敗判定が同じものを見る */
  objective = OBJECTIVE;

  /**
   * この章の会話。**章の定義から借りる。**
   *
   * 以前は script.ts の定数を直に読んでいたので、第2章をクリアしても第1章の
   * 幕切れが流れ、ヴィダルもオルリクもハーゲンの台詞を喋っていた。
   */
  private scripts: ChapterScripts;

  private enemyQueue: Unit[] = [];
  private enemyTimer = 0;
  private afterBattle?: () => void;

  /**
   * 章ひとつぶん。自軍は campaign が持ち回るので受け取るだけで、敵と地形は
   * その章の定義から作る。
   */
  constructor(
    private readonly campaign: Campaign,
    skipOpening = false,
  ) {
    loadChapter(campaign.chapter);
    this.scripts = chapterDef(campaign.chapter).scripts ?? {};
    this.units = [...campaign.fielded(), ...createEnemies(build)];
    this.gold = campaign.gold;
    this.objective = OBJECTIVE;
    this.options = { ...campaign.options };
    setTextSpeed(this.options.textSpeed);
    setSfx(!!this.options.sfx);
    this.pendingReinforcements = REINFORCEMENTS.slice();
    if (this.options.showObjective) this.objectiveNotice = 2.2;
    const first = this.units.find((u) => u.team === 'player');
    if (first) this.cursor = { x: first.x, y: first.y };
    const opening = this.scripts.opening;
    if (!skipOpening && opening) this.playScript(opening, () => this.showBanner('自軍フェイズ  1', '#8fc0ff'));
    else this.showBanner(TITLE, '#8fc0ff');
  }

  // ---------------------------------------------------------------- helpers

  get busy() {
    return !!this.battle || !!this.walk || !!this.dialogue;
  }

  alive(team: 'player' | 'enemy') {
    return this.units.filter((u) => !u.dead && u.team === team);
  }

  unitAtCursor() {
    return unitAt(this.units, this.cursor.x, this.cursor.y);
  }

  byId(id: string) {
    return this.units.find((u) => u.id === id);
  }

  showBanner(text: string, color = '#ffffff') {
    this.banner = { text, t: 0, color };
  }

  log(text: string) {
    this.messages.push({ text, t: 0 });
    if (this.messages.length > 4) this.messages.shift();
  }

  // ---------------------------------------------------------------- 会話

  /**
   * 会話に出す顔を引く。**盤の上に居なくても喋れる。**
   *
   * 出撃枠は五人だが、幕間で口をきくのはそれより多い —— 第2章の終わりで灰を
   * 「灰降り」と呼ぶのはミレイユで、彼女が出撃していたとは限らない。盤の上に
   * 居なければロスターから借りる。原作の幕間もそうなっている。
   */
  private speaker(id: string): Unit | undefined {
    return this.byId(id) ?? this.campaign.roster.find((u) => u.id === id);
  }

  playScript(script: Script, after?: () => void) {
    this.dialogue = new DialogueScene(
      script,
      (id) => this.speaker(id),
      () => {
        this.dialogue = undefined;
        after?.();
      },
    );
  }

  /**
   * 章に勝った。台本があれば流してから結果画面へ行く。
   *
   * 塔と魔物の群れには台本が無いので、そのまま VICTORY になる。
   */
  private win() {
    const done = () => {
      this.result = 'win';
      this.mode = 'result';
      this.showBanner('VICTORY', '#ffd24a');
    };
    const ending = this.scripts.ending;
    if (ending) this.playScript(ending, done);
    else done();
  }

  playScripts(scripts: Script[], after?: () => void) {
    const queue = [...scripts];
    const next = () => {
      const s = queue.shift();
      if (!s) {
        after?.();
        return;
      }
      this.playScript(s, next);
    };
    next();
  }

  // ---------------------------------------------------------------- selection

  selectUnit(u: Unit) {
    this.sel = u;
    this.from = { x: u.x, y: u.y };
    this.range = computeMoveRange(u, this.units);
    this.moveTiles = new Set(this.range.stand);

    // 攻撃範囲は持っている武器すべての合わせ技。FE も一番遠くまで届く武器で描く
    const list = battleWeapons(u);
    const min = list.length ? Math.min(...list.map((w) => w.minRange)) : 0;
    const max = list.length ? Math.max(...list.map((w) => w.maxRange)) : 0;
    this.atkTiles = new Set();
    if (max > 0) {
      for (const k of this.range.stand) {
        const bx = unkeyX(k);
        const by = unkeyY(k);
        for (let dy = -max; dy <= max; dy++) {
          for (let dx = -max; dx <= max; dx++) {
            const d = Math.abs(dx) + Math.abs(dy);
            if (d < min || d > max) continue;
            const nx = bx + dx;
            const ny = by + dy;
            if (nx < 0 || ny < 0 || nx >= MAP_W || ny >= MAP_H) continue;
            if (terrainAt(MAP, nx, ny).id === 'wall') continue;
            this.atkTiles.add(key(nx, ny));
          }
        }
      }
      for (const k of this.moveTiles) this.atkTiles.delete(k);
    }
    this.mode = 'move';
  }

  clearSelection() {
    this.sel = undefined;
    this.from = undefined;
    this.range = undefined;
    this.moveTiles.clear();
    this.atkTiles.clear();
    this.menu = undefined;
    this.targets = [];
    this.posTargets = [];
    this.chosenWeapon = undefined;
    this.chosenStaff = undefined;
    this.mode = 'free';
  }

  // ---------------------------------------------------------------- movement

  startWalk(unit: Unit, path: Pos[], done: () => void) {
    if (path.length <= 1) {
      const last = path[path.length - 1];
      if (last) {
        unit.x = last.x;
        unit.y = last.y;
        unit.px = last.x;
        unit.py = last.y;
      }
      done();
      return;
    }
    this.walk = { unit, path, i: 0, t: 0, done };
  }

  private updateWalk(dt: number) {
    const w = this.walk;
    if (!w) return;
    const speed = 9; // タイル/秒
    w.t += dt * speed;
    while (w.t >= 1 && w.i < w.path.length - 1) {
      w.t -= 1;
      w.i += 1;
    }
    const cur = w.path[w.i];
    const nxt = w.path[Math.min(w.i + 1, w.path.length - 1)];
    w.unit.px = cur.x + (nxt.x - cur.x) * Math.min(1, w.t);
    w.unit.py = cur.y + (nxt.y - cur.y) * Math.min(1, w.t);

    if (w.i >= w.path.length - 1) {
      const last = w.path[w.path.length - 1];
      w.unit.x = last.x;
      w.unit.y = last.y;
      w.unit.px = last.x;
      w.unit.py = last.y;
      this.walk = undefined;
      w.done();
    }
  }

  // ---------------------------------------------------------------- menus

  /** 隣接していて会話できる相手（説得 / ボス戦闘前会話） */
  /** ロードが目標の玉座に立っていれば制圧できる */
  canSeize(u: Unit) {
    return !!u.isLord && this.objective.kind === 'seize' && u.x === this.objective.x && u.y === this.objective.y;
  }

  villageAt(x: number, y: number) {
    if (this.visited.has(x + ',' + y)) return undefined;
    return VILLAGES.find((v) => v.x === x && v.y === y);
  }

  chestAt(x: number, y: number) {
    if (this.opened.has(x + ',' + y)) return undefined;
    return CHESTS.find((c) => c.x === x && c.y === y);
  }

  /** 隣接する扉。FE は扉の前に立って開ける */
  doorNear(u: Unit) {
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const x = u.x + dx;
      const y = u.y + dy;
      if (terrainAt(MAP, x, y).id === 'door') return { x, y };
    }
    return undefined;
  }

  /** 隣接する自軍。持ち物をやり取りできる相手 */
  tradeTargets(u: Unit): Unit[] {
    return this.alive('player').filter((o) => o !== u && Math.abs(o.x - u.x) + Math.abs(o.y - u.y) === 1);
  }

  talkTargets(u: Unit): Unit[] {
    const out: Unit[] = [];
    for (const t of this.units) {
      if (t.dead || t === u) continue;
      if (manhattan(u, t) !== 1) continue;
      if (t.team === 'enemy' && t.recruitableBy === u.id) out.push(t);
      else if (t.isBoss && u.isLord && !this.flags.bossTalked) out.push(t);
    }
    return out;
  }

  /** 隣接していてランクアップできる支援相手 */
  supportTargets(u: Unit): Unit[] {
    return this.units.filter((t) => !t.dead && t.team === u.team && t !== u && manhattan(u, t) === 1 && canRankUp(u, t));
  }

  /**
   * 行動メニュー。FE は「まだ動いていないユニットが、その場でできること」を
   * 上から並べる。再移動が残っているときは移動だけを選ばせる。
   */
  openActionMenu() {
    if (!this.sel) return;
    const u = this.sel;
    const cls = classOf(u.classId);

    const items: MenuItem[] = [];
    if (this.canSeize(u)) items.push({ id: 'seize', label: '制圧', enabled: true });
    if (this.villageAt(u.x, u.y)) items.push({ id: 'visit', label: '訪問', enabled: true });
    if (this.chestAt(u.x, u.y)) items.push({ id: 'chest', label: '宝箱', enabled: u.keys > 0, sub: `鍵${u.keys}` });
    if (this.doorNear(u)) items.push({ id: 'door', label: '扉', enabled: u.keys > 0, sub: `鍵${u.keys}` });
    if (terrainAt(MAP, u.x, u.y).id === 'shop') items.push({ id: 'shop', label: '武器屋', enabled: true });
    if (terrainAt(MAP, u.x, u.y).id === 'arena' && ARENA_LEVEL > 0) items.push({ id: 'arena', label: '闘技場', enabled: true });

    if (this.attackableWeapons(u).length) items.push({ id: 'attack', label: '攻撃', enabled: true });
    if (staves(u).length) items.push({ id: 'staff', label: '杖', enabled: this.usableStaves(u).length > 0 });
    if (cls.dance) items.push({ id: 'dance', label: '踊る', enabled: this.danceTargets(u).length > 0 });
    if (cls.steal) items.push({ id: 'steal', label: '盗む', enabled: this.stealTargets(u).length > 0 });
    if (this.talkTargets(u).length) items.push({ id: 'talk', label: '会話', enabled: true });
    if (this.supportTargets(u).length) items.push({ id: 'support', label: '支援', enabled: true });

    // 救出まわり。FE は担ぐ・降ろす・引き取るの 3 つが別コマンド
    if (u.rescuing) {
      items.push({ id: 'drop', label: '降ろす', enabled: this.dropTiles(u).length > 0 });
    } else if (this.rescueTargets(u).length) {
      items.push({ id: 'rescue', label: '救出', enabled: true });
    }
    if (this.takeTargets(u).length) items.push({ id: 'take', label: '引き取る', enabled: true });

    if (this.convoyReachable(u)) items.push({ id: 'convoy', label: '輸送隊', enabled: true });
    if (this.tradeTargets(u).length) items.push({ id: 'trade', label: 'トレード', enabled: true });
    items.push({ id: 'item', label: '道具', enabled: true });
    items.push({ id: 'wait', label: '待機', enabled: true });

    const first = items.findIndex((i) => i.enabled);
    this.menu = { items, index: first < 0 ? 0 : first, x: 0, y: 0, w: 152 };
    this.mode = 'menu';
  }

  /** 再移動だけが残っている状態のメニュー */
  openCantoMenu() {
    if (!this.sel) return;
    this.menu = {
      items: [
        { id: 'canto', label: '移動', enabled: true },
        { id: 'wait', label: '待機', enabled: true },
      ],
      index: 0,
      x: 0,
      y: 0,
      w: 152,
    };
    this.mode = 'menu';
  }

  /** いま誰かに届く武器だけ。FE は届かない武器では「攻撃」が出ない */
  attackableWeapons(u: Unit): Weapon[] {
    return battleWeapons(u).filter((w) => this.enemiesInRange(u, w.minRange, w.maxRange).length > 0);
  }

  /** いま誰かに効く杖だけ */
  usableStaves(u: Unit): Weapon[] {
    return staves(u).filter((s) => this.staffTargets(u, s).length > 0);
  }

  /**
   * その杖が効く相手。回復杖は傷ついた味方、状態異常の杖は敵、
   * リザーブは状態異常の味方。射程は魔力の半分（リブローと攻撃杖）。
   */
  staffTargets(u: Unit, s: Weapon): Unit[] {
    const max = staffRange(u, s);
    const kind = s.staffKind ?? 'heal';
    return this.units.filter((t) => {
      if (t.dead || t.carried || t === u) return false;
      const d = manhattan(u, t);
      if (d < s.minRange || d > max) return false;
      if (kind === 'sleep' || kind === 'silence' || kind === 'berserk') return t.team !== u.team && !t.status;
      if (kind === 'restore') return t.team === u.team && !!t.status;
      return t.team === u.team && t.hp < maxHp(t);
    });
  }

  /** 担げる相手。援護が相手の体格以上で、まだ誰も担いでいないこと */
  rescueTargets(u: Unit): Unit[] {
    if (u.rescuing) return [];
    return this.alive('player').filter((t) => t !== u && !t.carried && !t.rescuing && manhattan(u, t) === 1 && aidOf(u) >= t.stats.con);
  }

  /** 担いでいる相手を降ろせる隣のマス */
  dropTiles(u: Unit): Pos[] {
    if (!u.rescuing) return [];
    const carried = this.units.find((t) => t.id === u.rescuing);
    if (!carried) return [];
    const out: Pos[] = [];
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const x = u.x + dx;
      const y = u.y + dy;
      if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) continue;
      if (unitAt(this.units, x, y)) continue;
      if (terrainAt(MAP, x, y).cost[0] >= 99) continue;
      out.push({ x, y });
    }
    return out;
  }

  /** 隣で誰かを担いでいる味方。その荷物を引き取れるか */
  takeTargets(u: Unit): Unit[] {
    if (u.rescuing) return [];
    return this.alive('player').filter((t) => {
      if (t === u || !t.rescuing || manhattan(u, t) !== 1) return false;
      const carried = this.units.find((c) => c.id === t.rescuing);
      return !!carried && aidOf(u) >= carried.stats.con;
    });
  }

  /** 盗める相手。速さが上で、武器でない持ち物を持っていること */
  stealTargets(u: Unit): Unit[] {
    return this.units.filter((t) => {
      if (t.dead || t.carried || t.team === u.team) return false;
      if (manhattan(u, t) !== 1) return false;
      if (u.stats.spd <= t.stats.spd) return false;
      return t.potion > 0 || t.keys > 0;
    });
  }

  /** 踊って再行動させられる相手 */
  danceTargets(u: Unit): Unit[] {
    return this.alive('player').filter((t) => t !== u && !t.carried && manhattan(u, t) === 1 && t.acted);
  }

  /** 輸送隊に手が届くか。FE はロード本人か、ロードに隣接しているとき */
  convoyReachable(u: Unit): boolean {
    if (u.isLord) return true;
    const lord = this.units.find((t) => t.isLord && !t.dead);
    return !!lord && manhattan(u, lord) === 1;
  }

  /** 空きマスでの決定。FE のマップメニュー */
  /** カーソルの下のユニットの詳細を開く。FE の R */
  openUnitStatus() {
    if (this.busy || this.dialogue || this.result) return;
    if (this.mode === 'unit') {
      this.mode = this.inspectFrom;
      return;
    }
    const u = this.unitAtCursor() ?? this.sel;
    if (!u) return;
    this.inspectFrom = this.mode;
    this.inspect = u;
    this.inspectPage = 0;
    this.mode = 'unit';
  }

  /** FE8 と同じ並び: ユニット / 状況 / ガイド / オプション / 中断 / 終了 */
  openMapMenu() {
    this.sel = undefined;
    this.menu = {
      items: [
        { id: 'roster', label: 'ユニット', enabled: true },
        { id: 'status', label: '状況', enabled: true },
        { id: 'guide', label: 'ガイド', enabled: true },
        { id: 'options', label: 'オプション', enabled: true },
        { id: 'suspend', label: '中断', enabled: true },
        { id: 'endturn', label: 'ターン終了', enabled: true },
        { id: 'back', label: 'やめる', enabled: true },
      ],
      index: 0,
      x: 0,
      y: 0,
      w: 176,
      title: 'メニュー',
    };
    this.mode = 'menu';
  }

  openItemMenu() {
    if (!this.sel) return;
    const u = this.sel;
    const items: MenuItem[] = u.items.map((w, i) => ({
      id: `equip:${i}`,
      label: w.name,
      enabled: w.uses > 0 && canUse(u, w),
      sub: `${w.uses}`,
    }));
    if (u.potion > 0) items.push({ id: 'potion', label: '傷薬', enabled: u.hp < maxHp(u), sub: `${u.potion}` });
    if (u.seals > 0) {
      const cls = classOf(u.classId);
      items.push({ id: 'seal', label: 'マスタープルフ', enabled: !!cls.promotion && u.level >= 10, sub: `${u.seals}` });
    }
    items.push({ id: 'back', label: '戻る', enabled: true });
    this.menu = { items, index: 0, x: 0, y: 0, w: 196, title: '持ち物' };
  }

  /**
   * 「攻撃」で開く武器選び。FE はここで武器を決めてから相手を選ぶので、
   * 手斧と鉄の斧では届く相手が変わる。副見出しに届く人数を出す。
   */
  openWeaponMenu() {
    if (!this.sel) return;
    const u = this.sel;
    const list = this.attackableWeapons(u);
    const items: MenuItem[] = list.map((w, i) => ({
      id: `useweapon:${i}`,
      label: w.name,
      enabled: true,
      sub: `${this.enemiesInRange(u, w.minRange, w.maxRange).length}人`,
    }));
    items.push({ id: 'back', label: 'やめる', enabled: true });
    this.menu = { items, index: 0, x: 0, y: 0, w: 208, title: '武器' };
    this.mode = 'menu';
  }

  /** 「杖」で開く杖選び。効く相手が居ない杖は選べない */
  openStaffMenu() {
    if (!this.sel) return;
    const u = this.sel;
    const list = staves(u);
    const items: MenuItem[] = list.map((s, i) => ({
      id: `usestaff:${i}`,
      label: s.name,
      enabled: this.staffTargets(u, s).length > 0,
      sub: `射程${staffRange(u, s)}`,
    }));
    items.push({ id: 'back', label: 'やめる', enabled: true });
    this.menu = { items, index: 0, x: 0, y: 0, w: 208, title: '杖' };
    this.mode = 'menu';
  }

  /** 輸送隊。ロードに手が届くところで持ち物を出し入れする */
  openConvoyMenu() {
    if (!this.sel) return;
    const u = this.sel;
    const items: MenuItem[] = [];
    for (const [i, w] of u.items.entries()) items.push({ id: `store:${i}`, label: `→ ${w.name}`, enabled: true, sub: `${w.uses}` });
    for (const [i, w] of this.campaign.convoy.entries()) {
      items.push({ id: `fetch:${i}`, label: `← ${w.name}`, enabled: u.items.length < 5, sub: `${w.uses}` });
    }
    items.push({ id: 'wait', label: '終わる', enabled: true });
    this.menu = { items, index: 0, x: 0, y: 0, w: 232, title: `輸送隊  ${this.campaign.convoy.length}` };
    this.mode = 'menu';
  }

  openPromotionMenu() {
    if (!this.sel) return;
    const cls = classOf(this.sel.classId);
    if (!cls.promotion) return;
    const items: MenuItem[] = cls.promotion.options.map((id) => ({
      id: `promote:${id}`,
      label: classOf(id).name,
      enabled: true,
    }));
    items.push({ id: 'back', label: 'やめる', enabled: true });
    this.menu = { items, index: 0, x: 0, y: 0, w: 220, title: 'クラスチェンジ' };
  }

  enemiesInRange(u: Unit, min: number, max: number): Unit[] {
    return this.units.filter((t) => {
      if (t.dead || t.team === u.team) return false;
      const d = manhattan(u, t);
      return d >= min && d <= max;
    });
  }

  woundedAlliesInRange(u: Unit, min: number, max: number): Unit[] {
    return this.units.filter((t) => {
      if (t.dead || t.team !== u.team || t === u) return false;
      if (t.hp >= maxHp(t)) return false;
      const d = manhattan(u, t);
      return d >= min && d <= max;
    });
  }

  // ---------------------------------------------------------------- actions

  /**
   * 行動を終える。騎馬と飛行は、ここで再移動（カント）が挟まる。
   * 「待機」だけは何も残さず終わるので finishAction を直に呼ぶ。
   */
  private endAction(u: Unit) {
    if (
      classOf(u.classId).canto &&
      !u.canto &&
      !u.dead &&
      u.team === 'player' &&
      this.phase === 'player' &&
      this.cantoBudget > 0 &&
      !this.result &&
      !this.flags.ending
    ) {
      this.beginCanto(u);
      return;
    }
    this.finishAction(u);
  }

  private finishAction(u: Unit) {
    u.acted = true;
    u.canto = false;
    this.cantoBudget = 0;
    this.clearSelection();
    this.checkResult();
    if (this.result || this.flags.ending) return;
    if (this.phase === 'player') {
      this.autoCursorTo(u);
      if (this.alive('player').every((p) => p.acted)) {
        if (this.options.autoEndTurn) this.endPlayerPhase();
      }
    }
  }

  /** オートカーソル。FE は行動後に次の動かせるユニットへ寄る */
  private autoCursorTo(after: Unit) {
    if (!this.options.autoCursor) return;
    const next = this.alive('player').filter((p) => !p.acted && !p.carried);
    if (!next.length) return;
    next.sort((a, b) => manhattan(a, after) - manhattan(b, after));
    this.cursor = { x: next[0].x, y: next[0].y };
  }

  /** 再移動。残った移動力ぶんだけもう一度動かせる */
  private beginCanto(u: Unit) {
    u.canto = true;
    this.sel = u;
    this.from = { x: u.x, y: u.y };
    this.range = computeMoveRange(u, this.units, this.cantoBudget);
    this.moveTiles = new Set(this.range.stand);
    this.atkTiles.clear();
    this.menu = undefined;
    this.targets = [];
    this.cursor = { x: u.x, y: u.y };
    this.mode = 'move';
  }

  startBattle(attacker: Unit, defender: Unit, onDone: () => void) {
    const result = resolveBattle(attacker, { x: attacker.x, y: attacker.y }, defender, { x: defender.x, y: defender.y }, this.units);

    // HP と経験値は即時反映し、演出はスナップショットで再生する
    attacker.hp = result.aEndHp;
    defender.hp = result.dEndHp;

    let expAnim: ExpAnim | undefined;
    if (result.expUnit && result.expGain > 0) {
      const from = result.expUnit.exp;
      const lv = gainExp(result.expUnit, result.expGain);
      expAnim = { unit: result.expUnit, from, gain: result.expGain, levelUp: lv };
    }

    this.afterBattle = () => {
      // 毒の牙のような、当たると状態異常になる武器
      const inf = result.inflicted;
      if (inf) {
        const victim = inf.on === 'attacker' ? attacker : defender;
        if (!victim.dead && victim.hp > 0) {
          applyStatus(victim, inf.kind, inf.turns);
          this.log(`${victim.name} は ${STATUS_LABEL[inf.kind]} になった`);
        }
      }
      const deaths: Script[] = [];
      for (const u of [attacker, defender]) {
        if (u.hp <= 0 && !u.dead) {
          u.dead = true;
          this.log(`${u.name} は倒れた`);
          const d = deathScript(u.id, u.name);
          if (d) deaths.push(d);
        }
      }
      if (deaths.length) this.playScripts(deaths, onDone);
      else onDone();
    };

    // アニメを切っていれば画面を出さず、結果だけをログに流す
    if (!this.animOn) {
      this.afterBattle?.();
      this.afterBattle = undefined;
      return;
    }
    this.battle = new BattleScene(result, expAnim, () => {
      /* 終了検知は update 側で行う */
    });
    this.battle.baseSpeed = this.options.gameSpeed ? 2 : 1;
    this.battle.backdrop = this.options.battleAnim >= 2;
  }

  private doAttack(target: Unit) {
    const u = this.sel;
    if (!u) return;
    this.mode = 'free';
    this.startBattle(u, target, () => {
      if (!u.dead) this.endAction(u);
      else {
        this.clearSelection();
        this.checkResult();
        if (!this.result && !this.flags.ending && this.phase === 'player' && this.alive('player').every((p) => p.acted))
          this.endPlayerPhase();
      }
    });
  }

  // ------------------------------------------------------- 救出・盗む・踊る

  /** 担ぐ。担いだ相手は盤上から消え、担いだ側は技と速さが半分になる */
  private doRescue(target: Unit) {
    const u = this.sel;
    if (!u) return;
    this.mode = 'free';
    u.rescuing = target.id;
    target.carried = true;
    this.log(`${u.name} は ${target.name} を救出した`);
    this.endAction(u);
  }

  /** 降ろす。降ろされた相手はその場から動けない（この章ではもう行動済み扱い） */
  private doDrop(at: Pos) {
    const u = this.sel;
    if (!u || !u.rescuing) return;
    const carried = this.units.find((t) => t.id === u.rescuing);
    if (!carried) return;
    this.mode = 'free';
    carried.carried = false;
    carried.x = at.x;
    carried.y = at.y;
    carried.px = at.x;
    carried.py = at.y;
    carried.acted = true;
    u.rescuing = undefined;
    this.log(`${u.name} は ${carried.name} を降ろした`);
    this.endAction(u);
  }

  /** 引き取る。隣の味方が担いでいる者をそのまま受け取る */
  private doTake(from: Unit) {
    const u = this.sel;
    if (!u || !from.rescuing) return;
    this.mode = 'free';
    const carried = this.units.find((t) => t.id === from.rescuing);
    u.rescuing = from.rescuing;
    from.rescuing = undefined;
    this.log(`${u.name} は ${carried?.name ?? '担がれた者'} を引き取った`);
    this.endAction(u);
  }

  /** 盗む。武器は盗めない。傷薬と鍵だけ */
  private doSteal(target: Unit) {
    const u = this.sel;
    if (!u) return;
    this.mode = 'free';
    if (target.potion > 0) {
      target.potion -= 1;
      u.potion += 1;
      this.log(`${u.name} は ${target.name} から傷薬を盗んだ`);
    } else if (target.keys > 0) {
      target.keys -= 1;
      u.keys += 1;
      this.log(`${u.name} は ${target.name} から鍵を盗んだ`);
    }
    this.endAction(u);
  }

  /** 踊る。行動済みの味方をもう一度動かせるようにする */
  private doDance(target: Unit) {
    const u = this.sel;
    if (!u) return;
    this.mode = 'free';
    target.acted = false;
    target.canto = false;
    this.log(`${u.name} の踊りで ${target.name} がもう一度動ける`);
    const lv = gainExp(u, 10);
    if (lv) this.log(`${u.name} は レベル ${lv.newLevel} に上がった`);
    this.finishAction(u);
  }

  /**
   * 闘技場。FE は掛け金を払って一戦し、勝てば倍が返り、負ければ死ぬ。
   * 相手はその場で作る使い捨てなので、盤には置かない。
   */
  private doArena(u: Unit) {
    // 掛け金はその闘技場の格、相手はこちらの格。FE8 も相手を挑戦者に合わせる
    const bet = 100 + Math.max(1, ARENA_LEVEL) * 30;
    if (this.gold < bet) {
      this.log(`所持金が足りない（${bet}G）`);
      this.openActionMenu();
      return;
    }
    this.gold -= bet;
    const level = Math.max(1, Math.min(20, u.level));
    const foe = build(
      {
        id: `arena_${this.turn}_${u.id}`,
        name: '闘士',
        classId: 'mercenary',
        level,
        // 盤には出さないが、隣に立っていることにしないと射程 1 が届かない
        x: u.x + 1,
        y: u.y,
        affinity: 'fire',
        stats: {
          hp: 18 + level,
          str: 4 + Math.floor(level / 2),
          mag: 0,
          skl: 4 + Math.floor(level / 2),
          spd: 4 + Math.floor(level / 2),
          lck: 2,
          def: 2 + Math.floor(level / 3),
          res: 1,
          con: 10,
          mov: 5,
        },
        growth: { hp: 0, str: 0, mag: 0, skl: 0, spd: 0, lck: 0, def: 0, res: 0, con: 0, mov: 0 },
        weapons: ['ironSword'],
      },
      'enemy',
    );
    this.mode = 'free';
    this.menu = undefined;
    // 盤には出さない。演出のためだけに一時的に units へ入れる
    this.units.push(foe);

    /*
     * FE の闘技場はどちらかが倒れるまで続く。決着まで打ち合わせるが、
     * 互いに一点も削れない組み合わせだと永久に終わらないので、
     * 進みが無い回と 8 回の上限で必ず止める。止まったら引き分けで掛け金は戻らない。
     */
    let left = 8;
    const round = () => {
      const before = u.hp + foe.hp;
      this.startBattle(u, foe, () => {
        left -= 1;
        const stalled = u.hp + foe.hp === before;
        if (!u.dead && foe.hp > 0 && u.hp > 0 && left > 0 && !stalled) {
          round();
          return;
        }
        const at = this.units.indexOf(foe);
        if (at >= 0) this.units.splice(at, 1);
        if (u.dead || u.hp <= 0) {
          this.log(`${u.name} は闘技場で倒れた`);
          this.clearSelection();
          this.checkResult();
          return;
        }
        if (foe.hp <= 0) {
          const prize = bet * 2;
          this.gold += prize;
          this.log(`${u.name} は闘技場で勝った（${prize}G）`);
        } else {
          this.log(`${u.name} は決着をつけられず引き上げた（${bet}G を失った）`);
        }
        this.finishAction(u);
      });
    };
    round();
  }

  private doHeal(target: Unit) {
    const u = this.sel;
    if (!u) return;
    const staff = this.chosenStaff ?? staffOf(u);
    if (!staff) return;
    const kind = staff.staffKind ?? 'heal';

    // 回復以外の杖は殴り合いの画面に載せない。効果だけ出してログに流す
    if (kind !== 'heal' && kind !== 'physic') {
      this.mode = 'free';
      staff.uses -= 1;
      u.wexp[staff.type] = (u.wexp[staff.type] ?? 0) + 1;
      if (kind === 'restore') {
        target.status = undefined;
        this.log(`${u.name} は ${target.name} の状態異常を解いた`);
      } else {
        const rate = staffHitRate(u, target, manhattan(u, target));
        if (rng.check(rate)) {
          applyStatus(target, kind, staff.statusTurns ?? 5);
          this.log(`${target.name} は ${STATUS_LABEL[kind]} になった`);
        } else {
          this.log(`${staff.name} は効かなかった`);
        }
      }
      const lv0 = gainExp(u, 11);
      if (lv0) this.log(`${u.name} は レベル ${lv0.newLevel} に上がった`);
      this.endAction(u);
      return;
    }
    const amount = healAmount(u, staff);
    const result = healResult(u, target, amount, staff.name, this.units);
    staff.uses -= 1;
    u.wexp[staff.type] = (u.wexp[staff.type] ?? 0) + 1;

    const from = u.exp;
    const lv = gainExp(u, 11);
    const expAnim: ExpAnim = { unit: u, from, gain: 11, levelUp: lv };

    // HP は即時反映し、演出はスナップショットから再生する（startBattle と同じ）
    target.hp = result.dEndHp;
    this.mode = 'free';
    if (!this.animOn) {
      this.log(`${u.name} は ${target.name} を ${result.staffHeal!.amount} 回復した`);
      if (lv) this.log(`${u.name} は レベル ${lv.newLevel} に上がった`);
      this.endAction(u);
      return;
    }
    this.battle = new BattleScene(result, expAnim, () => {
      this.battle = undefined;
      this.log(`${u.name} は ${target.name} を ${result.staffHeal!.amount} 回復した`);
      if (lv) this.log(`${u.name} は レベル ${lv.newLevel} に上がった`);
      this.endAction(u);
    });
  }

  /** 制圧。FE の勝利条件で、敵を殺し切る必要はない */
  private doSeize(u: Unit) {
    this.log(`${u.name} は玉座を制圧した`);
    this.flags.ending = true;
    this.win();
  }

  /** 村を訪ねる。一度きりで、中身は data 側が持つ */
  private doVisit(u: Unit) {
    const v = this.villageAt(u.x, u.y);
    if (!v) return;
    this.visited.add(v.x + ',' + v.y);
    if (v.weapon) {
      u.items.push(cloneWeapon(v.weapon));
      this.log(`${u.name} は ${u.items[u.items.length - 1].name} を受け取った`);
    }
    if (v.potion) {
      u.potion += v.potion;
      this.log(`${u.name} は傷薬を ${v.potion} 個受け取った`);
    }
    this.playScript({ id: 'village_' + v.x + '_' + v.y, lines: [{ text: v.text }] }, () => this.endAction(u));
  }

  private doChest(u: Unit) {
    const c = this.chestAt(u.x, u.y);
    if (!c) return;
    this.opened.add(c.x + ',' + c.y);
    u.keys -= 1;
    if (c.weapon) {
      u.items.push(cloneWeapon(c.weapon));
      this.log(`${u.name} は ${u.items[u.items.length - 1].name} を手に入れた`);
    }
    if (c.gold) {
      this.gold += c.gold;
      this.log(`${c.gold} ゴールドを手に入れた`);
    }
    this.endAction(u);
  }

  private doDoor(u: Unit) {
    const d = this.doorNear(u);
    if (!d) return;
    u.keys -= 1;
    // 扉は開くと通れるようになる。地形そのものを書き換える
    MAP[d.y] = MAP[d.y].slice(0, d.x) + '.' + MAP[d.y].slice(d.x + 1);
    this.log(`${u.name} は扉を開けた`);
    this.endAction(u);
  }

  openShopMenu() {
    const items: MenuItem[] = SHOP.map((s, i) => {
      const w = cloneWeapon(s.weapon);
      return { id: `buy:${i}`, label: w.name, enabled: this.gold >= s.price, sub: `${s.price}G` };
    });
    items.push({ id: 'wait', label: '出る', enabled: true });
    this.menu = { items, index: 0, x: 0, y: 0, w: 232, title: `武器屋  所持金 ${this.gold}G` };
    this.mode = 'menu';
  }

  private doBuy(u: Unit, i: number) {
    const s = SHOP[i];
    if (!s || this.gold < s.price) return;
    this.gold -= s.price;
    u.items.push(cloneWeapon(s.weapon));
    this.log(`${u.name} は ${u.items[u.items.length - 1].name} を買った`);
    this.openShopMenu();
  }

  /** トレード。渡す側と受け取る側を一つのメニューに並べる */
  openTradeMenu(u: Unit, other: Unit) {
    this.tradePartner = other;
    const items: MenuItem[] = [];
    for (const [i, w] of u.items.entries()) items.push({ id: `give:${i}`, label: `→ ${w.name}`, enabled: true, sub: `${w.uses}` });
    for (const [i, w] of other.items.entries()) items.push({ id: `take:${i}`, label: `← ${w.name}`, enabled: true, sub: `${w.uses}` });
    items.push({ id: 'wait', label: '終わる', enabled: true });
    this.menu = { items, index: 0, x: 0, y: 0, w: 220, title: `${other.name} と交換` };
    this.mode = 'menu';
  }

  private moveItem(from: Unit, to: Unit, i: number) {
    const w = from.items[i];
    if (!w) return;
    from.items.splice(i, 1);
    to.items.push(w);
    if (from.equipped >= from.items.length) from.equipped = Math.max(0, from.items.length - 1);
    this.log(`${w.name} を ${to.name} へ渡した`);
    this.openTradeMenu(this.sel!, this.tradePartner!);
  }

  private doTalk(target: Unit) {
    const u = this.sel;
    if (!u) return;
    this.mode = 'free';

    if (target.team === 'enemy' && target.recruitableBy === u.id) {
      const join = () => {
        target.team = 'player';
        target.ai = undefined;
        target.recruitableBy = undefined;
        target.acted = true;
        this.log(`${target.name} が仲間になった`);
        this.endAction(u);
      };
      // 台本があれば喋ってから、無ければ黙って加わる
      const recruit = this.scripts.recruit?.[target.id];
      if (recruit) this.playScript(recruit, join);
      else join();
      return;
    }

    const bossTalk = this.scripts.bossTalk;
    if (target.isBoss && bossTalk) {
      this.playScript(bossTalk, () => {
        this.flags.bossTalked = true;
        target.stats.def = Math.max(0, target.stats.def - 2);
        this.log(`${target.name} の守備が下がった`);
        this.endAction(u);
      });
      return;
    }
    this.endAction(u);
  }

  private doSupport(target: Unit) {
    const u = this.sel;
    if (!u) return;
    const la = linkOf(u, target.id);
    const lb = linkOf(target, u.id);
    if (!la || !lb) return;
    this.mode = 'free';

    const rank = la.rank + 1;
    const script = supportScript(u.id, target.id, rank);
    const finish = () => {
      la.rank = rank as 1 | 2 | 3;
      lb.rank = rank as 1 | 2 | 3;
      this.log(`${u.name} と ${target.name} の支援が ${RANK_LABEL[rank]} になった`);
      this.endAction(u);
    };
    if (script) this.playScript(script, finish);
    else finish();
  }

  private applyPromotion(u: Unit, classId: string) {
    const from = classOf(u.classId);
    const gain = from.promoGain ?? {};
    for (const k of Object.keys(gain) as (keyof Stats)[]) {
      u.stats[k] += gain[k] ?? 0;
    }
    u.hp += gain.hp ?? 0;
    u.classId = classId;
    u.level = 1;
    u.exp = 0;
    u.seals -= 1;
    this.log(`${u.name} は ${classOf(classId).name} にクラスチェンジした！`);
    this.showBanner(`CLASS CHANGE  →  ${classOf(classId).name}`, '#ffd24a');
    this.endAction(u);
  }

  // ---------------------------------------------------------------- phases

  endPlayerPhase() {
    this.clearSelection();
    this.phase = 'enemy';
    this.showBanner('敵軍フェイズ', '#ff8f8f');
    for (const u of this.units) {
      if (u.team !== 'enemy' || u.dead) continue;
      u.acted = false;
      u.canto = false;
      if (u.status?.kind === 'sleep') u.acted = true;
      const dmg = tickStatus(u);
      if (dmg > 0) this.log(`${u.name} は毒で ${dmg} 受けた`);
    }
    // 狂戦にかかった自軍もここで動く。誰の指図も受けない
    const berserked = this.alive('player').filter((u) => u.status?.kind === 'berserk' && !u.carried);
    this.enemyQueue = [...this.alive('enemy').filter((u) => !u.acted), ...berserked];
    this.enemyTimer = 0.7;
  }

  startPlayerPhase() {
    this.turn += 1;
    this.phase = 'player';
    this.showBanner(`自軍フェイズ  ${this.turn}`, '#8fc0ff');
    for (const u of this.units) {
      if (u.team !== 'player' || u.dead) continue;
      u.acted = false;
      u.canto = false;
      // 眠っているあいだは動かせない。狂戦は敵軍フェイズに勝手に動く
      if (u.status?.kind === 'sleep' || u.status?.kind === 'berserk') u.acted = true;
      const dmg = tickStatus(u);
      if (dmg > 0) this.log(`${u.name} は毒で ${dmg} 受けた`);
      const t = terrainAt(MAP, u.x, u.y);
      if (t.heal && u.hp < maxHp(u)) {
        const heal = Math.max(1, Math.floor(maxHp(u) * t.heal));
        u.hp = Math.min(maxHp(u), u.hp + heal);
      }
    }
    // 隣接している味方同士の友好度が上がる
    accumulateSupport(this.units);
    this.spawnReinforcements();
    const first = this.alive('player').find((u) => !u.acted && !u.carried) ?? this.alive('player')[0];
    if (first) this.cursor = { x: first.x, y: first.y };
    if (this.options.showObjective) this.objectiveNotice = 2.2;
  }

  /**
   * そのターンの増援を盤に置く。行き先が塞がっていれば近くの空きへ回す。
   * FE は自軍フェイズの頭に湧いて、その敵軍フェイズから動く。
   */
  private spawnReinforcements() {
    const due = this.pendingReinforcements.filter((r) => r.turn <= this.turn);
    if (!due.length) return;
    this.pendingReinforcements = this.pendingReinforcements.filter((r) => r.turn > this.turn);
    let n = 0;
    for (const r of due) {
      const spot = this.freeNear(r.at);
      if (!spot) continue;
      const u = build({ ...r.seed, x: spot.x, y: spot.y }, 'enemy');
      u.px = spot.x;
      u.py = spot.y;
      u.acted = true;
      this.units.push(u);
      n += 1;
    }
    if (n > 0) {
      this.log(`敵の増援が ${n} 体 現れた`);
      this.showBanner('増援', '#ff8f8f');
    }
  }

  /** その座標か、その周りの空きマス */
  private freeNear(at: Pos): Pos | undefined {
    const seen = new Set<number>();
    const queue: Pos[] = [at];
    while (queue.length) {
      const p = queue.shift()!;
      if (p.x < 0 || p.y < 0 || p.x >= MAP_W || p.y >= MAP_H) continue;
      const k = key(p.x, p.y);
      if (seen.has(k)) continue;
      seen.add(k);
      if (terrainAt(MAP, p.x, p.y).cost[0] < 99 && !unitAt(this.units, p.x, p.y)) return p;
      queue.push({ x: p.x + 1, y: p.y }, { x: p.x - 1, y: p.y }, { x: p.x, y: p.y + 1 }, { x: p.x, y: p.y - 1 });
    }
    return undefined;
  }

  private updateEnemyPhase(dt: number) {
    if (this.busy) return;
    this.enemyTimer -= dt;
    if (this.enemyTimer > 0) return;

    const next = this.enemyQueue.shift();
    if (!next) {
      for (const u of this.alive('enemy')) {
        const t = terrainAt(MAP, u.x, u.y);
        if (t.heal && u.hp < maxHp(u)) u.hp = Math.min(maxHp(u), u.hp + Math.max(1, Math.floor(maxHp(u) * t.heal)));
      }
      this.startPlayerPhase();
      return;
    }
    if (next.dead || next.carried || (next.team !== 'enemy' && next.status?.kind !== 'berserk')) {
      this.enemyTimer = 0;
      return;
    }

    this.cursor = { x: next.x, y: next.y };
    const action = decideAction(next, this.units);

    if (action.kind === 'wait') {
      next.acted = true;
      this.enemyTimer = 0.12;
      return;
    }

    const range = computeMoveRange(next, this.units);
    const path = pathTo(range, action.dest.x, action.dest.y);
    const walkPath = path.length ? path : [{ x: next.x, y: next.y }];

    this.startWalk(next, walkPath, () => {
      if (action.kind === 'attack') {
        this.startBattle(next, action.target, () => {
          next.acted = true;
          this.enemyTimer = 0.25;
          this.checkResult();
        });
      } else {
        next.acted = true;
        this.enemyTimer = 0.2;
      }
    });
  }

  checkResult() {
    if (this.result || this.flags.ending) return;

    // 制圧の章では敵を全滅させても勝ちにはならない。玉座に立つまで続く。
    if (this.objective.kind !== 'seize' && this.alive('enemy').length === 0) {
      this.flags.ending = true;
      this.win();
      return;
    }
    const lord = this.units.find((u) => u.isLord);
    if (this.alive('player').length === 0 || (lord && lord.dead)) {
      this.flags.ending = true;
      const lost = () => {
        this.result = 'lose';
        this.mode = 'result';
        this.showBanner('DEFEAT', '#ff7070');
      };
      this.playScript(this.scripts.defeat ?? DEFEAT, lost);
    }
  }

  // ---------------------------------------------------------------- update

  update(dt: number) {
    // 歩行中のユニット以外は描画位置をタイルへ吸着させる
    const walking = this.walk?.unit;
    for (const u of this.units) {
      if (u === walking) continue;
      u.px = u.x;
      u.py = u.y;
    }

    if (this.banner) {
      this.banner.t += dt;
      if (this.banner.t > 1.6) this.banner = undefined;
    }
    if (this.objectiveNotice > 0) this.objectiveNotice = Math.max(0, this.objectiveNotice - dt);
    for (const m of this.messages) m.t += dt;
    this.messages = this.messages.filter((m) => m.t < 4);

    if (this.dialogue) {
      this.dialogue.update(dt);
      return;
    }
    if (this.battle) {
      this.battle.update(dt);
      if (this.battle.finished) {
        this.battle = undefined;
        const cb = this.afterBattle;
        this.afterBattle = undefined;
        cb?.();
      }
      return;
    }
    if (this.walk) {
      this.updateWalk(dt);
      return;
    }
    if (this.result) return;
    if (this.phase === 'enemy') this.updateEnemyPhase(dt);
  }

  // ---------------------------------------------------------------- input

  moveCursor(dx: number, dy: number) {
    if (this.mode === 'options') {
      const n = OPTION_ROWS.length;
      if (dy) this.optionIndex = (this.optionIndex + (dy > 0 ? 1 : n - 1)) % n;
      if (dx) this.cycleOption(this.optionIndex, dx > 0 ? 1 : -1);
      return;
    }
    if (this.mode === 'roster') {
      if (dx) this.rosterPage = (this.rosterPage + (dx > 0 ? 1 : ROSTER_PAGES - 1)) % ROSTER_PAGES;
      const list = this.rosterList();
      if (dy && list.length) this.rosterIndex = (this.rosterIndex + (dy > 0 ? 1 : list.length - 1)) % list.length;
      return;
    }
    if (this.mode === 'guide') {
      if (dy) this.guideIndex = Math.max(0, Math.min(GUIDE_COUNT - 1, this.guideIndex + (dy > 0 ? 1 : -1)));
      return;
    }
    if (this.mode === 'unit') {
      if (dx) this.inspectPage = (this.inspectPage + (dx > 0 ? 1 : 2)) % 3;
      return;
    }
    if (this.dialogue) return;
    if (this.mode === 'target') {
      const n = this.targetCount;
      if (n > 0 && (dx !== 0 || dy !== 0)) {
        this.targetIndex = (this.targetIndex + (dx + dy > 0 ? 1 : -1) + n) % n;
        const t = this.targetKind === 'drop' ? this.posTargets[this.targetIndex] : this.targets[this.targetIndex];
        this.cursor = { x: t.x, y: t.y };
      }
      return;
    }
    if (this.menu) {
      if (dy !== 0) {
        const n = this.menu.items.length;
        let i = this.menu.index;
        for (let k = 0; k < n; k++) {
          i = (i + (dy > 0 ? 1 : -1) + n) % n;
          if (this.menu.items[i].enabled) break;
        }
        this.menu.index = i;
      }
      return;
    }
    this.cursor.x = Math.max(0, Math.min(MAP_W - 1, this.cursor.x + dx));
    this.cursor.y = Math.max(0, Math.min(MAP_H - 1, this.cursor.y + dy));
  }

  confirm() {
    if (this.dialogue) {
      this.dialogue.advance();
      return;
    }
    if (this.busy) {
      this.battle?.skip();
      return;
    }
    if (this.result) return;
    // 状況画面と詳細画面はどのボタンでも閉じる。詳細だけは開く前の場面へ戻す
    if (this.mode === 'unit') {
      this.mode = this.inspectFrom;
      return;
    }
    if (this.mode === 'options' || this.mode === 'status' || this.mode === 'roster' || this.mode === 'guide') {
      if (this.mode === 'options') this.campaign.options = { ...this.options };
      this.mode = 'free';
      return;
    }
    if (this.phase !== 'player') return;

    switch (this.mode) {
      case 'free': {
        const u = this.unitAtCursor();
        // FE と同じ: 誰もいない（か動き終わった）マスで決定するとマップメニュー
        if (!u) {
          this.openMapMenu();
          break;
        }
        if (u.team === 'player' && !u.acted) this.selectUnit(u);
        else if (u) {
          this.sel = u;
          this.from = { x: u.x, y: u.y };
          this.range = computeMoveRange(u, this.units);
          this.moveTiles = new Set(this.range.stand);
          this.atkTiles = new Set();
          this.mode = 'move';
        }
        break;
      }

      case 'move': {
        const u = this.sel;
        if (!u) break;
        if (u.team !== 'player' || u.acted) {
          this.clearSelection();
          break;
        }
        const k = key(this.cursor.x, this.cursor.y);
        if (!this.moveTiles.has(k) || !this.range) break;
        const path = pathTo(this.range, this.cursor.x, this.cursor.y);
        // 再移動ぶんの残りを控えておく。行動後にこれだけ動ける
        this.cantoBudget = Math.max(0, (u.canto ? this.cantoBudget : u.stats.mov) - (this.range.cost.get(k) ?? 0));
        const wasCanto = u.canto;
        this.mode = 'menu';
        this.menu = undefined;
        this.startWalk(u, path, () => (wasCanto ? this.finishAction(u) : this.openActionMenu()));
        break;
      }

      case 'menu':
        this.pickMenu();
        break;

      case 'target': {
        if (this.targetKind === 'drop') {
          const p = this.posTargets[this.targetIndex];
          if (p) this.doDrop(p);
          break;
        }
        const t = this.targets[this.targetIndex];
        if (!t) break;
        if (this.targetKind === 'attack') this.doAttack(t);
        else if (this.targetKind === 'staff') this.doHeal(t);
        else if (this.targetKind === 'talk') this.doTalk(t);
        else if (this.targetKind === 'trade') this.openTradeMenu(this.sel!, t);
        else if (this.targetKind === 'rescue') this.doRescue(t);
        else if (this.targetKind === 'take') this.doTake(t);
        else if (this.targetKind === 'steal') this.doSteal(t);
        else if (this.targetKind === 'dance') this.doDance(t);
        else this.doSupport(t);
        break;
      }

      default:
        break;
    }
  }

  private beginTargeting(kind: TargetKind, targets: Unit[]) {
    if (!targets.length) return;
    this.targets = targets;
    this.posTargets = [];
    this.targetIndex = 0;
    this.targetKind = kind;
    this.cursor = { x: targets[0].x, y: targets[0].y };
    this.menu = undefined;
    this.mode = 'target';
  }

  /** 降ろす先のマスを選ぶ。相手ではなく空きマスを回す */
  private beginDropTargeting(u: Unit) {
    const tiles = this.dropTiles(u);
    if (!tiles.length) return;
    this.targets = [];
    this.posTargets = tiles;
    this.targetIndex = 0;
    this.targetKind = 'drop';
    this.cursor = { ...tiles[0] };
    this.menu = undefined;
    this.mode = 'target';
  }

  /** いま選んでいる対象の数。マスを選ぶ「降ろす」も同じ顔で数える */
  get targetCount() {
    return this.targetKind === 'drop' ? this.posTargets.length : this.targets.length;
  }

  pickMenu() {
    const menu = this.menu;
    const item = menu?.items[menu.index];
    if (!menu || !item || !item.enabled) return;

    // マップメニューはユニットを選んでいない
    if (item.id === 'status') {
      this.menu = undefined;
      this.mode = 'status';
      return;
    }
    if (item.id === 'roster') {
      this.menu = undefined;
      this.rosterPage = 0;
      this.rosterIndex = 0;
      this.mode = 'roster';
      return;
    }
    if (item.id === 'guide') {
      this.menu = undefined;
      this.guideIndex = 0;
      this.mode = 'guide';
      return;
    }
    if (item.id === 'options') {
      this.menu = undefined;
      this.optionIndex = 0;
      this.mode = 'options';
      return;
    }
    if (item.id === 'suspend') {
      this.menu = undefined;
      this.mode = 'free';
      this.suspendRequested = true;
      return;
    }
    if (item.id === 'endturn') {
      this.menu = undefined;
      this.endPlayerPhase();
      return;
    }
    const u = this.sel;
    if (!u) {
      this.menu = undefined;
      this.mode = 'free';
      return;
    }

    if (item.id === 'seize') {
      this.doSeize(u);
      return;
    }
    if (item.id === 'chest') {
      this.doChest(u);
      return;
    }
    if (item.id === 'door') {
      this.doDoor(u);
      return;
    }
    if (item.id === 'shop') {
      this.openShopMenu();
      return;
    }
    if (item.id.startsWith('buy:')) {
      this.doBuy(u, Number(item.id.split(':')[1]));
      return;
    }
    if (item.id === 'visit') {
      this.doVisit(u);
      return;
    }
    if (item.id === 'trade') {
      this.beginTargeting('trade', this.tradeTargets(u));
      return;
    }
    if (item.id.startsWith('give:')) {
      this.moveItem(u, this.tradePartner!, Number(item.id.split(':')[1]));
      return;
    }
    if (item.id.startsWith('take:')) {
      this.moveItem(this.tradePartner!, u, Number(item.id.split(':')[1]));
      return;
    }
    if (item.id === 'attack') {
      this.openWeaponMenu();
      return;
    }
    if (item.id.startsWith('useweapon:')) {
      const w = this.attackableWeapons(u)[Number(item.id.split(':')[1])];
      if (!w) return;
      // 選んだ武器で戦う。装備を持ち替えてから対象を選ぶ、が FE の順番
      u.equipped = u.items.indexOf(w);
      this.chosenWeapon = w;
      this.beginTargeting('attack', this.enemiesInRange(u, w.minRange, w.maxRange));
      return;
    }
    if (item.id === 'staff') {
      this.openStaffMenu();
      return;
    }
    if (item.id.startsWith('usestaff:')) {
      const s = staves(u)[Number(item.id.split(':')[1])];
      if (!s) return;
      this.chosenStaff = s;
      this.beginTargeting('staff', this.staffTargets(u, s));
      return;
    }
    if (item.id === 'rescue') {
      this.beginTargeting('rescue', this.rescueTargets(u));
      return;
    }
    if (item.id === 'take') {
      this.beginTargeting('take', this.takeTargets(u));
      return;
    }
    if (item.id === 'drop') {
      this.beginDropTargeting(u);
      return;
    }
    if (item.id === 'steal') {
      this.beginTargeting('steal', this.stealTargets(u));
      return;
    }
    if (item.id === 'dance') {
      this.beginTargeting('dance', this.danceTargets(u));
      return;
    }
    if (item.id === 'arena') {
      this.doArena(u);
      return;
    }
    if (item.id === 'convoy') {
      this.openConvoyMenu();
      return;
    }
    if (item.id.startsWith('store:')) {
      const i = Number(item.id.split(':')[1]);
      const w = u.items[i];
      if (!w) return;
      u.items.splice(i, 1);
      this.campaign.convoy.push(w);
      if (u.equipped >= u.items.length) u.equipped = Math.max(0, u.items.length - 1);
      this.log(`${w.name} を輸送隊へ預けた`);
      this.openConvoyMenu();
      return;
    }
    if (item.id.startsWith('fetch:')) {
      const i = Number(item.id.split(':')[1]);
      const w = this.campaign.convoy[i];
      if (!w || u.items.length >= 5) return;
      this.campaign.convoy.splice(i, 1);
      u.items.push(w);
      this.log(`${w.name} を輸送隊から受け取った`);
      this.openConvoyMenu();
      return;
    }
    if (item.id === 'canto') {
      // 再移動。移動先を選ぶモードへ戻す
      this.menu = undefined;
      this.mode = 'move';
      return;
    }
    if (item.id === 'talk') {
      this.beginTargeting('talk', this.talkTargets(u));
      return;
    }
    if (item.id === 'support') {
      this.beginTargeting('support', this.supportTargets(u));
      return;
    }
    if (item.id === 'item') {
      this.openItemMenu();
      return;
    }
    if (item.id === 'potion') {
      const before = u.hp;
      u.hp = Math.min(maxHp(u), u.hp + 10);
      u.potion -= 1;
      this.log(`${u.name} は傷薬で ${u.hp - before} 回復した`);
      this.endAction(u);
      return;
    }
    if (item.id === 'seal') {
      this.openPromotionMenu();
      return;
    }
    if (item.id.startsWith('promote:')) {
      this.applyPromotion(u, item.id.split(':')[1]);
      return;
    }
    if (item.id.startsWith('equip:')) {
      const i = Number(item.id.split(':')[1]);
      u.equipped = i;
      this.log(`${u.name} は ${u.items[i].name} を装備した`);
      this.openActionMenu();
      return;
    }
    if (item.id === 'back') {
      this.openActionMenu();
      return;
    }
    if (item.id === 'wait') {
      // 「待機」は何も残さず終わる。再移動もここで打ち切る
      this.finishAction(u);
    }
  }

  cancel() {
    if (this.dialogue) {
      this.dialogue.skip();
      return;
    }
    if (this.busy) {
      this.battle?.skip();
      return;
    }
    if (this.result) return;

    if (this.mode === 'unit') {
      this.mode = this.inspectFrom;
      return;
    }
    if (this.mode === 'status' || this.mode === 'options' || this.mode === 'roster' || this.mode === 'guide') {
      if (this.mode === 'options') this.campaign.options = { ...this.options };
      this.mode = 'free';
      return;
    }

    switch (this.mode) {
      case 'move':
        // 再移動の途中でやめたら、その場で待機。行動そのものは取り消せない
        if (this.sel?.canto) this.openCantoMenu();
        else this.clearSelection();
        break;
      case 'menu': {
        if (this.menu?.title) {
          this.openActionMenu();
          break;
        }
        const u = this.sel;
        if (u?.canto) {
          this.openCantoMenu();
          break;
        }
        if (u && this.from) {
          u.x = this.from.x;
          u.y = this.from.y;
          u.px = u.x;
          u.py = u.y;
          this.menu = undefined;
          this.selectUnit(u);
        }
        break;
      }
      case 'target':
        this.targets = [];
        this.posTargets = [];
        this.cursor = { x: this.sel!.x, y: this.sel!.y };
        if (this.sel?.canto) this.openCantoMenu();
        else this.openActionMenu();
        break;
      default:
        break;
    }
  }

  /** オプションを 1 段回す。指で押したときも同じ道を通る */
  cycleOption(index: number, dir: number) {
    const row = OPTION_ROWS[index];
    if (!row) return;
    const n = row.values.length;
    this.options[row.key] = (this.options[row.key] + (dir > 0 ? 1 : n - 1)) % n;
    if (row.key === 'textSpeed') setTextSpeed(this.options.textSpeed);
    if (row.key === 'sfx') setSfx(!!this.options.sfx);
  }

  /** ユニット一覧に並べる面々。担がれている者も含めて全員 */
  rosterList(): Unit[] {
    return this.units.filter((u) => u.team === 'player' && !u.dead);
  }

  requestEndTurn() {
    if (this.phase !== 'player' || this.busy || this.result) return;
    if (this.mode !== 'free') return;
    this.endPlayerPhase();
  }

  /** 現在のカーソル位置での戦闘予測（target モード用） */
  currentForecast() {
    if (this.mode !== 'target' || this.targetKind !== 'attack' || !this.sel) return undefined;
    const t = this.targets[this.targetIndex];
    if (!t) return undefined;
    return forecast(this.sel, { x: this.sel.x, y: this.sel.y }, t, { x: t.x, y: t.y }, this.units);
  }
}
