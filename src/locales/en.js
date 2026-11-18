(function (root) {
  'use strict';

  const SmartPrep = root.SmartPrep || (root.SmartPrep = {});
  const Locales = SmartPrep.Locales || (SmartPrep.Locales = {});

  const en = {
    meta: { code: 'en', name: 'English', nativeName: 'English' },
    brand: { name: 'SmartPrep AI', tagline: 'Interview Workbench' },
    nav: {
      practice: 'Practice Room',
      bank: 'Question Bank',
      history: 'Attempt History',
      notes: 'Prep Notes',
      activeTrack: 'Active Track',
      targetRole: 'Target Role',
      roleTitle: 'Role Title',
      experienceLevel: 'Experience Level',
      saveProgress: 'Save progress locally',
      saveProgressHint: 'Stored in this browser only. Zero uploads.'
    },
    practice: {
      savePrompt: 'Save prompt',
      savedPrompt: 'Saved',
      newPrompt: 'New prompt',
      showHint: 'Show interviewer hint',
      hideHint: 'Hide interviewer hint',
      yourResponse: 'Your Response',
      outlineBtn: 'Outline',
      starBtn: 'STAR',
      clearBtn: 'Clear',
      placeholder: 'Walk through your answer clearly as you would in an interview:\n1. What you clarify or measure first\n2. Your chosen approach and key trade-offs\n3. How you test, monitor, and verify the outcome',
      draftSaved: 'Draft saved locally',
      saving: 'Saving...',
      shortcutHint: 'Press Ctrl + Enter to evaluate',
      evaluateBtn: 'Evaluate Answer',
      evaluatingBtn: 'Evaluating...',
      rubricTitle: 'Rubric Evaluation',
      conceptChecklist: 'Concept Checklist',
      workedWell: 'What worked well',
      improvements: 'Suggested improvements',
      refAnswerTab: 'Reference Answer',
      compareTab: 'Compare Side-by-Side',
      copyExample: 'Copy example',
      exportMd: 'Export .md',
      reviseBtn: 'Revise answer',
      nextPromptBtn: 'Next prompt',
      levelExpectations: 'Level Expectations',
      recommendedLength: 'Recommended length',
      scoringRubric: 'Scoring Rubric',
      trackProgress: 'Track Progress',
      promptsPracticed: 'Prompts practiced',
      trackAverage: 'Track average',
      savedBookmarks: 'Saved bookmarks',
      browseBank: 'Browse Question Bank',
      timerStart: 'Start',
      timerPause: 'Pause',
      timerResume: 'Resume'
    },
    bank: {
      heading: 'Question Bank',
      subtitle: 'Browse curated interview prompts, filter by role or seniority, and jump straight into practice.',
      searchPlaceholder: 'Search prompts, categories, or concepts (e.g. caching, SQL, SLO)...',
      allRoles: 'All roles',
      allLevels: 'All levels',
      savedOnly: 'Saved only',
      practiceBtn: 'Practice',
      emptyTitle: 'No prompts match those filters',
      emptyDesc: 'Try clearing your search term or switching back to all roles.',
      resetFilters: 'Reset filters'
    },
    history: {
      heading: 'Attempt History',
      subtitle: 'Review previous practice answers, compare scores by role, and export your progress.',
      exportJson: 'Export JSON',
      clearHistory: 'Clear history',
      totalAttempts: 'Total Attempts',
      averageScore: 'Average Score',
      highestScore: 'Highest Score',
      uniquePrompts: 'Unique Prompts',
      avgByRole: 'Average Score by Role',
      recordedAttempts: 'Recorded Attempts',
      emptyTitle: 'No attempts recorded yet',
      emptyDesc: 'Complete and evaluate an answer in the Practice Room to track your progress here.',
      goPractice: 'Go to Practice Room'
    },
    notes: {
      heading: 'Prep Notes & Frameworks',
      subtitle: 'Keep your real project stories, metrics, and role scratchpad notes stored privately in this browser.',
      exportNotes: 'Export Notes (.md)',
      notebookSection: 'Notebook Section',
      clearNote: 'Clear note',
      placeholder: 'Write down real project metrics, production incidents you solved, architecture trade-offs, or questions for your interviewer...'
    },
    shortcuts: {
      title: 'Keyboard Shortcuts',
      evaluate: 'Evaluate current answer',
      next: 'Load next prompt',
      hint: 'Toggle interviewer hint',
      timer: 'Start / pause timer',
      openDialog: 'Open keyboard shortcuts',
      closeDialog: 'Close dialog or menu'
    }
  };

  Locales.en = en;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = en;
  }
})(typeof window !== 'undefined' ? window : globalThis);
