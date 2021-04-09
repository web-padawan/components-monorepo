import { PolymerElement, html } from '@polymer/polymer';

export class HostElement extends PolymerElement {
  static get template() {
    return html`
      <my-element id="content">
        <template>
          [[prop]]
          <input value="{{prop::input}}" />
        </template>
      </my-element>
    `;
  }

  static get properties() {
    return {
      prop: String
    };
  }
}
