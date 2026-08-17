# Dialogue portraits

One PNG per unit that has one. These are **not** map sprites: a portrait is
drawn at conversation size and shows head and shoulders, because the whole point
is the detail that does not survive at 32px. Fire Emblem draws a character
twice, and so does this.

`shigeru.png` is Shigeru's, commissioned through PixelLab from the approved
design. `akira.png` is Akira's — the old man the campaign calls ジェイガン,
registered against `p_akira`. Everyone else's face is still drawn in code by
`render/sprites.ts drawFacePortrait`.

Two more are kept and deliberately **not** registered:

- `akira-alt.png` — the same old Akira with short hair, from the same
  commission. Superseded by the long-haired one, kept because it may still be
  wanted. `cx 107.5, bottom 220, height 220`.
- `akira-secret-boss.png` — Akira young, black-haired, in a modern suit: the
  post-game hidden final boss. There is no post-game yet, and putting this face
  in chapter 1 would give the whole thing away. `cx 108.5, bottom 220, height 220`.

Adding one is two steps: drop the file here and add a line to `PORTRAIT_UNITS`
in `render/sprites.ts`. The registry entry carries the measurements —

    cx      the column the face is centred on
    bottom  the row the drawing ends at
    height  hair-top to that bottom row

— because the art does not fill its frame, and without them each portrait sits
at a different height. Measure them off the opaque bounding box.

See `AGENTS.md` before generating anything.
