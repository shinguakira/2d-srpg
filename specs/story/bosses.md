# Bosses

Chapter bosses for the 25-chapter campaign. Stats live in `src/data/units.ts`; AI
behaviour types are documented in [ai.md](../gameplay/ai.md).

**Writing rule for every boss in this game:** they are doing their job. Most of them
know something is wrong in the west and have been ordered not to look at it. The
player should feel the cost of each one.

---

## Arc 1 — Flight (Ch1-5)

### Ch1 — Hagen, brigand chief
- **id** `hagen` · Fighter (axe, hand axe) · AI: boss (holds throne)
- Twenty years working the same stretch of road. Took Kurogane coin because the
  army was going to walk over him either way, and they hold his brother's village.
- **Pre-combat**: *"So you are the prince. You look about twelve."*
- **Death**: *"Kuta. The village is called Kuta. Somebody ought to know that."*

### Ch2 — Commander Vidar
- **id** `vidar` · Cavalier (lance, steel lance) · AI: boss
- Professional. Refuses to read past his orders on principle, and says so.
- **Drops**: a **cracked shrine ward** from the seal at Are — the campaign's first
  hard evidence, and the reason the party starts looking west.
- **Key line**: *"A soldier who reads past his orders is a soldier looking for a reason to run."*

### Ch3 — Captain Olrik
- **id** `ch3_boss` · Soldier (steel lance, javelin) · AI: boss, on a fort tile
- Holding a hill fort in a kingdom that no longer exists. Has been explicitly
  ordered not to look at the grey hillside behind him, and complies.
- **Mechanic**: high DEF on a fort (+3). Wants magic or weapon advantage.

### Ch4 — Brask, sea raider
- **id** `ch4_boss` · Fighter (steel axe, hand axe) · AI: aggressive (leaves throne)
- **Drops**: a signed, dated Kurogane pay chit. The Empire is paying pirates to
  starve the province it just conquered.
- **Mechanic**: aggressive — comes to the player while raiders race for storehouses.

### Ch5 — General Roderic ★ *(arc boss)*
- **id** `ch5_boss` · General Knight · AI: boss, with two escort knights
- Lost nine men to the rift in his own courtyard, reported it three times, and was
  told to hold the fortress. Complied.
- **Death**: reveals Takeshi visited in the spring, stood at the rift's edge for an
  hour without fear, and said *"Good. It is still hungry."*

---

## Arc 2 — The Broken Seal (Ch6-10)

### Ch6 — Captain Aeryn
- **id** `ch6_boss` · Pegasus Knight · AI: aggressive
- Reported the hole in the sky as weather, twice. The second report came back with
  her commission attached and a note telling her to fly lower.
- **Arc 4 hook**: if spared in a later route she is a recruit and an ending flag
  (`tsubameRecruited`).

### Ch7 — Admiral Varro *(optional)*
- **id** `ch7_boss` · General Soldier · AI: stationary
- The chapter's objective is *survive 12 turns*; Varro is optional. Drops a Hero
  Crest. Watched his own north wall turn grey and kept the watch rotation unchanged.

### Ch8 — General Wulfram ★ *(arc boss)*
- **id** `ch8_boss` · Halberdier · AI: boss
- Does not defend a fortress — opens the south gate, lets you commit, and closes it
  behind you. Halvar served under him for six years and knows the pattern, which is
  the entire reason the chapter is survivable.
- **Death**: asks who held the corridor. On hearing Halvar's name: *"He was the only
  man in my command who ever asked me a question. I had him posted to a wall for it."*

### Ch9 — Raider Captain
- **id** `ch9_raider_captain` · Cavalier · no dialogue
- Deliberately anonymous. Ch9 is a grief chapter; its enemies are not characters.

### Ch10 — Grand Magus Ezrin ★ *(arc boss)*
- **id** `ch10_boss` · Sage (elfire, mend) · AI: boss with three escort guards
- Came for Elder Ilse's chronicle, not for the hill. Read the same signs Lisette does
  and kept serving anyway. Drops a Master Seal.

### Ch10 — Blackflame Colossus *(turn 6 spawn)*
- **id** `ch10_construct` · Knight-frame, HP 50 / STR 15 / DEF 14 / SPD 3
- Not a revenant — a revenant was a person once. This has been **assembled**, out of
  several. Goes straight for the chronicle. When killed, its ash runs west along
  the ground *against the wind*: the first thing in the campaign the party can
  actually follow.

---

## Arc 3-5 (planned)

Ch11-24 bosses are Kurogane officers in provinces that are themselves going grey,
plus blight-born monsters that get less human as the party goes west.

### Ch25 — Takeshi, Emperor of Ash ★★★ *(final boss)*
- Shaven-headed, a head taller than anyone else on the field, both arms burned to
  the elbow in a bark-like pattern from carrying the Blackflame.
- Once the finest general on the continent, and sworn brother to King Sadao. Taught
  Shigeru's father to ride.
- He broke the seal at Are himself and took the Blackflame into his own body,
  because the 347 knights bought the world four centuries and he intends to end it
  instead of postponing it again.
- **He is never written as mad.** He is polite, patient, and completely certain. He
  makes the strongest argument in the game for his own position, and Shigeru never
  refutes it — he only refuses it.
- **Best outcome** is not proving him wrong. It is his choosing to put it down
  (`takeshiSpared` → *The Fourth Flame*).
- **Ch10 appearance**: unarmed, alone, asks for the Flamebrand, is refused, and walks
  away. Nobody raises a bow, and afterwards none of them can say why.
