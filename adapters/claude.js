// adapters/claude.js
// Claude.ai (https://claude.ai) 専用のアダプター。
//
// 【重要】このファイルは「Claude.aiの画面のどこが入力欄で、どこが送信ボタンか」
// だけを判定する担当です。ロックの仕組み自体(core/)には一切手を入れません。
// 将来 Claude.ai の画面デザインが変わって動かなくなった場合は、
// このファイルの中のセレクタ(判定条件)だけを直せば復旧できます。
//
// 同様に、ChatGPT や Gemini に対応するときは、この形式を真似て
// adapters/chatgpt.js / adapters/gemini.js を追加するだけでOKです。

window.SendGuard = window.SendGuard || {};

window.SendGuard.adapter = {
  // クリック/キー入力があった要素が「メッセージ入力欄」かどうか
  isComposerElement(el) {
    if (!el || !el.closest) return false;
    return !!el.closest('div[contenteditable="true"]');
  },

  // クリックされた要素が「送信ボタン」かどうか
  isSendButton(el) {
    if (!el || !el.closest) return false;
    const btn = el.closest('button');
    if (!btn) return false;
    const label = (btn.getAttribute('aria-label') || btn.textContent || '').toLowerCase();
    return label.includes('send message') || label.includes('メッセージを送信') || label.trim() === 'send';
  },

  // クリックされた要素が「再試行(retry/regenerate)ボタン」かどうか
  isRetryButton(el) {
    if (!el || !el.closest) return false;
    const btn = el.closest('button');
    if (!btn) return false;
    const label = (btn.getAttribute('aria-label') || btn.textContent || '').toLowerCase();
    return label.includes('retry') || label.includes('再試行') || label.includes('regenerate');
  }
};
