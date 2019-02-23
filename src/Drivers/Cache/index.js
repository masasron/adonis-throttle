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

    const abstractMethods = ['get', 'put', 'increment', 'incrementExpiration']
    const implements = abstractMethods.map(name => {
      const implemented = typeof this[name] === 'function'
      return { name, implemented }
    })
    const abstractMethod = method => method.implemented

    if (!implements.every(abstractMethod)) {
      const unimplemented = implements.filter(method => !method.implemented)
        .map(method => method.name)
        .join(', ')
      const message = 'Implementing class does not override abstract methods: '
      throw new TypeError(message + unimplemented)
    }
  }
}

module.exports = Cache
