# Difficulty & Balance

Per-chapter balance targets, enemy scaling, difficulty levers, and design philosophy.

---

## Design Philosophy

This is a **4-chapter game**. There is no grinding — the player has limited battles to level up. Every chapter matters. The difficulty curve should feel like:

```
Ch1: Learn the system (gentle)
Ch2: Master the system (moderate, introduces complexity)
Ch3: System breaks you (hard, emotional gut punch)
Ch4: You break the system (hardest, but you have tools)
```

### Core Principles

1. **No mandatory grinding** — the game must be beatable at expected levels
2. **Permadeath is punishing, not unfair** — deaths should feel like player mistakes, not RNG
3. **Meta-stats add depth, not difficulty** — AWR/LOOP/SYNC create choices, not barriers
4. **The hardest chapter is Ch3** — losing Kael should feel devastating mechanically AND emotionally
5. **Ch4 is hard but empowering** — the player has all the tools, they just need to use them well

---

## Per-Chapter Balance Targets

### Chapter 1 — Awakening

| Aspect | Target |
|--------|--------|
| **Player units** | 3-4 (Ren, Kael, Senna, + Bram or Lira) |
| **Enemy count** | 6-8 |
| **Enemy levels** | 1-3 |
| **Expected player exit level** | 3-4 |
| **Turns to complete** | 8-12 |
| **Deaths expected** | 0 (tutorial — forgiving) |
| **New mechanics introduced** | Basic movement, attack, weapon triangle, terrain |

**Balance Notes:**
- Enemies should be weaker than player units in 1v1
- Position a clear weapon triangle lesson (axe enemy near Ren's sword)
- Boss should be killable in 2-3 rounds by Ren alone
- Fort healing demonstrated by placing one in the player's path
- No reinforcements — predictable enemy count

### Chapter 2 — Fractures

| Aspect | Target |
|--------|--------|
| **Player units** | 6 (full party: Ren, Kael, Senna, Bram, Lira, Voss) |
| **Enemy count** | 10-14 (+ 2-3 reinforcements) |
| **Enemy levels** | 3-6 |
| **Expected player exit level** | 6-8 |
| **Turns to complete** | 12-18 |
| **Deaths expected** | 0-1 (possible if careless) |
| **New mechanics introduced** | Body targeting, villages, items, weapon ranks, meta terrain (glitched tiles), CHA aggro |

**Balance Notes:**
- First chapter with full party — test all 6 unit synergies
- Introduce knights (high DEF) to teach effective weapons (Armorslayer/Rapier)
- Glitched tiles should be avoidable but placed on tempting shortcuts
- Reinforcements arrive mid-chapter to punish slow play
- Voss joins — demonstrate his tank role with a chokepoint
- Village rewards should feel meaningful (good weapon or stat booster)

### Chapter 3 — Collapse

| Aspect | Target |
|--------|--------|
| **Player units** | 6 → 5 (Kael dies mid-chapter or late) |
| **Enemy count** | 14-18 (+ 3-4 reinforcements in waves) |
| **Enemy levels** | 6-10 |
| **Expected player exit level** | 9-12 |
| **Turns to complete** | 15-22 |
| **Deaths expected** | 1 mandatory (Kael), 0-1 additional |
| **New mechanics introduced** | Dark mages (CRP on hit), corrupted terrain spreading, trauma skills, Kael's death event |

**Balance Notes:**
- **Kael's death is scripted** — but should feel like it COULD have been prevented
- Before Kael dies: make the player feel powerful with full party
- After Kael dies: immediate difficulty spike — lose 7 MOV cavalry + dual weapons + Canto
- Enemy composition should punish the hole Kael leaves (more mobile enemies, flanking)
- Dark mages introduce CRP pressure — force the player to engage or avoid
- This is the HARDEST chapter in terms of emotional + mechanical challenge
- Grief trauma skill hits ALL party members: -3 all stats for 2 chapters

### Chapter 4 — Resolution

| Aspect | Target |
|--------|--------|
| **Player units** | 5 (no Kael, possibly fewer from Ch3 deaths) |
| **Enemy count** | 16-20 (+ continuous reinforcements) |
| **Enemy levels** | 8-15 (boss: 15) |
| **Expected player exit level** | 13-16 |
| **Turns to complete** | 18-25 |
| **Deaths expected** | 0-2 (high stakes, but player should have tools) |
| **New mechanics introduced** | Debugger weapon, corrupted enemies (stat randomization), Data Voids, ???'s cycling weapon, endgame skills |

**Balance Notes:**
- Player has fewer units but they're higher level and better equipped
- Ren should feel powerful — Debugger + high LOOP Memory Blade
- Corrupted enemies add unpredictability (randomized stats each turn)
- ???'s cycling weapon type means weapon triangle shifts every turn — requires adaptation
- Continuous reinforcements from Data Voids create time pressure
- Final boss should require strategic use of weapon triangle + body targeting + positioning
- Victory should feel earned — tight margins, smart play rewarded

---

## Difficulty Levers

Tunable parameters for balancing during playtesting.

### Enemy Stat Scaling

| Lever | Effect | Current Value |
|-------|--------|---------------|
| **Enemy level range** | Higher levels = more stats | Per chapter (see above) |
| **Enemy growth rate modifier** | Scale all enemy growths up/down | ×1.0 (same as player classes) |
| **Boss stat bonus** | Flat stat boost above level-expected | +2-4 to key stats |
| **Reinforcement levels** | Level of spawned reinforcements | Chapter enemies - 1 |

### Action Economy

| Lever | Effect | Current Value |
|-------|--------|---------------|
| **Enemy count** | More enemies = harder | Per chapter |
| **Reinforcement timing** | Earlier = harder, later = easier | Turn 4-5 (Ch2), Turn 3-4 (Ch3-4) |
| **Reinforcement frequency** | One wave vs continuous | Single wave (Ch2-3), continuous (Ch4) |
| **Enemy behavior distribution** | More aggressive = harder | See ai.md |

### Economy

| Lever | Effect | Current Value |
|-------|--------|---------------|
| **Gold income** | More gold = better gear access | TBD (shops not yet implemented) |
| **Item availability** | More healing = more forgiving | 2 vulneraries per unit start |
| **Weapon availability** | Better weapons earlier = easier | See weapons.md chapter availability |
| **EXP base** | Higher base = faster leveling | 30 |
| **Kill bonus EXP** | Higher = more reward for aggression | 50 |

### Meta-Stat Tuning

| Lever | Effect | Current Value |
|-------|--------|---------------|
| **CRP gain rate** | Higher = more corruption pressure | +1-3 per turn on terrain |
| **STA thresholds** | Lower = exhaustion hits sooner | 15/30/45/60 |
| **STA accumulation rate** | Higher = earlier fatigue | +1/tile, +3/attack |
| **LOY impact** | Higher impact = more meaningful loyalty | ±5-15 per event |
| **AWR gain rate** | Faster = earlier UI unlocks | +3-5 per glitch witness |

---

## Damage & Survivability Benchmarks

### Player Unit Survivability

At expected levels, player units should survive:

| Unit | Can Take (Ch1) | Can Take (Ch2) | Can Take (Ch3) | Can Take (Ch4) |
|------|---------------|---------------|---------------|---------------|
| Ren | 3-4 hits | 3-4 hits | 2-3 hits | 2-3 hits |
| Kael | 3-4 hits | 3 hits | 2-3 hits | — |
| Senna | 1-2 hits | 1-2 hits | 1 hit | 1-2 hits |
| Bram | 4-5 hits | 3-4 hits | 3 hits | 3 hits |
| Lira | 1-2 hits | 1 hit | 1 hit | 1 hit |
| Voss | 4-5 hits | 4-5 hits | 4 hits | 3-4 hits |

"Hit" = average enemy attack at that chapter's level. Senna and Lira should always be at risk — positioning is their defense.

### Player Damage Output

At expected levels, player units should deal:

| Unit | vs Average Enemy (Ch1) | vs Average Enemy (Ch4) |
|------|----------------------|----------------------|
| Ren | 2-3 round kill | 2 round kill (with Debugger) |
| Kael | 2 round kill | — |
| Senna | 1-2 round kill (targets RES) | 1-2 round kill |
| Bram | 1 round kill (if hits) | 1-2 round kill |
| Lira | 0 (cannot attack) | 0 |
| Voss | 3-4 round kill | 2-3 round kill |

### Boss Durability

| Chapter | Boss HP | Expected Rounds to Kill | Notes |
|---------|---------|------------------------|-------|
| Ch1 | ~30 | 3-4 | Ren can solo with Rapier |
| Ch2 | ~40 | 4-5 | Need 2-3 units |
| Ch3 | ~50 | 5-7 | Need full team effort |
| Ch4 | ~60+ | 6-8+ | Type cycling makes this variable |

---

## Anti-Frustration Design

### Prevent Softlocks

- EXP minimum of 5 ensures underleveled units can still gain EXP
- Vulneraries available at shops (future) prevent running out of healing
- Ren's Rapier is Prf (character-locked, strong) — always has a viable weapon
- Voss's Garrison Lance has infinite durability — always has a weapon

### Prevent RNG Death Spirals

- Hit rate clamped at 1% minimum (nothing is impossible) and 99% maximum (nothing is guaranteed)
- Critical hits exist but are rare without crit-focused builds
- STA resets each chapter — bad STA in Ch2 doesn't carry into Ch3
- LOY can recover — low loyalty events can be offset by good decisions

### Player Information

- AWR system progressively reveals enemy information — by mid-game, player should see all stats
- Combat Forecast shows exact damage, hit%, crit%, doubles BEFORE committing
- Danger zone overlay shows all tiles enemies can reach
- Weapon triangle is color-coded in UI (green = advantage, red = disadvantage)

---

## Difficulty Modes (Future Consideration)

Not implemented. Design direction if added:

### Classic Mode (Default)

- Permadeath
- All mechanics as designed
- The intended experience

### Casual Mode

- No permadeath (defeated units return next chapter)
- Grief/trauma skills still trigger (narrative preserved)
- Same enemy stats and difficulty
- For players who want the story without the stress

### Hard Mode

- Permadeath
- Enemy stats +10% across the board
- Reinforcements arrive 1 turn earlier
- Enemy AI uses optimal behavior from Ch1
- STA thresholds reduced by 5 each
- CRP gain rate +50%
- For experienced SRPG players

---

## Open Questions

- **Dynamic difficulty**: Should the game adjust if the player is struggling (e.g., fewer reinforcements after multiple retries)?
- **Turn ranking**: Should chapters grade performance (S/A/B/C) based on turns taken, deaths, etc.?
- **New Game+**: LOOP carries over? Start with higher AWR? Keep learned skills?
- **Chapter retry**: Can the player retry a chapter from the start, or only from the last save?
- **Grinding prevention**: Should EXP be reduced if the player is over-leveled (anti-grind)? Or let them outlevel if they play well?
- **Kael's death timing**: Should Kael die at a fixed story point, or when certain conditions are met (low LOY, high CRP, specific turn)?
