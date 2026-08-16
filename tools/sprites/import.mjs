// Import art produced elsewhere (PixelLab, Retro Diffusion, Aseprite) and turn
// it into something the game can use.
//
//   node tools/sprites/import.mjs <png> <id> --cols 8 --rows 6 \
//     [--quantise 15] [--char-height 31]
//   node tools/sprites/import.mjs <png> <id> --portrait [--quantise 16]
//
// The second form is for dialogue portraits: same cleanup, but it writes to
// src/assets/portraits/<id>.png and prints no sheet metadata, because a
// portrait is one picture and has no frames, clips or anchor.
//
// What it enforces, because generated art drifts from the spec in exactly these
// ways every time:
//
//   - at most 15 colours plus transparency
//   - #282828 as the outline value, not black — near-black pixels are snapped
//   - every frame the same size, sliced on an exact grid
//   - the anchor measured from the art rather than typed in by hand
//
// It writes src/assets/sprites/<id>-battle.png and prints the SpriteSheet entry
// to paste into generatedSheets.ts.

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodePNG } from './pngRead.mjs';
import { encodePNG } from './png.mjs';

/**
 * The line-work colour every sheet in this game shares. Not `#000000`, which is
 * what generators reach for and what makes imported art stop matching the rest
 * of the set. Measured off real GBA Fire Emblem sprites.
 */
const OUTLINE = '#282828';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function arg(name, fallback) {
  const i = process.argv.indexOf('--' + name);
  return i > 0 ? process.argv[i + 1] : fallback;
}

const file = process.argv[2];
const id = process.argv[3];
if (!file || !id) {
  console.error(
    'usage: import.mjs <png> <id> --cols N --rows N [--quantise 15] [--char-height 31]\n' +
      '       import.mjs <png> <id> --portrait [--quantise 16]',
  );
  process.exit(1);
}

const isPortrait = process.argv.includes('--portrait');
const cols = isPortrait ? 1 : Number(arg('cols', 1));
const rows = isPortrait ? 1 : Number(arg('rows', 1));
const maxColours = Number(arg('quantise', isPortrait ? 16 : 15));
const png = decodePNG(readFileSync(file));

if (png.width % cols !== 0 || png.height % rows !== 0) {
  console.warn(
    `  ! ${png.width}x${png.height} does not divide evenly into ${cols}x${rows} — ` +
      `frames will be ${(png.width / cols).toFixed(2)}x${(png.height / rows).toFixed(2)}. ` +
      'Crop the sheet or fix the grid before shipping it.',
  );
}

const data = new Uint8ClampedArray(png.data);
const key = (i) => (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
const hex = (k) => '#' + k.toString(16).padStart(6, '0');

// Alpha is binary in pixel art. Generated frames arrive with a soft edge, and
// keeping it means every sprite has a halo the hand-drawn ones do not — and it
// inflates the colour count with dozens of shades that only exist at the
// silhouette.
const ALPHA_CUT = 128;
for (let i = 3; i < data.length; i += 4) {
  data[i] = data[i] < ALPHA_CUT ? 0 : 255;
}

// Reduce to the colour budget by median cut.
//
// The obvious quantiser — keep the N most common colours, remap the rest to
// their nearest survivor — is wrong for this input and fails silently. A
// smooth-shaded generated sheet arrives with thousands of colours, almost all
// of them one-step variations, and the most *frequent* ones are all shades of
// the outline: the top 15 came back as fifteen versions of #282828 and every
// pixel in the sheet snapped to black. Frequency says nothing about coverage.
//
// Median cut picks a palette that spans the colours actually present: put every
// pixel in one box, repeatedly split the box with the widest channel at its
// median, and average what lands in each. Rare colours survive if they are the
// only thing in their region — which is exactly what an accent like the gold
// trim is.
const counts = new Map();
for (let i = 0; i < data.length; i += 4) {
  if (data[i + 3] < 8) continue;
  counts.set(key(i), (counts.get(key(i)) ?? 0) + 1);
}
const before = counts.size;

const dist = (a, b) => {
  const dr = ((a >> 16) & 255) - ((b >> 16) & 255);
  const dg = ((a >> 8) & 255) - ((b >> 8) & 255);
  const db = (a & 255) - (b & 255);
  return dr * dr + dg * dg + db * db;
};

let palette = [...counts.keys()];
if (palette.length > maxColours) {
  const chan = (c, k) => (c >> (16 - k * 8)) & 255;
  let boxes = [[...counts.entries()]];
  while (boxes.length < maxColours) {
    // Split the box that spans the most colour, weighted by how many pixels it
    // covers — a wide box holding four pixels is not worth a palette slot.
    let best = -1;
    let bestScore = 0;
    boxes.forEach((box, i) => {
      if (box.length < 2) return;
      let span = 0;
      let n = 0;
      for (let k = 0; k < 3; k++) {
        let lo = 255;
        let hi = 0;
        for (const [c] of box) {
          const v = chan(c, k);
          if (v < lo) lo = v;
          if (v > hi) hi = v;
        }
        span = Math.max(span, hi - lo);
      }
      for (const [, count] of box) n += count;
      const score = span * Math.cbrt(n);
      if (score > bestScore) {
        bestScore = score;
        best = i;
      }
    });
    if (best < 0) break;

    const box = boxes[best];
    let axis = 0;
    let widest = -1;
    for (let k = 0; k < 3; k++) {
      let lo = 255;
      let hi = 0;
      for (const [c] of box) {
        const v = chan(c, k);
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
      if (hi - lo > widest) {
        widest = hi - lo;
        axis = k;
      }
    }
    box.sort((a, b) => chan(a[0], axis) - chan(b[0], axis));
    // Split at the pixel-weighted median, not the middle of the list, so a
    // colour covering half the sheet is not averaged away with its neighbours.
    const total = box.reduce((s, [, n]) => s + n, 0);
    let acc = 0;
    let cut = 1;
    for (let i = 0; i < box.length - 1; i++) {
      acc += box[i][1];
      if (acc * 2 >= total) {
        cut = i + 1;
        break;
      }
    }
    boxes.splice(best, 1, box.slice(0, cut), box.slice(cut));
  }

  palette = boxes.map((box) => {
    let r = 0;
    let g = 0;
    let b = 0;
    let n = 0;
    for (const [c, count] of box) {
      r += chan(c, 0) * count;
      g += chan(c, 1) * count;
      b += chan(c, 2) * count;
      n += count;
    }
    return (Math.round(r / n) << 16) | (Math.round(g / n) << 8) | Math.round(b / n);
  });

  const remap = new Map();
  for (const c of counts.keys()) {
    remap.set(
      c,
      palette.reduce((best, k) => (dist(c, k) < dist(c, best) ? k : best), palette[0]),
    );
  }
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 8) continue;
    const to = remap.get(key(i));
    if (to == null) continue;
    data[i] = (to >> 16) & 255;
    data[i + 1] = (to >> 8) & 255;
    data[i + 2] = to & 255;
  }
}

// Snap anything that is trying to be black to the outline value, and do it
// *after* quantising: generators reach for #000000 constantly, it is the single
// loudest way the art stops matching the rest of the set, and median cut would
// otherwise average the line work back off the mark. This runs last so the
// palette printed below is the palette in the file.
const [orr, org, orb] = [1, 3, 5].map((s) => parseInt(OUTLINE.slice(s, s + 2), 16));
let snapped = 0;
for (let i = 0; i < data.length; i += 4) {
  if (data[i + 3] < 8) continue;
  if (data[i] < 40 && data[i + 1] < 40 && data[i + 2] < 40 && key(i) !== 0x282828) {
    data[i] = orr;
    data[i + 1] = org;
    data[i + 2] = orb;
    snapped++;
  }
}
palette = [
  ...new Set(
    Array.from({ length: data.length / 4 }, (_, p) => (data[p * 4 + 3] < 8 ? null : key(p * 4)))
      .filter((c) => c != null)
      .values(),
  ),
];

// Measure the anchor off frame 0 rather than trusting a hand-typed number.
const fw = Math.floor(png.width / cols);
const fh = Math.floor(png.height / rows);
let x0 = fw;
let y0 = fh;
let x1 = -1;
let y1 = -1;
for (let y = 0; y < fh; y++) {
  for (let x = 0; x < fw; x++) {
    if (data[(y * png.width + x) * 4 + 3] < 8) continue;
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
}
const charHeight = Number(arg('char-height', y1 - y0 + 1));

// Warn when a frame's art runs into the edge of its cell. An overhead sword
// swing once came back with the raised hand sliced off at the top of two
// frames and nothing said so.
const clipped = [];
for (let f = 0; f < cols * rows; f++) {
  const ox = (f % cols) * fw;
  const oy = Math.floor(f / cols) * fh;
  const at = (x, y) => data[((oy + y) * png.width + ox + x) * 4 + 3] >= 8;
  const cols_ = [...Array(fw).keys()];
  const rows_ = [...Array(fh).keys()];
  const sides = [
    cols_.some((x) => at(x, 0)) && 'T',
    cols_.some((x) => at(x, fh - 1)) && 'B',
    rows_.some((y) => at(0, y)) && 'L',
    rows_.some((y) => at(fw - 1, y)) && 'R',
  ].filter(Boolean);
  if (sides.length) clipped.push(`${f}${sides.join('')}`);
}
if (clipped.length) {
  console.warn(
    `  ! art touches the frame edge and is being cut off: ${clipped.join(' ')}\n` +
      `    (T/B/L/R). Give the source more margin — see pixellab.mjs canvas.`,
  );
}

const out = isPortrait
  ? path.join(ROOT, 'src/assets/portraits', `${id}.png`)
  : path.join(ROOT, 'src/assets/sprites', `${id}-battle.png`);
writeFileSync(out, encodePNG(png.width, png.height, data));

console.log(`${file} -> ${path.relative(ROOT, out)}`);
console.log(`  colours  ${before} -> ${palette.length} (budget ${maxColours})`);
if (snapped) console.log(`  outline  ${snapped}px snapped to ${OUTLINE}`);
console.log(`  palette  ${palette.map(hex).join(' ')}`);

if (isPortrait) {
  console.log(`  size     ${png.width}x${png.height}, art ${x1 - x0 + 1}x${y1 - y0 + 1}`);
  console.log('\n  Nothing else to do — portraits.ts globs the directory.');
  process.exit(0);
}

console.log(`  sheet    ${png.width}x${png.height}  ${cols}x${rows}  frame ${fw}x${fh}`);
console.log(`  art      ${x1 - x0 + 1}x${y1 - y0 + 1} in frame 0, figure height ${charHeight}px`);
console.log(`
  ${id}: {
    url: ${id}Sheet,
    cols: ${cols},
    rows: ${rows},
    sheetW: ${png.width},
    sheetH: ${png.height},
    // Nearest only for genuinely low-resolution art. Judged on the character,
    // not the frame: padding a 57px figure into a 128px canvas for headroom
    // leaves it just as low-resolution as it was, and keying off frame height
    // silently turned nearest off the first time that happened.
    pixelArt: ${charHeight <= 72},
    content: {
      cx: ${(((x0 + x1) / 2 + 0.5) / fw).toFixed(4)},
      bottom: ${((y1 + 1) / fh).toFixed(4)},
      height: ${(charHeight / fh).toFixed(4)},
    },
    clips: { /* frames per clip go here */ },
  },`);
