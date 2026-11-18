# SmartPrep AI — Interview Practice Workbench

**SmartPrep AI** is a clean, offline-first technical and product interview practice application built with **modular JavaScript, Tailwind CSS, and multi-language support (EN / हिन्दी / ES / FR)**. No sign-up, login, or API key is required — open it and start practising immediately.

## Key Features

- **Instant Practice (Zero Login Friction):** Opens directly into the Practice Room with 28+ curated prompts across 7 roles (+ Custom role).
- **Multi-Language Interface (`src/locales/`):** Instant switching between **English**, **हिन्दी (Hindi)**, **Español (Spanish)**, and **Français (French)** from the top bar.
- **Readable, Clean UI (`Tailwind CSS` + Layered Design System):** Bold **SmartPrep AI** top header, generous typography (`16px` body, `17px` editor, `24px` prompt headings), live `A-` / `A` / `A+` text-size scaling, and Light/Dark themes.
- **Practice Room:** Countdown/stopwatch interview timer, collapsible spoiler-free interviewer hints, Outline & STAR quick templates, speaking-time estimator, synonym-aware Concept Checklist pills, and Side-by-Side Reference Answer comparison.
- **Question Bank, Attempt History & Prep Notes:** Search/filter/bookmark prompts, track KPIs and average score by role, export attempts to Markdown (`.md`) or history to JSON, and save per-role STAR project notes locally.

## Folder Structure

```text
smartprep-ai/
├── index.html
├── package.json
├── tailwind.config.js
├── .editorconfig
├── .gitignore
├── README.md
├── assets/
│   └── icons/
│       └── favicon.svg
├── docs/
│   ├── architecture.md
│   ├── i18n-guide.md
│   └── scoring-rubric.md
├── src/
│   ├── locales/
│   │   ├── en.js
│   │   ├── hi.js
│   │   ├── es.js
│   │   └── fr.js
│   ├── styles/
│   │   ├── tailwind.css
│   │   ├── tokens.css
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── views.css
│   │   └── responsive.css
│   └── js/
│       ├── config/
│       │   └── constants.js
│       ├── i18n/
│       │   └── i18n.js
│       ├── data/
│       │   ├── roles-engineering.js
│       │   ├── roles-product-data.js
│       │   └── question-bank.js
│       ├── core/
│       │   ├── evaluator.js
│       │   ├── timer.js
│       │   └── state.js
│       ├── services/
│       │   ├── storage.js
│       │   └── exporter.js
│       ├── utils/
│       │   ├── dom.js
│       │   └── format.js
│       ├── views/
│       │   ├── practice-view.js
│       │   ├── bank-view.js
│       │   ├── history-view.js
│       │   └── notes-view.js
│       └── main.js
└── tests/
    ├── evaluator.test.js
    ├── i18n.test.js
    └── question-bank.test.js
```

## Quick Start

- **Direct open:** Double-click `index.html` in any modern browser.
- **Local server:** Run `npm run dev` and open `http://localhost:4173`.
- **Unit tests:** Run `npm test`.

## Documentation
- [Architecture Overview](docs/architecture.md)
- [Internationalization Guide](docs/i18n-guide.md)
- [Scoring Rubric](docs/scoring-rubric.md)
