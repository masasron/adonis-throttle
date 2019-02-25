'use strict'

/**
 * adonis-throttle
 *
 * (c) Ron Masas <ronmasas@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const { ServiceProvider } = require('@adonisjs/fold')

const Throttle = require('../src/Throttle')
const Cache = require('../src/Drivers/Cache/Memory')
const ThrottleRequests = require('../middleware/ThrottleRequests')

class ThrottleProvider extends ServiceProvider {
  register() {
    this.app.manager('Adonis/Addons/Throttle', require('../src/Manager'))

    this.app.bind('Adonis/Addons/ThrottleManager', () => {
      const ThrottleManager = require('../src/Manager')
      return new ThrottleManager()
    })

    this.app.singleton('Adonis/Addons/Throttle',  () => {
      return new Throttle(new Cache())
    })

    this.app.bind('Adonis/Middleware/Throttle', app => {
      const Config = app.use('Adonis/Src/Config')
      const ThrottleManager = app.use('Adonis/Addons/ThrottleManager')
      return new ThrottleRequests(Config, ThrottleManager)
    })
  }
}

module.exports = ThrottleProvider
