import { battleWeapon, equippedWeapon, maxHp, weaponRankOf } from '../battle/combat';
import { AFFINITY_COLOR, AFFINITY_NAME, RANK_LABEL, SUPPORT_THRESHOLD, supportBonus } from '../battle/support';
import { key } from '../core/grid';
import { MAP, MAP_H, MAP_W } from '../data/chapter1';
import { TITLE } from '../story/script';
import { classOf } from '../data/classes';
import { terrainAt } from '../data/terrain';
import { WEAPON_ICON, WEAPON_LABEL } from '../data/weapons';
import type { Game } from '../game/game';
import type { Unit, WeaponType } from '../types';
import { camera, CANVAS_H, CANVAS_W, focusOn, OX, OY, TILE, VIEW_H, VIEW_W } from './layout';
import { drawHpBar, drawUnitSprite } from './sprites';

// HUD はカメラの外で描くので、マップの実寸ではなく窓の大きさに合わせる。
// マップが窓より大きくなると MAP_W*TILE は画面外を指してしまう。
const MAP_PX_W = VIEW_W;
const MAP_PX_H = VIEW_H;

function hash(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/** FE 風のウィンドウ: 青灰のグラデーション + 明るい細枠 */
function panel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, border = '#cfe0ff') {
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
  g.addColorStop(0, 'rgba(120,146,196,0.96)');
  g.addColorStop(0.55, 'rgba(74,96,142,0.96)');
  g.addColorStop(1, 'rgba(42,57,92,0.96)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.roundRect(x + 3, y + 3, w - 6, h - 6, 5);
  ctx.fill();

  ctx.strokeStyle = border;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x + 2.5, y + 2.5, w - 5, h - 5, 5);
  ctx.stroke();
}

/** 白抜き文字（FE のフォントは濃い縁取りが付く） */
function feText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  opts: { size?: number; color?: string; bold?: boolean; align?: CanvasTextAlign; mono?: boolean } = {},
) {
  const size = opts.size ?? 14;
  const family = opts.mono ? '"Consolas", monospace' : '"Yu Gothic UI", sans-serif';
  ctx.font = `${opts.bold ? 'bold ' : ''}${size}px ${family}`;
  ctx.textAlign = opts.align ?? 'left';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(16,12,24,0.92)';
  ctx.lineWidth = Math.max(2.5, size * 0.3);
  ctx.strokeText(text, x, y);
  ctx.fillStyle = opts.color ?? '#ffffff';
  ctx.fillText(text, x, y);
  ctx.textAlign = 'left';
}

const GOLD = '#ffd86a';

/** drawScene が毎フレーム差し替える。村の戸を閉めるためだけの参照 */
let visitedVillages: ReadonlySet<string> = new Set();
let openedChests: ReadonlySet<string> = new Set();

function drawTile(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const t = terrainAt(MAP, x, y);
  const sx = OX + x * TILE;
  const sy = OY + y * TILE;
  const r = hash(x, y);

  ctx.fillStyle = r > 0.5 ? t.color2 : t.color;
  ctx.fillRect(sx, sy, TILE, TILE);

  ctx.save();
  ctx.beginPath();
  ctx.rect(sx, sy, TILE, TILE);
  ctx.clip();

  switch (t.id) {
    case 'plain':
    case 'grass':
      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      for (let i = 0; i < 3; i++) {
        const px = sx + hash(x * 3 + i, y) * TILE;
        const py = sy + hash(x, y * 3 + i) * TILE;
        ctx.fillRect(px, py, 3, 2);
      }
      break;
    case 'road':
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx + 1, sy + 1, TILE - 2, TILE - 2);
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(sx + hash(x + i, y) * TILE, sy + hash(x, y + i) * TILE, 4, 3);
      }
      break;
    case 'forest':
      for (let i = 0; i < 3; i++) {
        const cx = sx + 8 + ((i * 13 + hash(x, y + i) * 8) % (TILE - 14));
        const cy = sy + 12 + hash(x + i, y) * 16;
        ctx.fillStyle = '#1f3d26';
        ctx.beginPath();
        ctx.moveTo(cx, cy - 12);
        ctx.lineTo(cx + 8, cy + 4);
        ctx.lineTo(cx - 8, cy + 4);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#5a3c24';
        ctx.fillRect(cx - 1.5, cy + 3, 3, 5);
      }
      break;
    case 'mountain':
      ctx.fillStyle = '#4e463d';
      ctx.beginPath();
      ctx.moveTo(sx + 4, sy + TILE - 4);
      ctx.lineTo(sx + TILE / 2, sy + 6);
      ctx.lineTo(sx + TILE - 4, sy + TILE - 4);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#d8d8e0';
      ctx.beginPath();
      ctx.moveTo(sx + TILE / 2 - 6, sy + 15);
      ctx.lineTo(sx + TILE / 2, sy + 6);
      ctx.lineTo(sx + TILE / 2 + 6, sy + 15);
      ctx.closePath();
      ctx.fill();
      break;
    case 'wall':
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(sx + 3, sy + 3, TILE - 6, TILE / 2 - 5);
      ctx.fillRect(sx + 3, sy + TILE / 2 + 2, TILE / 2 - 5, TILE / 2 - 5);
      ctx.fillRect(sx + TILE / 2 + 2, sy + TILE / 2 + 2, TILE / 2 - 5, TILE / 2 - 5);
      break;
    case 'water':
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        const wy = sy + 8 + i * 11 + hash(x, y + i) * 4;
        ctx.beginPath();
        ctx.moveTo(sx + 5, wy);
        ctx.quadraticCurveTo(sx + TILE / 2, wy + 5, sx + TILE - 5, wy);
        ctx.stroke();
      }
      break;
    case 'village': {
      // 訪問済みは戸を閉めて暗くする。FE も一度きりで、済んだ村は見分けがつく
      const done = visitedVillages.has(x + ',' + y);
      ctx.fillStyle = done ? '#4a3a2a' : '#8a6a44';
      ctx.fillRect(sx + 7, sy + 16, TILE - 14, TILE - 20);
      ctx.fillStyle = done ? '#5c4632' : '#a8804f';
      ctx.beginPath();
      ctx.moveTo(sx + 4, sy + 17);
      ctx.lineTo(sx + TILE / 2, sy + 6);
      ctx.lineTo(sx + TILE - 4, sy + 17);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = done ? '#2a2018' : '#3a2c1c';
      ctx.fillRect(sx + TILE / 2 - 4, sy + TILE - 12, 8, 8);
      break;
    }
    case 'door':
      ctx.fillStyle = '#3a2c1c';
      ctx.fillRect(sx + 6, sy + 6, TILE - 12, TILE - 8);
      ctx.fillStyle = '#7a6244';
      ctx.fillRect(sx + 9, sy + 9, TILE - 18, TILE - 12);
      ctx.fillStyle = '#d8c56a';
      ctx.fillRect(sx + TILE - 15, sy + TILE / 2 - 2, 4, 4);
      break;
    case 'chest': {
      const taken = openedChests.has(x + ',' + y);
      ctx.fillStyle = taken ? '#4a4636' : '#8a6a2a';
      ctx.fillRect(sx + 8, sy + 18, TILE - 16, TILE - 26);
      ctx.fillStyle = taken ? '#5c5844' : '#b8933c';
      ctx.fillRect(sx + 8, sy + 13, TILE - 16, 7);
      if (!taken) {
        ctx.fillStyle = '#f0e0a0';
        ctx.fillRect(sx + TILE / 2 - 2, sy + 17, 4, 6);
      }
      break;
    }
    case 'shop':
      ctx.fillStyle = '#5a4632';
      ctx.fillRect(sx + 6, sy + 16, TILE - 12, TILE - 20);
      ctx.fillStyle = '#c0503a';
      ctx.fillRect(sx + 4, sy + 11, TILE - 8, 7);
      ctx.fillStyle = '#e8d8a0';
      ctx.fillRect(sx + TILE / 2 - 5, sy + 22, 10, 3);
      ctx.fillRect(sx + TILE / 2 - 1, sy + 22, 2, 10);
      break;
    case 'fort':
      ctx.fillStyle = '#565368';
      ctx.fillRect(sx + 6, sy + 12, TILE - 12, TILE - 16);
      ctx.fillStyle = '#8b8aa3';
      for (let i = 0; i < 3; i++) ctx.fillRect(sx + 6 + i * 10, sy + 6, 7, 8);
      ctx.fillStyle = '#2a2833';
      ctx.fillRect(sx + TILE / 2 - 4, sy + TILE - 14, 8, 10);
      break;
    case 'gate':
      ctx.fillStyle = '#6b5433';
      ctx.fillRect(sx + 4, sy + 8, TILE - 8, TILE - 10);
      ctx.fillStyle = '#3a2c18';
      ctx.beginPath();
      ctx.moveTo(sx + 10, sy + TILE - 2);
      ctx.lineTo(sx + 10, sy + 20);
      ctx.quadraticCurveTo(sx + TILE / 2, sy + 8, sx + TILE - 10, sy + 20);
      ctx.lineTo(sx + TILE - 10, sy + TILE - 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#c8a24a';
      ctx.fillRect(sx + TILE / 2 - 1, sy + 20, 2, TILE - 22);
      break;
  }
  ctx.restore();

  ctx.strokeStyle = 'rgba(0,0,0,0.09)';
  ctx.lineWidth = 1;
  ctx.strokeRect(sx + 0.5, sy + 0.5, TILE - 1, TILE - 1);
}

function fillTile(ctx: CanvasRenderingContext2D, k: number, color: string) {
  const x = k % 256;
  const y = Math.floor(k / 256);
  ctx.fillStyle = color;
  ctx.fillRect(OX + x * TILE, OY + y * TILE, TILE, TILE);
}

function drawRanges(ctx: CanvasRenderingContext2D, g: Game) {
  if (g.showDanger && g.mode !== 'move') {
    ctx.save();
    for (const k of g.dangerTiles) fillTile(ctx, k, 'rgba(220,60,60,0.22)');
    ctx.restore();
  }
  if (g.mode === 'move' || g.mode === 'menu') {
    for (const k of g.atkTiles) fillTile(ctx, k, 'rgba(220,60,60,0.28)');
    for (const k of g.moveTiles) fillTile(ctx, k, 'rgba(70,130,255,0.32)');
    ctx.strokeStyle = 'rgba(150,200,255,0.35)';
    ctx.lineWidth = 1;
    for (const k of g.moveTiles) {
      const x = k % 256;
      const y = Math.floor(k / 256);
      ctx.strokeRect(OX + x * TILE + 0.5, OY + y * TILE + 0.5, TILE - 1, TILE - 1);
    }
  }
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

function drawUnits(ctx: CanvasRenderingContext2D, g: Game, time: number) {
  const sorted = g.units.filter((u) => !u.dead).sort((a, b) => a.py - b.py);
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
  feText(ctx, value, x + 66, y, { size: 14, bold: true, align: 'right', mono: true });
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
  feText(ctx, `${u.hp}/${maxHp(u)}`, x + 78, y + 63, { size: 13, bold: true, align: 'right', mono: true });
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

function drawTerrainPanel(ctx: CanvasRenderingContext2D, g: Game) {
  const t = terrainAt(MAP, g.cursor.x, g.cursor.y);
  const w = 150;
  const h = 70;
  const x = OX + MAP_PX_W - w - 8;
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

function drawMenu(ctx: CanvasRenderingContext2D, g: Game, time: number) {
  const m = g.menu;
  if (!m) return;
  const rowH = 34;
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
    if (it.sub) feText(ctx, it.sub, x + m.w - 12, ty, { size: 13, align: 'right', mono: true, color: GOLD });
  });
}

function drawForecast(ctx: CanvasRenderingContext2D, g: Game) {
  const fc = g.currentForecast();
  if (!fc) return;
  const w = 268;
  const h = 232;
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
  feText(ctx, 'VS', cx, y + 25, { size: 11, align: 'center', color: GOLD });

  const rows: [string, string, string][] = [
    ['HP', `${a.unit.hp}`, `${d.unit.hp}`],
    ['威力', a.canAttack ? `${a.damage}${a.doubles ? ' x2' : ''}` : '--', d.canAttack ? `${d.damage}${d.doubles ? ' x2' : ''}` : '--'],
    ['命中', a.canAttack ? `${a.hitRate}` : '--', d.canAttack ? `${d.hitRate}` : '--'],
    ['必殺', a.canAttack ? `${a.critRate}` : '--', d.canAttack ? `${d.critRate}` : '--'],
  ];

  rows.forEach((r, i) => {
    const yy = y + 58 + i * 26;
    feText(ctx, r[0], cx, yy, { size: 12, align: 'center', color: GOLD });
    feText(ctx, r[1], lx, yy, { size: 18, bold: true, mono: true });
    feText(ctx, r[2], rx, yy, { size: 18, bold: true, mono: true, align: 'right' });
  });

  // 武器と相性
  feText(ctx, a.weapon?.name ?? '-', lx, y + 178, { size: 11, color: '#dbe6ff' });
  feText(ctx, d.weapon?.name ?? '-', rx, y + 178, { size: 11, align: 'right', color: '#dbe6ff' });

  if (a.tri !== 0) feText(ctx, a.tri > 0 ? '▲有利' : '▼不利', lx, y + 194, { size: 11, color: a.tri > 0 ? '#8dffab' : '#ff9a9a' });
  if (d.tri !== 0)
    feText(ctx, d.tri > 0 ? '▲有利' : '▼不利', rx, y + 194, { size: 11, align: 'right', color: d.tri > 0 ? '#8dffab' : '#ff9a9a' });

  // 特効・支援
  if (a.effective) feText(ctx, '特効!', lx, y + 213, { size: 13, bold: true, color: '#ffb14a' });
  if (d.effective) feText(ctx, '特効!', rx, y + 213, { size: 13, bold: true, align: 'right', color: '#ffb14a' });
  const sup = a.support;
  if (sup.hit || sup.atk || sup.avo || sup.crit) {
    feText(ctx, `支援 攻+${sup.atk} 命中+${sup.hit} 必殺+${sup.crit}`, cx, y + 213, { size: 11, align: 'center', color: '#9dffb8' });
  }
}

function drawTopBar(ctx: CanvasRenderingContext2D, g: Game) {
  ctx.fillStyle = 'rgba(10,14,26,0.9)';
  ctx.fillRect(0, 0, CANVAS_W, OY);
  ctx.strokeStyle = '#2a3350';
  ctx.beginPath();
  ctx.moveTo(0, OY - 0.5);
  ctx.lineTo(CANVAS_W, OY - 0.5);
  ctx.stroke();

  feText(ctx, g.phase === 'player' ? '自軍フェイズ' : '敵軍フェイズ', 16, 27, {
    size: 17,
    bold: true,
    color: g.phase === 'player' ? '#9fd0ff' : '#ffa8a8',
  });
  feText(ctx, `ターン ${g.turn}`, 148, 27, { size: 14, color: GOLD });
  feText(ctx, `自軍 ${g.alive('player').length}  /  敵 ${g.alive('enemy').length}`, 244, 27, { size: 13 });
  if (g.showDanger) feText(ctx, '[T] 敵攻撃範囲 ON', 392, 27, { size: 13, color: '#ff9a9a' });
  const lord = g.units.find((u) => u.isLord);
  feText(ctx, `目標: ${g.objective.label}  /  敗北: ${lord?.name ?? 'ロード'}死亡`, CANVAS_W - 16, 27, {
    size: 12,
    align: 'right',
    color: '#b9c6e6',
  });
}

function drawMessages(ctx: CanvasRenderingContext2D, g: Game) {
  ctx.textAlign = 'left';
  ctx.font = '13px "Yu Gothic UI", sans-serif';
  g.messages.forEach((m, i) => {
    const alpha = Math.max(0, Math.min(1, 4 - m.t));
    ctx.fillStyle = `rgba(220,232,255,${alpha})`;
    ctx.fillText(m.text, 16, CANVAS_H - 16 - (g.messages.length - 1 - i) * 18);
  });
}

/** FE のマップメニューにある「状況」。何を達成すれば終わるかを画面から読めるようにする */
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
  feText(ctx, 'X / 右クリックで戻る', CANVAS_W / 2, CANVAS_H - 70, { size: 14, align: 'center', color: '#8b9ac0' });
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
  ctx.font = 'bold 40px "Yu Gothic UI", sans-serif';
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
  ctx.font = 'bold 56px "Yu Gothic UI", sans-serif';
  ctx.fillStyle = g.result === 'win' ? '#ffd24a' : '#ff7070';
  ctx.fillText(g.result === 'win' ? '勝　利' : '敗　北', CANVAS_W / 2, CANVAS_H / 2 - 10);
  ctx.font = '16px "Yu Gothic UI", sans-serif';
  ctx.fillStyle = '#c3cee6';
  ctx.fillText(`${g.turn} ターンで決着`, CANVAS_W / 2, CANVAS_H / 2 + 30);
  ctx.fillStyle = '#8b9ac0';
  ctx.fillText('R キーでリスタート', CANVAS_W / 2, CANVAS_H / 2 + 64);
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
  visitedVillages = g.visited;
  openedChests = g.opened;
  const follow = g.walk?.unit ?? g.cursor;
  focusOn(follow.x, follow.y, dt);

  // 盤面はカメラの中。窓で切り抜いてから寄せるので、スクロールしても HUD の下に
  // はみ出さない。HUD はこの外で描くため画面座標のまま。
  ctx.save();
  ctx.beginPath();
  ctx.rect(OX, OY, VIEW_W, VIEW_H);
  ctx.clip();
  ctx.translate(-Math.round(camera.x), -Math.round(camera.y));

  // 見えているタイルだけ描く。34x24 まで広がるので全面走査は無駄になる。
  const x0 = Math.max(0, Math.floor(camera.x / TILE));
  const y0 = Math.max(0, Math.floor(camera.y / TILE));
  const x1 = Math.min(MAP_W - 1, Math.floor((camera.x + VIEW_W) / TILE));
  const y1 = Math.min(MAP_H - 1, Math.floor((camera.y + VIEW_H) / TILE));
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) drawTile(ctx, x, y);

  drawRanges(ctx, g);
  drawPath(ctx, g);
  drawUnits(ctx, g, time);
  if (!g.result && !g.dialogue) drawCursor(ctx, g, time);
  ctx.restore();

  // 会話パート中はマップ UI を隠す
  if (g.dialogue) {
    g.dialogue.draw(ctx);
    return;
  }

  // 対象選択中は戦闘予測と反対側にユニット情報を出す
  const inTarget = g.mode === 'target';
  const forecastOnLeft = g.cursor.x >= MAP_W / 2;
  const hovered = inTarget ? g.targets[g.targetIndex] : g.unitAtCursor();
  // FE と同じで、パネルはカーソルに被らない側へ寄る
  const away: 'left' | 'right' = g.cursor.x < MAP_W / 2 ? 'right' : 'left';
  if (hovered) drawUnitPanel(ctx, g, hovered, inTarget ? (forecastOnLeft ? 'right' : 'left') : away);
  if (!inTarget) drawTerrainPanel(ctx, g);
  drawMenu(ctx, g, time);
  drawForecast(ctx, g);
  drawTopBar(ctx, g);
  drawMessages(ctx, g);
  drawStatus(ctx, g);
  drawBanner(ctx, g);
  drawResult(ctx, g);
}
