# Phase 0: Foundation — Type Expansion & Data Backfill

> **Prerequisites:** None
> **Unlocks:** Phase 1 (Recruitment + Events)
> **Critical files:** `src/core/types.ts`, `src/data/units.ts`, `src/data/classes.ts`, `src/data/weapons.ts`, `src/core/terrain.ts`
> **Spec refs:** `specs/gameplay/stats.md`, `specs/gameplay/weapons.md`, `specs/gameplay/classes.md`, `specs/gameplay/terrain.md`

## Rename Player Units (Eirik→Ren, Seth→Kael, Lute→Senna, Natasha→Lira)

> **Ref:** [`specs/story/characters/ren.md`](specs/story/characters/ren.md), [`specs/story/characters/kael.md`](specs/story/characters/kael.md), [`specs/story/characters/senna.md`](specs/story/characters/senna.md), [`specs/story/characters/lira.md`](specs/story/characters/lira.md)

- [ ] Rename `eirik` → `ren` in `src/data/units.ts` (id, name, key)
- [ ] Rename `seth` → `kael` in `src/data/units.ts`
- [ ] Rename `lute` → `senna` in `src/data/units.ts`
- [ ] Rename `natasha` → `lira` in `src/data/units.ts`
- [ ] Update death quotes to match spec character voices
- [ ] Update all chapter files (`chapter1.ts`–`chapter4.ts`) unit references
- [ ] Update all dialogue in chapter files (speaker names, lines)
- [ ] Update E2E tests referencing old unit names
- [ ] Update any component references to old unit IDs
- [ ] Run `npm run build` — verify no broken references
- [ ] Run E2E tests — verify chapters 1-4 still pass

## Add Missing Player Units

> **Ref:** [`specs/story/characters/bram.md`](specs/story/characters/bram.md), [`specs/story/characters/voss.md`](specs/story/characters/voss.md), [`specs/story/characters/nira.md`](specs/story/characters/nira.md), [`specs/story/characters/coda.md`](specs/story/characters/coda.md), [`specs/story/roster.md`](specs/story/roster.md)

- [ ] Add Bram (fighter, player) to `PLAYER_UNITS` — Lv1, iron_axe, STR-focused growth
- [ ] Add Voss (soldier, player) to `PLAYER_UNITS` — Lv2, iron_lance, DEF-focused growth
- [ ] Add Nira (archer, player) to `PLAYER_UNITS` — Lv1, iron_bow, SKL/SPD growth
- [ ] Add Coda (thief, player) to `PLAYER_UNITS` — Lv1, iron_knife, SPD/SKL growth
- [ ] Set stat overrides per spec for each new unit
- [ ] Add death quotes for Bram, Voss, Nira, Coda
- [ ] Wire Bram into ch1 as mid-chapter join (update chapter1.ts playerUnits)
- [ ] Wire Voss into ch2 as enemy-defection join (update chapter2.ts)
- [ ] Wire Nira into ch3 as village-rescue join (update chapter3.ts)
- [ ] Wire Coda into ch4 as conditional join (update chapter4.ts)

## Expand Type System

> **Ref:** [`specs/gameplay/weapons.md`](specs/gameplay/weapons.md), [`specs/gameplay/classes.md`](specs/gameplay/classes.md), [`specs/gameplay/terrain.md`](specs/gameplay/terrain.md), [`specs/gameplay/stats.md`](specs/gameplay/stats.md), [`specs/gameplay/objectives.md`](specs/gameplay/objectives.md)

- [ ] Add `bow`, `knife`, `dark`, `light` to WeaponType union in `types.ts`
- [ ] Add weapon range types: melee (1), ranged (2), mixed (1-2), siege (3-10)
- [ ] Add `effectiveAgainst` field to Weapon type (string[] of class tags)
- [ ] Add weapon rank type: `'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'Prf'`
- [ ] Add `durability` field to Weapon (number | null for unbreakable)
- [ ] Add `brave` flag to Weapon (attacks twice per combat)
- [ ] Add `prf` field to Weapon (unit ID that can wield it)
- [ ] Add `sand`, `ice`, `lava`, `ruins`, `indoor`, `door`, `chest`, `armory`, `bridge` to TerrainType
- [ ] Add `survival`, `thief`, `healer`, `escort`, `coordinated`, `ambush` to AIBehavior
- [ ] Add `boss_kill`, `escape`, `protect`, `capture`, `dual` to ObjectiveType
- [ ] Add `flying` and `mounted` and `armored` flags to class definitions
- [ ] Add `CHA` (Charisma) and `WIL` (Willpower) to UnitStats interface

## Expand Weapon Data

> **Ref:** [`specs/gameplay/weapons.md`](specs/gameplay/weapons.md)

- [ ] Add Arc 1 weapons: Slim Sword, Rapier (Prf Ren), Iron Bow, Iron Knife
- [ ] Add Arc 1 Prf weapons: Voss's Garrison Lance, Nira's Sightbow, Coda's Data Knife
- [ ] Add Arc 2 weapons: Steel Sword/Lance/Axe, Javelin, Hand Axe, Longbow
- [ ] Add Arc 2 weapons: Killer Sword/Lance, Poison Dagger, Steel Bow
- [ ] Add Arc 2 tomes: Elfire, Elthunder, Elwind, Nosferatu, Lightning
- [ ] Add Arc 2 staves: Mend, Barrier
- [ ] Add weapon triangle data for bow (neutral), knife (neutral), dark/light interactions
- [ ] Add effective damage multiplier (×3) for: Rapier vs armored, bows vs flying, Armorslayer vs armored
- [ ] Verify all 15 existing weapons have correct stats per spec

## Expand Class Data

> **Ref:** [`specs/gameplay/classes.md`](specs/gameplay/classes.md), [`specs/gameplay/classes-expanded.md`](specs/gameplay/classes-expanded.md)

- [ ] Add Archer class (bow, MOV 5, SKL/SPD growth)
- [ ] Add Thief class (knife, MOV 6, SPD/SKL growth, locktouch innate)
- [ ] Add Pegasus Knight class (lance, MOV 7, flying flag, SPD/RES growth)
- [ ] Add Wyvern Rider class (lance+axe, MOV 7, flying flag, STR/DEF growth)
- [ ] Add Troubadour class (staff, MOV 7, mounted flag, MAG/SPD growth)
- [ ] Add Mercenary class (sword, MOV 5, balanced growth)
- [ ] Add Shaman class (dark, MOV 5, MAG growth)
- [ ] Add Monk class (light, MOV 5, MAG/RES growth)
- [ ] Add Knight class (lance, MOV 4, armored flag, DEF/HP growth)
- [ ] Add Dancer class (none, MOV 5, SPD/LCK growth, dance innate)
- [ ] Update movement cost calculations for flying (all terrain = 1)
- [ ] Update movement cost calculations for mounted (forest +1, sand +1)
- [ ] Update movement cost calculations for armored (mountain impassable, forest +1)

## Terrain Data Expansion

> **Ref:** [`specs/gameplay/terrain.md`](specs/gameplay/terrain.md)

- [ ] Add Sand terrain: cost 2 foot/3 mounted, 0 DEF/avoid, +1 STA drain
- [ ] Add Ice terrain: cost 1, -10 avoid, 50% slide chance
- [ ] Add Bridge terrain: cost 1, destructible (HP 20), becomes water on break
- [ ] Add Ruins terrain: cost 1, +1 DEF +10 avoid, hidden items
- [ ] Add Indoor terrain: cost 1, mounted -2 MOV, flying dismount
- [ ] Add Door tile: locked, opened by key/lockpick
- [ ] Add Chest tile: contains item, opened by key/lockpick/thief
- [ ] Add Armory tile: shop interaction point
- [ ] Add Glitched tile: cost 1, +2 CRP/turn, +3-5 AWR on witness (visual: flickering/static CSS)
- [ ] Add Data Void tile: cost 2 (flying only, impassable to others), -2 DEF -20 avoid, +3 CRP/turn, -1 SYNC/turn
- [ ] Add Memory tile: cost 1, +1 DEF +10 avoid, Ren +2 LOOP/turn
- [ ] Add Corrupted Fort tile: cost 1, +3 DEF +20 avoid, +5 HP/turn BUT +1 CRP/turn
- [ ] Add Broken Throne tile: cost 1, +2 DEF +10 avoid, no HP regen, +2 CRP/turn
- [ ] Update `core/terrain.ts` getTerrainData for all new types (including meta-terrain)
- [ ] Update pathfinding to check class movement flags (flying, mounted, armored)

## Validation

- [ ] `npm run build` — zero type errors
- [ ] `npx vitest run` — all existing unit tests pass
- [ ] `npx playwright test` — chapters 1-4 E2E pass with renamed units
- [ ] Manual check: load ch1 in dev server, verify Ren/Kael/Senna/Lira names display
