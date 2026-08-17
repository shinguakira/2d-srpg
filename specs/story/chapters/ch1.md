# Chapter 1: The Road to Kuta

Chapter 1 is the only chapter implemented. Its script is in `src/story/script.ts`,
recast onto the ported game's roster; this file is the design intent behind it.

## Summary

The tutorial. Kurogane landed at Komoda, the king died on the sand and Izuhara
burned; the prince is on the coast road south with what is left of his father's
guard, and the gate keep at **Kuta** is already flying Kurogane colours. Teaches
movement, attacking, the weapon triangle, terrain, villages, and Seize.

The chapter has to do two jobs at once: teach the game, and establish that Shigeru
is a young man carrying something far too heavy who has decided not to stop moving.

## Setup

- **Map**: 20×14, a river across the board with two crossings, and a keep whose
  only entrance is a one-tile gate. Throne at (10,1), gate at (10,4)
- **Objective**: Seize the throne
- **Deploy**: 5 slots, preparation skipped, `shigeru` forced
- **Player**: Shigeru, Akira, Lisette, Mirelle (epilogue), Gareth (turn 2)
- **Enemies**: 6, no reinforcements
- **Boss**: Hagen on the throne
- **Par**: 8 turns

## What the code actually does

The map above is in `src/data/chapter1.ts` and matches. The rest does not, and
the gaps are the honest list of what chapter 1 still needs:

| | Intent | Implemented |
|---|---|---|
| Objective | Seize the throne | Rout — `checkResult` wins when the last enemy dies. There is no seize |
| Deployment | 5 slots | None. All eight units start on the board |
| Enemies | 6 brigands on Kurogane pay | 13, including the PoC's monsters — revenants, a bael, a mogall |
| Villages | Two | No village terrain exists |
| Cast | Shigeru, Akira, Lisette, Mirelle, Gareth | シゲル plus the PoC's seven |

The script was recast onto the ported roster rather than rewritten, so the
chapter is playable and speaks the right beats under other names:

| This file | `src/story/script.ts` |
|---|---|
| Shigeru | シゲル `p_shigeru` |
| **Akira** | **ジェイガン `p_akira`** — renamed off the PoC's ゼス, and he has his portrait. The name plate says ジェイガン because that is the alias he uses in the campaign |
| Lisette | テオ `p_teo` |
| Mirelle | ミナ `p_mina` |
| Gareth | ガロン `p_garon` |
| Hagen | ヴァルガ `e_boss` — a general on a gate, not a brigand chief |

リナ, シエル and アルド have no counterpart here and no lines. The persuade
target, the mercenary ロウ, is the PoC's and is not in this chapter's design.

## Beats

**Prologue.** Akira reports the keep taken. Shigeru orders the assault because the
road runs through it and there is nowhere else to be. Akira notes he has not slept;
Shigeru answers *"I would rather my father were alive. Form up."* — the chapter's
whole characterisation in one line.

**Turn 2 — Gareth arrives.** A woodcutter who has been fighting brigands alone since
sunup, cheerfully insubordinate. Akira disapproves on procedural grounds.

**Turn 3 — weapon triangle.** Gareth's axe bounces off a lancer. Lisette explains the
triangle as drill-yard fact, not game mechanic. Kept short and unpatronising.

**Turn 4 — Hagen's introduction.** He has worked this road for twenty years. He
took Kurogane pay because that army was going to walk over him either way, and they
hold his brother's village. He is not a monster and the player should notice.

**Boss pre-combat** (Shigeru steps to (10,2), inside the gate). Shigeru offers him the road south.
Hagen cannot take it. *"Don't be sorry. Be quick."*

**Boss death.** He names the village — Kuta — so that somebody will know it.
Shigeru says he will remember, and Hagen is visibly surprised that a prince would.

**Villages.** A hand axe from a farmer's father; a wind tome left by a scholar who
fled inland. Both plant the westward pull of everything in this world.

**Epilogue.** Akira calls it a victory; Shigeru calls it one gate. Mirelle arrives from
the Shiratake shrine, sent to find the Flamebrand's bearer, and immediately orders the
prince to sit down and let her look at his arm. He obeys. *"It was the only order
anyone gave him that day that he obeyed."*

## Supports

- **Shigeru × Akira** — Akira notices he has not eaten since Izuhara. Establishes that
  Akira is the one person who asks and waits for a real answer.
- **Lisette × Mirelle** — faith vs measurement, handled with respect on both sides.
  *"It was not a refusal. I said I cannot measure it."*
