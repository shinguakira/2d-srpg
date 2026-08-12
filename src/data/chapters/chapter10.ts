import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const W: TerrainType = 'water';
const X: TerrainType = 'wall';
const T: TerrainType = 'fort';
const V: TerrainType = 'village';
const H: TerrainType = 'throne';
const B: TerrainType = 'bridge';

// 16 columns x 18 rows — village (south) + fortified hill (north)
const terrain: TerrainType[][] = [
  // 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
  [M, M, M, P, P, P, P, P, P, P, P, P, P, M, M, M], // row 0  — hilltop edge
  [M, M, P, P, P, P, P, H, P, P, P, P, P, P, M, M], // row 1  — throne at (7,1) — Ezrin
  [M, P, P, P, X, P, P, P, P, P, X, P, P, P, P, M], // row 2  — hill fortifications
  [M, P, P, P, P, P, P, T, P, P, P, P, P, P, P, M], // row 3  — fort
  [P, P, P, F, F, P, P, P, P, P, F, F, P, P, P, P], // row 4  — forest flanks (left route)
  [P, P, F, F, P, P, P, P, P, P, P, P, F, F, P, P], // row 5
  [P, P, F, P, P, P, P, P, P, P, P, P, P, F, P, P], // row 6  — mid approach
  [P, P, P, P, P, P, W, W, W, W, P, P, P, P, P, P], // row 7  — water barrier (center bridge)
  [P, P, P, P, P, P, B, P, P, B, P, P, P, P, P, P], // row 8  — bridge crossing (center route)
  [P, P, P, P, P, P, W, W, W, W, P, P, P, P, P, P], // row 9  — water barrier
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 10 — open ground (right route)
  [P, P, P, P, F, P, P, P, P, P, P, F, P, P, P, P], // row 11 — approach to village
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 12 — village outskirts
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 13
  [P, P, X, V, X, P, P, P, P, P, X, V, X, P, P, P], // row 14 — village buildings
  [P, P, P, P, P, P, P, T, P, P, P, P, P, P, P, P], // row 15 — Elder Ilse's position (fort at 7,15)
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 16 — deployment row 1
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 17 — deployment row 2
];

export const CHAPTER_10: ChapterData = {
  id: 'ch10',
  name: 'Chapter 10: The Sands of Komoda',
  chapterNumber: 10,
  mapWidth: 16,
  mapHeight: 18,
  terrain,
  playerUnits: [
    { unitId: 'shigeru', position: { x: 7, y: 16 } },
    { unitId: 'lisette', position: { x: 8, y: 16 } },
    { unitId: 'gareth', position: { x: 6, y: 17 } },
    { unitId: 'mirelle', position: { x: 9, y: 17 } },
    { unitId: 'akira', position: { x: 7, y: 17 } },
    { unitId: 'corwin', position: { x: 5, y: 16 } },
    { unitId: 'bryn', position: { x: 10, y: 16 } },
    { unitId: 'viviane', position: { x: 8, y: 17 } },
  ],
  enemyUnits: [
    // Boss on throne
    { unitId: 'ch10_boss', position: { x: 7, y: 1 } },
    // Coordinated escort guards
    { unitId: 'ch10_guard_1', position: { x: 6, y: 2 } },
    { unitId: 'ch10_guard_2', position: { x: 8, y: 2 } },
    { unitId: 'ch10_guard_3', position: { x: 7, y: 3 } },
    // Hill defenders
    { unitId: 'ch10_soldier_1', position: { x: 4, y: 4 } },
    { unitId: 'ch10_soldier_2', position: { x: 11, y: 4 } },
    { unitId: 'ch10_mage_1', position: { x: 5, y: 3 } },
    { unitId: 'ch10_mage_2', position: { x: 10, y: 3 } },
    // Middle zone
    { unitId: 'ch10_soldier_3', position: { x: 6, y: 6 } },
    { unitId: 'ch10_soldier_4', position: { x: 9, y: 6 } },
    // Village raiders (approach from sides)
    { unitId: 'ch10_fighter_1', position: { x: 2, y: 12 } },
    { unitId: 'ch10_fighter_2', position: { x: 13, y: 12 } },
    // Elder Ilse — ally NPC at village center
    {
      unitId: 'elder_ilse',
      position: { x: 7, y: 15 },
      faction: 'ally',
      aiBehavior: { type: 'stationary' },
    },
  ],
  objective: {
    type: 'protect',
    protectUnitId: 'elder_ilse',
    description: 'Defeat General Ezrin while protecting Elder Ilse',
  },
  deploymentSlots: 8,
  forceDeploy: ['shigeru'],
  parTurns: 20,
  prologue: {
    lines: [
      {
        speaker: 'Narrator',
        text: {
          en: 'Komoda, where the Sasu river meets the western sea. Flat sand and farmland below, a fortified hill above. Grand Magus Ezrin holds the heights and has not once sent a man down to take the village.',
          ja: '佐須川が西の海に注ぐ小茂田。下には平らな砂浜と田畑、上には堅められた丘。大魔道士エズリンが高所を押さえながら、村を取りに一兵も下ろしていない。',
        },
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'The elder here — Ilse — keeps the village chronicle. Four hundred years of it, and every time the Blackflame stirred it went into that book.',
          ja: 'ここの長老――イルゼ婆が村の年代記を守っている。四百年分だ。黒炎が動くたび、その帳面に書き留められてきた。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'Which is why Ezrin is here. He is not garrisoning a hill, my lord. He came for the book.',
          ja: 'だからエズリンがここにいるのです。丘を守っているのではありません、殿下。帳面を取りに来たのです。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: {
          en: 'Then we split. Half to hold the village, half up the hill.',
          ja: 'では二手に。半分は村を保ち、半分は丘へ。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Corwin',
        text: {
          en: 'Three ways up — forest on the left, bridge in the centre, open ground right. He will have the centre covered and he will want us to know it.',
          ja: '上がる道は三つ。左は森、中央は橋、右は開けた地。中央は押さえてあるだろうし、それをこちらに分からせたがってる。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'Protect Ilse. Take Ezrin. We do both. Halvar held a corridor for nine turns so that we could still afford to do both.',
          ja: 'イルゼ婆を守る。エズリンを取る。両方だ。両方やる余裕がまだ我々にあるのは、ハルヴァルが通路を九つのあいだ保ったからだ。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Gareth',
        text: { en: '...Aye. Let us not waste it.', ja: '……ああ。無駄にはすまい。' },
        speakerFaction: 'player',
      },
    ],
  },
  epilogue: {
    lines: [
      {
        speaker: 'Narrator',
        text: {
          en: 'The hill is taken. The village stands. For the first time in two chapters, the party breathes without the weight of grief crushing their lungs.',
          ja: '丘は取られ、村は残った。二つの戦を経て初めて、隊は悲嘆に肺を潰されずに息をした。',
        },
      },
      {
        speaker: 'Narrator',
        text: {
          en: 'A single figure came down the hill road while they were still counting the wounded. He was not in armour. He did not draw.',
          ja: '負傷者を数えている最中、丘の道を人影がひとつ下りてきた。鎧は着ていなかった。武器も抜かなかった。',
        },
      },
      {
        speaker: 'Narrator',
        text: {
          en: 'He was enormous — a head taller than Corwin, shaven bald, the skin of both arms burned to the elbow in a pattern like bark. He stopped at a polite distance and waited to be addressed.',
          ja: '巨大な男だった。コーウィンより頭ひとつ高く、頭は剃り上げ、両腕は肘まで樹皮のような文様に焼けている。男は礼を失さぬ距離で足を止め、声をかけられるのを待った。',
        },
      },
      {
        speaker: 'Akira',
        text: { en: 'My lord. Get behind me.', ja: '殿下。私の後ろへ。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Takeshi',
        text: {
          en: 'Please do not. I have walked a long way and I would rather look at him than at your back.',
          ja: 'やめてもらおう。遠くから歩いてきた。貴殿の背中より、あの子の顔を見ていたい。',
        },
        speakerFaction: 'enemy',
      },
      {
        speaker: 'Shigeru',
        text: { en: 'You are Takeshi.', ja: 'お前がタケシか。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Takeshi',
        text: {
          en: 'I am. You have your father’s way of standing. He used to do that when he had decided something and had not said it yet.',
          ja: 'いかにも。父君と同じ立ち方をする。あの男は何かを決めて、まだ言っていないときにそうしていた。',
        },
        speakerFaction: 'enemy',
      },
      {
        speaker: 'Shigeru',
        text: { en: 'You killed him.', ja: '父上を殺した。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Takeshi',
        text: {
          en: 'I did. He would not give me the sword you are wearing. I asked him four times, which is three more than I have ever asked anyone.',
          ja: '殺した。貴殿が佩いているその剣を渡さなかったのでな。四度頼んだ。誰かに頼んだ数として、三度多い。',
        },
        speakerFaction: 'enemy',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'You broke the seal at Are. You let that thing out into your own country.',
          ja: 'あなたは阿連の封印を破った。あれを自分の国に解き放ったのです。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Takeshi',
        text: {
          en: 'I took it into myself, scholar. There is a difference, and I am the only man alive who can feel it. It has not got out. It is in here, and it is quiet, and it has been quiet for eleven months.',
          ja: '我が身に取り込んだのだ、学者殿。そこには違いがある。そしてその違いを感じ取れるのは今この世で私ひとりだ。あれは外に出ていない。ここにいて、静かにしている。十一か月のあいだずっとな。',
        },
        speakerFaction: 'enemy',
      },
      {
        speaker: 'Mirelle',
        text: {
          en: 'The grey ground behind you says otherwise.',
          ja: 'あなたの背後の灰色の地面は、そう言っていません。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Takeshi',
        text: {
          en: 'Yes. That is the cost, and I pay it, and it is smaller every year than another war would be. Three hundred and forty-seven knights burned themselves to seal this thing and it bought the world four centuries. Four. I intend to end it instead.',
          ja: 'その通り。それが代価だ。私が払っている。そしてそれは毎年、もう一度戦争をするより小さい。三百四十七の騎士が己を焼いてこれを封じ、世に四百年を買った。四百年だ。私は先延ばしではなく、終わらせるつもりでいる。',
        },
        speakerFaction: 'enemy',
      },
      {
        speaker: 'Shigeru',
        text: { en: 'By carrying it. Alone. Forever.', ja: '自分ひとりで抱えて。永久にか。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Takeshi',
        text: {
          en: 'Somebody has to hold it, boy. I have simply stopped pretending it can be put in a box and forgotten by the next generation.',
          ja: '誰かが抱えねばならん、小僧。私はただ、箱に入れて次の世代に忘れさせられるという振りをやめただけだ。',
        },
        speakerFaction: 'enemy',
      },
      {
        speaker: 'Takeshi',
        text: {
          en: 'Bring me the Flamebrand. It is the last thing in the world that still answers to the seal, and while it exists the thing inside me keeps reaching for it. Bring it to Are and I will let every one of these people walk away.',
          ja: '炎の聖剣を持ってこい。この世でまだ封印に応える最後の物だ。それがあるかぎり、我が内のものはそれへ手を伸ばし続ける。阿連へ持ってこい。そうすればここにいる者は一人残らず歩いて去らせよう。',
        },
        speakerFaction: 'enemy',
      },
      {
        speaker: 'Shigeru',
        text: { en: 'And if I do not?', ja: '断ったら。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Takeshi',
        text: {
          en: 'Then it will keep walking toward you, and it will go through whatever is in the way, and one morning you will be standing in a grey field wondering which of these faces you could have kept.',
          ja: 'ならばあれは貴殿へ向かって歩き続け、間にあるものを何であろうと通り抜ける。そしてある朝、貴殿は灰色の野に立ち、この顔ぶれのうち誰を残せたのかを考えることになる。',
        },
        speakerFaction: 'enemy',
      },
      {
        speaker: 'Narrator',
        text: {
          en: 'He turned and walked back up the hill road. Nobody raised a bow. Later, not one of them could give a reason why.',
          ja: '男は背を向け、丘の道を上って戻っていった。誰も弓を上げなかった。後になって、その理由を言える者は一人もいなかった。',
        },
      },
      {
        speaker: 'Shigeru',
        text: {
          en: '...We go west. Not because he asked. Because he is right that it is coming, and I would rather meet it at the shrine than in somebody’s field.',
          ja: '……西へ行く。あれに言われたからではない。来ているというのは正しいからだ。それなら誰かの畑ではなく、社で迎えたい。',
        },
        speakerFaction: 'player',
      },
    ],
  },
  villages: [
    {
      position: { x: 3, y: 14 },
      reward: {
        type: 'weapon',
        weaponId: 'killer_sword',
        dialogue: {
          en: "My husband forged this before the Empire took him. It was meant for a hero. You'll do.",
          ja: '帝国に連れて行かれる前に、亭主が打ったものです。英雄のために鍛えたものでした。あんたで十分だ。',
        },
        speaker: 'Blacksmith Widow',
      },
    },
    {
      position: { x: 11, y: 14 },
      reward: {
        type: 'weapon',
        weaponId: 'elfire',
        dialogue: {
          en: 'An old tome, humming with latent power. The scholar said it was too dangerous for civilians.',
          ja: '力を秘めて唸る古い魔道書。学者は民には危険すぎると言っていた。',
        },
        speaker: 'Village Librarian',
      },
    },
  ],
  events: [
    // Turn 3: Elder Ilse speaks about the scrolls
    {
      id: 'ch10_ilse_speaks',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Elder Ilse',
                text: {
                  en: 'This chronicle has four hundred years in it, and every time the Blackflame stirred, somebody here wrote it down. If Ezrin takes it, the last account of the thing burns with my roof.',
                  ja: 'この年代記には四百年が入っておる。黒炎が動くたび、この村の誰かが書き留めてきた。エズリンに持っていかれれば、あれについての最後の記録がわしの屋根と一緒に焼ける。',
                },
                speakerFaction: 'ally',
              },
              {
                speaker: 'Shigeru',
                text: { en: "We won't let that happen.", ja: 'そうはさせません。' },
                speakerFaction: 'player',
              },
              {
                speaker: 'Elder Ilse',
                text: {
                  en: 'I have outlived worse men than that general. But I cannot outwalk what is coming up out of the west, and neither can you.',
                  ja: 'あの将軍よりひどい男たちより長生きしてきた。だが西から上がってくるものからは歩いて逃げられん。おぬしらもだ。',
                },
                speakerFaction: 'ally',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 6: System Construct spawn
    {
      id: 'ch10_construct_spawn',
      trigger: { type: 'turn_start', turn: 6 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Narrator',
                text: {
                  en: 'At the foot of the hill the grass turned grey in a widening ring, and something stood up out of the middle of it — huge, armoured, and put together wrong.',
                  ja: '丘の麓で草が輪を広げるように灰色に変わり、その真ん中から何かが立ち上がった。巨大で、鎧を着て、組み立て方が間違っていた。',
                },
              },
              {
                speaker: 'Lisette',
                text: {
                  en: 'That is not a revenant. A revenant was a person once. This has been made — assembled, out of several.',
                  ja: 'あれは屍兵ではありません。屍兵はかつて一人の人でした。あれは作られている――何人かを寄せ集めて。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Corwin',
                text: {
                  en: 'It is going for the village. For the old woman.',
                  ja: '村へ向かってる。婆さんのところだ。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'Then it is not wandering — it knows what it came for. Everyone back to the elder. Now!',
                  ja: 'ならば彷徨っているのではない。何を取りに来たか分かっている。全員、長老のもとへ戻れ。今だ！',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
        {
          type: 'spawn_units',
          units: [{ unitId: 'ch10_construct', position: { x: 7, y: 10 } }],
          faction: 'enemy',
        },
      ],
      once: true,
    },
    // Boss killed: Ezrin
    {
      id: 'ch10_sozen_killed',
      trigger: { type: 'unit_killed', unitId: 'ch10_boss' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Ezrin',
                text: {
                  en: 'I felt it too. The wrongness out west. I read the same signs your scholar reads.',
                  ja: '私も感じていた。西の歪みをな。そちらの学者が読むのと同じ徴を読んでいた。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: { en: 'You could have helped us.', ja: '手を貸すこともできたはずだ。' },
                speakerFaction: 'player',
              },
              {
                speaker: 'Ezrin',
                text: {
                  en: 'Perhaps. But I serve the empire I was born in, not the truth I found too late to use.',
                  ja: 'かもしれん。だが私が仕えるのは生まれ落ちた帝国であって、使うには遅すぎた真実ではない。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Narrator',
                text: {
                  en: 'Grand Magus Ezrin falls. A Master Seal gleams among his effects.',
                  ja: '大魔道士エズリンが倒れる。遺品の中でマスタープルフが光っていた。',
                },
              },
            ],
          },
        },
        { type: 'give_item', unitId: 'shigeru', itemId: 'master_seal' },
      ],
      once: true,
    },
    // Construct destroyed
    {
      id: 'ch10_construct_killed',
      trigger: { type: 'unit_killed', unitId: 'ch10_construct' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Lisette',
                text: {
                  en: 'It is coming apart. Look — the ash is not scattering. It is running back west, along the ground, against the wind.',
                  ja: '崩れていきます。見てください――灰が散らない。地面を伝って西へ戻っていきます。風に逆らって。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: { en: 'Going home.', ja: '帰っているのか。' },
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: {
                  en: 'Being recalled. My lord, that is the first thing this campaign has shown me that I can actually follow. Whatever built that thing wants its pieces back — and it will lead us straight to the door.',
                  ja: '呼び戻されているのです。殿下、この戦の中で私が実際に追える最初のものです。あれを作った何かが部品を返せと言っている――そしてそれは我々を戸口まで導く。',
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
      unitB: 'akira',
      lines: [
        {
          speaker: 'Akira',
          text: {
            en: 'My lord. You have not said his name since the fortress.',
            ja: '殿下。砦以来、あの人の名を口にしておられません。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: {
            en: 'I said it to the company. On the wall, after.',
            ja: '隊には言った。あの後、壁の上でな。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Akira',
          text: {
            en: 'You said it to the company. That is not the same as saying it.',
            ja: '隊に向けて言われたのです。口にすることとは違います。',
          },
          speakerFaction: 'player',
        },
        { speaker: 'Shigeru', text: { en: '...', ja: '…………' }, speakerFaction: 'player' },
        {
          speaker: 'Akira',
          text: {
            en: 'I was there when you gave him leave to do it. It was the right order and it was a terrible thing to have to say, and both of those are going to be true for the rest of your life.',
            ja: 'あなたが許しを与えたとき、私はそこにいました。正しい命令であり、口にするには恐ろしい言葉だった。その両方が、生涯ずっと真実であり続けます。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: {
            en: 'Halvar. His name was Halvar. ...Thank you, Akira.',
            ja: 'ハルヴァル。あの男の名はハルヴァルだ。……礼を言う、アキラ。',
          },
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'akira', stat: 'def', amount: 1 },
    },
    {
      unitA: 'corwin',
      unitB: 'bryn',
      lines: [
        {
          speaker: 'Bryn',
          text: {
            en: 'Five engagements now. Still telling people you are only here for the coin?',
            ja: 'もう五戦目。まだ金のためだけだと言い張るの。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Corwin',
          text: {
            en: 'The pay is terrible. The hours are worse. The commander apologises to corpses.',
            ja: '実入りは最悪。拘束時間はもっと最悪。指揮官は死体に詫びる。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Bryn',
          text: { en: "And yet you're still here.", ja: 'それでもいる。' },
          speakerFaction: 'player',
        },
        {
          speaker: 'Corwin',
          text: { en: '...Shut up and cover my left side.', ja: '……黙って左を頼む。' },
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'exp_both', amount: 20 },
    },
  ],
};
