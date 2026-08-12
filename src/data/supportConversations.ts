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
        text: {
          en: 'Akira. Do you remember what the palace gardens looked like in spring?',
          ja: 'アキラ。王宮の庭は春にどんなふうだったか、覚えているか。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: {
          en: 'Every day, my lord. The plum trees along the east wall. Your father used to take his tea under them and complain about the tea.',
          ja: '毎日思い出しております、殿下。東の壁沿いの梅。先王はその下で茶を召し上がっては、茶の文句を仰っていました。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'I want it back. All of it, exactly as it was, which I know is a child’s want.',
          ja: '取り戻したい。何もかも、あのままの姿でだ。子供の願いだとは分かっている。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: {
          en: 'A child’s want is still a want worth marching for. I have marched for a great deal worse.',
          ja: '子供の願いでも、行軍する値打ちのある願いです。私はもっとひどいもののために行軍してきました。',
        },
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
        text: {
          en: 'My lord, I have been meaning to ask. The sword. Does it weigh on you?',
          ja: '殿下、かねてよりお伺いしたく思っておりました。その剣。重うございますか。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'Honestly? Yes. Not the steel. The three hundred and forty-seven names on it.',
          ja: '正直に言えば、重い。鋼がではない。そこに刻まれた三百四十七の名がだ。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: {
          en: 'Then let me carry some of it. Not the sword — I am not fool enough to ask for that. The rest.',
          ja: 'ならばその一部を私に持たせてください。剣ではありません――それを求めるほど愚かではない。それ以外を。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: { en: 'Akira... thank you. Truly.', ja: 'アキラ……礼を言う。心から。' },
        speakerFaction: 'player',
      },
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
        text: {
          en: 'Akira. Every road I have walked since Amagi, you have been half a length behind my left shoulder.',
          ja: 'アキラ。天城を出て以来どの道でも、お前は私の左肩の半馬身後ろにいた。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: {
          en: 'That is where a retainer rides, my lord. It is in the manual.',
          ja: '従者が乗る位置です、殿下。教本にそう記されております。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'I know it is in the manual. I am telling you I noticed.',
          ja: '教本にあるのは知っている。私が気づいていたと言っているんだ。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: {
          en: '...Ah. Then I am glad you noticed, my lord. Half a length. Wherever it goes.',
          ja: '……ああ。では、お気づきくださって幸いです、殿下。半馬身。どこへ続く道であろうと。',
        },
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
        text: {
          en: 'My lord, I took soil from where the blight met the river. It stopped at the water. It has never stopped at anything before.',
          ja: '殿下、灰が川に達した地点の土を採りました。水際で止まっています。あれが何かで止まったのは初めてです。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'Running water, then. That is the first rule we have found that it obeys.',
          ja: '流れる水か。あれが従う規則として、我々が見つけた最初のものだな。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'One rule, my lord. One rule is a foothold. Give me ten and I will give you a strategy.',
          ja: '規則が一つです、殿下。一つあれば足掛かりになる。十いただければ戦略をお返しします。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'Then start with the rivers. Every bridge and ford between here and the north.',
          ja: 'なら川から始めろ。ここから北までの橋と渡渉点を全部だ。',
        },
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
        text: { en: 'Lisette. When did you last sleep?', ja: 'リゼット。最後に眠ったのはいつだ。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'Sleep is a poor use of a night when the night is the only quiet I get.',
          ja: '静かな時間が夜しかないのに、その夜を眠りに使うのは損です。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'Understanding is worth nothing if you fall off your horse on the march.',
          ja: '行軍中に馬から落ちるなら、理解に値打ちはない。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: '...You sound exactly like my mother. Very well. I will sleep. Only because a tired reading is a wrong reading.',
          ja: '……母と同じことを仰る。分かりました、眠ります。疲れた読みは誤った読みだからというだけの理由で。',
        },
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
        text: {
          en: 'Shigeru, may I ask you something personal?',
          ja: 'シゲル様、少し立ち入ったことを伺っても？',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: { en: 'Of course, Mirelle. What is it?', ja: '構わない、ミレーユ。何だ。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: {
          en: 'Do you keep count? Of the ones we have lost.',
          ja: '数えていらっしゃいますか。失った人たちを。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'Yes. Names, and where, and what I had ordered them to do. It is a short list and I intend to keep it short.',
          ja: '数えている。名前と、場所と、私が何を命じていたかをだ。短い名簿だ。短いままにするつもりでいる。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: {
          en: 'Then let me carry the list with you. A thing two people remember is a memory. A thing one person remembers is a haunting.',
          ja: 'ではその名簿を一緒に持たせてください。二人が覚えていることは思い出です。一人だけが覚えていることは、憑きものです。',
        },
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
        text: {
          en: 'Mirelle. Your staff work has improved by about a quarter since Tsutsu. I have been counting.',
          ja: 'ミレーユ。豆酘以来、あなたの杖さばきは四分の一ほど上達しています。数えていました。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: {
          en: 'Is that your way of saying I am getting better?',
          ja: 'それは上達したと言ってくださっているのですか？',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'It is my way of saying the count agrees with how you feel about it, which is rarer than you would think.',
          ja: '数字があなたの実感と一致していると言っているのです。これは思うより稀なことですよ。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: {
          en: 'I will take it. Thank you, Lisette.',
          ja: '受け取っておきます。ありがとう、リゼット。',
        },
        speakerFaction: 'player',
      },
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
        text: {
          en: 'Lisette, why must you put a number on everything? Some things do not take numbers.',
          ja: 'リゼット、どうして何にでも数を付けるのですか。数にならないものもあります。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'If I cannot measure it I cannot check it, and if I cannot check it I am simply hoping. I was raised to distrust hoping.',
          ja: '測れなければ確かめられず、確かめられなければ、それはただ願っているだけです。願いを信用するなと育てられました。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: {
          en: 'What about friendship? Can you measure that?',
          ja: '友情はどうです？それは測れますか。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: '...I suppose I have been trying, in my own way. You are the closest thing to a friend I have, Mirelle.',
          ja: '……私なりに測ろうとはしてきたようです。あなたは私にとって、友にいちばん近いものです、ミレーユ。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: {
          en: 'Then stop trying to measure it and just enjoy it.',
          ja: 'でしたら測るのはやめて、ただ楽しんでください。',
        },
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
        text: {
          en: 'Oi, knight. That last cut was sloppy. You lean before you swing left. Everyone can read it.',
          ja: 'おい騎士。今の一撃は雑だ。左へ振る前に体が傾く。誰にでも読まれるぞ。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: { en: 'I beg your pardon? My form is—', ja: '何ですと？私の型は――' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Gareth',
        text: {
          en: 'Perfect for a parade. Terrible for staying alive. Come on, spar with me.',
          ja: '閲兵には完璧だ。生き残るには最悪だ。ほら、組め。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: {
          en: '...Fine. But I will not hold back.',
          ja: '……よろしい。ただし手加減はしません。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Gareth',
        text: { en: 'Ha! That is what I like to hear!', ja: 'はっ！そう来なくちゃな！' },
        speakerFaction: 'player',
      },
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
        text: {
          en: 'Your Highness — Shigeru. You are a good deal smaller than I expected a war leader to be.',
          ja: '殿下――シゲル。戦を率いる人にしちゃ、思ってたよりずいぶん小さいな。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'And you are a good deal louder than I expected a woodsman to be.',
          ja: 'お前は木こりにしては、思っていたよりずいぶんうるさい。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Gareth',
        text: {
          en: 'Ha! Fair. You have a tongue on you. I like that in a commander.',
          ja: 'はっ！違いない。口が回るな。指揮官はそうでなくちゃ。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'Then we should get along just fine. Welcome to the company, Gareth.',
          ja: 'ならうまくやれるだろう。隊へようこそ、ガレス。',
        },
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
        text: {
          en: 'Sir Akira. Your lance work is very fine. Parade-fine.',
          ja: 'アキラ卿。見事な槍さばきだ。閲兵向きに見事だ。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: {
          en: 'You are too kind, sergeant. I hear a “but” in that.',
          ja: 'お褒めにあずかり恐縮です、軍曹。「だが」が聞こえますが。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Halvar',
        text: {
          en: 'But a man who fights that beautifully has never had to fight tired. That is not a criticism, lad. It is a warning.',
          ja: 'だがそれほど美しく戦える男は、疲れた状態で戦ったことがない。咎めではないぞ、若いの。忠告だ。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: {
          en: '...Then teach me how to fight tired. I would rather learn it from you than from the day itself.',
          ja: '……では疲れた戦い方をお教えください。その日から学ぶより、あなたから学びたい。',
        },
        speakerFaction: 'player',
      },
    ],
    reward: { type: 'stat', unitId: 'halvar', stat: 'def', amount: 1 },
  },
];
