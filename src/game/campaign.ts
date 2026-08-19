import type { Unit, Weapon } from '../types';
import { CHAPTERS, chapterDef, isStoryChapter, loadChapter, START_GOLD } from '../data/chapters';
import { build, createRoster, ROSTER } from '../data/roster';
import { DEFAULT_OPTIONS, type GameOptions } from './options';

const SAVE_KEY = 'srpg-save-v1';

/**
 * 章をまたいで残るもの。
 *
 * FE は章の中で完結するのは地形と敵だけで、部隊・所持金・経験値は持ち越す。
 * 準備画面が出撃を選び、ワールドマップが章と章のあいだに立つ。
 */
export class Campaign {
  chapter = 0;
  gold = START_GOLD;
  /** 自軍の全員。倒れた者は roster から外れる */
  roster: Unit[] = createRoster();
  /** 出撃させる者の id。準備画面が書き換える */
  deployed: string[] = [];
  /** 到達済みの章。ワールドマップでどこまで行けるか */
  cleared = 0;
  /**
   * 輸送隊。FE は 5 枠に収まらない持ち物をここへ預ける。章をまたいで残り、
   * 準備画面と、章の中ではロードに手が届くところで出し入れできる。
   */
  convoy: Weapon[] = [];
  /** オプション。章をまたいで残るので campaign が持ち、Game が借りる */
  options: GameOptions = { ...DEFAULT_OPTIONS };

  constructor() {
    this.autoDeploy();
  }

  get def() {
    return chapterDef(this.chapter);
  }

  /** 出撃枠ぶんだけ上から詰める。ロードは必ず出る */
  autoDeploy() {
    const slots = this.def.deploy;
    const lord = this.roster.find((u) => u.isLord);
    const rest = this.roster.filter((u) => !u.isLord && !u.dead);
    this.deployed = [lord?.id ?? '', ...rest.map((u) => u.id)].filter(Boolean).slice(0, slots);
  }

  toggle(id: string) {
    const u = this.roster.find((r) => r.id === id);
    if (!u || u.isLord) return;
    const at = this.deployed.indexOf(id);
    if (at >= 0) this.deployed.splice(at, 1);
    else if (this.deployed.length < this.def.deploy) this.deployed.push(id);
  }

  /** 出撃する面々を、その章の開始位置に並べて返す */
  fielded(): Unit[] {
    const def = this.def;
    const out: Unit[] = [];
    for (const [i, id] of this.deployed.entries()) {
      const u = this.roster.find((r) => r.id === id);
      if (!u || u.dead) continue;
      const p = def.starts[i] ?? def.starts[def.starts.length - 1];
      u.x = p.x;
      u.y = p.y;
      u.px = p.x;
      u.py = p.y;
      u.acted = false;
      out.push(u);
    }
    return out;
  }

  start(index: number) {
    this.chapter = index;
    loadChapter(index);
    this.autoDeploy();
  }

  /** 章を終えた。次があれば進める。塔と群れは進行に数えない */
  finish() {
    if (!isStoryChapter(this.chapter)) return;
    this.cleared = Math.max(this.cleared, this.chapter + 1);
  }

  get hasNext() {
    return this.chapter + 1 < CHAPTERS.length;
  }

  // ------------------------------------------------------------- セーブ

  /**
   * 中断とセーブ。FE の「中断」は再開すると消えるが、ここは区別せず一枠だけ持つ。
   * 保存するのは持ち越すものだけで、地形や敵は章の定義から作り直す。
   */
  save() {
    const data = {
      chapter: this.chapter,
      cleared: this.cleared,
      gold: this.gold,
      deployed: this.deployed,
      roster: this.roster.map((u) => ({
        id: u.id,
        level: u.level,
        exp: u.exp,
        hp: u.hp,
        dead: u.dead ?? false,
        classId: u.classId,
        stats: u.stats,
        items: u.items,
        equipped: u.equipped,
        potion: u.potion,
        keys: u.keys,
        seals: u.seals,
        wexp: u.wexp,
        supports: u.supports,
      })),
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  }

  static hasSave() {
    try {
      return !!localStorage.getItem(SAVE_KEY);
    } catch {
      return false;
    }
  }

  static load(): Campaign | undefined {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(SAVE_KEY);
    } catch {
      return undefined;
    }
    if (!raw) return undefined;
    let data: ReturnType<Campaign['saveShape']>;
    try {
      data = JSON.parse(raw);
    } catch {
      return undefined;
    }
    const c = new Campaign();
    c.chapter = data.chapter ?? 0;
    c.cleared = data.cleared ?? 0;
    c.gold = data.gold ?? START_GOLD;
    // 保存してあるのは差分だけ。素体は seed から作り直して被せる
    c.roster = ROSTER.map((s) => build(s, 'player'));
    for (const saved of data.roster ?? []) {
      const u = c.roster.find((r) => r.id === saved.id);
      if (!u) continue;
      Object.assign(u, saved);
    }
    c.deployed = data.deployed ?? [];
    loadChapter(c.chapter);
    if (!c.deployed.length) c.autoDeploy();
    return c;
  }

  /** load 側で型を借りるためだけのもの */
  private saveShape() {
    return {
      chapter: 0,
      cleared: 0,
      gold: 0,
      deployed: [] as string[],
      roster: [] as (Partial<Unit> & { id: string })[],
    };
  }
}
