(function (root) {
  'use strict';

  const SmartPrep = root.SmartPrep || (root.SmartPrep = {});

  function getLocalesMap() {
    if (SmartPrep.Locales && Object.keys(SmartPrep.Locales).length) {
      return SmartPrep.Locales;
    }
    if (typeof module !== 'undefined' && module.exports) {
      return {
        en: require('../../locales/en'),
        hi: require('../../locales/hi'),
        es: require('../../locales/es'),
        fr: require('../../locales/fr')
      };
    }
    return {};
  }

  let activeLang = 'en';

  function resolvePath(obj, path) {
    if (!obj || !path) return undefined;
    return String(path).split('.').reduce((acc, part) => {
      return acc && acc[part] !== undefined ? acc[part] : undefined;
    }, obj);
  }

  function getSupportedLanguages() {
    const map = getLocalesMap();
    return Object.keys(map).map((code) => ({
      code,
      name: (map[code].meta && map[code].meta.name) || code,
      nativeName: (map[code].meta && map[code].meta.nativeName) || code
    }));
  }

  function setLanguage(code) {
    const map = getLocalesMap();
    if (map[code]) {
      activeLang = code;
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = code;
      }
    }
    return activeLang;
  }

  function getLanguage() {
    return activeLang;
  }

  function t(key, fallback) {
    const map = getLocalesMap();
    const current = resolvePath(map[activeLang], key);
    if (typeof current === 'string') return current;
    const eng = resolvePath(map.en, key);
    if (typeof eng === 'string') return eng;
    return fallback !== undefined ? fallback : key;
  }

  function applyTranslations(container) {
    if (typeof document === 'undefined') return;
    const scope = container || document;

    scope.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.getAttribute('data-i18n');
      const translated = t(key);
      if (translated && translated !== key) {
        node.textContent = translated;
      }
    });

    scope.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
      const key = node.getAttribute('data-i18n-placeholder');
      const translated = t(key);
      if (translated && translated !== key) {
        node.setAttribute('placeholder', translated);
      }
    });
  }

  const I18n = {
    getSupportedLanguages,
    setLanguage,
    getLanguage,
    t,
    applyTranslations
  };

  SmartPrep.I18n = I18n;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
  }
})(typeof window !== 'undefined' ? window : globalThis);
