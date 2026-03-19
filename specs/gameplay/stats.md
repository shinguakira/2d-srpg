# Stats

Defines every stat field in the game: what it means, how it's used in formulas, and design intent.

This game has two stat layers:
1. **Classic SRPG stats** — standard combat math (HP, STR, DEF, etc.)
2. **Meta stats** — unique to this game's meta-narrative (AWR, LOOP, SYNC)

The meta stats are NOT cosmetic. They create real mechanical trade-offs and tie gameplay directly to the story. All actions remain within standard SRPG rules — Attack, Wait, Heal, Item, Seize.

---

## Base Stats (per Unit)

| Stat | Abbr | Description | Used In |
|------|------|-------------|---------|
| **Hit Points** | HP | Health pool. Unit dies at 0. | Survival, currentHp tracks damage taken |
| **Strength** | STR | Physical attack power. | Physical damage = STR + weapon might - DEF |
| **Magic** | MAG | Magic attack/heal power. | Magic damage = MAG + might - RES; Heal = MAG + staff might |
| **Defense** | DEF | Reduces physical damage taken. | Subtracted from physical ATK |
| **Resistance** | RES | Reduces magic damage taken. | Subtracted from magic ATK |
| **Speed** | SPD | Evasion + double attack threshold. | Evade = SPD×2 + LCK; Double if SPD diff ≥ 5 |
| **Skill** | SKL | Accuracy + crit chance. | Accuracy = SKL×2 + LCK + weapon hit; Crit = SKL/2 + weapon crit |
| **Luck** | LCK | Small boost to hit, avoid, crit-avoid. | +LCK to accuracy & evade; -LCK from enemy crit |
| **Movement** | MOV | Tiles traversable per turn. | BFS pathfinding range; does NOT grow on level-up |

## Derived Stats (calculated, never stored)

These are computed on the fly from base stats + weapon + terrain.

| Derived Stat | Formula | Notes |
|--------------|---------|-------|
| **Attack (ATK)** | STR + weapon might (phys) or MAG + might (magic) | Before triangle modifier |
| **Accuracy** | SKL×2 + LCK + weapon hit | Before triangle modifier |
| **Evade** | SPD×2 + LCK + terrain avoid | Defender only |
| **Hit Rate** | Accuracy - Evade + triangle hit mod | Clamped 1–99% |
| **Crit Rate** | SKL/2 + weapon crit - enemy LCK | Clamped 0–100% |
| **Crit Damage** | Normal damage × 3 | Only on crit hit |
| **Terrain DEF** | terrain defenseBonus | Added to effective DEF |

## Weapon Triangle Modifiers

| Matchup | Hit Mod | Damage Mod |
|---------|---------|------------|
| Advantage (sword>axe, axe>lance, lance>sword) | +15 | +1 |
| Disadvantage | -15 | -1 |
| Neutral / cross-type | 0 | 0 |

Magic triangle: fire > wind > thunder > fire (same mods).

## Double Attack

A unit attacks twice if their SPD exceeds the opponent's SPD by **≥ 5**.
Both attacker and defender can double (defender only if they can counter).

## Growth Rates

Each class defines growth rates (0–100%) per stat (except MOV).
On level-up, each stat rolls independently against its growth rate: success = +1, fail = +0.

| Example: Lord | HP | STR | MAG | DEF | RES | SPD | SKL | LCK |
|---------------|----|----|-----|-----|-----|-----|-----|-----|
| Growth % | 80 | 45 | 10 | 30 | 20 | 50 | 45 | 60 |

## EXP & Level-Up

- **Base EXP**: 30 + (enemy level - attacker level) × 5, min 5
- **Kill bonus**: +50 EXP
- **Cap**: 100 EXP per action
- **Level-up**: at 100 EXP → carry remainder, gain 1 level, roll growths

## Stat Design Philosophy

- **STR vs MAG split**: Physical units dump MAG, mages dump STR — keeps them specialized
- **SPD is king**: Controls both offense (doubling) and defense (evade) — intentionally strong
- **SKL is subtle**: Matters most for low-hit weapons (axes) and crit builds
- **LCK is minor**: Small nudge to multiple formulas, never dominant — "nice to have" stat
- **DEF vs RES**: Most enemies are physical, so RES is niche but critical vs mages
- **MOV is class-locked**: Only changes via promotion (future), never via level-up — keeps cavalry unique

## Terrain Bonuses (for reference)

| Terrain | Move Cost | DEF Bonus | Avoid Bonus |
|---------|-----------|-----------|-------------|
| Plain | 1 | 0 | 0 |
| Forest | 2 | +1 | +20 |
| Mountain | 3 | +2 | +30 |
| Fort | 1 | +3 | +20 |
| Village | 1 | 0 | +10 |
| Throne | 1 | +5 | +30 |
| Water | impassable | — | — |
| Wall | impassable | — | — |

---

# Meta Stats

These stats are unique to "The Last Save File." They exist because the characters are inside a game — and some of them know it.

---

## AWR (Awareness)

How much a unit perceives the system layer. NOT a linear "higher = better" stat. Each threshold unlocks new abilities AND new vulnerabilities.

### AWR Thresholds

| AWR | Tier | Benefits | Costs |
|-----|------|----------|-------|
| 0-10 | **Blind** | **Instinct Guard**: +10% passive avoid. Immune to System glitches (corruption damage, terrain flicker). | No enemy stat preview. No combat forecast details. Can't see AI types. |
| 11-30 | **Flickering** | See own stats as numbers. See enemy weapon type + approximate HP (full/half/low). | **Déjà Vu**: 5% chance per turn to freeze for 1 action (memory fragment intrusion). |
| 31-60 | **Reading** | **System Sight**: Full combat forecast. See enemy stats, movement range on hover, AI type label (aggressive/guard/boss). | **Corruption Magnet**: +3 damage from glitched tiles. +20% damage from corrupted enemies. System targets high-AWR units first for spawns. |
| 61-90 | **Decoded** | **Foresight**: Before committing to an attack, see the ACTUAL outcome (hit/miss/crit) — not just the %. Can cancel the attack after peeking. 1 use per chapter. | **System Threat**: +1 extra enemy spawns near this unit's position each chapter. Unit is flagged for deletion. |
| 91-100 | **Awake** | **Break the Script**: Once per chapter, rewrite ONE combat result after it resolves. Change a miss to a hit, a hit to a miss, negate a crit. Edit reality. | **Existential Fragility**: -15% damage dealt unless an ally has died this chapter. Knowing everything is a game makes it hard to care — until it costs something real. |

### AWR Growth (NOT from Level-Up)

AWR changes through story events and choices, not combat EXP.

| Event | AWR Change | Notes |
|-------|-----------|-------|
| Witness a glitch (terrain flicker, wrong weapon spawn) | +3 to +5 | Whoever was adjacent |
| Told about the loops by Ren | +10 to +15 | Listener may resist (willpower reduces gain) |
| Defeat an aware boss | +5 | Kill credit unit only |
| Ally dies (permadeath) | +8 to +12 | ALL surviving units — trauma cracks the veil |
| Defect from enemy side | +20 to +30 | Breaking AI code exposes system layer |
| Successfully use Senna's Seed Read | +2 | Senna only |
| Dialogue choice: "choose not to know" | -5 to -10 | Player can deliberately keep a unit ignorant — sometimes tactically correct |

### AWR Per Character

| Character | Ch1 | Ch2 | Ch3 | Ch4 | Notes |
|-----------|-----|-----|-----|-----|-------|
| Ren | 95 | 96 | 97 | 98 | Near-max. Slight growth from genuinely new events (glitches). |
| Senna | 25 | 45 | 60 | 70 | Rapid analytical growth. Crosses "Reading" mid-Ch2, "Decoded" by Ch4. |
| Kael | 0 | 5 | 18 | — | Stays Blind until told about loops in Ch3. Dies before going further. |
| Bram | 35 | 38 | 42 | 50 | In "Reading" but sees system data through fighting game UI. Growth is slow — he resists understanding. |
| Lira | 30 | 33 | 45 | 55 | Sees system as dating sim mechanics. Spikes +12 on Kael's death. |
| Voss | 5→35 | 40 | 50 | 60 | Jumps massively on defection. Steady growth after. |

### AWR Player Choice

At certain dialogue points, the player can raise or lower a character's AWR:

- "Tell Kael the truth about the loops" → Kael +15 AWR (gains forecast info, loses Instinct Guard)
- "Let Kael believe this is real" → Kael stays low AWR (keeps +10% avoid, no forecast)

Real tactical dilemma: more information vs better instinctive performance.

---

## LOOP (Cycle Memory)

How many past cycles a unit retains. LOOP is a **spendable resource** — accumulated memories can be burned for powerful one-time effects, but spent memories are gone permanently. You're trading your past for your present.

### LOOP Actions

| Action | Cost | Effect | Narrative |
|--------|------|--------|-----------|
| **Recall** | 10 LOOP | Preview enemy phase — see where ALL enemies will move and who they'll attack. Full map overlay showing projected enemy positions + targets. Lasts until end of enemy phase. | "I've seen this turn before. They'll flank left." |
| **Déjà Vu Strike** | 15 LOOP | Next attack is guaranteed hit + guaranteed crit. Muscle memory from hundreds of identical kills. | "I know exactly where your guard drops." |
| **Ghost Step** | 20 LOOP | Move through occupied tiles (enemy or ally) this turn. Phase through units. Your body remembers a cycle where those tiles were empty. | "In cycle #203, this tile was open. My body still thinks it is." |
| **Echo** | 30 LOOP | Summon a "ghost" of yourself from a past cycle at an adjacent tile. Ghost has 50% of your stats, lasts 2 turns, acts independently. Cannot use LOOP abilities. Cannot be healed. Fades at end. | "One more time. Like cycle #112." |
| **Last Words** | ALL remaining LOOP | When a unit hits 0 HP: spend ALL remaining LOOP to survive at 1 HP. One-time revival. The memory of surviving keeps you alive — but every memory is gone forever. | "Not yet. I remember a time where I survived this. One more time." |

### LOOP Gain

| Event | LOOP Gain | Notes |
|-------|----------|-------|
| Level up | +3 to +5 | Small. Living through combat creates micro-memories. |
| Kill a boss | +10 | Major combat memory. |
| Survive at ≤20% HP | +5 | Trauma burns in. |
| Witness ally death | +8 | You'll never forget this. |
| System glitch exposure | +2 | Breaking world leaks past-cycle data. |

LOOP does NOT regenerate between chapters. What you spend is permanent.

### LOOP Per Character

| Character | Starting | Max | Notes |
|-----------|---------|-----|-------|
| Ren | 347 | ~400 | Enormous reservoir. Can spend liberally early but must conserve for Ch4. |
| Senna | 0 | ~40 | No cycle memory. Gains LOOP through analysis — reverse-engineering past-cycle data. |
| Kael | 0 | ~25 | Gains modest LOOP through combat. Lost when he dies in Ch3 — unless the Ch4 boss has it. |
| Bram | 0 | ~30 | No past memories. His LOOP gains are flavored as muscle memory: "I've never fought this guy but my HANDS remember." |
| Lira | 0 | ~35 | Remembers emotional patterns, not combat. LOOP abilities flavored as empathy: "I knew you'd do that because I KNOW you." |
| Voss | 150 | ~180 | 300 cycles as stationary AI, but only remembers the last ~150. All the SAME memory: standing on one tile. His Recall shows the same image until he gains NEW experiences. |

### Ren's LOOP — The Big Decisions

Ren starts with 347 LOOP. He could burn 15 every fight for guaranteed crits and steamroll the game. BUT:

- **Ch4 boss scaling**: ???_CORRUPTED reads your LOOP data. Higher remaining LOOP = harder boss phase (it weaponizes your memories against you).
- **Last Words sacrifice**: If Ren uses Last Words, he survives at 1 HP but loses ALL 347 memories. The exhausted speedrunner becomes... nobody. A person without a past. Is that worth it?
- **Two final dialogues**: If Ren reaches the finale with high LOOP: *"YOU REMEMBER EVERYTHING. AND YOU STILL CHOOSE TO END IT."* If low LOOP (spent it all): *"YOU GAVE UP YOUR MEMORY TO SAVE THEM. THAT IS... NEW."*

How you manage Ren's LOOP IS the story.

---

## SYNC (System Alignment)

A percentage (0-100%) measuring how well a unit's data aligns with the SRPG system. High SYNC = stable, reliable, strong base combat. Low SYNC = unstable data, unpredictable behavior, but the instability can manifest as powerful anomalies.

SYNC is NOT about genre — it's about how "clean" a unit's data is. Corrupted data (low SYNC) causes glitches that can be advantageous or dangerous.

### SYNC Effects Table

| SYNC | SRPG Combat | Instability Effects | State |
|------|------------|-------------------|-------|
| 0-30% | -20% hit/avoid/damage | **Volatile**: Stats fluctuate ±1-3 randomly each turn. Terrain interactions may glitch (ignore terrain cost OR take terrain damage from safe tiles). Attacks occasionally deal 0 damage or 2x damage — unpredictable. | "My data is falling apart." |
| 31-50% | -10% hit/avoid/damage | **Unstable**: Stats fluctuate ±1 each turn. Occasional immunity to one enemy attack per chapter (the attack "fails to register"). | "Something's wrong with me but I can use it." |
| 51-70% | Normal — no penalty, no bonus | **Stable**: No fluctuation, no anomalies. Clean data. | "I'm functioning as intended." |
| 71-90% | +5% hit/avoid | **Hardened**: Immune to System glitch effects (terrain corruption, stat scramble). +2 DEF/RES vs corrupted enemies. | "The System can't touch me." |
| 91-100% | +10% hit/avoid | **Anchored**: Immune to ALL System interference. Adjacent allies gain +5 avoid (stability aura). Cannot be targeted by System-spawned corruption events. | "I am exactly what this game needs." |

### SYNC Change Events

| Event | SYNC Change | Notes |
|-------|------------|-------|
| Level up | +3 | Natural stabilization |
| Complete a chapter | +5 | Surviving reinforces your data |
| Take damage from a corrupted enemy | -3 | Corruption spreads through combat |
| Stand on a glitched tile | -2 | Proximity to instability |
| Ally dies (permadeath) | -10 ALL | Trauma destabilizes everyone's data |
| Kael dies (Ch3) | -10 ALL additional | The most stable unit is gone. Everyone's anchor removed. |
| Heal at a fort/throne | +2 | Safe zones stabilize data |
| Use a LOOP action | -2 | Accessing past cycle data introduces instability |

### SYNC Per Character

| Character | Start | Natural Drift | Notes |
|-----------|-------|--------------|-------|
| **Kael** | 100% | Fixed. Always 100%. | The most stable unit. His death is a SYNC earthquake for the whole party. |
| **Ren** | 75% | Slow rise → 80-85% | 347 cycles of memory have slightly corrupted his data. Not dangerously low, but never perfectly clean. |
| **Senna** | 85% | Rises → 90%+ | Analytical mind keeps her data organized. Naturally trends toward Hardened. |
| **Bram** | 40% | Slow rise → 50-60% | His data was initialized wrong. The instability makes him unpredictable — sometimes amazing, sometimes terrible. |
| **Lira** | 35% | Very slow rise → 40-50% | Similar to Bram — corrupted initialization. Her stat fluctuations are smaller but she's vulnerable to System interference. |
| **Voss** | 55% | Stable around 55-65% | Defection scrambled his data. Mid-range — neither fully stable nor dangerously volatile. |

### SYNC Narrative Triggers

**Any character at 20%- SYNC**:
- Visual glitch on their sprite — flickering, color shifts
- Other characters notice: "Are you okay? You're... flickering."
- Stat block display occasionally shows garbled numbers for 1 frame

**Any character at 90%+ SYNC**:
- Sprite is crisp, solid, no visual artifacts
- "I feel... clear. Like I know exactly who I am."

**Party average SYNC drops below 50% (likely after Ch3)**:
- The map itself starts destabilizing more aggressively — the party's collective instability is feeding the corruption

---

## Character Passive Abilities

Each character has unique passives tied to their narrative role — NOT genre-based, but rooted in who they are and how they relate to the system. All characters use standard SRPG actions (Attack, Heal, Wait, Item, Seize).

### Ren — Lord

| Passive | Effect |
|---------|--------|
| **Cycle Memory** | At chapter start, Ren can reveal 3 of: all chest/village locations, all enemy starting positions, reinforcement turn numbers, boss stat block, hidden item drops. He's done this 347 times. |
| **Route Optimization** | Can move through ally-occupied tiles. +1 MOV when moving toward objective tiles (throne/village/chest). |
| **Speedrunner's Curse** | -20% EXP gain. If stationary for 3+ consecutive turns, -5 all stats until he moves. |

### Kael — Cavalier

| Passive | Effect |
|---------|--------|
| **True Strike** | Attacks can never deal less than 1 damage, even against max-DEF enemies. |
| **Stability Anchor** | While alive, all allies gain +2 SYNC per chapter. On death: all allies -10 SYNC immediately. |

### Senna — Mage

| Passive | Effect |
|---------|--------|
| **Exploit** | +25% damage against enemies whose full stats are visible (via AWR threshold or ally reveal). |
| **Data Dependency** | -15% hit rate against enemies whose stats are NOT visible. If an RNG outcome contradicts her expectations, -5 all stats for 1 turn. |

### Bram — Fighter

| Passive | Effect |
|---------|--------|
| **Reckless** | If Bram attacks an enemy and kills them, he can act again immediately (move + attack only). Chains up to 2 bonus turns. Each successive attack has -10% hit. |
| **No Patience** | Cannot use Wait. If no enemies are in attack range and no other actions available, auto-moves toward nearest enemy. |

### Lira — Cleric

| Passive | Effect |
|---------|--------|
| **Empathy Aura** | Adjacent allies gain +10 hit and +10 avoid. |
| **Devoted Healer** | Healing the same ally 3 times in one chapter grants that ally +2 to a random stat permanently (for that chapter). |

### Voss — Soldier

| Passive | Effect |
|---------|--------|
| **Defector's Resolve** | +3 ATK when fighting enemy soldiers. |
| **Faction Ghost** | Ally staff users heal Voss for 5 less HP. Cannot enter villages or forts. |
| **Residual Data** | Standing on a tile where an enemy died: +3 to that enemy's highest stat for 2 turns. |

---

## Body Targeting System (Unlocked Ch2+)

Discovered by Senna in Ch2 by reading enemy unit data structure. A universal combat upgrade — when attacking, the player can choose WHERE to hit.

| Target | Hit Mod | Damage Mod | Special Effect |
|--------|---------|-----------|----------------|
| **Body** (default) | Normal | Normal | None — standard attack |
| **Head** | -25% hit | +50% damage | If hits: target is **Dazed** — -10 hit rate for 2 turns |
| **Weapon Arm** | -15% hit | -20% damage | If hits: target's ATK halved for 1 turn |
| **Legs** | -10% hit | -30% damage | If hits: target's MOV halved (round down) for 2 turns |
| **Weak Point** | -35% hit | +100% damage | Only available if enemy stats are fully revealed (high AWR or ally ability). Near-impossible to land but devastating. |

### Body Targeting × Character Interactions

- **Senna**: Exploit passive (+25% on revealed enemies) stacks with Weak Point (+100%). Devastating if she can see enemy stats.
- **Voss**: Residual Data from death tiles halves body targeting hit penalties for 2 turns. "I know where their armor is thin."
- **Ren**: 347 cycles of experience. Permanent -5% reduction to ALL body targeting hit penalties.
- **Bram**: High STR + Reckless chains mean he can target Legs on first hit (cripple MOV) then follow up with Head on the bonus turn.

---

## Stat Interactions Summary

How all three meta-stats interact in practice:

| Situation | AWR | LOOP | SYNC |
|-----------|-----|------|------|
| Combat forecast detail | Higher AWR = more info visible | — | High SYNC = no display glitches |
| Before committing attack | Decoded AWR = peek at actual result | Déjà Vu Strike = guaranteed hit+crit | Low SYNC = stat fluctuation might help or hurt |
| During enemy phase | — | Recall previews all enemy movements | High SYNC = immune to corruption damage |
| Ally near death | — | Last Words = survive at cost of ALL LOOP | — |
| Ally actually dies | ALL units +8-12 AWR | ALL units +8 LOOP | ALL units -10 SYNC |
| Ch4 boss fight | High AWR reveals cycling weapon type | High remaining LOOP = harder boss phase | Low party SYNC = more map corruption |

---

## Example Stat Blocks

```
Ren — Lord
HP: 22  STR: 8  MAG: 2  SPD: 9  DEF: 7  RES: 3  SKL: 10  LCK: 5  MOV: 5
AWR: 95    LOOP: 347    SYNC: 75%
Actions: Attack | Item | Seize | Wait
Passive: Cycle Memory | Route Optimization | Speedrunner's Curse
```

```
Kael — Cavalier
HP: 24  STR: 9  MAG: 1  SPD: 8  DEF: 8  RES: 2  SKL: 7  LCK: 6  MOV: 7
AWR: 0     LOOP: 0      SYNC: 100%
Actions: Attack | Wait | Item
Passive: True Strike | Stability Anchor
```

```
Senna — Mage
HP: 19  STR: 2  MAG: 10 SPD: 7  DEF: 3  RES: 8  SKL: 9  LCK: 4  MOV: 5
AWR: 25    LOOP: 0      SYNC: 85%
Actions: Attack | Item | Wait
Passive: Exploit | Data Dependency
```

```
Bram — Fighter
HP: 28  STR: 12  MAG: 0  SPD: 6  DEF: 8  RES: 1  SKL: 5  LCK: 3  MOV: 5
AWR: 35    LOOP: 0      SYNC: 40%
Actions: Attack | Item
Passive: Reckless (bonus turns on kill) | No Patience (cannot Wait)
```

```
Lira — Cleric
HP: 18  STR: 1  MAG: 8  SPD: 7  DEF: 3  RES: 9  SKL: 6  LCK: 8  MOV: 5
AWR: 30    LOOP: 0      SYNC: 35%
Actions: Heal | Item | Wait
Passive: Empathy Aura | Devoted Healer
```

```
Voss — Soldier
HP: 23  STR: 8  MAG: 1  SPD: 5  DEF: 10  RES: 2  SKL: 7  LCK: 3  MOV: 5
AWR: 5→35  LOOP: 150    SYNC: 55%
Actions: Attack | Item | Wait
Passive: Defector's Resolve | Faction Ghost | Residual Data
```

---

## Open Questions

- **Stat caps**: No global or per-class caps exist yet. FE typically caps at 20-30 unpromoted, 25-40 promoted. Should we add them?
- **Weight / Attack Speed**: Weapons have a `weight` field but it's unused. Classic FE: AS = SPD - (weapon weight - STR). Add this?
- **AWR cap behavior**: Should AWR ever exceed 100? What happens if system corruption pushes it past the max?
- **LOOP negative**: Can LOOP go negative? What happens if you overspend? (Narrative potential: negative LOOP = you're borrowing memories from FUTURE cycles that will never happen)
- **SYNC floor**: Should SYNC have a minimum? Or can a character hit 0% and become completely unstable?
- **Body targeting on magic**: Do magic attacks use the same body targeting system? Or is magic inherently "formless" and always hits Body?
- **Low SYNC randomness**: How much stat fluctuation is fun vs frustrating? ±1 feels safe, ±3 might be too chaotic. Needs playtesting.
