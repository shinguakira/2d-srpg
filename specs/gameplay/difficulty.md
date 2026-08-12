# Difficulty & Balance

Per-arc balance targets, enemy scaling, difficulty levers, and design philosophy across 25 chapters.

---

## Design Philosophy

This is a **25-chapter game** divided into 5 arcs. The player has limited battles — no grinding maps. The difficulty curve should feel like:

```
Arc 1 (Ch1-5):   Learn the system (gentle ramp)
Arc 2 (Ch6-10):  Master the system (promotions, full roster, Akira's death)
Arc 3 (Ch11-15): Corruption pressure (mid-game challenge spike)
Arc 4 (Ch16-20): Awakening power (hard but empowering, master classes)
Arc 5 (Ch21-25): The final push (hardest, but you have all tools)
```

### Core Principles

1. **No mandatory grinding** — beatable at expected levels with good tactics
2. **Permadeath is punishing, not unfair** — deaths should feel like player mistakes, not RNG
3. **Meta-stats add depth, not difficulty** — INS/EMB/ATT create choices, not barriers
4. **Akira's death (Ch8) is the mid-game turning point** — mechanical + emotional devastation
5. **Arc 5 is hard but empowering** — the player has all the tools, they need to use them well
6. **Late joiners are viable** — catch-up EXP and appropriate base stats ensure new units aren't dead weight

---

## Per-Arc Balance Targets

### Arc 1 — The Script (Ch1-5)

| Aspect | Target |
|--------|--------|
| **Deployment** | 3-4 (Ch1) → 6 (Ch5) |
| **Enemy count** | 6-8 (Ch1) → 12-15 (Ch5) |
| **Enemy levels** | 1-7 |
| **Expected player exit level** | 7-8 |
| **Turns per chapter** | 8-12 (Ch1) → 12-18 (Ch5) |
| **Deaths expected** | 0 (tutorial arc — forgiving) |
| **New mechanics** | Ch1: movement, attack, weapon triangle, terrain. Ch2: body targeting, villages, items, Halvar joins. Ch3: archer recruitment (Bryn). Ch4: thief recruitment (Fenn). Ch5: Elin (pegasus) |

**Balance Notes:**
- Ch1 is a true tutorial — enemies weaker than player units in 1v1
- Position clear weapon triangle lessons (axe enemy near Shigeru's sword)
- New recruits (Bryn Ch3, Fenn Ch4, Elin Ch5) join at party-appropriate levels
- No reinforcements in Ch1-2. Simple reinforcements in Ch3-5.
- Villages and hidden chests teach exploration

### Arc 2 — Fractures (Ch6-10)

| Aspect | Target |
|--------|--------|
| **Deployment** | 6-8 |
| **Enemy count** | 12-16 per chapter (+ 3-5 reinforcements) |
| **Enemy levels** | 7-14 |
| **Expected player exit level** | 13-15 |
| **Turns per chapter** | 14-20 |
| **Deaths expected** | 1 mandatory (Akira, Ch8), 0-1 additional |
| **New mechanics** | Promotions available (Ch7+), dark mages (CRP), support system, Viviane (dancer, Ch9) |

**Balance Notes:**
- **Akira's death (Ch8) is the emotional/mechanical core of this arc**
- Before Ch8: player feels powerful with full 8-unit roster
- After Ch8: immediate difficulty spike — lose best cavalry + Stability Anchor
- First promotions available (Hero Crest, Knight Crest at Ch7 shop)
- Enemy dark mages introduce CRP pressure from Ch7
- Ch10 is a "recovery" chapter — slightly easier, time to stabilize

### Arc 3 — Corruption (Ch11-15)

| Aspect | Target |
|--------|--------|
| **Deployment** | 8-10 |
| **Enemy count** | 15-22 per chapter |
| **Enemy levels** | 14-20 |
| **Expected player exit level** | 18-20 |
| **Turns per chapter** | 16-25 |
| **Deaths expected** | 0-1 (corruption losses possible) |
| **New mechanics** | Corruption spreading, corrupted terrain zones, conditional recruits (Zael Ch13), monk healing (Elara Ch14), fog of war |

**Balance Notes:**
- **This is the hardest arc relative to player power** — promoted enemies appear while some player units haven't promoted
- Corruption is the primary threat — CRP gain is aggressive
- Ward Stone (Ch12) provides limited CRP protection
- Conditional recruit (Zael) adds strategic depth — recruit costs resources but gains a flier
- First fog of war chapters test positioning without full information
- Forging unlocked (Arc 3) helps close the power gap

### Arc 4 — Awakening (Ch16-20)

| Aspect | Target |
|--------|--------|
| **Deployment** | 10-12 |
| **Enemy count** | 20-28 per chapter |
| **Enemy levels** | 20-27 |
| **Expected player exit level** | 25-28 |
| **Turns per chapter** | 18-28 |
| **Deaths expected** | 0-1 |
| **New mechanics** | Master Crown (Ch18), System negotiation (Ch17), Ghael recruitment (Ch18), Echo joins (Ch20), silver/brave weapons |

**Balance Notes:**
- Player power spikes with master class promotions and brave weapons
- Enemies also spike — promoted enemy classes appear in force
- Ch18 Master Crown is a critical strategic choice (who gets it?)
- Ghael (former boss) joins underleveled — requires investment
- Echo (System construct) joins at Ch20 with unique capabilities
- Large maps with multiple objectives test army management

### Arc 5 — The Last Save File (Ch21-25)

| Aspect | Target |
|--------|--------|
| **Deployment** | 12 |
| **Enemy count** | 25-35 per chapter |
| **Enemy levels** | 27-33 (Ch25 boss: 35) |
| **Expected player exit level** | 32-35 |
| **Turns per chapter** | 20-30+ |
| **Deaths expected** | 0-2 (high stakes, tight margins) |
| **New mechanics** | Legendary weapons, stat boosters in shop, ???_CORRUPTED (Ch24), final boss loop mechanic (Ch25) |

**Balance Notes:**
- Peak difficulty. Player has all tools but enemies are relentless.
- Endgame weapons (Brave, S-rank, Legendary) make player units powerful but enemy counts are highest
- Ch24: ???_CORRUPTED (Akira) is a devastating encounter — fighting your dead friend
- Ch25: Final boss reads player's EMB data. High remaining EMB = harder fight.
- Victory should feel earned — tight margins, smart play rewarded
- 2-3 master class units are the backbone; rest are strong promoted units

---

## Difficulty Levers

### Enemy Stat Scaling

| Lever | Effect | Current Value |
|-------|--------|---------------|
| **Enemy level range** | Higher levels = more stats | Per arc (see above) |
| **Enemy growth rate modifier** | Scale all enemy growths up/down | ×1.0 (same as player classes) |
| **Boss stat bonus** | Flat stat boost above level-expected | +2 (Arc 1) → +5 (Arc 5) |
| **Reinforcement levels** | Level of spawned reinforcements | Chapter base enemies - 1 |
| **Promoted enemy timing** | When promoted classes appear | Arc 3 (Ch11+) |

### Action Economy

| Lever | Effect | Current Value |
|-------|--------|---------------|
| **Enemy count** | More enemies = harder | Scales 8 → 35 across 25 chapters |
| **Player deployment** | More allies = easier | Scales 3 → 12 across 25 chapters |
| **Reinforcement timing** | Earlier = harder | Turns 5-6 (Arc 1) → Turns 3-4 (Arc 5) |
| **Reinforcement frequency** | One wave vs continuous | Single wave (Arc 1-2), multi-wave (Arc 3-4), continuous (Arc 5) |
| **Enemy behavior distribution** | More aggressive = harder | See [ai.md](ai.md) |

### Economy

| Lever | Effect | Current Value |
|-------|--------|---------------|
| **Gold income per arc** | More gold = better gear | 3000 (Arc 1) → 9000 (Arc 5). See [economy.md](economy.md) |
| **Item availability** | More healing = forgiving | 2 vulneraries start → shops scale |
| **Weapon availability** | Better weapons = easier | See [weapons.md](weapons.md) per-arc |
| **EXP base** | Higher = faster leveling | 30 |
| **Kill bonus EXP** | Rewards aggression | 50 |
| **Catch-up EXP** | Helps late joiners | +20% if 3+ below average |

### Meta-Stat Tuning

| Lever | Effect | Current Value |
|-------|--------|---------------|
| **CRP gain rate** | Higher = more pressure | +2 per turn on terrain (Arc 1-2), +3 (Arc 3-5) |
| **CRP passive decay** | Allows recovery | -1 per chapter if below 15 for 3+ chapters |
| **STA thresholds** | Lower = earlier fatigue | 15/25/35/45 (Fresh/Winded/Fatigued/Exhausted/Collapsed) |
| **EMB arc regen** | Prevents EMB bankruptcy | +10 per arc transition |
| **LOY impact** | Higher = more meaningful | ±5-15 per event |
| **INS gain rate** | Faster = earlier UI unlocks | +3-5 per glitch witness |

---

## Damage & Survivability Benchmarks

### Player Unit Survivability

At expected levels, player units should survive:

| Unit Role | Arc 1 | Arc 2 | Arc 3 | Arc 4 | Arc 5 |
|-----------|-------|-------|-------|-------|-------|
| **Tank** (Akira, Ghael, Halvar) | 4-5 hits | 3-4 hits | 3-4 hits | 3 hits | 2-3 hits |
| **Bruiser** (Shigeru, Gareth, Corwin) | 3-4 hits | 3 hits | 2-3 hits | 2-3 hits | 2 hits |
| **Mage** (Lisette, Kira) | 1-2 hits | 1-2 hits | 1-2 hits | 1-2 hits | 1 hit |
| **Healer** (Mirelle, Nadine, Elara) | 1-2 hits | 1 hit | 1 hit | 1 hit | 1 hit |
| **Flier** (Elin, Zael) | 2-3 hits | 2-3 hits | 2 hits | 2 hits | 1-2 hits |
| **Speed** (Fenn, Viviane) | 2-3 hits | 2 hits | 2 hits | 1-2 hits | 1 hit |

"Hit" = average enemy attack at that arc's level. Mages and healers should always be at risk.

### Player Damage Output

At expected levels, player units should kill average enemies in:

| Unit Role | Arc 1 | Arc 3 | Arc 5 |
|-----------|-------|-------|-------|
| **Physical DPS** | 2 rounds | 2 rounds | 1-2 rounds |
| **Mage DPS** | 1-2 rounds | 1-2 rounds | 1 round |
| **Tank** | 3-4 rounds | 3 rounds | 2-3 rounds |
| **Healer** | N/A | N/A (unless promoted to attack class) | 3+ rounds |

### Boss Durability

| Arc | Boss HP | Expected Rounds to Kill | Notes |
|-----|---------|------------------------|-------|
| Arc 1 | 30-40 | 3-5 | Shigeru can handle with support |
| Arc 2 | 40-55 | 5-7 | Need team effort. Ch8 boss while losing Akira. |
| Arc 3 | 50-65 | 6-8 | Promoted bosses. Need weapon advantage. |
| Arc 4 | 60-80 | 7-10 | Multi-phase or reinforcing bosses. |
| Arc 5 | 80-120 | 8-12+ | Ch25 boss has multiple phases + EMB scaling. |

---

## Anti-Frustration Design

### Prevent Softlocks

- EXP minimum of 5 ensures underleveled units can still gain EXP
- Catch-up EXP (+20%) prevents units from falling too far behind
- Vulneraries always available at shops
- Shigeru's Rapier is Prf (character-locked, strong) — always has a viable weapon
- Halvar's Garrison Lance has infinite durability — always has a weapon
- Supply convoy stores all items not in inventories — nothing is lost
- At least one Heal staff available at shops in every arc

### Prevent RNG Death Spirals

- Hit rate clamped at 1% min, 99% max
- Critical hits exist but are rare without crit-focused builds
- STA resets each chapter
- LOY can recover — low loyalty events can be offset by good decisions
- CRP has passive decay below 15 and item-based cleansing
- EMB regens +10 between arcs

### Player Information

- INS system progressively reveals enemy information
- Combat Forecast shows exact damage, hit%, crit%, doubles before committing
- Danger zone overlay shows all tiles enemies can reach
- Weapon triangle is color-coded in UI (green = advantage, red = disadvantage)
- Corruption Detector (Ch11+) shows CRP values on all units

### Late Joiner Viability

| Character | Join Chapter | Join Level | Notes |
|-----------|------------|-----------|-------|
| Bryn | Ch3 | 3 | Slightly above party average |
| Fenn | Ch4 | 4 | At party average |
| Elin | Ch5 | 6 | Slightly above, prepromote stats |
| Corwin | Ch6 | 8 | At party average |
| Nadine | Ch6 | 7 | Slightly below but mounted |
| Viviane | Ch9 | 11 | At party average, cannot promote |
| Kira | Ch11 | 14 | Above average, compensates for frailty |
| Zael | Ch13 | 15 (conditional) | At promoted threshold |
| Elara | Ch14 | 15 | At promoted threshold |
| Ghael | Ch18 | 18 | Below average — former boss penalty |
| Echo | Ch20 | 22 | At party average, unique class |

---

## Difficulty Modes

### Classic Mode (Default)

- Permadeath
- All mechanics as designed
- The intended experience

### Casual Mode

- No permadeath (defeated units return next chapter at 1 HP)
- Grief/trauma skills still trigger (narrative preserved)
- Same enemy stats and difficulty
- For players who want the story without the stress

### Hard Mode

- Permadeath
- Enemy stats +10% across the board
- Reinforcements arrive 1 turn earlier
- Enemy AI uses optimal behavior from Ch1 (no "learning" period)
- STA thresholds reduced by 5 each
- CRP gain rate +50%
- Fewer stat boosters available (1 less per arc)
- For experienced SRPG players

---

## Open Questions

- **Dynamic difficulty**: Should the game adjust if the player is struggling? *Recommendation: No — undermine the meta-narrative. The Blackflame wouldn't make it easier.*
- **Turn ranking**: Should chapters grade performance (S/A/B/C)? *Recommendation: Yes — ties into Bonus EXP system. Fast play = more Bonus EXP.*
- **New Game+**: EMB carries over? Start with higher INS? *Recommendation: Yes, with narrative justification — Shigeru's 348th cycle. Enemies scale +15%.*
- **Chapter retry**: Can the player retry from the start? *Recommendation: Yes, but with meta-narrative commentary from Shigeru: "Again? Fine. Let's try this differently."*
