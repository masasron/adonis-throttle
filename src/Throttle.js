'use strict'

/**
 * adonis-throttle
 *
 * (c) Ron Masas <ronmasas@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

class Throttle {

    /**
     * Create a new instance
     * 
     * @param {cacheDriver} cache
     * @return {Boolean}
     */
    constructor(cache) {
        this.store = cache
    }

    /**
     * Init a resource.
     *
     * @param {String} key
     * @param {Number} maxAttempts
     * @param {Number} decayInSeconds
     *
     * @return {Boolean}
     */
    resource(key, maxAttempts = 60, decayInSeconds = 60) {
        this.key = key
        this.maxAttempts = maxAttempts
        this.decayInSeconds = decayInSeconds
    }

    /**
     * Rate limit access to a resource.
     *
     * @return {Boolean}
     */
    attempt() {
        let response = this.check()
        this.hit()
        return response
    }

    /**
     * Increment expiration of the current resource.
     * 
     * @param {Number} seconds - default is 5
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
        return this.store.put(this.key, 1, this.decayInSeconds*1000)
    }

    /**
     * Get the throttle hit count.
     *
     * @return {Number}
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
        return this.count() < this.maxAttempts;
    }

    /**
     * Get the number of remaining attempts
     *
     * @return {Number}
     */
    remainingAttempts(){
        return this.maxAttempts-this.count()
    }

}

module.exports = Throttle