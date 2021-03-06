# &lt;vaadin-custom-field&gt;

[&lt;vaadin-custom-field&gt;](https://vaadin.com/components/vaadin-custom-field) is a Web Component providing field wrapper functionality, part of the [Vaadin components](https://vaadin.com/components).

[Live Demo ↗](https://vaadin.com/components/vaadin-custom-field/html-examples)
|
[API documentation ↗](https://vaadin.com/components/vaadin-custom-field/html-api)

[![npm version](https://badgen.net/npm/v/@vaadin/vaadin-custom-field)](https://www.npmjs.com/package/@vaadin/vaadin-custom-field)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vaadin/vaadin-custom-field)
[![Build Status](https://travis-ci.org/vaadin/vaadin-custom-field.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-custom-field)
[![Coverage Status](https://coveralls.io/repos/github/vaadin/vaadin-custom-field/badge.svg?branch=master)](https://coveralls.io/github/vaadin/vaadin-custom-field?branch=master)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/vaadinvaadin-custom-field)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/vaadin-custom-field-directory-urlidentifier.svg)](https://vaadin.com/directory/component/vaadinvaadin-custom-field)

```html
<vaadin-custom-field label="Appointment time">
  <vaadin-date-picker></vaadin-date-picker>
  <vaadin-time-picker></vaadin-time-picker>
</vaadin-custom-field>
```

[<img src="https://raw.githubusercontent.com/vaadin/vaadin-custom-field/master/screenshot.png" width="200" alt="Screenshot of vaadin-custom-field">](https://vaadin.com/components/vaadin-custom-field)


## Installation

Install `vaadin-custom-field`:

```sh
npm i @vaadin/vaadin-custom-field --save
```

Once installed, import it in your application:

```js
import '@vaadin/vaadin-custom-field/vaadin-custom-field.js';
```

## Getting started

Vaadin components use the Lumo theme by default.

To use the Material theme, import the correspondent file from the `theme/material` folder.

## Entry points

- The component with the Lumo theme:

  `theme/lumo/vaadin-custom-field.js`

- The component with the Material theme:

  `theme/material/vaadin-custom-field.js`

- Alias for `theme/lumo/vaadin-custom-field.js`:

  `vaadin-custom-field.js`


## Running API docs and tests in a browser

1. Fork the `vaadin-custom-field` repository and clone it locally.

1. Make sure you have [node.js](https://nodejs.org/) 12.x installed.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vaadin-custom-field` directory, run `npm install` to install dependencies.

1. Make sure you have [polymer-cli](https://www.npmjs.com/package/polymer-cli) installed globally: `npm i -g polymer-cli`.

1. Run `npm start`, browser will automatically open the component API documentation.

1. You can also open visual tests, for example:

  - http://127.0.0.1:3000/test/visual/default.html


## Running tests from the command line

1. When in the `vaadin-custom-field` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `npm run lint`, which will automatically lint all `.js` files.


## Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com).


## Contributing

  To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.


## License

Apache License 2.0

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
