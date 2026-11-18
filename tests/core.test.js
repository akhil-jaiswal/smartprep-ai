'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const State = require('../src/js/core/state');
const Timer = require('../src/js/core/timer');
const Format = require('../src/js/utils/format');

test('State store updates immutably and notifies subscribers', () => {
  const store = State.createStore({ count: 0, label: 'init' });
  let latest = null;
  const unsub = store.subscribe((next) => { latest = next; });

  store.setState({ count: 2 });
  assert.equal(store.getState().count, 2);
  assert.equal(latest.count, 2);
  assert.equal(latest.label, 'init');

  unsub();
  store.setState({ count: 5 });
  assert.equal(latest.count, 2);
});

test('Timer switches between countdown and stopwatch presets cleanly', () => {
  let snap = null;
  const timer = Timer.createTimer((s) => { snap = s; });

  timer.setPreset(180);
  assert.equal(snap.mode, 'countdown');
  assert.equal(snap.displaySeconds, 180);

  timer.setPreset(0);
  assert.equal(snap.mode, 'stopwatch');
  assert.equal(snap.displaySeconds, 0);

  timer.reset();
  assert.equal(snap.running, false);
});

test('Format utilities format timer, speaking time, and scores accurately', () => {
  assert.equal(Format.formatTimer(0), '00:00');
  assert.equal(Format.formatTimer(185), '03:05');
  assert.equal(Format.formatSpeakingTime(0), '0s spoken');
  assert.equal(Format.formatSpeakingTime(75), '~1m 15s spoken');
  assert.equal(Format.formatScore(8), '8.0');
  assert.equal(Format.formatScore(7.5), '7.5');
  assert.equal(Format.getScoreToneClass(8.5), 'tone-high');
  assert.equal(Format.getScoreToneClass(6.5), 'tone-mid');
  assert.equal(Format.getScoreToneClass(4.0), 'tone-low');
});
