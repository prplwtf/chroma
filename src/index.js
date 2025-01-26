import { picker } from './picker.js';
import './chroma.css';

class Chroma {
  static defaults = {
    initialColor: '#000000', // Default black if no color specified
  };

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

    // Set initial color if input is empty
    if (!this.element.value) {
      this.element.value = this.options.initialColor;
    }

    // Ensure the color preview is showing on initialization
    if (this.element.value.match(/^#[0-9A-Fa-f]{6}$/)) {
      label.style.backgroundColor = this.element.value;
      this.element.style.setProperty('--chroma-data-color', this.element.value);
    }

    this.element.addEventListener('click', () => {
      picker(this.element);
    });

    return [];
  }
}

export default Chroma;
