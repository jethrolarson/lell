# lell - [![Build Status](http://img.shields.io/travis/arkverse/lell.svg)](https://travis-ci.org/arkverse/lell) [![Code Climate](http://img.shields.io/codeclimate/github/arkverse/lell.svg)](https://codeclimate.com/github/arkverse/lell) [![Latest Stable Version](https://img.shields.io/npm/v/lell.svg)](https://www.npmjs.com/package/lell) [![License](http://img.shields.io/:license-mit-blue.svg)](http://arkverse.mit-license.org) [![Badges](http://img.shields.io/:badges-4/4-ff6799.svg)](https://github.com/badges/badgerbadgerbadger) 
Living entities (Le) and lists (Ll), built off rx. Enjoy a reactive model with (almost) no boilerplate

Very small payload and learning curve, enormous power.

Currently using this as our app store with React, beats flux anyday

## Quick Use

Pop a model, subclassing Le is _better_ but unnecessary

```javascript
// model.js
import {Le, Ll} from 'lell'


var livingPerson = new Le({name:'z', power_level:9000})
// or
var livingPerson = new Person({name:'z',power_level:9000}) // if person extends Le


module.exports = {
  person:livingPerson
}
```

Read and subscribe!

```javascript
// components/person.js
var model = require('./model.js')

class Person extends React.Component {
  constructor(props) {
    super(props)
    this.state = {person:model.person}
  }
  componentDidMount() {
    model.person.subscribe((person) => this.setState({person:person}))
  }
  tapIncreasePowerLevel() {
    model.person.power_level++
    // auto updates view
  }
  render() {
    var person = model.person
    return <div>
    <span>{person.name}</span> - {person.power_level}
    <button onClick={this.tapIncreasePowerLevel} />
    </div>
  }
}

```

## Installation

Via npm:
```
npm install --save le
```

Then require/import:

```javascript
import {Le, Ll} from 'lell'
//or
var Le = require('lell').Le
var Ll = require('lell').Ll
```

## Usage

### Objects/Classes

##### Quick Living Entity
Just instantiate an Le with a payload

The only keys that cause events are the ones passed into the constructor
```javascript
import {Le} from 'lell'

var aPerson = {name:'z',power_level:9000}

var aLivingPerson = new Le(aPerson)

aLivingPerson.subscribe((p) => console.log(p.power_level))

aLivingPerson.power_level++
// console output: 9001

```

##### An observable class
Extending an Le is only necessary if you can't init with all your properties or you just want convenience methods (like ajax requests)
The living properties are only the ones we initialize with, so we have have to make sure our initial state holds all keys we wish to cause updates
```javascript
import {Le} from 'lell'
import _ from 'lodash'

var defaultState = {
  name:'',
  power_level:9000
}

class Person extends Le {
  constructor(state) {
    state = state ? _.defaults(state, defaultState) : Object.assign({}, defaultState)
    super(state)
  }
  doSomeAsyncWork() {
    $.get('http://google.com', (data) => {
      this.power_level++
    })
  }
}

var aLivingPerson = new Person()

aLivingPerson.subscribe((p) => console.log(p.name))

aLivingPerson.name = 'z'
// z

aLivingPerson.doSomeAsyncWork()
// z
```

##### Rx.Observable available

The Rx observable subject is made available to you:

```javascript
aLivingPerson.subject.pluck('power_level').subscribe((power_level) => console.log(power_level))

aLivingPerson.power_level = 9000
// 9000
```

##### Silent Updates

Update your instance without kicking off an update

```javascript
aLivingPerson.subscribe((p) => console.log(p))

aLivingPerson.silentUpdate('power_level', 8999)
// no events
```

### Lists

You can easily create living lists (Ll) that send notifications when the underlying array changes

You need to make changes through the array through the Lls methods `addItems`, `removeItems`, `setItems`

##### Quick list

We can make a simple living list

```javascript
import {Ll} from 'lell'
//or
var Ll = require('lell').Ll

var abe = ...
var bush = ...
var people = [abe, bush]

var livingPeople = new Ll({people}) // this means {people: people}

livingPeople.subscribe((people) => console.log(people.length))

var kennedy = ...

livingPeople.addItems(kennedy)
// 3
livingPeople.removeItems([abe, bush])
// 1
livingPeople.setItems([abe, kennedy])
// 2
```

##### Sorted List

This is where Lls start getting good, you can supply a sort key/func to your Ll and your list will be sorted (borrows lodash `_.sortBy`)

```javascript

var people = [{name:'z', power_level:9001}, {name:'y', power_level:9000}]
var livingPeople = new Ll({people, sort:'power_level'})

livingPeople.subscribe((people) => console.log(people[0].name))

livingPeople.addItems({name:'x', power_level:8999})
// x
```

##### Meant for Le's

Okay, that wasn't _that_ cool, but Ll's are best when holding Le's

```javascript
var livingPersonZ = new Person({name:'z',power_level:8999})
var livingPersonY = new Person({name:'y',power_level:9000})

var livingPeople = new Ll({
  people:[livingPersonZ, livingPersonY],
  sort:'power_level'
  })

console.log(livingPeople.people[1].name)
// y

livingPeople.subscribe((people) => console.log(people[1].name))

livingPersonZ.power_level = 9001
// z

```
Cool, huh? We have a reactive list

##### Subscribe each

You can listen to all of the items in a list, so when *any* Le in an Ll changes, you can be notified with that Le

```javascript

livingPeople.subscribeEach((aPerson) => console.log(aPerson.power_level))

livingPersonZ.power_level++
// 9002

```
##### Rx.Observable availability

The observables are available to you, one for the list, `subject`, and one for the subscribeEach, `itemChangeSubject`

```javascript
// note, you need to pluck people, because the root subject signals with the Le {people, sort}
livingPeople.subject.pluck('people').map(doSomething).subscribe(listen)

livingPeople.subject.pluck('power_level').average().subscribe(useAverage)
```

##### Subclassing is favorable

It really makes things convenient

```javascript
import {Ll} from 'lell'
import _ from 'lodash'

var defaultState = {
  people:[personA, personB],
  sort:'power_level'
}

class People extends Ll {
  constructor(state) {
    state = state ? _.defaults(state, defaultState) : Object.assign({}, defaultState)
    super(state)
  }
}

var initialState = {people:[personA, personC, personX]}
var livingPeople = new People(people)

livingPeople.subscribe()
```


## Future

- Auto Hydrate/Serialize entire Le/Ll store between server/client
- Le actions

## License

### The MIT License (MIT)

Copyright (c) 2016 ark

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
