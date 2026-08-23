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
| `gareth.png` `bryn.png` `lisette.png` `mirelle.png` `elin.png` `ald.png` `corwin.png` `halvar.png` `fenn.png` `nadine.png` `viviane.png` | the roster |
| `hagen.png` `vidar.png` `olrik.png` `brask.png` `roderic.png` `aeryn.png` `varro.png` `wulfram.png` `ezrin.png` | the bosses of chapters 1-10 |
| `ilse.png` `takeshi.png` | the Ch10 elder, and the Emperor |

Fourteen more came the same way with Arcs 3-5:

| | who |
|---|---|
| `jorn.png` `selma.png` `rolf.png` | the shaman, the wyvern rider and the armour knight who defects |
| `targ.png` `verda.png` `keve.png` `haug.png` `halvik.png` `dorg.png` `sorg.png` `volker.png` `gerhard.png` `rear.png` | the bosses of chapters 11-24 |
| `keeper.png` `warden.png` | the Shirato keeper, and the thing still on watch under Taragi |

**Two people get one drawing each.** `c25_boss` is `takeshi.png`, the same face
the Emperor wears in Ch10, and `p_aeryn` is `aeryn.png`, the same face she wore
as the Ch6 boss. Commissioning a second portrait of a character you already have
gets you a different person wearing their name.

All of them are 128px with the head in the same place, which is why they share
`height: 128` in the registry — the face size comes from the frame, not from
how far down each drawing happens to stop.

**bitforge copies the style image hard, and that includes its palette.** Left
alone it gave the whole cast Shigeru's cool lavender hair; a red-haired brawler
came back lavender three times. What fixes it is shouting the colour in the
description (`FLAME RED hair, crimson red spiky hair, scarlet hair`) *and*
blacklisting the drift in `--negative` (`lavender hair, purple hair, silver
hair, pale hair`). The same pair of moves is what got Ald blond.

**It draws two of them side by side, and the cause is the framing phrase.**
`single character, centred` in the description and `two people, duplicate,
split image` in the negative are not enough on their own —— what actually
triggers it is **`head and shoulders fill the whole frame` together with
`--coverage 100`**. Asked to fill a square with one bust, the model will
sometimes fill it with two. Say `a close bust of ONE person, nobody else in the
picture` and leave coverage at its default, and it stops.

**Officers come back in a modern peaked cap.** Anything described as a general,
an admiral or a commander reaches for twentieth-century uniform, and putting
`cap, peaked cap, military cap, hat` in the negative is not enough. The fix is
positive: say **`bare headed, no headgear of any kind`** in the description.
Vidar, Roderic and Varro all needed it.

And the older the character, the harder you have to push: `very old`, an age in
years, and `young, middle aged` in the negative, or a seventy-year-old general
comes back at forty.

**Describing the body is what summons the second person.** The Arc 3-5 batch put
fourteen through the same prompt shape, and the four that came back as two heads
were the four that described a build — `a big man`, `a squat powerful man`,
`thickset`. Say what the *face* looks like and stop there; the model has been
asked for a bust and will draw a bust, but asked about a body it sometimes
reaches for a whole small figure to put one on.

**And saying more about the framing makes it worse, not better.** Adding `only
one head in the picture, a single face` to four prompts turned three of them
from one head into two. The wording that works is the plain one at the top —
`a close bust of ONE person, nobody else in the picture` — and past that it is a
sampling lottery. Re-roll rather than argue.

**`--detail` with a value crashes the tool.** `--detail "high detail"` and
`--detail high-detail` both take the node process down with a libuv assertion
before the request lands. Leave it off.

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
