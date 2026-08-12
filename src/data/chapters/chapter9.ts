import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const T: TerrainType = 'fort';
const V: TerrainType = 'village';

// 14 columns x 14 rows — narrow forest pass, linear escape route
const terrain: TerrainType[][] = [
  // 0  1  2  3  4  5  6  7  8  9  10 11 12 13
  [M, M, F, F, P, P, F, F, P, P, F, F, M, M], // row 0  — north entry (pursuers)
  [M, F, P, F, P, P, F, F, P, P, F, P, F, M], // row 1
  [F, F, P, P, P, F, P, P, F, P, P, P, F, F], // row 2  — scattered enemies
  [F, P, P, P, P, P, P, P, P, P, P, P, P, F], // row 3  — Viviane appears here
  [M, F, P, P, T, P, P, P, P, T, P, P, F, M], // row 4  — forts for defense
  [F, F, P, F, F, P, P, P, P, F, F, P, F, F], // row 5  — forest corridor
  [F, P, P, F, P, P, P, P, P, P, F, P, P, F], // row 6
  [M, P, P, P, P, F, P, P, F, P, P, P, P, M], // row 7  — mid-map clearing
  [F, F, P, P, T, F, P, P, F, T, P, P, F, F], // row 8  — forts + forest chokepoint
  [F, P, P, F, F, P, P, P, P, F, F, P, P, F], // row 9
  [M, F, P, P, P, P, P, P, P, P, P, P, F, M], // row 10 — approach clearing
  [P, F, P, P, F, P, P, P, P, F, P, P, V, P], // row 11 — village at (12,11)
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 12 — deployment row 1
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 13 — deployment row 2
];

export const CHAPTER_9: ChapterData = {
  id: 'ch9',
  name: 'Chapter 9: The Empty Place',
  chapterNumber: 9,
  mapWidth: 14,
  mapHeight: 14,
  terrain,
  playerUnits: [
    { unitId: 'shigeru', position: { x: 6, y: 12 } },
    { unitId: 'lisette', position: { x: 7, y: 12 } },
    { unitId: 'gareth', position: { x: 5, y: 13 } },
    { unitId: 'mirelle', position: { x: 8, y: 13 } },
    { unitId: 'akira', position: { x: 6, y: 13 } },
    { unitId: 'bryn', position: { x: 7, y: 13 } },
    { unitId: 'corwin', position: { x: 5, y: 12 } },
  ],
  enemyUnits: [
    { unitId: 'ch9_raider_captain', position: { x: 7, y: 0 } },
    { unitId: 'ch9_soldier_1', position: { x: 4, y: 2 } },
    { unitId: 'ch9_soldier_2', position: { x: 10, y: 2 } },
    { unitId: 'ch9_soldier_3', position: { x: 7, y: 5 } },
    { unitId: 'ch9_fighter_1', position: { x: 3, y: 6 } },
    { unitId: 'ch9_fighter_2', position: { x: 11, y: 6 } },
    { unitId: 'ch9_fighter_3', position: { x: 7, y: 8 } },
    { unitId: 'ch9_archer_1', position: { x: 5, y: 4 } },
    { unitId: 'ch9_archer_2', position: { x: 9, y: 4 } },
  ],
  objective: {
    type: 'rout',
    description: 'Defeat all enemies',
  },
  deploymentSlots: 7,
  forceDeploy: ['shigeru'],
  parTurns: 18,
  prologue: {
    lines: [
      {
        speaker: 'Narrator',
        text: {
          en: 'A pass through the old forest under Shiratake, where the trees have never been cut. The company moves in silence. Nobody has taken the empty place in the marching order.',
          ja: '白嶽の麓、斧の入ったことのない古い森を抜ける峠道。隊は黙って進んでいた。行軍の列に空いた場所を、誰も埋めなかった。',
        },
      },
      { speaker: 'Gareth', text: { en: '...', ja: '…………' }, speakerFaction: 'player' },
      {
        speaker: 'Lisette',
        text: {
          en: 'I have the route. One pass, forest on both sides, three places worth standing on. A day, if nothing goes wrong.',
          ja: '経路は取ってあります。峠一つ、両側は森、立つ値打ちのある地点が三つ。何事もなければ一日です。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'Everyone stays close. No heroics. We move as a group.',
          ja: '全員固まれ。手柄は要らない。まとまって動く。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: {
          en: 'He would have taken the rearguard. He always took the rearguard, and he never once made a thing of it.',
          ja: 'あの人なら殿を務めたでしょう。いつも殿でした。そして一度もそれを誇りませんでした。',
        },
        speakerFaction: 'player',
      },
      { speaker: 'Mirelle', text: { en: '...I know.', ja: '……ええ。' }, speakerFaction: 'player' },
      {
        speaker: 'Corwin',
        text: {
          en: 'Raiders ahead. Scouts, by the look of them. Too ragged to be Kurogane regulars.',
          ja: '前方に略奪者。見たところ斥候だ。黒鉄の正規兵にしては身なりが粗い。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: { en: 'Then we clear the path. Together.', ja: 'なら道を開ける。まとまってだ。' },
        speakerFaction: 'player',
      },
    ],
  },
  epilogue: {
    lines: [
      {
        speaker: 'Narrator',
        text: {
          en: 'The old forest thins. The company comes out onto open ground above the bay, bruised and intact.',
          ja: '古い森が薄くなる。隊は湾を見下ろす開けた地に出た。傷だらけで、しかし欠けてはいなかった。',
        },
      },
      {
        speaker: 'Viviane',
        text: {
          en: 'That was... not what I expected when I signed on with a travelling company.',
          ja: '今のは……旅の一座に加わるつもりで来た身には、少々予想外でしたわ。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Gareth',
        text: { en: 'We are not a travelling company.', ja: '俺たちゃ一座じゃねえ。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Viviane',
        text: {
          en: 'No. You are not. You are something that lost its heart and kept walking anyway.',
          ja: 'ええ。違いますね。あなた方は、心臓をなくしてなお歩き続けている何かです。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Narrator',
        text: {
          en: "For a moment, the performer's mask slips. Viviane's eyes hold something older than comedy.",
          ja: '束の間、役者の仮面がずれた。ヴィヴィアンの目には、笑いよりずっと古いものが宿っていた。',
        },
      },
      {
        speaker: 'Viviane',
        text: {
          en: '...I have seen that look before, on better people than me. It does not go away. It does get quieter.',
          ja: '……その顔は前にも見ました。私よりずっと立派な人たちの上で。消えはしません。ただ、静かにはなります。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: { en: 'Thank you, Viviane.', ja: '礼を言う、ヴィヴィアン。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Gareth',
        text: { en: '...You will do, performer.', ja: '……お前でいい、役者。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: {
          en: 'Stay with us. We could use someone who still knows how to smile.',
          ja: '一緒にいてください。まだ笑い方を覚えている人が必要です。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'Everyone is still carrying it. We will not be ourselves again for another engagement at least, and that is not a thing I can fix with a chart.',
          ja: '皆まだ抱えたままです。少なくとももう一戦のあいだ、我々は本調子には戻りません。それは私が図表で直せるものではありません。',
        },
        speakerFaction: 'player',
      },
    ],
  },
  villages: [
    {
      position: { x: 12, y: 11 },
      reward: {
        type: 'weapon',
        weaponId: 'steel_sword',
        dialogue: {
          en: "A woodsman's blade, kept sharp for wolves. Take it — you need it more than us.",
          ja: '狼のために研いでおいた木こりの刃です。持っていってください。私たちより要り用でしょう。',
        },
        speaker: 'Villager',
      },
    },
  ],
  events: [
    // Turn 1: Akira absence felt
    {
      id: 'ch9_halvar_absence',
      trigger: { type: 'turn_start', turn: 1 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Bryn',
                text: {
                  en: 'The left flank is open. Halvar would have planted himself in it and dared them.',
                  ja: '左翼が空いている。ハルヴァルならそこに腰を据えて、来いと言った。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Corwin',
                text: {
                  en: 'I will take it. I am not as stubborn as he was, but I will hold.',
                  ja: '俺が入る。あいつほど頑固じゃないが、保つよ。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 3: Viviane appears and joins
    {
      id: 'ch9_viviane_joins',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Narrator',
                text: {
                  en: 'A figure steps out of the treeline, arms spread wide as if expecting applause.',
                  ja: '木立から人影が現れた。喝采を待つかのように両腕を大きく広げて。',
                },
              },
              {
                speaker: 'Viviane',
                text: {
                  en: 'There you are! I have been sitting in that treeline for two days waiting for somebody interesting to walk past!',
                  ja: 'いましたわね！面白い方が通りかかるのを、あの木立で二日も待っていたんですよ！',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Gareth',
                text: { en: '...Who is this?', ja: '……何だこいつは。' },
                speakerFaction: 'player',
              },
              {
                speaker: 'Viviane',
                text: {
                  en: 'Viviane. Dancer. And you lot look like a funeral that has not finished walking to the grave.',
                  ja: 'ヴィヴィアン。踊り子です。そしてあなた方は、まだ墓まで歩き終えていない葬列のお顔をしていますわ。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: { en: 'We really do not.', ja: 'そんな顔はしていない。' },
                speakerFaction: 'player',
              },
              {
                speaker: 'Viviane',
                text: {
                  en: 'That is exactly what a funeral would say. I am coming with you. Do not bother arguing, I have already put my things down.',
                  ja: '葬列はまさにそう言うのです。ご一緒します。反論は無駄ですよ、もう荷物を下ろしましたから。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: {
                  en: 'A dancer. A dancer can rouse a spent soldier to move again — which, given the state of this company, is worth more than another sword.',
                  ja: '踊り子。踊り子は力尽きた兵をもう一度動かせます。この隊の有様を考えれば、剣がもう一本増えるより値打ちがあります。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
        {
          type: 'spawn_units',
          units: [{ unitId: 'viviane', position: { x: 7, y: 3 } }],
          faction: 'player',
        },
      ],
      once: true,
    },
    // Turn 4: Dance tutorial
    {
      id: 'ch9_dance_tutorial',
      trigger: { type: 'turn_start', turn: 4 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Lisette',
                text: {
                  en: 'Viviane — stand beside someone who has already spent themselves. Your dance will put them back on their feet for another go.',
                  ja: 'ヴィヴィアン――すでに動き終えた者の隣に立ってください。あなたの舞がもう一度その人を立たせます。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Viviane',
                text: {
                  en: 'An encore, then. Point me at whoever is finished and I will get them back on their feet.',
                  ja: 'ではアンコールですね。終わった方を指してくだされば、立たせてご覧に入れます。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Narrator',
                text: {
                  en: 'Tip: select Viviane, move beside a spent ally, then choose Dance. That ally gets a full turn back.',
                  ja: '操作：ヴィヴィアンを選び、行動済みの味方の隣へ移動して「おどる」を選ぶ。その味方は行動を取り戻す。',
                },
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 5: Grief callback
    {
      id: 'ch9_grief_dialogue',
      trigger: { type: 'turn_start', turn: 5 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Akira',
                text: {
                  en: 'I keep checking the rear. Every turn. I know what is there and I keep checking it.',
                  ja: 'つい後方を確かめてしまいます。毎回。何があるか分かっているのに、確かめてしまう。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Mirelle',
                text: { en: 'So do I.', ja: '私もです。' },
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
      unitB: 'viviane',
      lines: [
        {
          speaker: 'Viviane',
          text: {
            en: 'You hold yourself like a man in the third act. Is this the part where you tell me the terrible secret?',
            ja: 'あなた、第三幕の主役みたいな立ち方をなさいますね。ここが恐ろしい秘密を打ち明ける場面ですか？',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: { en: 'There is no secret, Viviane.', ja: '秘密などない、ヴィヴィアン。' },
          speakerFaction: 'player',
        },
        {
          speaker: 'Viviane',
          text: {
            en: 'Darling, there is ALWAYS a secret. The only question is who is carrying it.',
            ja: 'あらあら、秘密はいつだってあるのです。問題は誰が抱えているかだけ。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: { en: '...You are closer than I would like.', ja: '……近すぎて困る。' },
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'exp_both', amount: 20 },
    },
    {
      unitA: 'gareth',
      unitB: 'corwin',
      lines: [
        {
          speaker: 'Gareth',
          text: {
            en: 'You fight tidy. Too tidy. Where does a sellsword learn that?',
            ja: '戦い方が綺麗だ。綺麗すぎる。傭兵がどこでそれを覚える。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Corwin',
          text: {
            en: 'Twenty years of it. Most of them for people I did not like.',
            ja: '二十年やってきた。大半は好きでもない相手のためにな。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Gareth',
          text: {
            en: 'Twenty years for people you did not like?',
            ja: '好きでもない相手のために二十年か？',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Corwin',
          text: {
            en: 'Aye. The pay was better than the company.',
            ja: 'ああ。連れ合いより実入りのほうがましだった。',
          },
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'gareth', stat: 'str', amount: 1 },
    },
  ],
};
