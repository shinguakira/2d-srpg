# Items

All consumable, food, and key items. Weapons and staves are defined in [weapons.md](weapons.md).

Items are used via the **Item** action during a unit's turn. Each item has limited uses.

---

## Consumables (Medicine)

Standard healing/support items. No food preference system — these are generic.

| Item | Uses | Effect | Cost | Availability | Notes |
|------|------|--------|------|-------------|-------|
| **Vulnerary** | 3 | Heal 10 HP | 300G | Ch1+ shops, drops | Bread and butter. Always carry one. |
| **Concoction** | 3 | Heal 20 HP | 600G | Ch2+ shops | Stronger vulnerary. |
| **Elixir** | 3 | Heal to full HP | 3000G | Ch3+ rare drops | Emergency only. Expensive. |
| **Antitoxin** | 1 | Cure poison status | 450G | Ch2+ shops | Removes poison, does not heal HP. |
| **Pure Water** | 1 | +7 RES for 1 chapter | 900G | Ch2+ shops | Pre-battle buff vs mage-heavy maps. |
| **Torch** | 1 | Reveal fog in 5-tile radius | 500G | Night maps only | Reveals hidden enemies and terrain. |

---

## Food Items

Food items use the preference system defined in [stats.md](stats.md). Each food has a taste category, cuisine style, and food type that determine its effects.

### Rations (携帯食)

Cheap, portable. No preference modifier — they all taste the same.

| Item | Uses | Effect | Cost | Availability |
|------|------|--------|------|-------------|
| **Dried Rations** | 3 | Heal 10 HP | 200G | Ch1+ shops |
| **Travel Bread** | 2 | Heal 10 HP, -3 STA | 350G | Ch1+ shops |
| **Hardtack** | 5 | Heal 5 HP | 150G | Ch1+ shops, plentiful |

### Cooked Meals (料理)

Prepared food. Full preference system applies (×1.5 fav food, ×0.5 hated).

| Item | Uses | Base Effect | Taste | Cuisine | Cost | Availability |
|------|------|-----------|-------|---------|------|-------------|
| **Grilled Steak** | 1 | Heal 15 HP, -5 STA | Meat | 洋風 | 500G | Ch1+ |
| **Grilled Salmon** | 1 | Heal 15 HP, -5 STA | Seafood | 和風 | 500G | Ch2+ |
| **Salt-baked Sea Bream** | 1 | Heal 15 HP, -5 STA | Seafood | 北国風 | 550G | Ch2+ |
| **Buckwheat Noodles** | 1 | Heal 15 HP, -5 STA | Grain | 和風 | 400G | Ch1+ |
| **White Rice** | 1 | Heal 15 HP, -5 STA | Grain | 和風 | 350G | Ch1+ |
| **Roast Chicken** | 1 | Heal 15 HP, -5 STA | Meat | 洋風 | 500G | Ch1+ |
| **Chili Oil Dumplings** | 1 | Heal 15 HP, -5 STA | Spicy | 中華風 | 450G | Ch2+ |
| **Red Curry** | 1 | Heal 15 HP, -5 STA | Spicy | 中華風 | 450G | Ch2+ |
| **Lamb Skewers** | 1 | Heal 15 HP, -5 STA | Meat | 中華風 | 500G | Ch2+ |
| **Venison Stew** | 1 | Heal 15 HP, -5 STA | Meat | 北国風 | 550G | Ch2+ |
| **Cream Stew** | 1 | Heal 15 HP, -5 STA | Dairy | 洋風 | 500G | Ch1+ |
| **Oat Porridge** | 1 | Heal 15 HP, -5 STA | Grain | 北国風 | 300G | Ch1+ |
| **Steamed Broccoli** | 1 | Heal 15 HP, -5 STA | Vegetables | 和風 | 300G | Ch1+ |
| **Roast Pumpkin** | 1 | Heal 15 HP, -5 STA | Vegetables | 北国風 | 350G | Ch1+ |
| **Tomato Salad** | 1 | Heal 15 HP, -5 STA | Vegetables | 洋風 | 350G | Ch2+ |
| **Garlic Mushrooms** | 1 | Heal 15 HP, -5 STA | Vegetables | 中華風 | 400G | Ch2+ |
| **Fried Shrimp** | 1 | Heal 15 HP, -5 STA | Seafood | 中華風 | 550G | Ch2+ |
| **Sashimi** | 1 | Heal 15 HP, -5 STA | Seafood | 和風 | 600G | Ch2+ |

### Feast Dishes (御馳走)

Rare, powerful. Strongest preference effects.

| Item | Uses | Base Effect | Taste | Cuisine | Cost | Availability |
|------|------|-----------|-------|---------|------|-------------|
| **Frosted Cake** | 1 | Heal 20 HP, -8 STA, +1 random stat | Sweets | 洋風 | 1200G | Ch2+ rare |
| **Caramel Pudding** | 1 | Heal 20 HP, -8 STA, +1 random stat | Sweets | 南国風 | 1200G | Ch3+ rare |
| **Honey Pastry** | 1 | Heal 20 HP, -8 STA, +1 random stat | Sweets | 南国風 | 1000G | Ch2+ rare |
| **Chocolate Truffle** | 1 | Heal 20 HP, -8 STA, +1 random stat | Sweets | 洋風 | 1500G | Ch3+ rare |
| **Smoked Jerky Platter** | 1 | Heal 20 HP, -8 STA, +1 random stat | Meat | 北国風 | 1000G | Ch2+ rare |
| **Citrus Tart** | 1 | Heal 20 HP, -8 STA, +1 random stat | Fruit | 南国風 | 1100G | Ch3+ rare |

### Drinks (飲料)

STA recovery only. No HP heal.

| Item | Uses | Effect | Cost | Availability |
|------|------|--------|------|-------------|
| **Water** | 3 | -3 STA | 100G | Ch1+ |
| **Herbal Tea** | 2 | -5 STA | 300G | Ch1+ |
| **Black Coffee** | 1 | -8 STA, +1 SKL for chapter | 500G | Ch2+ |

### Alcohol (酒)

Unique buff/debuff profile. See [stats.md](stats.md) for full alcohol effects.

| Item | Uses | Effect | Taste | Cuisine | Cost | Availability |
|------|------|--------|-------|---------|------|-------------|
| **Ale** | 2 | -5 STA, +2 STR/CHA, -1 SKL/SPD, -2 WIL | Alcohol | 北国風 | 400G | Ch1+ |
| **Red Wine** | 1 | -5 STA, +2 STR/CHA, -1 SKL/SPD, -2 WIL | Alcohol | 洋風 | 800G | Ch2+ |
| **Wheat Beer** | 2 | -5 STA, +2 STR/CHA, -1 SKL/SPD, -2 WIL | Alcohol | 北国風 | 350G | Ch1+ |
| **Mead** | 1 | -5 STA, +2 STR/CHA, -1 SKL/SPD, -2 WIL | Alcohol | 南国風 | 600G | Ch2+ |
| **Rice Sake** | 1 | -5 STA, +2 STR/CHA, -1 SKL/SPD, -2 WIL | Alcohol | 和風 | 700G | Ch2+ |
| **Plum Wine** | 1 | -5 STA, +2 STR/CHA, -1 SKL/SPD, -2 WIL | Alcohol | 中華風 | 650G | Ch2+ |
| **Whiskey** | 1 | -5 STA, +3 STR/CHA, -2 SKL/SPD, -3 WIL | Alcohol | 洋風 | 1200G | Ch3+ rare |

Whiskey is stronger than standard alcohol — higher buff AND higher debuff.

### Buff Food (強化食)

Targeted stat boost. No HP heal.

| Item | Uses | Effect | Cost | Availability |
|------|------|--------|------|-------------|
| **Power Root** | 1 | +2 STR for chapter | 800G | Ch2+ |
| **Spirit Dust** | 1 | +2 MAG for chapter | 800G | Ch2+ |
| **Speed Wing** | 1 | +2 SPD for chapter | 800G | Ch2+ |
| **Defense Charm** | 1 | +2 DEF for chapter | 800G | Ch2+ |
| **Resistance Tonic** | 1 | +2 RES for chapter | 800G | Ch2+ |
| **Skill Manual** | 1 | +2 SKL for chapter | 800G | Ch2+ |
| **Fortune Coin** | 1 | +3 LCK for chapter | 600G | Ch1+ |
| **Iron Will Tonic** | 1 | +2 WIL for chapter | 1000G | Ch3+ |

### Antidote Food (解毒食)

Corruption cleansing. Rare.

| Item | Uses | Effect | Cost | Availability |
|------|------|--------|------|-------------|
| **Purifying Herb** | 1 | -5 CRP | 1500G | Ch3+ rare drops |
| **Cleansing Broth** | 1 | -10 CRP, heal 10 HP | 3000G | Ch4 only |

---

## Key Items

Story-critical or chapter-specific items. Cannot be sold or discarded.

| Item | Chapter | Effect | How to Get |
|------|---------|--------|-----------|
| **Ren's Journal** | Ch1+ | View Cycle Memory choices at any time. UI item, no combat use. | Starting inventory |
| **Broken Seed** | Ch2 | Senna uses this to crack the RNG seed. Consumed in story event. | Dropped by Thane (Ch2 boss) |
| **Kael's Lance** | Ch3+ | +3 ATK, +10 LOY when equipped. Only usable by Ren after Ch3. Carries Kael's data signature. | Recovered after Kael's death |
| **Corrupted Fragment** | Ch4 | ???_CORRUPTED drops this on phase transitions. Reveals boss's current weapon cycle when used. 3 uses. | Ch4 boss fight |
| **System Key** | Ch4 | Required to access the final tile. No combat use. | Story event after ???_CORRUPTED is defeated |

---

## Stat Boosters (Permanent)

Extremely rare. Permanently raise a stat by 1-2. Found in hidden locations or as boss drops only.

| Item | Effect | Location |
|------|--------|---------|
| **Energy Drop** | +2 STR permanently | Ch2 hidden chest |
| **Spirit Dust (perm)** | +2 MAG permanently | Ch3 boss drop |
| **Speedwing (perm)** | +2 SPD permanently | Ch2 village reward |
| **Secret Book** | +2 SKL permanently | Ch3 hidden chest |
| **Goddess Icon** | +2 LCK permanently | Ch1 village reward |
| **Dracoshield** | +2 DEF permanently | Ch4 hidden chest |
| **Talisman** | +2 RES permanently | Ch3 village reward |
| **Crown** | +2 CHA permanently | Ch4 boss drop |
| **Mind Crystal** | +2 WIL permanently | Ch4 hidden chest |

---

## Inventory Rules

- Each unit carries up to **5 items** (weapons + consumables combined).
- Weapons occupy item slots. A unit with 2 weapons has 3 remaining slots.
- Items can be traded between adjacent allies during the Trade action.
- Food spoilage: Cooked Meals and Feast Dishes **expire after 2 chapters** if not used. Rations, Drinks, and Buff Food do not expire.
- Gold is shared party-wide. Not per-unit.

---

## Shop Availability Summary

| Chapter | New Items Available |
|---------|-------------------|
| Ch1 | Vulnerary, Dried Rations, Travel Bread, Hardtack, Water, Herbal Tea, Ale, Wheat Beer, Fortune Coin, basic Cooked Meals (steak, noodles, chicken, porridge, cream stew, broccoli, white rice) |
| Ch2 | Concoction, Antitoxin, Pure Water, Black Coffee, all Buff Foods, Red Wine, Mead, Rice Sake, Plum Wine, Feast Dishes (frosted cake, honey pastry, smoked jerky), remaining Cooked Meals (salmon, sea bream, dumplings, curry, lamb, venison, pumpkin, salad, mushrooms, shrimp, sashimi) |
| Ch3 | Elixir (rare), Purifying Herb (rare), Iron Will Tonic, Whiskey, Feast Dishes (caramel pudding, chocolate truffle, citrus tart) |
| Ch4 | Cleansing Broth (rare), no new shop — final chapter |

Night maps: Torch available at chapter-start shop.

---

## Open Questions

- **Trade action**: Does trading cost the unit's action for the turn, or is it free before acting?
- **Item drops**: Should enemies drop random food items to add variety, or only scripted drops?
- **Cooking system**: Should there be a preparation-phase cooking mechanic where raw ingredients combine into meals?
- **Shared meals**: Lira's group meal mechanic — does sharing a food item split the effect or duplicate it?
