export class MyElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<div id="content"></div>`;
    this._content = this.shadowRoot.querySelector('#content');
  }

  connectedCallback() {
    if (window.Vaadin.templateRendererCallback) {
      window.Vaadin.templateRendererCallback(this);
    }
  }

  set renderer(renderer) {
    this.__renderer = renderer;
    this.render();
  }

  render() {
    if (this.__renderer) {
      this.__renderer(this._content);
    }
  }
}
