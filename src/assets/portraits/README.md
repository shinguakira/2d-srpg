# Dialogue portraits

One PNG per unit that has one. These are **not** map sprites: a portrait is
drawn at conversation size and shows head and shoulders, because the whole point
is the detail that does not survive at 32px. Fire Emblem draws a character
twice, and so does this.

`shigeru.png` is Shigeru's, commissioned through PixelLab from the approved
design. Everyone else's face is still drawn in code by
`render/sprites.ts drawFacePortrait`.

Adding one is two steps: drop the file here and add a line to `PORTRAIT_UNITS`
in `render/sprites.ts`. The registry entry carries the measurements —

    cx      the column the face is centred on
    bottom  the row the drawing ends at
    height  hair-top to that bottom row

— because the art does not fill its frame, and without them each portrait sits
at a different height. Measure them off the opaque bounding box.

See `AGENTS.md` before generating anything.
