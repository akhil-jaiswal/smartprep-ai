(function (root) {
  'use strict';

  const SmartPrep = root.SmartPrep || (root.SmartPrep = {});

  function createBankView(ctx) {
    const { store, actions } = ctx;
    const { QuestionBank, Format, DOM, I18n } = SmartPrep;

    const els = {
      searchInput: document.getElementById('bankSearchInput'),
      roleFilter: document.getElementById('bankRoleFilter'),
      difficultyFilter: document.getElementById('bankDifficultyFilter'),
      bookmarkFilter: document.getElementById('bankBookmarkFilter'),
      resultsCount: document.getElementById('bankResultsCount'),
      grid: document.getElementById('bankGrid'),
      emptyState: document.getElementById('bankEmptyState'),
      resetFiltersBtn: document.getElementById('bankResetFiltersBtn')
    };

    const filters = {
      query: '',
      role: 'all',
      difficulty: 'all',
      bookmarkedOnly: false
    };

    // Populate role select once
    QuestionBank.getRoles().forEach((role) => {
      els.roleFilter.appendChild(DOM.el('option', { value: role, text: role }));
    });

    function getBestScoreForQuestion(history, questionId) {
      const matches = history.filter((item) => item.questionId === questionId);
      if (!matches.length) return null;
      const best = Math.max(...matches.map((m) => m.score));
      return { best, count: matches.length };
    }

    function render(state) {
      const results = QuestionBank.filterQuestions({
        query: filters.query,
        role: filters.role,
        difficulty: filters.difficulty,
        bookmarkedOnly: filters.bookmarkedOnly,
        bookmarks: state.bookmarks
      });

      const total = QuestionBank.getAllQuestions().length;
      els.resultsCount.textContent = results.length === total
        ? `${total} prompts`
        : `Showing ${results.length} of ${total} prompts`;

      els.grid.replaceChildren();
      els.emptyState.hidden = results.length > 0;

      results.forEach((item) => {
        const isSaved = state.bookmarks.includes(item.id);
        const stats = getBestScoreForQuestion(state.history, item.id);

        const bookmarkBtn = DOM.el(
          'button',
          {
            type: 'button',
            className: 'btn btn-ghost btn-sm',
            'aria-pressed': String(isSaved),
            'aria-label': isSaved ? 'Remove bookmark' : 'Bookmark prompt',
            onClick: () => actions.toggleBookmark(item.id)
          },
          [I18n.t(isSaved ? 'practice.savedPrompt' : 'practice.savePrompt')]
        );

        const practiceBtn = DOM.el(
          'button',
          {
            type: 'button',
            className: 'btn btn-primary btn-sm',
            text: I18n.t('bank.practiceBtn'),
            onClick: () => actions.practiceSpecificQuestion(item)
          }
        );

        const statusNode = DOM.el('span', {
          className: `attempt-status ${stats ? 'is-practiced' : ''}`.trim(),
          text: stats
            ? `Best: ${Format.formatScore(stats.best)} / 10 · ${stats.count} ${stats.count === 1 ? 'attempt' : 'attempts'}`
            : 'Not attempted yet'
        });

        const card = DOM.el('article', { className: 'card bank-card' }, [
          DOM.el('div', { className: 'bank-card-top' }, [
            DOM.el('div', { className: 'bank-card-meta' }, [
              DOM.el('span', { className: 'badge badge-primary', text: item.category }),
              DOM.el('span', { className: 'badge badge-neutral', text: item.difficulty })
            ]),
            bookmarkBtn
          ]),
          DOM.el('h3', { className: 'bank-card-question', text: item.question }),
          DOM.el('p', { className: 'bank-card-role', text: `${item.role} · ~${item.estimatedMinutes || 5} min` }),
          DOM.el('div', { className: 'bank-card-footer' }, [statusNode, practiceBtn])
        ]);

        els.grid.appendChild(card);
      });
    }

    function bindEvents() {
      els.searchInput.addEventListener('input', (e) => {
        filters.query = e.target.value;
        render(store.getState());
      });

      els.roleFilter.addEventListener('change', (e) => {
        filters.role = e.target.value;
        render(store.getState());
      });

      els.difficultyFilter.addEventListener('change', (e) => {
        filters.difficulty = e.target.value;
        render(store.getState());
      });

      els.bookmarkFilter.addEventListener('click', () => {
        filters.bookmarkedOnly = !filters.bookmarkedOnly;
        els.bookmarkFilter.setAttribute('aria-pressed', String(filters.bookmarkedOnly));
        render(store.getState());
      });

      els.resetFiltersBtn.addEventListener('click', () => {
        filters.query = '';
        filters.role = 'all';
        filters.difficulty = 'all';
        filters.bookmarkedOnly = false;
        els.searchInput.value = '';
        els.roleFilter.value = 'all';
        els.difficultyFilter.value = 'all';
        els.bookmarkFilter.setAttribute('aria-pressed', 'false');
        render(store.getState());
      });
    }

    bindEvents();

    return { render };
  }

  SmartPrep.BankView = { createBankView };
})(typeof window !== 'undefined' ? window : globalThis);
