(function (root) {
  'use strict';

  const SmartPrep = root.SmartPrep || (root.SmartPrep = {});

  function createStore(initialState) {
    let state = Object.assign({}, initialState);
    const listeners = new Set();

    function getState() {
      return state;
    }

    function setState(patch) {
      const nextPatch = typeof patch === 'function' ? patch(state) : patch;
      if (!nextPatch || typeof nextPatch !== 'object') return;
      state = Object.assign({}, state, nextPatch);
      listeners.forEach((listener) => {
        try {
          listener(state);
        } catch (err) {
          console.error('State listener failed:', err);
        }
      });
    }

    function subscribe(listener) {
      listeners.add(listener);
      return function unsubscribe() {
        listeners.delete(listener);
      };
    }

    return { getState, setState, subscribe };
  }

  SmartPrep.State = { createStore };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createStore };
  }
})(typeof window !== 'undefined' ? window : globalThis);
