(function () {
  var STORAGE_KEY = 'portfolio-theme';
  var THEME_DARK = 'dark';
  var THEME_LIGHT = 'light';

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY) || THEME_DARK;
    } catch (e) {
      return THEME_DARK;
    }
  }

  function setTheme(theme) {
    if (theme === THEME_LIGHT) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
    updateToggleIcon(theme);
  }

  function updateToggleIcon(theme) {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.setAttribute('aria-label', theme === THEME_LIGHT ? 'Switch to dark mode' : 'Switch to light mode');
    btn.textContent = theme === THEME_LIGHT ? '\u263E' : '\u263C'; // moon / sun
  }

  function init() {
    var theme = getStoredTheme();
    setTheme(theme);

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'light' ? THEME_DARK : THEME_LIGHT;
        setTheme(next);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
