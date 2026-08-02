# Experience & Leveling

EXP gain, level-up mechanics, stat growth, and progression systems across 25 chapters.

Code reference: `src/core/experience.ts`

---

## EXP Formula

### Combat EXP

```
Base EXP = 30 + (enemy level - attacker level) × 5
Kill Bonus = +50
Total = min(100, max(5, Base EXP + Kill Bonus))
```

| Scenario | EXP Gain |
|----------|----------|
| Attack equal-level enemy (no kill) | 30 |
| Attack enemy 4 levels higher (no kill) | 50 |
| Attack enemy 4 levels lower (no kill) | 10 |
| Kill equal-level enemy | 80 |
| Kill enemy 4 levels higher | 100 (capped) |
| Kill enemy 4 levels lower | 60 |
| Attack enemy 5+ levels lower (no kill) | 5 (minimum) |

### EXP Scaling (Anti-Grind)

To prevent over-leveling in a 25-chapter game:

```
If attacker level > enemy level + 5:
  EXP penalty = -5% per additional level
  Example: Lv20 unit vs Lv10 enemy = 5 levels over threshold → -25% EXP
```

This doesn't apply to kill bonus — killing enemies always gives +50. The penalty only reduces base EXP.

### Catch-Up Mechanic

Underleveled units gain bonus EXP to prevent falling too far behind:

```
If attacker level < party average level - 3:
  EXP bonus = +20% (multiplicative, applied after base calculation)
```

This helps late-joining units (e.g., Orin at Ch9, Kira at Ch11) catch up to the main roster without excessive babying.

### Healing EXP

Healers gain EXP from healing, not combat (Cleric/Troubadour cannot attack until promotion).

```
Heal EXP = 20 + (target missing HP / target max HP) × 30
```

- Healing a nearly-dead ally gives more EXP than topping someone off
- Minimum: 10 EXP per heal
- Maximum: 50 EXP per heal
- Does NOT scale with target level — healing is always useful

### Staff EXP (Non-Heal)

| Staff Action | EXP Gain |
|-------------|----------|
| Restore (cure status) | 25 |
| Barrier (+7 RES) | 20 |
| Purify (-5 CRP) | 30 |
| Physic (ranged heal) | Same as Heal formula |
| Fortify (mass heal) | 15 per target healed |

### Other EXP Sources

| Source | EXP Gain | Notes |
|--------|----------|-------|
| Dance/Refresh | 20 | Flat EXP for granting an ally another action |
| Steal (Thief/Rogue) | 15 | Flat EXP per successful steal |
| Lockpick (open chest/door) | 10 | Flat EXP per use |
| Visit village | 0 | Reward is the item/gold |
| Seize | 0 | Reward is victory |
| Item use | 0 | |
| Survive chapter | 0 | No participation EXP |

---

## Level-Up

### Trigger

```
currentEXP + gainedEXP ≥ 100 → Level Up
Remainder carries over: newEXP = total - 100
```

- EXP wraps once per action (cannot gain 2 levels from one action)
- Level does NOT reset on promotion — continues from current level
- Soft level cap varies by tier (see Expected Levels below)

### Stat Growth Rolls

On level-up, each stat is rolled independently against the unit's **class growth rate**.

```
For each stat (HP, STR, MAG, DEF, RES, SPD, SKL, LCK, CHA, WIL):
  if random(0-99) < growth_rate → stat += 1
  else → stat += 0
```

- Uses seeded RNG for determinism (`?seed=` URL param)
- MOV does NOT grow on level-up (class-locked, changes only on promotion)
- Stats are capped by promotion tier (see below)

### Growth Rates Per Class

See [stats.md](stats.md) for all 16 base class growth rates. Promoted and master class growth rates are the same as the base class they evolved from — promotion changes stat CAPS, not growth rates.

### Stat Caps by Tier

| Stat | Base | Promoted | Master |
|------|------|----------|--------|
| HP | 60 | 80 | 99 |
| STR/MAG/DEF/RES/SPD/SKL | 20 | 30 | 35 (key stat 40) |
| LCK | 30 | 40 | 45 |
| CHA | 15 | 20 | 25 |
| WIL | 15 | 20 | 25 |

See [promotion.md](promotion.md) for stat bonuses granted on promotion.

---

## Expected Levels by Arc

### Player Unit Progression

| Arc | Chapters | Expected Level Range | Promotion Status | Notes |
|-----|----------|---------------------|------------------|-------|
| Arc 1 | Ch1-5 | 1→8 | Too early, no items | Learning the systems |
| Arc 2 | Ch6-10 | 8→15 | First promotions (Lv15+) | Core units hit promotion threshold |
| Arc 3 | Ch11-15 | 15→20 | Most units promoted | Late joiners catching up |
| Arc 4 | Ch16-20 | 20→28 | All promoted, first master | 3 Master Crowns available Ch18-24 |
| Arc 5 | Ch21-25 | 28→35 | 2-3 master classes | Endgame power |

### Enemy Level Scaling

| Arc | Generic Enemy Levels | Boss Level | Elite/Mini-boss |
|-----|---------------------|-----------|-----------------|
| Arc 1 | 1-7 | 5-9 | 4-7 |
| Arc 2 | 7-14 | 12-16 | 10-14 |
| Arc 3 | 14-20 | 18-22 | 16-20 |
| Arc 4 | 20-27 | 25-30 | 22-27 |
| Arc 5 | 27-33 | 30-35 | 28-33 |

### Expected Stats at Key Levels

Approximate stats (base + average growths) for reference during balancing.

**Ren (Lord) — expected stats:**

| Level | HP | STR | SPD | DEF | SKL | LCK | Tier |
|-------|----|----|-----|-----|-----|-----|------|
| 1 | 20 | 6 | 7 | 5 | 5 | 7 | Base |
| 8 | 26 | 9 | 11 | 7 | 8 | 12 | Base (end Arc 1) |
| 15 | 32 | 12 | 14 | 9 | 11 | 16 | Promotes → Great Lord/Conqueror |
| 20 | 38 | 15 | 17 | 12 | 14 | 19 | Promoted |
| 28 | 46 | 21 | 23 | 17 | 19 | 25 | Promoted (master eligible) |
| 35 | 53 | 26 | 28 | 21 | 23 | 30 | Master (Overlord) |

**Kael (Cavalier) — expected stats:**

| Level | HP | STR | SPD | DEF | SKL | LCK |
|-------|----|----|-----|-----|-----|-----|
| 1 | 22 | 7 | 6 | 6 | 5 | 4 |
| 8 | 28 | 10 | 9 | 9 | 7 | 7 |
| 14 | 33 | 13 | 11 | 11 | 9 | 10 |

Note: Kael dies in Ch8. Expected level at death is ~12-14.

---

## Weapon EXP

Separate from character EXP. Units gain weapon proficiency by using weapons.

```
Attack with weapon (hit or miss): +1 WEXP
Kill with weapon: +2 WEXP (total +3 with attack)
Heal with staff: +1 WEXP
```

| Rank | WEXP Required | Typical Arc |
|------|--------------|-------------|
| E | 0 (starting) | Arc 1 |
| D | 30 | Arc 1-2 |
| C | 70 | Arc 2 |
| B | 120 | Arc 2-3 |
| A | 180 | Arc 3-4 |
| S | 250 | Arc 4-5 |

Higher rank → access to stronger weapons. See [weapons.md](weapons.md) for rank requirements per weapon.

### Weapon Rank on Promotion

When a unit promotes, their primary weapon rank gets a bonus:

- Tier 1 promotion (Base → Promoted): +20 WEXP to primary weapon
- Tier 2 promotion (Promoted → Master): +30 WEXP to primary weapon
- New weapon types gained from promotion start at rank E

---

## Bonus EXP

Earned from fast chapter completion. Distributed manually during preparation phase.

### Earning Bonus EXP

```
Chapter par turns = defined per chapter (see difficulty.md)
If completed in ≤ par turns: Bonus EXP = (par - actual turns) × 50
Maximum: 300 Bonus EXP per chapter
```

### Distributing Bonus EXP

During preparation phase, the player can allocate Bonus EXP to any deployed unit:

- 100 Bonus EXP = 1 guaranteed level-up with GUARANTEED stat gains (no RNG — +1 to the unit's 3 weakest stats)
- Prevents over-leveling: each unit can receive max 1 Bonus EXP level per chapter
- Diminishing returns: if the unit is 3+ levels above party average, Bonus EXP gives normal RNG-based level instead of guaranteed stats

### Design Intent

Bonus EXP is a safety net for underleveled units, not an optimization tool. It rewards aggressive play (fast clears) and lets the player invest in lagging units without grinding.

---

## Meta-Stat Gains on Level-Up

Meta stats do NOT grow from level-up rolls. They change through gameplay actions.

| Meta Stat | How It Changes |
|-----------|---------------|
| **AWR** | +3-5 from witnessing glitches; story events; player choices |
| **LOOP** | Decreases from memory abilities; gains from kills, trauma, arc regen (+10/arc) |
| **SYNC** | +2-3/turn on forts/thrones; -1-2/turn on glitched terrain; story events |
| **LOY** | Story decisions, support conversations, proximity effects |
| **CRP** | +1-3/turn on corrupted terrain; combat vs corrupted enemies; passive decay if low |
| **STA** | +1/tile moved, +3/attack, +5/double, +2/heal. Resets each chapter start |

---

## Level-Up Presentation

### UI Flow

```
1. EXP bar fills (animated)
2. If level up → "LEVEL UP!" banner
3. Stat gains revealed one at a time:
   - Green "+1" for stats that grew
   - Grey "—" for stats that didn't
   - Gold flash for stats that hit their cap
4. If promotion available (Lv15+ with item): prompt shown
5. Dismiss → return to map
```

### Design Intent

- Level-ups should feel exciting — each +1 matters
- Bad level-ups (0-1 stat gains) are possible and intentional
- RNG-based growth creates unique playthroughs
- Seeded RNG ensures E2E test determinism

---

## Open Questions

- **EXP from chip damage**: Should dealing 0 damage still grant EXP? Currently yes (5 minimum). *Recommendation: Keep — prevents softlocks.*
- **Boss EXP**: Should bosses give bonus EXP? *Recommendation: +20 flat bonus on top of kill formula.*
- **RNG system**: Single roll vs 2-roll average (FE uses 2RN for displayed hit rates). Current code uses single roll. *Recommendation: Keep single roll for this game — meta-aware characters can comment on bad RNG.*
- **Arena EXP**: See [economy.md](economy.md) — arena gives standard combat EXP, capped at 3 fights per unit per chapter.
