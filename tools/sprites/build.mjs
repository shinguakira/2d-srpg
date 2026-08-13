// Renders every character sheet and emits the metadata the game reads.
//
//   node tools/sprites/build.mjs
//
// Output: src/assets/sprites/<id>-battle.png plus
// src/components/sprites/generatedSheets.ts. The generator is the source of
// truth for this art — edit the character modules, never the PNGs.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Canvas, SS } from './raster.mjs';
import { encodePNG } from './png.mjs';

import shigeru from './characters/shigeru.mjs';
import akira from './characters/akira.mjs';
import takeshi from './characters/takeshi.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CHARACTERS = [shigeru, akira, takeshi];

/** Render one pose into its own frame-sized canvas, outlined and downsampled. */
function renderFrame(ch, p) {
  const c = new Canvas(ch.frameW * SS, ch.frameH * SS);
  c.save();
  c.scale(SS);
  c.translate(ch.origin[0], ch.origin[1]);
  ch.draw(c, p);
  c.restore();
  c.outline(ch.outline ?? '#0d0a14', SS);
  return c.downsample(SS);
}

function buildSheet(ch) {
  const slots = Object.values(ch.clips).map((cl) => cl.slot + cl.poses.length);
  const rows = Math.ceil(Math.max(...slots) / ch.cols);
  const sheet = new Canvas(ch.cols * ch.frameW, rows * ch.frameH);

  // A pose that reaches past the frame is silently cropped by the blit and only
  // shows up as a sword with no tip once it is in the game, so say so here.
  const clipped = [];
  for (const [name, clip] of Object.entries(ch.clips)) {
    clip.poses.forEach((p, i) => {
      const n = clip.slot + i;
      const frame = renderFrame(ch, p);
      const b = frame.bounds();
      if (b && (b.x0 <= 0 || b.y0 <= 0 || b.x1 >= ch.frameW - 1 || b.y1 >= ch.frameH - 1)) {
        const sides = [
          b.x0 <= 0 ? 'L' : '',
          b.y0 <= 0 ? 'T' : '',
          b.x1 >= ch.frameW - 1 ? 'R' : '',
          b.y1 >= ch.frameH - 1 ? 'B' : '',
        ].join('');
        clipped.push(`${name}[${i}]:${sides}`);
      }
      frame.blitTo(sheet, (n % ch.cols) * ch.frameW, Math.floor(n / ch.cols) * ch.frameH);
    });
  }
  if (clipped.length > 0) {
    console.warn(`  ! ${ch.id}: art touches the frame edge in ${clipped.join(', ')}`);
  }

  const png = encodePNG(sheet.w, sheet.h, sheet.data);
  const file = path.join(ROOT, 'src/assets/sprites', `${ch.id}-battle.png`);
  writeFileSync(file, png);

  return {
    id: ch.id,
    rows,
    sheetW: sheet.w,
    sheetH: sheet.h,
    bytes: png.length,
  };
}

function tsClip(name, clip) {
  const frames = clip.poses.map((_, i) => clip.slot + i);
  return `    ${name}: { frames: [${frames.join(', ')}], fps: ${clip.fps}, loop: ${clip.loop} },`;
}

function emitTs(built) {
  const imports = built
    .map((b) => `import ${b.id}Sheet from '../../assets/sprites/${b.id}-battle.png';`)
    .join('\n');

  const entries = built
    .map((b) => {
      const ch = b.ch;
      return `  ${ch.id}: {
    url: ${ch.id}Sheet,
    cols: ${ch.cols},
    rows: ${b.rows},
    sheetW: ${b.sheetW},
    sheetH: ${b.sheetH},
    pixelArt: false,
    content: {
      cx: ${(ch.origin[0] / ch.frameW).toFixed(4)},
      bottom: ${(ch.origin[1] / ch.frameH).toFixed(4)},
      height: ${(ch.charHeight / ch.frameH).toFixed(4)},
    },
    clips: {
${Object.entries(ch.clips)
  .map(([n, cl]) => tsClip(n, cl))
  .join('\n')}
    },
  },`;
    })
    .join('\n');

  const out = `/**
 * GENERATED — do not edit. Run \`node tools/sprites/build.mjs\`.
 *
 * These three sheets are drawn by posing a rig rather than by hand, so the
 * frame numbers, sheet size and anchor below are measured at build time and can
 * never drift from the PNG the way hand-written values did.
 */
${imports}
import type { SpriteSheet } from './spriteSheetConfig';

export const GENERATED_SHEETS: Record<string, SpriteSheet> = {
${entries}
};
`;
  writeFileSync(path.join(ROOT, 'src/components/sprites/generatedSheets.ts'), out);
}

const built = CHARACTERS.map((ch) => ({ ...buildSheet(ch), ch }));
emitTs(built);

for (const b of built) {
  const frames = Object.values(b.ch.clips).reduce((n, c) => n + c.poses.length, 0);
  console.log(
    `${b.id.padEnd(10)} ${b.sheetW}x${b.sheetH}  ${b.ch.cols}x${b.rows} grid  ` +
      `${frames} frames  ${(b.bytes / 1024).toFixed(0)} KB`,
  );
}
