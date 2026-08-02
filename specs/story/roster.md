# Character Roster — 20 Playable Units

Master roster for the 25-chapter campaign. 6 existing + 14 new characters.

See [arc-structure.md](arc-structure.md) for chapter-by-chapter narrative context.
See individual character files in `characters/` for detailed profiles.

---

## Full Roster

| # | Name | Class | Joins | Leaves | Awareness Tier | Arc Role |
|---|------|-------|-------|--------|---------------|----------|
| 1 | **Ren** | Lord | Ch1 | — | Tier 1 (Full) | Protagonist. 347 cycles of memory. Must survive every chapter. |
| 2 | **Kael** | Cavalier | Ch1 | **Ch8 (dies)** | Tier 4 (Unaware) | The loyal one. His death is the emotional turning point. |
| 3 | **Senna** | Mage | Ch1 | — | Tier 2 (Partial) | The scientist. Decodes the system, finds exploits, patches reality. |
| 4 | **Bram** | Fighter | Ch1 | — | Tier 3 (Genre-Displaced) | Thinks it's a fighting game. Chaos incarnate. Comic relief with depth. |
| 5 | **Lira** | Cleric | Ch1 | — | Tier 3 (Genre-Displaced) | Thinks it's a dating sim. The emotional heart. Cannot attack. |
| 6 | **Voss** | Soldier | Ch2 | — | Tier 4 → 2 (grows) | Former enemy. 300 cycles standing on one tile. Weaponizes patience. |
| 7 | **Nira** | Archer | Ch3 | — | Tier 4 (Unaware) | Sharpshooter rescued from bandits. Pragmatic, quiet, reliable. |
| 8 | **Coda** | Thief | Ch4 | — | Tier 3 (Genre-Displaced) | Thinks it's a stealth game. Steals "data" instead of gold. |
| 9 | **Yuel** | Pegasus Knight | Ch5 | — | Tier 4 → 3 (grows) | From a corrupted region. Saw the sky glitch. Can't unsee it. |
| 10 | **Rook** | Mercenary | Ch6 | — | Tier 2 (Partial) | 200 cycles of awareness. Sells his sword to whichever side seems "real." |
| 11 | **Faye** | Troubadour | Ch6 | — | Tier 4 (Unaware) | Mounted healer. Genuinely kind. Doesn't need to know the truth to care. |
| 12 | **Orin** | Dancer | Ch9 | — | Tier 3 (Genre-Displaced) | Thinks it's a musical. Dances to "change the scene." Refresh ability. |
| 13 | **Kira** | Shaman | Ch11 | — | Tier 2 (Partial) | Ex-dark-mage. Was spreading corruption before switching sides. |
| 14 | **Zael** | Wyvern Rider | Ch13 | Conditional | Tier 4 → varies | Partially corrupted (CRP 40). A ticking bomb. Can be saved or lost. |
| 15 | **Elara** | Monk | Ch14 | — | Tier 2 (Partial) | Monastery protector. Light magic fights corruption. Theological backbone. |
| 16 | **Ghael** | Armor Knight | Ch18 | — | Tier 3 → 2 (grows) | Former boss who switched sides after learning the System's truth. |
| 17 | **Echo** | Construct | Ch20 | — | Tier 5 (System-Level) | Created by the System but gained free will. The System's "mistake." |

**Total**: 17 permanent + Kael (dies Ch8) + Zael (conditional) + 1 corruption loss (Ch12) = **20 slots, 15-16 active endgame**

---

## Departure Timeline

| Chapter | Who | How | Preventable? |
|---------|-----|-----|-------------|
| Ch8 | Kael | Scripted death (holds rear guard) | **No** — story-mandatory |
| Ch12 | [Highest CRP unit] | Corrupted — turns enemy, must be defeated | **Partially** — manage CRP to control who |
| Ch13+ | Zael | If CRP hits 100, turns enemy | **Yes** — use Purify staves, keep off glitched terrain |
| Any | Any unit | Combat death (permadeath) | **Yes** — tactical play |

---

## Per-Arc Roster Snapshots

### Arc 1 (Ch1-5): Building the Party
| Available | Deployment Limit |
|-----------|-----------------|
| Ch1: Ren, Kael, Senna, Bram, Lira (5) | 5 |
| Ch2: + Voss (6) | 6 |
| Ch3: + Nira (7) | 7 |
| Ch4: + Coda (8) | 8 |
| Ch5: + Yuel (9) | 8 |

### Arc 2 (Ch6-10): Expansion and Loss
| Available | Deployment Limit |
|-----------|-----------------|
| Ch6: + Rook, Faye (11) | 9 |
| Ch7: same (11) | 9 |
| Ch8: - Kael → (10) | 10 |
| Ch9: + Orin (11) | 10 |
| Ch10: same (11) | 10 |

### Arc 3 (Ch11-15): Corruption Crisis
| Available | Deployment Limit |
|-----------|-----------------|
| Ch11: + Kira (12) | 10 |
| Ch12: - 1 corruption loss (11) | 10 |
| Ch13: + Zael (12) | 11 |
| Ch14: + Elara (13) | 11 |
| Ch15: same (13) | 11 |

### Arc 4 (Ch16-20): Understanding
| Available | Deployment Limit |
|-----------|-----------------|
| Ch16-17: same (13) | 12 |
| Ch18: + Ghael (14) | 12 |
| Ch19: same (14) | 12 |
| Ch20: + Echo (15) | 12 |

### Arc 5 (Ch21-25): The Final Push
| Available | Deployment Limit |
|-----------|-----------------|
| Ch21-25: 15 (stable, no new recruits) | 12 |

---

## New Character Profiles

### Nira — Archer (Ch3)

- **Personality**: Quiet, precise, methodical. Speaks in short sentences. Prefers action over words.
- **Meta-angle**: Tier 4 unaware. She's the most "normal" person in the party. Doesn't care about cycles or systems — she just wants to hit targets.
- **Narrative role**: The grounding force. When everyone else is debating metaphysics, Nira shoots things.
- **Gender**: Female
- **Activity**: Morning
- **MBTI**: ISTP
- **Design note**: High SKL growth makes her the crit/accuracy specialist. Bows' 2-range-only limitation means she can't counter at melee — position carefully.

### Coda — Thief (Ch4)

- **Personality**: Mischievous, fast-talking, kleptomaniac. Collects "interesting data" from the world.
- **Meta-angle**: Tier 3 genre-displaced. Thinks this is a stealth game. Calls combat "getting spotted." Refers to stealing as "data extraction."
- **Narrative role**: Comic relief + utility. Lockpick, Steal, and high SPD make them essential for treasure chapters.
- **Gender**: Non-binary
- **Activity**: Night
- **MBTI**: ENTP
- **Design note**: Knives give 1-2 range with debuffs. Low bulk means they die if caught. Pair with Lira (Empathy Aura) for survivability.

### Yuel — Pegasus Knight (Ch5)

- **Personality**: Anxious, hyper-vigilant. Saw her homeland's sky glitch — clouds loading in squares. Can't stop looking up.
- **Meta-angle**: Tier 4 → 3 (grows). Starts unaware but the glitched sky she witnessed nags at her. By Arc 3, she's asking the right questions.
- **Narrative role**: Mobile rescue unit. Flying + lance means she can reach anyone, anywhere. The cavalry replacement after Kael dies.
- **Gender**: Female
- **Activity**: Morning
- **MBTI**: INFJ
- **Design note**: Flying ignores terrain cost but weak to bows and wind magic. Low DEF, high SPD/RES. She's the anti-mage + rescue specialist.

### Rook — Mercenary (Ch6)

- **Personality**: Cynical, world-weary, pragmatic. Has been aware for 200 cycles. Unlike Ren, he didn't try to save anyone — he just survived.
- **Meta-angle**: Tier 2 partial awareness. Knows about cycles but not the System itself. Thinks it's "just how reality works." Ren's foil.
- **Narrative role**: The sellsword who learns to care. Classic FE archetype (Navarre/Joshua) but with meta-awareness twist.
- **Gender**: Male
- **Activity**: Irregular
- **MBTI**: ISTP
- **Design note**: Swords only. High SPD + SKL, low DEF. Promotes to Hero (sword+axe) or Swordmaster (sword mastery). The duelist.

### Faye — Troubadour (Ch6)

- **Personality**: Warm, earnest, stubborn. A healer who CHOSE to ride into battle. Refuses to stay behind.
- **Meta-angle**: Tier 4 unaware. Doesn't know, doesn't care. "People are hurting. I can help. That's enough."
- **Narrative role**: The second healer. Mounted means she can keep up with frontliners. Fills the "mobile support" hole that Kael's death creates.
- **Gender**: Female
- **Activity**: Morning
- **MBTI**: ESFJ
- **Design note**: Staff only until promotion (Valkyrie adds light magic). 7 MOV mounted. Replaces Kael's mobility, not his combat power.

### Orin — Dancer (Ch9)

- **Personality**: Dramatic, flamboyant, sincere. Everything is a performance. Speaks in theatrical metaphors.
- **Meta-angle**: Tier 3 genre-displaced. Thinks this is a musical. "Every battle needs a dance number." Uses Dance to "change the tempo."
- **Narrative role**: Action economy multiplier. Dance lets an ally act again. Joins right after Kael's death — compensates for the lost Canto mobility.
- **Gender**: Male
- **Activity**: Night
- **MBTI**: ENFP
- **Design note**: Cannot attack. Cannot promote. Has 5 MOV and no weapons. Pure utility — but Dance is the single most powerful support action in the game. Protect Orin at all costs.

### Kira — Shaman (Ch11)

- **Personality**: Quiet guilt. Was a dark mage spreading corruption before defecting. Carries the weight of what she did.
- **Meta-angle**: Tier 2 partial awareness. Understood the corruption data better than most — that's why she could spread it. Now she wants to undo it.
- **Narrative role**: Redemption arc. Dark magic user who fights her former allies. Her Nosferatu (HP drain) makes her self-sustaining.
- **Gender**: Female
- **Activity**: Night
- **MBTI**: INFP
- **Design note**: Dark tomes have no triangle advantage/disadvantage. Nosferatu drains HP on hit. High MAG/RES, low DEF/SPD. Promotes to Druid (dark+staff) or Summoner (dark+summon phantoms).

### Zael — Wyvern Rider (Ch13)

- **Personality**: Aggressive, impatient, scared. The corruption makes them angry and irrational. Fights it with willpower.
- **Meta-angle**: Tier 4 unaware but CRP at 40 means they FEEL something wrong. Describes it as "a buzzing in my skull."
- **Narrative role**: The ticking bomb. High-power unit with built-in risk. If the player manages their CRP, Zael is one of the strongest endgame units. If not, they become an enemy.
- **Gender**: Male
- **Activity**: Irregular
- **MBTI**: ESTP
- **Design note**: Flying + axe/lance. High STR/DEF, low RES. Weak to bows. CRP starts at 40 and ticks up on glitched terrain. Requires active management (Purify, avoid corruption). Promotes to Wyvern Lord (axe+lance) or Malig Knight (axe+dark).

### Elara — Monk (Ch14)

- **Personality**: Calm, steady, philosophical. Debates the nature of existence with the same tone she uses to order breakfast.
- **Meta-angle**: Tier 2 partial awareness. Studied the "anomalies" (glitches) as a monk studies scripture. Doesn't know it's a game — believes it's a metaphysical phenomenon.
- **Narrative role**: Anti-corruption specialist. Light magic reduces CRP on hit. The answer to Arc 3's corruption crisis.
- **Gender**: Female
- **Activity**: Morning
- **MBTI**: INTJ
- **Design note**: Light tomes are effective vs dark/corrupted enemies. Some light tomes heal the user on hit. High MAG/RES, low STR/DEF. Promotes to War Monk (light+staff+melee) or Saint (light+staff, pure caster).

### Ghael — Armor Knight (Ch18)

- **Personality**: Stoic, disciplined, regretful. Was a boss in an earlier chapter (Ch4 or Ch10), fought the party, lost, and survived. Spent the intervening chapters questioning his purpose.
- **Meta-angle**: Tier 3 → 2 (grows). Started as a genre-displaced "guard boss" who thought his job was to guard a door forever. Realized there's more.
- **Narrative role**: The late-game tank. Joins promoted (or near promotion). Replaces/supplements Voss's defensive role.
- **Gender**: Male
- **Activity**: Morning
- **MBTI**: ISTJ
- **Design note**: Lance + heavy armor. Highest DEF in the game. Extremely low SPD — will never double. But nothing gets past him. Promotes to General (lance+sword) or Great Knight (lance+axe+mounted).

### Echo — System Construct (Ch20)

- **Personality**: Curious, childlike, unsettling. Speaks in data terms that slowly become more human. Learns emotions in real time.
- **Meta-angle**: Tier 5 System-level. Created by the System as a weapon. Gained free will — the System's biggest "bug." Chose to leave.
- **Narrative role**: The proof that the System can create life, not just simulate it. Echo choosing freedom is the narrative argument for ending the loop.
- **Gender**: Undefined (uses they/them)
- **Activity**: Irregular
- **MBTI**: INTP (developing)
- **Design note**: Unique class — System Construct. Can equip any weapon type but only one at a time. Stats are balanced. Growth rates are perfectly flat (30% everything). The "anti-specialist" — good at everything, best at nothing. Like Ren but without 347 cycles of knowledge.

---

## Naming Convention

All names: 3-5 letters. Short, punchy, easy to read on UI panels. Consistent with existing cast (Ren, Kael, Senna, Bram, Lira, Voss).

| Name | Letters | Sound | Origin Feel |
|------|---------|-------|-------------|
| Nira | 4 | Sharp, precise | South Asian |
| Coda | 4 | Musical, final | Italian (musical term) |
| Yuel | 4 | Soft, skyward | Nordic |
| Rook | 4 | Blunt, strategic | English (chess piece) |
| Faye | 4 | Gentle, warm | French |
| Orin | 4 | Melodic, open | Celtic |
| Kira | 4 | Sharp, dark | Japanese/Russian |
| Zael | 4 | Harsh, heavy | Germanic |
| Elara | 5 | Calm, luminous | Greek (moon of Jupiter) |
| Ghael | 5 | Solid, grounded | Gaelic |
| Echo | 4 | Hollow, repeating | Greek (mythology) |

---

## Class Coverage

Ensuring weapon triangle and role coverage across the full roster:

| Weapon Type | Units | Triangle Coverage |
|-------------|-------|------------------|
| **Sword** | Ren, Rook, (Kael until Ch8) | Sword > Axe |
| **Lance** | Kael (until Ch8), Voss, Yuel, Ghael | Lance > Sword |
| **Axe** | Bram, Zael | Axe > Lance |
| **Bow** | Nira | No triangle (2-range only) |
| **Knife** | Coda | No triangle (utility) |
| **Fire/Thunder/Wind** | Senna | Magic triangle |
| **Dark** | Kira | Outside triangle |
| **Light** | Elara | Outside triangle (effective vs dark) |
| **Staff** | Lira, Faye, (Elara promoted) | Non-combat |
| **Any (one at a time)** | Echo | Flexible |
| **None** | Orin | Dance only |

---

## Open Questions

- **Replacement cavalry**: After Kael dies Ch8, Yuel (flying) and Faye (mounted staff) partially fill his role. Should there be a direct Cavalier replacement, or is the gap intentional?
- **Zael's CRP management**: How fast does Zael's CRP climb? Should it be +1/chapter passively, or only from terrain/combat?
- **Echo's weapon flexibility**: Can Echo switch equipped weapon type freely in preparation, or is it locked per chapter?
- **Ch12 corruption target**: Should the corruption loss always target the player's highest-CRP unit, or should the player get a warning and chance to Purify?
- **Deployment vs roster**: Should benched units gain partial EXP (catch-up) or stay at their level?
