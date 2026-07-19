// adapters/gemini.js
// Gemini (https://gemini.google.com) 専用のアダプター。
//
// 画面デザインが変わって動かなくなった場合は、下のセレクタ配列だけを調整してください。
// Geminiの入力欄はリッチテキスト系のcontenteditableで実装されていることが多いため、
// data-placeholder付きのcontenteditableも候補に含めています。

window.SendGuard = window.SendGuard || {};

(function () {
  const { matchesAny } = window.SendGuard.domUtils;

  const COMPOSER_SELECTORS = [
    'div[contenteditable="true"]',
    'div[data-placeholder][contenteditable="true"]',
    'rich-textarea [contenteditable="true"]',
    '[role="textbox"]'
  ];

  const SEND_SELECTORS = [
    'button[aria-label*="Send" i]',
    'button[aria-label*="送信" i]',
    'button[aria-label*="Submit" i]'
  ];

  const RETRY_SELECTORS = [
    'button[aria-label*="Regenerate" i]',
    'button[aria-label*="Retry" i]',
    'button[aria-label*="再生成" i]',
    'button[aria-label*="Try again" i]',
    'button[aria-label*="再試行" i]',
    'button[aria-label*="やり直" i]',
    'button[mattooltip*="やり直" i]',
    'button[data-tooltip*="やり直" i]',
    'button[title*="やり直" i]'
  ];

  window.SendGuard.adapter = {
    // CSS側でサイトごとに見た目を微調整するための識別名(core/lock-ui.css参照)
    siteId: 'gemini',
    // Geminiは入力欄を動的に作り直すため、送信判定をMAIN worldの専用ガードで行う。
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
