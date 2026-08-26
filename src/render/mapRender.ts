import { battleWeapon, equippedWeapon, maxHp, weaponRankOf } from '../battle/combat';
import { AFFINITY_COLOR, AFFINITY_NAME, RANK_LABEL, SUPPORT_THRESHOLD, supportBonus } from '../battle/support';
import { key } from '../core/grid';
import { MAP, MAP_H, MAP_W, TITLE } from '../data/chapters';

import { aidOf, classOf } from '../data/classes';
import { terrainAt } from '../data/terrain';
import { GUIDE, guideText } from '../data/guide';
import { rankFromWexp, WEAPON_ICON, WEAPON_LABEL } from '../data/weapons';
import { ROSTER_PAGE_LABEL, ROSTER_PAGES, STATUS_LABEL, type Game } from '../game/game';
import { OPTION_ROWS, WINDOW_COLORS } from '../game/options';
import type { Unit, WeaponType } from '../types';
import { camera, CANVAS_H, CANVAS_W, focusOn, OX, OY, TILE, VIEW_H, VIEW_W } from './layout';
import { groundCanvas } from './ground';
import { drawFacePortrait, drawHpBar, drawUnitSprite } from './sprites';
import { feText, fontOf } from './text';
import { drawPad, inRect, padFor, touchUI } from './touch';

// HUD はカメラの外で描くので、マップの実寸ではなく窓の大きさに合わせる。
// マップが窓より大きくなると MAP_W*TILE は画面外を指してしまう。
const MAP_PX_W = VIEW_W;
const MAP_PX_H = VIEW_H;

/**
 * FE 風のウィンドウ。色はオプションの「ウィンドウカラー」で 4 通りに変わる。
 * drawScene が毎フレーム windowScheme を差し替える。
 */
let windowScheme = WINDOW_COLORS[0];

function panel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, border?: string) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = '#151b2e';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 7);
  ctx.fill();
  ctx.restore();

  const g = ctx.createLinearGradient(x, y, x + w * 0.55, y + h);
  g.addColorStop(0, windowScheme.top);
  g.addColorStop(1, windowScheme.bottom);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.roundRect(x + 3, y + 3, w - 6, h - 6, 5);
  ctx.fill();

  ctx.strokeStyle = border ?? windowScheme.border;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x + 2.5, y + 2.5, w - 5, h - 5, 5);
  ctx.stroke();
}

const GOLD = '#ffd86a';

function fillTile(ctx: CanvasRenderingContext2D, k: number, color: string) {
  const x = k % 256;
  const y = Math.floor(k / 256);
  ctx.fillStyle = color;
  ctx.fillRect(OX + x * TILE, OY + y * TILE, TILE, TILE);
}

/**
 * 移動範囲と攻撃範囲。**敵の攻撃範囲を全部いっぺんに塗る機能は無い。**
 * GBA の FE にそれは無く、敵を一体選んだときだけその一体ぶんが赤く出る。
 */
/**
 * 範囲のふち。**マスごとに枠を引かない。**
 * 一マスずつ囲うとそれが格子になってしまうので、区画の外周だけをなぞる。
 */
function outlineRegion(ctx: CanvasRenderingContext2D, tiles: ReadonlySet<number>, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (const k of tiles) {
    const x = k % 256;
    const y = Math.floor(k / 256);
    const sx = OX + x * TILE;
    const sy = OY + y * TILE;
    if (!tiles.has(key(x, y - 1))) {
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + TILE, sy);
    }
    if (!tiles.has(key(x, y + 1))) {
      ctx.moveTo(sx, sy + TILE);
      ctx.lineTo(sx + TILE, sy + TILE);
    }
    if (!tiles.has(key(x - 1, y))) {
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx, sy + TILE);
    }
    if (!tiles.has(key(x + 1, y))) {
      ctx.moveTo(sx + TILE, sy);
      ctx.lineTo(sx + TILE, sy + TILE);
    }
  }
  ctx.stroke();
}

function drawRanges(ctx: CanvasRenderingContext2D, g: Game) {
  if (g.mode !== 'move' && g.mode !== 'menu') return;
  for (const k of g.atkTiles) fillTile(ctx, k, 'rgba(200,40,40,0.30)');
  for (const k of g.moveTiles) fillTile(ctx, k, 'rgba(40,90,220,0.34)');
  outlineRegion(ctx, g.atkTiles, 'rgba(255,140,140,0.45)');
  outlineRegion(ctx, g.moveTiles, 'rgba(160,205,255,0.55)');
}

function drawPath(ctx: CanvasRenderingContext2D, g: Game) {
  if (g.mode !== 'move' || !g.range || !g.sel || g.sel.team !== 'player') return;
  const k = key(g.cursor.x, g.cursor.y);
  if (!g.moveTiles.has(k)) return;
  const path: { x: number; y: number }[] = [];
  let cur: number | undefined = k;
  while (cur !== undefined) {
    path.push({ x: cur % 256, y: Math.floor(cur / 256) });
    cur = g.range.prev.get(cur);
  }
  path.reverse();
  if (path.length < 2) return;

  ctx.save();
  ctx.strokeStyle = 'rgba(120,220,255,0.95)';
  ctx.lineWidth = 6;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  path.forEach((p, i) => {
    const cx = OX + p.x * TILE + TILE / 2;
    const cy = OY + p.y * TILE + TILE / 2;
    if (i === 0) ctx.moveTo(cx, cy);
    else ctx.lineTo(cx, cy);
  });
  ctx.stroke();

  // 矢尻
  const last = path[path.length - 1];
  const prev = path[path.length - 2];
  const dx = Math.sign(last.x - prev.x);
  const dy = Math.sign(last.y - prev.y);
  const cx = OX + last.x * TILE + TILE / 2;
  const cy = OY + last.y * TILE + TILE / 2;
  ctx.fillStyle = 'rgba(120,220,255,0.95)';
  ctx.beginPath();
  ctx.moveTo(cx + dx * 12, cy + dy * 12);
  ctx.lineTo(cx + dx * -2 + dy * 9, cy + dy * -2 + dx * 9);
  ctx.lineTo(cx + dx * -2 - dy * 9, cy + dy * -2 - dx * 9);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** 状態異常と救出の印。GBA FE は駒の脇に小さな札を出す */
function drawUnitMarks(ctx: CanvasRenderingContext2D, u: Unit, cx: number, top: number, time: number) {
  const marks: [string, string][] = [];
  if (u.status) marks.push([STATUS_LABEL[u.status.kind], u.status.kind === 'poison' ? '#8fd67a' : '#c79bff']);
  if (u.rescuing) marks.push(['救', '#9fd0ff']);
  if (!marks.length) return;
  const blink = 0.6 + Math.abs(Math.sin(time * 3)) * 0.4;
  ctx.save();
  ctx.globalAlpha = blink;
  let x = cx - (marks.length * 22) / 2;
  for (const [label, color] of marks) {
    ctx.fillStyle = 'rgba(10,12,22,0.85)';
    ctx.beginPath();
    ctx.roundRect(x, top, 20, 14, 3);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.font = fontOf(10);
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(label.slice(0, 1), x + 10, top + 11);
    ctx.textAlign = 'left';
    x += 22;
  }
  ctx.restore();
}

/**
 * 戦場の霧。**見えていないマスに幕を下ろす。**
 *
 * 実機は霧の下を真っ黒には塗らない —— 地形は見えていて、そこに何がいるかだけが
 * 分からない。だから半透明の紺を重ね、敵の描画のほうを止める（`drawUnits`）。
 */
function drawFog(ctx: CanvasRenderingContext2D, seen: ReadonlySet<string>) {
  if (!seen.size) return;
  ctx.save();
  ctx.fillStyle = 'rgba(8,10,22,0.62)';
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      if (seen.has(`${x},${y}`)) continue;
      ctx.fillRect(OX + x * TILE, OY + y * TILE, TILE, TILE);
    }
  }
  ctx.restore();
}

function drawUnits(ctx: CanvasRenderingContext2D, g: Game, time: number, seen?: ReadonlySet<string>) {
  // 担がれている者は盤上にいない。霧の下の敵は、そこにいても描かない
  const hidden = (u: Unit) => seen?.size && u.team === 'enemy' && !seen.has(`${u.x},${u.y}`);
  const sorted = g.units.filter((u) => !u.dead && !u.carried && !hidden(u)).sort((a, b) => a.py - b.py);
  for (const u of sorted) {
    const cx = OX + u.px * TILE + TILE / 2;
    // 足元はタイルの下端に置く。0.86 だと 40px のタイルで 5.6px 浮いて見えた。
    const cy = OY + u.py * TILE + TILE * 0.97;
    const selected = g.sel === u && (g.mode === 'move' || g.mode === 'menu');
    const bob = selected ? Math.abs(Math.sin(time * 5)) * 4 : 0;

    if (g.mode === 'target' && g.targets[g.targetIndex] === u) {
      ctx.save();
      ctx.strokeStyle = '#ff5a5a';
      ctx.lineWidth = 2.5;
      const p = 2 + Math.sin(time * 8) * 2;
      ctx.strokeRect(OX + u.x * TILE + p, OY + u.y * TILE + p, TILE - p * 2, TILE - p * 2);
      ctx.restore();
    }

    // 歩いているのはひとりだけ。歩行クリップを持つユニットはそれを再生する。
    const clip = g.walk?.unit === u ? 'walk' : 'idle';
    // 移動中は進行方向を向く。マップは正面向きの絵なので左右の反転だけ。
    const facing = g.walk?.unit === u && u.px !== u.x ? (u.x > u.px ? 1 : -1) : undefined;
    drawUnitSprite(ctx, u, cx, cy, TILE * 1.12, {
      acted: u.acted && u.team === 'player',
      bob,
      clip,
      facing,
    });

    const bw = TILE * 0.6;
    drawHpBar(ctx, cx - bw / 2, OY + u.py * TILE + TILE - 5, bw, 3, u.hp, maxHp(u));
    drawUnitMarks(ctx, u, cx, OY + u.py * TILE - 2, time);
  }
}

function drawCursor(ctx: CanvasRenderingContext2D, g: Game, time: number) {
  const x = OX + g.cursor.x * TILE;
  const y = OY + g.cursor.y * TILE;
  const p = 2 + Math.sin(time * 6) * 1.6;
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  const len = 12;
  const corners = [
    [x - p, y - p, 1, 1],
    [x + TILE + p, y - p, -1, 1],
    [x - p, y + TILE + p, 1, -1],
    [x + TILE + p, y + TILE + p, -1, -1],
  ] as const;
  for (const [cx, cy, sx, sy] of corners) {
    ctx.beginPath();
    ctx.moveTo(cx + sx * len, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + sy * len);
    ctx.stroke();
  }
  ctx.restore();
}

function statLine(ctx: CanvasRenderingContext2D, label: string, value: string, x: number, y: number) {
  feText(ctx, label, x, y, { size: 12, color: GOLD });
  feText(ctx, value, x + 66, y, { size: 14, bold: true, align: 'right' });
}

/**
 * FE の「ユニットウィンドウ: バルーン」。名前と HP と状態だけの小窓で、
 * 能力を全部読みたければ R を押す、という分担にする。
 */
function drawUnitBalloon(ctx: CanvasRenderingContext2D, g: Game, u: Unit, side: 'left' | 'right') {
  const w = 172;
  const h = 62;
  const x = side === 'left' ? OX + 8 : OX + MAP_PX_W - w - 8;
  const y = g.cursor.y >= MAP_H / 2 ? OY + 8 : OY + MAP_PX_H - h - 8;
  panel(ctx, x, y, w, h, u.team === 'player' ? '#bcd6ff' : '#ffc2c2');

  feText(ctx, u.name, x + 12, y + 24, { size: 16, bold: true });
  feText(ctx, `Lv.${u.level}`, x + w - 12, y + 24, { size: 12, align: 'right', color: GOLD });
  drawHpBar(ctx, x + 12, y + 34, w - 66, 8, u.hp, maxHp(u));
  feText(ctx, `${u.hp}/${maxHp(u)}`, x + w - 12, y + 42, { size: 12, align: 'right' });
  const marks: string[] = [];
  if (u.status) marks.push(STATUS_LABEL[u.status.kind]);
  if (u.rescuing) marks.push('救出中');
  if (marks.length) feText(ctx, marks.join(' '), x + 12, y + 56, { size: 11, color: '#ffb0b0' });
}

function drawUnitPanel(ctx: CanvasRenderingContext2D, g: Game, u: Unit, side: 'left' | 'right' = 'left') {
  const w = 230;
  const h = 296;
  const x = side === 'left' ? OX + 8 : OX + MAP_PX_W - w - 8;
  const y = g.cursor.y >= MAP_H / 2 ? OY + 8 : OY + MAP_PX_H - h - 8;

  panel(ctx, x, y, w, h, u.team === 'player' ? '#bcd6ff' : '#ffc2c2');

  feText(ctx, u.name, x + 12, y + 25, { size: 18, bold: true });
  feText(ctx, AFFINITY_NAME[u.affinity], x + w - 12, y + 25, { size: 14, bold: true, align: 'right', color: AFFINITY_COLOR[u.affinity] });
  feText(ctx, `${classOf(u.classId).name}  Lv.${u.level}`, x + 12, y + 44, { size: 12, color: '#dbe6ff' });
  if (u.team === 'player') feText(ctx, `EXP ${u.exp}`, x + w - 12, y + 44, { size: 12, align: 'right', color: GOLD });

  feText(ctx, `HP`, x + 12, y + 63, { size: 12, color: GOLD });
  feText(ctx, `${u.hp}/${maxHp(u)}`, x + 78, y + 63, { size: 13, bold: true, align: 'right' });
  drawHpBar(ctx, x + 12, y + 68, w - 24, 8, u.hp, maxHp(u));

  const left = x + 12;
  const right = x + 120;
  let row = 0;
  const s = u.stats;
  const pairs: [string, number, string, number][] = [
    ['力', s.str, '魔力', s.mag],
    ['技', s.skl, '速さ', s.spd],
    ['幸運', s.lck, '守備', s.def],
    ['魔防', s.res, '移動', s.mov],
  ];
  for (const [l1, v1, l2, v2] of pairs) {
    const yy = y + 100 + row * 20;
    statLine(ctx, l1, String(v1), left, yy);
    statLine(ctx, l2, String(v2), right, yy);
    row++;
  }

  // 支援効果（3マス以内の相手ぶん）
  const bonus = supportBonus(u, g.units);
  if (bonus.hit || bonus.atk || bonus.avo) {
    feText(ctx, `支援効果 攻${bonus.atk} 守${bonus.def} 命中${bonus.hit} 回避${bonus.avo}`, x + 12, y + 196, {
      size: 11,
      color: '#9dffb8',
    });
  }

  // 武器レベル
  const ranks = classOf(u.classId).ranks;
  const rankText = (Object.keys(ranks) as WeaponType[]).map((t) => `${WEAPON_LABEL[t]} ${weaponRankOf(u, t)}`).join('  ');
  feText(ctx, `武器Lv  ${rankText}`, x + 12, y + 214, { size: 11, color: '#dbe6ff' });

  // 装備
  const w0 = equippedWeapon(u) ?? battleWeapon(u);
  if (w0) {
    feText(ctx, `[${WEAPON_ICON[w0.type]}] ${w0.name}`, x + 12, y + 236, { size: 13, color: GOLD });
    feText(ctx, `残${w0.uses}`, x + w - 12, y + 236, { size: 12, align: 'right' });
    if (w0.note) feText(ctx, w0.note, x + 12, y + 253, { size: 11, color: '#ffb188' });
  } else {
    feText(ctx, '武器なし', x + 12, y + 236, { size: 12, color: '#dbe6ff' });
  }

  // 支援relationship
  if (u.supports.length) {
    const txt = u.supports
      .map((sp) => {
        const partner = g.units.find((p) => p.id === sp.with);
        if (!partner) return '';
        const gauge = sp.rank >= 3 ? '' : ` ${Math.min(99, Math.floor((sp.points / SUPPORT_THRESHOLD[Math.min(3, sp.rank + 1)]) * 100))}%`;
        return `${partner.name} ${RANK_LABEL[sp.rank]}${sp.rank >= 3 ? '' : gauge}`;
      })
      .filter(Boolean)
      .join(' / ');
    feText(ctx, `支援  ${txt}`, x + 12, y + 274, { size: 11, color: '#cfe0ff' });
  }
}

function drawTerrainPanel(ctx: CanvasRenderingContext2D, g: Game, side: 'left' | 'right') {
  const t = terrainAt(MAP, g.cursor.x, g.cursor.y);
  const w = 150;
  const h = 70;
  const x = side === 'left' ? OX + 8 : OX + MAP_PX_W - w - 8;
  const y = g.cursor.y >= MAP_H / 2 ? OY + 8 : OY + MAP_PX_H - h - 8;
  panel(ctx, x, y, w, h);
  feText(ctx, t.name, x + 12, y + 25, { size: 16, bold: true });
  feText(ctx, `守備 +${t.def}   回避 +${t.avo}`, x + 12, y + 46, { size: 12, color: '#dbe6ff' });
  if (t.heal) feText(ctx, '毎ターン回復', x + 12, y + 63, { size: 11, color: '#9dffb8' });
}

/** FE のコマンドカーソル（指差しの手） */
function drawHandCursor(ctx: CanvasRenderingContext2D, x: number, y: number, wobble: number) {
  ctx.save();
  ctx.translate(x + wobble, y);
  ctx.fillStyle = '#fdf3e2';
  ctx.strokeStyle = '#2a2030';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.roundRect(-13, -8, 14, 16, 5);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(-2, -4, 13, 7, 3.5);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/** メニューの行の高さ。指のときだけ広げる。当たり判定も同じ値を見る */
export const menuRowH = () => (touchUI ? 44 : 34);

function drawMenu(ctx: CanvasRenderingContext2D, g: Game, time: number) {
  const m = g.menu;
  if (!m) return;
  const rowH = menuRowH();
  const h = (m.title ? 28 : 10) + m.items.length * rowH + 10;
  // マップメニューはユニットを選ばずに開く。その場合はカーソルの横に出す。
  const anchor = g.sel ?? g.cursor;
  const ux = OX + anchor.x * TILE - camera.x;
  const uy = OY + anchor.y * TILE - camera.y;
  let x = ux + TILE + 8;
  if (x + m.w > OX + MAP_PX_W) x = ux - m.w - 8;
  let y = uy;
  if (y + h > OY + MAP_PX_H) y = OY + MAP_PX_H - h - 4;
  m.x = x;
  m.y = y;

  // 本体（左が明るい青灰のグラデーション）
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;
  const body = ctx.createLinearGradient(x, y, x + m.w, y);
  body.addColorStop(0, '#8fa4cc');
  body.addColorStop(0.5, '#5f759f');
  body.addColorStop(1, '#3d5075');
  ctx.fillStyle = body;
  ctx.fillRect(x, y + 10, m.w, h - 20);
  ctx.restore();

  // 上下の木のバー（巻物）
  for (const by of [y, y + h - 12]) {
    const bar = ctx.createLinearGradient(0, by, 0, by + 12);
    bar.addColorStop(0, '#a5763f');
    bar.addColorStop(0.5, '#7c5228');
    bar.addColorStop(1, '#5a3a1c');
    ctx.fillStyle = bar;
    ctx.beginPath();
    ctx.roundRect(x - 6, by, m.w + 12, 12, 6);
    ctx.fill();
    ctx.strokeStyle = 'rgba(30,18,8,0.8)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  let top = y + 10;
  if (m.title) {
    feText(ctx, m.title, x + 12, y + 28, { size: 12, color: GOLD });
    top = y + 28;
  }

  m.items.forEach((it, i) => {
    const iy = top + i * rowH;
    const ty = iy + rowH / 2 + 6;
    if (i === m.index && it.enabled) {
      drawHandCursor(ctx, x + 24, iy + rowH / 2, Math.sin(time * 6) * 2);
    }
    feText(ctx, it.label, x + 44, ty, { size: 17, color: it.enabled ? '#ffffff' : '#93a0bb' });
    if (it.sub) feText(ctx, it.sub, x + m.w - 12, ty, { size: 13, align: 'right', color: GOLD });
  });
}

/**
 * 三すくみの印。FE は「▲有利」とは書かず、武器の名前の脇に小さな矢印を出す。
 * 上向きが有利、下向きが不利。
 */
function triangleMark(ctx: CanvasRenderingContext2D, x: number, y: number, tri: number) {
  if (!tri) return;
  const up = tri > 0;
  ctx.save();
  ctx.fillStyle = up ? '#8dffab' : '#ff9a9a';
  ctx.strokeStyle = 'rgba(16,12,24,0.9)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (up) {
    ctx.moveTo(x, y - 7);
    ctx.lineTo(x + 6, y + 2);
    ctx.lineTo(x - 6, y + 2);
  } else {
    ctx.moveTo(x, y + 2);
    ctx.lineTo(x + 6, y - 7);
    ctx.lineTo(x - 6, y - 7);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  ctx.restore();
}

/**
 * 戦闘予測。FE8 は HP / 威力 / 命中 / 必殺 の 4 行と武器名しか出さない。
 * 特効も三すくみも文字ではなく印で示す。オプションで簡易・詳細・なしが選べる。
 */
function drawForecast(ctx: CanvasRenderingContext2D, g: Game) {
  const fc = g.currentForecast();
  if (!fc || !g.options.battleWindow) return;
  const detail = g.options.battleWindow >= 2;
  const w = 268;
  const h = detail ? 196 : 148;
  const x = g.cursor.x >= MAP_W / 2 ? OX + 12 : OX + MAP_PX_W - w - 12;
  // ユニット情報パネルと上下で入れ替わるように配置する
  const y = g.cursor.y >= MAP_H / 2 ? OY + MAP_PX_H - h - 12 : OY + 52;

  panel(ctx, x, y, w, h, '#8898c8');

  const a = fc.attacker;
  const d = fc.defender;
  const lx = x + 16;
  const rx = x + w - 16;
  const cx = x + w / 2;

  feText(ctx, a.unit.name, lx, y + 25, { size: 15, bold: true, color: '#bfe0ff' });
  feText(ctx, d.unit.name, rx, y + 25, { size: 15, bold: true, align: 'right', color: '#ffbcbc' });

  const rows: [string, string, string][] = [
    ['HP', `${a.unit.hp}`, `${d.unit.hp}`],
    ['威力', a.canAttack ? `${a.damage}${a.doubles ? ' x2' : ''}` : '--', d.canAttack ? `${d.damage}${d.doubles ? ' x2' : ''}` : '--'],
    ['命中', a.canAttack ? `${a.hitRate}` : '--', d.canAttack ? `${d.hitRate}` : '--'],
  ];
  if (detail) rows.push(['必殺', a.canAttack ? `${a.critRate}` : '--', d.canAttack ? `${d.critRate}` : '--']);

  rows.forEach((r, i) => {
    const yy = y + 58 + i * 26;
    feText(ctx, r[0], cx, yy, { size: 12, align: 'center', color: GOLD });
    feText(ctx, r[1], lx, yy, { size: 18, bold: true });
    feText(ctx, r[2], rx, yy, { size: 18, bold: true, align: 'right' });
  });

  if (!detail) return;

  // 武器。特効は名前を橙にするだけ、三すくみは脇の矢印だけで示す
  const wy = y + 172;
  feText(ctx, a.weapon?.name ?? '-', lx + 12, wy, { size: 12, color: a.effective ? '#ffb14a' : '#dbe6ff' });
  feText(ctx, d.weapon?.name ?? '-', rx - 12, wy, { size: 12, align: 'right', color: d.effective ? '#ffb14a' : '#dbe6ff' });
  triangleMark(ctx, lx + 3, wy - 3, a.tri);
  triangleMark(ctx, rx - 3, wy - 3, d.tri);
}

/**
 * 目標ウィンドウ。**マップに常設の HUD は置かない。**
 *
 * GBA の FE はターン数も人数も目標も画面に出しっぱなしにせず、フェイズが
 * 変わったときに一枚出して引っ込め、あとは「状況」画面で読ませる。
 * オプションの「目標表示」を切ると出なくなる。
 */
/**
 * 岩山を抜く進み具合。`breach` の章にしか出ない。
 *
 * 第24章には残りターンの表示が無い（道が減っていくのがそれ）。代わりに要るのは
 * 「あと何ターン石を読むのか」「あと何回叩けば抜けるのか」で、それはこの一行。
 */
function gateLine(g: Game): string | undefined {
  const o = g.objective;
  if (o.kind !== 'breach') return undefined;
  const need = o.seamTurns ?? 3;
  if (g.seam < need) return `見立て ${g.seam} / ${need}`;
  return `破石 ${g.broken} / ${o.breakTotal ?? 60}`;
}

function drawObjectiveNotice(ctx: CanvasRenderingContext2D, g: Game) {
  const t = g.objectiveNotice;
  if (t <= 0) return;
  const alpha = Math.min(1, t / 0.4);
  const w = 300;
  const h = 74;
  const x = OX + MAP_PX_W - w - 12;
  const y = OY + 12;
  ctx.save();
  ctx.globalAlpha = alpha;
  panel(ctx, x, y, w, h);
  feText(ctx, g.objective.label, x + 14, y + 28, { size: 16, bold: true, color: GOLD });
  const lord = g.units.find((u) => u.isLord);
  feText(ctx, gateLine(g) ?? `敗北: ${lord?.name ?? 'ロード'}の死亡`, x + 14, y + 50, { size: 12, color: '#dbe6ff' });
  feText(ctx, `ターン ${g.turn}`, x + w - 14, y + 50, { size: 12, align: 'right', color: '#dbe6ff' });
  ctx.restore();
}

function drawMessages(ctx: CanvasRenderingContext2D, g: Game) {
  ctx.textAlign = 'left';
  ctx.font = fontOf(13);
  g.messages.forEach((m, i) => {
    const alpha = Math.max(0, Math.min(1, 4 - m.t));
    ctx.fillStyle = `rgba(220,232,255,${alpha})`;
    ctx.fillText(m.text, 16, CANVAS_H - 16 - (g.messages.length - 1 - i) * 18);
  });
}

/** FE のマップメニューにある「状況」。何を達成すれば終わるかを画面から読めるようにする */
/**
 * ユニットの詳細画面。FE の R ボタンで開く、顔グラ付きの複数ページのやつ。
 * 左右でページを送る: 能力 / 装備 / 支援。
 */
/** FE のオプション。戦闘アニメを切れるのが本体 */
function drawOptions(ctx: CanvasRenderingContext2D, g: Game) {
  if (g.mode !== 'options') return;
  ctx.fillStyle = 'rgba(6,9,18,0.9)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  feText(ctx, 'オプション', OPT_X, 78, { size: 28, color: '#f0e6c8' });
  for (const [i, row] of OPTION_ROWS.entries()) {
    const y = OPT_Y + i * OPT_STEP;
    const on = i === g.optionIndex;
    if (on) {
      ctx.fillStyle = 'rgba(120,160,240,0.18)';
      ctx.fillRect(OPT_X - 16, y - 22, OPT_W, OPT_STEP - 4);
      feText(ctx, '▶', OPT_X - 40, y, { size: 17, color: '#ffd24a' });
    }
    feText(ctx, row.label, OPT_X, y, { size: 17, color: on ? '#ffffff' : '#9fb0d8' });
    const v = row.values[g.options[row.key]] ?? '?';
    feText(ctx, on ? `◀ ${v} ▶` : v, OPT_X + 330, y, { size: 17, align: 'center', color: on ? '#ffd24a' : '#c8d4ee' });
  }
  feText(ctx, touchUI ? '項目を押すと変わる' : '↑↓ 選ぶ  /  ←→ 変える  /  X で戻る', CANVAS_W / 2, CANVAS_H - 34, {
    size: 14,
    align: 'center',
    color: '#8b9ac0',
  });
}

// オプションの行と詳細のページ見出しは指でも押せる。座標は描画とここでしか
// 使わないので、描く側の定数をそのまま当たり判定に回す。
const OPT_X = 260;
const OPT_Y = 128;
const OPT_STEP = 44;
const OPT_W = 440;

/** オプション画面で押された行。無ければ undefined */
export function hitOptionRow(x: number, y: number) {
  for (let i = 0; i < OPTION_ROWS.length; i++) {
    if (inRect(x, y, OPT_X - 40, OPT_Y + i * OPT_STEP - 24, OPT_W + 40, OPT_STEP)) return i;
  }
  return undefined;
}

const TAB_X = 400;
const TAB_STEP = 70;

/** 詳細画面で押されたページ見出し。無ければ undefined */
export function hitUnitTab(x: number, y: number) {
  for (let i = 0; i < 3; i++) {
    if (inRect(x, y, TAB_X + i * TAB_STEP - 12, 68, 62, 46)) return i;
  }
  return undefined;
}

function drawUnitStatus(ctx: CanvasRenderingContext2D, g: Game) {
  if (g.mode !== 'unit' || !g.inspect) return;
  const u = g.inspect;
  const cls = classOf(u.classId);
  ctx.fillStyle = 'rgba(6,9,18,0.92)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // 左: 顔グラと名札
  drawFacePortrait(ctx, u, 190, CANVAS_H - 40, 330, 1);
  ctx.save();
  ctx.fillStyle = 'rgba(10,16,30,0.8)';
  ctx.fillRect(40, 64, 300, 92);
  ctx.strokeStyle = '#c9a25a';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 64, 300, 92);
  ctx.restore();
  feText(ctx, u.name, 60, 104, { size: 30, color: '#f0e6c8' });
  feText(ctx, `${cls.name}  Lv.${u.level}`, 60, 136, { size: 16, color: '#9fb0d8' });
  feText(ctx, `EXP ${u.exp} / 100`, 240, 136, { size: 14, color: '#9fb0d8' });

  const pages = ['能力', '装備', '支援'];
  let px = TAB_X;
  for (const [i, p] of pages.entries()) {
    const on = i === g.inspectPage;
    feText(ctx, p, px, 96, { size: 18, color: on ? '#ffd24a' : '#6f7fa4' });
    if (on) {
      ctx.fillStyle = '#ffd24a';
      ctx.fillRect(px, 104, 40, 2);
    }
    px += TAB_STEP;
  }
  feText(ctx, touchUI ? 'ページを押す' : '←→ ページ  /  X で戻る', CANVAS_W - 40, 96, {
    size: 13,
    align: 'right',
    color: '#7d8cb0',
  });

  const x = 400;
  let y = 160;
  const row = (k: string, v: string, colour = '#e8eefc') => {
    feText(ctx, k, x, y, { size: 15, color: '#9fb0d8' });
    feText(ctx, v, x + 150, y, { size: 18, color: colour });
    y += 32;
  };

  if (g.inspectPage === 0) {
    row('HP', `${u.hp} / ${maxHp(u)}`);
    const s = u.stats;
    const g2 = u.growth;
    for (const [k, label] of [
      ['str', '力'],
      ['mag', '魔力'],
      ['skl', '技'],
      ['spd', '速さ'],
      ['lck', '幸運'],
      ['def', '守備'],
      ['res', '魔防'],
    ] as [keyof typeof s, string][]) {
      feText(ctx, label, x, y, { size: 15, color: '#9fb0d8' });
      feText(ctx, String(s[k]), x + 150, y, { size: 18, color: '#e8eefc' });
      feText(ctx, `成長 ${g2[k]}%`, x + 210, y, { size: 13, color: '#6f7fa4' });
      y += 32;
    }
    row('体格', String(s.con));
    row('移動', String(s.mov));
    row('属性', AFFINITY_NAME[u.affinity], AFFINITY_COLOR[u.affinity]);
  } else if (g.inspectPage === 1) {
    for (const [i, w] of u.items.entries()) {
      const eq = i === u.equipped;
      feText(ctx, (eq ? '▶ ' : '  ') + w.name, x, y, { size: 18, color: eq ? '#ffd24a' : '#e8eefc' });
      feText(ctx, `${WEAPON_LABEL[w.type]} ${w.rank}`, x + 210, y, { size: 13, color: '#9fb0d8' });
      feText(ctx, `${w.uses}`, x + 320, y, { size: 15, color: '#9fb0d8' });
      y += 30;
    }
    if (u.potion) row('傷薬', String(u.potion));
    if (u.keys) row('鍵', String(u.keys));
    y += 12;
    feText(ctx, '武器レベル', x, y, { size: 15, color: '#9fb0d8' });
    y += 28;
    for (const [type, wexp] of Object.entries(u.wexp)) {
      if (!wexp) continue;
      feText(ctx, WEAPON_LABEL[type as keyof typeof WEAPON_LABEL] ?? type, x, y, { size: 15, color: '#e8eefc' });
      feText(ctx, `${rankFromWexp(wexp)}  (${wexp})`, x + 150, y, { size: 15, color: '#9fb0d8' });
      y += 26;
    }
  } else {
    if (!u.supports.length) feText(ctx, '支援の相手はいない', x, y, { size: 16, color: '#6f7fa4' });
    for (const link of u.supports) {
      const other = g.units.find((o) => o.id === link.with);
      feText(ctx, other?.name ?? link.with, x, y, { size: 18, color: '#e8eefc' });
      feText(ctx, RANK_LABEL[link.rank], x + 180, y, { size: 18, color: '#ffd24a' });
      feText(ctx, `${link.points}`, x + 230, y, { size: 14, color: '#6f7fa4' });
      y += 32;
    }
  }
}

function drawStatus(ctx: CanvasRenderingContext2D, g: Game) {
  if (g.mode !== 'status') return;
  ctx.fillStyle = 'rgba(6,9,18,0.86)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  const x = 200;
  let y = 150;
  feText(ctx, '状況', x, y, { size: 30, color: '#f0e6c8' });
  y += 56;
  const lord = g.units.find((u) => u.isLord);
  const rows: [string, string][] = [
    ['章', TITLE],
    ['目標', g.objective.label],
    ...((gateLine(g) ? [['岩を抜く', gateLine(g)!]] : []) as [string, string][]),
    ['敗北条件', `${lord?.name ?? 'ロード'}の死亡`],
    ['ターン', String(g.turn)],
    ['自軍', `${g.alive('player').length} 人`],
    ['敵', `${g.alive('enemy').length} 人`],
    ['所持金', `${g.gold} G`],
  ];
  for (const [k, v] of rows) {
    feText(ctx, k, x, y, { size: 16, color: '#9fb0d8' });
    feText(ctx, v, x + 160, y, { size: 18, color: '#e8eefc' });
    y += 34;
  }
  feText(ctx, touchUI ? '「戻る」で閉じる' : 'X / 右クリックで戻る', CANVAS_W / 2, CANVAS_H - 70, {
    size: 14,
    align: 'center',
    color: '#8b9ac0',
  });
}

/**
 * マップメニューの「ユニット」。FE8 は自軍全員を 6 面の表で見せる。
 * 左右でページを送り、上下で行を選ぶ。
 */
const ROSTER_Y = 148;
const ROSTER_STEP = 34;
const ROSTER_TAB_X = 250;
const ROSTER_TAB_STEP = 82;

function rosterColumns(page: number): [string, number][] {
  switch (page) {
    case 0:
      return [
        ['クラス', 200],
        ['Lv', 330],
        ['EXP', 380],
        ['HP', 450],
        ['状態', 560],
      ];
    case 1:
      return [
        ['力', 200],
        ['魔力', 250],
        ['技', 305],
        ['速さ', 355],
        ['幸運', 415],
        ['守備', 475],
        ['魔防', 535],
      ];
    case 2:
      return [
        ['装備', 200],
        ['残', 380],
        ['威力', 430],
        ['命中', 490],
        ['必殺', 550],
      ];
    case 3:
      return [
        ['移動', 200],
        ['体格', 260],
        ['援護', 320],
        ['属性', 380],
        ['救出', 440],
      ];
    case 4:
      return [
        ['武器レベル', 200],
        ['', 560],
      ];
    default:
      return [
        ['支援', 200],
        ['', 560],
      ];
  }
}

function rosterCell(u: Unit, page: number, col: number): string {
  const cls = classOf(u.classId);
  const w = equippedWeapon(u) ?? battleWeapon(u);
  switch (page) {
    case 0:
      return [cls.name, `${u.level}`, `${u.exp}`, `${u.hp}/${maxHp(u)}`, u.status ? STATUS_LABEL[u.status.kind] : '-'][col] ?? '';
    case 1:
      return [u.stats.str, u.stats.mag, u.stats.skl, u.stats.spd, u.stats.lck, u.stats.def, u.stats.res].map(String)[col] ?? '';
    case 2:
      return [w ? w.name : '武器なし', w ? `${w.uses}` : '-', w ? `${w.mt}` : '-', w ? `${w.hit}` : '-', w ? `${w.crit}` : '-'][col] ?? '';
    case 3:
      return (
        [
          `${u.stats.mov}`,
          `${u.stats.con}`,
          `${aidOf(u)}`,
          AFFINITY_NAME[u.affinity],
          u.rescuing ? '担いでいる' : u.carried ? '担がれている' : '-',
        ][col] ?? ''
      );
    case 4: {
      if (col > 0) return '';
      const ranks = Object.keys(cls.ranks) as WeaponType[];
      return ranks.map((t) => `${WEAPON_LABEL[t]} ${weaponRankOf(u, t)}`).join('   ') || '-';
    }
    default: {
      if (col > 0) return '';
      const txt = u.supports
        .filter((s) => s.rank > 0)
        .map((s) => `${s.with} ${RANK_LABEL[s.rank]}`)
        .join('  ');
      return txt || '-';
    }
  }
}

function drawRoster(ctx: CanvasRenderingContext2D, g: Game) {
  if (g.mode !== 'roster') return;
  ctx.fillStyle = 'rgba(6,9,18,0.94)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  feText(ctx, 'ユニット', 60, 66, { size: 26, color: '#f0e6c8' });
  for (let i = 0; i < ROSTER_PAGES; i++) {
    const on = i === g.rosterPage;
    const x = ROSTER_TAB_X + i * ROSTER_TAB_STEP;
    feText(ctx, ROSTER_PAGE_LABEL[i], x, 66, { size: 15, color: on ? '#ffd24a' : '#6f7fa4' });
    if (on) {
      ctx.fillStyle = '#ffd24a';
      ctx.fillRect(x, 74, ctx.measureText(ROSTER_PAGE_LABEL[i]).width, 2);
    }
  }
  feText(ctx, touchUI ? 'ページを押す' : '←→ ページ  /  X で戻る', CANVAS_W - 40, 66, {
    size: 13,
    align: 'right',
    color: '#7d8cb0',
  });

  const cols = rosterColumns(g.rosterPage);
  feText(ctx, '名前', 80, ROSTER_Y - 26, { size: 12, color: '#7d8cb0' });
  for (const [label, cx] of cols) if (label) feText(ctx, label, cx, ROSTER_Y - 26, { size: 12, color: '#7d8cb0' });

  const list = g.rosterList();
  for (const [i, u] of list.entries()) {
    const y = ROSTER_Y + i * ROSTER_STEP;
    if (i === g.rosterIndex) {
      ctx.fillStyle = 'rgba(120,160,240,0.16)';
      ctx.fillRect(60, y - 22, CANVAS_W - 120, ROSTER_STEP - 4);
    }
    ctx.save();
    ctx.globalAlpha = u.acted ? 0.55 : 1;
    feText(ctx, u.name, 80, y, { size: 16 });
    for (const [ci, [, cx]] of cols.entries()) {
      feText(ctx, rosterCell(u, g.rosterPage, ci), cx, y, { size: 14, color: '#c8d4ee' });
    }
    ctx.restore();
  }
}

/** ユニット一覧のページ見出しの当たり判定 */
export function hitRosterTab(x: number, y: number) {
  for (let i = 0; i < ROSTER_PAGES; i++) {
    if (inRect(x, y, ROSTER_TAB_X + i * ROSTER_TAB_STEP - 12, 40, ROSTER_TAB_STEP - 8, 44)) return i;
  }
  return undefined;
}

/** 章の中から開いたガイド。タイトル画面のものと同じ表を引く */
const CH_GUIDE_Y = 108;
const CH_GUIDE_STEP = 36;

function drawGuidePanel(ctx: CanvasRenderingContext2D, g: Game) {
  if (g.mode !== 'guide') return;
  ctx.fillStyle = 'rgba(6,9,18,0.94)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  feText(ctx, 'ガイド', 60, 66, { size: 26, color: '#f0e6c8' });
  for (const [i, [k]] of GUIDE.entries()) {
    const y = CH_GUIDE_Y + i * CH_GUIDE_STEP;
    const on = i === g.guideIndex;
    if (on) {
      ctx.fillStyle = 'rgba(120,160,240,0.14)';
      ctx.fillRect(52, y - 20, CANVAS_W - 104, CH_GUIDE_STEP - 4);
    }
    feText(ctx, k, 72, y, { size: 14, color: on ? '#ffd24a' : '#9fb0d8' });
    feText(ctx, guideText(i, touchUI), 240, y, { size: 13, color: on ? '#ffffff' : '#a8b6d4' });
  }
}

function drawBanner(ctx: CanvasRenderingContext2D, g: Game) {
  const b = g.banner;
  if (!b) return;
  const p = b.t / 1.6;
  const slide = p < 0.2 ? 1 - p / 0.2 : p > 0.8 ? (p - 0.8) / 0.2 : 0;
  const alpha = p > 0.8 ? 1 - (p - 0.8) / 0.2 : 1;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(slide * -CANVAS_W * 0.6, 0);
  ctx.fillStyle = 'rgba(8,12,22,0.86)';
  ctx.fillRect(0, CANVAS_H / 2 - 44, CANVAS_W, 88);
  ctx.fillStyle = b.color;
  ctx.fillRect(0, CANVAS_H / 2 - 44, CANVAS_W, 3);
  ctx.fillRect(0, CANVAS_H / 2 + 41, CANVAS_W, 3);
  ctx.textAlign = 'center';
  ctx.font = fontOf(40, true);
  ctx.fillStyle = b.color;
  ctx.fillText(b.text, CANVAS_W / 2, CANVAS_H / 2 + 14);
  ctx.restore();
  ctx.textAlign = 'left';
}

function drawResult(ctx: CanvasRenderingContext2D, g: Game) {
  if (!g.result) return;
  ctx.fillStyle = 'rgba(6,9,18,0.82)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.textAlign = 'center';
  ctx.font = fontOf(56, true);
  ctx.fillStyle = g.result === 'win' ? '#ffd24a' : '#ff7070';
  ctx.fillText(g.result === 'win' ? '勝　利' : '敗　北', CANVAS_W / 2, CANVAS_H / 2 - 10);
  ctx.font = fontOf(16);
  ctx.fillStyle = '#c3cee6';
  ctx.fillText(`${g.turn} ターンで決着`, CANVAS_W / 2, CANVAS_H / 2 + 30);
  ctx.fillStyle = '#8b9ac0';
  ctx.fillText(touchUI ? '画面を押すとやり直し' : 'Shift+R でリスタート', CANVAS_W / 2, CANVAS_H / 2 + 64);
  ctx.textAlign = 'left';
}

export function drawScene(ctx: CanvasRenderingContext2D, g: Game, time: number, dt = 0) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#0b0e17';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  if (g.battle) {
    g.battle.draw(ctx);
    return;
  }

  // 歩いているユニットがいればそれを、いなければカーソルを追う。敵フェイズに
  // 画面外で動かれると何が起きたか分からないので、そこは特に効く。
  windowScheme = WINDOW_COLORS[g.options.windowColor] ?? WINDOW_COLORS[0];
  const follow = g.walk?.unit ?? g.cursor;
  focusOn(follow.x, follow.y, dt);

  // 盤面はカメラの中。窓で切り抜いてから寄せるので、スクロールしても HUD の下に
  // はみ出さない。HUD はこの外で描くため画面座標のまま。
  ctx.save();
  ctx.beginPath();
  ctx.rect(OX, OY, VIEW_W, VIEW_H);
  ctx.clip();
  ctx.translate(-Math.round(camera.x), -Math.round(camera.y));

  // 地表は一枚に焼いてある。マスごとに塗らないので継ぎ目も格子も出ない
  ctx.drawImage(groundCanvas(g.visited, g.opened), OX, OY);

  const seen = g.visible;
  drawFog(ctx, seen);
  drawRanges(ctx, g);
  drawPath(ctx, g);
  drawUnits(ctx, g, time, seen);
  if (!g.result && !g.dialogue) drawCursor(ctx, g, time);
  ctx.restore();

  // 会話パート中はマップ UI を隠す
  if (g.dialogue) {
    g.dialogue.draw(ctx);
    return;
  }

  // 状況・詳細は画面を占有する。後ろに小窓が透けるのはおかしい
  const fullscreen = g.mode === 'status' || g.mode === 'unit' || g.mode === 'options' || g.mode === 'roster' || g.mode === 'guide';

  // 対象選択中は戦闘予測と反対側にユニット情報を出す
  const inTarget = g.mode === 'target';
  const forecastOnLeft = g.cursor.x >= MAP_W / 2;
  const hovered = inTarget ? g.targets[g.targetIndex] : g.unitAtCursor();
  // FE と同じで、パネルはカーソルに被らない側へ寄る
  const away: 'left' | 'right' = g.cursor.x < MAP_W / 2 ? 'right' : 'left';
  if (!fullscreen) {
    const side = inTarget ? (forecastOnLeft ? 'right' : 'left') : away;
    const showUnit = !!hovered && g.options.unitWindow > 0;
    if (hovered && g.options.unitWindow === 2) drawUnitPanel(ctx, g, hovered, side);
    else if (hovered && g.options.unitWindow === 1) drawUnitBalloon(ctx, g, hovered, side);
    // 地形はユニットの窓と反対側へ逃がす。同じ隅で重なると両方読めない
    if (!inTarget && g.options.terrainWindow) {
      drawTerrainPanel(ctx, g, showUnit ? (side === 'left' ? 'right' : 'left') : 'right');
    }
    drawMenu(ctx, g, time);
    drawForecast(ctx, g);
    drawObjectiveNotice(ctx, g);
    drawMessages(ctx, g);
  }
  drawStatus(ctx, g);
  drawUnitStatus(ctx, g);
  drawOptions(ctx, g);
  drawRoster(ctx, g);
  drawGuidePanel(ctx, g);
  drawBanner(ctx, g);
  drawResult(ctx, g);
  drawPad(ctx, padFor(g), dt);
}
