import type { Pos, Unit } from '../types';
import type { Seed } from './roster';
import { CH1 } from './chapters/ch1';
import { CH2 } from './chapters/ch2';
import { CH3 } from './chapters/ch3';
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

export interface ChapterDef {
  title: string;
  map: string[];
  /** FE の章目標。制圧は玉座の座標を持つ */
  objective: { kind: 'seize' | 'rout'; x?: number; y?: number; label: string };
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
}

/** 本編。ワールドマップに並ぶのはこれだけで、cleared もこれを数える */
export const CHAPTERS: ChapterDef[] = [CH1, CH2, CH3];

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
