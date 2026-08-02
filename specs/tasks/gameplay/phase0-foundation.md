# Phase 0: Foundation — Type Expansion & Data Backfill

> **Prerequisites:** None
> **Unlocks:** Phase 1 (Recruitment + Events)
> **Critical files:** `src/core/types.ts`, `src/data/units.ts`, `src/data/classes.ts`, `src/data/weapons.ts`, `src/core/terrain.ts`
> **Spec refs:** `specs/gameplay/stats.md`, `specs/gameplay/weapons.md`, `specs/gameplay/classes.md`, `specs/gameplay/terrain.md`

## Rename Player Units (Eirik→Ren, Seth→Kael, Lute→Senna, Natasha→Lira)

> **Ref:** [`specs/story/characters/ren.md`](specs/story/characters/ren.md), [`specs/story/characters/kael.md`](specs/story/characters/kael.md), [`specs/story/characters/senna.md`](specs/story/characters/senna.md), [`specs/story/characters/lira.md`](specs/story/characters/lira.md)

- [x] Rename `eirik` → `ren` in `src/data/units.ts` (id, name, key)
- [x] Rename `seth` → `kael` in `src/data/units.ts`
- [x] Rename `lute` → `senna` in `src/data/units.ts`
- [x] Rename `natasha` → `lira` in `src/data/units.ts`
- [x] Update death quotes to match spec character voices
- [x] Update all chapter files (`chapter1.ts`–`chapter4.ts`) unit references
- [x] Update all dialogue in chapter files (speaker names, lines)
- [x] Update E2E tests referencing old unit names
- [x] Update any component references to old unit IDs
- [x] Run `npm run build` — verify no broken references
- [x] Run E2E tests — 75/79 pass, 4 failures pre-existing

## Add Missing Player Units

> **Ref:** [`specs/story/characters/bram.md`](specs/story/characters/bram.md), [`specs/story/characters/voss.md`](specs/story/characters/voss.md), [`specs/story/characters/nira.md`](specs/story/characters/nira.md), [`specs/story/characters/coda.md`](specs/story/characters/coda.md), [`specs/story/roster.md`](specs/story/roster.md)

- [x] Add Bram (fighter, player) to `PLAYER_UNITS` — Lv1, iron_axe, STR-focused growth
- [x] Add Voss (soldier, player) to `PLAYER_UNITS` — Lv2, iron_lance, DEF-focused growth
- [x] Add Nira (archer, player) to `PLAYER_UNITS` — Lv1, iron_bow, SKL/SPD growth
- [x] Add Coda (thief, player) to `PLAYER_UNITS` — Lv1, iron_knife, SPD/SKL growth
- [x] Set stat overrides per spec for each new unit
- [x] Add death quotes for Bram, Voss, Nira, Coda
- [ ] Wire Bram into ch1 as mid-chapter join (update chapter1.ts playerUnits) — deferred to Phase 1
- [ ] Wire Voss into ch2 as enemy-defection join (update chapter2.ts) — deferred to Phase 1
- [ ] Wire Nira into ch3 as village-rescue join (update chapter3.ts) — deferred to Phase 1
- [ ] Wire Coda into ch4 as conditional join (update chapter4.ts) — deferred to Phase 1

## Expand Type System

> **Ref:** [`specs/gameplay/weapons.md`](specs/gameplay/weapons.md), [`specs/gameplay/classes.md`](specs/gameplay/classes.md), [`specs/gameplay/terrain.md`](specs/gameplay/terrain.md), [`specs/gameplay/stats.md`](specs/gameplay/stats.md), [`specs/gameplay/objectives.md`](specs/gameplay/objectives.md)

- [x] Add `bow`, `knife`, `dark`, `light` to WeaponType union in `types.ts`
- [x] Add weapon range types: melee (1), ranged (2), mixed (1-2), siege (3-10)
- [x] Add `effectiveAgainst` field to Weapon type (string[] of class tags)
- [x] Add weapon rank type: `'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'Prf'`
- [x] Add `durability` field to Weapon (number | null for unbreakable)
- [x] Add `brave` flag to Weapon (attacks twice per combat)
- [x] Add `prf` field to Weapon (unit ID that can wield it)
- [x] Add `sand`, `ice`, `lava`, `ruins`, `indoor`, `door`, `chest`, `armory`, `bridge` to TerrainType
- [x] Add `survival`, `thief`, `healer`, `escort`, `coordinated`, `ambush` to AIBehavior
- [x] Add `boss_kill`, `escape`, `protect`, `capture`, `dual` to ObjectiveType
- [x] Add `flying` and `mounted` and `armored` flags to class definitions
- [x] Add `CHA` (Charisma) and `WIL` (Willpower) to UnitStats interface

## Expand Weapon Data

> **Ref:** [`specs/gameplay/weapons.md`](specs/gameplay/weapons.md)

- [x] Add Arc 1 weapons: Slim Sword, Rapier (Prf Ren), Iron Bow, Iron Knife
- [x] Add Arc 1 Prf weapons: Voss's Garrison Lance, Nira's Sightbow, Coda's Data Knife
- [x] Add Arc 2 weapons: Steel Sword/Lance/Axe, Javelin, Hand Axe, Longbow
- [x] Add Arc 2 weapons: Killer Sword/Lance, Poison Dagger, Steel Bow
- [x] Add Arc 2 tomes: Elfire, Elthunder, Elwind, Nosferatu, Lightning
- [x] Add Arc 2 staves: Mend, Barrier
- [x] Add weapon triangle data for bow (neutral), knife (neutral), dark/light interactions
- [ ] Add effective damage multiplier (×3) for: Rapier vs armored, bows vs flying, Armorslayer vs armored — field exists, combat logic deferred
- [x] Verify all weapons have correct stats per spec (12 mismatches fixed)

## Expand Class Data

> **Ref:** [`specs/gameplay/classes.md`](specs/gameplay/classes.md), [`specs/gameplay/classes-expanded.md`](specs/gameplay/classes-expanded.md)

- [x] Add Archer class (bow, MOV 5, SKL/SPD growth)
- [x] Add Thief class (knife, MOV 6, SPD/SKL growth, locktouch innate)
- [x] Add Pegasus Knight class (lance, MOV 7, flying flag, SPD/RES growth)
- [x] Add Wyvern Rider class (lance+axe, MOV 7, flying flag, STR/DEF growth)
- [x] Add Troubadour class (staff, MOV 7, mounted flag, MAG/SPD growth)
- [x] Add Mercenary class (sword, MOV 5, balanced growth)
- [x] Add Shaman class (dark, MOV 5, MAG growth)
- [x] Add Monk class (light, MOV 5, MAG/RES growth)
- [x] Add Knight class (lance, MOV 4, armored flag, DEF/HP growth)
- [x] Add Dancer class (none, MOV 5, SPD/LCK growth, dance innate)
- [x] Update movement cost calculations for flying (all terrain = 1)
- [x] Update movement cost calculations for mounted (forest +1, sand +1)
- [x] Update movement cost calculations for armored (mountain impassable, forest +1)

## Terrain Data Expansion

> **Ref:** [`specs/gameplay/terrain.md`](specs/gameplay/terrain.md)

- [x] Add Sand terrain: cost 2 foot/3 mounted, 0 DEF, -10 avoid — STA drain deferred
- [x] Add Ice terrain: cost 1, -10 avoid — slide chance deferred
- [x] Add Bridge terrain: cost 1 — destructibility deferred
- [x] Add Ruins terrain: cost 1, +1 DEF +10 avoid — hidden items deferred
- [x] Add Indoor terrain: cost 1 — mounted -2 MOV/flying dismount deferred
- [x] Add Door tile: locked (impassable) — key/lockpick interaction deferred
- [x] Add Chest tile: cost 1 — key/lockpick/thief interaction deferred
- [x] Add Armory tile: cost 1 — shop interaction deferred
- [x] Add Glitched tile: cost 1, 0 DEF/avoid — CRP/AWR effects deferred to Phase 4
- [x] Add Data Void tile: cost 2, -2 DEF -20 avoid — CRP/SYNC effects deferred to Phase 4
- [x] Add Memory tile: cost 1, +1 DEF +10 avoid — LOOP effect deferred to Phase 4
- [x] Add Corrupted Fort tile: cost 1, +3 DEF +20 avoid — HP regen/CRP effects deferred
- [x] Add Broken Throne tile: cost 1, +2 DEF +10 avoid — CRP effect deferred
- [x] Update `core/terrain.ts` getTerrainData for all new types (including meta-terrain)
- [x] Update pathfinding to check class movement flags (flying, mounted, armored)

## Validation

- [x] `npm run build` — zero type errors
- [x] `npx vitest run` — all existing unit tests pass (102/102)
- [x] `npx playwright test` — 75/79 pass, 4 failures are pre-existing (ch4 timeout + screenshot flakes)
- [ ] Manual check: load ch1 in dev server, verify Ren/Kael/Senna/Lira names display
