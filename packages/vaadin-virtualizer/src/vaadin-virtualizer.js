import { ironList } from './iron-list';

export class Virtualizer {
  constructor(config) {
    this.__adapter = new IronListAdapter(config);
  }

  set size(size) {
    this.__adapter.size = size;
  }

  get size() {
    return this.__adapter.size;
  }

  scrollToIndex(index) {
    this.__adapter.scrollToIndex(index);
  }

  notifyResize() {
    this.__adapter.notifyResize();
  }
}

// TODO: _vidxOffset (= unlimited size, grid scroller feature)
// TODO: Restore scroll position after size change (grid scroller feature)
class IronListAdapter {
  constructor({ createElements, updateElement, scrollTarget, scrollContainer, elementsContainer }) {
    this.isAttached = true;
    this.createElements = createElements;
    this.updateElement = updateElement;
    this.scrollTarget = scrollTarget;
    this.scrollContainer = scrollContainer;
    this.elementsContainer = elementsContainer;

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
        this.updateElement(el, vidx + (this._vidxOffset || 0));
      }
    }, itemSet);
  }

  /** @private */
  translate3d(_x, y, _z, el) {
    el.style.transform = `translate3d(0, ${y}, 0)`;
  }

  /** @private */
  toggleScrollListener() {}
}

Object.setPrototypeOf(IronListAdapter.prototype, ironList);
