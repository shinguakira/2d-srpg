# Combat

Combat math, formulas, and resolution flow. This covers the NUMBERS — for turn structure and action flow, see [battle-logic.md](battle-logic.md).

Code reference: `src/core/combat.ts`

---

## Damage Formula

### Physical Damage
```
ATK = STR + weapon might
Damage = ATK - (DEF + terrain DEF bonus) + triangle damage mod
Minimum: 0 (can deal 0 damage)
```

### Magic Damage
```
ATK = MAG + weapon might
Damage = ATK - (RES + terrain DEF bonus) + triangle damage mod
Minimum: 0
```

### Critical Damage
```
Crit Damage = Normal Damage × 3
```

### Healing
```
Heal Amount = MAG + staff might
Capped at target's max HP
```

---

## Hit Rate

```
Accuracy = SKL×2 + LCK + weapon hit
Evade    = SPD×2 + LCK + terrain avoid bonus
Hit Rate = Accuracy - Evade + triangle hit mod
Clamped: 1% minimum, 99% maximum (nothing is ever guaranteed)
```

### Hit Rate Modifiers (from other systems)

| Source | Modifier | Notes |
|--------|---------|-------|
| Weapon triangle advantage | +15 hit | See below |
| Weapon triangle disadvantage | -15 hit | |
| CHA aura (ally within range) | +CHA hit | From the CHA source unit |
| Empathy Aura (Lira adjacent) | +10 hit | Stacks with CHA |
| Time of Day (Morning units at Dawn) | +2 hit | See stats.md |
| Time of Day (Night units at Night) | +2 hit | |
| STA Winded | -0 hit | (indirect: STR/SPD penalty affects derived) |
| SYNC Volatile (0-30%) | -20% hit | Applied multiplicatively |
| SYNC Hardened (71-90%) | +5% hit | |
| LOY Devoted (near Ren) | +5% hit | |
| Body targeting: Head | -25% hit | |
| Body targeting: Weak Point | -35% hit | |

---

## Crit Rate

```
Crit Rate = floor(SKL/2) + weapon crit - enemy LCK
Clamped: 0% minimum, 100% maximum
```

### Crit Modifiers

| Source | Modifier |
|--------|---------|
| Killing Edge / Killer weapons | +30 crit |
| Wrath skill (HP ≤ 50%) | +30 crit |

---

## Weapon Triangle

```
Sword > Axe > Lance > Sword
Fire  > Wind > Thunder > Fire
```

| Matchup | Hit Mod | Damage Mod |
|---------|---------|------------|
| Advantage | +15 | +1 |
| Disadvantage | -15 | -1 |
| Neutral / cross-type | 0 | 0 |

- Physical vs Magic: no triangle interaction.
- Staff: non-combat, no triangle.

---

## Double Attack

```
Attacker doubles if: Attacker SPD - Defender SPD ≥ 5
Defender doubles if: Defender SPD - Attacker SPD ≥ 5 (and can counter)
```

- STA Exhausted: cannot double attack.
- Pursuit skill: lowers threshold from 5 to 3.
- Brave weapons: always attack twice (4 times if also doubling).

---

## Counter Attack

The defender counterattacks if their equipped weapon's range covers the combat distance.

```
Can counter if: distance ≥ weapon minRange AND distance ≤ weapon maxRange
```

- Melee weapon (range 1): cannot counter ranged attacks.
- Staff: cannot counter (non-combat weapon).
- Javelin/Hand Axe (range 1-2): can counter both melee and ranged.
- Tomes (range 1-2): can counter both.

---

## Combat Round Sequence

1. **Attacker strikes** (hit/miss/crit rolled)
2. **Defender counters** (if in range and alive)
3. **Follow-up** (if either doubles and both alive):
   - Attacker doubles → attacker strikes again
   - Defender doubles → defender counters again
   - Only ONE unit can follow up (even if both qualify, attacker priority)

### Brave Weapon Sequence

1. Attacker strikes (1st)
2. Attacker strikes (2nd — Brave bonus)
3. Defender counters (if alive and in range)
4. If attacker doubles: Attacker strikes (3rd)
5. If attacker doubles: Attacker strikes (4th — Brave + double)

---

## Effective Weapons (×3 Might)

| Weapon | Effective Against |
|--------|-----------------|
| Rapier | Cavalry, Armored |
| Armorslayer | Armored |
| Horseslayer | Cavalry |
| Hammer | Armored |
| Excalibur | Flying |

Effective bonus: weapon might ×3 (before adding STR/MAG).

---

## Body Targeting Modifiers

Unlocked Ch2+. Applied to attacker's hit rate and damage. See [stats.md](stats.md) for full details.

| Target | Hit Mod | Damage Mod | Status Effect |
|--------|---------|-----------|---------------|
| Body (default) | 0 | 0 | None |
| Head | -25% | +50% | Dazed: -10 hit for 2 turns |
| Weapon Arm | -15% | -20% | ATK halved for 1 turn |
| Legs | -10% | -30% | MOV halved for 2 turns |
| Weak Point | -35% | +100% | Requires full stat reveal |

---

## Status Effects from Combat

| Status | Duration | Effect | Cure |
|--------|----------|--------|------|
| **Dazed** | 2 turns | -10 hit rate | Fades naturally |
| **Poison** | Until cured | -5 HP per turn start | Antitoxin, Restore staff |
| **ATK Break** | 1 turn | ATK halved | Fades naturally |
| **MOV Break** | 2 turns | MOV halved | Fades naturally |
| **Panic** | 1 turn | Cannot act (WIL check to resist: base 30% - WIL×5%) | Restore staff |

---

## Skill Activations During Combat

Skills that activate during combat resolution:

| Skill | Timing | Effect |
|-------|--------|--------|
| **Vantage** | Pre-combat | Defender strikes first if HP ≤ 50% |
| **Sol** | On hit (SKL%) | Heal 50% of damage dealt |
| **Luna** | On hit (SKL%) | Ignore 50% of enemy DEF/RES |
| **Astra** | On attack (20%) | 5 hits at half damage |
| **Aegis** | On defend (SKL%) | Halve magic damage |
| **Pavise** | On defend (SKL%) | Halve physical damage |
| **Lethality** | On hit (SKL/2%) | Instant kill (not bosses) |
| **Counter** | After surviving melee | Reflect 50% damage |
| **Wrath** | Passive | +30 crit when HP ≤ 50% |
| **Adept** | On hit (20%) | Bonus follow-up attack |

Priority: Vantage resolves first → attacker skills → defender skills.

---

## Meta-Stat Combat Interactions

| Stat | Combat Effect |
|------|--------------|
| **AWR Blind (0-10)** | +10% passive avoid. No forecast visible. |
| **AWR Decoded (61-90)** | Foresight: peek at actual result before committing (1/chapter) |
| **AWR Awake (91-100)** | Break the Script: rewrite one result after resolution (1/chapter) |
| **LOOP** | Déjà Vu Strike (15 LOOP): guaranteed hit + crit |
| **SYNC Volatile** | Stats fluctuate ±1-3 per turn, attacks may deal 0 or 2× |
| **SYNC Anchored** | +10% hit/avoid, immune to System interference |
| **LOY Defiant** | 15% chance to ignore attack command |
| **CRP Spreading (31-50)** | 10% chance attacks spread +3 CRP to target |
| **CRP Consumed (51-75)** | +20% damage vs units with CRP > 0 |
| **STA Exhausted** | Cannot double, MOV -1, -3 STR/SPD/DEF/SKL |

---

## Open Questions

- **True damage**: Should there be attacks that bypass DEF/RES entirely? Corruption damage?
- **Minimum damage**: Currently 0. Should it be 1 minimum (like Kael's True Strike passive)?
- **RNG system**: Single roll vs 2-roll average (FE uses 2RN for displayed hit rates). Current code uses single roll.
