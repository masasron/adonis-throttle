'use strict'

/**
 * adonis-throttle
 *
 * (c) Ron Masas <ronmasas@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

class Cache {

	constructor(){
		this.data = {}
		this.timers = {}
		this.expirations = {}
	}

	put(key,value,time){
		if (this.timers[key]){
			clearInterval(this.timers[key])
		}
		let now = new Date().getTime()
		this.data[key] = value
		this.expirations[key] = now+time
		this.timers[key] = this.deleteAfter(key,time)
	}

	deleteAfter(key,seconds){
		return setTimeout(function(){
			console.log('clear cache for key',key)
			delete this.data[key]
			delete this.timers[key]
			delete this.expirations[key]
		}.bind(this),seconds*1000)
	}

	get(key){
		return this.data[key]
	}

	secondsToExpiration(key){
		try{
			return ( this.expirations[key]-new Date().getTime() ) / 1000
		}catch(ex){
			// ...
		}
		return 0
	}

	incrementExpiration(key,seconds){
		seconds = seconds || 5
		clearTimeout(this.timers[key])
		let penalty = (this.secondsToExpiration(key)+seconds)
		this.expirations[key] = new Date().getTime() + (penalty*1000)
		this.timers[key] = this.deleteAfter(key,penalty)
	}

	increment(key){
		if (this.data[key]){
			this.data[key] = parseInt(this.data[key]) + 1
		}
		return this.data[key]
	}

}

module.exports = Cache