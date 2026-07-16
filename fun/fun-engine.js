// fun/fun-engine.js
// fun/comments.js のデータを使って、実際に画面に一言コメントを表示する役割。
// 「何を表示するか(comments.js)」と「どう表示するか(このファイル)」を
// 分けているので、表示の演出だけ後から変えたい時もここだけ触ればいい。

window.SendGuard = window.SendGuard || {};

window.SendGuard.funEngine = {
  showRandomComment() {
    const list = window.SendGuardComments || [];
    if (list.length === 0) return;

    // rare なコメントほど出現率を下げるための重み付け抽選
    const pool = [];
    list.forEach((item) => {
      const weight = item.rare ? 1 : 6;
      for (let i = 0; i < weight; i++) pool.push(item);
    });

    const picked = pool[Math.floor(Math.random() * pool.length)];
    this._showToast(picked);
  },

  _showToast(item) {
    const el = document.createElement('div');
    el.className = 'sg-toast';
    el.textContent = `${item.emoji ? item.emoji + ' ' : ''}${item.text}`;
    document.body.appendChild(el);

    // 少し遅らせてからフェードイン(要素が確実にDOMに載ってから)
    requestAnimationFrame(() => el.classList.add('sg-toast-show'));

    setTimeout(() => {
      el.classList.remove('sg-toast-show');
      setTimeout(() => el.remove(), 300);
    }, 1400);
  }
};
