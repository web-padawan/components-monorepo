import { expect } from '@esm-bundle/chai';
import '../vaadin-template-renderer';
import { fixtureSync } from '@vaadin/testing-helpers';

import { MyElement } from './my-element';
import { HostElement } from './host-element';
customElements.define('my-element', MyElement);
customElements.define('host-element', HostElement);

describe('vaadin-template-renderer', () => {
  it('should render the template content', async () => {
    const el = await fixtureSync(`
      <my-element>
        <template>foo</template>
      </my-element>
    `);
    expect(el._content.textContent?.trim()).to.equal(`foo`);
  });

  //   it('should observe for dynamically added templates', async () => {
  //     const el = await fixtureSync(`<my-element></my-element>`);
  //     const template = await fixtureSync(`<template>foo</template>`);
  //     el.appendChild(template);
  //     // Need to wait for the MutationObserver to pick up the template
  //     await nextFrame();
  //     expect(el.$.content.textContent?.trim()).to.equal(`foo`);
  //   });

  it('should bind parent property', async () => {
    const el = await fixtureSync(`<host-element></host-element>`);
    el.prop = `foo`;
    const myElement = el.$.content;
    expect(myElement._content.textContent?.trim()).to.equal(`foo`);
  });

  it('should two-way bind a property', async () => {
    const el = await fixtureSync(`<host-element></host-element>`);
    const myElement = el.$.content;
    const input = myElement._content.querySelector(`input`);
    input.value = 'foo';
    input.dispatchEvent(new CustomEvent(`input`));
    expect(el.prop).to.equal(`foo`);
  });
});
