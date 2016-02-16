'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ll = require('./ll');

var _ll2 = _interopRequireDefault(_ll);

var _backend = require('./backend');

var _backend2 = _interopRequireDefault(_backend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var State = function () {
	function State(data) {
		var _this = this;

		_classCallCheck(this, State);

		if (data instanceof Object) {
			Object.assign(this, data);
		} else if (State._isClient() && window.initialState) {
			this.__entityNames = [];
			if (data) {
				_backend2.default.enabled = true;
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = this._entities()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var e = _step.value;

						var entity = e.entity;
						this.__entityNames.push(entity.name);
						if (e.sorts) {
							var es = this[entity.name] = {};
							var _iteratorNormalCompletion2 = true;
							var _didIteratorError2 = false;
							var _iteratorError2 = undefined;

							try {
								for (var _iterator2 = (e.sorts || [])[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
									var _ref;

									var s = _step2.value;

									es[s.name] = new _ll2.default((_ref = {}, _defineProperty(_ref, s.name, []), _defineProperty(_ref, 'sort_key', s.key), _ref));
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

							var def = { default: [] };
							if (e.defaultSort) {
								def.defaultSort = e.defaultSort;
							}
							es.default = new _ll2.default(def);
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

				_backend2.default.onNewEntity = function (e) {
					if (_this.__entityNames.indexOf(e.constructor.name) > -1) {
						_this[e.constructor.name].default.addItems(e);
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
			if (window.initialState) {
				var i = window.initialState;
				var map = this._map();
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = Object.keys(i)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var k = _step3.value;

						console.log('boot ' + k);
						var e = this._entities().find(function (e) {
							return e.entity.constructor.name == k;
						});
						if (e) {
							console.log(e);
							console.log('resolving entity');
							var ej = i[k];
							var _iteratorNormalCompletion4 = true;
							var _didIteratorError4 = false;
							var _iteratorError4 = undefined;

							try {
								for (var _iterator4 = (e.sorts || [])[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
									var s = _step4.value;

									if (ej[s.name]) {
										var arr = ej[s.name][s.name];
										if (arr) {
											arr = arr.map(function (x) {
												return e.entity.new(x);
											});
											this[k][s.name].addItems(arr);
										}
									}
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

							if (ej.default) {
								var arr = ej.default.default;
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