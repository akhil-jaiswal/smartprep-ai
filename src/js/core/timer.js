(function (root) {
  'use strict';

  const SmartPrep = root.SmartPrep || (root.SmartPrep = {});

  function createTimer(onTick) {
    let mode = 'countdown'; // 'countdown' | 'stopwatch'
    let durationSeconds = 300;
    let remainingSeconds = 300;
    let elapsedSeconds = 0;
    let running = false;
    let finished = false;
    let intervalId = null;

    function getSnapshot() {
      const displaySeconds = mode === 'countdown' ? remainingSeconds : elapsedSeconds;
      const isWarning = mode === 'countdown' && running && remainingSeconds > 0 && remainingSeconds <= 30;
      return {
        mode,
        durationSeconds,
        remainingSeconds,
        elapsedSeconds,
        displaySeconds,
        running,
        finished,
        isWarning
      };
    }

    function emit() {
      if (typeof onTick === 'function') {
        onTick(getSnapshot());
      }
    }

    function stopInterval() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    function start() {
      if (running) return;
      if (mode === 'countdown' && remainingSeconds <= 0) {
        remainingSeconds = durationSeconds;
        elapsedSeconds = 0;
        finished = false;
      }
      running = true;
      emit();
      intervalId = setInterval(() => {
        elapsedSeconds += 1;
        if (mode === 'countdown') {
          remainingSeconds = Math.max(0, remainingSeconds - 1);
          if (remainingSeconds === 0) {
            running = false;
            finished = true;
            stopInterval();
          }
        }
        emit();
      }, 1000);
    }

    function pause() {
      if (!running) return;
      running = false;
      stopInterval();
      emit();
    }

    function toggle() {
      if (running) pause();
      else start();
    }

    function reset() {
      running = false;
      finished = false;
      elapsedSeconds = 0;
      remainingSeconds = durationSeconds;
      stopInterval();
      emit();
    }

    function setPreset(seconds) {
      const numeric = Number(seconds) || 0;
      if (numeric <= 0) {
        mode = 'stopwatch';
        durationSeconds = 0;
        remainingSeconds = 0;
      } else {
        mode = 'countdown';
        durationSeconds = numeric;
        remainingSeconds = numeric;
      }
      running = false;
      finished = false;
      elapsedSeconds = 0;
      stopInterval();
      emit();
    }

    return {
      start,
      pause,
      toggle,
      reset,
      setPreset,
      getSnapshot
    };
  }

  SmartPrep.Timer = { createTimer };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createTimer };
  }
})(typeof window !== 'undefined' ? window : globalThis);
