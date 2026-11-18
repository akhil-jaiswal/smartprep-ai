(function (root) {
  'use strict';

  const SmartPrep = root.SmartPrep || (root.SmartPrep = {});

  function resolveSources() {
    if (typeof module !== 'undefined' && module.exports && (!SmartPrep.EngineeringQuestions || !SmartPrep.ProductDataQuestions)) {
      const eng = require('./roles-engineering');
      const prod = require('./roles-product-data');
      return {
        engineering: eng,
        productData: prod.PRODUCT_DATA_QUESTIONS,
        getCustom: prod.getCustomRoleQuestions
      };
    }
    return {
      engineering: SmartPrep.EngineeringQuestions || {},
      productData: SmartPrep.ProductDataQuestions || {},
      getCustom: SmartPrep.getCustomRoleQuestions || (() => [])
    };
  }

  const sources = resolveSources();
  const BY_ROLE = Object.assign({}, sources.engineering, sources.productData);
  const ALL_QUESTIONS = Object.keys(BY_ROLE).reduce((list, role) => {
    return list.concat(BY_ROLE[role]);
  }, []);

  function getRoles() {
    return Object.keys(BY_ROLE);
  }

  function getAllQuestions() {
    return ALL_QUESTIONS.slice();
  }

  function getPoolForRole(role) {
    if (BY_ROLE[role]) {
      return BY_ROLE[role].slice();
    }
    return sources.getCustom(role);
  }

  function getQuestionById(id, customRoleName) {
    const found = ALL_QUESTIONS.find((q) => q.id === id);
    if (found) return found;
    if (id && id.startsWith('custom-')) {
      return sources.getCustom(customRoleName).find((q) => q.id === id) || null;
    }
    return null;
  }

  function pickNextQuestion(role, currentQuestionId, preferredDifficulty) {
    const pool = getPoolForRole(role);
    if (!pool.length) return null;

    let candidates = pool.filter((q) => q.id !== currentQuestionId);
    if (!candidates.length) candidates = pool;

    if (preferredDifficulty) {
      const levelMatched = candidates.filter((q) => q.difficulty === preferredDifficulty);
      if (levelMatched.length) {
        candidates = levelMatched;
      }
    }

    const index = Math.floor(Math.random() * candidates.length);
    return candidates[index];
  }

  function filterQuestions(filters) {
    const query = (filters.query || '').trim().toLowerCase();
    const role = filters.role || 'all';
    const difficulty = filters.difficulty || 'all';
    const bookmarkedOnly = Boolean(filters.bookmarkedOnly);
    const bookmarks = filters.bookmarks || [];

    return ALL_QUESTIONS.filter((item) => {
      if (role !== 'all' && item.role !== role) return false;
      if (difficulty !== 'all' && item.difficulty !== difficulty) return false;
      if (bookmarkedOnly && !bookmarks.includes(item.id)) return false;

      if (query) {
        const conceptText = item.concepts.map((c) => c.label + ' ' + c.terms.join(' ')).join(' ');
        const haystack = `${item.question} ${item.category} ${item.role} ${item.context} ${conceptText}`.toLowerCase();
        return haystack.includes(query);
      }
      return true;
    });
  }

  const QuestionBank = {
    BY_ROLE,
    getRoles,
    getAllQuestions,
    getPoolForRole,
    getQuestionById,
    pickNextQuestion,
    filterQuestions
  };

  SmartPrep.QuestionBank = QuestionBank;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestionBank;
  }
})(typeof window !== 'undefined' ? window : globalThis);
