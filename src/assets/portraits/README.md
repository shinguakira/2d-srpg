# Dialogue portraits

One PNG per unit that has one. These are **not** map sprites: a portrait is
drawn at conversation size and shows head and shoulders, because the whole point
is the detail that does not survive at 32px. Fire Emblem draws a character
twice, and so does this.

`shigeru.png` is Shigeru's, commissioned through PixelLab from the approved
design. Everyone else's face is still drawn in code by
`render/sprites.ts drawFacePortrait`.

`akira-secret-boss.png` is **not** Akira's dialogue portrait. Black-haired, in a
modern suit, it is the post-game hidden final boss and is deliberately not
registered — the campaign's Akira is white-haired. Nothing reads it yet. It is
218x220; the drawing fills the frame, so `cx 108.5, bottom 220, height 220`.

Adding one is two steps: drop the file here and add a line to `PORTRAIT_UNITS`
in `render/sprites.ts`. The registry entry carries the measurements —

    cx      the column the face is centred on
    bottom  the row the drawing ends at
    height  hair-top to that bottom row

— because the art does not fill its frame, and without them each portrait sits
at a different height. Measure them off the opaque bounding box.

See `AGENTS.md` before generating anything.
