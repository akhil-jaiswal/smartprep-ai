(function (root) {
  'use strict';

  const SmartPrep = root.SmartPrep || (root.SmartPrep = {});

  let toastTimer = null;

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((key) => {
        const value = attrs[key];
        if (value === null || value === undefined || value === false) return;
        if (key === 'className') {
          node.className = value;
        } else if (key === 'text') {
          node.textContent = value;
        } else if (key === 'dataset' && typeof value === 'object') {
          Object.keys(value).forEach((dKey) => {
            node.dataset[dKey] = value[dKey];
          });
        } else if (key.startsWith('on') && typeof value === 'function') {
          node.addEventListener(key.slice(2).toLowerCase(), value);
        } else if (value === true) {
          node.setAttribute(key, '');
        } else {
          node.setAttribute(key, String(value));
        }
      });
    }
    if (children !== undefined && children !== null) {
      const items = Array.isArray(children) ? children : [children];
      items.forEach((child) => {
        if (child === null || child === undefined || child === false) return;
        if (typeof child === 'string' || typeof child === 'number') {
          node.appendChild(document.createTextNode(String(child)));
        } else {
          node.appendChild(child);
        }
      });
    }
    return node;
  }

  function showToast(message, variant) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast is-visible ${variant ? `toast-${variant}` : ''}`.trim();
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2800);
  }

  function isEditableElement(target) {
    if (!target) return false;
    const tag = target.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
  }

  const DOM = {
    el,
    showToast,
    isEditableElement
  };

  SmartPrep.DOM = DOM;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DOM;
  }
})(typeof window !== 'undefined' ? window : globalThis);
