# Presentation

TypeScript and Canvas 2D. No framework, no state library, no asset pipeline.
One `<canvas>` at 960×640, one frame loop in `src/main.ts`.

## Layout

`TILE` 40, origin `(80, 40)`, so the visible board is at most 22×15. Chapter 1
is 20×14 and fits.

**There is no camera.** A map larger than the window runs off the canvas, which
is why chapter 1 was sized to fit rather than to the design.

That is backwards and it blocks the campaign. `specs/story/chapter-scale.md`
sizes chapters the way GBA Fire Emblem does — 20×14 rising to 34×24 — because
those games scroll. **Nothing past Ch5 can be built until the camera exists**:
scroll to follow the cursor, keep the selected unit in frame, clamp at the map
edges, and convert screen to tile through the offset instead of the constant it
uses now.

## Drawing

| | |
|---|---|
| `render/mapRender.ts` | map, units, cursor, ranges, HUD, banners |
| `render/sprites.ts` | characters |
| `battle/battleScene.ts` | the battle animation |
| `story/dialogue.ts` | the dialogue box |

## Characters are drawn in code

`sprites.ts` builds every character out of shapes, coloured from the class table.
No PNG involved, which is the PoC's approach and was adopted deliberately.

**Shigeru is the exception.** He renders from `assets/sprites/shigeru-sheet.png`,
a single 84px-square, 46-frame sheet generated from a character registered with
PixelLab — so every frame is the same drawing rather than a fresh one.

| clip | frames | fps | loops |
|---|---|---|---|
| idle | 0–3 | 6 | yes |
| walk | 4–12 | 10 | yes |
| attack | 13–19 | 12 | |
| crit | 20–28 | 14 | |
| dodge | 29–33 | 12 | |
| hit | 34–38 | 12 | |
| die | 39–45 | 8 | |

Callers pass a clip name, and optionally `clipT` — a 0..1 position within it.
The battle scene passes `clipT` so the swing is scrubbed across the windup and
the defender's reaction begins on the frame damage lands. On a clock the sword
finishes its arc before the hit registers. Non-looping clips hold their last
frame.

`SHEET_UNITS` is the whole registry; a second character needs an entry and a
sheet, nothing else.

## Art rules

See `AGENTS.md`. Our code does not draw characters — the generator does. The
in-code sprites are inherited from the PoC and are not a licence to add more.
