# Debug Page Database Expansion

> **Severity:** low
> **Category:** ui
> **Affected files:** `src/components/Debug/DebugScreen.tsx`, + 8 new view files in `src/components/Debug/`
> **Spec refs:** none (debug-only tooling, no gameplay spec)

## Description

The debug page currently has only 2 tabs (Characters, Items). The project has extensive data in `src/data/` and `src/core/` that should be surfaced as additional tabs for development reference and debugging. All tabs use existing data only — no new custom data.

## Current Behavior

- `DebugScreen.tsx` renders 2 tabs: `'characters'` and `'items'`
- `CharactersView.tsx` — split-pane: unit list + detail (stats, growths, equipment, death quote)
- `ItemsView.tsx` — split-pane with weapons/consumables sub-tabs + detail views
- CSS: BEM-style `.debug-screen__*` classes, split-pane layout pattern
- No way to browse skills, classes, chapters, terrain, formulas, AI behaviors, meta-stats, or campaign state

## Expected Behavior

- 10 total tabs: Characters, Items, **Skills, Classes, Chapters, Terrain, Formulas, AI Behaviors, Meta-Stats, Campaign**
- Each new tab follows the existing split-pane pattern (list left, detail right) where applicable
- Reference-style tabs (Formulas, Meta-Stats, AI Behaviors) use section layout instead of split-pane
- All data comes from existing exports — no new data definitions

---

## Steps to Fix

### Shared / DebugScreen

- [ ] In `DebugScreen.tsx`, expand tab type union to include all 10 tabs: `'characters' | 'items' | 'skills' | 'classes' | 'chapters' | 'terrain' | 'formulas' | 'ai' | 'metastats' | 'campaign'`
- [ ] Add tab buttons for all 8 new tabs in the header
- [ ] Render corresponding `*View` component for each tab
- [ ] Add minimal CSS for any new layout needs (reference-style sections)

---

### Tab 1: Skills

**File:** `src/components/Debug/SkillsView.tsx`
**Data:** `src/data/skills.ts` → `SKILLS` (31 skills)

- [ ] **List panel**: skill name, category badge (`combat` / `movement` / `support` / `meta` / `passive`), innate tag
- [ ] **Detail panel**:
  - Name + category badge (large)
  - Activation type + condition: `passive`, `skl_pct` (SKL%), `spd_pct` (SPD%), `lck_pct` (LCK%), `skl_half_pct` (SKL/2%), `skl_quarter_pct` (SKL/4%), `hp_threshold` (HP ≤ N%)
  - Description text
  - Innate flag (class-granted, doesn't use skill slot)
- [ ] **Filter**: dropdown or toggle buttons to filter by category
- [ ] **Cross-reference**: show which classes have this as innate skill (lookup `ALL_CLASSES` for `innateSkills` containing this skill ID)

---

### Tab 2: Classes

**File:** `src/components/Debug/ClassesView.tsx`
**Data:** `src/data/classes.ts` + `src/data/promotedClasses.ts` → `ALL_CLASSES` (40+ classes: 16 base, 24+ promoted/master)

- [ ] **List panel**: class name, tier badge (`base` / `promoted` / `master`), weapon type icons
- [ ] **Detail panel**:
  - Name + tier badge (large)
  - **Base Stats** section: all stats (hp, str, mag, def, res, spd, skl, lck, mov, cha, wil) with stat bars (reuse `.debug-screen__stat-bar-*` pattern)
  - **Growth Rates** section: all growth rates as percentages with bars (reuse `.debug-screen__growth-*` pattern)
  - **Weapon Types**: list of usable weapon types with icons
  - **Innate Skills**: skill names (linked to Skills tab data)
  - **Promotion Chain**: "Promotes from: [class]" / "Promotes to: [class, class]" — show full chain
  - **Flags**: mounted / flying / armored badges
  - **Bonus Crit**: if `bonusCrit` exists (e.g., Berserker +15)
- [ ] **Filter**: by tier (base / promoted / master)
- [ ] **Cross-reference**: show units of this class (lookup all units with matching `classId`)

---

### Tab 3: Chapters

**File:** `src/components/Debug/ChaptersView.tsx`
**Data:** `src/data/chapters/ch1.ts` through `ch10.ts` (10 chapters)

- [ ] **List panel**: chapter number, name, objective type badge (`seize` / `rout`)
- [ ] **Detail panel**:
  - Chapter name + number
  - **Objective**: type + target position (if seize)
  - **Map**: dimensions (width × height)
  - **Player Units**: count + list (unit name, class)
  - **Enemy Units**: count + list (unit name, class, AI behavior badge, faction)
  - **Reinforcements**: count + summary (turn triggers, unit types)
  - **Events**: count + list of dialogue event triggers
  - **Map Effects**: list if any (e.g., weather, terrain changes)
- [ ] Import chapter data dynamically (all 10 chapter modules)

---

### Tab 4: Terrain

**File:** `src/components/Debug/TerrainView.tsx`
**Data:** `src/core/terrain.ts` → `TERRAIN` (28 types), `src/core/metaStats.ts` → terrain meta-stat effects

- [ ] **List panel**: terrain name, movement cost number, passable/impassable indicator (color-coded: green for cost 1, yellow for 2-3, red for 99/impassable)
- [ ] **Detail panel**:
  - Terrain name
  - **Movement Cost**: base cost, plus class-specific costs:
    - Mounted penalty (from `getClassMovementCost` with `mounted: true`)
    - Flying override (from `getClassMovementCost` with `flying: true`)
    - Armored penalty (from `getClassMovementCost` with `armored: true`)
  - **Defense Bonus**: +N defense
  - **Avoid Bonus**: +N avoid
  - **Passability**: passable / impassable, plus class-specific (flying can cross water, etc.)
  - **Meta-Stat Effects** (from `metaStats.ts` terrain table):
    - CRP gain/loss per turn on this terrain
    - SYNC change per turn
    - STA recovery per turn
- [ ] Sort options: by name, by movement cost, by defense bonus

---

### Tab 5: Formulas

**File:** `src/components/Debug/FormulasView.tsx`
**Data:** `src/core/combat.ts`, `src/core/experience.ts`

- [ ] **Reference page layout** (no split-pane — single scrollable page with sections)
- [ ] **Damage section**:
  - Physical: `STR + weapon.might - DEF - terrain.defenseBonus`
  - Magic (proficient): `MAG + weapon.might - RES - terrain.defenseBonus`
  - Magic (non-proficient): `STR + weapon.might - DEF - terrain.defenseBonus` (physical bonk)
  - Effective damage: weapon.might × 3 (triple)
  - Weapon triangle modifier: ±1 damage
  - Non-proficient penalty: -2 damage
  - Minimum damage: 0
  - Skill modifiers: Tri-Magic (×1.5), Vengeance trauma (+30%), Ironwall (-50%), Light vs corrupted (+50%)
- [ ] **Hit% section**:
  - Accuracy: `SKL × 2 + LCK + weapon.hit`
  - Evade: `SPD × 2 + LCK + terrain.avoidBonus`
  - Hit% = accuracy - evade
  - Weapon triangle: ±15 hit
  - Non-proficient penalty: -20 hit
  - Support bonus, SYNC bonus if applicable
  - Clamp: 0–100%
- [ ] **Crit% section**:
  - Crit: `floor(SKL / 2) + weapon.crit - defender.LCK`
  - Wrath skill: +20 crit when attacker HP ≤ 50%
  - Class bonus crit (e.g., Berserker +15)
  - Support/skill bonuses
  - Clamp: 0–100%
- [ ] **Doubling section**:
  - Threshold: attacker SPD - defender SPD ≥ 5
  - Pursuit skill: threshold reduced to ≥ 3
  - Quick Riposte: guaranteed double on counter-attack when HP ≥ 70%
- [ ] **Weapon Triangle section**:
  - Physical: Sword > Axe > Lance > Sword
  - Magic: Fire > Wind > Thunder > Fire
  - Dark ↔ Light (mutual advantage)
  - Effects: winner gets +1 damage, +15 hit; loser gets -1 damage, -15 hit
- [ ] **EXP section**:
  - Base EXP: `30 + (defender.level - attacker.level) × 5`
  - Kill bonus: +50 EXP
  - Minimum: 5 EXP
  - Maximum: 100 EXP
  - Level-up threshold: 100 EXP total (resets to 0 after level-up)
- [ ] **Level-Up section**:
  - Each stat: roll RNG vs class growth rate percentage
  - Gain +1 if roll succeeds, +0 otherwise
  - MOV does not grow on level-up

---

### Tab 6: AI Behaviors

**File:** `src/components/Debug/AIBehaviorsView.tsx`
**Data:** `src/core/ai.ts` (9+ behavior types)

- [ ] **List panel**: behavior name, one-line summary
- [ ] **Detail panel** for each behavior:
  - **aggressive** (default): seeks nearest player, prioritizes kills, uses `scoreTarget()` to pick best target
  - **stationary**: stays in place, only attacks units in range, never moves
  - **boss**: like stationary but heals on throne/fort, enhanced survival priority
  - **guard**: patrols within radius of guard point, attacks units entering radius, returns to position
  - **survival**: prioritizes escaping, moves away from threats, seeks forts for healing
  - **thief**: targets chests/villages, avoids combat, steals items
  - **healer**: targets injured allies with staves, stays behind front line
  - **escort**: protects specific unit, stays adjacent, attacks threats to escort target
  - **coordinated**: group tactics, waits for allies to be in position before attacking
  - **ambush**: waits until player enters trigger range, then switches to aggressive
- [ ] **Scoring formula** section:
  - Kill potential: +100
  - Damage dealt: ×2
  - Hit chance: ×0.5
  - Low HP target: +30
  - Counter damage: penalty proportional to threat
  - Terrain advantage: +10

---

### Tab 7: Meta-Stats

**File:** `src/components/Debug/MetaStatsView.tsx`
**Data:** `src/core/metaStats.ts` (6 meta-stats)

- [ ] **Reference page layout** (like Formulas — sections, not split-pane)
- [ ] **AWR (Awareness)**: range 0–100, effect: enables seeing enemy meta-stats at ≥80
- [ ] **LOOP (Loop Counter)**: range ≥0, effect: affects Memory Blade weapon might
- [ ] **SYNC (Synchronization)**: range 0–100, effects: hit bonus +5 at >80; random stat variance ±2 at <30
- [ ] **LOY (Loyalty)**: range 0–100, effects: +1 all combat stats near Ren at ≥80; 5% disobedience chance at <30
- [ ] **CRP (Corruption)**: range 0–100, effects: -1 all combat stats at ≥60; -2 all at ≥80; Light magic ×1.5 vs corrupted (CRP > 0)
- [ ] **STA (Stamina/Fatigue)**: range ≥0, effects: -1 SPD at ≥30; -2 SPD/-1 SKL at ≥45; can't act at >45
- [ ] **Default values section**: Ren defaults (awr:0, loop:347, sync:80, loy:50, crp:0, sta:0) vs other units (awr:0, loop:0, sync:70, loy:50, crp:0, sta:0)
- [ ] **Terrain effects table**: which terrain types affect which meta-stats per turn (glitched: CRP+2/SYNC-1, data_void: CRP+3/SYNC-3, fort: SYNC+2/STA-3, memory: SYNC+5, corrupted_fort: CRP+1, broken_throne: CRP+1, throne: STA-5)

---

### Tab 8: Campaign

**File:** `src/components/Debug/CampaignView.tsx`
**Data:** `src/stores/campaignStore.ts` — live state via `useCampaignStore`

- [ ] **Live state viewer** (reads current campaign store, not static data)
- [ ] **Sections**:
  - **Progress**: completed chapters list, current chapter
  - **Roster**: current roster unit IDs, deployed unit IDs
  - **Dead Units**: permadeath casualties list
  - **Settings**: game mode (classic/casual), difficulty
  - **Economy**: gold, forge materials, bonus EXP
  - **Support**: support pairs (unit A, unit B, rank), viewed supports
  - **Campaign Flags**: key-value table of all campaign flags
  - **Endings**: endings seen, NG+ unlocked status
  - **Storage**: stored weapons/items not equipped by anyone
- [ ] Auto-refresh on store changes (Zustand subscription via `useCampaignStore`)

---

## Verification

- [ ] All 8 new view files created in `src/components/Debug/`
- [ ] `DebugScreen.tsx` updated with 10 total tabs
- [ ] Each tab renders correct data from existing sources
- [ ] Split-pane tabs have working list selection + detail view
- [ ] Reference tabs (Formulas, Meta-Stats, AI) are readable and well-formatted
- [ ] Campaign tab shows live store data
- [ ] `npm run build` passes
- [ ] All tabs accessible from debug screen with tab navigation
