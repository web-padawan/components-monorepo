import { GridColumnElement } from '@vaadin/vaadin-grid/src/vaadin-grid-column';
import { GridColumnGroupElement } from '@vaadin/vaadin-grid/src/vaadin-grid-column-group';
import { Templatizer as GridTemplatizer } from '@vaadin/vaadin-grid/src/vaadin-grid-templatizer';
import { VirtualListElement } from '../vaadin-virtual-list/src/vaadin-virtual-list';
import { ComboBoxElement } from '../vaadin-combo-box/src/vaadin-combo-box';
import { templatize } from '@polymer/polymer/lib/utils/templatize';

function singleInstanceRenderer(template) {
  // if (!(component instanceof PolymerElement) || !component.__dataReady) {
  //   return;
  // }

  let instance = new (templatize(template, null, {
    forwardHostProp: (prop, value) => instance && instance.forwardHostProp(prop, value)
  }))();
  return (root) => {
    if (root._instance !== instance) {
      root._instance = instance;
      root.innerHTML = '';
      root.appendChild(instance.root);
    }
  };
}

function processTemplate(component, template) {
  // TODO: Hacky?
  template.__dataHost = component;
  component._addEventListenerToNode =
    component._addEventListenerToNode ||
    ((node, eventName, handler) => {
      node.addEventListener(eventName, handler);
    });

  if (component instanceof VirtualListElement || component instanceof ComboBoxElement) {
    const Templatizer = templatize(template, null, {
      forwardHostProp: (prop, value) => {
        // TODO: Forward to all instances
        console.log('fhp', prop, value);
      }
    });

    component.renderer = (root, model) => {
      if (!root._instance) {
        root.innerHTML = '';
        const inst = new Templatizer();
        root._instance = inst;
        root.appendChild(inst.root);
      }
      root._instance.setProperties(model);
    };
  } else if (component instanceof GridColumnElement || component instanceof GridColumnGroupElement) {
    const column = component;
    if (template.classList.contains('header')) {
      column._headerTemplate = template;
      column.headerRenderer = singleInstanceRenderer(template, component);
    } else if (template.classList.contains('footer')) {
      column._footerTemplate = template;
      column.footerRenderer = singleInstanceRenderer(template, component);
    } else {
      column._bodyTemplate = template;
      const templatizer = new GridTemplatizer();
      templatizer._grid = column._grid;
      templatizer.template = template;
      // @ts-ignore
      template.templatizer = templatizer;
      column.renderer = (root, _, model) => {
        if (!root._instance) {
          root.innerHTML = '';
          templatizer._grid = templatizer._grid || column._grid;
          const inst = templatizer.createInstance();
          root._instance = inst;
          root.appendChild(inst.root);
          root.assignedSlot.parentElement._instance = root._instance;
        }
        Object.assign(root._instance, model);
      };
    }
  } else {
    if (template.classList.contains('row-details')) {
      // Expect vaadin-grid element. Can't import for type check (would disable import of a themed grid).
      // TODO: Row details template
    } else {
      component.renderer = singleInstanceRenderer(template, component);
    }
  }
}

function detectPolymerTemplates(node) {
  Array.from(node.children)
    .filter((child) => child instanceof HTMLTemplateElement)
    .forEach((template) => {
      if (template instanceof HTMLTemplateElement && !('__templatizeOwner' in template)) {
        processTemplate(node, template);
      }
    });
}

window.Vaadin = window.Vaadin || {};
window.Vaadin.templateRendererCallback = (vaadinComponent) => {
  detectPolymerTemplates(vaadinComponent);
};
