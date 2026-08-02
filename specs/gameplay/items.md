# Items

All consumable, food, and key items. Weapons and staves are defined in [weapons.md](weapons.md). Promotion items are cross-referenced with [promotion.md](promotion.md). Shop pricing aligns with [economy.md](economy.md).

Items are used via the **Item** action during a unit's turn. Each item has limited uses.

---

## Consumables (Medicine)

Standard healing/support items. No food preference system — these are generic.

| Item | Uses | Effect | Cost | Availability | Notes |
|------|------|--------|------|-------------|-------|
| **Vulnerary** | 3 | Heal 10 HP | 300G | Arc 1+ shops, drops | Bread and butter. Always carry one. |
| **Concoction** | 3 | Heal 20 HP | 600G | Arc 1+ (Ch2+) shops | Stronger vulnerary. |
| **Elixir** | 3 | Heal to full HP | 3000G | Arc 3+ shops (rare) | Emergency only. Expensive. |
| **Antitoxin** | 1 | Cure poison status | 450G | Arc 1+ (Ch2+) shops | Removes poison, does not heal HP. |
| **Pure Water** | 1 | +7 RES for 1 chapter | 900G | Arc 2+ shops | Pre-battle buff vs mage-heavy maps. |
| **Torch** | 1 | Reveal fog in 5-tile radius | 500G | Fog/night maps only | Reveals hidden enemies and terrain. |

---

## Promotion Items

Used to promote units between class tiers. See [promotion.md](promotion.md) for full promotion mechanics and acquisition timeline.

### Tier 1: Base → Promoted

| Item | Classes | Cost | Availability |
|------|---------|------|-------------|
| **Hero Crest** | Lord, Mercenary, Fighter | 2500G | Ch7 (shop), Ch8 (boss drop) |
| **Knight Crest** | Cavalier, Soldier, Armor Knight | 2500G | Ch7 (shop), Ch9 (treasure) |
| **Guiding Ring** | Mage, Cleric, Shaman, Monk, Troubadour | 2500G | Ch8 (treasure), Ch10 (shop) |
| **Elysian Whip** | Pegasus Knight, Wyvern Rider | 2500G | Ch9 (treasure), Ch12 (shop) |
| **Lockpick+** | Thief | — | Ch10 (quest reward). Doubles as promotion item + reusable lockpick. |
| **Master Seal** | Any base class | 4000G | Ch10 (first), 1-2 per arc after. Universal but rare. |

### Tier 2: Promoted → Master

| Item | Classes | Cost | Availability |
|------|---------|------|-------------|
| **Master Crown** | Any promoted class | — | Ch18 (story), Ch22 (hidden treasure), Ch24 (boss drop). Only 3 in entire game. Cannot be bought. |

### Promotion Item Acquisition Timeline

| Chapter | Items |
|---------|-------|
| Ch7 | Hero Crest (shop), Knight Crest (shop) |
| Ch8 | Guiding Ring (treasure), Hero Crest (boss drop) |
| Ch9 | Knight Crest (treasure), Elysian Whip (treasure) |
| Ch10 | Master Seal (quest reward), Lockpick+ (quest reward), Guiding Ring (shop) |
| Ch12 | Elysian Whip (shop), Master Seal (treasure) |
| Ch14 | Master Seal (monastery reward) |
| Ch15 | Hero Crest (shop), Knight Crest (shop) |
| Ch18 | **Master Crown** (story reward — first ever) |
| Ch20 | Master Seal (shop), all class-specific seals (shop) |
| Ch22 | **Master Crown** (hidden treasure) |
| Ch24 | **Master Crown** (boss drop — final one) |

---

## Keys & Utility

| Item | Uses | Effect | Cost | Availability | Notes |
|------|------|--------|------|-------------|-------|
| **Door Key** | 1 | Open one locked door | 200G | Arc 1+ shops | Any unit can use. |
| **Chest Key** | 1 | Open one treasure chest | 300G | Arc 1+ shops | Any unit can use. Consumed on use. |
| **Lockpick** | 15 | Open doors and chests | — | Thief starting item, rare drops | Thief/Rogue only. Reusable but limited durability. |
| **Lockpick+** | ∞ | Open doors and chests + promotes Thief | — | Ch10 quest reward | Thief/Rogue only. Unlimited uses. Also serves as Thief's promotion item. |

---

## Forging Materials

Used at the forge (available from Arc 3). See [economy.md](economy.md) for forging costs and rules.

| Material | Effect | Source | Arc |
|----------|--------|--------|-----|
| **Adamant** | Required for +2 forging | Treasure chests, rare enemy drops | Arc 3+ (2-3 per arc) |
| **Mithril** | Required for +3 forging | Treasure chests only, 1-2 per arc | Arc 4+ (very rare) |

### Material Distribution

| Arc | Adamant Available | Mithril Available |
|-----|------------------|------------------|
| Arc 3 (Ch11-15) | 3 (Ch11 chest, Ch13 drop, Ch15 chest) | 0 |
| Arc 4 (Ch16-20) | 2 (Ch17 chest, Ch19 drop) | 2 (Ch16 chest, Ch20 chest) |
| Arc 5 (Ch21-25) | 3 (Ch21 drop, Ch23 chest, Ch25 chest) | 2 (Ch22 chest, Ch24 boss drop) |
| **Total** | **8** | **4** |

---

## Food Items

Food items use the preference system defined in [stats.md](stats.md). Each food has a taste category, cuisine style, and food type that determine its effects.

### Rations (携帯食)

Cheap, portable. No preference modifier — they all taste the same.

| Item | Uses | Effect | Cost | Availability |
|------|------|--------|------|-------------|
| **Dried Rations** | 3 | Heal 10 HP | 200G | Arc 1+ shops |
| **Travel Bread** | 2 | Heal 10 HP, -3 STA | 350G | Arc 1+ shops |
| **Hardtack** | 5 | Heal 5 HP | 150G | Arc 1+ shops, plentiful |

### Cooked Meals (料理)

Prepared food. Full preference system applies (×1.5 fav food, ×0.5 hated).

| Item | Uses | Base Effect | Taste | Cuisine | Cost | Availability |
|------|------|-----------|-------|---------|------|-------------|
| **Grilled Steak** | 1 | Heal 15 HP, -5 STA | Meat | 洋風 | 500G | Arc 1+ |
| **Grilled Salmon** | 1 | Heal 15 HP, -5 STA | Seafood | 和風 | 500G | Arc 1+ (Ch2+) |
| **Salt-baked Sea Bream** | 1 | Heal 15 HP, -5 STA | Seafood | 北国風 | 550G | Arc 1+ (Ch2+) |
| **Buckwheat Noodles** | 1 | Heal 15 HP, -5 STA | Grain | 和風 | 400G | Arc 1+ |
| **White Rice** | 1 | Heal 15 HP, -5 STA | Grain | 和風 | 350G | Arc 1+ |
| **Roast Chicken** | 1 | Heal 15 HP, -5 STA | Meat | 洋風 | 500G | Arc 1+ |
| **Chili Oil Dumplings** | 1 | Heal 15 HP, -5 STA | Spicy | 中華風 | 450G | Arc 1+ (Ch2+) |
| **Red Curry** | 1 | Heal 15 HP, -5 STA | Spicy | 中華風 | 450G | Arc 1+ (Ch2+) |
| **Lamb Skewers** | 1 | Heal 15 HP, -5 STA | Meat | 中華風 | 500G | Arc 2+ |
| **Venison Stew** | 1 | Heal 15 HP, -5 STA | Meat | 北国風 | 550G | Arc 2+ |
| **Cream Stew** | 1 | Heal 15 HP, -5 STA | Dairy | 洋風 | 500G | Arc 1+ |
| **Oat Porridge** | 1 | Heal 15 HP, -5 STA | Grain | 北国風 | 300G | Arc 1+ |
| **Steamed Broccoli** | 1 | Heal 15 HP, -5 STA | Vegetables | 和風 | 300G | Arc 1+ |
| **Roast Pumpkin** | 1 | Heal 15 HP, -5 STA | Vegetables | 北国風 | 350G | Arc 1+ |
| **Tomato Salad** | 1 | Heal 15 HP, -5 STA | Vegetables | 洋風 | 350G | Arc 1+ (Ch2+) |
| **Garlic Mushrooms** | 1 | Heal 15 HP, -5 STA | Vegetables | 中華風 | 400G | Arc 1+ (Ch2+) |
| **Fried Shrimp** | 1 | Heal 15 HP, -5 STA | Seafood | 中華風 | 550G | Arc 2+ |
| **Sashimi** | 1 | Heal 15 HP, -5 STA | Seafood | 和風 | 600G | Arc 2+ |

### Feast Dishes (御馳走)

Rare, powerful. Strongest preference effects.

| Item | Uses | Base Effect | Taste | Cuisine | Cost | Availability |
|------|------|-----------|-------|---------|------|-------------|
| **Frosted Cake** | 1 | Heal 20 HP, -8 STA, +1 random stat | Sweets | 洋風 | 1200G | Arc 1+ (Ch2+) rare |
| **Caramel Pudding** | 1 | Heal 20 HP, -8 STA, +1 random stat | Sweets | 南国風 | 1200G | Arc 2+ rare |
| **Honey Pastry** | 1 | Heal 20 HP, -8 STA, +1 random stat | Sweets | 南国風 | 1000G | Arc 1+ (Ch2+) rare |
| **Chocolate Truffle** | 1 | Heal 20 HP, -8 STA, +1 random stat | Sweets | 洋風 | 1500G | Arc 2+ rare |
| **Smoked Jerky Platter** | 1 | Heal 20 HP, -8 STA, +1 random stat | Meat | 北国風 | 1000G | Arc 1+ (Ch2+) rare |
| **Citrus Tart** | 1 | Heal 20 HP, -8 STA, +1 random stat | Fruit | 南国風 | 1100G | Arc 2+ rare |

### Drinks (飲料)

STA recovery only. No HP heal.

| Item | Uses | Effect | Cost | Availability |
|------|------|--------|------|-------------|
| **Water** | 3 | -3 STA | 100G | Arc 1+ |
| **Herbal Tea** | 2 | -5 STA | 300G | Arc 1+ |
| **Black Coffee** | 1 | -8 STA, +1 SKL for chapter | 500G | Arc 1+ (Ch2+) |

### Alcohol (酒)

Unique buff/debuff profile. See [stats.md](stats.md) for full alcohol effects.

| Item | Uses | Effect | Taste | Cuisine | Cost | Availability |
|------|------|--------|-------|---------|------|-------------|
| **Ale** | 2 | -5 STA, +2 STR/CHA, -1 SKL/SPD, -2 WIL | Alcohol | 北国風 | 400G | Arc 1+ |
| **Red Wine** | 1 | -5 STA, +2 STR/CHA, -1 SKL/SPD, -2 WIL | Alcohol | 洋風 | 800G | Arc 1+ (Ch2+) |
| **Wheat Beer** | 2 | -5 STA, +2 STR/CHA, -1 SKL/SPD, -2 WIL | Alcohol | 北国風 | 350G | Arc 1+ |
| **Mead** | 1 | -5 STA, +2 STR/CHA, -1 SKL/SPD, -2 WIL | Alcohol | 南国風 | 600G | Arc 1+ (Ch2+) |
| **Rice Sake** | 1 | -5 STA, +2 STR/CHA, -1 SKL/SPD, -2 WIL | Alcohol | 和風 | 700G | Arc 1+ (Ch2+) |
| **Plum Wine** | 1 | -5 STA, +2 STR/CHA, -1 SKL/SPD, -2 WIL | Alcohol | 中華風 | 650G | Arc 1+ (Ch2+) |
| **Whiskey** | 1 | -5 STA, +3 STR/CHA, -2 SKL/SPD, -3 WIL | Alcohol | 洋風 | 1200G | Arc 2+ rare |

Whiskey is stronger than standard alcohol — higher buff AND higher debuff.

### Buff Food (強化食)

Targeted stat boost. No HP heal.

| Item | Uses | Effect | Cost | Availability |
|------|------|--------|------|-------------|
| **Power Root** | 1 | +2 STR for chapter | 800G | Arc 1+ (Ch2+) |
| **Spirit Dust** | 1 | +2 MAG for chapter | 800G | Arc 1+ (Ch2+) |
| **Speed Wing** | 1 | +2 SPD for chapter | 800G | Arc 1+ (Ch2+) |
| **Defense Charm** | 1 | +2 DEF for chapter | 800G | Arc 1+ (Ch2+) |
| **Resistance Tonic** | 1 | +2 RES for chapter | 800G | Arc 1+ (Ch2+) |
| **Skill Manual** | 1 | +2 SKL for chapter | 800G | Arc 1+ (Ch2+) |
| **Fortune Coin** | 1 | +3 LCK for chapter | 600G | Arc 1+ |
| **Iron Will Tonic** | 1 | +2 WIL for chapter | 1000G | Arc 2+ |

### Antidote Food (解毒食)

Corruption cleansing. Rare and valuable.

| Item | Uses | Effect | Cost | Availability |
|------|------|--------|------|-------------|
| **Purifying Herb** | 1 | -5 CRP | 1500G | Arc 2+ rare drops, Arc 3+ shops (limited stock) |
| **Cleansing Broth** | 1 | -10 CRP, heal 10 HP | 3000G | Arc 3+ rare drops only |
| **Sacred Water** | 1 | -15 CRP, +5 WIL for chapter | 5000G | Arc 4+ treasure chests only |

---

## Key Items

Story-critical or chapter-specific items. Cannot be sold or discarded.

### Arc 1 — The Script (Ch1-5)

| Item | Chapter | Effect | How to Get |
|------|---------|--------|-----------|
| **Ren's Journal** | Ch1+ | View Cycle Memory choices at any time. UI item, no combat use. | Starting inventory |
| **Village Map** | Ch2 | Reveals hidden village tile on Ch2 map. Consumed on use. | NPC dialogue in Ch2 |
| **Broken Seed** | Ch2 | Senna uses this to crack the RNG seed. Consumed in story event. | Dropped by Thane (Ch2 boss) |
| **Signal Flare** | Ch4 | Calls reinforcements to assist in Ch4 defense. Single use. | Ch3 village reward |
| **Nira's Pendant** | Ch3+ | Passive: +5 Hit for Nira when equipped. Keepsake from her village. | Nira's starting inventory |

### Arc 2 — Fractures (Ch6-10)

| Item | Chapter | Effect | How to Get |
|------|---------|--------|-----------|
| **Kael's Lance** | Ch8+ | +3 ATK, +10 LOY when equipped. Only usable by Ren after Kael's death. Carries Kael's data signature. | Recovered after Kael's death (Ch8) |
| **Cipher Stone** | Ch7 | Senna uses to decode encrypted enemy orders. Reveals enemy placement in Ch8 prep. | Ch7 treasure chest |
| **Orin's Tambourine** | Ch9+ | Required for Orin's Dance action. Cannot be removed. | Orin's starting inventory |
| **Resistance Ledger** | Ch10 | Documents enemy troop movements. Grants +1 deployment slot for Ch11-12. | Ch10 quest reward |

### Arc 3 — Corruption (Ch11-15)

| Item | Chapter | Effect | How to Get |
|------|---------|--------|-----------|
| **Corruption Detector** | Ch11+ | Shows CRP values of all units on map (including enemies). Passive. | Ch11 story event |
| **Ward Stone** | Ch12-15 | Prevents CRP gain for 1 unit for 1 chapter. 3 uses. | Ch12 monastery reward |
| **Ancient Tome** | Ch14 | Elara uses to perform a group cleansing ritual. All units -5 CRP. Single use, story event. | Ch13 hidden chamber |
| **Zael's Contract** | Ch13 | Conditional: If Zael is recruited, this seals the deal. If refused, Zael becomes Ch14 boss. | Ch13 dialogue choice |

### Arc 4 — Awakening (Ch16-20)

| Item | Chapter | Effect | How to Get |
|------|---------|--------|-----------|
| **System Fragment** | Ch16+ | Reveals System dialogue options. Enables negotiation in Ch17. | Ch16 boss drop |
| **Override Key** | Ch18 | Ghael uses to open the sealed fortress gate. Single use. | Ch18 story event |
| **Echo's Core** | Ch20+ | Echo's existence depends on this. If destroyed, Echo dies. If protected, Echo gains +3 all stats permanently. | Ch20 story event |
| **Memory Shard (Kael)** | Ch19 | Triggers flashback. All units gain +5 LOY, Ren gains +10 AWR. | Ch19 hidden tile |

### Arc 5 — The Last Save File (Ch21-25)

| Item | Chapter | Effect | How to Get |
|------|---------|--------|-----------|
| **Corrupted Fragment** | Ch24 | ???_CORRUPTED drops this on phase transitions. Reveals boss's current weapon cycle when used. 3 uses. | Ch24 boss fight |
| **System Key** | Ch25 | Required to access the final tile. No combat use. | Story event after ???_CORRUPTED is defeated |
| **Cycle Record** | Ch22+ | Documents all 347 cycles. +20 AWR for any unit that reads it (one-time per unit). | Ch22 hidden archive |
| **Final Save Crystal** | Ch25 | The game's actual save file, manifested as an item. Required for the true ending. | Ch25 story event |
| **Kael's Echo** | Ch24 | Proof that ???_CORRUPTED is Kael. Ren's dialogue changes based on possession. | Ch24 mid-battle event |

---

## Stat Boosters (Permanent)

Extremely rare. Permanently raise a stat by 2. Found in hidden locations, boss drops, or treasure chests. Spread across all 5 arcs to prevent hoarding.

### Distribution by Arc

| Item | Effect | Arc 1 | Arc 2 | Arc 3 | Arc 4 | Arc 5 | Total |
|------|--------|-------|-------|-------|-------|-------|-------|
| **Energy Drop** | +2 STR | Ch2 chest | — | Ch13 chest | — | Ch22 shop (1) | 3 |
| **Spirit Dust** | +2 MAG | — | Ch8 boss | Ch14 chest | — | Ch22 shop (1) | 3 |
| **Speedwing** | +2 SPD | Ch2 village | — | Ch12 chest | Ch18 boss | — | 3 |
| **Secret Book** | +2 SKL | — | Ch7 chest | Ch15 chest | — | Ch23 chest | 3 |
| **Goddess Icon** | +2 LCK | Ch1 village | — | — | Ch17 village | Ch21 chest | 3 |
| **Dracoshield** | +2 DEF | — | Ch9 chest | — | Ch19 chest | Ch24 boss | 3 |
| **Talisman** | +2 RES | — | Ch6 village | Ch11 chest | — | Ch23 chest | 3 |
| **Crown** | +2 CHA | — | — | Ch15 boss | Ch20 chest | — | 2 |
| **Mind Crystal** | +2 WIL | — | Ch10 chest | — | Ch16 chest | Ch25 chest | 3 |

**Total stat boosters**: 26 across 25 chapters (~1 per chapter on average). Arc 5 shop sells 1 of each at 5000G each (limited stock: 1).

### Design Notes

- No arc has more than 6 stat boosters (prevents power spikes)
- Arc 1 has only 3 (gold is scarce, finding hidden chests is the reward)
- Arc 3 has the most (7) to coincide with promotion window — boosters help promoted units
- Arc 5 shop provides a final safety net for stats the player neglected

---

## Inventory Rules

- Each unit carries up to **5 items** (weapons + consumables combined).
- Weapons occupy item slots. A unit with 2 weapons has 3 remaining slots.
- Items can be traded between adjacent allies during the **Trade** action (costs the initiator's action).
- Food spoilage: Cooked Meals and Feast Dishes **expire after 3 chapters** if not used. Rations, Drinks, and Buff Food do not expire.
- Gold is shared party-wide. Not per-unit.
- **Supply Convoy**: All items not in unit inventories are stored here. Accessible during preparation phase and at armory tiles mid-chapter. Unlimited capacity. See [economy.md](economy.md).
- Promotion items, keys, and forging materials are stored in convoy when not in unit inventory.
- Key items do not occupy inventory slots — they go to a separate Key Items pocket.

---

## Shop Availability Summary

Shops are accessible during the **Preparation Phase** before each chapter. Inventory rotates by arc. See [economy.md](economy.md) for full shop inventory including weapons.

### By Arc (Items Only)

| Arc | Consumables | Food | Promotion | Utility |
|-----|------------|------|-----------|---------|
| **Arc 1** (Ch1-5) | Vulnerary, Concoction, Antitoxin | All Rations, basic Cooked Meals, Water, Herbal Tea, Coffee, Ale, Beer, Fortune Coin, basic Buff Foods | — | Door Key, Chest Key |
| **Arc 2** (Ch6-10) | + Pure Water | + All remaining Cooked Meals, Feast Dishes, all Alcohol, Iron Will Tonic, Purifying Herb (rare) | Hero Crest, Knight Crest (Ch7+), Guiding Ring (Ch10+) | + Torch |
| **Arc 3** (Ch11-15) | + Elixir | + Cleansing Broth (rare) | + Master Seal, Elysian Whip (Ch12+), Lockpick+ (Ch10 reward) | — |
| **Arc 4** (Ch16-20) | All consumables | + Sacred Water (rare) | All class seals, Master Seal (Ch20 shop) | — |
| **Arc 5** (Ch21-25) | All consumables | All food | All promotion items (shop), Master Crown (NOT sold) | Stat Boosters (5000G each, limit 1) |

### Night/Fog Maps

Torch available at chapter-start shop for any fog or night chapter regardless of arc.

---

## Item Count Summary

| Category | Count |
|----------|-------|
| Consumables (Medicine) | 6 |
| Promotion Items | 7 (Hero Crest, Knight Crest, Guiding Ring, Elysian Whip, Lockpick+, Master Seal, Master Crown) |
| Keys & Utility | 4 (Door Key, Chest Key, Lockpick, Lockpick+) |
| Forging Materials | 2 (Adamant, Mithril) |
| Rations | 3 |
| Cooked Meals | 18 |
| Feast Dishes | 6 |
| Drinks | 3 |
| Alcohol | 7 |
| Buff Food | 8 |
| Antidote Food | 3 (Purifying Herb, Cleansing Broth, Sacred Water) |
| Key Items | 20 (4 per arc) |
| Stat Boosters | 9 types (26 total instances) |
| **Total unique items** | **~96** |

---

## Open Questions

- **Cooking system**: Should there be a preparation-phase cooking mechanic where raw ingredients combine into meals? *Recommendation: No — adds complexity without enough depth for 25 chapters. Keep food as shop purchases.*
- **Shared meals**: Lira's group meal mechanic — does sharing a food item split the effect or duplicate it? *Recommendation: Split HP heal (each gets half), share STA reduction (full -STA to each).*
- **Item drops**: Should regular enemies have a chance to drop items/gold, or only scripted drops? *Recommendation: Scripted only — random drops undermine economy balance.*
- **Spoilage timer**: 3-chapter expiry for cooked meals feels right for 25 chapters. Too short at 2 (original 4-chapter design). Too long at 5 (no pressure to use them).
- **Steal interaction**: Can Thieves/Rogues steal consumables and food from enemies? Or only weapons? *Recommendation: Steal any non-key item from enemy inventory. Creates tactical risk/reward.*
