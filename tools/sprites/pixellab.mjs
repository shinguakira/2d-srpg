// Generate a character's art through the PixelLab API and drop it straight into
// the game.
//
//   node tools/sprites/pixellab.mjs balance
//   node tools/sprites/pixellab.mjs gen <id> "<description>" [--ref <png>] [--size 64]
//   node tools/sprites/pixellab.mjs portrait <id> "<description>" [--size 128]
//   node tools/sprites/pixellab.mjs rotate <id> <png> --dirs 4
//
// One image per command, by design. See AGENTS.md: a sheet is one generation,
// because separate calls are separate diffusion samples and return separate
// drawings of a similar character. The multi-call `sheet` command that used to
// live here produced twenty-one different Shigerus and has been removed.
//
// The key lives in .env.local as PIXELLAB_SECRET and is never printed. Output
// lands in tools/sprites/out/, then `import.mjs` is what puts it in the game —
// this file only talks to the API.
//
// This calls the REST endpoints directly rather than through
// @pixellab-code/pixellab. The SDK validates responses against a `usage` shape
// the service no longer returns — it now bills in generations, not dollars — so
// every successful animate call came back as "Response validation failed" after
// the money had already been spent. The wire format is four fields; a stale
// schema in front of it is worse than none.
//
// House spec, applied to every request so generated art matches what is already
// on the field: 15 colours plus transparency, #282828 outline, no background,
// side view facing east.

import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodePNG } from './pngRead.mjs';
import { encodePNG } from './png.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = path.join(ROOT, 'tools/sprites/out');
const BASE = process.env.PIXELLAB_BASE_URL ?? 'https://api.pixellab.ai/v1';

function secret() {
  const envFile = path.join(ROOT, '.env.local');
  if (existsSync(envFile)) {
    for (const line of readFileSync(envFile, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  }
  if (!process.env.PIXELLAB_SECRET) {
    console.error('PIXELLAB_SECRET is empty. Put the key in .env.local (gitignored).');
    process.exit(1);
  }
  return process.env.PIXELLAB_SECRET;
}

const KEY = secret();

async function call(endpoint, body) {
  const res = await fetch(`${BASE}/${endpoint}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.ok) return res.json();

  // A 422 arrives as an array of field errors. Printing it raw gives
  // "[object Object]", which is how the first three attempts here were spent
  // guessing at what the service actually objected to.
  let detail;
  try {
    detail = (await res.json()).detail;
  } catch {
    detail = await res.text();
  }
  const lines = Array.isArray(detail)
    ? detail.map((d) => `${(d.loc ?? []).join('.')}: ${d.msg}`)
    : [typeof detail === 'string' ? detail : JSON.stringify(detail)];
  throw new Error(`${endpoint} ${res.status}\n  ` + lines.join('\n  '));
}

const image = (file) => ({
  type: 'base64',
  base64: readFileSync(path.resolve(file)).toString('base64'),
  format: 'png',
});

function writeImage(file, img) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, Buffer.from(img.base64, 'base64'));
  return file;
}

function arg(name, fallback) {
  const i = process.argv.indexOf('--' + name);
  return i > 0 ? process.argv[i + 1] : fallback;
}

/**
 * Per-character exclusions, appended to the house negative prompt.
 *
 * These do not belong in the shared list: "female, long hair" is exactly right
 * for Shigeru and exactly wrong for Lisette, Mirelle and Elin. The model reads
 * "prince" as androgynous and defaults to soft features and hair past the
 * shoulders, so it has to be told per character.
 */
const extraNegative = () => {
  const extra = arg('negative');
  return extra ? ', ' + extra : '';
};

const NEGATIVE =
  'anti-aliasing, blur, glow, gradient, muted colors, desaturated, high resolution, ' +
  'detailed face, chibi, super deformed';

/** The constraints every sprite in this game has to satisfy. */
function houseStyle(size) {
  return {
    image_size: { width: size, height: size },
    outline: 'single color black outline',
    shading: 'basic shading',
    detail: 'low detail',
    view: 'side',
    direction: 'east',
    no_background: true,
    negative_description: NEGATIVE,
  };
}

/**
 * Nearest-neighbour scale. Used to bring a reference up to the size the animate
 * endpoint demands — it refuses a reference that is not exactly `image_size`,
 * and it refuses anything under 64px. Nearest is the only correct filter here:
 * smoothing a 32px sprite up to 64 hands the model anti-aliased edges and it
 * dutifully animates the blur.
 */
function nearest(png, w, h) {
  const out = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) {
    const sy = Math.floor((y * png.height) / h);
    for (let x = 0; x < w; x++) {
      const sx = Math.floor((x * png.width) / w);
      const s = (sy * png.width + sx) * 4;
      out.set(png.data.subarray(s, s + 4), (y * w + x) * 4);
    }
  }
  return { width: w, height: h, data: out };
}

/**
 * A copy of `file` at exactly `size` square, written next to the original.
 * Every endpoint that takes a second image — style, init, animation reference —
 * requires it to match `image_size` exactly and errors out otherwise.
 */
function sameSize(file, size) {
  const png = decodePNG(readFileSync(path.resolve(file)));
  if (png.width === size && png.height === size) return file;
  const up = nearest(png, size, size);
  const out = path.join(OUT, `${path.basename(file, '.png')}-${size}.png`);
  mkdirSync(OUT, { recursive: true });
  writeFileSync(out, encodePNG(size, size, up.data));
  return out;
}

const [, , cmd, id, ...rest] = process.argv;
const positional = rest.filter((a, i) => !a.startsWith('--') && !rest[i - 1]?.startsWith('--'));
const startBalance = (await call('balance')).usd;

try {
  if (cmd === 'balance') {
    console.log(`balance: $${startBalance}`);
  } else if (cmd === 'gen') {
    const description = positional[0] ?? '';
    const size = Number(arg('size', 64));
    const ref = arg('ref');
    const body = {
      ...houseStyle(size),
      description,
      // Map sprites face the camera; only the battle sheets face east.
      direction: arg('facing', 'south'),
      negative_description: NEGATIVE + extraNegative(),
      coverage_percentage: Number(arg('coverage', 90)),
    };
    // bitforge takes a style image, which is the only reliable way to keep a
    // cast looking like one cast. Describing the style in words drifts.
    const res = ref
      ? await call('generate-image-bitforge', { ...body, style_image: image(sameSize(ref, size)) })
      : await call('generate-image-pixflux', body);
    console.log('saved ' + writeImage(path.join(OUT, `${id}.png`), res.image));
  } else if (cmd === 'portrait') {
    // A portrait is not a scaled-up map sprite. Fire Emblem draws it separately
    // at a size where a face is actually a face, so this one deliberately drops
    // the low-detail / side-view half of the house style and keeps only the
    // outline discipline and the transparent background.
    const description = positional[0] ?? '';
    const size = Number(arg('size', 128));
    const ref = arg('ref');
    const body = {
      image_size: { width: size, height: size },
      description,
      outline: 'single color black outline',
      shading: 'medium shading',
      detail: 'medium detail',
      view: 'side',
      direction: arg('facing', 'south-east'),
      no_background: true,
      coverage_percentage: Number(arg('coverage', 95)),
      negative_description:
        'full body, legs, feet, tiny face, chibi, super deformed, blur, gradient, photorealistic' +
        extraNegative(),
    };
    const res = ref
      ? await call('generate-image-bitforge', { ...body, style_image: image(sameSize(ref, size)) })
      : await call('generate-image-pixflux', body);
    console.log('saved ' + writeImage(path.join(OUT, `${id}-portrait.png`), res.image));
  } else if (cmd === 'rotate') {
    const from = image(positional[0]);
    const size = Number(arg('size', 64));
    for (const dir of ['north', 'east', 'south', 'west'].slice(0, Number(arg('dirs', 4)))) {
      const res = await call('rotate', {
        image_size: { width: size, height: size },
        from_image: from,
        from_direction: 'east',
        to_direction: dir,
      });
      console.log('saved ' + writeImage(path.join(OUT, `${id}-${dir}.png`), res.image));
    }
  } else {
    console.error(
      'usage:\n' +
        '  balance\n' +
        '  gen <id> "<description>" [--ref style.png] [--size 64] [--negative "..."]\n' +
        '  portrait <id> "<description>" [--size 128] [--ref style.png]\n' +
        '  rotate <id> <png> [--dirs 4]',
    );
    process.exit(1);
  }
} finally {
  if (cmd !== 'balance') {
    const end = (await call('balance')).usd;
    console.log(`\nspent $${(startBalance - end).toFixed(3)}, balance $${end.toFixed(2)}`);
  }
}
