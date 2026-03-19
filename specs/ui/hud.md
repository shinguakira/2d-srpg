# HUD & Menus

All HUD elements are React components positioned with CSS. Visible during the battle screen.

## Info Panels

### Unit Stats Panel

Component: `UnitStatsPanel` (`src/components/Units/UnitStatsPanel.tsx`)

- Shows selected unit info, or hovered unit if nothing selected
- Displays: name, class name + level, HP (current/max), all 8 combat stats (STR, MAG, DEF, RES, SPD, SKL, LCK, MOV), equipped weapon + might
- Falls back to "Hover a tile or select a unit" when empty

### Terrain Info

Rendered inside `UnitStatsPanel` below unit info:

- Shows terrain name (e.g. "Forest", "Fort")
- Defense bonus (DEF +N)
- Avoid bonus (AVO +N)
- Appears when hovering any tile, independent of unit display

### Turn Info

Component: `TurnInfo` (`src/components/UI/TurnInfo.tsx`)

- Chapter name, turn counter, current phase label
- Objective status with dynamic text:
  - Rout: "Rout: X/Y defeated" with kill count
  - Seize: "Seize the throne" with checkmark when boss defeated
- Objective text turns gold when ready to complete
- Danger zone badge ("DANGER" in red) when danger overlay is active

## Action Menu

Component: `ActionMenu` (`src/components/UI/ActionMenu.tsx`)

Positioned adjacent to the unit's pending tile (right side, offset by 4px). Only visible when `playerAction === 'action_menu'`.

### Button Conditions

| Button | Condition |
|---|---|
| **Attack** | Unit has a non-staff weapon AND at least one enemy is in attack range |
| **Heal** | Unit has a staff in inventory AND a damaged ally is within staff range |
| **Item** | Unit has at least one usable consumable item (checked via `canUseItem`) |
| **Seize** | Unit is Lord AND on the seize position AND no boss enemy remains alive |
| **Visit** | Unit is on an unvisited village tile |
| **Wait** | Always available |
| **Cancel** | Always available (returns to move selection) |

### Weapon Selector

- Appears above action buttons when unit has multiple non-staff weapons
- Highlights currently selected weapon index
- Hidden when item submenu is open

### Item Submenu

- Replaces action buttons when "Item" is clicked
- Lists usable items with name (green) and uses remaining (e.g. "3/3")
- Has its own Cancel button to return to main action menu

## Overlays

### Combat Forecast

Component: `CombatPreview` (`src/components/Combat/CombatPreview.tsx`)

- Visible during `attack_target` and `action_menu` player actions when a forecast exists
- Player always shown on left (blue), enemy on right (red)
- Per-side stats: DMG, HIT%, CRIT%, double indicator (x2 or dash)
- Predicted HP after combat (assumes all hits land), shown as arrow notation (e.g. "HP 20/25 ->15")
- "Cannot counter" shown when defender is out of range
- Weapon triangle text at bottom (green "Sword beats Axe" or red "Axe loses to Lance")

### Level-Up Popup

Component: `LevelUpPopup` -- see `specs/ui/animations.md` for animation details.

### Phase Banner

Component: `PhaseBanner` -- see `specs/ui/animations.md` for timing details.

### EXP Bar

Component: `ExpBar` -- see `specs/ui/animations.md` for fill behavior.

### Death Quote

- Displayed via the dialogue system when a unit with a `deathQuote` field dies
- Not a dedicated HUD component; uses the standard dialogue overlay

## End Turn Controls

Component: `EndTurnButton` (`src/components/UI/EndTurnButton.tsx`)

- Visible during entire player phase (not just idle)
- Two buttons:
  - **Auto Battle**: triggers `startAutoBattle`, disabled while auto-battle is running (label changes to "Auto...")
  - **End Turn**: triggers `endPlayerTurn` to advance to enemy phase
