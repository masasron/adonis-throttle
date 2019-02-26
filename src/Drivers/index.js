'use strict'

/**
 * adonis-throttle
 *
 * (c) Andrew Jo <andrewjo@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

module.exports = {
  memory: require('./Cache/Memory'),
  redis: require('./Cache/Redis')
}
