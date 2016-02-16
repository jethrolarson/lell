'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _backend = require('./backend');

var _backend2 = _interopRequireDefault(_backend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
		Object.defineProperty(this, '_original_state', {
			writable: true,
			value: state
		});
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
			if (_.isArray(s)) {
				_this._original_state[k] = [].concat(_this[k]);
			}
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
			if (this[k] != this._original_state[k] || _.isArray(this[k])) {
				if (!_.isArray(this[k])) {
					if (this._updates.indexOf(k) == -1) this._updates.push(k);
				} else {
					var a = this[k],
					    ao = this._original_state[k];
					var same = false;
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = a[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var e = _step2.value;

							if (ao.indexOf(e) == -1) {
								same = false;
								break;
							} else {
								if (ao.indexOf(e) != a.indexOf(e)) {
									same = false;
									break;
								}
							}
							same = true;
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}

					if (a.length < ao.length) {
						same = false;
					}
					if (!same) {
						if (this._updates.indexOf(k) == -1) this._updates.push(k);
					} else {
						if (this._updates.indexOf(k) > -1) {
							this._updates = this._updates.filter(function (i) {
								return i != k;
							});
						}
					}
				}
			} else {
				if (this._updates.indexOf(k) > -1) {
					this._updates = this._updates.filter(function (i) {
						return i != k;
					});
				}
			}
			this._updatedStateIfNecessary();
		}
	}, {
		key: '_updatedStateIfNecessary',
		value: function _updatedStateIfNecessary() {
			if (this._state != 'new') this._state = this._updates.length ? 'updated' : 'original';
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
		key: '_commit',
		value: function _commit() {
			this._state = 'original';
			this._updates = [];
			var j = this.toJSON();
			var m = this._map();
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = Object.keys(j)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var k = _step3.value;

					j[k] = getvalue(m, j[k], k);
					if (_.isArray(j[k])) {
						j[k] = [].concat(_toConsumableArray(j[k]));
					}
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			this._original_state = j;
		}
	}, {
		key: '_fullUpdate',
		value: function _fullUpdate(payload) {
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = Object.keys(payload)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var k = _step4.value;

					console.log('full update ' + k);
					this.silentUpdate(k, payload[k]);
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}

			return this;
		}
	}, {
		key: 'loadMore',
		value: function loadMore(currentCount, sort) {}
	}, {
		key: 'silentUpdate',
		value: function silentUpdate(key, value) {
			this['_z' + key] = value;
			this._addUpdate(key);
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
	}], [{
		key: 'new',
		value: function _new(state) {
			console.log('static name ' + this.name + ' and ' + this._identifier());
			if (_backend2.default.enabled && this.name != 'Le' && state && state[this._identifier()]) {
				var ret = _backend2.default.get(this.name, state[this._identifier()]);
				if (ret) return ret._fullUpdate(state);
				return _backend2.default.set(new this(state), state[this._identifier()]);
			}
			return new this(state);
		}
	}, {
		key: '_identifier',
		value: function _identifier() {
			return '_id';
		}
	}]);

	return Le;
}();

module.exports = Le;