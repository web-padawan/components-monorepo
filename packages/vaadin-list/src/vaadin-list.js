import { css, html, LitElement } from 'lit-element';
import { Virtualizer } from '@vaadin/vaadin-virtualizer';

export class VaadinList extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        height: 200px;
        overflow: auto;
      }
    `;
  }

  static get properties() {
    return {
      items: { type: Array },

      renderer: { type: Object }
    };
  }

  firstUpdated() {
    this.__virtualizer = new Virtualizer({
      createElements: this.__createElements,
      updateElement: this.__updateElement.bind(this),
      elementsContainer: this,
      scrollTarget: this,
      scrollContainer: this.shadowRoot.querySelector('div')
    });
  }

  updated() {
    if (this.items) {
      this.__virtualizer.size = this.items.length;
    }
  }

  /** @private */
  __createElements(count) {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push(document.createElement('div'));
    }
    return items;
  }

  /** @private */
  __updateElement(el, index) {
    this.renderer(el, { item: this.items[index], index });
  }

  render() {
    return html`<div>
      <slot></slot>
    </div>`;
  }
}

customElements.define('vaadin-list', VaadinList);
