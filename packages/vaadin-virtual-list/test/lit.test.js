import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { html, render } from 'lit';

import '../vaadin-virtual-list.js';

describe('lit', () => {
  describe('renderer', () => {
    let list;

    beforeEach(() => {
      list = fixtureSync(`<vaadin-virtual-list></vaadin-virtual-list>`);
      const size = 100;

      list.items = new Array(size).fill().map((_, i) => i);
      list.renderer = (el, _, model) => (el.innerHTML = `value-${model.item}`);
    });

    it('should render the initial content', () => {
      expect(list.children[0].textContent.trim()).to.equal('value-0');
    });

    it('should clear the old content after assigning a new renderer', () => {
      list.renderer = () => {
        /* no-op */
      };
      expect(list.children[0].textContent.trim()).to.equal('');
    });

    it('should render new content after assigning a new renderer', () => {
      list.renderer = (el, _, model) => render(html`text-${model.item}`, el);
      expect(list.children[0].textContent.trim()).to.equal('text-0');
    });
  });
});
