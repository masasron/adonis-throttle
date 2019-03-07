'use strict'

/**
 * adonis-throttle
 *
 * (c) Ron Masas <ronmasas@gmail.com>, Andrew Jo <andrewjo@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const { ServiceProvider } = require('@adonisjs/fold')

const Throttle = require('../src/Throttle')
const ThrottleRequests = require('../middleware/ThrottleRequests')

class ThrottleProvider extends ServiceProvider {
  register() {
    this.app.manager('Adonis/Addons/Throttle', require('../src/Manager'))

    this.app.bind('Adonis/Addons/ThrottleManager', () => {
      return require('../src/Manager')
    })

    this.app.singleton('Adonis/Addons/Throttle', app => {
      const Config = app.use('Adonis/Src/Config')
      const ThrottleManager = app.use('Adonis/Addons/ThrottleManager')
      const driver = Config.get('throttle.driver', 'memory')
      const driverInstance = ThrottleManager.makeDriverInstance(driver)
      return new Throttle(driverInstance)
    })

    this.app.bind('Adonis/Addons/Throttle/Cache', () => {
      return require('../src/Drivers/Cache')
    })

    this.app.bind('Adonis/Middleware/Throttle', app => {
      const Throttle = app.use('Adonis/Addons/Throttle')
      return new ThrottleRequests(Throttle)
    })
  }
}

module.exports = ThrottleProvider
