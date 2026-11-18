(function (root) {
  'use strict';

  const SmartPrep = root.SmartPrep || (root.SmartPrep = {});

  async function copyText(text) {
    const content = String(text || '').trim();
    if (!content) return false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(content);
        return true;
      }
    } catch (_) {
      // Fall back to execCommand below
    }
    try {
      const textarea = document.createElement('textarea');
      textarea.value = content;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      textarea.remove();
      return Boolean(ok);
    } catch (_) {
      return false;
    }
  }

  function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function formatAttemptMarkdown(attempt) {
    const lines = [
      `# SmartPrep AI — Practice Review`,
      '',
      `- **Role:** ${attempt.role}`,
      `- **Level:** ${attempt.level}`,
      `- **Category:** ${attempt.category}`,
      `- **Date:** ${new Date(attempt.createdAt).toLocaleString()}`,
      `- **Score:** ${attempt.score} / 10 (${attempt.label})`,
      `- **Word Count:** ${attempt.wordCount} words`,
      attempt.elapsedSeconds ? `- **Time Spent:** ${Math.floor(attempt.elapsedSeconds / 60)}m ${attempt.elapsedSeconds % 60}s` : null,
      '',
      `## Prompt`,
      attempt.questionText,
      '',
      `## Your Answer`,
      attempt.answerText,
      '',
      `## Score Breakdown`,
      `- Technical coverage: ${attempt.breakdown.technical} / 40`,
      `- Structure & clarity: ${attempt.breakdown.structure} / 25`,
      `- Practical reasoning: ${attempt.breakdown.practical} / 25`,
      `- Communication & depth: ${attempt.breakdown.communication} / 10`,
      '',
      `## Covered Concepts`,
      attempt.matchedConcepts.length ? attempt.matchedConcepts.map((c) => `- ${c}`).join('\n') : '- None detected',
      '',
      `## Unmentioned Concepts`,
      attempt.missedConcepts.length ? attempt.missedConcepts.map((c) => `- ${c}`).join('\n') : '- None',
      '',
      `## What Worked`,
      ...attempt.strengths.map((s) => `- ${s}`),
      '',
      `## Room to Improve`,
      ...attempt.gaps.map((g) => `- ${g}`),
      '',
      `## Reference Example`,
      attempt.modelAnswer,
      ''
    ].filter((line) => line !== null);

    return lines.join('\n');
  }

  function exportAttemptMarkdown(attempt) {
    const slug = (attempt.questionId || 'attempt').replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
    const dateStamp = new Date(attempt.createdAt || Date.now()).toISOString().slice(0, 10);
    downloadFile(`smartprep-${slug}-${dateStamp}.md`, formatAttemptMarkdown(attempt), 'text/markdown;charset=utf-8');
  }

  function exportHistoryJSON(history) {
    const dateStamp = new Date().toISOString().slice(0, 10);
    const payload = {
      exportedAt: new Date().toISOString(),
      app: 'SmartPrep AI',
      version: (SmartPrep.Constants && SmartPrep.Constants.APP_VERSION) || '2.1.0',
      totalAttempts: (history || []).length,
      attempts: history || []
    };
    downloadFile(`smartprep-history-${dateStamp}.json`, JSON.stringify(payload, null, 2), 'application/json;charset=utf-8');
  }

  const Exporter = {
    copyText,
    downloadFile,
    formatAttemptMarkdown,
    exportAttemptMarkdown,
    exportHistoryJSON
  };

  SmartPrep.Exporter = Exporter;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Exporter;
  }
})(typeof window !== 'undefined' ? window : globalThis);
