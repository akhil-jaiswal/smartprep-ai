(function (root) {
  'use strict';

  const SmartPrep = root.SmartPrep || (root.SmartPrep = {});

  const VIEW_TITLE_KEYS = {
    practice: 'nav.practice',
    bank: 'nav.bank',
    history: 'nav.history',
    notes: 'nav.notes'
  };

  function bootstrap() {
    const {
      QuestionBank,
      Storage,
      I18n,
      State,
      Timer,
      DOM,
      PracticeView,
      BankView,
      HistoryView,
      NotesView
    } = SmartPrep;

    const prefs = Storage.loadPreferences();
    const savedHistory = Storage.loadHistory();
    const savedBookmarks = Storage.loadBookmarks();
    const savedNotes = Storage.loadNotes();
    const savedDraft = Storage.loadDraft();

    const effectiveInitialRole = prefs.role === 'custom'
      ? (prefs.customRole.trim() || 'Software Engineer')
      : prefs.role;

    let initialQuestion = savedDraft.questionId
      ? QuestionBank.getQuestionById(savedDraft.questionId, effectiveInitialRole)
      : null;

    if (!initialQuestion) {
      const pool = QuestionBank.getPoolForRole(effectiveInitialRole);
      initialQuestion = pool[0] || QuestionBank.getAllQuestions()[0];
    }

    const store = State.createStore({
      activeView: 'practice',
      selectedRole: prefs.role,
      customRole: prefs.customRole,
      experienceLevel: prefs.experienceLevel,
      timerPreset: prefs.timerPreset,
      theme: prefs.theme,
      fontScale: prefs.fontScale,
      language: prefs.language || 'en',
      saveHistory: prefs.saveHistory,
      currentQuestion: initialQuestion,
      draftText: savedDraft.questionId === initialQuestion.id ? savedDraft.text : '',
      lastEvaluation: null,
      lastAttempt: null,
      history: savedHistory,
      bookmarks: savedBookmarks,
      notes: savedNotes
    });

    const shellEls = {
      sidebar: document.getElementById('sidebar'),
      sidebarBackdrop: document.getElementById('sidebarBackdrop'),
      mobileMenuBtn: document.getElementById('mobileMenuBtn'),
      closeSidebarBtn: document.getElementById('closeSidebarBtn'),
      navItems: Array.from(document.querySelectorAll('.nav-item[data-view]')),
      viewSections: {
        practice: document.getElementById('view-practice'),
        bank: document.getElementById('view-bank'),
        history: document.getElementById('view-history'),
        notes: document.getElementById('view-notes')
      },
      navBankCount: document.getElementById('navBankCount'),
      navHistoryCount: document.getElementById('navHistoryCount'),
      topbarViewTitle: document.getElementById('topbarViewTitle'),
      topbarContext: document.getElementById('topbarContext'),
      topbarLangSelect: document.getElementById('topbarLangSelect'),
      roleSelect: document.getElementById('roleSelect'),
      customRoleGroup: document.getElementById('customRoleGroup'),
      customRoleInput: document.getElementById('customRoleInput'),
      levelSelect: document.getElementById('levelSelect'),
      saveHistoryToggle: document.getElementById('saveHistoryToggle'),
      scaleButtons: Array.from(document.querySelectorAll('.scale-btn[data-scale]')),
      themeToggleBtn: document.getElementById('themeToggleBtn'),
      shortcutsBtn: document.getElementById('shortcutsBtn'),
      shortcutsModal: document.getElementById('shortcutsModal'),
      closeShortcutsBtn: document.getElementById('closeShortcutsBtn'),
      timerPresetSelect: document.getElementById('timerPresetSelect')
    };

    function persistPreferences(state) {
      Storage.savePreferences({
        role: state.selectedRole,
        customRole: state.customRole,
        experienceLevel: state.experienceLevel,
        timerPreset: state.timerPreset,
        theme: state.theme,
        fontScale: state.fontScale,
        language: state.language,
        saveHistory: state.saveHistory
      });
    }

    function getEffectiveRole() {
      const s = store.getState();
      if (s.selectedRole === 'custom') {
        return s.customRole.trim() || 'Software Engineer';
      }
      return s.selectedRole;
    }

    function applyVisualPreferences(state) {
      document.documentElement.setAttribute('data-theme', state.theme || 'light');
      document.documentElement.setAttribute('data-font-scale', state.fontScale || 'standard');
      I18n.setLanguage(state.language || 'en');
      I18n.applyTranslations();
      shellEls.topbarLangSelect.value = state.language || 'en';
      shellEls.scaleButtons.forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.scale === state.fontScale);
      });
    }

    function closeMobileSidebar() {
      shellEls.sidebar.classList.remove('is-open');
      shellEls.sidebarBackdrop.hidden = true;
      shellEls.mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }

    function openMobileSidebar() {
      shellEls.sidebar.classList.add('is-open');
      shellEls.sidebarBackdrop.hidden = false;
      shellEls.mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }

    function setShortcutsModalOpen(open) {
      shellEls.shortcutsModal.hidden = !open;
      if (open) shellEls.closeShortcutsBtn.focus();
    }

    let practiceView = null;
    const timer = Timer.createTimer((snapshot) => {
      if (practiceView) practiceView.renderTimer(snapshot);
    });
    timer.setPreset(prefs.timerPreset);
    shellEls.timerPresetSelect.value = String(prefs.timerPreset);

    const actions = {
      getEffectiveRole,

      setLanguage(langCode) {
        I18n.setLanguage(langCode);
        store.setState({ language: langCode });
        persistPreferences(store.getState());
        I18n.applyTranslations();
        if (practiceView) practiceView.renderTimer(timer.getSnapshot());
      },

      switchView(viewName) {
        if (!VIEW_TITLE_KEYS[viewName]) return;
        store.setState({ activeView: viewName });
        closeMobileSidebar();
        window.scrollTo({ top: 0, behavior: 'auto' });
      },

      loadNextQuestion() {
        const state = store.getState();
        const role = getEffectiveRole();
        const currentId = state.currentQuestion ? state.currentQuestion.id : null;
        const next = QuestionBank.pickNextQuestion(role, currentId);
        if (!next) return;
        timer.reset();
        Storage.saveDraft(next.id, '');
        store.setState({
          currentQuestion: next,
          draftText: '',
          lastEvaluation: null,
          lastAttempt: null
        });
        if (practiceView) practiceView.focusEditor();
      },

      practiceSpecificQuestion(question, roleOverride) {
        if (!question) return;
        const roles = QuestionBank.getRoles();
        const targetRole = roleOverride || question.role;
        const isBuiltInRole = roles.includes(targetRole);

        timer.reset();
        Storage.saveDraft(question.id, '');

        const nextPatch = {
          activeView: 'practice',
          currentQuestion: question,
          draftText: '',
          lastEvaluation: null,
          lastAttempt: null
        };

        if (isBuiltInRole) {
          nextPatch.selectedRole = targetRole;
        } else {
          nextPatch.selectedRole = 'custom';
          nextPatch.customRole = targetRole;
        }

        store.setState(nextPatch);
        persistPreferences(store.getState());
        closeMobileSidebar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (practiceView) practiceView.focusEditor();
      },

      updateDraft(text) {
        const q = store.getState().currentQuestion;
        store.setState({ draftText: text });
        if (q) Storage.saveDraft(q.id, text);
      },

      recordEvaluation(result, attempt) {
        const state = store.getState();
        let nextHistory = state.history;
        if (state.saveHistory) {
          nextHistory = [attempt, ...state.history];
          Storage.saveHistory(nextHistory);
        }
        store.setState({
          lastEvaluation: result,
          lastAttempt: attempt,
          history: nextHistory
        });
      },

      toggleBookmark(questionId) {
        const current = store.getState().bookmarks;
        const exists = current.includes(questionId);
        const next = exists ? current.filter((id) => id !== questionId) : [...current, questionId];
        Storage.saveBookmarks(next);
        store.setState({ bookmarks: next });
        DOM.showToast(exists ? 'Removed from saved prompts.' : 'Saved to Question Bank bookmarks.');
      },

      setTimerPreset(seconds) {
        timer.setPreset(seconds);
        store.setState({ timerPreset: seconds });
        persistPreferences(store.getState());
      },

      clearHistory() {
        Storage.clearHistory();
        store.setState({ history: [] });
      },

      saveNote(section, text) {
        const nextNotes = Object.assign({}, store.getState().notes, { [section]: text });
        Storage.saveNotes(nextNotes);
        store.setState({ notes: nextNotes });
      }
    };

    practiceView = PracticeView.createPracticeView({ store, timer, actions });
    const bankView = BankView.createBankView({ store, actions });
    const historyView = HistoryView.createHistoryView({ store, actions });
    const notesView = NotesView.createNotesView({ store, actions });

    function renderShell(state) {
      applyVisualPreferences(state);

      shellEls.navItems.forEach((item) => {
        const isActive = item.dataset.view === state.activeView;
        item.classList.toggle('is-active', isActive);
        if (isActive) item.setAttribute('aria-current', 'page');
        else item.removeAttribute('aria-current');
      });

      Object.keys(shellEls.viewSections).forEach((key) => {
        const section = shellEls.viewSections[key];
        const isActive = key === state.activeView;
        section.hidden = !isActive;
        section.classList.toggle('is-active', isActive);
      });

      const titleKey = VIEW_TITLE_KEYS[state.activeView] || 'nav.practice';
      shellEls.topbarViewTitle.textContent = I18n.t(titleKey);
      shellEls.topbarContext.textContent = `${getEffectiveRole()} · ${state.experienceLevel}`;
      shellEls.navBankCount.textContent = String(QuestionBank.getAllQuestions().length);
      shellEls.navHistoryCount.textContent = String(state.history.length);

      shellEls.roleSelect.value = state.selectedRole;
      shellEls.customRoleGroup.hidden = state.selectedRole !== 'custom';
      if (document.activeElement !== shellEls.customRoleInput) {
        shellEls.customRoleInput.value = state.customRole;
      }
      shellEls.levelSelect.value = state.experienceLevel;
      shellEls.saveHistoryToggle.checked = state.saveHistory;
    }

    function renderAll(state) {
      renderShell(state);
      practiceView.render(state);
      bankView.render(state);
      historyView.render(state);
      notesView.render(state);
    }

    store.subscribe(renderAll);

    shellEls.navItems.forEach((btn) => {
      btn.addEventListener('click', () => actions.switchView(btn.dataset.view));
    });

    document.querySelectorAll('[data-nav]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        actions.switchView(link.dataset.nav);
      });
    });

    shellEls.topbarLangSelect.addEventListener('change', (e) => {
      actions.setLanguage(e.target.value);
    });

    shellEls.roleSelect.addEventListener('change', (e) => {
      store.setState({ selectedRole: e.target.value });
      persistPreferences(store.getState());
      actions.loadNextQuestion();
    });

    shellEls.customRoleInput.addEventListener('change', (e) => {
      store.setState({ customRole: e.target.value.trim() });
      persistPreferences(store.getState());
      if (store.getState().selectedRole === 'custom') {
        actions.loadNextQuestion();
      }
    });

    shellEls.levelSelect.addEventListener('change', (e) => {
      store.setState({ experienceLevel: e.target.value });
      persistPreferences(store.getState());
    });

    shellEls.saveHistoryToggle.addEventListener('change', (e) => {
      const enabled = e.target.checked;
      store.setState({ saveHistory: enabled });
      persistPreferences(store.getState());
      DOM.showToast(enabled ? 'Local attempt history enabled.' : 'Local history saving paused for new attempts.');
    });

    shellEls.scaleButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        store.setState({ fontScale: btn.dataset.scale });
        persistPreferences(store.getState());
      });
    });

    shellEls.themeToggleBtn.addEventListener('click', () => {
      const nextTheme = store.getState().theme === 'dark' ? 'light' : 'dark';
      store.setState({ theme: nextTheme });
      persistPreferences(store.getState());
    });

    shellEls.mobileMenuBtn.addEventListener('click', openMobileSidebar);
    shellEls.closeSidebarBtn.addEventListener('click', closeMobileSidebar);
    shellEls.sidebarBackdrop.addEventListener('click', closeMobileSidebar);

    shellEls.shortcutsBtn.addEventListener('click', () => setShortcutsModalOpen(true));
    shellEls.closeShortcutsBtn.addEventListener('click', () => setShortcutsModalOpen(false));
    shellEls.shortcutsModal.addEventListener('click', (e) => {
      if (e.target === shellEls.shortcutsModal) setShortcutsModalOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (!shellEls.shortcutsModal.hidden) setShortcutsModalOpen(false);
        closeMobileSidebar();
        return;
      }

      if (event.key === '?' && !DOM.isEditableElement(event.target)) {
        event.preventDefault();
        setShortcutsModalOpen(shellEls.shortcutsModal.hidden);
        return;
      }

      if (store.getState().activeView === 'practice' && event.altKey) {
        const lower = event.key.toLowerCase();
        if (lower === 'n') {
          event.preventDefault();
          actions.loadNextQuestion();
        } else if (lower === 'h') {
          event.preventDefault();
          practiceView.toggleHint();
        } else if (lower === 't') {
          event.preventDefault();
          timer.toggle();
        }
      }
    });

    renderAll(store.getState());
    practiceView.renderTimer(timer.getSnapshot());
  }

  document.addEventListener('DOMContentLoaded', bootstrap);
})(typeof window !== 'undefined' ? window : globalThis);
