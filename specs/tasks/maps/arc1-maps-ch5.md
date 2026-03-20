# Arc 1 Maps: Chapter 5 — "Above the Clouds"

> **Prerequisites:** Gameplay Phase 1 (events, recruitment)
> **Spec refs:** `specs/maps/ch5.md`, `specs/story/chapters/ch5.md`
> **Note:** Chapters 1-4 maps already implemented. Only ch5 needs creation.

## Chapter 5 Config (`src/data/chapters/chapter5.ts`)

- [ ] Create chapter5.ts file
- [ ] Set grid size: 14×16 (14 cols, 16 rows)
- [ ] Set objective: Seize (throne at row 1, center)
- [ ] Set par turns: 18
- [ ] Set deployment slots: 6
- [ ] Set force deploy: Ren
- [ ] Set chapter name: "Above the Clouds"
- [ ] Set arc: 1

## Terrain Grid

- [ ] Design 14×16 terrain grid per spec: mountain fortress vertical assault
- [ ] Bottom rows (14-15): plains with player spawn tiles (6 positions)
- [ ] Left route: village tile at ~(10, 2), forest cover path
- [ ] Center route: direct path, bridges over gaps, exposed
- [ ] Right route: mountain tiles, slow but high DEF cover
- [ ] Mid-map (rows 6-10): fortress walls, chokepoints (2-tile-wide corridors)
- [ ] Top area (rows 0-3): throne room, fort tiles for boss escorts
- [ ] Throne tile at (1, 7) — Aldric's position
- [ ] Place 2 villages for side objectives (weapon/item rewards)
- [ ] Add fort tiles at strategic defense points

## Enemy Placements

- [ ] Boss: General Aldric — soldier class, Lv7, steel_lance + javelin, boss AI
  - Position: (1, 7) on throne
  - Stats: HP 50, high DEF, per spec
- [ ] 2 Knight escorts — soldier class, Lv5, iron_lance, guard AI (radius 3)
  - Positions: adjacent to throne
- [ ] 3 Soldiers — Lv4-5, iron_lance/steel_lance, aggressive AI
  - Positions: mid-fortress corridors
- [ ] 2 Archers — Lv4, iron_bow, stationary AI on elevated positions
- [ ] 2 Fighters — Lv4, iron_axe, aggressive AI, patrol left/right routes
- [ ] 1 Mage — Lv4, fire tome, guard AI near center
- [ ] Total: ~11 enemies (Arc 1 scale: 8-12)

## Player Units

- [ ] Yuel (Pegasus Knight) joins at chapter start — add to chapter roster
- [ ] Create Yuel unit data: Lv3, iron_lance, Pegasus Knight class, flying
- [ ] Yuel growth rates: SPD/RES focused per spec
- [ ] Available roster: Ren, Kael, Senna, Bram, Lira, Voss, Nira, Coda, Yuel (9 total)
- [ ] Deploy up to 6 from roster

## Mid-Battle Events

- [ ] Turn 3: Terrain shift event — 2 forest tiles become plains (flicker animation)
  - Dialogue: Senna notices terrain data stutter
- [ ] Turn 5: Data Void spawns — 3×2 block at northeast corner becomes impassable void
  - Dialogue: party reacts to black void appearing
  - Visual: void tiles render as black/static
- [ ] Turn 5: Senna's RNG analysis dialogue — "The seed changed. That doesn't happen."
- [ ] Turn 8: Reinforcements — 2 soldiers spawn from fortress sides
- [ ] Boss defeat: Aldric dialogue (unaware tier 4, professional soldier)
- [ ] Throne seize: Arc 1 conclusion event — "The script isn't safe anymore"

## Rewards & Items

- [ ] Village 1 reward: Steel Sword
- [ ] Village 2 reward: Vulnerary ×2
- [ ] Boss drop: Silver Lance or stat booster
- [ ] Chest (if any): promotion hint item or gold

## Validation

- [ ] Chapter loads without errors in dev server
- [ ] All 11 enemies placed on valid terrain tiles
- [ ] Player spawn tiles are accessible plains
- [ ] Pathfinding works for all 3 routes
- [ ] Events fire at correct turns
- [ ] Boss can be defeated and throne seized
- [ ] Victory triggers chapter completion
- [ ] Yuel appears in roster for subsequent chapters
