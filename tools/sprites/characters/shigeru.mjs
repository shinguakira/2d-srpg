// Shigeru — prince of Amagi, bearer of the Flamebrand.
//
// Fire Emblem lord silhouette: no helmet, a short coat over light half-plate, a
// crimson half-cape, and a sword whose edge still holds an ember. Deliberately
// the least armoured of the three — he is the one who has to look young.

import { mat, drawHumanoid, drawHead, drawSword, drawCape, pose, PROPORTIONS } from '../rig.mjs';
import { ellipse, tone } from '../raster.mjs';

const LINE = '#141020';

const PAL = {
  skin: mat('#e8b487', LINE, 0.2, -0.2),
  cloth: mat('#26325f', LINE),
  armour: mat('#41598f', LINE),
  boot: mat('#4a3220', LINE),
  glove: mat('#5c3f26', LINE),
  hair: mat('#33283d', LINE, 0.36, -0.28),
  cape: mat('#a3223a', LINE, 0.26, -0.34),
  trim: mat('#d9a441', LINE, 0.3, -0.32),
  blade: mat('#c9d4e6', LINE, 0.38, -0.34),
  hilt: mat('#c08a2e', LINE),
};

const EMBER = '#ffae42';

function hairShape(c, cx, cy, rx, ry) {
  // One swept mass with a single forward lock — reads at 46px, not just at 120.
  c.part(
    [
      [cx - rx * 1.02, cy - ry * 0.15],
      [cx - rx * 0.7, cy - ry * 1.05],
      [cx + rx * 0.3, cy - ry * 1.22],
      [cx + rx * 1.0, cy - ry * 0.72],
      [cx + rx * 1.06, cy - ry * 0.34],
      [cx + rx * 0.35, cy - ry * 0.62],
      [cx - rx * 0.5, cy - ry * 0.55],
      [cx - rx * 1.18, cy + ry * 0.35],
      [cx - rx * 1.62, cy + ry * 0.72],
      [cx - rx * 1.5, cy - ry * 0.1],
    ],
    PAL.hair,
  );
  // A single forward lock, stopping above the brow — hanging it any lower
  // merges with the eyebrow and reads as a blindfold.
  c.part(
    [
      [cx + rx * 0.1, cy - ry * 0.95],
      [cx + rx * 1.02, cy - ry * 0.72],
      [cx + rx * 0.86, cy - ry * 0.42],
      [cx + rx * 0.66, cy - ry * 0.62],
      [cx + rx * 0.2, cy - ry * 0.72],
    ],
    PAL.hair,
  );
}

function face(c, cx, cy, rx, ry) {
  c.poly(
    [
      [cx + rx * 0.24, cy - ry * 0.3],
      [cx + rx * 0.9, cy - ry * 0.2],
      [cx + rx * 0.9, cy - ry * 0.06],
      [cx + rx * 0.24, cy - ry * 0.16],
    ],
    '#332a3d',
  );
  c.poly(ellipse(cx + rx * 0.58, cy + ry * 0.1, 2.1, 2.7), '#1e2740');
  c.poly(ellipse(cx + rx * 0.74, cy + ry * 0.04, 0.8, 1.0), '#9fb6e0');
}

function head(c, s, P) {
  drawHead(c, s, P, { skin: PAL.skin, hair: PAL.hair, hairShape, face });
}

function torsoDecor(c, s) {
  // Collar, gold-edged front panel, belt.
  c.part(
    [
      [s.shoulderC[0] - 8, s.shoulderC[1] + 1],
      [s.shoulderC[0] + 8, s.shoulderC[1] + 1],
      [s.shoulderC[0] + 6, s.shoulderC[1] + 6],
      [s.shoulderC[0] - 6, s.shoulderC[1] + 6],
    ],
    PAL.trim,
  );
  c.part(
    [
      [s.waist[0] - 9.5, s.waist[1] + 1],
      [s.waist[0] + 9.5, s.waist[1] + 1],
      [s.waist[0] + 9.5, s.waist[1] + 6],
      [s.waist[0] - 9.5, s.waist[1] + 6],
    ],
    PAL.boot,
  );
  c.part(ellipse(s.waist[0] + 1, s.waist[1] + 3.5, 3, 2.6), PAL.trim);
  // Single pauldron on the sword shoulder — lords are half-armoured. An angular
  // plate, because a capsule here reads as a lump on the chest.
  const sx = s.armNear.shoulder[0];
  const sy = s.armNear.shoulder[1];
  c.part(
    [
      [sx - 6, sy - 5],
      [sx + 5, sy - 6],
      [sx + 9, sy - 1],
      [sx + 8, sy + 5],
      [sx - 2, sy + 6],
      [sx - 7, sy + 1],
    ],
    PAL.armour,
  );
}

function weapon(c, s, p) {
  drawSword(c, s.armNear.hand, p.blade ?? 90, {
    blade: PAL.blade,
    hilt: PAL.hilt,
    len: 40,
    width: 4.2,
    glow: p.ember ? EMBER : tone('#c9d4e6', 0.55),
  });
}

function draw(c, p) {
  drawHumanoid(
    c,
    {
      ...PAL,
      head,
      torsoDecor,
      weapon,
      back: (cc, s) => drawCape(cc, s, PAL.cape, { len: 58, width: 12.5, sway: p.sway ?? 0 }),
    },
    p,
    PROPORTIONS,
  );
}

/**
 * Build a pose. `blade` is the *on-screen* angle of the blade — 0 forward, 90
 * straight down, 270 straight up — set by the wrist rather than inherited from
 * the forearm. Driving the blade off the elbow instead needs an overhead reach
 * that puts the tip well outside the frame on every windup.
 */
function P(o) {
  const lean = o.lean ?? 0;
  return pose({
    ...o,
    lean,
    blade: o.blade ?? 90,
    sway: o.sway ?? 0,
    armNear: { sh: o.sh ?? -6, el: o.el ?? 26 },
    armFar: o.armFar ?? { sh: lean > 6 ? -24 : 22, el: 20 },
  });
}

const idle = [0, 1, 2, 3, 4, 5].map((i) => {
  const k = [0, -0.7, -1.2, -1.4, -1, -0.4][i];
  return P({
    bob: k,
    lean: 1 + k * 0.3,
    sh: -8 + k,
    el: 26 + k * 2,
    blade: 104 + k * 2,
    legFar: { hip: 15, knee: -13 },
    legNear: { hip: -13, knee: 13 },
    sway: 2 + k * 1.6,
  });
});

const walk = [0, 1, 2, 3, 4, 5].map((i) => {
  const t = (i / 6) * Math.PI * 2;
  const sw = Math.sin(t);
  return P({
    bob: -1.6 + Math.abs(Math.cos(t)) * 1.6,
    lean: 5,
    sh: -14 - sw * 12,
    el: 30,
    blade: 100 - sw * 6,
    armFar: { sh: 12 + sw * 24, el: 14 },
    legFar: { hip: -sw * 26, knee: -Math.max(0, -sw) * 34 },
    legNear: { hip: sw * 26, knee: -Math.max(0, sw) * 34 },
    sway: 5 + sw * 3,
  });
});

const attack = [
  {
    bob: 0,
    lean: -6,
    sh: -40,
    el: -30,
    blade: 250,
    legFar: { hip: 12, knee: -12 },
    legNear: { hip: -12, knee: 12 },
    sway: -8,
  },
  {
    bob: 1,
    lean: -16,
    sh: -62,
    el: -34,
    blade: 278,
    legFar: { hip: 18, knee: -16 },
    legNear: { hip: -16, knee: 14 },
    sway: -16,
  },
  {
    bob: -1,
    lean: 4,
    sh: -10,
    el: -10,
    blade: 330,
    legFar: { hip: -14, knee: -8 },
    legNear: { hip: 20, knee: 14 },
    sway: 10,
  },
  {
    bob: -2,
    lean: 16,
    sh: 26,
    el: 18,
    blade: 20,
    legFar: { hip: -26, knee: -6 },
    legNear: { hip: 32, knee: 20 },
    sway: 22,
  },
  {
    bob: -1,
    lean: 20,
    sh: 44,
    el: 26,
    blade: 58,
    legFar: { hip: -24, knee: -8 },
    legNear: { hip: 30, knee: 18 },
    sway: 16,
  },
  {
    bob: 0,
    lean: 6,
    sh: 4,
    el: 24,
    blade: 96,
    legFar: { hip: -10, knee: -8 },
    legNear: { hip: 12, knee: 10 },
    sway: 6,
  },
].map(P);

const crit = [
  { bob: 1, lean: -10, sh: -48, el: -32, blade: 244, sway: -10 },
  { bob: 3, lean: -20, sh: -68, el: -38, blade: 272, sway: -20 },
  { bob: 4, lean: -24, sh: -76, el: -40, blade: 288, sway: -24 },
  { bob: 0, lean: -2, sh: -30, el: -20, blade: 318, sway: 2 },
  { bob: -3, lean: 14, sh: 6, el: 0, blade: 350, sway: 18 },
  { bob: -4, lean: 24, sh: 38, el: 20, blade: 30, sway: 28 },
  { bob: -2, lean: 20, sh: 54, el: 28, blade: 66, sway: 18 },
  { bob: 0, lean: 6, sh: 6, el: 24, blade: 98, sway: 8 },
].map((o) =>
  P({
    ...o,
    ember: true,
    legFar: { hip: -o.lean * 0.9, knee: -10 },
    legNear: { hip: o.lean * 1.2, knee: 12 },
  }),
);

const dodge = [
  {
    bob: -1,
    lean: -14,
    sh: -24,
    el: 30,
    blade: 118,
    legFar: { hip: 20, knee: -18 },
    legNear: { hip: -22, knee: 20 },
    sway: -14,
  },
  {
    bob: -8,
    lean: -28,
    sh: -40,
    el: 42,
    blade: 132,
    legFar: { hip: 36, knee: -44 },
    legNear: { hip: -36, knee: 46 },
    sway: -28,
  },
  {
    bob: -5,
    lean: -20,
    sh: -30,
    el: 34,
    blade: 126,
    legFar: { hip: 26, knee: -30 },
    legNear: { hip: -26, knee: 32 },
    sway: -20,
  },
  {
    bob: -1,
    lean: -6,
    sh: -12,
    el: 26,
    blade: 108,
    legFar: { hip: 10, knee: -12 },
    legNear: { hip: -10, knee: 12 },
    sway: -8,
  },
].map((o) => P({ ...o, armFar: { sh: -14, el: 20 } }));

const hit = [
  {
    bob: 1,
    lean: -20,
    sh: -34,
    el: 48,
    blade: 140,
    armFar: { sh: -30, el: 38 },
    legFar: { hip: 16, knee: -14 },
    legNear: { hip: -18, knee: 18 },
    sway: -18,
  },
  {
    bob: 3,
    lean: -32,
    sh: -50,
    el: 58,
    blade: 156,
    armFar: { sh: -44, el: 46 },
    legFar: { hip: 26, knee: -22 },
    legNear: { hip: -28, knee: 28 },
    sway: -30,
  },
  {
    bob: 0,
    lean: -12,
    sh: -20,
    el: 34,
    blade: 122,
    armFar: { sh: -16, el: 28 },
    legFar: { hip: 10, knee: -10 },
    legNear: { hip: -12, knee: 14 },
    sway: -12,
  },
].map(P);

const die = [
  {
    bob: 1,
    lean: -24,
    sh: -46,
    el: 56,
    blade: 150,
    armFar: { sh: -38, el: 46 },
    legFar: { hip: 16, knee: -16 },
    legNear: { hip: -14, knee: 14 },
    sway: -20,
  },
  {
    bob: -6,
    lean: -32,
    sh: -70,
    el: 60,
    blade: 168,
    armFar: { sh: -60, el: 50 },
    legFar: { hip: 34, knee: -46 },
    legNear: { hip: -20, knee: 30 },
    sway: -26,
  },
  {
    bob: -18,
    lean: -22,
    sh: -90,
    el: 40,
    blade: 178,
    armFar: { sh: -80, el: 34 },
    legFar: { hip: 58, knee: -84 },
    legNear: { hip: -26, knee: 62 },
    sway: -18,
  },
  {
    bob: -30,
    lean: 4,
    sh: -104,
    el: 20,
    blade: 184,
    armFar: { sh: -100, el: 16 },
    legFar: { hip: 76, knee: -96 },
    legNear: { hip: -30, knee: 84 },
    sway: -8,
  },
  {
    bob: -38,
    lean: 24,
    sh: -78,
    el: 14,
    blade: 148,
    armFar: { sh: -112, el: 6 },
    legFar: { hip: 84, knee: -100 },
    legNear: { hip: -34, knee: 92 },
    sway: 0,
  },
].map(P);

export default {
  id: 'shigeru',
  frameW: 208,
  frameH: 192,
  origin: [104, 158],
  charHeight: 120,
  cols: 8,
  draw,
  clips: {
    idle: { slot: 0, fps: 6, loop: true, poses: idle },
    walk: { slot: 8, fps: 10, loop: true, poses: walk },
    attack: { slot: 16, fps: 14, loop: false, poses: attack },
    crit: { slot: 24, fps: 14, loop: false, poses: crit },
    dodge: { slot: 32, fps: 14, loop: false, poses: dodge },
    hit: { slot: 36, fps: 12, loop: false, poses: hit },
    die: { slot: 40, fps: 9, loop: false, poses: die },
  },
};
