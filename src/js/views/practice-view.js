(function (root) {
  'use strict';

  const SmartPrep = root.SmartPrep || (root.SmartPrep = {});

  function createPracticeView(ctx) {
    const { store, timer, actions } = ctx;
    const { Constants, Evaluator, Format, DOM, Exporter, QuestionBank, I18n } = SmartPrep;

    const els = {
      promptCounter: document.getElementById('promptCounter'),
      bookmarkPromptBtn: document.getElementById('bookmarkPromptBtn'),
      bookmarkBtnLabel: document.getElementById('bookmarkBtnLabel'),
      nextPromptBtn: document.getElementById('nextPromptBtn'),

      timerPresetSelect: document.getElementById('timerPresetSelect'),
      timerDisplay: document.getElementById('timerDisplay'),
      timerToggleBtn: document.getElementById('timerToggleBtn'),
      timerResetBtn: document.getElementById('timerResetBtn'),

      questionCategory: document.getElementById('questionCategory'),
      questionDifficulty: document.getElementById('questionDifficulty'),
      questionDuration: document.getElementById('questionDuration'),
      questionPreviousBest: document.getElementById('questionPreviousBest'),
      questionText: document.getElementById('questionText'),
      questionContext: document.getElementById('questionContext'),
      toggleHintBtn: document.getElementById('toggleHintBtn'),
      hintPanel: document.getElementById('hintPanel'),
      interviewerHint: document.getElementById('interviewerHint'),

      insertOutlineBtn: document.getElementById('insertOutlineBtn'),
      insertStarBtn: document.getElementById('insertStarBtn'),
      clearDraftBtn: document.getElementById('clearDraftBtn'),
      answerInput: document.getElementById('answerInput'),
      wordCount: document.getElementById('wordCount'),
      speakingTime: document.getElementById('speakingTime'),
      charCount: document.getElementById('charCount'),
      autosaveStatus: document.getElementById('autosaveStatus'),
      evaluateBtn: document.getElementById('evaluateBtn'),
      inlineMessage: document.getElementById('inlineMessage'),

      resultsSection: document.getElementById('resultsSection'),
      resultsHeading: document.getElementById('resultsHeading'),
      scoreDescription: document.getElementById('scoreDescription'),
      scorePill: document.getElementById('scorePill'),
      scoreValue: document.getElementById('scoreValue'),
      overallScoreBar: document.getElementById('overallScoreBar'),
      reviewSummary: document.getElementById('reviewSummary'),

      technicalScore: document.getElementById('technicalScore'),
      technicalBar: document.getElementById('technicalBar'),
      structureScore: document.getElementById('structureScore'),
      structureBar: document.getElementById('structureBar'),
      practicalScore: document.getElementById('practicalScore'),
      practicalBar: document.getElementById('practicalBar'),
      communicationScore: document.getElementById('communicationScore'),
      communicationBar: document.getElementById('communicationBar'),

      conceptPills: document.getElementById('conceptPills'),
      strengthList: document.getElementById('strengthList'),
      gapList: document.getElementById('gapList'),

      tabRefOnly: document.getElementById('tabRefOnly'),
      tabRefCompare: document.getElementById('tabRefCompare'),
      referenceSingleView: document.getElementById('referenceSingleView'),
      referenceCompareView: document.getElementById('referenceCompareView'),
      modelAnswerText: document.getElementById('modelAnswerText'),
      compareUserText: document.getElementById('compareUserText'),
      compareModelText: document.getElementById('compareModelText'),
      copyExampleBtn: document.getElementById('copyExampleBtn'),
      exportAttemptBtn: document.getElementById('exportAttemptBtn'),
      reviseDraftBtn: document.getElementById('reviseDraftBtn'),
      nextAfterReviewBtn: document.getElementById('nextAfterReviewBtn'),

      railLevelTitle: document.getElementById('railLevelTitle'),
      railLevelYears: document.getElementById('railLevelYears'),
      railLevelExpectation: document.getElementById('railLevelExpectation'),
      railTargetWords: document.getElementById('railTargetWords'),
      railTrackCovered: document.getElementById('railTrackCovered'),
      railTrackAverage: document.getElementById('railTrackAverage'),
      railBookmarkCount: document.getElementById('railBookmarkCount'),
      railOpenBankBtn: document.getElementById('railOpenBankBtn')
    };

    let draftSaveTimer = null;
    let isEvaluating = false;

    function setInlineMessage(msg) {
      if (!msg) {
        els.inlineMessage.textContent = '';
        els.inlineMessage.hidden = true;
      } else {
        els.inlineMessage.textContent = msg;
        els.inlineMessage.hidden = false;
      }
    }

    function updateWordMetrics() {
      const value = els.answerInput.value;
      const words = Evaluator.countWords(value);
      const speakingSec = Evaluator.estimateSpeakingSeconds(words);
      els.wordCount.textContent = String(words);
      els.speakingTime.textContent = Format.formatSpeakingTime(speakingSec);
      els.charCount.textContent = `${value.length} / ${Constants.MAX_ANSWER_CHARS} chars`;
      els.evaluateBtn.disabled = isEvaluating || words < Constants.MIN_WORDS_TO_EVALUATE || !store.getState().currentQuestion;
    }

    function setHintVisibility(expanded) {
      els.toggleHintBtn.setAttribute('aria-expanded', String(expanded));
      els.toggleHintBtn.querySelector('span').textContent = I18n.t(expanded ? 'practice.hideHint' : 'practice.showHint');
      els.hintPanel.hidden = !expanded;
    }

    function setReferenceTab(mode) {
      const isCompare = mode === 'compare';
      els.tabRefOnly.classList.toggle('is-active', !isCompare);
      els.tabRefOnly.setAttribute('aria-selected', String(!isCompare));
      els.tabRefCompare.classList.toggle('is-active', isCompare);
      els.tabRefCompare.setAttribute('aria-selected', String(isCompare));
      els.referenceSingleView.hidden = isCompare;
      els.referenceCompareView.hidden = !isCompare;
    }

    function renderTimer(snapshot) {
      els.timerDisplay.textContent = Format.formatTimer(snapshot.displaySeconds);
      els.timerDisplay.classList.toggle('is-warning', snapshot.isWarning);
      els.timerDisplay.classList.toggle('is-finished', snapshot.finished);
      const timerKey = snapshot.running
        ? 'practice.timerPause'
        : snapshot.elapsedSeconds > 0 && !snapshot.finished
          ? 'practice.timerResume'
          : 'practice.timerStart';
      els.timerToggleBtn.textContent = I18n.t(timerKey);
      if (snapshot.finished) {
        DOM.showToast('Time is up. Finish your thought and evaluate whenever ready.');
      }
    }

    function renderResults(result, userAnswerText) {
      if (!result) {
        els.resultsSection.hidden = true;
        return;
      }

      const toneClass = Format.getScoreToneClass(result.score);
      els.resultsHeading.textContent = result.label;
      els.scoreDescription.textContent = result.description;
      els.scoreValue.textContent = Format.formatScore(result.score);
      els.scorePill.className = `score-pill ${toneClass}`;

      els.overallScoreBar.className = `progress-fill ${toneClass}`;
      els.overallScoreBar.style.width = `${Math.round(result.score * 10)}%`;
      els.reviewSummary.textContent = result.summary;

      const b = result.breakdown;
      els.technicalScore.textContent = `${b.technical} / 40`;
      els.technicalBar.style.width = `${Math.round((b.technical / 40) * 100)}%`;

      els.structureScore.textContent = `${b.structure} / 25`;
      els.structureBar.style.width = `${Math.round((b.structure / 25) * 100)}%`;

      els.practicalScore.textContent = `${b.practical} / 25`;
      els.practicalBar.style.width = `${Math.round((b.practical / 25) * 100)}%`;

      els.communicationScore.textContent = `${b.communication} / 10`;
      els.communicationBar.style.width = `${Math.round((b.communication / 10) * 100)}%`;

      // Render concept pills
      els.conceptPills.replaceChildren();
      result.matchedConcepts.forEach((label) => {
        els.conceptPills.appendChild(
          DOM.el('span', { className: 'concept-pill is-hit', text: `✓ ${label}` })
        );
      });
      result.missedConcepts.forEach((label) => {
        els.conceptPills.appendChild(
          DOM.el('span', { className: 'concept-pill is-miss', text: `+ ${label}` })
        );
      });

      // Render strengths & gaps
      els.strengthList.replaceChildren();
      result.strengths.forEach((item) => {
        els.strengthList.appendChild(DOM.el('li', { text: item }));
      });

      els.gapList.replaceChildren();
      result.gaps.forEach((item) => {
        els.gapList.appendChild(DOM.el('li', { text: item }));
      });

      // Reference & side-by-side comparison
      els.modelAnswerText.textContent = result.modelAnswer;
      els.compareModelText.textContent = result.modelAnswer;
      els.compareUserText.textContent = userAnswerText || '';

      els.resultsSection.hidden = false;
    }

    function renderRail(state) {
      const levelInfo = Constants.EXPERIENCE_LEVELS[state.experienceLevel] || Constants.EXPERIENCE_LEVELS['Mid level'];
      els.railLevelTitle.textContent = levelInfo.label;
      els.railLevelYears.textContent = levelInfo.years;
      els.railLevelExpectation.textContent = levelInfo.expectation;
      els.railTargetWords.textContent = `${levelInfo.targetWords[0]}–${levelInfo.targetWords[1]} words`;

      const activeRole = actions.getEffectiveRole();
      const pool = QuestionBank.getPoolForRole(activeRole);
      const roleAttempts = state.history.filter((entry) => entry.role === activeRole);
      const coveredIds = new Set(roleAttempts.map((entry) => entry.questionId));

      els.railTrackCovered.textContent = `${coveredIds.size} / ${pool.length}`;
      if (roleAttempts.length) {
        const avg = roleAttempts.reduce((sum, item) => sum + item.score, 0) / roleAttempts.length;
        els.railTrackAverage.textContent = `${avg.toFixed(1)} / 10`;
      } else {
        els.railTrackAverage.textContent = '—';
      }
      els.railBookmarkCount.textContent = String(state.bookmarks.length);
    }

    function render(state) {
      const q = state.currentQuestion;
      if (!q) return;

      const activeRole = actions.getEffectiveRole();
      const pool = QuestionBank.getPoolForRole(activeRole);
      const idx = Math.max(0, pool.findIndex((item) => item.id === q.id));
      els.promptCounter.textContent = `Prompt ${idx + 1} of ${pool.length}`;

      els.questionCategory.textContent = q.category;
      els.questionDifficulty.textContent = q.difficulty;
      els.questionDuration.textContent = `~${q.estimatedMinutes || 5} min target`;
      els.questionText.textContent = q.question;
      els.questionContext.textContent = q.context;
      els.interviewerHint.textContent = q.hint;

      // Best previous score badge for this question
      const pastForQuestion = state.history.filter((h) => h.questionId === q.id);
      if (pastForQuestion.length) {
        const best = Math.max(...pastForQuestion.map((h) => h.score));
        els.questionPreviousBest.textContent = `Best: ${Format.formatScore(best)} / 10`;
        els.questionPreviousBest.hidden = false;
      } else {
        els.questionPreviousBest.hidden = true;
      }

      // Bookmark state
      const isBookmarked = state.bookmarks.includes(q.id);
      els.bookmarkPromptBtn.setAttribute('aria-pressed', String(isBookmarked));
      els.bookmarkBtnLabel.textContent = I18n.t(isBookmarked ? 'practice.savedPrompt' : 'practice.savePrompt');

      // Keep hint toggle label synced with active language
      const hintOpen = els.toggleHintBtn.getAttribute('aria-expanded') === 'true';
      els.toggleHintBtn.querySelector('span').textContent = I18n.t(hintOpen ? 'practice.hideHint' : 'practice.showHint');

      // Sync textarea only when question changed externally
      if (els.answerInput.dataset.questionId !== q.id) {
        els.answerInput.dataset.questionId = q.id;
        els.answerInput.value = state.draftText || '';
        setHintVisibility(false);
        setReferenceTab('single');
        setInlineMessage('');
      }

      updateWordMetrics();
      renderResults(state.lastEvaluation, state.lastAttempt ? state.lastAttempt.answerText : els.answerInput.value);
      renderRail(state);
    }

    function insertTemplate(templateKey) {
      const template = Constants.ANSWER_TEMPLATES[templateKey];
      if (!template) return;
      const existing = els.answerInput.value.trim();
      if (existing && !window.confirm('Replace your current draft with the structure template?')) {
        return;
      }
      els.answerInput.value = template;
      actions.updateDraft(template);
      updateWordMetrics();
      els.answerInput.focus();
      DOM.showToast(templateKey === 'star' ? 'STAR outline inserted.' : 'Structured outline inserted.');
    }

    async function runEvaluation() {
      const state = store.getState();
      const question = state.currentQuestion;
      const answerText = els.answerInput.value.trim();

      if (!question) {
        setInlineMessage('Load a prompt before evaluating.');
        return;
      }
      const words = Evaluator.countWords(answerText);
      if (words < Constants.MIN_WORDS_TO_EVALUATE) {
        setInlineMessage(`Write at least ${Constants.MIN_WORDS_TO_EVALUATE} words so the rubric has enough context to review.`);
        return;
      }

      setInlineMessage('');
      isEvaluating = true;
      els.evaluateBtn.classList.add('is-loading');
      els.evaluateBtn.disabled = true;
      els.evaluateBtn.querySelector('.btn-label').textContent = I18n.t('practice.evaluatingBtn');
      timer.pause();

      await new Promise((resolve) => setTimeout(resolve, 420));

      const result = Evaluator.evaluateAnswer(answerText, question, state.experienceLevel);
      const timerSnap = timer.getSnapshot();

      const attempt = {
        id: `att-${Date.now()}`,
        questionId: question.id,
        role: actions.getEffectiveRole(),
        category: question.category,
        difficulty: question.difficulty,
        level: state.experienceLevel,
        questionText: question.question,
        answerText,
        score: result.score,
        label: result.label,
        breakdown: result.breakdown,
        matchedConcepts: result.matchedConcepts,
        missedConcepts: result.missedConcepts,
        strengths: result.strengths,
        gaps: result.gaps,
        modelAnswer: result.modelAnswer,
        wordCount: result.wordCount,
        elapsedSeconds: timerSnap.elapsedSeconds,
        createdAt: result.evaluatedAt
      };

      actions.recordEvaluation(result, attempt);

      isEvaluating = false;
      els.evaluateBtn.classList.remove('is-loading');
      els.evaluateBtn.querySelector('.btn-label').textContent = I18n.t('practice.evaluateBtn');
      updateWordMetrics();

      els.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function bindEvents() {
      els.bookmarkPromptBtn.addEventListener('click', () => {
        const q = store.getState().currentQuestion;
        if (q) actions.toggleBookmark(q.id);
      });

      els.nextPromptBtn.addEventListener('click', () => {
        actions.loadNextQuestion();
      });

      els.timerPresetSelect.addEventListener('change', (e) => {
        const seconds = Number(e.target.value) || 0;
        actions.setTimerPreset(seconds);
      });

      els.timerToggleBtn.addEventListener('click', () => timer.toggle());
      els.timerResetBtn.addEventListener('click', () => timer.reset());

      els.toggleHintBtn.addEventListener('click', () => {
        const isOpen = els.toggleHintBtn.getAttribute('aria-expanded') === 'true';
        setHintVisibility(!isOpen);
      });

      els.insertOutlineBtn.addEventListener('click', () => insertTemplate('structured'));
      els.insertStarBtn.addEventListener('click', () => insertTemplate('star'));

      els.clearDraftBtn.addEventListener('click', () => {
        if (!els.answerInput.value.trim()) return;
        els.answerInput.value = '';
        actions.updateDraft('');
        updateWordMetrics();
        setInlineMessage('');
        els.answerInput.focus();
      });

      els.answerInput.addEventListener('input', () => {
        updateWordMetrics();
        els.autosaveStatus.textContent = I18n.t('practice.saving');
        clearTimeout(draftSaveTimer);
        draftSaveTimer = setTimeout(() => {
          actions.updateDraft(els.answerInput.value);
          els.autosaveStatus.textContent = I18n.t('practice.draftSaved');
        }, 350);
      });

      els.answerInput.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && !els.evaluateBtn.disabled) {
          event.preventDefault();
          runEvaluation();
        }
      });

      els.evaluateBtn.addEventListener('click', runEvaluation);

      els.tabRefOnly.addEventListener('click', () => setReferenceTab('single'));
      els.tabRefCompare.addEventListener('click', () => setReferenceTab('compare'));

      els.copyExampleBtn.addEventListener('click', async () => {
        const ok = await Exporter.copyText(els.modelAnswerText.textContent);
        DOM.showToast(ok ? 'Reference answer copied to clipboard.' : 'Clipboard copy was blocked.');
      });

      els.exportAttemptBtn.addEventListener('click', () => {
        const attempt = store.getState().lastAttempt;
        if (!attempt) return;
        Exporter.exportAttemptMarkdown(attempt);
        DOM.showToast('Practice report exported as Markdown.');
      });

      els.reviseDraftBtn.addEventListener('click', () => {
        els.answerInput.focus();
        els.answerInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });

      els.nextAfterReviewBtn.addEventListener('click', () => {
        actions.loadNextQuestion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      els.railOpenBankBtn.addEventListener('click', () => actions.switchView('bank'));
    }

    bindEvents();

    return {
      render,
      renderTimer,
      toggleHint: () => {
        const isOpen = els.toggleHintBtn.getAttribute('aria-expanded') === 'true';
        setHintVisibility(!isOpen);
      },
      focusEditor: () => els.answerInput.focus({ preventScroll: true })
    };
  }

  SmartPrep.PracticeView = { createPracticeView };
})(typeof window !== 'undefined' ? window : globalThis);
