# Save System

Implemented in `src/core/saveManager.ts`. Persists campaign progress between chapters using browser localStorage.

## Save Slots

- 3 save slots numbered 0, 1, 2
- No auto-save; saves are triggered manually between chapters via `campaignStore`
- `hasAnySave()` checks all three slots (used by title screen to show Continue option)

## localStorage Keys

- Key prefix: `srpg_save_slot_` followed by slot number (e.g. `srpg_save_slot_0`)
- Data stored as JSON string via `JSON.stringify`
- Version field (`CURRENT_VERSION = 1`) used for forward compatibility; reads reject mismatched versions

## SaveData Type

Defined in `src/core/types.ts`:

- `version: 1` -- format version, must match `CURRENT_VERSION` to load
- `timestamp: number` -- epoch ms, set at save time
- `currentChapterId: string` -- the next chapter to play
- `completedChapters: string[]` -- list of finished chapter IDs
- `unitProgress: Record<string, UnitProgress>` -- per-unit state carried forward

### UnitProgress

Each surviving unit's persistent state:

- `level`, `exp` -- current level and experience
- `stats: UnitStats` -- all 9 stats (hp, str, mag, def, res, spd, skl, lck, mov)
- `weaponIds: string[]` -- weapon inventory by ID
- `itemIds: string[]` -- consumable items by ID

## API Functions

| Function | Signature | Behavior |
|---|---|---|
| `writeSave` | `(slot: number, data: SaveData) => void` | Serializes and stores to localStorage |
| `readSave` | `(slot: number) => SaveData \| null` | Parses JSON, returns null on version mismatch or parse error |
| `deleteSave` | `(slot: number) => void` | Removes the key from localStorage |
| `hasSave` | `(slot: number) => boolean` | Checks if key exists (does not validate) |
| `hasAnySave` | `() => boolean` | Returns true if any of slots 0/1/2 has data |
| `getSlotSummary` | `(slot: number) => { timestamp, chapterId } \| null` | Reads full save, returns only display fields |

## Error Handling

- `readSave` wraps parsing in try/catch; returns `null` on any failure
- Version mismatch (e.g. future format changes) silently returns `null`
- No migration logic exists yet; old-version saves are treated as absent

## Campaign Integration

- `campaignStore.ts` calls `writeSave` after chapter completion to persist unit progress
- `campaignStore.ts` calls `readSave` on Continue to restore unit state and chapter position
- Dead units (permadeath) are excluded from `unitProgress` on save
