# CLAUDE.md — AI Agent Guide

> **Read `AGENTS.md` first.** It lists the rules that override judgement.

The game system is a port of `E:\workspace\PoC\2d-poc-srpg`, adopted wholesale:
TypeScript + Canvas 2D, no framework, no state library, no build step beyond
Vite. The React/Zustand/DOM version that used to live here is in git history up
to `740e833` and is not coming back.

## Quick Start

```bash
npm run dev      # Vite dev server
npm run check    # tsc --noEmit → oxlint → oxfmt --check → knip
npm run build    # type-check + production build
```

Config lives in `.oxlintrc.json` / `.oxfmtrc.json` / `knip.json`. oxfmt skips
Markdown, because its table alignment counts a full-width character as one
column and mangles Japanese tables.

## Directory Structure

```
src/
  main.ts            Entry point: canvas, input, the frame loop
  types.ts           Unit, Weapon, Stats, UnitClass, TerrainDef

  core/
    rng.ts           xorshift32. `hitCheck` is 2RN — the average of two rolls
    grid.ts          Dijkstra movement range, path reconstruction, occupancy

  audio/
    sfx.ts           Every waveform generated on the fly; there are no sound files

  battle/
    combat.ts        Forecast and resolution. Formulas: specs/systems/combat.md
    battleScene.ts   The battle animation scene
    support.ts       Support ranks, affinity bonuses, adjacency accumulation

  data/
    chapters.ts      The live chapter: map, objective, villages, chests, shop
    chapters/        ch1.ts ch2.ts ch3.ts — one per chapter; extra.ts is the tower and skirmishes
    roster.ts        The player units, which outlive any one chapter
    classes.ts       Class table: weapon ranks, move type, promotion branches
    weapons.ts       Weapon table, weapon-rank thresholds, the triangle
    terrain.ts       Terrain by map character
    guide.ts         The guide table, read by both the title screen and the map menu

  game/
    game.ts          One chapter: turn flow, selection, commands, victory
    campaign.ts      What survives a chapter — roster, gold, convoy, options, save
    options.ts       The ten option rows and the window palettes
    suspend.ts       Suspend and resume, mid-chapter
    ai.ts            Enemy decision-making

  render/
    ground.ts        The board baked to one canvas — no grid, no per-tile fills
    text.ts          The only font stack; every drawing routine goes through it
    mapRender.ts     Map, units, cursor, ranges, windows, full-screen panels
    screens.ts       Title, world map, preparations and its sub-screens, shop, guide
    sprites.ts       Characters — Shigeru and Akira from sheets, the rest in code
    layout.ts        Tile size, the viewport, and the camera
    touch.ts         On-screen buttons for phones, and their hit tests
    viewport.ts      Fitting the canvas to the window; portrait rotation

  story/
    script.ts        Chapter script
    dialogue.ts      Dialogue box rendering and advance

  assets/
    sprites/         Battle/map sheets — shigeru-sheet.png, akira-sheet.png
    portraits/       Dialogue portraits — shigeru.png, akira.png
```

## Art

**Only Shigeru and Akira have animated sheets.** They render from 84px sheets —
`shigeru-sheet.png` (46 frames, seven clips) and `akira-sheet.png` (38 frames,
six — walk is missing). Both are registered PixelLab characters, which is what
makes the frames agree with each other. Nobody else has one, and on the map and
in battle everyone else is drawn in code by `sprites.ts`, inherited from the
PoC. That is not a licence to add more: see `AGENTS.md`.

**Dialogue portraits are a separate set, and they are art for everyone who
speaks.** `assets/portraits/` holds one per unit; the ten that are not
Shigeru's or Akira's were generated from Shigeru's portrait as a style image,
so the conversation cast is one artist's hand. What is drawn in code is the
fallback for units without an entry. `assets/portraits/README.md` has the
recipe and the three ways it goes wrong.

`tools/sprites/` is the PixelLab client — `char` to register, `anim` per
clip, `job` to collect. `reference/` holds the standing frames those
registrations were built from.

## Specs

**`specs/systems/`** documents how the game actually works, written from the
code — combat arithmetic, the unit model, supports, terrain and the turn, and
the presentation layer. Keep it true to the code; it is the reference, not a
wish list.

**`specs/story/`** is the Amagi campaign: Shigeru, Akira, Takeshi, 25 chapters.
Three of them are built. Every place name is invented — no real map, on purpose.
Read the rest as the design target, never as a description of the code.

Everything that documented the deleted React implementation was removed with it.
Git history has it.
