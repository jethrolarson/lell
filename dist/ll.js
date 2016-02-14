'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Le = require('./le');
var _ = require('lodash');
var Rx = require('rx');

var doSub = function doSub(is) {
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = is[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var i = _step.value;

			if (i.superSubject) i.superSubject.subscribe(this._itemChanged.bind(this));
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
};

var Ll = function (_Le) {
	_inherits(Ll, _Le);

	function Ll(state) {
		_classCallCheck(this, Ll);

		var array_key, sort_key, sort_func, array;
		_.each(state, function (i, k) {
			if (Array.isArray(i)) {
				array_key = k;
				array = i;
			} else if (k == 'sort') {
				if (_.isString(i)) sort_key = i;else if (_.isFunction(i)) sort_func = i;
			}
		});

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Ll).call(this, _defineProperty({}, array_key, array)));

		var e = _this._entity();
		if (e && array.length && !(array[0] instanceof e)) {
			var a = [];
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = array[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var la = _step2.value;

					a.push(new e(la));
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

			array = a;
			_this.silentUpdate(array_key, array);
		}
		_this._zArrayKey = array_key;
		_this._zSortKey = sort_key;
		_this._zSortFunc = sort_func;

		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {
			for (var _iterator3 = array[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var l = _step3.value;

				if (_this._map()) if (l.superSubject) l.superSubject.subscribe(_this._itemChanged.bind(_this));
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

		_this.itemChangeSubject = new Rx.Subject();
		_this.subject = new Rx.Subject();
		return _this;
	}

	_createClass(Ll, [{
		key: 'addItems',
		value: function addItems(is) {
			if (!_.isArray(is)) is = [is];
			var arr = this[this._zArrayKey].concat(is);
			if (this._sorter) {
				arr = _.sortBy(is, this._sorter);
			}
			doSub.call(this, is);
			this[this._zArrayKey] = arr;
		}
	}, {
		key: 'setItems',
		value: function setItems(is) {
			if (this._sorter) {
				is = _.sortBy(is, this._sorter);
			}
			this[this._zArrayKey] = is;
			doSub.call(this, is);
		}
	}, {
		key: 'removeItems',
		value: function removeItems(is) {
			if (!_.isArray(is)) is = [is];
			var arr = _.without(this[this._zArrayKey], is);
			if (arr.length < this[this._zArrayKey].length) {
				this[this._zArrayKey] = arr;
			}
		}
	}, {
		key: 'subscribe',
		value: function subscribe(onNext) {
			this.subject.pluck(this._zArrayKey).subscribe(onNext);
		}
	}, {
		key: 'subscribeEach',
		value: function subscribeEach(onNext, onCompleted, onError) {
			return this.itemChangeSubject.subscribe(onNext, onCompleted, onError);
		}
	}, {
		key: '_itemChanged',
		value: function _itemChanged(i) {
			this.itemChangeSubject.onNext(i.obj);
			var arr = this[this._zArrayKey];
			var initialI = _.indexOf(arr, i.obj);
			var finalI;
			if (this._zSortKey) {
				if (this._zSortKey == i.key) {

					arr = _.sortBy(arr, this._zSortKey);
					finalI = _.indexOf(arr, i.obj);
					if (finalI != initialI) {
						this[this._zArrayKey] = arr;
					}
				}
			} else if (this._zSortFunc) {
				arr = _.sortBy(arr, this._zSortFunc);
				finalI = _.indexOf(arr, i.obj);
				if (finalI != initialI) {
					this[this._zArrayKey] = arr;
				}
			}
		}
	}, {
		key: '_sorter',
		get: function get() {
			return this._zSortKey || this._zSortFunc;
		}
	}]);

	return Ll;
}(Le);

module.exports = Ll;