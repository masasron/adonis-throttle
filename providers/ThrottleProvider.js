'use strict'

/**
 * adonis-throttle
 *
 * (c) Ron Masas <ronmasas@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const ServiceProvider = require('adonis-fold').ServiceProvider

const Throttle = require('../src/Throttle')
const CacheDriver = require('../src/Cache')

class ThrottleProvider extends ServiceProvider {

    * register() {
        this.app.bind('Adonis/Addons/Throttle', function(app) {
            return new Throttle(new CacheDriver)
        })
    }

}

module.exports = ThrottleProvider
