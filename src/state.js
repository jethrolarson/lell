import Ll from './ll'
import Backend from './backend'

class State {
	constructor(data) {
		if (data instanceof Object) {
			Object.assign(this, data)
		} else if (State._isClient() && window.initialState) {
			this.__entityNames = []
			if (data) {
				Backend.enabled = true
				for (var e of this._entities()) {
					var entity = e.entity
					this.__entityNames.push(entity.name)
					if (e.sorts) {
						var es = this[entity.name] = {}
						for (var s of (e.sorts || [])) {
							es[s.name] = new Ll({[s.name]:[], sort_key:s.key})
						}
						var def = {default:[]}
						if (e.defaultSort) {
							def.defaultSort = e.defaultSort
						}
						es.default = new Ll(def)
					}
				}
				Backend.onNewEntity = (e) => {
					if (this.__entityNames.indexOf(e.constructor.name) > -1) {
						this[e.constructor.name].default.addItems(e)
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
				console.log(`boot ${k}`)
				var e = this._entities().find((e) => e.entity.constructor.name == k)
				if (e) {
					console.log(e)
					console.log(`resolving entity`)
					var ej = i[k]
					for (var s of (e.sorts || [])) {
						if (ej[s.name]) {
							var arr = ej[s.name][s.name]
							if (arr) {
								arr = arr.map((x) => e.entity.new(x))
								this[k][s.name].addItems(arr)
							}
						}
					}
					if (ej.default) {
						var arr = ej.default.default
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