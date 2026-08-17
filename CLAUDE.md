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

  battle/
    combat.ts        Forecast and resolution. Formulas: specs/systems/combat.md
    battleScene.ts   The battle animation scene
    support.ts       Support ranks, affinity bonuses, adjacency accumulation

  data/
    chapter1.ts      Map string + unit placement
    classes.ts       Class table: weapon ranks, move type, promotion branches
    weapons.ts       Weapon table, weapon-rank thresholds, the triangle
    terrain.ts       Terrain by map character

  game/
    game.ts          Turn flow, selection, commands, victory
    ai.ts            Enemy decision-making

  render/
    mapRender.ts     Map, units, cursor, range overlays, HUD
    sprites.ts       Characters — Shigeru from a sheet, the rest drawn in code
    layout.ts        Tile size, the viewport, and the camera

  story/
    script.ts        Chapter script
    dialogue.ts      Dialogue box rendering and advance

  assets/
    sprites/         PNG sheets kept from the previous version — see below
    portraits/       Dialogue portraits (currently empty)
```

## Art

`src/render/sprites.ts` draws every character **in code**. Nothing there reads a
PNG. That is how the PoC works and it is what got adopted.

`src/assets/sprites/` still holds the sheets commissioned through PixelLab
before the port, including `shigeru-sheet.png` — 46 frames across seven clips,
generated from a registered character so every frame is the same drawing. They
are kept deliberately and are **not wired into the renderer yet**.

`tools/sprites/` is the PixelLab client. `reference/shigeru.png` is the one
approved standing frame; see `AGENTS.md` before touching any of it.

## Specs

**`specs/systems/`** documents how the game actually works, written from the
code — combat arithmetic, the unit model, supports, terrain and the turn, and
the presentation layer. Keep it true to the code; it is the reference, not a
wish list.

**`specs/story/`** is the Tsushima campaign: Shigeru, Akira, Takeshi, 25
chapters. Only chapter 1's script and Shigeru himself are in the game. Read it
as the design target, never as a description of the code.

Everything that documented the deleted React implementation was removed with it.
Git history has it.
