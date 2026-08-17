import { classOf } from '../data/classes';
import { battleWeapon, equippedWeapon } from '../battle/combat';
import type { Unit, WeaponType } from '../types';
import shigeruSheetUrl from '../assets/sprites/shigeru-sheet.png';

const SKIN = '#f0c9a0';
const HAIR: Record<string, string> = {
  lord: '#7fd0d8',
  cavalier: '#e2d16a',
  fighter: '#b34a2a',
  archer: '#e0a04a',
  mage: '#5f4a9c',
  cleric: '#e8b8c8',
  pegasus: '#7ec8e0',
  monk: '#e8d8a0',
  masterLord: '#7fd0d8',
  paladin: '#e2d16a',
  greatKnight: '#c8ccd8',
  warrior: '#b34a2a',
  berserker: '#d85a3a',
  sniper: '#e0a04a',
  ranger: '#c8b060',
  sage: '#5f4a9c',
  mageKnight: '#7a68c0',
  bishop: '#e8d8a0',
  valkyrie: '#e8b8c8',
  falcoknight: '#7ec8e0',
  wyvernKnight: '#4a8f7a',

  brigand: '#3a2a22',
  mercenary: '#c8c2b4',
  soldier: '#4a3a52',
  eArcher: '#6a4a30',
  shaman: '#2c2036',
  knight: '#3a3f5a',
  general: '#2a1c26',

  revenant: '#7f8f72',
  bael: '#3a2418',
  mogall: '#2a1a38',
  gargoyle: '#39424c',
};

function roundedPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawWeaponGlyph(ctx: CanvasRenderingContext2D, type: WeaponType, x: number, y: number, s: number, facing: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.lineCap = 'round';
  const steel = '#dfe6f5';
  const wood = '#8a5a35';

  switch (type) {
    case 'sword':
      ctx.strokeStyle = steel;
      ctx.lineWidth = s * 0.07;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.12);
      ctx.lineTo(s * 0.06, -s * 0.42);
      ctx.stroke();
      ctx.strokeStyle = '#c8a24a';
      ctx.lineWidth = s * 0.05;
      ctx.beginPath();
      ctx.moveTo(-s * 0.07, s * 0.06);
      ctx.lineTo(s * 0.1, s * 0.02);
      ctx.stroke();
      break;
    case 'lance':
      ctx.strokeStyle = wood;
      ctx.lineWidth = s * 0.06;
      ctx.beginPath();
      ctx.moveTo(-s * 0.02, s * 0.3);
      ctx.lineTo(s * 0.08, -s * 0.5);
      ctx.stroke();
      ctx.fillStyle = steel;
      ctx.beginPath();
      ctx.moveTo(s * 0.08, -s * 0.62);
      ctx.lineTo(s * 0.16, -s * 0.4);
      ctx.lineTo(0, -s * 0.4);
      ctx.closePath();
      ctx.fill();
      break;
    case 'axe':
      ctx.strokeStyle = wood;
      ctx.lineWidth = s * 0.07;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.25);
      ctx.lineTo(s * 0.05, -s * 0.45);
      ctx.stroke();
      ctx.fillStyle = steel;
      ctx.beginPath();
      ctx.moveTo(s * 0.05, -s * 0.5);
      ctx.quadraticCurveTo(s * 0.34, -s * 0.36, s * 0.05, -s * 0.16);
      ctx.closePath();
      ctx.fill();
      break;
    case 'bow':
      ctx.strokeStyle = wood;
      ctx.lineWidth = s * 0.06;
      ctx.beginPath();
      ctx.arc(0, -s * 0.16, s * 0.28, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();
      ctx.strokeStyle = '#e8e8e8';
      ctx.lineWidth = s * 0.02;
      ctx.beginPath();
      ctx.moveTo(s * 0.03, -s * 0.4);
      ctx.lineTo(s * 0.03, s * 0.08);
      ctx.stroke();
      break;
    case 'anima':
    case 'light':
    case 'dark': {
      const cover = type === 'anima' ? '#7a3fb0' : type === 'light' ? '#d8c56a' : '#2c2038';
      const page = type === 'dark' ? '#c0a8d8' : '#f2e6ff';
      ctx.fillStyle = cover;
      roundedPath(ctx, -s * 0.02, -s * 0.28, s * 0.22, s * 0.28, s * 0.03);
      ctx.fill();
      ctx.fillStyle = page;
      ctx.fillRect(s * 0.02, -s * 0.24, s * 0.14, s * 0.2);
      break;
    }
    case 'monster':
      ctx.strokeStyle = '#e8e0d0';
      ctx.lineWidth = s * 0.05;
      ctx.lineCap = 'round';
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(s * 0.02, -s * 0.05 + i * s * 0.08);
        ctx.quadraticCurveTo(s * 0.16, -s * 0.1 + i * s * 0.09, s * 0.24, -s * 0.24 + i * s * 0.1);
        ctx.stroke();
      }
      break;
    case 'staff':
      ctx.strokeStyle = '#c9b27a';
      ctx.lineWidth = s * 0.06;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.28);
      ctx.lineTo(s * 0.05, -s * 0.4);
      ctx.stroke();
      ctx.fillStyle = '#8fe6ff';
      ctx.beginPath();
      ctx.arc(s * 0.05, -s * 0.5, s * 0.1, 0, Math.PI * 2);
      ctx.fill();
      break;
  }
  ctx.restore();
}

/** バエル（蜘蛛）とモーグル（眼球）は人型で描かない */
function drawMonsterShape(ctx: CanvasRenderingContext2D, classId: string, cx: number, base: number, s: number, facing: number) {
  if (classId === 'bael') {
    const bodyY = base - s * 0.26;
    ctx.strokeStyle = '#241408';
    ctx.lineWidth = s * 0.045;
    ctx.lineCap = 'round';
    for (const dir of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        const spread = 0.22 + i * 0.13;
        ctx.beginPath();
        ctx.moveTo(cx + dir * s * 0.1, bodyY);
        ctx.quadraticCurveTo(cx + dir * s * spread * 1.9, bodyY - s * 0.2, cx + dir * s * (spread + 0.16), base);
        ctx.stroke();
      }
    }
    ctx.fillStyle = '#4a2c18';
    ctx.beginPath();
    ctx.ellipse(cx, bodyY, s * 0.26, s * 0.19, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5f3a20';
    ctx.beginPath();
    ctx.ellipse(cx + facing * s * 0.22, bodyY - s * 0.06, s * 0.13, s * 0.11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ff5a4a';
    for (const d of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(cx + facing * s * 0.26, bodyY - s * 0.1 + d * s * 0.05, s * 0.025, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }

  // モーグル
  const eyeY = base - s * 0.42;
  const r = s * 0.27;
  ctx.fillStyle = '#3a2450';
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(cx, eyeY);
    ctx.quadraticCurveTo(cx + dir * s * 0.55, eyeY - s * 0.32, cx + dir * s * 0.2, eyeY + s * 0.3);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#f2e8f8';
  ctx.beginPath();
  ctx.arc(cx, eyeY, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8a3fc0';
  ctx.beginPath();
  ctx.arc(cx + facing * r * 0.24, eyeY, r * 0.52, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#160a20';
  ctx.beginPath();
  ctx.arc(cx + facing * r * 0.28, eyeY, r * 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.arc(cx + facing * r * 0.1, eyeY - r * 0.34, r * 0.12, 0, Math.PI * 2);
  ctx.fill();
}

export interface SpriteOpts {
  /** 1 = 右向き, -1 = 左向き */
  facing?: number;
  acted?: boolean;
  bob?: number;
  showWeapon?: boolean;
  /** 足元の影とチームリングを描くか（戦闘画面では自前で描く） */
  ground?: boolean;
}

/**
 * シゲルだけは実際に発注したスプライトを使う。
 *
 * 46 コマ 7 クリップの 1 枚シートで、PixelLab に登録したキャラから生成している
 * ので全コマが同じ絵。ここでは待機の 4 コマだけを回している。
 * 他のユニットはこのファイルがコードで描く（PoC のやり方をそのまま採用）。
 */
const SHEET_UNITS: Record<string, { url: string; frames: [number, number]; fps: number }> = {
  p_shigeru: { url: shigeruSheetUrl, frames: [0, 4], fps: 6 },
};
const SHEET_FRAME = 84;
const sheetImages = new Map<string, HTMLImageElement>();

function sheetImage(url: string): HTMLImageElement | undefined {
  let img = sheetImages.get(url);
  if (!img) {
    img = new Image();
    img.src = url;
    sheetImages.set(url, img);
  }
  return img.complete && img.naturalWidth > 0 ? img : undefined;
}

/** シート持ちのユニットを描く。まだ読み込めていなければ false を返す */
function drawFromSheet(ctx: CanvasRenderingContext2D, u: Unit, cx: number, cy: number, s: number, facing: number): boolean {
  const def = SHEET_UNITS[u.id];
  if (!def) return false;
  const img = sheetImage(def.url);
  if (!img) return false;

  const [from, count] = def.frames;
  const frame = from + (Math.floor(performance.now() / (1000 / def.fps)) % count);
  // 84px の枠に 57px の絵。枠ではなく絵の高さで合わせないと、他のユニットと
  // 背丈が揃わない。
  const scale = (s * 1.35) / SHEET_FRAME;
  const w = SHEET_FRAME * scale;

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.translate(cx, cy);
  if (facing < 0) ctx.scale(-1, 1);
  ctx.drawImage(img, frame * SHEET_FRAME, 0, SHEET_FRAME, SHEET_FRAME, -w / 2, -w * 0.965, w, w);
  ctx.restore();
  return true;
}

/** cx, cy は足元中心。s は全高の目安 */
export function drawUnitSprite(ctx: CanvasRenderingContext2D, u: Unit, cx: number, cy: number, s: number, opts: SpriteOpts = {}) {
  const cls = classOf(u.classId);
  const facing = opts.facing ?? (u.team === 'player' ? 1 : -1);
  const bob = opts.bob ?? 0;

  ctx.save();
  if (opts.acted) ctx.filter = 'grayscale(0.85) brightness(0.7)';

  if (opts.ground !== false) {
    // 影
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(cx, cy, s * 0.3, s * 0.11, 0, 0, Math.PI * 2);
    ctx.fill();

    // チーム識別のフットリング
    ctx.strokeStyle = u.team === 'player' ? 'rgba(110,180,255,0.9)' : 'rgba(255,110,110,0.9)';
    ctx.lineWidth = Math.max(1.5, s * 0.045);
    ctx.beginPath();
    ctx.ellipse(cx, cy, s * 0.3, s * 0.11, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  const top = cy - bob;

  if (drawFromSheet(ctx, u, cx, top, s, facing)) {
    ctx.restore();
    return;
  }

  // 魔物は専用シルエット
  if (u.classId === 'bael' || u.classId === 'mogall') {
    drawMonsterShape(ctx, u.classId, cx, top, s, facing);
    ctx.restore();
    return;
  }

  if (cls.moveType === 'flier') {
    // 翼
    ctx.fillStyle = 'rgba(235,245,255,0.92)';
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(cx, top - s * 0.5);
      ctx.quadraticCurveTo(cx + dir * s * 0.5, top - s * 0.95, cx + dir * s * 0.16, top - s * 0.28);
      ctx.closePath();
      ctx.fill();
    }
  }

  if (cls.moveType === 'mounted') {
    // 馬体
    ctx.fillStyle = '#6b4a34';
    roundedPath(ctx, cx - s * 0.32, top - s * 0.4, s * 0.64, s * 0.3, s * 0.1);
    ctx.fill();
    ctx.fillStyle = '#563a28';
    ctx.fillRect(cx - s * 0.26, top - s * 0.14, s * 0.09, s * 0.14);
    ctx.fillRect(cx + s * 0.17, top - s * 0.14, s * 0.09, s * 0.14);
    ctx.fillStyle = '#6b4a34';
    ctx.beginPath();
    ctx.ellipse(cx + facing * s * 0.34, top - s * 0.5, s * 0.11, s * 0.08, facing * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // GBA 系 FE のマップスプライトに寄せて、頭を大きく・暗色のアウトラインを入れる
  const outline = '#20172a';
  const lw = Math.max(1.2, s * 0.045);
  const bodyBase = cls.moveType === 'mounted' ? top - s * 0.32 : top;
  const bodyH = s * 0.4;
  const headR = s * 0.2;
  const headY = bodyBase - bodyH - headR * 0.8;

  ctx.lineJoin = 'round';
  ctx.strokeStyle = outline;
  ctx.lineWidth = lw;

  // マント・胴
  ctx.fillStyle = cls.color;
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.3, bodyBase);
  ctx.quadraticCurveTo(cx - s * 0.26, bodyBase - bodyH * 0.85, cx - s * 0.19, bodyBase - bodyH);
  ctx.lineTo(cx + s * 0.19, bodyBase - bodyH);
  ctx.quadraticCurveTo(cx + s * 0.26, bodyBase - bodyH * 0.85, cx + s * 0.3, bodyBase);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 明るい面（左上からの光）
  ctx.fillStyle = shade(cls.color, 1.22);
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.3, bodyBase);
  ctx.quadraticCurveTo(cx - s * 0.26, bodyBase - bodyH * 0.85, cx - s * 0.19, bodyBase - bodyH);
  ctx.lineTo(cx - s * 0.05, bodyBase - bodyH);
  ctx.lineTo(cx - s * 0.12, bodyBase);
  ctx.closePath();
  ctx.fill();

  // 差し色（胸当て）
  ctx.fillStyle = cls.accent;
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.085, bodyBase - bodyH);
  ctx.lineTo(cx + s * 0.085, bodyBase - bodyH);
  ctx.lineTo(cx + s * 0.05, bodyBase - bodyH * 0.28);
  ctx.lineTo(cx - s * 0.05, bodyBase - bodyH * 0.28);
  ctx.closePath();
  ctx.fill();

  // 武器を持つ腕
  ctx.strokeStyle = outline;
  ctx.lineWidth = lw * 2.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx + facing * s * 0.16, bodyBase - bodyH * 0.78);
  ctx.lineTo(cx + facing * s * 0.28, bodyBase - bodyH * 0.5);
  ctx.stroke();
  ctx.strokeStyle = SKIN;
  ctx.lineWidth = lw * 1.4;
  ctx.beginPath();
  ctx.moveTo(cx + facing * s * 0.16, bodyBase - bodyH * 0.78);
  ctx.lineTo(cx + facing * s * 0.28, bodyBase - bodyH * 0.5);
  ctx.stroke();
  ctx.strokeStyle = outline;
  ctx.lineWidth = lw;

  // 頭
  ctx.fillStyle = SKIN;
  ctx.beginPath();
  ctx.arc(cx, headY, headR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 髪（頭の上半分を覆い、後ろに少し垂らす）
  const hair = HAIR[u.classId] ?? '#4a3a30';
  ctx.fillStyle = hair;
  ctx.beginPath();
  ctx.arc(cx, headY - headR * 0.06, headR * 1.0, Math.PI * 1.0, Math.PI * 2.0);
  ctx.quadraticCurveTo(cx + headR * 0.5, headY - headR * 0.12, cx, headY - headR * 0.2);
  ctx.quadraticCurveTo(cx - headR * 0.5, headY - headR * 0.12, cx - headR, headY - headR * 0.06);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // 後ろ髪
  ctx.beginPath();
  ctx.ellipse(cx - facing * headR * 0.86, headY + headR * 0.18, headR * 0.26, headR * 0.44, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = shade(hair, 1.35);
  ctx.beginPath();
  ctx.ellipse(cx + facing * headR * 0.1, headY - headR * 0.52, headR * 0.42, headR * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();

  // 目（2 ドット）
  ctx.fillStyle = '#2a2430';
  for (const d of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(cx + facing * headR * 0.12 + d * headR * 0.3, headY + headR * 0.22, headR * 0.1, headR * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  if (u.isBoss) {
    ctx.fillStyle = '#ffd45c';
    ctx.strokeStyle = '#8a6410';
    ctx.lineWidth = Math.max(1, lw * 0.8);
    ctx.beginPath();
    ctx.moveTo(cx - headR * 0.85, headY - headR * 0.72);
    ctx.lineTo(cx - headR * 0.42, headY - headR * 1.4);
    ctx.lineTo(cx, headY - headR * 0.8);
    ctx.lineTo(cx + headR * 0.42, headY - headR * 1.4);
    ctx.lineTo(cx + headR * 0.85, headY - headR * 0.72);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = outline;
    ctx.lineWidth = lw;
  }

  if (opts.showWeapon !== false) {
    const w = equippedWeapon(u) ?? battleWeapon(u);
    if (w) drawWeaponGlyph(ctx, w.type, cx + facing * s * 0.28, bodyBase - bodyH * 0.5, s * 0.72, facing);
  }

  ctx.restore();
}

const clampByte = (v: number) => Math.max(0, Math.min(255, Math.round(v)));

/** 色を明るく／暗くする（髪の 3 階調用） */
function shade(hex: string, f: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = clampByte(((n >> 16) & 255) * f);
  const g = clampByte(((n >> 8) & 255) * f);
  const b = clampByte((n & 255) * f);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

const OUTLINE = '#221a2c';

/**
 * FE の顔グラ風の目。外側の目尻を上げたアーモンド型で、
 * 虹彩は上下をまぶたで切り、上まつげを太く入れる。
 * dir = 1 なら目尻が右、-1 なら左。
 */
function drawEye(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, iris: string, dir: number) {
  const inner = x - dir * w;
  const outer = x + dir * w;
  const lidPath = () => {
    ctx.beginPath();
    ctx.moveTo(inner, y + h * 0.18);
    ctx.quadraticCurveTo(x - dir * w * 0.25, y - h * 1.15, outer, y - h * 0.5);
    ctx.quadraticCurveTo(x + dir * w * 0.2, y + h * 0.95, inner, y + h * 0.18);
    ctx.closePath();
  };

  ctx.save();
  lidPath();
  ctx.fillStyle = '#fbf6ea';
  ctx.fill();
  ctx.clip();

  // 虹彩（上下がまぶたで切れる）
  const ix = x - dir * w * 0.08;
  ctx.fillStyle = iris;
  ctx.beginPath();
  ctx.ellipse(ix, y - h * 0.1, w * 0.5, h * 1.0, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = shade(iris, 0.55);
  ctx.beginPath();
  ctx.ellipse(ix, y - h * 0.62, w * 0.5, h * 0.62, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#191320';
  ctx.beginPath();
  ctx.ellipse(ix, y - h * 0.12, w * 0.22, h * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // ハイライト
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.beginPath();
  ctx.ellipse(ix - dir * w * 0.22, y - h * 0.5, w * 0.16, h * 0.24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 上まぶた
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = Math.max(1.6, h * 0.4);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(inner, y + h * 0.18);
  ctx.quadraticCurveTo(x - dir * w * 0.25, y - h * 1.15, outer, y - h * 0.5);
  ctx.stroke();
  // 下まぶた（細く）
  ctx.lineWidth = Math.max(1, h * 0.14);
  ctx.beginPath();
  ctx.moveTo(inner + dir * w * 0.25, y + h * 0.42);
  ctx.quadraticCurveTo(x + dir * w * 0.3, y + h * 0.82, outer, y - h * 0.42);
  ctx.stroke();
}

/**
 * 会話パート用の立ち絵。GBA 系 FE の顔グラに寄せて、
 * 髪のシルエットを大きく・目を大きく・3/4 向きで描く。
 * cx は顔の中心 X、baseY は胸の切れる位置、h はバスト全体の高さ。
 */
export function drawFacePortrait(
  ctx: CanvasRenderingContext2D,
  u: Unit,
  cx: number,
  baseY: number,
  h: number,
  facing: number,
  dim = false,
) {
  const cls = classOf(u.classId);
  const hair = HAIR[u.classId] ?? '#4a3a30';
  const hairDark = shade(hair, 0.62);
  const hairLight = shade(hair, 1.3);
  const iris = u.team === 'player' ? shade(cls.color, 1.25) : '#b8484a';

  const eyeY = baseY - h * 0.55; // 目の高さ
  const fw = h * 0.155; // 顔の半幅
  const fh = h * 0.21; // 目からあごまで
  const f = facing >= 0 ? 1 : -1;
  const cheek = cx + f * fw * 0.1; // 3/4 向きのぶん、パーツを少し寄せる

  ctx.save();
  // 喋っていない側は暗くする
  if (dim) ctx.filter = 'brightness(0.42) saturate(0.65)';
  ctx.lineJoin = 'round';

  // ---- 髪（後ろ）: 顔より一回り大きいシルエットを肩まで垂らす
  ctx.fillStyle = hairDark;
  ctx.beginPath();
  ctx.moveTo(cx - fw * 1.46, eyeY + fh * 0.4);
  ctx.quadraticCurveTo(cx - fw * 1.62, eyeY - fh * 1.5, cx, eyeY - fh * 1.78);
  ctx.quadraticCurveTo(cx + fw * 1.62, eyeY - fh * 1.5, cx + fw * 1.46, eyeY + fh * 0.4);
  ctx.quadraticCurveTo(cx + fw * 1.72, eyeY + fh * 1.7, cx + fw * 1.38, eyeY + fh * 2.9);
  ctx.lineTo(cx - fw * 1.5, eyeY + fh * 2.9);
  ctx.quadraticCurveTo(cx - fw * 1.74, eyeY + fh * 1.6, cx - fw * 1.46, eyeY + fh * 0.4);
  ctx.closePath();
  ctx.fill();

  // ---- 肩・胴（画面下で切れる）
  ctx.fillStyle = shade(cls.color, 0.9);
  ctx.beginPath();
  ctx.moveTo(cx - h * 0.44, baseY + h * 0.02);
  ctx.quadraticCurveTo(cx - h * 0.32, eyeY + fh * 1.42, cx - h * 0.095, eyeY + fh * 1.2);
  ctx.lineTo(cx + h * 0.095, eyeY + fh * 1.2);
  ctx.quadraticCurveTo(cx + h * 0.32, eyeY + fh * 1.42, cx + h * 0.44, baseY + h * 0.02);
  ctx.closePath();
  ctx.fill();

  // 襟
  ctx.fillStyle = cls.accent;
  ctx.beginPath();
  ctx.moveTo(cx - h * 0.115, eyeY + fh * 1.2);
  ctx.lineTo(cx, eyeY + fh * 1.92);
  ctx.lineTo(cx + h * 0.115, eyeY + fh * 1.2);
  ctx.closePath();
  ctx.fill();

  // 首
  ctx.fillStyle = shade(SKIN, 0.84);
  ctx.beginPath();
  ctx.moveTo(cx - fw * 0.42, eyeY + fh * 0.62);
  ctx.lineTo(cx + fw * 0.42, eyeY + fh * 0.62);
  ctx.lineTo(cx + fw * 0.5, eyeY + fh * 1.32);
  ctx.lineTo(cx - fw * 0.5, eyeY + fh * 1.32);
  ctx.closePath();
  ctx.fill();

  // ---- 顔（あごを細く）
  ctx.fillStyle = SKIN;
  ctx.beginPath();
  ctx.moveTo(cx - fw, eyeY - fh * 0.12);
  ctx.quadraticCurveTo(cx - fw * 0.92, eyeY + fh * 0.6, cheek + fw * 0.02, eyeY + fh);
  ctx.quadraticCurveTo(cx + fw * 0.92, eyeY + fh * 0.6, cx + fw, eyeY - fh * 0.12);
  ctx.quadraticCurveTo(cx + fw * 0.96, eyeY - fh * 1.18, cx, eyeY - fh * 1.24);
  ctx.quadraticCurveTo(cx - fw * 0.96, eyeY - fh * 1.18, cx - fw, eyeY - fh * 0.12);
  ctx.closePath();
  ctx.fill();

  // 耳
  ctx.fillStyle = shade(SKIN, 0.93);
  ctx.beginPath();
  ctx.ellipse(cx - f * fw * 0.99, eyeY + fh * 0.1, fw * 0.13, fh * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // ---- 目（アーモンド型・寄せ気味）
  const eyeW = fw * 0.28;
  const eyeH = fh * 0.2;
  const gap = fw * 0.44;
  drawEye(ctx, cheek - gap, eyeY, eyeW * (f > 0 ? 0.86 : 1), eyeH, iris, -1);
  drawEye(ctx, cheek + gap, eyeY, eyeW * (f > 0 ? 1 : 0.86), eyeH, iris, 1);

  // 眉
  ctx.strokeStyle = hairDark;
  ctx.lineWidth = Math.max(1.8, fh * 0.075);
  ctx.lineCap = 'round';
  for (const d of [-1, 1]) {
    const bx = cheek + d * gap;
    ctx.beginPath();
    ctx.moveTo(bx - d * eyeW * 1.15, eyeY - fh * 0.38);
    ctx.quadraticCurveTo(bx, eyeY - fh * 0.5, bx + d * eyeW * 1.0, eyeY - fh * 0.33);
    ctx.stroke();
  }

  // 鼻と口
  ctx.strokeStyle = shade(SKIN, 0.72);
  ctx.lineWidth = Math.max(1.2, fh * 0.05);
  ctx.beginPath();
  ctx.moveTo(cheek + f * fw * 0.1, eyeY + fh * 0.26);
  ctx.lineTo(cheek + f * fw * 0.16, eyeY + fh * 0.4);
  ctx.stroke();
  ctx.strokeStyle = '#9c5c4c';
  ctx.beginPath();
  ctx.moveTo(cheek - fw * 0.1, eyeY + fh * 0.62);
  ctx.quadraticCurveTo(cheek, eyeY + fh * 0.68, cheek + fw * 0.1, eyeY + fh * 0.62);
  ctx.stroke();

  // 頬
  ctx.fillStyle = 'rgba(228,126,118,0.25)';
  for (const d of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(cheek + d * fw * 0.62, eyeY + fh * 0.34, fw * 0.2, fh * 0.11, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // ---- 前髪: 額を覆い、毛先を目の上まで尖らせる
  ctx.fillStyle = hair;
  ctx.beginPath();
  ctx.moveTo(cx - fw * 1.2, eyeY + fh * 0.1);
  ctx.quadraticCurveTo(cx - fw * 1.34, eyeY - fh * 1.36, cx, eyeY - fh * 1.62);
  ctx.quadraticCurveTo(cx + fw * 1.34, eyeY - fh * 1.36, cx + fw * 1.2, eyeY + fh * 0.1);
  // 毛先（右から左へジグザグに戻る。眉の上で止める）
  ctx.lineTo(cx + fw * 1.02, eyeY - fh * 0.58);
  ctx.lineTo(cx + fw * 0.74, eyeY - fh * 0.3);
  ctx.lineTo(cx + fw * 0.46, eyeY - fh * 0.84);
  ctx.lineTo(cx + fw * 0.1, eyeY - fh * 0.5);
  ctx.lineTo(cx - fw * 0.24, eyeY - fh * 0.92);
  ctx.lineTo(cx - fw * 0.6, eyeY - fh * 0.46);
  ctx.lineTo(cx - fw * 0.86, eyeY - fh * 0.88);
  ctx.lineTo(cx - fw * 1.04, eyeY - fh * 0.38);
  ctx.closePath();
  ctx.fill();

  // 顔の横を縁取る髪
  ctx.fillStyle = hair;
  for (const d of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(cx + d * fw * 1.02, eyeY - fh * 0.75);
    ctx.quadraticCurveTo(cx + d * fw * 1.42, eyeY + fh * 0.2, cx + d * fw * 1.24, eyeY + fh * 1.5);
    ctx.lineTo(cx + d * fw * 0.86, eyeY + fh * 1.15);
    ctx.quadraticCurveTo(cx + d * fw * 1.02, eyeY + fh * 0.2, cx + d * fw * 0.9, eyeY - fh * 0.6);
    ctx.closePath();
    ctx.fill();
  }

  // 髪のハイライト
  ctx.fillStyle = hairLight;
  ctx.beginPath();
  ctx.ellipse(cx - f * fw * 0.2, eyeY - fh * 1.12, fw * 0.66, fh * 0.14, -f * 0.14, 0, Math.PI * 2);
  ctx.fill();

  // 王冠（ボス）
  if (u.isBoss) {
    ctx.fillStyle = '#ffd45c';
    ctx.strokeStyle = shade('#ffd45c', 0.6);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - fw * 0.8, eyeY - fh * 1.5);
    ctx.lineTo(cx - fw * 0.42, eyeY - fh * 2.05);
    ctx.lineTo(cx, eyeY - fh * 1.55);
    ctx.lineTo(cx + fw * 0.42, eyeY - fh * 2.05);
    ctx.lineTo(cx + fw * 0.8, eyeY - fh * 1.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

export function drawHpBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  hp: number,
  max: number,
  color = '#57d16a',
) {
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
  ctx.fillStyle = '#2b2f3d';
  ctx.fillRect(x, y, w, h);
  const ratio = Math.max(0, Math.min(1, hp / max));
  ctx.fillStyle = ratio > 0.5 ? color : ratio > 0.25 ? '#e0c34a' : '#e05a5a';
  ctx.fillRect(x, y, w * ratio, h);
}
