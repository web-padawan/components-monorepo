import { IronListAdapter } from './vaadin-virtualizer-iron-list-adapter';

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

  /* Eliminate API in favour of resize observers? */
  notifyResize() {
    this.__adapter.notifyResize();
  }

  flush() {
    this.__adapter.flush();
  }
}
