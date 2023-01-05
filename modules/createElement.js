function createElement(parentElement, tagName, classNames, text, attributes) {
  let element = document.createElement(tagName);

  element.classList.add(...classNames);
  parentElement.append(element);
  if (text) {
    element.textContent = text;
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  }
  
  return element;
}

export { createElement };
