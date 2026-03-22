# Task Priority & Dependencies

> Master overview of all task files in `specs/tasks/`.
> Shows execution order, completion status, and remaining work.

---

## Completion Status

```
GAMEPLAY:   7 / 7   (100%)
STORY:      2 / 5   (40%)
MAPS:       2 / 5   (40%)
UI/UX:      0 / 14  (0%)    ← NEW TRACK
BUGS:       7 / 9   (78%)
```

All 7 gameplay phases are **COMPLETE**. Remaining work: content (maps + story for ch11-25) and UI/UX improvements.

---

## Execution Priority

✅ = complete. Each step lists tasks that can run **in parallel** (║).

| Step | Tasks (║ = parallel) | Status |
|------|---------------------|--------|
| **1** | `gameplay/phase0-foundation.md` | ✅ |
| **2** | `gameplay/phase1-recruitment-events.md` ║ `story/arc1-story-ch4-ch5.md` | ✅ |
| **3** | `maps/arc1-maps-ch5.md` ║ `gameplay/phase2-promotion-skills.md` ║ `gameplay/phase4-meta-stats-crp.md` | ✅ |
| **4** | `gameplay/phase3-advanced-ai-actions.md` ║ `story/arc2-story-ch6-ch10.md` | ✅ |
| **5** | `maps/arc2-maps-ch6-ch10.md` ║ `story/arc3-story-ch11-ch15.md` | ✅ maps / ⬜ story |
| **6** | `gameplay/phase5-fog-weather-advanced.md` ║ `maps/arc3-maps-ch11-ch15.md` | ✅ gameplay / ⬜ maps |
| **7** | `gameplay/phase6-endgame-systems.md` ║ `story/arc4-story-ch16-ch20.md` | ✅ gameplay / ⬜ story |
| **8** | `maps/arc4-maps-ch16-ch20.md` ║ `story/arc5-story-ch21-ch25.md` | ⬜ |
| **9** | `maps/arc5-maps-ch21-ch25.md` | ⬜ |

### Next Up

All gameplay prerequisites are met. The remaining 6 tasks can proceed in story→maps order per arc:

| Priority | Task | Blocked By |
|----------|------|------------|
| **Next** | `story/arc3-story-ch11-ch15.md` | — (ready now) |
| **Next** | `maps/arc3-maps-ch11-ch15.md` | — (ready now, Phase 4 done) |
| **Then** | `story/arc4-story-ch16-ch20.md` | Arc 3 Story |
| **Then** | `maps/arc4-maps-ch16-ch20.md` | Arc 3 Maps |
| **Then** | `story/arc5-story-ch21-ch25.md` | Arc 4 Story |
| **Last** | `maps/arc5-maps-ch21-ch25.md` | Arc 4 Maps |

---

## Dependency Graph

```
GAMEPLAY TRACK (ALL DONE)         STORY TRACK              MAP TRACK
═════════════════════════         ═══════════              ═════════

✅ Phase 0 (Foundation)
  │
  ├──→ ✅ Phase 1 (Events) ──→ ✅ Arc 1 Story (ch4-5) ──→ ✅ Arc 1 Maps (ch5)
  │      │       │
  │      │       ├──→ ✅ Phase 2 (Promotion)
  │      │       │      │
  │      │       │      └──→ ✅ Phase 3 (AI) → ✅ Arc 2 Story → ✅ Arc 2 Maps (ch6-10)
  │      │       │
  │      │       └──→ ✅ Phase 4 (Meta-Stats)
  │      │                │
  │      │                ├──→ ⬜ Arc 3 Story (ch11-15) ──→ ⬜ Arc 3 Maps (ch11-15)
  │      │                │
  │      │                └──→ ✅ Phase 5 (Fog/Weather)
  │      │                       │
  │      │                       └──→ ✅ Phase 6 (Endgame)
  │      │                              │
  │      │                              ├──→ ⬜ Arc 4 Story → ⬜ Arc 4 Maps (ch16-20)
  │      │                              │
  │      │                              └──→ ⬜ Arc 5 Story → ⬜ Arc 5 Maps (ch21-25)
  │      │
  │      └──→ campaign-flags.md (referenced by all map/story arcs)
  │
  └──→ (all subsequent phases inherit expanded types)
```

---

## Remaining Work — Parallel Tracks

All gameplay systems are done. Three independent tracks remain:

### Track A: Story (pure dialogue data)
```
✅ Arc 1 → ✅ Arc 2 → ⬜ Arc 3 → ⬜ Arc 4 → ⬜ Arc 5
```

### Track B: Maps (chapter data + wiring)
```
✅ Arc 1 → ✅ Arc 2 → ⬜ Arc 3 → ⬜ Arc 4 → ⬜ Arc 5
```

### Track C: UI/UX Improvements (no content dependency)
```
⬜ Phase A (Tier 1: 5 tasks) → ⬜ Phase B (Tier 2: 4 tasks) → ⬜ Phase C (Tier 3: 6 tasks)
```

### Parallelism
- Story and maps can run in parallel per arc (story should complete first for dialogue context)
- **UI/UX track is fully independent** — no dependency on story/maps content. Can run in parallel with all content work
- Within the UI track, all tasks within a phase can run in parallel (no interdependencies)

---

## Cross-Cutting: campaign-flags.md

> [`specs/tasks/campaign-flags.md`](campaign-flags.md) — single source of truth for all conditional game state.

### Flag Touchpoints — Remaining Work

Flags already implemented are marked ✅. Flags that still need implementation are ⬜.

| Flag | Set In | Checked In | Status |
|------|--------|------------|--------|
| `kael_survive_turns` | ✅ `arc2-maps` (ch8) | ⬜ `arc5-maps` (ch24 dialogue) | Set |
| `grief_trauma_remaining` | ✅ `arc2-maps` (ch8, set=2) | ✅ `arc2-maps` (ch9 decrement, ch10 expires) | Done |
| `total_deaths` | ✅ `phase1` (permadeath) | ✅ `phase6` (endings), ⬜ `arc5-maps` (ch25) | Set |
| `master_crowns_used` | ✅ `phase6` (master promo) | ✅ `phase6` (UI: 3 - used) | Done |
| `bonus_exp_pool` | ✅ `phase5` (par bonus calc) | ✅ `phase5` (prep screen distribution) | Done |
| `zael_recruited` | ⬜ `arc3-maps` (ch13) | ⬜ `arc3-maps` (ch14), `arc5-maps` (ch25) | Not started |
| `ch12_corruption_victim` | ⬜ `arc3-maps` (ch12) | ⬜ `arc3-story` (ch12 dialogue) | Not started |
| `ghael_recruited` | ⬜ `arc4-maps` (ch18) | ⬜ `arc5-maps` (ch25 ending) | Not started |
| `echo_saved` | ⬜ `arc4-maps` (ch20) | ⬜ `arc5-maps` (ch25 ending) | Not started |
| `system_negotiated` | ⬜ `arc4-maps` (ch17) | ⬜ `arc5-maps` (ch25 Phase 1 -20%) | Not started |

### Implication
Arc 5 Maps (`ch25`) checks **5 flags** set across Arcs 2-4 — all prior arc map implementations must correctly set these flags before Arc 5 can be validated end-to-end.

---

## Milestone Gates

✅ = passed. Verification checkpoints — each gate must pass before proceeding.

| Gate | After Step | Verification | Status |
|------|-----------|--------------|--------|
| **Gate 0** | Step 1 | `npm run build` passes, E2E tests pass with renamed units | ✅ |
| **Gate 1** | Step 2 | Event system fires, recruitment works, dialogue renders | ✅ |
| **Gate 2** | Step 3 | Ch5 playable end-to-end, promotion works, meta-stats display | ✅ |
| **Gate 3** | Step 5 | Ch6-10 playable, grief trauma applies ch9-10, Kael death fires | ✅ |
| **Gate 4** | Step 6 | Ch11-15 playable, CRP system active, fog of war works | ⬜ |
| **Gate 5** | Step 7 | Master classes, multi-phase boss, endings framework | ✅ (gameplay only) |
| **Gate 6** | Step 8 | Ch16-20 playable, negotiate works, Echo save | ⬜ |
| **Gate 7** | Step 9 | Ch21-25 playable, all endings reachable | ⬜ |

### Final Validation
```bash
npm run build && npx vitest run && npx playwright test
```
Full game playthrough: ch1 → ch25 without crashes, all campaign flags persist across saves.

---

## File Index

All 18 task files with completion status:

### Gameplay Systems (7 files) — ALL COMPLETE ✅
| File | Status |
|------|--------|
| [`gameplay/phase0-foundation.md`](gameplay/phase0-foundation.md) | ✅ Complete |
| [`gameplay/phase1-recruitment-events.md`](gameplay/phase1-recruitment-events.md) | ✅ Complete |
| [`gameplay/phase2-promotion-skills.md`](gameplay/phase2-promotion-skills.md) | ✅ Complete |
| [`gameplay/phase3-advanced-ai-actions.md`](gameplay/phase3-advanced-ai-actions.md) | ✅ Complete |
| [`gameplay/phase4-meta-stats-crp.md`](gameplay/phase4-meta-stats-crp.md) | ✅ Complete |
| [`gameplay/phase5-fog-weather-advanced.md`](gameplay/phase5-fog-weather-advanced.md) | ✅ Complete |
| [`gameplay/phase6-endgame-systems.md`](gameplay/phase6-endgame-systems.md) | ✅ Complete |

### Chapter Maps (5 files) — 2/5 COMPLETE
| File | Chapters | Status |
|------|----------|--------|
| [`maps/arc1-maps-ch5.md`](maps/arc1-maps-ch5.md) | 5 | ✅ Complete |
| [`maps/arc2-maps-ch6-ch10.md`](maps/arc2-maps-ch6-ch10.md) | 6-10 | ✅ Complete |
| [`maps/arc3-maps-ch11-ch15.md`](maps/arc3-maps-ch11-ch15.md) | 11-15 | ⬜ Not Started |
| [`maps/arc4-maps-ch16-ch20.md`](maps/arc4-maps-ch16-ch20.md) | 16-20 | ⬜ Not Started |
| [`maps/arc5-maps-ch21-ch25.md`](maps/arc5-maps-ch21-ch25.md) | 21-25 | ⬜ Not Started |

### Story & Dialogue (5 files) — 2/5 COMPLETE
| File | Chapters | Status |
|------|----------|--------|
| [`story/arc1-story-ch4-ch5.md`](story/arc1-story-ch4-ch5.md) | 4-5 | ✅ Complete |
| [`story/arc2-story-ch6-ch10.md`](story/arc2-story-ch6-ch10.md) | 6-10 | ✅ Complete |
| [`story/arc3-story-ch11-ch15.md`](story/arc3-story-ch11-ch15.md) | 11-15 | ⬜ Not Started |
| [`story/arc4-story-ch16-ch20.md`](story/arc4-story-ch16-ch20.md) | 16-20 | ⬜ Not Started |
| [`story/arc5-story-ch21-ch25.md`](story/arc5-story-ch21-ch25.md) | 21-25 | ⬜ Not Started |

### UI/UX Improvements (14 files) — 0/14 NEW

All tasks are independent and can run in parallel. Recommended phased execution:

#### Phase A: Critical Tactical Info (Tier 1)
| File | Severity | Status |
|------|----------|--------|
| [`ui/weapon-effectiveness-warning.md`](ui/weapon-effectiveness-warning.md) | high | ⬜ Not Started |
| [`ui/skill-descriptions-tooltips.md`](ui/skill-descriptions-tooltips.md) | high | ⬜ Not Started |
| [`ui/stamina-exhaustion-warning.md`](ui/stamina-exhaustion-warning.md) | high | ⬜ Not Started |
| [`ui/terrain-meta-stat-effects.md`](ui/terrain-meta-stat-effects.md) | high | ⬜ Not Started |
| [`ui/combat-modifier-breakdown.md`](ui/combat-modifier-breakdown.md) | medium | ⬜ Not Started |

#### Phase B: Quality of Life (Tier 2)
| File | Severity | Status |
|------|----------|--------|
| [`ui/weapon-durability-display.md`](ui/weapon-durability-display.md) | medium | ⬜ Not Started |
| [`ui/boss-phase-hp-indicators.md`](ui/boss-phase-hp-indicators.md) | medium | ⬜ Not Started |
| [`ui/support-bonus-visibility.md`](ui/support-bonus-visibility.md) | medium | ⬜ Not Started |
| [`ui/movement-cost-display.md`](ui/movement-cost-display.md) | medium | ⬜ Not Started |

#### Phase C: Power User Features (Tier 3)
| File | Severity | Status |
|------|----------|--------|
| [`ui/growth-rates-display.md`](ui/growth-rates-display.md) | low | ⬜ Not Started |
| [`ui/promotion-path-preview.md`](ui/promotion-path-preview.md) | low | ⬜ Not Started |
| [`ui/danger-zone-attribution.md`](ui/danger-zone-attribution.md) | low | ⬜ Not Started |
| [`ui/status-effect-icons.md`](ui/status-effect-icons.md) | low | ⬜ Not Started |
| [`ui/minimap.md`](ui/minimap.md) | low | ⬜ Not Started |
| [`ui/animation-speed-control.md`](ui/animation-speed-control.md) | low | ⬜ Not Started |

### Bug Tracking
| Folder | Purpose |
|--------|---------|
| [`bugs/gameplay/`](bugs/gameplay/) | Gameplay mechanic bugs |
| [`bugs/maps/`](bugs/maps/) | Map/chapter data bugs |
| [`bugs/story/`](bugs/story/) | Dialogue/event/story bugs |
| [`bugs/ui/`](bugs/ui/) | UI/visual bugs |

### Reference
| File | Purpose |
|------|---------|
| [`campaign-flags.md`](campaign-flags.md) | Single source of truth for all conditional game state, endings, meta-stat formulas |
