(function (root) {
  'use strict';

  const SmartPrep = root.SmartPrep || (root.SmartPrep = {});

  function formatTimer(totalSeconds) {
    const safe = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    const mins = Math.floor(safe / 60);
    const secs = safe % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function formatSpeakingTime(seconds) {
    const safe = Math.max(0, Math.round(Number(seconds) || 0));
    if (safe === 0) return '0s spoken';
    if (safe < 60) return `~${safe}s spoken`;
    const mins = Math.floor(safe / 60);
    const rem = safe % 60;
    return rem > 0 ? `~${mins}m ${rem}s spoken` : `~${mins}m spoken`;
  }

  function formatScore(score) {
    const num = Number(score) || 0;
    return Number.isInteger(num) ? `${num}.0` : num.toFixed(1);
  }

  function formatDateTime(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '';

    const now = new Date();
    const isToday =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    const timePart = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    if (isToday) return `Today, ${timePart}`;

    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) + `, ${timePart}`;
  }

  function getScoreToneClass(score) {
    if (score >= 8) return 'tone-high';
    if (score >= 6) return 'tone-mid';
    return 'tone-low';
  }

  const Format = {
    formatTimer,
    formatSpeakingTime,
    formatScore,
    formatDateTime,
    getScoreToneClass
  };

  SmartPrep.Format = Format;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Format;
  }
})(typeof window !== 'undefined' ? window : globalThis);
