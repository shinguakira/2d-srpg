// Pose tables for skeleton-driven animation.
//
// animate-with-text does not animate. Told to draw a walk it returns four
// standing frames; told to draw an attack it draws the *slash effect* — two
// white crescents the width of the frame — and shrinks the character to fit
// behind them. Turning the effects off with a negative prompt fixes the
// crescents but leaves the character motionless, because the only two knobs
// (image guidance, text guidance) trade appearance against movement: enough
// text weight to make a limb move is enough to make a different person.
//
// animate-with-skeleton splits those apart. Appearance comes from the reference
// image, pose comes from keypoints, and neither is guessing at the other. So
// the poses are authored here.
//
//   node tools/sprites/poses.mjs preview [out.png]
//
// writes a stick-figure contact sheet of every frame, which is how these get
// checked — the API is metered and eyeballing a pose costs nothing.
//
// Coordinates are normalised 0..1 across the frame, y downward, which is what
// the endpoint takes. Rotations are degrees clockwise on screen.

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { encodePNG } from './png.mjs';
import { Canvas, capsule, ellipse } from './raster.mjs';

/**
 * Shigeru standing, measured off the shipped sprite with
 * `pixellab.mjs skeleton - src/assets/sprites/shigeru_px-battle.png`.
 *
 * Re-measure whenever the base art changes. The poses below are relative and
 * survive a redraw; this table does not — the previous Shigeru filled 42 of 64
 * rows and this one fills 57, so every joint moved and the rotations that used
 * to put a sword overhead put it out sideways instead.
 *
 * LEFT is the character's left, which is screen right: LEFT SHOULDER sits at
 * x 0.596 and RIGHT SHOULDER at 0.450. He faces the camera, sword point-down
 * in his left hand.
 */
export const BASE = {
  NOSE: [0.5587, 0.2077],
  'LEFT EYE': [0.5783, 0.1795],
  'RIGHT EYE': [0.5283, 0.1817],
  'LEFT EAR': [0.5522, 0.1599],
  'RIGHT EAR': [0.4805, 0.1686],
  NECK: [0.5229, 0.311],
  'LEFT SHOULDER': [0.5957, 0.3012],
  'RIGHT SHOULDER': [0.45, 0.3208],
  'LEFT ELBOW': [0.624, 0.4513],
  'RIGHT ELBOW': [0.4218, 0.46],
  'LEFT ARM': [0.6805, 0.5665],
  'RIGHT ARM': [0.437, 0.5948],
  'LEFT HIP': [0.5827, 0.5274],
  'RIGHT HIP': [0.4957, 0.5383],
  'LEFT KNEE': [0.5957, 0.7122],
  'RIGHT KNEE': [0.4761, 0.7209],
  'LEFT LEG': [0.6087, 0.8709],
  'RIGHT LEG': [0.4457, 0.8883],
};

const Z_INDEX = {
  NOSE: 0,
  'LEFT EYE': -1,
  'RIGHT EYE': -1,
  'LEFT EAR': -2,
  'RIGHT EAR': -2,
  NECK: -1,
  'LEFT SHOULDER': -1,
  'RIGHT SHOULDER': -1,
  'LEFT ELBOW': 0,
  'RIGHT ELBOW': 0,
  'LEFT ARM': 0,
  'RIGHT ARM': 0,
  'LEFT HIP': -1,
  'RIGHT HIP': -1,
  'LEFT KNEE': 0,
  'RIGHT KNEE': 0,
  'LEFT LEG': -1,
  'RIGHT LEG': -1,
};

const HEAD = ['NOSE', 'LEFT EYE', 'RIGHT EYE', 'LEFT EAR', 'RIGHT EAR'];
const ARMS = [
  'LEFT SHOULDER',
  'RIGHT SHOULDER',
  'LEFT ELBOW',
  'RIGHT ELBOW',
  'LEFT ARM',
  'RIGHT ARM',
];
const HIPS = ['LEFT HIP', 'RIGHT HIP'];

/**
 * What a joint drags with it. A shoulder rotation has to carry the elbow and
 * the hand or the arm comes apart, which is the failure mode that makes
 * hand-authored keypoints look like a broken doll.
 */
const CHAINS = {
  'arm.l': { pivot: 'LEFT SHOULDER', joints: ['LEFT ELBOW', 'LEFT ARM'] },
  'arm.r': { pivot: 'RIGHT SHOULDER', joints: ['RIGHT ELBOW', 'RIGHT ARM'] },
  'hand.l': { pivot: 'LEFT ELBOW', joints: ['LEFT ARM'] },
  'hand.r': { pivot: 'RIGHT ELBOW', joints: ['RIGHT ARM'] },
  'leg.l': { pivot: 'LEFT HIP', joints: ['LEFT KNEE', 'LEFT LEG'] },
  'leg.r': { pivot: 'RIGHT HIP', joints: ['RIGHT KNEE', 'RIGHT LEG'] },
  'shin.l': { pivot: 'LEFT KNEE', joints: ['LEFT LEG'] },
  'shin.r': { pivot: 'RIGHT KNEE', joints: ['RIGHT LEG'] },
  head: { pivot: 'NECK', joints: HEAD },
  // Everything above the hips, pivoting on the midpoint between them. Leaning,
  // recoiling and collapsing are all this one chain.
  torso: { pivot: 'HIPS', joints: [...HEAD, 'NECK', ...ARMS] },
};

const GROUPS = {
  head: HEAD,
  arms: ARMS,
  legs: ['LEFT KNEE', 'RIGHT KNEE', 'LEFT LEG', 'RIGHT LEG'],
  'leg.l': ['LEFT KNEE', 'LEFT LEG'],
  'leg.r': ['RIGHT KNEE', 'RIGHT LEG'],
  'arm.l': ['LEFT ELBOW', 'LEFT ARM'],
  'arm.r': ['RIGHT ELBOW', 'RIGHT ARM'],
  // The bob. Moving everything would lift the feet off the ground; moving only
  // what is above the hips compresses the legs, which is what a bounce is.
  upper: [...HEAD, 'NECK', ...ARMS, ...HIPS],
  all: Object.keys(BASE),
};

function pivotOf(pose, name) {
  if (name === 'HIPS') {
    return [
      (pose['LEFT HIP'][0] + pose['RIGHT HIP'][0]) / 2,
      (pose['LEFT HIP'][1] + pose['RIGHT HIP'][1]) / 2,
    ];
  }
  return pose[name];
}

/** Apply one frame's ops to a copy of the base pose. */
function apply(ops) {
  const pose = Object.fromEntries(Object.entries(BASE).map(([k, v]) => [k, [...v]]));
  for (const [op, ...rest] of ops) {
    if (op === 'rot') {
      const [chainName, deg] = rest;
      const chain = CHAINS[chainName];
      if (!chain) throw new Error(`unknown chain ${chainName}`);
      const [px, py] = pivotOf(pose, chain.pivot);
      const a = (deg * Math.PI) / 180;
      const cos = Math.cos(a);
      const sin = Math.sin(a);
      for (const j of chain.joints) {
        const dx = pose[j][0] - px;
        const dy = pose[j][1] - py;
        pose[j] = [px + dx * cos - dy * sin, py + dx * sin + dy * cos];
      }
    } else if (op === 'move') {
      const [group, dx, dy] = rest;
      const joints = GROUPS[group] ?? [group];
      for (const j of joints) {
        pose[j][0] += dx;
        pose[j][1] += dy;
      }
    } else if (op === 'set') {
      const [joint, x, y] = rest;
      pose[joint] = [x, y];
    } else {
      throw new Error(`unknown op ${op}`);
    }
  }
  return pose;
}

// Three frames per clip, because animate-with-skeleton is a three-frame window
// and rejects any other count. That is tighter than the GBA budget but it is
// the classical breakdown anyway: for a swing, windup / strike / recovery.
//
// Read each list as: what has changed from standing.
export const FRAMES = 3;
const CLIPS = {
  // Breathing. Nothing else — an idle that does anything more reads as
  // fidgeting when it loops forever under the cursor.
  idle: [
    [],
    [
      ['move', 'upper', 0, 0.008],
      ['rot', 'arm.l', 2],
      ['rot', 'arm.r', -2],
    ],
    [
      ['move', 'upper', 0, -0.006],
      ['move', 'head', 0, -0.004],
    ],
  ],

  // Seen from the front a stride does not read; a knee lift and a bounce do.
  // The planted leg stays where it is and the hips drop toward it.
  walk: [
    [
      ['move', 'leg.l', -0.035, -0.1],
      ['rot', 'shin.l', -35],
      ['move', 'upper', 0, 0.02],
      ['rot', 'arm.r', -30],
      ['rot', 'arm.l', 20],
    ],
    [
      ['move', 'upper', 0, -0.03],
      ['move', 'legs', 0, -0.018],
      ['rot', 'arm.r', -8],
      ['rot', 'arm.l', 8],
    ],
    [
      ['move', 'leg.r', 0.035, -0.1],
      ['rot', 'shin.r', 35],
      ['move', 'upper', 0, 0.02],
      ['rot', 'arm.l', 30],
      ['rot', 'arm.r', -20],
    ],
  ],

  // The sword is in the left hand, point down, so the whole swing is one
  // shoulder rotating through about 240 degrees with the body leaning into it.
  //
  // The rest arm hangs at 79 degrees below horizontal, which is what sets these
  // numbers: overhead is -170, not -90. Rotations are relative to whatever the
  // BASE arm happens to be doing, so this is the line that has to be redone
  // every time the base sprite is — the previous Shigeru held the sword up and
  // out at 60 degrees, and -150 was overhead for him.
  attack: [
    [
      ['rot', 'arm.l', -170],
      ['rot', 'hand.l', -25],
      ['rot', 'torso', 8],
      ['move', 'upper', 0.026, -0.016],
    ],
    [
      ['rot', 'arm.l', 30],
      ['rot', 'hand.l', 20],
      ['rot', 'torso', -16],
      ['move', 'all', -0.04, 0],
      ['move', 'upper', -0.03, 0.012],
      ['move', 'leg.r', -0.035, 0],
    ],
    [
      ['rot', 'arm.l', 65],
      ['rot', 'torso', -24],
      ['move', 'all', -0.055, 0],
      ['move', 'upper', -0.04, 0.024],
      ['move', 'leg.r', -0.05, 0.004],
    ],
  ],

  // The same swing with a jump under it: crouch, strike at the top of the leap,
  // land deep.
  crit: [
    [
      ['rot', 'arm.l', -40],
      ['rot', 'hand.l', -25],
      ['move', 'upper', 0.01, 0.026],
      ['rot', 'torso', 5],
    ],
    [
      ['rot', 'arm.l', -178],
      ['rot', 'hand.l', -35],
      ['move', 'all', 0.01, -0.05],
      ['rot', 'leg.l', -12],
      ['rot', 'leg.r', 12],
    ],
    [
      ['rot', 'arm.l', 75],
      ['move', 'upper', -0.03, 0.028],
      ['rot', 'torso', -14],
      ['move', 'legs', 0, 0.004],
    ],
  ],

  // Weight off the front foot and the head out of the line. The last frame is
  // already returning, so the clip can be cut short without looking broken.
  dodge: [
    [
      ['rot', 'torso', 8],
      ['move', 'upper', 0.024, 0],
    ],
    [
      ['rot', 'torso', 16],
      ['move', 'upper', 0.058, 0.006],
      ['move', 'head', 0.012, 0],
    ],
    [
      ['rot', 'torso', 6],
      ['move', 'upper', 0.018, 0],
    ],
  ],

  // Struck from the front: head snaps back, arms open, then it settles.
  hit: [
    [
      ['rot', 'torso', -6],
      ['move', 'upper', 0.03, -0.006],
      ['rot', 'arm.l', 14],
      ['rot', 'arm.r', -14],
    ],
    [
      ['rot', 'torso', -12],
      ['move', 'upper', 0.052, -0.004],
      ['move', 'head', 0.014, -0.01],
      ['rot', 'arm.l', 22],
      ['rot', 'arm.r', -20],
    ],
    [
      ['rot', 'torso', -5],
      ['move', 'upper', 0.022, 0.006],
      ['rot', 'arm.l', 8],
    ],
  ],

  // Down and out. The last frame is absolute rather than a transform: a body on
  // the ground is not a standing body rotated, and trying to get there by
  // rotating the torso 90 degrees puts the head through the hip.
  //
  // Absolute means it is tied to the sprite's own floor — this Shigeru's feet
  // sit at y 0.88, so he lies at 0.82-0.92. Re-measure the base and these move
  // with it or he sinks into the tile.
  die: [
    [
      ['rot', 'torso', 12],
      ['move', 'upper', 0.012, 0.026],
      ['rot', 'arm.l', 22],
      ['rot', 'arm.r', -16],
    ],
    [
      ['rot', 'torso', 26],
      ['move', 'all', 0.012, 0.04],
      ['rot', 'leg.l', -24],
      ['rot', 'leg.r', 20],
      ['rot', 'arm.l', 45],
    ],
    [
      ['set', 'NECK', 0.4, 0.85],
      ['set', 'NOSE', 0.33, 0.855],
      ['set', 'LEFT EYE', 0.336, 0.842],
      ['set', 'RIGHT EYE', 0.336, 0.868],
      ['set', 'LEFT EAR', 0.358, 0.837],
      ['set', 'RIGHT EAR', 0.36, 0.873],
      ['set', 'LEFT SHOULDER', 0.435, 0.836],
      ['set', 'RIGHT SHOULDER', 0.44, 0.876],
      ['set', 'LEFT ELBOW', 0.385, 0.812],
      ['set', 'RIGHT ELBOW', 0.405, 0.902],
      ['set', 'LEFT ARM', 0.322, 0.816],
      ['set', 'RIGHT ARM', 0.352, 0.914],
      ['set', 'LEFT HIP', 0.565, 0.852],
      ['set', 'RIGHT HIP', 0.568, 0.888],
      ['set', 'LEFT KNEE', 0.66, 0.864],
      ['set', 'RIGHT KNEE', 0.664, 0.898],
      ['set', 'LEFT LEG', 0.735, 0.886],
      ['set', 'RIGHT LEG', 0.738, 0.912],
    ],
  ],
};

/**
 * One clip as the endpoint wants it: a bare list of frames, each a bare list of
 * labelled keypoints. Not a list of `{keypoints}` objects — the SDK's type says
 * otherwise and the service rejects it.
 */
export function skeletonFrames(clip) {
  const frames = CLIPS[clip];
  if (!frames) throw new Error(`unknown clip ${clip}`);
  return frames.map((ops) =>
    Object.entries(apply(ops)).map(([label, [x, y]]) => ({
      x,
      y,
      label,
      z_index: Z_INDEX[label],
    })),
  );
}

export const CLIP_NAMES = Object.keys(CLIPS);

// ---------------------------------------------------------------------------
// Preview

const BONES = [
  ['NECK', 'LEFT SHOULDER'],
  ['NECK', 'RIGHT SHOULDER'],
  ['LEFT SHOULDER', 'LEFT ELBOW'],
  ['LEFT ELBOW', 'LEFT ARM'],
  ['RIGHT SHOULDER', 'RIGHT ELBOW'],
  ['RIGHT ELBOW', 'RIGHT ARM'],
  ['LEFT SHOULDER', 'LEFT HIP'],
  ['RIGHT SHOULDER', 'RIGHT HIP'],
  ['LEFT HIP', 'RIGHT HIP'],
  ['LEFT HIP', 'LEFT KNEE'],
  ['LEFT KNEE', 'LEFT LEG'],
  ['RIGHT HIP', 'RIGHT KNEE'],
  ['RIGHT KNEE', 'RIGHT LEG'],
  ['NECK', 'NOSE'],
];

function drawPose(cv, pose, ox, oy, size) {
  const at = (j) => [ox + pose[j][0] * size, oy + pose[j][1] * size];
  for (const [a, b] of BONES) {
    cv.poly(capsule(at(a), at(b), size * 0.018, size * 0.018), '#e8e8f0');
  }
  const [hx, hy] = at('NOSE');
  cv.poly(ellipse(hx, hy, size * 0.052, size * 0.058), '#ffd27f');
  // The sword hand, so a swing is legible as a swing rather than as flailing.
  const [sx, sy] = at('LEFT ARM');
  cv.poly(ellipse(sx, sy, size * 0.03, size * 0.03), '#7fd0ff');
  // The floor, so a jump and a collapse are distinguishable from each other.
  cv.poly(
    [
      [ox, oy + size * 0.84],
      [ox + size, oy + size * 0.84],
      [ox + size, oy + size * 0.85],
      [ox, oy + size * 0.85],
    ],
    '#404058',
  );
}

function preview(outFile) {
  const cell = 160;
  const cols = FRAMES;
  const rows = CLIP_NAMES.length;
  const cv = new Canvas(cols * cell, rows * cell);
  cv.poly(
    [
      [0, 0],
      [cols * cell, 0],
      [cols * cell, rows * cell],
      [0, rows * cell],
    ],
    '#181824',
  );
  CLIP_NAMES.forEach((name, r) => {
    CLIPS[name].forEach((ops, c) => {
      drawPose(cv, apply(ops), c * cell, r * cell, cell);
    });
  });
  writeFileSync(outFile, encodePNG(cv.w, cv.h, cv.data));
  console.log(`${outFile} — rows: ${CLIP_NAMES.join(', ')}`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain && process.argv[2] === 'preview') {
  preview(process.argv[3] ?? 'poses.png');
}
