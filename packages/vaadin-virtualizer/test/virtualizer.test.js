import { expect } from '@esm-bundle/chai';
import { fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import { Virtualizer } from '..';

describe('virtualizer', () => {
  let virtualizer;
  let scrollTarget;
  let scrollContainer;
  let elementsContainer;

  function init(config = {}) {
    scrollTarget = fixtureSync(`
      <div style="height: 100px;">
        <div></div>
      </div>
    `);
    scrollContainer = scrollTarget.firstElementChild;
    elementsContainer = scrollContainer;

    virtualizer = new Virtualizer({
      createElements: (count) => Array.from(Array(count)).map(() => document.createElement('div')),
      updateElement: (el, index) => {
        el.index = index;
        el.id = `item-${index}`;
        el.textContent = el.id;
      },
      scrollTarget,
      scrollContainer,
      elementsContainer,
      ...config
    });

    virtualizer.size = 100;
  }

  beforeEach(() => init());

  it('should have the first item at the top', () => {
    const item = elementsContainer.querySelector('#item-0');
    expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
  });

  it('should support padding-top on scroll target', () => {
    scrollTarget.style.paddingTop = '10px';
    virtualizer.notifyResize();
    virtualizer.scrollToIndex(0);
    const item = elementsContainer.querySelector('#item-0');
    expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
  });

  it('should scroll to index', () => {
    virtualizer.scrollToIndex(50);
    const item = elementsContainer.querySelector('#item-50');
    expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top);
  });

  it('should not include the first item when scrolled to end', () => {
    virtualizer.scrollToIndex(virtualizer.size - 1);
    const item = elementsContainer.querySelector('#item-0');
    expect(item).not.to.be.ok;
  });

  it('should have the last item at the bottom when scrolled to end', () => {
    virtualizer.scrollToIndex(virtualizer.size - 1);
    const item = elementsContainer.querySelector(`#item-${virtualizer.size - 1}`);
    expect(item.getBoundingClientRect().bottom).to.equal(scrollTarget.getBoundingClientRect().bottom);
  });

  it('should manually scroll to end', async () => {
    scrollTarget.scrollTop = scrollTarget.scrollHeight;
    await oneEvent(scrollTarget, 'scroll');
    const item = elementsContainer.querySelector(`#item-${virtualizer.size - 1}`);
    expect(item.getBoundingClientRect().bottom).to.equal(scrollTarget.getBoundingClientRect().bottom);
  });

  it('should increase the physical item count on height increase', () => {
    const initialItemCount = elementsContainer.childElementCount;
    scrollTarget.style.height = `${scrollTarget.offsetHeight * 2}px`;
    virtualizer.flush();
    expect(elementsContainer.childElementCount).to.be.above(initialItemCount);
  });

  describe('reorder elements', () => {
    let recycledElement;

    // This helper checks whether all the elements are in numerical order by their index
    function elementsInOrder() {
      return Array.from(elementsContainer.children).every((element, index, [firstElement]) => {
        return element.hidden || element.index === firstElement.index + index;
      });
    }

    // This helper scrolls the virtualizer enough to cause some elements to get
    // recycled but not too much to cause a full recycle.
    // Returns a list of the elements that were detached while being reordered.
    async function scrollRecycle() {
      return await new Promise((resolve) => {
        new MutationObserver((mutations) => {
          resolve(mutations.flatMap((record) => [...record.removedNodes]));
        }).observe(elementsContainer, { childList: true });

        virtualizer.scrollToIndex(Math.ceil(elementsContainer.childElementCount / 2));
        virtualizer.flush();
      });
    }

    beforeEach(() => {
      init({ reorderElements: true });
      recycledElement = elementsContainer.children[2];
    });

    it('should have the elements in order', async () => {
      scrollRecycle();
      expect(elementsInOrder()).to.be.true;
    });

    it('should not have the elements in order', async () => {
      init({ reorderElements: false });

      scrollRecycle();
      expect(elementsInOrder()).to.be.false;
    });

    it('should detach the element without focus on reorder', async () => {
      const detachedElements = await scrollRecycle();
      expect(detachedElements).to.include(recycledElement);
    });

    it('should not detach the element with focus on reorder', async () => {
      recycledElement.tabIndex = 0;
      recycledElement.focus();

      const detachedElements = await scrollRecycle();
      expect(detachedElements).not.to.include(recycledElement);
    });

    it('should not try to reorder an empty virtualizer', async () => {
      virtualizer.size = 0;
      expect(async () => await scrollRecycle()).not.to.throw(Error);
    });
  });

  // it('should restore scroll position on size change', async () => {
  //   // Scroll to item 50 and an additional 10 pixels
  //   virtualizer.scrollToIndex(50);
  //   scrollTarget.scrollTop = scrollTarget.scrollTop + 10;

  //   virtualizer.size = virtualizer.size * 2;
  //   const item = scrollContainer.querySelector('#item-50');
  //   expect(item.getBoundingClientRect().top).to.equal(scrollTarget.getBoundingClientRect().top - 10);
  // });
});
