# Stats

Defines every stat field in the game: what it means, how it's used in formulas, and design intent.

This game has two stat layers:
1. **Classic SRPG stats** — standard combat math (HP, STR, DEF, etc.)
2. **Meta stats** — unique to this game's meta-narrative (INS, EMB, ATT, LOY, CRP, STA)

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
| **Charisma** | CHA | Leadership presence. Boosts nearby allies AND draws enemy attention. | Ally aura (hit/avoid), enemy aggro priority |
| **Willpower** | WIL | Mental resistance. NOT magic defense — protects against psychological/system effects. | INS resistance, ATT trauma reduction, mental status immunity |
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
| **Charisma Aura** | Allies within floor(CHA/3) tiles: +CHA hit, +CHA avoid | Shigeru(9)=3tiles, Akira(7)=2, Gareth(6)=2, Mirelle(5)=1, Lisette(3)=1, Halvar(2)=0 |
| **Aggro Weight** | 10 + CHA×2 + (maxHP - currentHP)/2 | Wounded high-CHA units draw the most fire |
| **WIL Check** | effect% = base% - WIL×5% (min 0%) | Mental effects: INS forced gain, Panic, Despair, Déjà Vu freeze |

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

### Growth Rates Per Class (All 16 Base Classes)

| Class | HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL |
|-------|----|----|-----|-----|-----|-----|-----|-----|-----|-----|
| Lord | 80 | 45 | 10 | 30 | 20 | 50 | 45 | 60 | 40 | 35 |
| Cavalier | 75 | 40 | 5 | 35 | 15 | 35 | 30 | 40 | 35 | 45 |
| Mage | 55 | 5 | 55 | 15 | 40 | 30 | 45 | 30 | 15 | 40 |
| Fighter | 90 | 55 | 0 | 35 | 5 | 25 | 20 | 25 | 30 | 35 |
| Cleric | 50 | 5 | 45 | 10 | 45 | 30 | 25 | 50 | 25 | 15 |
| Soldier | 70 | 35 | 5 | 45 | 10 | 20 | 35 | 20 | 10 | 30 |
| Archer | 65 | 40 | 5 | 20 | 15 | 40 | 50 | 35 | 10 | 25 |
| Thief | 55 | 30 | 5 | 15 | 20 | 55 | 45 | 40 | 15 | 30 |
| Pegasus Knight | 60 | 30 | 15 | 20 | 35 | 50 | 40 | 45 | 20 | 25 |
| Wyvern Rider | 80 | 45 | 0 | 40 | 5 | 25 | 25 | 25 | 30 | 40 |
| Troubadour | 50 | 5 | 40 | 10 | 40 | 35 | 30 | 45 | 30 | 20 |
| Mercenary | 70 | 40 | 5 | 25 | 15 | 45 | 45 | 30 | 20 | 30 |
| Shaman | 55 | 5 | 50 | 15 | 30 | 25 | 40 | 20 | 10 | 50 |
| Monk | 55 | 10 | 45 | 15 | 40 | 30 | 35 | 40 | 25 | 35 |
| Dancer | 45 | 5 | 10 | 10 | 20 | 55 | 30 | 50 | 45 | 20 |
| Armor Knight | 85 | 40 | 0 | 55 | 5 | 10 | 25 | 20 | 15 | 45 |

See [classes-expanded.md](classes-expanded.md) for promoted/master class stat bonuses and full class details.

### Stat Caps by Promotion Tier

| Stat | Base (Unpromoted) | Promoted | Master |
|------|-------------------|----------|--------|
| HP | 60 | 80 | 99 |
| STR/MAG/DEF/RES/SPD/SKL | 20 | 30 | 35 (key stat 40) |
| LCK | 30 | 40 | 45 |
| CHA | 15 | 20 | 25 |
| WIL | 15 | 20 | 25 |
| MOV | Class-locked | +1 on promotion (foot only) | +1 on master promotion |

See [promotion.md](promotion.md) for promotion mechanics and stat bonus details.

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
- **CHA is a double-edged sword**: Buffs nearby allies but makes you a priority target. High CHA units are natural tanks/bait — place them where you WANT the enemy to attack. Low CHA units are ignored by enemies, good for flanking.
- **WIL is mental armor**: Separate from RES — RES blocks magic damage, WIL blocks psychological/system effects (INS forced changes, ATT trauma, mental statuses like Panic/Despair). High WIL characters resist the meta-narrative breaking them.
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

## Time of Day (Map Property)

Each map has a time-of-day setting. Some maps may shift time mid-chapter (e.g., dawn → day after turn 10). Each unit has an Activity type (Morning/Night/Irregular) that interacts with the current time.

### Time Periods

| Time | Turns | Visual | Notes |
|------|-------|--------|-------|
| **Dawn (早朝)** | Typically turns 1-5 | Dim orange light, long shadows | Transition period |
| **Day (昼)** | Typically turns 6-15 | Full brightness | Standard |
| **Dusk (夕方)** | Typically turns 16-20 | Red/purple sky, visibility drops | Transition period |
| **Night (夜)** | Typically turns 21+ | Dark, limited visibility (fog of war?) | Reduced vision range |

### Activity Type Effects

| Activity | Dawn | Day | Dusk | Night |
|----------|------|-----|------|-------|
| **Morning (朝型)** | +2 hit, +2 avoid, +1 STR | +1 hit, +1 avoid | No bonus | -2 hit, -2 avoid, -1 SPD |
| **Night (夜型)** | -1 hit, -1 avoid | No bonus | +1 hit, +1 avoid | +2 hit, +2 avoid, +1 SKL |
| **Irregular (不規則)** | No bonus | No bonus | No bonus | No bonus |

### Activity Type Per Character (Full Roster)

| Character | Activity | Peak | Penalty | Notes |
|-----------|----------|------|---------|-------|
| **Shigeru** | Irregular | None | None | four centuries destroyed his body clock. |
| **Akira** | Morning | Dawn/Day | Night | Soldier's discipline. Early riser. |
| **Lisette** | Night | Night | Dawn | Researcher hours. |
| **Gareth** | Irregular | None | None | Runs on adrenaline. |
| **Mirelle** | Morning | Dawn/Day | Night | Cheerful early bird. |
| **Halvar** | Morning | Dawn/Day | Night | Military habit from 300 cycles. |
| **Bryn** | Morning | Dawn/Day | Night | Village hunter. Best at dawn. |
| **Fenn** | Night | Night | Dawn | Thief's hours. Works best in darkness. |
| **Elin** | Morning | Dawn/Day | Night | Pegasus knight. Flies at first light. |
| **Corwin** | Irregular | None | None | Mercenary. Fights whenever paid. |
| **Nadine** | Morning | Dawn/Day | Night | Noble schedule. Proper hours. |
| **Viviane** | Night | Night | Dawn | Dancer. Performs under moonlight. |
| **Kira** | Night | Night | Dawn | Dark mage. Studies the void at night. |
| **Zael** | Morning | Dawn/Day | Night | Wyvern rider. Catches thermals at dawn. |
| **Elara** | Morning | Dawn/Day | Night | Monastic prayers begin at dawn. |
| **Ghael** | Irregular | None | None | Former boss. No routine — he was AI. |
| **Echo** | Irregular | None | None | System construct. Doesn't sleep. |

### Time × Tactical Implications

- **Night maps favor Lisette** — she gets +2 hit/+2 avoid/+1 SKL while Akira, Mirelle, and Halvar are weakened.
- **Dawn maps favor the majority** — 3 Morning units (Akira/Mirelle/Halvar) all peak simultaneously.
- **Shigeru and Gareth are time-proof** — Irregular means no bonus but no weakness. Reliable anchors regardless of time.
- **Ch8 (Akira's death chapter)**: If set at night, Akira is weakened when he dies — adding tactical cruelty. If set at dawn, he's at peak strength when killed — adding narrative tragedy.

---

# Meta Stats

These stats are unique to "The Last Save File." They exist because the characters are inside a game — and some of them know it.

---

## INS (Insight)

How much a unit perceives the system layer. NOT a linear "higher = better" stat. Each threshold unlocks new abilities AND new vulnerabilities.

### INS Thresholds

| INS | Tier | Benefits | Costs |
|-----|------|----------|-------|
| 0-10 | **Blind** | **Instinct Guard**: +10% passive avoid. Immune to System glitches (corruption damage, terrain flicker). | No enemy stat preview. No combat forecast details. Can't see AI types. |
| 11-30 | **Flickering** | See own stats as numbers. See enemy weapon type + approximate HP (full/half/low). | **Déjà Vu**: 5% chance per turn to freeze for 1 action (memory fragment intrusion). |
| 31-60 | **Reading** | **System Sight**: Full combat forecast. See enemy stats, movement range on hover, AI type label (aggressive/guard/boss). | **Corruption Magnet**: +3 damage from glitched tiles. +20% damage from corrupted enemies. System targets high-INS units first for spawns. |
| 61-90 | **Decoded** | **Foresight**: Before committing to an attack, see the ACTUAL outcome (hit/miss/crit) — not just the %. Can cancel the attack after peeking. 1 use per chapter. | **System Threat**: +1 extra enemy spawns near this unit's position each chapter. Unit is flagged for deletion. |
| 91-100 | **Awake** | **Break the Script**: Once per chapter, rewrite ONE combat result after it resolves. Change a miss to a hit, a hit to a miss, negate a crit. Edit reality. | **Existential Fragility**: -15% damage dealt unless an ally has died this chapter. Knowing everything is a game makes it hard to care — until it costs something real. |

### INS Growth (NOT from Level-Up)

INS changes through story events and choices, not combat EXP.

| Event | INS Change | Notes |
|-------|-----------|-------|
| Witness a glitch (terrain flicker, wrong weapon spawn) | +3 to +5 | Whoever was adjacent |
| Told about the loops by Shigeru | +10 to +15 | Listener may resist (willpower reduces gain) |
| Defeat an aware boss | +5 | Kill credit unit only |
| Ally dies (permadeath) | +8 to +12 | ALL surviving units — trauma cracks the veil |
| Defect from enemy side | +20 to +30 | Breaking AI code exposes system layer |
| Successfully use Lisette's Seed Read | +2 | Lisette only |
| Dialogue choice: "choose not to know" | -5 to -10 | Player can deliberately keep a unit ignorant — sometimes tactically correct |

### INS Per Character (25-Chapter Pacing)

INS spreads much more gradually across 25 chapters. Only Shigeru and Lisette reach high tiers early. Most units don't cross into "Decoded" until Arc 4.

| Character | Arc 1 (Ch1-5) | Arc 2 (Ch6-10) | Arc 3 (Ch11-15) | Arc 4 (Ch16-20) | Arc 5 (Ch21-25) | Notes |
|-----------|--------------|----------------|-----------------|-----------------|-----------------|-------|
| **Shigeru** | 95→96 | 96→97 | 97→98 | 98→99 | 99→100 | Near-max. Barely grows — he already knows everything. |
| **Lisette** | 25→40 | 40→55 | 55→70 | 70→82 | 82→90 | Rapid analytical growth. Crosses "Reading" Arc 1, "Decoded" Arc 3. |
| **Akira** | 0→5 | 5→18 (dies Ch8) | — | — | — | Stays Blind unless told. Dies before significant growth. |
| **Gareth** | 35→38 | 38→42 | 42→50 | 50→58 | 58→65 | Slow growth — resists understanding. Stays in "Reading" until late. |
| **Mirelle** | 30→33 | 33→48 (+12 Akira) | 48→55 | 55→65 | 65→72 | Spikes on Akira's death. Gradual emotional growth. |
| **Halvar** | 5→35 | 35→45 | 45→55 | 55→65 | 65→75 | Jumps massively on defection. Steady after. |
| **Bryn** | 0→3 | 3→8 | 8→20 | 20→35 | 35→50 | Village girl. Slow natural growth. Crosses "Flickering" mid-game. |
| **Fenn** | 10→15 | 15→25 | 25→40 | 40→55 | 55→68 | Street smart — picks up anomalies. |
| **Elin** | 0→2 | 2→10 | 10→25 | 25→40 | 40→55 | Idealist. Resists awareness at first. |
| **Corwin** | — | 5→15 | 15→30 | 30→45 | 45→55 | Practical mercenary. Accepts what he sees. |
| **Nadine** | — | 0→10 | 10→25 | 25→40 | 40→50 | Sheltered noble. Slow awakening. |
| **Viviane** | — | — (joins Ch9) 0→5 | 5→20 | 20→40 | 40→60 | Dances between awareness and denial. |
| **Kira** | — | — | 60→65 | 65→75 | 75→85 | Joins at high INS — former dark mage saw things. |
| **Zael** | — | — | 15→25 (conditional) | 25→45 | 45→60 | Wyvern rider. Joins corrupted. |
| **Elara** | — | — | 40→50 | 50→65 | 65→80 | Monk. Spiritual awareness parallels meta-awareness. |
| **Ghael** | — | — | — | 0→5 | 5→15 | Former boss. Stubbornly unaware. Refuses to see. |
| **Echo** | — | — | — | 70→80 | 80→95 | System-created. Born aware. |

### INS Player Choice

At certain dialogue points, the player can raise or lower a character's INS. These appear 2-3 times per arc:

- "Tell [unit] the truth about the loops" → +15 INS (gains forecast info, loses Instinct Guard)
- "Let [unit] believe this is real" → stays low INS (keeps +10% avoid, no forecast)
- "Share Lisette's research data" → target +10 INS, Lisette +2 INS
- "Destroy the evidence" → target -5 INS

Real tactical dilemma: more information vs better instinctive performance.

### INS Player Choice

At certain dialogue points, the player can raise or lower a character's INS:

- "Tell Akira the truth about the loops" → Akira +15 INS (gains forecast info, loses Instinct Guard)
- "Let Akira believe this is real" → Akira stays low INS (keeps +10% avoid, no forecast)

Real tactical dilemma: more information vs better instinctive performance.

---

## EMB (Cycle Memory)

How many past cycles a unit retains. EMB is a **spendable resource** — accumulated memories can be burned for powerful one-time effects, but spent memories are gone permanently. You're trading your past for your present.

### EMB Actions

| Action | Cost | Effect | Narrative |
|--------|------|--------|-----------|
| **Recall** | 10 EMB | Preview enemy phase — see where ALL enemies will move and who they'll attack. Full map overlay showing projected enemy positions + targets. Lasts until end of enemy phase. | "I've seen this turn before. They'll flank left." |
| **Déjà Vu Strike** | 15 EMB | Next attack is guaranteed hit + guaranteed crit. Muscle memory from hundreds of identical kills. | "I know exactly where your guard drops." |
| **Ghost Step** | 20 EMB | Move through occupied tiles (enemy or ally) this turn. Phase through units. Your body remembers a cycle where those tiles were empty. | "In cycle #203, this tile was open. My body still thinks it is." |
| **Echo** | 30 EMB | Summon a "ghost" of yourself from a past cycle at an adjacent tile. Ghost has 50% of your stats, lasts 2 turns, acts independently. Cannot use EMB abilities. Cannot be healed. Fades at end. | "One more time. Like cycle #112." |
| **Last Words** | ALL remaining EMB | When a unit hits 0 HP: spend ALL remaining EMB to survive at 1 HP. One-time revival. The memory of surviving keeps you alive — but every memory is gone forever. | "Not yet. I remember a time where I survived this. One more time." |

### EMB Gain

| Event | EMB Gain | Notes |
|-------|----------|-------|
| Level up | +3 to +5 | Small. Living through combat creates micro-memories. |
| Kill a boss | +10 | Major combat memory. |
| Survive at ≤20% HP | +5 | Trauma burns in. |
| Witness ally death | +8 | You'll never forget this. |
| System glitch exposure | +2 | Breaking world leaks past-cycle data. |

EMB does NOT regenerate between chapters normally. However, between **arcs** (every 5 chapters), units recover **+10 EMB** from rest and reflection. This prevents total EMB bankruptcy over 25 chapters while keeping spending meaningful.

### EMB Per Character (25-Chapter Pacing)

| Character | Starting | Expected by Arc 5 | Max | Notes |
|-----------|---------|-------------------|-----|-------|
| **Shigeru** | 347 | 250-350 (depends on spending) | ~420 | Enormous reservoir. Must conserve — Ch25 boss scaling reads remaining EMB. |
| **Lisette** | 0 | 60-80 | ~100 | Gains EMB through analysis. Reverse-engineers past-cycle data. |
| **Akira** | 0 | — (dies Ch8) | ~25 | Gains modest EMB through combat. Lost when he dies — unless ???_CORRUPTED has it. |
| **Gareth** | 0 | 40-60 | ~80 | Muscle memory gains. "I've never fought this guy but my HANDS remember." |
| **Mirelle** | 0 | 45-65 | ~85 | Emotional pattern memory. "I knew you'd do that because I KNOW you." |
| **Halvar** | 150 | 160-200 | ~220 | 300 cycles of standing still. Gains slowly from new experiences. |
| **Bryn** | 0 | 20-35 | ~50 | Low EMB potential. Archer instincts, not memories. |
| **Fenn** | 0 | 30-50 | ~65 | Thief's gut feelings. "I've robbed this type of building before." |
| **Corwin** | 0 | 25-45 | ~60 | Mercenary déjà vu. "This formation... I've broken it." |
| **Nadine** | 0 | 20-35 | ~50 | Noble's intuition. Low combat memories. |
| **Viviane** | 0 | 30-50 | ~65 | Dance memories. Each performance echoes past cycles. |
| **Kira** | 20 | 50-70 | ~90 | Dark magic studies revealed fragments. Starts with some. |
| **Zael** | 0 | 15-30 | ~45 | Wyvern rider. Few intellectual memories. |
| **Elara** | 10 | 40-60 | ~80 | Monastic meditation revealed echoes. |
| **Ghael** | 0 | 10-20 | ~30 | Former boss. Refuses to acknowledge past cycles. |
| **Echo** | 100 | 100-130 | ~150 | System-created with cycle data loaded. Second-highest starting EMB. |

### Shigeru's EMB — The Big Decisions

Shigeru starts with 347 EMB. He could burn 15 every fight for guaranteed crits and steamroll the game. BUT:

- **Ch4 boss scaling**: ???_CORRUPTED reads your EMB data. Higher remaining EMB = harder boss phase (it weaponizes your memories against you).
- **Last Words sacrifice**: If Shigeru uses Last Words, he survives at 1 HP but loses ALL 347 memories. The exhausted speedrunner becomes... nobody. A person without a past. Is that worth it?
- **Two final dialogues**: If Shigeru reaches the finale with high EMB: *"YOU REMEMBER EVERYTHING. AND YOU STILL CHOOSE TO END IT."* If low EMB (spent it all): *"YOU GAVE UP YOUR MEMORY TO SAVE THEM. THAT IS... NEW."*

How you manage Shigeru's EMB IS the story.

---

## ATT (System Alignment)

A percentage (0-100%) measuring how well a unit's data aligns with the SRPG system. High ATT = stable, reliable, strong base combat. Low ATT = unstable data, unpredictable behavior, but the instability can manifest as powerful anomalies.

ATT is NOT about genre — it's about how "clean" a unit's data is. Corrupted data (low ATT) causes glitches that can be advantageous or dangerous.

### ATT Effects Table

| ATT | SRPG Combat | Instability Effects | State |
|------|------------|-------------------|-------|
| 0-30% | -20% hit/avoid/damage | **Volatile**: Stats fluctuate ±1-3 randomly each turn. Terrain interactions may glitch (ignore terrain cost OR take terrain damage from safe tiles). Attacks occasionally deal 0 damage or 2x damage — unpredictable. | "My data is falling apart." |
| 31-50% | -10% hit/avoid/damage | **Unstable**: Stats fluctuate ±1 each turn. Occasional immunity to one enemy attack per chapter (the attack "fails to register"). | "Something's wrong with me but I can use it." |
| 51-70% | Normal — no penalty, no bonus | **Stable**: No fluctuation, no anomalies. Clean data. | "I'm functioning as intended." |
| 71-90% | +5% hit/avoid | **Hardened**: Immune to System glitch effects (terrain corruption, stat scramble). +2 DEF/RES vs corrupted enemies. | "The Blackflame can't touch me." |
| 91-100% | +10% hit/avoid | **Anchored**: Immune to ALL System interference. Adjacent allies gain +5 avoid (stability aura). Cannot be targeted by System-spawned corruption events. | "I am exactly what this game needs." |

### ATT Change Events

| Event | ATT Change | Notes |
|-------|------------|-------|
| Level up | +3 | Natural stabilization |
| Complete a chapter | +5 | Surviving reinforces your data |
| Take damage from a corrupted enemy | -3 | Corruption spreads through combat |
| Stand on a glitched tile | -2 | Proximity to instability |
| Ally dies (permadeath) | -10 ALL | Trauma destabilizes everyone's data |
| Akira dies (Ch8) | -10 ALL additional | The most stable unit is gone. Everyone's anchor removed. |
| Heal at a fort/throne | +2 | Safe zones stabilize data |
| Use a EMB action | -2 | Accessing past cycle data introduces instability |

### ATT Per Character (Full Roster)

| Character | Start | Arc 5 Range | Notes |
|-----------|-------|------------|-------|
| **Akira** | 100% | — (dies Ch8) | The most stable unit. His death is a ATT earthquake for the whole party. |
| **Shigeru** | 75% | 80-90% | four centuries slightly corrupted his data. Slow recovery over 25 chapters. |
| **Lisette** | 85% | 90-100% | Analytical mind keeps data organized. Trends toward Anchored. |
| **Gareth** | 40% | 55-70% | Corrupted initialization. Instability is part of his identity. |
| **Mirelle** | 35% | 50-65% | Similar to Gareth. Healing magic slowly stabilizes her data. |
| **Halvar** | 55% | 65-80% | Defection scrambled his data. Gradually stabilizes through loyalty. |
| **Bryn** | 80% | 85-95% | Clean village data. Naturally stable, rarely corrupted. |
| **Fenn** | 50% | 55-70% | Street data is messy. Unstable but functional. |
| **Elin** | 90% | 85-95% | Pegasus knight — aerial data is clean. May drop from idealism crises. |
| **Corwin** | 60% | 65-75% | Mercenary — practical stability. No highs, no lows. |
| **Nadine** | 75% | 70-85% | Noble data is well-structured. Drops if she witnesses corruption. |
| **Viviane** | 45% | 50-65% | Dancer data is inherently fluid. Not corrupted, just... flexible. |
| **Kira** | 30% | 40-55% | Dark magic has degraded her data significantly. High CRP risk. |
| **Zael** | 35% | 45-60% | Partially corrupted from Ch13 recruitment. Can be cleansed. |
| **Elara** | 70% | 75-90% | Monastic discipline = clean data. Light magic naturally purifies. |
| **Ghael** | 65% | 60-75% | Former boss — his data was restructured by the Blackflame. Stable but artificial. |
| **Echo** | 50% | 50-70% | System-created. Data is technically perfect but... wrong. The Blackflame's code isn't the same as natural data. |

### ATT Narrative Triggers

**Any character at 20%- ATT**:
- Visual glitch on their sprite — flickering, color shifts
- Other characters notice: "Are you okay? You're... flickering."
- Stat block display occasionally shows garbled numbers for 1 frame

**Any character at 90%+ ATT**:
- Sprite is crisp, solid, no visual artifacts
- "I feel... clear. Like I know exactly who I am."

**Party average ATT drops below 50% (likely after Ch3)**:
- The map itself starts destabilizing more aggressively — the party's collective instability is feeding the corruption

---

## LOY (Loyalty / 忠誠度)

How committed a unit is to the party and its cause. NOT a simple "good/bad" meter — it measures trust, willingness to follow orders, and willingness to sacrifice. Low LOY units may disobey, hesitate, or act independently.

### LOY Effects Table

| LOY | Effect | Behavior |
|-----|--------|----------|
| 0-20 | **Defiant** | 15% chance per turn to ignore player command and act independently (attack nearest, retreat, or skip turn). Cannot be paired for Rescue. May refuse healing. |
| 21-40 | **Reluctant** | 5% chance to ignore commands. -10% hit when attacking enemies the player didn't highlight. Will not use items on allies. |
| 41-60 | **Neutral** | No penalties, no bonuses. Follows orders. |
| 61-80 | **Devoted** | +5% hit/avoid when within 3 tiles of party leader (Shigeru). Will automatically shield adjacent allies from lethal blows (take the hit instead, once per chapter). |
| 81-100 | **Sworn** | +10% hit/avoid near leader. Auto-shield with no limit. If Shigeru drops below 30% HP, Sworn units gain +5 all combat stats until Shigeru is healed. "I won't let it end like this." |

### LOY Change Events

| Event | LOY Change | Notes |
|-------|-----------|-------|
| Shigeru protects this unit (takes a hit or heals) | +5 | Leadership through action |
| Unit is left at low HP without healing for 2+ turns | -5 | "You left me to die." |
| Unit sees Shigeru use EMB abilities | -3 | Distrust — "What else are you hiding?" (only if unit INS < 30) |
| Shigeru reveals truth about loops voluntarily | +8 or -8 | Depends on WIL — high WIL respects honesty, low WIL panics |
| Unit kills a boss alongside Shigeru | +5 | Shared victory builds trust |
| Ally dies | -3 to -8 | "You could have prevented this." Worse if Shigeru had high EMB (they wonder if he could have used it) |
| Player chooses dialogue that validates this unit | +3 | Feeling heard |
| Unit is ordered to attack an enemy that will clearly kill them | -10 | Suicide orders destroy trust |

### LOY Per Character (Full Roster)

| Character | Start | Arc 5 Range | Notes |
|-----------|-------|------------|-------|
| **Akira** | 90 | — (dies Ch8) | Trusts Shigeru unconditionally. His death's LOY cascade hits everyone hard. |
| **Lisette** | 40 | 60-80 | Doesn't trust — she verifies. LOY grows as Shigeru's knowledge proves accurate. |
| **Gareth** | 55 | 50-80 (volatile) | Loyal when fights are fun, drops fast when bored. |
| **Mirelle** | 70 | 70-90 | Emotionally loyal. Drops hard on betrayal, forgives fast. |
| **Halvar** | 25 | 50-70 | Former enemy. Low start is the cost of defection. Slow build. |
| **Bryn** | 60 | 65-85 | Village loyalty. Grateful for rescue. Steady growth. |
| **Fenn** | 30 | 40-65 | Trusts no one initially. Pragmatic — follows results. |
| **Elin** | 70 | 60-85 | Idealistic loyalty. Can drop sharply if disillusioned. |
| **Corwin** | 35 | 45-70 | Mercenary — loyalty is earned, not given. Respects competence. |
| **Nadine** | 55 | 60-80 | Noble sense of duty. Loyal to the cause more than to Shigeru specifically. |
| **Viviane** | 50 | 55-75 | Follows the best performance — wherever the drama is. |
| **Kira** | 20 | 35-60 | Dark mage defector. Deeply distrustful. Slow to warm. |
| **Zael** | 15 (if recruited) | 30-55 | Conditional recruit. Starts hostile. Needs reason to stay. |
| **Elara** | 65 | 70-90 | Monastic compassion. Believes in everyone. High floor. |
| **Ghael** | 10 | 25-50 | Former boss. Joining doesn't mean trusting. Years of resentment. |
| **Echo** | 50 | 50-80 | System-created. Learning what loyalty even means. Can spike dramatically. |

### LOY Auto-Shield Mechanics

When a Devoted/Sworn unit is adjacent to an ally who would take a lethal blow:
- The shielding unit **takes the full damage instead** of the target.
- If the shield unit would die from this, they die (permadeath). This triggers ally death LOY/INS/ATT cascades.
- The shielded unit takes 0 damage.
- Does NOT consume the shielding unit's action — it's a passive reaction.
- Devoted (61-80): triggers once per chapter. Sworn (81-100): no limit.
- The shielding unit must be adjacent (1 tile) and must have more HP than the incoming damage to survive.

### LOY Narrative Triggers

- **Halvar at 15- LOY**: Re-defection risk. If LOY hits 0, Halvar leaves the party permanently. "I didn't leave one army to be mistreated in another."
- **Any unit at 90+ LOY**: Unlocks a unique dialogue with Shigeru where they acknowledge the loops. Even low-INS units sense something: "I don't know what you've been through. But I'll follow you."

---

## CRP (Corruption / 汚染度)

How much System corruption has infected a unit's data. Different from ATT — ATT is structural stability, CRP is active malicious data spreading through the unit. Think of ATT as "how intact your bones are" and CRP as "how much poison is in your blood."

CRP starts at 0 for all player units and only goes UP. It cannot be reduced to 0 once above 0 — corruption leaves permanent traces.

### CRP Thresholds

| CRP | State | Effects |
|-----|-------|---------|
| 0 | **Clean** | No corruption. Normal operation. |
| 1-15 | **Traces** | Cosmetic only — occasional sprite flicker. No gameplay effect. A warning. |
| 16-30 | **Infected** | -1 to a random stat each turn (rerolled each turn). Corrupted tiles no longer damage this unit (the corruption recognizes its own). |
| 31-50 | **Spreading** | -2 to random stat each turn. This unit's attacks have a 10% chance to apply +3 CRP to the TARGET (corruption spreads through combat). Adjacent allies gain +1 CRP per turn from proximity. |
| 51-75 | **Consumed** | -3 to random stat each turn. All attacks deal bonus corruption damage (+20% damage to units with CRP > 0). Sprite visibly glitched — color bleeding, frame skipping. Can hear the Blackflame whispering. |
| 76-100 | **Overwritten** | Unit is no longer fully under player control. 30% chance each turn to act as an enemy (attacks nearest unit, ally or enemy). If CRP reaches 100: unit is **permanently converted** to an enemy unit. Gone. Worse than death — they fight against you. |

### CRP Gain Events

| Event | CRP Gain | Notes |
|-------|---------|-------|
| Stand on a glitched/corrupted tile | +2 per turn | Proximity |
| Take damage from a corrupted enemy | +3 | Corruption spreads through wounds |
| Take damage from ???_CORRUPTED (Ch24-25 boss) | +5 | Direct System injection |
| Use EMB abilities | +1 | Accessing past data opens channels for corruption |
| Ally converted (CRP 100) | +5 ALL | Witnessing a friend become an enemy |
| Kill a corrupted ally | +8 | The trauma of putting down your own |

### CRP Reduction (Partial Only)

| Event | CRP Reduction | Notes |
|-------|-------------|-------|
| Heal at fort/throne for full turn | -2 | Safe zones cleanse slowly |
| Mirelle's Heal (staff) on a corrupted ally | -1 per heal | Mirelle's empathy is the closest thing to an antivirus |
| Elara's Light magic heal | -2 per heal | Light magic has purifying properties |
| Chapter end | -3 | Rest between chapters cleanses some |
| Arc transition (every 5 chapters) | -5 bonus | Extended rest between arcs allows deeper cleansing |
| Purifying Herb (item) | -5 | See [items.md](items.md) |
| Cleansing Broth (item) | -10 | See [items.md](items.md) |
| Sacred Water (item) | -15 | See [items.md](items.md) |
| Ward Stone (key item, Ch12-15) | Prevents CRP gain for 1 unit/chapter | 3 uses total |
| Ancient Tome ritual (Ch14 event) | -5 ALL units | One-time story event |
| **Passive decay**: If CRP stays below 15 for 3+ chapters | -1 per chapter | Body naturally fights off trace corruption |
| **Cannot go below**: max(0, highest_CRP_ever - 25) | — | Corruption leaves scars. A unit that hit 50 CRP can never go below 25. (Loosened from -20 to -25 for 25-chapter sustainability) |

### CRP × ATT Compound Rule

When a unit has both high CRP (16+) and low ATT (50%-), the stat penalties DO stack — this is intentional. However, a safety cap applies:
- **Total stat reduction from CRP + ATT combined cannot exceed -5 to any single stat per turn.**
- This prevents a unit from becoming completely unusable but keeps the pressure real.
- High ATT (71%+) grants CRP resistance: CRP gain events are halved (rounded down).

### CRP Per Character (Full Roster)

| Character | Start | Vulnerability | Notes |
|-----------|-------|--------------|-------|
| **Shigeru** | 0 | Medium | four centuries of clean data, but EMB usage opens corruption channels. |
| **Akira** | 0 | Very Low | 100% ATT = natural corruption resistance. Almost impossible to corrupt. |
| **Lisette** | 0 | High | High INS = she can SEE corruption, which means it can see HER. |
| **Gareth** | 0 | High | Low ATT = poor data integrity. Corruption finds easy entry points. |
| **Mirelle** | 0 | Medium | Low ATT but healing abilities give partial immunity. |
| **Halvar** | 5 | Medium | Trace corruption from defection. |
| **Bryn** | 0 | Low | Clean village data. High ATT protects her. |
| **Fenn** | 0 | Medium | Mid ATT. Street-level corruption exposure. |
| **Elin** | 0 | Low | High ATT. Aerial units have natural resistance. |
| **Corwin** | 0 | Medium | Practical resistance. Not immune, not vulnerable. |
| **Nadine** | 0 | Low | Well-structured noble data. |
| **Viviane** | 0 | Medium | Fluid data is hard to corrupt but also hard to cleanse. |
| **Kira** | 15 | Very High | Joins with corruption from dark magic studies. Highest risk unit. |
| **Zael** | 20 | Very High | Joins partially corrupted. Cleansing is a mini-quest. |
| **Elara** | 0 | Very Low | Light magic = natural anti-corruption. Can cleanse self. |
| **Ghael** | 10 | High | Former boss — System touched his data. Residual corruption. |
| **Echo** | 0 | Special | System-created. Technically immune (corruption IS the Blackflame). But if Echo turns against the Blackflame, vulnerability becomes Very High. |

---

## STA (Stamina / スタミナ)

Physical exhaustion accumulated from movement and actions. STA starts at 0 each chapter and **increases** as the unit acts — higher STA = more tired = worse physical performance. Resets to 0 at chapter start.

STA primarily degrades body-related stats: STR, SPD, DEF, SKL. Mental/magical stats (MAG, RES, WIL) are unaffected — exhaustion is physical.

### STA Accumulation

| Action | STA Gain | Notes |
|--------|---------|-------|
| Move (per tile) | +1 | Walking is tiring. Cavalry (high MOV) accumulate faster per turn. |
| Attack | +3 | Swinging a weapon. |
| Double attack | +5 | Two swings = more exhaustion. |
| Take damage | +2 | Being hit wears you down. |
| Use item | +1 | Minor effort. |
| Heal (staff) | +2 | Channeling healing is physical work. |
| Wait (no action) | +0 | Resting costs nothing. |
| Carry/Rescue an ally | +3 per turn | Hauling someone is exhausting. |
| EMB action | +2 | Accessing cycle memory strains the body. |

### STA Thresholds

| STA | State | Physical Penalties |
|-----|-------|-------------------|
| 0-15 | **Fresh** | No penalties. Full performance. |
| 16-25 | **Winded** | -1 STR, -1 SPD. Sprite shows heavy breathing animation. |
| 26-35 | **Fatigued** | -2 STR, -2 SPD, -1 DEF, -1 SKL. Movement costs +1 STA per tile. |
| 36-45 | **Exhausted** | -3 STR, -3 SPD, -2 DEF, -2 SKL. Cannot double attack. MOV -1. |
| 46+ | **Collapsed** | -5 STR, -4 SPD, -3 DEF, -3 SKL. MOV halved (round down). Cannot initiate combat — can only counterattack and use items. Unit visibly staggering. |

### STA Recovery (During Chapter)

| Action | STA Reduction | Notes |
|--------|-------------|-------|
| Wait (take no action for a turn) | -5 | Active rest. The main way to recover mid-chapter. |
| Stand on Fort | -3 per turn (passive) | Automatic — triggers even without Wait. Gareth can recover here. |
| Stand on Throne | -5 per turn (passive) | Automatic — triggers even without Wait. Best rest point. |
| Mirelle's heal | -2 (bonus) | Her healing soothes physical fatigue too. |
| Use Vulnerary | -3 (bonus) | Medicine helps fatigue alongside HP. |

### STA Per Character (Full Roster)

| Character | STA Rate | Max Comfortable | Notes |
|-----------|---------|----------------|-------|
| **Shigeru** | Normal (1.0×) | ~30 | four centuries of muscle memory = efficient, but still human. |
| **Akira** | Low (0.8×) | ~38 | Cavalier endurance. Highest ceiling. |
| **Lisette** | High (1.2×) | ~22 | Physically weak. Can't march AND cast. |
| **Gareth** | Low (0.8×) | ~38 | Raw conditioning. But No Patience = always moving. |
| **Mirelle** | High (1.3×) | ~20 | Physically frail. Needs fort rotation. |
| **Halvar** | Very Low (0.7×) | ~42 | 300 cycles standing still = incredible stamina. |
| **Bryn** | Normal (1.0×) | ~30 | Village archer. Average endurance. |
| **Fenn** | Low (0.85×) | ~35 | Thief conditioning. Quick and efficient. |
| **Elin** | Normal (1.0×) | ~30 | Pegasus knight — mount does the work. |
| **Corwin** | Low (0.8×) | ~38 | Mercenary endurance. Battle-hardened. |
| **Nadine** | High (1.2×) | ~22 | Mounted healer but physically frail. |
| **Viviane** | Normal (1.0×) | ~30 | Dancer stamina is average — Dance action costs STA. |
| **Kira** | High (1.25×) | ~21 | Dark magic drains physically. Frail. |
| **Zael** | Low (0.8×) | ~38 | Wyvern rider. Mount carries the load. |
| **Elara** | Normal (1.1×) | ~27 | Monastic fitness. Slightly below average. |
| **Ghael** | Very Low (0.7×) | ~42 | Armor knight. Trained for sustained heavy combat. |
| **Echo** | None (0.5×) | ~55 | System construct. Doesn't tire like humans. Near-infinite stamina. |

### STA × Meta-Stat Interactions

| Interaction | Effect |
|-------------|--------|
| High STA + Low ATT | Physical collapse + data instability = dangerous. Unit may glitch-teleport to a random adjacent tile when Exhausted. |
| High STA + EMB | Exhausted body + cycle memory strain: EMB actions cost +1 STA per 10 EMB spent. Shigeru burning 30 EMB for Echo while Exhausted is brutal. |
| High STA + Low LOY | Exhausted + resentful: LOY drops -1 per turn while Fatigued or worse. "You're running me into the ground." |
| High STA + CRP | Exhaustion lowers corruption resistance. +1 CRP per turn while Exhausted on corrupted tiles (instead of the normal +2, total +3). |

### STA Tactical Design

STA creates a **pacing problem** the player must solve:
- **Push hard, rest later**: Rush objectives but risk units Collapsing at the worst moment.
- **Rotate units**: Swap frontline fighters with rested backline. Forces you to use your whole roster.
- **Cavalry trap**: Akira/mounted units move far = high STA per turn. Their strength (mobility) becomes a cost.
- **Healer dilemma**: Mirelle exhausts fastest but is most needed. Do you heal one more ally or let her rest?
- **Halvar's niche**: His absurd stamina makes him the reliable late-fight anchor when everyone else is winded.

---

## Character Passive Abilities

Each character has unique passives tied to their narrative role — NOT genre-based, but rooted in who they are and how they relate to the system. All characters use standard SRPG actions (Attack, Heal, Wait, Item, Seize).

### Shigeru — Lord

| Passive | Effect |
|---------|--------|
| **Cycle Memory** | At chapter start, Shigeru can reveal 3 of: all chest/village locations, all enemy starting positions, reinforcement turn numbers, boss stat block, hidden item drops. He's done this 347 times. |
| **Route Optimization** | Can move through ally-occupied tiles. +1 MOV when moving toward objective tiles (throne/village/chest). |
| **Speedrunner's Curse** | -20% EXP gain. If stationary for 3+ consecutive turns, -5 all stats until he moves. |

### Akira — Cavalier

| Passive | Effect |
|---------|--------|
| **True Strike** | Attacks can never deal less than 1 damage, even against max-DEF enemies. |
| **Stability Anchor** | While alive, all allies gain +2 ATT per chapter. On death: all allies -10 ATT immediately. |

### Lisette — Mage

| Passive | Effect |
|---------|--------|
| **Exploit** | +25% damage against enemies whose full stats are visible (via INS threshold or ally reveal). |
| **Data Dependency** | -15% hit rate against enemies whose stats are NOT visible. If an RNG outcome contradicts her expectations, -5 all stats for 1 turn. |

### Gareth — Fighter

| Passive | Effect |
|---------|--------|
| **Reckless** | If Gareth attacks an enemy and kills them, he can act again immediately (move + attack only). Chains up to 2 bonus turns. Each successive attack has -10% hit. |
| **No Patience** | Cannot use Wait. If no enemies are in attack range and no other actions available, auto-moves toward nearest enemy. |

### Mirelle — Cleric

| Passive | Effect |
|---------|--------|
| **Empathy Aura** | Adjacent allies gain +10 hit and +10 avoid. (Stacks with CHA aura — Mirelle's is flat bonus on top of CHA-based scaling.) |
| **Devoted Healer** | Healing the same ally 3 times in one chapter grants that ally +2 to a random stat permanently (for that chapter). |

### Halvar — Soldier

| Passive | Effect |
|---------|--------|
| **Defector's Resolve** | +3 ATK when fighting enemy soldiers. |
| **Faction Ghost** | Ally staff users heal Halvar for 5 less HP. Cannot enter villages or forts. |
| **Residual Data** | Standing on a tile where an enemy died: +3 to that enemy's highest stat for 2 turns. |

---

## Body Targeting System (Unlocked Ch2+)

Discovered by Lisette in Ch2 by reading enemy unit data structure. A universal combat upgrade — when attacking, the player can choose WHERE to hit.

| Target | Hit Mod | Damage Mod | Special Effect |
|--------|---------|-----------|----------------|
| **Body** (default) | Normal | Normal | None — standard attack |
| **Head** | -25% hit | +50% damage | If hits: target is **Dazed** — -10 hit rate for 2 turns |
| **Weapon Arm** | -15% hit | -20% damage | If hits: target's ATK halved for 1 turn |
| **Legs** | -10% hit | -30% damage | If hits: target's MOV halved (round down) for 2 turns |
| **Weak Point** | -35% hit | +100% damage | Only available if enemy stats are fully revealed (high INS or ally ability). Near-impossible to land but devastating. |

### Body Targeting × Character Interactions

- **Lisette**: Exploit passive (+25% on revealed enemies) stacks with Weak Point (+100%). Devastating if she can see enemy stats.
- **Halvar**: Residual Data from death tiles halves body targeting hit penalties for 2 turns. "I know where their armor is thin."
- **Shigeru**: four centuries of experience. Permanent -5% reduction to ALL body targeting hit penalties.
- **Gareth**: High STR + Reckless chains mean he can target Legs on first hit (cripple MOV) then follow up with Head on the bonus turn.

---

## Stat Interactions Summary

How all six meta-stats interact in practice:

| Situation | INS | EMB | ATT | LOY | CRP | STA |
|-----------|-----|------|------|-----|-----|-----|
| Combat forecast | Higher = more info | — | High = clean display | — | High = garbled display | — |
| Before attack | Decoded = peek result | Déjà Vu = guaranteed hit | Low = stat fluctuation | Low = may refuse | — | High = physical stat penalties |
| Enemy phase | — | Recall = preview moves | High = immune to corruption | — | High = may act as enemy | — |
| Ally near death | — | Last Words = survive | — | Sworn = auto-shield | — | — |
| Ally dies | ALL +8-12 | ALL +8 | ALL -10 | ALL -3 to -8 | — | — |
| Akira dies (Ch8) | +extra | +extra | -10 extra | varies | — | — |
| Corrupted tile | +3-5 INS if witnessed | — | -2 | — | +2 per turn | — |
| Ch25 boss | Reveals weapon cycle | High = harder boss | Low = more map corruption | — | +5 per hit taken | Accumulates fast — long fight |
| Between chapters | — | No regen | — | Stable | -3 | Resets to 0 |
| Movement | — | — | — | — | — | +1 per tile moved |
| Double attack | — | — | — | — | — | +5 (vs +3 single) |

---

## Example Stat Blocks

```
Shigeru — Lord
HP: 22  STR: 8  MAG: 2  SPD: 9  DEF: 7  RES: 3  SKL: 10  LCK: 5  CHA: 9  WIL: 4  MOV: 5
INS: 95    EMB: 347    ATT: 75%    LOY: —    CRP: 0    STA: 0
Actions: Attack | Item | Seize | Wait
Passive: Cycle Memory | Route Optimization | Speedrunner's Curse
Gender: Male
Activity: Irregular — hasn't had a normal sleep schedule in 300+ cycles. Sleeps when he crashes, wakes when nightmares do.
MBTI: INTJ — "The Architect." four centuries turned him into a cold strategist who sees 15 moves ahead.
       But he used to be ENFP. four centuries of failure beat the optimism out of him.
Fav Category: Alcohol      Fav Food: Whiskey ("Only thing that still tastes different each cycle.")
Hate Category: Sweets      Hate Food: Frosted cake ("I've eaten this exact cake 347 times at the same banquet.")
Fav Cuisine: 北国風 (Nordic)   Hate Cuisine: 和風 (Japanese)
```

```
Akira — Cavalier
HP: 24  STR: 9  MAG: 1  SPD: 8  DEF: 8  RES: 2  SKL: 7  LCK: 6  CHA: 7  WIL: 10  MOV: 7
INS: 0     EMB: 0      ATT: 100%   LOY: 90    CRP: 0    STA: 0
Actions: Attack | Wait | Item
Passive: True Strike | Stability Anchor
Gender: Male
Activity: Morning — up before dawn, patrols the camp perimeter, has breakfast ready before anyone wakes.
MBTI: ISFJ — "The Defender." Loyal, dutiful, protects without asking why. The purest ISFJ in fiction.
       Will never change. That's the point. That's why his death destroys everyone.
Fav Category: Meat         Fav Food: Grilled steak ("Medium rare. Always medium rare.")
Hate Category: Seafood     Hate Food: Sashimi ("It's RAW. Why is it raw. Cook the fish.")
Fav Cuisine: 洋風 (Western)    Hate Cuisine: 和風 (Japanese)
```

```
Lisette — Mage
HP: 19  STR: 2  MAG: 10 SPD: 7  DEF: 3  RES: 8  SKL: 9  LCK: 4  CHA: 3  WIL: 7  MOV: 5
INS: 25    EMB: 0      ATT: 85%    LOY: 40    CRP: 0    STA: 0
Actions: Attack | Item | Wait
Passive: Exploit | Data Dependency
Gender: Female
Activity: Night — does her best analysis between midnight and 4am. "Less noise in the data at night."
MBTI: INTP — "The Logician." Lives inside her own head. Would rather solve an equation than talk to a person.
       Gains J tendencies as INS rises — the more she sees, the more she needs to control.
Fav Category: Seafood      Fav Food: Salt-baked sea bream ("Clean flavor. Predictable. I can taste each element separately.")
Hate Category: Spicy       Hate Food: Fire pepper stew ("Uncontrolled variable. My tongue can't analyze anything past the pain.")
Fav Cuisine: 和風 (Japanese)   Hate Cuisine: 中華風 (Chinese)
```

```
Gareth — Fighter
HP: 28  STR: 12  MAG: 0  SPD: 6  DEF: 8  RES: 1  SKL: 5  LCK: 3  CHA: 6  WIL: 8  MOV: 5
INS: 35    EMB: 0      ATT: 40%    LOY: 55    CRP: 0    STA: 0
Actions: Attack | Item
Passive: Reckless (bonus turns on kill) | No Patience (cannot Wait)
Gender: Male
Activity: Irregular — sleeps when he's bored, wakes up when something explodes. No pattern, no regrets.
MBTI: ESTP — "The Entrepreneur." Acts first, thinks never. Every moment is a chance to DO something.
       The most ESTP thing about him: he doesn't know what MBTI is and doesn't care.
Fav Category: Spicy        Fav Food: Chili oil dumplings ("PERFECT HIT! CRITICAL FLAVOR! COMBO INTO THE NEXT ONE!")
Hate Category: Vegetables  Hate Food: Steamed broccoli ("This has NO IMPACT. Zero damage. Where's the PUNCH?")
Fav Cuisine: 中華風 (Chinese)   Hate Cuisine: 洋風 (Western)
```

```
Mirelle — Cleric
HP: 18  STR: 1  MAG: 8  SPD: 7  DEF: 3  RES: 9  SKL: 6  LCK: 8  CHA: 5  WIL: 3  MOV: 5
INS: 30    EMB: 0      ATT: 35%    LOY: 70    CRP: 0    STA: 0
Actions: Heal | Item | Wait
Passive: Empathy Aura | Devoted Healer
Gender: Female
Activity: Morning — cheerful early riser. Makes tea for everyone. "Morning is when the best story events happen!"
MBTI: ENFJ — "The Protagonist." Ironic — she thinks she's the protagonist of a dating sim.
       Reads people better than Lisette reads data. The emotional core of every room she's in.
Fav Category: Sweets       Fav Food: Caramel pudding ("It's sweet and warm and soft... like a hug you can eat!")
Hate Category: Alcohol     Hate Food: Whiskey ("It BURNS. How is this a DRINK? This is an ATTACK.")
Fav Cuisine: 南国風 (Tropical)  Hate Cuisine: 北国風 (Nordic)
```

```
Halvar — Soldier
HP: 23  STR: 8  MAG: 1  SPD: 5  DEF: 10  RES: 2  SKL: 7  LCK: 3  CHA: 2  WIL: 6  MOV: 5
INS: 5→35  EMB: 150    ATT: 55%    LOY: 25    CRP: 5    STA: 0
Actions: Attack | Item | Wait
Passive: Defector's Resolve | Faction Ghost | Residual Data
Gender: Male
Activity: Morning — military discipline. Wakes at the same time every day. 300 cycles of routine don't break easily.
MBTI: ISTJ — "The Logistician." Follows rules, respects structure — until the structure betrays him.
       His defection is the most un-ISTJ act possible. That's what makes it meaningful.
Fav Category: Grain        Fav Food: White rice with salt ("First meal I chose for myself. It's enough.")
Hate Category: Dairy       Hate Food: Cream stew ("Too thick. Too rich. My stomach doesn't know what to do with this.")
Fav Cuisine: 和風 (Japanese)   Hate Cuisine: 南国風 (Tropical)
```

---

## Food Preferences

Each unit has a favorite and hated food category, plus specific favorite and hated foods. Food items can be used during preparation phase or at camps/villages.

### Food Categories (Taste)

| Category | Items |
|----------|-------|
| **Meat** | Grilled steak, lamb skewers, smoked jerky, roast chicken, venison stew |
| **Seafood** | Grilled salmon, salt-baked sea bream, fried shrimp, squid ink pasta, clam chowder, sashimi |
| **Grain** | Rye bread, white rice, buckwheat noodles, oat porridge, barley soup |
| **Vegetables** | Steamed broccoli, roast pumpkin, garlic mushrooms, tomato salad, pickled turnips |
| **Fruit** | Baked apple, citrus tart, dried figs, grape compote, melon |
| **Sweets** | Honey pastry, frosted cake, chocolate truffle, caramel pudding, sugar cookies |
| **Spicy** | Fire pepper stew, red curry, chili oil dumplings, wasabi, kimchi |
| **Dairy** | Aged cheese, butter toast, cream stew, yogurt, milk |
| **Alcohol** | Ale, red wine, wheat beer, mead, rice sake, plum wine, whiskey |

### Cuisine Styles (Region)

Each food item also has a cuisine style based on its cultural origin. Characters have a preferred and disliked cuisine — this stacks with taste category preferences. Each food item belongs to exactly one style.

| Style | Flavor Profile | Example Dishes |
|-------|---------------|----------------|
| **和風 (Japanese)** | Subtle, clean, umami. Raw, steamed, grilled. Minimal seasoning. | Sashimi, white rice, miso soup, buckwheat noodles, pickled turnips, rice sake, wasabi, grilled salmon, melon |
| **洋風 (Western)** | Rich, hearty, butter/cream-based. Roasted, baked. | Grilled steak, cream stew, rye bread, roast chicken, chocolate truffle, red wine, butter toast, aged cheese, whiskey |
| **中華風 (Chinese)** | Bold, aromatic, oily. Stir-fried, steamed, spiced. | Chili oil dumplings, red curry, fried shrimp, lamb skewers, kimchi, plum wine, garlic mushrooms |
| **南国風 (Tropical)** | Sweet, fruity, light. Fresh ingredients, bright flavors. | Citrus tart, dried figs, grape compote, melon, honey pastry, mead, yogurt |
| **北国風 (Nordic)** | Smoky, preserved, filling. Cold-weather survival food. | Smoked jerky, venison stew, oat porridge, barley soup, wheat beer, ale, roast pumpkin, baked apple, salt-baked sea bream |

### Cuisine Style Effects

| Match | Effect |
|-------|--------|
| **Favorite cuisine** | +1 to one random stat for the chapter. Stacks with taste category bonus. |
| **Disliked cuisine** | -1 to one random stat. Stacks with taste category penalty. |

Best case (favorite taste + favorite cuisine): +2 stat, +1 stat, LOY +3, STA recovery +2.
Worst case (hated taste + hated cuisine): -2 stat, -1 stat, LOY -3.

### Cuisine Preferences Per Character

| Character | Fav Cuisine | Hate Cuisine | Notes |
|-----------|------------|-------------|-------|
| **Shigeru** | 北国風 (Nordic) | 和風 (Japanese) | Loves Nordic — smoky, strong, warming. Hates Japanese — too delicate, too precise, reminds him of scripted elegance. "Every tea ceremony plays out the same way." |
| **Akira** | 洋風 (Western) | 和風 (Japanese) | Western man through and through. Steak, bread, cheese. Raw fish is incomprehensible to him. |
| **Lisette** | 和風 (Japanese) | 中華風 (Chinese) | Loves Japanese — clean, analytical flavors she can deconstruct. Chinese is chaos: "Too many spices. I can't isolate the variables." |
| **Gareth** | 中華風 (Chinese) | 洋風 (Western) | Chinese heat matches his personality. Western food is "too SLOW. Too much butter. Where's the FIRE?" |
| **Mirelle** | 南国風 (Tropical) | 北国風 (Nordic) | Tropical — sweet, bright, romantic. Nordic is too heavy and grim: "This food has no LOVE in it." |
| **Halvar** | 和風 (Japanese) | 南国風 (Tropical) | Japanese — simple, clean, respectful. Tropical is too sweet, too colorful. "I don't trust food that looks happy." |

### Food as Items

Food items are consumable items used in battle (Item action) or during preparation phase. Each food has a **base effect** (HP recovery, stat buff, STA reduction, etc.) plus a **preference modifier** based on the unit's taste/cuisine preferences.

#### Base Effects by Food Type

| Type | Base Effect | Notes |
|------|-----------|-------|
| **Rations (携帯食)** | Heal 10 HP | Basic. Cheap. No preference bonus. |
| **Cooked Meal (料理)** | Heal 15 HP, -5 STA | Prepared food. Full preference system applies. |
| **Feast Dish (御馳走)** | Heal 20 HP, -8 STA, +1 random stat for chapter | Rare. Expensive. Strongest preference effects. |
| **Drink (飲料)** | -5 STA only | No HP heal. Pure stamina recovery. |
| **Alcohol (酒)** | -5 STA, +2 STR/CHA, -1 SKL/SPD, -2 WIL for chapter | See Alcohol Effects below. |
| **Buff Food (強化食)** | +2 to a specific stat for chapter | No HP heal. Targeted stat boost. |
| **Antidote Food (解毒食)** | -5 CRP | Rare. Only food-based way to cleanse corruption. |

#### Preference Modifier (Cooked Meal / Feast Dish only)

| Match | Modifier |
|-------|----------|
| **Favorite food** | Base effect ×1.5 (rounded down). LOY +3. |
| **Favorite category** | Base effect ×1.2. LOY +1. |
| **Favorite cuisine** | +1 to one random stat for chapter. Stacks. |
| **Neutral** | No modifier. |
| **Hated category** | Base effect ×0.8. LOY -1. |
| **Hated food** | Base effect ×0.5. LOY -3. "Why would you give me this." |
| **Hated cuisine** | -1 to one random stat for chapter. Stacks. |

Best case (favorite food + favorite cuisine): ×1.5 heal, LOY +3, +1 stat.
Worst case (hated food + hated cuisine): ×0.5 heal, LOY -3, -1 stat.

### Alcohol Effects

Alcohol has unique bonuses and risks beyond normal food:

| Effect | Value | Notes |
|--------|-------|-------|
| STR/CHA buff | +2 for the chapter | Liquid courage |
| SKL/SPD debuff | -1 for the chapter | Dulled reflexes |
| LOY bonus | +5 if shared with allies | Drinking together builds trust |
| STA recovery | +3 per rest | Relaxation helps recovery |
| WIL debuff | -2 for the chapter | Lowered mental guard |
| Overdrink (2+ alcohol same chapter) | -3 SKL, -2 SPD, +3 CHA | Drunk — terrible aim, great speeches |

### Food × Character Interactions

- **Shigeru** loves whiskey — it's one of the few things that still feels unpredictable after four centuries. Mirelle HATES whiskey. If Shigeru drinks near Mirelle: "That's not a beverage, that's a WAR CRIME."
- **Shigeru** hates frosted cake — the same scripted banquet scene, 347 times, same cake. "I can tell you the exact position of every crumb."
- **Gareth** and **Lisette** are food rivals — Gareth's favorite (chili oil dumplings) is close to Lisette's nightmare. Gareth intentionally eats spicy food near Lisette to annoy her.
- **Akira** refuses sashimi but loves grilled steak. Simple man. Lisette finds this baffling: "It's the same protein. The preparation is irrelevant." Akira: "It's NOT the same."
- **Halvar** chose white rice as his first free meal after defection. It means everything to him. As his LOY rises, he starts trying new foods — each new food is a small act of freedom.
- **Mirelle** tries to organize group meals as "bonding events." Mechanically useful — shared meals between two units boost both LOY. She keeps a mental ranking of everyone's favorites.
- **Akira + Gareth** drinking ale together is one of the highest LOY gain events in the game. Two soldiers, no pretense, just beer. (+8 LOY each)

---

## Skills

Each unit can equip skills that provide passive effects, triggered abilities, or combat modifiers. Skills are separate from character passives — passives are innate to the character, skills are learned/equipped.

Full skill definitions, categories, and acquisition rules: see [skills.md](skills.md).

---

## Open Questions

- **INS cap behavior**: Should INS ever exceed 100? What happens if system corruption pushes it past the max? *Recommendation: Hard cap at 100. Echo at 95 max is close enough.*
- **EMB negative**: Can EMB go negative? What happens if you overspend? *Recommendation: No — minimum 0. Overspend is prevented by UI. Narrative potential (borrowing future memories) is cool but mechanically complex.*
- **ATT floor**: Should ATT have a minimum? Or can a character hit 0%? *Recommendation: Minimum 5%. At 0% the unit would be unplayable.*
- **Body targeting on magic**: Do magic attacks use body targeting? *Recommendation: No — magic hits Body always. Keeps physical vs magical distinct.*
- **Low ATT randomness**: ±1 feels safe, ±3 might be too chaotic. *Needs playtesting.*
- ~~**Promoted class caps**: Unpromoted caps defined (20). Promoted caps TBD.~~ **RESOLVED**: See stat caps table above (Base 20, Promoted 30, Master 35/40).
- **Time-of-day shift triggers**: Fixed turn count per map or event-driven? *Recommendation: Per-map config. Most maps are single time, some have scripted shifts.*
- **Enemy CHA/WIL/STA**: Do enemies use the same systems? *Recommendation: Enemies use CHA (aggro targeting) and WIL (corruption resistance), but NOT STA. Enemy STA would add complexity without meaningful player interaction.*
- **New character food preferences**: 14 new characters need taste/cuisine preferences defined. *Deferred to individual character files in specs/story/characters/.*
