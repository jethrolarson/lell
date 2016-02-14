
class State {
  constructor(data) {
    if (data) {
      Object.assign(this, data)
    } else if (State._isClient() && window.initialData) {
      this._boot()
    }
  }
  _new(d) {
    return new State(d)
  }
  _boot() {
    if (window.initialData) {
      var i = window.initialData
      var map = this._map()
      for (var k of Object.keys(i)) {
        this[k] = map[k] ? new map[k](i[k]) : i[k]
      }
    }
  }
  _map() {
    return {}
  }
  static _isClient() {
    return typeof window != 'undefined'
  }
}

export default State