# FE 聖魔の光石風 2D SRPG

『ファイアーエムブレム 聖魔の光石』(GBA) の戦闘システムと会話パートを再現した
2D シミュレーション RPG。TypeScript + Canvas 2D のみ。ゲームエンジンもフレームワークも
状態管理ライブラリも使っていない。

```bash
npm install
npm run dev      # http://localhost:5173
```

### 開発コマンド

| コマンド | 内容 |
| --- | --- |
| `npm run build` | 型チェック + 本番ビルド |
| `npm run lint` / `lint:fix` | oxlint（`--fix` で自動修正） |
| `npm run format` / `format:check` | oxfmt |
| `npm run knip` | 未使用のファイル・エクスポート・依存の検出 |
| `npm run check` | tsc → oxlint → oxfmt --check → knip をまとめて実行 |

設定は `.oxlintrc.json` / `.oxfmtrc.json` / `knip.json`。
oxfmt は Markdown を対象外にしている（表の桁揃えが全角文字を 1 桁と数えて崩れるため）。

## 操作

| キー | 動作 |
| --- | --- |
| ↑↓←→ / WASD / マウス移動 | カーソル |
| Z / Enter / 左クリック | 決定（ユニット選択 → 移動先 → コマンド → 対象）／会話送り |
| X / Esc / 右クリック | キャンセル（移動前の位置に戻る）／会話の早送り |
| T | 敵の攻撃範囲（危険地帯）の表示切替 |
| E | 自軍フェイズを終了 |
| R | リスタート |

勝利条件は敵の全滅、敗北条件はロード（シゲル）の死亡。
第1章の設計上の目標は玉座の制圧だが、制圧の判定はまだ無い
（`specs/story/chapters/ch1.md` に差分の一覧がある）。

## 仕様書

**計算式・システムの仕様は `specs/systems/` にある。**
コードから書き起こしたもので、こちらが正。

| | |
| --- | --- |
| [combat.md](specs/systems/combat.md) | 戦闘計算（命中・ダメージ・追撃・特効・経験値） |
| [units.md](specs/systems/units.md) | 能力値・クラス・武器レベル・クラスチェンジ |
| [support.md](specs/systems/support.md) | 支援システム（属性表・3マス判定・友好度） |
| [map-and-turns.md](specs/systems/map-and-turns.md) | 地形・移動・ターン進行・敵 AI |
| [presentation.md](specs/systems/presentation.md) | 描画・カメラ・スプライト |

`specs/story/` は対馬を舞台にした25章のキャンペーン設計。**実装の説明ではなく、
目標**。実際に入っているのは第1章の台本とシゲルだけ。

## 実装済みの要素

- GBA 系 FE の戦闘計算（**命中判定は 2RN**、武器三すくみ、特効は威力×3、追撃は攻速差4以上）
- 支援システム（属性の組み合わせで効果が変わる／3マス以内でのみ発動）
- 武器レベル E〜S と熟練度、クラスごとの適性、聖魔式の**2択クラスチェンジ**
- グリッドマップ、地形（平地/草原/道/林/山/水/砦/門）と守備・回避補正、砦の毎ターン回復
- 移動タイプ別コスト（歩行 / 騎馬 / 飛行）。飛行は水と山を無視、騎馬は山に入れない
- ダイクストラによる移動範囲、経路矢印、敵をすり抜けられない判定
- **カメラ**。盤面は画面より大きくてよく、注目点を追ってスクロールする
- 戦闘予測パネル（HP / 威力 / 命中 / 必殺 / 追撃 / 三すくみ / 特効 / 支援）
- 戦闘アニメーション: 踏み込み、被弾フラッシュ、必殺時の画面シェイクと白フラッシュ、
  ダメージ / MISS / 必殺 / 特効 のポップアップ、HP バーの補間、EXP バー、レベルアップウィンドウ
- 敵 AI: 攻撃可能な全マス × 全対象を評価（期待ダメージ・撃破可否・反撃リスク・地形）して最善手を選ぶ。
  `aggressive`（接近する） / `guard`（射程内に入るまで動かない） / `boss`（玉座から動かない）
- 危険地帯表示（T キー）、待機 / 攻撃 / 杖 / 会話 / 支援 / 道具（武器の持ち替え・傷薬・マスタープルフ）
- 魔物（屍兵・バエル・モーグル・ガーゴイル）。光魔法と神聖武器が特効

## 会話パート

FE 風のテキストボックス（立ち絵 + 名前ウィンドウ + タイプライター表示）。

| 種類 | 発生条件 |
| --- | --- |
| オープニング | ゲーム開始時 |
| 支援会話 C/B/A | 隣接した支援ペアで「支援」コマンド |
| 説得 | シゲルが傭兵ロウに隣接して「会話」→ **仲間になる** |
| 戦闘前会話 | シゲルがボス・ヴァルガに隣接して「会話」→ ヴァルガの守備 −2 |
| 死亡時のセリフ | ユニットが倒れたとき |
| エンディング / 敗北 | 決着時 |

## 構成

```
src/
  main.ts                 入力・ループ・開発用シーン
  types.ts
  core/rng.ts             xorshift32 + 2RN 命中判定
  core/grid.ts            移動範囲（ダイクストラ）・経路・射程
  battle/combat.ts        戦闘計算
  battle/support.ts       支援システム
  battle/battleScene.ts   戦闘アニメーション演出
  story/dialogue.ts       会話パートのエンジン
  story/script.ts         台本（オープニング / 支援 C・B・A / 説得 / 死亡 / エンディング）
  game/game.ts            ステートマシン（選択→移動→コマンド→対象→戦闘／会話）
  game/ai.ts              敵 AI と危険地帯計算
  render/layout.ts        タイルサイズ・表示窓・カメラ
  render/mapRender.ts     マップ・UI 描画
  render/sprites.ts       スプライトと立ち絵
  data/                   地形・武器・クラス・マップ・ユニット定義
  assets/sprites/         シゲルのアニメーションシート
```

## 開発用 URL パラメータ

スクリーンショットや演出確認のために、起動時の状態を作れる。

```
?dev=move            ユニット選択 + 移動範囲 + 危険地帯
?dev=menu            移動後の行動メニュー
?dev=target          戦闘予測パネル
?dev=battle          戦闘アニメーション
?dev=levelup         レベルアップ演出
?dev=opening         オープニングの会話
?dev=talk            説得の会話
?dev=support         支援会話
&adv=1.5             指定秒数だけ進めた状態で停止
```

（`?dev=` を付けるとオープニングの会話はスキップされる）

## 調整するなら

- ユニットの能力・属性・配置: `src/data/chapter1.ts`
- 武器の威力・命中・必殺・射程・特効: `src/data/weapons.ts`
- クラスの武器適性・クラスチェンジ先: `src/data/classes.ts`
- 台本: `src/story/script.ts`
- AI の評価関数: `src/game/ai.ts` の `evaluate()`
- タイルサイズ・表示窓・カメラの追従: `src/render/layout.ts`

## 絵づくり

**シゲルだけが画像**。`src/assets/sprites/shigeru-sheet.png` の 46 フレーム
（7クリップ）を `render/sprites.ts` が切り出して描いている。PixelLab に登録した
キャラクターから生成しているので、全フレームが同じ絵になっている。

それ以外のキャラクターは PoC から引き継いだコード描画のまま。**新しく描き足すのは
禁止**。理由と、絵を増やすときに何をしてよいかは [AGENTS.md](AGENTS.md) にある。

引き継いだコード描画は GBA 系 FE の実画面を見て次の特徴を取り込んでいる。

- **会話**: 枠なしの立ち絵が画面下端で切れ、クリーム色の吹き出し（茶色の縁＋話者へ伸びるしっぽ）に濃色のテキスト
- **顔グラ**: 髪のシルエットを顔より大きく取り、毛先を尖らせる。目はアーモンド型で虹彩をまぶたで切り、
  太い上まつげとハイライトを入れる
- **UI**: 青灰グラデーションのウィンドウ＋明色の細枠。ラベルは金、数値は白の縁取り文字
- **コマンドメニュー**: 上下に木のバーが付いた巻物風。選択カーソルは指差しの手
- **戦闘画面**: 上隅に金枠の名前プレート、隅に 命中/威力/必殺 の小箱、HP は目盛り式ゲージ
- **マップスプライト**: 2.5 頭身、暗色のアウトライン、受け光、武器を持つ腕

## 参考にした資料

- [支援効果 ‐ ファイアーエムブレム 聖魔の光石 | RRPG](https://rrpg.jp/fe_seima/support.html)
- [Fire Emblem The Sacred Stones - Support system | Fire Emblem WoD](https://www.fireemblemwod.com/fe8/ENG_apoyo.htm)
- [Supports / calculation | Serenes Forest](https://serenesforest.net/the-sacred-stones/characters/supports/calculation/)
- [3すくみ - ファイアーエムブレム用語辞典](https://w.atwiki.jp/fedic/pages/82.html)
- [クラスチェンジ ‐ ファイアーエムブレム 聖魔の光石 | RRPG](https://rrpg.jp/fe_seima/cc.html)
- [Chapter guide | Serenes Forest](https://serenesforest.net/the-sacred-stones/general/chapter-guide/) — 各章の出撃数・敵数・援軍の実データ
- 絵づくりの参考（実画面の確認用）: [Fire Emblem: The Sacred Stones - Fire Emblem Wiki](https://fireemblemwiki.org/wiki/Fire_Emblem:_The_Sacred_Stones) ／ [Eirika/Gallery](https://fireemblemwiki.org/wiki/Eirika/Gallery)
