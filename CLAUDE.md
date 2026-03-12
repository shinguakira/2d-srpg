# CLAUDE.md — AI Agent Guide

## Quick Start

```bash
npm run dev          # Start Vite dev server (localhost:5173)
npm run build        # TypeScript check + Vite production build
npx vitest run       # Run unit tests (src/core/ logic only)
npx playwright test  # Run E2E tests (needs dev server running)
```

## Project Overview

Fire Emblem-style tactical SRPG. React 18 + TypeScript + Vite. **DOM-only** (no canvas) for E2E testability. Zustand for state (no Redux, no Context).

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
    sprites/          Shared SVG sprite rendering (classSprites.tsx — all class visuals)
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
- **No external assets:** SVG sprites rendered inline (see `sprites/classSprites.tsx`)
- **CSS:** BEM-style classes (`.action-menu__button`), dark navy theme (#1a1a2e)
- **Action pattern:** Store actions are thin wrappers → `actions/{domain}Actions.ts` has the logic

## Game Flow

1. Player phase: select unit → show movement range → click to move → action menu (attack/heal/item/wait/seize) → resolve → next unit
2. Enemy phase: `computeEnemyActions` → `executeNextEnemyAction` loop → `endEnemyTurn`
3. Combat: `calculateCombatForecast` (preview) → `resolveCombat` (RNG rolls) → `CombatAnimation` (visual) → `finishCombat` (apply results)

## Testing

- Unit tests in `tests/unit/` — test `src/core/` pure logic only
- E2E tests in `tests/e2e/` — Playwright with `?seed=12345` for determinism
- Screenshots saved to `screenshots/e2e/` and `screenshots/debug/`
