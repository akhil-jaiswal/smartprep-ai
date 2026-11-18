'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const Evaluator = require('../src/js/core/evaluator');
const QuestionBank = require('../src/js/data/question-bank');

test('countWords counts standard and technical tokens accurately', () => {
  assert.equal(Evaluator.countWords(''), 0);
  assert.equal(Evaluator.countWords('   '), 0);
  assert.equal(Evaluator.countWords('Use Redis caching and p99 metrics.'), 6);
});

test('estimateSpeakingSeconds estimates realistic speaking time', () => {
  assert.equal(Evaluator.estimateSpeakingSeconds(0), 0);
  const secs = Evaluator.estimateSpeakingSeconds(130, 130);
  assert.equal(secs, 60);
});

test('evaluateAnswer rewards concept synonyms, structure, and practical reasoning', () => {
  const question = QuestionBank.getQuestionById('bjd-01');
  assert.ok(question, 'Expected bjd-01 prompt to exist');

  const strongAnswer = [
    'First, I would measure baseline telemetry including p99 latency, error rate, CPU, and thread pool saturation to find the real bottleneck.',
    '',
    'Next, I would inspect slow database queries and missing indexes. For example, on a recent service we used Redis caching with a short TTL and horizontal autoscaling behind a load balancer, plus rate limiting for protection. However, the trade-off with caching is stale data invalidation.',
    '',
    'Finally, I would run a load test to verify that latency improved and monitor error budgets after rollout.'
  ].join('\n');

  const result = Evaluator.evaluateAnswer(strongAnswer, question, 'Mid level');

  assert.ok(result.score >= 8, `Expected strong answer score >= 8, got ${result.score}`);
  assert.ok(result.matchedConcepts.length >= 5, 'Expected synonym matching to detect at least 5 concepts');
  assert.equal(result.breakdown.technical + result.breakdown.structure + result.breakdown.practical + result.breakdown.communication > 75, true);
  assert.ok(result.strengths.length > 0);
});

test('evaluateAnswer caps very short answers and surfaces actionable gaps', () => {
  const question = QuestionBank.getQuestionById('fe-01');
  const shortAnswer = 'I would just add caching and optimize images quickly.';

  const result = Evaluator.evaluateAnswer(shortAnswer, question, 'Senior level');

  assert.ok(result.score <= 3.5, `Expected short answer score <= 3.5, got ${result.score}`);
  assert.ok(result.missedConcepts.length >= 3);
  assert.ok(result.gaps.length >= 2);
});
