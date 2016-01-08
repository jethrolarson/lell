

var Le = require('./Le')
var _ = require('lodash')
var Rx = require('rx')

class Ll extends Le {
  constructor(state) {
    var array_key, sort_key, sort_func, array
    _.each(state, (i, k) => {
      if (Array.isArray(i)) {
        array_key = k
        array = i
      } else if (k == 'sort') {
        if (_.isString(i))
          sort_key = i
        else if (_.isFunction(i))
          sort_func = i
      }
    })
    super({[array_key]:array})
    this._zArrayKey = array_key
    this._zSortKey = sort_key
    this._zSortFunc = sort_func
    for (var l of array) {
      if (l.subscribe) {
        l.subcribe(this._itemChanged.bind(this))
      }
    }
    this.itemChangeSubject = new Rx.Subject()
    this.subject = new Rx.Subject()
  }
  addItems(is) {
    if (!_.isArray(is))
      is = [is]
    var arr = this[this._zArrayKey].concat(is)
    if (this._sorter) {
      arr = _.sortBy(is, this._sorter)
    }
    for (var i of is) {
      if (i.subscribe)
        i.subscribe(this._itemChanged.bind(this))
    }
    this[this._zArrayKey] = arr
  }
  setItems(is) {
    if (this._sorter) {
      is = _.sortBy(is, this._sorter)
    }
    this[this._zArrayKey] = is
    for (var i of is) {
      if (i.subscribe)
        i.subscribe(this._itemChanged.bind(this))
    }
  }
  removeItems(is) {
    if (!_.isArray(is))
      is = [is]
    var arr = _.without(this[this._zArrayKey], is)
    if (arr.length < this[this._zArrayKey].length) {
      this[this._zArrayKey] = arr
    }
  }
  subscribe(onNext) {
    this.subject.pluck(this._zArrayKey).subscribe(onNext)
  }
  subscribeEach(onNext, onCompleted, onError) {
    return this.itemChangeSubject.subscribe(onNext, onCompleted, onError)
  }
  _itemChanged(i) {
    this.itemChangeSubject.onNext(i.obj)
    if (this._zSortKey) {
      if (this._zSortKey == i.key) {
        var arr = this[this._zArrayKey]
        var initialI = _.indexOf(arr, i.obj)
        arr = _.sortBy(arr, this._zSortKey)
        var finalI = _.indexOf(arr, i.obj)
        if (finalI != initialI) {
          this[this._zArrayKey] = arr
        }
      }
    } else if (this._zSortFunc) {
      var arr = this[this._zArrayKey]
      var initialI = _.indexOf(arr, i.obj)
      arr = _.sortBy(arr, this._zSortFunc)
      var finalI = _.indexOf(arr, i.obj)
      if (finalI != initialI) {
        this[this._zArrayKey] = arr
      }
    }
  }
  _sorter() {
    return this._zSortKey || this._zSortFunc
  }
}

module.exports = ObservableCollection
