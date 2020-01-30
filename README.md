# Adonis Throttle

A rate limiter for Adonis 4.1

[![npm version](https://badge.fury.io/js/adonis-throttle.svg)](https://badge.fury.io/js/adonis-throttle)
[![npm](https://img.shields.io/npm/dt/adonis-throttle.svg)](https://www.npmjs.com/package/adonis-throttle)
[![CircleCI](https://img.shields.io/circleci/project/github/masasron/adonis-throttle.svg)](https://circleci.com/gh/masasron/adonis-throttle)
[![Known Vulnerabilities](https://snyk.io/test/github/masasron/adonis-throttle/badge.svg?targetFile=package.json)](https://snyk.io/test/github/masasron/adonis-throttle?targetFile=package.json)

## Installation

> For AdonisJS below version 4.1, you need install 2.0.x

To get the latest version of Adonis Throttle, simply run:

```console
adonis install adonis-throttle
```

Once Adonis Throttle is installed, you need to register the service provider.
Open up bootstrap/app.js and add the following to the providers key.

```js
// start/app.js
const providers = [
  ...,
  'adonis-throttle/providers/ThrottleProvider',
]
```

You can register the Throttle facade in the aliases key of your bootstrap/app.js file if you like.

```js
// start/app.js
const aliases = {
  ...,
  Throttle: 'Adonis/Addons/Throttle'
}
```

Enable the throttle middleware inside `start/kernel.js` file.

```js
// start/kernel.js

const namedMiddleware = {
  ...,
  throttle: 'Adonis/Middleware/Throttle'
}
```

## Usage

### Middleware

Use the throttle middleware to limit request for a given route.

```js
// Default Throttle 60 request per minute
Route.post('login','Auth/LoginController.postLogin').middleware('throttle')
```

The following example throttle request be limiting the number of login attempts for 10 requests every 120 seconds.

```js
Route.post('login','Auth/LoginController.postLogin').middleware('throttle:10,120')
```

Throttle 10 request per minute

```js
Route.post('login','Auth/LoginController.postLogin').middleware('throttle:10')
```

If the subject exceeds the maximum number of requests, it will return Too Many Attempts. with status code of 429.
By default we are extending the decay of the throttle by 5 seconds, for each request the subject after he exceeds the maximum number of requests.

### Advanced usage

You can also use Throttle from inside your controllers or anywere else.

```js

const Throttle = use('Throttle')

class TestController {

  run(request,response){
    const currentUser = request.auth.getCurrentUser()
    // Limit for a specific user
    Throttle.resource(currentUser.id,10,60)
    if (!Throttle.attempt()){
      return response.send('stop!')
    }
    response.send('secret')
  }

}
```

## Extending cache driver

You can write your own cache driver by extending `Adonis/Addons/Throttle/Cache`
abstract base class.

For the purpose of this example, assume the contents of the file below are
located at: `./lib/drivers/memcached`.

```js
'use strict'

const Cache = use('Adonis/Addons/Throttle/Cache')

class Memcached extends Cache {
    /**
   * Get stored data by key.
   * @param {String} key
   *
   * @return {Mixed}
   */
  get(key) {
    // implement get
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
    // implement put
  }

  /**
   * Increment stored value by one.
   * @param {String} key
   *
   * @return {Cache}
   */
  increment(key) {
    // implement increment
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
    // implement incrementExpiration
    return this
  }

  /**
   * Get number of seconds left until cache data is cleared.
   * @param {String} key
   *
   * @return {Integer}
   */
  secondsToExpiration(key) {
    // implement secondsToExpiration
  }
}
```

Then in `start/hooks.js`, register your driver:

```js
'use strict'

const { ioc } = require('@adonisjs/fold')
const { hooks } = require('@adonisjs/ignitor')
const Memcached = require('./lib/drivers/memcached')

hooks.after.providersRegistered(() => {
  const ThrottleManager = use('Adonis/Addons/ThrottleManager')
  ThrottleManager.extend('memcached', Memcached)
})
```
