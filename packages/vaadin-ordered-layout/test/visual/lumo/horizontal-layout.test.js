import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-horizontal-layout.js';

describe('horizontal-layout', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'flex';
    element = fixtureSync(
      `
        <vaadin-horizontal-layout>
          <div style="background: #e2e2e2; padding: 20px;">Item 1</div>
          <div style="background: #f3f3f3; padding: 20px;">Item 2</div>
        </vaadin-horizontal-layout>
      `,
      div
    );
  });

  it('basic', async () => {
    await visualDiff(div, 'horizontal-layout:basic');
  });

  it('theme-margin', async () => {
    element.setAttribute('theme', 'margin');
    await visualDiff(div, 'horizontal-layout:theme-margin');
  });

  it('theme-padding', async () => {
    element.setAttribute('theme', 'padding');
    await visualDiff(div, 'horizontal-layout:theme-padding');
  });

  it('theme-spacing', async () => {
    element.setAttribute('theme', 'spacing');
    await visualDiff(div, 'horizontal-layout:theme-spacing');
  });

  it('theme-margin-padding', async () => {
    element.setAttribute('theme', 'margin padding');
    await visualDiff(div, 'horizontal-layout:theme-margin-padding');
  });

  it('theme-margin-spacing', async () => {
    element.setAttribute('theme', 'margin spacing');
    await visualDiff(div, 'horizontal-layout:theme-margin-spacing');
  });

  it('theme-margin-padding-spacing', async () => {
    element.setAttribute('theme', 'margin padding spacing');
    await visualDiff(div, 'horizontal-layout:theme-margin-padding-spacing');
  });

  it('theme-spacing-xs', async () => {
    element.setAttribute('theme', 'spacing-xs');
    await visualDiff(div, 'horizontal-layout:theme-spacing-xs');
  });

  it('theme-spacing-s', async () => {
    element.setAttribute('theme', 'spacing-s');
    await visualDiff(div, 'horizontal-layout:theme-spacing-s');
  });

  it('theme-spacing-l', async () => {
    element.setAttribute('theme', 'spacing-l');
    await visualDiff(div, 'horizontal-layout:theme-spacing-l');
  });

  it('theme-spacing-xl', async () => {
    element.setAttribute('theme', 'spacing-xl');
    await visualDiff(div, 'horizontal-layout:theme-spacing-xl');
  });
});