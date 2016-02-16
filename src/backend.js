

class Backend {
	get(entity, id) {
		return this[entity] ? this[entity][id] : null
	}
	set(entity, id) {
		console.log(`set ${entity.constructor.name} with id ${id}`)
		this[entity.constructor.name] = this[entity.constructor.name] || {}
		if (this.onNewEntity) {
			this.onNewEntity(entity)
		}
		return this[entity.constructor.name][id] = entity
	}
}

export default new Backend()