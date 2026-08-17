/**
 * ============================================================================
 * ElectronFlow — tests/test_harness.js
 * 
 * Infraestructura de pruebas E2E en caja opaca para ElectronFlow EE 101.
 * Proporciona un entorno DOM simulado, contexto de Canvas 2D, almacenamiento
 * localStorage simulado y motor de aserciones sin dependencias externas.
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

/**
 * Motor de aserciones liviano y determinista para verificar resultados.
 * Se diseñó internamente para evitar dependencias npm y maximizar portabilidad.
 */
class Assertions {
  static assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Aserción fallida: la condición no se cumplió');
    }
  }

  static assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(
        (message ? message + ' -> ' : '') +
        `Esperado: ${JSON.stringify(expected)}, Obtenido: ${JSON.stringify(actual)}`
      );
    }
  }

  static assertNotEqual(actual, expected, message) {
    if (actual === expected) {
      throw new Error(
        (message ? message + ' -> ' : '') +
        `El valor no debería ser igual a: ${JSON.stringify(expected)}`
      );
    }
  }

  static assertDeepEqual(actual, expected, message) {
    const actStr = JSON.stringify(actual);
    const expStr = JSON.stringify(expected);
    if (actStr !== expStr) {
      throw new Error(
        (message ? message + ' -> ' : '') +
        `Discrepancia en estructura de datos.\nEsperado: ${expStr}\nObtenido: ${actStr}`
      );
    }
  }

  static assertCloseTo(actual, expected, delta = 1e-4, message) {
    const diff = Math.abs(actual - expected);
    if (diff > delta) {
      throw new Error(
        (message ? message + ' -> ' : '') +
        `Valor numérico fuera de tolerancia (delta=${delta}). Esperado: ${expected}, Obtenido: ${actual} (diff=${diff})`
      );
    }
  }

  static assertMatches(str, regex, message) {
    if (typeof str !== 'string' || !regex.test(str)) {
      throw new Error(
        (message ? message + ' -> ' : '') +
        `La cadena "${str}" no coincide con el patrón regular: ${regex}`
      );
    }
  }

  static assertGreaterThan(actual, expected, message) {
    if (actual <= expected) {
      throw new Error(
        (message ? message + ' -> ' : '') +
        `Esperado que ${actual} sea mayor que ${expected}`
      );
    }
  }

  static assertGreaterThanOrEqual(actual, expected, message) {
    if (actual < expected) {
      throw new Error(
        (message ? message + ' -> ' : '') +
        `Esperado que ${actual} sea mayor o igual a ${expected}`
      );
    }
  }

  static assertLessThan(actual, expected, message) {
    if (actual >= expected) {
      throw new Error(
        (message ? message + ' -> ' : '') +
        `Esperado que ${actual} sea menor que ${expected}`
      );
    }
  }

  static assertLessThanOrEqual(actual, expected, message) {
    if (actual > expected) {
      throw new Error(
        (message ? message + ' -> ' : '') +
        `Esperado que ${actual} sea menor o igual a ${expected}`
      );
    }
  }

  static assertDefined(value, message) {
    if (value === undefined || value === null) {
      throw new Error(message || 'El valor no debe ser null ni undefined');
    }
  }

  static assertThrows(fn, message) {
    let threw = false;
    try {
      fn();
    } catch (e) {
      threw = true;
    }
    if (!threw) {
      throw new Error(message || 'Se esperaba que la función lanzara una excepción');
    }
  }
}

/**
 * Simulación ligera del contexto 2D de Canvas para registrar llamadas de dibujo.
 * Permite auditar qué operaciones gráficas ejecuta el motor de simulación.
 */
class MockCanvasContext2D {
  constructor(canvas) {
    this.canvas = canvas;
    this.fillStyle = '#000000';
    this.strokeStyle = '#000000';
    this.lineWidth = 1;
    this.font = '10px sans-serif';
    this.textAlign = 'left';
    this.textBaseline = 'alphabetic';
    this.shadowColor = 'transparent';
    this.shadowBlur = 0;
    this.globalAlpha = 1.0;
    this.drawHistory = [];
  }

  clearRect(x, y, w, h) {
    this.drawHistory.push({ type: 'clearRect', x, y, w, h });
  }

  fillRect(x, y, w, h) {
    this.drawHistory.push({ type: 'fillRect', x, y, w, h, fillStyle: this.fillStyle });
  }

  strokeRect(x, y, w, h) {
    this.drawHistory.push({ type: 'strokeRect', x, y, w, h, strokeStyle: this.strokeStyle });
  }

  fillText(text, x, y) {
    this.drawHistory.push({ type: 'fillText', text, x, y, fillStyle: this.fillStyle });
  }

  beginPath() {
    this.drawHistory.push({ type: 'beginPath' });
  }

  closePath() {
    this.drawHistory.push({ type: 'closePath' });
  }

  moveTo(x, y) {
    this.drawHistory.push({ type: 'moveTo', x, y });
  }

  lineTo(x, y) {
    this.drawHistory.push({ type: 'lineTo', x, y });
  }

  arc(x, y, r, sa, ea) {
    this.drawHistory.push({ type: 'arc', x, y, r, sa, ea });
  }

  stroke() {
    this.drawHistory.push({ type: 'stroke', strokeStyle: this.strokeStyle, lineWidth: this.lineWidth });
  }

  fill() {
    this.drawHistory.push({ type: 'fill', fillStyle: this.fillStyle });
  }

  save() {
    this.drawHistory.push({ type: 'save' });
  }

  restore() {
    this.drawHistory.push({ type: 'restore' });
  }

  setLineDash(dash) {
    this.drawHistory.push({ type: 'setLineDash', dash });
  }

  createLinearGradient(x0, y0, x1, y1) {
    return {
      addColorStop: (offset, color) => {}
    };
  }

  createRadialGradient(x0, y0, r0, x1, y1, r1) {
    return {
      addColorStop: (offset, color) => {}
    };
  }

  resetHistory() {
    this.drawHistory = [];
  }
}

/**
 * Representación en memoria de un nodo del DOM para pruebas en caja opaca.
 * Implementa selectores, manipulación de clases, estilos y eventos requeridos por la app.
 */
class MockDOMElement {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
    this.nodeType = 1;
    this.id = '';
    this.className = '';
    this.classList = {
      _classes: new Set(),
      add: (...classes) => classes.forEach(c => this.classList._classes.add(c)),
      remove: (...classes) => classes.forEach(c => this.classList._classes.delete(c)),
      contains: (c) => this.classList._classes.has(c),
      toggle: (c, force) => {
        if (force === true) {
          this.classList._classes.add(c);
          return true;
        } else if (force === false) {
          this.classList._classes.delete(c);
          return false;
        }
        if (this.classList._classes.has(c)) {
          this.classList._classes.delete(c);
          return false;
        } else {
          this.classList._classes.add(c);
          return true;
        }
      }
    };
    this.style = {};
    this.attributes = {};
    this.dataset = {};
    this.children = [];
    this.parentNode = null;
    this.listeners = {};
    this.value = '';
    this.type = 'text';
    this.disabled = false;
    this.checked = false;
    this.width = 640;
    this.height = 280;
    this._innerHTML = '';
    this._textContent = '';
    this._ctx2d = null;
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(val) {
    this._innerHTML = String(val);
    this.children = [];
    this._textContent = this._innerHTML.replace(/<[^>]*>/g, '');

    // Parse de etiquetas HTML de primer nivel y atributos
    const tagRegex = /<([a-zA-Z0-9_-]+)([^>]*)>([\s\S]*?)<\/\1>|<([a-zA-Z0-9_-]+)([^>]*)\/>/g;
    let match;
    while ((match = tagRegex.exec(this._innerHTML)) !== null) {
      const tagName = match[1] || match[4];
      const rawAttrs = match[2] || match[5] || '';
      const inner = match[3] || '';
      const child = new MockDOMElement(tagName);

      const attrRegex = /([a-zA-Z0-9_-]+)=["']([^"']*)["']/g;
      let attrMatch;
      while ((attrMatch = attrRegex.exec(rawAttrs)) !== null) {
        child.setAttribute(attrMatch[1], attrMatch[2]);
      }
      if (inner) {
        child.innerHTML = inner;
      }
      child.parentNode = this;
      this.children.push(child);
    }
  }

  get textContent() {
    return this._textContent;
  }

  set textContent(val) {
    this._textContent = String(val);
    this._innerHTML = String(val);
    this.children = [];
  }

  appendChild(child) {
    if (child) {
      child.parentNode = this;
      this.children.push(child);
    }
    return child;
  }

  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.parentNode = null;
    }
    return child;
  }

  replaceChild(newChild, oldChild) {
    const idx = this.children.indexOf(oldChild);
    if (idx !== -1) {
      this.children[idx] = newChild;
      newChild.parentNode = this;
      oldChild.parentNode = null;
    }
    return oldChild;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name === 'id') this.id = String(value);
    if (name === 'class') {
      this.className = String(value);
      this.classList._classes = new Set(String(value).split(/\s+/).filter(Boolean));
    }
    if (name.startsWith('data-')) {
      const key = name.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      this.dataset[key] = String(value);
    }
  }

  getAttribute(name) {
    if (name === 'id') return this.id || null;
    if (name === 'class') return Array.from(this.classList._classes).join(' ') || null;
    return this.attributes[name] !== undefined ? this.attributes[name] : null;
  }

  removeAttribute(name) {
    delete this.attributes[name];
    if (name === 'id') this.id = '';
    if (name === 'class') {
      this.className = '';
      this.classList._classes.clear();
    }
  }

  addEventListener(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  removeEventListener(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  dispatchEvent(event) {
    const type = typeof event === 'string' ? event : (event.type || 'click');
    const evt = typeof event === 'object' ? event : { type, target: this, currentTarget: this };
    evt.target = evt.target || this;
    evt.currentTarget = this;
    evt.preventDefault = evt.preventDefault || (() => {});
    evt.stopPropagation = evt.stopPropagation || (() => {});

    if (this.listeners[type]) {
      for (const cb of this.listeners[type]) {
        cb.call(this, evt);
      }
    }
    return true;
  }

  click() {
    this.dispatchEvent('click');
  }

  getContext(type) {
    if (type === '2d') {
      if (!this._ctx2d) {
        this._ctx2d = new MockCanvasContext2D(this);
      }
      return this._ctx2d;
    }
    return null;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector) {
    const results = [];
    const walk = (node) => {
      if (!node) return;
      if (node !== this && matchesSelector(node, selector)) {
        results.push(node);
      }
      for (const child of node.children) {
        walk(child);
      }
    };
    walk(this);
    return results;
  }

  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      bottom: 280,
      right: 640,
      width: this.width || 640,
      height: this.height || 280,
      x: 0,
      y: 0
    };
  }

  scrollIntoView() {}
}

/**
 * Función auxiliar para verificar coincidencia de selectores CSS comunes.
 */
function matchesSelector(element, selector) {
  if (!selector) return false;
  selector = selector.trim();

  // Selector de ID (#id)
  if (selector.startsWith('#')) {
    return element.id === selector.slice(1);
  }

  // Selector de clase (.class)
  if (selector.startsWith('.')) {
    return element.classList.contains(selector.slice(1));
  }

  // Selector de etiqueta (button, div, canvas)
  if (/^[a-zA-Z0-9_-]+$/.test(selector)) {
    return element.tagName.toLowerCase() === selector.toLowerCase();
  }

  // Selector compuesto etiqueta.clase
  const tagClassMatch = selector.match(/^([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)$/);
  if (tagClassMatch) {
    return element.tagName.toLowerCase() === tagClassMatch[1].toLowerCase() &&
           element.classList.contains(tagClassMatch[2]);
  }

  // Selector de atributo [attr="val"]
  const attrMatch = selector.match(/^\[([a-zA-Z0-9_-]+)(?:=([\"']?)(.*?)\2)?\]$/);
  if (attrMatch) {
    const attrName = attrMatch[1];
    const attrVal = attrMatch[3];
    const val = element.getAttribute(attrName);
    if (attrVal === undefined) return val !== null;
    return val === attrVal;
  }

  return false;
}

/**
 * Almacenamiento local en memoria compatible con la especificación Web Storage.
 */
class MockLocalStorage {
  constructor() {
    this.store = {};
  }

  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }

  clear() {
    this.store = {};
  }

  get length() {
    return Object.keys(this.store).length;
  }

  key(n) {
    const keys = Object.keys(this.store);
    return keys[n] || null;
  }
}

/**
 * Sandbox completo de pruebas que inicializa el DOM, carga los scripts de la app
 * y expone métodos de control para ejecución determinista de tests.
 */
class TestEnvironment {
  constructor(options = {}) {
    this.options = options;
    this.projectRoot = path.resolve(__dirname, '..');
    this.storage = new MockLocalStorage();
    this.activeTimers = [];
    this.animationCallbacks = new Map();
    this.nextAnimId = 1;
    this.initDOM();
  }

  initDOM() {
    const bodyEl = new MockDOMElement('body');
    const headEl = new MockDOMElement('head');
    this.body = bodyEl;
    this.head = headEl;

    this.document = {
      createElement: (tagName) => new MockDOMElement(tagName),
      getElementById: (id) => this.getElementById(id),
      querySelector: (selector) => this.querySelector(selector),
      querySelectorAll: (selector) => this.querySelectorAll(selector),
      addEventListener: (event, cb) => bodyEl.addEventListener(event, cb),
      removeEventListener: (event, cb) => bodyEl.removeEventListener(event, cb),
      dispatchEvent: (event) => bodyEl.dispatchEvent(event),
      body: bodyEl,
      head: headEl,
      title: 'ElectronFlow EE 101'
    };

    // Estructura básica de elementos contenedores requeridos por ElectronFlow
    this.elementsMap = new Map();
    this.setupCoreDOMElements();

    this.window = {
      document: this.document,
      localStorage: this.storage,
      sessionStorage: new MockLocalStorage(),
      location: { href: 'http://localhost:3000/', search: '', hash: '' },
      navigator: { userAgent: 'Node-E2E-Harness' },
      setTimeout: (cb, ms) => {
        const id = setTimeout(cb, ms);
        this.activeTimers.push(id);
        return id;
      },
      clearTimeout: (id) => clearTimeout(id),
      setInterval: (cb, ms) => {
        const id = setInterval(cb, ms);
        this.activeTimers.push(id);
        return id;
      },
      clearInterval: (id) => clearInterval(id),
      requestAnimationFrame: (cb) => {
        const id = this.nextAnimId++;
        this.animationCallbacks.set(id, cb);
        return id;
      },
      cancelAnimationFrame: (id) => {
        this.animationCallbacks.delete(id);
      },
      AudioContext: class {
        constructor() {
          this.state = 'running';
          this.currentTime = 0;
          this.destination = {};
        }
        createOscillator() {
          return {
            type: 'sine',
            frequency: { setValueAtTime: () => {} },
            connect: () => {},
            start: () => {},
            stop: () => {}
          };
        }
        createGain() {
          return {
            gain: {
              setValueAtTime: () => {},
              exponentialRampToValueAtTime: () => {}
            },
            connect: () => {}
          };
        }
        resume() {
          this.state = 'running';
        }
      },
      katex: {
        render: (tex, el, opts) => {
          if (el) {
            el.innerHTML = `<span class="katex-rendered">${tex}</span>`;
          }
        },
        renderToString: (tex, opts) => {
          return `<span class="katex-rendered">${tex}</span>`;
        }
      },
      addEventListener: (evt, cb) => this.document.body.addEventListener(evt, cb),
      removeEventListener: (evt, cb) => this.document.body.removeEventListener(evt, cb),
      dispatchEvent: (evt) => this.document.body.dispatchEvent(evt),
      scroll: () => {},
      scrollTo: () => {}
    };

    // Referencias cruzadas globales
    this.window.window = this.window;
    this.window.globalThis = this.window;
  }

  setupCoreDOMElements() {
    const requiredIds = [
      'app-layout',
      'step-container',
      'step-nav',
      'sidebar',
      'header-breadcrumb',
      'keyboard-hints-bar',
      'course-toc',
      'progress-bar-fill',
      'progress-text',
      'btn-prev-step',
      'btn-next-step',
      'tutor-drawer',
      'tutor-chat-messages',
      'tutor-input',
      'tutor-send-btn',
      'cheatsheet-modal',
      'cheatsheet-content',
      'audio-player-bar',
      'audio-waveform',
      'electron-canvas'
    ];

    requiredIds.forEach(id => {
      const el = new MockDOMElement('div');
      el.id = id;
      this.elementsMap.set(id, el);
      this.document.body.appendChild(el);
    });
  }

  getElementById(id) {
    if (this.elementsMap.has(id)) {
      return this.elementsMap.get(id);
    }
    // Búsqueda en el árbol si fue creado dinámicamente
    const found = this.querySelector('#' + id);
    if (found) {
      this.elementsMap.set(id, found);
      return found;
    }
    // Si no existe, creamos un elemento neutro registrado para evitar null pointer
    const fallback = new MockDOMElement('div');
    fallback.id = id;
    this.elementsMap.set(id, fallback);
    this.document.body.appendChild(fallback);
    return fallback;
  }

  querySelector(selector) {
    return this.document.body.querySelector(selector);
  }

  querySelectorAll(selector) {
    return this.document.body.querySelectorAll(selector);
  }

  /**
   * Carga y evalúa los archivos JavaScript del núcleo de ElectronFlow en el contexto sandbox.
   */
  loadScripts() {
    const context = vm.createContext({
      window: this.window,
      document: this.document,
      localStorage: this.storage,
      sessionStorage: this.window.sessionStorage,
      navigator: this.window.navigator,
      setTimeout: this.window.setTimeout,
      clearTimeout: this.window.clearTimeout,
      setInterval: this.window.setInterval,
      clearInterval: this.window.clearInterval,
      requestAnimationFrame: this.window.requestAnimationFrame,
      cancelAnimationFrame: this.window.cancelAnimationFrame,
      AudioContext: this.window.AudioContext,
      katex: this.window.katex,
      console: console,
      Math: Math,
      Date: Date,
      JSON: JSON,
      Array: Array,
      Object: Object,
      String: String,
      Number: Number,
      Boolean: Boolean,
      RegExp: RegExp,
      Error: Error
    });

    const scriptFiles = [
      'curriculum.js',
      'tutor_knowledge_base.js',
      'tutor_engine.js',
      'script.js'
    ];

    for (const file of scriptFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        const code = fs.readFileSync(filePath, 'utf8');
        try {
          vm.runInContext(code, context, { filename: file });
        } catch (err) {
          // Si script.js falla por selectores de inicialización antes de DOMContentLoaded, capturamos con detalle
          console.warn(`[Aviso en carga de ${file}]: ${err.message}`);
        }
      }
    }

    this.sandboxContext = context;
    return context;
  }

  /**
   * Dispara una animación registrada mediante requestAnimationFrame.
   */
  stepAnimation(timestamp = Date.now()) {
    const callbacks = Array.from(this.animationCallbacks.values());
    this.animationCallbacks.clear();
    callbacks.forEach(cb => {
      try {
        cb(timestamp);
      } catch (err) {
        console.warn('Error en callback de animación:', err.message);
      }
    });
  }

  cleanup() {
    this.activeTimers.forEach(id => clearTimeout(id));
    this.activeTimers = [];
    this.animationCallbacks.clear();
  }
}

module.exports = {
  Assertions,
  MockCanvasContext2D,
  MockDOMElement,
  MockLocalStorage,
  TestEnvironment
};
