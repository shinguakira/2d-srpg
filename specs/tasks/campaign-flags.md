# Campaign Flags & Ending Matrix — Master Reference

> **All task files should reference this file for flag definitions, recruitment conditions, and ending logic.**
> **Single source of truth for conditional game state.**

---

## Campaign Flags

| Flag | Type | Set In | Checked In | Default |
|------|------|--------|------------|---------|
| `kael_survive_turns` | number | ch8 (auto, counts turns Kael survived as NPC) | ch24 dialogue variants | 0 |
| `zael_recruited` | boolean | ch13 (Talk action on Zael at ≤5 HP) | ch14 boss selection, ch25 ending | false |
| `ghael_recruited` | boolean | ch18 (Talk action on Ghael at ≤5 HP) | ch18 secondary boss, ch25 ending | false |
| `echo_saved` | boolean | ch20 (Echo alive at chapter end) | ch25 ending, ch25 party dialogue | false |
| `system_negotiated` | boolean | ch17 (Negotiate action on boss) | ch25 System Phase 1 stats (-20%) | false |
| `ch12_corruption_victim` | string (unitId) | ch12 (highest-CRP unit at Turn 5) | ch12 dialogue, ch12 enemy spawn | "" |
| `total_deaths` | number | any chapter (incremented on permadeath) | ch25 ending variant | 0 |
| `grief_trauma_remaining` | number | ch8 (set to 2) | ch9, ch10 (decremented each chapter) | 0 |
| `master_crowns_used` | number | any (incremented on master promotion) | UI display (3 - used = remaining) | 0 |
| `bonus_exp_pool` | number | each chapter end (par bonus) | preparation screen distribution | 0 |

---

## Conditional Recruitment — Exact Conditions

### Zael (Chapter 13)
- **Unit type:** Wyvern Rider, starts as enemy, CRP 43
- **CRP tick:** +2/turn (hits CRP 100 at Turn 29)
- **Flee deadline:** Zael flees map at Turn 20 if not recruited
- **Recruitment window:** Turns 1-20
- **HP condition:** Zael HP must be ≤ 5
- **Action:** Ren uses Talk action while adjacent to Zael
- **Required unit:** Ren (only Ren can recruit)
- **Flag set:** `zael_recruited = true`
- **Failure modes:** Zael killed → dead, flag false. Zael flees Turn 20 → gone, flag false.

### Ghael (Chapter 18)
- **Unit type:** General, starts as enemy boss, stationary on fort
- **HP condition:** Ghael HP must be ≤ 5
- **Action:** Ren uses Talk action while adjacent to Ghael
- **Required unit:** Ren (only Ren can recruit)
- **Flag set:** `ghael_recruited = true`
- **On recruit:** Relic Warden (System Construct, 50 HP) spawns blocking vault exit
- **Failure mode:** Ghael killed → dead, flag false. No turn deadline (stationary boss).

### Echo (Chapter 20)
- **Unit type:** System Construct, appears Turn 5 as green NPC ally
- **Condition:** Echo must be alive (HP > 0) when chapter ends
- **Action:** No player action needed — passive survival condition
- **Flag set:** `echo_saved = true`
- **Failure mode:** Echo killed during chapter → dead, flag false.

### Earlier Recruits (Not Conditional — Always Join)
| Unit | Chapter | Method | Notes |
|------|---------|--------|-------|
| Bram | ch1 | Mid-chapter event | Crashes into battle Turn 3 |
| Lira | ch1 | Post-chapter | Joins in epilogue |
| Voss | ch2 | Enemy defection event | Switches sides Turn 4 |
| Nira | ch3 | Village visit | Visit specific village tile |
| Coda | ch4 | Event trigger | Player reaches tile in time |
| Yuel | ch5 | Chapter start | Auto-joins roster |
| Rook | ch6 | Chapter start | Auto-joins roster |
| Faye | ch6 | Mid-chapter NPC | Adjacent player unit recruits |
| Orin | ch9 | Mid-chapter event | Joins Turn 3 |
| Kira | ch11 | Enemy defection event | Switches sides Turn 5 |
| Elara | ch14 | Adjacent trigger | Any player unit moves adjacent to Elara |

---

## Ending Decision Matrix

```
evaluate_ending(flags):
  if total_deaths >= 5:
    ending = TRAGIC  // Overrides others — too much loss
  else if final_save_crystal_used AND system_defeated:
    if total_deaths == 0 AND zael_recruited AND ghael_recruited AND echo_saved:
      ending = PERFECT
    else:
      ending = TRUE
  else if system_defeated AND NOT final_save_crystal_used:
    ending = BITTERSWEET  // System reset allowed
  else:
    ending = GAME_OVER  // Should not reach — failsafe
```

### Ending Details

| Ending | Condition | Dialogue Variant | Credits |
|--------|-----------|-----------------|---------|
| **Perfect** | True + 0 deaths + all 3 conditionals | Extended: all recruited characters speak, "Everyone made it" | Full party image |
| **True** | System defeated + Final Save Crystal used | Standard: loop ends, world stabilizes | Party image (missing dead) |
| **Bittersweet** | System defeated, no Crystal (or player "allows reset") | Loop continues but party remembers | Party image, faded |
| **Tragic** | 5+ total_deaths (any victory condition) | Weighted with loss, each fallen ally named | Reduced party image |

### "Allow Reset" Mechanic
- At ch25 seize: if Ren has Final Save Crystal equipped → True/Perfect path
- If Ren does NOT have Crystal equipped → Bittersweet path (System resets)
- This is a soft choice via inventory management, not a dialogue prompt
- Player must deliberately equip the Crystal before seizing

### `system_negotiated` Effect
- Only affects ch25 gameplay (System Phase 1 stats -20%), does NOT change ending
- Negotiation is a tactical advantage, not a story branch

---

## Meta-Stat Calculations (Glossary)

### AWR (Awareness) — Range 0-100
```
Gain:
  +3 to +5 when witnessing a glitch event (event-defined, varies)
  +2 when adjacent to glitched tile at turn end
  +1 per chapter completed (applied at chapter end)
  +10 on partner death (grief-awareness)

Party Average AWR = sum(all_deployed_units.awr) / deployed_count
```

### LOOP (Ren Only) — Starts 347
```
Expenditure:
  Teaching a combat skill: -10 LOOP, +2 CRP to both Ren and student
  Teaching a meta skill: -15 LOOP, +2 CRP to both
  Teaching a movement skill: -5 LOOP, +2 CRP to both
  Overwriting corrupted terrain (story event): -variable (defined per event)

Regen:
  +10 at each arc transition (ch5, ch10, ch15, ch20)

Memory Blade might = 1 + floor(LOOP / 30)
```

### LOY (Loyalty) — Range 0-100, Per Unit
```
Gain:
  +2 adjacent to Ren at turn end
  +3 / +5 / +8 / +12 on support rank C / B / A / S reached
  +5 per chapter if unit deployed with Ren

Loss:
  -15 when support partner dies
  -5 when Ren takes damage and unit is adjacent but didn't act

Effects:
  ≥ 80: +1 all stats when within 3 tiles of Ren
  ≤ 30: 5% chance to disobey commands per action
```

### SYNC (Stability) — Range 0-100
```
Change:
  -1/turn on glitched terrain
  -3/turn on data void terrain
  +2/turn on fort tiles
  +5/turn on memory tiles

Effects:
  < 30: stat variance ±2 on each combat (seeded RNG)
  > 80: +5 hit rate
```

### CRP (Corruption) — Range 0-100
```
Gain:
  +2/turn on glitched tile
  +3/turn on data void tile
  +1/turn on corrupted fort tile
  +weapon.crpDamage on dark magic hit (typically 3-5)
  +1/turn in corruption storm weather

Decay:
  -1 between chapters if CRP < 15 for 3+ consecutive chapters

Thresholds:
  30: sprite flicker (visual only)
  60: -1 all stats, more flicker
  80: -2 all stats, warning overlay
  100: unit turns enemy (permadeath event)

Purify: light magic / purify staff reduces CRP by healAmount
```

### STA (Stamina) — Range 0-45, Per Chapter
```
Gain:
  +1 per tile moved
  +3 per attack made
  +5 per skill activated
  +2 per heal cast

Recovery:
  -3/turn on fort tiles (applied at turn start, before actions)
  -5/turn on throne tiles
  Rest action: -10 STA (costs full turn)

Reset: STA → 0 at chapter start (during initActions, before first player phase)

Thresholds:
  30: -1 SPD
  45: -2 SPD, -1 SKL, cannot act (exhaustion) — must Rest or stand on fort
```

---

## Difficulty Modes

| Mode | Permadeath | Enemy Stats | Reinforcements | Other |
|------|-----------|-------------|----------------|-------|
| **Classic** | Yes | Base (×1.0) | Normal timing | Intended experience |
| **Casual** | No (return next chapter) | Base (×1.0) | Normal timing | For story enjoyment |
| **Hard** | Yes | ×1.1 (+10%) | 1 turn early | Unlocked after any ending |

- Mode selected at campaign start, cannot change mid-campaign
- Hard mode: boss stat bonus additionally +2 per arc (stacks with base +2→+5)
- Casual mode: units "retreat" instead of dying, return at chapter start with 1 HP

---

## Roster Count Verification (for ch23 Split Party)

### Maximum Possible Roster at Ch23
| Source | Units | Running Total |
|--------|-------|---------------|
| Ch1 start | Ren, Kael, Senna | 3 |
| Ch1 joins | Bram, Lira | 5 |
| Ch2 | Voss | 6 |
| Ch3 | Nira | 7 |
| Ch4 | Coda | 8 |
| Ch5 | Yuel | 9 |
| Ch6 | Rook, Faye | 11 |
| Ch8 | -Kael (death) | 10 |
| Ch9 | Orin | 11 |
| Ch11 | Kira | 12 |
| Ch12 | -1 (corruption loss) | 11 |
| Ch13 | +Zael (conditional) | 11-12 |
| Ch14 | Elara | 12-13 |
| Ch18 | +Ghael (conditional) | 12-14 |
| Ch20 | +Echo (conditional) | 12-15 |

### At Ch23: 12-15 units (minus any additional permadeaths)
- **Minimum realistic:** 10 (12 base - 2 permadeaths)
- **Maximum:** 15 (all conditionals, zero extra deaths)
- **Split:** 6+6 minimum, up to 7+8 if roster allows
- **Safety:** If roster < 12, auto-fill with NPC allies to reach 6 per side
- **Ren must be on one team** (player chooses which)
