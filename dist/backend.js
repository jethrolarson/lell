"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Backend = function () {
	function Backend() {
		_classCallCheck(this, Backend);
	}

	_createClass(Backend, [{
		key: "get",
		value: function get(entity, id) {
			return this[entity] ? this[entity][id] : null;
		}
	}, {
		key: "set",
		value: function set(entity, id) {
			this[entity.constructor.name] = this[entity.constructor.name] || {};
			if (this.onNewEntity) {
				this.onNewEntity(entity);
			}
			return this[entity.constructor.name][id] = entity;
		}
	}]);

	return Backend;
}();

module.exports = new Backend();