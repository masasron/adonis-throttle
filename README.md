# Adonis Throttle
A rate limiter for Adonis JS.

### Installation

To get the latest version of Adonis Throttle, simply run

```
npm install adonis-throttle
```

Once Adonis Throttle is installed, you need to register the service provider. Open up bootstrap/app.js and add the following to the providers key.

* ```__dirname + '/../providers/adonis-throttle/providers/ThrottleProvider'```

You can register the Throttle facade in the aliases key of your bootstrap/app.js file if you like.

* ```  Throttle: 'Adonis/Addons/Throttle' ```

### Basic Middleware Example

1. Create ThrottleMiddleware.js in the app/Http/Middlewares folder.

```js
'use strict'

const Throttle = use('Throttle');

class ThrottleMiddleware {

  * handle (request, response, next, limit, time, key) {
     Throttle.resource(key+'-'+request.ip(),parseInt(limit),parseInt(time))
     if (!Throttle.attempt()){
     	Throttle.incrementExpiration().throwException()
     }
	 yield next
  }

}

module.exports = ThrottleMiddleware
```

2. Register on app/Http/kernel.js under `namedMiddleware` add ``` throttle: 'App/Http/Middleware/ThrottleMiddleware' ```


3. Use it

```js
Route.get('test',function* (request,response){
	response.send('HELLO THERE :D')
}).middleware('throttle:10,60,action') // allow up to 10 requests in 60 seconds.
```
