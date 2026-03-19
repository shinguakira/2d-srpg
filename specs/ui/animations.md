# Animations

All animations are CSS-driven or timer-based in React. No canvas or requestAnimationFrame rendering.

## Battle Scene

Component: `CombatAnimation` (`src/components/Combat/CombatAnimation.tsx`)

GBA-style side-by-side battle view in a 640px-wide modal over a dark overlay (75% opacity).

### Animation Phases

Each hit in combat cycles through these phases via `setTimeout` chains:

- **idle** -- standing with subtle breathing animation (2s loop)
- **windup** -- slight crouch before attack (200ms physical, 300ms magic)
- **dash** -- attacker slides 392px across stage to defender (250ms, physical only)
- **strike** -- weapon swing with scale pulse at defender position (120ms)
- **impact** -- screen flash (white), defender shakes violently (300ms)
- **return** -- attacker slides back to starting position (300ms)
- **crit-pause** -- screen darkens (0.6s pulse), unit flashes bright before attack
- **spell-fly** -- magic projectile crosses stage (400ms, magic only)
- **spell-hit** -- spell impact on target with screen flash
- **dodge** -- defender leaps backward 30px with arc (300ms), then "MISS" text
- **death** -- defender collapses downward, fades out (600ms)

### Visual Effects

- **Screen flash**: white overlay, 0.2s for hits, 0.5s double-pulse for crits
- **Crit darken**: black overlay pulses to 50% opacity before crit attack
- **Damage numbers**: float upward with scale pop (36px normal, 44px gold for crits, 24px gray italic for MISS)
- **HP bars**: animated width transition (0.5s ease), drain after damage number appears
- **Weapon triangle**: arrow indicator top-right of stage (green up / red down)
- **Weapon effects**: `WeaponEffect` component renders per-weapon-type visual at defender position

### Info Panel

Below the stage: unit names, weapon names, HP bars (blue player / red enemy), forecast stats (Dmg/Hit/Crit), hit counter.

## EXP Bar

Component: `ExpBar` (`src/components/Combat/ExpBar.tsx`)

- Fills from previous EXP to new value in incremental steps (30ms per tick)
- On level-up: fills to 100, resets to 0 with brief flash (50ms delay), continues filling remainder
- Click anywhere to skip animation and dismiss
- Auto-dismisses 600ms after fill completes
- Shows unit name, "EXP" label, and numeric value (capped display at 99)

## Level-Up

Component: `LevelUpPopup` (`src/components/Combat/LevelUpPopup.tsx`)

- Waits for EXP bar to finish before appearing
- Reveals 8 stats one at a time (250ms each): HP, STR, MAG, SKL, SPD, DEF, RES, LCK
- Stats that increased show green highlight with "+N" and filled bar
- Stats not increased show dash
- Includes BattleSprite of the unit, class name, new level
- Click to skip reveal (shows all at once); click again to dismiss

## Floating Numbers

Component: `FloatingNumbers` (`src/components/Grid/FloatingNumber.tsx`)

- Positioned on the map grid at tile coordinates, scaled by `tileSize`
- Uses CSS `float-up` animation (1.2s ease): rises upward and fades
- Visible for 1200ms then removed
- Colored by type (set by caller): typically white for damage, green for healing

## Phase Banners

Component: `PhaseBanner` (`src/components/UI/PhaseBanner.tsx`)

- Full-width banner: "Player Phase" (blue) or "Enemy Phase" (red)
- Shows current turn number below phase name
- Auto-dismisses after 2000ms via `setTimeout`
- Styled with CSS class `phase-banner--player` or `phase-banner--enemy`

## Walking Animation

- Unit movement on the grid is instant (no tile-by-tile walk animation)
- Unit position updates immediately when move is confirmed
- `facing` property on Unit type tracks direction (down/up/left/right) for sprite orientation
