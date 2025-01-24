export function picker(event, element) {
  console.log(event);
  const container = document.createElement('div');

  element.parentNode.insertBefore(container, element.nextSibling);
  container.id = `${element.id}-helper`;
  container.setAttribute('_chroma', 'picker');
  container.innerHTML = `
  
  `
}
