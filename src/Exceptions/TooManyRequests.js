'use strict'

/**
 * adonis-throttle
 *
 * (c) Ron Masas <ronmasas@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const NE = require('node-exceptions')

class TooManyRequests extends NE.LogicalException {

    constructor(message) {
        super(message, 429)
    }
}

module.exports = TooManyRequests