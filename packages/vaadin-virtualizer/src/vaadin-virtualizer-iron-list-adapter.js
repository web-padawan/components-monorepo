import { timeOut } from './async';
import { Debouncer, enqueueDebouncer, flush } from './debounce';
import { ironList } from './iron-list';

// TODO: _vidxOffset (= unlimited size, grid scroller feature)
// TODO: Restore scroll position after size change (grid scroller feature)
// TODO: Convenient wheel scrolling (document won't immediately scroll once an edge is reached, grid-scroll-mixin feature)
export class IronListAdapter {
  constructor({ createElements, updateElement, scrollTarget, scrollContainer, elementsContainer, reorderElements }) {
    this.isAttached = true;
    this.createElements = createElements;
    this.updateElement = updateElement;
    this.scrollTarget = scrollTarget;
    this.scrollContainer = scrollContainer;
    this.elementsContainer = elementsContainer;
    this.reorderElements = reorderElements;

    this.timeouts = {
      SCROLLING: 500
    };

    // TODO: Too intrusive?
    if (getComputedStyle(this.scrollTarget).overflow === 'visible') {
      this.scrollTarget.style.overflow = 'auto';
    }
    // TODO: Too intrusive?
    if (getComputedStyle(this.scrollContainer).position === 'static') {
      this.scrollContainer.style.position = 'relative';
    }

    new ResizeObserver(() => this._resizeHandler()).observe(this.scrollTarget);
    this.scrollTarget.addEventListener('scroll', () => this._scrollHandler());
  }

  notifyResize() {
    this._resizeHandler();
  }

  scrollToIndex(index) {
    super.scrollToIndex(index);
    this._scrollHandler();
  }

  flush() {
    this._resizeHandler();
    flush();
  }

  set size(size) {
    this.__size = size;
    // TODO: _vidxOffset
    this._effectiveSize = size;
    this._itemsChanged({
      path: 'items'
    });
    this._render();
  }

  get size() {
    return this.__size;
  }

  /** @private */
  get _scrollTop() {
    return this.scrollTarget.scrollTop;
  }

  /** @private */
  set _scrollTop(top) {
    this.scrollTarget.scrollTop = top;
  }

  /** @private */
  get items() {
    return {
      length: this.size
    };
  }

  /** @private */
  get offsetHeight() {
    return this.scrollTarget.offsetHeight;
  }

  /** @private */
  get $() {
    return {
      items: this.scrollContainer
    };
  }

  /** @private */
  updateViewportBoundaries() {
    const styles = window.getComputedStyle(this.scrollTarget);
    this._scrollerPaddingTop = this.scrollTarget === this ? 0 : parseInt(styles['padding-top'], 10);
    this._viewportHeight = this.scrollTarget.offsetHeight;
  }

  /** @private */
  _createPool(size) {
    const physicalItems = this.createElements(size);
    const fragment = document.createDocumentFragment();
    physicalItems.forEach((el) => {
      el.style.position = 'absolute';
      fragment.appendChild(el);
    });
    this.elementsContainer.appendChild(fragment);
    return physicalItems;
  }

  /** @private */
  _assignModels(itemSet) {
    this._iterateItems((pidx, vidx) => {
      const el = this._physicalItems[pidx];
      el.hidden = vidx >= this._effectiveSize;
      if (!el.hidden) {
        el.__virtualIndex = vidx + (this._vidxOffset || 0);
        this.updateElement(el, el.__virtualIndex);
      }
    }, itemSet);
  }

  /** @private */
  translate3d(_x, y, _z, el) {
    el.style.transform = `translate3d(0, ${y}, 0)`;
  }

  /** @private */
  toggleScrollListener() {}

  _scrollHandler() {
    super._scrollHandler();

    enqueueDebouncer(
      Debouncer.debounce('debounceVirtualizerIronListAdapterScrolling', timeOut.after(this.timeouts.SCROLLING), () => {
        this.__reorderElements();
      })
    );
  }

  /** @private */
  __reorderElements() {
    if (!this.reorderElements) {
      return;
    }

    const adjustedVirtualStart = this._virtualStart + (this._vidxOffset || 0);

    // Which row to use as a target?
    const visibleElements = Array.from(this.elementsContainer.children).filter((element) => !element.hidden);
    const elementWithFocus = visibleElements.find((element) => element.contains(document.activeElement));
    const targetElement = elementWithFocus || visibleElements[0];
    if (!targetElement) {
      // All elements are hidden, don't reorder
      return;
    }

    // Where the target row should be?
    const targetPhysicalIndex = targetElement.__virtualIndex - adjustedVirtualStart;

    // Reodrer the DOM elements to keep the target row at the target physical index
    const delta = Array.from(visibleElements).indexOf(targetElement) - targetPhysicalIndex;
    if (delta > 0) {
      for (let i = 0; i < delta; i++) {
        this.elementsContainer.appendChild(visibleElements[i]);
      }
    } else if (delta < 0) {
      for (let i = visibleElements.length + delta; i < visibleElements.length; i++) {
        this.elementsContainer.insertBefore(visibleElements[i], visibleElements[0]);
      }
    }
  }
}

Object.setPrototypeOf(IronListAdapter.prototype, ironList);
