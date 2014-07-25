'use strict';

var Mongo = require('mongodb');
var Room = require('./room');
var Renter = require('./renter');
var _ = require('lodash');

function Apartment(unit){
  this.unit = unit;
  this.rooms = [];
  this.renters = [];
}

//Create the getter to connect to Mongo
Object.defineProperty(Apartment, 'collection', {
  get: function(){
    return global.mongodb.collection('apartments');
  }
});

Apartment.prototype.area = function(){
  var totalArea = 0;
  for(var i = 0; i < this.rooms.length; i++){
    totalArea += (this.rooms[i].length * this.rooms[i].width);
  }
  return totalArea;
};

Apartment.prototype.cost = function(){
  var cost = 0;
  for (var i = 0; i < this.rooms.length; i++){
    cost += this.rooms[i].cost();
  }
  return cost;
};

Apartment.prototype.revenue = function(){
  return (this.renters.length) ? this.cost () : 0;
};

Apartment.prototype.bedrooms = function(){
  var beds = 0;
  for(var i = 0; i < this.rooms.length; i++){
    if(this.rooms[i].isBedroom){
      beds += 1;
    }
  }
  return beds;
};

Apartment.prototype.isAvailable = function(){
  return this.bedrooms() > this.renters.length;
};

Apartment.prototype.purgeEvicted = function(){
  var notEvicted = [];
  for(var i = 0; i < this.renters.length; i++){
    if(!this.renters[i]._isEvicted){
      notEvicted.push(this.renters[i]);
    }
  }
  this.renters = notEvicted;
};

Apartment.prototype.collectRent = function(){
  if(!this.renters.length){return 0;}

  var rent = this.cost() / this.renters.length;
  var collected = 0;

  for(var i = 0; i < this.renters.length; i++){
    collected += this.renters[i].payRent(rent);
  }
  return collected;
};

Apartment.prototype.save = function(cb){
  //Hey, mongo!  Save this object, and callback
  Apartment.collection.save(this, cb);
};

//a query is an object.  The object can be empty (finds ALL); if includes object in 
Apartment.find = function(query, cb){
  Apartment.collection.find(query).toArray(function(err, apts){
    for(var i = 0; i < apts.length; i++){apts[i] = reProto(apts[i]);}
    cb(err, apts);
  });
};

Apartment.findById = function(id, cb){
  id = (typeof id === 'string') ? Mongo.ObjectID(id) : id;
  Apartment.collection.findOne(q{_id:id}, function(err, apt){
    cb(err, reProto(apt));
  });
};

Apartment.deleteById = function(id, cb){
  id = (typeof id === 'string') ? Mongo.ObjectID(id) : id;
  Apartment.collection.findAndRemove({_id:id}, cb);
};

Apartment.area = function(cb){
  Apartment.find({}, function(apts){
    var sum = 0;
    for(var i = 0; i < apts.length; i++){
      sum += apts[i].area();
    }
    cb(sum);
  });
};

Apartment.cost = function(cb){
  Apartment.find({}, function(apts){
    var sum = 0;
    for(var i = 0; i <apts.length; i++){
      sum += apts[i].cost();
    }
    cb(sum);
  });
};

// HELPER FUNCTIONS //
// use helper when you want to reconnect instance methods

function reProto(apt){
  var room, renter;
  for(var i = 0; i < apt.rooms.length; i++){
    room = _.create(Room.prototype, apt.rooms[i]);
    apt.rooms[i] = room;
  }
  for(var j = 0; j < apt.renters.length; j++){
    renter = _.create(Renter.prototype, apt.renters[j]);
    apt.renters[j] = renter;
  }
  apt = _.create(Apartment.prototype, apt);

  return apt;
}

module.exports = Apartment;
