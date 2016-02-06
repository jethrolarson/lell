
var Rx = require('rx')
var _ = require('lodash')

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
		_.each(state, (s, k) => {
			if (k == '_actions')
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
	_addUpdate(k) {
		this._updatedStateIfNecessary()
		if (this._updates.indexOf(k) == -1)
			this._updates.push(k)
	}
	_updatedStateIfNecessary() {
		if (this._state != 'new')
			this._state = 'updated'
	}
	_map() {
		return {}
	}
	_defaults() {
		return {}
	}
	silentUpdate(key, value) {
		this['_z' + key] = value
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
