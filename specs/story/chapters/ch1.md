# Chapter 1: The Road to Kureha

Chapter 1 is the only chapter implemented. Its script is in `src/story/script.ts`,
recast onto the ported game's roster; this file is the design intent behind it.

## Summary

The tutorial. Kurogane landed at Kodo, the king died on the sand and Ilza
burned; the prince is on the coast road south with what is left of his father's
guard, and the gate keep at **Kureha** is already flying Kurogane colours. Teaches
movement, attacking, the weapon triangle, terrain, villages, and Seize.

The chapter has to do two jobs at once: teach the game, and establish that Shigeru
is a young man carrying something far too heavy who has decided not to stop moving.

## Setup

- **Map**: 20×14. The coast road runs south to north up the middle of the board,
  crosses the river on its own bridge, passes between the two villages and stops
  at the keep gate. There is a second, smaller crossing to the west by the shop.
  Throne at (10,1), gate at (10,4). The eastern edge is sea, not cliff —— this is
  the coast road, and a board fenced on all four sides by identical rock reads as
  a box rather than a place.
- **The keep is three rooms.** The gate opens on the throne room only; a treasure
  room sits either side behind a door at (6,2) and (13,2), each holding a chest
  and a revenant. The company carries three keys and four locks stand between it
  and everything —— two doors, two chests. It cannot have all of it.
- **Objective**: Seize the throne
- **Deploy**: 5 slots, preparation skipped, `shigeru` forced
- **Player**: Shigeru, Akira, Lisette, Mirelle (epilogue), Gareth (turn 2)
- **Enemies**: 6, no reinforcements
- **Boss**: Hagen on the throne
- **Par**: 8 turns

## What the code actually does

The map above is in `src/data/chapters/ch1.ts` and matches. The rest does not,
and the gaps are the honest list of what chapter 1 still needs:

| | Intent | Implemented |
|---|---|---|
| Objective | Seize the throne | **Seize** — the lord takes the throne at (10,1) and the chapter ends |
| Deployment | 5 slots | **5 slots**, chosen in the preparation screen |
| Villages | Two | **Two**, at (7,6) and (13,6), one either side of the road |
| Chests | — | **Two**, at (4,1) and (15,1), each behind a door |
| Enemies | 6 brigands on Kurogane pay | 12, including the PoC's monsters — revenants, a bael, a mogall |
| Cast | Shigeru, Akira, Lisette, Mirelle, Gareth | **All five**, plus Bryn, Elin, Ald and Corwin, who are all deployable from turn 1 |

**The names on this page are the names in the game.** The read-it-sideways table
that used to live here — Lisette as テオ, Mirelle as ミナ, Gareth as ガロン — is
gone; `src/data/roster.ts` carries the design ids now. Two things still differ
from the design and are deliberate:

- **Hagen is ハーゲン `e_boss`, a general on a gate rather than a brigand chief**,
  because the map is a keep and a keep wants an officer holding it.
- **The persuade target is Corwin**, `p_corwin`, the PoC's ロウ under his design
  name. The design has him joining at Ch6; nobody's join chapter is implemented,
  so he joins here.

Nobody joins mid-chapter either: Gareth's turn-2 arrival and Mirelle's epilogue
entrance are written as if they happened, but both are on the field from the
start.

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

**Boss death.** He names the village — Kureha — so that somebody will know it.
Shigeru says he will remember, and Hagen is visibly surprised that a prince would.

**Villages.** A hand axe from a farmer's father; a wind tome left by a scholar who
fled inland. Both plant the westward pull of everything in this world.

**Epilogue.** Akira calls it a victory; Shigeru calls it one gate. Mirelle arrives from
the Shirato shrine, sent to find the Flamebrand's bearer, and immediately orders the
prince to sit down and let her look at his arm. He obeys. *"It was the only order
anyone gave him that day that he obeyed."*

## Supports

- **Shigeru × Akira** — Akira notices he has not eaten since Ilza. Establishes that
  Akira is the one person who asks and waits for a real answer.
- **Lisette × Mirelle** — faith vs measurement, handled with respect on both sides.
  *"It was not a refusal. I said I cannot measure it."*
