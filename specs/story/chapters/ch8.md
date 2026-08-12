# Chapter 8: The Last Stand on Yatate

Exact dialogue lives in `src/data/chapters/chapter8.ts`. **Genzo dies here.** This
is the campaign's turning point and the chapter everything before it is building
toward.

## Summary

A mountain fortress with two fronts: the throne room to the north, and a south
corridor that General Doumeki will deliberately fill once the party commits. Genzo
knows the trick because he served under Doumeki for six years — and knows what it
costs to answer it.

## Setup

- **Map**: 18×20; throne at (9,1); a one-wide south corridor with a fort at (8,16)
- **Objective**: Defeat General Doumeki and seize the throne
- **Deploy**: 8 slots; **`shigeru` and `genzo` force-deployed** — the corridor
  sequence requires him on the field
- **Boss**: General Doumeki (halberdier) + four knights, three cavaliers, two mages
- **Reinforcements**: south gate, turns 5 onward
- **Par**: 20 turns

## The sacrifice sequence

Scripted, in `events`:

| Turn | Event | Effect |
|---|---|---|
| 8 | `ch8_genzo_to_npc` | Genzo disobeys the order to stand down. `remove_unit: genzo`, then spawns `genzo_npc` at (8,16) as an **ally**, aggressive AI |
| 10 | `ch8_genzo_holding` | Off-screen: a lance being set, over and over, in a doorway one man wide |
| 12 | `ch8_genzo_fading` | He is slowing. Urgency on the throne |
| 13 | `ch8_genzo_death` | `remove_unit: genzo_npc`, `set_flag genzo_dead=true` |

`Game.tsx` bridges `genzo_dead` to campaign flags; `campaignStore` then removes him
from the roster permanently and applies the `grief` trauma skill to every surviving
unit for two chapters.

## Beats

**Prologue — the argument.** Genzo lays out Doumeki's method. Akira proposes
splitting the company; Genzo refuses it — half the company does not take Doumeki.
What is needed is everything going up to the throne and one man in the corridor who
knows how long it can be held.

Shigeru says no, twice, and gives his reason: *"I have not lost anyone since Izuhara
and I am not starting tonight because it is efficient."*

Genzo's answer is the line the chapter is built on:

> *"You will lose someone tonight either way. The only question you get to answer is
> whether it is somebody who chose it."*

Mio says she will stay near the corridor. Genzo sends her to the prince.

**Turn 8 — the refusal.** *"I am afraid I am going to disobey an order, my lord. It
is becoming a habit."* Eleven years he stood a post because a man told him to. This
one he picked. He asks Shigeru to tell Takeshi that a sergeant of the second wall
company stopped believing him.

**Turn 13 — the death.** No speech. The lance comes up one more time, more slowly
than the last, and does not come down. *"Post... held..."* Hina tries to go; Raiga
has Goro hold her.

> *"Nothing else came up the south corridor that night. It had taken a full company
> all evening to get past one man, and by then the throne was already lost."*

**Boss death.** Doumeki asks who held the corridor for nine turns. Told it was
Genzo: *"He was the only man in my command who ever asked me a question. I had him
posted to a wall for it."* Then he sends Shigeru west to look at what his emperor
is carrying.

**Epilogue — the cost.** Shigeru's confession is that he *gave permission*: said the
word out loud and then turned around and walked up to the throne. Kanna refuses to
soften it and refuses to let him only feel the guilt: the fortress is theirs and
eleven people are alive who would not be, and both are true at once.

Goro puts his fist into the wall. Akira counts the turns — nine, on foot, alone, and
nothing in the histories of this kingdom like it. Mio could not get down the stair.
Raiga tells her that was the entire idea: *"He picked a place where nobody could
reach him so that nobody would have to try."*

## Supports

- **Shigeru × Genzo** — *"do not come back for me"* / *"do not let it be for nothing.
  That is all a soldier actually asks for, whatever the songs say."*
- **Genzo × Hina** — he has been frightened for eleven years of the wrong things.
  Tonight he is frightened of something worth it, and finds it restful.
