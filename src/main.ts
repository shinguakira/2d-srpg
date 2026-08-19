import { Game } from './game/game';
import { Campaign } from './game/campaign';
import { drawScene } from './render/mapRender';
import { CANVAS_H, CANVAS_W, screenToTile } from './render/layout';
import { CHAPTERS, MAP_H, MAP_W } from './data/chapters';
import { OPENING } from './story/script';
import { drawGuide, drawPrep, drawTitle, drawWorldMap, GUIDE_COUNT, type Screen } from './render/screens';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const devParam = new URLSearchParams(location.search).get('dev');

/**
 * 章の外側。FE はタイトル → ワールドマップ → 準備 → 章 → ワールドマップ と
 * 巡る。章の中は Game が、外はここが持つ。
 */
let screen: Screen | 'chapter' = devParam ? 'chapter' : 'title';
let menuIndex = 0;
let campaign = new Campaign();
let game = new Game(campaign, !!devParam);

function toChapter() {
  game = new Game(campaign);
  window.__game = game;
  screen = 'chapter';
}

// デバッグ用に現在のゲーム状態と描画を公開する
declare global {
  interface Window {
    __game: Game;
    __draw: (t?: number) => void;
    /** 章の外の画面を外から動かすための口。検証にしか使わない */
    __app: { screen: () => string; key: (k: string) => void; campaign: () => Campaign; frame: (t: number) => void };
  }
}
window.__game = game;
window.__draw = (t = 0) => drawScene(ctx, game, t);
window.__app = {
  screen: () => screen,
  key: (k) => screenKey(k),
  campaign: () => campaign,
  frame: (t) => frame(t),
};

function restart() {
  game = new Game(campaign);
  window.__game = game;
}

/** 章の外の画面のキー操作。中に入っているときは Game が受け取る */
function screenKey(k: string) {
  const dy = k === 'ArrowDown' || k === 's' ? 1 : k === 'ArrowUp' || k === 'w' ? -1 : 0;
  const ok = k === 'z' || k === 'Enter' || k === ' ';
  const back = k === 'x' || k === 'Escape' || k === 'Backspace';

  if (screen === 'title') {
    if (dy) menuIndex = (menuIndex + dy + 3) % 3;
    if (!ok) return;
    if (menuIndex === 0) {
      campaign = new Campaign();
      campaign.start(0);
      menuIndex = 0;
      screen = 'worldmap';
    } else if (menuIndex === 1) {
      const loaded = Campaign.load();
      if (loaded) {
        campaign = loaded;
        menuIndex = campaign.chapter;
        screen = 'worldmap';
      }
    } else {
      menuIndex = 0;
      screen = 'guide';
    }
    return;
  }

  if (screen === 'guide') {
    if (dy) menuIndex = (menuIndex + dy + GUIDE_COUNT) % GUIDE_COUNT;
    if (back || ok) {
      menuIndex = 0;
      screen = 'title';
    }
    return;
  }

  if (screen === 'worldmap') {
    if (dy) menuIndex = (menuIndex + dy + CHAPTERS.length) % CHAPTERS.length;
    if (k === 's') {
      campaign.save();
      return;
    }
    if (back) {
      menuIndex = 0;
      screen = 'title';
      return;
    }
    if (ok && menuIndex <= campaign.cleared) {
      campaign.start(menuIndex);
      menuIndex = 0;
      screen = 'prep';
    }
    return;
  }

  if (screen === 'prep') {
    if (dy) menuIndex = (menuIndex + dy + campaign.roster.length) % campaign.roster.length;
    if (k === 'z') campaign.toggle(campaign.roster[menuIndex].id);
    if (k === 'Enter' || k === ' ') toChapter();
    if (back) {
      menuIndex = campaign.chapter;
      screen = 'worldmap';
    }
  }
}

// ---------------------------------------------------------------- 入力

const REPEAT_DELAY = 0.28;
const REPEAT_RATE = 0.055;
const held = new Map<string, number>();

const DIRS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  a: [-1, 0],
  d: [1, 0],
  w: [0, -1],
  s: [0, 1],
};

window.addEventListener('keydown', (e) => {
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;

  if (screen !== 'chapter') {
    e.preventDefault();
    screenKey(k);
    return;
  }

  if (DIRS[k]) {
    e.preventDefault();
    if (!held.has(k)) {
      held.set(k, -REPEAT_DELAY);
      const [dx, dy] = DIRS[k];
      game.moveCursor(dx, dy);
    }
    return;
  }

  switch (k) {
    case 'z':
    case 'Enter':
    case ' ':
      e.preventDefault();
      game.confirm();
      break;
    case 'x':
    case 'Escape':
    case 'Backspace':
      e.preventDefault();
      game.cancel();
      break;
    case 't':
      game.toggleDanger();
      break;
    case 'e':
      game.requestEndTurn();
      break;
    case 'r':
      // FE と同じで R はユニットの詳細。リスタートは Shift+R に退避
      if (e.shiftKey) restart();
      else game.openUnitStatus();
      break;
  }
});

window.addEventListener('keyup', (e) => {
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  held.delete(k);
});

function updateHeld(dt: number) {
  for (const [k, t] of held) {
    const nt = t + dt;
    if (nt >= 0) {
      const [dx, dy] = DIRS[k];
      game.moveCursor(dx, dy);
      held.set(k, nt - REPEAT_RATE);
    } else {
      held.set(k, nt);
    }
  }
}

function canvasPos(e: MouseEvent) {
  const r = canvas.getBoundingClientRect();
  return {
    x: ((e.clientX - r.left) / r.width) * CANVAS_W,
    y: ((e.clientY - r.top) / r.height) * CANVAS_H,
  };
}

canvas.addEventListener('mousemove', (e) => {
  if (game.busy || game.menu || game.mode === 'target' || game.dialogue) return;
  const p = canvasPos(e);
  const t = screenToTile(p.x, p.y);
  if (t.x < 0 || t.y < 0 || t.x >= MAP_W || t.y >= MAP_H) return;
  game.cursor.x = t.x;
  game.cursor.y = t.y;
});

canvas.addEventListener('mousedown', (e) => {
  e.preventDefault();
  if (e.button === 2) {
    game.cancel();
    return;
  }
  if (game.dialogue) {
    game.confirm();
    return;
  }
  const p = canvasPos(e);

  // メニューのクリック判定
  const m = game.menu;
  if (m) {
    const rowH = 34;
    const top = m.y + (m.title ? 28 : 10);
    const idx = Math.floor((p.y - top) / rowH);
    if (p.x >= m.x && p.x <= m.x + m.w && idx >= 0 && idx < m.items.length) {
      if (m.items[idx].enabled) {
        m.index = idx;
        game.confirm();
      }
      return;
    }
    return;
  }

  if (game.mode === 'target') {
    const t = screenToTile(p.x, p.y);
    const hit = game.targets.findIndex((u) => u.x === t.x && u.y === t.y);
    if (hit >= 0) {
      if (hit === game.targetIndex) game.confirm();
      else {
        game.targetIndex = hit;
        game.cursor = { x: game.targets[hit].x, y: game.targets[hit].y };
      }
    }
    return;
  }

  const t = screenToTile(p.x, p.y);
  if (t.x < 0 || t.y < 0 || t.x >= MAP_W || t.y >= MAP_H) {
    game.confirm();
    return;
  }
  game.cursor.x = t.x;
  game.cursor.y = t.y;
  game.confirm();
});

canvas.addEventListener('contextmenu', (e) => e.preventDefault());

// ---------------------------------------------------------------- 開発用シーン
// ?dev=move / ?dev=target / ?dev=battle でスクリーンショット用の状態を作る
// ?adv=1.5 を付けるとその秒数だけ進めた状態で停止する
let frozen = false;
{
  const params = new URLSearchParams(location.search);
  const dev = params.get('dev');
  if (dev) {
    const pick = (name: string) => game.units.find((u) => u.name === name)!;
    if (dev === 'move') {
      const u = pick('ジェイガン');
      game.cursor = { x: u.x, y: u.y };
      game.confirm();
      game.cursor = { x: u.x + 3, y: u.y - 4 };
      game.showDanger = true;
      game.refreshDanger();
    }
    if (dev === 'target') {
      // 戦闘予測: レイピア（重装特効）でボスに挑む場面
      const a = pick('シゲル');
      const d = pick('ヴァルガ');
      a.x = d.x;
      a.y = d.y + 1;
      a.px = a.x;
      a.py = a.y;
      game.cursor = { x: a.x, y: a.y };
      game.confirm();
      game.cursor = { x: a.x, y: a.y };
      game.confirm();
      game.menu!.index = game.menu!.items.findIndex((it) => it.id === 'attack');
      game.confirm();
    }
    if (dev === 'battle' || dev === 'levelup' || dev === 'menu') {
      const a = pick('ガロン');
      const d = pick('山賊');
      if (dev === 'levelup') a.exp = 95;
      d.x = a.x + 1;
      d.y = a.y;
      d.px = d.x;
      d.py = d.y;
      game.cursor = { x: a.x, y: a.y };
      game.confirm();
      game.cursor = { x: a.x, y: a.y };
      game.confirm();
      if (dev !== 'menu') {
        // 行動メニューを開いたところで止める（menu 以外は攻撃まで進める）
        game.menu!.index = 0;
        game.confirm();
        game.confirm();
      }
    }
    if (dev === 'opening') {
      game.playScript(OPENING);
      // advance() は 1 回目で全文表示、2 回目で次の行に進む
      for (let i = 0; i < 17; i++) game.dialogue?.advance();
    }
    if (dev === 'talk') {
      // シゲルが傭兵ロウを説得する場面
      const a = pick('シゲル');
      const d = pick('ロウ');
      d.x = a.x + 1;
      d.y = a.y;
      d.px = d.x;
      d.py = d.y;
      game.cursor = { x: a.x, y: a.y };
      game.confirm();
      game.cursor = { x: a.x, y: a.y };
      game.confirm();
      const i = game.menu!.items.findIndex((it) => it.id === 'talk');
      game.menu!.index = i;
      game.confirm();
      game.confirm();
      for (let k = 0; k < 2; k++) game.dialogue?.advance();
    }
    if (dev === 'support') {
      // シゲルとアキラの支援会話（C）
      const a = pick('シゲル');
      const b = pick('ジェイガン');
      for (const u of [a, b]) {
        const link = u.supports.find((s) => s.with === (u === a ? b.id : a.id));
        if (link) link.points = 100;
      }
      b.x = a.x + 1;
      b.y = a.y;
      b.px = b.x;
      b.py = b.y;
      game.cursor = { x: a.x, y: a.y };
      game.confirm();
      game.cursor = { x: a.x, y: a.y };
      game.confirm();
      const i = game.menu!.items.findIndex((it) => it.id === 'support');
      game.menu!.index = i;
      game.confirm();
      game.confirm();
      game.dialogue?.advance();
    }
    // ?zoom=2 で拡大表示（ドット絵の確認用）
    const zoom = Number(params.get('zoom') ?? 0);
    if (zoom > 1) {
      canvas.style.width = `${CANVAS_W * zoom}px`;
      canvas.style.maxWidth = 'none';
      canvas.style.maxHeight = 'none';
    }
    const adv = Number(params.get('adv') ?? 0);
    if (adv > 0) {
      for (let i = 0; i < Math.round(adv * 60); i++) game.update(1 / 60);
      frozen = true;
    }
  }
}

// ---------------------------------------------------------------- ループ

let last = performance.now();
let time = 0;

function frame(now: number) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  time += dt;

  if (screen !== 'chapter') {
    if (screen === 'title') drawTitle(ctx, menuIndex, Campaign.hasSave(), time);
    else if (screen === 'worldmap') drawWorldMap(ctx, campaign, menuIndex);
    else if (screen === 'prep') drawPrep(ctx, campaign, menuIndex);
    else drawGuide(ctx, menuIndex);
    requestAnimationFrame(frame);
    return;
  }

  if (!frozen) {
    updateHeld(dt);
    game.update(dt);
    // 章が決着したらワールドマップへ戻る
    if (game.result === 'win' && game.mode === 'result') {
      campaign.gold = game.gold;
      campaign.finish();
      menuIndex = Math.min(campaign.cleared, CHAPTERS.length - 1);
      campaign.save();
      screen = 'worldmap';
    }
  }
  drawScene(ctx, game, time, frozen ? 0 : dt);

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
