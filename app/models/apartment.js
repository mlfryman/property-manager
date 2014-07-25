'use strict';

var cApartment = global.mongodb.collection('apartments');
var _ = require('lodash');

var Room = require('./room');
var Renter = require('./renter');

function Apartment(unit){
  this.unit = unit;
  this.rooms = [];
  this.renters = [];
}

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
  if(!this.renters.length){return;}

  var rent = this.cost() / this.renters.length;
  for(var i = 0; i < this.renters.length; i++){
    this.renters[i].payRent(rent);
  }
};

Apartment.prototype.save = function(cb){
  cApartment.save(this, function(err, obj){
    cb();
  });
};

Apartment.find = function(query, cb){
  cApartment.find(query).toArray(function(err, apts){
    for(var i = 0; i < apts.length; i++){
      apts[i] = reProto(apts[i]);
    }
    cb(apts);
  });
};

Apartment.findById = function(id, cb){
  var query = {_id:id};
  cApartment.findOne(query, function(err, apt){
    cb(reProto(apt));
  });
};

Apartment.deleteById = function(id, cb){
  var query = {_id:id};
  cApartment.remove(query, function(){
    cb();
  });
};

// HELPER FUNCTIONS //

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
