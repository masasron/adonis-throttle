'use strict'

const { ioc } = require('@adonisjs/fold')
const Cache = require('..')

class Redis extends Cache {
  constructor() {
    super()
    this.Redis = ioc.use('Redis')
  }

  /**
   * Generate cache.
   * @param {String} key
   * @param {Mixed} value
   * @param {Integer} milliseconds
   *
   * @return {TimeoutPointer}
   */
  put(key, value, milliseconds) {
    this.Redis.set(key, value, 'px', milliseconds)
  }

  /**
   * Get stored data by key.
   * @param {String} key
   *
   * @return {Mixed}
   */
  get(key) {
    return this.Redis.get(key)
  }

  /**
   * Increment stored value by one.
   * @param {String} key
   *
   * @return {Cache}
   */
  increment(key) {
    this.Redis.incr(key)
    return this
  }

  /**
   * Increment expiration of stored data by number of seconds.
   * @param {String} key
   * @param {Integer} seconds
   *
   * @return {Cache}
   */
  incrementExpiration(key, seconds) {
    this.Redis.expire(key, seconds)
    return this
  }
}

module.exports = Redis
