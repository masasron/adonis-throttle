'use strict'

/**
 * adonis-throttle
 *
 * (c) Ron Masas <ronmasas@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const RateLimitExceededException = require('./RateLimitExceededException')

class Throttle {

    /**
     * Create a new instance
     * 
     * @param {cacheDriver} cacheDriver
     * @return {Boolean}
     */
    constructor(cacheDriver) {
        this.store = cacheDriver
    }

    /**
     * Init a resource.
     *
     * @param {String} key
     * @param {Integer} limit
     * @param {Integer} time - amount of time in seconds
     *
     * @return {Boolean}
     */
    resource(key, limit, time) {
        this.key = key
        this.limit = limit
        this.time = time
    }

    /**
     * Rate limit access to a resource.
     *
     * @return {Boolean}
     */
    attempt() {
        const response = this.check()
        this.hit()
        return response
    }

    /**
     * Throw rate limit exceeded exception
     *
     * @return void
     */
    throwException() {
        throw new RateLimitExceededException(`Please wait ${this.store.secondsToExpiration(this.key)} seconds`)
    }

    /**
     * Increment expiration of the current resource.
     * 
     * @param {Integer} seconds - default is 5
     *
     * @return {Throttle}
     */
    incrementExpiration(seconds) {
        this.store.incrementExpiration(this.key, seconds)
        return this
    }

    /**
     * Hit the throttle.
     *
     * @return {Throttle}
     */
    hit() {
        if (this.count()) {
            return this.store.increment(this.key)
        }
        return this.store.put(this.key, 1, this.time)
    }

    /**
     * Get the throttle hit count.
     *
     * @return {Integer}
     */
    count() {
        let count = this.store.get(this.key)
        if (typeof count === 'undefined') {
            return 0
        }
        return count
    }

    /**
     * Check the throttle.
     *
     * @return {Boolean}
     */
    check() {
        return this.count() < this.limit;
    }

}

module.exports = Throttle
