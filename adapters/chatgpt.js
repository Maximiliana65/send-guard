// adapters/chatgpt.js
// ChatGPT (https://chatgpt.com) 専用のアダプター。
//
// 画面デザインが変わって動かなくなった場合は、下のセレクタ配列だけを調整してください。
// 入力欄には id="prompt-textarea" の要素が使われることが多いですが、
// 念のため一般的なcontenteditable/textareaの形も候補に含めています。

window.SendGuard = window.SendGuard || {};

(function () {
  const { matchesAny } = window.SendGuard.domUtils;

  const COMPOSER_SELECTORS = [
    '#prompt-textarea',
    'div[contenteditable="true"]',
    'textarea',
    '[role="textbox"]'
  ];

  const SEND_SELECTORS = [
    'button[data-testid="send-button"]',
    'button[aria-label*="Send" i]',
    'button[aria-label*="送信" i]'
  ];

  const RETRY_SELECTORS = [
    'button[aria-label*="Regenerate" i]',
    'button[aria-label*="再生成" i]',
    'button[aria-label*="Try again" i]',
    'button[aria-label*="再試行" i]'
  ];

  window.SendGuard.adapter = {
    // Enter は ChatGPT のページ本体と同じ実行コンテキストで先に止める。
    // UI とロック状態は content-main.js 側で引き続き管理する。
    usesMainWorldGuard: true,
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
