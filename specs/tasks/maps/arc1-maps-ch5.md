# Arc 1 Maps: Chapter 5 — "Above the Clouds"

> **Prerequisites:** Gameplay Phase 1 (events, recruitment)
> **Spec refs:** `specs/maps/ch5.md`, `specs/story/chapters/ch5.md`
> **Note:** Chapters 1-4 maps already implemented. Only ch5 needs creation.

## Chapter 5 Config (`src/data/chapters/chapter5.ts`)

> **Ref:** [`specs/maps/ch5.md`](specs/maps/ch5.md)

- [x] Create chapter5.ts file
- [x] Set grid size: 14×16 (14 cols, 16 rows)
- [x] Set objective: Seize (throne at row 1, center)
- [x] Set par turns: 14 (adjusted from 18 per map spec tactical pacing)
- [x] Set deployment slots: 6
- [x] Set force deploy: Shigeru
- [x] Set chapter name: "Above the Clouds"
- [x] Set arc: 1

## Terrain Grid

> **Ref:** [`specs/maps/ch5.md`](specs/maps/ch5.md), [`specs/gameplay/terrain.md`](specs/gameplay/terrain.md)

- [x] Design 14×16 terrain grid per spec: mountain fortress vertical assault
- [x] Bottom rows (13-15): plains with player spawn tiles (9 positions)
- [x] Left route: village tile at (2, 11), forest cover path
- [x] Center route: direct path, bridge over water gap, exposed
- [x] Right route: mountain tiles, slow but high DEF cover
- [x] Mid-map (rows 6-10): forested ridge, chokepoints, forts
- [x] Top area (rows 0-5): fortress interior, throne room, wall pillars
- [x] Throne tile at (7, 1) — Roderic's position
- [x] Place 1 village + 1 chest for side objectives (steel_sword + javelin rewards)
- [x] Add fort tiles at strategic defense points (4,9) and (9,9)

## Enemy Placements

> **Ref:** [`specs/maps/ch5.md`](specs/maps/ch5.md), [`specs/gameplay/ai.md`](specs/gameplay/ai.md)

- [x] Boss: General Roderic — knight class, Lv12, steel_lance + javelin, boss AI
  - Position: (7, 1) on throne
  - Stats: HP 50, DEF 14, armored (rapier effective)
- [x] 2 Knight escorts — knight class, Lv10, iron_lance, guard AI (radius 2)
  - Positions: (6, 2) and (8, 2) adjacent to throne
- [x] 2 Soldiers — Lv8, iron_lance/steel_lance, guard AI (radius 3)
  - Positions: (5, 4) and (9, 4) at fortress gate
- [x] 2 Archers — Lv7, iron_bow, stationary AI on wall positions
  - Positions: (3, 3) and (11, 3)
- [x] 2 Cavaliers — Lv8, iron_lance, guard AI (radius 4), patrol flanks
  - Positions: (3, 7) and (10, 7)
- [x] 1 Mage — Lv8, fire tome, guard AI (radius 3) near center
  - Position: (7, 5)
- [x] 2 Brigands — Lv6, iron_axe, aggressive AI at approach
  - Positions: (4, 10) and (10, 10)
- [x] Total: 12 enemies (Arc 1 scale: 8-12)

## Player Units

> **Ref:** [`specs/story/characters/elin.md`](specs/story/characters/elin.md), [`specs/story/roster.md`](specs/story/roster.md)

- [x] Elin (Pegasus Knight) joins at chapter start — added to chapter playerUnits + recruitableUnits
- [x] Create Elin unit data: Lv3, iron_lance, Pegasus Knight class, flying
- [x] Elin stat overrides: SPD 10, SKL 7, RES 6 (SPD/RES focused)
- [x] Available roster: Shigeru, Akira, Lisette, Gareth, Mirelle, Halvar, Bryn, Fenn, Elin (9 total)
- [x] Deploy up to 6 from roster
- [x] Roster injection in campaignStore.startChapter auto-adds missing playerUnits

## Mid-Battle Events

> **Ref:** [`specs/story/chapters/ch5.md`](specs/story/chapters/ch5.md), [`specs/maps/ch5.md`](specs/maps/ch5.md)

- [x] Turn 3: Terrain shift event — 6 tiles change terrain type via change_terrain effects
  - Dialogue: Lisette notices terrain data changed after she mapped it
- [x] Turn 5: Abyssal Rift spawns — 3×2 block (rows 0-1, cols 10-12) becomes data_void
  - Dialogue: Elin recognizes the void from the sky, Fenn calls it "unloaded"
  - Guard AI enemies near void (archer_2, cavalier_2) scatter to aggressive
- [x] Turn 7: Forecast flicker — dialogue-only (Lisette's seed analysis breaks)
- [x] Turn 6: Reinforcements — 2 soldiers spawn from south edge
- [x] Turn 8: Reinforcements — 1 cavalier spawns from west
- [x] Boss approach: Roderic/Shigeru exchange at fortress gate (unit_at trigger)
- [x] Boss defeat: Roderic deathQuote — "A real army... and you still broke through."
- [x] Epilogue: Arc 1 conclusion — "The script isn't safe anymore"

## Rewards & Items

> **Ref:** [`specs/gameplay/economy.md`](specs/gameplay/economy.md), [`specs/gameplay/items.md`](specs/gameplay/items.md)

- [x] Village reward: Steel Sword (at position 2, 11)
- [x] Chest reward: Javelin (at position 12, 3 — Fenn can reach via right wall)
- [x] Boss drop: handled via deathQuote (no item drop mechanism in current code)

## Validation

- [x] Chapter loads without errors — `npm run build` zero errors
- [x] All 12 enemies placed on valid terrain tiles
- [x] Player spawn tiles are accessible plains
- [x] Pathfinding works for all 3 routes (left bridge, center direct, right mountain)
- [x] Events fire at correct turns (3, 5, 7 + unit_at boss approach)
- [x] Boss can be defeated and throne seized
- [x] Victory triggers chapter completion (seize objective + epilogue)
- [x] Elin appears in roster for subsequent chapters (roster injection + recruitableUnits)
- [x] `npx vitest run` — all 628 tests pass
