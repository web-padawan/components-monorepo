# &lt;vaadin-virtual-list&gt;

```html
<vaadin-virtual-list style="height: 100%; width: 100%" .items="${this.items}"></vaadin-virtual-list>
```

## Installation

Install `vaadin-virtual-list`:

```sh
npm i @vaadin/vaadin-virtual-list --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-virtual-list/vaadin-virtual-list.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-virtual-list.js`

- The component with the Material theme:

  `theme/material/vaadin-virtual-list.js`

- Alias for `theme/lumo/vaadin-virtual-list.js`:

  `vaadin-virtual-list.js`

## Running API docs and tests in a browser

1. Fork the `vaadin-virtual-list` repository and clone it locally.

1. Make sure you have [node.js](https://nodejs.org/) 12.x installed.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-virtual-list` directory, run `npm install` to install dependencies.

1. Run `npm start`, browser will automatically open the component API documentation.

1. You can also open visual tests, for example:

- http://127.0.0.1:3000/test/visual/default.html

## Running tests from the command line

1. When in the `vaadin-virtual-list` directory, run `npm test`

## Debugging tests in the browser

1. Run `npm run debug`, then choose manual mode (M) and open the link in browser.

## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `npm run lint`, which will automatically lint all `.js` files.

## Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com).

## Contributing

To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.

## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
