'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ll = require('./ll');
var Backend = require('./backend');
var pluralize = require('pluralize');

var entityKey = function entityKey(entity, isclass, doPluralize) {
	var name = (isclass ? entity.name : entity.constructor.name).toLowerCase();
	return doPluralize ? pluralize(name) : name;
};

var State = function () {
	function State() {
		var _this = this;

		var init = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, State);

		if (init.initialState) {
			Object.assign(this, init.initialState);
		} else if (State._isClient() && window.initialState) {
			this.__entityNames = [];
			if (init.collections) {
				Backend.enabled = true;
				this.__pluralize = init.pluralize;
				this.__newEntityListeners = {};
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = this._entities()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var e = _step.value;

						var entity = e.entity;
						var eKey = entityKey(entity, true, init.pluralize);
						this.__entityNames.push(eKey);
						var es = this[eKey] = {};
						var def = { default: [] };
						if (e.defaultSort) {
							def.defaultSort = e.defaultSort;
						}
						es.default = new Ll(def);
						this.__newEntityListeners[eKey] = [es.default];
						var _iteratorNormalCompletion3 = true;
						var _didIteratorError3 = false;
						var _iteratorError3 = undefined;

						try {
							for (var _iterator3 = (e.sorts || [])[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
								var _ref;

								var s = _step3.value;

								this.__newEntityListeners[eKey].push(es[s.name] = new Ll((_ref = {}, _defineProperty(_ref, s.name, []), _defineProperty(_ref, 'sort_key', s.key), _ref)));
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

				Backend.onNewEntity = function (e) {
					var n = entityKey(e, false, _this.__pluralize);
					if (_this.__newEntityListeners[n]) {
						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;

						try {
							for (var _iterator2 = _this.__newEntityListeners[n][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								var ll = _step2.value;

								ll.addItems(e);
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
					}
				};
			}
			this._boot();
		}
	}

	_createClass(State, [{
		key: '_new',
		value: function _new(d) {
			return new State(d);
		}
	}, {
		key: '_boot',
		value: function _boot() {
			var _this2 = this;

			if (window.initialState) {
				var i = window.initialState;
				var map = this._map();
				var _iteratorNormalCompletion4 = true;
				var _didIteratorError4 = false;
				var _iteratorError4 = undefined;

				try {
					for (var _iterator4 = Object.keys(i)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						var k = _step4.value;

						var e = this._entities().find(function (e) {
							return entityKey(e.entity, false, _this2.__pluralize) == k;
						});
						if (e) {
							var ej = i[k];
							var arr;
							var _iteratorNormalCompletion5 = true;
							var _didIteratorError5 = false;
							var _iteratorError5 = undefined;

							try {
								for (var _iterator5 = (e.sorts || [])[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
									var s = _step5.value;

									if (ej[s.name]) {
										arr = ej[s.name][s.name];
										if (arr) {
											arr = arr.map(function (x) {
												return e.entity.new(x);
											});
											this[k][s.name].addItems(arr);
										}
									}
								}
							} catch (err) {
								_didIteratorError5 = true;
								_iteratorError5 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion5 && _iterator5.return) {
										_iterator5.return();
									}
								} finally {
									if (_didIteratorError5) {
										throw _iteratorError5;
									}
								}
							}

							if (ej.default) {
								arr = ej.default.default;
								if (arr) {
									arr = arr.map(function (x) {
										return e.entity.new(x);
									});
									this[k].default.addItems(arr);
								}
							}
							continue;
						}
						this[k] = map[k] ? map[k].new(i[k]) : i[k];
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
			}
		}
	}, {
		key: '_map',
		value: function _map() {
			return {};
		}
	}, {
		key: '_entities',
		value: function _entities() {
			return [];
		}
	}], [{
		key: '_isClient',
		value: function _isClient() {
			return typeof window != 'undefined';
		}
	}]);

	return State;
}();

module.exports = State;