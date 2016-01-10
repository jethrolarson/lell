

import {Le, Ll} from '../dist/i'
import {expect} from 'chai'

var livingPerson = new Le({name:'z',power_level:9000})

var power_level = 0;

livingPerson.subscribe((p) => {
  power_level = p.power_level
})

livingPerson.power_level++

expect(power_level).to.equal(9001)

var livingPeople = new Ll({people:[livingPerson, new Le({name:'y',power_level:8999})]})

var lastChangedPerson = null;
var currentPeople = livingPeople.people;

livingPeople.subscribeEach((p) => lastChangedPerson = p)
livingPeople.subscribe((people) => currentPeople = people)

var x = new Le({name:'x',power_level:9000})
livingPeople.addItems(x)
expect(currentPeople).to.be.a('array')
expect(currentPeople.length).to.equal(3)

x.power_level += 2
expect(currentPeople.length).to.equal(3)
expect(lastChangedPerson).to.be.a('object')
expect(lastChangedPerson.name).to.equal('x')
