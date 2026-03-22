# Item Usage Should Have Animation

> **Severity:** low
> **Category:** ui
> **Affected files:** `src/stores/actions/itemActions.ts`, `src/components/Combat/HealingAnimation.tsx`, `src/stores/gameStoreTypes.ts`
> **Spec refs:** `specs/ui/hud.md`

## Description

Using consumable items (Vulnerary, keys) applies effects instantly with no visual feedback. Staff healing has a full `HealingAnimation` component, but item usage has no equivalent animation or floating number.

## Current Behavior

- `useItem()` in `itemActions.ts` applies the item effect immediately (heal HP, unlock door/chest)
- Item uses are decremented and removed when depleted — all instant, no visual
- Staff healing has `HealingAnimation.tsx` with cast/spell-fly/receive phases
- No floating number, no glow effect, no notification for item consumption

## Expected Behavior

- Using a **heal item** (Vulnerary): show a brief animation — unit glows green, HP recovery floating number appears (+N HP)
- Using an **unlock item** (Key): show brief animation on the door/chest tile
- Animation should be short (1-2 seconds) and non-intrusive
- After animation completes, apply the actual effect and return to idle

## Steps to Fix

- [x] Add `itemAnimationData` to `GameState` in `gameStoreTypes.ts` with fields: `unitId`, `itemName`, `healAmount` (optional), `position`
- [x] Add `item_animation` value to the player action flow (or reuse existing animation phase pattern)
- [x] In `itemActions.ts`, instead of applying effect immediately: set animation data → transition to animation phase
- [x] Create `ItemAnimation` component (simpler than `HealingAnimation` — single-unit, green glow + floating number for heals)
- [x] Create `finishItemAnimation` action that applies the actual HP change, decrements item uses, and resets to idle
- [x] Add CSS for item animation in `src/styles/ui/` (green glow keyframes, float-up number)
- [x] Add `data-testid="item-animation"` for E2E testing
- [x] Add E2E test: use Vulnerary → animation plays → HP updates

## Spec Update

- [x] Update `specs/ui/hud.md` — add "Item Usage Animation" section documenting the animation phases and visual effects for consumable items
