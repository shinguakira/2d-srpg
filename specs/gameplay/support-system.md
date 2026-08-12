# Support System

Support ranks, conversations, combat bonuses, and relationship mechanics.

---

## Support Rank Progression

Units build support through adjacency in battle. Higher support ranks unlock conversations and combat bonuses.

### Ranks

| Rank | Points Required | Combat Bonus | Conversation |
|------|----------------|-------------|--------------|
| **None** | 0 | No bonus | — |
| **C** | 20 | +5 Hit, +5 Avoid | Short conversation (acquaintance) |
| **B** | 50 | +10 Hit, +10 Avoid, +5 Crit | Medium conversation (friendship) |
| **A** | 100 | +15 Hit, +15 Avoid, +10 Crit | Long conversation (deep bond) |
| **S** | 150 | +20 Hit, +20 Avoid, +15 Crit, +2 DMG | Final conversation (soul bond) |

### Earning Support Points

| Action | Points | Notes |
|--------|--------|-------|
| Adjacent at turn end (both units) | +2 per turn | Base adjacency points |
| Fight same enemy in same turn | +3 | Shared combat experience |
| Heal an ally | +2 (healer + target) | Mutual trust building |
| Dance for an ally | +3 (dancer + target) | Performance creates bond |
| Rescue an ally | +4 (rescuer + rescued) | Life-saving trust |
| Share a meal (preparation phase) | +5 (both units) | Deliberate bonding |
| Complete chapter together (both deployed) | +1 | Small passive gain |

### Support Limits

- Each unit can have a maximum of **5 total support partners** (any rank)
- Only **1 S-rank** support per unit (deepest bond is exclusive)
- Shigeru can support with ALL units (no limit — protagonist)
- Support points only accumulate when both units are deployed in the same chapter

---

## Support Bonuses

### Combat Bonuses (When Adjacent)

Support bonuses apply when the supported units are within **2 tiles** of each other during combat.

| Rank | Hit | Avoid | Crit | Damage | Crit Avoid |
|------|-----|-------|------|--------|-----------|
| C | +5 | +5 | 0 | 0 | +5 |
| B | +10 | +10 | +5 | 0 | +10 |
| A | +15 | +15 | +10 | +1 | +15 |
| S | +20 | +20 | +15 | +2 | +20 |

Bonuses from multiple support partners DO stack, but only the highest-ranked active support applies per stat (no double-dipping from two C-ranks).

### LOY Interaction

| Support Event | LOY Change |
|--------------|-----------|
| Reach C rank | +3 LOY (both units) |
| Reach B rank | +5 LOY (both units) |
| Reach A rank | +8 LOY (both units) |
| Reach S rank | +12 LOY (both units) |
| Support partner dies | -15 LOY, +10 INS |

High support rank with a unit who dies creates the strongest grief/LOY cascade in the game. This is intentional — building bonds means risking deeper loss.

---

## Support Conversations

### Structure

Each support pair has up to 4 conversations (C/B/A/S). Conversations are viewed during the preparation phase after reaching the required rank.

| Rank | Length | Tone | Content |
|------|--------|------|---------|
| **C** | 3-5 exchanges | Light, surface | First real conversation. Establishing personalities. |
| **B** | 5-8 exchanges | Deeper, personal | Sharing backgrounds, finding common ground. |
| **A** | 8-12 exchanges | Vulnerable, honest | Confronting fears, meta-awareness discussions. |
| **S** | 10-15 exchanges | Defining, climactic | Defining the relationship. Meta-narrative significance. |

### Key Support Pairs

Not all pairs have unique conversations. Priority pairs (with full 4-tier conversations):

| Pair | Theme | Notes |
|------|-------|-------|
| Shigeru × Lisette | Knowledge vs ignorance | Lisette's analysis meets Shigeru's 347-cycle experience. Do you tell her everything? |
| Shigeru × Mirelle | Exhaustion vs hope | Mirelle sees through Shigeru's cynicism. She reminds him why he started. |
| Shigeru × Gareth | Action vs planning | Gareth challenges Shigeru's overthinking. "Sometimes you just hit the thing." |
| Shigeru × Halvar | Former enemies | 300 cycles of opposing each other. Now allies. Trust building. |
| Shigeru × Akira | Commander × soldier | The relationship that defines Shigeru's guilt. Akira's unwavering loyalty. |
| Lisette × Fenn | Intellect vs street smarts | Lisette respects Fenn's practical intelligence. |
| Gareth × Corwin | Rival fighters | Competitive friendship. Who's stronger? |
| Mirelle × Viviane | Healer × dancer | Two support-role characters bond over keeping everyone alive. |
| Kira × Elara | Dark × light | Former dark mage and monk. Opposing magic, finding balance. |
| Halvar × Ghael | Former enemies | Both served the Blackflame. Different reasons for leaving. |
| Echo × Shigeru | Creator × creation | The Blackflame made Echo. Shigeru must decide what Echo means. |

All other unit pairs have generic C-rank conversations (personality interactions) and no higher-rank support.

---

## Support × Meta-Stats

| Interaction | Effect |
|-------------|--------|
| High support (A/S) + ally death | -15 LOY, +10 INS (shared grief amplifies awareness) |
| S-rank support + both deployed | +3 ATT per chapter end (mutual stabilization) |
| Support conversation viewed | -2 STA for both units (emotional processing) |
| S-rank partner at low HP | Supported unit gains +5 all combat stats until partner healed (protective fury) |

---

## Support × Akira's Death (Ch8)

Akira's death has special support implications:

- All units with C+ support with Akira: -10 LOY, +8 INS
- Shigeru (always has support with Akira): -15 LOY, +10 INS, -10 ATT
- Any unit with A/S rank Akira support: **Grief** status (2 chapters) — -3 all stats, but +20 crit (rage)
- Support points earned with Akira are NOT lost — they're preserved as memory data, referenced in Ch24 (???_CORRUPTED is Akira)

---

## Open Questions

- **Same-sex S-rank**: Should S-rank imply romance? *Recommendation: S-rank is "soul bond" — can be romantic or platonic depending on the pair. The conversation text determines the nature.*
- **Support growth rate**: 20 points for C feels right, but 150 for S may be too slow for a 25-chapter game. *Recommendation: Playtest. If too slow, reduce by 20% across all ranks.*
- **Enemy support**: Should enemy units have support bonuses with each other? *Recommendation: Simplified — elite enemies get +5/+10 bonuses when adjacent to their boss. No full support system for enemies.*
- **Post-death support**: If a partner dies, does the surviving unit lose their support bonuses? *Recommendation: Yes for combat bonuses (partner gone), but the rank stays on the character sheet as memorial.*
