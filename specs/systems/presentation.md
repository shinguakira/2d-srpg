# Presentation

TypeScript and Canvas 2D. No framework, no state library, no asset pipeline.
One `<canvas>` at 960×640, one frame loop in `src/main.ts`.

## Layout and the camera

`render/layout.ts`. `TILE` 40, and the board is drawn into a window at `(80, 40)`
measuring `VIEW_W × VIEW_H` = 800×560 — twenty tiles by fourteen. Everything
outside that window is HUD and does not move.

The map may be larger than the window. `camera` is a scroll position in pixels;
`drawScene` clips to the window, translates by `-camera`, and draws only the
tiles that fall inside. `screenToTile` reads the camera back out, so the mouse
still lands on the tile under it.

`focusOn(tx, ty, dt)` follows a point with a **three-tile dead zone**: the camera
does not move until the point comes within three tiles of an edge, so walking
around the middle of the board does not shake the screen. It eases
exponentially, snaps when it is within half a pixel of the target — a fractional
offset smears tile borders — and clamps so the board's edge is never inside the
window. A map that fits the window therefore never scrolls, which is why chapter
1 looks the same as it did before the camera existed.

What it follows is the walking unit if one is walking, otherwise the cursor. An
enemy that moves off-screen during its phase brings the camera with it.

`specs/story/chapter-scale.md` sizes chapters 20×14 rising to 34×24, the way GBA
Fire Emblem does. Everything past 20×14 scrolls.

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
