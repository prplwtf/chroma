function theme() {
  // Create style element
  const stylesheet = document.createElement('style');

  // Define styles
  const style = `
    :root {
      --chroma-input-border: 1px black solid;
      --chroma-input-radius: 12px;
    }

    input.chroma\\:field {
      border-radius: var(--chroma-input-radius);
      border: var(--chroma-input-border);
    }
  `;

  // Set the styles
  stylesheet.textContent = style;

  // Append to head instead of firstChild
  document.head.appendChild(stylesheet);
}

export default theme;
