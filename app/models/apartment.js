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
  var aptArea = 0;

  for(var i = 0; i < this.rooms.length; i++){
    aptArea += (this.rooms[i].length * this.rooms[i].width);
  }

  return aptArea;
};

Apartment.prototype.cost = function(){
  var aptCost = 0;
  for (var i = 0; i < this.rooms.length; i++){
    aptCost += this.rooms[i].cost();
  }
  return aptCost;
};

Apartment.prototype.revenue = function(){
  return (this.renters.length) ? this.cost () : 0;
};

Apartment.prototype.bedrooms = function(){
  var beds = 0;

  for(var i = 0; i < this.rooms.length; i++){
    beds += this.rooms[i].isBedroom() ? 1 : 0;
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
  if(!this.renters.length){return;}

  var rent = this.cost() / this.renters.length;
  for(var i = 0; i < this.renters.length; i++){
    this.renters[i].payRent(rent);
  }
};

Apartment.prototype.collectRent = function(){
  if(!this.renters.length){return;}

  var rent = this.cost() / this.renters.length;
  var collected = 0;

  for(var i = 0; i < this.renters.length; i++){
    collected += this.renters[i].payRent(rent);
  }

  return collected;
};

Apartment.prototype.save = function(cb){
  Apartment.collection.save(this, cb);
};

//a query is an object.  The object can be empty (finds ALL); if includes object in 
Apartment.find = function(query, cb){
  Apartment.collection.find(query).toArray(function(err, apts){
    for(var i = 0; i < apts.length; i++){
      apts[i] = repairPrototype(apts[i]);
    }
    cb(err, apts);
  });
};

Apartment.findById = function(id, cb){
  id = (typeof id === 'string') ? Mongo.ObjectID(id) : id;
  Apartment.collection.findOne({_id:id}, function(err, apt){
    cb(err, repairPrototype(apt));
  });
};

Apartment.deleteById = function(id, cb){
  id = (typeof id === 'string') ? Mongo.ObjectID(id) : id;
  Apartment.collection.findAndRemove({_id:id}, cb);
};

Apartment.area = function(cb){
  Apartment.find({}, function(err, apts){
    var sum = 0;

    for(var i = 0; i < apts.length; i++){
      sum += apts[i].area();
    }

    cb(sum);
  });
};

Apartment.cost = function(cb){
  Apartment.find({}, function(err, apts){
    var sum = 0;

    for(var i = 0; i <apts.length; i++){
      sum += apts[i].cost();
    }

    cb(sum);
  });
};

Apartment.revenue = function(cb){
  Apartment.find({}, function(err, apts){
    var sum = 0;

    for(var i = 0; i < apts.length; i++){
      sum += apts[i].revenue();
    }

    cb(sum);
  });
};

Apartment.tenents = function(cb){
  Apartment.find({}, function(err, apts){
    var sum = 0;

    for(var i = 0; i < apts.length; i++){
      sum += apts[i].renters.length;
    }

    cb(sum);
  });
};

module.exports = Apartment;

// HELPER FUNCTIONS //
// use helper when you want to reconnect instance methods

function repairPrototype(apt){
  apt = _.create(Apartment.prototype, apt);

  for(var i = 0; i < apt.rooms.length; i++){
    apt.rooms[i] = _.create(Room.prototype, apt.rooms[i]);
  }

  for(var j = 0; j < apt.renters.length; j++){
    apt.renters[j] = _.create(Renter.prototype, apt.renters[j]);
  }

  return apt;
}
