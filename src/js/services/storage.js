(function (root) {
  'use strict';

  const SmartPrep = root.SmartPrep || (root.SmartPrep = {});

  function getKeys() {
    return (SmartPrep.Constants && SmartPrep.Constants.STORAGE_KEYS) || {
      HISTORY: 'smartprep_history_v2',
      BOOKMARKS: 'smartprep_bookmarks_v2',
      NOTES: 'smartprep_notes_v2',
      DRAFT: 'smartprep_draft_v2',
      PREFERENCES: 'smartprep_preferences_v2'
    };
  }

  function isAvailable() {
    try {
      const testKey = '__smartprep_test__';
      root.localStorage.setItem(testKey, '1');
      root.localStorage.removeItem(testKey);
      return true;
    } catch (_) {
      return false;
    }
  }

  function readJSON(key, fallback) {
    if (!isAvailable()) return fallback;
    try {
      const raw = root.localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed !== null && parsed !== undefined ? parsed : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    if (!isAvailable()) return false;
    try {
      root.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_) {
      return false;
    }
  }

  function loadPreferences() {
    const defaults = {
      role: 'Backend Java Developer',
      customRole: '',
      experienceLevel: 'Mid level',
      timerPreset: 300,
      theme: 'light',
      fontScale: 'standard',
      language: 'en',
      saveHistory: true
    };
    return Object.assign(defaults, readJSON(getKeys().PREFERENCES, {}));
  }

  function savePreferences(prefs) {
    return writeJSON(getKeys().PREFERENCES, prefs);
  }

  function loadHistory() {
    const items = readJSON(getKeys().HISTORY, []);
    return Array.isArray(items) ? items : [];
  }

  function saveHistory(items) {
    return writeJSON(getKeys().HISTORY, (items || []).slice(0, 150));
  }

  function loadBookmarks() {
    const ids = readJSON(getKeys().BOOKMARKS, []);
    return Array.isArray(ids) ? ids : [];
  }

  function saveBookmarks(ids) {
    return writeJSON(getKeys().BOOKMARKS, Array.from(new Set(ids || [])));
  }

  function loadNotes() {
    const notes = readJSON(getKeys().NOTES, {});
    return notes && typeof notes === 'object' ? notes : {};
  }

  function saveNotes(notes) {
    return writeJSON(getKeys().NOTES, notes || {});
  }

  function loadDraft() {
    return readJSON(getKeys().DRAFT, { questionId: null, text: '' });
  }

  function saveDraft(questionId, text) {
    return writeJSON(getKeys().DRAFT, { questionId, text: text || '' });
  }

  function clearHistory() {
    if (!isAvailable()) return;
    try {
      root.localStorage.removeItem(getKeys().HISTORY);
    } catch (_) {
      // ignore
    }
  }

  const Storage = {
    isAvailable,
    loadPreferences,
    savePreferences,
    loadHistory,
    saveHistory,
    loadBookmarks,
    saveBookmarks,
    loadNotes,
    saveNotes,
    loadDraft,
    saveDraft,
    clearHistory
  };

  SmartPrep.Storage = Storage;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
  }
})(typeof window !== 'undefined' ? window : globalThis);
