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

class RateLimitExceededException extends NE.LogicalException {

    constructor(rateLimitMessage) {
        console.log('rateLimitMessage -> ', rateLimitMessage)
        super(rateLimitMessage, 429)
    }
}

module.exports = RateLimitExceededException
