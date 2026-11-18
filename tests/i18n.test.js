'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const I18n = require('../src/js/i18n/i18n');
const en = require('../src/locales/en');
const hi = require('../src/locales/hi');
const es = require('../src/locales/es');
const fr = require('../src/locales/fr');

function collectKeys(obj, prefix) {
  return Object.keys(obj).reduce((acc, key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      return acc.concat(collectKeys(obj[key], fullKey));
    }
    acc.push(fullKey);
    return acc;
  }, []);
}

test('all four locales (en, hi, es, fr) have 100% key parity', () => {
  const baseKeys = collectKeys(en).sort();
  const locales = { hi, es, fr };

  Object.entries(locales).forEach(([code, dict]) => {
    const keys = collectKeys(dict).sort();
    assert.deepEqual(keys, baseKeys, `Locale "${code}" is missing or has extra translation keys`);
  });
});

test('I18n switches languages and falls back cleanly', () => {
  I18n.setLanguage('hi');
  assert.equal(I18n.getLanguage(), 'hi');
  assert.equal(I18n.t('nav.practice'), 'प्रैक्टिस रूम');

  I18n.setLanguage('es');
  assert.equal(I18n.t('nav.practice'), 'Sala de Práctica');

  I18n.setLanguage('fr');
  assert.equal(I18n.t('nav.practice'), 'Salle de Pratique');

  I18n.setLanguage('en');
  assert.equal(I18n.t('nav.practice'), 'Practice Room');
});
