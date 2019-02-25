## Registering provider

Make sure to register the provider before you can make use of throttle
middleware. The providers are registered inside `start/app.js` file.

```js
const providers = [
  'adonis-throttle/providers/ThrottleProvider'
]
```

You can register the Throttle facade in the aliases key of `start/app.js` file
if you like.

```js
const aliases = {
  Throttle: 'Adonis/Addons/Throttle'
}
```

## Registering middleware

The next thing you should do is register the global middleware inside
`start/kernel.js` file.

```js
const nameMiddleware = {
  throttle: 'Adonis/Middleware/Throttle'
}
```

## Using throttle

Use the middleware to limit request for a given route.

```js
Route.post('login', 'Auth/LoginController.postLogin').middleware('throttle')
```

To limit number of requests per minute, specify the maximum limit like below.

```js
// Limit to 10 requests per minute
Route.post('login', 'Auth/LoginController.postLogin').middleware('throttle:10')
```

To limit number of requests per specified timeframe, specify number of seconds
after the request limit.

```js
// Limit to 10 requests per 120 seconds
Route.post('login', 'Auth/LoginController.postLogin').middleware('throttle:10,120')
```

If the number of requests exceeds the maximum limit, it will return 429
TOO MANY REQUESTS error.

### Advanced usage

You can also use Throttle class directly from inside your controllers.

```js
const Throttle = use('Throttle')

class TestController {
  run({request, response}) {
    const currentUser = request.auth.getCurrentUser()

    // Throttle requests to 10 per minute by each user
    Throttle.resource(currentUser.id, 10, 60)

    if(!Throttle.attempt()) {
      return response.send('too many requests')
    }

    response.send('secret')
  }
}
```

## Config

You can find the configuration inside `config/throttle.js` file. Feel free to
tweak it as per your needs.

## Environment Variables

The config file `config/throttle.js` reference an environment variable called
`THROTTLE_DRIVER` defined in `.env` file.

Make sure to set the value for production and development.

```text
THROTTLE_DRIVER=memory
```
