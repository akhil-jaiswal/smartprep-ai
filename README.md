# SmartPrep — Interview practice

A small, offline-first interview practice app built with **HTML, CSS and vanilla JavaScript**. It gives you role-specific prompts, a place to draft an answer, and transparent feedback based on a local scoring rubric.

> The evaluator is a rule-based practice aid, not a generative AI model and not a substitute for a human interviewer. It looks for question-specific keywords and answer signals such as structure, examples, testing, trade-offs and outcomes.

## Run it locally

No installation, package manager, API key or build step is needed.

1. Download or clone this repository.
2. Keep `index.html`, `style.css` and `app.js` in the same folder.
3. Open `index.html` in a modern browser.
4. Choose a role and experience level, generate a prompt, write at least five words, and select **Review my answer**.

The review has a short loading state and is calculated in the browser. Answers are not uploaded or saved by the app. There are no external scripts, fonts, APIs or runtime dependencies.

## What's included

- Seven curated role tracks: Backend Java, Frontend, Data Analyst, Full Stack, QA Automation, DevOps and Product Manager.
- Entry, mid and senior experience levels.
- A custom-role fallback prompt set.
- Question category, context and an interviewer hint.
- Word and character count, clear draft, and keyboard shortcut (`Ctrl`/`Cmd` + `Enter`) to review.
- A 10-point practice score, strengths, improvement prompts and a sample answer.
- Copy sample answer and move to another question.
- Responsive layout for desktop, tablet and mobile.

## Scoring rubric

The displayed 100-point rubric is converted to a score out of 10:

| Area | Weight | What the local evaluator checks |
|---|---:|---|
| Technical coverage | 40 | Relevant keywords attached to the current question |
| Structure & clarity | 25 | An opening/approach and logical sequencing language |
| Practical reasoning | 25 | Signals for examples, testing/measurement, trade-offs and outcomes |
| Communication | 10 | Whether the response contains enough words to explain the idea |

The score is intentionally explainable. It does **not** understand meaning like a language model, verify technical correctness, detect every synonym, or judge spoken delivery. A technically strong answer can receive a lower score if it uses different wording from the rubric. Read the missing-concept feedback as a checklist, not as proof that a concept is absent from your knowledge.

## Project structure

```text
smartprep-ai/
├── index.html   # page structure and content
├── style.css    # layout, typography, colors and responsive rules
├── app.js       # question bank, state, local scoring and interactions
├── README.md    # project documentation
└── .gitignore
```

## Publish with GitHub Pages

1. Create a public GitHub repository.
2. Upload the project files to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.
6. Wait for the Pages deployment to finish and open the URL shown in the Pages settings.

## Git commands

Replace `YOUR-USERNAME` with your GitHub username. Create an empty repository on GitHub first, then run these commands inside this project folder:

```bash
git init
git add .
git commit -m "Build SmartPrep interview practice app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/smartprep-ai.git
git push -u origin main
```

## Suggested demo flow

1. Choose **Backend Java Developer** and **Mid level**.
2. Generate a prompt and explain that it comes from a curated question bank.
3. Enter a short answer first to show that the review asks for more detail.
4. Enter a fuller answer with relevant concepts, a clear sequence, an example, validation and a trade-off.
5. Show the score breakdown and explain why the rubric is transparent.
6. Point out that the app runs locally and does not transmit answer text.

## Possible next improvements

- Add more question packs and synonyms to make keyword matching less brittle.
- Add a user-editable notes or practice-history feature with explicit local-storage controls.
- Add unit tests for each scoring rule and a larger set of example answers.
- If you later want semantic feedback, make it a separate, opt-in feature with a securely hosted backend. This version intentionally has no API integration.

## License

Add a license before accepting contributions or distributing the project beyond your own portfolio.
