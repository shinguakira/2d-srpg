// The weapon is not part of the generated art. It is drawn from the rig.
//
//   node tools/sprites/weapon.mjs strip <in.png> <out.png> --box x0,y0,x1,y1
//   node tools/sprites/weapon.mjs draw  <sheet.png> <out.png> [--length 20]
//
// animate-with-skeleton poses a human and nothing else: its label set is
// eighteen anatomical joints and there is no keypoint for a held object. So the
// model has no way to know the blade belongs to the hand. Given a big arm
// rotation it leaves the sword standing where the reference put it, or drops it
// — measured on the first pass, the attack clip raised the arm overhead while
// the sword stayed planted on the ground beside him.
//
// The fix is to stop asking. `strip` cuts the weapon out of the reference so
// the model only ever draws a person, and `draw` puts the blade back on every
// frame at the hand keypoint from poses.mjs, angled along the forearm. Where
// the hand is, is known exactly — it is an input to the generator, not a guess
// about its output.

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { decodePNG } from './pngRead.mjs';
import { encodePNG } from './png.mjs';
import { CLIP_NAMES, FRAMES, posePixels } from './poses.mjs';

function arg(name, fallback) {
  const i = process.argv.indexOf('--' + name);
  return i > 0 ? process.argv[i + 1] : fallback;
}

/** Shigeru's blade, sampled off the approved base before it was cut out. */
const STEEL = {
  edge: [0x2c, 0x2b, 0x2c],
  dark: [0x78, 0x61, 0x55],
  mid: [0xa4, 0x9e, 0xa8],
  light: [0xdd, 0xd5, 0xd1],
  gold: [0x9a, 0x73, 0x23],
};

const [, , cmd, inFile, outFile] = process.argv;

if (cmd === 'strip') {
  const png = decodePNG(readFileSync(path.resolve(inFile)));
  const [x0, y0, x1, y1] = (arg('box') ?? '').split(',').map(Number);
  if ([x0, y0, x1, y1].some(Number.isNaN)) {
    console.error('strip needs --box x0,y0,x1,y1');
    process.exit(1);
  }
  const data = new Uint8ClampedArray(png.data);
  let cut = 0;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = (y * png.width + x) * 4;
      if (data[i + 3] < 8) continue;
      data[i + 3] = 0;
      cut++;
    }
  }
  writeFileSync(path.resolve(outFile), encodePNG(png.width, png.height, data));
  console.log(`${inFile} -> ${outFile}: cut ${cut}px from ${x0},${y0}..${x1},${y1}`);
} else if (cmd === 'draw') {
  const png = decodePNG(readFileSync(path.resolve(inFile)));
  const fw = png.height; // square frames, laid out in one row
  const n = Math.round(png.width / fw);
  if (n !== CLIP_NAMES.length * FRAMES) {
    console.error(`sheet has ${n} frames, poses.mjs describes ${CLIP_NAMES.length * FRAMES}`);
    process.exit(1);
  }
  const data = new Uint8ClampedArray(png.data);

  const put = (fx, x, y, rgb) => {
    if (x < 0 || y < 0 || x >= fw || y >= fw) return;
    const i = (y * png.width + fx * fw + x) * 4;
    data[i] = rgb[0];
    data[i + 1] = rgb[1];
    data[i + 2] = rgb[2];
    data[i + 3] = 255;
  };

  // A straight blade along `dir`, with a one-pixel dark edge either side and a
  // crossguard across the hand. Drawn per pixel rather than through the polygon
  // rasteriser: at this size a 3px-wide bar wants exact pixels, and anything
  // anti-aliased has to be quantised back out again by import.mjs anyway.
  const line = (fx, ax, ay, bx, by, rgb) => {
    const steps = Math.max(Math.abs(bx - ax), Math.abs(by - ay));
    for (let s = 0; s <= steps; s++) {
      const t = steps === 0 ? 0 : s / steps;
      put(fx, Math.round(ax + (bx - ax) * t), Math.round(ay + (by - ay) * t), rgb);
    }
  };

  const length = Number(arg('length', Math.round(fw * 0.3)));
  const guard = Number(arg('guard', Math.max(3, Math.round(fw * 0.06))));

  let drawn = 0;
  CLIP_NAMES.forEach((clip, c) => {
    for (let f = 0; f < FRAMES; f++) {
      const fx = c * FRAMES + f;
      const pose = posePixels(clip, f, fw);
      const hand = pose['LEFT ARM'];
      const elbow = pose['LEFT ELBOW'];
      let dx = hand[0] - elbow[0];
      let dy = hand[1] - elbow[1];
      const len = Math.hypot(dx, dy) || 1;
      dx /= len;
      dy /= len;
      const px = -dy;
      const py = dx;

      const tipX = hand[0] + dx * length;
      const tipY = hand[1] + dy * length;

      // Edge, then core, so the core overwrites the middle of the dark bar.
      for (const off of [-1.5, 1.5]) {
        line(
          fx,
          hand[0] + px * off,
          hand[1] + py * off,
          tipX + px * off,
          tipY + py * off,
          STEEL.edge,
        );
      }
      line(fx, hand[0] + px * 0.6, hand[1] + py * 0.6, tipX + px * 0.6, tipY + py * 0.6, STEEL.mid);
      line(
        fx,
        hand[0] - px * 0.6,
        hand[1] - py * 0.6,
        tipX - px * 0.6,
        tipY - py * 0.6,
        STEEL.light,
      );
      put(fx, Math.round(tipX), Math.round(tipY), STEEL.edge);

      // Crossguard across the hand, and a pommel a little back up the forearm.
      line(
        fx,
        hand[0] - px * guard,
        hand[1] - py * guard,
        hand[0] + px * guard,
        hand[1] + py * guard,
        STEEL.gold,
      );
      put(fx, Math.round(hand[0] - dx * 2), Math.round(hand[1] - dy * 2), STEEL.dark);
      drawn++;
    }
  });

  writeFileSync(path.resolve(outFile), encodePNG(png.width, png.height, data));
  console.log(`${inFile} -> ${outFile}: blade drawn on ${drawn} frames, ${length}px long`);
} else {
  console.error(
    'usage:\n' +
      '  strip <in.png> <out.png> --box x0,y0,x1,y1\n' +
      '  draw  <sheet.png> <out.png> [--length 20] [--guard 4]',
  );
  process.exit(1);
}
