// Takeshi, Emperor of Ash — the final boss.
//
// Shaven-headed, a head taller than anyone else on the field, both arms burned
// to the elbow in a bark-like pattern from carrying the Blackflame. He is never
// written as mad, so nothing here is jagged or spiky: he stands square, the axe
// is planted rather than brandished, and the only motion in his idle is the
// ember under his skin. The threat is the size and the stillness.

import { mat, drawHumanoid, drawHead, drawGreatAxe, pose, PROPORTIONS } from '../rig.mjs';
import { ellipse, tone, mix } from '../raster.mjs';

const LINE = '#100a16';

const PAL = {
  skin: mat('#c98f60', LINE, 0.18, -0.22),
  burnt: mat('#4c3038', LINE, 0.24, -0.3),
  cloth: mat('#33202c', LINE),
  armour: mat('#2d3242', LINE, 0.32, -0.3),
  boot: mat('#241c26', LINE),
  glove: mat('#3a2a30', LINE),
  hair: mat('#c98f60', LINE),
  trim: mat('#8a7a5e', LINE, 0.3, -0.32),
  // The haft has to sit well clear of the burnt forearm in value, or arm and
  // weapon merge into one log at map size.
  shaft: mat('#1b2130', LINE, 0.4, -0.25),
  head: mat('#9aa4b6', LINE, 0.34, -0.32),
};

const EMBER = '#ff7a1a';
const EMBER_HOT = '#ffd27a';

/** Bigger in every dimension, and broader through the shoulders than the arms. */
const GIANT = {
  ...PROPORTIONS,
  ankle: -8,
  knee: -37,
  hip: -65,
  waist: -74,
  chest: -94,
  shoulder: -103,
  neck: -107,
  headY: -119,
  headRX: 10.5,
  headRY: 11.8,
  shoulderW: 18,
  hipW: 11,
  upperArm: 23,
  foreArm: 23,
  thigh: 29,
  shin: 29,
  armR: 5.8,
  legR: 6.6,
};

function hairShape() {
  // Shaven. The silhouette is the point — nothing goes on top of this head.
}

function face(c, cx, cy, rx, ry) {
  // Heavy brow, one hard eye, a set jaw. No scowl: he is certain, not angry.
  c.poly(
    [
      [cx + rx * 0.05, cy - ry * 0.34],
      [cx + rx * 0.95, cy - ry * 0.3],
      [cx + rx * 0.95, cy - ry * 0.08],
      [cx + rx * 0.05, cy - ry * 0.14],
    ],
    '#6b4630',
  );
  c.poly(ellipse(cx + rx * 0.58, cy + ry * 0.08, 2.3, 2.5), '#2a1a16');
  c.poly(ellipse(cx + rx * 0.7, cy + ry * 0.04, 1.1, 1.2), EMBER_HOT);
  // Ear and jaw line — a bald head with no landmarks reads as an egg.
  c.poly(ellipse(cx - rx * 0.28, cy + ry * 0.1, 2.2, 3.2), '#a9724a');
  c.poly(
    [
      [cx - rx * 0.5, cy + ry * 0.6],
      [cx + rx * 0.5, cy + ry * 0.82],
      [cx + rx * 0.5, cy + ry * 0.96],
      [cx - rx * 0.5, cy + ry * 0.74],
    ],
    '#a9724a',
  );
  // Scar running back over the scalp.
  c.poly(
    [
      [cx + rx * 0.1, cy - ry * 0.86],
      [cx - rx * 0.75, cy - ry * 0.62],
      [cx - rx * 0.72, cy - ry * 0.5],
      [cx + rx * 0.12, cy - ry * 0.74],
    ],
    '#8a5a44',
  );
}

function head(c, s, P) {
  drawHead(c, s, P, { skin: PAL.skin, hair: PAL.hair, hairShape, face });
}

function torsoDecor(c, s, _torso) {
  const sw = GIANT.shoulderW;
  // Breastplate with a seam that the Blackflame shows through.
  c.part(
    [
      [s.shoulderC[0] - sw * 0.8, s.shoulderC[1] + 3],
      [s.shoulderC[0] + sw * 0.72, s.shoulderC[1] + 3],
      [s.chest[0] + sw * 0.7, s.chest[1] + 4],
      [s.waist[0] + 8, s.waist[1] - 2],
      [s.waist[0] - 8, s.waist[1] - 2],
      [s.chest[0] - sw * 0.72, s.chest[1] + 4],
    ],
    PAL.armour,
  );
  c.poly(
    [
      [s.shoulderC[0] - 2, s.shoulderC[1] + 6],
      [s.shoulderC[0] + 3, s.shoulderC[1] + 6],
      [s.chest[0] + 2.5, s.chest[1] + 8],
      [s.waist[0] + 1, s.waist[1] - 3],
      [s.waist[0] - 2, s.waist[1] - 3],
      [s.chest[0] - 3, s.chest[1] + 8],
    ],
    EMBER,
  );
  c.part(
    [
      [s.waist[0] - 11, s.waist[1] - 1],
      [s.waist[0] + 11, s.waist[1] - 1],
      [s.waist[0] + 11, s.waist[1] + 6],
      [s.waist[0] - 11, s.waist[1] + 6],
    ],
    PAL.boot,
  );
  // Both pauldrons — he is the only fully armoured figure of the three.
  for (const sh of [s.armNear.shoulder, s.armFar.shoulder]) {
    c.part(
      [
        [sh[0] - 8, sh[1] - 7],
        [sh[0] + 6, sh[1] - 8],
        [sh[0] + 11, sh[1] - 1],
        [sh[0] + 9, sh[1] + 6],
        [sh[0] - 3, sh[1] + 7],
        [sh[0] - 9, sh[1] + 1],
      ],
      sh === s.armFar.shoulder ? { ...PAL.armour, base: tone(PAL.armour.base, -0.26) } : PAL.armour,
    );
  }
}

function weapon(c, s, p) {
  const glow = mix(EMBER, EMBER_HOT, p.emberT ?? 0);
  drawGreatAxe(c, s.armNear.hand, p.axe ?? 40, {
    shaft: PAL.shaft,
    head: PAL.head,
    len: 52,
    headScale: 0.82,
    glow,
  });
}

/**
 * Ember cracks up the near forearm — the visible cost of carrying the thing.
 * Only the near arm: the far one is behind the torso, so cracks drawn on it
 * land on his chest.
 */
function cracks(c, s, p) {
  const glow = mix(EMBER, EMBER_HOT, p.emberT ?? 0);
  const e = s.armNear.elbow;
  const h = s.armNear.hand;
  for (const t of [0.25, 0.55, 0.82]) {
    const a = [e[0] + (h[0] - e[0]) * t, e[1] + (h[1] - e[1]) * t];
    c.poly(
      [
        [a[0] - 3.2, a[1] - 1.2],
        [a[0] + 0.8, a[1] - 0.4],
        [a[0] + 3.2, a[1] - 1.2],
        [a[0] + 3.2, a[1] + 0.4],
        [a[0] - 3.2, a[1] + 0.4],
      ],
      glow,
    );
  }
}

function draw(c, p) {
  drawHumanoid(
    c,
    {
      ...PAL,
      forearm: PAL.burnt,
      head,
      torsoDecor,
      weapon,
      front: (cc, s) => cracks(cc, s, p),
    },
    p,
    GIANT,
  );
}

/** `axe` is the on-screen angle of the haft: 0 forward, 90 down, 270 up. */
function P(o) {
  const lean = o.lean ?? 0;
  return pose({
    ...o,
    lean,
    axe: o.axe ?? 40,
    emberT: o.emberT ?? 0,
    // Arms hang; only the wrist angles the haft. Raising the elbows to hold the
    // axe out turns both burnt forearms into logs across his chest.
    armNear: { sh: o.sh ?? 6, el: o.el ?? 18 },
    armFar: o.armFar ?? { sh: -2, el: 22 },
  });
}

// Stands square with the axe planted. The only thing that moves is the ember.
const idle = [0, 1, 2, 3, 4, 5].map((i) => {
  const k = [0, -0.5, -0.9, -1, -0.7, -0.3][i];
  const e = [0, 0.25, 0.6, 1, 0.65, 0.3][i];
  return P({
    bob: k * 0.7,
    lean: 1,
    sh: 6 + k * 0.5,
    axe: 256 + k,
    emberT: e,
    legFar: { hip: 12, knee: -10 },
    legNear: { hip: -12, knee: 10 },
  });
});

const walk = [0, 1, 2, 3, 4, 5].map((i) => {
  const t = (i / 6) * Math.PI * 2;
  const sw = Math.sin(t);
  return P({
    bob: -1.8 + Math.abs(Math.cos(t)) * 1.8,
    lean: 4,
    sh: 20 - sw * 6,
    axe: 258 - sw * 5,
    emberT: 0.4 + sw * 0.3,
    armFar: { sh: 10 + sw * 16, el: 6 },
    legFar: { hip: -sw * 22, knee: -Math.max(0, -sw) * 30 },
    legNear: { hip: sw * 22, knee: -Math.max(0, sw) * 30 },
  });
});

// A cleave, not a flourish: haul it back level, then bring it down once.
const attack = [
  {
    bob: 1,
    lean: -10,
    sh: -18,
    el: 4,
    axe: 220,
    emberT: 0.3,
    legFar: { hip: 14, knee: -12 },
    legNear: { hip: -14, knee: 12 },
  },
  {
    bob: 2,
    lean: -18,
    sh: -30,
    el: 8,
    axe: 210,
    emberT: 0.6,
    legFar: { hip: 20, knee: -16 },
    legNear: { hip: -18, knee: 14 },
  },
  {
    bob: 0,
    lean: 2,
    sh: -8,
    el: 0,
    axe: 262,
    emberT: 0.9,
    legFar: { hip: -10, knee: -8 },
    legNear: { hip: 16, knee: 12 },
  },
  {
    bob: -2,
    lean: 16,
    sh: 22,
    el: -10,
    axe: 344,
    emberT: 1,
    legFar: { hip: -24, knee: -6 },
    legNear: { hip: 30, knee: 18 },
  },
  {
    bob: -3,
    lean: 22,
    sh: 30,
    el: -12,
    axe: 22,
    emberT: 0.7,
    legFar: { hip: -26, knee: -8 },
    legNear: { hip: 32, knee: 20 },
  },
  {
    bob: -1,
    lean: 8,
    sh: 20,
    el: 4,
    axe: 120,
    emberT: 0.3,
    legFar: { hip: -10, knee: -8 },
    legNear: { hip: 12, knee: 10 },
  },
].map(P);

const crit = [
  { bob: 1, lean: -12, sh: -20, el: 6, axe: 216, emberT: 0.4 },
  { bob: 3, lean: -22, sh: -22, el: 6, axe: 222, emberT: 0.8 },
  { bob: 4, lean: -26, sh: -24, el: 8, axe: 218, emberT: 1 },
  { bob: 1, lean: -6, sh: -22, el: 4, axe: 238, emberT: 1 },
  { bob: -2, lean: 10, sh: 4, el: -6, axe: 300, emberT: 1 },
  { bob: -4, lean: 24, sh: 24, el: -10, axe: 342, emberT: 1 },
  { bob: -3, lean: 26, sh: 30, el: -12, axe: 22, emberT: 0.7 },
  { bob: -1, lean: 8, sh: 20, el: 4, axe: 250, emberT: 0.3 },
].map((o) =>
  P({
    ...o,
    legFar: { hip: -o.lean * 0.9, knee: -10 },
    legNear: { hip: o.lean * 1.1, knee: 12 },
  }),
);

// He does not leap aside. He turns a shoulder into it and gives one step.
const dodge = [
  {
    bob: 0,
    lean: -8,
    sh: 18,
    el: -2,
    axe: 48,
    emberT: 0.4,
    legFar: { hip: 16, knee: -12 },
    legNear: { hip: -16, knee: 14 },
  },
  {
    bob: -3,
    lean: -18,
    sh: 8,
    el: 6,
    axe: 58,
    emberT: 0.8,
    legFar: { hip: 28, knee: -24 },
    legNear: { hip: -26, knee: 26 },
  },
  {
    bob: -2,
    lean: -13,
    sh: 12,
    el: 2,
    axe: 54,
    emberT: 0.6,
    legFar: { hip: 22, knee: -18 },
    legNear: { hip: -20, knee: 20 },
  },
  {
    bob: 0,
    lean: -4,
    sh: 20,
    el: -4,
    axe: 44,
    emberT: 0.3,
    legFar: { hip: 10, knee: -8 },
    legNear: { hip: -10, knee: 10 },
  },
].map(P);

const hit = [
  { bob: 1, lean: -12, sh: 10, el: 10, axe: 56, emberT: 1, armFar: { sh: -8, el: 22 } },
  { bob: 2, lean: -20, sh: 0, el: 18, axe: 66, emberT: 1, armFar: { sh: -20, el: 30 } },
  { bob: 0, lean: -7, sh: 16, el: 4, axe: 48, emberT: 0.6, armFar: { sh: -2, el: 16 } },
].map(P);

// He goes down to one knee first, and he does not drop the axe.
const die = [
  {
    bob: -4,
    lean: -14,
    sh: 14,
    el: 6,
    axe: 52,
    emberT: 1,
    legFar: { hip: 18, knee: -20 },
    legNear: { hip: -16, knee: 18 },
  },
  {
    bob: -14,
    lean: -6,
    sh: 6,
    el: 12,
    axe: 58,
    emberT: 0.8,
    legFar: { hip: 44, knee: -66 },
    legNear: { hip: -22, knee: 40 },
  },
  {
    bob: -26,
    lean: 8,
    sh: 0,
    el: 16,
    axe: 62,
    emberT: 0.55,
    legFar: { hip: 66, knee: -90 },
    legNear: { hip: -28, knee: 66 },
  },
  {
    bob: -36,
    lean: 22,
    sh: -8,
    el: 20,
    axe: 68,
    emberT: 0.3,
    legFar: { hip: 80, knee: -100 },
    legNear: { hip: -32, knee: 84 },
  },
  {
    bob: -44,
    lean: 34,
    sh: -16,
    el: 24,
    axe: 74,
    emberT: 0,
    legFar: { hip: 86, knee: -104 },
    legNear: { hip: -36, knee: 92 },
  },
].map(P);

export default {
  id: 'takeshi',
  frameW: 224,
  frameH: 208,
  origin: [108, 186],
  // Declared shorter than he is drawn, on purpose: the game scales every sheet
  // to the same content height, so this is what makes him a head taller than
  // everyone else on the field.
  charHeight: 114,
  cols: 8,
  draw,
  clips: {
    idle: { slot: 0, fps: 6, loop: true, poses: idle },
    walk: { slot: 8, fps: 10, loop: true, poses: walk },
    attack: { slot: 16, fps: 13, loop: false, poses: attack },
    crit: { slot: 24, fps: 13, loop: false, poses: crit },
    dodge: { slot: 32, fps: 13, loop: false, poses: dodge },
    hit: { slot: 36, fps: 12, loop: false, poses: hit },
    die: { slot: 40, fps: 8, loop: false, poses: die },
  },
};
