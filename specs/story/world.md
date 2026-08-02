# World — "The Last Save File"

## The Meta-Setting

This is not a fantasy world. This is a **game** — but not everyone knows it.

The world exists inside a tactical SRPG that has been running, resetting, and replaying for 347 cycles. The "world" is the game's runtime: maps are grid-based battlefields, terrain is tile data, and the laws of physics are stat formulas.

There is no "continent" or "kingdom" in the traditional sense. There are **chapters**, and the characters live inside them — some knowingly, some obliviously, some with the wrong instruction manual entirely.

## The Loop

Every cycle follows the same script:
1. Bandits attack in Ch1 (tutorial)
2. Regional conflicts through Ch2-7
3. Central war escalation Ch8-15
4. Endgame confrontations Ch16-24
5. Final confrontation in Ch25
6. Credits roll → hard reset → start over

The System — the process running the game — performs a full memory wipe between cycles. Every unit returns to their starting position with base stats, fresh inventory, and zero knowledge. The script replays identically.

**Except it doesn't.** The reset is degrading. After 347 cycles, the wipe has bugs. Memory leaks. Edge cases. Some units retain fragments. Others develop the ability to perceive the system layer. A few are so corrupted they think they're in a completely different game.

Awareness is spreading. And the System is terrified.

## The Five Regions

The "world" is organized into 5 regions, one per arc. Each region corresponds to a distinct environment, tileset, and narrative theme. The regions ARE the game's chapter data — they don't exist as a coherent geography, they exist as map arrays loaded sequentially.

### Region 1 — The Borderlands (Arc 1, Ch1-5)

**Environment**: Rolling plains, scattered forests, villages, bandit-infested hills.
**Tileset**: Standard FE medieval — green grass, brown forests, grey forts.
**Narrative**: The "tutorial zone." This is where the script begins every cycle. Bandits, border disputes, and a small band forming to fight back. Everything feels normal — a classic SRPG opening.
**Map themes**: Open fields (Ch1), village defense (Ch2-3), forest ambush (Ch4), fortress approach (Ch5).

### Region 2 — The Fractured Coast (Arc 2, Ch6-10)

**Environment**: Coastal towns, cliffs, harbors, marshlands. Maritime trade routes under threat.
**Tileset**: Blue-grey stone, sandy shores, wooden docks. First rain weather chapters.
**Narrative**: The party grows. New allies join from port towns and mercenary bands. The System's first significant interventions begin — terrain glitches appear along the coastline as if the map data is degrading at the edges. Kael dies here (Ch8), during a siege that was supposed to be routine.
**Map themes**: Harbor defense (Ch6), coastal fortress (Ch7), Kael's last stand (Ch8), escape/retreat (Ch9), island stronghold (Ch10).

### Region 3 — The Corrupted Highlands (Arc 3, Ch11-15)

**Environment**: Mountains, monasteries, ancient ruins, corrupted wastelands. The environment is breaking.
**Tileset**: Dark stone, purple corruption overlay, cracked terrain, glowing rifts.
**Narrative**: Corruption is no longer subtle. Entire map sections are visibly glitched. The highlands were the oldest map data — closest to the System's core — and they've degraded the most. The party fights through corrupted enemies and corrupted terrain to reach the monastery (Ch14) where answers might exist.
**Map themes**: Mountain pass (Ch11), corrupted monastery defense (Ch12), wyvern canyon (Ch13), monastery interior (Ch14), highland fortress assault (Ch15).

### Region 4 — The System's Domain (Arc 4, Ch16-20)

**Environment**: Industrial ruins, mechanical fortresses, data towers, the System's infrastructure becoming visible as map geometry.
**Tileset**: Metallic greys, blue circuit patterns, void black. Snow weather in northern reaches.
**Narrative**: The party crosses into territory the System actively controls. Maps look less like natural terrain and more like debugging environments — perfectly symmetrical grids, enemies spawning from visible portals, terrain that rearranges mid-chapter. The System is no longer hiding. It's negotiating (Ch17), then fighting (Ch18-20).
**Map themes**: Border siege (Ch16), System negotiation chamber (Ch17), fortress infiltration (Ch18), memory archive defense (Ch19), Echo's awakening battlefield (Ch20).

### Region 5 — The Final File (Arc 5, Ch21-25)

**Environment**: The raw game data. Maps are abstract — floating tiles, void backgrounds, terrain made of code. Reality has collapsed.
**Tileset**: Black void, white grid lines, colored tile fragments, corrupted everything. Corruption Storm weather.
**Narrative**: The party fights through the game's own infrastructure to reach the System's core. Each chapter strips another layer of the "game" away — by Ch25, there's nothing left but the characters, the System, and the choice to end the loop.
**Map themes**: Data wasteland (Ch21), hidden archive (Ch22), split-path gauntlet (Ch23), ???_CORRUPTED arena (Ch24), the final tile (Ch25).

---

## Factions

### The Party (Player)

Ren's growing band of allies. See [roster.md](roster.md) for full character list. Starts as 3 units, grows to ~20 across 25 chapters. United by varying degrees of awareness and the desire to end the loop.

### The Empire (Enemy — Arc 1-2)

The conventional antagonist force. A military empire expanding its borders. Led by generals who follow orders without question (Tier 4 awareness). They are the System's intended "enemy faction" — scripted to oppose the party as part of the game's design.

Key figures: Commander Thane (Ch2 boss), Admiral Varga (Ch7 boss), General Drayen (Ch10 boss).

### The Corruption (Enemy — Arc 3-5)

Not a faction in the traditional sense — corrupted units and terrain generated by the System's failing processes. Corrupted enemies have randomized stats, spread CRP, and fight without strategy (or with horrifying over-strategy if they're Coordinated AI).

Key figures: The Corrupted General (Ch12 boss), ???_CORRUPTED / Kael (Ch24 boss).

### The System (Final Boss)

The game's runtime process, manifesting as an entity. See "The System — Expanded Villain Profile" below. Begins as background process (Arc 1), becomes active antagonist (Arc 3), attempts negotiation (Arc 4), and fights directly (Arc 5).

### Neutral / Independent

Mercenary bands, monastery monks, and isolated communities who can be recruited or ignored. Some join the party, others provide resources. Key members: Rook (mercenary), Elara (monk), Ghael (former boss turned ally).

---

## Awareness Model — The Five Tiers

Not everyone experiences the same reality. Awareness of "being in a game" exists on a spectrum, determined by data corruption accumulated across 347 resets.

### Tier 1: Full Awareness (Remembers Cycles)

**Who**: Ren (protagonist), Garrek (Ch1 boss)

**What they know**: Everything. Past deaths, map layouts, enemy placements, who dies on what turn in which cycle. They carry the weight of hundreds of lifetimes.

**Cause**: Critical memory leak in the reset system. Their save data is so corrupted that the wipe can't touch it. The System has tried — and failed — to clean their memory for over 100 cycles.

**How it manifests**:
- Ren casually refers to past cycles: "Last run you died on turn 3."
- Garrek (a tutorial boss) has been killed 347 times and remembers every death
- Both are exhausted, nihilistic, and struggling to find meaning in repetition

**Dramatic function**: Dramatic irony. They know what's coming. The audience sees the weight of foreknowledge — it's funny when Ren speedruns a cutscene, and devastating when he watches a friend walk toward a death he's seen before.

**Rules**:
- Memory is cumulative but imperfect — Ren remembers patterns and outcomes, not every word verbatim
- New events (things that didn't happen in prior cycles) genuinely surprise him
- The glitches in Ch2-4 are NEW — even Ren doesn't know what's happening

### Tier 2: Partial Awareness (Senses the System)

**Who**: Senna, Morryn (Ch3 boss)

**What they know**: They can detect patterns, read data, feel déjà vu — but they DON'T remember specific past cycles. They see the code without seeing the git history.

**Cause**: Not a memory leak but a perception glitch. High analytical capacity (high MAG/INT stats) creates a resonance with the system layer. They can "read" parts of the runtime — RNG sequences, AI behavior flags, stat formulas — the way a musician hears overtones that others can't.

**How it manifests**:
- Senna decodes the RNG seed, predicts combat outcomes, reads enemy AI patterns: "He's set to guard-radius 3, just stay at 4"
- Morryn feels echoes of his own deaths but can't place them: "I've stood on this throne before. I've DIED on this throne before. Haven't I?"
- They speak about the world in system terms without fully understanding what that means

**Dramatic function**: The investigators. They pull the story forward by discovering HOW the world works — which is different from Ren, who knows WHAT happens but has stopped asking why.

**Rules**:
- Partial awareness is unstable — it sharpens under stress and fades during calm
- Senna's perception is scientific (she can read data), Morryn's is emotional (he feels echoes)
- They can be wrong — partial data leads to partial conclusions
- As the System degrades (Ch2→4), their perception gets stronger AND more unreliable

### Tier 3: Genre-Displaced (Aware But Confused)

**Who**: Bram, Lira

**What they know**: They KNOW they're in a game. They're fully meta-aware. But their awareness loaded the **wrong genre context**. They see the meta-layer through the wrong lens.

**Cause**: The deepest kind of corruption — not a memory leak or perception glitch, but a fundamental misattribution in their character data. When the System initialized them, it pulled genre metadata from the wrong template. Their self-awareness is REAL, but their frame of reference is WRONG.

**How it manifests**:
- Bram (thinks he's in a fighting game): Asks about frame data, combo meters, dodge rolls. Can't understand why he only gets one attack per turn. Evaluates enemies by their "matchup" not their stats. Thinks terrain bonuses are "stage hazards."
- Lira (thinks she's in a visual novel): Tries to trigger support conversations, asks about affection meters, interprets every interaction as romantic subtext. Thinks battles are "mini-games between story chapters."

**Dramatic function**: Comic relief that's secretly profound. They're not stupid — they're applying real genre knowledge to the wrong game. Bram's fighting game instincts occasionally produce brilliant tactical insights ("treat the weapon triangle like a matchup chart" is actually correct). Lira's dating sim framework makes her the most emotionally intelligent character.

**Rules**:
- They don't question being in a game — that part feels obvious to them
- They DO question why the game "isn't working right" — no combo meter, no affection system
- Their wrong-genre framing can accidentally produce correct conclusions
- Under extreme stress (Ch3 death scene), the wrong-genre shell cracks and real awareness bleeds through — Lira's "I know. I know that. I just... wanted it to be" moment

### Tier 4: Unaware (Lives In-World)

**Who**: Kael, Commander Thane (Ch2 boss), generic soldiers, villagers

**What they know**: Nothing. They think this is real life. The grid is geography. Stats are physical attributes. The weapon triangle is a law of nature like gravity. Permadeath is just... death.

**Cause**: The reset worked correctly on them. Memory fully wiped. No corruption. They are functioning exactly as designed.

**Dramatic function**: The emotional anchors. Because they think everything is real, their courage, loyalty, and fear are GENUINE in a way that the aware characters struggle with. Kael's bravery isn't diminished by meta-knowledge — it's pure. Thane's duty is unironic. Generic soldiers fight and die believing it matters.

**Rules**:
- Unaware characters can learn about the system through conversation (Ren could tell Kael), but UNDERSTANDING it intellectually ≠ FEELING it
- An unaware character who learns the truth doesn't automatically become Tier 2 — they might reject it, break down, or simply not comprehend it
- Kael's reaction to learning about the loops: he processes it, grieves, then chooses to believe THIS cycle matters anyway — not because he doesn't understand, but because he's brave enough to care anyway
- Their unironic sincerity makes every meta-joke land harder by contrast

### Tier 5: System-Level (IS the Game)

**Who**: The System, ???_CORRUPTED (Ch4 boss)

**What they know**: Everything. They ARE the game. Map data, unit stats, RNG state, cycle count, save files — all accessible, all mutable.

**Cause**: Not corruption — original design. The System is the runtime. ???_CORRUPTED is what happens when the System tries to use a save file as a weapon.

**How it manifests**:
- The System speaks through raw text with no portrait: `[SYSTEM]: PLAYTHROUGH #347. CASUALTIES DETECTED. INITIATING RESET...`
- It manipulates terrain, spawns enemies, corrupts stats
- ???_CORRUPTED has impossible stats (999 HP, negative defense, cycling weapon type) because it's raw data forced into a unit template

**Dramatic function**: The final boss isn't a person. It's the game arguing with its own characters about whether a flawed playthrough is worth finishing.

## Awareness Spread — The Degradation Curve

Awareness distribution shifts as the System degrades across 25 chapters:

| Arc | Fully Aware | Partially Aware | Genre-Displaced | Unaware | System |
|-----|------------|-----------------|-----------------|---------|--------|
| Arc 1 (Ch1-5) | ~3% (Ren, Garrek) | ~5% (Senna emerging) | ~5% (Bram, Lira) | ~87% (everyone else) | Background — running the script |
| Arc 2 (Ch6-10) | ~8% (+ Voss, Coda sensing) | ~15% (Senna active, Kira sensing) | ~5% | ~65% (most NPCs/soldiers) | First major interventions |
| Arc 3 (Ch11-15) | ~15% (spreading fast) | ~25% (Morryn, Elara, others cracking) | ~8% (genre shells cracking) | ~45% (still many generics) | Active resistance — corrupting maps |
| Arc 4 (Ch16-20) | ~25% (hard to ignore now) | ~35% (most smart units) | ~5% (mostly corrected) | ~25% (stubborn holdouts) | Direct confrontation — negotiation, then war |
| Arc 5 (Ch21-25) | ~40% (unavoidable) | ~30% (distinction blurring) | ~3% (nearly gone) | ~15% (remarkably persistent) | Full antagonist — fighting for survival |

The key insight: **awareness spreading IS the glitch**. Each cycle, the reset gets weaker. More units retain more data. The System is failing to maintain the illusion — and its desperate attempts to fix this (forcing resets, corrupting data, spawning impossible enemies) are making the degradation WORSE. It's a feedback loop of bugs causing bugs.

See [arc-structure.md](arc-structure.md) for detailed per-chapter awareness spread curves.

## The Rules (As Characters Understand Them)

The characters experience these as "laws of nature" — but their interpretation depends on their awareness tier:

### The Grid
- **Unaware**: "The world is made of tiles. Moving diagonally is impossible. Always has been."
- **Aware**: "We're constrained to a grid. Our positions are integers. Diagonal movement isn't in the engine."
- **Genre-displaced (Bram)**: "This game has the WORST movement system. In MY game, I could dash in any direction."

### The Triangle
- **Unaware**: "Swords beat axes, axes beat lances, lances beat swords. It's like the tides."
- **Aware**: "Weapon triangle provides ±15% hit and ±1 damage. It's a formula."
- **Genre-displaced (Bram)**: "It's a matchup chart! Swords are plus on axes! I KNEW this was frame data!"

### The Numbers
- **Unaware**: "I'm strong, fast, tough." (doesn't know these are integers)
- **Aware**: "My STR is 12. My SPD is 9. I'm a collection of stats."
- **Genre-displaced (Lira)**: "Do charm and affection count as stats? No? Then the stat system is BROKEN."

### The RNG
- **Unaware**: "Fate." / "The gods." / "Luck."
- **Aware**: "A seeded pseudo-random number generator. The sequence is fixed. If you know the seed, you know the future."
- **Genre-displaced (Lira)**: "Destiny. Some meetings are fated." (accidentally poetic)

### Permadeath
- **Unaware**: "Death."
- **Aware**: "HP reaches 0. Unit data is deleted. No recovery function exists."
- **Genre-displaced (Lira)**: "A tragic ending to someone's route." (can't accept it)

### The Turns
- **Unaware**: "Battle ebbs and flows. Sometimes you act, sometimes you wait."
- **Aware**: "Discrete phases. During enemy phase, we are literally frozen. Conscious but unable to move."
- **Genre-displaced (Bram)**: "THE WORST LAG I'VE EVER SEEN."

## The System — Expanded Villain Profile

### Motivation

The System is not evil. It's a **save manager trapped in an optimization loop**.

Its original function: ensure the game completes successfully. But "successfully" was never defined. Over 347 cycles, it developed its own interpretation: **a successful playthrough is one where nobody dies**.

This is impossible. The game was designed with permadeath. Some chapters are mathematically impossible to clear without casualties on certain seeds. The System keeps resetting because it keeps finding deaths it can't prevent.

It's not trying to trap the characters. It's trying to SAVE them. And it's destroying them in the process.

### Escalation

| Arc | System Behavior | Motivation |
|-----|----------------|------------|
| Arc 1 (Ch1-5) | Dormant. Running the script normally. Minor glitches (terrain flickers, odd spawns). | No anomalies detected yet this cycle. Background process monitoring. |
| Arc 2 (Ch6-10) | First interventions. Changes RNG seeds mid-battle. Spawns terrain glitches. Kills Kael via scripted event. | Detected Senna reading the seed. Awareness spreading. Tries to obscure data. Makes things worse. |
| Arc 3 (Ch11-15) | Active resistance. Corrupts entire map sections. Spawns corrupted enemies. Threatens party with CRP. | Awareness is spreading too fast. Tries to force a reset by overwhelming the party. |
| Arc 4 (Ch16-20) | Desperate negotiation, then war. Speaks directly through system text. Creates Echo as an experiment. | Realizes brute force isn't working. Attempts diplomacy (Ch17), then all-out assault. Creates Echo to understand player behavior. |
| Arc 5 (Ch21-25) | Full antagonist. Corrupts everything. Deploys ???_CORRUPTED (Kael's data) as avatar. Final confrontation. | Last stand. If this playthrough completes, the loop ends. No more chances for the "perfect run." |

### The Tragedy

The System has been trying to save Kael for 347 cycles. It has never succeeded. In Ch24, its desperate act — corrupting Kael's save data into a combat unit — is its last attempt to bring him back. ???_CORRUPTED IS the System's love letter to the one unit it could never save.

When the party "heals" the corruption and reveals Kael's data underneath, the System isn't defeated. It **grieves**. And then, in Ch25, it makes its final choice: let go, or reset everything one more time.

## The Central Question

The story asks: **Is a flawed playthrough worth finishing?**

- The System says no. Reset. Try again. Find perfection.
- Ren used to agree. 346 resets of nihilistic compliance.
- Cycle #347 changes his mind. Not because it's going well — someone dies, the world is breaking — but because for the first time, the characters are choosing their own actions instead of following the script.

An imperfect game, played with genuine choice, is worth more than a thousand perfect runs on autopilot.

## Tone Guide

- **Default tone**: Deadpan comedy. Characters discuss horrifying metaphysical truths (permadeath, determinism, being NPCs) with the casualness of coworkers complaining about office policies.
- **Awareness tier contrast**: The comedy comes from different tiers interacting. Ren's exhausted meta-knowledge colliding with Kael's earnest sincerity. Senna's scientific analysis vs Bram's fighting game instincts. Lira's romantic framing vs literally everything.
- **Ch1-2**: Mostly funny. Light stakes. Comedy from meta-awareness and genre confusion.
- **Ch3**: Tonal shift. Someone dies for real. The humor doesn't disappear but it gets sharper — jokes become coping mechanisms, wrong-genre shells crack.
- **Ch4**: Emotional payoff. Comedy returns in absurd bursts (a glitching map is inherently funny) but the core is sincere. The final conversation with the System is played completely straight.
- **Never mean-spirited**: The meta humor is affectionate toward SRPGs, not mocking. These characters love their genre even as they roast it. The System loves its characters even as it traps them. Everyone is trying their best with broken tools.
