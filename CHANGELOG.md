# CHANGELOG

このプロジェクトの変更履歴です。形式は [Keep a Changelog](https://keepachangelog.com/ja/1.0.0/) を、
バージョン番号の付け方は [セマンティックバージョニング](https://semver.org/lang/ja/)（`MAJOR.MINOR.PATCH`）を採用しています。

- **MAJOR**: 今までの使い方が壊れるような大きな変更
- **MINOR**: 後方互換性のある新機能の追加
- **PATCH**: バグ修正や細かい調整のみ

## [Unreleased]

## [0.2.4] - 2026-07-18
### 修正
- Geminiで、ロック解除後のEnterが送信されずに再ロック・お楽しみ表示だけが起きる不具合を修正
  - Gemini専用のMAIN worldガードを追加し、Enter処理をGemini本体に確実に渡すよう変更
  - 入力欄が実際に空になったことを検出してから再ロック・お楽しみ表示を行うよう変更

## [0.2.3] - 2026-07-18
### 修正
- ChatGPTでロック中にEnterを押した際、空白文字が入ることがある問題を修正
  - ProseMirrorへ直接改行を挿入する方式をやめ、ChatGPT本来のShift+Enter改行処理を呼ぶ方式に変更

## [0.2.2] - 2026-07-18
### 修正
- ChatGPT の Enter 誤送信対策を、ページ本体と同じ MAIN world で動く専用ガードに変更
  - ページ側の `keydown` ハンドラより確実に先に Enter を止める
  - ロック状態・バッジ・設定は既存の共通コアのまま維持
  - ロック中の Enter は ChatGPT の ProseMirror に標準の改行操作として渡す

## [0.2.1] - 2026-07-18
### 修正
- ChatGPTでEnterキーによる送信がブロックされない不具合を修正
  - 原因: 拡張機能のコードがページ読み込み後半(`document_idle`)に動き始めていたため、
    ChatGPT自身のEnterキー処理の方が先に働いてしまっていた
  - 対処: `run_at`を`document_start`に変更し、監視対象も`document`から一段外側の`window`に変更。
    サイト自身のJavaScriptが動き出すより前に、確実にこちらが先に検知できるようにした
  - ユーザーによる実機調査(ChatGPTのDOM構造の特定)がきっかけで発見・修正

## [0.2.0] - 2026-07-18
### 追加
- ChatGPT（`chatgpt.com` / `chat.openai.com`）対応アダプター（`adapters/chatgpt.js`）
- Gemini（`gemini.google.com`）対応アダプター（`adapters/gemini.js`）
- アダプター間で共通利用するDOM判定ヘルパー（`core/dom-utils.js`）
- `manifest.json` にChatGPT・Geminiの`host_permissions`／`content_scripts`を追加

### 変更
- `adapters/claude.js` を共通ヘルパー（`dom-utils.js`）を使う形に整理

### 未検証
- ChatGPT・Geminiの実際の画面での動作確認（セレクタの調整が必要になる可能性あり）

## [0.1.0] - 2026-07-16
### 追加
- プロジェクトの初期実装（フェーズ1）
- Claude.ai向けのEnterキー・送信ボタンのロック機構
- 🔒アイコンのクリック／`Ctrl+Shift+U` によるロック解除（1回限り、自動再ロック）
- `Esc` キーによるロック解除のキャンセル
- お楽しみ機能の土台（初期状態OFF、送信後に一言コメント表示）
- 設定画面（ポップアップ）でお楽しみ機能のON/OFF切り替え
- 多言語対応の土台（`_locales/ja`, `_locales/en`）
- 設計書（`docs/`）

### 変更（実際に使ってみてのフィードバック反映、2026-07-17）
- 🔒アイコンをクリックのたびにロック⇔解除が切り替わるトグル動作に変更
- お楽しみコメントの背景色をバッジと同じ明るい配色に統一（ライトモードでの違和感を解消）
- 設定画面に「ツールバーにピン留め」のヒントを追加

### 確認済み
- Claude.aiの実際の画面で動作確認済み（送信ロック・再試行ロック・お楽しみ機能とも正常動作）
