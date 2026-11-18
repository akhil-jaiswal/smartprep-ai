(function (root) {
  'use strict';

  const SmartPrep = root.SmartPrep || (root.SmartPrep = {});

  function createNotesView(ctx) {
    const { store, actions } = ctx;
    const { DOM, Exporter, I18n } = SmartPrep;

    const els = {
      roleSelect: document.getElementById('notesRoleSelect'),
      textarea: document.getElementById('notesTextarea'),
      savedStatus: document.getElementById('notesSavedStatus'),
      clearNoteBtn: document.getElementById('clearNoteBtn'),
      exportNotesBtn: document.getElementById('exportNotesBtn')
    };

    let saveTimer = null;

    function loadSelectedSection(state) {
      const section = els.roleSelect.value;
      const content = (state.notes && state.notes[section]) || '';
      if (els.textarea.dataset.section !== section) {
        els.textarea.dataset.section = section;
        els.textarea.value = content;
      }
    }

    function render(state) {
      loadSelectedSection(state);
    }

    function exportAllNotes() {
      const notes = store.getState().notes || {};
      const sections = Object.keys(notes).filter((key) => notes[key] && notes[key].trim());
      if (!sections.length) {
        DOM.showToast('Add some notes first before exporting.');
        return;
      }
      const markdown = [
        '# SmartPrep AI — Personal Interview Notes',
        '',
        `Exported on ${new Date().toLocaleDateString()}`,
        '',
        ...sections.map((section) => `## ${section}\n\n${notes[section].trim()}\n`)
      ].join('\n');

      const stamp = new Date().toISOString().slice(0, 10);
      Exporter.downloadFile(`smartprep-notes-${stamp}.md`, markdown, 'text/markdown;charset=utf-8');
      DOM.showToast('Personal notes exported as Markdown.');
    }

    function bindEvents() {
      els.roleSelect.addEventListener('change', () => {
        els.textarea.dataset.section = '';
        loadSelectedSection(store.getState());
        els.savedStatus.textContent = I18n.t('practice.draftSaved');
      });

      els.textarea.addEventListener('input', () => {
        const section = els.roleSelect.value;
        els.savedStatus.textContent = I18n.t('practice.saving');
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
          actions.saveNote(section, els.textarea.value);
          els.savedStatus.textContent = I18n.t('practice.draftSaved');
        }, 350);
      });

      els.clearNoteBtn.addEventListener('click', () => {
        if (!els.textarea.value.trim()) return;
        const section = els.roleSelect.value;
        if (window.confirm(`Clear all notes in "${section}"?`)) {
          els.textarea.value = '';
          actions.saveNote(section, '');
          DOM.showToast('Section notes cleared.');
        }
      });

      els.exportNotesBtn.addEventListener('click', exportAllNotes);
    }

    bindEvents();

    return { render };
  }

  SmartPrep.NotesView = { createNotesView };
})(typeof window !== 'undefined' ? window : globalThis);
