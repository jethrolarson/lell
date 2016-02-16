var Ll = require('./ll')
var Backend = require('./backend')
var pluralize = require('pluralize')

var entityKey = (entity, isclass, doPluralize) => {
	var name = (isclass ? entity.name : entity.constructor.name).toLowerCase()
	return doPluralize ? pluralize(name) : name
}

class State {
	constructor(init = {}) {
		if (init.initialState) {
			Object.assign(this, init.initialState)
		} else if (State._isClient() && window.initialState) {
			this.__entityNames = []
			if (init.collections) {
				Backend.enabled = true
				this.__pluralize = init.pluralize
				this.__newEntityListeners = {}
				for (var e of this._entities()) {
					var entity = e.entity
					var eKey = entityKey(entity, true, init.pluralize)
					this.__entityNames.push(eKey)
					var es = this[eKey] = {}
					var def = {[eKey]:[]}
					if (e.defaultSort) {
						def.defaultSort = e.defaultSort
					}
					es.default = new Ll(def)
					this.__newEntityListeners[eKey] = [es.default]
					for (var s of (e.sorts || [])) {
						this.__newEntityListeners[eKey].push(es[s.name] = new Ll({[eKey]:[], sort_key:s.key}))
					}
				}
				Backend.onNewEntity = (e) => {
					var n = entityKey(e, false, this.__pluralize)
					if (this.__newEntityListeners[n]) {
						for (var ll of this.__newEntityListeners[n]) {
							ll.addItems(e)
						}
					}
				}
			}
			this._boot()
		}
	}
	_new(d) {
		return new State(d)
	}
	_boot() {
		if (window.initialState) {
			var i = window.initialState
			var map = this._map()
			for (var k of Object.keys(i)) {
				var e = this._entities().find((e) => entityKey(e.entity, false, this.__pluralize) == k)
				if (e) {
					var ej = i[k]
					var arr
					for (var s of (e.sorts || [])) {
						if (ej[s.name]) {
							arr = ej[s.name][s.name]
							if (arr) {
								arr = arr.map((x) => e.entity.new(x))
								this[k][s.name].addItems(arr)
							}
						}
					}
					if (ej.default) {
						arr = ej.default.default
						if (arr) {
							arr = arr.map((x) => e.entity.new(x))
							this[k].default.addItems(arr)
						}
					}
					continue
				}
				this[k] = map[k] ? map[k].new(i[k]) : i[k]
			}
		}
	}
	_map() {
		return {}
	}
	_entities() {
		return []
	}
	static _isClient() {
		return typeof window != 'undefined'
	}
}

module.exports = State