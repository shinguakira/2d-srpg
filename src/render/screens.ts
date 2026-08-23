import { classOf } from '../data/classes';
import { CHAPTERS, SKIRMISH_INDEX, TOWER_INDEX, chapterDef } from '../data/chapters';
import { GUIDE, guideText } from '../data/guide';
import { terrainAt } from '../data/terrain';
import { cloneWeapon } from '../data/weapons';
import { RANK_LABEL } from '../battle/support';
import type { Campaign } from '../game/campaign';
import { CANVAS_H, CANVAS_W } from './layout';
import { drawFacePortrait, drawUnitSprite } from './sprites';
import { maxHp } from '../battle/combat';
import { drawPadButton, inRect, type PadButton, touchUI } from './touch';
import { plainText as text } from './text';

/**
 * 章の外側の画面。FE8 の順に、タイトル → ワールドマップ → 準備 → 章 と巡る。
 * 準備は 5 つの小画面に分かれる（ユニット / アイテム / 支援 / マップ確認 / セーブ）。
 */
export type Screen = 'title' | 'worldmap' | 'prep' | 'prepUnits' | 'prepItems' | 'prepSupports' | 'prepMap' | 'shop' | 'guide';

/**
 * 指で触られたときに何が起きるか。章の外の画面はキーボード専用だったので、
 * 押せる場所と、押したら何になるかをここで描画と並べて持つ。離すとすぐずれる。
 */
export type ScreenHit =
  | { kind: 'select'; index: number }
  | { kind: 'confirm'; index?: number }
  | { kind: 'toggle'; index: number }
  | { kind: 'start' }
  | { kind: 'save' }
  | { kind: 'back' };

const BW = 128;
const BH = 54;
const sbtn = (id: string, label: string, x: number, y: number): PadButton => ({ id, label, x, y, w: BW, h: BH });

function drawButtons(ctx: CanvasRenderingContext2D, list: PadButton[]) {
  if (!touchUI) return;
  for (const b of list) drawPadButton(ctx, b);
}

function hitButton(list: PadButton[], x: number, y: number) {
  if (!touchUI) return undefined;
  return list.find((b) => inRect(x, y, b.x - 6, b.y - 6, b.w + 12, b.h + 12))?.id;
}

function backdrop(ctx: CanvasRenderingContext2D) {
  const g = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  g.addColorStop(0, '#0a0f1e');
  g.addColorStop(0.6, '#131b30');
  g.addColorStop(1, '#080c17');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

function cursorRow(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, on: boolean) {
  if (!on) return;
  ctx.fillStyle = 'rgba(120,160,240,0.2)';
  ctx.fillRect(x - 14, y - 24, w, 34);
  text(ctx, '▶', x - 38, y, { size: 18, color: '#ffd24a' });
}

// ------------------------------------------------------------------ タイトル

const TITLE_Y = 356;
const TITLE_STEP = 48;

export function drawTitle(ctx: CanvasRenderingContext2D, index: number, hasSave: boolean, hasSuspend: boolean, time: number) {
  backdrop(ctx);
  ctx.save();
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 60; i++) {
    const x = ((i * 137) % CANVAS_W) + Math.sin(time * 0.3 + i) * 6;
    const y = (i * 61) % (CANVAS_H * 0.6);
    ctx.fillStyle = '#cfe0ff';
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.restore();

  text(ctx, '聖なる炎', CANVAS_W / 2, 200, { size: 64, align: 'center', color: '#f0e6c8', bold: true });
  text(ctx, 'アマギの戦記', CANVAS_W / 2, 248, { size: 20, align: 'center', color: '#8fa6d8' });

  // FE8 と同じ並び。中断があれば一番上に出て、それが既定になる
  const items: [string, boolean][] = [
    [hasSuspend ? '中断から再開' : '中断から再開（記録なし）', hasSuspend],
    ['はじめから', true],
    [hasSave ? 'つづきから' : 'つづきから（記録なし）', hasSave],
    ['ガイド', true],
  ];
  let y = TITLE_Y;
  for (const [i, [label, on]] of items.entries()) {
    const sel = i === index;
    cursorRow(ctx, CANVAS_W / 2 - 130, y, 300, sel);
    text(ctx, label, CANVAS_W / 2, y, {
      size: 22,
      align: 'center',
      color: !on ? '#5d6a8c' : sel ? '#ffffff' : '#b9c6e6',
    });
    y += TITLE_STEP;
  }
  text(ctx, touchUI ? '押して選ぶ' : '↑↓ 選ぶ  /  Z 決定', CANVAS_W / 2, CANVAS_H - 50, {
    size: 14,
    align: 'center',
    color: '#7d8cb0',
  });
}

export function hitTitle(x: number, y: number): ScreenHit | undefined {
  for (let i = 0; i < 4; i++) {
    if (inRect(x, y, CANVAS_W / 2 - 160, TITLE_Y - 28 + i * TITLE_STEP, 320, TITLE_STEP)) {
      return { kind: 'confirm', index: i };
    }
  }
  return undefined;
}

// -------------------------------------------------------------- ワールドマップ

/**
 * ワールドマップの拠点。FE8 は章のほかに、店と塔と、彷徨く魔物の群れが立つ。
 * 章は cleared まで、塔は 2 章を終えてから、群れは 1 章を終えてから開く。
 */
export interface WorldNode {
  kind: 'chapter' | 'shop' | 'tower' | 'skirmish';
  x: number;
  y: number;
  name: string;
  chapter?: number;
}

const CHAPTER_NODES = [
  { x: 452, y: 470, name: 'クレハ' },
  { x: 330, y: 430, name: 'サーズ' },
  { x: 268, y: 372, name: 'シェナ' },
  { x: 356, y: 508, name: 'スザ' },
  { x: 262, y: 252, name: 'カンデル' },
  { x: 396, y: 208, name: 'ケシュ' },
  { x: 430, y: 132, name: '海峡' },
  { x: 330, y: 300, name: 'ヤタン' },
  { x: 288, y: 330, name: 'マイシ' },
  { x: 186, y: 356, name: 'コド' },
];

export function worldNodes(c: Campaign): WorldNode[] {
  const out: WorldNode[] = CHAPTER_NODES.map((n, i) => ({ kind: 'chapter', x: n.x, y: n.y, name: n.name, chapter: i }));
  out.push({ kind: 'shop', x: 208, y: 208, name: '行商' });
  if (c.cleared >= 2) out.push({ kind: 'tower', x: 470, y: 300, name: '影の塔' });
  if (c.cleared >= 1) out.push({ kind: 'skirmish', x: 224, y: 452, name: '魔物の群れ' });
  return out;
}

export function nodeOpen(c: Campaign, n: WorldNode) {
  return n.kind === 'chapter' ? (n.chapter ?? 0) <= c.cleared : true;
}

const CARD = { x: 560, y: 150, w: 340, h: 300 };
const WORLD_BTN = [sbtn('save', 'セーブ', 48, CANVAS_H - 84), sbtn('back', 'タイトル', 192, CANVAS_H - 84)];

export function drawWorldMap(ctx: CanvasRenderingContext2D, c: Campaign, index: number) {
  backdrop(ctx);

  // 島の輪郭。地図らしく見えればよく、正確な形は要らない
  ctx.save();
  ctx.fillStyle = '#1c2b3a';
  ctx.strokeStyle = '#3f5a74';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(250, 120);
  ctx.quadraticCurveTo(420, 180, 380, 300);
  ctx.quadraticCurveTo(340, 400, 400, 470);
  ctx.quadraticCurveTo(300, 540, 230, 460);
  ctx.quadraticCurveTo(200, 330, 240, 250);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // 通った道
  ctx.strokeStyle = 'rgba(200,220,255,0.35)';
  ctx.setLineDash([5, 6]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (const [i, n] of CHAPTER_NODES.entries()) {
    if (i) ctx.lineTo(n.x, n.y);
    else ctx.moveTo(n.x, n.y);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  const nodes = worldNodes(c);
  for (const [i, n] of nodes.entries()) {
    const open = nodeOpen(c, n);
    const on = i === index;
    const color =
      n.kind === 'shop' ? '#8fe0a8' : n.kind === 'tower' ? '#c79bff' : n.kind === 'skirmish' ? '#ff9a7a' : open ? '#8fc0ff' : '#3d4864';
    ctx.fillStyle = on ? '#ffd24a' : color;
    ctx.beginPath();
    if (n.kind === 'chapter') {
      ctx.arc(n.x, n.y, on ? 11 : 8, 0, Math.PI * 2);
    } else {
      // 章でない拠点は四角。地図の上で一目で区別が付く
      const s = on ? 11 : 8;
      ctx.rect(n.x - s, n.y - s, s * 2, s * 2);
    }
    ctx.fill();
    if (on) {
      ctx.strokeStyle = '#ffd24a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 18, 0, Math.PI * 2);
      ctx.stroke();
    }
    text(ctx, n.name, n.x + 22, n.y + 6, { size: 15, color: open ? '#e8eefc' : '#5d6a8c' });
  }

  // 右側に選んでいる拠点の札
  const sel = nodes[index];
  const x = CARD.x;
  ctx.fillStyle = 'rgba(12,18,34,0.85)';
  ctx.fillRect(x, CARD.y, CARD.w, CARD.h);
  ctx.strokeStyle = '#c9a25a';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, CARD.y, CARD.w, CARD.h);

  if (sel?.kind === 'chapter') {
    const d = CHAPTERS[sel.chapter ?? 0];
    text(ctx, d.title, x + 20, 194, { size: 20, color: '#f0e6c8' });
    text(ctx, `目標  ${d.objective.label}`, x + 20, 240, { size: 16, color: '#b9c6e6' });
    text(ctx, `敵    ${d.enemies.length} 体`, x + 20, 272, { size: 16, color: '#b9c6e6' });
    text(ctx, `出撃  ${d.deploy} 人`, x + 20, 304, { size: 16, color: '#b9c6e6' });
    text(ctx, `所持金 ${c.gold} G`, x + 20, 336, { size: 16, color: '#b9c6e6' });
    if (!nodeOpen(c, sel)) text(ctx, 'まだ行けない', x + 20, 400, { size: 16, color: '#d0708a' });
    else if (touchUI) text(ctx, '▶ この札を押すと準備へ', x + 20, 400, { size: 15, color: '#8ff0b0' });
  } else if (sel?.kind === 'shop') {
    text(ctx, '行商', x + 20, 194, { size: 20, color: '#f0e6c8' });
    text(ctx, '章と章のあいだに武器を', x + 20, 240, { size: 15, color: '#b9c6e6' });
    text(ctx, '買い足せる。買ったものは', x + 20, 266, { size: 15, color: '#b9c6e6' });
    text(ctx, '輸送隊へ入る。', x + 20, 292, { size: 15, color: '#b9c6e6' });
    text(ctx, `所持金 ${c.gold} G`, x + 20, 336, { size: 16, color: '#ffd24a' });
  } else if (sel) {
    const d = chapterDef(sel.kind === 'tower' ? TOWER_INDEX : SKIRMISH_INDEX);
    text(ctx, d.title, x + 20, 194, { size: 20, color: '#f0e6c8' });
    text(ctx, `目標  ${d.objective.label}`, x + 20, 240, { size: 16, color: '#b9c6e6' });
    text(ctx, `敵    ${d.enemies.length} 体`, x + 20, 272, { size: 16, color: '#b9c6e6' });
    text(ctx, `出撃  ${d.deploy} 人`, x + 20, 304, { size: 16, color: '#b9c6e6' });
    text(ctx, '章の進行には数えない', x + 20, 400, { size: 15, color: '#9fb0d8' });
  }

  drawButtons(ctx, WORLD_BTN);
  if (!touchUI) {
    text(ctx, '↑↓ 拠点を選ぶ  /  Z 決定  /  S セーブ  /  X タイトル', CANVAS_W / 2, CANVAS_H - 50, {
      size: 14,
      align: 'center',
      color: '#7d8cb0',
    });
  }
}

export function hitWorldMap(x: number, y: number, index: number, c: Campaign): ScreenHit | undefined {
  const b = hitButton(WORLD_BTN, x, y);
  if (b === 'save') return { kind: 'save' };
  if (b === 'back') return { kind: 'back' };
  for (const [i, n] of worldNodes(c).entries()) {
    if (Math.hypot(x - n.x, y - n.y) <= 34) return i === index ? { kind: 'confirm', index: i } : { kind: 'select', index: i };
  }
  if (inRect(x, y, CARD.x, CARD.y, CARD.w, CARD.h)) return { kind: 'confirm' };
  return undefined;
}

// ------------------------------------------------------------------ 準備画面

/** FE8 の準備メニュー。ユニット / アイテム / 支援 / マップ確認 / セーブ / 出撃 */
export const PREP_MENU = ['ユニット', 'アイテム', '支援', 'マップ確認', 'セーブ', '出撃'];
const PREP_MENU_Y = 200;
const PREP_MENU_STEP = 52;
const PREP_MENU_X = 90;

function prepHeader(ctx: CanvasRenderingContext2D, c: Campaign, sub: string) {
  backdrop(ctx);
  const d = c.def;
  text(ctx, sub, 60, 70, { size: 26, color: '#f0e6c8' });
  text(ctx, d.title, 60, 98, { size: 15, color: '#8fa6d8' });
  text(ctx, `${c.deployed.length} / ${d.deploy}`, CANVAS_W - 60, 70, {
    size: 24,
    align: 'right',
    color: c.deployed.length > d.deploy ? '#d0708a' : '#ffd24a',
  });
  text(ctx, `所持金 ${c.gold} G`, CANVAS_W - 60, 96, { size: 14, align: 'right', color: '#b9c6e6' });
}

export function drawPrep(ctx: CanvasRenderingContext2D, c: Campaign, index: number) {
  prepHeader(ctx, c, '出撃準備');
  for (const [i, label] of PREP_MENU.entries()) {
    const y = PREP_MENU_Y + i * PREP_MENU_STEP;
    const on = i === index;
    cursorRow(ctx, PREP_MENU_X, y, 260, on);
    text(ctx, label, PREP_MENU_X, y, { size: 20, color: on ? '#ffffff' : '#b9c6e6' });
  }
  const sel = c.available()[0];
  if (sel) drawFacePortrait(ctx, sel, 760, CANVAS_H - 60, 320, -1);
  if (!touchUI) {
    text(ctx, '↑↓ 選ぶ  /  Z 決定  /  X 戻る', CANVAS_W / 2, CANVAS_H - 30, { size: 14, align: 'center', color: '#7d8cb0' });
  }
}

export function hitPrepMenu(x: number, y: number): ScreenHit | undefined {
  for (let i = 0; i < PREP_MENU.length; i++) {
    if (inRect(x, y, PREP_MENU_X - 20, PREP_MENU_Y - 28 + i * PREP_MENU_STEP, 300, PREP_MENU_STEP)) {
      return { kind: 'confirm', index: i };
    }
  }
  return undefined;
}

// ------------------------------------------------------------ 準備 / ユニット

const UNITS_Y = 172;
const UNITS_STEP = 42;
const UNITS_BTN = [sbtn('start', '出撃', 48, CANVAS_H - 84), sbtn('back', '戻る', 192, CANVAS_H - 84)];

export function drawPrepUnits(ctx: CanvasRenderingContext2D, c: Campaign, index: number) {
  prepHeader(ctx, c, 'ユニット');

  let y = UNITS_Y;
  for (const [i, u] of c.available().entries()) {
    const on = i === index;
    const out = c.deployed.includes(u.id);
    if (on) {
      ctx.fillStyle = 'rgba(120,160,240,0.16)';
      ctx.fillRect(48, y - 26, 520, 38);
    }
    ctx.save();
    ctx.globalAlpha = u.dead ? 0.35 : 1;
    drawUnitSprite(ctx, u, 76, y + 8, 34, { ground: false });
    ctx.restore();
    text(ctx, out ? '出撃' : '待機', 104, y, { size: 14, color: out ? '#8ff0b0' : '#6f7fa4' });
    text(ctx, u.name, 160, y, { size: 18, color: u.dead ? '#5d6a8c' : '#e8eefc' });
    text(ctx, `${classOf(u.classId).name} Lv.${u.level}`, 280, y, { size: 14, color: '#9fb0d8' });
    text(ctx, `HP ${u.hp}/${maxHp(u)}`, 420, y, { size: 14, color: '#9fb0d8' });
    if (u.isLord) text(ctx, '固定', 520, y, { size: 13, color: '#c9a25a' });
    y += UNITS_STEP;
  }

  const sel = c.available()[index];
  if (sel) drawFacePortrait(ctx, sel, 760, CANVAS_H - 90, 300, -1);

  drawButtons(ctx, UNITS_BTN);
  if (!touchUI) {
    text(ctx, '↑↓ 選ぶ  /  Z 出撃を切替  /  Enter 開始  /  X 戻る', CANVAS_W / 2, CANVAS_H - 30, {
      size: 14,
      align: 'center',
      color: '#7d8cb0',
    });
  }
}

export function hitPrepUnits(x: number, y: number, rows: number): ScreenHit | undefined {
  const b = hitButton(UNITS_BTN, x, y);
  if (b === 'start') return { kind: 'start' };
  if (b === 'back') return { kind: 'back' };
  for (let i = 0; i < rows; i++) {
    if (inRect(x, y, 40, UNITS_Y - 28 + i * UNITS_STEP, 540, UNITS_STEP)) return { kind: 'toggle', index: i };
  }
  return undefined;
}

// ------------------------------------------------------------ 準備 / アイテム

const ITEM_Y = 176;
const ITEM_STEP = 34;
const ITEM_BTN = [sbtn('back', '戻る', 48, CANVAS_H - 84)];

/** その行が何を指すか。手持ちなら 'unit'、輸送隊なら 'convoy' */
export function prepItemRows(c: Campaign, unitIndex: number) {
  const u = c.available()[unitIndex];
  const rows: { kind: 'unit' | 'convoy'; i: number; name: string; uses: number }[] = [];
  if (u) for (const [i, w] of u.items.entries()) rows.push({ kind: 'unit', i, name: w.name, uses: w.uses });
  for (const [i, w] of c.convoy.entries()) rows.push({ kind: 'convoy', i, name: w.name, uses: w.uses });
  return rows;
}

export function drawPrepItems(ctx: CanvasRenderingContext2D, c: Campaign, unitIndex: number, itemIndex: number) {
  prepHeader(ctx, c, 'アイテム');
  const u = c.available()[unitIndex];
  text(ctx, `◀ ${u?.name ?? '-'} ▶`, 60, 140, { size: 18, color: '#ffd24a' });
  text(ctx, `持ち物 ${u?.items.length ?? 0} / 5`, 300, 140, { size: 14, color: '#9fb0d8' });
  text(ctx, `輸送隊 ${c.convoy.length}`, 460, 140, { size: 14, color: '#9fb0d8' });

  const rows = prepItemRows(c, unitIndex);
  for (const [i, r] of rows.entries()) {
    const y = ITEM_Y + i * ITEM_STEP;
    const on = i === itemIndex;
    if (on) {
      ctx.fillStyle = 'rgba(120,160,240,0.16)';
      ctx.fillRect(48, y - 22, 520, ITEM_STEP - 4);
    }
    text(ctx, r.kind === 'unit' ? '→' : '←', 60, y, { size: 15, color: r.kind === 'unit' ? '#8ff0b0' : '#9fd0ff' });
    text(ctx, r.name, 92, y, { size: 16, color: on ? '#ffffff' : '#c8d4ee' });
    text(ctx, `${r.uses}`, 540, y, { size: 14, align: 'right', color: '#9fb0d8' });
  }
  if (!rows.length) text(ctx, '何も持っていない', 92, ITEM_Y, { size: 15, color: '#6f7fa4' });

  if (u) drawFacePortrait(ctx, u, 760, CANVAS_H - 90, 300, -1);
  drawButtons(ctx, ITEM_BTN);
  if (!touchUI) {
    text(ctx, '←→ 人を選ぶ  /  ↑↓ 品を選ぶ  /  Z 預ける・受け取る  /  X 戻る', CANVAS_W / 2, CANVAS_H - 30, {
      size: 14,
      align: 'center',
      color: '#7d8cb0',
    });
  }
}

export function hitPrepItems(x: number, y: number, rows: number): ScreenHit | undefined {
  if (hitButton(ITEM_BTN, x, y) === 'back') return { kind: 'back' };
  for (let i = 0; i < rows; i++) {
    if (inRect(x, y, 40, ITEM_Y - 24 + i * ITEM_STEP, 540, ITEM_STEP)) return { kind: 'toggle', index: i };
  }
  return undefined;
}

// -------------------------------------------------------------- 準備 / 支援

const SUP_Y = 168;
const SUP_STEP = 34;
const SUP_BTN = [sbtn('back', '戻る', 48, CANVAS_H - 84)];

/** 支援の一覧に並べる組。まだ 0 の組も出す。誰と誰が組めるかが分かるのが値打ち */
export function supportRows(c: Campaign) {
  const rows: { a: string; b: string; rank: number; points: number }[] = [];
  for (const u of c.available()) {
    for (const s of u.supports) {
      const partner = c.available().find((p) => p.id === s.with);
      if (!partner) continue;
      if (rows.some((r) => r.a === partner.name && r.b === u.name)) continue;
      rows.push({ a: u.name, b: partner.name, rank: s.rank, points: s.points });
    }
  }
  return rows;
}

export function drawPrepSupports(ctx: CanvasRenderingContext2D, c: Campaign, index: number) {
  prepHeader(ctx, c, '支援');
  const rows = supportRows(c);
  text(ctx, '組', 92, SUP_Y - 26, { size: 12, color: '#7d8cb0' });
  text(ctx, 'ランク', 420, SUP_Y - 26, { size: 12, color: '#7d8cb0' });
  text(ctx, '友好度', 520, SUP_Y - 26, { size: 12, color: '#7d8cb0' });
  for (const [i, r] of rows.entries()) {
    const y = SUP_Y + i * SUP_STEP;
    const on = i === index;
    if (on) {
      ctx.fillStyle = 'rgba(120,160,240,0.16)';
      ctx.fillRect(80, y - 22, 520, SUP_STEP - 4);
    }
    text(ctx, `${r.a} と ${r.b}`, 92, y, { size: 16, color: on ? '#ffffff' : '#c8d4ee' });
    text(ctx, RANK_LABEL[r.rank], 420, y, { size: 16, color: r.rank ? '#ffd24a' : '#6f7fa4' });
    text(ctx, `${r.points}`, 580, y, { size: 14, align: 'right', color: '#9fb0d8' });
  }
  if (!rows.length) text(ctx, 'まだ誰とも組んでいない', 92, SUP_Y, { size: 15, color: '#6f7fa4' });
  text(ctx, '合計 5 まで。A は 1 人だけ', 92, CANVAS_H - 120, { size: 13, color: '#7d8cb0' });
  drawButtons(ctx, SUP_BTN);
}

export function hitPrepSupports(x: number, y: number, rows: number): ScreenHit | undefined {
  if (hitButton(SUP_BTN, x, y) === 'back') return { kind: 'back' };
  for (let i = 0; i < rows; i++) {
    if (inRect(x, y, 80, SUP_Y - 24 + i * SUP_STEP, 520, SUP_STEP)) return { kind: 'select', index: i };
  }
  return undefined;
}

// --------------------------------------------------------- 準備 / マップ確認

const MAP_BTN = [sbtn('back', '戻る', 48, CANVAS_H - 84)];

/** 出撃前に盤を見る。FE8 の「マップ確認」。動かせないので縮小して全体を出す */
export function drawPrepMap(ctx: CanvasRenderingContext2D, c: Campaign) {
  prepHeader(ctx, c, 'マップ確認');
  const rows = c.def.map;
  const w = rows[0].length;
  const h = rows.length;
  const tile = Math.min(Math.floor(760 / w), Math.floor(400 / h));
  const ox = Math.floor((CANVAS_W - w * tile) / 2);
  const oy = 150;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const t = terrainAt(rows, x, y);
      ctx.fillStyle = (x + y) % 2 ? t.color : t.color2;
      ctx.fillRect(ox + x * tile, oy + y * tile, tile, tile);
    }
  }
  ctx.strokeStyle = '#3f5a74';
  ctx.lineWidth = 2;
  ctx.strokeRect(ox - 1, oy - 1, w * tile + 2, h * tile + 2);

  // 敵と出撃位置。どちらから来るのかが読めれば充分
  for (const e of c.def.enemies) {
    ctx.fillStyle = '#e06060';
    ctx.fillRect(ox + e.x * tile + 1, oy + e.y * tile + 1, tile - 2, tile - 2);
  }
  for (const [i, p] of c.def.starts.entries()) {
    if (i >= c.def.deploy) break;
    ctx.fillStyle = '#6098e0';
    ctx.fillRect(ox + p.x * tile + 1, oy + p.y * tile + 1, tile - 2, tile - 2);
  }

  const legend = oy + h * tile + 26;
  ctx.fillStyle = '#6098e0';
  ctx.fillRect(ox, legend - 10, 12, 12);
  text(ctx, '出撃位置', ox + 20, legend, { size: 13, color: '#b9c6e6' });
  ctx.fillStyle = '#e06060';
  ctx.fillRect(ox + 110, legend - 10, 12, 12);
  text(ctx, '敵', ox + 130, legend, { size: 13, color: '#b9c6e6' });
  text(ctx, `目標  ${c.def.objective.label}`, ox + 200, legend, { size: 13, color: '#ffd24a' });

  drawButtons(ctx, MAP_BTN);
}

export function hitPrepMap(x: number, y: number): ScreenHit | undefined {
  if (hitButton(MAP_BTN, x, y) === 'back') return { kind: 'back' };
  return undefined;
}

// -------------------------------------------------------------------- 行商

const SHOP_Y = 168;
const SHOP_STEP = 34;
const SHOP_BTN = [sbtn('back', '戻る', 48, CANVAS_H - 84)];

/** 行商の品揃え。章が進むほど良いものが並ぶ */
export function shopStock(c: Campaign): { weapon: string; price: number }[] {
  const base = [
    { weapon: 'ironSword', price: 460 },
    { weapon: 'ironLance', price: 360 },
    { weapon: 'ironAxe', price: 270 },
    { weapon: 'ironBow', price: 540 },
    { weapon: 'heal', price: 600 },
  ];
  if (c.cleared >= 1) base.push({ weapon: 'javelin', price: 400 }, { weapon: 'handAxe', price: 300 }, { weapon: 'fire', price: 560 });
  if (c.cleared >= 2) base.push({ weapon: 'steelSword', price: 600 }, { weapon: 'mend', price: 1000 }, { weapon: 'physic', price: 1500 });
  return base;
}

/** 買う行と売る行を一続きに並べる。売値は半額 */
export function shopRows(c: Campaign) {
  const rows: { kind: 'buy' | 'sell'; i: number; name: string; price: number }[] = [];
  for (const [i, s] of shopStock(c).entries()) rows.push({ kind: 'buy', i, name: cloneWeapon(s.weapon).name, price: s.price });
  for (const [i, w] of c.convoy.entries()) rows.push({ kind: 'sell', i, name: w.name, price: Math.floor((w.uses + 1) * 8) });
  return rows;
}

export function drawShop(ctx: CanvasRenderingContext2D, c: Campaign, index: number) {
  backdrop(ctx);
  text(ctx, '行商', 60, 70, { size: 26, color: '#f0e6c8' });
  text(ctx, `所持金 ${c.gold} G`, CANVAS_W - 60, 70, { size: 20, align: 'right', color: '#ffd24a' });
  text(ctx, `輸送隊 ${c.convoy.length}`, CANVAS_W - 60, 98, { size: 14, align: 'right', color: '#b9c6e6' });

  const rows = shopRows(c);
  for (const [i, r] of rows.entries()) {
    const y = SHOP_Y + i * SHOP_STEP;
    const on = i === index;
    const can = r.kind === 'buy' ? c.gold >= r.price : true;
    if (on) {
      ctx.fillStyle = 'rgba(120,160,240,0.16)';
      ctx.fillRect(80, y - 22, 520, SHOP_STEP - 4);
    }
    text(ctx, r.kind === 'buy' ? '買' : '売', 92, y, { size: 14, color: r.kind === 'buy' ? '#8ff0b0' : '#ffb0a0' });
    text(ctx, r.name, 128, y, { size: 16, color: can ? (on ? '#ffffff' : '#c8d4ee') : '#5d6a8c' });
    text(ctx, `${r.price} G`, 580, y, { size: 15, align: 'right', color: can ? '#ffd24a' : '#5d6a8c' });
  }
  drawButtons(ctx, SHOP_BTN);
  if (!touchUI) {
    text(ctx, '↑↓ 選ぶ  /  Z 買う・売る  /  X 戻る', CANVAS_W / 2, CANVAS_H - 30, { size: 14, align: 'center', color: '#7d8cb0' });
  }
}

export function hitShop(x: number, y: number, rows: number): ScreenHit | undefined {
  if (hitButton(SHOP_BTN, x, y) === 'back') return { kind: 'back' };
  for (let i = 0; i < rows; i++) {
    if (inRect(x, y, 80, SHOP_Y - 24 + i * SHOP_STEP, 520, SHOP_STEP)) return { kind: 'confirm', index: i };
  }
  return undefined;
}

// -------------------------------------------------------------------- ガイド

const GUIDE_Y = 108;
const GUIDE_STEP = 36;
const GUIDE_BTN = [sbtn('back', '戻る', CANVAS_W - 152, 44)];

export function drawGuide(ctx: CanvasRenderingContext2D, index: number) {
  backdrop(ctx);
  text(ctx, 'ガイド', 80, 66, { size: 26, color: '#f0e6c8' });
  for (const [i, [k]] of GUIDE.entries()) {
    const y = GUIDE_Y + i * GUIDE_STEP;
    const on = i === index;
    if (on) {
      ctx.fillStyle = 'rgba(120,160,240,0.14)';
      ctx.fillRect(64, y - 20, CANVAS_W - 128, GUIDE_STEP - 4);
    }
    text(ctx, k, 88, y, { size: 14, color: on ? '#ffd24a' : '#9fb0d8' });
    text(ctx, guideText(i, touchUI), 260, y, { size: 13, color: on ? '#ffffff' : '#a8b6d4' });
  }
  drawButtons(ctx, GUIDE_BTN);
  if (!touchUI) text(ctx, 'X で戻る', CANVAS_W / 2, CANVAS_H - 30, { size: 14, align: 'center', color: '#7d8cb0' });
}

export function hitGuide(x: number, y: number): ScreenHit | undefined {
  if (hitButton(GUIDE_BTN, x, y) === 'back') return { kind: 'back' };
  for (const [i] of GUIDE.entries()) {
    if (inRect(x, y, 64, GUIDE_Y - 22 + i * GUIDE_STEP, CANVAS_W - 128, GUIDE_STEP)) return { kind: 'select', index: i };
  }
  return undefined;
}

export const GUIDE_COUNT = GUIDE.length;
