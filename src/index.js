import theme from './theme.js';
theme();

class Chroma {
  static defaults = {};

  constructor(selector, options = {}) {
    this.element = document.querySelector(selector);
    this.options = {
      ...Chroma.defaults,
      ...options,
    };

    this.init();
  }

  init() {
    // Setup code
    console.log('Initializing on', this.element);
    this.element.classList.add('chroma:field');
  }
}

export default Chroma;
