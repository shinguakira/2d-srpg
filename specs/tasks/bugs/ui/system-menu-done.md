# Show System Menu on Empty Tile Click / Right-Click (総合メニュー)

> **Severity:** medium
> **Category:** ui
> **Affected files:** `src/stores/actions/selectionActions.ts`, `src/components/UI/SystemMenu.tsx` (new), `src/stores/gameStoreTypes.ts`, `src/stores/gameStore.ts`
> **Spec refs:** `specs/ui/hud.md`

## Description

Idle状態で空タイルをクリック、または右クリックした時にFEスタイルの総合メニュー（システムメニュー）を画面左側に表示する。現状は何も起きずに無視される。

## Current Behavior

- `clickTile` の idle 分岐で、プレイヤーの未行動ユニット以外のタイルをクリックすると早期リターンし何も表示されない
- 右クリックにシステムメニュー機能がない

## Expected Behavior

空タイルクリックまたは右クリック時に、画面左側に縦並びのシステムメニューを表示する。

### メニュー項目

| 項目 | 動作 |
|------|------|
| ユニット一覧 | ユニットリスト画面を開く（既存の UnitListPanel 相当） |
| 勝敗条件 | 勝利・敗北条件のオーバーレイを表示 |
| 環境設定 | 設定画面（BGM/SE音量、アニメーション速度など） |
| 中断 | 現在の戦闘を中断セーブしてタイトルに戻る |
| ターン終了 | 全ユニットの行動を終了しエネミーフェーズへ |

### UI仕様

- 画面左側に縦並び表示（FEスタイル）
- メニュー外クリックまたは Escape/B で閉じる
- 各ボタンにホバーエフェクト
- ダークグリーン背景 + 金枠装飾風のスタイル

## Steps to Fix

- [x] `gameStoreTypes.ts` に `playerAction` 状態 `'system_menu'` を追加
- [x] `SystemMenu.tsx` コンポーネントを作成（左側縦並びメニュー）
- [x] `clickTile` idle分岐: 空タイルクリック → `playerAction: 'system_menu'` に遷移
- [x] 右クリック（contextmenu）でもシステムメニューを開く処理を追加
- [x] メニュー項目の各アクション実装:
  - [x] ユニット一覧 → 既存ユニットリスト表示
  - [x] 勝敗条件 → 条件オーバーレイ表示
  - [x] 環境設定 → 設定パネル表示
  - [x] 中断 → セーブしてタイトルへ
  - [x] ターン終了 → `endPlayerPhase` 呼び出し
- [x] メニュー外クリック・Escape で閉じる
- [x] `data-testid` を各メニューボタンに付与
- [x] CSS: FEスタイルの装飾（ダークグリーン背景、金枠風ボーダー）
- [x] E2E test: 空タイルクリック → システムメニュー表示 → 各ボタン動作

## Spec Update

- [x] Update `specs/ui/hud.md` — 「システムメニュー」セクションを追加
