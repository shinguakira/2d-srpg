# Enemies

Enemy types and writing guidelines. For AI behaviour see [ai.md](../gameplay/ai.md);
for named bosses see [bosses.md](bosses.md).

---

## The Two Enemies

The campaign has two distinct hostile forces and they should never feel alike.

### 1. The Kurogane Empire

A real army: disciplined, well fed, well paid, and marching because their emperor
told them this war would be the last one — and they believe him. Kurogane soldiers
are not monsters and are never written as monsters.

Halvar is the party's window into them, which is why he defects in Ch2 and why his
death in Ch8 costs the player something.

### 2. The Blackflame

Not an army. It does not negotiate, hold ground, or take prisoners. It hollows
things out. Its "units" are the people it has already taken.

---

## Kurogane Enemy Classes

### Arc 1-2

| Class | Weapons | Key trait | First appears |
|-------|---------|-----------|---------------|
| **Brigand** | Axe | Hill bandits, mostly on Kurogane pay rather than in Kurogane service | Ch1 |
| **Soldier** | Lance | The Empire's backbone. Disciplined, ordinary, doing a job | Ch1 |
| **Archer** | Bow | 2-range only, no melee counter | Ch2 |
| **Knight** | Lance | High DEF, low SPD. Teaches effective weapons | Ch2 |
| **Mage** | Anima tomes | Ranged burst, fragile | Ch2 |
| **Cavalier** | Lance/Sword | Mobile, canto. Teaches anti-cavalry positioning | Ch4 |
| **Thief** | Knife | Races for chests and villages. Survival AI | Ch4 |
| **Pegasus Knight** | Lance | Flying, bow-vulnerable, fast flankers | Ch6 |
| **Shaman** | Dark tomes | Nosferatu drain; inflicts Corruption on hit | Ch7 |

### Arc 3-4 (promoted)

| Class | Weapons | Key trait | First appears |
|-------|---------|-----------|---------------|
| **Paladin** | Lance/Sword | Fast, tough, canto | Ch11 |
| **General** | Lance/Sword | Maximum-DEF wall | Ch12 |
| **Sage** | Anima/Staff | Attacks *and* heals. Priority target | Ch12 |
| **Sniper** | Bow | Long range, high crit, loves elevation | Ch13 |
| **Assassin** | Knife | Lethality. Ambushes in fog | Ch13 |
| **Berserker** | Axe | Glass cannon | Ch14 |
| **Wyvern Lord** | Axe/Lance | Flying tank. Bows and wind only | Ch15 |
| **Bishop** | Light/Staff | Healer AI; light magic hurts corrupted party members | Ch15 |
| **Swordmaster** | Sword | Extreme speed and crit | Ch17 |
| **Marshal / Archsage** | All physical / all magic | Master-class officers | Ch20+ |

---

## Blackflame Enemies

### Revenant

The dead the Blackflame has stood back up. They keep their own faces and their own
kit, which is the most upsetting fact in the setting and should be treated that way
— Mirelle's instruction in Ch7 is *"do not look at their faces."*

- Uses the `shaman` frame; ids `ch7_corrupted_*`
- Comes out of blighted stone rather than marching in from a map edge
- Ch7 is the introduction: four waves, out of the fortress's north wall, some in
  Amagi colours

### Blackflame Colossus

Not a revenant — a revenant was one person. A Colossus has been **assembled**, out
of several.

- `ch10_construct` · knight frame · HP 50 / STR 15 / DEF 14 / RES 10 / SPD 3
- Slow, nearly unkillable head-on, and single-minded: it goes for an objective, not
  for whoever is nearest
- On death its ash runs west along the ground **against the wind**, which is the
  first trail the party can actually follow

### Blighted terrain

Terrain is an enemy in its own right from Ch3 onward.

| Terrain | Display name | Effect |
|---|---|---|
| `glitched` | **Blighted** | +2 Corruption per turn standing on it |
| `data_void` | **Abyssal Rift** | Impassable; -2 DEF, -20 avoid nearby; +3 Corruption |
| `corrupted_fort` | **Defiled Fort** | Fort cover, but +1 Corruption |
| `broken_throne` | **Broken Throne** | Reduced throne bonuses |
| `memory` | **Hallowed Ground** | Restores Attunement; the blight will not cross it |

---

## Writing generic enemies

Only one or two enemies per chapter get lines. Keep them short and human.

- **Soldiers** mean it when they shout for their commander. They are not cynics.
- **Brigands** are opportunists who took the winning side's coin and know exactly
  what that makes them.
- **Officers** almost all know something is wrong in the west and have been told
  not to look at it. That order is the recurring note of the whole campaign.
- **Revenants do not speak.** Ever. If a revenant says something, the scene is
  broken.
