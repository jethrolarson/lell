
import {Le, Ll, State} from '../src/i'
import {expect} from 'chai'

var livingPerson = new Le({name:'z',power_level:9000})
expect(livingPerson._state).to.equal('original')

var power_level = 0;

livingPerson.subscribe((p) => {
  power_level = p.power_level
})

livingPerson.power_level++
expect(livingPerson._state).to.equal('updated')
expect(livingPerson._updates).to.have.deep.property('[0]','power_level')
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

class Person extends Le {
  _map() {
    return {friend:Person, bestFriends:[Person]}
  }
	static _identifier() {
		return 'name'
	}
  _defaults() {
    return {name:'',power_level:9000}
  }
}

var p = new Person()
expect(p._state).to.equal('new')
p.power_level++
expect(p._state).to.equal('new')
expect(p._updates).to.have.deep.property('[0]','power_level')
expect(p.power_level).to.equal(9001)

var pWithFriend = new Person({name:'z',power_level:9000, friend:{name:'s',power_level:9001}, bestFriends:[{name:'y',power_level:9001},{name:'x',power_level:9001}]})
expect(pWithFriend.friend).to.be.an.instanceof(Person)
pWithFriend.power_level++
expect(pWithFriend._state).to.equal('updated')
expect(pWithFriend._updates.length).to.equal(1)
pWithFriend.power_level--
expect(pWithFriend._state).to.equal('original')
expect(pWithFriend._updates).to.be.empty

var friends = pWithFriend.bestFriends
friends.push(new Person({name:'p'}))
pWithFriend.bestFriends = friends
expect(pWithFriend._state).to.equal('updated')
expect(pWithFriend._updates).to.have.deep.property('[0]', 'bestFriends')
friends = pWithFriend.bestFriends
var popped = friends.pop()
pWithFriend.bestFriends = friends
expect(pWithFriend._state).to.equal('original')
expect(pWithFriend._updates).to.be.empty
pWithFriend.power_level++
friends = pWithFriend.bestFriends
friends.push(popped)
pWithFriend._commit()
expect(pWithFriend._state).to.equal('original')
expect(pWithFriend._updates).to.be.empty
friends = pWithFriend.bestFriends
friends.pop()
pWithFriend.bestFriends = friends
expect(pWithFriend._state).to.equal('updated')
expect(pWithFriend._updates).to.have.deep.property('[0]', 'bestFriends')
friends = pWithFriend.bestFriends
friends.push(popped)
pWithFriend.bestFriends = friends
expect(pWithFriend._state).to.equal('original')
expect(pWithFriend._updates).to.be.empty

class PeopleState extends State {
  _map() {
    return {activePerson:Person}
  }
  _entities() {
    return [{entity:Person,defaultSort:'name',sorts:[{name:'powerSort',sort_key:'power_level',useDefault:true}]}]
  }
}

// test state
var state = new PeopleState({initialState:{person:{name:'z',power_level:9000}}})
expect(state.person).to.be.instanceof(Object)
// test state map && window.initialState
GLOBAL.window = {initialState:{activePerson:{name:'z',power_level:9001}}}
var state2 = new PeopleState()
expect(state2.activePerson).to.be.instanceof(Person)

//test backend
var state3 = new PeopleState({collections:true,pluralize:true})
var p1 = Person.new({name:'z',power_level:9000})
var p2 = Person.new({name:'z',power_level:9001})
expect(p1).to.be.equal(p2)
expect(p1.power_level).to.equal(9001)

//test state entities
expect(state3.people.default).to.be.instanceof(Ll)
expect(state3.people.powerSort).to.be.instanceof(Ll)
expect(state3.people.default.people.length).to.equal(1)

//test use defaults
expect(state3.people.powerSort.people.length).to.equal(1)

GLOBAL.window = {initialState:{activePerson:{name:'p',power_level:9001}, people:{default:{people:[{name:'x',power_level:9002},{name:'y',power_level:9003}]}}}}
var state4 = new PeopleState({collections:true, pluralize:true})
console.log(JSON.stringify(state4.people.default.people, null, 2))
expect(state4.people.default.people.length).to.equal(3)
expect(state4.people.default.people[0]).to.be.instanceof(Person)