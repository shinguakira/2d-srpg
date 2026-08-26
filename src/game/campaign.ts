import type { Unit, Weapon } from '../types';
import { CHAPTERS, chapterDef, isStoryChapter, loadChapter, START_GOLD } from '../data/chapters';
import { build, createRoster, joinedBy, ROSTER } from '../data/roster';
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

  /**
   * 討ち取った名前付きの敵の id。
   *
   * **見逃したかどうかを、後の章が知るためのもの。** 第6章でエイリンを殺せば、
   * 第18章に彼女は来ない —— 台本のほうを条件付きにするのではなく、盤で起きた
   * ことを覚えておいて `ChapterEvent.unless` が読む。
   *
   * `specs/story/arc-structure.md` のエンディング条件（`aerynRecruited` など）は
   * まだ集計していないが、その最初の一つがこれ。
   */
  slain: string[] = [];

  constructor() {
    this.autoDeploy();
  }

  get def() {
    return chapterDef(this.chapter);
  }

  /**
   * いま出撃させられる面々。**まだ加入していない者は名簿に出ない。**
   *
   * 加入章は roster.ts の `joinsAt`（0 起点）。章の途中で入る者は、その章の
   * `events` が盤に置いたうえで、次の章からここに並ぶ。
   */
  available(): Unit[] {
    return this.roster.filter((u) => !u.dead && joinedBy(u.id, this.chapter) && this.recruited(u.id));
  }

  /**
   * 加入そのものが起きたか。**討ち取った相手は仲間にならない。**
   *
   * 第6章でエイリンを討てば第18章の加入事件は起きず（`ChapterEvent.unless`）、
   * ここが名簿からも外す。片方だけだと、来ていない人物が準備画面に並ぶ。
   */
  private recruited(id: string) {
    const seed = ROSTER.find((s) => s.id === id);
    return !seed?.unlessSlain || !this.slain.includes(seed.unlessSlain);
  }

  /** その章で外せない者。ロードと、章が名指ししている者 */
  forced(): string[] {
    const lord = this.roster.find((u) => u.isLord && !u.dead);
    const named = (this.def.forced ?? []).filter((id) => this.roster.some((u) => u.id === id && !u.dead));
    return [...new Set([lord?.id, ...named].filter((x): x is string => !!x))];
  }

  /** 出撃枠ぶんだけ上から詰める。ロードと強制出撃は必ず出る */
  autoDeploy() {
    const slots = this.def.deploy;
    const pool = this.available();
    const must = this.forced();
    const rest = pool.filter((u) => !must.includes(u.id));
    this.deployed = [...must, ...rest.map((u) => u.id)].slice(0, slots);
  }

  toggle(id: string) {
    const u = this.roster.find((r) => r.id === id);
    if (!u || this.forced().includes(id) || !joinedBy(u.id, this.chapter)) return;
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
      slain: this.slain,
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
    c.slain = data.slain ?? [];
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
      slain: [] as string[],
      roster: [] as (Partial<Unit> & { id: string })[],
    };
  }
}
