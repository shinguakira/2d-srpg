# Arc Structure — 25 Chapters

Five arcs of five chapters. The campaign runs two clocks: the **war** with Kurogane
(fast, chapter-scale, winnable) and the **blight** creeping south out of the broken
northern shrine (slow, campaign-scale, not winnable by fighting). Arc 1 is about the
first. Arc 2 is about discovering the second. Arcs 3-5 are about walking north to
end it.

---

## Arc Overview

| Arc | Chapters | Title | Theme | Tone |
|-----|----------|-------|-------|------|
| 1 | 1-5 | **Flight** | A kingdom falls; a boy who was standing there inherits a sword | Grim but bright — a company forming |
| 2 | 6-10 | **The Broken Seal** | The blight is following *them*; the first real cost | Darkening; grief |
| 3 | 11-15 | **The Ash Road** | Walking north through what the blight has already taken | Bleak, endurance |
| 4 | 16-20 | **The Empire's Back** | Kurogane's own provinces are going grey; allies from the enemy | Bittersweet, political |
| 5 | 21-25 | **The Three Flames** | Relight the seal, and settle with Takeshi | Earned catharsis |

---

## The Blight Clock

Kanna's running count is the spine of Arcs 1-2. Each mark is one chapter's worth of
evidence, and the player should be able to follow the deduction without being told
the answer:

| Chapter | Mark | What Kanna concludes |
|---|---|---|
| Ch2 | Grey grass at the Kuze bridge, in a straight line | "Something drew that." |
| Ch3 | A grey stand of pines on the same bearing | "Two marks make a line. Three would make it a road." |
| Ch4 | A Minato back lane no cat will walk, same bearing | (She walks it at night and does not say what she found.) |
| Ch5 | A hole in the sky, same bearing; a rift *moving toward Shigeru* | "It went past two cities to get here. It wants something we are carrying." |
| Ch6 | The highlands are gone; the blight has passed them in the night | It is no longer ahead of them — it is around them. |
| Ch7 | It starts moving to stay ahead of her readings | It is not weather. It notices being measured. |
| Ch10 | A made thing — a Colossus — comes for the chronicle, then its ash runs north against the wind | Whatever built it wants its pieces back, and that leads to the door. |

---

## Arc 1 — Flight (Ch1-5)

Amagi falls off-screen in the Ch1 prologue. The company is assembled on the run.

- **Ch1 — The Fall of Amagi.** Shirakawa keep, held by brigands on Kurogane pay.
  Boss: Baraku. Joins: Goro (turn 2), Hina (epilogue).
- **Ch2 — The Defector.** The Kuze bridge garrison. Boss: Commander Ryuji.
  Joins: Genzo (turn 3, defects). Ryuji carries a **cracked shrine ward** — the
  first hard evidence that the northern seal is broken.
- **Ch3 — The Hills of Kiri.** Brigands in the hills. Boss: Captain Hyodo.
  Joins: Sayo. Terrain tutorial. First blight seen up close.
- **Ch4 — The Pickpocket.** Minato harbour, three storehouses to hold.
  Boss: Zanba. Joins: Hachi. Zanba carries a Kurogane pay chit — the Empire is
  paying pirates to starve its own conquest.
- **Ch5 — Above the Clouds.** Highland fortress. Boss: General Tetsuzan.
  Joins: Yuki. **Arc turn:** the rift moves toward Shigeru, and Genzo names Takeshi
  and the northern shrine out loud. The company stops running south.

## Arc 2 — The Broken Seal (Ch6-10)

- **Ch6 — Blades for Hire.** Harbour patrol. Boss: Captain Tsubame.
  Joins: Raiga, Mio. The blight has passed them; the south road is cut.
- **Ch7 — What the Wall Held.** Survive 12 turns as revenants come out of the
  fortress wall. Optional boss: Admiral Isonami. **Kanna's crisis chapter.**
- **Ch8 — The Last Stand.** Mountain fortress, two fronts. Boss: General Doumeki.
  **Genzo dies** holding the south corridor for nine turns, by his own choice and
  against a direct order. Grief applies to the whole company for two chapters.
- **Ch9 — The Empty Place.** Forest pass, rout. Joins: Kagura. Grief chapter — the
  party is mechanically weaker and nobody has taken Genzo's place in the march.
- **Ch10 — What We Carry.** Village + fortified hill. Boss: Grand Magus Sozen.
  A **Blackflame Colossus** spawns turn 6 and goes for the elder's chronicle.
  **Arc close: Takeshi appears in person**, unarmed, and asks for the Flamebrand.
  He is refused. Nobody shoots him, and none of them can say why afterwards.

## Arc 3 — The Ash Road (Ch11-15)

North through country the blight has already taken. Grey villages, rifts, revenants
wearing Amagi colours. Western desert reaches. The party learns the blight's rules
the hard way — running water stops it; hallowed ground pushes it back.

## Arc 4 — The Empire's Back (Ch16-20)

Kurogane's own heartland is going grey behind the front line, and its commanders
know. Enemy officers start defecting or standing aside. The moral case against
Takeshi stops being Amagi's and becomes his own army's.

## Arc 5 — The Three Flames (Ch21-25)

The two surviving shrines, the oath of the 347, and the northern mountain.

- **Ch25 — Final: Takeshi, Emperor of Ash.** The argument, and then the fight.
  Takeshi never concedes the argument. The best ending is not one where he is
  proved wrong; it is one where he chooses to put it down.

---

## Endings

Evaluated in `src/core/endings.ts`.

| Ending | Condition | Title |
|---|---|---|
| Perfect | Seal relit + Blackflame ended + 0 deaths + Tsubame recruited + shrine keeper saved + **Takeshi spared** | *The Fourth Flame* |
| True | Seal relit + Blackflame ended | *The Seal Restored* |
| Bittersweet | Blackflame ended, seal never relit | *Ash and Aftermath* |
| Tragic | 5 or more deaths | *What It Took* |

Relighting the seal spends all 347 embers of the Flamebrand. The sword goes dark and
Shigeru leaves it on the shrine floor.

See also: [world.md](world.md), [characters.md](characters.md), [bosses.md](bosses.md).
