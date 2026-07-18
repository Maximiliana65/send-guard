// Gemini の送信ガードをページ本体と同じ MAIN world で実行する。
// Gemini は Enter の処理中に入力欄を作り直すことがあるため、解除状態を
// keydown の時点で消費せず、入力欄が空になった（=送信開始した）時点で消費する。
(function () {
  'use strict';

  if (window.__sendGuardGeminiPageGuardInstalled) return;
  window.__sendGuardGeminiPageGuardInstalled = true;

  const STATE_ATTRIBUTE = 'data-send-guard-unlocked';
  const COMPOSER_SELECTOR = 'rich-textarea .ql-editor[contenteditable="true"], rich-textarea [contenteditable="true"]';
  const SEND_SELECTOR = [
    'button[aria-label*="Send" i]',
    'button[aria-label*="送信" i]',
    'button[aria-label*="Submit" i]'
  ].join(',');
  const RETRY_SELECTOR = [
    'button[aria-label*="Regenerate" i]',
    'button[aria-label*="Retry" i]',
    'button[aria-label*="再生成" i]',
    'button[aria-label*="Try again" i]',
    'button[aria-label*="再試行" i]',
    'button[aria-label*="やり直" i]',
    'button[mattooltip*="やり直" i]',
    'button[data-tooltip*="やり直" i]',
    'button[title*="やり直" i]'
  ].join(',');

  function isUnlocked() {
    return document.documentElement.getAttribute(STATE_ATTRIBUTE) === 'true';
  }

  function publish(name) {
    window.dispatchEvent(new Event(name));
  }

  function relock(sent) {
    document.documentElement.removeAttribute(STATE_ATTRIBUTE);
    publish('send-guard:state');
    if (sent) publish('send-guard:sent');
  }

  function elementFromEvent(event) {
    return event.target instanceof Element ? event.target : null;
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
    document.execCommand('insertText', false, '\n');
  }

  // Gemini が送信を受け付けると、現在の入力欄は空になるか、DOMごと置き換わる。
  // その変化を確認してからロックを消費するので、送信失敗時に誤ってロック状態へ
  // 戻ったり、お楽しみコメントだけが表示されたりしない。
  function relockAfterActualSend(composer) {
    if (!composer.textContent.trim()) return;

    const observer = new MutationObserver(() => {
      const currentComposer = document.querySelector(COMPOSER_SELECTOR);
      const wasCleared = currentComposer && !currentComposer.textContent.trim();

      // Geminiは入力欄を一瞬だけ作り直すことがあるため、元の要素が消えたことだけでは
      // 送信成功とみなさない。新しい入力欄が空になったことまで確認する。
      if (wasCleared) {
        observer.disconnect();
        if (isUnlocked()) relock(true);
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // 送信されなかった場合は解除状態を保つ。次の手入力やEscで通常どおり操作できる。
    setTimeout(() => observer.disconnect(), 5000);
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
      relock(false);
      return;
    }

    // Geminiのやり直しボタンは、クリックではなくキー操作の時点で動作を開始する
    // ことがあるため、ロック中はボタンに対するEnter/Spaceも先に止める。
    if ((event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') && isProtectedButton(event)) {
      if (!isUnlocked()) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      return;
    }

    if (event.key !== 'Enter' || event.shiftKey) return;
    const composer = composerFromEvent(event);
    if (!composer) return;

    if (isUnlocked()) {
      // ここでは preventDefault も再ロックも行わない。Gemini本体の送信処理を
      // 完全に通し、実際の送信をMutationObserverで確認してから状態を更新する。
      relockAfterActualSend(composer);
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    insertLineBreak(composer);
  }, true);

  function blockLockedPointerAction(event) {
    if (!isProtectedButton(event)) return;
    if (isUnlocked()) return;

    event.preventDefault();
    event.stopImmediatePropagation();
  }

  // Geminiのやり直しはpointerdown/mousedownで始まる場合がある。clickだけでは
  // 遅いため、ロック中に限って前段のイベントから止める。
  window.addEventListener('pointerdown', blockLockedPointerAction, true);
  window.addEventListener('mousedown', blockLockedPointerAction, true);

  window.addEventListener('click', (event) => {
    if (!isProtectedButton(event)) return;

    if (isUnlocked()) {
      relock(true);
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
})();
