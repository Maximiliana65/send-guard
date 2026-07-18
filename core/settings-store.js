// core/settings-store.js
// 設定の保存・読み込みだけを担当するモジュール。
// 他のファイルはこの窓口を通してだけ設定を読み書きする(直接 chrome.storage を触らない)。
// こうしておくと、将来「設定項目を増やす」「保存先を変える」といった変更が
// このファイルだけで完結する。

window.SendGuard = window.SendGuard || {};

const SG_DEFAULT_SETTINGS = {
  funEnabled: false,
  totalSentCount: 0
};

window.SendGuard.settingsStore = {
  /**
   * 設定値を取得する
   * @param {string[]} keys 取得したい設定のキー一覧
   * @param {(values: object) => void} callback
   */
  get(keys, callback) {
    chrome.storage.sync.get(SG_DEFAULT_SETTINGS, (result) => {
      const picked = {};
      keys.forEach((key) => {
        picked[key] = result[key];
      });
      callback(picked);
    });
  },

  /**
   * 設定値を保存する
   * @param {object} values 保存したい値 (例: { funEnabled: true })
   * @param {() => void} [callback]
   */
  set(values, callback) {
    chrome.storage.sync.set(values, () => {
      if (callback) callback();
    });
  },

  /**
   * 指定したキーの値を1増やしてから、増えたあとの値を返す
   * (「送信は何回目か」を数えるお楽しみ機能で使用)
   * @param {string} key
   * @param {(nextValue: number) => void} callback
   */
  increment(key, callback) {
    chrome.storage.sync.get(SG_DEFAULT_SETTINGS, (result) => {
      const next = (result[key] || 0) + 1;
      chrome.storage.sync.set({ [key]: next }, () => {
        if (callback) callback(next);
      });
    });
  }
};
