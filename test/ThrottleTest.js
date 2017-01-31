'use strict'

var assert = require('assert');

describe('Throttle', () => {
    const Cache = require('../src/Drivers/Cache/Memory')
    const Throttle = require('../src/Throttle')
    const throttle = new Throttle(new Cache)
    throttle.resource('testing',1,3) // 1 request per second
    it('should return true on the first time', () => {
        assert.equal(throttle.attempt(),true)
    })
    it('should return false on the second time', () => {
        assert.equal(throttle.attempt(),false)
    })
    it('should return true after 3 second', done => {
        setTimeout( () => {
            if (throttle.attempt())
                done()
            else
                done('ERROR - cache was not cleared after 3 seconds.')
        },3001)
    })
    it('Time to wait should be more than 10 seconds', () => {
        throttle.attempt()
        throttle.attempt()
        if (!throttle.attempt()){
            throttle.incrementExpiration(10)
            let moreThan10Seconds = throttle.store.secondsToExpiration(throttle.key) > 10
            assert.equal(true,moreThan10Seconds)
        }
    })
})
