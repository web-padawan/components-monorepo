# @vaadin/vaadin-template-renderer

Adds declarative `<template>` APIs with Polymer binding support to Vaadin components.

## Installation
```
npm i @vaadin/vaadin-template-renderer
```

## Example:

```html
<script type="module">
  import '@vaadin/vaadin-template-renderer';
</script>

<vaadin-select>
  <template>
    <vaadin-list-box>
      <vaadin-item>foo</vaadin-item>
      <vaadin-item>bar</vaadin-item>
    </vaadin-list-box>
  </template>
</vaadin-select>
```

## License

Apache License 2.0
