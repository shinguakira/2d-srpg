# Dialogue portraits

One PNG per unit that has one. These are **not** map sprites: a portrait is
drawn at conversation size and shows head and shoulders, because the whole point
is the detail that does not survive at 32px. Fire Emblem draws a character
twice, and so does this.

## The cast

`shigeru.png` is Shigeru's, commissioned through PixelLab from the approved
design, and it is the one everything else is measured against. `akira.png` is
Akira's — the old man the campaign calls ジェイガン, registered against
`p_akira` — and it is the odd one out: 220px, painted, not pixel art.

The other ten came later, from **`shigeru.png` handed to
`generate-image-bitforge` as the `style_image`**, one call each:

| | who |
|---|---|
| `gareth.png` `bryn.png` `lisette.png` `mirelle.png` `elin.png` `ald.png` `corwin.png` | the rest of the roster |
| `hagen.png` `vidar.png` `olrik.png` | the bosses of chapters 1, 2 and 3 |

All ten are 128px with the head in the same place, which is why they share
`height: 128` in the registry — the face size comes from the frame, not from
how far down each drawing happens to stop.

**bitforge copies the style image hard, and that includes its palette.** Left
alone it gave the whole cast Shigeru's cool lavender hair; a red-haired brawler
came back lavender three times. What fixes it is shouting the colour in the
description (`FLAME RED hair, crimson red spiky hair, scarlet hair`) *and*
blacklisting the drift in `--negative` (`lavender hair, purple hair, silver
hair, pale hair`). The same pair of moves is what got Ald blond.

Two other failures worth knowing: without `single character, centred` in the
description and `two people, duplicate, split image` in the negative it draws
**two of them side by side** often enough to matter, and without
`head and shoulders fill the whole frame` plus `--coverage 100` it leaves the
subject small with dead space under the chin.

Two more are kept and deliberately **not** registered:

- `akira-alt.png` — the same old Akira with short hair, from the same
  commission. Superseded by the long-haired one, kept because it may still be
  wanted. `cx 107.5, bottom 220, height 220`.
- `akira-secret-boss.png` — Akira young, black-haired, in a modern suit: the
  post-game hidden final boss. There is no post-game yet, and putting this face
  in chapter 1 would give the whole thing away. `cx 108.5, bottom 220, height 220`.

## Adding one

Drop the file here and add a line to `PORTRAIT_UNITS` in `render/sprites.ts`.
The registry entry carries the measurements —

    cx      the column the face is centred on
    bottom  the row the drawing ends at
    height  the height the drawing is scaled against

— because the art does not fill its frame, and without them each portrait sits
at a different height. Measure `cx` and `bottom` off the opaque bounding box.
`height` is the frame, not the bounding box, when the portrait came out of the
same 128px setup as the rest; a one-off at another size uses its own numbers,
the way Akira does.

Everyone still without an entry — enemies, villagers — falls through to
`drawFacePortrait`, which builds a face out of shapes from the class colour.

See `AGENTS.md` before generating anything.
