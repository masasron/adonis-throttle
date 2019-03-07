'use strict'

/**
 * adonis-throttle
 *
 * (c) Andrew Jo <andrewjo@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const { ioc } = require('@adonisjs/fold')
const { InvalidArgumentException } = require('@adonisjs/generic-exceptions')
const drivers = require('./Drivers')
const Cache = require('./Drivers/Cache')

/**
 * The throttle manager class is exposed as IoC container binding, which can
 * be used to add new driver and get an instance of a given driver.
 *
 * @namespace Adonis/Addons/Throttle
 * @manager Adonis/Addons/Throttle
 * @singleton
 * @class ThrottleManager
 */
class ThrottleManager {
  constructor() {
    this._drivers = {}
  }

  /**
   * Method called by IoC when someone extends the throttle provider to add
   * their own driver.
   *
   * @method extend
   *
   * @param {String} key
   * @param {Class} implementation
   *
   * @return {void}
   */
  extend(key, implementation) {
    if (!(implementation.prototype instanceof Cache)) {
      const name = implementation.name
      const message = `${name} class must extend BaseCache abstract base class`
      throw new TypeError(message, 500, 'E_INVALID_THROTTLE_DRIVER_IMPLEMENTATION')
    }

    this._drivers[key] = implementation
  }

  /**
   * Makes an instance of driver from given name.
   *
   * @method makeDriverInstance
   *
   * @param {String} name
   *
   * @return {Object}
   */
  makeDriverInstance(name) {
    const driver = drivers[name] || this._drivers[name]
    if (!driver) {
      const message = `${name} is not a valid throttle driver`
      throw new InvalidArgumentException(message, 500, 'E_INVALID_THROTTLE_DRIVER')
    }
    return ioc.make(driver)
  }
}

module.exports = new ThrottleManager()
