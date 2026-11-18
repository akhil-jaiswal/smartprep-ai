# Architecture Overview

SmartPrep AI is a modular vanilla JavaScript + Tailwind CSS interview practice workbench organized by clear domain boundaries with zero build step and zero runtime dependencies.

## Directory Responsibilities

| Path | Responsibility |
| --- | --- |
| `index.html` | Application shell with bold top-bar brand header, Tailwind CDN config, four workspace views, and ordered module scripts. |
| `tailwind.config.js` | Tailwind CSS theme tokens, custom brand palette, and typography configuration. |
| `assets/icons/` | Static brand icons (`favicon.svg`). |
| `src/locales/` | Multi-language translation dictionaries (`en.js`, `hi.js`, `es.js`, `fr.js`). |
| `src/styles/` | Tailwind entry (`tailwind.css`) plus layered stylesheets (`tokens.css`, `base.css`, `layout.css`, `components.css`, `views.css`, `responsive.css`). |
| `src/js/config/` | Shared constants, roles, experience levels, timer presets, and outline templates (`constants.js`). |
| `src/js/i18n/` | Multi-language translation engine (`i18n.js`). |
| `src/js/data/` | Curated role prompts (`roles-engineering.js`, `roles-product-data.js`) and bank query utilities (`question-bank.js`). |
| `src/js/core/` | Domain engines: synonym-aware rubric evaluator (`evaluator.js`), timer (`timer.js`), and reactive state store (`state.js`). |
| `src/js/services/` | Browser storage (`storage.js`) and Markdown/JSON exporters (`exporter.js`). |
| `src/js/utils/` | Stateless DOM helpers (`dom.js`) and formatters (`format.js`). |
| `src/js/views/` | Self-contained UI controllers (`practice-view.js`, `bank-view.js`, `history-view.js`, `notes-view.js`). |
| `src/js/main.js` | Bootstrapper: state hydration, view orchestration, language/theme/font controls, and keyboard shortcuts. |
| `tests/` | Automated Node test suite covering i18n key parity, evaluator rubric, and question bank integrity. |
