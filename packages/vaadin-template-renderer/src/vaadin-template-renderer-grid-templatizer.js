import { Templatizer } from './vaadin-template-renderer-templatizer.js';

export class GridTemplatizer extends Templatizer {
  /**
   * @override
   */
  static get is() {
    return 'vaadin-template-renderer-grid-templatizer';
  }

  /**
   * Updates the grid items once an item's nested property is changed.
   *
   * Note: The templatizer doesn't support 2-way binding for items provided by custom data provider.
   * Note: The templatizer doesn't support 2-way binding for the whole item:
   * <div>{{item}}</div> - not allowed.
   * <div>{{item.title}}</div> - allowed.
   *
   * @private
   */
  __onItemPropertyChanged(instance, path, value) {
    // Supports 2-way binding only for nested `item` properties.
    if (path === 'item') {
      return;
    }

    // Supports 2-way binding only for items provided by the array data provider.
    if (!Array.isArray(this.__grid.items)) {
      return;
    }

    const index = this.__grid.items.indexOf(instance.item);

    path = path.replace(/^item\./, '');
    path = `items.${index}.${path}`;

    this.__grid.notifyPath(path, value);
  }

  /**
   * Expands or collapses the item once the `expanded` property is changed.
   * The listener handles only user-fired changes.
   *
   * @private
   */
  __onExpandedPropertyChanged(instance, _path, value) {
    // Skip if the value is changed by the templatizer.
    if (instance.__properties.expanded === value) {
      return;
    }

    if (value) {
      this.__grid.expandItem(instance.item);
    } else {
      this.__grid.collapseItem(instance.item);
    }
  }

  /**
   * Selects or deselects the item once the `selected` property is changed.
   * The listener handles only user-fired changes.
   *
   * @private
   */
  __onSelectedPropertyChanged(instance, _path, value) {
    // Skip if the value is changed by the templatizer.
    if (instance.__properties.selected === value) {
      return;
    }

    if (value) {
      this.__grid.selectItem(instance.item);
    } else {
      this.__grid.deselectItem(instance.item);
    }
  }

  /**
   * Opens or closes the details for the item once the `detailsOpened` property is changed.
   * The listener handles only user-fired changes.
   *
   * @private
   */
  __onDetailsOpenedPropertyChanged(instance, _path, value) {
    // Skip if the value is changed by the templatizer.
    if (instance.__properties.detailsOpened === value) {
      return;
    }

    if (value) {
      this.__grid.openItemDetails(instance.item);
    } else {
      this.__grid.closeItemDetails(instance.item);
    }
  }

  /**
   * Returns a reference to the grid which the templatizer is connected to.
   *
   * @private
   */
  get __grid() {
    if (this.__component.constructor.is === 'vaadin-grid') {
      return this.__component;
    }

    return this.__component._grid;
  }
}

customElements.define(GridTemplatizer.is, GridTemplatizer);