(function (root) {
  'use strict';

  const SmartPrep = root.SmartPrep || (root.SmartPrep = {});

  const STORAGE_KEYS = {
    HISTORY: 'smartprep_history_v2',
    BOOKMARKS: 'smartprep_bookmarks_v2',
    NOTES: 'smartprep_notes_v2',
    DRAFT: 'smartprep_draft_v2',
    PREFERENCES: 'smartprep_preferences_v2'
  };

  const ROLES = [
    { id: 'Backend Java Developer', label: 'Backend Java Developer', short: 'Backend Java' },
    { id: 'Frontend Developer', label: 'Frontend Developer', short: 'Frontend' },
    { id: 'Full Stack Developer', label: 'Full Stack Developer', short: 'Full Stack' },
    { id: 'Data Analyst', label: 'Data Analyst', short: 'Data Analyst' },
    { id: 'QA Automation Engineer', label: 'QA Automation Engineer', short: 'QA Automation' },
    { id: 'DevOps Engineer', label: 'DevOps Engineer', short: 'DevOps' },
    { id: 'Product Manager', label: 'Product Manager', short: 'Product' }
  ];

  const EXPERIENCE_LEVELS = {
    'Entry level': {
      label: 'Entry level',
      years: '0–2 years',
      targetWords: [65, 130],
      expectation: 'Focus on clear fundamentals, logical order, and how you verify your work.'
    },
    'Mid level': {
      label: 'Mid level',
      years: '2–5 years',
      targetWords: [95, 180],
      expectation: 'Show ownership by explaining trade-offs, edge cases, and how you validate outcomes.'
    },
    'Senior level': {
      label: 'Senior level',
      years: '5+ years',
      targetWords: [120, 230],
      expectation: 'Demonstrate system-level judgement: constraints, operational risk, alignment, and why you rejected alternatives.'
    }
  };

  const TIMER_PRESETS = [
    { id: '3', label: '3 min', seconds: 180 },
    { id: '5', label: '5 min', seconds: 300 },
    { id: '8', label: '8 min', seconds: 480 },
    { id: '0', label: 'Stopwatch', seconds: 0 }
  ];

  const RUBRIC_WEIGHTS = {
    technical: 40,
    structure: 25,
    practical: 25,
    communication: 10
  };

  const ANSWER_TEMPLATES = {
    structured: [
      'Context & First Check:',
      'I would start by clarifying the baseline metrics and narrowing down the scope...',
      '',
      'Approach & Trade-offs:',
      'Next, I would evaluate the main options and choose...',
      '',
      'Validation & Outcome:',
      'Finally, I would verify the change by measuring...'
    ].join('\n'),
    star: [
      'Situation:',
      'On a recent project, we ran into...',
      '',
      'Task:',
      'My responsibility was to...',
      '',
      'Action:',
      'First, I investigated... Then I implemented... One trade-off we considered was...',
      '',
      'Result:',
      'As a result, we measured...'
    ].join('\n')
  };

  const FONT_SCALES = {
    compact: { label: 'Compact', value: 'compact' },
    standard: { label: 'Standard', value: 'standard' },
    comfortable: { label: 'Large', value: 'comfortable' }
  };

  const Constants = {
    APP_VERSION: '2.1.0',
    MIN_WORDS_TO_EVALUATE: 8,
    MAX_ANSWER_CHARS: 5000,
    SPEAKING_WPM: 130,
    STORAGE_KEYS,
    ROLES,
    EXPERIENCE_LEVELS,
    TIMER_PRESETS,
    RUBRIC_WEIGHTS,
    ANSWER_TEMPLATES,
    FONT_SCALES
  };

  SmartPrep.Constants = Constants;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Constants;
  }
})(typeof window !== 'undefined' ? window : globalThis);
