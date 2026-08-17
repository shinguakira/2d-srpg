# Supports

`src/battle/support.ts`. FE8's model.

## What a rank is worth

The bonus a pair gives is `(my affinity value + their affinity value) × rank`,
floored, where rank is C=1, B=2, A=3. It applies **only while the partner is
within 3 tiles**, so support is a positioning decision every turn rather than a
permanent stat block.

Each affinity contributes to a different mix:

| | atk | def | hit | avo | crit | ddg |
|---|---|---|---|---|---|---|
| 火 fire | 0.5 | — | 2.5 | 2.5 | 2.5 | — |
| 雷 thunder | — | 0.5 | — | 2.5 | 2.5 | 2.5 |
| 風 wind | 0.5 | — | 2.5 | — | 2.5 | 2.5 |
| 氷 ice | — | 0.5 | 2.5 | 2.5 | — | 2.5 |
| 闇 dark | — | — | 2.5 | 2.5 | 2.5 | 2.5 |
| 光 light | 0.5 | 0.5 | 2.5 | — | 2.5 | — |
| 理 anima | 0.5 | 0.5 | — | 2.5 | — | 2.5 |

Two fire units at A therefore trade `(0.5+0.5)×3 = 3` attack, `(2.5+2.5)×3 = 15`
hit and the same avoid and crit — which is why a fire pair reads as aggressive
and an ice pair reads as durable.

## Earning it

Standing adjacent at the start of the player phase adds points. The thresholds
are the originals — **C at 81, B at 161, A at 241** — but the gain per turn is
inflated because this is one map rather than a campaign.

Reaching the threshold does not grant the rank. The pair has to **talk**, which
costs the turn, and only pairs that have a written conversation can build points
at all. A unit may hold **5 ranks total** across all its partners, so A with one
person costs almost the whole budget.

## Where the conversations live

`src/story/script.ts`. `SUPPORT_PAIRS` is derived from the table's keys, so
adding a conversation is enough — `createUnits` reads that list and gives those
two units a support slot, and nothing else needs editing.
