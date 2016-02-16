

class Backend {
	get(entity, id) {
		return this[entity] ? this[entity][id] : null
	}
	set(entity, id) {
		this[entity.constructor.name] = this[entity.constructor.name] || {}
		if (this.onNewEntity) {
			this.onNewEntity(entity)
		}
		return this[entity.constructor.name][id] = entity
	}
}

module.exports = new Backend()