// ChatGPT の Enter 送信をページ本体と同じ MAIN world で先回りして止めるガード。
// content script の ISOLATED world では、ページ側の window リスナーより後に
// 呼ばれるブラウザ実装があるため、送信を止める処理だけをここに分離する。
// ロック状態と表示は従来どおり core/content-main.js が担当する。
(function () {
  'use strict';

  if (window.__sendGuardChatGPTPageGuardInstalled) return;
  window.__sendGuardChatGPTPageGuardInstalled = true;

  const STATE_ATTRIBUTE = 'data-send-guard-unlocked';
  const COMPOSER_SELECTOR = '#prompt-textarea[contenteditable="true"], #prompt-textarea';
  const SEND_SELECTOR = [
    'button[data-testid="send-button"]',
    'button[aria-label*="Send" i]',
    'button[aria-label*="送信" i]'
  ].join(',');
  const RETRY_SELECTOR = [
    'button[aria-label*="Regenerate" i]',
    'button[aria-label*="Try again" i]',
    'button[aria-label*="再試行" i]'
  ].join(',');

  function isUnlocked() {
    return document.documentElement.getAttribute(STATE_ATTRIBUTE) === 'true';
  }

  function publish(name) {
    window.dispatchEvent(new Event(name));
  }

  function relock() {
    document.documentElement.removeAttribute(STATE_ATTRIBUTE);
    publish('send-guard:state');
  }

  function elementFromEvent(event) {
    const target = event.target;
    return target instanceof Element ? target : null;
  }

  function composerFromEvent(event) {
    const target = elementFromEvent(event);
    return target ? target.closest(COMPOSER_SELECTOR) : null;
  }

  function isProtectedButton(event) {
    const target = elementFromEvent(event);
    return !!target && !!target.closest(`${SEND_SELECTOR}, ${RETRY_SELECTOR}`);
  }

  function insertLineBreak(composer) {
    composer.focus();

    if (composer instanceof HTMLTextAreaElement) {
      const start = composer.selectionStart;
      const end = composer.selectionEnd;
      const nextValue = `${composer.value.slice(0, start)}\n${composer.value.slice(end)}`;
      const descriptor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
      descriptor.set.call(composer, nextValue);
      composer.selectionStart = composer.selectionEnd = start + 1;
      composer.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }

    // ChatGPT のProseMirrorに直接改行文字を挿入すると、改行ではなく空白文字として
    // 扱われることがある。そのため、ChatGPTが元々サポートしているShift+Enterの
    // キー処理を呼び、サイト自身に正しい改行を作らせる。
    composer.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
      composed: true
    }));
  }

  window.addEventListener('keydown', (event) => {
    if (event.isComposing || event.keyCode === 229) return;

    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'u') {
      document.documentElement.setAttribute(STATE_ATTRIBUTE, 'true');
      event.preventDefault();
      event.stopImmediatePropagation();
      publish('send-guard:state');
      return;
    }

    if (event.key === 'Escape' && isUnlocked()) {
      relock();
      return;
    }

    if (event.key !== 'Enter' || event.shiftKey) return;
    const composer = composerFromEvent(event);
    if (!composer) return;

    if (isUnlocked()) {
      relock();
      publish('send-guard:sent');
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    insertLineBreak(composer);
  }, true);

  window.addEventListener('click', (event) => {
    if (!isProtectedButton(event)) return;

    if (isUnlocked()) {
      relock();
      publish('send-guard:sent');
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
})();
