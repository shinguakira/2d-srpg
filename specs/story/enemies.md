# Enemies

Enemy types, awareness tiers, and design guidelines. For AI behavior details, see [ai.md](../gameplay/ai.md). For boss details, see [bosses.md](bosses.md).

---

## The System (Main Villain)

See [world.md](world.md) → "The System — Expanded Villain Profile" for full details.

- **Awareness Tier**: 5 (System-Level)
- **Manifests through**: forced resets, impossible enemy spawns, terrain corruption, stat manipulation
- **Motivation**: Broken save manager trying to find a deathless playthrough. Not evil — tragic.
- **Escalation**: Dormant (Arc 1) → Intervening (Arc 2) → Resisting (Arc 3) → Confronting (Arc 4) → Final Stand (Arc 5)
- **Final form (Ch24-25)**: ???_CORRUPTED (Kael's data) and the System itself

---

## Enemy Class Types

### Base Enemy Classes (Arc 1-2)

| Class | Weapons | Awareness | Key Trait | First Appears |
|-------|---------|-----------|-----------|--------------|
| **Brigand** | Axe | Tier 4 (Unaware) | Weak, numerous, disposable. Know they're disposable. | Ch1 |
| **Soldier** | Lance | Tier 4 (Unaware) | Disciplined, follow orders. The System's intended design. | Ch1 |
| **Archer** | Bow | Tier 4 (Unaware) | 2-range only. Proud of their range. Can't counter melee. | Ch2 |
| **Knight** | Lance | Tier 4 (Unaware) | High DEF, low SPD. Teaches effective weapons. | Ch2 |
| **Mage** | Anima tomes | Tier 2 (Partial) | High MAG resonance = partial system awareness. | Ch2 |
| **Cavalier** | Lance/Sword | Tier 4 (Unaware) | Mobile. Canto. Teaches anti-cavalry tactics. | Ch4 |
| **Thief** | Knife | Tier 3-4 | Races to chests/villages. Survival AI. | Ch4 |
| **Dark Mage** | Dark tomes | Tier 2 (Partial) | CRP on hit. Nosferatu drain. | Ch7 |
| **Pegasus Knight** | Lance | Tier 4 | Flying. Bow-vulnerable. Fast flankers. | Ch8 |

### Promoted Enemy Classes (Arc 3-4)

| Class | Weapons | Key Trait | First Appears |
|-------|---------|-----------|--------------|
| **Paladin** | Lance/Sword | Fast, tough mounted. Canto + high stats. | Ch11 |
| **General** | Lance/Sword | Max DEF wall. Effective weapons required. | Ch12 |
| **Sage** | Anima/Staff | Can attack AND heal. Priority kill target. | Ch12 |
| **Sniper** | Bow | Long range, high crit. Dangerous on elevated terrain. | Ch13 |
| **Assassin** | Knife | Lethality skill. Ambush AI in fog. | Ch13 |
| **Berserker** | Axe | High crit, high STR. Glass cannon. | Ch14 |
| **Wyvern Lord** | Axe/Lance | Flying tank. Only bows and wind magic effective. | Ch15 |
| **Bishop** | Light/Staff | Healer AI. Light magic hurts corrupted party members. | Ch15 |
| **Druid** | Dark/Staff | High CRP spread. Nosferatu drain + healing. | Ch16 |
| **Swordmaster** | Sword | Extreme speed + crit. Hard to hit, deadly counter. | Ch17 |
| **War Monk** | Light/Axe | Hybrid fighter-healer. Surprisingly tanky. | Ch18 |

### Master/Special Enemy Classes (Arc 4-5)

| Class | Weapons | Key Trait | First Appears |
|-------|---------|-----------|--------------|
| **Marshal** | All physical | Master class. Can equip any physical weapon. | Ch20 |
| **Archsage** | All magic | Master class. Can equip any tome. | Ch21 |
| **System Construct** | Any (assigned) | Artificial units. No CRP. High flat stats. No growth — pure data. | Ch18 |
| **Corrupted** | Randomized | Stat randomization ±3 each turn. CRP on contact. Tier 5 corruption. | Ch11+ |

### Corrupted Variants

Any base or promoted enemy class can become "Corrupted" in Arc 3+:
- Sprite has visual glitch effects (color bleeding, frame skipping)
- Stats randomize ±1-3 each turn
- Attacks spread +3 CRP on hit
- May ignore AI behavior and act erratically
- Drop CRP-related items on death

---

## Generic Enemy — Awareness by Type

Not every enemy talks. Only 1-2 per chapter get dialogue for comedic/dramatic beats.

### Soldiers (Tier 4 — Unaware)
Follow orders without question. The most "normal" enemies.
- Occasional beat: "For the commander!" (they genuinely mean it)

### Brigands (Tier 4 — Unaware, but bitter)
Know they're weak. Don't know WHY they feel disposable.
- Occasional beat: "Why do I always spawn near the strongest enemy...?"

### Mages (Tier 2 — Partially Aware)
High MAG stat resonance means enemy mages sometimes perceive the system layer.
- Occasional beat: "I KNOW I should retreat, but something compels me forward." (describing their AI)

### Archers (Tier 4 — Unaware)
Defined entirely by their 2-range. It's their whole personality.
- Occasional beat: "You can't reach me from there!" (proud, genuine)

### Knights (Tier 4 — Unaware)
Absolute faith in their armor. Can't comprehend effective weapons.
- Occasional beat: "My defense is impenetrable— wait, what IS that weapon?"

### Dark Mages (Tier 2 — Partially Aware)
See the system layer through dark magic. Half-understand what they're seeing.
- Occasional beat: "The void between spells... there's DATA in it."

### Assassins (Tier 2 — Partially Aware)
Trained killers who notice the gaps between turns.
- Occasional beat: "During their phase, we freeze. Don't you find that... unnatural?"

### Reinforcements (Tier 4 — Disoriented)
Spawned mid-battle. Arrive confused. Don't know where they came from.
- Occasional beat: "Wait, when did this battle START? ...Why am I already fighting?"

### System Constructs (Tier 5 — System-Level)
Not people. Data shaped like soldiers. No personality, no dialogue, no mercy.
- Occasional text: `[UNIT_0x3F7A: ENGAGING HOSTILE. NO FURTHER DATA.]`

### Corrupted Units (Tier varies — Broken)
Former enemies or allies consumed by corruption. Speak in fragments of who they were.
- Occasional beat: "H̸e̵l̵p̸ ̶m̶e̷.̸ ̷I̵'̶m̵ ̶s̴t̸i̷l̷l̶ ̷i̵n̸ ̶h̸e̵r̸e̷.̵"

---

## Enemy Introduction Schedule

| Arc | New Enemy Types | Total Enemy Variety |
|-----|----------------|-------------------|
| Arc 1 | Brigand, Soldier, Archer, Knight, Mage, Cavalier, Thief | 7 base types |
| Arc 2 | Dark Mage, Pegasus Knight, enemy Healer (Cleric) | +3 = 10 types |
| Arc 3 | Paladin, General, Sage, Sniper, Assassin, Berserker, Wyvern Lord, Bishop, Corrupted | +9 promoted = 19 types |
| Arc 4 | Druid, Swordmaster, War Monk, Marshal, Archsage, System Construct | +6 = 25 types |
| Arc 5 | All types deployed. Master class enemies. Full corrupted variants. | 25+ types |

---

## Open Questions

- **Named mini-bosses**: Should recurring mini-bosses have unique portraits? *Recommendation: Yes for 3-4 key recurring enemies. Others use generic class portraits.*
- **Enemy recruitment**: Beyond Voss, Zael, and Ghael, should any other enemies be recruitable? *Recommendation: Keep it rare. 3 enemy-to-ally conversions is already a lot.*
- **Corrupted ally**: Can a player unit who hits CRP 100 become a permanent enemy on the map? *Recommendation: Yes — this is the stated mechanic. They fight against you until killed. Worse than death.*
