import { MAP, MAP_H, MAP_W } from '../data/chapters';
import { terrainAt } from '../data/terrain';
import { TILE } from './layout';

/**
 * 盤面の地表。**マス目を見せない。**
 *
 * GBA の FE のマップにはグリッド線が無く、市松模様も無い。草原は近い色を
 * 十数種ばらまいた細かいノイズで、その模様はマスの境界と無関係に続いている。
 * 森も山も崖も「マスの絵」ではなく地表の上に乗った物で、隣のマスへはみ出す。
 *
 * だからここは 1 マスずつ塗らず、**盤面ぜんぶを一枚の裏画面に焼く**。
 * ノイズはワールド座標から引くので継ぎ目が出ず、物は好きなだけはみ出せる。
 * 焼くのは章の頭と、扉が開いたり村を訪ねたりして地形が変わったときだけ。
 *
 * 色は実機の第1章から採った（`#68c8a0` の草、`#204088` の水、`#f0f080` の砂）。
 */

/** 地表の系統。マスの種類はこのどれかの上に乗る */
type Family = 'grass' | 'sand' | 'dirt' | 'stone' | 'water';

/**
 * その地形が地表として何色になるか。
 *
 * 建物と道は **undefined** —— 自分の色を持たず、周りの地表の上に乗る。
 * 砦や村のマスを石畳で塗ると、そこだけ四角い床が浮き上がって格子に見える。
 * 実機の砦は草の上に建っていて、床は建物の絵の中にしかない。
 */
const FAMILY: Record<string, Family | undefined> = {
  plain: 'grass',
  grass: 'grass',
  forest: 'grass',
  mountain: 'grass',
  peak: 'grass',
  sand: 'sand',
  water: 'water',
  wall: 'stone',
  // 以下は周りに従う
  village: undefined,
  shop: undefined,
  arena: undefined,
  road: undefined,
  door: undefined,
  chest: undefined,
  fort: undefined,
  gate: undefined,
  throne: undefined,
};

/**
 * 実機から採った色。**明るい順に並べる。**
 * 隣り合った点が近い番号を引くようにしてあるので、並びがそのまま濃淡のむらになる。
 */
const TONES: Record<Family, string[]> = {
  grass: ['#b0e8d0', '#90e8c8', '#7ad8ba', '#70d0b0', '#68c8a0', '#62c09a', '#5cb894'],
  sand: ['#f8f8d8', '#f0f080', '#ecec78', '#e0e870', '#d8dc68'],
  dirt: ['#d8c890', '#c8b878', '#c0b070', '#b0a060', '#a09858'],
  stone: ['#c0c0cc', '#b0b0c0', '#9a9aa8', '#90909e', '#86868f'],
  water: ['#3858a0', '#2c4c94', '#204088', '#1c3c80', '#183474'],
};

/** ときどき混ざる差し色。草の黄緑や水の照り返しがこれ */
const TUFT: Partial<Record<Family, string[]>> = {
  grass: ['#a0e0a0', '#a8f8a0', '#c0e8e0'],
  water: ['#2f6ab0', '#3a78b8'],
  sand: ['#f8e8d8'],
};

/** 岩と山の面。明るい面と影の面 */
const ROCK = { lit: '#f8f890', mid: '#e0d070', warm: '#b89868', shade: '#887858', dark: '#606048' };

/** 決まった値を返す雑音。ワールド座標から引くのでマスに揃わない */
function noise(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/** 補間用の格子。毎画素 sin を呼ぶと焼くのに時間がかかる */
const LAT_SIZE = 256;
const LAT = new Float32Array(LAT_SIZE * LAT_SIZE);
for (let j = 0; j < LAT_SIZE; j++) for (let i = 0; i < LAT_SIZE; i++) LAT[j * LAT_SIZE + i] = noise(i * 1.13, j * 2.71);
const lat = (i: number, j: number) => LAT[(j & (LAT_SIZE - 1)) * LAT_SIZE + (i & (LAT_SIZE - 1))];

/**
 * なめらかな雑音。**格子を丸めるだけだと四角いむらが出て、それがマスに見える。**
 * 格子の間を補間して、境目のない濃淡にする。
 */
const ease = (t: number) => t * t * (3 - 2 * t);

function smoothNoise(x: number, y: number, scale: number) {
  const fx = x / scale;
  const fy = y / scale;
  const x0 = Math.floor(fx);
  const y0 = Math.floor(fy);
  const u = ease(fx - x0);
  const v = ease(fy - y0);
  const a = lat(x0, y0) * (1 - u) + lat(x0 + 1, y0) * u;
  const b = lat(x0, y0 + 1) * (1 - u) + lat(x0 + 1, y0 + 1) * u;
  return a * (1 - v) + b * v;
}

const isRoad = (x: number, y: number) => terrainAt(MAP, x, y).id === 'road';
const isWall = (x: number, y: number) => terrainAt(MAP, x, y).id === 'wall';
const isWater = (x: number, y: number) => terrainAt(MAP, x, y).id === 'water';

/**
 * そのマスの地表。自分の色を持たない地形は、周りで一番多い地表を借りる。
 * 橋の下は水、野の砦は草、というのが自然に出る。
 */
/** 焼くあいだだけ持つ覚え書き。familyAt は 1 画素ごとに呼ばれるので効く */
let familyMemo = new Map<number, Family>();

function familyAt(tx: number, ty: number): Family {
  const k = (ty + 1) * 1024 + (tx + 1);
  const memo = familyMemo.get(k);
  if (memo) return memo;
  const f = computeFamily(tx, ty);
  familyMemo.set(k, f);
  return f;
}

function computeFamily(tx: number, ty: number): Family {
  const own = FAMILY[terrainAt(MAP, tx, ty).id];
  if (own) return own;
  const votes = new Map<Family, number>();
  // 隣は重く、角は軽く。橋の四方は水でも、斜めは岸なので角を同じ重さで
  // 数えると橋が草の上に架かってしまう
  for (const [dx, dy, weight] of [
    [1, 0, 3],
    [-1, 0, 3],
    [0, 1, 3],
    [0, -1, 3],
    [1, 1, 1],
    [-1, -1, 1],
    [1, -1, 1],
    [-1, 1, 1],
  ] as const) {
    const f = FAMILY[terrainAt(MAP, tx + dx, ty + dy).id];
    // 岩壁は「周り」に数えない。城門の下が石畳になってしまう
    if (!f || f === 'stone') continue;
    votes.set(f, (votes.get(f) ?? 0) + weight);
  }
  let best: Family = 'grass';
  let n = 0;
  for (const [f, c] of votes) {
    if (c > n) {
      best = f;
      n = c;
    }
  }
  return best;
}

/** 散らす点の一辺。実機は 1px だがタイルが 40px あるので 2px で粒を合わせる */
const DOT = 2;
/** 地表が変わる境目をぼかす幅 */
const BLEND = 7;

/**
 * その画素がどの地表に属するか。境目では隣の地表が滲み出す。
 * 直線でぶつ切りにすると、そこがそのままマスの線になってしまう。
 */
function familyAtPixel(px: number, py: number): Family {
  const tx = Math.floor(px / TILE);
  const ty = Math.floor(py / TILE);
  const mine = familyAt(tx, ty);
  const ox = px - tx * TILE;
  const oy = py - ty * TILE;

  const edges: [number, number, number][] = [
    [-1, 0, ox],
    [1, 0, TILE - 1 - ox],
    [0, -1, oy],
    [0, 1, TILE - 1 - oy],
  ];
  for (const [dx, dy, dist] of edges) {
    if (dist >= BLEND) continue;
    const other = familyAt(tx + dx, ty + dy);
    if (other === mine) continue;
    // 縁に近いほど隣の色が出やすい
    if (noise(px * 1.7, py * 1.3) < 1 - dist / BLEND) return other;
  }
  return mine;
}

function rgb(hex: string): [number, number, number] {
  return [Number.parseInt(hex.slice(1, 3), 16), Number.parseInt(hex.slice(3, 5), 16), Number.parseInt(hex.slice(5, 7), 16)];
}

const TONE_RGB = Object.fromEntries(Object.entries(TONES).map(([k, v]) => [k, v.map(rgb)])) as Record<Family, [number, number, number][]>;
const TUFT_RGB = Object.fromEntries(Object.entries(TUFT).map(([k, v]) => [k, v.map(rgb)])) as Partial<
  Record<Family, [number, number, number][]>
>;

// ------------------------------------------------------------------ 地表

/**
 * むらの大きさ。タイルの 40px と割り切れない値にしてある —— 割り切れると
 * むらの周期がマスの周期と重なり、それだけで格子が浮いて見える。
 */
const PATCH_FINE = 9;
const PATCH_BROAD = 53;

function paintGround(g: CanvasRenderingContext2D, w: number, h: number) {
  const img = g.createImageData(w, h);
  const d = img.data;
  for (let py = 0; py < h; py += DOT) {
    for (let px = 0; px < w; px += DOT) {
      const fam = familyAtPixel(px, py);
      const tones = TONE_RGB[fam];
      // 近いところは近い濃さを引く。完全な乱数だと砂嵐になる。
      // 粗いむらと細かいむらを重ねると、広い明暗の中に草の粒が乗る
      const broad = smoothNoise(px, py, PATCH_BROAD);
      const patch = smoothNoise(px, py, PATCH_FINE);
      const jitter = noise(px, py);
      const mix = Math.min(0.999, broad * 0.42 + patch * 0.36 + jitter * 0.22);
      let tone = tones[Math.floor(mix * tones.length)];

      const tufts = TUFT_RGB[fam];
      if (tufts && jitter > 0.955) tone = tufts[Math.floor(noise(py, px) * tufts.length) % tufts.length];

      const [r, gg, b] = tone;
      for (let sy = 0; sy < DOT && py + sy < h; sy++) {
        let i = ((py + sy) * w + px) * 4;
        for (let sx = 0; sx < DOT && px + sx < w; sx++) {
          d[i] = r;
          d[i + 1] = gg;
          d[i + 2] = b;
          d[i + 3] = 255;
          i += 4;
        }
      }
    }
  }
  g.putImageData(img, 0, 0);
}

// ------------------------------------------------------------------ 物

/**
 * 森。実機の木は円ではなく、丸い葉を三つ重ねた塊で、下に幹と影がある。
 * マスの外へはみ出してよい —— 一マスに収めようとすると格子が見える。
 */
function drawTrees(g: CanvasRenderingContext2D, sx: number, sy: number, tx: number, ty: number) {
  const n = 2 + Math.floor(noise(tx, ty) * 2);
  for (let i = 0; i < n; i++) {
    const cx = sx + 10 + noise(tx * 7 + i, ty * 3) * (TILE - 20);
    const cy = sy + 12 + noise(tx * 3, ty * 7 + i) * (TILE - 22);
    const rr = 9 + noise(tx + i, ty) * 2.5;

    g.fillStyle = 'rgba(24,54,44,0.30)';
    g.beginPath();
    g.ellipse(cx + 3, cy + rr * 0.95, rr * 0.95, rr * 0.34, 0, 0, Math.PI * 2);
    g.fill();

    g.fillStyle = '#6a5030';
    g.fillRect(cx - 2, cy + rr * 0.3, 4, rr * 0.7);

    // 葉。三つの円で塊にする
    for (const [ox, oy, s, col] of [
      [-rr * 0.45, rr * 0.12, 0.72, '#2f6a4e'],
      [rr * 0.45, rr * 0.12, 0.72, '#2f6a4e'],
      [0, -rr * 0.35, 0.92, '#3d8460'],
    ] as const) {
      g.fillStyle = col;
      g.beginPath();
      g.arc(cx + ox, cy + oy, rr * s, 0, Math.PI * 2);
      g.fill();
    }
    // 受け光
    g.fillStyle = '#5fae7e';
    g.beginPath();
    g.arc(cx - rr * 0.28, cy - rr * 0.55, rr * 0.4, 0, Math.PI * 2);
    g.fill();
  }
}

/**
 * 岩山。隣り合った山どうしが一つの尾根に見えるよう、底辺をマスの端まで広げ、
 * 頂きの位置をずらす。実機の山も「1マスに1つの三角」ではなく、何マスにも
 * 渡る一つの山として描かれている。
 */
function drawRock(g: CanvasRenderingContext2D, sx: number, sy: number, tx: number, ty: number, tall: boolean) {
  const peak = sy + (tall ? 0 : 7) + noise(tx, ty) * 5;
  const midX = sx + TILE / 2 + (noise(tx * 5, ty * 5) - 0.5) * 12;
  const base = sy + TILE + 3;

  // 影の面（右）
  g.fillStyle = ROCK.shade;
  g.beginPath();
  g.moveTo(sx - 3, base);
  g.lineTo(midX, peak);
  g.lineTo(sx + TILE + 3, base);
  g.closePath();
  g.fill();

  // 陽の当たる面（左）
  g.fillStyle = ROCK.warm;
  g.beginPath();
  g.moveTo(sx - 3, base);
  g.lineTo(midX, peak);
  g.lineTo(midX + 4, base);
  g.closePath();
  g.fill();

  // 岩肌の筋。稜線から裾へ何本か落とす
  g.strokeStyle = ROCK.dark;
  g.lineWidth = 1.5;
  for (let i = 0; i < 3; i++) {
    const t = 0.25 + i * 0.25;
    g.beginPath();
    g.moveTo(midX + (noise(tx + i, ty) - 0.5) * 6, peak + 4 + i * 3);
    g.lineTo(midX + (noise(tx, ty + i) - 0.5) * 26, base - 2 - t * 6);
    g.stroke();
  }
  g.strokeStyle = ROCK.lit;
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(midX - 1, peak + 2);
  g.lineTo(sx - 1, base - 2);
  g.stroke();

  if (tall) {
    g.fillStyle = '#f8f8e0';
    g.beginPath();
    g.moveTo(midX - 8, peak + 13);
    g.lineTo(midX, peak);
    g.lineTo(midX + 8, peak + 13);
    g.closePath();
    g.fill();
  }
}

/**
 * 岩壁。隣と繋がって一続きの崖になる。明るい天端は「下が崖でない」ところ
 * ——つまり崖が途切れて地面が始まる縁——にだけ出す。全部のマスに引くと板張りに見える。
 */
function drawCliff(g: CanvasRenderingContext2D, sx: number, sy: number, tx: number, ty: number) {
  g.fillStyle = ROCK.dark;
  g.fillRect(sx - 1, sy - 1, TILE + 2, TILE + 2);

  // 岩の塊。境目をまたぐので継ぎ目が見えない
  for (let i = 0; i < 7; i++) {
    const px = sx - 4 + noise(tx * 9 + i, ty * 2) * (TILE + 8);
    const py = sy - 4 + noise(tx * 2, ty * 9 + i) * (TILE + 8);
    g.fillStyle = noise(tx + i, ty + i) > 0.55 ? ROCK.shade : '#4e4a3c';
    g.beginPath();
    g.roundRect(px, py, 11 + noise(px, py) * 6, 8 + noise(py, px) * 4, 3);
    g.fill();
  }

  if (!isWall(tx, ty - 1)) {
    g.fillStyle = ROCK.warm;
    g.fillRect(sx - 1, sy - 1, TILE + 2, 5);
  }
  if (!isWall(tx, ty + 1)) {
    g.fillStyle = '#3a3630';
    g.fillRect(sx - 1, sy + TILE - 4, TILE + 2, 5);
  }
}

/**
 * 水の波と岸。波はマスをまたいで走るのでワールド座標で引く。
 * 岸は「隣が水でない」辺にだけ、白い泡を薄く置く。
 */
function drawWaves(g: CanvasRenderingContext2D, sx: number, sy: number, tx: number, ty: number) {
  g.strokeStyle = 'rgba(150,200,240,0.16)';
  g.lineWidth = 2;
  for (let i = 0; i < 2; i++) {
    const wy = sy + 10 + i * 18 + noise(tx, ty + i) * 6;
    g.beginPath();
    g.moveTo(sx - 4, wy);
    g.quadraticCurveTo(sx + TILE / 2, wy + 5, sx + TILE + 4, wy);
    g.stroke();
  }

  g.fillStyle = 'rgba(200,240,255,0.22)';
  for (const [dx, dy] of [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ] as const) {
    if (isWater(tx + dx, ty + dy)) continue;
    // 橋の下は岸ではない。ここに泡を置くと橋が四角く縁取られる
    if (isRoad(tx + dx, ty + dy)) continue;
    // 泡は点で置く。線を引くとそれが縁になってマスが浮く
    for (let i = 0; i < 7; i++) {
      const t = (i + noise(tx * 3 + i, ty)) / 7;
      const px = sx + (dx === 0 ? t * TILE : dx < 0 ? noise(i, ty) * 4 : TILE - noise(i, ty) * 4);
      const py = sy + (dy === 0 ? t * TILE : dy < 0 ? noise(tx, i) * 4 : TILE - noise(tx, i) * 4);
      g.fillRect(px, py, 2, 2);
    }
  }
}

/** 建物の影。地面に置かれている感じはこれで出る */
function shadow(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  g.fillStyle = 'rgba(20,30,40,0.25)';
  g.beginPath();
  g.ellipse(x + w / 2, y + h, w * 0.55, h * 0.22, 0, 0, Math.PI * 2);
  g.fill();
}

function drawFeature(g: CanvasRenderingContext2D, tx: number, ty: number, visited: ReadonlySet<string>, opened: ReadonlySet<string>) {
  const t = terrainAt(MAP, tx, ty);
  const sx = tx * TILE;
  const sy = ty * TILE;

  switch (t.id) {
    case 'forest':
      drawTrees(g, sx, sy, tx, ty);
      break;
    case 'mountain':
      drawRock(g, sx, sy, tx, ty, false);
      break;
    case 'peak':
      drawRock(g, sx, sy, tx, ty, true);
      break;
    case 'wall':
      drawCliff(g, sx, sy, tx, ty);
      break;
    case 'water':
      drawWaves(g, sx, sy, tx, ty);
      break;
    case 'road':
      break;
    case 'village': {
      // 訪問済みは戸を閉めて暗くする。FE も一度きりで、済んだ村は見分けがつく
      const done = visited.has(tx + ',' + ty);
      shadow(g, sx + 6, sy + 12, TILE - 12, TILE - 18);
      g.fillStyle = done ? '#b8b0a0' : '#f8e8d8';
      g.fillRect(sx + 8, sy + 18, TILE - 16, TILE - 22);
      g.fillStyle = done ? '#7a5a50' : '#c0503a';
      g.beginPath();
      g.moveTo(sx + 4, sy + 19);
      g.lineTo(sx + TILE / 2, sy + 6);
      g.lineTo(sx + TILE - 4, sy + 19);
      g.closePath();
      g.fill();
      g.fillStyle = done ? '#3a3028' : '#5a4030';
      g.fillRect(sx + TILE / 2 - 4, sy + TILE - 12, 8, 10);
      break;
    }
    case 'shop':
      shadow(g, sx + 5, sy + 14, TILE - 10, TILE - 20);
      g.fillStyle = '#f8e8d8';
      g.fillRect(sx + 7, sy + 18, TILE - 14, TILE - 22);
      g.fillStyle = '#3a86a8';
      g.fillRect(sx + 3, sy + 11, TILE - 6, 8);
      g.fillStyle = '#5a4030';
      g.fillRect(sx + TILE / 2 - 5, sy + 24, 10, 3);
      g.fillRect(sx + TILE / 2 - 1, sy + 24, 2, 10);
      break;
    case 'arena':
      shadow(g, sx + 4, sy + 14, TILE - 8, TILE - 20);
      g.fillStyle = '#d8c890';
      g.beginPath();
      g.ellipse(sx + TILE / 2, sy + TILE / 2 + 3, TILE / 2 - 3, TILE / 2 - 7, 0, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = '#8a7a50';
      g.lineWidth = 3;
      g.stroke();
      g.fillStyle = '#8a7a50';
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        g.fillRect(sx + TILE / 2 + Math.cos(a) * 13 - 2, sy + TILE / 2 + 3 + Math.sin(a) * 9 - 2, 4, 4);
      }
      break;
    case 'chest': {
      const taken = opened.has(tx + ',' + ty);
      shadow(g, sx + 8, sy + 16, TILE - 16, TILE - 26);
      g.fillStyle = taken ? '#6a6658' : '#8a6a2a';
      g.fillRect(sx + 8, sy + 18, TILE - 16, TILE - 26);
      g.fillStyle = taken ? '#8a8674' : '#d8ae4c';
      g.fillRect(sx + 8, sy + 13, TILE - 16, 7);
      if (!taken) {
        g.fillStyle = '#f8f0c0';
        g.fillRect(sx + TILE / 2 - 2, sy + 17, 4, 6);
      }
      break;
    }
    case 'door':
      g.fillStyle = ROCK.shade;
      g.fillRect(sx - 1, sy - 1, TILE + 2, TILE + 2);
      g.fillStyle = '#7a5a34';
      g.fillRect(sx + 5, sy + 5, TILE - 10, TILE - 8);
      g.fillStyle = '#a87f4a';
      g.fillRect(sx + 8, sy + 8, TILE - 16, TILE - 12);
      g.fillStyle = '#e8d47a';
      g.fillRect(sx + TILE - 14, sy + TILE / 2 - 2, 4, 4);
      break;
    case 'fort':
      shadow(g, sx + 5, sy + 10, TILE - 10, TILE - 14);
      g.fillStyle = '#e0d0b0';
      g.fillRect(sx + 6, sy + 13, TILE - 12, TILE - 17);
      g.fillStyle = '#f8e8d8';
      for (let i = 0; i < 3; i++) g.fillRect(sx + 6 + i * 10, sy + 6, 7, 9);
      g.fillStyle = '#8a7a58';
      g.fillRect(sx + 6, sy + 20, TILE - 12, 2);
      g.fillStyle = '#3a3028';
      g.fillRect(sx + TILE / 2 - 4, sy + TILE - 14, 8, 10);
      break;
    case 'gate':
      shadow(g, sx + 3, sy + 8, TILE - 6, TILE - 12);
      g.fillStyle = '#e0d0b0';
      g.fillRect(sx + 3, sy + 8, TILE - 6, TILE - 10);
      g.fillStyle = '#f8e8d8';
      g.fillRect(sx + 3, sy + 8, TILE - 6, 5);
      g.fillStyle = '#3a2c18';
      g.beginPath();
      g.moveTo(sx + 10, sy + TILE - 2);
      g.lineTo(sx + 10, sy + 22);
      g.quadraticCurveTo(sx + TILE / 2, sy + 11, sx + TILE - 10, sy + 22);
      g.lineTo(sx + TILE - 10, sy + TILE - 2);
      g.closePath();
      g.fill();
      g.fillStyle = '#c8a24a';
      g.fillRect(sx + TILE / 2 - 1, sy + 22, 2, TILE - 24);
      break;
    case 'throne':
      shadow(g, sx + 8, sy + 8, TILE - 16, TILE - 12);
      g.fillStyle = '#6b4f80';
      g.fillRect(sx + 9, sy + 9, TILE - 18, TILE - 11);
      g.fillStyle = '#a98cc0';
      g.fillRect(sx + 9, sy + 9, TILE - 18, 6);
      g.fillStyle = '#4a3557';
      g.fillRect(sx + 12, sy + 19, TILE - 24, TILE - 23);
      g.fillStyle = '#e0c060';
      g.fillRect(sx + TILE / 2 - 6, sy + 5, 12, 4);
      break;
  }
}

/**
 * 道。隣の道と繋がった一本の帯として引く。マスごとに枠を描くと、それがそのまま
 * 格子になる —— 実機の道は途切れずに続く一本の線として描かれている。
 */
function drawRoads(g: CanvasRenderingContext2D) {
  g.lineCap = 'round';
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      if (!isRoad(x, y)) continue;
      const cx = x * TILE + TILE / 2;
      const cy = y * TILE + TILE / 2;
      const linked = isRoad(x + 1, y) || isRoad(x - 1, y) || isRoad(x, y + 1) || isRoad(x, y - 1);

      if (!linked) {
        // 孤立した道は道ではなく、草の切れた地面。真円だと石畳のように浮く
        g.fillStyle = '#d8c898';
        g.beginPath();
        for (let i = 0; i <= 12; i++) {
          const a = (i / 12) * Math.PI * 2;
          const r = TILE * 0.3 * (0.75 + noise(x * 7 + i, y * 5) * 0.5);
          const px = cx + Math.cos(a) * r;
          const py = cy + Math.sin(a) * r * 0.8;
          if (i === 0) g.moveTo(px, py);
          else g.lineTo(px, py);
        }
        g.closePath();
        g.fill();
        continue;
      }

      // 水の上に架かった道は橋。板と欄干で見せる
      const overWater = familyAt(x, y) === 'water';
      g.strokeStyle = overWater ? '#c8a878' : '#d8c898';
      g.lineWidth = TILE * (overWater ? 0.7 : 0.6);
      // 中心を丸く置いて、繋がる隣へ腕を伸ばす。交差点も自然に太る
      g.beginPath();
      g.moveTo(cx, cy);
      g.lineTo(cx, cy);
      g.stroke();
      for (const [dx, dy] of [
        [1, 0],
        [0, 1],
      ] as const) {
        if (!isRoad(x + dx, y + dy)) continue;
        g.beginPath();
        g.moveTo(cx, cy);
        g.lineTo(cx + dx * TILE, cy + dy * TILE);
        g.stroke();
      }
    }
  }
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      if (!isRoad(x, y)) continue;
      const sx = x * TILE;
      const sy = y * TILE;
      if (familyAt(x, y) === 'water') {
        // 橋の板目と欄干
        g.strokeStyle = 'rgba(90,66,40,0.5)';
        g.lineWidth = 1.5;
        const across = isRoad(x, y - 1) || isRoad(x, y + 1);
        for (let i = 1; i < 5; i++) {
          g.beginPath();
          if (across) {
            g.moveTo(sx + 6, sy + i * 8);
            g.lineTo(sx + TILE - 6, sy + i * 8);
          } else {
            g.moveTo(sx + i * 8, sy + 6);
            g.lineTo(sx + i * 8, sy + TILE - 6);
          }
          g.stroke();
        }
        g.strokeStyle = '#8a6a44';
        g.lineWidth = 3;
        g.beginPath();
        if (across) {
          g.moveTo(sx + 5, sy);
          g.lineTo(sx + 5, sy + TILE);
          g.moveTo(sx + TILE - 5, sy);
          g.lineTo(sx + TILE - 5, sy + TILE);
        } else {
          g.moveTo(sx, sy + 5);
          g.lineTo(sx + TILE, sy + 5);
          g.moveTo(sx, sy + TILE - 5);
          g.lineTo(sx + TILE, sy + TILE - 5);
        }
        g.stroke();
        continue;
      }
      // 路面の砂利。帯の中だけに散らす
      g.fillStyle = 'rgba(150,128,86,0.4)';
      for (let i = 0; i < 6; i++) {
        const px = sx + 9 + noise(x * 11 + i, y) * (TILE - 18);
        const py = sy + 9 + noise(x, y * 11 + i) * (TILE - 18);
        g.fillRect(px, py, 3, 2);
      }
    }
  }
}

// ------------------------------------------------------------------ 焼き

let cache: HTMLCanvasElement | undefined;
let cacheKey = '';

/**
 * 盤面ぜんぶを一枚に焼いて返す。中身が変わっていなければ焼き直さない。
 * 呼び出し側はこれを camera の分だけずらして貼るだけでよい。
 */
export function groundCanvas(visited: ReadonlySet<string>, opened: ReadonlySet<string>): HTMLCanvasElement {
  const key = `${MAP_W}x${MAP_H}|${MAP.join('')}|${[...visited].sort().join()}|${[...opened].sort().join()}`;
  if (cache && cacheKey === key) return cache;

  const w = MAP_W * TILE;
  const h = MAP_H * TILE;
  const cv = cache && cache.width === w && cache.height === h ? cache : document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const g = cv.getContext('2d')!;
  familyMemo = new Map();

  paintGround(g, w, h);
  drawRoads(g);
  // 物は上から下へ。手前のものが奥のものに重なる
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) drawFeature(g, x, y, visited, opened);
  }

  cache = cv;
  cacheKey = key;
  return cv;
}
