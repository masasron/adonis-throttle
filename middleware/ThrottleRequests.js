'use strict'

/**
 * adonis-throttle
 *
 * (c) Ron Masas <ronmasas@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const Crypto = require('crypto')
const TooManyRequestsException = require('../src/Exceptions/TooManyRequests')

class ThrottleRequests {

    constructor(throttle) {
        this.throttle = throttle
    }

    /**
     *
     * Handle an incoming request.
     *
     * @param   {Request}     request
     * @param   {Response}    response
     * @param   {Function}    next
     * @param   {Number}      maxAttempts     [optional, default = 60]
     * @param   {Number}      decayInSeconds    [optional, default = 1]
     * @param   {String}      uid
     * @return  {Response|Function}
     *
     * @public
     */
    async handle({request, response}, next, [ maxAttempts = 60, decayInSeconds = 60 ], uid = false) {
        const signature = this._resolveSignature(request, uid)
        this.throttle.resource(signature, parseInt(maxAttempts), parseInt(decayInSeconds))

        if (!this.throttle.attempt()) {
            this.throttle.incrementExpiration()
            this._addHeaders(
                response,
                maxAttempts,
                this.throttle.remainingAttempts(),
                this.throttle.store.secondsToExpiration(this.throttle.key)
            )
            throw new TooManyRequestsException('Too Many Attempts.')
        }

        this._addHeaders(
            response,
            maxAttempts,
            this.throttle.remainingAttempts()
        )

        await next()
    }

    /**
     * Resolve signature.
     *
     * @param   {Request}     request
     * @param   {String}      uid
     * @return  {String}
     *
     * @private
     */
    _resolveSignature(request, uid) {
        let generator = Crypto.createHash('sha1')
        if (uid === false) {
            generator.update(`${request.method()}|${request.url()}|${request.ip()}`)
        } else {
            generator.update(uid)
        }
        return generator.digest('hex')
    }

    /**
     * Add the limit header information to the given response.
     *
     * @param   {Response}    response
     * @param   {Number}      maxAttempts
     * @param   {Number}      remainingAttempts
     * @param   {Number}      retryAfter          [optional, default = null]
     * @return  {void}
     *
     * @private
     */
    _addHeaders(response, maxAttempts, remainingAttempts, retryAfter = null) {
        response.header('X-RateLimit-Limit', maxAttempts)
        response.header('X-RateLimit-Remaining', remainingAttempts)
        if (retryAfter !== null) {
            response.header('Retry-After', retryAfter)
            response.header('X-RateLimit-Reset', new Date().getTime() + (retryAfter * 1000))
        }
    }

}

module.exports = ThrottleRequests
