import type { Script } from './dialogue';
import { L } from './chapters/common';

/**
 * 支援会話。**キーは "idA|idB" で ID の辞書順**、配列は C / B / A。
 *
 * 各章の md の「## Supports」に一行ずつ書いてある筋を、そのまま起こしている。
 * 章に紐付いてはいない —— FE の支援は好きなときに上がるもので、章の台本とは
 * 別の時計で動く。だから `story/chapters/` ではなくここに置く。
 *
 * 組み合わせは `SUPPORT_PAIRS` として roster.ts が読み、支援の枠を作る。
 * **ここに無い二人は、隣に立っても友好度が溜まらない。**
 */
const T: Record<string, Script[]> = {
  // ── 第1章
  'p_akira|p_shigeru': [
    {
      id: 'sup_shigeru_akira_C',
      lines: [
        L('ジェイガン', 'p_akira', 'right', '殿下。イルザを出てから、何も召し上がっていません。'),
        L('シゲル', 'p_shigeru', 'left', '腹は減っていない。'),
        L('ジェイガン', 'p_akira', 'right', '伺ったのは、減っているかどうかではありません。召し上がったかどうかです。'),
        L('シゲル', 'p_shigeru', 'left', '……食べていない。'),
      ],
    },
    {
      id: 'sup_shigeru_akira_B',
      lines: [
        L('ジェイガン', 'p_akira', 'right', '殿下、剣に無理があります。手首ではなく、腰で振ってください。'),
        L('シゲル', 'p_shigeru', 'left', '……父上と、同じことを言うのだな。'),
        L('ジェイガン', 'p_akira', 'right', '王も剣をお使いでした。……差し出がましいことを。'),
        L('シゲル', 'p_shigeru', 'left', 'いや。もっと言え。'),
      ],
    },
    {
      id: 'sup_shigeru_akira_A',
      lines: [
        L('シゲル', 'p_shigeru', 'left', 'ジェイガン。人を数として動かすのが、日ごとに楽になっている。'),
        L('ジェイガン', 'p_akira', 'right', '……存じております。'),
        L('シゲル', 'p_shigeru', 'left', 'それが怖い。'),
        L(
          'ジェイガン',
          'p_akira',
          'right',
          '怖いとお思いのうちは、まだ数ではありません。私が申し上げます。楽になりすぎたら、申し上げます。',
        ),
      ],
    },
  ],

  'p_lisette|p_mirelle': [
    {
      id: 'sup_lisette_mirelle_C',
      lines: [
        L('リゼット', 'p_lisette', 'left', 'ミレイユ。その杖、光が弱い。魔力が落ちてる。'),
        L('ミレイユ', 'p_mirelle', 'right', 'わ、分かるんですか……？'),
        L('リゼット', 'p_lisette', 'left', '魔道士だからね。無理をしすぎだ。回復は、まず自分から。'),
        L('ミレイユ', 'p_mirelle', 'right', '……はい。気をつけます。'),
      ],
    },
    {
      id: 'sup_lisette_mirelle_B',
      lines: [
        L('ミレイユ', 'p_mirelle', 'right', 'リゼットさんは、神様を信じていないのですね。'),
        L('リゼット', 'p_lisette', 'left', '測れないものは扱えない。それだけだ。否定はしていない。'),
        L('ミレイユ', 'p_mirelle', 'right', '……はい。否定ではないと、分かります。'),
        L('リゼット', 'p_lisette', 'left', '「測れない」と言っただけだよ。'),
      ],
    },
    {
      id: 'sup_lisette_mirelle_A',
      lines: [
        L('ミレイユ', 'p_mirelle', 'right', 'リゼットさん。西の空が、変です。'),
        L('リゼット', 'p_lisette', 'left', '……気づいたか。方角がいつも同じだ。西北西。風でも雲でもない。'),
        L('ミレイユ', 'p_mirelle', 'right', '社では、あちらを見てはならないと教わりました。'),
        L('リゼット', 'p_lisette', 'left', '見ないことにした、の間違いだろうね。'),
      ],
    },
  ],

  // ── 第2章と第7章（同じ二人。C が第2章、A が第7章の筋）
  'p_lisette|p_shigeru': [
    {
      id: 'sup_shigeru_lisette_C',
      lines: [
        L('リゼット', 'p_lisette', 'right', '殿下。ひとつ、お願いがあります。'),
        L('リゼット', 'p_lisette', 'right', '決めたあとで数字を訊くのを、やめていただきたい。'),
        L('シゲル', 'p_shigeru', 'left', '……決めたあとでは遅い、と。'),
        L('リゼット', 'p_lisette', 'right', 'はい。決める前に訊いてください。そのほうが、私も後で黙っていられます。'),
      ],
    },
    {
      id: 'sup_shigeru_lisette_B',
      lines: [
        L('シゲル', 'p_shigeru', 'left', 'リゼット。人を慰めるのは、得意なほうか。'),
        L('リゼット', 'p_lisette', 'right', '下手です。自覚しています。'),
        L('リゼット', 'p_lisette', 'right', '間違ったことを言うくらいなら黙っているほうを選びます。それが冷たく見えるのも、知っています。'),
        L('シゲル', 'p_shigeru', 'left', '……黙っていられるほうが、ありがたいときもある。'),
      ],
    },
    {
      id: 'sup_shigeru_lisette_A',
      lines: [
        L('リゼット', 'p_lisette', 'right', '書庫の梯子を覚えておいでですか。殿下が七つのとき。'),
        L('シゲル', 'p_shigeru', 'left', '……落ちた。押さえていたのはお前だな。'),
        L('リゼット', 'p_lisette', 'right', '下手に押さえました。いまでも思い出します。'),
        L('シゲル', 'p_shigeru', 'left', '父上は言っていた。あの部屋で唯一おもしろい問いを持っているのはあの娘だ、と。'),
        L('リゼット', 'p_lisette', 'right', '……では、もう一つ見つけます。それが仕事なので。'),
      ],
    },
  ],

  'p_akira|p_mirelle': [
    {
      id: 'sup_akira_mirelle_C',
      lines: [
        L('ミレイユ', 'p_mirelle', 'right', 'ジェイガンさん。今夜の見張り、私が代わります。'),
        L('ジェイガン', 'p_akira', 'left', 'いえ、これは私の——'),
        L('ミレイユ', 'p_mirelle', 'right', '三晩続けておいでです。数えていました。'),
        L('ジェイガン', 'p_akira', 'left', '……数えておられたのですか。'),
        L('ミレイユ', 'p_mirelle', 'right', 'それが私の仕事です。座ってください。'),
      ],
    },
    {
      id: 'sup_akira_mirelle_B',
      lines: [
        L('ミレイユ', 'p_mirelle', 'right', 'なぜ、ご自分だけ後回しにされるんですか。'),
        L('ジェイガン', 'p_akira', 'left', '……順番があります。殿下、隊、それから私です。'),
        L('ミレイユ', 'p_mirelle', 'right', 'その順番を作ったのは、どなたですか。'),
        L('ジェイガン', 'p_akira', 'left', '……。'),
      ],
    },
    {
      id: 'sup_akira_mirelle_A',
      lines: [
        L('ジェイガン', 'p_akira', 'left', '巫女殿。もし私が倒れたら、殿下のそばに誰か立ててください。'),
        L('ミレイユ', 'p_mirelle', 'right', 'ご自分で立っていてください。'),
        L('ジェイガン', 'p_akira', 'left', '……それは、答えになっていません。'),
        L('ミレイユ', 'p_mirelle', 'right', 'なっています。私はそちらを選びます。'),
      ],
    },
  ],

  // ── 第3章
  'p_mirelle|p_shigeru': [
    {
      id: 'sup_shigeru_mirelle_C',
      lines: [
        L('ミレイユ', 'p_mirelle', 'right', '殿下。今夜は止まりましょう。'),
        L('シゲル', 'p_shigeru', 'left', '一日でも早いほうがいい。'),
        L('ミレイユ', 'p_mirelle', 'right', '休まない人は、折れます。曲がらずに、いきなり折れます。'),
        L('ミレイユ', 'p_mirelle', 'right', '……それと、火を焚く穴はもう掘ってあります。ガレスさんに掘ってもらいました。'),
        L('シゲル', 'p_shigeru', 'left', '……先に手を打ってあるのか。'),
      ],
    },
    {
      id: 'sup_shigeru_mirelle_B',
      lines: [
        L('シゲル', 'p_shigeru', 'left', 'ミレイユ。社は、俺を担ぎ手として見に来たのか。'),
        L('ミレイユ', 'p_mirelle', 'right', '大巫女様は「担い手を捜せ」と仰いました。'),
        L('ミレイユ', 'p_mirelle', 'right', '私が見つけたのは、腕に四寸の傷を隠していた人です。'),
        L('シゲル', 'p_shigeru', 'left', '……同じ人間だ。'),
        L('ミレイユ', 'p_mirelle', 'right', 'はい。ですから、両方を診ます。'),
      ],
    },
    {
      id: 'sup_shigeru_mirelle_A',
      lines: [
        L('シゲル', 'p_shigeru', 'left', '剣を返すとき、俺には何が残る。'),
        L('ミレイユ', 'p_mirelle', 'right', '……その問いを、いま口に出せたことが残ります。'),
        L('ミレイユ', 'p_mirelle', 'right', '最後まで訊けないままの方を、私は何人も見送りました。'),
      ],
    },
  ],

  'p_gareth|p_halvar': [
    {
      id: 'sup_gareth_halvar_C',
      lines: [
        L('ガレス', 'p_gareth', 'left', 'なあおっさん。向こう側が恋しくなるか。'),
        L('ハルヴァル', 'p_halvar', 'right', 'パンだな。'),
        L('ガレス', 'p_gareth', 'left', 'パン。'),
        L('ハルヴァル', 'p_halvar', 'right', 'クロガネのパンは硬い。だが朝は必ず出る。十一年、一度も欠けなかった。'),
      ],
    },
    {
      id: 'sup_gareth_halvar_B',
      lines: [
        L('ガレス', 'p_gareth', 'left', '人は。仲間は恋しくないのか。'),
        L('ハルヴァル', 'p_halvar', 'right', '……そこは、自分に許していない。'),
        L('ガレス', 'p_gareth', 'left', 'なんでだ。'),
        L('ハルヴァル', 'p_halvar', 'right', 'これから殺すからだ。'),
      ],
    },
    {
      id: 'sup_gareth_halvar_A',
      lines: [
        L('ガレス', 'p_gareth', 'left', 'おっさん。斧の振り方、教えてやろうか。'),
        L('ハルヴァル', 'p_halvar', 'right', '槍がある。'),
        L('ガレス', 'p_gareth', 'left', '折れたときの話だ。'),
        L('ハルヴァル', 'p_halvar', 'right', '……折れたときは、折れた槍で殴る。十一年、そう教わった。'),
        L('ガレス', 'p_gareth', 'left', '……いい壁にいたんだな、あんた。'),
      ],
    },
  ],

  // ── 第4章
  'p_fenn|p_gareth': [
    {
      id: 'sup_fenn_gareth_C',
      lines: [
        L('ガレス', 'p_gareth', 'left', 'なあ、いちばんの盗みは何だ。'),
        L('フェン', 'p_fenn', 'right', '港長の鍵束。'),
        L('ガレス', 'p_gareth', 'left', '鍵？　金でも宝でもなく。'),
        L('フェン', 'p_fenn', 'right', 'あれで倉が開いた。あの冬、四十世帯が食えた。'),
      ],
    },
    {
      id: 'sup_fenn_gareth_B',
      lines: [
        L('フェン', 'p_fenn', 'right', 'で、そっちの斧は何世帯食わせた？'),
        L('ガレス', 'p_gareth', 'left', '……。'),
        L('フェン', 'p_fenn', 'right', 'あ、悪い。詰めるつもりじゃ'),
        L('ガレス', 'p_gareth', 'left', 'いや。数えたことがなかった。数えてみる。'),
      ],
    },
    {
      id: 'sup_fenn_gareth_A',
      lines: [
        L('ガレス', 'p_gareth', 'left', '数えた。'),
        L('フェン', 'p_fenn', 'right', 'えっ、本当に数えたの。'),
        L('ガレス', 'p_gareth', 'left', 'クレハで川際に追い詰められてたのが十一。スザの倉が三つ。……足りるか。'),
        L('フェン', 'p_fenn', 'right', '……うん。足りる。'),
      ],
    },
  ],

  'p_bryn|p_halvar': [
    {
      id: 'sup_bryn_halvar_C',
      lines: [
        L('ハルヴァル', 'p_halvar', 'left', '……。'),
        L('ブリン', 'p_bryn', 'right', '……。'),
        L('ハルヴァル', 'p_halvar', 'left', '……楽だな。'),
        L('ブリン', 'p_bryn', 'right', 'うん。'),
      ],
    },
    {
      id: 'sup_bryn_halvar_B',
      lines: [
        L('ブリン', 'p_bryn', 'right', '壁。十一年。'),
        L('ハルヴァル', 'p_halvar', 'left', 'ああ。'),
        L('ブリン', 'p_bryn', 'right', '誰か、喋った？'),
        L('ハルヴァル', 'p_halvar', 'left', 'ほとんど。……いや、誰も。'),
        L('ブリン', 'p_bryn', 'right', 'そう。'),
      ],
    },
    {
      id: 'sup_bryn_halvar_A',
      lines: [
        L('ハルヴァル', 'p_halvar', 'left', '……悪い過ごし方では、なかった。'),
        L('ブリン', 'p_bryn', 'right', '知ってる。'),
        L('ハルヴァル', 'p_halvar', 'left', 'そうか。'),
      ],
    },
  ],

  // ── 第5章
  'p_elin|p_shigeru': [
    {
      id: 'sup_shigeru_elin_C',
      lines: [
        L('エリン', 'p_elin', 'right', '殿下、空から見えました。東の砦、伏兵がいます。'),
        L('シゲル', 'p_shigeru', 'left', '助かる。……ペガサスは、怖くないのか。'),
        L('エリン', 'p_elin', 'right', '地上より安全です。矢さえ、なければ。'),
        L('シゲル', 'p_shigeru', 'left', '弓には気をつけろ。頼む。'),
      ],
    },
    {
      id: 'sup_shigeru_elin_B',
      lines: [
        L('エリン', 'p_elin', 'right', '殿下。風が冷たくなってきました。今年は冬が早い。'),
        L('シゲル', 'p_shigeru', 'left', '……村は、越せるか。'),
        L('エリン', 'p_elin', 'right', '越させます。そのために、私たちが飛んでいるので。'),
      ],
    },
    {
      id: 'sup_shigeru_elin_A',
      lines: [
        L('シゲル', 'p_shigeru', 'left', 'エリン。上からは、人はどう見える。'),
        L('エリン', 'p_elin', 'right', '……形にしか見えません。動かなくなっても、形のままです。'),
        L('シゲル', 'p_shigeru', 'left', 'それを恐ろしいと思うか。'),
        L('エリン', 'p_elin', 'right', '思います。だから毎回、降りて顔を見に行きます。'),
        L('シゲル', 'p_shigeru', 'left', '……楽になってきたら、俺に言え。俺もお前に言う。'),
      ],
    },
  ],

  'p_akira|p_gareth': [
    {
      id: 'sup_akira_gareth_C',
      lines: [
        L('ジェイガン', 'p_akira', 'left', 'ガレス。足が近い。'),
        L('ガレス', 'p_gareth', 'right', 'は？'),
        L('ジェイガン', 'p_akira', 'left', '足の幅だ。もう半歩広く取れ。振り負けなくなる。'),
        L('ガレス', 'p_gareth', 'right', '……ほんとだ。なんだこれ。'),
      ],
    },
    {
      id: 'sup_akira_gareth_B',
      lines: [
        L('ガレス', 'p_gareth', 'right', 'なあ騎士様。俺、木こりだぜ。'),
        L('ジェイガン', 'p_akira', 'left', '存じております。'),
        L('ガレス', 'p_gareth', 'right', 'それでも教えるのか。'),
        L('ジェイガン', 'p_akira', 'left', '木も人も、倒れ方は同じです。倒す側の立ち方も。'),
      ],
    },
    {
      id: 'sup_akira_gareth_A',
      lines: [
        L('ジェイガン', 'p_akira', 'left', 'ガレス。もう教えることがありません。'),
        L('ガレス', 'p_gareth', 'right', 'おいおい、まだ半月だぞ。'),
        L('ジェイガン', 'p_akira', 'left', '半月で足りたのです。それはあなたの手柄だ。'),
        L('ガレス', 'p_gareth', 'right', '……こそばゆいこと言うなよ、爺さん。'),
      ],
    },
  ],

  // ── 第6章
  'p_corwin|p_shigeru': [
    {
      id: 'sup_shigeru_corwin_C',
      lines: [
        L('シゲル', 'p_shigeru', 'left', 'コルウィン。何人の隊長に仕えた。'),
        L('コルウィン', 'p_corwin', 'right', '十一人。'),
        L('シゲル', 'p_shigeru', 'left', 'まともだったのは。'),
        L('コルウィン', 'p_corwin', 'right', '三人ってところだな。まあ、悪くない打率だ。'),
      ],
    },
    {
      id: 'sup_shigeru_corwin_B',
      lines: [
        L('コルウィン', 'p_corwin', 'right', 'まともなのは、みんな同じところで変わる。'),
        L('シゲル', 'p_shigeru', 'left', '……というと。'),
        L('コルウィン', 'p_corwin', 'right', '一年くらいは死んだ奴を名前で数えてる。そのあと、数えなくなる。'),
        L('コルウィン', 'p_corwin', 'right', '例外は見たことがない。'),
      ],
    },
    {
      id: 'sup_shigeru_corwin_A',
      lines: [
        L('シゲル', 'p_shigeru', 'left', 'コルウィン。命令だ。'),
        L('コルウィン', 'p_corwin', 'right', 'おう。'),
        L('シゲル', 'p_shigeru', 'left', '俺が数えなくなったら、その場で言え。'),
        L('コルウィン', 'p_corwin', 'right', '……そりゃ、聞きたくない命令だな。'),
        L('コルウィン', 'p_corwin', 'right', '……受ける。'),
      ],
    },
  ],

  'p_mirelle|p_nadine': [
    {
      id: 'sup_mirelle_nadine_C',
      lines: [
        L('ナディーヌ', 'p_nadine', 'right', 'ミレイユさん。お祈りは、傷に効きますか。'),
        L('ミレイユ', 'p_mirelle', 'left', '……効きません。'),
        L('ナディーヌ', 'p_nadine', 'right', '正直ですね。'),
        L('ミレイユ', 'p_mirelle', 'left', '嘘をつくと、次に本当のことを言ったとき信じてもらえませんから。'),
      ],
    },
    {
      id: 'sup_mirelle_nadine_B',
      lines: [
        L('ミレイユ', 'p_mirelle', 'left', 'ナディーヌさんは、敵も診ますね。'),
        L('ナディーヌ', 'p_nadine', 'right', 'はい。'),
        L('ミレイユ', 'p_mirelle', 'left', '……止めろと言われたら。'),
        L('ナディーヌ', 'p_nadine', 'right', '止めません。言われたことは、あります。'),
      ],
    },
    {
      id: 'sup_mirelle_nadine_A',
      lines: [
        L('ナディーヌ', 'p_nadine', 'right', '棲み分けましょうか。'),
        L('ミレイユ', 'p_mirelle', 'left', 'と、いいますと。'),
        L('ナディーヌ', 'p_nadine', 'right', 'あなたが魂を、私が体を。'),
        L('ミレイユ', 'p_mirelle', 'left', '……はい。それでいきましょう。'),
      ],
    },
  ],

  // ── 第7章
  'p_fenn|p_lisette': [
    {
      id: 'sup_fenn_lisette_C',
      lines: [
        L('フェン', 'p_fenn', 'left', '嘘をつく家ってのがある。'),
        L('リゼット', 'p_lisette', 'right', '家は嘘をつきません。'),
        L('フェン', 'p_fenn', 'left', 'つくって。金庫は寝室にありますよって顔した部屋があって、本物は台所の床下だ。'),
      ],
    },
    {
      id: 'sup_fenn_lisette_B',
      lines: [
        L('リゼット', 'p_lisette', 'right', 'では、どうやって見分けるのですか。'),
        L('フェン', 'p_fenn', 'left', '扉の向こうに何があるかを訊くのをやめる。'),
        L('フェン', 'p_fenn', 'left', '主人が絶対に開けない扉を見る。'),
        L('リゼット', 'p_lisette', 'right', '……。'),
      ],
    },
    {
      id: 'sup_fenn_lisette_A',
      lines: [
        L('フェン', 'p_fenn', 'left', 'ものは、守ってるもので正体がばれるんだよ。'),
        L('リゼット', 'p_lisette', 'right', '……その考え方が有益なのが、非常に不愉快です。'),
        L('フェン', 'p_fenn', 'left', 'それ褒めてる？'),
        L('リゼット', 'p_lisette', 'right', '褒めています。石筆を貸してください。'),
      ],
    },
  ],

  // ── 第8章
  'p_halvar|p_shigeru': [
    {
      id: 'sup_shigeru_halvar_C',
      lines: [
        L('ハルヴァル', 'p_halvar', 'right', '殿下。ひとつ、お願いが。'),
        L('シゲル', 'p_shigeru', 'left', '言え。'),
        L('ハルヴァル', 'p_halvar', 'right', '私を取りに戻らないでください。'),
        L('シゲル', 'p_shigeru', 'left', '……断る。'),
        L('ハルヴァル', 'p_halvar', 'right', 'それでは困ります。'),
      ],
    },
    {
      id: 'sup_shigeru_halvar_B',
      lines: [
        L('シゲル', 'p_shigeru', 'left', 'なぜ困る。'),
        L(
          'ハルヴァル',
          'p_halvar',
          'right',
          '戻る算段があると、こちらが持ちません。手が届かないと分かっている場所でこそ、人は長く立てます。',
        ),
        L('シゲル', 'p_shigeru', 'left', '……ひどい理屈だ。'),
        L('ハルヴァル', 'p_halvar', 'right', '兵の理屈です。'),
      ],
    },
    {
      id: 'sup_shigeru_halvar_A',
      lines: [
        L('シゲル', 'p_shigeru', 'left', 'では、代わりに何を望む。'),
        L('ハルヴァル', 'p_halvar', 'right', '無駄にしないでいただきたい。'),
        L('ハルヴァル', 'p_halvar', 'right', '歌が何と言おうと、兵が本当に頼むのはそれだけです。'),
      ],
    },
  ],

  'p_halvar|p_mirelle': [
    {
      id: 'sup_halvar_mirelle_C',
      lines: [
        L('ミレイユ', 'p_mirelle', 'right', 'ハルヴァルさん。眠れていますか。'),
        L('ハルヴァル', 'p_halvar', 'left', '十一年、眠りは浅いままです。'),
        L('ミレイユ', 'p_mirelle', 'right', '何が怖かったんですか。'),
        L('ハルヴァル', 'p_halvar', 'left', '……叱られること。持ち場を離れること。書き付けを間違えること。'),
      ],
    },
    {
      id: 'sup_halvar_mirelle_B',
      lines: [
        L('ミレイユ', 'p_mirelle', 'right', 'それは、怖がるようなことでしょうか。'),
        L('ハルヴァル', 'p_halvar', 'left', '……いま思えば、ずいぶん小さいものを怖がっていました。'),
        L('ハルヴァル', 'p_halvar', 'left', '十一年ぶん、間違ったものを怖がっていた。'),
      ],
    },
    {
      id: 'sup_halvar_mirelle_A',
      lines: [
        L('ハルヴァル', 'p_halvar', 'left', '巫女殿。いまは、ちゃんと怖い。'),
        L('ミレイユ', 'p_mirelle', 'right', '……はい。'),
        L('ハルヴァル', 'p_halvar', 'left', '怖がるだけの値打ちがあるものが、やっと来た。'),
        L('ハルヴァル', 'p_halvar', 'left', '妙なものです。……楽になりました。'),
      ],
    },
  ],

  // ── 第9章
  'p_shigeru|p_viviane': [
    {
      id: 'sup_shigeru_viviane_C',
      lines: [
        L('ヴィヴィアン', 'p_viviane', 'right', 'あなた、三幕目の顔をしてるわ。'),
        L('シゲル', 'p_shigeru', 'left', '……何の話だ。'),
        L('ヴィヴィアン', 'p_viviane', 'right', 'お芝居よ。三幕目の主役は、たいてい恐ろしい秘密を抱えてるの。'),
      ],
    },
    {
      id: 'sup_shigeru_viviane_B',
      lines: [
        L('ヴィヴィアン', 'p_viviane', 'right', 'で、何を隠してるの。'),
        L('シゲル', 'p_shigeru', 'left', '無い。'),
        L('ヴィヴィアン', 'p_viviane', 'right', 'ふぅん。'),
        L('シゲル', 'p_shigeru', 'left', '……信じていないな。'),
        L('ヴィヴィアン', 'p_viviane', 'right', 'ぜんぜん。'),
      ],
    },
    {
      id: 'sup_shigeru_viviane_A',
      lines: [
        L('ヴィヴィアン', 'p_viviane', 'right', 'まだ言わないのね。'),
        L('シゲル', 'p_shigeru', 'left', '言うことが無い。'),
        L('ヴィヴィアン', 'p_viviane', 'right', 'いいわ。三幕目は長いもの。'),
        L('ヴィヴィアン', 'p_viviane', 'right', '……そのときが来たら、客席にはいてあげる。'),
      ],
    },
  ],

  'p_corwin|p_gareth': [
    {
      id: 'sup_corwin_gareth_C',
      lines: [
        L('ガレス', 'p_gareth', 'left', 'なあ、どこで習ったんだ、その剣。'),
        L('コルウィン', 'p_corwin', 'right', 'どこって。'),
        L('ガレス', 'p_gareth', 'left', '無駄がなさすぎる。傭兵ってのはもっと荒っぽいもんだと思ってた。'),
        L('コルウィン', 'p_corwin', 'right', '荒っぽいのは早死にする。'),
      ],
    },
    {
      id: 'sup_corwin_gareth_B',
      lines: [
        L('ガレス', 'p_gareth', 'left', '何年やってる。'),
        L('コルウィン', 'p_corwin', 'right', '二十年。'),
        L('ガレス', 'p_gareth', 'left', '二十年。……好きな相手のために？'),
        L('コルウィン', 'p_corwin', 'right', 'ほとんど、好きじゃない相手のためにだ。'),
      ],
    },
    {
      id: 'sup_corwin_gareth_A',
      lines: [
        L('ガレス', 'p_gareth', 'left', '今回は。'),
        L('コルウィン', 'p_corwin', 'right', '……今回は、金の話をしなくて済んでる。'),
        L('コルウィン', 'p_corwin', 'right', '二十年で初めてだ。だから、まあ、居る。'),
      ],
    },
  ],

  // ── 第10章
  'p_bryn|p_corwin': [
    {
      id: 'sup_bryn_corwin_C',
      lines: [
        L('ブリン', 'p_bryn', 'right', 'まだ、金？'),
        L('コルウィン', 'p_corwin', 'left', '金だ。'),
        L('ブリン', 'p_bryn', 'right', '五回目。'),
        L('コルウィン', 'p_corwin', 'left', '……数えるな。'),
      ],
    },
    {
      id: 'sup_bryn_corwin_B',
      lines: [
        L('ブリン', 'p_bryn', 'right', '報酬、安い。'),
        L('コルウィン', 'p_corwin', 'left', 'ひどいもんだ。'),
        L('ブリン', 'p_bryn', 'right', '拘束、長い。'),
        L('コルウィン', 'p_corwin', 'left', 'もっとひどい。'),
        L('ブリン', 'p_bryn', 'right', '隊長、死体に謝る。'),
        L('コルウィン', 'p_corwin', 'left', '……ああ。あれは初めて見た。'),
      ],
    },
    {
      id: 'sup_bryn_corwin_A',
      lines: [
        L('ブリン', 'p_bryn', 'right', 'じゃあ、なんで居るの。'),
        L('コルウィン', 'p_corwin', 'left', '……。'),
        L('ブリン', 'p_bryn', 'right', 'いい。答えなくて。'),
        L('コルウィン', 'p_corwin', 'left', '助かる。'),
      ],
    },
  ],

  // ── 章に紐付かない一組。**ブリンは他のどこでも二語三語しか喋らない**ので、
  // ここもその口調で通す（PoC の饒舌なブリンは第3章以降のブリンと別人だった）
  'p_bryn|p_gareth': [
    {
      id: 'sup_gareth_bryn_C',
      lines: [
        L('ガレス', 'p_gareth', 'left', 'おいブリン、その弓、ちょっと貸してみろ。'),
        L('ブリン', 'p_bryn', 'right', '切れる。'),
        L('ガレス', 'p_gareth', 'left', '……何が。'),
        L('ブリン', 'p_bryn', 'right', '弦。あなたの腕で。'),
        L('ガレス', 'p_gareth', 'left', '……ちっ。斧のほうが単純でいいや。'),
      ],
    },
    {
      id: 'sup_gareth_bryn_B',
      lines: [
        L('ブリン', 'p_bryn', 'right', 'ガレス。前、出すぎ。'),
        L('ガレス', 'p_gareth', 'left', '当たらねえよ。お前は外さねえ。'),
        L('ブリン', 'p_bryn', 'right', '……。'),
        L('ブリン', 'p_bryn', 'right', 'それ、褒めてる？'),
        L('ガレス', 'p_gareth', 'left', '信用してるって言ってんだ。'),
      ],
    },
    {
      id: 'sup_gareth_bryn_A',
      lines: [
        L('ガレス', 'p_gareth', 'left', 'ブリン。俺が突っ込んだら、下がれ。'),
        L('ブリン', 'p_bryn', 'right', '嫌。'),
        L('ガレス', 'p_gareth', 'left', '理由を言え。'),
        L('ブリン', 'p_bryn', 'right', '届く距離。いないと、当てられない。'),
        L('ガレス', 'p_gareth', 'left', '……頑固だな。'),
        L('ブリン', 'p_bryn', 'right', 'あなたほどじゃない。'),
      ],
    },
  ],
};

function pairKey(a: string, b: string): string {
  return [a, b].sort().join('|');
}

export const SUPPORT_PAIRS: string[][] = Object.keys(T).map((k) => k.split('|'));

/** rank は 1(C) / 2(B) / 3(A) */
export function supportScript(a: string, b: string, rank: number): Script | undefined {
  return T[pairKey(a, b)]?.[rank - 1];
}
