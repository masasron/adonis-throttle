'use strict'

const Cache = require('..')

class Redis extends Cache {
  /**
   * Namespaces to inject by IoC container.
   *
   * @attribute inject
   * @return {Array}
   */
  static get inject() {
    return ['Adonis/Src/Config', 'Adonis/Addons/Redis'];
  }

  constructor(Config, Redis) {
    super()

    const config = Config.merge('throttle.redis', {
      port: 6379,
      host: '127.0.0.1'
    })

    this.redis = Redis.namedConnection('__adonis__throttle', config)
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
    this.redis.set(key, value, 'px', milliseconds)
  }

  /**
   * Get stored data by key.
   * @param {String} key
   *
   * @return {Mixed}
   */
  get(key) {
    return this.redis.get(key)
  }

  /**
   * Increment stored value by one.
   * @param {String} key
   *
   * @return {Cache}
   */
  increment(key) {
    this.redis.incr(key)
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
    this.redis.expire(key, seconds)
    return this
  }
}

module.exports = Redis
