import { MAP, setMap, type Reinforcement } from '../data/chapters';
import type { Unit, Weapon } from '../types';
import { Campaign } from './campaign';
import { Game } from './game';
import type { GameOptions } from './options';

const KEY = 'srpg-suspend-v1';

/**
 * 中断。FE の「中断」は章の途中で止めて、次に立ち上げたところから続ける。
 *
 * Unit も Weapon もメソッドを持たない素のデータなので、そのまま JSON にできる。
 * 地形だけは扉を開けると書き換わるので、盤面ごと控える。
 */
interface SuspendData {
  chapter: number;
  cleared: number;
  gold: number;
  deployed: string[];
  convoy: Weapon[];
  options: GameOptions;
  roster: Unit[];
  units: Unit[];
  map: string[];
  turn: number;
  phase: 'player' | 'enemy';
  visited: string[];
  opened: string[];
  flags: { bossTalked: boolean; ending: boolean };
  pending: Reinforcement[];
}

export function hasSuspend() {
  try {
    return !!localStorage.getItem(KEY);
  } catch {
    return false;
  }
}

export function clearSuspend() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* localStorage が使えない環境なら、そもそも中断も無い */
  }
}

export function saveSuspend(campaign: Campaign, game: Game): boolean {
  const data: SuspendData = {
    chapter: campaign.chapter,
    cleared: campaign.cleared,
    gold: game.gold,
    deployed: campaign.deployed,
    convoy: campaign.convoy,
    options: game.options,
    roster: campaign.roster,
    units: game.units,
    map: MAP.slice(),
    turn: game.turn,
    phase: game.phase,
    visited: [...game.visited],
    opened: [...game.opened],
    flags: game.flags,
    pending: game.pendingReinforcements,
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

/** 中断から再開する。盤の上のユニットと roster は同じ実体に繋ぎ直す */
export function loadSuspend(): { campaign: Campaign; game: Game } | undefined {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return undefined;
  }
  if (!raw) return undefined;
  let data: SuspendData;
  try {
    data = JSON.parse(raw);
  } catch {
    return undefined;
  }

  const campaign = new Campaign();
  campaign.chapter = data.chapter ?? 0;
  campaign.cleared = data.cleared ?? 0;
  campaign.gold = data.gold ?? 0;
  campaign.deployed = data.deployed ?? [];
  campaign.convoy = data.convoy ?? [];
  campaign.options = data.options;
  campaign.roster = data.roster ?? [];

  // Game を普通に組んでから、控えてあった盤面で塗り替える
  const game = new Game(campaign, true);
  game.units = data.units ?? [];
  // roster と盤上の自軍は同じオブジェクトでなければならない。別々だと
  // 章が終わったときにレベルアップが roster 側へ反映されない
  campaign.roster = campaign.roster.map((r) => game.units.find((u) => u.id === r.id) ?? r);
  setMap(data.map ?? MAP);
  game.turn = data.turn ?? 1;
  game.phase = data.phase ?? 'player';
  game.gold = data.gold ?? 0;
  game.visited = new Set(data.visited ?? []);
  game.opened = new Set(data.opened ?? []);
  game.flags = data.flags ?? { bossTalked: false, ending: false };
  game.pendingReinforcements = data.pending ?? [];
  game.banner = undefined;
  game.dialogue = undefined;
  game.resumeFromSuspend();
  return { campaign, game };
}
