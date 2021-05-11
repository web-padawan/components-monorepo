import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@vaadin/testing-helpers';
import '@vaadin/vaadin-template-renderer';
import '../vaadin-dialog.js';

describe('vaadin-dialog renderer', () => {
  describe('without template', () => {
    let dialog, overlay;

    beforeEach(() => {
      dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
      overlay = dialog.$.overlay;
    });

    it('should render the content of renderer function when renderer function provided', () => {
      dialog.renderer = (root) => {
        const div = document.createElement('div');
        div.textContent = 'The content of the dialog';
        root.appendChild(div);
      };
      dialog.opened = true;

      expect(overlay.textContent).to.include('The content of the dialog');
    });

    it('should be possible to manually invoke renderer', () => {
      dialog.renderer = sinon.spy();
      dialog.opened = true;
      expect(dialog.renderer.calledOnce).to.be.true;
      dialog.render();
      expect(dialog.renderer.calledTwice).to.be.true;
    });

    it('should clear the content when removing the renderer', () => {
      dialog.renderer = (root) => {
        root.innerHTML = 'foo';
      };
      dialog.opened = true;

      expect(overlay.textContent).to.equal('foo');

      dialog.renderer = null;

      expect(overlay.textContent).to.equal('');
    });
  });

  describe('with template', () => {
    let dialog, overlay;

    beforeEach(() => {
      dialog = fixtureSync(`
        <vaadin-dialog>
          <template>foo</template>
        </vaadin-dialog>
      `);
      overlay = dialog.$.overlay;
    });

    it('should render the template', () => {
      dialog.opened = true;
      expect(overlay.textContent).to.equal('foo');
    });
  });
});
