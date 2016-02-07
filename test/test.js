
import {Le, Ll} from '../dist/i'
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