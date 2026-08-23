import type { Script } from './dialogue';

/**
 * **死に際の一言。** 章ごとの台本は `story/chapters/` にあり、章の定義に
 * ぶら下がっている。支援会話は `story/supports.ts`。ここはどの章でも同じ、
 * 倒れたときの一行だけ。
 *
 * 名前は `specs/story/roster.md` の設計名に揃えてある。ID が設計名、劇中の表記が
 * `roster.ts` の `name`。ジェイガンだけ二つが違うのは、それが彼の名乗る別名だから。
 */

/** 死亡時の一言（FE 恒例） */
const DEATH_QUOTES: Record<string, string> = {
  p_shigeru: '父上……まだ、南へ……',
  p_akira: '殿下の……盾に、なれましたか……',
  p_gareth: 'く……前に出すぎたか。わりぃな……',
  p_bryn: '矢が……届かない……',
  p_lisette: 'まだ、調べたいことが……あったのに……',
  p_mirelle: 'みなさんを守れなくて……ごめんなさい……',
  p_elin: '……空が、遠い……',
  p_ald: '光は……まだ、ありますか……',
  p_corwin: '割に合わねえな……まったく……',
  e_boss: 'クレハだ。……弟の村の名だ。覚えておけ。',
  c2_boss: '橋は……渡らせるな……以上だ……',
  c3_boss: '……振り向けば、よかったのか……',
  // 第4章から先。**第9章の斥候隊長だけは無言で消える** —— あの章の敵は
  // 人物ではない、というのが設計（specs/story/bosses.md）
  p_halvar: '……持ち場を、離れます。すみません……',
  p_fenn: 'あーあ……鼻歌、聞かれたかな……',
  p_nadine: 'まだ、診ていない人が……いるのに……',
  p_viviane: '……幕が、早いわ……',
  c4_boss: '割に……合わなかったな……',
  c5_boss: '……砦は、守った。守ったぞ……',
  c6_boss: 'もっと低く飛べ、か。……ここまで低くては、もう飛べん。',
  c7_boss: '壁は……わしが見ていた。ずっと、見ていたのだ……',
  c8_boss: '……九ターンか。あれは、良い兵だった。',
  c10_boss: '生まれた帝国に……仕えた。それだけだ……',
  c10_ilse: '記録を……誰か、続きを……',
};

/**
 * 死に際の台詞。**持っている者だけが喋る。**
 *
 * FE で口をきくのは顔グラを持つ者だけで、雑魚は無言で消える。「山賊は倒れた」
 * のような報告は出ない。台詞が無ければ undefined を返し、呼び出し側は会話を
 * 挟まずに次へ進む。
 */
export function deathScript(unitId: string, name: string): Script | undefined {
  const quote = DEATH_QUOTES[unitId];
  if (!quote) return undefined;
  return { id: `death_${unitId}`, lines: [{ speaker: name, who: unitId, side: 'left', text: quote }] };
}
