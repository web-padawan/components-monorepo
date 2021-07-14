import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { InputFieldMixin } from '../src/input-field-mixin.js';

customElements.define(
  'input-field-mixin-element',
  class extends InputFieldMixin(PolymerElement) {
    static get template() {
      return html`
        <slot name="label"></slot>
        <slot name="input"></slot>
        <slot name="error-message"></slot>
        <slot name="helper"></slot>
      `;
    }
  }
);

describe('input-field-mixin', () => {
  let element, input;

  describe('properties', () => {
    beforeEach(() => {
      element = fixtureSync('<input-field-mixin-element></input-field-mixin-element>');
      input = element.querySelector('[slot=input]');
    });

    it('should propagate autocomplete property to the input', () => {
      element.autocomplete = 'on';
      expect(input.autocomplete).to.equal('on');
    });

    it('should propagate autocorrect property to the input', () => {
      element.autocorrect = 'on';
      expect(input.getAttribute('autocorrect')).to.equal('on');
    });

    it('should propagate autocapitalize property to the input', () => {
      element.autocapitalize = 'none';
      expect(input.getAttribute('autocapitalize')).to.equal('none');
    });

    it('should select the input content when autoselect is set', () => {
      const spy = sinon.spy(input, 'select');
      element.autoselect = true;
      input.focus();
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('value', () => {
    beforeEach(() => {
      element = fixtureSync('<input-field-mixin-element></input-field-mixin-element>');
      input = element.querySelector('[slot=input]');
    });

    it('should propagate value to the input element', () => {
      element.value = 'foo';
      expect(input.value).to.equal('foo');
    });

    it('should clear input value when value is set to null', () => {
      element.value = null;
      expect(input.value).to.equal('');
    });

    it('should update field value on the input event', () => {
      input.value = 'foo';
      input.dispatchEvent(new Event('input'));
      expect(element.value).to.equal('foo');
    });

    it('should clear input value when value is set to undefined', () => {
      element.value = undefined;
      expect(input.value).to.equal('');
    });

    it('should set has-value attribute when value is set', () => {
      element.value = 'foo';
      expect(element.hasAttribute('has-value')).to.be.true;
    });

    it('should remove has-value attribute when value is removed', () => {
      element.value = 'foo';
      element.value = '';
      expect(element.hasAttribute('has-value')).to.be.false;
    });
  });

  describe('validation', () => {
    beforeEach(() => {
      element = fixtureSync('<input-field-mixin-element></input-field-mixin-element>');
      input = element.querySelector('[slot=input]');
    });

    it('should validate on input blur', () => {
      const spy = sinon.spy(element, 'validate');
      input.dispatchEvent(new Event('blur'));
      expect(spy.calledOnce).to.be.true;
    });

    it('should validate on value change when field is invalid', () => {
      const spy = sinon.spy(element, 'validate');
      element.invalid = true;
      element.value = 'foo';
      expect(spy.calledOnce).to.be.true;
    });

    it('should call checkValidity on the input when required', () => {
      const spy = sinon.spy(input, 'checkValidity');
      element.required = true;
      element.checkValidity();
      expect(spy.calledOnce).to.be.true;
    });

    it('should not call checkValidity on the input when not required', () => {
      const spy = sinon.spy(input, 'checkValidity');
      element.checkValidity();
      expect(spy.calledOnce).to.be.false;
    });
  });

  describe('slotted input value', () => {
    beforeEach(() => {
      sinon.stub(console, 'warn');
    });

    afterEach(() => {
      console.warn.restore();
    });

    it('should warn when value is set on the slotted input', () => {
      element = fixtureSync(`
        <input-field-mixin-element>
          <input slot="input" value="foo">
        </input-field-mixin-element>
      `);
      expect(console.warn.called).to.be.true;
    });
  });
});
