# Presentation

TypeScript and Canvas 2D. No framework, no state library, no asset pipeline.
One `<canvas>` at 960×640, one frame loop in `src/main.ts`. The buffer is always
that size; only the CSS box it is stretched into changes.

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

## Fitting a phone

`render/viewport.ts`. The canvas is a fixed 960×640 buffer; CSS stretches it to
whatever the window is. `fitCanvas` picks the largest whole-canvas scale that
fits and pins the element to the centre of the viewport.

**In portrait the canvas is rotated 90°.** The board is 3:2 landscape, so a
portrait phone that letterboxed it would show the game at less than half the
size. Rotating means the player turns the phone rather than squinting, and once
they do the browser reports landscape and the rotation drops away. The cost is
that `getBoundingClientRect()` then returns the *rotated* bounding box, so every
pointer coordinate has to go through `toCanvas`, which un-rotates about the
centre. Nothing may read `clientX` directly.

## Touch

`render/touch.ts`. `touchUI` is on when the pointer is coarse, when a touch
pointer is seen, or with `?touch=1`. It changes three things: on-screen buttons
appear, menu rows grow from 34px to 44px, and every keyboard hint is replaced by
its touch equivalent.

Buttons live in the 80px pillars either side of the board and the strip below it
— never over the board, which would hide units. The right pillar is 決定 and
戻る, the GBA's A and B; the left carries メニュー, 敵範囲 and 詳細, stacked from
the bottom, and drops the ones that would do nothing in the current mode.

Cursor movement has no buttons. **A tap acts, a drag looks**: pressing the board
moves the cursor there, sliding keeps moving it, and lifting confirms only if
the finger never travelled more than 12px. Without that there is no way to read
a tile's terrain or an enemy's weapon without also attacking it.

Full-screen panels are pressed directly rather than through a d-pad — the option
rows toggle on tap, the detail screen's page headings switch pages. Both hit
tests live in `mapRender.ts` next to the code that draws them, because they are
the same numbers.

The screens outside a chapter (`render/screens.ts`) each export a `hit*`
function beside their `draw*`: title rows, world-map nodes and the chapter card,
roster rows, and the セーブ / 出撃 / 戻る buttons.

## The map has no grid

`render/ground.ts`. GBA Fire Emblem's maps have **no grid lines and no
checkerboard**. Grass is a scatter of a dozen near-identical mint tones whose
pattern runs straight through tile boundaries; forests, mountains and cliffs are
objects standing on that ground, not pictures of a tile, and they overlap their
neighbours. Palette taken from the real Chapter 1: `#68c8a0` grass, `#204088`
water, `#f0f080` sand, `#f8f890`/`#606048` rock.

So the board is **baked to one offscreen canvas** and blitted, instead of being
painted a tile at a time:

- The ground is a 2px scatter picked from smoothly interpolated noise —
  interpolated, because a noise that snaps to a lattice draws rectangles, and a
  rectangle the size of a tile is a grid. The two octaves use 9px and 53px,
  neither of which divides 40.
- Where two grounds meet, the boundary is dithered over 7px rather than cut.
- **Buildings and roads have no ground colour of their own.** A fort in a field
  stands on grass; a bridge stands on water. Painting a fort's tile as stone
  puts a grey square on the field, and a grey square is a grid cell.
- Roads join up with their neighbours into one ribbon; an isolated road tile is
  an irregular patch of bare earth, not a paved square.

Rebaking costs about 50ms and happens when the chapter loads, a door opens, or a
village is visited. Drawing a frame is then one `drawImage`.

The movement and attack overlays fill their tiles but **outline only the region's
perimeter**. Stroking every tile is the same grid by another route.

## Fonts

`render/text.ts` owns the only font stack in the codebase, and every drawing
routine goes through `fontOf` / `feText` / `plainText`. GBA Fire Emblem writes
numbers, headings and prose in **one bitmap font**; before this there were three
families on screen at once, with `Consolas` for numerals.

The face is **DotGothic16**, the Japanese dot gothic of that era, linked from
`index.html`. `loadFont()` holds the first frame until it arrives — canvas text
drawn before a webfont lands is baked in the fallback — and gives up after 1.5
seconds so a dead connection cannot stop the game starting. The stack falls back
through Yu Gothic UI.

## The dialogue box

`story/dialogue.ts`. FE8's box is a **speech balloon that shrinks to fit the
line and sits over the speaker's head**, with a tail pointing down at them. It
is near-white with a thin dark outline, and there is **no name plate** — the
portrait and the tail say who is talking. Narration gets the same balloon,
centred, without a tail.

Text is 28px, which is what FE8's 16px on a 240px-wide screen works out to at
960. Ours was 21px in a fixed 832px band with a name plate and cream paper — a
later-Fire-Emblem look, not this one.

## There is no persistent HUD

GBA Fire Emblem keeps nothing on screen permanently. Turn count, army sizes,
objective and defeat condition all live in the 状況 screen; the map itself is
map, plus small windows that come and go.

So the map screen carries only:

- a **terrain window** (option: on/off) with the tile's name, def and avo
- a **unit window** (option: off / balloon / panel) for whatever the cursor is
  over. The balloon is name, level, HP and any status; the panel is the full
  stat block. Full details are always a press of R away
- a **combat forecast** while choosing a target (option: off / brief / full)
- an **objective window** that slides in at the start of a phase and leaves
  (option: on/off)

The two windows dodge each other: the unit window takes the side away from the
cursor and the terrain window takes the other one, so neither hides the other.

The forecast shows HP, 威力, 命中 and 必殺 and nothing else. Weapon triangle is
a small arrow beside the weapon's name, and effectiveness turns that name
orange —— never the words "有利" or "特効".

## Options

Ten rows, in `game/options.ts`, stored on the campaign so they survive a
chapter. Each is an index into a list of labels; left and right cycle it.

戦闘アニメ（省略 / キャラのみ / 背景あり）・ゲーム速度・文字送り・地形
ウィンドウ・ユニットウィンドウ・戦闘ウィンドウ・目標表示・オートカーソル・
オートターンエンド・ウィンドウカラー。

FE8 also has music and sound-effect switches. This game has no audio at all, so
those two rows are absent rather than dead.

**ウィンドウカラー** feeds `panel()`, which every window on the map draws
through, so one option repaints the whole HUD.

## Full-screen panels

Four of them, all reached from the map menu or R, all drawn by `mapRender.ts`:

| | |
|---|---|
| 状況 | chapter, objective, defeat condition, turn, army sizes, funds |
| ユニット | every deployed unit as a row, six pages —— 基本 / 能力 / 装備 / 個人 / 武器レベル / 支援 |
| ガイド | the same table the title screen's guide reads, from `data/guide.ts` |
| オプション | the ten rows above |

Opening a unit's details remembers the mode it came from and returns there, so
pressing R while choosing an attack target does not lose the target.

## Drawing

| | |
|---|---|
| `render/mapRender.ts` | map, units, cursor, ranges, windows, full-screen panels |
| `render/screens.ts` | title, world map, preparations and its four sub-screens, shop, guide |
| `render/touch.ts` | the on-screen buttons |
| `render/viewport.ts` | scaling, portrait rotation, pointer coordinates |
| `render/sprites.ts` | characters |
| `battle/battleScene.ts` | the battle animation |
| `story/dialogue.ts` | the dialogue box |

## Characters are drawn in code

`sprites.ts` builds every character out of shapes, coloured from the class table.
No PNG involved, which is the PoC's approach and was adopted deliberately.

**Shigeru and Akira are the exceptions.** Shigeru renders from
`assets/sprites/shigeru-sheet.png`, Akira from `akira-sheet.png` (38 frames,
six clips —— he has no walk, so walk falls back to idle). Both also have
dialogue portraits in `assets/portraits/`.

Both sheets are 84px squares generated from characters registered with PixelLab,
so every frame is the same drawing rather than a fresh one. Shigeru's 46 frames
run:

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
