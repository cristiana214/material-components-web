/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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

import MDCTopAppBarAdapter from './adapter';
import MDCTopAppBarFoundation from './foundation';
import MDCComponent from '@material/base/component';
import {MDCRipple} from '@material/ripple/index';
import {strings} from './constants';

/**
 * @extends {MDCComponent<!MDCTopAppBarFoundation>}
 * @final
 */
class MDCTopAppBar extends MDCComponent {
  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);
    /** @private {?Element} */
    this.navIcon_;
    /** @type {?Array<MDCRipple>} */
    this.iconRipples_;
  }

  initialize(
    rippleFactory = (el) => MDCRipple.attachTo(el)) {
    this.navIcon_ = this.root_.querySelector(strings.MENU_ICON_SELECTOR);

    // Get all icons in the toolbar and instantiate the ripples
    const icons = [].slice.call(this.root_.querySelectorAll(strings.ACTION_ICON_SELECTOR));
    icons.push(this.navIcon_);

    this.iconRipples_ = icons.map((icon) => {
      const ripple = rippleFactory(icon);
      ripple.unbounded = true;
      return ripple;
    });
  }

  destroy() {
    this.iconRipples_.forEach((iconRipple) => iconRipple.destroy());
  }

  /**
   * @param {!Element} root
   * @return {!MDCTopAppBar}
   */
  static attachTo(root) {
    return new MDCTopAppBar(root);
  }

  /**
   * @return {!MDCTopAppBarFoundation}
   */
  getDefaultFoundation() {
    return new MDCTopAppBarFoundation(
      /** @type {!MDCTopAppBarAdapter} */ (Object.assign({
        hasClass: (className) => this.root_.classList.contains(className),
        addClass: (className) => this.root_.classList.add(className),
        removeClass: (className) => this.root_.classList.remove(className),
        registerNavigationIconInteractionHandler: (evtType, handler) => {
          if (this.navIcon_) {
            this.navIcon_.addEventListener(evtType, handler);
          }
        },
        deregisterNavigationIconInteractionHandler: (evtType, handler) => {
          if (this.navIcon_) {
            this.navIcon_.removeEventListener(evtType, handler);
          }
        },
        notifyNavigationIconClicked: () => {
          this.emit(strings.NAVIGATION_EVENT, {});
        },
      })
      )
    );
  }
}

export {MDCTopAppBar, MDCTopAppBarFoundation};
