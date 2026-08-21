import { Game } from './game/game';
import { Campaign } from './game/campaign';
import { drawScene, hitOptionRow, hitRosterTab, hitUnitTab, menuRowH } from './render/mapRender';
import { CANVAS_W, OX, OY, screenToTile, VIEW_H, VIEW_W } from './render/layout';
import { CHAPTERS, MAP_H, MAP_W, SKIRMISH_INDEX, TOWER_INDEX } from './data/chapters';
import { cloneWeapon } from './data/weapons';
import { OPENING } from './story/script';
import {
  drawGuide,
  drawPrep,
  drawPrepItems,
  drawPrepMap,
  drawPrepSupports,
  drawPrepUnits,
  drawShop,
  drawTitle,
  drawWorldMap,
  GUIDE_COUNT,
  hitGuide,
  hitPrepItems,
  hitPrepMap,
  hitPrepMenu,
  hitPrepSupports,
  hitPrepUnits,
  hitShop,
  hitTitle,
  hitWorldMap,
  nodeOpen,
  PREP_MENU,
  prepItemRows,
  shopRows,
  shopStock,
  supportRows,
  worldNodes,
  type Screen,
} from './render/screens';
import { flashPad, hitPad, padFor, setTouchUI, touchUI } from './render/touch';
import { detectTouch, fitCanvas, toCanvas } from './render/viewport';
import { loadFont } from './render/text';
import { clearSuspend, hasSuspend, loadSuspend, saveSuspend } from './game/suspend';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const devParam = new URLSearchParams(location.search).get('dev');

/**
 * 章の外側。FE はタイトル → ワールドマップ → 準備 → 章 → ワールドマップ と
 * 巡る。章の中は Game が、外はここが持つ。
 */
let screen: Screen | 'chapter' = devParam ? 'chapter' : 'title';
/** タイトルの初期位置。中断が無ければ「はじめから」に置く */
let menuIndex = 1;
/** 準備画面のアイテムで、いま誰の荷物を見ているか */
let prepUnit = 0;
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
    __app: {
      screen: () => string;
      key: (k: string) => void;
      campaign: () => Campaign;
      frame: (t: number) => void;
      tap: (x: number, y: number) => void;
    };
  }
}
window.__game = game;
window.__draw = (t = 0) => drawScene(ctx, game, t);
window.__app = {
  screen: () => screen,
  key: (k) => screenKey(k),
  campaign: () => campaign,
  frame: (t) => frame(t),
  tap: (x, y) => tap(x, y),
};

function restart() {
  game = new Game(campaign);
  window.__game = game;
}

/** タイトルの行数。中断 / はじめから / つづきから / ガイド */
const TITLE_ITEMS = 4;

/** タイトルへ戻る。カーソルは選べる一番上の行に置く */
function toTitle() {
  menuIndex = hasSuspend() ? 0 : 1;
  screen = 'title';
}

/** オプションの行の真ん中。ここより右を押したら値が進む */
const OPTION_MID = 480;

/** 章の外の画面のキー操作。中に入っているときは Game が受け取る */
function screenKey(k: string) {
  const dy = k === 'ArrowDown' || k === 's' ? 1 : k === 'ArrowUp' || k === 'w' ? -1 : 0;
  const ok = k === 'z' || k === 'Enter' || k === ' ';
  const back = k === 'x' || k === 'Escape' || k === 'Backspace';

  if (screen === 'title') {
    const n = TITLE_ITEMS;
    if (dy) menuIndex = (menuIndex + dy + n) % n;
    if (!ok) return;
    if (menuIndex === 0) {
      // 中断から再開。FE8 の「レジュームチャプター」
      const r = loadSuspend();
      if (r) {
        campaign = r.campaign;
        game = r.game;
        window.__game = game;
        menuIndex = 0;
        screen = 'chapter';
      }
    } else if (menuIndex === 1) {
      campaign = new Campaign();
      campaign.start(0);
      menuIndex = 0;
      screen = 'worldmap';
    } else if (menuIndex === 2) {
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
    if (back) toTitle();
    return;
  }

  if (screen === 'worldmap') {
    const nodes = worldNodes(campaign);
    if (dy) menuIndex = (menuIndex + dy + nodes.length) % nodes.length;
    if (k === 's') {
      campaign.save();
      return;
    }
    if (back) {
      toTitle();
      return;
    }
    if (!ok) return;
    const n = nodes[menuIndex];
    if (!n || !nodeOpen(campaign, n)) return;
    if (n.kind === 'shop') {
      menuIndex = 0;
      screen = 'shop';
      return;
    }
    campaign.start(n.kind === 'chapter' ? (n.chapter ?? 0) : n.kind === 'tower' ? TOWER_INDEX : SKIRMISH_INDEX);
    menuIndex = 0;
    screen = 'prep';
    return;
  }

  if (screen === 'shop') {
    const rows = shopRows(campaign);
    if (dy && rows.length) menuIndex = (menuIndex + dy + rows.length) % rows.length;
    if (back) {
      menuIndex = 0;
      screen = 'worldmap';
      return;
    }
    if (ok) doShop(menuIndex);
    return;
  }

  if (screen === 'prep') {
    if (dy) menuIndex = (menuIndex + dy + PREP_MENU.length) % PREP_MENU.length;
    if (back) {
      menuIndex = campaign.chapter;
      screen = 'worldmap';
      return;
    }
    if (ok) prepPick(menuIndex);
    return;
  }

  if (screen === 'prepUnits') {
    if (dy) menuIndex = (menuIndex + dy + campaign.roster.length) % campaign.roster.length;
    if (k === 'z') campaign.toggle(campaign.roster[menuIndex].id);
    if (k === 'Enter' || k === ' ') toChapter();
    if (back) {
      menuIndex = 0;
      screen = 'prep';
    }
    return;
  }

  if (screen === 'prepItems') {
    const dx = k === 'ArrowRight' || k === 'd' ? 1 : k === 'ArrowLeft' || k === 'a' ? -1 : 0;
    if (dx) {
      prepUnit = (prepUnit + dx + campaign.roster.length) % campaign.roster.length;
      menuIndex = 0;
    }
    const rows = prepItemRows(campaign, prepUnit);
    if (dy && rows.length) menuIndex = (menuIndex + dy + rows.length) % rows.length;
    if (ok) moveConvoyItem(menuIndex);
    if (back) {
      menuIndex = 1;
      screen = 'prep';
    }
    return;
  }

  if (screen === 'prepSupports') {
    const rows = supportRows(campaign);
    if (dy && rows.length) menuIndex = (menuIndex + dy + rows.length) % rows.length;
    if (back || ok) {
      menuIndex = 2;
      screen = 'prep';
    }
    return;
  }

  if (screen === 'prepMap') {
    if (back || ok) {
      menuIndex = 3;
      screen = 'prep';
    }
  }
}

/** 準備メニューの一項目 */
function prepPick(i: number) {
  if (i === 0) {
    menuIndex = 0;
    screen = 'prepUnits';
  } else if (i === 1) {
    prepUnit = 0;
    menuIndex = 0;
    screen = 'prepItems';
  } else if (i === 2) {
    menuIndex = 0;
    screen = 'prepSupports';
  } else if (i === 3) {
    screen = 'prepMap';
  } else if (i === 4) {
    campaign.save();
  } else {
    toChapter();
  }
}

/** 準備画面のアイテム受け渡し。手持ちは 5 枠まで */
function moveConvoyItem(row: number) {
  const rows = prepItemRows(campaign, prepUnit);
  const r = rows[row];
  const u = campaign.roster[prepUnit];
  if (!r || !u) return;
  if (r.kind === 'unit') {
    const [w] = u.items.splice(r.i, 1);
    if (w) campaign.convoy.push(w);
    if (u.equipped >= u.items.length) u.equipped = Math.max(0, u.items.length - 1);
  } else {
    if (u.items.length >= 5) return;
    const [w] = campaign.convoy.splice(r.i, 1);
    if (w) u.items.push(w);
  }
  menuIndex = Math.min(menuIndex, Math.max(0, prepItemRows(campaign, prepUnit).length - 1));
}

/** 行商。買ったものは輸送隊に入り、売るのは輸送隊から */
function doShop(row: number) {
  const rows = shopRows(campaign);
  const r = rows[row];
  if (!r) return;
  if (r.kind === 'buy') {
    const s = shopStock(campaign)[r.i];
    if (!s || campaign.gold < s.price) return;
    campaign.gold -= s.price;
    campaign.convoy.push(cloneWeapon(s.weapon));
  } else {
    const [w] = campaign.convoy.splice(r.i, 1);
    if (w) campaign.gold += Math.floor((w.uses + 1) * 8);
    menuIndex = Math.min(menuIndex, Math.max(0, shopRows(campaign).length - 1));
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

// ------------------------------------------------------------ ポインタ / 指

/**
 * 盤面を映している窓の中か。カメラが動くと柱（左右 80px の余白）の座標も
 * 盤面のマスに化けるので、マスに直す前に必ずここを通す。
 */
function inView(x: number, y: number) {
  return x >= OX && x < OX + VIEW_W && y >= OY && y < OY + VIEW_H;
}

/** 窓の中で、かつ盤面の上にあるマス。無ければ undefined */
function tileAt(x: number, y: number) {
  if (!inView(x, y)) return undefined;
  const t = screenToTile(x, y);
  if (t.x < 0 || t.y < 0 || t.x >= MAP_W || t.y >= MAP_H) return undefined;
  return t;
}

/** 盤面をなぞってカーソルだけ動かしてよい場面か */
function canScrub() {
  if (screen !== 'chapter' || game.busy || game.menu || game.result || game.dialogue) return false;
  // move 中も動かす。カーソルが動かないと移動先までの経路矢印が引けない
  return game.mode === 'free' || game.mode === 'move';
}

function padAction(id: string) {
  switch (id) {
    case 'ok':
      game.confirm();
      break;
    case 'cancel':
      game.cancel();
      break;
    case 'menu':
      if (game.mode === 'free' && !game.busy) game.openMapMenu();
      break;
    case 'info':
      game.openUnitStatus();
      break;
  }
}

/** 章の外の画面を指で。押した場所が何なのかは screens.ts が知っている */
function screenTap(x: number, y: number) {
  let hit;
  switch (screen) {
    case 'title':
      hit = hitTitle(x, y);
      break;
    case 'worldmap':
      hit = hitWorldMap(x, y, menuIndex, campaign);
      break;
    case 'shop':
      hit = hitShop(x, y, shopRows(campaign).length);
      break;
    case 'prep':
      hit = hitPrepMenu(x, y);
      break;
    case 'prepUnits':
      hit = hitPrepUnits(x, y, campaign.roster.length);
      break;
    case 'prepItems':
      hit = hitPrepItems(x, y, prepItemRows(campaign, prepUnit).length);
      break;
    case 'prepSupports':
      hit = hitPrepSupports(x, y, supportRows(campaign).length);
      break;
    case 'prepMap':
      hit = hitPrepMap(x, y);
      break;
    default:
      hit = hitGuide(x, y);
      break;
  }
  if (!hit) return;
  switch (hit.kind) {
    case 'select':
      menuIndex = hit.index;
      break;
    case 'confirm':
      if (hit.index !== undefined) menuIndex = hit.index;
      screenKey('z');
      break;
    case 'toggle':
      menuIndex = hit.index;
      screenKey('z');
      break;
    case 'start':
      screenKey('Enter');
      break;
    case 'save':
      campaign.save();
      break;
    case 'back':
      screenKey('x');
      break;
  }
}

/** 指を離した場所での決定。マウスの左クリックも同じ道を通る */
function tap(x: number, y: number) {
  if (screen !== 'chapter') {
    screenTap(x, y);
    return;
  }
  // 会話と戦闘アニメはどこを押しても進む
  if (game.dialogue || game.busy) {
    game.confirm();
    return;
  }
  if (game.result) {
    if (game.result === 'lose') restart();
    return;
  }

  const b = hitPad(padFor(game), x, y);
  if (b) {
    flashPad(b.id);
    padAction(b.id);
    return;
  }

  // 全画面のパネルは中身を直に押せる。ページも項目もそこにある
  if (game.mode === 'unit') {
    const t = hitUnitTab(x, y);
    if (t === undefined) game.cancel();
    else game.inspectPage = t;
    return;
  }
  if (game.mode === 'options') {
    const r = hitOptionRow(x, y);
    if (r === undefined) game.cancel();
    else {
      game.optionIndex = r;
      // 行の右半分を押したら次へ、左半分なら前へ。◀ ▶ の見た目どおりに動く
      game.cycleOption(r, x > OPTION_MID ? 1 : -1);
    }
    return;
  }
  if (game.mode === 'roster') {
    const t = hitRosterTab(x, y);
    if (t === undefined) game.cancel();
    else game.rosterPage = t;
    return;
  }
  if (game.mode === 'status' || game.mode === 'guide') {
    game.cancel();
    return;
  }

  const m = game.menu;
  if (m) {
    const rowH = menuRowH();
    const top = m.y + (m.title ? 28 : 10);
    const bottom = top + rowH * m.items.length;
    // 上下の端を少しはみ出して押しても端の項目として拾う。行の間は詰まって
    // いるので広げようがなく、外側だけに逃げ幅を持たせる
    if (x >= m.x - 8 && x <= m.x + m.w + 8 && y >= top - 10 && y <= bottom + 10) {
      const idx = Math.max(0, Math.min(m.items.length - 1, Math.floor((y - top) / rowH)));
      if (m.items[idx].enabled) {
        m.index = idx;
        game.confirm();
      }
    }
    return;
  }

  if (game.mode === 'target') {
    const t = tileAt(x, y);
    const hit = t ? game.targets.findIndex((u) => u.x === t.x && u.y === t.y) : -1;
    if (hit >= 0) {
      if (hit === game.targetIndex) game.confirm();
      else {
        game.targetIndex = hit;
        game.cursor = { x: game.targets[hit].x, y: game.targets[hit].y };
      }
    }
    return;
  }

  const t = tileAt(x, y);
  if (!t) {
    // 盤面の外。指なら押し間違いなので黙って無視し、マウスだけ従来どおり決定
    if (!touchUI) game.confirm();
    return;
  }
  game.cursor.x = t.x;
  game.cursor.y = t.y;
  game.confirm();
}

/**
 * 押したまま滑らせるとカーソルだけが動く。指では「触ったら即決定」しか無いと
 * 地形も敵の武器も確かめられないので、なぞりが FE の十字キーの代わりになる。
 */
let drag: { moved: boolean; x: number; y: number; onMap: boolean } | undefined;

canvas.addEventListener('pointerdown', (e) => {
  // 指のときだけ既定動作を止める。マウスで止めると click が飛ばなくなる
  if (e.pointerType !== 'mouse') {
    e.preventDefault();
    setTouchUI(true);
  }
  if (e.button === 2) {
    drag = undefined;
    game.cancel();
    return;
  }
  // 窓の外まで滑らせても離した瞬間を拾えるように。合成イベントでは失敗しうる
  try {
    canvas.setPointerCapture(e.pointerId);
  } catch {
    /* 捕まえられなくても指の追跡以外は困らない */
  }
  const p = toCanvas(canvas, e.clientX, e.clientY);
  drag = { moved: false, x: p.x, y: p.y, onMap: false };
  if (canScrub()) {
    const t = tileAt(p.x, p.y);
    if (t) {
      drag.onMap = true;
      game.cursor.x = t.x;
      game.cursor.y = t.y;
    }
  }
});

canvas.addEventListener('pointermove', (e) => {
  const p = toCanvas(canvas, e.clientX, e.clientY);
  if (!drag) {
    // マウスのホバー。指では押していないあいだ座標が来ない
    if (e.pointerType !== 'mouse' || screen !== 'chapter') return;
    if (!canScrub()) return;
    const t = tileAt(p.x, p.y);
    if (!t) return;
    game.cursor.x = t.x;
    game.cursor.y = t.y;
    return;
  }
  if (Math.hypot(p.x - drag.x, p.y - drag.y) > 12) drag.moved = true;
  if (!drag.onMap) return;
  const t = tileAt(p.x, p.y);
  if (t) {
    game.cursor.x = t.x;
    game.cursor.y = t.y;
  }
});

canvas.addEventListener('pointerup', (e) => {
  const d = drag;
  drag = undefined;
  // なぞっただけなら決定しない。見るだけの操作を残す
  if (!d || d.moved) return;
  const p = toCanvas(canvas, e.clientX, e.clientY);
  tap(p.x, p.y);
});

canvas.addEventListener('pointercancel', () => {
  drag = undefined;
});

canvas.addEventListener('contextmenu', (e) => e.preventDefault());

// ------------------------------------------------------------ 画面に合わせる

setTouchUI(detectTouch());
const zoomParam = Number(new URLSearchParams(location.search).get('zoom') ?? 0);

function refit() {
  // ?zoom= はドット絵を等倍で見るためのもので、画面いっぱいとは両立しない
  if (zoomParam > 1) return;
  fitCanvas(canvas);
}
refit();
window.addEventListener('resize', refit);
window.addEventListener('orientationchange', () => setTimeout(refit, 120));

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
    if (screen === 'title') drawTitle(ctx, menuIndex, Campaign.hasSave(), hasSuspend(), time);
    else if (screen === 'worldmap') drawWorldMap(ctx, campaign, menuIndex);
    else if (screen === 'shop') drawShop(ctx, campaign, menuIndex);
    else if (screen === 'prep') drawPrep(ctx, campaign, menuIndex);
    else if (screen === 'prepUnits') drawPrepUnits(ctx, campaign, menuIndex);
    else if (screen === 'prepItems') drawPrepItems(ctx, campaign, prepUnit, menuIndex);
    else if (screen === 'prepSupports') drawPrepSupports(ctx, campaign, menuIndex);
    else if (screen === 'prepMap') drawPrepMap(ctx, campaign);
    else drawGuide(ctx, menuIndex);
    requestAnimationFrame(frame);
    return;
  }

  if (!frozen) {
    updateHeld(dt);
    game.update(dt);
    // マップメニューの「中断」。書き出してタイトルへ戻る
    if (game.suspendRequested) {
      game.suspendRequested = false;
      campaign.gold = game.gold;
      campaign.options = { ...game.options };
      saveSuspend(campaign, game);
      toTitle();
      requestAnimationFrame(frame);
      return;
    }
    // 章が決着したらワールドマップへ戻る
    if (game.result === 'win' && game.mode === 'result') {
      campaign.gold = game.gold;
      campaign.options = { ...game.options };
      campaign.finish();
      // 塔や群れから戻ったときは、次に進める本編の章に戻しておく
      campaign.chapter = Math.min(campaign.cleared, CHAPTERS.length - 1);
      menuIndex = campaign.chapter;
      // 章を終えたら中断は用済み。次の章の頭からやり直せるほうが親切
      clearSuspend();
      campaign.save();
      screen = 'worldmap';
    }
  }
  drawScene(ctx, game, time, frozen ? 0 : dt);

  requestAnimationFrame(frame);
}
// ドットのフォントが来てから最初の一枚を描く。先に描くと代替フォントで焼ける
void loadFont().then(() => requestAnimationFrame(frame));
