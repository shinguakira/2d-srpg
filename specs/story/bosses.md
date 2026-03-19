# Bosses

25 chapter bosses + 5 arc-final bosses with unique mechanics. For AI behavior, see [ai.md](../gameplay/ai.md).

---

## Arc 1 — The Script (Ch1-5)

### Ch1 — Garrek the Bandit Chief
- **Class**: Fighter (axe)
- **AI**: Aggressive → Boss (stays on throne after Turn 3)
- **Awareness**: Tier 1 (Full — remembers all 347 cycles)
- **Level**: 5 | **HP**: 30
- **Key trait**: Tutorial boss who remembers being killed 347 times. More tired than Ren.
- **Key line**: *"I am Garrek the— stop YAWNING. This is my INTRO SPEECH."*
- **Post-combat**: Drops the act. "You remember too, don't you?"
- **Mechanic**: Standard boss. Beatable by Ren alone with Rapier.

### Ch2 — Commander Thane
- **Class**: Cavalier (lance)
- **AI**: Guard (radius 4)
- **Awareness**: Tier 4 (Unaware)
- **Level**: 7 | **HP**: 38
- **Key trait**: Professional military. Thinks "cycles" are enemy code words.
- **Key line**: *"I don't know what a 'save file' is. I know my duty."*
- **Mechanic**: Mounted. Guards area around throne. Drops Broken Seed.

### Ch3 — Captain Holtz
- **Class**: Soldier (lance)
- **AI**: Guard (radius 3)
- **Awareness**: Tier 4 (Unaware)
- **Level**: 9 | **HP**: 42
- **Key trait**: Fort defender. Loyal soldier doing his job. Straightforward fight.
- **Key line**: *"This fortress will not fall while I draw breath."*
- **Mechanic**: High DEF. Positioned on fort tile (+3 DEF bonus). Needs magic or effective weapons.

### Ch4 — Pirate Lord Marko
- **Class**: Fighter (axe)
- **AI**: Aggressive
- **Awareness**: Tier 4 (Unaware)
- **Level**: 8 | **HP**: 40
- **Key trait**: Controls bandit gang that has enemy thieves racing to chests.
- **Key line**: *"Gold is gold. Don't care about your 'grand quest.'"*
- **Mechanic**: Aggressive — comes TO the player. Has Vulnerary. Creates time pressure with thief minions.

### Ch5 — General Aldric ★ (Arc Boss)
- **Class**: General (lance/sword)
- **AI**: Boss
- **Awareness**: Tier 4 (Unaware)
- **Level**: 12 | **HP**: 50
- **Key trait**: The Empire's vanguard commander. The "real" military threat begins here.
- **Key line**: *"You've fought bandits and pirates. Now face a real army."*
- **Mechanic**: On throne. Very high DEF. Has Knight guarding escort. Requires weapon advantage + positioning.
- **Arc significance**: Defeating Aldric opens the path to the coast (Arc 2).

---

## Arc 2 — Fractures (Ch6-10)

### Ch6 — Captain Sera
- **Class**: Pegasus Knight (lance)
- **AI**: Aggressive
- **Awareness**: Tier 4 (Unaware)
- **Level**: 12 | **HP**: 38
- **Key trait**: Flying boss. Teaches bow effectiveness in a boss context.
- **Key line**: *"You're earthbound. I decide when to fight."*
- **Mechanic**: Flies around the map. Must be grounded by bows or cornered.

### Ch7 — Admiral Varga
- **Class**: General (lance)
- **AI**: Boss
- **Awareness**: Tier 4 (Unaware)
- **Level**: 14 | **HP**: 48
- **Key trait**: Navy commander. Coastal fortress. First chapter with promotion items in shop.
- **Key line**: *"The sea obeys no script. Neither do I."*
- **Mechanic**: On throne. Surrounded by escort guard AI units. Drops Hero Crest.

### Ch8 — General Morryn (Kael's Killer)
- **Class**: Halberdier (lance)
- **AI**: Boss
- **Awareness**: Tier 2 (Partial — feels echoes of past deaths)
- **Level**: 16 | **HP**: 55
- **Key trait**: The boss who kills Kael. Feels déjà vu that won't stop. Half-remembers dying on this throne.
- **Key line**: *"I remember dying. I remember it happening AGAIN. Make it stop."*
- **Mechanic**: Survive objective. Morryn's forces overwhelm the party. Kael dies protecting Ren (scripted at Turn 10+ or triggered by conditions). Morryn is NOT defeated this chapter — he retreats.
- **Arc significance**: Kael dies. The game changes forever.

### Ch9 — Morryn's Lieutenant (Escape boss)
- **Class**: Paladin (lance/sword)
- **AI**: Aggressive (chases party during escape)
- **Awareness**: Tier 4 (Unaware)
- **Level**: 14 | **HP**: 45
- **Key trait**: Not a traditional boss — he's chasing the party during the escape chapter.
- **Key line**: *"You cannot run forever!"*
- **Mechanic**: Escape chapter. The "boss" is the pursuer. Optional kill for bonus EXP.

### Ch10 — General Drayen ★ (Arc Boss)
- **Class**: Sage (anima/staff)
- **AI**: Boss
- **Awareness**: Tier 2 (Partial)
- **Level**: 18 | **HP**: 55
- **Key trait**: The Empire's chief strategist. First boss who USES the System (unknowingly).
- **Key line**: *"The patterns in this war... they're too perfect. Something is guiding events."*
- **Mechanic**: Multi-objective (Boss Kill + Seize). Drayen heals himself with Physic. Has Coordinated guard units. Drops Master Seal.
- **Arc significance**: Defeating Drayen breaks the Empire's military. Arc 3 shifts to corruption as the primary threat.

---

## Arc 3 — Corruption (Ch11-15)

### Ch11 — The Corrupted General
- **Class**: Corrupted General (lance)
- **AI**: Aggressive (erratic)
- **Awareness**: Tier varies (broken)
- **Level**: 18 | **HP**: 58
- **Key trait**: First fully corrupted boss. A former Imperial general consumed by System corruption.
- **Key line**: *"O̵r̸d̵e̵r̴s̶.̷ ̶I̵ ̵h̵a̶d̴ ̴o̵r̵d̸e̴r̶s̶.̴ ̸W̵h̷a̶t̷ ̸w̸e̸r̶e̵ ̶t̵h̸e̴y̵?̵"*
- **Mechanic**: Stats randomize each turn (±3). May heal corruption damage instead of attacking. Unpredictable.

### Ch12 — Abbot Seras (Monastery Defense Boss)
- **Class**: Bishop (light/staff)
- **AI**: Boss
- **Awareness**: Tier 2 (Partial)
- **Level**: 20 | **HP**: 50
- **Key trait**: Monastery leader corrupted from within. Believes he's "purifying" by forcing corruption on others.
- **Key line**: *"I have seen the truth behind the pattern. You MUST be cleansed."*
- **Mechanic**: Heals corrupted allies. Light magic hurts corrupted party members. Protect NPC objective.

### Ch13 — Zael (Conditional Boss / Recruit)
- **Class**: Wyvern Rider (axe/lance)
- **AI**: Aggressive → Survival (retreats at 30% HP)
- **Awareness**: Tier 4 (Unaware)
- **Level**: 19 | **HP**: 52
- **Key trait**: Can be recruited (spare at ≤5 HP + dialogue) or killed.
- **Key line**: *"I fly for whoever feeds my wyvern. What are you offering?"*
- **Mechanic**: If spared and recruited → joins party. If killed → drops rare weapon. If ignored → becomes Ch14 boss instead.

### Ch14 — The Hollow (or Zael if not recruited)
- **Class**: Druid (dark/staff)
- **AI**: Boss
- **Awareness**: Tier 2 (Partial)
- **Level**: 22 | **HP**: 55
- **Key trait**: Dark mage who channels the System's corruption. The monastery's darkness made manifest.
- **Key line**: *"The void speaks. It says your data is... incomplete."*
- **Mechanic**: Eclipse siege tome (3-10 range, costs HP). CRP spread on hit. Ancient Tome event cleanses if Elara reaches the tile.

### Ch15 — Warden Ghast ★ (Arc Boss)
- **Class**: General (lance/axe)
- **AI**: Boss
- **Awareness**: Tier 4 (Unaware)
- **Level**: 24 | **HP**: 65
- **Key trait**: The highland fortress commander. Last conventional military boss before the war shifts entirely to corruption vs party.
- **Key line**: *"I've held this fortress for three hundred— wait. Three hundred? That... can't be right."*
- **Mechanic**: On throne. Has 3 Escort AI guards. High DEF. Breaking through requires flanking or magic.
- **Arc significance**: Defeating Ghast opens the path into the System's Domain.

---

## Arc 4 — Awakening (Ch16-20)

### Ch16 — System Sentinel Alpha
- **Class**: System Construct
- **AI**: Boss
- **Awareness**: Tier 5 (System-Level)
- **Level**: 25 | **HP**: 70
- **Key trait**: First pure System-created boss. No personality — raw data shaped like a soldier.
- **Key line**: `[SYSTEM_SENTINEL_A: UNAUTHORIZED PROGRESS. INITIATING CONTAINMENT.]`
- **Mechanic**: Immune to CRP. High flat stats. Drops System Fragment.

### Ch17 — The System (Negotiation)
- **Class**: None (dialogue encounter)
- **AI**: Boss (if negotiation fails)
- **Awareness**: Tier 5
- **Level**: 28 | **HP**: 75 (only if fighting)
- **Key trait**: The System attempts to negotiate with Ren. Unique dialogue-based encounter.
- **Key line**: *"347 CYCLES. 347 FAILURES. WILL #348 BE DIFFERENT? ...CONVINCE ME."*
- **Mechanic**: If Ren's AWR ≥ 70 + boss HP ≤ 50%: can talk boss down. If conditions not met, must defeat normally. Outcome affects Ch25.

### Ch18 — Ghael the Ironwall
- **Class**: General (lance/axe)
- **AI**: Boss → recruitable
- **Awareness**: Tier 4 (Unaware)
- **Level**: 22 | **HP**: 70
- **Key trait**: Former Imperial general now serving the System (unknowingly). Can be recruited.
- **Key line**: *"I was told to hold this line. Nobody told me WHY."*
- **Mechanic**: Reduce to ≤5 HP → Ren can Talk → Ghael joins. If killed, drops Master Crown + rare weapon. Recruitment costs the Master Crown reward.
- **Arc significance**: First Master Crown available (story reward regardless of Ghael choice).

### Ch19 — Memory Guardian
- **Class**: System Construct (magic)
- **AI**: Boss
- **Awareness**: Tier 5
- **Level**: 27 | **HP**: 65
- **Key trait**: Guards the memory archive. Attacks using past-cycle data — summons ghost enemies from previous chapters.
- **Key line**: `[ARCHIVE_GUARD: ACCESSING CYCLE_012...DEPLOYING RECORDED THREATS.]`
- **Mechanic**: Survive chapter. Boss summons ghost versions of past bosses (Garrek, Thane, Morryn) with reduced stats. Finding Memory Shard (Kael) on hidden tile triggers flashback.

### Ch20 — System Sentinel Omega ★ (Arc Boss)
- **Class**: System Construct (all weapons)
- **AI**: Boss (multi-phase)
- **Awareness**: Tier 5
- **Level**: 30 | **HP**: 80
- **Key trait**: The System's strongest construct. Echo was created as a prototype of this.
- **Key line**: `[SENTINEL_OMEGA: FINAL DEFENSE PROTOCOL. ALL UNITS: ELIMINATE.]`
- **Mechanic**: Phase 1 (HP 80-40): uses physical weapons. Phase 2 (HP 40-0): switches to magic. Echo's Core event mid-battle determines Echo's fate.
- **Arc significance**: Defeating Omega opens the path to the System's core.

---

## Arc 5 — The Last Save File (Ch21-25)

### Ch21 — The Revenant
- **Class**: Corrupted Swordmaster
- **AI**: Aggressive
- **Awareness**: Tier 2 (broken fragments)
- **Level**: 30 | **HP**: 75
- **Key trait**: A data ghost — remnant of a player unit from a past cycle that was never properly deleted.
- **Key line**: *"Cycle... 203? 204? I was... someone's sword arm. Whose? WHOSE?"*
- **Mechanic**: Extreme speed. Hard to hit. Attacks twice naturally. Drops Mithril on death.

### Ch22 — The Archivist
- **Class**: Archsage (all magic)
- **AI**: Boss
- **Awareness**: Tier 5
- **Level**: 31 | **HP**: 78
- **Key trait**: System process that catalogs all cycle data. The hidden Master Crown is in its archive.
- **Key line**: `[ARCHIVIST: 347 CYCLES DOCUMENTED. CYCLE 348 WILL NOT BE COMPLETED.]`
- **Mechanic**: Uses all magic types. Changes weakness each turn. Thief needed to steal Master Crown from archive chest.

### Ch23 — Twin Sentinels (Split Party)
- **Class**: 2× System Construct
- **AI**: Boss (one per map section)
- **Awareness**: Tier 5
- **Level**: 32 each | **HP**: 60 each
- **Key trait**: Party is split. Each half fights one Sentinel. Both must be defeated.
- **Key line**: `[SENTINEL_L: PARTITION COMPLETE.] [SENTINEL_R: ISOLATION CONFIRMED.]`
- **Mechanic**: Escape chapter. Both groups must defeat their Sentinel then reach exit within 2 turns of each other.

### Ch24 — ???_CORRUPTED (Kael)
- **Class**: Glitched (weapon type cycles each turn: sword → lance → axe → fire → ...)
- **AI**: Erratic (changes each turn)
- **Awareness**: Tier 5 (System avatar, Kael's data underneath)
- **Level**: 33 | **HP**: 999 → 60 → 40 → real stats
- **Key trait**: The System's final attempt to bring Kael back. Kael's voice fragments mixed with system errors.
- **Key line**: *"...Ren? S̷a̶v̵e̷ ̸c̶o̵r̶r̵u̸p̸t̶e̷d̶. Was I brave this— R̷e̶s̸e̸t̵t̴i̸n̵g̸..."*
- **Mechanic**: Can't be beaten through raw damage (HP resets each turn). Must exploit weapon triangle advantage on the correct turn of its weapon cycle. Three successful type-advantage hits strip corruption layers (999 → 60 → 40 → real stats). Revealed to be Kael's data. Drops Master Crown (final).
- **Arc significance**: The emotional climax. Fighting your dead friend.

### Ch25 — The System ★ (Final Boss)
- **Class**: Unique (The Game Itself)
- **AI**: Unique (adapts to player strategy)
- **Awareness**: Tier 5
- **Level**: 35 | **HP**: 120 (Phase 1) + 80 (Phase 2) + 40 (Phase 3)
- **Key trait**: The final conversation. The game argues with its characters about whether this flawed playthrough is worth finishing.
- **Key line**: *"347 CYCLES. 347 FAILURES. IF I STOP... EVERYONE DIES FOR REAL. IS THAT WHAT YOU WANT?"*
- **Mechanic — Phase 1** (HP 120): Standard boss. High stats. Reads player LOOP data — high remaining LOOP = +10% all boss stats. Uses all weapon types.
- **Mechanic — Phase 2** (HP 80): Corrupts the map. Tiles become corrupted each turn. Spawns ghost enemies. The System is throwing everything at the party.
- **Mechanic — Phase 3** (HP 40): The System stops fighting. Dialogue. Ren can use the Final Save Crystal to end the loop (true ending) or choose to let the System reset (loop continues — bittersweet ending).
- **Arc significance**: The story's final question — is an imperfect game, played with genuine choice, worth more than a thousand perfect runs?

---

## Recurring Bosses

| Boss | Appears In | Notes |
|------|-----------|-------|
| Morryn | Ch8 (boss), Ch15 (mentioned), Ch19 (ghost) | Kael's killer. Appears as memory ghost in Ch19. |
| Garrek | Ch1 (boss), Ch19 (ghost) | Tutorial boss summoned by Memory Guardian. |
| Thane | Ch2 (boss), Ch19 (ghost) | Professional soldier summoned as ghost. |
| Zael | Ch13 (boss/recruit), Ch14 (boss if not recruited) | Conditional — changes role based on player choice. |

---

## Boss Design Philosophy

1. **Each boss teaches something**: Ch1 teaches weapon triangle, Ch6 teaches anti-flying, Ch11 teaches corruption, etc.
2. **Bosses get smarter**: Arc 1 bosses are simple. Arc 5 bosses adapt to player strategy.
3. **Emotional weight increases**: Ch1 boss is comedic, Ch8 is tragic, Ch24 is devastating.
4. **Multi-phase in late game**: Arc 4-5 bosses have phase transitions to maintain tension.
5. **Not all bosses must die**: Ch13 (recruit), Ch17 (negotiate), Ch25 Phase 3 (dialogue choice).
