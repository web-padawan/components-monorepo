import '../../vaadin-text-field.js';
import '../../vaadin-text-area.js';
import '../../vaadin-password-field.js';

import { TextFieldInvalidChangedEvent, TextFieldValueChangedEvent } from '../../vaadin-text-field.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const field = document.createElement('vaadin-text-field');

field.addEventListener('invalid-changed', (event) => {
  assertType<TextFieldInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

field.addEventListener('value-changed', (event) => {
  assertType<TextFieldValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

const area = document.createElement('vaadin-text-area');

area.addEventListener('invalid-changed', (event) => {
  assertType<TextFieldInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

area.addEventListener('value-changed', (event) => {
  assertType<TextFieldValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});

const password = document.createElement('vaadin-password-field');

password.addEventListener('invalid-changed', (event) => {
  assertType<TextFieldInvalidChangedEvent>(event);
  assertType<boolean>(event.detail.value);
});

password.addEventListener('value-changed', (event) => {
  assertType<TextFieldValueChangedEvent>(event);
  assertType<string>(event.detail.value);
});
