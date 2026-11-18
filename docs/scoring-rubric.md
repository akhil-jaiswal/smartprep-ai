# Scoring Rubric Specification

SmartPrep evaluates answers deterministically in the browser using a transparent 100-point rubric scaled to a 10-point practice score (rounded to the nearest `0.5`).

## Criteria & Weights

| Criterion | Weight | What is Checked |
| --- | ---: | --- |
| Technical coverage | 40 pts | Matches concept groups attached to each prompt. Each concept includes multiple common synonyms so valid phrasing is recognized. |
| Structure & clarity | 25 pts | Checks for an explicit opening/framing, sequential progression markers, a closing/follow-up signal, and clear paragraphing. |
| Practical reasoning | 25 pts | Looks for four signals: concrete examples, testing/validation or measurement, trade-offs/alternatives, and observable outcomes. |
| Depth & pacing | 10 pts | Compares word count against the target range for the selected experience level (`Entry`, `Mid`, or `Senior`), with a gentle check against excessive length. |

## Level Calibration

- **Entry level (0–2 yrs):** Target 65–130 words. Focuses on clear fundamentals, sensible order, and basic verification.
- **Mid level (2–5 yrs):** Target 95–180 words. Flags missing trade-offs or risk discussion.
- **Senior level (5+ yrs):** Target 120–230 words. Applies small score adjustments if trade-offs or verification/measurement are omitted.

## Known Limitations

This evaluator is a deterministic practice aid, not a human interviewer or semantic AI model. It cannot verify factual accuracy, judge spoken tone, or catch every domain synonym. Treat missed concept pills as a self-review checklist rather than an absolute grade.
