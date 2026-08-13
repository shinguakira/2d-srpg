// Indexed pixel-art authoring.
//
// The GBA Fire Emblem battle sprites this game is imitating are 32-34px tall,
// use a 16-colour palette (15 + transparency) shared across materials, and are
// outlined in #282828 rather than black. None of that survives being drawn as
// smooth polygons and scaled down, so characters here are written out pixel by
// pixel against a fixed palette instead.
//
// A character is a palette map (single char -> hex) plus rows of those chars.
// '.' is always transparent.

import { Canvas } from './raster.mjs';

/** The outline value every GBA FE animation uses. Not black. */
export const OUTLINE = '#282828';

function parseHex(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/**
 * Turn rows of palette keys into a Canvas.
 *
 * Rows shorter than `width` are padded with transparency rather than throwing,
 * so a miscounted row shows up as a visible gap instead of corrupting the whole
 * image. Unknown keys are reported: a typo'd colour must not silently vanish.
 */
export function fromRows(rows, palette, width) {
  const w = width ?? Math.max(...rows.map((r) => r.length));
  const c = new Canvas(w, rows.length);
  const unknown = new Set();
  rows.forEach((row, y) => {
    for (let x = 0; x < w; x++) {
      const k = row[x] ?? '.';
      if (k === '.' || k === ' ') continue;
      const hex = palette[k];
      if (!hex) {
        unknown.add(k);
        continue;
      }
      const [r, g, b] = parseHex(hex);
      const o = (y * w + x) * 4;
      c.data[o] = r;
      c.data[o + 1] = g;
      c.data[o + 2] = b;
      c.data[o + 3] = 255;
    }
  });
  if (unknown.size > 0) {
    console.warn(`  ! unknown palette keys: ${[...unknown].join(' ')}`);
  }
  const ragged = rows.map((r, i) => [i, r.length]).filter(([, n]) => n !== w);
  if (ragged.length > 0) {
    console.warn(`  ! rows not ${w} wide: ${ragged.map(([i, n]) => `${i}=${n}`).join(' ')}`);
  }
  return c;
}

/** Nearest-neighbour zoom by an integer factor. */
export function zoom(src, f) {
  const out = new Canvas(src.w * f, src.h * f);
  for (let y = 0; y < out.h; y++) {
    for (let x = 0; x < out.w; x++) {
      const s = (Math.floor(y / f) * src.w + Math.floor(x / f)) * 4;
      const o = (y * out.w + x) * 4;
      out.data[o] = src.data[s];
      out.data[o + 1] = src.data[s + 1];
      out.data[o + 2] = src.data[s + 2];
      out.data[o + 3] = src.data[s + 3];
    }
  }
  return out;
}

/** Count distinct colours actually used — the 15-colour budget is a hard rule. */
export function countColours(c) {
  const seen = new Set();
  for (let i = 0; i < c.data.length; i += 4) {
    if (c.data[i + 3] === 0) continue;
    seen.add((c.data[i] << 16) | (c.data[i + 1] << 8) | c.data[i + 2]);
  }
  return seen.size;
}

/** Height of the drawn figure in pixels, for checking against FE's 32-34. */
export function figureHeight(c) {
  const b = c.bounds();
  return b ? b.y1 - b.y0 + 1 : 0;
}
