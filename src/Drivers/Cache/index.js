'use strict'

/**
 * Abstract base class that ensures required public methods are implemented by
 * inheriting classes.
 *
 * @example
 *
 * class BloomFilterCache extends Cache {
 *   constructor() {
 *     super()
 *   }
 *
 *   get(key) {}
 *   put(key, value, milliseconds) {}
 *   increment(key) {}
 *   incrementExpiration(key, seconds) {}
 * }
 *
 */
class Cache {
  /**
   * Do not call this constructor directly.
   */
  constructor() {
    if (new.target === Cache) {
      throw new TypeError('Cannot instantiate abstract base class: Cache')
    }

    const abstractMethods = [
      'get',
      'put',
      'increment',
      'incrementExpiration',
      'secondsToExpiration'
    ].map(name => {
      const implemented = typeof this[name] === 'function'
      return { name, implemented }
    })

    if (!abstractMethods.every(method => method.implemented)) {
      const message = 'Implementing class does not override abstract methods: '
      const unimplemented = abstractMethods
        .filter(method => !method.implemented)
        .map(method => method.name)
        .join(', ')

      throw new TypeError(message + unimplemented)
    }
  }
}

module.exports = Cache
