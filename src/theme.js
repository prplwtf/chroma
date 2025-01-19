function theme() {
  const style = `
  body { background: black }
  `;

  const stylesheet = document.createElement('style');
  stylesheet.innerHTML = style;
  document.firstChild.appendChild(stylesheet);
}

export default theme;
