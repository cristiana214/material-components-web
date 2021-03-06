/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import bel from 'bel';
import domEvents from 'dom-events';
import {assert} from 'chai';
import td from 'testdouble';

import {MDCChipSet} from '../../../packages/mdc-chips/chip-set';

const getFixture = () => bel`
  <div class="mdc-chip-set">
    <div class="mdc-chip">
      <div class="mdc-chip__text">Chip content</div>
    </div>
    <div class="mdc-chip">
      <div class="mdc-chip__text">Chip content</div>
    </div>
    <div class="mdc-chip">
      <div class="mdc-chip__text">Chip content</div>
    </div>
  </div>
`;

suite('MDCChipSet');

test('attachTo returns an MDCChipSet instance', () => {
  assert.isOk(MDCChipSet.attachTo(getFixture()) instanceof MDCChipSet);
});

class FakeChip {
  constructor() {
    this.destroy = td.func('.destroy');
  }
}

test('#constructor instantiates child chip components', () => {
  const root = getFixture();
  const component = new MDCChipSet(root, undefined, (el) => new FakeChip(el));
  assert.isOk(component.chips.length === 3 &&
    component.chips[0] instanceof FakeChip &&
    component.chips[1] instanceof FakeChip &&
    component.chips[2] instanceof FakeChip);
});

test('#destroy cleans up child chip components', () => {
  const root = getFixture();
  const component = new MDCChipSet(root, undefined, (el) => new FakeChip(el));
  component.destroy();
  td.verify(component.chips[0].destroy());
  td.verify(component.chips[1].destroy());
  td.verify(component.chips[2].destroy());
});

function setupTest() {
  const root = getFixture();
  const component = new MDCChipSet(root);
  return {root, component};
}

test('#adapter.hasClass returns true if class is set on chip set element', () => {
  const {root, component} = setupTest();
  root.classList.add('foo');
  assert.isTrue(component.getDefaultFoundation().adapter_.hasClass('foo'));
});

test('#adapter.registerInteractionHandler adds a handler to the root element for a given event', () => {
  const {root, component} = setupTest();
  const handler = td.func('eventHandler');

  component.getDefaultFoundation().adapter_.registerInteractionHandler('click', handler);
  domEvents.emit(root, 'click');
  td.verify(handler(td.matchers.anything()));
});

test('#adapter.deregisterInteractionHandler removes a handler from the root element for a given event', () => {
  const {root, component} = setupTest();
  const handler = td.func('eventHandler');

  root.addEventListener('click', handler);
  component.getDefaultFoundation().adapter_.deregisterInteractionHandler('click', handler);
  domEvents.emit(root, 'click');
  td.verify(handler(td.matchers.anything()), {times: 0});
});
