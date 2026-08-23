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

## The critical, and the level-up

`battle/battleScene.ts`. Both are set-pieces in the original, not louder versions
of the ordinary case, so both are staged rather than decorated.

**Critical.** The windup runs 0.52s against a normal blow's 0.2 — long enough for
a beat of anticipation. During it the camera pushes in on the striker and
**holds** there rather than easing back, the screen darkens, gold speed lines
converge, and a gradient drops the receiving side into shadow (drawn over them,
not as transparency — fading a sprite makes a ghost). Impact **freezes the world
for 0.11s**, flashes white, shakes 20px, and throws a ring and shards out of the
point of contact.

Shigeru and Akira play a dedicated **`crit` clip** — nine frames each from their
sheets — so for them the swing itself is different art. Everyone else reuses the
attack clip under the new staging, because our code does not draw characters.

**Level-up.** The layout is **measured off real FE8 screenshots at 240×160 and
multiplied by four**, which is exactly what 960×640 is. Every number in
`LV_PLAQUE`, `LV_PANEL`, `LV_COL` and the rest came off a pixel ruler, not off a
guess at what it looked like.

What that gives is two frames stacked in the **left half of the screen** — a
narrow plaque carrying *class* and *Lv*, and under it the stat panel, 132×72 in
GBA pixels. The **portrait stands outside them, on the right**, at full size. It
is not inset into a window; the original never puts it in one, and a face in a
box turns the screen into a dialog.

The panel is two columns of four in the original's order — HP, 力, 技, 速さ down
the left, 幸運, 守備, 魔防, 体格 down the right. **力 and 魔力 never both appear**:
the class picks one and it takes that row (see `specs/systems/units.md`).
**体格 has a row even though nothing raises it**, which is what FE8 does.

Colour is the original's: gold labels on a `#7394b5` field, pale blue numerals,
gold `+N`, and a three-line pale rule running from each label out under its
number to the `+`. The gain star is the real 7×7 sprite traced out — a long top
spike, side horns, two feet — and it **appears when the stat rises and stays**.
A star that flies off and fades is a particle effect; the original's is a mark.

All eight are on screen **at their old values from the first frame**. Then it
goes down the list one beat at a time, 0.34s apart: a stat that rose ticks up by
one, pops, plants its star and **rings**, a stat that did not simply passes. The
pitch climbs with each gain, so a good level sounds like a rising phrase.

That waiting is the whole screen. Revealing the rows progressively, or printing
the new numbers straight away, turns a set-piece into a receipt.

The **EXP gauge** that precedes it is drawn with the same frame and the same
palette, because it is the same set-piece — the bar fills, and the frame it
filled in becomes the frame the stats arrive in.

## Sound

`audio/sfx.ts`. **Every waveform is generated; there are no audio files.** The
GBA's sound is a few square and triangle channels, and WebAudio's oscillators do
the same job, so bells and impacts cost nothing on disk.

Level-up rings, the closing chord, and the three combat sounds — hit, effective,
critical, and a miss that just cuts air. All of it runs through one master gain,
which is what the 効果音 option switches and what `__app.sfx()` taps when a clip
is being recorded. `AudioContext` starts suspended under the autoplay rules and
wakes on the first sound; the game always passes through a keypress or a tap
before combat, so nothing is lost.

There is no music, so there is no music option.

## The dialogue box

`story/dialogue.ts`. FE8's box is a **speech balloon that shrinks to fit the
line and sits over the speaker's head**, with a tail pointing down at them. It
is near-white with a thin dark outline, and there is **no name plate** — the
portrait and the tail say who is talking. Narration gets the same balloon,
centred, without a tail.

Text is 28px, which is what FE8's 16px on a 240px-wide screen works out to at
960. Ours was 21px in a fixed 832px band with a name plate and cream paper — a
later-Fire-Emblem look, not this one.

**Turn events run the chapters that need staging.** `ChapterDef.events` is a
list of `{ turn, script?, spawn?, defect?, toNpc?, kill?, terrain?, log? }` fired
at the head of that turn's player phase, before the player can act. It is what
lets a unit arrive mid-battle (Fenn on Ch4 turn 3, Nadine on Ch6 turn 4, Viviane
on Ch9 turn 3, Jorn on Ch11 turn 2, Selma on Ch13 turn 3, Aeryn on Ch18 turn 6),
what turns Rolf on Ch18 turn 4 with `defect`, and what makes **Halvar's nine
turns** work — turn 4 hands him to the enemy AI as an NPC, turn 13 kills him
outright. A scripted death is not a casualty: nothing the player does reaches
him, which is the chapter.

**`terrain` rewrites the board mid-chapter.** Ch15's blight edge climbs a row
every other turn; Ch24's cliff road goes grey behind the party and then falls
away entirely, and anything standing on a tile that becomes a rift is shoved
aside if there is room and lost if there is not.

Objectives are `seize | rout | boss | survive | escape | breach`, and **`guard`
composes with any of them** — a list of ids that lose the chapter if they fall.
FE's "protect X" is a defeat condition, not a win condition, and Ch10's Elder
Ilse is one: an `allies` unit with mov 0 and no weapon, who costs no deployment
slot. Ch14's Ald and Ch19's keeper are the same shape.

**`escape`** puts a 脱出 command on one tile. Anyone may take it and leaves the
board alive; **the lord taking it ends the chapter**, so the only question the
objective asks is what order you send people out in. Ch11 and Ch23.

**`breach` is Ch24 and only Ch24.** Two stages on the gate tile, both resolved at
the end of the player phase:

| | |
|---|---|
| 解呪 | a unit carrying light magic or a staff must hold the gate tile for `wardTurns` consecutive phases. Knocked off, or dead, and the count is zero again |
| 破石 | after that, every player unit on the gate tile or the two beside it adds its 力 to a running total each phase. The gate opens at `breakTotal` |

The split exists so the chapter cannot be solved with the units the player has
been winning with: it wants a healer standing still in the open for three turns
and the bruisers off the line swinging at a wall.

**Fog of war** is `ChapterDef.fog`, a vision radius. Tiles no player unit can see
are covered by a translucent sheet — the terrain stays readable, but enemies
standing under it are not drawn at all. Forts, gates and thrones see two tiles
further, because standing watch ought to mean something. Ch12 is the only chapter
that uses it.

**Support conversations are not chapter scripts.** They live in
`story/supports.ts`, nineteen pairs of C/B/A, because FE's supports run on their
own clock —— they rise when two units stand next to each other, not when a
chapter says so. `SUPPORT_PAIRS` is also what `roster.ts` reads to give units
their support slots, so **a pair with no conversation written accumulates
nothing**. A unit recruited by persuasion mid-chapter gets its links wired at
that moment (`linkSupports`), because it was not in the roster when the roster
was built.

**Nothing in a spoken line may use `**` for emphasis.** The balloon prints one
weight and one colour, so the asterisks come out as asterisks. They are a
spec-writing habit and they do not belong in `text`.

**Every script belongs to a chapter.** `ChapterScripts` — opening, ending,
defeat, boss conversation, and one persuade script per recruitable id — hangs off
`ChapterDef`, and the chapter files under `story/chapters/` are the only place a
line of chapter dialogue lives. `Game` borrows the set for the chapter it is
running and plays whatever is there; a chapter with no opening just shows its
title band, and the tower and the skirmish have no scripts at all.

Before this, `game.ts` imported five constants straight out of `story/script.ts`
and there was only ever one chapter's worth of them, so **clearing chapter 2
played chapter 1's epilogue** — Mirelle arriving at the gate, again — and Vidar
and Olrik both spoke Hagen's lines about his brother's village. What stays in
`story/script.ts` is the death quotes; the supports moved to `story/supports.ts`
and the faces of people who only ever speak are in `story/cameo.ts`.

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
six clips —— he has no walk, so walk falls back to idle).

**The dialogue portrait is not the map sprite, and it is art for the whole
speaking cast.** `PORTRAIT_UNITS` in `sprites.ts` maps a unit id to a PNG in
`assets/portraits/`, and **everyone who says a line has one** —— forty of them:
the sixteen of the roster, the named bosses of twenty-three chapters, and the
handful of people who speak without ever holding a weapon. All but Shigeru and
Akira were generated one call each with **Shigeru's portrait as bitforge's
`style_image`**, so the conversation reads as one artist rather than as a
gallery. The code-drawn face is what a unit with no entry falls back to ——
nameless enemies, villagers —— not what the cast uses.

**Two ids share one drawing where they are one person.** `c25_boss` uses
Takeshi's Ch10 portrait and `p_aeryn` uses her Ch6 one. A second commission for
a face that already exists comes back as somebody else with the same name.

**Two speakers are deliberately faceless.** The Ch9 raider captain has no
portrait and no death line because Ch9's enemies are not characters, and the
Colossus is not a person. Everything else with a name has both, including the
Ch24 rearguard commander, who has a rank instead of a name but is a character.

Ch12, Ch20 and Ch23 have **no boss at all**, which is a different kind of
absence: nothing on those boards can be talked to, threatened or spared.

**A speaker does not have to be a unit.** `Game.speaker` looks on the board, then
in the campaign roster, then in `story/cameo.ts` —— which exists for Takeshi, who
walks down the hill road in Ch10 and is not a unit until Ch25. Without the third
step the most important scene in the game plays with an empty right-hand side.

The registry carries `cx`, `bottom` and `height` because the drawings do not
fill their frames the same way. They share `height: 128`: they came out of
the same 128px setup with the head in the same place, so the face size has to
come from the frame. Scaling each to its own bounding box instead makes a
short bust —— one that stops at the collarbone —— render half again too large.

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
