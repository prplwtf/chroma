import theme from './theme.js';
import { picker } from './picker.js';

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
    console.log('Initializing on', this.element);
    this.element.setAttribute('_chroma', 'input');

    const label = document.createElement('label');
    label.setAttribute('_chroma', 'input');

    if (!this.element.id) {
      this.element.id = `chroma-input-${Math.random().toString(36).substr(2, 9)}`;
    }
    label.setAttribute('for', this.element.id);
    this.element.parentNode.insertBefore(label, this.element);

    this.element.addEventListener('click', (e) => {
      picker(e, this.element);
    });

    return [];
  }
}

export default Chroma;
