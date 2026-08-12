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
        text: 'Akira, do you ever wonder what things were like before the Collapse?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: 'Sometimes. My grandfather spoke of green fields that stretched to the horizon. Hard to imagine now.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'I dream of restoring that world. It feels impossibly far away, but...',
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
        text: 'Honestly? Yes. Each loop feels like losing a piece of myself.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: 'Then let me carry some of that burden. You do not have to face it alone.',
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: 'Akira... Thank you. Truly.', speakerFaction: 'player' },
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
        text: 'Akira, in all my loops... you have always been by my side. Every single time.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: 'Is that so? Then perhaps it is fate, not duty, that binds us.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'I used to think fate was a cage. But now I think it might be a compass.',
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

  // ===== Shigeru & Kanna =====
  {
    unitA: 'shigeru',
    unitB: 'kanna',
    rank: 'C',
    lines: [
      {
        speaker: 'Kanna',
        text: 'Shigeru, I have been analyzing the magical residue from the last battle. Fascinating patterns.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'You see patterns in everything, Kanna. What did you find?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Kanna',
        text: 'The corruption is not random. It follows ley lines, like water follows riverbeds.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'That could help us predict where it will spread next. Brilliant!',
        speakerFaction: 'player',
      },
    ],
    reward: { type: 'stat', unitId: 'kanna', stat: 'mag', amount: 1 },
  },
  {
    unitA: 'shigeru',
    unitB: 'kanna',
    rank: 'B',
    lines: [
      {
        speaker: 'Shigeru',
        text: 'Kanna, you push yourself too hard. When was the last time you slept?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Kanna',
        text: 'Sleep is inefficient. There is too much to understand about the corruption.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'Understanding means nothing if you collapse on the battlefield.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Kanna',
        text: '...You sound like my mother. Fine. I will rest. But only because the data needs time to process.',
        speakerFaction: 'player',
      },
    ],
    reward: { type: 'exp_both', amount: 20 },
  },

  // ===== Shigeru & Hina =====
  {
    unitA: 'shigeru',
    unitB: 'hina',
    rank: 'C',
    lines: [
      { speaker: 'Hina', text: 'Shigeru, may I ask you something personal?', speakerFaction: 'player' },
      { speaker: 'Shigeru', text: 'Of course, Hina. What is it?', speakerFaction: 'player' },
      {
        speaker: 'Hina',
        text: 'Do you remember everyone from the previous loops? Everyone who...',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'Who died? Yes. Every single one. That is why I cannot fail this time.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Hina',
        text: 'Then I will make sure you do not carry those memories alone. I will heal every wound I can.',
        speakerFaction: 'player',
      },
    ],
    reward: { type: 'stat', unitId: 'hina', stat: 'wil', amount: 1 },
  },

  // ===== Kanna & Hina =====
  {
    unitA: 'kanna',
    unitB: 'hina',
    rank: 'C',
    lines: [
      {
        speaker: 'Kanna',
        text: 'Hina, the focal efficiency of your healing has improved 23% since we started training together.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Hina',
        text: 'Is that your way of saying I am getting better?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Kanna',
        text: 'It is my way of saying the data supports your subjective experience, yes.',
        speakerFaction: 'player',
      },
      { speaker: 'Hina', text: 'I will take it. Thank you, Kanna.', speakerFaction: 'player' },
    ],
    reward: { type: 'exp_both', amount: 15 },
  },
  {
    unitA: 'kanna',
    unitB: 'hina',
    rank: 'B',
    lines: [
      {
        speaker: 'Hina',
        text: 'Kanna, why do you always quantify everything? Not everything can be measured.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Kanna',
        text: 'If it cannot be measured, it cannot be understood. And if it cannot be understood, it cannot be controlled.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Hina',
        text: 'What about friendship? Can you measure that?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Kanna',
        text: '...I suppose I have been trying, in my own way. You are the closest thing to a friend I have, Hina.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Hina',
        text: 'Then stop trying to measure it and just enjoy it.',
        speakerFaction: 'player',
      },
    ],
    reward: { type: 'stat', unitId: 'kanna', stat: 'skl', amount: 1 },
  },

  // ===== Akira & Goro =====
  {
    unitA: 'akira',
    unitB: 'goro',
    rank: 'C',
    lines: [
      {
        speaker: 'Goro',
        text: 'Hey knight-boy, that last swing was sloppy. You telegraph your left side.',
        speakerFaction: 'player',
      },
      { speaker: 'Akira', text: 'I beg your pardon? My form is—', speakerFaction: 'player' },
      {
        speaker: 'Goro',
        text: 'Perfect for a parade. Terrible for staying alive. Come on, spar with me.',
        speakerFaction: 'player',
      },
      { speaker: 'Akira', text: '...Fine. But I will not hold back.', speakerFaction: 'player' },
      { speaker: 'Goro', text: 'Ha! That is what I like to hear!', speakerFaction: 'player' },
    ],
    reward: { type: 'exp_both', amount: 15 },
  },

  // ===== Shigeru & Goro =====
  {
    unitA: 'shigeru',
    unitB: 'goro',
    rank: 'C',
    lines: [
      {
        speaker: 'Goro',
        text: 'Princess — er, Shigeru. You are smaller than I expected for someone who leads an army.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'And you are louder than I expected for someone who sneaks through forests.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Goro',
        text: 'Ha! Fair point. You have got a sharp tongue. I like that.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: 'Then we should get along just fine. Welcome to the company, Goro.',
        speakerFaction: 'player',
      },
    ],
    reward: { type: 'exp_both', amount: 15 },
  },

  // ===== Akira & Genzo =====
  {
    unitA: 'akira',
    unitB: 'genzo',
    rank: 'C',
    lines: [
      {
        speaker: 'Genzo',
        text: 'Sir Akira, I wanted to say... your lance technique is flawless. I have much to learn.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: 'You are too kind, Genzo. Your shield work is impressive for your age.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Genzo',
        text: 'I trained under Captain Alden before... before the fortress fell.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: 'Alden was a fine soldier. He would be proud to see you carrying on his teachings.',
        speakerFaction: 'player',
      },
    ],
    reward: { type: 'stat', unitId: 'genzo', stat: 'def', amount: 1 },
  },
];
