# Chapter 8: The Last Stand on Yatate

Exact dialogue lives in `src/data/chapters/chapter8.ts`. **Halvar dies here.** This
is the campaign's turning point and the chapter everything before it is building
toward.

## Summary

A mountain fortress with two fronts: the throne room to the north, and a south
corridor that General Wulfram will deliberately fill once the party commits. Halvar
knows the trick because he served under Wulfram for six years — and knows what it
costs to answer it.

## Setup

- **Map**: 18×20; throne at (9,1); a one-wide south corridor with a fort at (8,16)
- **Objective**: Defeat General Wulfram and seize the throne
- **Deploy**: 8 slots; **`shigeru` and `halvar` force-deployed** — the corridor
  sequence requires him on the field
- **Boss**: General Wulfram (halberdier) + four knights, three cavaliers, two mages
- **Reinforcements**: south gate, turns 5 onward
- **Par**: 20 turns

## The sacrifice sequence

Scripted, in `events`:

| Turn | Event | Effect |
|---|---|---|
| 8 | `ch8_halvar_to_npc` | Halvar disobeys the order to stand down. `remove_unit: halvar`, then spawns `halvar_npc` at (8,16) as an **ally**, aggressive AI |
| 10 | `ch8_halvar_holding` | Off-screen: a lance being set, over and over, in a doorway one man wide |
| 12 | `ch8_halvar_fading` | He is slowing. Urgency on the throne |
| 13 | `ch8_halvar_death` | `remove_unit: halvar_npc`, `set_flag halvar_dead=true` |

`Game.tsx` bridges `halvar_dead` to campaign flags; `campaignStore` then removes him
from the roster permanently and applies the `grief` trauma skill to every surviving
unit for two chapters.

## Beats

**Prologue — the argument.** Halvar lays out Wulfram's method. Akira proposes
splitting the company; Halvar refuses it — half the company does not take Wulfram.
What is needed is everything going up to the throne and one man in the corridor who
knows how long it can be held.

Shigeru says no, twice, and gives his reason: *"I have not lost anyone since Izuhara
and I am not starting tonight because it is efficient."*

Halvar's answer is the line the chapter is built on:

> *"You will lose someone tonight either way. The only question you get to answer is
> whether it is somebody who chose it."*

Nadine says she will stay near the corridor. Halvar sends her to the prince.

**Turn 8 — the refusal.** *"I am afraid I am going to disobey an order, my lord. It
is becoming a habit."* Eleven years he stood a post because a man told him to. This
one he picked. He asks Shigeru to tell Takeshi that a sergeant of the second wall
company stopped believing him.

**Turn 13 — the death.** No speech. The lance comes up one more time, more slowly
than the last, and does not come down. *"Post... held..."* Mirelle tries to go; Corwin
has Gareth hold her.

> *"Nothing else came up the south corridor that night. It had taken a full company
> all evening to get past one man, and by then the throne was already lost."*

**Boss death.** Wulfram asks who held the corridor for nine turns. Told it was
Halvar: *"He was the only man in my command who ever asked me a question. I had him
posted to a wall for it."* Then he sends Shigeru west to look at what his emperor
is carrying.

**Epilogue — the cost.** Shigeru's confession is that he *gave permission*: said the
word out loud and then turned around and walked up to the throne. Lisette refuses to
soften it and refuses to let him only feel the guilt: the fortress is theirs and
eleven people are alive who would not be, and both are true at once.

Gareth puts his fist into the wall. Akira counts the turns — nine, on foot, alone, and
nothing in the histories of this kingdom like it. Nadine could not get down the stair.
Corwin tells her that was the entire idea: *"He picked a place where nobody could
reach him so that nobody would have to try."*

## Supports

- **Shigeru × Halvar** — *"do not come back for me"* / *"do not let it be for nothing.
  That is all a soldier actually asks for, whatever the songs say."*
- **Halvar × Mirelle** — he has been frightened for eleven years of the wrong things.
  Tonight he is frightened of something worth it, and finds it restful.
