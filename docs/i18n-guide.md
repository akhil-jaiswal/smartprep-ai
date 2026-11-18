# Internationalization (i18n) Guide

SmartPrep AI ships with built-in multi-language UI support across four locales stored under `src/locales/`:

| Code | Language | File |
| --- | --- | --- |
| `en` | English | `src/locales/en.js` |
| `hi` | हिन्दी (Hindi) | `src/locales/hi.js` |
| `es` | Español (Spanish) | `src/locales/es.js` |
| `fr` | Français (French) | `src/locales/fr.js` |

## How Translation Works

1. Each locale registers its dictionary under `window.SmartPrep.Locales[code]` and exports it for Node tests.
2. `src/js/i18n/i18n.js` exposes `I18n.setLanguage(code)`, `I18n.t(key)`, and `I18n.applyTranslations()`.
3. Static HTML text and placeholders declare `data-i18n="section.key"` and `data-i18n-placeholder="section.key"`.
4. Switching the language selector in the top bar updates the UI immediately and persists the choice locally.

## Adding a New Language

1. Duplicate `src/locales/en.js` to `src/locales/<code>.js` and translate all values.
2. Register the new script tag in `index.html` and add an `<option>` to `#topbarLangSelect`.
3. Add the locale to `tests/i18n.test.js` and run `npm test` to verify 100% key parity.
