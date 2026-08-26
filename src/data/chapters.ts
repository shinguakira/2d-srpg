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
import { CH11 } from './chapters/ch11';
import { CH12 } from './chapters/ch12';
import { CH13 } from './chapters/ch13';
import { CH14 } from './chapters/ch14';
import { CH15 } from './chapters/ch15';
import { CH16 } from './chapters/ch16';
import { CH17 } from './chapters/ch17';
import { CH18 } from './chapters/ch18';
import { CH19 } from './chapters/ch19';
import { CH20 } from './chapters/ch20';
import { CH21 } from './chapters/ch21';
import { CH22 } from './chapters/ch22';
import { CH23 } from './chapters/ch23';
import { CH24 } from './chapters/ch24';
import { CH25 } from './chapters/ch25';
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
  /**
   * 引き金。**自軍がここへ踏み込んだ最初の自軍フェイズに湧く。**
   *
   * ターンで湧く増援は遅く進む者を罰し、引き金で湧く増援は不用意に進む者を罰する。
   * 後半の章はほとんど後者で組む（specs/story/chapter-scale.md）。`turn` は
   * 「これより前には湧かない」下限として残る。
   */
  when?: { x: number; y: number; r: number };
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
  /**
   * この id を討ち取っていたら、この事件は起きない。
   *
   * **見逃した者だけが後で来る。** 第6章でエイリンを殺せば第18章に彼女は来ない ——
   * 台本を書き分けるのではなく、盤で起きたことを `Campaign.slain` から読む。
   */
  unless?: string;
  /**
   * 地形の書き換え。**盤そのものが締まってくる章のためのもの。**
   *
   * 第24章の道は後ろから灰になり、その二ターン後に裂け目になって落ちる。
   * HUD の残りターン表示ではなく、床の減りかたで見せる。
   */
  terrain?: { x: number; y: number; ch: string }[];
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
    kind: 'seize' | 'rout' | 'boss' | 'survive' | 'escape' | 'breach';
    x?: number;
    y?: number;
    /** survive: 耐えるターン数 */
    turns?: number;
    /** breach: 石の目を読むのに要る連続ターン数（既定 3） */
    seamTurns?: number;
    /** breach: 岩が抜ける破石値（既定 60） */
    breakTotal?: number;
    /**
     * 倒れたら即座に負けになるユニット。**勝ち方とは独立**していて、どの kind
     * にも足せる —— FE の「〜を守れ」は目標ではなく敗北条件のほう。
     */
    guard?: string[];
    label: string;
  };
  /** 出撃できる人数。準備画面がこれを見る */
  deploy: number;
  /**
   * 強制出撃。**外せない者。** ロードは常に強制なので書かない。
   *
   * 第8章のハルヴァルがこれで、居なければ 4 ターン目の離脱も 13 ターン目の
   * 戦死も起きない —— 章そのものが無かったことになる。
   */
  forced?: string[];
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
  /**
   * 戦場の霧。**視界の半径（マス）。** 0 か未指定なら霧なし。
   *
   * 自軍から見えていないマスは暗く沈み、そこにいる敵は描かれない。第12章の
   * 夜の村がこれで、盤の広さではなく「見えない」ことが敵になる。
   */
  fog?: number;
}

/** 本編。ワールドマップに並ぶのはこれだけで、cleared もこれを数える */
export const CHAPTERS: ChapterDef[] = [
  CH1,
  CH2,
  CH3,
  CH4,
  CH5,
  CH6,
  CH7,
  CH8,
  CH9,
  CH10,
  CH11,
  CH12,
  CH13,
  CH14,
  CH15,
  CH16,
  CH17,
  CH18,
  CH19,
  CH20,
  CH21,
  CH22,
  CH23,
  CH24,
  CH25,
];

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
export let FOG = CH1.fog ?? 0;
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
  FOG = c.fog ?? 0;
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
