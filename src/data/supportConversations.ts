import type { SupportConversation } from '../core/types';

/**
 * Rank-based support conversations.
 * These unlock when a support pair reaches the specified rank.
 * Keyed by "unitA:unitB:rank" for lookup.
 */
export const RANK_SUPPORT_CONVERSATIONS: SupportConversation[] = [
  // ===== Shigeru & Akira =====
  {
    unitA: 'shigeru',
    unitB: 'akira',
    rank: 'C',
    lines: [
      {
        speaker: 'Shigeru',
        text: 'Akira. Do you remember what the palace gardens looked like in spring?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: 'Every day, my lord. The plum trees along the east wall. Your father used to take his tea under them and complain about the tea.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'I want it back. All of it, exactly as it was, which I know is a child’s want.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: 'Not impossible. Not with you leading us, Shigeru.',
        speakerFaction: 'player',
      },
    ],
    reward: { type: 'exp_both', amount: 15 },
  },
  {
    unitA: 'shigeru',
    unitB: 'akira',
    rank: 'B',
    lines: [
      {
        speaker: 'Akira',
        text: 'Shigeru, I have been meaning to ask... the visions you see. Do they frighten you?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'Honestly? Yes. Not the steel. The three hundred and forty-seven names on it.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: 'Then let me carry some of it. Not the sword — I am not fool enough to ask for that. The rest.',
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: 'Akira... thank you. Truly.', speakerFaction: 'player' },
    ],
    reward: { type: 'stat', unitId: 'akira', stat: 'def', amount: 1 },
  },
  {
    unitA: 'shigeru',
    unitB: 'akira',
    rank: 'A',
    lines: [
      {
        speaker: 'Shigeru',
        text: 'Akira. Every road I have walked since Amagi, you have been half a length behind my left shoulder.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: 'That is where a retainer rides, my lord. It is in the manual.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'I know it is in the manual. I am telling you I noticed.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: 'Then I am grateful that my compass points toward you, Shigeru.',
        speakerFaction: 'player',
      },
    ],
    reward: { type: 'exp_both', amount: 30 },
  },

  // ===== Shigeru & Lisette =====
  {
    unitA: 'shigeru',
    unitB: 'lisette',
    rank: 'C',
    lines: [
      {
        speaker: 'Lisette',
        text: 'My lord, I took soil from where the blight met the river. It stopped at the water. It has never stopped at anything before.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'Running water, then. That is the first rule we have found that it obeys.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: 'One rule, my lord. One rule is a foothold. Give me ten and I will give you a strategy.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'Then start with the rivers. Every bridge and ford between here and the north.',
        speakerFaction: 'player',
      },
    ],
    reward: { type: 'stat', unitId: 'lisette', stat: 'mag', amount: 1 },
  },
  {
    unitA: 'shigeru',
    unitB: 'lisette',
    rank: 'B',
    lines: [
      {
        speaker: 'Shigeru',
        text: 'Lisette. When did you last sleep?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: 'Sleep is a poor use of a night when the night is the only quiet I get.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'Understanding is worth nothing if you fall off your horse on the march.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: '...You sound exactly like my mother. Very well. I will sleep. Only because a tired reading is a wrong reading.',
        speakerFaction: 'player',
      },
    ],
    reward: { type: 'exp_both', amount: 20 },
  },

  // ===== Shigeru & Mirelle =====
  {
    unitA: 'shigeru',
    unitB: 'mirelle',
    rank: 'C',
    lines: [
      {
        speaker: 'Mirelle',
        text: 'Shigeru, may I ask you something personal?',
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: 'Of course, Mirelle. What is it?', speakerFaction: 'player' },
      {
        speaker: 'Mirelle',
        text: 'Do you keep count? Of the ones we have lost.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'Yes. Names, and where, and what I had ordered them to do. It is a short list and I intend to keep it short.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: 'Then let me carry the list with you. A thing two people remember is a memory. A thing one person remembers is a haunting.',
        speakerFaction: 'player',
      },
    ],
    reward: { type: 'stat', unitId: 'mirelle', stat: 'wil', amount: 1 },
  },

  // ===== Lisette & Mirelle =====
  {
    unitA: 'lisette',
    unitB: 'mirelle',
    rank: 'C',
    lines: [
      {
        speaker: 'Lisette',
        text: 'Mirelle. Your staff work has improved by about a quarter since Tsutsu. I have been counting.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: 'Is that your way of saying I am getting better?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: 'It is my way of saying the count agrees with how you feel about it, which is rarer than you would think.',
        speakerFaction: 'player',
      },
      { speaker: 'Mirelle', text: 'I will take it. Thank you, Lisette.', speakerFaction: 'player' },
    ],
    reward: { type: 'exp_both', amount: 15 },
  },
  {
    unitA: 'lisette',
    unitB: 'mirelle',
    rank: 'B',
    lines: [
      {
        speaker: 'Mirelle',
        text: 'Lisette, why must you put a number on everything? Some things do not take numbers.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: 'If I cannot measure it I cannot check it, and if I cannot check it I am simply hoping. I was raised to distrust hoping.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: 'What about friendship? Can you measure that?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: '...I suppose I have been trying, in my own way. You are the closest thing to a friend I have, Mirelle.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: 'Then stop trying to measure it and just enjoy it.',
        speakerFaction: 'player',
      },
    ],
    reward: { type: 'stat', unitId: 'lisette', stat: 'skl', amount: 1 },
  },

  // ===== Akira & Gareth =====
  {
    unitA: 'akira',
    unitB: 'gareth',
    rank: 'C',
    lines: [
      {
        speaker: 'Gareth',
        text: 'Oi, knight. That last cut was sloppy. You lean before you swing left. Everyone can read it.',
        speakerFaction: 'player',
      },
      { speaker: 'Akira', text: 'I beg your pardon? My form is—', speakerFaction: 'player' },
      {
        speaker: 'Gareth',
        text: 'Perfect for a parade. Terrible for staying alive. Come on, spar with me.',
        speakerFaction: 'player',
      },
      { speaker: 'Akira', text: '...Fine. But I will not hold back.', speakerFaction: 'player' },
      { speaker: 'Gareth', text: 'Ha! That is what I like to hear!', speakerFaction: 'player' },
    ],
    reward: { type: 'exp_both', amount: 15 },
  },

  // ===== Shigeru & Gareth =====
  {
    unitA: 'shigeru',
    unitB: 'gareth',
    rank: 'C',
    lines: [
      {
        speaker: 'Gareth',
        text: 'Your Highness — Shigeru. You are a good deal smaller than I expected a war leader to be.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'And you are a good deal louder than I expected a woodsman to be.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Gareth',
        text: 'Ha! Fair. You have a tongue on you. I like that in a commander.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'Then we should get along just fine. Welcome to the company, Gareth.',
        speakerFaction: 'player',
      },
    ],
    reward: { type: 'exp_both', amount: 15 },
  },

  // ===== Akira & Halvar =====
  {
    unitA: 'akira',
    unitB: 'halvar',
    rank: 'C',
    lines: [
      {
        speaker: 'Halvar',
        text: 'Sir Akira. Your lance work is very fine. Parade-fine.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: 'You are too kind, sergeant. I hear a “but” in that.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Halvar',
        text: 'But a man who fights that beautifully has never had to fight tired. That is not a criticism, lad. It is a warning.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: '...Then teach me how to fight tired. I would rather learn it from you than from the day itself.',
        speakerFaction: 'player',
      },
    ],
    reward: { type: 'stat', unitId: 'halvar', stat: 'def', amount: 1 },
  },
];
