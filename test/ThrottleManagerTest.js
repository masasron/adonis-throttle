'use strict'

const assert = require('assert')
const { ioc } = require('@adonisjs/fold')
const GE = require('@adonisjs/generic-exceptions')
const { Config } = require('@adonisjs/sink')

const manager = require('../src/Manager')
const drivers = require('../src/Drivers')
const Cache = require('../src/Drivers/Cache')

describe('ThrottleManager', () => {
  before(() => {
    ioc.singleton('Adonis/Src/Config', () => new Config())
    ioc.singleton('Adonis/Addons/Redis', () => class Redis {
      static namedConnection() { }
    })
  })

  describe('#extend', () => {
    it('should add a new driver when provided driver implementation extends Cache abstract class', () => {
      class Memcached extends Cache {
        get() { }
        put() { }
        increment() { }
        incrementExpiration() { }
        secondsToExpiration() { }
      }

      manager.extend('memcached', Memcached)
      assert(manager.makeDriverInstance('memcached') instanceof Memcached)
    })

    it('should throw TypeError when provided driver implementation doesn’t extend Cache abstract class', () => {
      class Memcached { }
      assert.throws(() => manager.extend('memcached', Memcached), TypeError)
    })
  })

  describe('#makeDriverInstance', () => {
    it('should return Memory driver instance when argument is \'memory\'', () => {
      assert(manager.makeDriverInstance('memory') instanceof drivers.memory)
    })

    it('should return Redis driver instance when argument is \'redis\'', () => {
      assert(manager.makeDriverInstance('redis') instanceof drivers.redis)
    })

    it('should throw invalid throttle driver exception when drive can’t be found', () => {
      assert.throws(() => manager.makeDriverInstance('foo'), GE.InvalidArgumentException)
    })
  })
});
