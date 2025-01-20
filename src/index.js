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
    this.element.setAttribute('_chroma', 'input');

    // Create label element
    const label = document.createElement('label');
    label.setAttribute('_chroma', 'input');

    // Set the 'for' attribute to match the input's ID
    if (!this.element.id) {
      // Generate a unique ID if none exists
      this.element.id = `chroma-input-${Math.random().toString(36).substr(2, 9)}`;
    }
    label.setAttribute('for', this.element.id);

    // Insert label before the input element (instead of prepending to the element)
    this.element.parentNode.insertBefore(label, this.element);
  }
}

export default Chroma;
