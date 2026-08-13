// A tiny 2D rasteriser: polygons, a transform stack, cel-shaded "parts" and a
// silhouette outline pass. Everything is drawn hard-edged at SS× resolution and
// box-downsampled at the end, so edges come out clean without any per-primitive
// antialiasing logic.

/** Supersampling factor. Draw big, shrink once. */
export const SS = 3;

function parseHex(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
    h.length >= 8 ? parseInt(h.slice(6, 8), 16) : 255,
  ];
}

/** Mix two hex colours. `t` 0 = a, 1 = b. */
export function mix(a, b, t) {
  const ca = parseHex(a);
  const cb = parseHex(b);
  const c = [0, 1, 2].map((i) => Math.round(ca[i] + (cb[i] - ca[i]) * t));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
}

/** Lighten (t > 0) or darken (t < 0) a hex colour. */
export function tone(hex, t) {
  return t >= 0 ? mix(hex, '#ffffff', t) : mix(hex, '#000000', -t);
}

// ===== transforms =====

const IDENTITY = [1, 0, 0, 1, 0, 0]; // a b c d e f  ->  x' = ax + cy + e

function mul(m, n) {
  return [
    m[0] * n[0] + m[2] * n[1],
    m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3],
    m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4],
    m[1] * n[4] + m[3] * n[5] + m[5],
  ];
}

// ===== polygon helpers =====

/**
 * Miter-offset a polygon outward by `d`.
 *
 * Offsetting each vertex away from the centroid instead would inflate a long
 * thin limb far more along its length than across it, which is exactly the
 * shape most of these parts are.
 */
export function inflate(pts, d) {
  const n = pts.length;
  if (n < 3) return pts;
  // Positive area means counter-clockwise in screen space (y down).
  let area = 0;
  for (let i = 0; i < n; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % n];
    area += x1 * y2 - x2 * y1;
  }
  const sign = area < 0 ? 1 : -1;

  const lines = [];
  for (let i = 0; i < n; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % n];
    let dx = x2 - x1;
    let dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    const nx = -dy * sign * d;
    const ny = dx * sign * d;
    lines.push([x1 + nx, y1 + ny, x2 + nx, y2 + ny]);
  }

  const out = [];
  const limit = Math.abs(d) * 3.5;
  for (let i = 0; i < n; i++) {
    const prev = lines[(i - 1 + n) % n];
    const cur = lines[i];
    const p = intersect(prev, cur);
    // Two nearly-parallel edges meet at a miter point approaching infinity. On
    // a thin zigzag — a mane, a cape edge — that draws a spike clean across the
    // sheet, so cap the miter and fall back to the plain offset vertex.
    if (p && Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]) <= limit) out.push(p);
    else out.push([cur[0], cur[1]]);
  }
  return out;
}

function intersect(a, b) {
  const [x1, y1, x2, y2] = a;
  const [x3, y3, x4, y4] = b;
  const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(d) < 1e-6) return null;
  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d;
  return [x1 + t * (x2 - x1), y1 + t * (y2 - y1)];
}

/** A rounded tapered bar between two points — the shape of every limb. */
export function capsule(a, b, ra, rb, seg = 10) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const ang = Math.atan2(uy, ux);
  const pts = [];
  for (let i = 0; i <= seg; i++) {
    const t = ang - Math.PI / 2 + (Math.PI * i) / seg;
    pts.push([b[0] + Math.cos(t) * rb, b[1] + Math.sin(t) * rb]);
  }
  for (let i = 0; i <= seg; i++) {
    const t = ang + Math.PI / 2 + (Math.PI * i) / seg;
    pts.push([a[0] + Math.cos(t) * ra, a[1] + Math.sin(t) * ra]);
  }
  return pts;
}

/** An axis-aligned ellipse as a polygon. */
export function ellipse(cx, cy, rx, ry, seg = 24) {
  const pts = [];
  for (let i = 0; i < seg; i++) {
    const t = (Math.PI * 2 * i) / seg;
    pts.push([cx + Math.cos(t) * rx, cy + Math.sin(t) * ry]);
  }
  return pts;
}

/** Linear interpolation between two points. */
export function lerp2(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

// ===== canvas =====

export class Canvas {
  constructor(w, h) {
    this.w = Math.round(w);
    this.h = Math.round(h);
    w = this.w;
    h = this.h;
    this.data = new Uint8ClampedArray(w * h * 4);
    this.m = IDENTITY;
    this.stack = [];
  }

  save() {
    this.stack.push(this.m);
    return this;
  }
  restore() {
    this.m = this.stack.pop() ?? IDENTITY;
    return this;
  }
  translate(x, y) {
    this.m = mul(this.m, [1, 0, 0, 1, x, y]);
    return this;
  }
  rotate(deg) {
    const r = (deg * Math.PI) / 180;
    const c = Math.cos(r);
    const s = Math.sin(r);
    this.m = mul(this.m, [c, s, -s, c, 0, 0]);
    return this;
  }
  scale(sx, sy = sx) {
    this.m = mul(this.m, [sx, 0, 0, sy, 0, 0]);
    return this;
  }

  xf(p) {
    const m = this.m;
    return [m[0] * p[0] + m[2] * p[1] + m[4], m[1] * p[0] + m[3] * p[1] + m[5]];
  }

  /** Even-odd scanline fill in device space. */
  poly(pts, color) {
    if (pts.length < 3) return this;
    const [r, g, b, a] = parseHex(color);
    const p = pts.map((q) => this.xf(q));
    let minY = Infinity;
    let maxY = -Infinity;
    for (const [, y] of p) {
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    const y0 = Math.max(0, Math.floor(minY));
    const y1 = Math.min(this.h - 1, Math.ceil(maxY));
    const xs = [];
    for (let y = y0; y <= y1; y++) {
      const sy = y + 0.5;
      xs.length = 0;
      for (let i = 0; i < p.length; i++) {
        const [ax, ay] = p[i];
        const [bx, by] = p[(i + 1) % p.length];
        if (ay === by) continue;
        if (sy >= Math.min(ay, by) && sy < Math.max(ay, by)) {
          xs.push(ax + ((sy - ay) / (by - ay)) * (bx - ax));
        }
      }
      if (xs.length < 2) continue;
      xs.sort((u, v) => u - v);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const sx0 = Math.max(0, Math.round(xs[k]));
        const sx1 = Math.min(this.w - 1, Math.round(xs[k + 1]) - 1);
        for (let x = sx0; x <= sx1; x++) {
          const o = (y * this.w + x) * 4;
          if (a === 255) {
            this.data[o] = r;
            this.data[o + 1] = g;
            this.data[o + 2] = b;
            this.data[o + 3] = 255;
          } else {
            const na = a / 255;
            const oa = this.data[o + 3] / 255;
            const outA = na + oa * (1 - na);
            this.data[o] = (r * na + this.data[o] * oa * (1 - na)) / (outA || 1);
            this.data[o + 1] = (g * na + this.data[o + 1] * oa * (1 - na)) / (outA || 1);
            this.data[o + 2] = (b * na + this.data[o + 2] * oa * (1 - na)) / (outA || 1);
            this.data[o + 3] = outA * 255;
          }
        }
      }
    }
    return this;
  }

  /**
   * A shaded body part: dark contour, base fill, then a highlight and a shadow
   * inset from opposite edges. This is what gives the sheets their cel look —
   * three flat tones per material rather than a gradient.
   */
  part(pts, c) {
    // Widths are in final frame pixels; the SS scale is already on the matrix.
    const lw = c.lw ?? 1.7;
    if (c.line) this.poly(inflate(pts, lw), c.line);
    this.poly(pts, c.base);
    // Deflating a polygon narrower than the inset turns it inside out, which
    // paints a shadow *outside* the part. Skip the tone on parts that small.
    // Light comes from up-and-forward, i.e. the way the art faces. Lighting
    // from the upper *left* instead puts every face in shadow, since these
    // sprites are all drawn facing right.
    const size = extent(pts);
    if (c.light && size > 5) this.poly(shift(inflate(pts, -1.3), 1.2, -1.2), c.light);
    if (c.shade && size > 8) this.poly(shift(inflate(pts, -2.6), -1.8, 2.2), c.shade);
    return this;
  }

  /** Every transparent pixel touching art becomes `color`, `n` times over. */
  outline(color, n = SS) {
    const [r, g, b] = parseHex(color);
    for (let pass = 0; pass < n; pass++) {
      const src = new Uint8ClampedArray(this.data);
      for (let y = 0; y < this.h; y++) {
        for (let x = 0; x < this.w; x++) {
          const o = (y * this.w + x) * 4;
          if (src[o + 3] !== 0) continue;
          let touch = false;
          for (const [dx, dy] of [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ]) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= this.w || ny >= this.h) continue;
            if (src[(ny * this.w + nx) * 4 + 3] > 128) {
              touch = true;
              break;
            }
          }
          if (!touch) continue;
          this.data[o] = r;
          this.data[o + 1] = g;
          this.data[o + 2] = b;
          this.data[o + 3] = 255;
        }
      }
    }
    return this;
  }

  /** Box-downsample by `f` into a new canvas. */
  downsample(f) {
    const out = new Canvas(Math.round(this.w / f), Math.round(this.h / f));
    for (let y = 0; y < out.h; y++) {
      for (let x = 0; x < out.w; x++) {
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;
        let n = 0;
        for (let sy = y * f; sy < (y + 1) * f; sy++) {
          for (let sx = x * f; sx < (x + 1) * f; sx++) {
            if (sx >= this.w || sy >= this.h) continue;
            const o = (sy * this.w + sx) * 4;
            const al = this.data[o + 3] / 255;
            r += this.data[o] * al;
            g += this.data[o + 1] * al;
            b += this.data[o + 2] * al;
            a += al;
            n++;
          }
        }
        if (n === 0 || a === 0) continue;
        const o = (y * out.w + x) * 4;
        out.data[o] = r / a;
        out.data[o + 1] = g / a;
        out.data[o + 2] = b / a;
        out.data[o + 3] = (a / n) * 255;
      }
    }
    return out;
  }

  blitTo(dst, dx, dy) {
    for (let y = 0; y < this.h; y++) {
      const ty = y + dy;
      if (ty < 0 || ty >= dst.h) continue;
      for (let x = 0; x < this.w; x++) {
        const tx = x + dx;
        if (tx < 0 || tx >= dst.w) continue;
        const o = (y * this.w + x) * 4;
        if (this.data[o + 3] === 0) continue;
        const t = (ty * dst.w + tx) * 4;
        dst.data[t] = this.data[o];
        dst.data[t + 1] = this.data[o + 1];
        dst.data[t + 2] = this.data[o + 2];
        dst.data[t + 3] = this.data[o + 3];
      }
    }
  }

  /** Tight bounding box of non-transparent pixels, or null if empty. */
  bounds() {
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (this.data[(y * this.w + x) * 4 + 3] < 8) continue;
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
    return x1 < x0 ? null : { x0, y0, x1, y1 };
  }
}

function shift(pts, dx, dy) {
  return pts.map(([x, y]) => [x + dx, y + dy]);
}

/** Smaller side of a polygon's bounding box. */
function extent(pts) {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const [x, y] of pts) {
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  return Math.min(x1 - x0, y1 - y0);
}
