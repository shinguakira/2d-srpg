import { CHAPTERS, chapterDef, loadChapter, MAP_H, MAP_W, SKIRMISH_INDEX, type ChapterDef } from '../data/chapters';
import { build, ROSTER } from '../data/roster';
import { classOf, MOVE_INDEX } from '../data/classes';
import { terrainAt } from '../data/terrain';
import { cameo } from '../story/cameo';
import { DEFEAT } from '../story/chapters/common';
import type { Pos, Unit } from '../types';
import { SUPPORT_PAIRS, supportScript } from '../story/supports';
import { deathScript } from '../story/script';
import type { Script } from '../story/dialogue';
import { CANVAS_H, CANVAS_W, OX, OY, TILE, VIEW_H, VIEW_W } from './layout';
import { groundCanvas } from './ground';
import { plainText as text } from './text';

/**
 * **開発用の閲覧画面。** ゲームを進めずに、書いた台本を全部読み、組んだ盤を全部
 * 見るためのもの。`?dev=story` と `?dev=maps` でだけ出る。
 *
 * 台本は章に散らばっていて（`story/chapters/`）、支援は別（`story/supports.ts`）、
 * 死に際はまた別（`story/script.ts`）。書いたものを通しで読み返す手段が無いと、
 * 声の揺れも重複も落ちも見つからない。盤のほうも同じで、章を実際に遊ばずに
 * 二十四マス幅の全体を見られる場所がどこにも無かった。
 */

const RANK = ['C', 'B', 'A'];

export interface StoryEntry {
  /** 一覧に出す見出し */
  label: string;
  /** 章の見出しなど、選べない行は script を持たない */
  script?: Script;
  /** 章の区切り行 */
  header?: boolean;
}

/** 書いてある台本を全部、読む順に並べる */
export function storyEntries(): StoryEntry[] {
  const out: StoryEntry[] = [];

  for (const [i, def] of CHAPTERS.entries()) {
    out.push({ label: def.title, header: true });
    const s = def.scripts ?? {};
    // 一つの台本が二か所から指されていることがある（加入の事件が説得台本を鳴らす等）。
    // 同じものを二度読まされると、書き直したときにどちらを直したのか分からなくなる
    const seen = new Set<Script>();
    const add = (label: string, script: Script) => {
      if (seen.has(script)) return;
      seen.add(script);
      out.push({ label, script });
    };
    if (s.opening) add('  前口上', s.opening);
    if (s.bossTalk) add('  ボス会話', s.bossTalk);
    for (const [id, script] of Object.entries(s.recruit ?? {})) add(`  説得 — ${nameOf(id)}`, script);
    // 章のターン事件。会話を持つものだけ
    for (const e of def.events ?? []) if (e.script) add(`  ${e.turn} ターン目`, e.script);
    if (s.ending) add('  幕切れ', s.ending);
    if (s.defeat) add('  敗北', s.defeat);
    if (i === CHAPTERS.length - 1) add('  （共通）敗北', DEFEAT);
  }

  out.push({ label: '支援会話', header: true });
  for (const [a, b] of SUPPORT_PAIRS) {
    for (const [r, label] of RANK.entries()) {
      const script = supportScript(a, b, r + 1);
      if (script) out.push({ label: `  ${nameOf(a)} × ${nameOf(b)}  ${label}`, script });
    }
  }

  out.push({ label: '死に際', header: true });
  for (const s of ROSTER) {
    const script = deathScript(s.id, s.name);
    if (script) out.push({ label: `  ${s.name}`, script });
  }
  for (const def of CHAPTERS) {
    for (const e of def.enemies) {
      const script = e.isBoss ? deathScript(e.id, e.name) : undefined;
      if (script) out.push({ label: `  ${e.name}`, script });
    }
  }
  return out;
}

/**
 * 台本の話者 id からユニットを引く。**再生に立ち絵を出すためだけのもの。**
 *
 * 実戦の `Game.speaker` は盤の上を先に見るが、ここには盤が無い。名簿 → 章の
 * 敵味方 → 幕間だけの者、の順に探して、見つかった種から張りぼてを立てる。
 * 引けないと `drawFacePortrait` が呼ばれず、暗転だけの再生になってしまう。
 */
const cast = new Map<string, Unit | undefined>();

export function devSpeaker(id: string): Unit | undefined {
  if (cast.has(id)) return cast.get(id);
  let u: Unit | undefined;
  const mine = ROSTER.find((s) => s.id === id);
  if (mine) u = build(mine, 'player');
  else {
    for (const def of CHAPTERS) {
      const ally = def.allies?.find((a) => a.id === id);
      if (ally) {
        u = build(ally, 'player');
        break;
      }
      const foe = def.enemies.find((e) => e.id === id);
      if (foe) {
        u = build(foe, 'enemy');
        break;
      }
    }
  }
  u ??= cameo(id);
  cast.set(id, u);
  return u;
}

function nameOf(id: string): string {
  const seed = ROSTER.find((s) => s.id === id);
  if (seed) return seed.name;
  for (const def of CHAPTERS) {
    const e = def.enemies.find((x) => x.id === id) ?? def.allies?.find((x) => x.id === id);
    if (e) return e.name;
  }
  return id;
}

const at = (p: Pos) => `(${p.x},${p.y})`;

/**
 * 盤の粗探し。**遊んで気づくものを、遊ばずに出す。**
 *
 * 岩壁の上に湧きを置いても `Game.freeNear` が近くの床へ逃がすので、遊んでいる
 * 限り気づけない。置いたつもりの場所と出てくる場所が違う、というのはそれ自体が
 * 事故なので、ここで名指しする。村と宝も同じで、地形が `V` `C` でないところに
 * 座標だけ書いても、訪ねる相手がいない。
 */
function problems(def: ChapterDef): string[] {
  const out: string[] = [];
  // 通れるかはクラスで違う。峰の上のガーゴイルは正しく、峰の上の狩人は事故
  const solid = (p: Pos, classId = '') => {
    const i = classId ? MOVE_INDEX[classOf(classId).moveType] : 0;
    return terrainAt(def.map, p.x, p.y).cost[i] >= 99;
  };
  const oob = (p: Pos) => p.x < 0 || p.y < 0 || p.x >= def.map[0].length || p.y >= def.map.length;

  const blocked = (label: string, list: readonly (Pos & { classId?: string })[]) => {
    // 増援は同じ口から何波も出る。同じ座標を並べても数が増えるだけで読めない
    const bad = [...new Set(list.filter((p) => oob(p) || solid(p, p.classId)).map(at))];
    if (bad.length) out.push(`${label}が通れない地形の上 ${bad.join(' ')}`);
  };
  blocked('出撃', def.starts);
  blocked('敵', def.enemies);
  blocked('味方NPC', def.allies ?? []);
  blocked(
    '増援',
    (def.reinforcements ?? []).map((r) => ({ x: r.at.x, y: r.at.y, classId: r.seed.classId })),
  );

  for (const v of def.villages) if (terrainAt(def.map, v.x, v.y).id !== 'village') out.push(`村 ${at(v)} の地形が村でない`);
  for (const c of def.chests) if (terrainAt(def.map, c.x, c.y).id !== 'chest') out.push(`宝 ${at(c)} の地形が宝箱でない`);

  if (def.starts.length < def.deploy) out.push(`出撃枠 ${def.deploy} に対し立ち位置が ${def.starts.length} しかない`);

  const seen = new Map<string, string>();
  const once = (label: string, list: readonly Pos[]) => {
    for (const p of list) {
      const k = `${p.x},${p.y}`;
      const prev = seen.get(k);
      if (prev) out.push(`${at(p)} に ${prev} と ${label} が重なる`);
      else seen.set(k, label);
    }
  };
  once('敵', def.enemies);
  once('味方NPC', def.allies ?? []);
  once('出撃', def.starts);

  const o = def.objective;
  if (o.kind === 'seize' && (o.x === undefined || o.y === undefined)) out.push('制圧が目標なのに玉座の座標が無い');
  if (o.kind === 'seize' && o.x !== undefined && o.y !== undefined && terrainAt(def.map, o.x, o.y).id !== 'throne') {
    out.push(`制圧目標 ${at({ x: o.x, y: o.y })} の地形が玉座でない`);
  }
  if (o.kind === 'boss' && !def.enemies.some((e) => e.isBoss)) out.push('ボス撃破が目標なのにボスがいない');
  if ((o.kind === 'escape' || o.kind === 'breach') && (o.x === undefined || o.y === undefined)) {
    out.push(`${o.kind === 'escape' ? '脱出口' : '門'}の座標が無い`);
  }
  if ((o.kind === 'escape' || o.kind === 'breach') && o.x !== undefined && o.y !== undefined) {
    const p = { x: o.x, y: o.y };
    if (oob(p) || solid(p)) out.push(`${o.kind === 'escape' ? '脱出口' : '門'} ${at(p)} が通れない地形`);
  }
  if (o.kind === 'survive' && !o.turns) out.push('耐える章なのにターン数が無い');
  for (const id of o.guard ?? []) {
    const here = def.allies?.some((a) => a.id === id) || def.events?.some((e) => e.spawn?.some((s) => s.seed.id === id));
    if (!here) out.push(`守れと言われている ${id} が盤に出てこない`);
  }
  for (const id of def.forced ?? []) if (!ROSTER.some((s) => s.id === id)) out.push(`強制出撃の ${id} が名簿にいない`);
  return out;
}

/**
 * 全部の盤の粗を一枚に。**一つずつ捲って確かめるのは、結局やらない。**
 * 盤の閲覧から Z で出す。
 */
export function drawBoardAudit(ctx: CanvasRenderingContext2D) {
  backdrop(ctx);
  text(ctx, '盤の点検', 28, 36, { size: 18, color: '#ffd24a' });
  text(ctx, 'Z / X で盤の閲覧へ戻る', CANVAS_W - 28, 36, { size: 13, color: '#7f8aa5', align: 'right' });

  // 二十七枚あるので二段組み。溢れて切れると「点検した」ことにならない
  const rows: { title: string; bad: string[] }[] = [];
  let total = 0;
  for (let i = 0; i <= SKIRMISH_INDEX; i++) {
    const def = chapterDef(i);
    const bad = problems(def);
    total += bad.length;
    rows.push({ title: def.title, bad });
  }
  const lines = rows.reduce((n, r) => n + 1 + r.bad.length, 0);
  const half = Math.ceil(lines / 2);

  let y = 76;
  let x = 24;
  let drawn = 0;
  for (const r of rows) {
    if (x === 24 && drawn >= half) {
      x = CANVAS_W / 2 + 8;
      y = 76;
    }
    text(ctx, r.title, x, y, { size: 13, color: r.bad.length ? '#ff9a9a' : '#c3cee6' });
    if (!r.bad.length) text(ctx, '異常なし', x + 250, y, { size: 12, color: '#6f7d96' });
    y += 20;
    drawn += 1;
    for (const line of r.bad) {
      text(ctx, `⚠ ${line}`, x + 16, y, { size: 12, color: '#ffc0c0' });
      y += 18;
      drawn += 1;
    }
  }
  text(ctx, total ? `${total} 件` : '全部の盤で異常なし', 28, CANVAS_H - 20, {
    size: 14,
    color: total ? '#ff9a9a' : '#7fe6a0',
  });
}

function backdrop(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#0b0e18';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

const ROWS = 22;
const ROW_H = 24;

/** 台本の一覧。左に見出し、右に選んでいるものの中身 */
export function drawStoryList(ctx: CanvasRenderingContext2D, list: StoryEntry[], index: number) {
  backdrop(ctx);
  text(ctx, '台本一覧', 28, 36, { size: 18, color: '#ffd24a' });
  text(ctx, '↑↓ 選ぶ ・ Z 再生 ・ ←→ 10 行送り ・ X 盤の一覧へ', 28, 60, { size: 13, color: '#7f8aa5' });

  const top = Math.max(0, Math.min(index - Math.floor(ROWS / 2), list.length - ROWS));
  for (let i = 0; i < ROWS && top + i < list.length; i++) {
    const e = list[top + i];
    const y = 96 + i * ROW_H;
    const on = top + i === index;
    if (on) {
      ctx.fillStyle = 'rgba(120,160,240,0.18)';
      ctx.fillRect(24, y - 17, 452, ROW_H);
      text(ctx, '▶', 8, y, { size: 14, color: '#ffd24a' });
    }
    text(ctx, e.label, 32, y, {
      size: e.header ? 15 : 14,
      color: e.header ? '#ffd24a' : on ? '#ffffff' : '#c3cee6',
    });
  }
  text(ctx, `${index + 1} / ${list.length}`, 28, CANVAS_H - 24, { size: 13, color: '#7f8aa5' });

  // 右: 選んでいる台本の本文
  const sel = list[index];
  ctx.fillStyle = 'rgba(20,26,42,0.9)';
  ctx.fillRect(496, 80, 440, CANVAS_H - 120);
  ctx.strokeStyle = '#2b3550';
  ctx.strokeRect(496, 80, 440, CANVAS_H - 120);
  if (!sel?.script) {
    text(ctx, '（見出し）', 516, 112, { size: 14, color: '#7f8aa5' });
    return;
  }
  // 幕間の台本にしか title は無い。無ければ一覧の行をそのまま見出しにする
  text(ctx, sel.script.title ?? sel.label.trim(), 516, 108, { size: 14, color: '#ffd24a' });
  let y = 136;
  for (const line of sel.script.lines) {
    if (y > CANVAS_H - 56) {
      text(ctx, `…… 他 ${sel.script.lines.length}行`, 516, y, { size: 12, color: '#7f8aa5' });
      break;
    }
    const who = line.speaker ? `${line.speaker}: ` : '';
    const body = who + line.text;
    // 幅で折る。ここは読めればよいので素朴に
    for (const chunk of wrap(body, 26)) {
      if (y > CANVAS_H - 56) break;
      text(ctx, chunk, 516, y, { size: 13, color: line.speaker ? '#e8eefc' : '#9fb0cc' });
      y += 19;
    }
    y += 5;
  }
}

function wrap(s: string, n: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < s.length; i += n) out.push(s.slice(i, i + n));
  return out;
}

/**
 * 章の盤を丸ごと一枚に収めて見せる。**遊ばずに全体を見るための画面。**
 *
 * 実際の焼き付け（`ground.ts`）をそのまま縮めて出す。別に描き直すと、
 * 見えているものが本物と違ってしまって意味が無い。
 */
export function drawMapBrowser(ctx: CanvasRenderingContext2D, chapter: number) {
  backdrop(ctx);
  const def = chapterDef(chapter);
  loadChapter(chapter);

  const scale = Math.min(VIEW_W / (MAP_W * TILE), VIEW_H / (MAP_H * TILE));
  const w = MAP_W * TILE * scale;
  const h = MAP_H * TILE * scale;
  const x0 = OX + (VIEW_W - w) / 2;
  const y0 = OY + (VIEW_H - h) / 2;

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(groundCanvas(new Set(), new Set()), x0, y0, w, h);
  ctx.restore();

  const t = TILE * scale;
  const dot = (tx: number, ty: number, color: string, r = 0.3) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x0 + (tx + 0.5) * t, y0 + (ty + 0.5) * t, t * r, 0, Math.PI * 2);
    ctx.fill();
  };

  // 増援は輪だけ。塗りにすると石床でも砂でも地面に溶けて、数えられない
  const ring = (tx: number, ty: number, color: string, r = 0.3) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x0 + (tx + 0.5) * t, y0 + (ty + 0.5) * t, t * r, 0, Math.PI * 2);
    ctx.stroke();
  };

  for (const p of def.starts) dot(p.x, p.y, 'rgba(120,190,255,0.9)', 0.22);
  for (const r of def.reinforcements ?? []) ring(r.at.x, r.at.y, '#ff7a7a', 0.3);
  for (const a of def.allies ?? []) dot(a.x, a.y, '#7fe6a0', 0.3);
  for (const e of def.enemies) dot(e.x, e.y, e.isBoss ? '#ffd24a' : '#ff7a7a', e.isBoss ? 0.42 : 0.28);
  for (const v of def.villages) dot(v.x, v.y, '#9ae0ff', 0.24);
  for (const c of def.chests) dot(c.x, c.y, '#e0c34a', 0.24);
  if (def.objective.x !== undefined && def.objective.y !== undefined) {
    ctx.strokeStyle = '#ffd24a';
    ctx.lineWidth = 2;
    ctx.strokeRect(x0 + def.objective.x * t, y0 + def.objective.y * t, t, t);
  }

  // 見出しと内訳
  text(ctx, `${def.title}   ${chapter + 1} / ${SKIRMISH_INDEX + 1}`, 28, 32, { size: 18, color: '#ffd24a' });
  text(ctx, '←→ 盤を切り替え ・ Z 全部の点検 ・ X 台本一覧へ', CANVAS_W - 28, 32, { size: 13, color: '#7f8aa5', align: 'right' });

  const boss = def.enemies.find((e) => e.isBoss);
  const facts = [
    `${MAP_W}×${MAP_H}`,
    `出撃 ${def.deploy}`,
    `敵 ${def.enemies.length}`,
    `増援 ${def.reinforcements?.length ?? 0}`,
    `村 ${def.villages.length}`,
    `宝 ${def.chests.length}`,
    def.shop.length ? `店 ${def.shop.length}` : '',
    def.events?.length ? `事件 ${def.events.length}` : '',
    def.forced?.length ? `強制 ${def.forced.map(nameOf).join('・')}` : '',
  ].filter(Boolean);
  // 盤が窓いっぱいに広がる章があるので、下の二行には敷きを入れる
  ctx.fillStyle = 'rgba(11,14,24,0.82)';
  ctx.fillRect(0, CANVAS_H - 56, CANVAS_W, 56);
  text(ctx, facts.join('   '), 28, CANVAS_H - 40, { size: 13, color: '#c3cee6' });

  text(ctx, `${def.objective.label}${boss ? `   ボス: ${boss.name}` : ''}`, 28, CANVAS_H - 18, {
    size: 13,
    color: '#9fb0cc',
  });

  // 粗は盤の上に重ねる。下の行に混ぜると見出しに紛れて読み飛ばされる
  const bad = problems(def);
  if (bad.length) {
    const bh = 8 + bad.length * 18;
    ctx.fillStyle = 'rgba(40,10,14,0.88)';
    ctx.fillRect(x0, y0 + h - bh, w, bh);
    ctx.strokeStyle = '#ff9a9a';
    ctx.lineWidth = 1;
    ctx.strokeRect(x0 + 0.5, y0 + h - bh + 0.5, w - 1, bh - 1);
    for (const [i, line] of bad.entries()) {
      text(ctx, `⚠ ${line}`, x0 + 10, y0 + h - bh + 20 + i * 18, { size: 13, color: '#ffc0c0' });
    }
  }

  // 凡例。増援だけ輪で描くのは盤の上と揃えるため
  const key: [string, string, boolean?][] = [
    ['出撃', 'rgba(120,190,255,0.9)'],
    ['敵', '#ff7a7a'],
    ['ボス', '#ffd24a'],
    ['増援', '#ff7a7a', true],
    ['村', '#9ae0ff'],
    ['宝', '#e0c34a'],
    ['味方NPC', '#7fe6a0'],
  ];
  let kx = CANVAS_W - 28;
  for (const [label, color, hollow] of [...key].reverse()) {
    text(ctx, label, kx, CANVAS_H - 18, { size: 12, color: '#9fb0cc', align: 'right' });
    ctx.beginPath();
    ctx.arc(kx - label.length * 12 - 10, CANVAS_H - 23, 5, 0, Math.PI * 2);
    if (hollow) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      ctx.fillStyle = color;
      ctx.fill();
    }
    kx -= label.length * 12 + 30;
  }
}
