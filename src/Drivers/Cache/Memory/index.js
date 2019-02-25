'use strict'

/**
 * adonis-throttle
 *
 * (c) Ron Masas <ronmasas@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const Cache = require('..')

class Memory extends Cache {

    /**
     * Create a new instance
     *
     */
    constructor() {
        super()
        this.data = {}
        this.timers = {}
        this.expirations = {}
    }

    /**
     *
     * Generate cache.
     *
     * @param {String} key
     * @param {Mixed} value
     * @param {Integer} miliseconds
     *
     * @return {TimeoutPointer}
     */
    put(key, value, miliseconds) {
        if (this.timers[key]) {
            clearInterval(this.timers[key])
        }
        let now = new Date().getTime()
        this.data[key] = value
        this.expirations[key] = now + miliseconds
        this.timers[key] = this.deleteAfter(key, miliseconds)
    }

    /**
     *
     * Delete cache key after a number of miliseconds.
     *
     * @param {String} key
     * @param {Integer} miliseconds
     *
     * @return {TimeoutPointer}
     */
    deleteAfter(key, miliseconds) {
        return setTimeout(function() {
            delete this.data[key]
            delete this.timers[key]
            delete this.expirations[key]
        }.bind(this), miliseconds)
    }

    /**
     *
     * Get stored data by key
     *
     * @param {String} key
     *
     * @return {Mixed}
     */
    get(key) {
        return this.data[key]
    }

    /**
     *
     * Get the number of seconds left until cache data is cleared.
     *
     * @param {String} key
     *
     * @return {Integer}
     */
    secondsToExpiration(key) {
        try {
            return (this.expirations[key] - new Date().getTime()) / 1000
        } catch (ex) {
            // Added try due to possible division by zero.
            console.log('Exception->', ex)
        }
        return 0
    }

    /**
     *
     * Increment expiration of stored data by a number of seconds.
     *
     * @param {String} key
     * @param {Integer} seconds
     *
     * @return {Cache}
     */
    incrementExpiration(key, seconds) {
        seconds = seconds || 5
        clearTimeout(this.timers[key])
        let penalty = (this.secondsToExpiration(key) + seconds)
        let penaltyInMiliseconds = penalty * 1000
        this.expirations[key] = new Date().getTime() + penaltyInMiliseconds
        this.timers[key] = this.deleteAfter(key, penaltyInMiliseconds)
        return this
    }

    /**
     *
     * Increment stored value by one.
     *
     * @param {String} key
     *
     * @return {Cache}
     */
    increment(key) {
        if (!isNaN(this.data[key])) {
            this.data[key]++
        }
        return this
    }

}

module.exports = Memory
