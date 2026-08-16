// Generate a character's art through the PixelLab API and drop it straight into
// the game.
//
//   node tools/sprites/pixellab.mjs balance
//   node tools/sprites/pixellab.mjs gen <id> "<description>" [--ref <png>] [--size 64]
//   node tools/sprites/pixellab.mjs sheet <id> <ref.png> "<desc>" [--only walk,attack]
//   node tools/sprites/pixellab.mjs portrait <id> "<description>" [--size 128]
//   node tools/sprites/pixellab.mjs rotate <id> <png> --dirs 4
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
// side view facing east. See the measurements in px-shigeru.mjs for where those
// numbers came from.
//
// The API is metered per call, so `sheet` caches every frame it receives to
// disk and skips clips it has already paid for. Re-running after a failure
// costs nothing for the clips that already landed; `--force` overrides.

import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodePNG } from './pngRead.mjs';
import { encodePNG } from './png.mjs';
import { skeletonFrames, FRAMES } from './poses.mjs';

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
const has = (name) => process.argv.includes('--' + name);

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

// Animation needs a much longer list than a still does. Told to animate an
// attack, the model draws the *effect* rather than the character: two white
// crescents the width of the frame, with a shrunken figure somewhere behind
// them. Fire Emblem draws none of that — the sword moves, and that is the
// animation. Everything here is a shape that showed up uninvited.
const NO_EFFECTS =
  'motion blur, speed lines, slash effect, sword trail, energy trail, swoosh, ' +
  'white arc, crescent, glow, sparks, particles, smoke, dust cloud, magic effect, ' +
  'special effects, flying cloth, cape covering the body, kneeling, sitting, crouching';

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

// The Fire Emblem clip set, in the order the game asks for them. `action` is
// only used by the `--text` fallback; the poses that do the actual work live in
// poses.mjs, which is also where the frame count comes from.
const CLIPS = [
  { name: 'idle', action: 'standing at the ready, breathing, sword held low', fps: 4, loop: true },
  { name: 'walk', action: 'walking forward, legs striding', fps: 8, loop: true },
  {
    name: 'attack',
    action: 'raising the sword and swinging it down in a slash',
    fps: 12,
    loop: false,
  },
  { name: 'crit', action: 'a two-handed overhead sword strike', fps: 14, loop: false },
  { name: 'dodge', action: 'leaning sharply back to evade a blow', fps: 12, loop: false },
  { name: 'hit', action: 'recoiling backward after being struck', fps: 12, loop: false },
  { name: 'die', action: 'collapsing to the ground and lying still', fps: 8, loop: false },
].map((c) => ({ ...c, frames: FRAMES }));

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

/** Lay frames out left-to-right in one row, which is what SpriteSheet wants. */
function compose(frameFiles) {
  const frames = frameFiles.map((f) => decodePNG(readFileSync(f)));
  const fw = frames[0].width;
  const fh = frames[0].height;
  const odd = frames.find((f) => f.width !== fw || f.height !== fh);
  if (odd) throw new Error(`frames are not all ${fw}x${fh} — got ${odd.width}x${odd.height}`);

  const sheetW = fw * frames.length;
  const out = new Uint8ClampedArray(sheetW * fh * 4);
  frames.forEach((frame, i) => {
    for (let y = 0; y < fh; y++) {
      for (let x = 0; x < fw; x++) {
        const src = (y * fw + x) * 4;
        const dst = (y * sheetW + i * fw + x) * 4;
        out.set(frame.data.subarray(src, src + 4), dst);
      }
    }
  });
  return { width: sheetW, height: fh, data: out, fw, fh, count: frames.length };
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
  } else if (cmd === 'base') {
    // Redraw an approved sprite at the size the animator needs.
    //
    // animate-with-text will not take a reference under 64px, and doubling a
    // 32px sprite with nearest gives it 2x2 blocks to read — it cannot make out
    // a sword in that, so it drops the sword and invents a character. Passing
    // the doubled sprite as init_image at high strength keeps the pose, the
    // palette and the silhouette while the model redraws at native resolution.
    const refFile = path.resolve(positional[0]);
    const description = positional[1] ?? '';
    const ref = decodePNG(readFileSync(refFile));
    const size = Number(arg('size', 64));
    const up = nearest(ref, size, size);
    const upFile = path.join(OUT, `${id}-ref-${size}.png`);
    writeFileSync(upFile, encodePNG(size, size, up.data));
    const res = await call('generate-image-bitforge', {
      ...houseStyle(size),
      description,
      direction: arg('facing', 'south'),
      init_image: image(upFile),
      init_image_strength: Number(arg('init-strength', 600)),
      style_image: image(upFile),
      style_strength: Number(arg('style-strength', 60)),
      // The 32px original leaves a wide margin, and doubling it doubles the
      // margin too — the figure would only get 44 of the 64 rows. Filling the
      // frame is the whole point of redrawing at this size.
      coverage_percentage: Number(arg('coverage', 90)),
    });
    console.log('saved ' + writeImage(path.join(OUT, `${id}-base.png`), res.image));
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
  } else if (cmd === 'sheet') {
    const refFile = path.resolve(positional[0]);
    const description = positional[1] ?? '';
    const ref = decodePNG(readFileSync(refFile));
    // The reference may be smaller than the endpoint's 64px floor — Shigeru's
    // is 32 — so it gets doubled first. The sheet then runs at twice the field
    // sprite's resolution, which costs nothing: `content` anchors by measured
    // artwork, not by frame size.
    const size = Math.max(64, Number(arg('size', ref.width)));
    // Which way the reference faces. Getting this wrong is not a small error:
    // asked to animate a front-facing sprite as an east-facing one, the model
    // reinterprets the pose from scratch and returns a kneeling stranger.
    const facing = arg('facing', 'south');
    const only = arg('only')?.split(',');
    const clips = CLIPS.filter((clip) => !only || only.includes(clip.name));
    const dir = path.join(OUT, id + '-frames');
    mkdirSync(dir, { recursive: true });

    const reference = image(sameSize(refFile, size));

    console.log(
      `${id}: ${size}x${size} from ${path.basename(refFile)} (${ref.width}x${ref.height})`,
    );

    const layout = [];
    let cursor = 0;
    for (const clip of clips) {
      const files = Array.from({ length: clip.frames }, (_, i) =>
        path.join(dir, `${clip.name}-${i}.png`),
      );
      if (files.every(existsSync) && !has('force')) {
        console.log(`  ${clip.name.padEnd(7)} cached (${clip.frames} frames)`);
      } else if (!has('text')) {
        // Pose from poses.mjs, appearance from the reference. See the note at
        // the top of that file for why the text endpoint is the fallback and
        // not the default.
        const res = await call('animate-with-skeleton', {
          image_size: { width: size, height: size },
          skeleton_keypoints: skeletonFrames(clip.name),
          view: arg('view', 'side'),
          direction: facing,
          reference_image: reference,
          // Defaults are reference 1.1 / pose 3, and at anything under about
          // pose 15 the model treats the skeleton as a suggestion: every frame
          // comes back standing, in a flawless copy of the reference. These are
          // the ends of both ranges, and they are where a limb finally moves.
          //
          // Note the coordinates stay normalised 0..1. Sending them in pixels
          // is silently accepted and silently ignored — three identical frames
          // come back, which reads as "the pose did nothing" rather than as an
          // error.
          reference_guidance_scale: Number(arg('guidance', 1)),
          pose_guidance_scale: Number(arg('pose-guidance', 20)),
        });
        const images = res.images ?? [];
        images.forEach((img, i) => writeImage(files[i], img));
        clip.frames = images.length;
        console.log(`  ${clip.name.padEnd(7)} ${images.length} frames (skeleton)`);
      } else {
        const res = await call('animate-with-text', {
          image_size: { width: size, height: size },
          description,
          action: clip.action,
          reference_image: reference,
          n_frames: clip.frames,
          view: arg('view', 'side'),
          direction: facing,
          negative_description: NEGATIVE + ', ' + NO_EFFECTS,
          // Defaults are image 1.5 / text 7.5, and that balance is wrong here:
          // the text wins, the model illustrates the sentence, and the
          // character stops being the character. Pull the image up and the
          // text down so the action nudges a sprite that already exists.
          image_guidance_scale: Number(arg('guidance', 6)),
          text_guidance_scale: Number(arg('text-guidance', 4)),
          inpainting_images: Array.from({ length: clip.frames }, () => null),
        });
        // The service is free to return fewer frames than asked for; the clip
        // table is what has to bend, not the layout maths.
        const images = res.images ?? [];
        images.forEach((img, i) => writeImage(files[i], img));
        clip.frames = images.length;
        console.log(`  ${clip.name.padEnd(7)} ${images.length} frames`);
      }
      layout.push({ ...clip, from: cursor });
      cursor += clip.frames;
    }

    const all = layout.flatMap((clip) =>
      Array.from({ length: clip.frames }, (_, i) => path.join(dir, `${clip.name}-${i}.png`)),
    );
    const strip = compose(all);
    const sheetFile = path.join(OUT, `${id}-sheet.png`);
    writeFileSync(sheetFile, encodePNG(strip.width, strip.height, strip.data));

    console.log(
      `\nsheet ${strip.width}x${strip.height}  ${strip.count} frames of ${strip.fw}x${strip.fh}`,
    );
    console.log(`saved ${path.relative(ROOT, sheetFile)}\n`);
    console.log('  clips: {');
    for (const clip of layout) {
      const frames = Array.from({ length: clip.frames }, (_, i) => clip.from + i).join(', ');
      console.log(
        `    ${clip.name}: { frames: [${frames}], fps: ${clip.fps}, loop: ${clip.loop} },`,
      );
    }
    console.log('  },');
    console.log(
      `\nnext: node tools/sprites/import.mjs ${path.relative(ROOT, sheetFile).replaceAll('\\', '/')} ` +
        `${id} --cols ${strip.count} --rows 1`,
    );
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
        '  gen <id> "<description>" [--ref style.png] [--size 64]\n' +
        '  sheet <id> <ref.png> "<description>" [--only walk,attack] [--force]\n' +
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
