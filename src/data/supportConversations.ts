import type { SupportConversation } from '../core/types';

/**
 * Rank-based support conversations.
 * These unlock when a support pair reaches the specified rank.
 * Keyed by "unitA:unitB:rank" for lookup.
 */
export const RANK_SUPPORT_CONVERSATIONS: SupportConversation[] = [
  // ===== Ren & Kael =====
  {
    unitA: 'ren',
    unitB: 'kael',
    rank: 'C',
    lines: [
      {
        speaker: 'Ren',
        text: 'Kael, do you ever wonder what things were like before the Collapse?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Kael',
        text: 'Sometimes. My grandfather spoke of green fields that stretched to the horizon. Hard to imagine now.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Ren',
        text: 'I dream of restoring that world. It feels impossibly far away, but...',
        speakerFaction: 'player',
      },
      {
        speaker: 'Kael',
        text: 'Not impossible. Not with you leading us, Ren.',
        speakerFaction: 'player',
      },
    ],
    reward: { type: 'exp_both', amount: 15 },
  },
  {
    unitA: 'ren',
    unitB: 'kael',
    rank: 'B',
    lines: [
      {
        speaker: 'Kael',
        text: 'Ren, I have been meaning to ask... the visions you see. Do they frighten you?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Ren',
        text: 'Honestly? Yes. Each loop feels like losing a piece of myself.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Kael',
        text: 'Then let me carry some of that burden. You do not have to face it alone.',
        speakerFaction: 'player',
      },
      { speaker: 'Ren', text: 'Kael... Thank you. Truly.', speakerFaction: 'player' },
    ],
    reward: { type: 'stat', unitId: 'kael', stat: 'def', amount: 1 },
  },
  {
    unitA: 'ren',
    unitB: 'kael',
    rank: 'A',
    lines: [
      {
        speaker: 'Ren',
        text: 'Kael, in all my loops... you have always been by my side. Every single time.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Kael',
        text: 'Is that so? Then perhaps it is fate, not duty, that binds us.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Ren',
        text: 'I used to think fate was a cage. But now I think it might be a compass.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Kael',
        text: 'Then I am grateful that my compass points toward you, Ren.',
        speakerFaction: 'player',
      },
    ],
    reward: { type: 'exp_both', amount: 30 },
  },

  // ===== Ren & Senna =====
  {
    unitA: 'ren',
    unitB: 'senna',
    rank: 'C',
    lines: [
      {
        speaker: 'Senna',
        text: 'Ren, I have been analyzing the magical residue from the last battle. Fascinating patterns.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Ren',
        text: 'You see patterns in everything, Senna. What did you find?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Senna',
        text: 'The corruption is not random. It follows ley lines, like water follows riverbeds.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Ren',
        text: 'That could help us predict where it will spread next. Brilliant!',
        speakerFaction: 'player',
      },
    ],
    reward: { type: 'stat', unitId: 'senna', stat: 'mag', amount: 1 },
  },
  {
    unitA: 'ren',
    unitB: 'senna',
    rank: 'B',
    lines: [
      {
        speaker: 'Ren',
        text: 'Senna, you push yourself too hard. When was the last time you slept?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Senna',
        text: 'Sleep is inefficient. There is too much to understand about the corruption.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Ren',
        text: 'Understanding means nothing if you collapse on the battlefield.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Senna',
        text: '...You sound like my mother. Fine. I will rest. But only because the data needs time to process.',
        speakerFaction: 'player',
      },
    ],
    reward: { type: 'exp_both', amount: 20 },
  },

  // ===== Ren & Lira =====
  {
    unitA: 'ren',
    unitB: 'lira',
    rank: 'C',
    lines: [
      { speaker: 'Lira', text: 'Ren, may I ask you something personal?', speakerFaction: 'player' },
      { speaker: 'Ren', text: 'Of course, Lira. What is it?', speakerFaction: 'player' },
      {
        speaker: 'Lira',
        text: 'Do you remember everyone from the previous loops? Everyone who...',
        speakerFaction: 'player',
      },
      {
        speaker: 'Ren',
        text: 'Who died? Yes. Every single one. That is why I cannot fail this time.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lira',
        text: 'Then I will make sure you do not carry those memories alone. I will heal every wound I can.',
        speakerFaction: 'player',
      },
    ],
    reward: { type: 'stat', unitId: 'lira', stat: 'wil', amount: 1 },
  },

  // ===== Senna & Lira =====
  {
    unitA: 'senna',
    unitB: 'lira',
    rank: 'C',
    lines: [
      {
        speaker: 'Senna',
        text: 'Lira, the focal efficiency of your healing has improved 23% since we started training together.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lira',
        text: 'Is that your way of saying I am getting better?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Senna',
        text: 'It is my way of saying the data supports your subjective experience, yes.',
        speakerFaction: 'player',
      },
      { speaker: 'Lira', text: 'I will take it. Thank you, Senna.', speakerFaction: 'player' },
    ],
    reward: { type: 'exp_both', amount: 15 },
  },
  {
    unitA: 'senna',
    unitB: 'lira',
    rank: 'B',
    lines: [
      {
        speaker: 'Lira',
        text: 'Senna, why do you always quantify everything? Not everything can be measured.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Senna',
        text: 'If it cannot be measured, it cannot be understood. And if it cannot be understood, it cannot be controlled.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lira',
        text: 'What about friendship? Can you measure that?',
        speakerFaction: 'player',
      },
      {
        speaker: 'Senna',
        text: '...I suppose I have been trying, in my own way. You are the closest thing to a friend I have, Lira.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Lira',
        text: 'Then stop trying to measure it and just enjoy it.',
        speakerFaction: 'player',
      },
    ],
    reward: { type: 'stat', unitId: 'senna', stat: 'skl', amount: 1 },
  },

  // ===== Kael & Bram =====
  {
    unitA: 'kael',
    unitB: 'bram',
    rank: 'C',
    lines: [
      {
        speaker: 'Bram',
        text: 'Hey knight-boy, that last swing was sloppy. You telegraph your left side.',
        speakerFaction: 'player',
      },
      { speaker: 'Kael', text: 'I beg your pardon? My form is—', speakerFaction: 'player' },
      {
        speaker: 'Bram',
        text: 'Perfect for a parade. Terrible for staying alive. Come on, spar with me.',
        speakerFaction: 'player',
      },
      { speaker: 'Kael', text: '...Fine. But I will not hold back.', speakerFaction: 'player' },
      { speaker: 'Bram', text: 'Ha! That is what I like to hear!', speakerFaction: 'player' },
    ],
    reward: { type: 'exp_both', amount: 15 },
  },

  // ===== Ren & Bram =====
  {
    unitA: 'ren',
    unitB: 'bram',
    rank: 'C',
    lines: [
      {
        speaker: 'Bram',
        text: 'Princess — er, Ren. You are smaller than I expected for someone who leads an army.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Ren',
        text: 'And you are louder than I expected for someone who sneaks through forests.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Bram',
        text: 'Ha! Fair point. You have got a sharp tongue. I like that.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Ren',
        text: 'Then we should get along just fine. Welcome to the company, Bram.',
        speakerFaction: 'player',
      },
    ],
    reward: { type: 'exp_both', amount: 15 },
  },

  // ===== Kael & Voss =====
  {
    unitA: 'kael',
    unitB: 'voss',
    rank: 'C',
    lines: [
      {
        speaker: 'Voss',
        text: 'Sir Kael, I wanted to say... your lance technique is flawless. I have much to learn.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Kael',
        text: 'You are too kind, Voss. Your shield work is impressive for your age.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Voss',
        text: 'I trained under Captain Alden before... before the fortress fell.',
        speakerFaction: 'player',
      },
      {
        speaker: 'Kael',
        text: 'Alden was a fine soldier. He would be proud to see you carrying on his teachings.',
        speakerFaction: 'player',
      },
    ],
    reward: { type: 'stat', unitId: 'voss', stat: 'def', amount: 1 },
  },
];

/** Lookup support conversation by pair and rank. */
export function getRankConversation(
  unitA: string,
  unitB: string,
  rank: string,
): SupportConversation | null {
  return (
    RANK_SUPPORT_CONVERSATIONS.find(
      (c) =>
        ((c.unitA === unitA && c.unitB === unitB) || (c.unitA === unitB && c.unitB === unitA)) &&
        c.rank === rank,
    ) ?? null
  );
}
