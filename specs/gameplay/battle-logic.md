# Battle Logic

Turn structure, phase flow, and action system. This covers the FLOW — for combat math and formulas, see [combat.md](combat.md).

Code reference: `src/stores/actions/turnActions.ts`, `selectionActions.ts`, `enemyActions.ts`

---

## Phase Structure

```
Player Phase → Enemy Phase → Player Phase → ...
```

Each chapter loops through these two phases until a victory or defeat condition is met. Turns are counted per full cycle (Player + Enemy = 1 turn).

### Phase Banner

Each phase starts with a full-screen phase banner (「Player Phase」/「Enemy Phase」) that pauses gameplay until dismissed. During the banner:
- No input is accepted (except dismiss)
- Fort/throne healing triggers
- Reinforcements spawn (enemy phase only)

---

## Player Phase

### Flow

```
1. Phase banner: "Player Phase" → dismissed
2. All player units reset: hasActed = false
3. Fort/throne healing: +5 HP (fort) or +10 HP (throne) for all player units on those tiles
4. Player selects and acts with units in any order
5. When all units have acted OR player manually ends turn → Enemy Phase
```

### Unit Selection

- Click a player unit that hasn't acted yet → **selected**
- Shows movement range (blue overlay) and attack range (red overlay)
- Hover tiles within movement range → show pathfinding path
- Click outside ranges → deselect
- Click another player unit → switch selection

### Movement

- Click a tile within movement range → unit moves there (pending confirmation)
- Movement cost is per-tile (see [terrain.md](terrain.md))
- Cannot move through enemy-occupied tiles
- CAN move through ally-occupied tiles (but cannot stop on them)
- After moving → **Action Menu** appears

### Action Menu

Available actions depend on context. All actions consume the unit's turn (hasActed = true) except where noted.

| Action | Condition | Effect |
|--------|-----------|--------|
| **Attack** | Enemy within weapon range from current position | Enter attack targeting mode |
| **Heal** | Staff equipped AND ally within staff range | Enter heal targeting mode |
| **Item** | Has usable items in inventory | Open item submenu |
| **Seize** | Lord class AND standing on throne/objective tile | Capture objective → chapter ends (victory) |
| **Visit** | Standing on unvisited village tile | Trigger village event (reward: item, gold, or story) |
| **Wait** | Always available (except Bram — No Patience passive) | End turn at current position |

### Attack Flow

```
1. Select "Attack" → show attack tiles (red overlay)
2. Hover enemy in range → show Combat Forecast panel
3. Click enemy → lock target
4. Weapon select (if multiple weapons can reach): choose weapon
5. Body targeting (if unlocked, Ch2+): choose target zone (body/head/arm/legs/weak point)
6. Confirm → resolve combat (see combat.md)
7. Combat animation plays
8. Results applied (damage, death, EXP, level-up)
9. Unit's turn ends (hasActed = true)
```

### Heal Flow

```
1. Select "Heal" → show heal range (green overlay)
2. Click ally in range → heal resolved immediately
3. Heal amount = MAG + staff might (capped at target's max HP)
4. Healer gains EXP (same formula as combat, using staff rank)
5. Unit's turn ends
```

### Item Flow

```
1. Select "Item" → open item submenu
2. Choose item → apply effect
3. Unit's turn ends
```

### Cancel / Undo

- **Before confirming action**: press Escape / right-click → return to action menu
- **Before moving**: press Escape → deselect unit
- **After action resolves**: no undo — turn is consumed

---

## Enemy Phase

### Flow

```
1. Phase banner: "Enemy Phase" → dismissed
2. Fort/throne healing for all enemy units on those tiles
3. Reinforcements spawn (if scheduled for this turn)
4. AI computes all enemy actions (see ai.md)
5. Actions execute one at a time, sequentially (with animation)
6. After all enemies act → Player Phase (next turn)
```

### Reinforcement Spawning

- Defined per chapter: which units spawn, where, and on which turn
- Spawn on the enemy phase of the specified turn
- Cannot spawn on occupied tiles (skipped if blocked)
- Show reinforcement message to player (e.g., "Enemy reinforcements!")
- Reinforcements can act immediately on the turn they spawn

### Enemy Action Execution

Each enemy acts one at a time in sequence:
1. Camera pans to the acting enemy
2. Enemy moves (if moving)
3. Enemy attacks (if target available)
4. Combat animation plays
5. Results applied
6. Brief pause → next enemy

---

## Auto-Battle

Player can toggle auto-battle during player phase. The AI takes over player unit actions using the same AI system as enemies, but with faction-swapped targeting (attacks enemies, heals allies).

- Can be toggled on/off at any time during player phase
- When on, AI selects the next unacted player unit and executes an action
- Uses aggressive behavior by default
- Healers prioritize healing injured allies over waiting
- Auto-battle respects all normal rules (weapon triangle, terrain, etc.)

---

## Unit State Per Turn

| State | Meaning | Visual |
|-------|---------|--------|
| **Available** | Has not acted this turn | Full color sprite |
| **Acted** | Has used their action (hasActed = true) | Greyed-out sprite |
| **Dead** | HP reached 0 (permadeath) | Removed from map |

### Movement vs Action

A unit's turn consists of:
1. **Move** (optional) — move to a tile within range
2. **Action** (required) — Attack, Heal, Item, Wait, Seize, or Visit

Once an action is taken, the unit is done for the turn. Exception: **Canto** (Cavalier) — after acting, can use remaining MOV to reposition.

---

## Turn Counter

- Starts at Turn 1
- Increments after both Player and Enemy phases complete
- Used for:
  - Reinforcement timing
  - Turn-limited objectives (future)
  - STA accumulation tracking
  - Time-of-day progression (if multi-phase time system added)

---

## End Turn

### Manual End Turn

Player can press "End Turn" button at any time during player phase. All unacted units forfeit their turn.

### Auto End Turn

When the last player unit acts (all units hasActed = true), the player phase ends automatically. No button press needed.

---

## Victory / Defeat Conditions

### Victory

| Condition | Description |
|-----------|-------------|
| **Rout** | All enemy units defeated |
| **Seize** | Lord captures the throne/objective tile |
| **Boss Kill** | Specific boss enemy defeated (chapter-dependent) |

Each chapter specifies which victory condition applies. Seize requires routing nearby guards first (boss blocks the throne).

### Defeat

| Condition | Result |
|-----------|--------|
| **Lord dies** | Instant game over — Ren must survive every chapter |
| **All player units die** | Game over |

### Post-Victory

```
1. Victory fanfare
2. EXP/stats summary (future)
3. Chapter results screen
4. Transition to next chapter / preparation phase
```

---

## Preparation Phase (Pre-Chapter)

Before each chapter (Ch2+), the player can:

| Action | Description |
|--------|-------------|
| **View map** | See terrain, starting positions, enemy placements |
| **Position units** | Rearrange starting positions within deployment zone |
| **Equip skills** | Swap skills in/out of slots (up to slot limit) |
| **Equip weapons** | Choose equipped weapon per unit |
| **Use items** | Use consumables or food before battle |
| **Ren's Teaching** | Spend LOOP to teach skills to allies (see skills.md) |
| **Cook food** | Prepare meals using ingredients (see items.md) |
| **View stats** | Check unit stats, growth history, AWR/LOOP/SYNC |

### Preparation Restrictions

- Cannot change skills mid-chapter — only during preparation
- Cannot change unit deployment after chapter starts
- Ren's Teaching costs carry over (+5 STA at chapter start, +2 CRP to both)

---

## Meta-Stat Phase Effects

| Stat | Phase Effect |
|------|-------------|
| **STA** | Accumulates during player actions (move/attack). Resets to 0 at chapter start. |
| **CRP** | Increases from glitched terrain, certain skills, teaching. Never decreases naturally (only via Purify staff or Defrag skill). |
| **LOY** | Changes based on player decisions during story events (not combat). Devotion auto-shield triggers during combat. |
| **SYNC** | Increases at forts/thrones (+2/+3 per turn). Decreases on glitched terrain. Affects stat consistency. |
| **AWR** | Increases from witnessing glitches, story events. Unlocks UI elements (enemy stats, terrain info). |
| **LOOP** | Decreases when Ren uses memory abilities. Increases from Memory Tiles, kills (Memory Leech). |

---

## Open Questions

- **Fog of war**: Should any chapters use limited visibility? AWR-based sight range?
- **Turn limits**: Should chapters have optional turn limits for bonus rewards (ranked play)?
- **Undo move**: Should the player be able to undo movement (before acting) like modern FE? Currently no undo.
- **Danger zone**: Currently shows all tiles enemies can attack. Should it also show kill zones (tiles where the player would die)?
- **Dual actions**: Should any unit be able to act twice per turn (beyond Overclock skill)?
