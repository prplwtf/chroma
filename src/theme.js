function theme() {
  // Create style element
  const stylesheet = document.createElement('style');

  // Define styles
  const style = `
    [_chroma] {
      --chroma-input-border-width: 1px;
      --chroma-input-border-color: black;
      --chroma-input-border-style: solid;
      --chroma-input-border-radius: 12px;
      --chroma-input-height: 20px;
      --chroma-input-color: black;
      --chroma-input-padding: 1px;
    }

    input[_chroma="input"],
    label[_chroma="input"] {
      border-width: var(--chroma-input-border-width);
      border-color: var(--chroma-input-border-color);
      border-style: var(--chroma-input-border-style);
      padding: var(--chroma-input-padding);
    }

    input[_chroma="input"] {
      border-radius: 0px var(--chroma-input-border-radius) var(--chroma-input-border-radius) 0px;
      height: var(--chroma-input-height);
    }

    label[_chroma="input"] {
      border-radius: var(--chroma-input-border-radius) 0px 0px var(--chroma-input-border-radius);
      float: left;
      width: 20px;
      height: var(--chroma-input-height);
      background-color: var(--chroma-input-color);
    }
  `;

  // Set the styles
  stylesheet.textContent = style;

  // Append to head instead of firstChild
  document.head.appendChild(stylesheet);
}

export default theme;
