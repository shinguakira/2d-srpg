# Stats

Defines every stat field in the game: what it means, how it's used in formulas, and design intent.

This game has two stat layers:
1. **Classic SRPG stats** — standard combat math (HP, STR, DEF, etc.)
2. **Meta stats** — unique to this game's meta-narrative (AWR, LOOP, SYNC, GENRE)

The meta stats are NOT cosmetic. They create real mechanical trade-offs, unlock unique action sets, and tie gameplay directly to the story.

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

## GENRE

A categorical tag — NOT a number. Determines each character's **unique action set**. Genre actions are abilities that only exist because the character thinks they're in a different game. The SRPG engine doesn't officially support these actions — they're bugs, leaking in from other genre runtimes.

Standard SRPG actions (Attack, Wait, Item, Seize) are universal. Genre adds **2-4 exclusive actions** per character that appear in their action menu alongside the standard ones.

### Fighting Game — Bram

| Action | Condition | Mechanic | Details |
|--------|-----------|----------|---------|
| **Punish** | Reactive — available the turn after an enemy attacked Bram at 1-range and he survived | Counter-attack at 1.5x damage | Not a passive auto-counter. It appears as an action on Bram's NEXT turn. He can choose to Punish (retaliating with bonus damage) or do something else. The choice matters — Punish requires staying in the danger zone. |
| **Taunt** | Active, any time | Select one enemy within 3 tiles. That enemy's AI is forced to target Bram next turn, ignoring all other units. Taunted enemy deals +20% damage (angry). | Creates a high-risk Punish setup. Taunt → enemy attacks Bram → next turn Punish is available. If Bram can survive the hit, the payoff is massive. 3-turn cooldown. |
| **Rage Art** | HP ≤ 30% | 3x damage attack with an **input sequence**: 3 timing windows appear rapidly. 3/3 correct = full 3x damage, guaranteed hit+crit (near-instant kill). 2/3 = 2x damage, normal hit. 1/3 = 1x, -20% hit. 0/3 = whiff entirely. | Once per chapter. The player's actual reaction speed determines the outcome. Bram is the only character where PLAYER SKILL directly affects damage. |
| **Block** | Replaces Wait | Bram enters guard stance until his next turn. -50% damage from all incoming attacks. If an enemy attacks him during enemy phase, a **Perfect Block** timing prompt appears — hit it correctly for 0 damage + free Punish counter at 1.5x. | Bram demands attention during enemy phase. Other characters just take hits; Bram makes you watch and react. |

**Genre Debuff — No Wait, No Patience**: Bram's action menu has no Wait button. He MUST act every turn — Attack, Punish, Taunt, Rage Art, Block, or Item. If no action is possible and no enemies are in range, he auto-moves toward the nearest enemy. "STANDING STILL IS NOT A STRATEGY."

**Attack Timing System**: ALL of Bram's attacks (not just Rage Art) have a timing element. When Bram attacks, a timing bar appears:
- **Perfect** (small green zone): +30% damage, +15 hit
- **Good** (yellow zone): Normal damage
- **Missed** (too late / too early): -30% damage, -15 hit, possible whiff
- This makes Bram high-skill-ceiling. A player with good timing gets a significantly stronger unit. A player with bad timing gets a liability.

**Combo System**: If Bram kills an enemy, he gets a **Bonus Turn** — he can act again immediately (movement + attack only, no items). Kill again on the bonus turn = another bonus turn. Chain up to 3 kills. Each successive combo hit has -10% hit rate (scaling difficulty). Kill counter appears on screen: "2 HIT!" "3 HIT COMBO!!"

### Visual Novel — Lira

| Action | Condition | Mechanic | Details |
|--------|-----------|----------|---------|
| **Talk** (replaces Attack) | Adjacent to any unit | Opens a **dialogue choice menu** with 2-3 options. Effect depends on target (ally or enemy). | Lira's primary action. Where other units swing swords, Lira has conversations. |
| **Read the Room** | Active, any time | ALL units on the map get an **emotional aura** for 2 turns. | Red = aggressive (will attack weakest). Yellow = cautious (will guard/retreat). Blue = conflicted (susceptible to Talk persuasion). White = scripted (fixed AI, immune to persuasion). Purple = corrupted (glitched, unpredictable). Better than AI type labels — shows emotional STATE, not just AI CODE. 3-turn cooldown. |
| **Route Lock** | Adjacent to ally, 1/chapter | Designate one ally as her "route." That ally gains: immune to crits + if they would die, Lira takes 50% of the fatal damage instead. If Lira dies while Route Lock is active, it persists 1 more turn — her last act protects them. | "Your story isn't ending here. I won't allow it." |
| **Save Point** | Active, 1/chapter | Creates a glowing marker on Lira's current tile. Any ally who moves to that tile can **undo their last action** — return to previous position with previous HP. The save point lasts 3 turns. Enemies can stand on it but can't use it. | "Every good visual novel has a save before the big choice." |

**Talk — Ally Targeting (Support Conversations)**:
- 3 dialogue choices, each boosting a different stat area for 3 turns:
  - Encouraging words → +3 ATK ("You're the strongest person I know!")
  - Tactical advice → +15 HIT/+10 CRIT ("Watch his left side, he always drops his guard")
  - Emotional support → +3 DEF/+3 RES ("I won't let anything happen to you. I promise.")
- Talking to the SAME ally multiple times in a chapter builds **affection**:
  - 3 talks: Permanent +2 to a random stat for that chapter
  - 5 talks: **Plot Armor** — next lethal hit leaves ally at 1 HP instead. Lira's love literally saves lives. Once per ally, once per chapter.

**Talk — Enemy Targeting (Persuasion)**:
- Persuasion check: Lira's MAG + LCK vs enemy RES
  - **Success**: Enemy is **Confused** — skips next action entirely. "Wait... why AM I fighting you?"
  - **Critical success** (low chance, ~15%): Enemy **defects** — becomes a green unit ally for 2 turns. Fights alongside you. Can't be controlled directly.
  - **Failure**: Nothing. Enemy annoyed. +10% damage on their next attack against Lira.
- Bosses immune. Corrupted enemies immune. Regular soldiers? Fair game.

**Genre Debuff — Pacifist Protocol**: Lira has no Attack action. Cannot deal direct damage through any ability. If enemies attack her, she defends at half power. "I'm not a fighter. I'm a storyteller."

### Speedrunner — Ren

| Action | Condition | Mechanic | Details |
|--------|-----------|----------|---------|
| **Skip** | Chapter start only, 1/chapter | Remove one scripted enemy spawn wave entirely. Fewer enemies, faster clear. Skipped enemies give no EXP, no items, no LOOP to anyone. | "We don't need to fight them. They don't drop anything good." Ren is routing the map like a speedrunner optimizing splits. |
| **Script Break** | Any time, **1/GAME** | After ANY combat resolves (ally or enemy attacking), Ren rewinds that combat. The attack never happened. HP restored, positions restored, turn continues as if that combat didn't exist. | The single most powerful ability in the game. One use. Total. For the entire 4-chapter playthrough. When do you use it? Save Kael in Ch3? Survive the Ch4 boss? Fix a Ch1 mistake you didn't know mattered? "I've seen this 346 times. I know which moment to change. I just don't know if I should." |
| **Quick Reset** | Passive, triggered on fatal damage | When Ren hits 0 HP and has ≥50 LOOP: option appears "Reset to start of turn?" Costs 50 LOOP. ALL actions this player phase are undone. All units return to phase-start positions + HP. | Not a save/load — Ren is burning cycle memories to force a local time rewind. Other characters feel déjà vu: "Didn't we already... never mind." |

**Passive — Route Optimization**: Ren can move through ally-occupied tiles (other characters block movement). +1 MOV when moving toward an objective tile (throne/village/chest). He's optimized his pathing over 347 runs.

**Passive — Pre-Move Knowledge**: At chapter start, Ren can reveal 3 of the following (player chooses which 3):
- All chest/village/secret tile locations
- All enemy starting positions (even in fog)
- Turn number when reinforcements arrive
- Boss's stat block
- Hidden item drop locations

**Genre Debuff — Speedrunner's Curse**: -20% EXP gain (he's done it all). If Ren stays on the same tile for 3+ consecutive turns without moving, -5 all stats until he moves. His optimization brain panics at inefficiency. "Why are we CAMPING? Move. MOVE."

### Enemy SRPG — Voss

| Action | Condition | Mechanic | Details |
|--------|-----------|----------|---------|
| **Override** | Adjacent to enemy | Choose one of three commands to force on the enemy: **Freeze** (skip next action), **Redirect** (change their target to a different unit — player chooses who), or **Overload** (enemy attacks immediately at 1.5x power, then stunned 2 turns). | "I'm still in the system. I can still give orders." 4-turn cooldown. |
| **Formation Break** | Active, 3-tile range | Reveal one enemy's EXACT movement plan — the specific tile they'll move to AND who they'll attack. Displayed as a ghost overlay on the map. If a player unit occupies that destination tile before the enemy moves, the enemy's AI crashes — they skip their turn entirely. | "Third squad always pushes left. Block tile 5,3 and their whole plan falls apart." 2-turn cooldown. |
| **Faction Shift** | 1/chapter | Voss reconnects to the enemy system for 1 turn. During that turn: moves during ENEMY PHASE, treated as enemy (enemies won't attack him, enemy healers heal him), can move inside enemy formation and attack from within. BUT allies also treat him as enemy — friendly fire possible. After: returns to player side, -10 HP from data corruption. | "I'm going back in. One turn. Don't attack me." |

**Passive — Dead Code Execution**: Voss can interact with tiles where an enemy unit died earlier in the chapter. Standing on a dead tile:
- See what items the fallen enemy was carrying (some have hidden drops)
- Gain +3 to whatever stat the dead enemy was highest in, for 2 turns (absorbing residual data)
- If the dead enemy was a boss: gain their signature ability for 1 use

**Passive — Defector's Resolve**: +3 ATK when fighting enemy soldiers (his former unit type). He knows their training, stances, and weaknesses — because they were his.

**Genre Debuff — Faction Ghost**: Ally staff users heal Voss for 5 less HP (code still flags him as enemy). Voss can't enter "safe" tiles (villages, forts) — the tile rejects his faction data. If Lira uses Talk on Voss, it triggers the enemy persuasion dialogue instead of ally support. The System keeps trying to re-recruit him.

### Analyst — Senna

| Action | Condition | Mechanic | Details |
|--------|-----------|----------|---------|
| **Forecast** | Active, any time | Select any tile. Full simulation: what would happen if a unit stood there — total incoming damage from all enemies in range, number of attacks, survival probability. | "If Kael stands HERE: 12 from the archer, 8 from the soldier, survives at 4 HP. One tile left: only the archer reaches. Move left." 2-turn cooldown. Makes Senna the tactical brain — she doesn't fight well but makes everyone else fight perfectly. |
| **Seed Read** | Ch2+ only | Preview the next 3 RNG roll results as numbers. "73, 41, 88." Player can deduce which attacks will hit/miss based on displayed hit rates. After Ch2's seed corruption event: only 70% accurate — one of the three numbers might be wrong. Which one? | "The sequence is 73, 41, 88. ...I think. The third one felt fuzzy." 3-turn cooldown. |
| **Debug Mode** | 1/chapter | Activate on one enemy. For 3 turns, that enemy's FULL internal state is visible: AI decision tree, exact hit/crit/damage for every possible action, movement priorities, retreat threshold. | "I've opened their process monitor. Everything they're thinking is on screen." |
| **Patch** | 1/chapter | "Fix" one corrupted game element: restore a glitched terrain tile, remove impossible stats from a corrupted enemy (999 HP → real HP), stabilize a flickering tile. In Ch4: Patch is how she strips ???_CORRUPTED's corruption layers. | "I'm not crashing the system. I'm applying a hotfix." |

**Passive — Exploit**: If Senna attacks an enemy whose full stats are visible (Debug Mode, AWR reveal, or any other source), she deals +25% damage. She targets gaps in their data.

**Genre Debuff — Data Dependency**: -15% hit rate when attacking enemies whose stats are NOT visible (no reveal active). If a combat result contradicts her Seed Read prediction (predicted hit, got miss), -5 all stats for 1 turn. Logic damage — her brain short-circuits on inconsistency.

### SRPG Pure — Kael

Kael has NO genre actions. His action menu is: Attack, Wait, Item. Standard SRPG. Nothing unique.

That IS his uniqueness. He's the only character playing the game the way it was designed. No bugs, no genre bleed, no meta-abilities. Just a cavalier with a lance.

**Passive — True Strike**: Kael's attacks can never be reduced below 1 damage, even against max-DEF enemies. His conviction pierces any defense.

**Passive — Genre Anchor**: While Kael is alive, all allies' SYNC drift is reduced by 2 per chapter (slower genre erosion). His 100% alignment stabilizes everyone around him. When he dies in Ch3, the anchor is gone — everyone's SYNC drops -10 immediately.

---

## SYNC (Genre Alignment)

A percentage (0-100%) measuring how well a unit fits the SRPG genre. Affects BOTH standard SRPG combat performance AND genre ability power. The core tension: adapting to the SRPG makes you a better standard fighter but weakens your unique genre abilities.

### SYNC Effects Table

| SYNC | SRPG Combat | Genre Ability Power | State |
|------|------------|-------------------|-------|
| 0-30% | -20% hit/avoid/damage | **Maximum** — all genre abilities at full power + bonus effects | "I don't belong in this game." |
| 31-50% | -10% hit/avoid/damage | **Strong** — full power, no bonuses | "I'm starting to get it, but MY game is better." |
| 51-70% | Normal — no penalty, no bonus | **Functional** — abilities work but all cooldowns +1 turn | "Okay, this game isn't so bad." |
| 71-90% | +5% hit/avoid | **Fading** — abilities at 70% power, cooldowns +2 turns | "I think I'm becoming one of them." |
| 91-100% | +10% hit/avoid | **Gone** — genre abilities locked. Standard SRPG unit. | "I forgot what combo meters were." |

### SYNC Change Events

| Event | SYNC Change | Notes |
|-------|------------|-------|
| Level up | +3 | Natural adaptation to the SRPG |
| Complete a chapter | +5 | Surviving an SRPG chapter makes you more SRPG |
| Use a genre action | -4 | Reinforcing original genre identity |
| Use a standard SRPG action (Attack/Wait) | +1 | Each normal action pulls toward alignment |
| Witness a genre leak (Ch3+) | -3 | System instability reminds you of other genres |
| Kael dies (Ch3) | -10 ALL | The genre anchor is removed. Everyone destabilizes. |
| Genre Fusion choice (Ch4) | Locks at current value | Final identity crystallized |

### SYNC Per Character

| Character | Start | Natural Drift | The Dilemma |
|-----------|-------|--------------|-------------|
| **Kael** | 100% | Fixed. Always 100%. | No dilemma. He IS the SRPG. No genre actions, no debuffs. His death removes the anchor. |
| **Ren** | 90% | Rises slowly → 95-100% | If he hits 100%, Script Break locks. Keep him below 91% to preserve his most powerful ability — but he takes a slight SRPG penalty. |
| **Senna** | 85% | Rises fast → 95%+ | Seed Read is already unreliable post-Ch2. Losing her genre abilities isn't catastrophic. Let her align and become a strong base mage. |
| **Voss** | 65% | Slow rise → 70-75% | Mid-range by design. Between genres, between factions. Override and Formation Break fade slightly but never vanish completely. |
| **Bram** | 35% | Wants to rise → 50-60% | THE major decision. Keep using Punish/Taunt/Rage Art to stay at 35-45% (full fighting game power but -10% SRPG penalty)? Or stop using them, let SYNC rise to 70%+, and gain a solid reliable fighter who unlocks Wait but loses everything unique? |
| **Lira** | 25% | Rises very slowly → 35-45% | Even MORE critical than Bram. Her genre actions ARE her entire kit — she can't Attack. If SYNC passes 70%, she gains Attack but loses Talk, Read the Room, Route Lock, Save Point. She becomes a generic cleric with a staff. Do you want that? |

### SYNC Narrative Triggers

Certain SYNC thresholds trigger unique dialogue:

**Bram at 70%+ SYNC**:
- "I... I don't remember what frame data is. Is that normal?"
- "Guys, I just WAITED. Voluntarily. Something's wrong with me."
- (Wait is unlocked for Bram at SYNC 70%+ — he can finally stand still)

**Bram at 30%- SYNC**:
- "The weapon triangle IS the matchup chart. This game was a fighting game ALL ALONG."
- "EVERYONE is playing the wrong genre. Not me."

**Lira at 60%+ SYNC**:
- "I picked up the sword today. Just to see how it felt. ...Wrong. But also right?"
- "I don't need an affection meter anymore. I can just... tell."

**Lira at 20%- SYNC**:
- "I've mapped everyone's relationship chart. Ren and Senna: slow-burn. Bram: comic relief route. Voss: hidden route."
- "Route Lock is the most important ability here and NONE of you appreciate it."

---

## Genre Bleed — Ch3+ System Degradation

As the System breaks down, genre boundaries erode. Two mechanics:

### Genre Leak (Ch3+)

Characters randomly get **1-turn access** to another character's genre action. It's a glitch — genre assignment code is failing.

- Bram gets Heart-to-Heart for 1 turn. "Do I... TALK to him?? With WORDS??"
- Kael gets Taunt for 1 turn. Uses it sincerely: "Face me, villain!" Bram: "HE'S A NATURAL."
- Senna gets Rage Art. She's horrified: "I am NOT doing that. That's not MATH."

### Genre Fusion (Ch4 Final Battle)

After the System starts losing control, each character can permanently adopt ONE action from any other character's genre set. Player chooses.

This is the final build. Characters are no longer genre-locked. Lira COULD take Attack. She could finally fight. Does she? Or take Forecast and become ultimate support? Bram could take Route Lock and protect an ally. Voss could take Seed Read and combine it with Formation Break.

The player decides who these characters become when the rules stop applying.

---

## Body Targeting System (Unlocked Ch2+)

Discovered by Senna in Ch2 by reading enemy unit data structure. A universal combat upgrade — when attacking, the player can choose WHERE to hit.

| Target | Hit Mod | Damage Mod | Special Effect |
|--------|---------|-----------|----------------|
| **Body** (default) | Normal | Normal | None — standard attack |
| **Head** | -25% hit | +50% damage | If hits: target is **Dazed** — -10 hit rate for 2 turns |
| **Weapon Arm** | -15% hit | -20% damage | If hits: target's ATK halved for 1 turn |
| **Legs** | -10% hit | -30% damage | If hits: target's MOV halved (round down) for 2 turns |
| **Weak Point** | -35% hit | +100% damage | Only available if enemy stats are fully revealed (Debug Mode, high AWR). Near-impossible to land but devastating. |

### Body Targeting × Genre Interactions

- **Bram**: His timing system compensates for hit penalties. Perfect Timing on a Head shot offsets the -25% hit. He's the precision striker — if your fingers are fast enough.
- **Lira**: Can't attack, can't use body targeting. BUT Read the Room reveals which body part each enemy guards LEAST — giving allies a hint about optimal targeting.
- **Senna**: Exploit passive (+25% on revealed enemies) stacks with Weak Point (+100%). Debug Mode + Weak Point + Exploit = absurd damage, but -35% hit means gambling. Unless Seed Read says the next roll is high...
- **Voss**: Dead Code Execution absorbs fallen enemy "body data" — body targeting hit penalties halved for 2 turns after standing on a death tile. "I know where their armor is thin. I wore the same armor."
- **Ren**: 347 cycles of experience. Permanent -5% reduction to ALL body targeting hit penalties. "I've hit that soldier's weapon arm about 200 times."

---

## Stat Interactions Summary

How all four meta-stats interact in practice:

| Situation | AWR | LOOP | GENRE | SYNC |
|-----------|-----|------|-------|------|
| Combat forecast detail | Higher AWR = more info visible | — | Senna's Forecast shows simulation data | High SYNC = standard forecast |
| Before committing attack | Decoded AWR = peek at result | Déjà Vu Strike = guaranteed hit+crit | Bram's timing = player skill modifier | Low SYNC = genre action alternatives to Attack |
| During enemy phase | — | Recall previews enemy movements | Bram's Block/Perfect Block = active defense | — |
| Ally near death | — | Last Words = survive at cost of ALL LOOP | Lira's Route Lock = redirect fatal damage | — |
| Ally actually dies | ALL units +8-12 AWR | ALL units +8 LOOP | — | ALL units -10 SYNC (destabilize) |
| Ch4 boss fight | High AWR reveals cycling weapon type | High remaining LOOP = harder boss phase | Senna's Patch strips corruption layers | Low SYNC genre abilities are key to the exploit |

---

## Example Stat Blocks

```
Ren — Lord
HP: 22  STR: 8  MAG: 2  SPD: 9  DEF: 7  RES: 3  SKL: 10  LCK: 5  MOV: 5
AWR: 95    LOOP: 347    SYNC: 90%    GENRE: Speedrunner
Actions: Attack | Skip | Item | Seize | Wait
Special: Script Break (1/game) | Quick Reset (50 LOOP) | Route Optimization
Debuff: -20% EXP | -5 all stats if stationary 3+ turns
```

```
Kael — Cavalier
HP: 24  STR: 9  MAG: 1  SPD: 8  DEF: 8  RES: 2  SKL: 7  LCK: 6  MOV: 7
AWR: 0     LOOP: 0      SYNC: 100%   GENRE: SRPG (Pure)
Actions: Attack | Wait | Item
Passive: True Strike (min 1 dmg) | Genre Anchor (allies -2 SYNC drift/chapter)
Debuff: None
```

```
Senna — Mage
HP: 19  STR: 2  MAG: 10 SPD: 7  DEF: 3  RES: 8  SKL: 9  LCK: 4  MOV: 5
AWR: 25    LOOP: 0      SYNC: 85%    GENRE: Analyst
Actions: Attack | Forecast | Seed Read | Debug Mode | Patch | Item | Wait
Passive: Exploit (+25% dmg on revealed enemies)
Debuff: -15% hit on unrevealed enemies | Logic Damage (-5 all stats 1 turn on prediction failure)
```

```
Bram — Fighter
HP: 28  STR: 12  MAG: 0  SPD: 6  DEF: 8  RES: 1  SKL: 5  LCK: 3  MOV: 5
AWR: 35    LOOP: 0      SYNC: 35%    GENRE: Fighting Game
Actions: Attack (with timing) | Punish | Taunt | Rage Art | Block | Item
Passive: Combo System (bonus turn on kill, up to 3 chain)
Debuff: Cannot Wait | -10% hit/avoid/damage (low SYNC)
```

```
Lira — Cleric
HP: 18  STR: 1  MAG: 8  SPD: 7  DEF: 3  RES: 9  SKL: 6  LCK: 8  MOV: 5
AWR: 30    LOOP: 0      SYNC: 25%    GENRE: Visual Novel
Actions: Talk | Heal | Read the Room | Route Lock | Save Point | Item | Wait
Passive: Support Affection system (3 talks = +2 stat, 5 talks = Plot Armor)
Debuff: Cannot Attack | -20% hit/avoid/damage (lowest SYNC)
```

```
Voss — Soldier
HP: 23  STR: 8  MAG: 1  SPD: 5  DEF: 10  RES: 2  SKL: 7  LCK: 3  MOV: 5
AWR: 5→35  LOOP: 150    SYNC: 65%    GENRE: Enemy SRPG
Actions: Attack | Override | Formation Break | Faction Shift | Item | Wait
Passive: Dead Code Execution | Defector's Resolve (+3 ATK vs soldiers)
Debuff: -5 heal from allies | Can't enter villages/forts
```

---

## Open Questions

- **Stat caps**: No global or per-class caps exist yet. FE typically caps at 20-30 unpromoted, 25-40 promoted. Should we add them?
- **Weight / Attack Speed**: Weapons have a `weight` field but it's unused. Classic FE: AS = SPD - (weapon weight - STR). Add this?
- **AWR cap behavior**: Should AWR ever exceed 100? What happens if system corruption pushes it past the max?
- **LOOP negative**: Can LOOP go negative? What happens if you overspend? (Narrative potential: negative LOOP = you're borrowing memories from FUTURE cycles that will never happen)
- **SYNC floor**: Should SYNC have a minimum (e.g., 10%)? Or can a character reach 0% and become fully their native genre with zero SRPG functionality?
- **Body targeting on magic**: Do magic attacks use the same body targeting system? Or is magic inherently "formless" and always hits Body?
- **Bram timing difficulty**: Should the timing windows be configurable (easy/normal/hard)? Accessibility concern — not all players have fast reaction times.
- **Genre Fusion balance**: In Ch4, if everyone picks the strongest action from another genre, does it break the game? Need constraints — maybe each action can only be taken by ONE character (first pick locks it out for others).
