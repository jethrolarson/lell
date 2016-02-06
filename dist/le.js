'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Rx = require('rx');
var _ = require('lodash');

var getvalue = function getvalue() {
	var map = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var v = arguments[1];
	var k = arguments[2];

	if (!map[k]) return v;
	var t = map[k];
	if (_.isArray(t)) {
		t = t[0];
		if (v.length) {
			if (v[0] instanceof t) {
				return v;
			} else {
				var ret = [];
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = v[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var e = _step.value;

						ret.push(new t(e));
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}

				return ret;
			}
		} else {
			return v;
		}
	}
	if (v instanceof t) {
		return v;
	} else {
		return new t(v);
	}
};

var Le = function () {
	function Le(state) {
		var _this = this;

		_classCallCheck(this, Le);

		var self = this;
		var map = this._map();
		this._state = state ? 'original' : 'new';
		this._updates = [];
		state = _.defaults(state || {}, this._defaults());
		_.each(state, function (s, k) {
			var _Object$definePropert;

			if (k == '_actions') return;
			Object.defineProperties(_this, (_Object$definePropert = {}, _defineProperty(_Object$definePropert, '_z' + k, {
				enumerable: false,
				writable: true,
				value: getvalue(map, s, k)
			}), _defineProperty(_Object$definePropert, k, {
				enumerable: true,
				get: function get() {
					return self['_z' + k];
				},
				set: function set(v) {
					self['_z' + k] = v;
					self['subject'].onNext(self);
					self._addUpdate(k);
					self.superSubject.onNext({ obj: self, key: k });
				}
			}), _Object$definePropert));
		});
		this.subject = new Rx.Subject();
		this.superSubject = new Rx.Subject();
		if (this._actions) {
			_.each(this._actions, function (a, k) {
				if (!_.isFunction(a)) return;
				_this[k] = function () {
					if (a.apply(self, arguments)) self.subject.onNext(state);
				};
			});
		}
	}

	_createClass(Le, [{
		key: '_addUpdate',
		value: function _addUpdate(k) {
			this._updatedStateIfNecessary();
			if (this._updates.indexOf(k) == -1) this._updates.push(k);
		}
	}, {
		key: '_updatedStateIfNecessary',
		value: function _updatedStateIfNecessary() {
			if (this._state != 'new') this._state = 'updated';
		}
	}, {
		key: '_map',
		value: function _map() {
			return {};
		}
	}, {
		key: '_defaults',
		value: function _defaults() {
			return {};
		}
	}, {
		key: 'silentUpdate',
		value: function silentUpdate(key, value) {
			this['_z' + key] = value;
		}
	}, {
		key: 'subscribe',
		value: function subscribe(onNext, onCompleted, onError) {
			return this.subject.subscribe(onNext, onCompleted, onError);
		}
	}, {
		key: 'fill',
		value: function fill(state) {
			Object.assign(this, state);
		}
	}, {
		key: 'toJSON',
		value: function toJSON() {
			return _.omit(this, ['toJSON', 'fill', 'superSubscribe', 'subscribe', 'subject', 'superSubject', 'Actions']);
		}
	}]);

	return Le;
}();

module.exports = Le;