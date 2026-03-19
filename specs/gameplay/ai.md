# Enemy AI

Behavior types, target selection, movement logic, and meta-stat interactions for enemy-controlled units.

Code reference: `src/core/ai.ts`

---

## Behavior Types

Each enemy unit has an assigned AI behavior that determines how it moves and selects targets.

| Behavior | Movement | Target Selection | Use Case |
|----------|----------|-----------------|----------|
| **Aggressive** | Chase nearest player unit | Best target by score | Standard enemies, reinforcements |
| **Stationary** | Cannot move | Attack in weapon range only | Archers on walls, mages behind lines |
| **Guard** | Stay within radius of start position | Best target within guard zone | Area defenders, gatekeepers |
| **Boss** | Cannot move | Attack in range, prioritize Lord | Chapter bosses on thrones |
| **Survival** | Flee to fort/safe tile when low HP | Attack only when healthy | Self-preserving enemies, named enemies, mini-bosses |

### Aggressive

Default behavior. Moves toward and attacks the highest-scoring reachable target.

```
1. Calculate all movable positions (BFS from current position)
2. For each position, find attackable enemies
3. Score all (position, target) combinations
4. Pick the highest-scoring option
5. If no target reachable: move toward nearest player unit (close the gap)
```

### Stationary

Does not move. Only attacks if a player unit enters weapon range.

```
1. Check weapon range from current position
2. If target in range: attack best-scoring target
3. If no target: do nothing (stay in place)
```

### Guard

Moves freely but stays within a defined radius of its starting position.

```
1. Calculate movable positions
2. Filter: only positions within guard radius of start position (Manhattan distance)
3. Score reachable targets from valid positions
4. If no target reachable within zone: return to start position
```

Guard radius is defined per unit (e.g., `{ type: 'guard', radius: 3 }`).

### Boss

Like stationary but with Lord-targeting priority.

```
1. Check weapon range from current position (cannot move)
2. Score all targets in range
3. +50 bonus to score if target is Lord class
4. Attack best target
5. If no target: do nothing
```

### Survival

Self-preserving AI. Fights when healthy, retreats to heal when wounded. Makes enemies feel smarter — they don't suicidally charge when near death.

```
HP threshold: ≤ 30% max HP → retreat mode
HP threshold: > 50% max HP → attack mode
Between 30-50%: stay cautious (attack only safe targets, don't chase)

RETREAT MODE:
1. Find nearest fort/throne tile (healing terrain)
2. Move toward it (BFS shortest path)
3. If already on fort: stay and heal (do nothing)
4. If no fort reachable: move AWAY from nearest player unit (maximize distance)
5. Do NOT attack even if target is in range (priority is survival)

ATTACK MODE:
1. Behave like Aggressive — chase and attack best target
2. Full target scoring applies

CAUTIOUS MODE (30-50% HP):
1. Calculate all attack options
2. Only attack if: score > 80 AND self would survive the counter
3. If no safe attack: move toward fort or hold position
4. Will not chase — only attacks targets that come to them
```

**Use cases:**
- **Named enemies** that flee and return later in the chapter (mini-boss retreats, heals, comes back)
- **Mages** that kite — attack from range, retreat when approached
- **Thieves/Brigands** targeting villages — run toward village, attack only if cornered
- **Enemies with Vulneraries** — retreat, use item, then re-engage

**Survival + Items:**
When in retreat mode, if the unit has a healing item (Vulnerary, etc.), they will use it instead of attacking — even if a target is in range. Item use consumes their action for the turn.

```
RETREAT MODE with item:
1. If has healing item AND current HP < max HP: use item (action consumed)
2. Then move toward fort (if movement remains via Canto, otherwise stay)
3. If no healing item: move toward fort without acting
```

---

## Target Scoring

The AI evaluates every possible attack with a numeric score. Higher score = better target.

```
score = 0

// Can we kill?
if (damage ≥ target HP): score += 100

// Raw damage value
score += damage × 2

// Hit reliability
score += hitRate × 0.5

// Prioritize wounded targets
score += (1 - currentHP / maxHP) × 30

// Self-preservation
if (defender can counter AND counter damage would kill us):
  score -= 50
```

### Score Breakdown Example

| Factor | Value | Notes |
|--------|-------|-------|
| Can kill | +100 | Highest priority — kills are always worth it |
| 15 damage | +30 | 15 × 2 |
| 85% hit | +42.5 | 85 × 0.5 |
| Target at 40% HP | +18 | (1 - 0.4) × 30 |
| Would die to counter | -50 | Risk penalty |
| **Total** | **140.5** | |

### CHA Aggro (Design Spec — Not Yet Implemented)

When CHA is implemented, target scoring adds aggro weight:

```
score += target.aggroWeight × 0.3
where: aggroWeight = 10 + CHA×2 + (maxHP - currentHP)/2
```

This makes high-CHA units (Ren: CHA 9 → weight 28) natural aggro magnets, while low-CHA units (Voss: CHA 2 → weight 14) are nearly ignored.

### Terrain Aggro Modifier (Design Spec)

Units on defensive terrain have reduced aggro:

```
if target on Forest/Mountain/Fort/Throne:
  aggroWeight -= 5
```

This creates a meaningful choice: position a high-CHA unit on a fort to tank (CHA overcomes the -5), or use low-CHA units on forts to hide them from AI.

---

## Movement Logic

### Aggressive Chase

When no target is reachable, aggressive enemies move toward the nearest player unit.

```
1. Find all player units
2. Calculate Manhattan distance from current position to each
3. Select nearest player unit
4. Among all movable positions, pick the one closest to that player
5. Move there
```

This creates a "closing in" behavior — enemies swarm the party over multiple turns.

### Guard Return

When a guard enemy has no targets and has drifted from its start position, it moves back.

```
1. If no targets in guard zone: stay in place (effectively returns to patrol area)
```

### Pathfinding

Enemy movement uses the same BFS pathfinding as player units:
- Respects terrain movement costs
- Cannot move through player-occupied tiles
- CAN move through ally (enemy) occupied tiles but cannot stop on them
- Class-specific movement costs apply (e.g., mounted enemies pay extra in forests)

---

## Enemy Phase Execution

### Sequence

```
1. computeEnemyActions(): AI decides actions for ALL enemies at once
2. executeNextEnemyAction(): actions execute one at a time
3. After each action: check for player deaths, game over conditions
4. After all enemies: endEnemyTurn() → Player Phase
```

### Action Priority

Enemies act in the order they were computed (currently: iteration order of the unit map). No explicit priority system — but could be added:

| Priority (future) | Unit Type |
|-------------------|-----------|
| 1 (first) | Healers (heal allies before they die) |
| 2 | Ranged units (soften targets) |
| 3 | Melee units (finish kills) |
| 4 | Boss (acts last, after minions) |

### Animation Timing

- Camera pans to acting enemy (~300ms)
- Movement animation plays
- Combat animation plays (if attacking)
- Brief pause between enemies (~200ms)
- Total enemy phase should feel snappy, not slow

---

## Enemy AI × Meta-Stats (Design Spec)

### AWR-Based Information

| Player AWR Level | AI Behavior Change |
|-----------------|-------------------|
| AWR Blind (0-10) | AI targets randomly (player can't see stats, AI plays fair) |
| AWR Aware (11-30) | Normal AI scoring |
| AWR Decoded (61-90) | AI becomes smarter — considers weapon triangle in scoring |
| AWR Awake (91-100) | AI plays optimally — considers terrain, support bonuses, future turns |

### SYNC-Based Consistency

| SYNC State | AI Effect |
|-----------|-----------|
| Volatile (<30%) | 20% chance enemy AI acts randomly (wrong target, suboptimal move) |
| Anchored (>90%) | AI acts perfectly — no randomization, optimal play |

### CRP-Based Corruption

| CRP Level | AI Effect |
|-----------|-----------|
| CRP Spreading (31-50) | Enemy attacks have 10% chance to spread +3 CRP to target |
| CRP Consumed (51-75) | Enemies deal +20% damage to units with CRP > 0 |
| CRP Critical (76+) | Corrupted enemies may attack other enemies (system breakdown) |

### LOY-Based Defiance

| LOY Level | AI Effect |
|-----------|-----------|
| LOY Defiant (<20) | 15% chance player unit ignores attack command during auto-battle |
| LOY Devoted (>80) | Auto-shield: unit takes a lethal hit for an adjacent ally (LOY% chance) |

---

## Enemy Composition Per Chapter

General guidelines for enemy placement and behavior assignment.

### Ch1 — Tutorial

| Enemy Type | Count | Behavior | Level | Notes |
|-----------|-------|----------|-------|-------|
| Brigand | 4-5 | Aggressive | 1-2 | Spread out, approach in waves |
| Brigand (axe) | 2 | Stationary | 2 | Block chokepoint |
| Boss | 1 | Boss | 3 | On throne, higher stats |

### Ch2 — Expanding

| Enemy Type | Count | Behavior | Level | Notes |
|-----------|-------|----------|-------|-------|
| Mixed (sword/lance/axe) | 6-8 | Aggressive | 3-5 | Weapon triangle variety |
| Archer | 2 | Stationary | 4 | On elevated terrain |
| Mage | 1-2 | Guard (r=3) | 4 | Protect boss approach |
| Knight | 1-2 | Guard (r=2) | 5 | High DEF blocker |
| Named enemy | 1 | Survival | 5 | Mini-boss with Vulnerary, retreats to fort when hurt |
| Boss | 1 | Boss | 6 | Stronger, may have skill |
| Reinforcements | 2-3 | Aggressive | 3-4 | Turn 4-5 from map edges |

### Ch3 — Crisis

| Enemy Type | Count | Behavior | Level | Notes |
|-----------|-------|----------|-------|-------|
| Mixed | 8-10 | Aggressive | 6-9 | Harder, smarter |
| Dark Mage | 2 | Survival | 7 | CRP on hit, kites — retreats when approached |
| Knight | 3 | Guard (r=2) | 8 | Wall formation |
| Named enemy | 1 | Survival | 9 | Recurring mini-boss, flees at low HP, returns healed |
| Boss | 1 | Boss | 10 | Significant threat |
| Reinforcements | 3-4 | Aggressive | 6-7 | Multiple waves |

### Ch4 — Finale

| Enemy Type | Count | Behavior | Level | Notes |
|-----------|-------|----------|-------|-------|
| Corrupted | 5-6 | Aggressive | 8-12 | Randomized stats, unpredictable |
| Dark Mage | 3 | Aggressive | 10 | High CRP spread |
| Mixed elite | 4-5 | Guard (r=5) | 10-12 | Protecting boss arena |
| Boss (???) | 1 | Boss | 15 | Type-cycling weapon, highest stats |
| Reinforcements | Continuous | Aggressive | 8-10 | Every 2 turns from voids |

---

## Open Questions

- **AI difficulty scaling**: Should AI behavior improve per chapter (e.g., aggressive in Ch1 → tactical in Ch4)?
- ~~**Retreat behavior**~~: Resolved — added Survival AI type with retreat/cautious/attack modes.
- **Healer enemies**: Should enemy clerics heal their allies? Not implemented.
- **Coordinated attacks**: Should enemies focus-fire one unit? Current scoring slightly favors wounded targets, but no explicit coordination.
- **AI cheating**: Should boss AI know player unit stats regardless of AWR? Or play fair?
- **Aggro leashing**: Should aggressive enemies that chase too far give up and return?
