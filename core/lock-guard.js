// core/lock-guard.js
// 「今、送信できる状態かどうか」だけを管理するモジュール。
// キー入力やクリックの検知(content-main.js)や、UI表示(バッジ)からは
// 必ずこのモジュールを経由して状態を読み書きする。
//
// ルール:
//  - ページを開いた直後は常にロック状態から始まる
//  - unlockOnce() で解除しても、1回消費されると自動でロックに戻る
//  - 状態が変わるたびに、登録されたリスナーに通知する(UI更新のため)

window.SendGuard = window.SendGuard || {};

window.SendGuard.lockGuard = (() => {
  let unlocked = false;
  const listeners = [];

  function notify() {
    listeners.forEach((fn) => fn(unlocked));
  }

  return {
    isUnlocked() {
      return unlocked;
    },

    // ロックを解除する(次の1回だけ送信可能にする)
    unlockOnce() {
      unlocked = true;
      notify();
    },

    // 解除状態を消費して、また元のロックに戻す
    consumeAndRelock() {
      unlocked = false;
      notify();
    },

    // Escなどによる、送信せずにロックへ戻すキャンセル
    cancel() {
      if (unlocked) {
        unlocked = false;
        notify();
      }
    },

    // 状態変化を購読する(UIの見た目更新などに使う)
    onChange(fn) {
      listeners.push(fn);
    }
  };
})();
