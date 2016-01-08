
var Rx = require('rx')
var _ = require('lodash')

class Le {
  constructor(state) {
    var self = this
    _.each(state, (s, k) => {
      Object.defineProperties(this, {
        ['_z' + k]:{
          enumerable:false,
          writable:true,
          value:s
        },
        [k]:{
          enumerable:true,
          get: () => {
            return self['_z' + k]
          },
          set: (v) => {
            self['_z' + k] = v
            self['subject'].onNext(self)
            self.superSubject.onNext({key:k,obj:self})
          }
        }
      })
    })
    this.subject = new Rx.Subject()
    if (this.Actions) {
      var self = this
      _.each(this.Actions, (a, k) => {
        this[k] = function() {
          if (a.apply(self, arguments))
            self.subject.onNext(state)
        }
      })
    }
  }
  subscribe(onNext, onCompleted, onError) {
    return this.subject.subscribe(onNext, onCompleted, onError)
  }
  fill(state) {
    Object.assign(this, state)
  }
  toJSON() {
    return _.omit(this,['toJSON','fill','superSubscribe','subscribe','subject','superSubject','Actions'])
  }
}

module.exports = Le
