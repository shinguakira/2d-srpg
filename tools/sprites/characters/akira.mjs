// Akira — Shigeru's sworn retainer, mounted.
//
// Brief: white hair, glasses, built for speed and strength. So: no helmet (the
// hair and the glasses are the character, and a helmet hides both), a light
// cuirass over a teal surcoat rather than full plate, long limbs, and the
// longest reach on the field. The one silhouette on the map that is wider than
// it is tall.

import { mat, drawHumanoid, drawHead, drawLance, drawHorse, pose, PROPORTIONS } from '../rig.mjs';
import { ellipse } from '../raster.mjs';

const LINE = '#141020';

const PAL = {
  skin: mat('#e8b487', LINE, 0.2, -0.2),
  cloth: mat('#1d5c53', LINE),
  armour: mat('#aab8cc', LINE, 0.3, -0.34),
  boot: mat('#3a2a1e', LINE),
  glove: mat('#4a3626', LINE),
  hair: mat('#e6ecf4', LINE, 0.18, -0.26),
  trim: mat('#d9a441', LINE, 0.3, -0.32),
  hide: mat('#6b4326', LINE, 0.24, -0.3),
  mane: mat('#2b1f1e', LINE, 0.4, -0.22),
  tack: mat('#26514c', LINE),
  shaft: mat('#7a5330', LINE),
  head: mat('#c3ccdb', LINE, 0.34, -0.32),
};

// Rider proportions: longer limbs than Shigeru, narrower chest. Reads as speed
// before any stat screen is opened.
const RIDER = {
  ...PROPORTIONS,
  shoulderW: 12.5,
  upperArm: 22,
  foreArm: 22,
  thigh: 27,
  shin: 27,
  armR: 4.3,
  legR: 5.1,
};

function hairShape(c, cx, cy, rx, ry) {
  // Swept hard backwards in three points — the shape reads as "fast" and, at
  // 46px, as a pale wedge nothing else on the map has.
  c.part(
    [
      [cx + rx * 0.98, cy - ry * 0.46],
      [cx + rx * 0.35, cy - ry * 1.2],
      [cx - rx * 0.5, cy - ry * 1.12],
      [cx - rx * 1.35, cy - ry * 0.62],
      [cx - rx * 1.85, cy - ry * 0.8],
      [cx - rx * 1.25, cy - ry * 0.16],
      [cx - rx * 1.9, cy + ry * 0.06],
      [cx - rx * 1.1, cy + ry * 0.3],
      [cx - rx * 1.5, cy + ry * 0.52],
      [cx - rx * 0.8, cy + ry * 0.34],
      [cx - rx * 0.9, cy - ry * 0.3],
      [cx - rx * 0.2, cy - ry * 0.78],
      [cx + rx * 0.5, cy - ry * 0.72],
      [cx + rx * 1.0, cy - ry * 0.24],
    ],
    PAL.hair,
  );
}

function face(c, cx, cy, rx, ry) {
  // Glasses. Frame first, then the lens, then a single bright glint — the glint
  // is what survives being scaled down to a 46px map sprite.
  const ex = cx + rx * 0.52;
  const ey = cy + ry * 0.04;
  c.poly(ellipse(ex, ey, 1.6, 2.0), '#1b2438');
  c.poly(
    [
      [ex - 3.4, ey - 3.2],
      [ex + 3.4, ey - 3.0],
      [ex + 3.6, ey + 2.4],
      [ex - 3.4, ey + 2.2],
    ],
    '#20293d',
  );
  c.poly(
    [
      [ex - 2.4, ey - 2.2],
      [ex + 2.6, ey - 2.1],
      [ex + 2.7, ey + 1.5],
      [ex - 2.4, ey + 1.4],
    ],
    '#8fd0e8',
  );
  c.poly(
    [
      [ex - 1.9, ey - 1.7],
      [ex + 0.2, ey - 1.6],
      [ex - 1.2, ey + 1.0],
      [ex - 2.1, ey + 0.9],
    ],
    '#f2fbff',
  );
  // Temple arm running back into the hair.
  c.poly(
    [
      [ex - 3.2, ey - 2.4],
      [cx - rx * 0.62, ey - 3.4],
      [cx - rx * 0.62, ey - 2.4],
      [ex - 3.2, ey - 1.4],
    ],
    '#20293d',
  );
}

function head(c, s, P) {
  drawHead(c, s, P, { skin: PAL.skin, hair: PAL.hair, hairShape, face });
}

function torsoDecor(c, s) {
  // Cuirass front plate and a gold-edged collar.
  c.part(
    [
      [s.shoulderC[0] - 8, s.shoulderC[1] + 3],
      [s.shoulderC[0] + 8, s.shoulderC[1] + 3],
      [s.chest[0] + 8.5, s.chest[1] + 2],
      [s.waist[0] + 6, s.waist[1] - 1],
      [s.waist[0] - 6, s.waist[1] - 1],
      [s.chest[0] - 8.5, s.chest[1] + 2],
    ],
    PAL.armour,
  );
  c.part(
    [
      [s.shoulderC[0] - 7, s.shoulderC[1] - 1],
      [s.shoulderC[0] + 7, s.shoulderC[1] - 1],
      [s.shoulderC[0] + 5.5, s.shoulderC[1] + 4],
      [s.shoulderC[0] - 5.5, s.shoulderC[1] + 4],
    ],
    PAL.trim,
  );
  const sx = s.armNear.shoulder[0];
  const sy = s.armNear.shoulder[1];
  c.part(
    [
      [sx - 6, sy - 5],
      [sx + 5, sy - 6],
      [sx + 8, sy - 1],
      [sx + 7, sy + 4],
      [sx - 2, sy + 5],
      [sx - 7, sy + 1],
    ],
    PAL.armour,
  );
}

function weapon(c, s, p) {
  drawLance(c, s.armNear.hand, p.lance ?? 270, {
    shaft: PAL.shaft,
    head: PAL.head,
    len: 58,
    back: 18,
  });
}

const RIDER_CFG = {
  ...PAL,
  noFarLeg: true,
  head,
  torsoDecor,
  weapon,
};

function drawRider(c, p, saddle) {
  c.save();
  // Sit the rig's hips on the saddle. The saddle has already absorbed the
  // horse's bob, so the rider gets its own — applying `bob` to both sinks him
  // into the barrel on the heavy frames.
  c.translate(saddle[0], saddle[1] - RIDER.hip);
  drawHumanoid(c, RIDER_CFG, { ...p, bob: p.rbob ?? 0 }, RIDER);
  c.restore();
}

function draw(c, p) {
  drawHorse(
    c,
    {
      hide: PAL.hide,
      mane: PAL.mane,
      tack: PAL.tack,
      onSaddle: (cc, saddle) => drawRider(cc, p, saddle),
    },
    p,
  );
}

/**
 * A mounted pose. Legs stay wrapped around the barrel at all times; only the
 * upper body, the lance and the horse's gait actually animate.
 */
function P(o) {
  const lean = o.lean ?? 0;
  return pose({
    gait: o.gait ?? 0,
    rear: o.rear ?? 0,
    bob: o.bob ?? 0,
    rbob: o.rbob ?? 0,
    lean,
    lance: o.lance ?? 270,
    // The lance hand rides forward of the torso; centred, the shaft draws a
    // vertical bar straight through his face.
    armNear: { sh: o.sh ?? 30, el: o.el ?? -14 },
    armFar: o.armFar ?? { sh: 14, el: 30 },
    legNear: o.legNear ?? { hip: 52, knee: -62 },
    legFar: { hip: 50, knee: -60 },
  });
}

// Reins in the far hand, lance upright in the near hand, horse shifting weight.
const idle = [0, 1, 2, 3, 4, 5].map((i) => {
  const k = [0, -0.5, -0.9, -1, -0.7, -0.3][i];
  return P({
    bob: k * 0.6,
    rbob: k * 0.4,
    lean: 2 + k * 0.4,
    sh: 30 + k * 0.6,
    lance: 268 + k * 1.6,
  });
});

const walk = [0, 1, 2, 3, 4, 5].map((i) => {
  const g = i / 6;
  return P({
    gait: g,
    bob: Math.sin(g * Math.PI * 4) * 1.8,
    lean: 4,
    sh: 28,
    lance: 273,
  });
});

// Couch the lance, drive it level, then bring it back upright.
const attack = [
  { gait: 0.1, rbob: 1, lean: -8, sh: 12, el: 4, lance: 246 },
  { gait: 0.3, rbob: 0, lean: 2, sh: 34, el: -26, lance: 312 },
  { gait: 0.5, rbob: -1, lean: 12, sh: 52, el: -44, lance: 352, rear: 0.15 },
  { gait: 0.7, rbob: -2, lean: 18, sh: 64, el: -54, lance: 358, rear: 0.28 },
  { gait: 0.85, rbob: -1, lean: 12, sh: 56, el: -46, lance: 6, rear: 0.1 },
  { gait: 0, rbob: 0, lean: 3, sh: 32, el: -16, lance: 272 },
].map(P);

const crit = [
  { gait: 0.1, rbob: 1, lean: -10, sh: 6, el: 10, lance: 238, rear: 0.25 },
  { gait: 0.2, rbob: 2, lean: -14, sh: 0, el: 16, lance: 228, rear: 0.62 },
  { gait: 0.3, rbob: 1, lean: -4, sh: 14, el: 2, lance: 250, rear: 0.75 },
  { gait: 0.45, rbob: 0, lean: 6, sh: 38, el: -28, lance: 318, rear: 0.4 },
  { gait: 0.6, rbob: -2, lean: 16, sh: 56, el: -46, lance: 352, rear: 0.12 },
  { gait: 0.75, rbob: -3, lean: 24, sh: 68, el: -58, lance: 358 },
  { gait: 0.9, rbob: -1, lean: 14, sh: 58, el: -48, lance: 8 },
  { gait: 0, rbob: 0, lean: 3, sh: 32, el: -16, lance: 272 },
].map(P);

const dodge = [
  { gait: 0.2, rbob: -1, lean: -12, sh: 24, el: -6, lance: 256 },
  { gait: 0.4, bob: -3, rbob: -4, lean: -24, sh: 14, el: 4, lance: 240, rear: 0.4 },
  { gait: 0.6, bob: -1, rbob: -3, lean: -17, sh: 20, el: -2, lance: 250, rear: 0.18 },
  { gait: 0.8, rbob: -1, lean: -5, sh: 28, el: -12, lance: 264 },
].map(P);

const hit = [
  { rbob: 1, lean: -18, sh: 12, el: 12, lance: 238, armFar: { sh: -12, el: 44 } },
  { rbob: 2, lean: -30, sh: 2, el: 22, lance: 222, armFar: { sh: -26, el: 52 } },
  { rbob: 0, lean: -11, sh: 20, el: 2, lance: 252, armFar: { sh: -4, el: 38 } },
].map(P);

// He does not come off cleanly — the horse goes down and he goes with it.
const die = [
  { rbob: 1, lean: -22, sh: 8, el: 18, lance: 228, rear: 0.1 },
  { bob: -4, rbob: -2, lean: -34, sh: -10, el: 30, lance: 206, legNear: { hip: 46, knee: -56 } },
  { bob: -12, rbob: -5, lean: -46, sh: -20, el: 34, lance: 210, legNear: { hip: 36, knee: -46 } },
  { bob: -22, rbob: -8, lean: -56, sh: -32, el: 40, lance: 202, legNear: { hip: 24, knee: -34 } },
  { bob: -30, rbob: -10, lean: -64, sh: -42, el: 44, lance: 196, legNear: { hip: 14, knee: -24 } },
].map(P);

export default {
  id: 'akira',
  frameW: 240,
  frameH: 192,
  origin: [116, 172],
  charHeight: 124,
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
