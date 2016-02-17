
var Rx = require('rx')
var _ = require('lodash')
import Backend from './backend'


var getvalue = function(map = {}, v, k) {
	if (!map[k])
		return v
	var t = map[k]
	if (_.isArray(t)) {
		t = t[0]
		if (v.length) {
			if (v[0] instanceof t) {
				return v
			} else {
				var ret = []
				for (var e of v) {
					ret.push(new t(e))
				}
				return ret
			}
		} else {
			return v
		}
	}
	if (v instanceof t) {
		return v
	} else {
		return new t(v)
	}
}

class Le {
	constructor(state) {
		var self = this
		var map = this._map()
		this._state = state ? 'original' : 'new'
		this._updates = []
		state = _.defaults((state || {}), this._defaults())
		Object.defineProperty(this, '_original_state', {
			writable:true,
			value:state
		})
		_.each(state, (s, k) => {
			if (k == '_actions' || k == '_updates' || k == '_state')
				return
			Object.defineProperties(this, {
				['_z' + k]:{
					enumerable:false,
					writable:true,
					value:getvalue(map, s, k)
				},
				[k]:{
					enumerable:true,
					get: () => {
						return self['_z' + k]
					},
					set: (v) => {
						self['_z' + k] = v
						self['subject'].onNext(self)
						self._addUpdate(k)
						self.superSubject.onNext({obj:self,key:k})
					}
				}
			})
			if (_.isArray(s)) {
				this._original_state[k] = [].concat(this[k])
			}
		})
		this.subject = new Rx.Subject()
		this.superSubject = new Rx.Subject()
		if (this._actions) {
			_.each(this._actions, (a, k) => {
				if (!_.isFunction(a))
					return
				this[k] = function() {
					if (a.apply(self, arguments))
						self.subject.onNext(state)
				}
			})
		}
	}
	static new(state) {
		if (Backend.enabled && this.name != 'Le' && state && state[this._identifier()]) {
			var ret = Backend.get(this.name, state[this._identifier()])
			if (ret)
				return ret._fullUpdate(state)
			return Backend.set(new this(state), state[this._identifier()])
		}
		return new this(state)
	}
	_addUpdate(k) {
		if (this[k] != this._original_state[k] || _.isArray(this[k])) {
			if (!_.isArray(this[k])) {
				if (this._updates.indexOf(k) == -1)
					this._updates.push(k)
			} else {
				var a = this[k], ao = this._original_state[k]
				var same = false
				for (var e of a) {
					if (ao.indexOf(e) == -1) {
						same = false
						break
					} else {
						if (ao.indexOf(e) != a.indexOf(e)) {
							same = false
							break
						}
					}
					same = true
				}
				if (a.length < ao.length) {
					same = false
				}
				if (!same) {
					if (this._updates.indexOf(k) == -1)
						this._updates.push(k)
				} else {
					if (this._updates.indexOf(k) > -1) {
						this._updates = this._updates.filter((i) => i != k)
					}
				}
			}
		} else {
			if (this._updates.indexOf(k) > -1) {
				this._updates = this._updates.filter((i) => i != k)
			}
		}
		this._updatedStateIfNecessary()
	}
	_updatedStateIfNecessary() {
		if (this._state != 'new')
			this._state = this._updates.length ? 'updated' : 'original'
	}
	_map() {
		return {}
	}
	_defaults() {
		return {}
	}
	static _identifier() {
		return '_id'
	}
	_commit(){
		this._state = 'original'
		this._updates = []
		var j = this.toJSON()
		var m = this._map()
		for (var k of Object.keys(j)) {
			j[k] = getvalue(m, j[k], k)
			if (_.isArray(j[k])) {
				j[k] = [...j[k]]
			}
		}
		this._original_state = j
	}
	_fullUpdate(payload) {
		for (var k of Object.keys(payload)) {
			this.silentUpdate(k, payload[k])
		}
		return this
	}
	silentUpdate(key, value) {
		this['_z' + key] = value
		this._addUpdate(key)
	}
	subscribe(onNext, onCompleted, onError) {
		return this.subject.subscribe(onNext, onCompleted, onError)
	}
	fill(state) {
		Object.assign(this, state)
	}
	toJSON() {
		return _.omit(this,['toJSON','fill','superSubscribe','subscribe','subject','superSubject','Actions'])
	}
}

module.exports = Le
