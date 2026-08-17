import { BattleScene, type ExpAnim } from '../battle/battleScene';
import { battleWeapon, canUse, forecast, gainExp, healAmount, maxHp, resolveBattle, staffOf } from '../battle/combat';
import { accumulateSupport, canRankUp, linkOf, RANK_LABEL } from '../battle/support';
import { computeMoveRange, key, manhattan, pathTo, unitAt, unkeyX, unkeyY, type MoveRange } from '../core/grid';
import { createUnits, MAP, MAP_H, MAP_W } from '../data/chapter1';
import { classOf } from '../data/classes';
import { terrainAt } from '../data/terrain';
import { DialogueScene, type Script } from '../story/dialogue';
import { BOSS_TALK, DEFEAT, ENDING, OPENING, RECRUIT_ROU, deathScript, supportScript } from '../story/script';
import { decideAction, threatTiles } from './ai';
import type { Pos, Stats, Unit } from '../types';

export type Mode = 'free' | 'move' | 'menu' | 'target' | 'result';
export type TargetKind = 'attack' | 'staff' | 'talk' | 'support';

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

export class Game {
  units: Unit[] = createUnits();
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
  targetIndex = 0;
  targetKind: TargetKind = 'attack';

  battle?: BattleScene;
  dialogue?: DialogueScene;
  walk?: Walk;

  showDanger = false;
  dangerTiles = new Set<number>();

  banner?: { text: string; t: number; color: string };
  messages: FloatMsg[] = [];
  result?: 'win' | 'lose';

  /** イベントの発生済みフラグ */
  flags = { bossTalked: false, ending: false };

  private enemyQueue: Unit[] = [];
  private enemyTimer = 0;
  private afterBattle?: () => void;

  constructor(skipOpening = false) {
    if (skipOpening) this.showBanner('第1章  「魔物の谷」', '#8fc0ff');
    else this.playScript(OPENING, () => this.showBanner('PLAYER PHASE  1', '#8fc0ff'));
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

  refreshDanger() {
    this.dangerTiles = this.showDanger ? threatTiles(this.units) : new Set();
  }

  // ---------------------------------------------------------------- 会話

  playScript(script: Script, after?: () => void) {
    this.dialogue = new DialogueScene(
      script,
      (id) => this.byId(id),
      () => {
        this.dialogue = undefined;
        after?.();
      },
    );
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

    const w = battleWeapon(u);
    this.atkTiles = new Set();
    if (w) {
      for (const k of this.range.stand) {
        const bx = unkeyX(k);
        const by = unkeyY(k);
        for (let dy = -w.maxRange; dy <= w.maxRange; dy++) {
          for (let dx = -w.maxRange; dx <= w.maxRange; dx++) {
            const d = Math.abs(dx) + Math.abs(dy);
            if (d < w.minRange || d > w.maxRange) continue;
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

  openActionMenu() {
    if (!this.sel) return;
    const u = this.sel;
    const w = battleWeapon(u);
    const staff = staffOf(u);

    const foes = w ? this.enemiesInRange(u, w.minRange, w.maxRange) : [];
    const allies = staff ? this.woundedAlliesInRange(u, staff.minRange, staff.maxRange) : [];
    const talk = this.talkTargets(u);
    const sup = this.supportTargets(u);

    const items: MenuItem[] = [];
    if (w) items.push({ id: 'attack', label: '攻撃', enabled: foes.length > 0 });
    if (staff) items.push({ id: 'staff', label: '杖', enabled: allies.length > 0 });
    if (talk.length) items.push({ id: 'talk', label: '会話', enabled: true });
    if (sup.length) items.push({ id: 'support', label: '支援', enabled: true });
    items.push({ id: 'item', label: '道具', enabled: true });
    items.push({ id: 'wait', label: '待機', enabled: true });

    const first = items.findIndex((i) => i.enabled);
    this.menu = { items, index: first < 0 ? 0 : first, x: 0, y: 0, w: 152 };
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

  private endAction(u: Unit) {
    u.acted = true;
    this.clearSelection();
    this.refreshDanger();
    this.checkResult();
    if (this.result || this.flags.ending) return;
    if (this.phase === 'player' && this.alive('player').every((p) => p.acted)) {
      this.endPlayerPhase();
    }
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
      const deaths: Script[] = [];
      for (const u of [attacker, defender]) {
        if (u.hp <= 0 && !u.dead) {
          u.dead = true;
          this.log(`${u.name} は倒れた`);
          deaths.push(deathScript(u.id, u.name));
        }
      }
      this.refreshDanger();
      if (deaths.length) this.playScripts(deaths, onDone);
      else onDone();
    };

    this.battle = new BattleScene(result, expAnim, () => {
      /* 終了検知は update 側で行う */
    });
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

  private doHeal(target: Unit) {
    const u = this.sel;
    if (!u) return;
    const staff = staffOf(u);
    if (!staff) return;
    const amount = healAmount(u, staff);
    const before = target.hp;
    target.hp = Math.min(maxHp(target), target.hp + amount);
    staff.uses -= 1;
    u.wexp[staff.type] = (u.wexp[staff.type] ?? 0) + 1;
    this.log(`${u.name} は ${target.name} を ${target.hp - before} 回復した`);
    const lv = gainExp(u, 11);
    if (lv) this.log(`${u.name} は レベル ${lv.newLevel} に上がった`);
    this.endAction(u);
  }

  private doTalk(target: Unit) {
    const u = this.sel;
    if (!u) return;
    this.mode = 'free';

    if (target.team === 'enemy' && target.recruitableBy === u.id) {
      this.playScript(RECRUIT_ROU, () => {
        target.team = 'player';
        target.ai = undefined;
        target.recruitableBy = undefined;
        target.acted = true;
        this.log(`${target.name} が仲間になった`);
        this.refreshDanger();
        this.endAction(u);
      });
      return;
    }

    if (target.isBoss) {
      this.playScript(BOSS_TALK, () => {
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
    this.showBanner('ENEMY PHASE', '#ff8f8f');
    this.enemyQueue = this.alive('enemy').slice();
    this.enemyTimer = 0.7;
    for (const u of this.units) if (u.team === 'enemy') u.acted = false;
  }

  startPlayerPhase() {
    this.turn += 1;
    this.phase = 'player';
    this.showBanner(`PLAYER PHASE  ${this.turn}`, '#8fc0ff');
    for (const u of this.units) {
      if (u.team !== 'player' || u.dead) continue;
      u.acted = false;
      const t = terrainAt(MAP, u.x, u.y);
      if (t.heal && u.hp < maxHp(u)) {
        const heal = Math.max(1, Math.floor(maxHp(u) * t.heal));
        u.hp = Math.min(maxHp(u), u.hp + heal);
      }
    }
    // 隣接している味方同士の友好度が上がる
    accumulateSupport(this.units);
    const first = this.alive('player')[0];
    if (first) this.cursor = { x: first.x, y: first.y };
    this.refreshDanger();
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
    if (next.dead || next.team !== 'enemy') {
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

    if (this.alive('enemy').length === 0) {
      this.flags.ending = true;
      this.playScript(ENDING, () => {
        this.result = 'win';
        this.mode = 'result';
        this.showBanner('VICTORY', '#ffd24a');
      });
      return;
    }
    const lord = this.units.find((u) => u.isLord);
    if (this.alive('player').length === 0 || (lord && lord.dead)) {
      this.flags.ending = true;
      this.playScript(DEFEAT, () => {
        this.result = 'lose';
        this.mode = 'result';
        this.showBanner('DEFEAT', '#ff7070');
      });
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
    if (this.dialogue) return;
    if (this.mode === 'target') {
      if (dx !== 0 || dy !== 0) {
        this.targetIndex = (this.targetIndex + (dx + dy > 0 ? 1 : -1) + this.targets.length) % this.targets.length;
        const t = this.targets[this.targetIndex];
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
    if (this.phase !== 'player') return;

    switch (this.mode) {
      case 'free': {
        const u = this.unitAtCursor();
        if (u && u.team === 'player' && !u.acted) this.selectUnit(u);
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
        this.mode = 'menu';
        this.menu = undefined;
        this.startWalk(u, path, () => this.openActionMenu());
        break;
      }

      case 'menu':
        this.pickMenu();
        break;

      case 'target': {
        const t = this.targets[this.targetIndex];
        if (!t) break;
        if (this.targetKind === 'attack') this.doAttack(t);
        else if (this.targetKind === 'staff') this.doHeal(t);
        else if (this.targetKind === 'talk') this.doTalk(t);
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
    this.targetIndex = 0;
    this.targetKind = kind;
    this.cursor = { x: targets[0].x, y: targets[0].y };
    this.menu = undefined;
    this.mode = 'target';
  }

  pickMenu() {
    const menu = this.menu;
    const u = this.sel;
    if (!menu || !u) return;
    const item = menu.items[menu.index];
    if (!item || !item.enabled) return;

    if (item.id === 'attack') {
      const w = battleWeapon(u)!;
      this.beginTargeting('attack', this.enemiesInRange(u, w.minRange, w.maxRange));
      return;
    }
    if (item.id === 'staff') {
      const s = staffOf(u)!;
      this.beginTargeting('staff', this.woundedAlliesInRange(u, s.minRange, s.maxRange));
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
      this.endAction(u);
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

    switch (this.mode) {
      case 'move':
        this.clearSelection();
        break;
      case 'menu': {
        if (this.menu?.title) {
          this.openActionMenu();
          break;
        }
        const u = this.sel;
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
        this.cursor = { x: this.sel!.x, y: this.sel!.y };
        this.openActionMenu();
        break;
      default:
        break;
    }
  }

  toggleDanger() {
    this.showDanger = !this.showDanger;
    this.refreshDanger();
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
