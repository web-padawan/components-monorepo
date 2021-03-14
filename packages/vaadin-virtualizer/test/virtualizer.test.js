import { expect } from '@esm-bundle/chai';
import { fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import { Virtualizer } from '..';

describe('virtualizer', () => {
  let virtualizer;
  let scrollTarget;
  let scrollContainer;

  beforeEach(() => {
    scrollTarget = fixtureSync(`
      <div style="height: 100px;">
        <div></div>
      </div>
    `);
    scrollContainer = scrollTarget.firstElementChild;

    virtualizer = new Virtualizer({
      createItems: (count) => Array.from(Array(count)).map(() => document.createElement('div')),
      updateItem: (el, index) => {
        el.id = `item-${index}`;
        el.textContent = el.id;
      },
      scrollTarget,
      scrollContainer,
      itemsTarget: scrollContainer
    });

    virtualizer.size = 100;
  });

  it('should have the first item at the top', () => {
    const item = scrollContainer.querySelector('#item-0');
    expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
  });

  it('should support padding-top on scroll target', () => {
    scrollTarget.style.paddingTop = '10px';
    virtualizer.notifyResize();
    virtualizer.scrollToIndex(0);
    const item = scrollContainer.querySelector('#item-0');
    expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
  });

  it('should scroll to index', () => {
    virtualizer.scrollToIndex(50);
    const item = scrollContainer.querySelector('#item-50');
    expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
  });

  it('should not include the first item when scrolled to end', () => {
    virtualizer.scrollToIndex(virtualizer.size - 1);
    const item = scrollContainer.querySelector('#item-0');
    expect(item).not.to.be.ok;
  });

  it('should have the last item at the bottom when scrolled to end', () => {
    virtualizer.scrollToIndex(virtualizer.size - 1);
    const item = scrollContainer.querySelector(`#item-${virtualizer.size - 1}`);
    expect(item.getBoundingClientRect().bottom).to.equal(scrollTarget.getBoundingClientRect().bottom);
  });

  it('should manually scroll to end', async () => {
    scrollTarget.scrollTop = scrollTarget.scrollHeight;
    await oneEvent(scrollTarget, 'scroll');
    const item = scrollContainer.querySelector(`#item-${virtualizer.size - 1}`);
    expect(item.getBoundingClientRect().bottom).to.equal(scrollTarget.getBoundingClientRect().bottom);
  });

  it('should increase the physical item count on height increase', async () => {
    const initialItemCount = scrollContainer.childElementCount;
    scrollTarget.style.height = `${scrollTarget.offsetHeight * 2}px`;
    await new Promise((resolve) => new MutationObserver(resolve).observe(scrollContainer, { childList: true }));
    expect(scrollContainer.childElementCount).to.be.above(initialItemCount);
  });
});
