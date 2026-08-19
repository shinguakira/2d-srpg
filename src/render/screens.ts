import { classOf } from '../data/classes';
import { CHAPTERS } from '../data/chapters';
import type { Campaign } from '../game/campaign';
import { CANVAS_H, CANVAS_W } from './layout';
import { drawFacePortrait, drawUnitSprite } from './sprites';
import { maxHp } from '../battle/combat';

/** 章の外側の画面。タイトル・ワールドマップ・準備・ガイド */
export type Screen = 'title' | 'worldmap' | 'prep' | 'guide';

function text(
  ctx: CanvasRenderingContext2D,
  s: string,
  x: number,
  y: number,
  o: { size?: number; color?: string; align?: CanvasTextAlign; bold?: boolean } = {},
) {
  ctx.save();
  ctx.font = `${o.bold ? 'bold ' : ''}${o.size ?? 16}px "Yu Gothic UI", sans-serif`;
  ctx.fillStyle = o.color ?? '#e8eefc';
  ctx.textAlign = o.align ?? 'left';
  ctx.fillText(s, x, y);
  ctx.restore();
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

export function drawTitle(ctx: CanvasRenderingContext2D, index: number, hasSave: boolean, time: number) {
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

  text(ctx, '聖なる炎', CANVAS_W / 2, 210, { size: 64, align: 'center', color: '#f0e6c8', bold: true });
  text(ctx, 'アマギの戦記', CANVAS_W / 2, 258, { size: 20, align: 'center', color: '#8fa6d8' });

  const items = ['はじめから', hasSave ? 'つづきから' : 'つづきから（記録なし）', 'ガイド'];
  let y = 380;
  for (const [i, label] of items.entries()) {
    const on = i === index;
    const dim = i === 1 && !hasSave;
    cursorRow(ctx, CANVAS_W / 2 - 110, y, 260, on);
    text(ctx, label, CANVAS_W / 2, y, {
      size: 22,
      align: 'center',
      color: dim ? '#5d6a8c' : on ? '#ffffff' : '#b9c6e6',
    });
    y += 54;
  }
  text(ctx, '↑↓ 選ぶ  /  Z 決定', CANVAS_W / 2, CANVAS_H - 60, { size: 14, align: 'center', color: '#7d8cb0' });
}

// -------------------------------------------------------------- ワールドマップ

/** 章の位置。アマギを縦に見立てて、南から北へ進む */
const NODES = [
  { x: 300, y: 430, name: 'クレハ' },
  { x: 380, y: 320, name: 'サーズ' },
  { x: 300, y: 210, name: 'シェナ' },
];

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
  for (const [i, n] of NODES.entries()) {
    if (i) ctx.lineTo(n.x, n.y);
    else ctx.moveTo(n.x, n.y);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  for (const [i, n] of NODES.entries()) {
    const open = i <= c.cleared;
    const on = i === index;
    ctx.fillStyle = open ? (on ? '#ffd24a' : '#8fc0ff') : '#3d4864';
    ctx.beginPath();
    ctx.arc(n.x, n.y, on ? 11 : 8, 0, Math.PI * 2);
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

  // 右側に選んでいる章の札
  const d = CHAPTERS[index];
  const x = 560;
  ctx.fillStyle = 'rgba(12,18,34,0.85)';
  ctx.fillRect(x, 150, 340, 300);
  ctx.strokeStyle = '#c9a25a';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, 150, 340, 300);
  text(ctx, d.title, x + 20, 194, { size: 20, color: '#f0e6c8' });
  text(ctx, `目標  ${d.objective.label}`, x + 20, 240, { size: 16, color: '#b9c6e6' });
  text(ctx, `敵    ${d.enemies.length} 体`, x + 20, 272, { size: 16, color: '#b9c6e6' });
  text(ctx, `出撃  ${d.deploy} 人`, x + 20, 304, { size: 16, color: '#b9c6e6' });
  text(ctx, `所持金 ${c.gold} G`, x + 20, 336, { size: 16, color: '#b9c6e6' });
  if (index > c.cleared) text(ctx, 'まだ行けない', x + 20, 400, { size: 16, color: '#d0708a' });

  text(ctx, '↑↓ 章を選ぶ  /  Z 準備へ  /  S セーブ  /  X タイトル', CANVAS_W / 2, CANVAS_H - 50, {
    size: 14,
    align: 'center',
    color: '#7d8cb0',
  });
}

// ------------------------------------------------------------------ 準備画面

export function drawPrep(ctx: CanvasRenderingContext2D, c: Campaign, index: number) {
  backdrop(ctx);
  const d = c.def;
  text(ctx, '出撃準備', 60, 80, { size: 30, color: '#f0e6c8' });
  text(ctx, d.title, 60, 112, { size: 16, color: '#8fa6d8' });
  text(ctx, `${c.deployed.length} / ${d.deploy}`, CANVAS_W - 60, 80, {
    size: 26,
    align: 'right',
    color: c.deployed.length > d.deploy ? '#d0708a' : '#ffd24a',
  });
  text(ctx, `所持金 ${c.gold} G`, CANVAS_W - 60, 110, { size: 15, align: 'right', color: '#b9c6e6' });

  let y = 172;
  for (const [i, u] of c.roster.entries()) {
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
    y += 42;
  }

  const sel = c.roster[index];
  if (sel) {
    drawFacePortrait(ctx, sel, 760, CANVAS_H - 90, 300, -1);
  }

  text(ctx, '↑↓ 選ぶ  /  Z 出撃を切替  /  Enter 開始  /  X 戻る', CANVAS_W / 2, CANVAS_H - 34, {
    size: 14,
    align: 'center',
    color: '#7d8cb0',
  });
}

// -------------------------------------------------------------------- ガイド

const GUIDE: [string, string][] = [
  ['操作', 'カーソルは矢印か WASD、決定は Z か Enter、取り消しは X か右クリック。'],
  ['ユニット詳細', 'R でカーソルの下のユニットの詳細。左右でページ（能力 / 装備 / 支援）。'],
  ['マップメニュー', '誰もいないマスで決定するとメニュー。状況・オプション・ターン終了。'],
  ['三すくみ', '剣は斧に強く、斧は槍に強く、槍は剣に強い。威力 ±1 と命中 ±15。'],
  ['命中は 2 回振る', '表示された命中は乱数 2 個の平均と比べる。高い数字ほど当たりやすい。'],
  ['追撃', '攻速の差が 4 以上あるともう一度攻撃する。攻速は速さから重さ超過分を引いたもの。'],
  ['地形', '林と山は回避が上がり、砦と門と玉座は毎ターン回復する。飛行は砦・門・玉座しか効かない。'],
  ['支援', '隣り合って自軍フェイズを迎えると友好度が上がる。会話するとランクが決まる。'],
  ['村と宝箱', '村は一度だけ訪問できる。宝箱と扉には鍵が要る。'],
];

export function drawGuide(ctx: CanvasRenderingContext2D, index: number) {
  backdrop(ctx);
  text(ctx, 'ガイド', 80, 90, { size: 30, color: '#f0e6c8' });
  let y = 150;
  for (const [i, [k, v]] of GUIDE.entries()) {
    const on = i === index;
    if (on) {
      ctx.fillStyle = 'rgba(120,160,240,0.14)';
      ctx.fillRect(64, y - 24, CANVAS_W - 128, 46);
    }
    text(ctx, k, 88, y, { size: 17, color: on ? '#ffd24a' : '#9fb0d8' });
    text(ctx, v, 260, y, { size: 15, color: on ? '#ffffff' : '#a8b6d4' });
    y += 50;
  }
  text(ctx, 'X で戻る', CANVAS_W / 2, CANVAS_H - 50, { size: 14, align: 'center', color: '#7d8cb0' });
}

export const GUIDE_COUNT = GUIDE.length;
