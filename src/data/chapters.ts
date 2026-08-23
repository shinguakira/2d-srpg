import type { ChapterScripts, Script } from '../story/dialogue';
import type { Pos, Unit } from '../types';
import type { Seed } from './roster';
import { CH1 } from './chapters/ch1';
import { CH2 } from './chapters/ch2';
import { CH3 } from './chapters/ch3';
import { CH4 } from './chapters/ch4';
import { CH5 } from './chapters/ch5';
import { CH6 } from './chapters/ch6';
import { CH7 } from './chapters/ch7';
import { CH8 } from './chapters/ch8';
import { CH9 } from './chapters/ch9';
import { CH10 } from './chapters/ch10';
import { SKIRMISH, TOWER } from './chapters/extra';

export interface Village {
  x: number;
  y: number;
  weapon?: string;
  potion?: number;
  text: string;
}

export interface Chest {
  x: number;
  y: number;
  weapon?: string;
  gold?: number;
}

/**
 * 増援。FE は「そのターンの敵軍フェイズの頭に、盤の縁や砦から湧く」ので、
 * 湧く場所と湧くターンだけ持たせる。turn は自軍フェイズのターン数で数える。
 */
export interface Reinforcement {
  turn: number;
  at: Pos;
  seed: Seed;
}

/**
 * ターンで起きること。**自軍フェイズの頭に、そのターンぶんがまとめて起きる。**
 *
 * 第5章の地形の書き換え、第8章のハルヴァルの九ターン、第10章の巨兵 —— アーク1の
 * 山場から先はほとんどの章がこれを前提に書かれている（specs/story/）。
 */
export interface ChapterEvent {
  /** 自軍フェイズのターン数 */
  turn: number;
  /** 流す会話 */
  script?: Script;
  /** 敵から自軍へ寝返らせる */
  defect?: string;
  /** 自軍から外して敵の AI に預ける（ハルヴァルが命令を破る） */
  toNpc?: string;
  /** 盤に置く */
  spawn?: { seed: Seed; team: 'player' | 'enemy' }[];
  /** 台本どおりに倒す。戦闘ではないので経験値も出ない */
  kill?: string;
  /** ログに一行出す */
  log?: string;
}

export interface ChapterDef {
  title: string;
  map: string[];
  /**
   * FE の章目標。
   *
   * `seize` は玉座の座標を持つ。`boss` はボスを倒せば残りは要らない。
   * `survive` は `turns` ターン耐えれば勝ちで、敵を殺し切っても終わらない。
   */
  objective: {
    kind: 'seize' | 'rout' | 'boss' | 'survive';
    x?: number;
    y?: number;
    /** survive: 耐えるターン数 */
    turns?: number;
    /**
     * 倒れたら即座に負けになるユニット。**勝ち方とは独立**していて、どの kind
     * にも足せる —— FE の「〜を守れ」は目標ではなく敗北条件のほう。
     */
    guard?: string[];
    label: string;
  };
  /** 出撃できる人数。準備画面がこれを見る */
  deploy: number;
  /** 出撃位置。先頭から順に配る */
  starts: Pos[];
  enemies: Seed[];
  villages: Village[];
  chests: Chest[];
  shop: { weapon: string; price: number }[];
  /** 途中で湧く敵。無い章は空 */
  reinforcements?: Reinforcement[];
  /** 闘技場の相手の強さ。地形 A を置いた章だけ使う */
  arenaLevel?: number;
  /** その章の会話。無い章（塔・魔物の群れ）は台詞なしで進む */
  scripts?: ChapterScripts;
  /**
   * 味方 NPC。自軍として盤に置くが出撃枠は食わない。動かせないよう mov 0 と
   * 武器なしで作るのが基本で、FE の「守れ」の対象がこれ。
   */
  allies?: Seed[];
  /** ターンで起きること。第5章から先はこれ抜きには書けない */
  events?: ChapterEvent[];
}

/** 本編。ワールドマップに並ぶのはこれだけで、cleared もこれを数える */
export const CHAPTERS: ChapterDef[] = [CH1, CH2, CH3, CH4, CH5, CH6, CH7, CH8, CH9, CH10];

/**
 * 本編の外の戦い。塔と、彷徨く魔物の群れ。章番号の続きに置いて、
 * loadChapter からは同じ番号で引けるようにする。
 */
export const TOWER_INDEX = CHAPTERS.length;
export const SKIRMISH_INDEX = CHAPTERS.length + 1;
const ALL_CHAPTERS: ChapterDef[] = [...CHAPTERS, TOWER, SKIRMISH];

export function chapterDef(index: number): ChapterDef {
  return ALL_CHAPTERS[Math.max(0, Math.min(ALL_CHAPTERS.length - 1, index))];
}

/** 本編の章か。塔と群れは進行に数えない */
export function isStoryChapter(index: number) {
  return index < CHAPTERS.length;
}

/**
 * いま読み込んでいる章。
 *
 * `MAP` などを `let` で公開しているのは、章を切り替えたときに読み手側へそのまま
 * 伝わるようにするため（ES モジュールの束縛は生きている）。扉を開けると地形が
 * 書き換わるので、章を読み直すたびに定義から作り直す。
 */
let CHAPTER = 0;
export let TITLE = CH1.title;
export let MAP: string[] = CH1.map.slice();
export let MAP_W = MAP[0].length;
export let MAP_H = MAP.length;
export let OBJECTIVE = CH1.objective;
export let VILLAGES: Village[] = CH1.villages;
export let CHESTS: Chest[] = CH1.chests;
export let SHOP = CH1.shop;
export let REINFORCEMENTS: Reinforcement[] = CH1.reinforcements ?? [];
export let ARENA_LEVEL = CH1.arenaLevel ?? 0;
export let EVENTS: ChapterEvent[] = CH1.events ?? [];

export const START_GOLD = 3000;

export function loadChapter(index: number) {
  const c = chapterDef(index);
  CHAPTER = index;
  TITLE = c.title;
  MAP = c.map.slice();
  MAP_W = MAP[0].length;
  MAP_H = MAP.length;
  OBJECTIVE = c.objective;
  VILLAGES = c.villages;
  CHESTS = c.chests;
  SHOP = c.shop;
  REINFORCEMENTS = c.reinforcements ?? [];
  ARENA_LEVEL = c.arenaLevel ?? 0;
  EVENTS = c.events ?? [];
}

/** 扉を開けた後の地形を書き戻す。中断から再開するときに使う */
export function setMap(rows: string[]) {
  MAP = rows.slice();
  MAP_W = MAP[0].length;
  MAP_H = MAP.length;
}

function chapter(): ChapterDef {
  return chapterDef(CHAPTER);
}

/** その章の敵。自軍は campaign 側が持ち回る */
export function createEnemies(build: (s: Seed, team: 'player' | 'enemy') => Unit): Unit[] {
  return chapter().enemies.map((s) => build(s, 'enemy'));
}

/** その章の味方 NPC。出撃枠は食わないので campaign を通さない */
export function createAllies(build: (s: Seed, team: 'player' | 'enemy') => Unit): Unit[] {
  return (chapter().allies ?? []).map((s) => build(s, 'player'));
}
