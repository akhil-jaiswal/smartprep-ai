'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const QuestionBank = require('../src/js/data/question-bank');

test('all curated roles have at least 4 valid prompts with unique IDs', () => {
  const roles = QuestionBank.getRoles();
  assert.equal(roles.length, 7);

  const seenIds = new Set();
  roles.forEach((role) => {
    const pool = QuestionBank.getPoolForRole(role);
    assert.ok(pool.length >= 4, `Expected at least 4 prompts for ${role}`);

    pool.forEach((item) => {
      assert.ok(item.id, 'Prompt must have an id');
      assert.equal(seenIds.has(item.id), false, `Duplicate prompt id detected: ${item.id}`);
      seenIds.add(item.id);

      assert.ok(item.question.length > 20, `Prompt text too short for ${item.id}`);
      assert.ok(item.hint.length > 10, `Hint missing for ${item.id}`);
      assert.ok(item.answer.length > 80, `Sample answer too short for ${item.id}`);
      assert.ok(Array.isArray(item.concepts) && item.concepts.length >= 4, `Concepts missing for ${item.id}`);

      item.concepts.forEach((concept) => {
        assert.ok(concept.label, `Concept label missing in ${item.id}`);
        assert.ok(Array.isArray(concept.terms) && concept.terms.length >= 2, `Concept synonyms missing in ${item.id}`);
      });
    });
  });
});

test('custom roles return tailored fallback prompts', () => {
  const customPool = QuestionBank.getPoolForRole('iOS Engineer');
  assert.ok(customPool.length >= 3);
  assert.ok(customPool[0].question.includes('iOS Engineer'));
});

test('filterQuestions filters by role, difficulty, search query, and bookmarks', () => {
  const backendMid = QuestionBank.filterQuestions({
    role: 'Backend Java Developer',
    difficulty: 'Mid level'
  });
  assert.ok(backendMid.length >= 1);
  assert.ok(backendMid.every((q) => q.role === 'Backend Java Developer' && q.difficulty === 'Mid level'));

  const sqlSearch = QuestionBank.filterQuestions({ query: 'fan-out' });
  assert.ok(sqlSearch.some((q) => q.id === 'da-02'));

  const bookmarked = QuestionBank.filterQuestions({
    bookmarkedOnly: true,
    bookmarks: ['fe-02', 'do-01']
  });
  assert.equal(bookmarked.length, 2);
});
