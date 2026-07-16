document.addEventListener('DOMContentLoaded', () => {
  // data-i18n がついた要素に、_locales の文言を反映する
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const text = chrome.i18n.getMessage(key);
    if (text) el.textContent = text;
  });

  const funToggle = document.getElementById('funToggle');

  chrome.storage.sync.get({ funEnabled: false }, (result) => {
    funToggle.checked = result.funEnabled;
  });

  funToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ funEnabled: funToggle.checked });
  });
});
