# Task Priority & Dependencies

> Master overview of all 18 task files in `specs/tasks/`.
> Shows execution order, parallelism opportunities, critical path, and cross-cutting concerns.

---

## Critical Path

The longest sequential dependency chain — this determines minimum total implementation time:

```
Phase 0 → Phase 1 → Phase 4 → Phase 5 → Phase 6 → Arc 5 Maps/Story
  (6 sequential gates on the gameplay track)
```

Everything else can parallelize around this chain.

---

## Execution Priority

Each step lists tasks that can run **in parallel** (║). A step cannot start until all its dependencies from prior steps are complete.

| Step | Tasks (║ = parallel) | Depends On | Delivers |
|------|---------------------|------------|----------|
| **1** | `gameplay/phase0-foundation.md` | — | Renamed units, expanded types, 8 player characters |
| **2** | `gameplay/phase1-recruitment-events.md` ║ `story/arc1-story-ch4-ch5.md` | Step 1 | Event system, recruitment, ch4-5 dialogue |
| **3** | `maps/arc1-maps-ch5.md` ║ `gameplay/phase2-promotion-skills.md` ║ `gameplay/phase4-meta-stats-crp.md` | Step 2 | Ch5 playable, promotion framework, meta-stats |
| **4** | `gameplay/phase3-advanced-ai-actions.md` ║ `story/arc2-story-ch6-ch10.md` | Step 3 (Phase 2) | Advanced AI, dance/steal/rescue, ch6-10 dialogue |
| **5** | `maps/arc2-maps-ch6-ch10.md` ║ `story/arc3-story-ch11-ch15.md` | Step 4 (Phase 3) + Step 3 (Phase 4 for arc3 story context) | Ch6-10 playable, ch11-15 dialogue |
| **6** | `gameplay/phase5-fog-weather-advanced.md` ║ `maps/arc3-maps-ch11-ch15.md` | Step 5 (Phase 3 done) + Step 3 (Phase 4) | Fog/weather/support, ch11-15 playable |
| **7** | `gameplay/phase6-endgame-systems.md` ║ `story/arc4-story-ch16-ch20.md` | Step 6 (Phase 5) | Master classes, multi-phase bosses, endings |
| **8** | `maps/arc4-maps-ch16-ch20.md` ║ `story/arc5-story-ch21-ch25.md` | Step 7 (Phase 6) | Ch16-20 playable, ch21-25 dialogue |
| **9** | `maps/arc5-maps-ch21-ch25.md` | Step 8 | Ch21-25 playable, full game complete |

---

## Dependency Graph

```
GAMEPLAY TRACK                    STORY TRACK              MAP TRACK
═══════════════                   ═══════════              ═════════

Phase 0 (Foundation)
  │
  ├──→ Phase 1 (Events) ─────────→ Arc 1 Story (ch4-5) ──→ Arc 1 Maps (ch5)
  │      │       │
  │      │       ├──→ Phase 2 (Promotion)
  │      │       │      │
  │      │       │      └──→ Phase 3 (AI) ──→ Arc 2 Story ──→ Arc 2 Maps (ch6-10)
  │      │       │
  │      │       └──→ Phase 4 (Meta-Stats)
  │      │                │
  │      │                ├──→ Arc 3 Story (ch11-15) ──→ Arc 3 Maps (ch11-15)
  │      │                │
  │      │                └──→ Phase 5 (Fog/Weather)
  │      │                       │
  │      │                       └──→ Phase 6 (Endgame)
  │      │                              │
  │      │                              ├──→ Arc 4 Story ──→ Arc 4 Maps (ch16-20)
  │      │                              │
  │      │                              └──→ Arc 5 Story ──→ Arc 5 Maps (ch21-25)
  │      │
  │      └──→ campaign-flags.md (referenced by all map/story arcs)
  │
  └──→ (all subsequent phases inherit expanded types)
```

---

## Parallel Tracks

### Track A: Core Gameplay (sequential, on critical path)
```
Phase 0 → Phase 1 → Phase 4 → Phase 5 → Phase 6
```

### Track B: Combat Gameplay (branches off Phase 1, rejoins at Phase 5)
```
Phase 1 → Phase 2 → Phase 3 ──→ (feeds into Arc 2 Maps, rejoins at Phase 5 via ambush AI)
```

### Track C: Story (pure data, minimal gameplay dependency)
```
Arc 1 Story → Arc 2 Story → Arc 3 Story → Arc 4 Story → Arc 5 Story
```
Story is **dialogue data arrays** — no runtime gameplay dependency. Each arc's story can start once:
- Its character specs exist (Phase 0 for ch4-5, always true for later arcs)
- The event system exists (Phase 1)
- Prior arc's story is complete (narrative continuity)

### Track D: Maps (blocked on gameplay phases)
```
Arc 1 Maps ──→ Arc 2 Maps ──→ Arc 3 Maps ──→ Arc 4 Maps ──→ Arc 5 Maps
 (Phase 1)     (Phase 3)      (Phase 4)      (Phase 6)      (Phase 6)
```

### Key Parallelism Opportunities

| Parallel Pair | Why Independent |
|--------------|----------------|
| Phase 2 ║ Phase 4 | Both need Phase 1. Phase 2 = classes/skills, Phase 4 = meta-stats/CRP — no overlap |
| Phase 3 ║ Arc 2 Story | Phase 3 = AI behaviors, Arc 2 Story = dialogue data |
| Any Story ║ Its Arc's Maps | Story is data, maps need gameplay systems |
| Arc 3 Maps ║ Phase 5 | Arc 3 needs Phase 4 (CRP), Phase 5 needs Phase 3+4 — both available at Step 6 |

---

## Cross-Cutting: campaign-flags.md

> [`specs/tasks/campaign-flags.md`](campaign-flags.md) — single source of truth for all conditional game state.

### Flag Touchpoints Across Task Files

| Flag | Set In (Task File) | Checked In (Task File) |
|------|--------------------|------------------------|
| `kael_survive_turns` | `arc2-maps-ch6-ch10.md` (ch8) | `arc5-maps-ch21-ch25.md` (ch24 dialogue) |
| `zael_recruited` | `arc3-maps-ch11-ch15.md` (ch13) | `arc3-maps-ch11-ch15.md` (ch14 boss), `arc5-maps-ch21-ch25.md` (ch25 ending) |
| `ghael_recruited` | `arc4-maps-ch16-ch20.md` (ch18) | `arc5-maps-ch21-ch25.md` (ch25 ending) |
| `echo_saved` | `arc4-maps-ch16-ch20.md` (ch20) | `arc5-maps-ch21-ch25.md` (ch25 ending) |
| `system_negotiated` | `arc4-maps-ch16-ch20.md` (ch17) | `arc5-maps-ch21-ch25.md` (ch25 Phase 1 -20%) |
| `ch12_corruption_victim` | `arc3-maps-ch11-ch15.md` (ch12) | `arc3-story-ch11-ch15.md` (ch12 dialogue) |
| `total_deaths` | `phase1-recruitment-events.md` (permadeath) | `phase6-endgame-systems.md` (endings), `arc5-maps-ch21-ch25.md` (ch25) |
| `grief_trauma_remaining` | `arc2-maps-ch6-ch10.md` (ch8, set=2) | `arc2-maps-ch6-ch10.md` (ch9 decrement, ch10 expires) |
| `master_crowns_used` | `phase6-endgame-systems.md` (master promo) | `phase6-endgame-systems.md` (UI: 3 - used) |
| `bonus_exp_pool` | `phase5-fog-weather-advanced.md` (par bonus calc) | `phase5-fog-weather-advanced.md` (prep screen distribution) |

### Implication
Arc 5 Maps (`ch25`) checks **5 flags** set across Arcs 2-4 — all prior arc map implementations must correctly set these flags before Arc 5 can be validated end-to-end.

---

## Shared Critical Files

Files modified by **multiple phases** — merge conflicts likely if phases overlap on same files:

| File | Modified By |
|------|-------------|
| `src/core/types.ts` | Phase 0, 1, 2, 4, 5, 6 (every phase expands types) |
| `src/data/units.ts` | Phase 0 (rename+add), every arc map (enemy/NPC data) |
| `src/data/classes.ts` | Phase 0 (expand), Phase 2 (promotion), Phase 6 (master) |
| `src/data/weapons.ts` | Phase 0 (expand to 57), Phase 5 (forging), Phase 6 (legendary) |
| `src/stores/gameStoreTypes.ts` | Phase 1, 4, 5, 6 (new state fields) |
| `src/stores/actions/combatActions.ts` | Phase 2 (skills), Phase 4 (CRP/meta), Phase 5 (support bonuses) |
| `src/core/ai.ts` | Phase 3 (behaviors), Phase 4 (CRP-aware targeting) |

**Recommendation:** Complete phases that share files sequentially, not in parallel, to avoid merge pain. The execution priority table above already accounts for this.

---

## Milestone Gates

Verification checkpoints — each gate must pass before proceeding.

| Gate | After Step | Verification | Key Test |
|------|-----------|--------------|----------|
| **Gate 0** | Step 1 | `npm run build` passes, E2E tests pass with renamed units | Ren/Kael/Senna/Lira in ch1-4 |
| **Gate 1** | Step 2 | Event system fires, recruitment works, dialogue renders | Mid-battle events in ch1-4 |
| **Gate 2** | Step 3 | Ch5 playable end-to-end, promotion works, meta-stats display | Ch5 seize objective, promote a unit |
| **Gate 3** | Step 5 | Ch6-10 playable, grief trauma applies ch9-10, Kael death fires | `grief_trauma_remaining` flag lifecycle |
| **Gate 4** | Step 6 | Ch11-15 playable, CRP system active, fog of war works | Zael recruitment, ch12 corruption loss |
| **Gate 5** | Step 7 | Master classes, multi-phase boss, endings framework | Promote to Tier 3, phase transition |
| **Gate 6** | Step 8 | Ch16-20 playable, negotiate works, Echo save | `system_negotiated` flag, multi-phase Sentinel Omega |
| **Gate 7** | Step 9 | Ch21-25 playable, all endings reachable | Full playthrough ch1→ch25, all 4 endings |

### Final Validation
```bash
npm run build && npx vitest run && npx playwright test
```
Full game playthrough: ch1 → ch25 without crashes, all campaign flags persist across saves.

---

## File Index

All 18 task files with their gameplay phase dependency:

### Gameplay Systems (7 files)
| File | Phase | Prerequisites |
|------|-------|---------------|
| [`gameplay/phase0-foundation.md`](gameplay/phase0-foundation.md) | 0 | None |
| [`gameplay/phase1-recruitment-events.md`](gameplay/phase1-recruitment-events.md) | 1 | Phase 0 |
| [`gameplay/phase2-promotion-skills.md`](gameplay/phase2-promotion-skills.md) | 2 | Phase 0, Phase 1 |
| [`gameplay/phase3-advanced-ai-actions.md`](gameplay/phase3-advanced-ai-actions.md) | 3 | Phase 2 |
| [`gameplay/phase4-meta-stats-crp.md`](gameplay/phase4-meta-stats-crp.md) | 4 | Phase 1 |
| [`gameplay/phase5-fog-weather-advanced.md`](gameplay/phase5-fog-weather-advanced.md) | 5 | Phase 3, Phase 4 |
| [`gameplay/phase6-endgame-systems.md`](gameplay/phase6-endgame-systems.md) | 6 | Phase 2, Phase 4, Phase 5 |

### Chapter Maps (5 files)
| File | Chapters | Prerequisites |
|------|----------|---------------|
| [`maps/arc1-maps-ch5.md`](maps/arc1-maps-ch5.md) | 5 | Phase 1 |
| [`maps/arc2-maps-ch6-ch10.md`](maps/arc2-maps-ch6-ch10.md) | 6-10 | Phase 3, Phase 2 |
| [`maps/arc3-maps-ch11-ch15.md`](maps/arc3-maps-ch11-ch15.md) | 11-15 | Phase 4, Phase 1 |
| [`maps/arc4-maps-ch16-ch20.md`](maps/arc4-maps-ch16-ch20.md) | 16-20 | Phase 5, Phase 6 |
| [`maps/arc5-maps-ch21-ch25.md`](maps/arc5-maps-ch21-ch25.md) | 21-25 | Phase 6 |

### Story & Dialogue (5 files)
| File | Chapters | Prerequisites |
|------|----------|---------------|
| [`story/arc1-story-ch4-ch5.md`](story/arc1-story-ch4-ch5.md) | 4-5 | Phase 0, Phase 1 |
| [`story/arc2-story-ch6-ch10.md`](story/arc2-story-ch6-ch10.md) | 6-10 | Phase 1, Arc 1 Story |
| [`story/arc3-story-ch11-ch15.md`](story/arc3-story-ch11-ch15.md) | 11-15 | Phase 4, Arc 2 Story |
| [`story/arc4-story-ch16-ch20.md`](story/arc4-story-ch16-ch20.md) | 16-20 | Phase 5, Phase 6, Arc 3 Story |
| [`story/arc5-story-ch21-ch25.md`](story/arc5-story-ch21-ch25.md) | 21-25 | Phase 6, Arc 4 Story |

### Reference
| File | Purpose |
|------|---------|
| [`campaign-flags.md`](campaign-flags.md) | Single source of truth for all conditional game state, endings, meta-stat formulas |
