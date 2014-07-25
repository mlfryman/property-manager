'use strict';

//var Room = require('./room');
//var Renter = require('./renter');

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
  return this.bedrooms > this.renters.length;
};


module.exports = Apartment;
