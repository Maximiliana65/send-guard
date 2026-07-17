// core/content-main.js
// ページ内で実際にキー入力・クリックを監視し、core/lock-guard.js の状態と
// adapters/*.js の判定を組み合わせて「送信を通すか、止めるか」を決める、
// 全体の司令塔となるファイル。
//
// 設計方針:
//   - window に対して capture フェーズでイベントを監視することで、
//     サイト側の処理(送信・再試行)より先に横取りする
//     (window は document よりさらに外側なので、サイト側がdocumentに
//      同じ仕組みを持っていても、必ずこちらが先に検知できる)
//   - manifest.json 側で run_at を "document_start" にし、サイト自身の
//     JavaScriptが動き出すより前に、この監視を開始しておく
//   - ロック中は preventDefault + stopImmediatePropagation で送信を止める
//   - 解除中は何もせずイベントをそのまま通し、直後に自動で再ロックする

(function () {
  const SG = window.SendGuard;
  const lockGuard = SG.lockGuard;
  const adapter = SG.adapter;

  let badgeEl = null;
  let dotEl = null;
  let labelEl = null;

  function msg(key) {
    return chrome.i18n.getMessage(key) || key;
  }

  function createBadge() {
    if (badgeEl) return; // 二重生成を防ぐ
    const el = document.createElement('div');
    el.className = 'sg-badge';
    el.title = msg('badgeTooltip');

    const dot = document.createElement('span');
    dot.className = 'sg-dot';

    const label = document.createElement('span');
    label.className = 'sg-label';

    el.appendChild(dot);
    el.appendChild(label);
    document.body.appendChild(el);

    el.addEventListener('click', () => {
      // クリックのたびにロック⇔解除を切り替える(オン/オフの分かりやすいトグル)
      if (lockGuard.isUnlocked()) {
        lockGuard.cancel();
      } else {
        lockGuard.unlockOnce();
      }
    });

    badgeEl = el;
    dotEl = dot;
    labelEl = label;
    updateBadge(lockGuard.isUnlocked());
  }

  // document_start の時点では <body> がまだ存在しないことがあるため、
  // 存在すればすぐ、なければ準備できてから バッジを作る
  function ensureBadge() {
    if (document.body) {
      createBadge();
    } else {
      document.addEventListener('DOMContentLoaded', createBadge, { once: true });
    }
  }

  function updateBadge(unlocked) {
    if (!badgeEl) return;
    badgeEl.classList.toggle('sg-unlocked', unlocked);
    labelEl.textContent = unlocked ? msg('badgeUnlocked') : msg('badgeLocked');
  }

  function maybeShowFunComment() {
    SG.settingsStore.get(['funEnabled'], (settings) => {
      if (settings.funEnabled && SG.funEngine) {
        SG.funEngine.showRandomComment();
      }
    });
  }

  lockGuard.onChange(updateBadge);

  // --- キー入力の監視 ---
  // window に付けることで、サイト側がdocumentレベルで同様の仕組みを
  // 持っていても、必ずこちらの判定が先に働く
  window.addEventListener(
    'keydown',
    (event) => {
      // ショートカットでロック解除 (Ctrl+Shift+U)
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'u') {
        event.preventDefault();
        event.stopImmediatePropagation();
        lockGuard.unlockOnce();
        return;
      }

      // Escでキャンセル
      if (event.key === 'Escape' && lockGuard.isUnlocked()) {
        lockGuard.cancel();
        return;
      }

      if (event.key !== 'Enter') return;
      if (!adapter.isComposerElement(event.target)) return;

      // Shift+Enter は元々の「改行」動作なので、そのままサイトに任せる
      if (event.shiftKey) return;

      if (lockGuard.isUnlocked()) {
        // 解除中の1回だけは、何もせずサイト側の送信処理を通す
        lockGuard.consumeAndRelock();
        maybeShowFunComment();
        return;
      }

      // ロック中: サイト側に処理させず、代わりに改行を挿入する
      event.preventDefault();
      event.stopImmediatePropagation();
      document.execCommand('insertText', false, '\n');
    },
    true
  );

  // --- クリックの監視(送信ボタン・再試行ボタン) ---
  window.addEventListener(
    'click',
    (event) => {
      const isSend = adapter.isSendButton(event.target);
      const isRetry = adapter.isRetryButton(event.target);
      if (!isSend && !isRetry) return;

      if (lockGuard.isUnlocked()) {
        lockGuard.consumeAndRelock();
        maybeShowFunComment();
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
    },
    true
  );

  ensureBadge();
})();
