'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Rx = require('rx');
var _ = require('lodash');

var Le = function () {
  function Le(state) {
    var _this = this;

    _classCallCheck(this, Le);

    var self = this;
    _.each(state, function (s, k) {
      var _Object$definePropert;

      if (k == '_actions') return;
      Object.defineProperties(_this, (_Object$definePropert = {}, _defineProperty(_Object$definePropert, '_z' + k, {
        enumerable: false,
        writable: true,
        value: s
      }), _defineProperty(_Object$definePropert, k, {
        enumerable: true,
        get: function get() {
          return self['_z' + k];
        },
        set: function set(v) {
          self['_z' + k] = v;
          self['subject'].onNext(self);
          self.superSubject.onNext({ obj: self, key: k });
        }
      }), _Object$definePropert));
    });
    this.subject = new Rx.Subject();
    this.superSubject = new Rx.Subject();
    if (this._actions) {
      var self = this;
      _.each(this._actions, function (a, k) {
        if (!_.isFunction(a)) return;
        _this[k] = function () {
          if (a.apply(self, arguments)) self.subject.onNext(state);
        };
      });
    }
  }

  _createClass(Le, [{
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