/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

type AlertType = 'info' | 'warn' | 'error' | 'success';

export class DropDownHolder {
  static dropDown;

  static setDropDown(dropDown) {
    this.dropDown = dropDown;
  }

  /**
   *
   * @param {['info', 'warn', 'error', 'success']} type alert type
   * @param {string} title alert title
   * @param {string} message alert message
   */
  static alert(type: AlertType, title, message) {
    __DEV__ && console.tron.log('on alert ', type, title, message);
    this.dropDown.alertWithType(type, title, message);
  }
}
