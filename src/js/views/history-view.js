(function (root) {
  'use strict';

  const SmartPrep = root.SmartPrep || (root.SmartPrep = {});

  function createHistoryView(ctx) {
    const { store, actions } = ctx;
    const { QuestionBank, Format, DOM, Exporter, I18n } = SmartPrep;

    const els = {
      exportHistoryBtn: document.getElementById('exportHistoryBtn'),
      clearHistoryBtn: document.getElementById('clearHistoryBtn'),
      kpiTotalAttempts: document.getElementById('kpiTotalAttempts'),
      kpiAvgScore: document.getElementById('kpiAvgScore'),
      kpiBestScore: document.getElementById('kpiBestScore'),
      kpiUniquePrompts: document.getElementById('kpiUniquePrompts'),
      roleBreakdownCard: document.getElementById('roleBreakdownCard'),
      rolePerformanceBars: document.getElementById('rolePerformanceBars'),
      historyToolbar: document.getElementById('historyToolbar'),
      historyRoleFilter: document.getElementById('historyRoleFilter'),
      historyList: document.getElementById('historyList'),
      historyEmptyState: document.getElementById('historyEmptyState'),
      historyStartPracticeBtn: document.getElementById('historyStartPracticeBtn')
    };

    let selectedRoleFilter = 'all';
    const expandedIds = new Set();

    function syncRoleDropdown(history) {
      const rolesPresent = Array.from(new Set(history.map((item) => item.role))).sort();
      const prev = selectedRoleFilter;
      els.historyRoleFilter.replaceChildren(DOM.el('option', { value: 'all', text: I18n.t('bank.allRoles') }));
      rolesPresent.forEach((role) => {
        els.historyRoleFilter.appendChild(DOM.el('option', { value: role, text: role }));
      });
      if (rolesPresent.includes(prev)) {
        els.historyRoleFilter.value = prev;
      } else {
        selectedRoleFilter = 'all';
        els.historyRoleFilter.value = 'all';
      }
    }

    function renderRoleBars(history) {
      const byRole = new Map();
      history.forEach((item) => {
        if (!byRole.has(item.role)) {
          byRole.set(item.role, { sum: 0, count: 0 });
        }
        const entry = byRole.get(item.role);
        entry.sum += item.score;
        entry.count += 1;
      });

      els.rolePerformanceBars.replaceChildren();
      const sorted = Array.from(byRole.entries()).sort((a, b) => (b[1].sum / b[1].count) - (a[1].sum / a[1].count));

      sorted.forEach(([role, stats]) => {
        const avg = stats.sum / stats.count;
        const pct = Math.round(avg * 10);
        const fill = DOM.el('div', { className: `progress-fill ${Format.getScoreToneClass(avg)}` });
        fill.style.width = `${pct}%`;

        const row = DOM.el('div', { className: 'role-bar-row' }, [
          DOM.el('div', { className: 'role-bar-header' }, [
            DOM.el('span', { text: `${role} (${stats.count} ${stats.count === 1 ? 'attempt' : 'attempts'})` }),
            DOM.el('strong', { text: `${avg.toFixed(1)} / 10` })
          ]),
          DOM.el('div', { className: 'progress-track' }, [fill])
        ]);

        els.rolePerformanceBars.appendChild(row);
      });
    }

    function buildAttemptCard(attempt) {
      const isExpanded = expandedIds.has(attempt.id);
      const toneClass = Format.getScoreToneClass(attempt.score);
      const timeLabel = attempt.elapsedSeconds ? ` · ${Format.formatTimer(attempt.elapsedSeconds)} elapsed` : '';

      const details = DOM.el('div', { className: 'history-details', hidden: !isExpanded }, [
        DOM.el('div', { className: 'history-detail-block' }, [
          DOM.el('h4', { text: 'Your Written Response' }),
          DOM.el('div', { className: 'prose-block', text: attempt.answerText })
        ]),
        DOM.el('div', { className: 'history-detail-block' }, [
          DOM.el('h4', { text: 'Score Breakdown' }),
          DOM.el('p', {
            className: 'rail-copy',
            text: `Technical ${attempt.breakdown.technical}/40 · Structure ${attempt.breakdown.structure}/25 · Practical ${attempt.breakdown.practical}/25 · Depth ${attempt.breakdown.communication}/10`
          })
        ]),
        DOM.el('div', { className: 'history-detail-actions' }, [
          DOM.el('button', {
            type: 'button',
            className: 'btn btn-primary btn-sm',
            text: 'Practice again',
            onClick: () => {
              const found = QuestionBank.getQuestionById(attempt.questionId, attempt.role);
              if (found) {
                actions.practiceSpecificQuestion(found, attempt.role);
              } else {
                DOM.showToast('Prompt could not be found in the current bank.');
              }
            }
          }),
          DOM.el('button', {
            type: 'button',
            className: 'btn btn-secondary btn-sm',
            text: 'Export .md',
            onClick: () => {
              Exporter.exportAttemptMarkdown(attempt);
              DOM.showToast('Attempt exported as Markdown.');
            }
          })
        ])
      ]);

      const toggleBtn = DOM.el(
        'button',
        {
          type: 'button',
          className: 'history-summary-btn',
          'aria-expanded': String(isExpanded),
          onClick: () => {
            if (expandedIds.has(attempt.id)) {
              expandedIds.delete(attempt.id);
            } else {
              expandedIds.add(attempt.id);
            }
            render(store.getState());
          }
        },
        [
          DOM.el('div', { className: 'history-summary-main' }, [
            DOM.el('span', { className: 'history-question', text: attempt.questionText }),
            DOM.el('div', { className: 'history-meta' }, [
              DOM.el('span', { className: 'badge badge-neutral', text: attempt.role }),
              DOM.el('span', { text: `${attempt.level} · ${attempt.category}` }),
              DOM.el('span', { text: `· ${attempt.wordCount} words${timeLabel}` }),
              DOM.el('span', { text: `· ${Format.formatDateTime(attempt.createdAt)}` })
            ])
          ]),
          DOM.el('span', {
            className: `history-score-badge ${toneClass}`,
            text: `${Format.formatScore(attempt.score)} / 10`
          })
        ]
      );

      return DOM.el('article', { className: 'card history-item' }, [toggleBtn, details]);
    }

    function render(state) {
      const history = state.history || [];
      const totalPrompts = QuestionBank.getAllQuestions().length;

      els.kpiTotalAttempts.textContent = String(history.length);
      els.exportHistoryBtn.disabled = history.length === 0;
      els.clearHistoryBtn.disabled = history.length === 0;

      if (!history.length) {
        els.kpiAvgScore.textContent = '—';
        els.kpiBestScore.textContent = '—';
        els.kpiUniquePrompts.textContent = `0 / ${totalPrompts}`;
        els.roleBreakdownCard.hidden = true;
        els.historyToolbar.hidden = true;
        els.historyList.replaceChildren();
        els.historyEmptyState.hidden = false;
        return;
      }

      const avg = history.reduce((sum, item) => sum + item.score, 0) / history.length;
      const best = Math.max(...history.map((item) => item.score));
      const uniqueIds = new Set(history.map((item) => item.questionId));

      els.kpiAvgScore.textContent = `${avg.toFixed(1)} / 10`;
      els.kpiBestScore.textContent = `${Format.formatScore(best)} / 10`;
      els.kpiUniquePrompts.textContent = `${uniqueIds.size} / ${totalPrompts}`;

      els.roleBreakdownCard.hidden = false;
      els.historyToolbar.hidden = false;
      els.historyEmptyState.hidden = true;

      syncRoleDropdown(history);
      renderRoleBars(history);

      const visibleAttempts = selectedRoleFilter === 'all'
        ? history
        : history.filter((item) => item.role === selectedRoleFilter);

      els.historyList.replaceChildren();
      visibleAttempts.forEach((attempt) => {
        els.historyList.appendChild(buildAttemptCard(attempt));
      });
    }

    function bindEvents() {
      els.historyRoleFilter.addEventListener('change', (e) => {
        selectedRoleFilter = e.target.value;
        render(store.getState());
      });

      els.exportHistoryBtn.addEventListener('click', () => {
        const history = store.getState().history;
        if (!history.length) return;
        Exporter.exportHistoryJSON(history);
        DOM.showToast('Attempt history exported as JSON.');
      });

      els.clearHistoryBtn.addEventListener('click', () => {
        if (!store.getState().history.length) return;
        if (window.confirm('Delete all locally saved attempt history? This cannot be undone.')) {
          actions.clearHistory();
          DOM.showToast('Attempt history cleared.');
        }
      });

      els.historyStartPracticeBtn.addEventListener('click', () => actions.switchView('practice'));
    }

    bindEvents();

    return { render };
  }

  SmartPrep.HistoryView = { createHistoryView };
})(typeof window !== 'undefined' ? window : globalThis);
