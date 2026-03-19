# Experience & Leveling

EXP gain, level-up mechanics, stat growth, and progression systems.

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

### Healing EXP

Healers gain EXP from healing, not combat (Cleric cannot attack).

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

### Other EXP Sources

| Source | EXP Gain |
|--------|----------|
| Visit village | 0 (reward is the item/gold) |
| Seize | 0 (reward is victory) |
| Item use | 0 |
| Survive chapter | 0 (no participation EXP) |

---

## Level-Up

### Trigger

```
currentEXP + gainedEXP ≥ 100 → Level Up
Remainder carries over: newEXP = total - 100
```

- EXP wraps once per action (cannot gain 2 levels from one action)
- Max level: 20 (unpromoted), 20 again after promotion (effective 40)

### Stat Growth Rolls

On level-up, each stat is rolled independently against the unit's **class growth rate**.

```
For each stat (HP, STR, MAG, DEF, RES, SPD, SKL, LCK, CHA, WIL):
  if random(0-99) < growth_rate → stat += 1
  else → stat += 0
```

- Uses seeded RNG for determinism (`?seed=` URL param)
- MOV does NOT grow on level-up (class-locked)
- Stats are capped (see Stat Caps below)

### Growth Rates Per Class

| Class | HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL |
|-------|----|----|-----|-----|-----|-----|-----|-----|-----|-----|
| Lord | 80 | 45 | 10 | 30 | 20 | 50 | 45 | 60 | 40 | 35 |
| Cavalier | 75 | 40 | 5 | 35 | 15 | 35 | 30 | 40 | 35 | 45 |
| Mage | 55 | 5 | 55 | 15 | 40 | 30 | 45 | 30 | 15 | 40 |
| Fighter | 90 | 55 | 0 | 35 | 5 | 25 | 20 | 25 | 30 | 35 |
| Cleric | 50 | 5 | 45 | 10 | 45 | 30 | 25 | 50 | 25 | 15 |
| Soldier | 70 | 35 | 5 | 45 | 10 | 20 | 35 | 20 | 10 | 30 |

### Expected Stats at Key Levels

Approximate stats (base + average growths) for reference during balancing.

**Ren (Lord) — expected stats:**

| Level | HP | STR | SPD | DEF | SKL | LCK |
|-------|----|----|-----|-----|-----|-----|
| 1 | 20 | 6 | 7 | 5 | 5 | 7 |
| 5 | 23 | 8 | 9 | 6 | 7 | 9 |
| 10 | 27 | 10 | 12 | 8 | 9 | 13 |
| 15 | 31 | 12 | 14 | 9 | 11 | 16 |
| 20 | 36 | 15 | 17 | 11 | 13 | 18 |

**Kael (Cavalier) — expected stats:**

| Level | HP | STR | SPD | DEF | SKL | LCK |
|-------|----|----|-----|-----|-----|-----|
| 1 | 22 | 7 | 6 | 6 | 5 | 4 |
| 5 | 25 | 9 | 7 | 7 | 6 | 6 |
| 10 | 29 | 11 | 10 | 9 | 8 | 8 |

Note: Kael dies in Ch3. His expected level at death is ~12-14.

---

## Stat Caps

### Unpromoted Caps

| Stat | Cap | Notes |
|------|-----|-------|
| HP | 60 | Rarely reached without grinding |
| STR, MAG, DEF, RES, SPD, SKL | 20 | Standard FE unpromoted cap |
| LCK | 30 | Higher cap — LCK is minor per point |
| CHA | 15 | Low cap — CHA is powerful per point (aura + aggro) |
| WIL | 15 | Low cap — WIL checks are balanced around low values |
| MOV | Class-locked | Cannot grow or exceed class base |

### Promoted Caps (Future)

| Stat | Cap |
|------|-----|
| HP | 80 |
| Combat stats | 30 |
| LCK | 40 |
| CHA | 20 |
| WIL | 20 |
| MOV | Class base + 1 |

---

## Weapon EXP

Separate from character EXP. Units gain weapon proficiency by using weapons.

```
Attack with weapon (hit or miss): +1 WEXP
Kill with weapon: +2 WEXP (total +3 with attack)
Heal with staff: +1 WEXP
```

| Rank | WEXP Required |
|------|--------------|
| E | 0 (starting) |
| D | 30 |
| C | 70 |
| B | 120 |
| A | 180 |
| S | 250 |

Higher rank → access to stronger weapons. See [weapons.md](weapons.md) for rank requirements per weapon.

---

## Meta-Stat Gains on Level-Up

Meta stats do NOT grow from level-up rolls. They change through gameplay actions.

| Meta Stat | How It Changes |
|-----------|---------------|
| **AWR** | +3-5 from witnessing glitches; story events; Data Void (+5 first time) |
| **LOOP** | Decreases from Ren's memory abilities; +2/turn on Memory Tiles; +3 from kills (Memory Leech) |
| **SYNC** | +2-3/turn on forts/thrones; -1-2/turn on glitched terrain; story events |
| **LOY** | Story decisions, support conversations, proximity effects |
| **CRP** | +1-3/turn on corrupted terrain; teaching; skill effects. Only down via Purify/Defrag |
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
4. Dismiss → return to map
```

### Design Intent

- Level-ups should feel exciting — each +1 matters
- Bad level-ups (0-1 stat gains) are possible and intentional
- RNG-based growth creates unique playthroughs
- Seeded RNG ensures E2E test determinism

---

## Bonus EXP (Future Consideration)

Not implemented. Design direction if added:

- Bonus EXP pool earned from fast chapter completion
- Distributed manually during preparation phase
- Guarantees stat gains (no RNG roll — allocates +1 to weakest stats)
- Prevents over-leveling one unit (diminishing returns past level lead)

---

## Open Questions

- **EXP from chip damage**: Should dealing 0 damage still grant EXP? Currently yes (5 minimum).
- **Boss EXP**: Should bosses give bonus EXP beyond the kill formula? Flat +20?
- **Dancer/refresher EXP**: If a refresh mechanic is added, how does that unit gain EXP?
- **Meta-stat growth**: Should level-ups give small CHA/WIL gains beyond growth rolls? Or keep them pure RNG?
- **EXP curve**: Is 30 base too generous? FE games vary from 10-30 base. Playtest needed.
