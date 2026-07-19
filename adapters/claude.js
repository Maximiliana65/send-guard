// adapters/claude.js
// Claude.ai (https://claude.ai) 専用のアダプター。
//
// 【重要】このファイルは「Claude.aiの画面のどこが入力欄で、どこが送信ボタンか」
// だけを判定する担当です。ロックの仕組み自体(core/)には一切手を入れません。
// 画面デザインが変わって動かなくなった場合は、下のセレクタ配列だけを調整してください。

window.SendGuard = window.SendGuard || {};

(function () {
  const { matchesAny } = window.SendGuard.domUtils;

  const COMPOSER_SELECTORS = [
    'div[contenteditable="true"]',
    '.ProseMirror[contenteditable="true"]',
    '[role="textbox"]'
  ];

  const SEND_SELECTORS = [
    'button[aria-label*="Send message" i]',
    'button[aria-label*="メッセージを送信" i]',
    'button[aria-label*="送信" i]'
  ];

  const RETRY_SELECTORS = [
    'button[aria-label*="Retry" i]',
    'button[aria-label*="再試行" i]',
    'button[aria-label*="Regenerate" i]',
    'button[aria-label*="再生成" i]'
  ];

  window.SendGuard.adapter = {
    // CSS側でサイトごとに見た目を微調整するための識別名(core/lock-ui.css参照)
    siteId: 'claude',
    isComposerElement(el) {
      return matchesAny(el, COMPOSER_SELECTORS);
    },
    isSendButton(el) {
      return matchesAny(el, SEND_SELECTORS);
    },
    isRetryButton(el) {
      return matchesAny(el, RETRY_SELECTORS);
    }
  };
})();
