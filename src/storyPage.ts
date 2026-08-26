import { storyEntries, type StoryEntry } from './story/browse';
import { hasPortrait } from './render/sprites';
import type { Line } from './story/dialogue';

/**
 * **通しで読むためのページ。** `story.html` から読み込まれる。
 *
 * canvas の閲覧画面（`?dev=story`）と同じ `storyEntries()` を出所にしているので、
 * 章を足せばここにも出る。違いは目的で、あちらは「本編と同じ演出で一本再生する」、
 * こちらは「二百三十本を頭から終わりまで読む」。
 *
 * 読むついでに粗も出す。顔グラの無い話者、吹き出しが出せない `**`、一息で
 * 読ませるには長すぎる行 —— どれも遊んでいると気づけない種類のもの。
 */

/** 吹き出し一つに収めるには長い、と判断する字数 */
const LONG = 64;

/**
 * **登場人物が知っているはずのない言葉。** 規則は `AGENTS.md`。
 *
 * 島に住んでいる人間は「三章前」とも「十二ターン」とも言わない。どちらも
 * 製品の単位であって、その人の暮らしの単位ではない。地の文も同じ。
 *
 * 例外は `［目標］` と `（このターン、〜）` —— あれは画面がプレイヤーに向かって
 * 喋っているので、括弧が付いたまま素通しにする。
 */
const GAME_WORDS = ['章', 'ターン', '盤', 'マス', 'フェイズ', 'ユニット', 'レベル', '経験値', 'クラスチェンジ', '必殺', 'プレイ', 'ゲーム'];

/** 紋章・文章・楽章。「章」を含むだけの普通の語まで拾わないための除外 */
const NOT_META = /紋章|文章|楽章|憲章|勲章|印章/g;

function gameWords(text: string): string[] {
  // `［目標］…` は行ぜんぶが画面の言葉。頭の札だけでなく後ろの本文も含めて素通し
  if (text.startsWith('［')) return [];
  // 地の文の末尾に付く `（このターン、〜の守備 −2）` は文の途中から始まる
  const clean = text.replace(/（[^）]*）/g, '').replace(NOT_META, '');
  return GAME_WORDS.filter((w) => clean.includes(w));
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

const slug = (s: string, i: number) => `s${i}-${s.replace(/[^\p{L}\p{N}]+/gu, '-').slice(0, 24)}`;

function lineHtml(l: Line): string {
  const narration = !l.speaker;
  const cls = ['line', narration ? 'n' : l.side === 'right' ? 'r' : 'l'].join(' ');

  const flags: string[] = [];
  // 登場人物はゲームの言葉を知らない（AGENTS.md）。地の文も同じ
  const meta = gameWords(l.text);
  if (meta.length) flags.push(`ゲームの言葉「${meta.join('」「')}」`);
  // 吹き出しは太字を出せない。仕様書を書く癖がそのまま台詞に混ざることがある
  if (l.text.includes('**')) flags.push('** が本文に混ざっている');
  if (l.text.length >= LONG) flags.push(`${l.text.length} 字`);

  let who = '';
  if (!narration) {
    const id = l.who ?? '';
    const missing = id && !hasPortrait(id);
    who = esc(l.speaker!);
    if (missing) flags.unshift(`${id} に顔グラが無い`);
    who += `<span class="tag${missing ? ' bad' : ''}">${esc(id)}</span>`;
  }

  const flagHtml = flags.length ? `<span class="flag">⚠ ${esc(flags.join(' / '))}</span>` : '';
  return `<div class="${cls}"><div class="who">${who}</div><div class="text">${esc(l.text)}${flagHtml}</div></div>`;
}

function render(list: StoryEntry[]) {
  const body = document.getElementById('body')!;
  const toc = document.getElementById('toc')!;
  const out: string[] = [];
  const nav: string[] = [];
  let scripts = 0;
  let lines = 0;

  for (const [i, e] of list.entries()) {
    if (e.header) {
      const id = slug(e.label, i);
      out.push(`<h2 id="${id}">${esc(e.label)}</h2>`);
      nav.push(`<a href="#${id}" data-for="${id}">${esc(e.label)}</a>`);
      continue;
    }
    if (!e.script) continue;
    scripts += 1;
    lines += e.script.lines.length;
    const title = e.script.title && e.script.title !== e.label ? `<span class="title">${esc(e.script.title)}</span>` : '';
    out.push(
      `<section data-label="${esc(e.label)}" data-id="${esc(e.script.id)}">` +
        `<header><span class="label">${esc(e.label)}</span>${title}<span class="id">${esc(e.script.id)}</span></header>` +
        `<div class="lines">${e.script.lines.map(lineHtml).join('')}</div>` +
        `</section>`,
    );
  }

  body.innerHTML = out.join('');
  toc.insertAdjacentHTML('beforeend', nav.join(''));
  document.getElementById('count')!.textContent = `${scripts} 本 ／ ${lines} 行`;
}

/** 検索。**節ごと隠す。** 行だけ残しても誰の台本か分からなくなる */
function filter(q: string) {
  const needle = q.trim().toLowerCase();
  let shown = 0;
  for (const sec of document.querySelectorAll<HTMLElement>('#body section')) {
    for (const m of sec.querySelectorAll('mark')) m.replaceWith(m.textContent ?? '');
    if (!needle) {
      sec.classList.remove('hidden');
      shown += 1;
      continue;
    }
    const hay = `${sec.dataset.label} ${sec.dataset.id} ${sec.textContent}`.toLowerCase();
    const hit = hay.includes(needle);
    sec.classList.toggle('hidden', !hit);
    if (!hit) continue;
    shown += 1;
    for (const t of sec.querySelectorAll<HTMLElement>('.text, .who')) {
      const text = t.firstChild;
      if (text?.nodeType !== Node.TEXT_NODE) continue;
      const at = text.textContent!.toLowerCase().indexOf(needle);
      if (at < 0) continue;
      const mark = document.createElement('mark');
      mark.textContent = text.textContent!.slice(at, at + needle.length);
      const rest = (text as Text).splitText(at);
      (rest as Text).splitText(needle.length);
      rest.replaceWith(mark);
    }
  }
  // 章の見出しは、その章に残っている節が一つも無ければ引っ込める
  let h: HTMLElement | undefined;
  let any = false;
  const flush = () => h && h.classList.toggle('hidden', !any);
  for (const el of document.querySelectorAll<HTMLElement>('#body > *')) {
    if (el.tagName === 'H2') {
      flush();
      h = el;
      any = false;
    } else if (!el.classList.contains('hidden')) any = true;
  }
  flush();
  document.getElementById('count')!.textContent = needle ? `${shown} 本が一致` : '';
}

const list = storyEntries();
render(list);

const q = document.getElementById('q') as HTMLInputElement;
q.addEventListener('input', () => filter(q.value));

const ids = document.getElementById('showIds') as HTMLInputElement;
ids.addEventListener('change', () => document.body.classList.toggle('ids', ids.checked));

// 目次の現在地。スクロールで追う
const marks = [...document.querySelectorAll<HTMLElement>('#body h2')];
const links = new Map([...document.querySelectorAll<HTMLAnchorElement>('#toc a')].map((a) => [a.dataset.for!, a]));
const spy = new IntersectionObserver(
  (es) => {
    for (const e of es) {
      if (!e.isIntersecting) continue;
      for (const a of links.values()) a.classList.remove('on');
      links.get(e.target.id)?.classList.add('on');
      links.get(e.target.id)?.scrollIntoView({ block: 'nearest' });
    }
  },
  { rootMargin: '-50px 0px -75% 0px' },
);
for (const m of marks) spy.observe(m);

// ?q=灰 で検索した状態から開く
const preset = new URLSearchParams(location.search).get('q');
if (preset) {
  q.value = preset;
  filter(preset);
}
