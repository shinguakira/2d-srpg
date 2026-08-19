import type { Pos, Unit } from '../types';
import type { Seed } from './roster';
import { CH1 } from './chapters/ch1';
import { CH2 } from './chapters/ch2';
import { CH3 } from './chapters/ch3';

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
}

export const CHAPTERS: ChapterDef[] = [CH1, CH2, CH3];

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

export const START_GOLD = 3000;

export function loadChapter(index: number) {
  const c = CHAPTERS[Math.max(0, Math.min(CHAPTERS.length - 1, index))];
  CHAPTER = index;
  TITLE = c.title;
  MAP = c.map.slice();
  MAP_W = MAP[0].length;
  MAP_H = MAP.length;
  OBJECTIVE = c.objective;
  VILLAGES = c.villages;
  CHESTS = c.chests;
  SHOP = c.shop;
}

function chapter(): ChapterDef {
  return CHAPTERS[CHAPTER];
}

/** その章の敵。自軍は campaign 側が持ち回る */
export function createEnemies(build: (s: Seed, team: 'player' | 'enemy') => Unit): Unit[] {
  return chapter().enemies.map((s) => build(s, 'enemy'));
}
