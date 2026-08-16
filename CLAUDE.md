# CLAUDE.md — AI Agent Guide

## Quick Start

```bash
npm run dev          # Start Vite dev server (localhost:5173)
npm run typecheck    # Type-check src + tests + vite.config (tsc -b)
npm run build        # Type-check + Vite production build
npx vitest run       # Run unit tests (src/core/ logic only)
npx playwright test  # Run E2E tests (needs dev server running)
```

> **Never use `npx tsc --noEmit` here — it checks nothing and exits 0.**
> The root `tsconfig.json` is solution-style (`"files": []` plus project
> references), so the default project is empty and the command passes no
> matter how broken the code is. Use `npm run typecheck`, which runs
> `tsc -b` and walks the three referenced projects: `tsconfig.app.json`
> (src), `tsconfig.test.json` (tests), `tsconfig.node.json` (vite.config).

## Project Overview

Fire Emblem-style tactical SRPG. React 18 + TypeScript + Vite. **DOM-only** (no canvas) for E2E testability. Zustand for state (no Redux, no Context).

## Story

A straight, classical SRPG story in the vein of *FE: The Sacred Stones* — no meta,
no fourth wall, nobody knows they are in a game. **Shigeru**, prince of the fallen
kingdom of Amagi, carries the **Flamebrand**; **Akira** is his sworn retainer;
**Takeshi**, Emperor of Kurogane, is the final boss — a shaven-headed giant who took
the sealed **Blackflame** into his own body because he intends to end war rather than
postpone it again.

### The stage is Tsushima; the genre is not Japan

The campaign is laid over the real island of **Tsushima** and uses its real
toponyms — Izuhara, Kuta, the Sasu river, Shiine, Tsutsu, Kaneda on Shiroyama, Aso
Bay, Kechi, the Cut at Ōfunakoshi, Yatate, Shiratake, Tateragyama, Komoda Beach, and
**Are**, where the campaign ends.

**The period dressing stays Fire Emblem.** Knights, lances, cavalry, pegasus riders,
castles, shrines, an empire across the water. No samurai, no Shinto/Buddhist
specifics, no real history. If a scene would only work in a Japanese historical
drama, it is wrong for this game.

Two fixed facts of the geography:

- Everything bad comes off the **western sea**. Kurogane landed at Komoda; the
  Blackflame was sealed at Are. Every blight bearing in Arc 1 is **west-north-west**.
  "The north" is never the direction of dread — that is a leftover from the old draft.
- The story never leaves the **Lower Country**, south of the Cut. The **Upper
  Country** is optional post-campaign content only.

Rules when writing dialogue:

- **No irony about the setting.** Nobody comments on tropes, mechanics, or narrative
  structure. Tactical vocabulary (avoid, terrain cost, weapon triangle) is fine — it
  is how soldiers talk about their trade.
- **Enemies are people with orders.** Nearly every boss knows something is wrong in
  the north and has been told not to look at it. Killing them should cost something.
- **Takeshi is never written as mad.** He is polite, patient and certain, and he
  makes the strongest argument in the game for his own position.
- Some identifiers still carry the *old* meta-fiction (`awr`, `sync`, `loop`,
  terrain `glitched` / `data_void`). Those are internal only — the player-facing
  labels are Insight / Attunement / Emberlight and Blighted / Abyssal Rift. Don't
  reintroduce the old vocabulary in user-visible strings.

Story bible: `specs/story/` — `world.md`, `characters.md`, `bosses.md`,
`arc-structure.md`, and `chapters/ch1.md`…`ch25.md`. The exact dialogue lives in
`src/data/chapters/`; the specs describe intent.

## Directory Structure

```
src/
  core/              Pure game logic — ZERO React imports, fully unit-testable
    types.ts          All game types (Unit, GameMap, Position, etc.)
    combat.ts         Combat forecast + resolution (weapon triangle, hit/crit/damage)
    pathfinding.ts    BFS movement range, attack range, danger zone, getManhattanDistance
    ai.ts             Enemy AI decision-making (aggressive/stationary/guard/boss)
    experience.ts     EXP gain, level-up rolls, stat growth
    rng.ts            Seeded PRNG — ?seed= URL param for E2E determinism
    terrain.ts        Terrain data lookup (movement cost, defense/avoid bonuses)
    items.ts          Item utility functions (canUseItem)
    saveManager.ts    Save/load to localStorage

  data/              Static game data — weapons, units, classes, chapters
    weapons.ts        15 weapon definitions (swords, lances, axes, magic, staves)
    units.ts          Player + enemy unit templates
    classes.ts        Class definitions (lord, cavalier, mage, fighter, soldier, cleric)
    items.ts          Consumable items (vulnerary)
    chapters/         Chapter map definitions (terrain grids, unit placements, objectives)
    campaignConfig.ts Campaign progression metadata

  stores/            Zustand state management
    gameStore.ts      Main store — thin wiring file, delegates to action modules
    gameStoreTypes.ts GameState + GameActions type definitions
    actions/          One file per action domain:
      initActions.ts        Chapter initialization
      selectionActions.ts   Unit selection, tile hover, tile click
      movementActions.ts    Confirm move (wait action)
      combatActions.ts      Player combat flow (target → forecast → resolve → animate)
      enemyActions.ts       Enemy AI turn execution
      healActions.ts        Staff healing targeting + resolution
      itemActions.ts        Consumable item usage
      villageActions.ts     Village visit + reward
      turnActions.ts        Phase transitions (player → enemy → player)
      seizeActions.ts       Seize objective
      miscActions.ts        Danger zone toggle, dismiss overlays, weapon select
    helpers/           Pure helper functions used by actions
      constants.ts         EMPTY_SET, EMPTY_MAP, IDLE_RESET (shared state reset)
      combatResolution.ts  Shared combat result application (HP, deaths, floats)
      mapHelpers.ts        buildMap, placeUnits, checkVictory, allPlayersDone
      dangerZoneHelpers.ts refreshDangerZone
    campaignStore.ts  Campaign progression, chapter selection, save/load
    uiStore.ts        Camera offset, tile size, cursor position

  components/        React UI layer
    Combat/           BattleSprite, CombatAnimation, CombatPreview, LevelUpPopup
    Grid/             TacticalGrid, Tile, TerrainSprite, RangeOverlay, FloatingNumber
    UI/               ActionMenu, TurnInfo, EndTurnButton, PhaseBanner, panels, overlays
    Units/            UnitSprite (grid avatar + HP bar), UnitStatsPanel
    sprites/          Sprite sheet system — see "Sprites" below
      spriteSheetConfig.ts  Sheet definitions: grid, clips, anchor + lookup helpers
      useClipFrame.ts       Shared animation clock (one timer for the whole map)
      statusEffectIcons.tsx Inline SVG status icons
    Game.tsx          Main game orchestrator (hooks + viewport + overlays)
    TitleScreen.tsx   Title screen + chapter selection + mode selection

  hooks/             Custom React hooks
    useKeyboard.ts   Keyboard input (arrow keys, Tab, Enter, X, I, Escape)
    useCamera.ts     Camera panning (edge scroll + keyboard)
    useGameLoop.ts   Enemy turn auto-advance loop

  styles/            CSS organized by component
    ui/              Per-component CSS files (@imported via index.css)
    grid.css         Grid tile layout
    units.css        Unit sprite positioning
    camera.css       Camera transform container
```

## Key Conventions

- **State:** Zustand ONLY. Three stores: gameStore, uiStore, campaignStore
- **Testing:** Vitest for unit tests, Playwright for E2E. ALL interactive elements have `data-testid`
- **Seeded RNG:** `?seed=12345` URL param makes gameplay deterministic for E2E
- **Assets:** PNG sprite sheets in `src/assets/sprites/`, imported through Vite so
  they are hashed and only fetched when a unit using them is on screen. Icons and
  status effects are still inline SVG.
- **CSS:** BEM-style classes (`.action-menu__button`), dark navy theme (#1a1a2e)
- **Action pattern:** Store actions are thin wrappers → `actions/{domain}Actions.ts` has the logic

## Sprites

There are three kinds of sheet, and they are read through the same interface.

**Commissioned (Shigeru).** Generated through the PixelLab API by
`tools/sprites/pixellab.mjs`, which talks to the REST endpoints directly — the
`@pixellab-code/pixellab` SDK validates responses against a `usage` shape the
service no longer returns, so successful calls come back as "Response validation
failed" after the money is spent. Three commands, in order:

```bash
node tools/sprites/pixellab.mjs base <id> <ref.png> "<desc>"        # redraw at 64px
node tools/sprites/pixellab.mjs sheet <id> <base.png> "<desc>"      # all 7 clips
node tools/sprites/import.mjs tools/sprites/out/<id>-sheet.png <id> --cols 21 --rows 1
```

Poses come from `tools/sprites/poses.mjs`, not from a text prompt. Text-driven
animation cannot do this job: asked for an attack it draws the slash *effect*
and shrinks the character behind it, and the guidance knobs trade appearance
against movement so hard that enough weight to move a limb is enough to produce
a different person. `animate-with-skeleton` separates them — appearance from the
reference image, pose from keypoints. Constraints that are not negotiable:

- **Exactly 3 frames per clip.** The endpoint is a three-frame window.
- **Keypoints are normalised 0..1.** Pixel coordinates are accepted, ignored,
  and returned as three identical frames — it reads as "the pose did nothing".
- **`pose_guidance_scale` 20, `reference_guidance_scale` 1.** Below ~15 every
  frame comes back standing.
- **The reference must be exactly `image_size`** and at least 64px.

`node tools/sprites/poses.mjs preview out.png` draws the pose tables as stick
figures. Check there first — the API is metered, eyeballing a pose is free.

**Rig-drawn (Akira, Takeshi).** Drawn by `tools/sprites/`, not by hand:
a zlib-only PNG encoder, a polygon rasteriser, and a rig that builds frames from
joint angles. A character is a palette plus part shapes plus one pose table per
clip. `node tools/sprites/build.mjs` writes `src/assets/sprites/<id>-battle.png`
**and** `src/components/sprites/generatedSheets.ts`, so grid size, anchor and
frame numbers are measured from the render and cannot drift from the art. Edit
the character module, never the PNG. The build warns when a pose reaches outside
its frame.

**Hand-measured (everything else).** The AI-generated sheets, described directly
in `spriteSheetConfig.ts`. Three things are kept separate on purpose —
collapsing them is what caused the bugs this system replaced:

1. **The sheet** — `cols`/`rows`/`sheetW`/`sheetH`. Frame size is derived as
   `sheetW/cols` and stays **fractional**. Do not round it; `1536/7 = 219.43`
   rounded to `219` drifts a visible amount by the last column.
2. **Clips** — a named animation is an explicit list of frame numbers plus fps
   and loop. It is *not* "a row". These sheets are AI-generated continuous
   sequences: a row often starts with the character and ends in a full-frame
   explosion with no character in it, and the real attack is rarely in the row
   you would guess (the fighter's axe swing is frames 24-27, not row 1).
3. **`content`** — the measured bounding box of the artwork inside an idle
   frame, normalised 0..1. `cx`/`bottom` anchor the character's feet to the
   tile; `height` scales by the *artwork* rather than the frame, so a sheet
   whose character fills 55% of its frame renders the same size as one that
   fills 99%.

Rules when touching this:

- **Clips are the FE set:** `idle`, `walk`, `attack`, `crit`, `dodge`, `hit`,
  `die`. Only `idle` and `attack` are mandatory — read clips through
  `getClip(sheet, name)`, which falls back for the sheets that lack them, and
  `hasClip()` to tell a real animation from a fallback. The debug Sprites view
  labels fallbacks so a missing animation cannot pass as a working one.
- **Sizing goes through `spriteBox(sheet, contentPx)`** where `contentPx` is the
  desired on-screen height of the character. Never size by frame height. A sheet
  can declare a `charHeight` smaller than it draws to render bigger than its
  neighbours — that is how Takeshi is a head taller than everyone else.
- **Never put the sprite in a flex container.** It is absolutely positioned from
  its anchor. As a flex child it gets `flex-shrink`-ed and the feet are cropped.
- **All sheets are RGBA.** There is no blend-mode transparency hack; if you add
  a sheet with a black background, key it to real alpha first (`mix-blend-mode`
  does not work here because `.unit-sprite` creates a stacking context).
- **Animation uses the shared clock in `useClipFrame.ts`**, not per-component
  timers. Pass `phaseOf(unit.id)` so identical units do not animate in lockstep.
- **`pixelArt: true`** selects nearest-neighbour scaling. Only for genuinely
  low-resolution art — the hi-res painted sheets are scaled *down* and want
  smooth interpolation.
- Filters are composed in JS and applied to `.unit-sprite__art`; CSS keyframes
  that animate `filter` go on the `.unit-sprite__anchor` wrapper so the two
  compose instead of silently overwriting each other.

The **Debug → Sprites** screen renders every sheet with its clips, frame strips,
anchor and content values — use it to verify after changing art or clips.

`import.mjs` cleans anything generated before it reaches the game: hard alpha,
`#282828` for the line work, and a colour budget enforced by **median cut**. Not
by keeping the most common colours — a smooth-shaded generated sheet arrives
with thousands, the most frequent are all shades of the outline, and that
quantiser silently returned fifteen versions of black and painted the whole
sheet dark.

## Portraits

Fire Emblem draws a character twice: the sprite above, and a portrait that only
appears in conversation. They are not the same picture scaled — at 32px a face
is three pixels of skin.

`src/components/sprites/portraits.ts` globs `src/assets/portraits/*.png`, so a
portrait is installed by dropping in `<speaker-slug>.png` (`Elder Ilse` →
`elder-ilse.png`) and nothing else. A speaker with no file falls back to their
battle sprite, scaled up. `SPEAKERS` in that file is the single map from script
name to art, shared by `DialogueBox` (prologue) and `EventDialogue` (in battle);
it used to be duplicated in both, with different casts, and the copy that had
gone stale drew nothing at all for the chapter 1 boss.

Generate and install one with:

```bash
node tools/sprites/pixellab.mjs portrait <id> "<description>" --size 128
node tools/sprites/import.mjs tools/sprites/out/<id>-portrait.png <id> --portrait
```

Both callers set `--portrait-height` and `--portrait-sprite-scale` on the
container; the scale exists only to blow the sprite fallback up and must never
be applied to real portrait art.

## Game Flow

1. Player phase: select unit → show movement range → click to move → action menu (attack/heal/item/wait/seize) → resolve → next unit
2. Enemy phase: `computeEnemyActions` → `executeNextEnemyAction` loop → `endEnemyTurn`
3. Combat: `calculateCombatForecast` (preview) → `resolveCombat` (RNG rolls) → `CombatAnimation` (visual) → `finishCombat` (apply results)

## Testing

- Unit tests in `tests/unit/` — test `src/core/` pure logic only
- E2E tests in `tests/e2e/` — Playwright with `?seed=12345` for determinism
- Screenshots saved to `screenshots/e2e/` and `screenshots/debug/`

## ⚠️ PROTECTED FILES — DO NOT DELETE

**`specs/old/`** — Frozen archive snapshot of game design specs. NEVER delete, modify, rename, or move this folder or any files inside it. This is a read-only reference. If you need a new snapshot, create a new folder (e.g. `specs/old-v2/`).
