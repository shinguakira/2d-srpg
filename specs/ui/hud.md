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
- **Movement cost**: class-aware cost when a unit is selected (e.g. "Move: 3 (Mounted)"), base cost otherwise. Uses `getClassMovementCost()` from `src/core/terrain.ts`
- **Meta-stat terrain effects**: for special terrains, show per-turn effects below DEF/AVO:
  - CRP gain (magenta): "CRP +2/turn" for glitched, "CRP +3/turn" for data_void
  - SYNC change (cyan): "SYNC -1/turn" for glitched, "SYNC -3/turn" for data_void
  - STA recovery (blue): "STA -3/turn" for fort/corrupted_fort
  - Data source: `getTerrainCrpGain()`, `getTerrainSyncChange()`, `getTerrainStaRecovery()` from `src/core/metaStats.ts`
- Appears when hovering any tile, independent of unit display

### Stamina Warnings

Rendered inside `MetaStatsSection` below the STA bar:

- **STA 25-29**: yellow text "Fatigue at 30" (approaching threshold)
- **STA 30-44**: orange text "Fatigued: -1 SPD" (penalty active)
- **STA 45+**: red text "Exhausted: Cannot act!" (locked to Wait/Rest)
- When `exhausted === true` in ActionMenu, show explanation text above buttons: "Exhausted — Wait or Rest only"

### Support Bonuses

Rendered inside `UnitStatsPanel` below stats when a player unit has active support partners within 3 tiles:

- Lists each active partner: name, rank, and concrete bonuses
- Format: "Marcus (B): +10 Hit, +10 Avo, +5 Crit"
- Data source: `getActiveSupports()` from `src/core/support.ts`

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
| **View Info** | Always available — opens `UnitDetailScreen` for the selected unit |
| **Wait** | Always available |
| **Cancel** | Always available (returns to move selection) |

### Weapon Selector

- Appears above action buttons when unit has multiple non-staff weapons
- Highlights currently selected weapon index
- Shows weapon durability as "uses/max" next to each weapon name (omit for infinite durability)
- Shows "Eff!" badge on weapons effective against the current hover target (uses `isEffectiveAgainst()`)
- Hidden when item submenu is open

### Item Submenu

- Replaces action buttons when "Item" is clicked
- Lists usable items with name (green) and uses remaining (e.g. "3/3")
- Has its own Cancel button to return to main action menu

## Hover Range Preview

Component: `RangeOverlay` (`src/components/Grid/RangeOverlay.tsx`)

During idle phase, hovering any unit shows a translucent range overlay without requiring selection:

- **Player/ally units**: blue overlay for movement range, red overlay for attack range beyond movement
- **Enemy units**: red overlay for both movement and attack range
- Opacity is **0.15** (half of the selection range opacity of 0.3) to visually distinguish hover preview from active selection
- Clears immediately when hovering an empty tile or when a unit is selected
- Only recomputes when the hovered unit changes (not on every pixel move) for performance
- `data-testid="hover-range-overlay"`

## Right-Click Behavior

Right-click (`contextmenu` event) behavior depends on the current player action:

- **Idle phase**: right-clicking a tile with a unit opens `UnitDetailScreen` for that unit. Right-clicking an empty tile does nothing.
- **Non-idle phases** (move_target, action_menu, attack_target, etc.): right-click cancels the current action and returns to idle.

## Overlays

### Combat Forecast

Component: `CombatPreview` (`src/components/Combat/CombatPreview.tsx`)

- Visible during `attack_target` and `action_menu` player actions when a forecast exists
- Player always shown on left (blue), enemy on right (red)
- Per-side stats: DMG, HIT%, CRIT%, double indicator (x2 or dash)
- Predicted HP after combat (assumes all hits land), shown as arrow notation (e.g. "HP 20/25 ->15")
- "Cannot counter" shown when defender is out of range
- Weapon triangle text at bottom (green "Sword beats Axe" or red "Axe loses to Lance")

See [combat-forecast-enhancements.md](combat-forecast-enhancements.md) for implemented enhancements: weapon effectiveness warnings, skill descriptions with activation rates, grouped combat modifier breakdown, boss phase HP tick marks and indicators, weapon durability display.

### Item Usage Animation

Component: `ItemAnimation` (`src/components/Combat/ItemAnimation.tsx`)

Full-screen battle scene animation for heal items (e.g. Vulnerary). Uses the same modal/stage layout as `CombatAnimation` and `HealingAnimation`.

- **Trigger**: `useItem` sets `currentPhase: 'item_animation'` when a heal item restores HP (`healAmount > 0`)
- **Timeline** (~2 seconds total):
  1. **Idle** (200ms): scene appears with unit centered on stage
  2. **Glow** (600ms): unit pulses with green glow animation
  3. **Receive** (1200ms): green screen flash, green particles rise, floating "+N" heal number, HP bar animates to new value
  4. **Done**: calls `finishItemAnimation()` to return to `player_phase`
- **Visual style**: green color accent (`#22c55e`) on title bar, modal border, glow, particles, and heal number
- Non-heal items (keys) apply instantly with no animation
- `data-testid="item-animation"`, `data-testid="item-heal-amount"`

### Level-Up Popup

Component: `LevelUpPopup` -- see `specs/ui/animations.md` for animation details.

### Phase Banner

Component: `PhaseBanner` -- see `specs/ui/animations.md` for timing details.

### EXP Bar

Component: `ExpBar` -- see `specs/ui/animations.md` for fill behavior.

### Death Quote

- Displayed via the dialogue system when a unit with a `deathQuote` field dies
- Not a dedicated HUD component; uses the standard dialogue overlay

## System Menu

Component: `SystemMenu` (`src/components/UI/SystemMenu.tsx`)

Triggered by clicking an empty tile or right-clicking during idle phase. Vertical menu on the left side of the screen.

| Item | Action |
|------|--------|
| **Unit List** | Open unit list panel |
| **Objective** | Show victory/defeat conditions overlay |
| **Settings** | Open settings panel (BGM/SE volume, animation speed) |
| **Suspend** | Save current state and return to title screen |
| **End Turn** | End player phase, advance to enemy phase |

- Closes on Escape, B key, or clicking outside the menu
- FE-style dark green background with gold border decoration
- `data-testid="system-menu"`, `data-testid="system-menu-{item}"`

## Danger Zone Threats

Rendered inside `UnitStatsPanel` when the danger zone overlay is active and the player hovers a threatened tile:

- Shows "Threats (N enemies)" header in red
- Lists each enemy that can reach the hovered tile: name + equipped weapon
- Data source: `dangerZoneAttribution` map from game store (built by `buildDangerZoneAttribution()` in `dangerZoneHelpers.ts`)
- `data-testid="danger-threats"`, `data-testid="danger-threat-{enemyId}"`

## Minimap

Component: `Minimap` (`src/components/UI/Minimap.tsx`)

SVG-based minimap for large maps (> 12x12 tiles). Fixed position bottom-left of screen.

- **Tile rendering**: 3px per tile, colored by terrain type
- **Unit dots**: faction-colored circles (blue player, red enemy, green ally, gray neutral). Boss units are larger (r=2) with gold stroke
- **Viewport rectangle**: white outline showing current camera view area
- **Click to navigate**: clicking the minimap centers the camera on that position
- **Collapsible**: toggle icon above minimap to collapse/expand
- Only rendered for maps larger than 12x12
- `data-testid="minimap"`, `data-testid="minimap-viewport"`

## Animation Speed Control

Stored in `uiStore` as `animationSpeed: '1x' | '2x' | 'skip'`, persisted to localStorage.

- **1x**: normal speed (multiplier 1.0)
- **2x**: double speed (multiplier 0.5 on all durations)
- **Skip**: near-instant (16ms minimum duration)

### Controls

- **Combat Animation**: cycle button in top-right corner of combat modal
- **System Menu → Settings**: animation speed toggle with Japanese labels (通常/2倍速/スキップ)
- **Game Loop**: enemy action delays scaled by `getScaledDuration()`

Helper: `getScaledDuration(ms, speed)` from `src/stores/uiStore.ts`

## End Turn Controls

Component: `EndTurnButton` (`src/components/UI/EndTurnButton.tsx`)

- Visible during entire player phase (not just idle)
- **Disabled** when `isAutoBattle === true` or `playerAction !== 'idle'` (grayed out, `cursor: not-allowed`)
- Two buttons:
  - **Auto Battle**: triggers `startAutoBattle`, disabled while auto-battle is running (label changes to "Auto...")
  - **End Turn**: triggers `endPlayerTurn` to advance to enemy phase
