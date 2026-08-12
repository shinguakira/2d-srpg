import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const W: TerrainType = 'water';
const T: TerrainType = 'fort';
const V: TerrainType = 'village';

// 25 columns x 12 rows — fills 16:9 desktop with square tiles
const terrain: TerrainType[][] = [
  //0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24
  [M, M, M, M, F, F, P, P, P, P, P, P, P, P, P, F, F, P, P, F, P, F, M, M, M], // row 0
  [M, M, M, F, P, P, P, F, P, P, P, F, P, P, P, P, F, P, P, P, F, P, F, M, M], // row 1
  [M, M, F, P, P, V, P, P, P, P, P, P, P, V, P, P, P, P, F, P, P, P, P, M, M], // row 2 — villages
  [M, F, P, P, F, F, P, P, P, T, P, P, F, F, P, P, P, F, P, P, F, P, P, F, M], // row 3 — fort at (9,3)
  [F, P, P, W, P, F, P, P, P, P, P, P, F, P, P, P, F, P, P, F, P, P, P, P, F], // row 4
  [P, P, P, W, P, P, P, F, P, T, F, P, P, P, F, P, P, P, P, P, P, P, P, P, P], // row 5 — fort at (9,5), boss
  [P, P, P, P, P, F, P, P, P, P, P, P, F, P, P, P, P, F, P, P, P, P, P, F, P], // row 6
  [P, P, P, P, F, P, P, P, P, P, P, P, P, F, P, P, P, P, F, P, P, P, P, P, P], // row 7
  [P, P, F, P, P, P, F, P, P, P, P, F, P, P, P, P, F, P, P, P, F, P, P, P, F], // row 8
  [F, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, F], // row 9
  [M, F, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, F, M], // row 10
  [M, M, F, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, F, M, M], // row 11
];

export const CHAPTER_3: ChapterData = {
  id: 'ch3',
  name: 'Chapter 3: The Shiine Hills',
  chapterNumber: 3,
  mapWidth: 25,
  mapHeight: 12,
  terrain,
  playerUnits: [
    { unitId: 'shigeru', position: { x: 9, y: 10 } },
    { unitId: 'akira', position: { x: 14, y: 10 } },
    { unitId: 'lisette', position: { x: 10, y: 11 } },
    { unitId: 'mirelle', position: { x: 15, y: 11 } },
    { unitId: 'gareth', position: { x: 11, y: 10 } },
    { unitId: 'halvar', position: { x: 12, y: 11 } },
    { unitId: 'bryn', position: { x: 13, y: 11 } },
  ],
  enemyUnits: [
    { unitId: 'ch3_fighter_1', position: { x: 8, y: 5 } },
    { unitId: 'ch3_fighter_2', position: { x: 14, y: 6 } },
    { unitId: 'ch3_fighter_3', position: { x: 5, y: 3 } },
    { unitId: 'ch3_soldier_1', position: { x: 15, y: 3 } },
    { unitId: 'ch3_soldier_2', position: { x: 7, y: 4 } },
    { unitId: 'ch3_mage_1', position: { x: 12, y: 2 } },
    { unitId: 'ch3_mage_2', position: { x: 17, y: 4 } },
    { unitId: 'ch3_guard_1', position: { x: 9, y: 3 } }, // on fort
    { unitId: 'ch3_boss', position: { x: 9, y: 5 } }, // boss on fort
  ],
  objective: {
    type: 'rout',
    description: 'Defeat all enemies',
  },
  deploymentSlots: 6,
  forceDeploy: ['shigeru'],
  recruitableUnits: ['bryn'],
  prologue: {
    lines: [
      {
        speaker: 'Narrator',
        text: {
          en: 'Rolling hills ahead. Forests cluster between ridgelines. A fortress sits on the highest hill.',
          ja: 'なだらかな丘陵が続く。尾根のあいだに森が固まり、いちばん高い丘に砦が座っている。',
        },
      },
      {
        speaker: 'Akira',
        text: {
          en: 'Open ground at last. Room to ride.',
          ja: 'ようやく開けた地です。馬を走らせられる。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'Not too far ahead. There is smoke over the eastern valley \u2014 a village, and it has been burning a while.',
          ja: '出すぎるな。東の谷から煙が上がっている。村だ。しかもだいぶ前から燃えている。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Halvar',
        text: {
          en: 'Not Kurogane work. We burn a village in one hour and move on. That has been going since yesterday.',
          ja: '黒鉄の仕事ではない。我々は村を一時間で焼いて先へ進む。あれは昨日から続いている。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'Brigands, then. The Shiine hills have carried them for generations, and a kingdom with no soldiers left is an invitation.',
          ja: 'では山賊です。椎根の丘は何代も彼らを養ってきました。兵の残っていない国は招待状のようなものです。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Gareth',
        text: {
          en: 'Can we talk about these trees? It takes twice as long to cross one stride of forest as one stride of grass. I can see the other side. It is right there.',
          ja: 'この木の話をしていいか？森を一歩進むのに草地の倍かかる。向こう側は見えてるんだ。すぐそこだぞ。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'Because you must go around trunks, over roots, and through undergrowth. Forest costs double. Mountain costs triple. Both hide you better than open grass does.',
          ja: '幹を回り、根を越え、下草を抜けねばならないからです。森は倍、山は三倍。どちらも草地より身を隠せます。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Gareth',
        text: {
          en: 'So the slow ground is the safe ground.',
          ja: 'つまり遅い地面は安全な地面ってことか。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: '...Yes. That is exactly it. Well done.',
          ja: '……ええ。まさにその通りです。よくできました。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: { en: 'Then take the tree line. Move.', ja: 'では木立沿いに進め。動け。' },
        speakerFaction: 'player',
      },
    ],
  },
  epilogue: {
    lines: [
      {
        speaker: 'Mirelle',
        text: {
          en: 'Bryn! Now that we are comrades I have some very important questions. Favourite colour? Any brothers or sisters? Have you ever been in love?',
          ja: 'ブリン！仲間になったからには大事な質問がいくつかあります。好きな色は？ご兄弟は？恋をしたことは？',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Bryn',
        text: { en: 'Green. No. No.', ja: '緑。いない。ない。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: {
          en: 'Three answers! We are getting along famously!',
          ja: '三つも答えてくれました！すっかり打ち解けましたね！',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Bryn',
        text: { en: 'We are not.', ja: '解けていない。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: { en: 'Four! She is opening up!', ja: '四つ目！心を開き始めています！' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Gareth',
        text: {
          en: 'I like her. She does not waste breath.',
          ja: '気に入った。息を無駄にしない女だ。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'My lord. That stand of pines on the ridge. Yesterday it was green. This morning it is grey \u2014 every needle, all the way to the roots, and no fire touched it.',
          ja: '殿下。尾根の松林です。昨日は緑でした。今朝は灰色――葉の一本一本、根まで。火は触れていません。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: { en: 'The same grey as the line at the bridge?', ja: '橋の線と同じ灰色か。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'The same grey, and it lies on the same bearing. Two marks make a line, my lord. Three would make it a road.',
          ja: '同じ灰色で、しかも同じ方位に乗っています。二つの印は線になります、殿下。三つなら道になる。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: { en: 'A road going where?', ja: 'どこへ続く道なのですか。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'I do not know yet. But it is not running out to sea. It is coming inland, and it is keeping pace with us.',
          ja: 'まだわかりません。ただ海へ抜けてはいない。内陸へ来ています。しかも我々と同じ速さで。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'Then we do not stop. Akira \u2014 the harbour road, and quickly.',
          ja: 'なら止まらない。アキラ、港への道だ。急げ。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: { en: 'Already saddled, my lord.', ja: 'すでに鞍は置いてあります、殿下。' },
        speakerFaction: 'player',
      },
    ],
  },
  villages: [
    {
      position: { x: 5, y: 2 },
      reward: {
        type: 'weapon',
        weaponId: 'steel_sword',
        dialogue: {
          en: 'A fine blade, forged by our best smith. Use it to drive these bandits out!',
          ja: '村一番の鍛冶が打った業物です。これで賊を追い払ってください！',
        },
        speaker: 'Sasu Blacksmith',
      },
    },
    {
      position: { x: 13, y: 2 },
      reward: {
        type: 'weapon',
        weaponId: 'elfire',
        dialogue: {
          en: 'This tome was left behind by a traveling sage. It holds powerful fire magic.',
          ja: '旅の賢者が置いていった魔道書です。強い炎の魔法が籠もっています。',
        },
        speaker: 'Sasu Villager',
      },
    },
  ],
  parTurns: 10,
  reinforcements: [
    {
      turn: 4,
      units: [
        { unitId: 'ch3_reinforce_1', position: { x: 3, y: 11 } },
        { unitId: 'ch3_reinforce_2', position: { x: 20, y: 11 } },
      ],
      message: { en: 'More bandits emerge from the forest!', ja: '森からさらに賊が現れた！' },
    },
  ],
  events: [
    // Turn 2 — Terrain lesson
    {
      id: 'ch3_terrain_lesson',
      trigger: { type: 'turn_start', turn: 2 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Gareth',
                text: {
                  en: 'OW. How did that archer hit me from way over there??',
                  ja: 'いてっ。あんな遠くの弓兵がなんで当ててくるんだ？',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: {
                  en: "You're standing on a plain. Zero avoid bonus. If you'd stopped in that forest tile, you'd have had +20 avoid.",
                  ja: '平地に立っているからです。回避の補正はゼロ。あの森で止まっていれば回避が二十上がっていました。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Gareth',
                text: {
                  en: "I'm not hiding behind a TREE.",
                  ja: '木の陰に隠れるなんてごめんだね。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Halvar',
                text: {
                  en: "I'm hiding behind a tree. Very comfortable.",
                  ja: '俺は木の陰にいる。実に快適だ。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Akira',
                text: {
                  en: 'The fortress ahead has fort tiles \u2014 those give even more defense. The boss will be on one.',
                  ja: '前方の砦には防御の効く地点があります。守備が上がる。敵将はそこに立つはずです。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: "Akira's right. We can't brute force a fort tile. We'll need Lisette's magic or weapon advantage.",
                  ja: 'アキラの言う通りだ。砦の上を力押しはできない。リゼットの魔法か、武器の相性がいる。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 3 — Bryn's rescue
    {
      id: 'ch3_bryn_rescue',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Akira',
                text: {
                  en: "There's someone defending that village alone!",
                  ja: 'あの村を一人で守っている者がいます！',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Bryn',
                text: { en: 'Took you long enough.', ja: '遅い。' },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: { en: 'You held them off by yourself?', ja: '一人で凌いでいたのか。' },
                speakerFaction: 'player',
              },
              {
                speaker: 'Bryn',
                text: {
                  en: "Bow. High ground. They can't reach me. Simple.",
                  ja: '弓。高所。届かない。それだけ。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Mirelle',
                text: {
                  en: 'Oh! A mysterious loner with a bow! Are you the stoic rival type or the\u2014',
                  ja: 'まあ！弓を持った謎めいた一匹狼！あなたは寡黙な好敵手型ですか、それとも――',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Bryn',
                text: { en: "I'm a hunter.", ja: '猟師だ。' },
                speakerFaction: 'player',
              },
              {
                speaker: 'Mirelle',
                text: {
                  en: '...The strong-silent type. Got it.',
                  ja: '……寡黙で強い型ですね。承知しました。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: {
                  en: "Bows have 2-range. She can hit from two tiles away but can't fight at melee. No counterattacks up close.",
                  ja: '弓の間合いは二です。二歩離れて撃てますが接近戦はできません。密着されると反撃できない。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Bryn',
                text: {
                  en: "So don't let them get close. That's my only rule.",
                  ja: 'なら近づかせるな。私の決まりはそれだけ。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 5 — First glitch
    {
      id: 'ch3_first_glitch',
      trigger: { type: 'turn_start', turn: 5 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Lisette',
                text: {
                  en: 'My lord. The grey has reached us.',
                  ja: '殿下。灰がこちらに届きました。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: { en: 'Where?', ja: 'どこだ。' },
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: {
                  en: 'Underfoot. That whole stretch of hillside was green when we deployed. It is ash now, and it is still spreading \u2014 slowly, but I can watch it happen.',
                  ja: '足元です。展開したときあの斜面一帯は緑でした。今は灰。しかもまだ広がっています。ゆっくりですが、広がるのが目で見える。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Halvar',
                text: { en: 'Ground does not do that.', ja: '地面はそんな真似をせん。' },
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: {
                  en: 'Correct. That is precisely why I am concerned.',
                  ja: 'その通りです。だからこそ懸念しています。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Mirelle',
                text: {
                  en: 'Do not stand in it. Whatever else we decide \u2014 nobody stands in the grey.',
                  ja: 'その中に立たないでください。他に何を決めるにしても――灰の上に誰も立たない。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'Agreed. Everyone keep off the ash. Lisette, mark where its edge is when we finish, then we deal with Olrik.',
                  ja: '承知した。全員、灰を避けろ。リゼット、終わったら縁の位置を記録しろ。それからオルリクだ。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss pre-combat — Shigeru approaches Olrik
    {
      id: 'ch3_boss_precombat',
      trigger: { type: 'unit_at', unitId: 'shigeru', position: { x: 9, y: 4 } },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Olrik',
                text: {
                  en: 'This fortress will not fall while I draw breath.',
                  ja: 'この砦は我が息のあるかぎり落ちん。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'Captain Olrik. You are holding a hill fort in a kingdom that no longer exists, against men who have nowhere else to go. You do not have to die here.',
                  ja: 'オルリク隊長。もはや存在しない国の丘の砦を、行き場のない者たち相手に守っている。ここで死ぬ必要はない。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Olrik',
                text: {
                  en: 'I was given this fort. I do not much care who is left below it. A post is a post.',
                  ja: 'この砦を預かった。麓に誰が残っていようと大して気にせん。持ち場は持ち場だ。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'Look behind you, at the hillside. Does a post explain that?',
                  ja: '背後の斜面を見ろ。持ち場でそれの説明がつくか。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Olrik',
                text: {
                  en: '...I have been told not to look at it. That is an order too. Raise your weapon, boy.',
                  ja: '……見るなと言われている。それも命令だ。得物を上げろ、小僧。',
                },
                speakerFaction: 'enemy',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss killed
    {
      id: 'ch3_boss_killed',
      trigger: { type: 'unit_killed', unitId: 'ch3_boss' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Akira',
                text: {
                  en: 'He fought well. Just a soldier doing his duty.',
                  ja: '見事な戦いぶりでした。務めを果たしただけの兵です。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'Most of them are. That is the trouble.',
                  ja: '大半がそうだ。それが厄介なところだ。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Bryn',
                text: {
                  en: 'Was there another way? One where he lives.',
                  ja: '別の道はあった？あの人が生きている道は。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: '...Not one I could find in the time I had. Ask me again next time. Keep asking me.',
                  ja: '……あの時間の中で私には見つけられなかった。次もまた訊いてくれ。訊き続けてくれ。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
  ],
  supportConversations: [
    {
      unitA: 'shigeru',
      unitB: 'mirelle',
      lines: [
        {
          speaker: 'Mirelle',
          text: {
            en: 'My lord, the men need an evening where nobody is dying. A fire, a pot, somebody singing badly.',
            ja: '殿下、誰も死なない夜が兵には要ります。焚き火と鍋と、下手な歌の一つも。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: {
            en: 'We are being hunted across our own country, Mirelle.',
            ja: '我々は自国を追われている身だ、ミレーユ。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Mirelle',
          text: {
            en: 'Which is exactly why. Men who never rest do not become hard, my lord. They become brittle. I have buried enough of the brittle ones to know.',
            ja: 'だからこそです。休まぬ者は強くなりません、殿下。脆くなります。脆くなった人を充分に埋めてきたので分かります。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: {
            en: '...One evening. Where would we even stop?',
            ja: '……一晩だけだ。どこで止まるというんだ。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Mirelle',
          text: {
            en: 'Leave that to me. I have already made Gareth dig a fire pit. He thinks it was his idea.',
            ja: 'そこはお任せを。もうガレスに焚き火の穴を掘らせました。本人は自分の思いつきだと思っています。',
          },
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'mirelle', stat: 'res', amount: 1 },
    },
    {
      unitA: 'gareth',
      unitB: 'halvar',
      lines: [
        {
          speaker: 'Gareth',
          text: {
            en: 'Halvar. Straight question. Do you ever miss the other side?',
            ja: 'ハルヴァル。単刀直入に訊く。向こう側が恋しくなることはあるか。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Halvar',
          text: {
            en: 'I miss the bread. Kurogane feeds its soldiers properly. That is the whole list.',
            ja: 'パンが恋しい。黒鉄は兵にちゃんと食わせる。それで全部だ。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Gareth',
          text: { en: 'Not the men?', ja: '人はどうなんだ。' },
          speakerFaction: 'player',
        },
        {
          speaker: 'Halvar',
          text: {
            en: 'I will be killing the men. Some of them taught me to shave. So no, lad, I do not let myself miss the men.',
            ja: 'その人たちをこれから殺す。髭の剃り方を教えてくれた奴もいる。だからな、若いの、人は恋しがらんことにしている。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Gareth',
          text: { en: '...Sorry I asked.', ja: '……悪かった、訊いて。' },
          speakerFaction: 'player',
        },
        {
          speaker: 'Halvar',
          text: {
            en: 'Do not be. You are the first one who did.',
            ja: '詫びるな。訊いたのはお前が最初だ。',
          },
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'halvar', stat: 'def', amount: 1 },
    },
  ],
};
