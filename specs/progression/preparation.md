# Preparation Screen

Pre-battle hub where the player manages their army. Available before every chapter except Ch1 (tutorial).

---

## Preparation Flow

```
Enter Preparation → Unit Selection → Inventory Management → Shop → Forge → Bonus EXP → Support Conversations → Map Preview → Start Battle
```

All steps are optional — the player can go straight to "Start Battle" at any time. Last deployment is remembered as default for next chapter.

---

## Unit Selection (Deploy)

### Deployment Slots

| Arc | Chapters | Max Deploy | Roster Size |
|-----|----------|-----------|-------------|
| Arc 1 | Ch1-5 | 6 → 8 | 5 → 9 |
| Arc 2 | Ch6-10 | 8 → 10 | 9 → 11 |
| Arc 3 | Ch11-15 | 10 → 11 | 11 → 14 |
| Arc 4 | Ch16-20 | 11 → 12 | 14 → 15 |
| Arc 5 | Ch21-25 | 12 | 15 |

### Deployment Rules

- **Ren is always deployed** (forced slot 1 — Lord must be on the field)
- Remaining slots filled by player choice from available roster
- Units not deployed sit in reserve — they do NOT gain EXP, support points, or any benefits
- Story-required units are force-deployed for specific chapters (e.g., Kael in Ch8, Elara in Ch14)
- Deployment order determines starting positions on the map (slot 1-N maps to spawn tiles 1-N)

### Deploy Screen Layout

```
┌─────────────────────────────────────┐
│  DEPLOY  (8/10 slots filled)        │
│                                     │
│  [1] Ren ★ Lv18 Lord         LOCKED │
│  [2] Senna   Lv16 Sage       [  ×]  │
│  [3] Bram    Lv17 Warrior    [  ×]  │
│  [4] Lira    Lv15 Bishop     [  ×]  │
│  [5] Voss    Lv16 General    [  ×]  │
│  [6] Nira    Lv14 Sniper     [  ×]  │
│  [7] Coda    Lv15 Assassin   [  ×]  │
│  [8] Rook    Lv16 Hero       [  ×]  │
│  ── available ──                     │
│  [ ] Faye    Lv13 Valkyrie          │
│  [ ] Orin    Lv12 Dancer            │
│  [ ] Kira    Lv14 Druid             │
│                                     │
│  [Start Battle]  [Shop]  [Forge]    │
└─────────────────────────────────────┘
```

- Click/select unit to add or remove from deployment
- Hover shows full stat summary
- ★ indicates forced deploy (cannot remove)
- Units show class, level, and equipped weapon icon

---

## Inventory Management

### Per-Unit Inventory

Each unit has **5 inventory slots**:
- Weapons, items, and consumables share the same 5 slots
- Key items are stored separately (do not consume inventory slots)
- Equipped weapon is always slot 1 (can rearrange)

### Actions

| Action | Description |
|--------|-------------|
| **Equip** | Set a weapon as the unit's active weapon (slot 1) |
| **Trade** | Swap items between two deployed units |
| **Convoy → Unit** | Move item from supply convoy to unit's inventory |
| **Unit → Convoy** | Move item from unit's inventory to supply convoy |
| **Discard** | Permanently remove item (with confirmation) |
| **View Stats** | Show weapon/item stat details |

### Supply Convoy

- Unlimited storage shared across the army
- All unequipped items automatically stored here between chapters
- Accessible during preparation only (not mid-battle except at Armory tiles)
- Displays items sorted by category: Weapons → Tomes → Staves → Items → Materials → Promotion Items

---

## Shop

Available during preparation. Inventory rotates by arc (see [economy.md](../gameplay/economy.md) for full inventory tables).

### Shop Interface

```
┌───────────────────────────────────────┐
│  SHOP — Arc 3                         │
│  Gold: 12,450                         │
│                                       │
│  BUY                 SELL             │
│  ───────────         ─────────        │
│  Killer Edge  2,200  Iron Sword  250  │
│  Killer Lance 2,400  Steel Axe   600  │
│  Steel Knife  1,200  Vulnerary   150  │
│  Nosferatu    1,800  ...              │
│  Master Seal  2,500                   │
│  Physic       2,000                   │
│  Elixir       3,000                   │
│  ...                                  │
│                                       │
│  [Buy]  [Sell]  [Back]                │
└───────────────────────────────────────┘
```

- Buy: purchase items → goes to convoy (or directly to unit if selected)
- Sell: sell from convoy or unit inventories at 50% purchase price
- Items bought go to the supply convoy by default
- Limited stock items show remaining count (e.g., "Master Seal ×2")

### Stock Limits

Most weapons are unlimited stock. The following have per-chapter limits:

| Item | Stock per Chapter |
|------|------------------|
| Promotion seals (all types) | 1-2 |
| Stat boosters | 1 (Arc 5 shops only) |
| Brave weapons | 1 |
| S-rank tomes | 1 (Arc 5 only) |
| Elixir | 3 |
| Physic | 2 |

---

## Forge

Available from **Arc 3 (Ch11)** onward. See [economy.md](../gameplay/economy.md) for full forging rules.

### Forge Interface

```
┌──────────────────────────────────────┐
│  FORGE                               │
│  Gold: 12,450 | Adamant: 2 | Mithril: 1│
│                                      │
│  Select weapon to forge:             │
│  ─────────────────────               │
│  Iron Sword      → +1 (1,000g)      │
│                   → +2 (2,500g + Ad) │
│                   → +3 (5,000g + Mi) │
│  Steel Lance     → +1 (1,000g)      │
│                   → +2 (2,500g + Ad) │
│  Killing Edge    → +1 (1,000g)      │
│                                      │
│  Choose boost: [Might] [Hit] [Crit]  │
│  Preview: Iron Sword+2 → 7 Mt (+2)  │
│                                      │
│  [Forge]  [Back]                     │
└──────────────────────────────────────┘
```

- Select weapon → select tier → select stat boost (Might/Hit/Crit) → confirm
- Preview shows before/after stats
- Prf weapons and Brave weapons cannot be forged
- Each weapon can only be forged once (choose wisely)

---

## Bonus EXP

Available from **Arc 2 (Ch6)** onward. Earned by completing chapters under par turns.

### Distribution

```
┌──────────────────────────────────────┐
│  BONUS EXP — Available: 240          │
│                                      │
│  Distribute to deployed units:       │
│  ─────────────────────               │
│  Senna   Lv16  [+0]  [▲] [▼]        │
│  Bram    Lv17  [+0]  [▲] [▼]        │
│  Orin    Lv12  [+100][▲] [▼]  ← LOW │
│  Kira    Lv14  [+100][▲] [▼]  ← LOW │
│  ...                                 │
│  Remaining: 40                       │
│                                      │
│  [Confirm]  [Reset]  [Back]          │
└──────────────────────────────────────┘
```

- Manually allocate Bonus EXP to any deployed unit
- EXP is applied immediately — unit may level up in preparation
- "LOW" indicator flags units 3+ levels below party average (catch-up candidates)
- Unused Bonus EXP carries over to next chapter
- EXP allocated in increments of 10

---

## Support Conversations

Available from **Ch3** onward. View and unlock support conversations between units with sufficient support points.

### Interface

```
┌──────────────────────────────────────┐
│  SUPPORTS                            │
│                                      │
│  Ren × Senna     [A] — NEW! View?   │
│  Bram × Lira     [B] ██████░░ 72/100│
│  Voss × Nira     [C] ██░░░░░░ 30/50 │
│  Coda × Rook     [—] ░░░░░░░░  8/20 │
│  ...                                 │
│                                      │
│  [View]  [Back]                      │
└──────────────────────────────────────┘
```

- Shows all support pairs with current rank and progress
- "NEW!" marks newly unlocked ranks that haven't been viewed
- Viewing a support conversation plays the dialogue scene
- Support ranks affect combat bonuses (see [support-system.md](../gameplay/support-system.md))
- Max 5 support partners per unit, 1 S-rank max (except Ren: unlimited partners)

---

## Map Preview

### Info Display

Before starting the battle, the player can preview:

| Info | Description |
|------|-------------|
| **Map thumbnail** | Zoomed-out view of the terrain grid |
| **Objective** | Primary objective text + icon |
| **Secondary objective** | Optional objective with reward description |
| **Par turns** | Target turn count for Bonus EXP |
| **Enemy count** | Total enemies on map (not including reinforcements) |
| **Boss info** | Boss name, class, level (no detailed stats — must scout in-battle) |
| **Weather** | Active weather effect, if any |
| **Special rules** | Fog of war, split party, scripted events warning |
| **Recommended level** | Suggested party level range |
| **New mechanics** | First-time mechanic introductions (e.g., "Fog of War — visibility limited!") |

### Recommended Levels by Arc

| Arc | Recommended Level |
|-----|------------------|
| Arc 1 (Ch1-5) | 1-8 |
| Arc 2 (Ch6-10) | 8-15 |
| Arc 3 (Ch11-15) | 15-20 |
| Arc 4 (Ch16-20) | 20-28 |
| Arc 5 (Ch21-25) | 28-35 |

---

## Preparation Availability by Chapter

| Chapter | Deploy | Shop | Forge | Bonus EXP | Supports | Arena | Notes |
|---------|--------|------|-------|-----------|----------|-------|-------|
| Ch1 | No | No | No | No | No | No | Tutorial — no prep |
| Ch2-5 | Yes | Yes | No | No | Ch3+ | No | Basic prep |
| Ch6 | Yes | Yes | No | Yes | Yes | No | Bonus EXP unlocks |
| Ch7-10 | Yes | Yes | No | Yes | Yes | Ch7+ | Arena unlocks Ch7 |
| Ch11-15 | Yes | Yes | Yes | Yes | Yes | Yes | Forging unlocks |
| Ch16-20 | Yes | Yes | Yes | Yes | Yes | Yes | Full access |
| Ch21-25 | Yes | Yes | Yes | Yes | Yes | Yes | Full access |

---

## Open Questions

- **Base camp**: Should there be a visual base camp between chapters (like FE's monastery) or keep it menu-only? *Recommendation: Menu-only. A visual base adds scope without gameplay value for this project.*
- **Cooking/meals**: Should the party be able to cook meals for temporary buffs? *Recommendation: No — food items already exist as consumables. A cooking system adds UI complexity.*
- **Training grounds**: Beyond arena, should units be able to spar for weapon rank without gold cost? *Recommendation: No — weapon rank should come from combat, not free grinding.*
