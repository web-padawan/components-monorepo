import { ironList } from './iron-list';

// TODO: _vidxOffset
export class Virtualizer {
  constructor(config) {
    this.isAttached = true;
    this._scrollTop = 0;

    Object.assign(this, config);

    this.scrollContainer.style.position = 'relative';
    new ResizeObserver(() => this._resizeHandler()).observe(this.scrollTarget);
    this.scrollTarget.addEventListener('scroll', () => {
      this._scrollTop = this.scrollTarget.scrollTop;
      this._scrollHandler();
    });
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
  get items() {
    return {
      length: this.size
    };
  }

  /** @private */
  get offsetWidth() {
    return this.scrollTarget.offsetWidth;
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
    this._viewportWidth = this.$.items.offsetWidth;
    this._viewportHeight = this.scrollTarget.offsetHeight;
  }

  /** @private */
  _createPool(size) {
    const physicalItems = this.createItems(size);
    const fragment = document.createDocumentFragment();
    physicalItems.forEach((el) => {
      el.style.position = 'absolute';
      fragment.appendChild(el);
    });
    this.itemsTarget.appendChild(fragment);
    return physicalItems;
  }

  /** @private */
  _assignModels(itemSet) {
    this._iterateItems((pidx, vidx) => {
      const el = this._physicalItems[pidx];
      el.hidden = vidx >= this._effectiveSize;
      if (!el.hidden) {
        this.updateItem(el, vidx + (this._vidxOffset || 0));
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

Object.setPrototypeOf(Virtualizer.prototype, ironList);
